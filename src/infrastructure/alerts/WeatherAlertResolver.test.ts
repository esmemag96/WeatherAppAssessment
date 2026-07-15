import { describe, expect, it } from 'vitest'

import type { CurrentWeather, DailyForecast } from '@/entities/weather'

import { resolveWeatherAlerts } from './WeatherAlertResolver'

function buildCurrent(overrides: Partial<CurrentWeather> = {}): CurrentWeather {
  return {
    temperatureC: 20,
    feelsLikeC: 20,
    dewPointC: 12,
    condition: 'clear',
    humidityPercent: 50,
    windSpeedKph: 10,
    windDirectionDeg: 180,
    visibilityMeters: 16000,
    isDay: true,
    observedAt: '2026-10-14T12:00',
    ...overrides,
  }
}

function buildDaily(overrides: Partial<DailyForecast> = {}): DailyForecast {
  return {
    date: '2026-10-14',
    minTemperatureC: 12,
    maxTemperatureC: 22,
    condition: 'clear',
    precipitationChancePercent: 10,
    ...overrides,
  }
}

describe('resolveWeatherAlerts', () => {
  it('returns no alerts for unremarkable conditions', () => {
    expect(resolveWeatherAlerts(buildCurrent(), buildDaily())).toEqual([])
  })

  it('returns a moderate heat advisory at the 32C threshold and severe at 38C', () => {
    const [moderate] = resolveWeatherAlerts(buildCurrent(), buildDaily({ maxTemperatureC: 32 }))
    expect(moderate?.severity).toBe('moderate')
    expect(moderate?.kind).toBe('heat')

    const [severe] = resolveWeatherAlerts(buildCurrent(), buildDaily({ maxTemperatureC: 38 }))
    expect(severe?.severity).toBe('severe')
    expect(severe?.title).toContain('Extreme Heat')
  })

  it('returns a moderate cold advisory at 0C and severe at -10C', () => {
    const [moderate] = resolveWeatherAlerts(buildCurrent(), buildDaily({ minTemperatureC: 0 }))
    expect(moderate?.severity).toBe('moderate')
    expect(moderate?.kind).toBe('cold')

    const [severe] = resolveWeatherAlerts(buildCurrent(), buildDaily({ minTemperatureC: -10 }))
    expect(severe?.severity).toBe('severe')
    expect(severe?.title).toContain('Extreme Cold')
  })

  it('returns a severe storm warning whenever the current condition is a thunderstorm', () => {
    const [alert] = resolveWeatherAlerts(buildCurrent({ condition: 'thunderstorm' }), buildDaily())
    expect(alert?.kind).toBe('storm')
    expect(alert?.severity).toBe('severe')
  })

  it('returns a wind advisory at 40 km/h and a warning at 60 km/h', () => {
    const [moderate] = resolveWeatherAlerts(buildCurrent({ windSpeedKph: 40 }), buildDaily())
    expect(moderate?.severity).toBe('moderate')
    expect(moderate?.kind).toBe('wind')

    const [severe] = resolveWeatherAlerts(buildCurrent({ windSpeedKph: 60 }), buildDaily())
    expect(severe?.severity).toBe('severe')
  })

  it('returns a heavy rain advisory only when the condition is rain AND chance is at least 80%', () => {
    const noAlert = resolveWeatherAlerts(
      buildCurrent(),
      buildDaily({ condition: 'rain', precipitationChancePercent: 50 }),
    )
    expect(noAlert).toEqual([])

    const [alert] = resolveWeatherAlerts(
      buildCurrent(),
      buildDaily({ condition: 'rain', precipitationChancePercent: 80 }),
    )
    expect(alert?.kind).toBe('rain')
  })

  it('sorts severe alerts before moderate ones', () => {
    const alerts = resolveWeatherAlerts(
      buildCurrent({ windSpeedKph: 60 }),
      buildDaily({ maxTemperatureC: 32 }),
    )
    expect(alerts.map((a) => a.kind)).toEqual(['wind', 'heat'])
    expect(alerts[0]?.severity).toBe('severe')
  })

  it('skips daily-based alerts when no daily forecast is available', () => {
    expect(resolveWeatherAlerts(buildCurrent({ windSpeedKph: 5 }), undefined)).toEqual([])
  })
})
