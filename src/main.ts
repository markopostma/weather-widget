import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";

import { TOMORROW_API_KEY, TOMORROW_API_KEY_PROVIDER } from "./app/constants";
import { WeatherWidgetComponent } from "./app/weather-widget/weather-widget.component";
import { WeatherWidgetService } from "./app/weather-widget/weather-widget.service";

console.log(process.env);

(async () => {
  const app = await createApplication({
    providers: [
      HttpXhrBackend,
      {
        provide: HttpClient,
        deps: [HttpXhrBackend]
      },
      {
        provide: TOMORROW_API_KEY_PROVIDER,
        useValue: TOMORROW_API_KEY,
      },
      WeatherWidgetService
    ],
  });

  customElements.define(
    'weather-widget',
    createCustomElement(WeatherWidgetComponent, { injector: app.injector })
  );
})();
