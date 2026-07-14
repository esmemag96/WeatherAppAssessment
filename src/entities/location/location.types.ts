/**
 * Domain model for a geographic location. Intentionally decoupled from
 * any specific provider's response shape - mapping from provider DTOs to
 * this type happens in `src/infrastructure/**` (see `WeatherMapper`).
 */
export interface Location {
  id: string
  name: string
  country: string
  admin1?: string
  latitude: number
  longitude: number
  timezone: string
}

/** A location the user has explicitly saved. */
export interface FavoriteLocation extends Location {
  /** ISO-8601 timestamp of when the location was favorited. */
  addedAt: string
}

/** A location the user has recently looked up, most recent first. */
export interface RecentSearch extends Location {
  /** ISO-8601 timestamp of when the search happened. */
  searchedAt: string
}
