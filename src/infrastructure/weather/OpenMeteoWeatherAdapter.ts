import type { Location } from '@/entities/location'
import type { WeatherForecast } from '@/entities/weather'
import { CacheService } from '@/infrastructure/cache'

import { GeocodingApiError, WeatherApiError } from './errors'
import type { OpenMeteoForecastResponse, OpenMeteoGeocodingResponse } from './openMeteo.types'
import { WeatherMapper } from './WeatherMapper'
import type { WeatherRepository } from './WeatherRepository'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const CURRENT_PARAMS =
  'temperature_2m,apparent_temperature,dew_point_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,visibility,is_day'
const HOURLY_PARAMS = 'temperature_2m,weather_code,precipitation_probability'
const DAILY_PARAMS = 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max'

const FORECAST_CACHE_TTL_MS = 10 * 60 * 1000

export interface OpenMeteoWeatherAdapterOptions {
  /** Injectable for testing; defaults to the global `fetch`. */
  fetchFn?: typeof fetch
  /** Injectable so tests can assert on cache hits without waiting on real time. */
  cache?: CacheService<WeatherForecast>
  /** Injectable clock, used to stamp `WeatherForecast.updatedAt`. */
  now?: () => Date
}

/**
 * `WeatherRepository` implementation backed by Open-Meteo's free
 * Geocoding + Forecast APIs. All Open-Meteo-specific knowledge (URLs,
 * query params, DTO shapes) is contained here and in `WeatherMapper` -
 * nothing outside this file should import from `openMeteo.types`.
 */
export class OpenMeteoWeatherAdapter implements WeatherRepository {
  private readonly fetchFn: typeof fetch
  private readonly cache: CacheService<WeatherForecast>
  private readonly now: () => Date

  constructor(options: OpenMeteoWeatherAdapterOptions = {}) {
    this.fetchFn = options.fetchFn ?? globalThis.fetch.bind(globalThis)
    this.cache = options.cache ?? new CacheService<WeatherForecast>(FORECAST_CACHE_TTL_MS)
    this.now = options.now ?? (() => new Date())
  }

  async getForecast(location: Location): Promise<WeatherForecast> {
    const cacheKey = buildForecastCacheKey(location)
    const cached = this.cache.get(cacheKey)
    if (cached) return cached

    const url = buildForecastUrl(location)
    const dto = await this.requestJson<OpenMeteoForecastResponse>(
      url,
      WeatherApiError,
      'Failed to load the forecast',
    )

    if (!dto.current || !dto.hourly || !dto.daily) {
      throw new WeatherApiError('Open-Meteo forecast response is missing expected data.')
    }

    const forecast = WeatherMapper.toWeatherForecast(dto, location, this.now().toISOString())
    this.cache.set(cacheKey, forecast)
    return forecast
  }

  async searchLocations(query: string): Promise<Location[]> {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return []

    const url = buildGeocodingUrl(trimmedQuery)
    const dto = await this.requestJson<OpenMeteoGeocodingResponse>(
      url,
      GeocodingApiError,
      'Failed to search locations',
    )
    return WeatherMapper.toLocations(dto)
  }

  private async requestJson<T>(
    url: string,
    ErrorType: new (message: string, cause?: unknown) => Error,
    context: string,
  ): Promise<T> {
    let response: Response
    try {
      response = await this.fetchFn(url)
    } catch (cause) {
      throw new ErrorType(`${context}: the network request failed.`, cause)
    }

    if (!response.ok) {
      throw new ErrorType(`${context}: received HTTP ${response.status}.`)
    }

    try {
      return (await response.json()) as T
    } catch (cause) {
      throw new ErrorType(`${context}: the response was not valid JSON.`, cause)
    }
  }
}

function buildForecastCacheKey(location: Pick<Location, 'latitude' | 'longitude'>): string {
  return `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`
}

function buildForecastUrl(location: Pick<Location, 'latitude' | 'longitude'>): string {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: CURRENT_PARAMS,
    hourly: HOURLY_PARAMS,
    daily: DAILY_PARAMS,
    timezone: 'auto',
  })
  return `${FORECAST_URL}?${params.toString()}`
}

function buildGeocodingUrl(query: string): string {
  const params = new URLSearchParams({ name: query, count: '10' })
  return `${GEOCODING_URL}?${params.toString()}`
}
