import { beforeEach, describe, expect, it } from 'vitest'

import { applyTheme, readStoredTheme, SETTINGS_STORAGE_KEY } from './theme'

describe('applyTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    if (!document.querySelector('meta[name="theme-color"]')) {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'theme-color')
      document.head.appendChild(meta)
    }
  })

  it('adds the dark class and updates theme-color meta for dark mode', () => {
    applyTheme('dark')

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#111317')
  })

  it('removes the dark class and updates theme-color meta for light mode', () => {
    document.documentElement.classList.add('dark')

    applyTheme('light')

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#b8daf5')
  })
})

describe('readStoredTheme', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to dark when nothing is persisted', () => {
    expect(readStoredTheme()).toBe('dark')
  })

  it('reads the theme from persisted settings', () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ theme: 'light' }))

    expect(readStoredTheme()).toBe('light')
  })

  it('falls back to dark for invalid persisted data', () => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, 'not-json')

    expect(readStoredTheme()).toBe('dark')
  })
})
