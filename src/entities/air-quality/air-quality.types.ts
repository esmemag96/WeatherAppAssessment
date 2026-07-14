/**
 * Domain model for air quality. Kept separate from `WeatherForecast`
 * because it comes from a different upstream data source (a dedicated
 * air-quality API, not the general forecast API) that can be
 * unavailable independently of the forecast itself - see
 * `AirQualityRepository`.
 */
export interface AirQuality {
  /** United States EPA Air Quality Index (0-500+; lower is better). */
  usAqi: number
  /** UV Index (0-11+; lower is safer). */
  uvIndex: number
}
