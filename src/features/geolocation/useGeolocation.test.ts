import { describe, expect, it, vi } from 'vitest'

import type { GeolocationProvider, ReverseGeocodingProvider, ReverseGeocodingResult } from '@/infrastructure/geolocation'
import { GeolocationError } from '@/infrastructure/geolocation'
import type { StorageRepository } from '@/infrastructure/storage'

import { useGeolocation } from './useGeolocation'

function createFakeStorageRepository(): StorageRepository {
  const store = new Map<string, unknown>()
  return {
    get<T>(key: string): T | null {
      return store.has(key) ? (store.get(key) as T) : null
    },
    set<T>(key: string, value: T): void {
      store.set(key, value)
    },
    remove(key: string): void {
      store.delete(key)
    },
  }
}

function createFakeGeolocationProvider(overrides: Partial<GeolocationProvider> = {}): GeolocationProvider {
  return {
    isSupported: () => true,
    getCurrentPosition: vi.fn().mockResolvedValue({ latitude: 51.5, longitude: -0.13 }),
    ...overrides,
  }
}

/** Defaults to `null` (as if reverse geocoding failed/is unavailable) so tests fall back to the "Current Location" placeholder unless a result is explicitly provided. */
function createFakeReverseGeocodingProvider(result: ReverseGeocodingResult | null = null): ReverseGeocodingProvider {
  return {
    reverseGeocode: vi.fn().mockResolvedValue(result),
  }
}

describe('useGeolocation', () => {
  it('starts with hasPromptedBefore false when nothing is persisted', () => {
    const { hasPromptedBefore } = useGeolocation({
      geolocationProvider: createFakeGeolocationProvider(),
      storageRepository: createFakeStorageRepository(),
      reverseGeocodingProvider: createFakeReverseGeocodingProvider(),
    })

    expect(hasPromptedBefore.value).toBe(false)
  })

  it('loads a previously persisted hasPromptedBefore flag', () => {
    const storageRepository = createFakeStorageRepository()
    storageRepository.set('weather-app:geolocation-prompt-dismissed', true)

    const { hasPromptedBefore } = useGeolocation({
      geolocationProvider: createFakeGeolocationProvider(),
      storageRepository,
      reverseGeocodingProvider: createFakeReverseGeocodingProvider(),
    })

    expect(hasPromptedBefore.value).toBe(true)
  })

  it('markPrompted flips and persists the flag', () => {
    const storageRepository = createFakeStorageRepository()
    const { hasPromptedBefore, markPrompted } = useGeolocation({
      geolocationProvider: createFakeGeolocationProvider(),
      storageRepository,
      reverseGeocodingProvider: createFakeReverseGeocodingProvider(),
    })

    markPrompted()

    expect(hasPromptedBefore.value).toBe(true)
    expect(storageRepository.get('weather-app:geolocation-prompt-dismissed')).toBe(true)
  })

  it('resolves a domain Location using the reverse-geocoded name when available', async () => {
    const { requestCurrentLocation, isLocating, error } = useGeolocation({
      geolocationProvider: createFakeGeolocationProvider(),
      storageRepository: createFakeStorageRepository(),
      reverseGeocodingProvider: createFakeReverseGeocodingProvider({
        name: 'San Francisco',
        country: 'United States',
        admin1: 'California',
      }),
    })

    const location = await requestCurrentLocation()

    expect(location).toMatchObject({
      id: 'current-location',
      name: 'San Francisco',
      country: 'United States',
      admin1: 'California',
      latitude: 51.5,
      longitude: -0.13,
    })
    expect(typeof location?.timezone).toBe('string')
    expect(isLocating.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('falls back to the "Current Location" placeholder when reverse geocoding finds no name', async () => {
    const { requestCurrentLocation } = useGeolocation({
      geolocationProvider: createFakeGeolocationProvider(),
      storageRepository: createFakeStorageRepository(),
      reverseGeocodingProvider: createFakeReverseGeocodingProvider(null),
    })

    const location = await requestCurrentLocation()

    expect(location).toMatchObject({ id: 'current-location', name: 'Current Location', country: '', latitude: 51.5, longitude: -0.13 })
  })

  it('sets isLocating while the request is in flight', async () => {
    let resolvePosition!: (value: { latitude: number; longitude: number }) => void
    const provider = createFakeGeolocationProvider({
      getCurrentPosition: () => new Promise((resolve) => (resolvePosition = resolve)),
    })
    const { requestCurrentLocation, isLocating } = useGeolocation({
      geolocationProvider: provider,
      storageRepository: createFakeStorageRepository(),
      reverseGeocodingProvider: createFakeReverseGeocodingProvider(),
    })

    const pending = requestCurrentLocation()
    expect(isLocating.value).toBe(true)

    resolvePosition({ latitude: 1, longitude: 2 })
    await pending

    expect(isLocating.value).toBe(false)
  })

  it('returns null and exposes an error message when the provider rejects', async () => {
    const provider = createFakeGeolocationProvider({
      getCurrentPosition: vi.fn().mockRejectedValue(new GeolocationError('permission-denied', 'Location permission was denied.')),
    })
    const { requestCurrentLocation, error } = useGeolocation({
      geolocationProvider: provider,
      storageRepository: createFakeStorageRepository(),
      reverseGeocodingProvider: createFakeReverseGeocodingProvider(),
    })

    const location = await requestCurrentLocation()

    expect(location).toBeNull()
    expect(error.value).toBe('Location permission was denied.')
  })

  it('exposes isSupported from the underlying provider', () => {
    const supported = useGeolocation({
      geolocationProvider: createFakeGeolocationProvider({ isSupported: () => false }),
      storageRepository: createFakeStorageRepository(),
      reverseGeocodingProvider: createFakeReverseGeocodingProvider(),
    })

    expect(supported.isSupported).toBe(false)
  })
})
