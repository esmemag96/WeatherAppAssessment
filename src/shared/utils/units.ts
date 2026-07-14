import type { TemperatureUnit, WindSpeedUnit } from '@/entities/settings'

/**
 * Unit conversion + display-suffix helpers shared by any feature that
 * needs to render a domain measurement (always stored in the domain
 * model as Celsius / km/h, see `src/entities/weather`) in the unit the
 * user picked in Settings. Pure math only - no formatting of full
 * label strings, which stays a page/feature presentation concern.
 */

const KPH_TO_MPH = 0.621371
const METERS_TO_MILES = 0.000621371
const METERS_TO_KM = 0.001

/** 16-point compass rose, each covering a 22.5° slice centered on its heading. */
const COMPASS_POINTS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
]

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

export function kphToMph(kph: number): number {
  return kph * KPH_TO_MPH
}

/** Rounds a Celsius reading to the nearest whole degree in the given display unit. */
export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  return Math.round(unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius)
}

/** Rounds a km/h reading to the nearest whole unit in the given display unit. */
export function convertWindSpeed(kph: number, unit: WindSpeedUnit): number {
  return Math.round(unit === 'mph' ? kphToMph(kph) : kph)
}

export function windSpeedUnitSuffix(unit: WindSpeedUnit): string {
  return unit === 'mph' ? 'mph' : 'km/h'
}

/** Rounds a meters reading to the nearest whole unit in the given display unit (miles for `mph`, kilometers otherwise). */
export function convertDistance(meters: number, unit: WindSpeedUnit): number {
  return Math.round(unit === 'mph' ? meters * METERS_TO_MILES : meters * METERS_TO_KM)
}

export function distanceUnitSuffix(unit: WindSpeedUnit): string {
  return unit === 'mph' ? 'mi' : 'km'
}

/** Converts a wind bearing in degrees (0 = north) to its nearest 16-point compass abbreviation. */
export function compassDirection(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360
  const index = Math.round(normalized / 22.5) % COMPASS_POINTS.length
  return COMPASS_POINTS[index] as string
}
