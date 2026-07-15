import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { Location } from '@/entities/location'
import { useFavoritesStore } from '@/features/favorites'
import { useForecastStore } from '@/features/forecast'
import { useGeolocation } from '@/features/geolocation'
import { useRecentSearchesStore } from '@/features/recent-searches'
import { useSettingsStore } from '@/features/settings'
import { resolveAirQualityCategory, resolveUvIndexLabel } from '@/infrastructure/air-quality'
import { resolveWeatherAlerts } from '@/infrastructure/alerts'
import {
  resolveConditionLabel,
  resolveHeroBackgroundImage,
  resolveWeatherIcon,
  resolveWeatherIconColor,
  resolveWeatherVisual,
} from '@/infrastructure/images'
import { useOnlineStatus } from '@/shared/composables'
import { ROUTE_PATHS } from '@/shared/constants'
import {
  compassDirection,
  convertDistance,
  convertTemperature,
  convertWindSpeed,
  distanceUnitSuffix,
  formatFullDate,
  formatHourLabel,
  formatWeekdayLabel,
  windSpeedUnitSuffix,
} from '@/shared/utils'

/** Minimal router contract this composable needs - keeps it test-injectable without a real vue-router instance. */
interface DashboardRouter {
  push(path: string): unknown
}

export interface UseWeatherDashboardOptions {
  router?: DashboardRouter
  geolocation?: ReturnType<typeof useGeolocation>
}

export type DashboardStatus = 'no-location' | 'loading' | 'error' | 'empty' | 'ready'

const HOURLY_TILE_COUNT = 24
const DAILY_ROW_COUNT = 7
/** Reference maximums used to size each metric's visual bar; not a forecast ceiling (mirrors WIND_SCALE_MAX). */
const WIND_SCALE_MAX = { kph: 60, mph: 37 } as const
const UV_INDEX_SCALE_MAX = 11
const VISIBILITY_SCALE_MAX_METERS = 10_000

/**
 * Open-Meteo's hourly array always starts at 00:00 of the current day
 * (not "now"), so the tile meant to represent "Now" has to be located by
 * matching `current.observedAt` rather than assumed to be index 0.
 * `hourly[].time` and `current.observedAt` are both provider-local civil
 * times (no UTC offset), so a direct string comparison is sufficient -
 * no timezone conversion needed or wanted here.
 */
function findCurrentHourIndex(hourly: { time: string }[], observedAt: string): number {
  const exactMatch = hourly.findIndex((hour) => hour.time.slice(0, 13) === observedAt.slice(0, 13))
  if (exactMatch !== -1) return exactMatch

  let latestPastIndex = 0
  for (let i = 0; i < hourly.length; i++) {
    if (hourly[i].time > observedAt) break
    latestPastIndex = i
  }
  return latestPastIndex
}

function visibilityDescription(meters: number): string {
  if (meters >= VISIBILITY_SCALE_MAX_METERS) return 'Perfectly clear'
  if (meters >= 4000) return 'Clear'
  if (meters >= 1000) return 'Moderate'
  if (meters >= 200) return 'Poor'
  return 'Very poor'
}

/**
 * Orchestrates the Weather dashboard: reads `useForecastStore` /
 * `useFavoritesStore` / `useSettingsStore` / `useRecentSearchesStore`
 * and reduces them into plain view-model objects the design system's
 * presentational components can render directly (formatted strings,
 * not domain values) - no store, in turn, knows anything about display
 * formatting or units. `HomePage.vue` never touches infrastructure or
 * stores directly.
 */
export function useWeatherDashboard(options: UseWeatherDashboardOptions = {}) {
  const router: DashboardRouter = options.router ?? useRouter()

  const forecastStore = useForecastStore()
  const favoritesStore = useFavoritesStore()
  const recentSearchesStore = useRecentSearchesStore()
  const settingsStore = useSettingsStore()
  const { isOffline } = useOnlineStatus()
  const geolocation = options.geolocation ?? useGeolocation()

  const showLocationPrompt = ref(false)

  onMounted(() => {
    // No location has been established yet this session - fall back to
    // the most useful one already known to the app (a saved favorite,
    // else the most recent search) instead of forcing every fresh load
    // through the "no location selected" state.
    if (forecastStore.selectedLocation || forecastStore.forecast) return

    const fallbackLocation = favoritesStore.favorites[0] ?? recentSearchesStore.recentSearches[0]
    if (fallbackLocation) {
      void forecastStore.loadForecast(fallbackLocation)
      return
    }

    // Still nothing known - ask once (per `hasPromptedBefore`, persisted)
    // whether to use the device's current position instead of silently
    // landing on the empty state.
    if (geolocation.isSupported && !geolocation.hasPromptedBefore.value) {
      showLocationPrompt.value = true
    }
  })

  async function allowLocation(): Promise<void> {
    const geolocatedLocation = await geolocation.requestCurrentLocation()
    geolocation.markPrompted()

    if (geolocatedLocation) {
      showLocationPrompt.value = false
      void forecastStore.loadForecast(geolocatedLocation)
    }
    // On failure, keep the modal open - `geolocation.error` renders
    // inline so the user can retry or fall back to "Not Now" themselves.
  }

  function dismissLocationPrompt(): void {
    geolocation.markPrompted()
    showLocationPrompt.value = false
  }

  const location = computed<Location | null>(() => forecastStore.selectedLocation)
  const forecast = computed(() => forecastStore.forecast)
  const temperatureUnit = computed(() => settingsStore.preferences.temperatureUnit)
  const windSpeedUnit = computed(() => settingsStore.preferences.windSpeedUnit)

  const status = computed<DashboardStatus>(() => {
    if (forecastStore.isLoading) return 'loading'
    if (forecastStore.error) return 'error'
    if (!location.value || !forecast.value) return 'no-location'
    if (forecast.value.hourly.length === 0 && forecast.value.daily.length === 0) return 'empty'
    return 'ready'
  })

  const isFavorite = computed(() => (location.value ? favoritesStore.isFavorite(location.value.id) : false))

  function toggleFavorite(): void {
    if (!location.value) return
    if (favoritesStore.isFavorite(location.value.id)) {
      favoritesStore.removeFavorite(location.value.id)
    } else {
      favoritesStore.addFavorite(location.value)
    }
  }

  function goToSearch(): void {
    router.push(ROUTE_PATHS.search)
  }

  // --- Swipe-between-locations carousel (Apple Weather-style) -------------
  // The carousel doesn't introduce a second source of truth: every page is
  // still just `forecastStore.selectedLocation` swapped out via
  // `loadForecast`, so favorite/search/header logic above keeps working
  // unmodified regardless of whether the user got here by swiping.
  /**
   * Favorites, with the currently-loaded location spliced in at its
   * natural spot if it isn't already one (e.g. a fresh search or a
   * geolocated position) - so swiping never strands the user on a page
   * that then disappears from under them.
   */
  const carouselLocations = computed<Location[]>(() => {
    const favorites = favoritesStore.favorites
    if (!location.value || favoritesStore.isFavorite(location.value.id)) return favorites
    return [location.value, ...favorites]
  })

  const activeCarouselIndex = computed(() => {
    if (!location.value) return 0
    const index = carouselLocations.value.findIndex((item) => item.id === location.value?.id)
    return index === -1 ? 0 : index
  })

  /** Direction of the most recent carousel navigation - drives which slide transition (`slide-next`/`slide-prev`) plays. */
  const swipeDirection = ref<'next' | 'prev'>('next')

  function goToCarouselIndex(index: number): void {
    const pages = carouselLocations.value
    if (index < 0 || index >= pages.length || index === activeCarouselIndex.value) return

    swipeDirection.value = index > activeCarouselIndex.value ? 'next' : 'prev'
    void forecastStore.loadForecast(pages[index])
  }

  function goToNextLocation(): void {
    goToCarouselIndex(activeCarouselIndex.value + 1)
  }

  function goToPreviousLocation(): void {
    goToCarouselIndex(activeCarouselIndex.value - 1)
  }

  function retry(): void {
    void forecastStore.retry()
  }

  const headerTitle = computed(() => location.value?.name ?? 'Weather')
  const headerSubtitle = computed(() => {
    if (!location.value) return 'Search for a city to see its forecast.'
    return [location.value.admin1, location.value.country].filter(Boolean).join(', ')
  })

  const hero = computed(() => {
    const current = forecast.value?.current
    if (!current) return null

    const today = forecast.value?.daily[0]
    const highLowLabel = today
      ? `H: ${convertTemperature(today.maxTemperatureC, temperatureUnit.value)}\u00b0 L: ${convertTemperature(today.minTemperatureC, temperatureUnit.value)}\u00b0`
      : undefined

    const visual = resolveWeatherVisual(current.condition, current.temperatureC, current.isDay)

    return {
      backgroundImageUrl: resolveHeroBackgroundImage(visual),
      visual,
      condition: resolveConditionLabel(current.condition),
      dateLabel: formatFullDate(current.observedAt),
      temperatureLabel: String(convertTemperature(current.temperatureC, temperatureUnit.value)),
      highLowLabel,
      feelsLikeLabel: `Feels like ${convertTemperature(current.feelsLikeC, temperatureUnit.value)}\u00b0`,
      icon: resolveWeatherIcon(current.condition),
      // "Live" signals this is a fresh reading, not a stale offline cache.
      live: !isOffline.value,
    }
  })

  /** Locally-derived advisories (see `resolveWeatherAlerts`) - most severe first, empty when nothing crosses a threshold. */
  const alerts = computed(() => {
    const current = forecast.value?.current
    if (!current) return []
    return resolveWeatherAlerts(current, forecast.value?.daily[0])
  })

  const hourlyItems = computed(() => {
    const hourly = forecast.value?.hourly ?? []
    const currentIndex = forecast.value ? findCurrentHourIndex(hourly, forecast.value.current.observedAt) : 0
    const sliced = hourly.slice(currentIndex, currentIndex + HOURLY_TILE_COUNT)
    return sliced.map((hour, index) => ({
      timeLabel: index === 0 ? 'Now' : formatHourLabel(hour.time),
      icon: resolveWeatherIcon(hour.condition),
      temperatureLabel: `${convertTemperature(hour.temperatureC, temperatureUnit.value)}\u00b0`,
      active: index === 0,
    }))
  })

  const dailyItems = computed(() => {
    const days = (forecast.value?.daily ?? []).slice(0, DAILY_ROW_COUNT)
    if (days.length === 0) return []

    const weekMin = Math.min(...days.map((day) => day.minTemperatureC))
    const weekMax = Math.max(...days.map((day) => day.maxTemperatureC))
    const range = weekMax - weekMin

    return days.map((day, index) => ({
      dayLabel: index === 0 ? 'Today' : formatWeekdayLabel(day.date),
      icon: resolveWeatherIcon(day.condition),
      iconColorClass: resolveWeatherIconColor(day.condition),
      precipitationLabel: `${Math.round(day.precipitationChancePercent)}%`,
      lowLabel: `${convertTemperature(day.minTemperatureC, temperatureUnit.value)}\u00b0`,
      highLabel: `${convertTemperature(day.maxTemperatureC, temperatureUnit.value)}\u00b0`,
      rangeStart: range > 0 ? ((day.minTemperatureC - weekMin) / range) * 100 : 0,
      rangeEnd: range > 0 ? ((day.maxTemperatureC - weekMin) / range) * 100 : 100,
      highlighted: index === 0,
    }))
  })

  const metricItems = computed(() => {
    const current = forecast.value?.current
    if (!current) return []

    const windValue = convertWindSpeed(current.windSpeedKph, windSpeedUnit.value)
    const windScaleMax = WIND_SCALE_MAX[windSpeedUnit.value]
    const visibilityValue = convertDistance(current.visibilityMeters, windSpeedUnit.value)
    const uvIndex = forecastStore.airQuality?.uvIndex

    return [
      // Matches the approved hi-fi's "Bento Grid" order: UV Index, Humidity, Wind, Visibility.
      // Omitted when the (independently-loaded) air-quality reading isn't available - see forecastStore.
      ...(uvIndex === undefined
        ? []
        : [
            {
              key: 'uv-index',
              label: 'UV Index',
              icon: 'wb_sunny',
              value: String(Math.round(uvIndex)),
              description: resolveUvIndexLabel(uvIndex),
              percent: Math.min(100, (uvIndex / UV_INDEX_SCALE_MAX) * 100),
            },
          ]),
      {
        key: 'humidity',
        label: 'Humidity',
        icon: 'humidity_mid',
        value: `${Math.round(current.humidityPercent)}%`,
        description: `Dew point ${convertTemperature(current.dewPointC, temperatureUnit.value)}\u00b0`,
        percent: current.humidityPercent,
      },
      {
        key: 'wind',
        label: 'Wind',
        icon: 'air',
        value: `${windValue} ${windSpeedUnitSuffix(windSpeedUnit.value)}`,
        description: compassDirection(current.windDirectionDeg),
        percent: Math.min(100, (windValue / windScaleMax) * 100),
      },
      {
        key: 'visibility',
        label: 'Visibility',
        icon: 'visibility',
        value: `${visibilityValue} ${distanceUnitSuffix(windSpeedUnit.value)}`,
        description: visibilityDescription(current.visibilityMeters),
        percent: Math.min(100, (current.visibilityMeters / VISIBILITY_SCALE_MAX_METERS) * 100),
      },
    ]
  })

  const airQuality = computed(() => {
    const reading = forecastStore.airQuality
    if (!reading) return null

    const category = resolveAirQualityCategory(reading.usAqi)
    return {
      usAqi: Math.round(reading.usAqi),
      categoryLabel: category.label,
      description: category.description,
    }
  })

  return {
    isOffline,
    status,
    location,
    isFavorite,
    isLoading: computed(() => forecastStore.isLoading),
    errorMessage: computed(() => forecastStore.error),
    headerTitle,
    headerSubtitle,
    hero,
    alerts,
    hourlyItems,
    dailyItems,
    metricItems,
    airQuality,
    toggleFavorite,
    goToSearch,
    retry,
    carouselLocations,
    activeCarouselIndex,
    swipeDirection,
    goToNextLocation,
    goToPreviousLocation,
    goToCarouselIndex,
    showLocationPrompt,
    isLocating: geolocation.isLocating,
    locationError: geolocation.error,
    allowLocation,
    dismissLocationPrompt,
  }
}
