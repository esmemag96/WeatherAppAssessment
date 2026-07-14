import { describe, expect, it } from 'vitest'

import { CacheService } from './CacheService'

describe('CacheService', () => {
  it('returns null for a key that was never set', () => {
    const cache = new CacheService<string>(1000)
    expect(cache.get('missing')).toBeNull()
  })

  it('returns the cached value before the TTL elapses', () => {
    let currentTime = 0
    const cache = new CacheService<string>(1000, () => currentTime)

    cache.set('key', 'value')
    currentTime += 999

    expect(cache.get('key')).toBe('value')
  })

  it('expires the value once the TTL elapses', () => {
    let currentTime = 0
    const cache = new CacheService<string>(1000, () => currentTime)

    cache.set('key', 'value')
    currentTime += 1000

    expect(cache.get('key')).toBeNull()
  })

  it('treats a 10-minute TTL correctly, as used for forecast caching', () => {
    let currentTime = 0
    const tenMinutesMs = 10 * 60 * 1000
    const cache = new CacheService<number>(tenMinutesMs, () => currentTime)

    cache.set('forecast', 42)
    currentTime += tenMinutesMs - 1
    expect(cache.get('forecast')).toBe(42)

    currentTime += 1
    expect(cache.get('forecast')).toBeNull()
  })

  it('deletes and clears entries', () => {
    const cache = new CacheService<string>(1000)
    cache.set('a', '1')
    cache.set('b', '2')

    cache.delete('a')
    expect(cache.has('a')).toBe(false)
    expect(cache.has('b')).toBe(true)

    cache.clear()
    expect(cache.has('b')).toBe(false)
  })
})
