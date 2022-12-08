import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TOMORROW_API_KEY_PROVIDER, LOCAL_STORAGE_KEY, TOMORROW_API_URL } from '../constants';
import { GetWeatherOptions, TimelinesResponse, TomorrowApiOptions, WeatherContext } from '../types';
import { map, of, tap } from 'rxjs';

/**
 * Injectable service for the Tomorrow Weather API.
 * Requires an Tomorrow API key.
 * @see https://www.tomorrow.io/weather-api/
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherWidgetService {
  private _cache?: WeatherContext[];

  constructor(
    @Inject(TOMORROW_API_KEY_PROVIDER) private tomorrowApiKey: string,
    private http: HttpClient,
  ) {
    // due to rate limits of the API the data only needs to be updated once an hour.
    // using localstorage is not the most pretty solution, but it's suitable for the purpose of this project.
    // for production a self managed API would be recommened to manage caching.
    const cacheStorage = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (cacheStorage) {
      const cache = JSON.parse(cacheStorage) as WeatherContext[];

      if (Array.isArray(cache) && cache.length) {
        this._cache = cache;
      }
    }
  }

  /**
   * Gets latest weather information from the Tomorrow Api.
   * @param apiOptions is required
   * @request GET /timelines
   */
  getWeather(apiOptions: GetWeatherOptions) {
    if (this._cache) {
      const cacheHours = new Date(this._cache[0].startTime).getHours();

      // if the hours are the same a refresh is not necessary, the result would be the same
      if (cacheHours === new Date().getHours()) {
        return of(this._cache);
      }
    }

    const options: TomorrowApiOptions = {
      units: 'metric',
      ...apiOptions,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      timesteps: '1h',
      fields: [
        'temperature',
        'cloudCover',
        'windSpeed',
        'windDirection',
        'weatherCode',
      ]
    };
    const endTime = options.endTime ? new Date(options.endTime) : new Date();

    // only fetch results for the next 24 hours
    endTime.setHours(endTime.getHours() + 23);

    const params = new HttpParams({
      fromObject: {
        ...options,
        endTime: endTime.toISOString(),
        fields: options.fields.join(','),
      },
    });

    const headers = new HttpHeaders({
      contentType: 'application/json',
      apiKey: this.tomorrowApiKey,
    });

    return this.http
      .get<TimelinesResponse>(`${TOMORROW_API_URL}/timelines`, { params, headers })
      .pipe(
        map(response => response
          .data
          .timelines[0]
          .intervals
        ),
        tap(intervals => {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(intervals, undefined, 0));
        })
      );
  }
}
