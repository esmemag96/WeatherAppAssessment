interface CacheEntry<T> {
  value: T
  expiresAt: number
}

/**
 * Small generic in-memory TTL cache. Not tied to weather/storage
 * specifically so any repository/adapter can reuse it (e.g. to cache
 * forecasts or geocoding results) without depending on browser storage.
 */
export class CacheService<T> {
  private readonly store = new Map<string, CacheEntry<T>>()
  private readonly ttlMs: number
  private readonly now: () => number

  constructor(ttlMs: number, now: () => number = () => Date.now()) {
    this.ttlMs = ttlMs
    this.now = now
  }

  get(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    if (this.now() >= entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.value
  }

  set(key: string, value: T): void {
    this.store.set(key, { value, expiresAt: this.now() + this.ttlMs })
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}
