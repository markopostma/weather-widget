import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { TOMORROW_API_KEY_PROVIDER, WEATHER_WIDGET_CACHE, TOMORROW_API_URL, DEFAULT_WEATHER_OPTIONS } from '../constants';
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
  #cache?: WeatherContext[];

  constructor(
    @Inject(TOMORROW_API_KEY_PROVIDER) private _tomorrowApiKey: string,
    private _http: HttpClient,
  ) {
    // due to rate limits of the API the data only needs to be updated once an hour.
    // using localstorage is not the most pretty solution, but it's suitable for the purpose of this project.
    // for production a self managed API would be recommened to manage caching.
    if ('localStorage' in window) {
      const cache = this.getCache<WeatherContext[]>();

      if (Array.isArray(cache) && cache.length === 24) {
        this.#cache = cache;
      }
    }
  }

  /**
   * @see https://docs.tomorrow.io/reference/get-timelines
   */
  getTimelines(apiOptions: GetTimelinesOptions): Observable<TimelineInterval[]> {
    if (this.#cache) {
      const cacheHours = new Date(this.#cache[0].startTime).getHours();

      // if the hours are the same a refresh is not necessary, the result would be the same
      if (cacheHours === new Date().getHours()) {
        return of(this.#cache);
      }
    }

    const options: TomorrowApiOptions = {
      ...DEFAULT_WEATHER_OPTIONS,
      ...apiOptions,
    };

    const params = new HttpParams({
      fromObject: {
        ...options,
      },
    });

    const headers = new HttpHeaders({
      contentType: 'application/json',
      apiKey: this._tomorrowApiKey,
    });

    return this._http
      .get<TimelinesResponse>(`${TOMORROW_API_URL}/timelines`, { params, headers })
      .pipe(
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
        tap(data => this.setCache(data as WeatherContext[])),
      );
  }

  setCache(value: WeatherContext[]) {
    localStorage.setItem(
      WEATHER_WIDGET_CACHE,
      JSON.stringify(value, undefined, 0)
    );
    this.#cache = value;
  }

  private getCache<T>(): T | null {
    const item = localStorage.getItem(WEATHER_WIDGET_CACHE);

    return item
      ? JSON.parse(item) as T
      : null;
  }

  private clearCache() {
    localStorage.removeItem(WEATHER_WIDGET_CACHE);
    this.#cache = undefined;
  }
}
