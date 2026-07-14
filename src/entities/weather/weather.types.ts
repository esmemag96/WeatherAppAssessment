import type { Location } from '@/entities/location'

/**
 * Domain model for weather data. Provider-specific response shapes
 * (e.g. Open-Meteo's WMO weather codes) are mapped into these types by
 * `WeatherMapper` in `src/infrastructure/weather`, so the rest of the
 * app never depends on a third-party API contract.
 */
export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'unknown'

export interface CurrentWeather {
  temperatureC: number
  feelsLikeC: number
  dewPointC: number
  condition: WeatherCondition
  humidityPercent: number
  windSpeedKph: number
  /** Compass bearing the wind is blowing from, in degrees (0 = north, 90 = east, ...). */
  windDirectionDeg: number
  visibilityMeters: number
  /** Whether the observation was taken during daylight, per the provider's sun-position calculation for the location. */
  isDay: boolean
  /** ISO-8601 timestamp for the observation. */
  observedAt: string
}

export interface HourlyForecast {
  /** ISO-8601 timestamp for this hour. */
  time: string
  temperatureC: number
  condition: WeatherCondition
  precipitationChancePercent: number
}

export interface DailyForecast {
  /** ISO-8601 date (no time component). */
  date: string
  minTemperatureC: number
  maxTemperatureC: number
  condition: WeatherCondition
  precipitationChancePercent: number
}

/** The full forecast bundle for a single location. */
export interface WeatherForecast {
  location: Location
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  /** ISO-8601 timestamp of when this forecast was fetched. */
  updatedAt: string
}
