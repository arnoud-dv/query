import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http'
import {
  QueryClient,
  provideAngularQuery,
  withDevtools,
} from '@tanstack/angular-query-experimental'
import { projectsMockInterceptor } from './api/projects-mock.interceptor'
import type { ApplicationConfig } from '@angular/core'

export const appConfig: ApplicationConfig = {
  providers: [
    provideAngularQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
          },
        },
      }),
      withDevtools(),
    ),
    provideHttpClient(withInterceptors([projectsMockInterceptor]), withFetch()),
  ],
}
