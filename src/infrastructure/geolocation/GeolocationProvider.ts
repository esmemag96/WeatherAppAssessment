export interface GeolocationCoordinates {
  latitude: number
  longitude: number
}

/**
 * Contract for resolving the device's current coordinates. UI/feature
 * code depends on this interface only - never on `navigator.geolocation`
 * directly - so it stays testable and swappable (e.g. a mocked provider
 * in Storybook/tests, or an IP-based fallback later) without touching
 * callers, mirroring `WeatherRepository`/`StorageRepository`.
 */
export interface GeolocationProvider {
  /** Whether this environment can even attempt to locate the device (e.g. `false` in a browser without the API, or during SSR). */
  isSupported(): boolean
  getCurrentPosition(): Promise<GeolocationCoordinates>
}
