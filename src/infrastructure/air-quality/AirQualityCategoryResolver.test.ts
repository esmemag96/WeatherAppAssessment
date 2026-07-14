import { describe, expect, it } from 'vitest'

import { resolveAirQualityCategory, resolveUvIndexLabel } from './AirQualityCategoryResolver'

describe('resolveAirQualityCategory', () => {
  it('maps US AQI ranges to their EPA category label', () => {
    expect(resolveAirQualityCategory(24).label).toBe('Good')
    expect(resolveAirQualityCategory(75).label).toBe('Moderate')
    expect(resolveAirQualityCategory(120).label).toBe('Unhealthy for Sensitive Groups')
    expect(resolveAirQualityCategory(180).label).toBe('Unhealthy')
    expect(resolveAirQualityCategory(250).label).toBe('Very Unhealthy')
    expect(resolveAirQualityCategory(400).label).toBe('Hazardous')
  })

  it('includes a description for every category', () => {
    for (const aqi of [24, 75, 120, 180, 250, 400]) {
      expect(resolveAirQualityCategory(aqi).description.length).toBeGreaterThan(0)
    }
  })

  it('treats the boundary values as inclusive of the lower category', () => {
    expect(resolveAirQualityCategory(50).label).toBe('Good')
    expect(resolveAirQualityCategory(51).label).toBe('Moderate')
  })
})

describe('resolveUvIndexLabel', () => {
  it('maps UV index ranges to their standard label', () => {
    expect(resolveUvIndexLabel(1)).toBe('Low')
    expect(resolveUvIndexLabel(4)).toBe('Moderate')
    expect(resolveUvIndexLabel(6)).toBe('High')
    expect(resolveUvIndexLabel(9)).toBe('Very High')
    expect(resolveUvIndexLabel(12)).toBe('Extreme')
  })
})
