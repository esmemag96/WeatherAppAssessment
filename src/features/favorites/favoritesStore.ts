import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { FavoriteLocation, Location } from '@/entities/location'
import { LocalStorageRepository, type StorageRepository } from '@/infrastructure/storage'

const FAVORITES_STORAGE_KEY = 'weather-app:favorites'

export interface FavoritesStoreDeps {
  storageRepository?: StorageRepository
}

/**
 * Factory so tests can inject a fake `StorageRepository`. The app uses
 * the default export below; tests call this directly with a fresh
 * Pinia instance per test.
 */
export function createFavoritesStore(deps: FavoritesStoreDeps = {}) {
  const storageRepository: StorageRepository = deps.storageRepository ?? new LocalStorageRepository()

  return defineStore('favorites', () => {
    const favorites = ref<FavoriteLocation[]>(
      storageRepository.get<FavoriteLocation[]>(FAVORITES_STORAGE_KEY) ?? [],
    )

    function persist(): void {
      storageRepository.set(FAVORITES_STORAGE_KEY, favorites.value)
    }

    function isFavorite(locationId: string): boolean {
      return favorites.value.some((favorite) => favorite.id === locationId)
    }

    function addFavorite(location: Location): void {
      if (isFavorite(location.id)) return

      const favorite: FavoriteLocation = { ...location, addedAt: new Date().toISOString() }
      favorites.value = [...favorites.value, favorite]
      persist()
    }

    function removeFavorite(locationId: string): void {
      favorites.value = favorites.value.filter((favorite) => favorite.id !== locationId)
      persist()
    }

    function moveFavorite(fromIndex: number, toIndex: number): void {
      if (fromIndex === toIndex) return
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= favorites.value.length || toIndex >= favorites.value.length) {
        return
      }

      const list = [...favorites.value]
      const [item] = list.splice(fromIndex, 1)
      if (!item) return
      list.splice(toIndex, 0, item)
      favorites.value = list
      persist()
    }

    return { favorites, addFavorite, removeFavorite, isFavorite, moveFavorite }
  })
}

export const useFavoritesStore = createFavoritesStore()
