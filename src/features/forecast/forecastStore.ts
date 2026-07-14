import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { AirQuality } from '@/entities/air-quality'
import type { Location } from '@/entities/location'
import type { WeatherForecast } from '@/entities/weather'
import { type AirQualityRepository, OpenMeteoAirQualityAdapter } from '@/infrastructure/air-quality'
import { OpenMeteoWeatherAdapter, type WeatherRepository } from '@/infrastructure/weather'
import { toErrorMessage } from '@/shared/utils'

export interface ForecastStoreDeps {
  weatherRepository?: WeatherRepository
  airQualityRepository?: AirQualityRepository
}

/**
 * Factory so tests can inject fakes. The app uses the default export
 * below; tests call this directly with a fresh Pinia instance per test.
 */
export function createForecastStore(deps: ForecastStoreDeps = {}) {
  const weatherRepository: WeatherRepository = deps.weatherRepository ?? new OpenMeteoWeatherAdapter()
  const airQualityRepository: AirQualityRepository = deps.airQualityRepository ?? new OpenMeteoAirQualityAdapter()

  return defineStore('forecast', () => {
    const selectedLocation = ref<Location | null>(null)
    const forecast = ref<WeatherForecast | null>(null)
    const airQuality = ref<AirQuality | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function loadForecast(location: Location): Promise<void> {
      selectedLocation.value = location
      isLoading.value = true
      error.value = null
      airQuality.value = null

      // Run both requests concurrently - air quality comes from a
      // separate upstream API and is a "nice to have" enhancement, so
      // its failure must never block or fail the core forecast.
      const [forecastResult, airQualityResult] = await Promise.allSettled([
        weatherRepository.getForecast(location),
        airQualityRepository.getAirQuality(location),
      ])

      if (forecastResult.status === 'fulfilled') {
        forecast.value = forecastResult.value
      } else {
        error.value = toErrorMessage(forecastResult.reason, 'Failed to load the forecast.')
      }
      airQuality.value = airQualityResult.status === 'fulfilled' ? airQualityResult.value : null

      isLoading.value = false
    }

    /** Re-runs `loadForecast` for the currently selected location. No-op if none is selected. */
    async function retry(): Promise<void> {
      if (!selectedLocation.value) return
      await loadForecast(selectedLocation.value)
    }

    return { selectedLocation, forecast, airQuality, isLoading, error, loadForecast, retry }
  })
}

export const useForecastStore = createForecastStore()
