import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, h, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Location } from '@/entities/location'
import type { WeatherForecast } from '@/entities/weather'
import { useFavoritesStore } from '@/features/favorites'
import { useForecastStore } from '@/features/forecast'
import { useGeolocation } from '@/features/geolocation'
import { useRecentSearchesStore } from '@/features/recent-searches'
import { useSettingsStore } from '@/features/settings'
import { ROUTE_PATHS } from '@/shared/constants'

import { useWeatherDashboard } from './useWeatherDashboard'

function createFakeGeolocation(
  overrides: Partial<ReturnType<typeof useGeolocation>> = {},
): ReturnType<typeof useGeolocation> {
  return {
    isSupported: true,
    isLocating: ref(false),
    error: ref(null),
    hasPromptedBefore: ref(false),
    markPrompted: vi.fn(),
    requestCurrentLocation: vi.fn().mockResolvedValue(null),
    ...overrides,
  }
}

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

function buildForecast(overrides: Partial<WeatherForecast> = {}): WeatherForecast {
  return {
    location: buildLocation(),
    current: {
      temperatureC: 20,
      feelsLikeC: 18,
      dewPointC: 13,
      condition: 'partly-cloudy',
      humidityPercent: 65,
      windSpeedKph: 20,
      windDirectionDeg: 225,
      visibilityMeters: 16000,
      isDay: true,
      observedAt: '2026-10-14T12:00',
    },
    hourly: [
      { time: '2026-10-14T12:00', temperatureC: 20, condition: 'partly-cloudy', precipitationChancePercent: 10 },
      { time: '2026-10-14T13:00', temperatureC: 21, condition: 'clear', precipitationChancePercent: 5 },
    ],
    daily: [
      { date: '2026-10-14', minTemperatureC: 12, maxTemperatureC: 22, condition: 'partly-cloudy', precipitationChancePercent: 20 },
      { date: '2026-10-15', minTemperatureC: 10, maxTemperatureC: 18, condition: 'rain', precipitationChancePercent: 80 },
    ],
    updatedAt: '2026-10-14T12:00',
    ...overrides,
  }
}

function createFakeRouter() {
  return { push: vi.fn() }
}

/** Mounts the composable inside a real component so onMounted/watch fire, per Vue Test Utils convention. */
function mountDashboard(options: Parameters<typeof useWeatherDashboard>[0] = {}) {
  let result!: ReturnType<typeof useWeatherDashboard>
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useWeatherDashboard(options)
        return () => h('div')
      },
    }),
  )
  return { wrapper, result }
}

describe('useWeatherDashboard', () => {
  beforeEach(() => {
    // Favorites/recent-searches/settings stores persist through real
    // `localStorage` by default - clear it so each test starts from a
    // clean slate instead of leaking state from the previous test.
    localStorage.clear()
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports "no-location" when nothing is selected and there is no favorite/recent fallback', async () => {
    const { result } = mountDashboard({
      router: createFakeRouter(),
      geolocation: createFakeGeolocation({ isSupported: false }),
    })
    await flushPromises()

    expect(result.status.value).toBe('no-location')
    expect(result.location.value).toBeNull()
    expect(result.showLocationPrompt.value).toBe(false)
  })

  it('shows the location permission prompt when supported, unasked, and nothing else is known', async () => {
    const geolocation = createFakeGeolocation({ isSupported: true, hasPromptedBefore: ref(false) })
    const { result } = mountDashboard({
      router: createFakeRouter(),
      geolocation,
    })
    await flushPromises()

    expect(result.showLocationPrompt.value).toBe(true)
  })

  it('does not show the location permission prompt when geolocation is unsupported', async () => {
    const geolocation = createFakeGeolocation({ isSupported: false, hasPromptedBefore: ref(false) })
    const { result } = mountDashboard({
      router: createFakeRouter(),
      geolocation,
    })
    await flushPromises()

    expect(result.showLocationPrompt.value).toBe(false)
  })

  it('does not show the location permission prompt again once already answered', async () => {
    const geolocation = createFakeGeolocation({ isSupported: true, hasPromptedBefore: ref(true) })
    const { result } = mountDashboard({
      router: createFakeRouter(),
      geolocation,
    })
    await flushPromises()

    expect(result.showLocationPrompt.value).toBe(false)
  })

  it('does not show the location permission prompt when a favorite fallback is already loading', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network disabled in tests')))
    useFavoritesStore().addFavorite(buildLocation({ id: 'fav-1' }))
    const geolocation = createFakeGeolocation({ isSupported: true, hasPromptedBefore: ref(false) })

    const { result } = mountDashboard({
      router: createFakeRouter(),
      geolocation,
    })
    await flushPromises()

    expect(result.showLocationPrompt.value).toBe(false)
    expect(geolocation.requestCurrentLocation).not.toHaveBeenCalled()
  })

  it('allowLocation loads the forecast for the geolocated position, closes the prompt, and marks it prompted', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network disabled in tests')))
    const geolocatedLocation = buildLocation({ id: 'current-location', name: 'Current Location', country: '' })
    const geolocation = createFakeGeolocation({
      isSupported: true,
      hasPromptedBefore: ref(false),
      requestCurrentLocation: vi.fn().mockResolvedValue(geolocatedLocation),
    })

    const { result } = mountDashboard({
      router: createFakeRouter(),
      geolocation,
    })
    await flushPromises()
    expect(result.showLocationPrompt.value).toBe(true)

    await result.allowLocation()

    expect(geolocation.markPrompted).toHaveBeenCalled()
    expect(result.showLocationPrompt.value).toBe(false)
    expect(useForecastStore().selectedLocation).toEqual(geolocatedLocation)
  })

  it('allowLocation keeps the prompt open (with the error surfaced) when locating fails', async () => {
    const geolocation = createFakeGeolocation({
      isSupported: true,
      hasPromptedBefore: ref(false),
      error: ref('Location permission was denied.'),
      requestCurrentLocation: vi.fn().mockResolvedValue(null),
    })

    const { result } = mountDashboard({
      router: createFakeRouter(),
      geolocation,
    })
    await flushPromises()

    await result.allowLocation()

    expect(geolocation.markPrompted).toHaveBeenCalled()
    expect(result.showLocationPrompt.value).toBe(true)
    expect(result.locationError.value).toBe('Location permission was denied.')
  })

  it('dismissLocationPrompt closes the prompt and marks it prompted without requesting a position', async () => {
    const geolocation = createFakeGeolocation({ isSupported: true, hasPromptedBefore: ref(false) })
    const { result } = mountDashboard({
      router: createFakeRouter(),
      geolocation,
    })
    await flushPromises()

    result.dismissLocationPrompt()

    expect(geolocation.markPrompted).toHaveBeenCalled()
    expect(result.showLocationPrompt.value).toBe(false)
    expect(geolocation.requestCurrentLocation).not.toHaveBeenCalled()
  })

  it('auto-selects the first favorite on mount when no location is active yet', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network disabled in tests')))
    const favorite = buildLocation({ id: 'fav-1', name: 'Paris' })
    useFavoritesStore().addFavorite(favorite)

    mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    expect(useForecastStore().selectedLocation?.id).toBe('fav-1')
  })

  it('falls back to the most recent search when there are no favorites', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network disabled in tests')))
    const recent = buildLocation({ id: 'recent-1', name: 'Tokyo' })
    useRecentSearchesStore().addRecentSearch(recent)

    mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    expect(useForecastStore().selectedLocation?.id).toBe('recent-1')
  })

  it('reports "loading" while the forecast store is fetching', async () => {
    const forecastStore = useForecastStore()
    forecastStore.isLoading = true

    const { result } = mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    expect(result.status.value).toBe('loading')
  })

  it('reports "error" and exposes the store error message when the fetch failed', async () => {
    const forecastStore = useForecastStore()
    forecastStore.error = 'Failed to load the forecast.'

    const { result } = mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    expect(result.status.value).toBe('error')
    expect(result.errorMessage.value).toBe('Failed to load the forecast.')
  })

  it('reports "empty" when the forecast loaded but has no hourly or daily entries', async () => {
    const forecastStore = useForecastStore()
    forecastStore.selectedLocation = buildLocation()
    forecastStore.forecast = buildForecast({ hourly: [], daily: [] })

    const { result } = mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    expect(result.status.value).toBe('empty')
  })

  it('builds a formatted, unit-converted view model when "ready"', async () => {
    const forecastStore = useForecastStore()
    forecastStore.selectedLocation = buildLocation()
    forecastStore.forecast = buildForecast()
    useSettingsStore().setUnits('fahrenheit')

    const { result } = mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    expect(result.status.value).toBe('ready')

    expect(result.hero.value).toMatchObject({
      // 20C, partly-cloudy, daytime -> the "partly-cloudy" hero background.
      backgroundImageUrl: expect.stringContaining('partly-cloudy'),
      condition: 'Partly Cloudy',
      temperatureLabel: '68', // 20C -> 68F
      highLowLabel: 'H: 72\u00b0 L: 54\u00b0', // 22C/12C -> 72F/54F
      feelsLikeLabel: 'Feels like 64\u00b0', // 18C -> 64F
      icon: 'filter_drama',
      live: true,
    })

    expect(result.hourlyItems.value[0]).toMatchObject({ timeLabel: 'Now', active: true, temperatureLabel: '68\u00b0' })
    expect(result.hourlyItems.value[1]).toMatchObject({ active: false, temperatureLabel: '70\u00b0' })

    // Week range spans the min/max across both days: 10-22C.
    // Day 0 (12-22C) -> starts 2/12 of the way up, reaches the week max.
    expect(result.dailyItems.value[0]).toMatchObject({
      dayLabel: 'Today',
      highlighted: true,
      rangeEnd: 100,
      iconColorClass: 'text-secondary', // partly-cloudy
    })
    expect(result.dailyItems.value[0]?.rangeStart).toBeCloseTo((2 / 12) * 100, 5)
    // Day 1 (10-18C) -> starts at the week min, reaches 8/12 of the way up.
    expect(result.dailyItems.value[1]).toMatchObject({
      dayLabel: 'Thu',
      highlighted: false,
      rangeStart: 0,
      iconColorClass: 'text-primary', // rain
    })
    expect(result.dailyItems.value[1]?.rangeEnd).toBeCloseTo((8 / 12) * 100, 5)

    const metricsByKey = Object.fromEntries(result.metricItems.value.map((item) => [item.key, item]))
    // Dew point is a raw domain reading (Celsius), so it goes through the same
    // temperature-unit conversion as the hero - 13C -> 55F.
    expect(metricsByKey.humidity).toMatchObject({ value: '65%', description: 'Dew point 55\u00b0' })
    // Wind speed unit is independent of temperature unit and defaults to kph.
    expect(metricsByKey.wind).toMatchObject({ value: '20 km/h', description: 'SW' })
    expect(metricsByKey.visibility).toMatchObject({ value: '16 km', description: 'Perfectly clear' })
    // No air-quality reading was loaded in this test, so the UV Index tile is omitted.
    expect(metricsByKey['uv-index']).toBeUndefined()
  })

  it('aligns "Now" to the hour matching current.observedAt, not the start of the hourly array', async () => {
    // Open-Meteo's hourly array always starts at 00:00 of the current day,
    // regardless of what time it actually is - "Now" has to be located
    // within the array rather than assumed to be index 0.
    const forecastStore = useForecastStore()
    forecastStore.selectedLocation = buildLocation()
    forecastStore.forecast = buildForecast({
      current: {
        temperatureC: 20,
        feelsLikeC: 18,
        dewPointC: 13,
        condition: 'partly-cloudy',
        humidityPercent: 65,
        windSpeedKph: 20,
        windDirectionDeg: 225,
        visibilityMeters: 16000,
        isDay: true,
        observedAt: '2026-10-14T14:00',
      },
      hourly: [
        { time: '2026-10-14T00:00', temperatureC: 13, condition: 'cloudy', precipitationChancePercent: 0 },
        { time: '2026-10-14T13:00', temperatureC: 19, condition: 'partly-cloudy', precipitationChancePercent: 5 },
        { time: '2026-10-14T14:00', temperatureC: 20, condition: 'partly-cloudy', precipitationChancePercent: 10 },
        { time: '2026-10-14T15:00', temperatureC: 21, condition: 'clear', precipitationChancePercent: 5 },
      ],
    })

    const { result } = mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    expect(result.hourlyItems.value[0]).toMatchObject({ timeLabel: 'Now', active: true, temperatureLabel: '20\u00b0' })
    expect(result.hourlyItems.value[1]).toMatchObject({ timeLabel: '3 PM', active: false, temperatureLabel: '21\u00b0' })
  })

  it('includes a UV Index tile and an airQuality view model once the air-quality reading loads', async () => {
    const forecastStore = useForecastStore()
    forecastStore.selectedLocation = buildLocation()
    forecastStore.forecast = buildForecast()
    forecastStore.airQuality = { usAqi: 24, uvIndex: 4 }

    const { result } = mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    const metricsByKey = Object.fromEntries(result.metricItems.value.map((item) => [item.key, item]))
    expect(metricsByKey['uv-index']).toMatchObject({ value: '4', description: 'Moderate' })

    expect(result.airQuality.value).toEqual({
      usAqi: 24,
      categoryLabel: 'Good',
      description: 'Air quality is ideal for most individuals.',
    })
  })

  it('omits the airQuality view model when no reading has loaded', async () => {
    const forecastStore = useForecastStore()
    forecastStore.selectedLocation = buildLocation()
    forecastStore.forecast = buildForecast()

    const { result } = mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    expect(result.airQuality.value).toBeNull()
  })

  it('picks the hero background from temperature/day-night, not just the sky condition', async () => {
    const forecastStore = useForecastStore()
    forecastStore.selectedLocation = buildLocation()
    forecastStore.forecast = buildForecast({
      current: {
        temperatureC: 5,
        feelsLikeC: 4,
        dewPointC: 1,
        condition: 'clear',
        humidityPercent: 40,
        windSpeedKph: 5,
        windDirectionDeg: 10,
        visibilityMeters: 12000,
        isDay: false,
        observedAt: '2026-10-14T22:00',
      },
    })

    const { result } = mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    // Clear skies, but nighttime wins over the sky condition.
    expect(result.hero.value?.backgroundImageUrl).toContain('night')
  })

  it('toggles the favorite for the selected location', async () => {
    const forecastStore = useForecastStore()
    forecastStore.selectedLocation = buildLocation()
    forecastStore.forecast = buildForecast()

    const { result } = mountDashboard({ router: createFakeRouter() })
    await flushPromises()

    expect(result.isFavorite.value).toBe(false)

    result.toggleFavorite()
    await flushPromises()
    expect(result.isFavorite.value).toBe(true)

    result.toggleFavorite()
    await flushPromises()
    expect(result.isFavorite.value).toBe(false)
  })

  it('navigates to the search route', () => {
    const router = createFakeRouter()
    const { result } = mountDashboard({ router })

    result.goToSearch()

    expect(router.push).toHaveBeenCalledWith(ROUTE_PATHS.search)
  })
})
