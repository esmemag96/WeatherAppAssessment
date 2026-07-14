import { computed } from 'vue'

import type { ThemePreference } from '@/entities/settings'
import { useSettingsStore } from '@/features/settings'

/** Reads/writes theme preference via `useSettingsStore`. */
export function useTheme() {
  const settingsStore = useSettingsStore()

  const theme = computed(() => settingsStore.preferences.theme)
  const isDark = computed(() => theme.value === 'dark')

  function setTheme(nextTheme: ThemePreference): void {
    settingsStore.setTheme(nextTheme)
  }

  return { theme, isDark, setTheme }
}

/**
 * Back-compat alias for callers that think in boolean dark/light terms.
 * Theme persistence lives in `useSettingsStore` / `weather-app:settings`.
 */
export function useDarkMode() {
  const { isDark, setTheme } = useTheme()

  function setDark(dark: boolean): void {
    setTheme(dark ? 'dark' : 'light')
  }

  function toggle(): void {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return { isDark, setDark, toggle }
}
