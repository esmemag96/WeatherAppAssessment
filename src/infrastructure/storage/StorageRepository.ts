/**
 * Narrow contract for key/value persistence. Features (favorites,
 * recent-searches, settings) depend on this interface, not on
 * `window.localStorage` directly, so persistence can be swapped
 * (e.g. for IndexedDB) without touching feature/store code.
 */
export interface StorageRepository {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
}
