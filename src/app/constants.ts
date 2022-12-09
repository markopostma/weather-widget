import { InjectionToken } from '@angular/core';
import { UnitType } from './types';

export const TOMORROW_API_KEY_PROVIDER = new InjectionToken<string>('TOMORROW_API_KEY');
export const TOMORROW_API_KEY = '<PROVIDE AN API KEY>';
export const TOMORROW_API_URL = 'https://api.tomorrow.io/v4';
export const LOCAL_STORAGE_CACHE = 'WEATHER_WIDGET_CACHE';
export const DEFAULT_UNIT: UnitType = 'metric';
export const DEFAULT_TIMEZONE = 'Europe/Amsterdam';
