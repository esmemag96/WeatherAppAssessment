/**
 * Raw response shape for Open-Meteo's Air Quality API. Private to this
 * layer - only `OpenMeteoAirQualityAdapter` may read it.
 *
 * @see https://open-meteo.com/en/docs/air-quality-api
 */
export interface OpenMeteoAirQualityCurrentBlock {
  time: string
  us_aqi: number
  uv_index: number
}

export interface OpenMeteoAirQualityResponse {
  latitude: number
  longitude: number
  current: OpenMeteoAirQualityCurrentBlock
}
