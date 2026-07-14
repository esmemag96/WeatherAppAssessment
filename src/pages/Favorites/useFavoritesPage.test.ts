import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, h } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Location } from '@/entities/location'
import type { WeatherForecast } from '@/entities/weather'
import { useFavoritesStore } from '@/features/favorites'
import { useForecastStore } from '@/features/forecast'
import { useSettingsStore } from '@/features/settings'
import type { WeatherRepository } from '@/infrastructure/weather'
import { ROUTE_PATHS } from '@/shared/constants'

import { useFavoritesPage } from './useFavoritesPage'

function buildLocation(overrides: Partial<Location> = {}): Location {
  return {
    id: '1',
    name: 'London',
    country: 'United Kingdom',
    admin1: 'England',
    latitude: 51.5,
    longitude: -0.13,
    timezone: 'Europe/London',
    ...overrides,
  }
}

function buildForecast(location: Location, overrides: Partial<WeatherForecast['current']> = {}): WeatherForecast {
  return {
    location,
    current: {
      temperatureC: 12,
      feelsLikeC: 11,
      dewPointC: 8,
      condition: 'cloudy',
      humidityPercent: 70,
      windSpeedKph: 15,
      windDirectionDeg: 180,
      visibilityMeters: 10000,
      isDay: true,
      observedAt: '2026-07-10T12:00',
      ...overrides,
    },
    hourly: [],
    daily: [],
    updatedAt: '2026-07-10T12:00',
  }
}

function createFakeRouter() {
  return { push: vi.fn() }
}

function createFakeWeatherRepository(
  forecastsById: Record<string, WeatherForecast> = {},
): WeatherRepository {
  return {
    getForecast: vi.fn(async (location: Location) => {
      const forecast = forecastsById[location.id]
      if (!forecast) throw new Error('forecast unavailable')
      return forecast
    }),
    searchLocations: vi.fn().mockResolvedValue([]),
  }
}

/** Mounts the composable inside a real component so onMounted fires. */
function mountFavoritesPage(options: Parameters<typeof useFavoritesPage>[0] = {}) {
  let result!: ReturnType<typeof useFavoritesPage>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useFavoritesPage(options)
        return () => h('div')
      },
    }),
  )
  return { wrapper, result }
}

describe('useFavoritesPage', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network disabled in tests')))
  })

  it('exposes the favorites from the store', async () => {
    useFavoritesStore().addFavorite(buildLocation())
    const { result } = mountFavoritesPage({ router: createFakeRouter(), weatherRepository: createFakeWeatherRepository() })
    await flushPromises()

    expect(result.favorites.value).toHaveLength(1)
    expect(result.favorites.value[0]?.name).toBe('London')
  })

  it('is empty when no favorites are saved', async () => {
    const { result } = mountFavoritesPage({ router: createFakeRouter(), weatherRepository: createFakeWeatherRepository() })
    await flushPromises()

    expect(result.favoriteItems.value).toEqual([])
  })

  it('loads current weather snapshots with condition-colored labels for each favorite', async () => {
    const london = buildLocation({ id: '1', name: 'London' })
    const paris = buildLocation({ id: '2', name: 'Paris', country: 'France' })
    useFavoritesStore().addFavorite(london)
    useFavoritesStore().addFavorite(paris)

    const weatherRepository = createFakeWeatherRepository({
      '1': buildForecast(london, { condition: 'cloudy', temperatureC: 12, isDay: true }),
      '2': buildForecast(paris, { condition: 'clear', temperatureC: 15, isDay: false }),
    })

    const { result } = mountFavoritesPage({ router: createFakeRouter(), weatherRepository })
    await flushPromises()

    expect(result.favoriteItems.value[0]).toMatchObject({
      name: 'London',
      weatherStatus: 'ready',
      conditionLabel: 'Cloudy',
      temperatureLabel: '12\u00b0',
      icon: 'cloud',
      iconColorClass: 'text-on-surface-variant',
    })
    expect(result.favoriteItems.value[1]).toMatchObject({
      name: 'Paris',
      conditionLabel: 'Clear Night',
      temperatureLabel: '15\u00b0',
      icon: 'bedtime',
      iconColorClass: 'text-tertiary',
    })
  })

  it('reformats temperatures when the unit preference changes', async () => {
    const london = buildLocation()
    useFavoritesStore().addFavorite(london)

    const weatherRepository = createFakeWeatherRepository({
      '1': buildForecast(london, { temperatureC: 20 }),
    })

    const { result } = mountFavoritesPage({ router: createFakeRouter(), weatherRepository })
    await flushPromises()

    expect(result.favoriteItems.value[0]?.temperatureLabel).toBe('20\u00b0')

    useSettingsStore().setUnits('fahrenheit')
    await flushPromises()

    expect(result.favoriteItems.value[0]?.temperatureLabel).toBe('68\u00b0')
  })

  it('selecting a favorite loads its forecast and navigates home', async () => {
    const router = createFakeRouter()
    const location = buildLocation()
    useFavoritesStore().addFavorite(location)

    const { result } = mountFavoritesPage({ router, weatherRepository: createFakeWeatherRepository() })
    await flushPromises()

    result.selectFavorite(location)

    expect(useForecastStore().selectedLocation).toEqual(location)
    expect(router.push).toHaveBeenCalledWith(ROUTE_PATHS.home)
  })

  it('removing a favorite removes it from the store and the exposed list', async () => {
    useFavoritesStore().addFavorite(buildLocation({ id: '1' }))
    useFavoritesStore().addFavorite(buildLocation({ id: '2', name: 'Paris' }))

    const { result } = mountFavoritesPage({ router: createFakeRouter(), weatherRepository: createFakeWeatherRepository() })
    await flushPromises()

    result.removeFavorite('1')

    expect(result.favoriteItems.value.map((favorite) => favorite.id)).toEqual(['2'])
    expect(useFavoritesStore().isFavorite('1')).toBe(false)
  })

  it('reorders favorites when moveFavorite is triggered via drag handlers', async () => {
    useFavoritesStore().addFavorite(buildLocation({ id: '1', name: 'London' }))
    useFavoritesStore().addFavorite(buildLocation({ id: '2', name: 'Paris' }))

    const { result } = mountFavoritesPage({ router: createFakeRouter(), weatherRepository: createFakeWeatherRepository() })
    await flushPromises()

    result.onDragStart(0)
    result.onDrop(1)

    expect(result.favoriteItems.value.map((item) => item.id)).toEqual(['2', '1'])
    expect(useFavoritesStore().favorites.map((favorite) => favorite.id)).toEqual(['2', '1'])
  })
})
