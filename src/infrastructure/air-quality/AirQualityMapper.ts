import type { AirQuality } from '@/entities/air-quality'

import type { OpenMeteoAirQualityResponse } from './openMeteoAirQuality.types'

/**
 * Converts Open-Meteo Air Quality API DTOs into the domain model. This
 * is the only place allowed to know about that response shape.
 */
export const AirQualityMapper = {
  toAirQuality(dto: OpenMeteoAirQualityResponse['current']): AirQuality {
    return {
      usAqi: dto.us_aqi,
      uvIndex: dto.uv_index,
    }
  },
}
