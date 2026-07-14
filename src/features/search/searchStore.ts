import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Location } from '@/entities/location'
import { OpenMeteoWeatherAdapter, type WeatherRepository } from '@/infrastructure/weather'
import { toErrorMessage } from '@/shared/utils'

export interface SearchStoreDeps {
  weatherRepository?: WeatherRepository
}

/**
 * Factory so tests can inject a fake `WeatherRepository` instead of the
 * real `OpenMeteoWeatherAdapter`. The app uses the default export below;
 * tests call this directly with a fresh Pinia instance per test.
 */
export function createSearchStore(deps: SearchStoreDeps = {}) {
  const weatherRepository: WeatherRepository = deps.weatherRepository ?? new OpenMeteoWeatherAdapter()

  return defineStore('search', () => {
    const query = ref('')
    const suggestions = ref<Location[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function searchLocations(nextQuery: string): Promise<void> {
      query.value = nextQuery
      error.value = null

      const trimmedQuery = nextQuery.trim()
      if (!trimmedQuery) {
        suggestions.value = []
        return
      }

      isLoading.value = true
      try {
        suggestions.value = await weatherRepository.searchLocations(trimmedQuery)
      } catch (cause) {
        suggestions.value = []
        error.value = toErrorMessage(cause, 'Failed to search locations.')
      } finally {
        isLoading.value = false
      }
    }

    function clearSuggestions(): void {
      suggestions.value = []
    }

    return { query, suggestions, isLoading, error, searchLocations, clearSuggestions }
  })
}

export const useSearchStore = createSearchStore()
