import { InjectionToken } from '@angular/core';
import { TomorrowApiOptions } from './types';

export const TOMORROW_API_KEY_PROVIDER = new InjectionToken<string>('TOMORROW_API_KEY');
export const TOMORROW_API_URL = 'https://api.tomorrow.io/v4';
export const WEATHER_WIDGET_CACHE = 'WEATHER_WIDGET_CACHE';
export const DEFAULT_WEATHER_OPTIONS = {
  units: 'metric',
  timezone: 'Europe/Amsterdam',
  startTime: 'now',
  timesteps: '1h',
  fields: [
    'temperature',
    'weatherCode',
  ].join(',')
} as TomorrowApiOptions;
