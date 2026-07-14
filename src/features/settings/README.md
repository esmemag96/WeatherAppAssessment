# settings

`useSettingsStore` — `UserPreferences` (from `src/entities/settings`), persisted through `StorageRepository` (`src/infrastructure/storage`).

- `preferences`, `units` (temperature unit, celsius/fahrenheit)
- `setUnits(unit)`

Theme toggle UI (wired to `shared/composables/useDarkMode`) is not built yet - only the store exists so far.
