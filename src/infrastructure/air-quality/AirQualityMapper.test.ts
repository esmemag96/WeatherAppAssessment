import { describe, expect, it } from 'vitest'

import { AirQualityMapper } from './AirQualityMapper'

describe('AirQualityMapper.toAirQuality', () => {
  it('maps the current block to the domain AirQuality shape', () => {
    const airQuality = AirQualityMapper.toAirQuality({ time: '2026-01-01T12:00', us_aqi: 24, uv_index: 4.2 })

    expect(airQuality).toEqual({ usAqi: 24, uvIndex: 4.2 })
  })
})
