import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { GeocodingResult } from '../types/weather';
import { weatherService } from '../services/api';
import './SearchBox.css';

interface SearchBoxProps {
    onSearch: (city: string, lat?: number, lon?: number) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchSuggestions = useCallback(async (q: string) => {
        if (q.length < 2) { setSuggestions([]); return; }
        setIsLoading(true);
        try {
            const results = await weatherService.geocodeCity(q);
            setSuggestions(results);
            setShowDropdown(results.length > 0);
        } catch {
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => fetchSuggestions(query), 350);
        return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
    }, [query, fetchSuggestions]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (result: GeocodingResult) => {
        setQuery(`${result.name}, ${result.country}`);
        setShowDropdown(false);
        setSuggestions([]);
        onSearch(result.name, result.lat, result.lon);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setShowDropdown(false);
            onSearch(query.trim());
        }
    };

    const handleClear = () => { setQuery(''); setSuggestions([]); setShowDropdown(false); };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') { setShowDropdown(false); }
    };

    return (
        <div className="search-wrapper animate-fade-in" ref={containerRef}>
            <form onSubmit={handleSubmit} className="search-box glass-panel">
                <button type="submit" className="search-btn" aria-label="Buscar">
                    <Search size={18} />
                </button>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Busque por uma cidade..."
                    value={query}
                    onChange={e => { setQuery(e.target.value); if (!e.target.value) setSuggestions([]); }}
                    onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                <div className="search-right">
                    {isLoading && <Loader2 size={16} className="search-spinner" />}
                    {query && !isLoading && (
                        <button type="button" className="search-clear" onClick={handleClear} aria-label="Limpar">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </form>

            {showDropdown && (
                <div className="search-dropdown glass-panel animate-fade-in">
                    {suggestions.map((r, i) => (
                        <button key={i} type="button" className="suggestion-item" onClick={() => handleSelect(r)}>
                            <MapPin size={14} className="suggestion-pin" />
                            <span className="suggestion-name">{r.name}</span>
                            {r.state && <span className="suggestion-state">{r.state}</span>}
                            <span className="suggestion-country">{r.country}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
