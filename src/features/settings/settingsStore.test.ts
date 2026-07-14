import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { DEFAULT_USER_PREFERENCES, type UserPreferences } from '@/entities/settings'
import type { StorageRepository } from '@/infrastructure/storage'
import { SETTINGS_STORAGE_KEY } from '@/shared/utils/theme'

import { createSettingsStore } from './settingsStore'

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

describe('useSettingsStore', () => {
  let storageRepository: StorageRepository

  beforeEach(() => {
    setActivePinia(createPinia())
    storageRepository = createFakeStorageRepository()
  })

  it('defaults to celsius when nothing is persisted', () => {
    const useStore = createSettingsStore({ storageRepository })
    const store = useStore()

    expect(store.units).toBe('celsius')
    expect(store.preferences).toEqual(DEFAULT_USER_PREFERENCES)
  })

  it('loads previously persisted preferences on init', () => {
    const persisted: UserPreferences = { temperatureUnit: 'fahrenheit', windSpeedUnit: 'mph', theme: 'dark' }
    storageRepository.set(SETTINGS_STORAGE_KEY, persisted)

    const useStore = createSettingsStore({ storageRepository })
    const store = useStore()

    expect(store.units).toBe('fahrenheit')
  })

  it('setUnits updates the units and preserves other preferences', () => {
    const useStore = createSettingsStore({ storageRepository })
    const store = useStore()

    store.setUnits('fahrenheit')

    expect(store.units).toBe('fahrenheit')
    expect(store.preferences.windSpeedUnit).toBe(DEFAULT_USER_PREFERENCES.windSpeedUnit)
    expect(store.preferences.theme).toBe(DEFAULT_USER_PREFERENCES.theme)
  })

  it('persists the updated units to storage', () => {
    const useStore = createSettingsStore({ storageRepository })
    const store = useStore()

    store.setUnits('fahrenheit')

    const persisted = storageRepository.get<UserPreferences>(SETTINGS_STORAGE_KEY)
    expect(persisted?.temperatureUnit).toBe('fahrenheit')
  })

  it('can switch back to celsius', () => {
    const useStore = createSettingsStore({ storageRepository })
    const store = useStore()

    store.setUnits('fahrenheit')
    store.setUnits('celsius')

    expect(store.units).toBe('celsius')
  })

  it('setTheme updates the theme preference and applies it to the document', () => {
    const useStore = createSettingsStore({ storageRepository })
    const store = useStore()

    store.setTheme('light')

    expect(store.preferences.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    store.setTheme('dark')

    expect(store.preferences.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('persists the updated theme to storage', () => {
    const useStore = createSettingsStore({ storageRepository })
    const store = useStore()

    store.setTheme('light')

    const persisted = storageRepository.get<UserPreferences>(SETTINGS_STORAGE_KEY)
    expect(persisted?.theme).toBe('light')
  })
})
