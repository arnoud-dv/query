import {
  DestroyRef,
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
} from '@angular/core'
import { onlineManager } from '@tanstack/query-core'
import { DOCUMENT } from '@angular/common'
import { QUERY_CLIENT, provideQueryClient } from './inject-query-client'
import { isDevMode } from './util/is-dev-mode/is-dev-mode'
import type { QueryClient } from '@tanstack/query-core'
import type { EnvironmentProviders, Provider } from '@angular/core'
import type {
  DevtoolsButtonPosition,
  DevtoolsErrorType,
  DevtoolsPosition,
} from '@tanstack/query-devtools'

// TODO: add possibility to set dev tools options after rendering,
// e.g. `injectDevtoolsOptions`, should work with signals
// consider dev tools panel to replace component, e.g. `injectDevToolsPanel`

/**
 * Sets up providers necessary to enable TanStack Query functionality for Angular applications.
 *
 * Allows to configure a `QueryClient`.
 *
 * **Example - standalone**
 *
 * ```ts
 * import {
 *   provideAngularQuery,
 *   QueryClient,
 * } from '@tanstack/angular-query-experimental'
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [provideAngularQuery(new QueryClient())],
 * })
 * ```
 *
 * **Example - NgModule-based**
 *
 * ```ts
 * import {
 *   provideAngularQuery,
 *   QueryClient,
 * } from '@tanstack/angular-query-experimental'
 *
 * @NgModule({
 *   declarations: [AppComponent],
 *   imports: [BrowserModule],
 *   providers: [provideAngularQuery(new QueryClient())],
 *   bootstrap: [AppComponent],
 * })
 * export class AppModule {}
 * ```
 *
 * You can also enable optional developer tools by adding `withDeveloperTools`. By
 * default the tools will then be loaded when your app is in development mode.
 * ```ts
 * import {
 *   provideAngularQuery,
 *   withDeveloperTools
 *   QueryClient,
 * } from '@tanstack/angular-query-experimental'
 *
 * bootstrapApplication(AppComponent,
 *   {
 *     providers: [
 *       provideAngularQuery(new QueryClient(), withDeveloperTools())
 *     ]
 *   }
 * )
 * ```
 *
 * @param queryClient - A `QueryClient` instance.
 * @param features - Optional features to configure additional Query functionality.
 * @returns A set of providers to set up TanStack Query.
 * @public
 * @see https://tanstack.com/query/v5/docs/framework/angular/quick-start
 * @see withDeveloperTools
 */
export function provideAngularQuery(
  queryClient: QueryClient,
  ...features: Array<QueryFeatures>
): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideQueryClient(queryClient),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        queryClient.mount()
        // Unmount the query client on application destroy
        inject(DestroyRef).onDestroy(() => queryClient.unmount())
      },
    },
    features.map((feature) => feature.ɵproviders),
  ])
}

/**
 * Helper type to represent a Query feature.
 * @public
 */
export interface QueryFeature<TFeatureKind extends QueryFeatureKind> {
  ɵkind: TFeatureKind
  ɵproviders: Array<Provider>
}

/**
 * Helper function to create an object that represents a Query feature.
 * @param kind -
 * @param providers -
 */
function queryFeature<TFeatureKind extends QueryFeatureKind>(
  kind: TFeatureKind,
  providers: Array<Provider>,
): QueryFeature<TFeatureKind> {
  return { ɵkind: kind, ɵproviders: providers }
}

/**
 * A type alias that represents a feature which enables developer tools.
 * The type is used to describe the return value of the `withDeveloperTools` function.
 * @public
 * @see {@link withDeveloperTools}
 */
export type DeveloperToolsFeature =
  QueryFeature<QueryFeatureKind.DeveloperToolsFeature>

/**
 * Options for configuring the TanStack Query devtools.
 * @public
 */
export interface DeveloperToolsOptions {
  /**
   * Set this true if you want the dev tools to default to being open
   */
  initialIsOpen?: boolean
  /**
   * The position of the TanStack logo to open and close the devtools panel.
   * `top-left` | `top-right` | `bottom-left` | `bottom-right` | `relative`
   * Defaults to `bottom-right`.
   */
  buttonPosition?: DevtoolsButtonPosition
  /**
   * The position of the TanStack Query devtools panel.
   * `top` | `bottom` | `left` | `right`
   * Defaults to `bottom`.
   */
  position?: DevtoolsPosition
  /**
   * Custom instance of QueryClient
   */
  client?: QueryClient
  /**
   * Use this so you can define custom errors that can be shown in the devtools.
   */
  errorTypes?: Array<DevtoolsErrorType>
  /**
   * Use this to pass a nonce to the style tag that is added to the document head. This is useful if you are using a Content Security Policy (CSP) nonce to allow inline styles.
   */
  styleNonce?: string
  /**
   * Use this so you can attach the devtool's styles to a specific element in the DOM.
   */
  shadowDOMTarget?: ShadowRoot

  /**
   * Whether developer tools are loaded.
   * * `enabledInDevelopmentMode`- (Default) Lazily loads developer tools when in development mode. Skips loading in production mode.
   * * `enabled`- Lazily loads the developer tools in both production and development mode.
   * * `disabled`- Does not load developer tools.

   * You can use `enabled` and `disabled` to override loading developer tools from an environment file.
   * For example, a test environment might run in production mode but you may want to enable developer tools.
   */
  loadDeveloperTools?: 'enabledInDevelopmentMode' | 'enabled' | 'disabled'
}

/**
 * Adds developer tools.
 * @param options
 * @see `provideAngularQuery`
 */

/**
 * Enables developer tools.
 *
 * **Example**
 *
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideAngularQuery(new QueryClient(), withDeveloperTools())
 *   ]
 * }
 * ```
 *
 * @see {@link provideAngularQuery}
 * @public
 * @param options Set of configuration parameters to customize scrolling behavior, see
 *     `InMemoryScrollingOptions` for additional information.
 * @returns A set of providers for use with `provideAngularQuery`.
 */
export function withDeveloperTools(
  options: DeveloperToolsOptions = {},
): DeveloperToolsFeature {
  let providers: Array<Provider> = []
  if (
    (isDevMode() && options.loadDeveloperTools !== 'disabled') ||
    options.loadDeveloperTools === 'enabled'
  ) {
    providers = [
      {
        provide: ENVIRONMENT_INITIALIZER,
        multi: true,
        useFactory: () => {
          return () => {
            const doc = inject(DOCUMENT)
            const destroyRef = inject(DestroyRef)
            const el = doc.body.appendChild(document.createElement('div'))
            el.classList.add('tsqd-parent-container')
            const client = inject(QUERY_CLIENT)
            import('@tanstack/query-devtools').then((queryDevtools) => {
              const devtools = new queryDevtools.TanstackQueryDevtools({
                ...options,
                client,
                queryFlavor: 'Angular Query',
                version: '5',
                onlineManager,
              })
              destroyRef.onDestroy(() => devtools.unmount())
              devtools.mount(el)
            })
          }
        },
      },
    ]
  } else {
    providers = []
  }
  return queryFeature(QueryFeatureKind.DeveloperToolsFeature, providers)
}

/**
 * A type alias that represents all Query features available for use with `provideAngularQuery`.
 * Features can be enabled by adding special functions to the `provideAngularQuery` call.
 * See documentation for each symbol to find corresponding function name. See also `provideAngularQuery`
 * documentation on how to use those functions.
 * @public
 * @see {@link provideAngularQuery}
 */
export type QueryFeatures = DeveloperToolsFeature // Union type of features but just one now

export const enum QueryFeatureKind {
  DeveloperToolsFeature,
}
