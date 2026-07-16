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
