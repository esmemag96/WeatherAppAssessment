import { onMounted, ref, type Ref } from 'vue'

import type { ThemePreference } from '@/entities/settings'

const STORAGE_KEY = 'artifacts:theme:v2'

function readStored(): ThemePreference {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function persist(theme: ThemePreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore quota errors
  }
}

/** Artifacts-page theme — defaults to dark (Stitch mockup), independent from the weather app theme. */
export function useArtifactsTheme(): {
  isDark: Ref<boolean>
  toggle: () => void
  setTheme: (theme: ThemePreference) => void
} {
  const isDark = ref(readStored() === 'dark')

  function setTheme(theme: ThemePreference): void {
    isDark.value = theme === 'dark'
    persist(theme)
  }

  function toggle(): void {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  onMounted(() => {
    isDark.value = readStored() === 'dark'
  })

  return { isDark, toggle, setTheme }
}
