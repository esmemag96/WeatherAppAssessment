import type { AirQuality } from '@/entities/air-quality'
import type { Location } from '@/entities/location'

/**
 * Contract for resolving air quality + UV data for a location. Kept as
 * its own repository - separate from `WeatherRepository` - because it
 * is backed by an entirely different upstream API that can be swapped
 * or become unavailable independently of the core forecast.
 */
export interface AirQualityRepository {
  getAirQuality(location: Pick<Location, 'latitude' | 'longitude'>): Promise<AirQuality>
}
