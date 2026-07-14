/**
 * Maps raw index values to the display label/description pairing used
 * throughout most weather apps, per the U.S. EPA's Air Quality Index
 * and the WHO/EPA UV Index scales. Kept as an adapter (like
 * `WeatherIconResolver`) so copy can change without callers needing to
 * know the underlying thresholds.
 *
 * @see https://www.airnow.gov/aqi/aqi-basics/
 * @see https://www.epa.gov/sunsafety/uv-index-scale-0
 */
export interface AirQualityCategory {
  label: string
  description: string
}

const AQI_CATEGORIES: Array<{ maxAqi: number; label: string; description: string }> = [
  { maxAqi: 50, label: 'Good', description: 'Air quality is ideal for most individuals.' },
  {
    maxAqi: 100,
    label: 'Moderate',
    description: 'Air quality is acceptable, though sensitive individuals may notice minor effects.',
  },
  {
    maxAqi: 150,
    label: 'Unhealthy for Sensitive Groups',
    description: 'Sensitive groups may experience health effects; the general public is less affected.',
  },
  {
    maxAqi: 200,
    label: 'Unhealthy',
    description: 'Everyone may begin to experience health effects.',
  },
  {
    maxAqi: 300,
    label: 'Very Unhealthy',
    description: 'Health alert: the entire population is likely to be affected.',
  },
]
const HAZARDOUS_CATEGORY = { label: 'Hazardous', description: 'Health warning of emergency conditions for everyone.' }

export function resolveAirQualityCategory(usAqi: number): AirQualityCategory {
  const match = AQI_CATEGORIES.find((category) => usAqi <= category.maxAqi)
  return match ?? HAZARDOUS_CATEGORY
}

const UV_CATEGORIES: Array<{ maxIndex: number; label: string }> = [
  { maxIndex: 2, label: 'Low' },
  { maxIndex: 5, label: 'Moderate' },
  { maxIndex: 7, label: 'High' },
  { maxIndex: 10, label: 'Very High' },
]
const EXTREME_UV_LABEL = 'Extreme'

export function resolveUvIndexLabel(uvIndex: number): string {
  const match = UV_CATEGORIES.find((category) => uvIndex <= category.maxIndex)
  return match?.label ?? EXTREME_UV_LABEL
}
