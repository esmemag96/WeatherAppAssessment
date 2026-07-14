import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Location, RecentSearch } from '@/entities/location'
import { LocalStorageRepository, type StorageRepository } from '@/infrastructure/storage'

const RECENT_SEARCHES_STORAGE_KEY = 'weather-app:recent-searches'
const MAX_RECENT_SEARCHES = 10

export interface RecentSearchesStoreDeps {
  storageRepository?: StorageRepository
}

/**
 * Factory so tests can inject a fake `StorageRepository`. The app uses
 * the default export below; tests call this directly with a fresh
 * Pinia instance per test.
 */
export function createRecentSearchesStore(deps: RecentSearchesStoreDeps = {}) {
  const storageRepository: StorageRepository = deps.storageRepository ?? new LocalStorageRepository()

  return defineStore('recentSearches', () => {
    const recentSearches = ref<RecentSearch[]>(
      storageRepository.get<RecentSearch[]>(RECENT_SEARCHES_STORAGE_KEY) ?? [],
    )

    function persist(): void {
      storageRepository.set(RECENT_SEARCHES_STORAGE_KEY, recentSearches.value)
    }

    /** Adds/moves a location to the front of the list, deduped by id, capped at `MAX_RECENT_SEARCHES`. */
    function addRecentSearch(location: Location): void {
      const withoutDuplicate = recentSearches.value.filter((entry) => entry.id !== location.id)
      const entry: RecentSearch = { ...location, searchedAt: new Date().toISOString() }

      recentSearches.value = [entry, ...withoutDuplicate].slice(0, MAX_RECENT_SEARCHES)
      persist()
    }

    function clearRecentSearches(): void {
      recentSearches.value = []
      persist()
    }

    return { recentSearches, addRecentSearch, clearRecentSearches }
  })
}

export const useRecentSearchesStore = createRecentSearchesStore()
