/** Thrown when reading a key fails (corrupt JSON, storage unavailable, etc). */
export class StorageReadError extends Error {
  readonly cause?: unknown

  constructor(key: string, cause?: unknown) {
    super(`Failed to read "${key}" from storage.`)
    this.name = 'StorageReadError'
    this.cause = cause
  }
}

/** Thrown when writing a key fails (quota exceeded, storage unavailable, etc). */
export class StorageWriteError extends Error {
  readonly cause?: unknown

  constructor(key: string, cause?: unknown) {
    super(`Failed to write "${key}" to storage.`)
    this.name = 'StorageWriteError'
    this.cause = cause
  }
}
