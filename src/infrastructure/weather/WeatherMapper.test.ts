import { describe, expect, it } from 'vitest'

import type {
  OpenMeteoForecastResponse,
  OpenMeteoGeocodingResponse,
  OpenMeteoGeocodingResult,
} from './openMeteo.types'
import { WeatherMapper } from './WeatherMapper'

function buildGeocodingResult(overrides: Partial<OpenMeteoGeocodingResult> = {}): OpenMeteoGeocodingResult {
  return {
    id: 2643743,
    name: 'London',
    latitude: 51.50853,
    longitude: -0.12574,
    timezone: 'Europe/London',
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
    ...overrides,
  }
}

function buildForecastResponse(overrides: Partial<OpenMeteoForecastResponse> = {}): OpenMeteoForecastResponse {
  return {
    latitude: 51.5,
    longitude: -0.13,
    timezone: 'Europe/London',
    current: {
      time: '2026-01-01T12:00',
      temperature_2m: 8.4,
      apparent_temperature: 6.1,
      dew_point_2m: 3.2,
      relative_humidity_2m: 72,
      weather_code: 3,
      wind_speed_10m: 14.2,
      wind_direction_10m: 225,
      visibility: 18000,
      is_day: 1,
    },
    hourly: {
      time: ['2026-01-01T12:00', '2026-01-01T13:00'],
      temperature_2m: [8.4, 9.1],
      weather_code: [3, 61],
      precipitation_probability: [10, 40],
    },
    daily: {
      time: ['2026-01-01', '2026-01-02'],
      temperature_2m_max: [9.5, 10.2],
      temperature_2m_min: [3.1, 4.0],
      weather_code: [3, 95],
      precipitation_probability_max: [20, 80],
    },
    ...overrides,
  }
}

describe('WeatherMapper.toCondition', () => {
  it('maps known WMO codes to domain conditions', () => {
    expect(WeatherMapper.toCondition(0)).toBe('clear')
    expect(WeatherMapper.toCondition(2)).toBe('partly-cloudy')
    expect(WeatherMapper.toCondition(3)).toBe('cloudy')
    expect(WeatherMapper.toCondition(45)).toBe('fog')
    expect(WeatherMapper.toCondition(63)).toBe('rain')
    expect(WeatherMapper.toCondition(75)).toBe('snow')
    expect(WeatherMapper.toCondition(95)).toBe('thunderstorm')
  })

  it('falls back to "unknown" for unrecognized codes', () => {
    expect(WeatherMapper.toCondition(-1)).toBe('unknown')
    expect(WeatherMapper.toCondition(1234)).toBe('unknown')
  })
})

describe('WeatherMapper.toCurrentWeather', () => {
  it('maps is_day 0/1 to a boolean isDay', () => {
    expect(WeatherMapper.toCurrentWeather(buildForecastResponse().current).isDay).toBe(true)
    expect(
      WeatherMapper.toCurrentWeather(buildForecastResponse({ current: { ...buildForecastResponse().current, is_day: 0 } }).current)
        .isDay,
    ).toBe(false)
  })
})

describe('WeatherMapper.toLocation / toLocations', () => {
  it('maps a geocoding result to a domain Location', () => {
    const location = WeatherMapper.toLocation(buildGeocodingResult())

    expect(location).toEqual({
      id: '2643743',
      name: 'London',
      country: 'United Kingdom',
      admin1: 'England',
      latitude: 51.50853,
      longitude: -0.12574,
      timezone: 'Europe/London',
    })
  })

  it('coerces the numeric id to a string', () => {
    const location = WeatherMapper.toLocation(buildGeocodingResult({ id: 99 }))
    expect(location.id).toBe('99')
    expect(typeof location.id).toBe('string')
  })

  it('maps an empty results array to an empty list', () => {
    const response: OpenMeteoGeocodingResponse = { results: [] }
    expect(WeatherMapper.toLocations(response)).toEqual([])
  })

  it('maps a missing results field to an empty list', () => {
    const response: OpenMeteoGeocodingResponse = {}
    expect(WeatherMapper.toLocations(response)).toEqual([])
  })

  it('maps multiple results in order', () => {
    const response: OpenMeteoGeocodingResponse = {
      results: [buildGeocodingResult({ id: 1, name: 'A' }), buildGeocodingResult({ id: 2, name: 'B' })],
    }
    const locations = WeatherMapper.toLocations(response)
    expect(locations.map((location) => location.name)).toEqual(['A', 'B'])
  })
})

describe('WeatherMapper.toWeatherForecast', () => {
  it('maps current/hourly/daily blocks and attaches the given location + timestamp', () => {
    const location = WeatherMapper.toLocation(buildGeocodingResult())
    const forecast = WeatherMapper.toWeatherForecast(buildForecastResponse(), location, '2026-01-01T12:00:00.000Z')

    expect(forecast.location).toBe(location)
    expect(forecast.updatedAt).toBe('2026-01-01T12:00:00.000Z')

    expect(forecast.current).toEqual({
      temperatureC: 8.4,
      feelsLikeC: 6.1,
      dewPointC: 3.2,
      condition: 'cloudy',
      humidityPercent: 72,
      windSpeedKph: 14.2,
      windDirectionDeg: 225,
      visibilityMeters: 18000,
      isDay: true,
      observedAt: '2026-01-01T12:00',
    })

    expect(forecast.hourly).toEqual([
      { time: '2026-01-01T12:00', temperatureC: 8.4, condition: 'cloudy', precipitationChancePercent: 10 },
      { time: '2026-01-01T13:00', temperatureC: 9.1, condition: 'rain', precipitationChancePercent: 40 },
    ])

    expect(forecast.daily).toEqual([
      { date: '2026-01-01', minTemperatureC: 3.1, maxTemperatureC: 9.5, condition: 'cloudy', precipitationChancePercent: 20 },
      { date: '2026-01-02', minTemperatureC: 4.0, maxTemperatureC: 10.2, condition: 'thunderstorm', precipitationChancePercent: 80 },
    ])
  })

  it('produces hourly/daily arrays matching the length of the source time arrays', () => {
    const location = WeatherMapper.toLocation(buildGeocodingResult())
    const forecast = WeatherMapper.toWeatherForecast(buildForecastResponse(), location, '2026-01-01T12:00:00.000Z')

    expect(forecast.hourly).toHaveLength(2)
    expect(forecast.daily).toHaveLength(2)
  })
})
