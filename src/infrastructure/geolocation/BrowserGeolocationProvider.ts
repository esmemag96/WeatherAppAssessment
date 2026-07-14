import { GeolocationError } from './errors'
import type { GeolocationCoordinates, GeolocationProvider } from './GeolocationProvider'

export interface BrowserGeolocationProviderOptions {
  /** Injectable for testing; defaults to the global `navigator.geolocation`. */
  geolocation?: Geolocation
  timeoutMs?: number
}

const DEFAULT_TIMEOUT_MS = 10_000
/** Accept a cached browser position up to 5 minutes old instead of always forcing a fresh GPS/Wi-Fi fix. */
const MAX_POSITION_AGE_MS = 5 * 60 * 1000

/**
 * `GeolocationProvider` implementation backed by the browser's
 * `navigator.geolocation` API. All browser-API-specific knowledge
 * (callback shape, `PositionError` codes) is contained here - nothing
 * outside this file should touch `navigator.geolocation` or
 * `GeolocationPositionError`.
 */
export class BrowserGeolocationProvider implements GeolocationProvider {
  private readonly geolocation?: Geolocation
  private readonly timeoutMs: number

  constructor(options: BrowserGeolocationProviderOptions = {}) {
    this.geolocation = options.geolocation ?? (typeof navigator === 'undefined' ? undefined : navigator.geolocation)
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  }

  isSupported(): boolean {
    return Boolean(this.geolocation)
  }

  getCurrentPosition(): Promise<GeolocationCoordinates> {
    const geolocation = this.geolocation
    if (!geolocation) {
      return Promise.reject(new GeolocationError('unsupported', 'Geolocation is not supported by this browser.'))
    }

    return new Promise((resolve, reject) => {
      geolocation.getCurrentPosition(
        (position) => {
          resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        },
        (positionError) => {
          reject(mapPositionError(positionError))
        },
        { timeout: this.timeoutMs, maximumAge: MAX_POSITION_AGE_MS },
      )
    })
  }
}

function mapPositionError(positionError: GeolocationPositionError): GeolocationError {
  switch (positionError.code) {
    case positionError.PERMISSION_DENIED:
      return new GeolocationError(
        'permission-denied',
        'Location permission was denied. You can still search for a city instead.',
        positionError,
      )
    case positionError.POSITION_UNAVAILABLE:
      return new GeolocationError('position-unavailable', 'Your location could not be determined.', positionError)
    case positionError.TIMEOUT:
      return new GeolocationError('timeout', 'Locating you took too long. Please try again.', positionError)
    default:
      return new GeolocationError('position-unavailable', 'Failed to determine your location.', positionError)
  }
}
