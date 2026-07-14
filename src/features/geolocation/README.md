# geolocation

`useGeolocation` — composable wrapping the browser Geolocation API behind `GeolocationProvider` (`src/infrastructure/geolocation`), so components never call `navigator.geolocation` directly.

- `isSupported`, `isLocating`, `error`, `hasPromptedBefore`
- `requestCurrentLocation()` — resolves the device's current position into a domain `Location` (id `"current-location"`, name `"Current Location"`, browser-resolved IANA timezone - there's no reverse-geocoding provider wired up, only forward name search), or `null` on failure (see `error`).
- `markPrompted()` — persists (via `StorageRepository`) that the user has answered the permission prompt once, so callers can avoid re-asking automatically on every visit while still allowing a manual retry.

UI: `pages/Home/components/LocationPermissionPrompt.vue` asks once on first dashboard visit when no location is otherwise known (no selection, no favorites, no recent searches); `SearchPage`'s "Use Current Location" quick action calls it explicitly at any time.
