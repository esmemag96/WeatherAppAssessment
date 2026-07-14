export type TemperatureUnit = 'celsius' | 'fahrenheit'
export type WindSpeedUnit = 'kph' | 'mph'
export type ThemePreference = 'dark' | 'light'

/** Domain model for persisted user preferences. */
export interface UserPreferences {
  temperatureUnit: TemperatureUnit
  windSpeedUnit: WindSpeedUnit
  theme: ThemePreference
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kph',
  theme: 'dark',
}
