import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TOMORROW_API_KEY_PROVIDER, TOMORROW_API_URL } from '../constants';
import { GetTimelinesOptions, TimelinesResponse, WeatherContext } from '../types';
import { WeatherWidgetService } from './weather-widget.service';

describe('WeatherWidgetService', () => {
  let service: WeatherWidgetService;
  let httpMock: HttpTestingController;

  const timelineOptions: Required<GetTimelinesOptions> = {
    location: 'TEST location',
    timezone: 'TEST timezone',
    units: 'TEST units' as any,
    timesteps: 'TEST timesteps' as any,
    endTime: 'TEST endTime',
    startTime: 'TEST startTime',
    fields: ['field_1', 'field_2'].join(' '),
  };
  const testApiKey = (Math.random() * 100000).toString();
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
          useValue: testApiKey,
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
    afterEach(() => {
      service['clearCache']();
    })

    it('Returns observable array of intervals and caches result', (done) => {
      const localStorageSpy = spyOn(localStorage, 'setItem');

      service.getTimelines({ location: '' }).subscribe(res => {
        expect(res).toEqual(mockData.data.timelines[0].intervals);
        expect(localStorageSpy).toHaveBeenCalled();
        httpMock.verify();
        done();
      });

      httpMock.expectOne(({ url }) => url === `${TOMORROW_API_URL}/timelines`).flush(mockData);
    });

    it('Passes the correct parameters and headers', (done) => {
      service.getTimelines(timelineOptions).subscribe(() => {
        httpMock.verify();
        done();
      });

      let req = httpMock.expectOne(({ url }) => url === `${TOMORROW_API_URL}/timelines`);
      const { params, headers } = req.request;

      req.flush(mockData);

      expect(params.get('location')).toEqual(timelineOptions.location);
      expect(params.get('timezone')).toEqual(timelineOptions.timezone);
      expect(params.get('units')).toEqual(timelineOptions.units);
      expect(params.get('timesteps')).toEqual(timelineOptions.timesteps);
      expect(params.get('endTime')).toEqual(timelineOptions.endTime);
      expect(params.get('startTime')).toEqual(timelineOptions.startTime);
      expect(headers.get('apikey')).toEqual(testApiKey);
    });

    describe('caching', () => {
      afterAll(() => {
        service['clearCache']();
      });

      it('uses cache when available', done => {
        service['setCache'](mockData.data.timelines[0].intervals as WeatherContext[]);

        service.getTimelines({ location: '' }).subscribe(res => {
          expect(res).toEqual(mockData.data.timelines[0].intervals);
          httpMock.verify();
          done();
        });

        httpMock.expectNone(({ url }) => url === `${TOMORROW_API_URL}/timelines`);
      });
    })
  });
});
