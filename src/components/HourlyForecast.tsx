import React from 'react';
import { ForecastData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Droplets } from 'lucide-react';
import './HourlyForecast.css';

interface HourlyForecastProps {
    data: ForecastData | null;
    loading: boolean;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="hourly-container glass-panel animate-pulse-soft">
                <div className="skeleton-line title" style={{ width: '180px', marginBottom: '16px' }} />
                <div className="hourly-scroll">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="hourly-card-skeleton">
                            <div className="skeleton-line" style={{ height: '12px', width: '40px' }} />
                            <div className="skeleton-circle" style={{ width: '36px', height: '36px' }} />
                            <div className="skeleton-line" style={{ height: '16px', width: '36px' }} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Next 24h = first 8 items (3h each = 24h)
    const hourly = data.list.slice(0, 8);

    const formatHour = (dtTxt: string) => {
        const date = parseISO(dtTxt);
        return format(date, "HH'h'", { locale: ptBR });
    };

    const maxTemp = Math.max(...hourly.map(h => h.main.temp));
    const minTemp = Math.min(...hourly.map(h => h.main.temp));
    const range = maxTemp - minTemp || 1;

    return (
        <div className="hourly-container glass-panel animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <h3 className="hourly-title">Próximas 24 horas</h3>
            <div className="hourly-scroll">
                {hourly.map((item, i) => {
                    const relHeight = ((item.main.temp - minTemp) / range) * 60 + 20;
                    const pop = Math.round((item.pop ?? 0) * 100);
                    return (
                        <div key={item.dt} className="hourly-card" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                            <span className="hourly-time">{i === 0 ? 'Agora' : formatHour(item.dt_txt)}</span>
                            {pop > 10 && (
                                <span className="hourly-pop">
                                    <Droplets size={10} />
                                    {pop}%
                                </span>
                            )}
                            <div className="hourly-icon">
                                <WeatherIcon code={item.weather[0].icon} size={32} />
                            </div>
                            <div className="hourly-bar-wrap">
                                <div className="hourly-bar" style={{ height: `${relHeight}px` }} />
                            </div>
                            <span className="hourly-temp">{Math.round(item.main.temp)}°</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
