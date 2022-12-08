import { WeatherCodesMap } from "./weather-widget/weather-codes-map";

export interface GetWeatherOptions {
  location: string;
  units?: 'metric' | 'imperial';
}

export interface TomorrowApiOptions extends GetWeatherOptions {
  timesteps: string;
  fields: string[];
  startTime: string;
  endTime: string;
}

export type WeatherCodeKey = keyof typeof WeatherCodesMap;

export interface WeatherValues {
  temperature: number;
  weatherCode: WeatherCodeKey;
  windDirection: number;
  windSpeed: number;
  cloudCover: number;
}

export interface TimelineInterval {
  startTime: string;
  values: WeatherValues;
}

export interface TimelinesResponse {
  data: {
    timelines: Array<{
      endTime: string;
      startTime: string;
      timestep: string;
      intervals: TimelineInterval[];
    }>
  }
}

export interface WeatherContext extends TimelineInterval {
  icon: string;
  description: string;
  error?: Error;
}
