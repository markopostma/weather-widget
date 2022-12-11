import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { TOMORROW_API_KEY_PROVIDER, LOCAL_STORAGE_CACHE, TOMORROW_API_URL, DEFAULT_TIMEZONE, DEFAULT_UNIT } from '../constants';
import { GetTimelinesOptions, TimelineInterval, TimelinesResponse, TomorrowApiOptions, WeatherContext } from '../types';
import { catchError, map, Observable, of, tap } from 'rxjs';

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
    if ("localStorage" in window) {
      const cacheStorage = localStorage.getItem(LOCAL_STORAGE_CACHE);

      if (cacheStorage) {
        const cache = JSON.parse(cacheStorage) as WeatherContext[];

        if (Array.isArray(cache) && cache.length === 24) {
          this._cache = cache;
        } else {
          // the data is corrupted and should be cleared
          localStorage.removeItem(LOCAL_STORAGE_CACHE);
        }
      }
    }
  }

  /**
   * @see https://docs.tomorrow.io/reference/get-timelines
   */
  getTimelines(apiOptions: GetTimelinesOptions): Observable<TimelineInterval[]> {
    if (this._cache) {
      const cacheHours = new Date(this._cache[0].startTime).getHours();

      // if the hours are the same a refresh is not necessary, the result would be the same
      if (cacheHours === new Date().getHours()) {
        return of(this._cache);
      }
    }

    const options: TomorrowApiOptions = {
      units: DEFAULT_UNIT,
      timezone: DEFAULT_TIMEZONE,
      endTime: new Date().toISOString(),
      startTime: 'now',
      timesteps: '1h',
      ...apiOptions,
      fields: [
        'temperature',
        'weatherCode',
        // 'cloudCover',
        // 'windSpeed',
        // 'windDirection',
      ]
    };

    const params = new HttpParams({
      fromObject: {
        ...options,
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
        catchError((error) => of(error)),
        map(response => {
          if ('error' in response) {
            throw response;
          }
          return response
            .data
            .timelines[0]
            .intervals
        }
        ),
        tap(intervals => {
          localStorage.setItem(LOCAL_STORAGE_CACHE, JSON.stringify(intervals, undefined, 0));
        }),
      );
  }
}
