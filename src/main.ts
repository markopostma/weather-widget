import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";

import { TOMORROW_API_KEY_PROVIDER } from "./app/constants";
import { WeatherWidgetComponent } from "./app/weather-widget/weather-widget.component";
import { WeatherWidgetService } from "./app/weather-widget/weather-widget.service";

(async () => {
  const app = await createApplication({
    providers: [
      // Root providers
      // ...
    ],
  });

  customElements.define(
    'weather-widget',
    createCustomElement(WeatherWidgetComponent, { injector: app.injector })
  );
})();
