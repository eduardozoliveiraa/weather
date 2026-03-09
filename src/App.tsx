import { useState, useEffect, useCallback } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { weatherService } from './services/api';
import { WeatherData, ForecastData, AirQualityData } from './types/weather';
import { useTheme } from './contexts/ThemeContext';
import { Sun, Moon, CloudRain } from 'lucide-react';
import './App.css';

import { SearchBox } from './components/SearchBox';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { HourlyForecast } from './components/HourlyForecast';
import { WeatherDetails } from './components/WeatherDetails';
import { AirQuality } from './components/AirQuality';
import { WeatherBackground } from './components/WeatherBackground';

function App() {
  const { theme, toggleTheme } = useTheme();
  const location = useGeolocation();

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const [weather, forecast, aqi] = await Promise.all([
        weatherService.getWeatherByCoords(lat, lon),
        weatherService.getForecastByCoords(lat, lon),
        weatherService.getAirQuality(lat, lon),
      ]);
      setWeatherData(weather);
      setForecastData(forecast);
      setAirQualityData(aqi);
    } catch {
      setError('Erro ao carregar dados climáticos. Verifique sua chave da API (pode levar até 2h para ativar).');
      setWeatherData(null);
      setForecastData(null);
      setAirQualityData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load based on geolocation
  useEffect(() => {
    if (location.lat && location.lon && !location.loading) {
      fetchByCoords(location.lat, location.lon);
    } else if (location.error) {
      setError(location.error);
    }
  }, [location.lat, location.lon, location.loading, location.error, fetchByCoords]);

  const handleSearch = async (city: string, lat?: number, lon?: number) => {
    // If we have coords from geocoding autocomplete, use them directly
    if (lat !== undefined && lon !== undefined) {
      fetchByCoords(lat, lon);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [weather, forecast] = await Promise.all([
        weatherService.getWeatherByCity(city),
        weatherService.getForecastByCity(city),
      ]);
      setWeatherData(weather);
      setForecastData(forecast);

      // Fetch AQI using the coords returned by the weather response
      if (weather.coord) {
        const aqi = await weatherService.getAirQuality(weather.coord.lat, weather.coord.lon);
        setAirQualityData(aqi);
      }
    } catch {
      setError('Cidade não encontrada ou chave da API ainda inativa (pode demorar 1–2 horas).');
      setWeatherData(null);
      setForecastData(null);
      setAirQualityData(null);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || location.loading;

  return (
    <>
      <WeatherBackground data={weatherData} />

      <div className="app-container">
        <header className="app-header">
          <div className="logo">
            <CloudRain className="logo-icon animate-pulse-soft" size={28} />
            <h1>Clima</h1>
          </div>
          <div className="header-controls">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Alternar tema">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        <main className="main-content">
          <SearchBox onSearch={handleSearch} />

          {error && <div className="error-message glass-panel animate-fade-in">{error}</div>}

          {(isLoading || weatherData) && (
            <>
              {/* Row 1: Current + Details */}
              <div className="weather-main-row">
                <CurrentWeather data={weatherData} loading={isLoading} />
                <WeatherDetails data={weatherData} loading={isLoading} />
              </div>

              {/* Row 2: Hourly */}
              <HourlyForecast data={forecastData} loading={isLoading} />

              {/* Row 3: 5-day + AQI */}
              <div className="weather-bottom-row">
                <Forecast data={forecastData} loading={isLoading} />
                <AirQuality data={airQualityData} loading={isLoading} />
              </div>
            </>
          )}
        </main>


      </div>
    </>
  );
}

export default App;
