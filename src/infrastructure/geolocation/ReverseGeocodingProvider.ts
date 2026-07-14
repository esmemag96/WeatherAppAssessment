import type { GeolocationCoordinates } from './GeolocationProvider'

export interface ReverseGeocodingResult {
  name: string
  country: string
  admin1?: string
}

/**
 * Contract for resolving a human-readable place name from raw
 * coordinates. Kept separate from `GeolocationProvider` (which only
 * resolves "where am I" as lat/lng) so the two concerns can vary and
 * be mocked independently - a caller can have coordinates without a
 * name (e.g. reverse geocoding failed) but never the other way
 * around. Returns `null` rather than throwing on failure: a missing
 * place name shouldn't block using coordinates we already have.
 */
export interface ReverseGeocodingProvider {
  reverseGeocode(coordinates: GeolocationCoordinates): Promise<ReverseGeocodingResult | null>
}
