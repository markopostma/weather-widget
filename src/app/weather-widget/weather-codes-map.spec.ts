import { WeatherIconsMap } from './weather-codes-map';

// A simple test to verify the existance of the icons declared in the object.
// Nodes' FS package can't be used because it runs in the browser.
describe('WeatherIconsMap', () => {

  for (let key in WeatherIconsMap) {
    it(`WeatherIconsMap[${key}] leads to an existing destination`, (done) => {
      const iconName = WeatherIconsMap[Number(key) as keyof typeof WeatherIconsMap];
      const iconPath = `/assets/icons/${iconName}_large@2x.png`;
      const image = document.createElement('img');

      image.onload = () => {
        // it was successful in this specific case, forcing the expectation to succeed
        expect(true).toBeTruthy();
        done();
      };
      image.onerror = () => {
        // the image could not be found, forcing the expectation to fail
        expect(false).toBeTruthy();
        done();
      };
      image.src = iconPath;
    });
  }

});
