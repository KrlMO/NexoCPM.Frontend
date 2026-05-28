import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { API_URL } from './core/config/api.config';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { Auth } from './features/auth/services/auth.service';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: API_URL, useValue: 'https://localhost:7019/api' },
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: Auth) => () => auth.initAuth().toPromise(),
      deps: [Auth],
      multi: true,
    },
    provideCharts(withDefaultRegisterables()),
  ],
};
