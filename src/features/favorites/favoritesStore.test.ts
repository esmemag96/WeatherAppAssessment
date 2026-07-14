import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { Location } from '@/entities/location'
import type { StorageRepository } from '@/infrastructure/storage'

import { createFavoritesStore } from './favoritesStore'

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

describe('useFavoritesStore', () => {
  let storageRepository: StorageRepository

  beforeEach(() => {
    setActivePinia(createPinia())
    storageRepository = createFakeStorageRepository()
  })

  it('starts empty when nothing is persisted', () => {
    const useStore = createFavoritesStore({ storageRepository })
    const store = useStore()

    expect(store.favorites).toEqual([])
  })

  it('loads previously persisted favorites on init', () => {
    storageRepository.set('weather-app:favorites', [{ ...buildLocation(), addedAt: '2026-01-01T00:00:00.000Z' }])

    const useStore = createFavoritesStore({ storageRepository })
    const store = useStore()

    expect(store.favorites).toHaveLength(1)
    expect(store.favorites[0]?.id).toBe('1')
  })

  it('adds a favorite with an addedAt timestamp', () => {
    const useStore = createFavoritesStore({ storageRepository })
    const store = useStore()

    store.addFavorite(buildLocation())

    expect(store.favorites).toHaveLength(1)
    expect(store.favorites[0]?.id).toBe('1')
    expect(typeof store.favorites[0]?.addedAt).toBe('string')
  })

  it('does not add the same location twice', () => {
    const useStore = createFavoritesStore({ storageRepository })
    const store = useStore()

    store.addFavorite(buildLocation())
    store.addFavorite(buildLocation())

    expect(store.favorites).toHaveLength(1)
  })

  it('persists added favorites to storage', () => {
    const useStore = createFavoritesStore({ storageRepository })
    const store = useStore()

    store.addFavorite(buildLocation())

    const persisted = storageRepository.get('weather-app:favorites')
    expect(persisted).toHaveLength(1)
  })

  it('removes a favorite by id', () => {
    const useStore = createFavoritesStore({ storageRepository })
    const store = useStore()

    store.addFavorite(buildLocation({ id: '1' }))
    store.addFavorite(buildLocation({ id: '2' }))
    store.removeFavorite('1')

    expect(store.favorites.map((favorite) => favorite.id)).toEqual(['2'])
  })

  it('persists after removing a favorite', () => {
    const useStore = createFavoritesStore({ storageRepository })
    const store = useStore()

    store.addFavorite(buildLocation({ id: '1' }))
    store.removeFavorite('1')

    expect(storageRepository.get('weather-app:favorites')).toEqual([])
  })

  it('reports whether a location is favorited', () => {
    const useStore = createFavoritesStore({ storageRepository })
    const store = useStore()

    expect(store.isFavorite('1')).toBe(false)

    store.addFavorite(buildLocation({ id: '1' }))

    expect(store.isFavorite('1')).toBe(true)
    expect(store.isFavorite('2')).toBe(false)
  })

  it('moveFavorite reorders favorites and persists the new order', () => {
    const useStore = createFavoritesStore({ storageRepository })
    const store = useStore()

    store.addFavorite(buildLocation({ id: '1', name: 'London' }))
    store.addFavorite(buildLocation({ id: '2', name: 'Paris' }))
    store.addFavorite(buildLocation({ id: '3', name: 'Tokyo' }))

    store.moveFavorite(0, 2)

    expect(store.favorites.map((favorite) => favorite.id)).toEqual(['2', '3', '1'])
    expect(storageRepository.get<{ id: string }[]>('weather-app:favorites')?.map((favorite) => favorite.id)).toEqual([
      '2',
      '3',
      '1',
    ])
  })

  it('moveFavorite is a no-op for out-of-range or identical indices', () => {
    const useStore = createFavoritesStore({ storageRepository })
    const store = useStore()

    store.addFavorite(buildLocation({ id: '1' }))
    store.addFavorite(buildLocation({ id: '2' }))

    store.moveFavorite(0, 0)
    store.moveFavorite(-1, 1)
    store.moveFavorite(0, 5)

    expect(store.favorites.map((favorite) => favorite.id)).toEqual(['1', '2'])
  })
})
