import { WeatherCodesMap } from "./weather-widget/weather-codes-map";

export type UnitType = 'metric' | 'imperial';

export interface GetWeatherOptions {
  location: string;
  units?: UnitType;
  timezone?: string;
}

export interface TomorrowApiOptions extends Required<GetWeatherOptions> {
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
