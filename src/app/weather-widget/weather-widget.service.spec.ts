import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { TOMORROW_API_KEY_PROVIDER } from '../constants';
import { WeatherWidgetService } from './weather-widget.service';

describe('WeatherWidgetService', () => {
  let service: WeatherWidgetService;
  const httpClient = provideHttpClientTesting()[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        httpClient,
        {
          provide: TOMORROW_API_KEY_PROVIDER,
          useValue: "TEST_API_KEY",
        },
        {
          provide: WeatherWidgetService,
          deps: [TOMORROW_API_KEY_PROVIDER, httpClient]
        }
      ]
    });
    service = TestBed.inject(WeatherWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeInstanceOf(WeatherWidgetService);
  });

  it('has property http', () => {
    expect(service['http']).toBeDefined();
  });

  it('has property tomorrowApiKey', () => {
    expect(service['tomorrowApiKey']).toBeDefined();
  });
});
