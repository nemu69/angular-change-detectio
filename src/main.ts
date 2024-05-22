import { enableProdMode, provideZoneChangeDetection } from '@angular/core';

import { EVENT_MANAGER_PLUGINS, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ZoneEventPlugin } from './app/zone.event-plugin';
import { provideRouter, withViewTransitions } from '@angular/router';

enableProdMode();

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZoneEventPlugin,
      multi: true,
    },
    provideZoneChangeDetection({ ignoreChangesOutsideZone: true }),
    provideRouter([], withViewTransitions({ skipInitialTransition: true })),
  ]
});
