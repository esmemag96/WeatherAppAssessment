import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import type { Location } from '@/entities/location'
import type { WeatherCondition } from '@/entities/weather'
import { useFavoritesStore } from '@/features/favorites'
import { useForecastStore } from '@/features/forecast'
import { useSettingsStore } from '@/features/settings'
import {
  resolveCurrentConditionLabel,
  resolveCurrentWeatherIcon,
  resolveFavoriteAccentColor,
} from '@/infrastructure/images'
import { OpenMeteoWeatherAdapter, type WeatherRepository } from '@/infrastructure/weather'
import { ROUTE_PATHS } from '@/shared/constants'
import { convertTemperature } from '@/shared/utils'

/** Minimal router contract this composable needs - keeps it test-injectable without a real vue-router instance. */
interface FavoritesPageRouter {
  push(path: string): unknown
}

export type FavoriteWeatherStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface FavoriteListItem {
  id: string
  name: string
  location: Location
  weatherStatus: FavoriteWeatherStatus
  conditionLabel?: string
  temperatureLabel?: string
  icon?: string
  iconColorClass?: string
}

interface FavoriteWeatherSnapshot {
  weatherStatus: FavoriteWeatherStatus
  condition?: WeatherCondition
  temperatureC?: number
  isDay?: boolean
}

export interface UseFavoritesPageOptions {
  router?: FavoritesPageRouter
  weatherRepository?: WeatherRepository
}

/**
 * Orchestrates the Favorites page: reads `useFavoritesStore` for the
 * list, fetches a current-weather snapshot per favorite for the colored
 * condition/temperature column, and owns the select → forecast flow.
 */
export function useFavoritesPage(options: UseFavoritesPageOptions = {}) {
  const router: FavoritesPageRouter = options.router ?? useRouter()
  const weatherRepository: WeatherRepository = options.weatherRepository ?? new OpenMeteoWeatherAdapter()

  const favoritesStore = useFavoritesStore()
  const forecastStore = useForecastStore()
  const settingsStore = useSettingsStore()

  const weatherByLocationId = ref<Record<string, FavoriteWeatherSnapshot>>({})
  const isLoadingWeather = ref(false)

  const favorites = computed(() => favoritesStore.favorites)
  const temperatureUnit = computed(() => settingsStore.preferences.temperatureUnit)

  const favoriteItems = computed<FavoriteListItem[]>(() =>
    favorites.value.map((favorite) => {
      const snapshot = weatherByLocationId.value[favorite.id]
      const weatherStatus = snapshot?.weatherStatus ?? 'idle'

      if (weatherStatus !== 'ready' || snapshot.condition === undefined || snapshot.temperatureC === undefined || snapshot.isDay === undefined) {
        return {
          id: favorite.id,
          name: favorite.name,
          location: favorite,
          weatherStatus,
        }
      }

      return {
        id: favorite.id,
        name: favorite.name,
        location: favorite,
        weatherStatus,
        conditionLabel: resolveCurrentConditionLabel(snapshot.condition, snapshot.isDay),
        temperatureLabel: `${convertTemperature(snapshot.temperatureC, temperatureUnit.value)}\u00b0`,
        icon: resolveCurrentWeatherIcon(snapshot.condition, snapshot.isDay),
        iconColorClass: resolveFavoriteAccentColor(snapshot.condition),
      }
    }),
  )

  async function loadFavoriteWeather(): Promise<void> {
    const locations = favorites.value
    if (locations.length === 0) {
      weatherByLocationId.value = {}
      isLoadingWeather.value = false
      return
    }

    isLoadingWeather.value = true

    for (const favorite of locations) {
      weatherByLocationId.value[favorite.id] = { weatherStatus: 'loading' }
    }

    await Promise.all(
      locations.map(async (favorite) => {
        try {
          const forecast = await weatherRepository.getForecast(favorite)
          const { condition, temperatureC, isDay } = forecast.current
          weatherByLocationId.value[favorite.id] = {
            weatherStatus: 'ready',
            condition,
            temperatureC,
            isDay,
          }
        } catch {
          weatherByLocationId.value[favorite.id] = { weatherStatus: 'error' }
        }
      }),
    )

    isLoadingWeather.value = false
  }

  onMounted(() => {
    void loadFavoriteWeather()
  })

  watch(
    () => [...favorites.value.map((favorite) => favorite.id)].sort().join(','),
    () => {
      void loadFavoriteWeather()
    },
  )

  const draggingIndex = ref<number | null>(null)
  const dragOverIndex = ref<number | null>(null)

  function onReorderStart(index: number): void {
    draggingIndex.value = index
  }

  function onReorderMove(event: PointerEvent): void {
    if (draggingIndex.value === null) return

    event.preventDefault()

    const element = document.elementFromPoint(event.clientX, event.clientY)
    const row = element?.closest('[data-reorder-index]')
    if (!row) return

    const index = Number((row as HTMLElement).dataset.reorderIndex)
    if (!Number.isNaN(index)) dragOverIndex.value = index
  }

  function onReorderEnd(): void {
    if (draggingIndex.value === null) {
      onDragEnd()
      return
    }

    const fromIndex = draggingIndex.value
    const toIndex = dragOverIndex.value

    if (toIndex !== null && toIndex !== fromIndex) {
      favoritesStore.moveFavorite(fromIndex, toIndex)
    }

    onDragEnd()
  }

  function onDragOver(index: number, event: DragEvent): void {
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
    dragOverIndex.value = index
  }

  function onDragEnd(): void {
    draggingIndex.value = null
    dragOverIndex.value = null
  }

  /** Loads the forecast for a favorited location, then returns to the dashboard to show it. */
  function selectFavorite(location: Location): void {
    void forecastStore.loadForecast(location)
    router.push(ROUTE_PATHS.home)
  }

  function removeFavorite(locationId: string): void {
    favoritesStore.removeFavorite(locationId)
    const { [locationId]: _removed, ...rest } = weatherByLocationId.value
    weatherByLocationId.value = rest
  }

  return {
    favorites,
    favoriteItems,
    isLoadingWeather,
    draggingIndex,
    dragOverIndex,
    onReorderStart,
    onReorderMove,
    onReorderEnd,
    onDragOver,
    onDragEnd,
    selectFavorite,
    removeFavorite,
  }
}
