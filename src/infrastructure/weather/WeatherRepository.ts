import type { Location } from '@/entities/location'
import type { WeatherForecast } from '@/entities/weather'

/**
 * Contract that any weather data provider must satisfy. UI code and
 * Pinia stores depend on this interface only - never on a concrete
 * HTTP client, SDK, or provider DTO - so the provider can be swapped
 * (see `OpenMeteoWeatherAdapter`) without touching feature code.
 */
export interface WeatherRepository {
  /**
   * Takes the full `Location` (not just coordinates) so the returned
   * `WeatherForecast.location` can carry the display name/country the
   * caller already resolved via `searchLocations`, without a second
   * reverse-geocoding round trip.
   */
  getForecast(location: Location): Promise<WeatherForecast>
  searchLocations(query: string): Promise<Location[]>
}
