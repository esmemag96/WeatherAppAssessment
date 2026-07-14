/** Thrown when the forecast provider request fails or returns an unusable response. */
export class WeatherApiError extends Error {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'WeatherApiError'
    this.cause = cause
  }
}

/** Thrown when the geocoding/search request fails or returns an unusable response. */
export class GeocodingApiError extends Error {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'GeocodingApiError'
    this.cause = cause
  }
}
