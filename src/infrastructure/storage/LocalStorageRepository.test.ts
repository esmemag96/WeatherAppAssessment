import { beforeEach, describe, expect, it } from 'vitest'

import { StorageReadError, StorageWriteError } from './errors'
import { LocalStorageRepository } from './LocalStorageRepository'

describe('LocalStorageRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null for a key that was never set', () => {
    const repository = new LocalStorageRepository()
    expect(repository.get('missing')).toBeNull()
  })

  it('round-trips objects through set/get', () => {
    const repository = new LocalStorageRepository()
    const value = { id: '1', name: 'London' }

    repository.set('location', value)

    expect(repository.get('location')).toEqual(value)
  })

  it('round-trips arrays and primitives', () => {
    const repository = new LocalStorageRepository()

    repository.set('list', [1, 2, 3])
    repository.set('flag', true)

    expect(repository.get('list')).toEqual([1, 2, 3])
    expect(repository.get('flag')).toBe(true)
  })

  it('removes a key', () => {
    const repository = new LocalStorageRepository()
    repository.set('temp', 'value')

    repository.remove('temp')

    expect(repository.get('temp')).toBeNull()
  })

  it('throws a StorageReadError when the stored value is not valid JSON', () => {
    const repository = new LocalStorageRepository()
    localStorage.setItem('corrupt', '{not valid json')

    expect(() => repository.get('corrupt')).toThrow(StorageReadError)
  })

  it('throws a StorageWriteError when the underlying storage throws (e.g. quota exceeded)', () => {
    const throwingStorage: Storage = {
      length: 0,
      clear: () => {},
      key: () => null,
      getItem: () => null,
      removeItem: () => {},
      setItem: () => {
        throw new DOMException('QuotaExceededError')
      },
    }
    const repository = new LocalStorageRepository(throwingStorage)

    expect(() => repository.set('anything', 'value')).toThrow(StorageWriteError)
  })

  it('throws a StorageReadError when the underlying storage throws on read', () => {
    const throwingStorage: Storage = {
      length: 0,
      clear: () => {},
      key: () => null,
      getItem: () => {
        throw new Error('storage unavailable')
      },
      removeItem: () => {},
      setItem: () => {},
    }
    const repository = new LocalStorageRepository(throwingStorage)

    expect(() => repository.get('anything')).toThrow(StorageReadError)
  })
})
