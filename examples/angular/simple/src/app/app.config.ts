import { provideHttpClient, withFetch } from '@angular/common/http'
import {
  QueryClient,
  provideAngularQuery,
  withDeveloperTools,
} from '@tanstack/angular-query-experimental'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAngularQuery(new QueryClient(), withDeveloperTools()),
    provideHttpClient(withFetch()),
  ],
}
