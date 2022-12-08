
import { TimelineInterval } from './types';
import { WeatherCodesMap, WeatherIconsMap } from './weather-widget/weather-codes-map';

export function createWeatherContext(interval: TimelineInterval) {
  const description = WeatherCodesMap[interval.values.weatherCode];
  const iconName = WeatherIconsMap[interval.values.weatherCode as keyof typeof WeatherIconsMap];

  return {
    ...interval,
    description,
    icon: `/assets/icons/${iconName}_large@2x.png`,
  }
}
