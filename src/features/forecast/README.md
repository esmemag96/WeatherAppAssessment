# forecast

`useForecastStore` — active forecast state, backed by `WeatherRepository.getForecast` (`src/infrastructure/weather`), which caches responses for 10 minutes.

- `selectedLocation`, `forecast`, `isLoading`, `error`
- `loadForecast(location)`, `retry()`

UI (current conditions card, hourly strip, daily list) is not built yet - only the store exists so far.
