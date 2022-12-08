import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LOCAL_STORAGE_CACHE, TOMORROW_API_KEY_PROVIDER, TOMORROW_API_URL } from '../constants';
import { TimelinesResponse, WeatherContext } from '../types';
import { WeatherWidgetService } from './weather-widget.service';

describe('WeatherWidgetService', () => {
  let service: WeatherWidgetService;
  let httpMock: HttpTestingController;

  const mockData: TimelinesResponse = {
    data: {
      timelines: [
        {
          intervals: [
            {
              startTime: new Date().toISOString(),
              values: {
                cloudCover: 0,
                temperature: 0,
                weatherCode: 1000,
                windDirection: 0,
                windSpeed: 0,
              }
            }
          ],
          endTime: new Date().toISOString(),
          startTime: new Date().toISOString(),
          timestep: '1h'
        }
      ]
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: TOMORROW_API_KEY_PROVIDER,
          useValue: "TEST_API_KEY",
        },
      ]
    });
    service = TestBed.inject(WeatherWidgetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeInstanceOf(WeatherWidgetService);
  });

  describe('getWeather()', () => {
    beforeAll(() => {
      localStorage.removeItem(LOCAL_STORAGE_CACHE);
    });

    afterEach(() => {
      localStorage.removeItem(LOCAL_STORAGE_CACHE);
    })

    it('Returns observable array of intervals', (done) => {
      service.getWeather({ location: '' }).subscribe(res => {
        expect(res).toEqual(mockData.data.timelines[0].intervals);
        httpMock.verify();
        done();
      });

      httpMock.expectOne(({ url }) => url === `${TOMORROW_API_URL}/timelines`).flush(mockData);
    });

    describe('caching', () => {
      afterAll(() => {
        delete service['_cache'];
      });

      it('uses cache when available', done => {
        service['_cache'] = mockData.data.timelines[0].intervals as WeatherContext[];

        service.getWeather({ location: '' }).subscribe(res => {
          expect(res).toEqual(mockData.data.timelines[0].intervals);
          httpMock.verify();
          done();
        });

        httpMock.expectNone(({ url }) => url.includes(`${TOMORROW_API_URL}/timelines`));
      });
    })
  });
});
