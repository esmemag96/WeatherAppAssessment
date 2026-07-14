import type { WeatherCondition } from '@/entities/weather'

/**
 * A "mood" for the hero background image - richer than the plain
 * `WeatherCondition` because it also accounts for temperature extremes
 * and day/night, which no weather provider encodes as a single field.
 */
export type WeatherVisual =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'storm'
  | 'hot'
  | 'cold'
  | 'night'

/**
 * Thresholds are evaluated against `temperatureC` - the domain's
 * canonical unit (see `CurrentWeather.temperatureC`) - so the result is
 * identical regardless of whether the UI is currently displaying °C or
 * °F. Fahrenheit is purely a presentation-layer conversion applied
 * downstream (`convertTemperature`); it never reaches this resolver.
 */
const HOT_THRESHOLD_C = 32
const COLD_THRESHOLD_C = 0

/**
 * Maps the domain `WeatherCondition` (not a provider's raw condition
 * code) to a visual. Building on the domain enum - rather than
 * duplicating Open-Meteo's WMO code ranges here - means this resolver
 * needs zero changes if the weather API provider is ever swapped:
 * `WeatherMapper.toCondition` is the single place that would need a new
 * mapping table, and everything downstream of the domain model (this
 * resolver included) keeps working unmodified.
 */
const VISUAL_BY_CONDITION: Record<WeatherCondition, WeatherVisual> = {
  clear: 'clear',
  'partly-cloudy': 'partly-cloudy',
  cloudy: 'cloudy',
  fog: 'fog',
  rain: 'rain',
  snow: 'snow',
  thunderstorm: 'storm',
  unknown: 'cloudy',
}

/**
 * Picks which hero background "mood" best represents the current
 * conditions. Night and temperature extremes take priority over sky
 * condition (a clear night is still `night`, a clear 35°C afternoon is
 * still `hot`), matching how a person would actually describe the
 * weather outside.
 */
export function resolveWeatherVisual(condition: WeatherCondition, temperatureC: number, isDay: boolean): WeatherVisual {
  if (!isDay) return 'night'
  if (temperatureC >= HOT_THRESHOLD_C) return 'hot'
  if (temperatureC <= COLD_THRESHOLD_C) return 'cold'
  return VISUAL_BY_CONDITION[condition] ?? 'cloudy'
}
