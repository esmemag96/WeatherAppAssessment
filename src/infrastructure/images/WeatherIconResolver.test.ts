import { describe, expect, it } from 'vitest'

import type { WeatherCondition } from '@/entities/weather'

import { resolveConditionLabel, resolveCurrentConditionLabel, resolveCurrentWeatherIcon, resolveFavoriteAccentColor, resolveWeatherIcon, resolveWeatherIconColor } from './WeatherIconResolver'

const CONDITIONS: WeatherCondition[] = [
  'clear',
  'partly-cloudy',
  'cloudy',
  'fog',
  'rain',
  'snow',
  'thunderstorm',
  'unknown',
]

describe('resolveWeatherIcon', () => {
  it('returns a distinct Material Symbol ligature for every known condition', () => {
    const icons = CONDITIONS.map(resolveWeatherIcon)

    expect(icons).toEqual(['wb_sunny', 'filter_drama', 'cloud', 'foggy', 'rainy', 'weather_snowy', 'thunderstorm', 'help'])
    expect(new Set(icons).size).toBe(icons.length)
  })

  it('falls back to the unknown icon for an unrecognized condition', () => {
    expect(resolveWeatherIcon('not-a-real-condition' as WeatherCondition)).toBe('help')
  })
})

describe('resolveConditionLabel', () => {
  it('returns a human-readable label for every known condition', () => {
    expect(resolveConditionLabel('partly-cloudy')).toBe('Partly Cloudy')
    expect(resolveConditionLabel('thunderstorm')).toBe('Thunderstorm')
  })

  it('falls back to the unknown label for an unrecognized condition', () => {
    expect(resolveConditionLabel('not-a-real-condition' as WeatherCondition)).toBe('Unknown')
  })
})

describe('resolveWeatherIconColor', () => {
  it('gives every known condition a Tailwind text-color utility', () => {
    for (const condition of CONDITIONS) {
      expect(resolveWeatherIconColor(condition)).toMatch(/^text-/)
    }
  })

  it('uses a distinct color for warm (clear), cold (rain/snow), and severe (thunderstorm) conditions', () => {
    expect(resolveWeatherIconColor('clear')).toBe('text-tertiary')
    expect(resolveWeatherIconColor('partly-cloudy')).toBe('text-secondary')
    expect(resolveWeatherIconColor('rain')).toBe('text-primary')
    expect(resolveWeatherIconColor('snow')).toBe('text-primary-fixed')
    expect(resolveWeatherIconColor('thunderstorm')).toBe('text-error')
  })

  it('falls back to the unknown color for an unrecognized condition', () => {
    expect(resolveWeatherIconColor('not-a-real-condition' as WeatherCondition)).toBe('text-on-surface-variant')
  })
})

describe('resolveCurrentWeatherIcon', () => {
  it('uses a moon icon for clear skies at night', () => {
    expect(resolveCurrentWeatherIcon('clear', false)).toBe('bedtime')
    expect(resolveCurrentWeatherIcon('clear', true)).toBe('wb_sunny')
  })
})

describe('resolveCurrentConditionLabel', () => {
  it('labels clear night conditions explicitly', () => {
    expect(resolveCurrentConditionLabel('clear', false)).toBe('Clear Night')
    expect(resolveCurrentConditionLabel('clear', true)).toBe('Clear')
  })
})

describe('resolveFavoriteAccentColor', () => {
  it('uses secondary green for rain in the favorites list', () => {
    expect(resolveFavoriteAccentColor('rain')).toBe('text-secondary')
    expect(resolveFavoriteAccentColor('clear')).toBe('text-tertiary')
  })
})
