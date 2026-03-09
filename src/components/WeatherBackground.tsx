import React, { useMemo } from 'react';
import { WeatherData } from '../types/weather';
import './WeatherBackground.css';

interface WeatherBackgroundProps {
    data: WeatherData | null;
}

function getCondition(data: WeatherData | null): string {
    if (!data) return 'default';
    const code = data.weather[0].icon;
    const isNight = code.endsWith('n');

    const prefix = code.substring(0, 2);
    if (isNight) return 'night';
    if (prefix === '01') return 'clear';
    if (prefix === '02' || prefix === '03') return 'partly-cloudy';
    if (prefix === '04') return 'cloudy';
    if (prefix === '09' || prefix === '10') return 'rain';
    if (prefix === '11') return 'storm';
    if (prefix === '13') return 'snow';
    if (prefix === '50') return 'fog';
    return 'default';
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ data }) => {
    const condition = useMemo(() => getCondition(data), [data]);

    return (
        <div className={`weather-bg weather-bg--${condition}`} aria-hidden="true">
            {/* Orbs / blobs */}
            <div className="bg-orb bg-orb-1" />
            <div className="bg-orb bg-orb-2" />
            <div className="bg-orb bg-orb-3" />

            {/* Rain particles */}
            {(condition === 'rain' || condition === 'storm') && (
                <div className="rain-container">
                    {Array.from({ length: 60 }).map((_, i) => (
                        <div key={i} className="raindrop" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${0.6 + Math.random() * 0.6}s`,
                            height: `${10 + Math.random() * 16}px`,
                        }} />
                    ))}
                </div>
            )}

            {/* Snow particles */}
            {condition === 'snow' && (
                <div className="snow-container">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="snowflake" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                            fontSize: `${8 + Math.random() * 12}px`,
                            opacity: 0.4 + Math.random() * 0.5,
                        }}>❄</div>
                    ))}
                </div>
            )}

            {/* Stars at night */}
            {condition === 'night' && (
                <div className="stars-container">
                    {Array.from({ length: 80 }).map((_, i) => (
                        <div key={i} className="star" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 70}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            width: `${1 + Math.random() * 2}px`,
                            height: `${1 + Math.random() * 2}px`,
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
};
