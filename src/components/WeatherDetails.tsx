import React from 'react';
import { WeatherData } from '../types/weather';
import { Eye, Gauge, Sunset, Sunrise, Wind, Thermometer } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './WeatherDetails.css';

interface WeatherDetailsProps {
    data: WeatherData | null;
    loading: boolean;
}

const windDirection = (deg: number): string => {
    const dirs = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
    return dirs[Math.round(deg / 45) % 8];
};

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="details-container glass-panel animate-pulse-soft">
                <div className="skeleton-line title" style={{ width: '150px', marginBottom: '16px' }} />
                <div className="details-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="detail-item-skeleton">
                            <div className="skeleton-circle" style={{ width: '40px', height: '40px' }} />
                            <div style={{ flex: 1 }}>
                                <div className="skeleton-line" style={{ height: '11px', width: '70%', marginBottom: '6px' }} />
                                <div className="skeleton-line" style={{ height: '18px', width: '50%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) return null;

    const sunrise = format(fromUnixTime(data.sys.sunrise), "HH:mm", { locale: ptBR });
    const sunset = format(fromUnixTime(data.sys.sunset), "HH:mm", { locale: ptBR });
    const visKm = ((data.visibility ?? 10000) / 1000).toFixed(1);

    const items = [
        { icon: <Thermometer size={20} />, label: 'Sensação', value: `${Math.round(data.main.feels_like)}°C` },
        { icon: <Gauge size={20} />, label: 'Pressão', value: `${data.main.pressure} hPa` },
        { icon: <Eye size={20} />, label: 'Visibilidade', value: `${visKm} km` },
        { icon: <Wind size={20} />, label: 'Direção vento', value: `${windDirection(data.wind.deg)} · ${(data.wind.speed * 3.6).toFixed(0)} km/h` },
        { icon: <Sunrise size={20} />, label: 'Nascer do sol', value: sunrise },
        { icon: <Sunset size={20} />, label: 'Pôr do sol', value: sunset },
    ];

    return (
        <div className="details-container glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="details-title">Detalhes</h3>
            <div className="details-grid">
                {items.map((item, i) => (
                    <div key={i} className="detail-item" style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                        <div className="detail-icon-bg">{item.icon}</div>
                        <div className="detail-text">
                            <span className="detail-label">{item.label}</span>
                            <span className="detail-value">{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
