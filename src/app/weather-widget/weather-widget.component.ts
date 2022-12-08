import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, first, map, Observable, of } from 'rxjs';
import { WeatherWidgetService } from './weather-widget.service';
import { WeatherContext } from '../types';
import { createWeatherContext } from '../utilities';
import { DEFAULT_TIMEZONE, DEFAULT_UNIT } from '../constants';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class WeatherWidgetComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private weatherWidgetService: WeatherWidgetService) { }

  @Input() latitude!: string;
  @Input() longitude!: string;
  @Input() units = DEFAULT_UNIT;
  @Input() timezone = DEFAULT_TIMEZONE;
  @Input() sliderItems: number = 4;

  @ViewChild('weatherWidget') weatherWidgetRef!: ElementRef<HTMLDivElement>;

  private _activeInterval = 0;
  public data$!: Observable<WeatherContext[]>;

  ngOnInit() {
    if (!this.latitude || !this.longitude) {
      throw new Error('Latitude and longitude are mandatory properties.');
    }

    this.sliderItems = typeof this.sliderItems === 'string'
      ? Number(this.sliderItems)
      : this.sliderItems;

    this.data$ = this.weatherWidgetService.getWeather({
      location: [this.latitude, this.longitude].join(','),
      units: this.units,
    }).pipe(
      first(),
      map(intervals => intervals.map(createWeatherContext)),
      catchError((error) => of(error))
    );
  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => this.moveSlider(), { passive: true });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.moveSlider);
  }

  set current(value: number) {
    if (value !== this._activeInterval) {
      this._activeInterval = value;
      this.moveSlider();
    }
  }

  get current() {
    return this._activeInterval;
  }

  handleItemClick(index: number) {
    this.current = index;
  }

  /**
   * Calculates slider movement based on `clientWidth` and `activeInterval`.
   * Targets the first `.weather-widget-intervals-item` in the slider to apply the styling to.
   */
  private moveSlider() {
    const element: HTMLDivElement = this.weatherWidgetRef.nativeElement.querySelector('.weather-widget-intervals-item')!;

    // value between 0 and 24 minues the number of items so it will not
    // go out of bounds or leave empty space when approaching the end.
    const index = Math.max(0, Math.min(24 - this.sliderItems, this.current - 1));

    element.style.marginLeft = [
      '-',
      index * element.clientWidth,
      'px'
    ].join('');
  }
}
