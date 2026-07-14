import { computed, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { Location } from '@/entities/location'
import { useForecastStore } from '@/features/forecast'
import { useGeolocation } from '@/features/geolocation'
import { useRecentSearchesStore } from '@/features/recent-searches'
import { useSearchStore } from '@/features/search'
import { ROUTE_PATHS } from '@/shared/constants'
import { debounce } from '@/shared/utils'

/** Minimal router contract this composable needs - keeps it test-injectable without a real vue-router instance. */
interface SearchPageRouter {
  push(path: string): unknown
}

export interface UseSearchPageOptions {
  router?: SearchPageRouter
  debounceMs?: number
  geolocation?: ReturnType<typeof useGeolocation>
}

export type SearchStatus = 'recent' | 'loading' | 'error' | 'empty' | 'results'

const DEFAULT_DEBOUNCE_MS = 300

/**
 * Orchestrates the Search page: owns the debounced query-to-suggestions
 * pipeline over `useSearchStore`, the "select a location" flow across
 * `useForecastStore` + `useRecentSearchesStore`, and reduces it all into
 * a single `status` the page switches on - no store/API access happens
 * in `SearchPage.vue` itself.
 */
export function useSearchPage(options: UseSearchPageOptions = {}) {
  const router: SearchPageRouter = options.router ?? useRouter()
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS

  const searchStore = useSearchStore()
  const forecastStore = useForecastStore()
  const recentSearchesStore = useRecentSearchesStore()
  const geolocation = options.geolocation ?? useGeolocation()

  const query = ref('')
  // True for the debounce window between a keystroke and the store's own
  // `isLoading` picking up - without it, stale suggestions from the
  // *previous* query would briefly render as if they belonged to the one
  // just typed.
  const isDebouncePending = ref(false)

  const debouncedSearch = debounce((value: string) => {
    isDebouncePending.value = false
    void searchStore.searchLocations(value)
  }, debounceMs)

  onUnmounted(() => {
    debouncedSearch.cancel()
  })

  function setQuery(nextQuery: string): void {
    query.value = nextQuery
    const trimmed = nextQuery.trim()

    if (!trimmed) {
      debouncedSearch.cancel()
      isDebouncePending.value = false
      searchStore.clearSuggestions()
      return
    }

    isDebouncePending.value = true
    debouncedSearch(nextQuery)
  }

  /** Bypasses the debounce - used for Enter/submit and retry, where waiting would feel unresponsive. */
  function submitQuery(value: string): void {
    debouncedSearch.cancel()
    isDebouncePending.value = false

    if (!value.trim()) {
      searchStore.clearSuggestions()
      return
    }

    void searchStore.searchLocations(value)
  }

  function clearQuery(): void {
    debouncedSearch.cancel()
    isDebouncePending.value = false
    query.value = ''
    searchStore.clearSuggestions()
  }

  function retry(): void {
    submitQuery(query.value)
  }

  const hasQuery = computed(() => query.value.trim().length > 0)
  const isLoading = computed(() => isDebouncePending.value || searchStore.isLoading)

  const status = computed<SearchStatus>(() => {
    if (!hasQuery.value) return 'recent'
    if (isLoading.value) return 'loading'
    if (searchStore.error) return 'error'
    if (searchStore.suggestions.length === 0) return 'empty'
    return 'results'
  })

  const recentSearches = computed(() => recentSearchesStore.recentSearches)

  /**
   * 1. sets the selected location + 2. loads its forecast (both handled
   * atomically by `loadForecast`), 3. records it as a recent search, then
   * 4. navigates back to the dashboard - fired-and-forget rather than
   * awaited, so the dashboard is already on screen (showing its own
   * loading state) while the fetch completes.
   */
  function selectLocation(location: Location): void {
    void forecastStore.loadForecast(location)
    recentSearchesStore.addRecentSearch(location)
    router.push(ROUTE_PATHS.home)
  }

  function clearRecentSearches(): void {
    recentSearchesStore.clearRecentSearches()
  }

  /** "Use Current Location" quick action - resolves a position, then runs the same select-a-location flow as picking a row. */
  async function useCurrentLocation(): Promise<void> {
    const location = await geolocation.requestCurrentLocation()
    if (location) selectLocation(location)
  }

  return {
    query,
    status,
    isLoading,
    errorMessage: computed(() => searchStore.error),
    suggestions: computed(() => searchStore.suggestions),
    recentSearches,
    setQuery,
    submitQuery,
    clearQuery,
    retry,
    selectLocation,
    clearRecentSearches,
    isGeolocationSupported: geolocation.isSupported,
    isLocating: geolocation.isLocating,
    locationError: geolocation.error,
    useCurrentLocation,
  }
}
