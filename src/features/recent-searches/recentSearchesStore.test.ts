import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { Location } from '@/entities/location'
import type { StorageRepository } from '@/infrastructure/storage'

import { createRecentSearchesStore } from './recentSearchesStore'

function createFakeStorageRepository(): StorageRepository {
  const store = new Map<string, unknown>()
  return {
    get<T>(key: string): T | null {
      return store.has(key) ? (store.get(key) as T) : null
    },
    set<T>(key: string, value: T): void {
      store.set(key, value)
    },
    remove(key: string): void {
      store.delete(key)
    },
  }
}

function buildLocation(overrides: Partial<Location> = {}): Location {
  return {
    id: '1',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5,
    longitude: -0.13,
    timezone: 'Europe/London',
    ...overrides,
  }
}

describe('useRecentSearchesStore', () => {
  let storageRepository: StorageRepository

  beforeEach(() => {
    setActivePinia(createPinia())
    storageRepository = createFakeStorageRepository()
  })

  it('starts empty when nothing is persisted', () => {
    const useStore = createRecentSearchesStore({ storageRepository })
    const store = useStore()

    expect(store.recentSearches).toEqual([])
  })

  it('loads previously persisted recent searches on init', () => {
    storageRepository.set('weather-app:recent-searches', [{ ...buildLocation(), searchedAt: '2026-01-01T00:00:00.000Z' }])

    const useStore = createRecentSearchesStore({ storageRepository })
    const store = useStore()

    expect(store.recentSearches).toHaveLength(1)
    expect(store.recentSearches[0]?.id).toBe('1')
  })

  it('adds a recent search with a searchedAt timestamp, most-recent-first', () => {
    const useStore = createRecentSearchesStore({ storageRepository })
    const store = useStore()

    store.addRecentSearch(buildLocation({ id: '1' }))
    store.addRecentSearch(buildLocation({ id: '2', name: 'Paris' }))

    expect(store.recentSearches.map((entry) => entry.id)).toEqual(['2', '1'])
    expect(typeof store.recentSearches[0]?.searchedAt).toBe('string')
  })

  it('moves an existing entry to the front instead of duplicating it', () => {
    const useStore = createRecentSearchesStore({ storageRepository })
    const store = useStore()

    store.addRecentSearch(buildLocation({ id: '1' }))
    store.addRecentSearch(buildLocation({ id: '2', name: 'Paris' }))
    store.addRecentSearch(buildLocation({ id: '1' }))

    expect(store.recentSearches.map((entry) => entry.id)).toEqual(['1', '2'])
  })

  it('caps the list at 10 entries, dropping the oldest', () => {
    const useStore = createRecentSearchesStore({ storageRepository })
    const store = useStore()

    for (let i = 0; i < 12; i += 1) {
      store.addRecentSearch(buildLocation({ id: String(i) }))
    }

    expect(store.recentSearches).toHaveLength(10)
    expect(store.recentSearches[0]?.id).toBe('11')
    expect(store.recentSearches.map((entry) => entry.id)).not.toContain('0')
  })

  it('persists added searches to storage', () => {
    const useStore = createRecentSearchesStore({ storageRepository })
    const store = useStore()

    store.addRecentSearch(buildLocation())

    expect(storageRepository.get('weather-app:recent-searches')).toHaveLength(1)
  })

  it('clears all recent searches', () => {
    const useStore = createRecentSearchesStore({ storageRepository })
    const store = useStore()

    store.addRecentSearch(buildLocation())
    store.clearRecentSearches()

    expect(store.recentSearches).toEqual([])
    expect(storageRepository.get('weather-app:recent-searches')).toEqual([])
  })
})
