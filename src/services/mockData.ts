import { WeatherData, ForecastData } from '../types/weather';

export const mockCurrentWeather: WeatherData = {
  name: 'São Paulo',
  sys: { country: 'BR' },
  main: {
    temp: 24.5,
    feels_like: 25.2,
    temp_min: 22.0,
    temp_max: 27.5,
    pressure: 1012,
    humidity: 65,
  },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'céu limpo',
      icon: '01d',
    },
  ],
  wind: { speed: 4.1, deg: 120 },
  dt: Date.now() / 1000,
};

const generateMockForecast = (): ForecastData => {
  const list = [];
  const now = new Date();
  
  // Create 5 days of forecast data (every 3 hours)
  for (let i = 1; i <= 40; i++) {
    const futureDate = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
    list.push({
      dt: Math.floor(futureDate.getTime() / 1000),
      main: {
        temp: 20 + Math.random() * 10,
        feels_like: 22 + Math.random() * 5,
        temp_min: 18,
        temp_max: 30,
        pressure: 1010 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
      },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'céu limpo',
          icon: '01d',
        },
      ],
      wind: { speed: 3 + Math.random() * 5, deg: 180 },
      dt_txt: futureDate.toISOString().replace('T', ' ').substring(0, 19),
    });
  }

  return {
    city: {
      name: 'São Paulo',
      country: 'BR',
      timezone: -10800,
    },
    list,
  };
};

export const mockForecastData = generateMockForecast();
