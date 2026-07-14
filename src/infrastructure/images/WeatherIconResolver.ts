import type { WeatherCondition } from '@/entities/weather'

/**
 * Maps a domain weather condition to a display icon/label. Kept as an
 * adapter so the actual icon set or copy can change without callers
 * caring what a "clear" condition looks like.
 *
 * Icon names are Google Material Symbols Outlined ligatures (the icon
 * set `shared/ui/Icon` renders, see `DESIGN_SYSTEM.md` \u00a71) so callers can
 * pass the result straight into any design-system component that takes
 * an `icon` prop (`WeatherHeroCard`, `ForecastHourlyCard`,
 * `ForecastDailyRow`) without a translation step.
 */
const ICON_BY_CONDITION: Record<WeatherCondition, string> = {
  clear: 'wb_sunny',
  'partly-cloudy': 'filter_drama',
  cloudy: 'cloud',
  fog: 'foggy',
  rain: 'rainy',
  snow: 'weather_snowy',
  thunderstorm: 'thunderstorm',
  unknown: 'help',
}

const LABEL_BY_CONDITION: Record<WeatherCondition, string> = {
  clear: 'Clear',
  'partly-cloudy': 'Partly Cloudy',
  cloudy: 'Cloudy',
  fog: 'Foggy',
  rain: 'Rainy',
  snow: 'Snowy',
  thunderstorm: 'Thunderstorm',
  unknown: 'Unknown',
}

/**
 * Tailwind text-color utility per condition, using existing design-system
 * color roles (no bespoke hexes) so a row of mixed conditions - e.g. the
 * 7-day forecast - reads at a glance instead of every icon rendering in
 * the same neutral gray regardless of what it depicts.
 */
const ICON_COLOR_BY_CONDITION: Record<WeatherCondition, string> = {
  clear: 'text-tertiary',
  'partly-cloudy': 'text-secondary',
  cloudy: 'text-on-surface-variant',
  fog: 'text-outline',
  rain: 'text-primary',
  snow: 'text-primary-fixed',
  thunderstorm: 'text-error',
  unknown: 'text-on-surface-variant',
}

export function resolveWeatherIcon(condition: WeatherCondition): string {
  return ICON_BY_CONDITION[condition] ?? ICON_BY_CONDITION.unknown
}

export function resolveConditionLabel(condition: WeatherCondition): string {
  return LABEL_BY_CONDITION[condition] ?? LABEL_BY_CONDITION.unknown
}

export function resolveWeatherIconColor(condition: WeatherCondition): string {
  return ICON_COLOR_BY_CONDITION[condition] ?? ICON_COLOR_BY_CONDITION.unknown
}

/** Icon for the *current* observation - swaps sun for moon at night. */
export function resolveCurrentWeatherIcon(condition: WeatherCondition, isDay: boolean): string {
  if (!isDay && condition === 'clear') return 'bedtime'
  if (!isDay && condition === 'partly-cloudy') return 'nights_stay'
  return resolveWeatherIcon(condition)
}

/** Human-readable label for the *current* observation, with night variants. */
export function resolveCurrentConditionLabel(condition: WeatherCondition, isDay: boolean): string {
  if (!isDay && condition === 'clear') return 'Clear Night'
  return resolveConditionLabel(condition)
}

/** Accent color for favorites rows; rain uses secondary (green) per the hi-fi spec. */
export function resolveFavoriteAccentColor(condition: WeatherCondition): string {
  if (condition === 'rain') return 'text-secondary'
  return resolveWeatherIconColor(condition)
}
