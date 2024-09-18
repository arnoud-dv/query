import { provideHttpClient, withFetch } from '@angular/common/http'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import {
  QueryClient,
  provideAngularQuery,
  withDeveloperTools,
} from '@tanstack/angular-query-experimental'

import { routes } from './app.routes'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAngularQuery(new QueryClient(), withDeveloperTools()),
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()),
  ],
}
