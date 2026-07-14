import { StorageReadError, StorageWriteError } from './errors'
import type { StorageRepository } from './StorageRepository'

/**
 * `StorageRepository` implementation backed by `window.localStorage`.
 * The underlying `Storage` object is injectable so tests can supply a
 * fake that simulates quota errors or an unavailable storage API.
 */
export class LocalStorageRepository implements StorageRepository {
  private readonly storage: Storage

  constructor(storage: Storage = window.localStorage) {
    this.storage = storage
  }

  get<T>(key: string): T | null {
    let raw: string | null
    try {
      raw = this.storage.getItem(key)
    } catch (cause) {
      throw new StorageReadError(key, cause)
    }

    if (raw === null) return null

    try {
      return JSON.parse(raw) as T
    } catch (cause) {
      throw new StorageReadError(key, cause)
    }
  }

  set<T>(key: string, value: T): void {
    try {
      this.storage.setItem(key, JSON.stringify(value))
    } catch (cause) {
      throw new StorageWriteError(key, cause)
    }
  }

  remove(key: string): void {
    try {
      this.storage.removeItem(key)
    } catch (cause) {
      throw new StorageWriteError(key, cause)
    }
  }
}
