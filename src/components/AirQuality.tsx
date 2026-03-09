import React from 'react';
import { AirQualityData } from '../types/weather';
import { Wind } from 'lucide-react';
import './AirQuality.css';

interface AirQualityProps {
    data: AirQualityData | null;
    loading: boolean;
}

const AQI_INFO = [
    { label: 'Boa', color: 'var(--aqi-1)', emoji: '😊' },
    { label: 'Razoável', color: 'var(--aqi-2)', emoji: '🙂' },
    { label: 'Moderada', color: 'var(--aqi-3)', emoji: '😐' },
    { label: 'Ruim', color: 'var(--aqi-4)', emoji: '😷' },
    { label: 'Muito ruim', color: 'var(--aqi-5)', emoji: '🤢' },
];

export const AirQuality: React.FC<AirQualityProps> = ({ data, loading }) => {
    if (loading) {
        return (
            <div className="aqi-container glass-panel animate-pulse-soft">
                <div className="skeleton-line title" style={{ width: '160px', marginBottom: '16px' }} />
                <div className="skeleton-line" style={{ height: '40px', marginBottom: '12px' }} />
                <div className="skeleton-line" style={{ height: '20px', marginBottom: '20px' }} />
                <div className="aqi-gases-skeleton">
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-line" style={{ height: '48px', flex: 1 }} />)}
                </div>
            </div>
        );
    }

    if (!data?.list?.length) return null;

    const { aqi } = data.list[0].main;
    const { co, no2, o3, pm2_5, pm10 } = data.list[0].components;
    const info = AQI_INFO[aqi - 1];

    // Progress bar: aqi 1-5 → 0-100%
    const progress = ((aqi - 1) / 4) * 100;

    const gases = [
        { name: 'PM2.5', value: pm2_5.toFixed(1), unit: 'μg/m³' },
        { name: 'PM10', value: pm10.toFixed(1), unit: 'μg/m³' },
        { name: 'O₃', value: o3.toFixed(1), unit: 'μg/m³' },
        { name: 'NO₂', value: no2.toFixed(1), unit: 'μg/m³' },
        { name: 'CO', value: (co / 1000).toFixed(2), unit: 'mg/m³' },
        { name: 'SO₂', value: data.list[0].components.so2.toFixed(1), unit: 'μg/m³' },
    ];

    return (
        <div className="aqi-container glass-panel animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="aqi-title">
                <Wind size={16} />
                Qualidade do Ar
            </h3>

            <div className="aqi-badge" style={{ borderColor: info.color, color: info.color }}>
                <span className="aqi-emoji">{info.emoji}</span>
                <div>
                    <div className="aqi-label-text">{info.label}</div>
                    <div className="aqi-index">IQA {aqi}/5</div>
                </div>
            </div>

            {/* Gradient bar */}
            <div className="aqi-bar-bg">
                <div className="aqi-bar-gradient" />
                <div className="aqi-pointer" style={{ left: `${progress}%` }} />
            </div>
            <div className="aqi-bar-labels">
                <span>Boa</span>
                <span>Muito ruim</span>
            </div>

            {/* Gases */}
            <div className="aqi-gases">
                {gases.map(g => (
                    <div key={g.name} className="aqi-gas-item">
                        <span className="aqi-gas-name">{g.name}</span>
                        <span className="aqi-gas-value">{g.value}</span>
                        <span className="aqi-gas-unit">{g.unit}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
