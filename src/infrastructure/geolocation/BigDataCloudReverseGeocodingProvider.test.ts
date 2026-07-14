import { describe, expect, it, vi } from 'vitest'

import { BigDataCloudReverseGeocodingProvider } from './BigDataCloudReverseGeocodingProvider'

function buildFakeFetch(response: unknown, ok = true): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(response),
  }) as unknown as typeof fetch
}

describe('BigDataCloudReverseGeocodingProvider', () => {
  it('maps a successful response to a ReverseGeocodingResult', async () => {
    const fetchFn = buildFakeFetch({
      city: 'San Francisco',
      countryName: 'United States',
      principalSubdivision: 'California',
    })
    const provider = new BigDataCloudReverseGeocodingProvider({ fetchFn })

    const result = await provider.reverseGeocode({ latitude: 37.77, longitude: -122.42 })

    expect(result).toEqual({ name: 'San Francisco', country: 'United States', admin1: 'California' })
  })

  it('falls back to locality when city is absent', async () => {
    const fetchFn = buildFakeFetch({ locality: 'Little Italy', countryName: 'United States' })
    const provider = new BigDataCloudReverseGeocodingProvider({ fetchFn })

    const result = await provider.reverseGeocode({ latitude: 40.72, longitude: -73.99 })

    expect(result).toMatchObject({ name: 'Little Italy' })
  })

  it('returns null when neither city nor locality is present', async () => {
    const fetchFn = buildFakeFetch({ countryName: 'Antarctica' })
    const provider = new BigDataCloudReverseGeocodingProvider({ fetchFn })

    const result = await provider.reverseGeocode({ latitude: -75, longitude: 0 })

    expect(result).toBeNull()
  })

  it('returns null when the response is not ok', async () => {
    const fetchFn = buildFakeFetch({}, false)
    const provider = new BigDataCloudReverseGeocodingProvider({ fetchFn })

    const result = await provider.reverseGeocode({ latitude: 0, longitude: 0 })

    expect(result).toBeNull()
  })

  it('returns null when the network request throws', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch
    const provider = new BigDataCloudReverseGeocodingProvider({ fetchFn })

    const result = await provider.reverseGeocode({ latitude: 0, longitude: 0 })

    expect(result).toBeNull()
  })
})
