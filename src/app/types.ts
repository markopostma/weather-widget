import { WeatherCodesMap } from './weather-widget/weather-codes-map';

export type UnitType = 'metric' | 'imperial';
export type TimestepsType = 'best' | '1m' | '5m' | '15m' | '30m' | '1h' | '1d' | 'current';

export interface GetTimelinesOptions {
  location: string;
  units?: UnitType;
  timesteps?: TimestepsType;
  timezone?: string;
  startTime?: string;
  endTime?: string;
  fields?: string;
}

export type TomorrowApiOptions = Required<GetTimelinesOptions>;

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
