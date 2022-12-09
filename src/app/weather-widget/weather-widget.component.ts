import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';

import { WeatherWidgetService } from './weather-widget.service';
import { WeatherContext } from '../types';
import { createWeatherContext } from '../utilities';
import { DEFAULT_TIMEZONE, DEFAULT_UNIT } from '../constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class WeatherWidgetComponent implements OnInit {
  constructor(private weatherWidgetService: WeatherWidgetService) { }

  @Input() latitude!: string;
  @Input() longitude!: string;
  @Input() units = DEFAULT_UNIT;
  @Input() timezone = DEFAULT_TIMEZONE;

  @ViewChild('weatherWidget') weatherWidgetRef!: ElementRef<HTMLDivElement>;

  private _activeInterval = 0;
  public hours$!: Observable<WeatherContext[] | unknown>;

  ngOnInit() {
    this.hours$ = this.weatherWidgetService.getTimelines({
      location: [this.latitude, this.longitude].join(','),
      units: this.units,
      endTime: 'nowPlus23h'
    }).pipe(
      map(intervals => {
        return intervals.map(createWeatherContext);
      }),
      catchError((error: HttpErrorResponse) => {
        return of(error)
      })
    );
  }

  set current(value: number) {
    if (typeof value === 'number' && value !== this._activeInterval) {
      this._activeInterval = value;
    }
  }

  get current() {
    return this._activeInterval;
  }

  itemClick(index: number) {
    this.current = index;
  }
}
