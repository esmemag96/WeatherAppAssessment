import { ref } from 'vue'

import type { Location } from '@/entities/location'
import {
  BigDataCloudReverseGeocodingProvider,
  BrowserGeolocationProvider,
  type GeolocationProvider,
  type ReverseGeocodingProvider,
} from '@/infrastructure/geolocation'
import { LocalStorageRepository, type StorageRepository } from '@/infrastructure/storage'
import { toErrorMessage } from '@/shared/utils'

const PROMPT_DISMISSED_STORAGE_KEY = 'weather-app:geolocation-prompt-dismissed'
/** Stable id for the synthetic "device position" location - there's only ever one. */
export const CURRENT_LOCATION_ID = 'current-location'

export interface UseGeolocationOptions {
  geolocationProvider?: GeolocationProvider
  storageRepository?: StorageRepository
  reverseGeocodingProvider?: ReverseGeocodingProvider
}

/**
 * Composable wrapping the browser Geolocation API behind
 * `GeolocationProvider` so components never call `navigator.geolocation`
 * directly (per the geolocation feature's original brief). Also tracks
 * whether the user has already been asked once, persisted through
 * `StorageRepository`, so callers can avoid re-prompting on every visit
 * while still allowing an explicit manual retry.
 *
 * Not a Pinia store: the in-flight `isLocating`/`error` state is a
 * one-shot UI concern for whichever prompt is asking, not shared
 * cross-page domain state (there is no "selected coordinates" the rest
 * of the app needs - the result is just a `Location` handed to
 * `useForecastStore.loadForecast`, same as any search result).
 */
export function useGeolocation(options: UseGeolocationOptions = {}) {
  const geolocationProvider: GeolocationProvider = options.geolocationProvider ?? new BrowserGeolocationProvider()
  const storageRepository: StorageRepository = options.storageRepository ?? new LocalStorageRepository()
  const reverseGeocodingProvider: ReverseGeocodingProvider =
    options.reverseGeocodingProvider ?? new BigDataCloudReverseGeocodingProvider()

  const isLocating = ref(false)
  const error = ref<string | null>(null)
  const hasPromptedBefore = ref(storageRepository.get<boolean>(PROMPT_DISMISSED_STORAGE_KEY) ?? false)

  const isSupported = geolocationProvider.isSupported()

  /** Records that the user has answered (either way) so an automatic prompt doesn't reappear on the next visit. */
  function markPrompted(): void {
    hasPromptedBefore.value = true
    storageRepository.set(PROMPT_DISMISSED_STORAGE_KEY, true)
  }

  /** Resolves the device's current position into a domain `Location`, or `null` on failure (see `error`). */
  async function requestCurrentLocation(): Promise<Location | null> {
    isLocating.value = true
    error.value = null

    try {
      const { latitude, longitude } = await geolocationProvider.getCurrentPosition()
      const reverseGeocodeResult = await reverseGeocodingProvider.reverseGeocode({ latitude, longitude })

      return {
        id: CURRENT_LOCATION_ID,
        name: reverseGeocodeResult?.name ?? 'Current Location',
        country: reverseGeocodeResult?.country ?? '',
        admin1: reverseGeocodeResult?.admin1,
        latitude,
        longitude,
        // The browser's own resolved IANA zone is more reliable than
        // anything a reverse-geocoding API would infer from the name.
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    } catch (cause) {
      error.value = toErrorMessage(cause, 'Failed to determine your location.')
      return null
    } finally {
      isLocating.value = false
    }
  }

  return {
    isSupported,
    isLocating,
    error,
    hasPromptedBefore,
    markPrompted,
    requestCurrentLocation,
  }
}
