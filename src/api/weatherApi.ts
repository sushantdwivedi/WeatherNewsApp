import axios from 'axios';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export interface WeatherData {
  current_temperature: number;
  current_weather: {
    temperature: number;
    weathercode: number;
    time: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const params = {
    latitude: lat,
    longitude: lon,
    current_weather: true,
    daily: 'temperature_2m_max,temperature_2m_min,weathercode',
    timezone: 'auto',
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
};