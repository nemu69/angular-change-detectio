import { enableProdMode, provideExperimentalZonelessChangeDetection, provideZoneChangeDetection, signal } from '@angular/core';

import { EVENT_MANAGER_PLUGINS, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ZoneEventPlugin } from './app/zone.event-plugin';
import { provideRouter, withViewTransitions } from '@angular/router';

export const ENABLE_ZONELESS = 'ENABLE_ZONELESS';

enableProdMode();

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZoneEventPlugin,
      multi: true,
    },
    localStorage.getItem(ENABLE_ZONELESS) === "1" ? provideExperimentalZonelessChangeDetection() : provideZoneChangeDetection({ ignoreChangesOutsideZone: true, eventCoalescing: true, }),
    provideRouter([], withViewTransitions({ skipInitialTransition: true })),
  ]
});
