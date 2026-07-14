import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AirQuality } from '@/entities/air-quality'
import type { Location } from '@/entities/location'
import type { WeatherForecast } from '@/entities/weather'
import type { AirQualityRepository } from '@/infrastructure/air-quality'
import type { WeatherRepository } from '@/infrastructure/weather'

import { createForecastStore } from './forecastStore'

function buildLocation(overrides: Partial<Location> = {}): Location {
  return {
    id: '1',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5,
    longitude: -0.13,
    timezone: 'Europe/London',
    ...overrides,
  }
}

function buildForecast(overrides: Partial<WeatherForecast> = {}): WeatherForecast {
  return {
    location: buildLocation(),
    current: {
      temperatureC: 20,
      feelsLikeC: 18,
      dewPointC: 12,
      condition: 'clear',
      humidityPercent: 50,
      windSpeedKph: 10,
      windDirectionDeg: 90,
      visibilityMeters: 20000,
      isDay: true,
      observedAt: '2026-01-01T12:00',
    },
    hourly: [],
    daily: [],
    updatedAt: '2026-01-01T12:00',
    ...overrides,
  }
}

function createFakeWeatherRepository(overrides: Partial<WeatherRepository> = {}): WeatherRepository {
  return {
    getForecast: vi.fn().mockResolvedValue(buildForecast()),
    searchLocations: vi.fn().mockResolvedValue([]),
    ...overrides,
  }
}

function createFakeAirQualityRepository(overrides: Partial<AirQualityRepository> = {}): AirQualityRepository {
  return {
    getAirQuality: vi.fn().mockResolvedValue({ usAqi: 24, uvIndex: 4 } satisfies AirQuality),
    ...overrides,
  }
}

describe('useForecastStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads the forecast and air quality together for the given location', async () => {
    const weatherRepository = createFakeWeatherRepository()
    const airQualityRepository = createFakeAirQualityRepository()
    const useStore = createForecastStore({ weatherRepository, airQualityRepository })
    const store = useStore()

    await store.loadForecast(buildLocation())

    expect(store.forecast).toEqual(buildForecast())
    expect(store.airQuality).toEqual({ usAqi: 24, uvIndex: 4 })
    expect(store.error).toBeNull()
    expect(store.isLoading).toBe(false)
  })

  it('still surfaces the forecast when air quality fails to load', async () => {
    const weatherRepository = createFakeWeatherRepository()
    const airQualityRepository = createFakeAirQualityRepository({
      getAirQuality: vi.fn().mockRejectedValue(new Error('air quality API is down')),
    })
    const useStore = createForecastStore({ weatherRepository, airQualityRepository })
    const store = useStore()

    await store.loadForecast(buildLocation())

    expect(store.forecast).toEqual(buildForecast())
    expect(store.error).toBeNull()
    expect(store.airQuality).toBeNull()
  })

  it('still surfaces an air quality reading when the forecast fails to load', async () => {
    const weatherRepository = createFakeWeatherRepository({
      getForecast: vi.fn().mockRejectedValue(new Error('forecast API is down')),
    })
    const airQualityRepository = createFakeAirQualityRepository()
    const useStore = createForecastStore({ weatherRepository, airQualityRepository })
    const store = useStore()

    await store.loadForecast(buildLocation())

    expect(store.forecast).toBeNull()
    expect(store.error).toBe('forecast API is down')
    expect(store.airQuality).toEqual({ usAqi: 24, uvIndex: 4 })
  })

  it('clears the previous air quality reading while a new location loads', async () => {
    const weatherRepository = createFakeWeatherRepository()
    const airQualityRepository = createFakeAirQualityRepository()
    const useStore = createForecastStore({ weatherRepository, airQualityRepository })
    const store = useStore()

    await store.loadForecast(buildLocation())
    expect(store.airQuality).not.toBeNull()

    let resolveAirQuality!: (value: AirQuality) => void
    airQualityRepository.getAirQuality = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveAirQuality = resolve
      }),
    )
    const loadPromise = store.loadForecast(buildLocation({ id: '2', name: 'Paris' }))

    expect(store.airQuality).toBeNull()

    resolveAirQuality({ usAqi: 10, uvIndex: 1 })
    await loadPromise
  })

  it('retry re-fetches both the forecast and air quality for the selected location', async () => {
    const weatherRepository = createFakeWeatherRepository()
    const airQualityRepository = createFakeAirQualityRepository()
    const useStore = createForecastStore({ weatherRepository, airQualityRepository })
    const store = useStore()

    await store.loadForecast(buildLocation())
    await store.retry()

    expect(weatherRepository.getForecast).toHaveBeenCalledTimes(2)
    expect(airQualityRepository.getAirQuality).toHaveBeenCalledTimes(2)
  })
})
