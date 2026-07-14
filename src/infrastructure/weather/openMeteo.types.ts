/**
 * Raw response shapes for the Open-Meteo Geocoding and Forecast APIs.
 *
 * These DTOs are private to the infrastructure layer - `WeatherMapper`
 * is the only thing allowed to read them. They must never be imported
 * by entities, features, stores, or UI code.
 *
 * @see https://open-meteo.com/en/docs/geocoding-api
 * @see https://open-meteo.com/en/docs
 */
export interface OpenMeteoGeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  timezone: string
  country: string
  country_code?: string
  admin1?: string
}

export interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[]
}

export interface OpenMeteoCurrentBlock {
  time: string
  temperature_2m: number
  apparent_temperature: number
  dew_point_2m: number
  relative_humidity_2m: number
  weather_code: number
  wind_speed_10m: number
  wind_direction_10m: number
  visibility: number
  /** 1 during daylight, 0 at night, per Open-Meteo's sun-position calculation for the location. */
  is_day: number
}

export interface OpenMeteoHourlyBlock {
  time: string[]
  temperature_2m: number[]
  weather_code: number[]
  precipitation_probability: number[]
}

export interface OpenMeteoDailyBlock {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  weather_code: number[]
  precipitation_probability_max: number[]
}

export interface OpenMeteoForecastResponse {
  latitude: number
  longitude: number
  timezone: string
  current: OpenMeteoCurrentBlock
  hourly: OpenMeteoHourlyBlock
  daily: OpenMeteoDailyBlock
}
