import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, h, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Location } from '@/entities/location'
import { useForecastStore } from '@/features/forecast'
import { useGeolocation } from '@/features/geolocation'
import { useRecentSearchesStore } from '@/features/recent-searches'
import { useSearchStore } from '@/features/search'
import { ROUTE_PATHS } from '@/shared/constants'

import { useSearchPage } from './useSearchPage'

function buildLocation(overrides: Partial<Location> = {}): Location {
  return {
    id: '1',
    name: 'London',
    country: 'United Kingdom',
    admin1: 'England',
    latitude: 51.5,
    longitude: -0.13,
    timezone: 'Europe/London',
    ...overrides,
  }
}

function createFakeRouter() {
  return { push: vi.fn() }
}

function createFakeGeolocation(
  overrides: Partial<ReturnType<typeof useGeolocation>> = {},
): ReturnType<typeof useGeolocation> {
  return {
    isSupported: true,
    isLocating: ref(false),
    error: ref(null),
    hasPromptedBefore: ref(false),
    markPrompted: vi.fn(),
    requestCurrentLocation: vi.fn().mockResolvedValue(null),
    ...overrides,
  }
}

/** Mounts the composable inside a real component so onUnmounted fires, per Vue Test Utils convention. */
function mountSearchPage(options: Parameters<typeof useSearchPage>[0] = {}) {
  let result!: ReturnType<typeof useSearchPage>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useSearchPage(options)
        return () => h('div')
      },
    }),
  )
  return { wrapper, result }
}

describe('useSearchPage', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('reports "recent" status when the query is empty', () => {
    const { result } = mountSearchPage({ router: createFakeRouter() })

    expect(result.status.value).toBe('recent')
    expect(result.recentSearches.value).toEqual([])
  })

  it('does not search immediately while typing - it debounces', () => {
    const searchLocations = vi.spyOn(useSearchStore(), 'searchLocations').mockResolvedValue(undefined)
    const { result } = mountSearchPage({ router: createFakeRouter(), debounceMs: 300 })

    result.setQuery('Lon')
    expect(searchLocations).not.toHaveBeenCalled()
    expect(result.status.value).toBe('loading') // debounce window counts as loading, not stale results

    vi.advanceTimersByTime(299)
    expect(searchLocations).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(searchLocations).toHaveBeenCalledWith('Lon')
  })

  it('collapses rapid keystrokes into a single search call', () => {
    const searchLocations = vi.spyOn(useSearchStore(), 'searchLocations').mockResolvedValue(undefined)
    const { result } = mountSearchPage({ router: createFakeRouter(), debounceMs: 300 })

    result.setQuery('L')
    result.setQuery('Lo')
    result.setQuery('Lon')
    vi.advanceTimersByTime(300)

    expect(searchLocations).toHaveBeenCalledTimes(1)
    expect(searchLocations).toHaveBeenCalledWith('Lon')
  })

  it('clears suggestions immediately (no debounce) when the query is cleared', () => {
    const searchStore = useSearchStore()
    searchStore.suggestions = [buildLocation()]
    const clearSuggestions = vi.spyOn(searchStore, 'clearSuggestions')

    const { result } = mountSearchPage({ router: createFakeRouter() })
    result.setQuery('')

    expect(clearSuggestions).toHaveBeenCalled()
    expect(result.status.value).toBe('recent')
  })

  it('submits immediately (bypassing the debounce) on submit/retry', () => {
    const searchLocations = vi.spyOn(useSearchStore(), 'searchLocations').mockResolvedValue(undefined)
    const { result } = mountSearchPage({ router: createFakeRouter(), debounceMs: 300 })

    result.submitQuery('Paris')

    expect(searchLocations).toHaveBeenCalledWith('Paris')
    vi.advanceTimersByTime(300)
    expect(searchLocations).toHaveBeenCalledTimes(1) // the pending debounce (if any) was cancelled, not double-fired
  })

  it('reports "error" and exposes the store error message when the search failed', async () => {
    const searchStore = useSearchStore()
    vi.spyOn(searchStore, 'searchLocations').mockResolvedValue(undefined)
    const { result } = mountSearchPage({ router: createFakeRouter(), debounceMs: 300 })

    result.setQuery('Atlantis')
    vi.advanceTimersByTime(300) // clears the debounce-pending flag so the mocked resolution below is what decides status
    searchStore.isLoading = false
    searchStore.error = 'Failed to search locations.'
    await flushPromises()

    expect(result.status.value).toBe('error')
    expect(result.errorMessage.value).toBe('Failed to search locations.')
  })

  it('reports "empty" when the search resolved with no suggestions', async () => {
    const searchStore = useSearchStore()
    vi.spyOn(searchStore, 'searchLocations').mockResolvedValue(undefined)
    const { result } = mountSearchPage({ router: createFakeRouter(), debounceMs: 300 })

    result.setQuery('Atlantis')
    vi.advanceTimersByTime(300)
    searchStore.isLoading = false
    searchStore.suggestions = []
    await flushPromises()

    expect(result.status.value).toBe('empty')
  })

  it('reports "results" and exposes the suggestions when the search resolved with matches', async () => {
    const searchStore = useSearchStore()
    vi.spyOn(searchStore, 'searchLocations').mockResolvedValue(undefined)
    const { result } = mountSearchPage({ router: createFakeRouter(), debounceMs: 300 })

    result.setQuery('Lon')
    vi.advanceTimersByTime(300)
    searchStore.isLoading = false
    searchStore.suggestions = [buildLocation()]
    await flushPromises()

    expect(result.status.value).toBe('results')
    expect(result.suggestions.value).toHaveLength(1)
  })

  it('selecting a location sets it on the forecast store, loads the forecast, records it as recent, and navigates home', () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network disabled in tests')))
    const router = createFakeRouter()
    const { result } = mountSearchPage({ router })
    const location = buildLocation()

    result.selectLocation(location)

    expect(useForecastStore().selectedLocation).toEqual(location)
    expect(useRecentSearchesStore().recentSearches[0]?.id).toBe(location.id)
    expect(router.push).toHaveBeenCalledWith(ROUTE_PATHS.home)

    vi.unstubAllGlobals()
  })

  it('useCurrentLocation resolves a position and runs it through the select-a-location flow', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network disabled in tests')))
    const router = createFakeRouter()
    const geolocatedLocation = buildLocation({ id: 'current-location', name: 'Current Location', country: '' })
    const geolocation = createFakeGeolocation({ requestCurrentLocation: vi.fn().mockResolvedValue(geolocatedLocation) })

    const { result } = mountSearchPage({ router, geolocation })
    await result.useCurrentLocation()

    expect(useForecastStore().selectedLocation).toEqual(geolocatedLocation)
    expect(useRecentSearchesStore().recentSearches[0]?.id).toBe('current-location')
    expect(router.push).toHaveBeenCalledWith(ROUTE_PATHS.home)

    vi.unstubAllGlobals()
  })

  it('useCurrentLocation does not navigate or select anything when locating fails', async () => {
    const router = createFakeRouter()
    const geolocation = createFakeGeolocation({
      error: ref('Location permission was denied.'),
      requestCurrentLocation: vi.fn().mockResolvedValue(null),
    })

    const { result } = mountSearchPage({ router, geolocation })
    await result.useCurrentLocation()

    expect(useForecastStore().selectedLocation).toBeNull()
    expect(router.push).not.toHaveBeenCalled()
    expect(result.locationError.value).toBe('Location permission was denied.')
  })

  it('exposes isGeolocationSupported from the underlying provider', () => {
    const { result } = mountSearchPage({ router: createFakeRouter(), geolocation: createFakeGeolocation({ isSupported: false }) })

    expect(result.isGeolocationSupported).toBe(false)
  })

  it('clears recent searches', () => {
    useRecentSearchesStore().addRecentSearch(buildLocation())
    const { result } = mountSearchPage({ router: createFakeRouter() })

    expect(result.recentSearches.value).toHaveLength(1)

    result.clearRecentSearches()

    expect(result.recentSearches.value).toHaveLength(0)
  })
})
