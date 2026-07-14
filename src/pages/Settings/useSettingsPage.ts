import { computed } from 'vue'

import type { TemperatureUnit, ThemePreference } from '@/entities/settings'
import { useSettingsStore } from '@/features/settings'

/**
 * Orchestrates the Settings page: reads/writes `useSettingsStore` so
 * `SettingsPage.vue` stays composition-only, same as every other page.
 */
export function useSettingsPage() {
  const settingsStore = useSettingsStore()

  const temperatureUnit = computed(() => settingsStore.units)
  const theme = computed(() => settingsStore.preferences.theme)

  function setTemperatureUnit(unit: TemperatureUnit): void {
    settingsStore.setUnits(unit)
  }

  function setTheme(nextTheme: ThemePreference): void {
    settingsStore.setTheme(nextTheme)
  }

  return {
    temperatureUnit,
    theme,
    setTemperatureUnit,
    setTheme,
  }
}
