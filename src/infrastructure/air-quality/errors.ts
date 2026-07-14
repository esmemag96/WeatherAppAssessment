/** Thrown when the air-quality provider request fails or returns an unusable response. */
export class AirQualityApiError extends Error {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'AirQualityApiError'
    this.cause = cause
  }
}
