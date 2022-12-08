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
    component.latitude = '53.219126515171546';
    component.longitude = '6.5731477278820805';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('throws an error when latitude or longitude are undefined', (done) => {
    fixture = TestBed.createComponent(WeatherWidgetComponent);
    component = fixture.componentInstance;

    try {
      fixture.detectChanges();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      done();
    }
  });
});
