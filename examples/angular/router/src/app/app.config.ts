import { provideHttpClient, withFetch } from '@angular/common/http'
import { provideRouter, withComponentInputBinding } from '@angular/router'
import {
  QueryClient,
  provideAngularQuery,
  withDevtools,
} from '@tanstack/angular-query-experimental'

import { routes } from './app.routes'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAngularQuery(new QueryClient(), withDevtools()),
    provideHttpClient(withFetch()),
    provideRouter(routes, withComponentInputBinding()),
  ],
}
