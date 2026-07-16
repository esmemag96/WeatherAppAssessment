# settings

`useSettingsStore` — `UserPreferences` (from `src/entities/settings`), persisted through `StorageRepository` (`src/infrastructure/storage`).

- `preferences` — temperature unit, wind speed unit, theme
- `units` — temperature unit convenience computed (`celsius` / `fahrenheit`)
- `setUnits(unit)` / `setWindSpeedUnit(unit)` / `setTheme(theme)`

Theme is applied to `document.documentElement` via `applyTheme` / `useTheme`.
