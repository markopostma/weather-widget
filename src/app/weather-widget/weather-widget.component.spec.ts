import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TOMORROW_API_KEY_PROVIDER } from '../constants';
import { WeatherWidgetService } from './weather-widget.service';

import { WeatherWidgetComponent } from './weather-widget.component';

describe('WeatherWidgetComponent', () => {
  let component: WeatherWidgetComponent;
  let fixture: ComponentFixture<WeatherWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherWidgetComponent, HttpClientTestingModule],
      providers: [
        {
          provide: TOMORROW_API_KEY_PROVIDER,
          useValue: "TEST_API_KEY",
        },
        WeatherWidgetService,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WeatherWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has default values', () => {
    expect(component.current).toEqual(0);
    expect(component.page).toEqual(0);
    expect(component.perPage).toEqual(6);
    expect(component.units).toEqual('metric');
    expect(component.timezone).toEqual('Europe/Amsterdam');
  });
});
