import axios from 'axios';
import { WeatherData, ForecastData, AirQualityData, GeocodingResult } from '../types/weather';
import { mockCurrentWeather, mockForecastData } from './mockData';

// If testing without API key, set to true to force mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCKS === 'true' || !import.meta.env.VITE_OPENWEATHER_API_KEY;

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
    lang: 'pt_br',
  },
});

const geoApi = axios.create({
  baseURL: GEO_URL,
  params: { appid: API_KEY },
});

export const weatherService = {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({ ...mockCurrentWeather, name: city }), 800));
    }
    const response = await api.get('/weather', { params: { q: city } });
    return response.data;
  },

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve(mockCurrentWeather), 800));
    }
    const response = await api.get('/weather', { params: { lat, lon } });
    return response.data;
  },

  async getForecastByCity(city: string): Promise<ForecastData> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve(mockForecastData), 800));
    }
    const response = await api.get('/forecast', { params: { q: city, cnt: 40 } });
    return response.data;
  },

  async getForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve(mockForecastData), 800));
    }
    const response = await api.get('/forecast', { params: { lat, lon, cnt: 40 } });
    return response.data;
  },

  async getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
    if (USE_MOCK_DATA) {
      return {
        list: [{
          main: { aqi: 2 },
          components: { co: 233, no2: 12, o3: 68, pm2_5: 8, pm10: 14, so2: 3 },
        }],
      };
    }
    const response = await axios.get(`${BASE_URL}/air_pollution`, {
      params: { lat, lon, appid: API_KEY },
    });
    return response.data;
  },

  async geocodeCity(query: string): Promise<GeocodingResult[]> {
    if (USE_MOCK_DATA || !query) return [];
    const response = await geoApi.get('/direct', { params: { q: query, limit: 5 } });
    return response.data;
  },
};
