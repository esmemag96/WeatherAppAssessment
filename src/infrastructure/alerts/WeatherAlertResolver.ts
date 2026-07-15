import type { CurrentWeather, DailyForecast, WeatherAlert } from '@/entities/weather'

/**
 * Thresholds mirror the "hot"/"cold" hero-visual thresholds
 * (`WeatherVisualResolver`) at the moderate tier, with a stricter tier
 * added for genuinely dangerous readings. Evaluated in °C - the
 * domain's canonical unit - so results never depend on the user's
 * display unit preference.
 */
const HEAT_SEVERE_C = 38
const HEAT_MODERATE_C = 32
const COLD_SEVERE_C = -10
const COLD_MODERATE_C = 0
const WIND_SEVERE_KPH = 60
const WIND_MODERATE_KPH = 40
const HEAVY_RAIN_CHANCE_PERCENT = 80

function heatAlert(maxTemperatureC: number): WeatherAlert | null {
  if (maxTemperatureC >= HEAT_SEVERE_C) {
    return {
      id: 'heat',
      kind: 'heat',
      severity: 'severe',
      title: 'Extreme Heat Warning',
      description: `Today's high reaches ${Math.round(maxTemperatureC)}\u00b0C. Limit outdoor exposure and stay hydrated.`,
    }
  }
  if (maxTemperatureC >= HEAT_MODERATE_C) {
    return {
      id: 'heat',
      kind: 'heat',
      severity: 'moderate',
      title: 'High Temperature Advisory',
      description: `Today's high reaches ${Math.round(maxTemperatureC)}\u00b0C. Consider limiting time outdoors.`,
    }
  }
  return null
}

function coldAlert(minTemperatureC: number): WeatherAlert | null {
  if (minTemperatureC <= COLD_SEVERE_C) {
    return {
      id: 'cold',
      kind: 'cold',
      severity: 'severe',
      title: 'Extreme Cold Warning',
      description: `Today's low drops to ${Math.round(minTemperatureC)}\u00b0C. Dress in layers and limit time outside.`,
    }
  }
  if (minTemperatureC <= COLD_MODERATE_C) {
    return {
      id: 'cold',
      kind: 'cold',
      severity: 'moderate',
      title: 'Low Temperature Advisory',
      description: `Today's low drops to ${Math.round(minTemperatureC)}\u00b0C. Watch for icy surfaces.`,
    }
  }
  return null
}

function stormAlert(current: CurrentWeather): WeatherAlert | null {
  if (current.condition !== 'thunderstorm') return null
  return {
    id: 'storm',
    kind: 'storm',
    severity: 'severe',
    title: 'Thunderstorm Warning',
    description: 'Thunderstorms are active in this area. Seek shelter and avoid open spaces.',
  }
}

function windAlert(windSpeedKph: number): WeatherAlert | null {
  if (windSpeedKph >= WIND_SEVERE_KPH) {
    return {
      id: 'wind',
      kind: 'wind',
      severity: 'severe',
      title: 'High Wind Warning',
      description: `Sustained winds around ${Math.round(windSpeedKph)} km/h. Secure loose outdoor objects.`,
    }
  }
  if (windSpeedKph >= WIND_MODERATE_KPH) {
    return {
      id: 'wind',
      kind: 'wind',
      severity: 'moderate',
      title: 'Wind Advisory',
      description: `Sustained winds around ${Math.round(windSpeedKph)} km/h. Expect some outdoor disruption.`,
    }
  }
  return null
}

function rainAlert(today: DailyForecast): WeatherAlert | null {
  if (today.condition !== 'rain' || today.precipitationChancePercent < HEAVY_RAIN_CHANCE_PERCENT) return null
  return {
    id: 'rain',
    kind: 'rain',
    severity: 'moderate',
    title: 'Heavy Rain Advisory',
    description: `${Math.round(today.precipitationChancePercent)}% chance of rain today. Flooding is possible in low-lying areas.`,
  }
}

const SEVERITY_ORDER: Record<WeatherAlert['severity'], number> = { severe: 0, moderate: 1 }

/**
 * Derives locally-computed weather advisories from data the app already
 * has - no extra network call, no third-party alerts feed. Most severe
 * first, so the UI can show the top advisory without re-sorting.
 */
export function resolveWeatherAlerts(current: CurrentWeather, today: DailyForecast | undefined): WeatherAlert[] {
  const alerts = [
    stormAlert(current),
    today ? heatAlert(today.maxTemperatureC) : null,
    today ? coldAlert(today.minTemperatureC) : null,
    windAlert(current.windSpeedKph),
    today ? rainAlert(today) : null,
  ].filter((alert): alert is WeatherAlert => alert !== null)

  return alerts.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
}
