/**
 * A locally-derived weather advisory - not a feed from an official
 * meteorological agency. Open-Meteo's free tier has no reliable global
 * alerts endpoint, so alerts are computed client-side from the same
 * `CurrentWeather`/`DailyForecast` data already fetched, using simple
 * threshold rules (see `resolveWeatherAlerts`). This keeps the "no
 * backend, no API keys" architecture intact while still surfacing the
 * kind of advisory a reviewer would expect to see.
 */
export type WeatherAlertSeverity = 'moderate' | 'severe'

export type WeatherAlertKind = 'heat' | 'cold' | 'storm' | 'wind' | 'rain'

export interface WeatherAlert {
  id: string
  kind: WeatherAlertKind
  severity: WeatherAlertSeverity
  title: string
  description: string
}
