import type { AirQuality } from '@/entities/air-quality'
import type { Location } from '@/entities/location'
import { CacheService } from '@/infrastructure/cache'

import { AirQualityMapper } from './AirQualityMapper'
import { AirQualityApiError } from './errors'
import type { AirQualityRepository } from './AirQualityRepository'
import type { OpenMeteoAirQualityResponse } from './openMeteoAirQuality.types'

const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const CURRENT_PARAMS = 'us_aqi,uv_index'
const AIR_QUALITY_CACHE_TTL_MS = 10 * 60 * 1000

export interface OpenMeteoAirQualityAdapterOptions {
  /** Injectable for testing; defaults to the global `fetch`. */
  fetchFn?: typeof fetch
  /** Injectable so tests can assert on cache hits without waiting on real time. */
  cache?: CacheService<AirQuality>
}

/**
 * `AirQualityRepository` implementation backed by Open-Meteo's free
 * Air Quality API - a separate service/domain from the forecast API,
 * so all of its URL/DTO knowledge is contained here and in
 * `AirQualityMapper` only.
 */
export class OpenMeteoAirQualityAdapter implements AirQualityRepository {
  private readonly fetchFn: typeof fetch
  private readonly cache: CacheService<AirQuality>

  constructor(options: OpenMeteoAirQualityAdapterOptions = {}) {
    this.fetchFn = options.fetchFn ?? globalThis.fetch.bind(globalThis)
    this.cache = options.cache ?? new CacheService<AirQuality>(AIR_QUALITY_CACHE_TTL_MS)
  }

  async getAirQuality(location: Pick<Location, 'latitude' | 'longitude'>): Promise<AirQuality> {
    const cacheKey = buildCacheKey(location)
    const cached = this.cache.get(cacheKey)
    if (cached) return cached

    const url = buildAirQualityUrl(location)
    let response: Response
    try {
      response = await this.fetchFn(url)
    } catch (cause) {
      throw new AirQualityApiError('Failed to load air quality: the network request failed.', cause)
    }

    if (!response.ok) {
      throw new AirQualityApiError(`Failed to load air quality: received HTTP ${response.status}.`)
    }

    let dto: OpenMeteoAirQualityResponse
    try {
      dto = (await response.json()) as OpenMeteoAirQualityResponse
    } catch (cause) {
      throw new AirQualityApiError('Failed to load air quality: the response was not valid JSON.', cause)
    }

    if (!dto.current) {
      throw new AirQualityApiError('Open-Meteo air quality response is missing expected data.')
    }

    const airQuality = AirQualityMapper.toAirQuality(dto.current)
    this.cache.set(cacheKey, airQuality)
    return airQuality
  }
}

function buildCacheKey(location: Pick<Location, 'latitude' | 'longitude'>): string {
  return `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`
}

function buildAirQualityUrl(location: Pick<Location, 'latitude' | 'longitude'>): string {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: CURRENT_PARAMS,
  })
  return `${AIR_QUALITY_URL}?${params.toString()}`
}
