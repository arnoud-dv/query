import { beforeEach, describe, expect, vi } from 'vitest'
import { QueryClient } from '@tanstack/query-core'
import { TestBed } from '@angular/core/testing'
import { ENVIRONMENT_INITIALIZER } from '@angular/core'
import { isDevMode } from '../util/is-dev-mode/is-dev-mode'
import { provideAngularQuery, withDevtools } from '../providers'
import type { Mock } from 'vitest'

vi.mock('../util/is-dev-mode/is-dev-mode', () => ({
  isDevMode: vi.fn(),
}))

const mockDevtoolsInstance = {
  mount: vi.fn(),
  unmount: vi.fn(),
}

const mockTanstackQueryDevtools = vi.fn(() => mockDevtoolsInstance)

vi.mock('@tanstack/query-devtools', () => ({
  TanstackQueryDevtools: mockTanstackQueryDevtools,
}))

describe('withDevtools feature', () => {
  let isDevModeMock: Mock

  beforeEach(() => {
    vi.useFakeTimers()
    isDevModeMock = isDevMode as Mock
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('by default provides developer tools in development mode', async () => {
    isDevModeMock.mockReturnValue(true)

    TestBed.configureTestingModule({
      providers: [provideAngularQuery(new QueryClient(), withDevtools())],
    })

    TestBed.inject(ENVIRONMENT_INITIALIZER)
    await vi.runAllTimersAsync()
    expect(mockTanstackQueryDevtools).toHaveBeenCalled()
  })

  test('by default does not provide developer tools in production mode', async () => {
    isDevModeMock.mockReturnValue(false)

    TestBed.configureTestingModule({
      providers: [provideAngularQuery(new QueryClient(), withDevtools())],
    })

    TestBed.inject(ENVIRONMENT_INITIALIZER)
    await vi.runAllTimersAsync()
    expect(mockTanstackQueryDevtools).not.toHaveBeenCalled()
  })

  test('provides developer tools in production mode when QUERY_DEV_TOOLS (TODO: change name) is true', () => {})
})
