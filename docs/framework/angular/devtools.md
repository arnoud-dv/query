---
id: devtools
title: Devtools
---

## Enable developer tools

The developer tools help you debug and inspect your queries and mutations. You can enable the developer tools by adding `withDeveloperTools` to `provideAngularQuery`.

By default, the developer tools are enabled when Angular [`isDevMode`](https://angular.dev/api/core/isDevMode) returns true. So you don't need to worry about excluding them during a production build. The tools are lazily loaded and not included in bundled code.

```ts
import {
  QueryClient,
  provideAngularQuery,
  withDeveloperTools,
} from '@tanstack/angular-query-experimental'

export const appConfig: ApplicationConfig = {
  providers: [provideAngularQuery(new QueryClient(), withDeveloperTools())],
}
```

## Overriding if developer tools are loaded

If you want more control over if the developer tools are loaded, you can use the `loadDeveloperTools` option. This is useful when you want to load development tools based on [environment configurations](https://angular.dev/tools/cli/environments#).
For example, you may have a test environment that is running in production mode but you want developer tools to be available.

When not setting the option or setting it to 'enabledInDevelopmentMode', the developer tools will be loaded when Angular is in development mode.

```ts
provideAngularQuery(new QueryClient(), withDeveloperTools())

// which is equivalent to
provideAngularQuery(
  new QueryClient(),
  withDeveloperTools({ loadDeveloperTools: 'enabledInDevelopmentMode' }),
)
```

When setting the option to 'enabled', the developer tools will be loaded in both development and production mode.

```ts
provideAngularQuery(
  new QueryClient(),
  withDeveloperTools({ loadDeveloperTools: 'enabled' }),
)
```

When setting the option to 'disabled', the developer tools will not be loaded.

```ts
provideAngularQuery(
  new QueryClient(),
  withDeveloperTools({ loadDeveloperTools: 'disabled' }),
)
```

## TODO: Add more details and examples about Angular environment configurations

### Options

- `initialIsOpen: Boolean`
  - Set this `true` if you want the dev tools to default to being open
- `buttonPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "relative"`
  - Defaults to `bottom-right`
  - The position of the TanStack logo to open and close the devtools panel
  - If `relative`, the button is placed in the location that you render the devtools.
- `position?: "top" | "bottom" | "left" | "right"`
  - Defaults to `bottom`
  - The position of the Angular Query devtools panel
- `client?: QueryClient`,
  - Use this to use a custom QueryClient. Otherwise, the QueryClient provided through provideAngularQuery() will be injected.
- `errorTypes?: { name: string; initializer: (query: Query) => TError}`
  - Use this to predefine some errors that can be triggered on your queries. Initializer will be called (with the specific query) when that error is toggled on from the UI. It must return an Error.
- `styleNonce?: string`
  - Use this to pass a nonce to the style tag that is added to the document head. This is useful if you are using a Content Security Policy (CSP) nonce to allow inline styles.
- `shadowDOMTarget?: ShadowRoot`
  - Default behavior will apply the devtool's styles to the head tag within the DOM.
  - Use this to pass a shadow DOM target to the devtools so that the styles will be applied within the shadow DOM instead of within the head tag in the light DOM.
