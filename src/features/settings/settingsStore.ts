import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { DEFAULT_USER_PREFERENCES, type TemperatureUnit, type ThemePreference, type UserPreferences } from '@/entities/settings'
import { LocalStorageRepository, type StorageRepository } from '@/infrastructure/storage'
import { applyTheme, SETTINGS_STORAGE_KEY } from '@/shared/utils/theme'

export interface SettingsStoreDeps {
  storageRepository?: StorageRepository
}

/**
 * Factory so tests can inject a fake `StorageRepository`. The app uses
 * the default export below; tests call this directly with a fresh
 * Pinia instance per test.
 */
export function createSettingsStore(deps: SettingsStoreDeps = {}) {
  const storageRepository: StorageRepository = deps.storageRepository ?? new LocalStorageRepository()

  return defineStore('settings', () => {
    const preferences = ref<UserPreferences>(
      storageRepository.get<UserPreferences>(SETTINGS_STORAGE_KEY) ?? { ...DEFAULT_USER_PREFERENCES },
    )

    applyTheme(preferences.value.theme)

    const units = computed(() => preferences.value.temperatureUnit)

    function persist(): void {
      storageRepository.set(SETTINGS_STORAGE_KEY, preferences.value)
    }

    function setUnits(nextUnits: TemperatureUnit): void {
      preferences.value = { ...preferences.value, temperatureUnit: nextUnits }
      persist()
    }

    function setTheme(theme: ThemePreference): void {
      preferences.value = { ...preferences.value, theme }
      persist()
      applyTheme(theme)
    }

    return { preferences, units, setUnits, setTheme }
  })
}

export const useSettingsStore = createSettingsStore()
