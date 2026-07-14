import { describe, expect, it } from 'vitest'

import {
  celsiusToFahrenheit,
  compassDirection,
  convertDistance,
  convertTemperature,
  convertWindSpeed,
  distanceUnitSuffix,
  kphToMph,
  windSpeedUnitSuffix,
} from './units'

describe('celsiusToFahrenheit', () => {
  it('converts freezing and boiling reference points', () => {
    expect(celsiusToFahrenheit(0)).toBe(32)
    expect(celsiusToFahrenheit(100)).toBe(212)
  })
})

describe('kphToMph', () => {
  it('converts km/h to mph', () => {
    expect(kphToMph(100)).toBeCloseTo(62.1371, 3)
  })
})

describe('convertTemperature', () => {
  it('rounds and passes through Celsius unchanged', () => {
    expect(convertTemperature(20.4, 'celsius')).toBe(20)
    expect(convertTemperature(20.6, 'celsius')).toBe(21)
  })

  it('rounds to the nearest whole Fahrenheit degree', () => {
    expect(convertTemperature(0, 'fahrenheit')).toBe(32)
    expect(convertTemperature(21, 'fahrenheit')).toBe(70)
  })
})

describe('convertWindSpeed', () => {
  it('rounds and passes through km/h unchanged', () => {
    expect(convertWindSpeed(14.2, 'kph')).toBe(14)
  })

  it('rounds to the nearest whole mph', () => {
    expect(convertWindSpeed(100, 'mph')).toBe(62)
  })
})

describe('windSpeedUnitSuffix', () => {
  it('returns the matching unit suffix', () => {
    expect(windSpeedUnitSuffix('kph')).toBe('km/h')
    expect(windSpeedUnitSuffix('mph')).toBe('mph')
  })
})

describe('convertDistance', () => {
  it('rounds and converts meters to kilometers', () => {
    expect(convertDistance(16093, 'kph')).toBe(16)
  })

  it('rounds and converts meters to miles', () => {
    expect(convertDistance(16093, 'mph')).toBe(10)
  })
})

describe('distanceUnitSuffix', () => {
  it('returns the matching unit suffix', () => {
    expect(distanceUnitSuffix('kph')).toBe('km')
    expect(distanceUnitSuffix('mph')).toBe('mi')
  })
})

describe('compassDirection', () => {
  it('maps cardinal degrees to their abbreviation', () => {
    expect(compassDirection(0)).toBe('N')
    expect(compassDirection(90)).toBe('E')
    expect(compassDirection(180)).toBe('S')
    expect(compassDirection(270)).toBe('W')
  })

  it('maps intermediate degrees to the nearest 16-point heading', () => {
    expect(compassDirection(225)).toBe('SW')
    expect(compassDirection(45)).toBe('NE')
  })

  it('wraps values near 360 back to north', () => {
    expect(compassDirection(359)).toBe('N')
    expect(compassDirection(-10)).toBe('N')
  })
})
