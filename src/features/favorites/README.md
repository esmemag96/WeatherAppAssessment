# favorites

`useFavoritesStore` — saved-locations state, persisted through `StorageRepository` (`src/infrastructure/storage`).

- `favorites`
- `addFavorite(location)`, `removeFavorite(locationId)`, `isFavorite(locationId)`

UI: the Favorites page (`src/pages/Favorites`) lists/removes favorites via `useFavoritesPage`; the Home dashboard's star button (`useWeatherDashboard`) adds/removes the currently viewed location.
