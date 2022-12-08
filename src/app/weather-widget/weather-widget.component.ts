import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, first, map, Observable, of } from 'rxjs';
import { WeatherWidgetService } from './weather-widget.service';
import { WeatherContext } from '../types';
import { createWeatherContext } from '../utilities';

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
  @Input() units: 'metric' | 'imperial' = 'metric';

  public activeInterval = 0;
  public intervals$!: Observable<WeatherContext[]>;

  ngOnInit() {
    if (!this.latitude || !this.longitude) {
      throw new Error('Latitude and longitude are mandatory properties.');
    }

    this.intervals$ = this.weatherWidgetService.getWeather({
      location: `${this.latitude},${this.longitude}`,
      units: this.units,
    }).pipe(
      first(),
      map(intervals => intervals.map(createWeatherContext)),
      catchError((error) =>  of(error))
    );
  }

  activateInterval(index: number) {
    this.activeInterval = index;
  }

  /**
   * Calculates slider movement based on `clientWidth` and `activeInterval`.
   * @param element
   * @returns a negative pixel value
   */
  calculateMarginLeft({ clientWidth }: HTMLDivElement) {
    return [
      '-',
      (this.activeInterval - 1) * clientWidth,
      'px'
    ].join('');
  }
}
