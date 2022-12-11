import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';

import { WeatherWidgetService } from './weather-widget.service';
import { UnitType, WeatherContext } from '../types';
import { mapWeatherContext } from '../utilities';
import { HttpClient, HttpErrorResponse, HttpXhrBackend } from '@angular/common/http';
import { TOMORROW_API_KEY_PROVIDER } from '../constants';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  providers: [
    HttpXhrBackend,
    {
      provide: HttpClient,
      deps: [HttpXhrBackend]
    },
  ],
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class WeatherWidgetComponent implements OnInit {
  constructor(private _http: HttpClient) {}

  @Input() apiKey!: string;
  @Input() latitude!: string;
  @Input() longitude!: string;
  @Input() units: UnitType = 'metric';
  @Input() timezone = 'Europe/Amsterdam';

  private weatherWidgetService!: WeatherWidgetService;

  public hours$!: Observable<WeatherContext[] | { error: HttpErrorResponse }>;
  public current: number = 0;
  public page = 0;
  public perPage = 6;

  ngOnInit() {
    // initialize WeatherWidgetService
    this.weatherWidgetService = new WeatherWidgetService(this.apiKey, this._http);

    // get Observable data
    this.hours$ = this.weatherWidgetService.getTimelines({
      location: [this.latitude, this.longitude].join(','),
      units: this.units,
      endTime: 'nowPlus23h'
    }).pipe(
      catchError((error: HttpErrorResponse) => of({ error })),
      map(data => {
        return 'error' in data
          ? data
          : data.map(mapWeatherContext);
      }),
    );
  }

  itemClick(index: number) {
    this.current = index;
  }

  paginate(page: number) {
    this.page = Math.max(0, Math.min(3, page));
    this.current = this.page * this.perPage;
  }
}
