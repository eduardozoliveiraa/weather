import React from 'react';
import { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind, ArrowUp, ArrowDown, MapPin } from 'lucide-react';
import './CurrentWeather.css';

interface CurrentWeatherProps {
    data: WeatherData | null;
    loading: boolean;
}

const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
};

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="current-weather-skeleton glass-panel animate-pulse-soft">
                <div className="skeleton-line title" />
                <div className="skeleton-circle" style={{ width: '120px', height: '120px', margin: '16px auto' }} />
                <div className="skeleton-line temp" style={{ margin: '0 auto' }} />
                <div className="skeleton-line detail" />
                <div className="skeleton-line detail" style={{ width: '60%' }} />
            </div>
        );
    }

    if (!data) return null;

    const weather = data.weather[0];

    return (
        <div className="current-weather glass-panel animate-fade-in">
            {/* Location */}
            <div className="cw-location">
                <MapPin size={16} className="cw-pin" />
                <span className="cw-city">{data.name}, {data.sys.country}</span>
            </div>

            <p className="cw-greeting">{getGreeting()}!</p>

            {/* Icon + Temp */}
            <div className="cw-hero">
                <div className="cw-icon">
                    <WeatherIcon code={weather.icon} size={120} />
                </div>
                <div className="cw-temp-block">
                    <div className="cw-temp">
                        <span className="temp-value">{Math.round(data.main.temp)}</span>
                        <span className="temp-unit">°C</span>
                    </div>
                    <span className="cw-desc">{weather.description}</span>
                    {/* Min / Max */}
                    <div className="cw-minmax">
                        <span className="cw-max"><ArrowUp size={13} />{Math.round(data.main.temp_max)}°</span>
                        <span className="cw-min"><ArrowDown size={13} />{Math.round(data.main.temp_min)}°</span>
                    </div>
                </div>
            </div>

            {/* Quick stats */}
            <div className="cw-stats">
                <div className="cw-stat">
                    <Droplets size={18} className="cw-stat-icon" />
                    <div>
                        <span className="stat-label">Umidade</span>
                        <span className="stat-value">{data.main.humidity}%</span>
                    </div>
                </div>
                <div className="cw-stat-divider" />
                <div className="cw-stat">
                    <Wind size={18} className="cw-stat-icon" />
                    <div>
                        <span className="stat-label">Vento</span>
                        <span className="stat-value">{(data.wind.speed * 3.6).toFixed(1)} km/h</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
