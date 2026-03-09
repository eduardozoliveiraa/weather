import React, { useState } from 'react';
import { ForecastData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronDown, Droplets, Wind } from 'lucide-react';
import './Forecast.css';

interface ForecastProps {
    data: ForecastData | null;
    loading: boolean;
}

export const Forecast: React.FC<ForecastProps> = ({ data, loading }) => {
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="forecast-container glass-panel animate-pulse-soft">
                <div className="skeleton-line title" style={{ width: '180px', marginBottom: '16px' }} />
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="forecast-skeleton-row">
                        <div className="skeleton-circle" style={{ width: '40px', height: '40px' }} />
                        <div className="skeleton-line" style={{ height: '16px', flex: 1 }} />
                        <div className="skeleton-line" style={{ height: '16px', width: '80px' }} />
                    </div>
                ))}
            </div>
        );
    }

    if (!data) return null;

    // Group all 3-hour slots per day and compute daily aggregates
    type DayData = {
        dateStr: string;
        dt: number;
        dt_txt: string;
        weather: ForecastData['list'][0]['weather'];
        temp_max: number;
        temp_min: number;
        pop: number;
        humidity: number;
        windSpeed: number;
        slots: ForecastData['list'];
    };

    const dayMap = new Map<string, DayData>();

    for (const item of data.list) {
        const dateStr = item.dt_txt.split(' ')[0];
        if (!dayMap.has(dateStr)) {
            const rep = data.list.find(f => f.dt_txt.startsWith(dateStr) &&
                (f.dt_txt.includes('12:00:00') || f.dt_txt.includes('15:00:00'))) || item;
            dayMap.set(dateStr, {
                dateStr,
                dt: rep.dt,
                dt_txt: rep.dt_txt,
                weather: rep.weather,
                temp_max: -Infinity,
                temp_min: Infinity,
                pop: 0,
                humidity: 0,
                windSpeed: 0,
                slots: [],
            });
        }
        const day = dayMap.get(dateStr)!;
        day.temp_max = Math.max(day.temp_max, item.main.temp_max, item.main.temp);
        day.temp_min = Math.min(day.temp_min, item.main.temp_min, item.main.temp);
        day.pop = Math.max(day.pop, item.pop ?? 0);
        day.humidity += item.main.humidity;
        day.windSpeed += item.wind.speed;
        day.slots.push(item);
    }

    // Compute averages
    for (const day of dayMap.values()) {
        day.humidity = Math.round(day.humidity / day.slots.length);
        day.windSpeed = day.windSpeed / day.slots.length;
    }

    const days = Array.from(dayMap.values()).slice(0, 5);

    // Global range for bar widths
    const globalMax = Math.max(...days.map(d => d.temp_max));
    const globalMin = Math.min(...days.map(d => d.temp_min));
    const globalRange = globalMax - globalMin || 1;

    const formatDay = (dateStr: string) => {
        const date = parseISO(dateStr);
        if (isToday(date)) return 'Hoje';
        if (isTomorrow(date)) return 'Amanhã';
        return format(date, 'EEEE', { locale: ptBR });
    };

    const formatDayShort = (dateStr: string) => {
        const date = parseISO(dateStr);
        return format(date, 'dd/MM');
    };

    return (
        <div className="forecast-container glass-panel animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <h3 className="forecast-title">Previsão de 5 dias</h3>
            <div className="forecast-list">
                {days.map((day, index) => {
                    const isExpanded = expandedDay === day.dateStr;
                    const barLeft = ((day.temp_min - globalMin) / globalRange) * 100;
                    const barWidth = ((day.temp_max - day.temp_min) / globalRange) * 100;
                    const popPct = Math.round(day.pop * 100);

                    return (
                        <div key={day.dt} className={`forecast-row ${isExpanded ? 'expanded' : ''}`}
                            style={{ animationDelay: `${0.25 + index * 0.07}s` }}>

                            <button
                                className="forecast-row-header"
                                onClick={() => setExpandedDay(isExpanded ? null : day.dateStr)}
                                aria-expanded={isExpanded}
                            >
                                {/* Day name */}
                                <div className="forecast-day-info">
                                    <span className="forecast-day-name">{formatDay(day.dateStr)}</span>
                                    <span className="forecast-day-date">{formatDayShort(day.dateStr)}</span>
                                </div>

                                {/* Icon + pop */}
                                <div className="forecast-icon-col">
                                    <WeatherIcon code={day.weather[0].icon} size={36} />
                                    {popPct > 10 && (
                                        <span className="forecast-pop"><Droplets size={10} />{popPct}%</span>
                                    )}
                                </div>

                                {/* Temp range bar */}
                                <div className="forecast-temp-bar-col">
                                    <span className="forecast-temp-min">{Math.round(day.temp_min)}°</span>
                                    <div className="forecast-bar-bg">
                                        <div
                                            className="forecast-bar-fill"
                                            style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 8)}%` }}
                                        />
                                    </div>
                                    <span className="forecast-temp-max">{Math.round(day.temp_max)}°</span>
                                </div>

                                <ChevronDown size={16} className={`forecast-chevron ${isExpanded ? 'rotated' : ''}`} />
                            </button>

                            {/* Expanded details */}
                            {isExpanded && (
                                <div className="forecast-details animate-fade-in">
                                    <span className="forecast-detail-desc">{day.weather[0].description}</span>
                                    <div className="forecast-detail-stats">
                                        <div className="fd-stat">
                                            <Droplets size={14} />
                                            <span>Umidade: <strong>{day.humidity}%</strong></span>
                                        </div>
                                        <div className="fd-stat">
                                            <Wind size={14} />
                                            <span>Vento: <strong>{(day.windSpeed * 3.6).toFixed(0)} km/h</strong></span>
                                        </div>
                                        <div className="fd-stat">
                                            <Droplets size={14} />
                                            <span>Chuva: <strong>{popPct}%</strong></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
