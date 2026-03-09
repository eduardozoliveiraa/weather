import React from 'react';
import {
    Sun, Moon, Cloud, CloudRain, CloudLightning,
    CloudSnow, CloudFog, ThermometerSun
} from 'lucide-react';
import './WeatherIcon.css';

interface WeatherIconProps {
    code: string;
    size?: number;
    className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, size = 48, className = '' }) => {
    // Map OpenWeatherMap icon codes to Lucide icons and animations
    // Codes end with 'd' for day, 'n' for night
    const getIcon = () => {
        switch (code.substring(0, 2)) {
            case '01': // clear sky
                return code.endsWith('d') ?
                    <Sun size={size} className={`icon-sun animate-spin-slow ${className}`} /> :
                    <Moon size={size} className={`icon-moon animate-pulse-soft ${className}`} />;
            case '02': // few clouds
            case '03': // scattered clouds
            case '04': // broken clouds
                return <Cloud size={size} className={`icon-cloud animate-float ${className}`} />;
            case '09': // shower rain
            case '10': // rain
                return <CloudRain size={size} className={`icon-rain animate-bounce-soft ${className}`} />;
            case '11': // thunderstorm
                return <CloudLightning size={size} className={`icon-lightning animate-pulse-fast ${className}`} />;
            case '13': // snow
                return <CloudSnow size={size} className={`icon-snow animate-float ${className}`} />;
            case '50': // mist
                return <CloudFog size={size} className={`icon-fog animate-pulse-soft ${className}`} />;
            default:
                return <ThermometerSun size={size} className={`${className}`} />;
        }
    };

    return <div className="weather-icon-wrapper">{getIcon()}</div>;
};
