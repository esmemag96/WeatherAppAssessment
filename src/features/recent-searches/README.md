# recent-searches

`useRecentSearchesStore` — recently viewed locations (capped at 10, most recent first), persisted through `StorageRepository` (`src/infrastructure/storage`).

- `recentSearches`
- `addRecentSearch(location)`, `clearRecentSearches()`

UI: the Search page (`src/pages/Search`) shows this list when the query is empty, via `useSearchPage`.
