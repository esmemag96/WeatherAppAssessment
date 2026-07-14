import type { ThemePreference } from '@/entities/settings'

export const SETTINGS_STORAGE_KEY = 'weather-app:settings'

const THEME_COLOR: Record<ThemePreference, string> = {
  dark: '#111317',
  light: '#b8daf5',
}

/** Applies the `.dark` class and browser chrome color for the given theme. */
export function applyTheme(theme: ThemePreference): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
}

/** Reads the persisted theme before Vue boots (also used by index.html). */
export function readStoredTheme(): ThemePreference {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return 'dark'

    const parsed = JSON.parse(raw) as { theme?: ThemePreference }
    return parsed.theme === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}
