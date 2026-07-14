import type { GeolocationCoordinates } from './GeolocationProvider'
import type { ReverseGeocodingProvider, ReverseGeocodingResult } from './ReverseGeocodingProvider'

const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

export interface BigDataCloudReverseGeocodingProviderOptions {
  /** Injectable for testing; defaults to the global `fetch`. */
  fetchFn?: typeof fetch
}

/** Shape of the fields we use from BigDataCloud's response; the API returns more than this. */
interface BigDataCloudResponseDto {
  city?: string
  locality?: string
  principalSubdivision?: string
  countryName?: string
}

/**
 * `ReverseGeocodingProvider` backed by BigDataCloud's free
 * client-side reverse geocoding endpoint
 * (https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api).
 * It requires no API key and is meant for exactly this use case:
 * resolving a display name for live, user-permitted GPS coordinates
 * read straight from the browser. All request/response shape
 * knowledge specific to this provider is contained here - nothing
 * outside this file should know about BigDataCloud's DTOs.
 */
export class BigDataCloudReverseGeocodingProvider implements ReverseGeocodingProvider {
  private readonly fetchFn: typeof fetch

  constructor(options: BigDataCloudReverseGeocodingProviderOptions = {}) {
    this.fetchFn = options.fetchFn ?? globalThis.fetch.bind(globalThis)
  }

  async reverseGeocode(coordinates: GeolocationCoordinates): Promise<ReverseGeocodingResult | null> {
    try {
      const params = new URLSearchParams({
        latitude: String(coordinates.latitude),
        longitude: String(coordinates.longitude),
        localityLanguage: 'en',
      })
      const response = await this.fetchFn(`${REVERSE_GEOCODE_URL}?${params.toString()}`)
      if (!response.ok) return null

      const dto = (await response.json()) as BigDataCloudResponseDto
      const name = dto.city || dto.locality
      if (!name) return null

      return {
        name,
        country: dto.countryName ?? '',
        admin1: dto.principalSubdivision,
      }
    } catch {
      return null
    }
  }
}
