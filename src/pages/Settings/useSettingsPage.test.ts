import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useSettingsStore } from '@/features/settings'

import { useSettingsPage } from './useSettingsPage'

describe('useSettingsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('exposes the current temperature unit from the settings store', () => {
    const { temperatureUnit } = useSettingsPage()

    expect(temperatureUnit.value).toBe('celsius')
  })

  it('setTemperatureUnit updates the settings store', () => {
    const { temperatureUnit, setTemperatureUnit } = useSettingsPage()

    setTemperatureUnit('fahrenheit')

    expect(temperatureUnit.value).toBe('fahrenheit')
    expect(useSettingsStore().units).toBe('fahrenheit')
  })

  it('persists the unit change across composable instances', () => {
    useSettingsPage().setTemperatureUnit('fahrenheit')

    const { temperatureUnit } = useSettingsPage()
    expect(temperatureUnit.value).toBe('fahrenheit')
  })

  it('exposes the current theme from the settings store', () => {
    const { theme } = useSettingsPage()

    expect(theme.value).toBe('dark')
  })

  it('setTheme updates the settings store and document class', () => {
    const { theme, setTheme } = useSettingsPage()

    setTheme('light')

    expect(theme.value).toBe('light')
    expect(useSettingsStore().preferences.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
