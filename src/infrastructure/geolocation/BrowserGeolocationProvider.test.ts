import { describe, expect, it, vi } from 'vitest'

import { BrowserGeolocationProvider } from './BrowserGeolocationProvider'
import { GeolocationError } from './errors'

function buildFakeGeolocation(): Geolocation {
  return {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  } as unknown as Geolocation
}

describe('BrowserGeolocationProvider', () => {
  it('reports unsupported when no geolocation API is available', () => {
    const provider = new BrowserGeolocationProvider({ geolocation: undefined })
    expect(provider.isSupported()).toBe(false)
  })

  it('reports supported when a geolocation API is available', () => {
    const provider = new BrowserGeolocationProvider({ geolocation: buildFakeGeolocation() })
    expect(provider.isSupported()).toBe(true)
  })

  it('rejects with an "unsupported" GeolocationError when unsupported', async () => {
    const provider = new BrowserGeolocationProvider({ geolocation: undefined })

    await expect(provider.getCurrentPosition()).rejects.toMatchObject({ code: 'unsupported' })
  })

  it('resolves with latitude/longitude on success', async () => {
    const geolocation = buildFakeGeolocation()
    vi.mocked(geolocation.getCurrentPosition).mockImplementation((success) => {
      success({ coords: { latitude: 51.5, longitude: -0.13 } } as GeolocationPosition)
    })

    const provider = new BrowserGeolocationProvider({ geolocation })
    const coordinates = await provider.getCurrentPosition()

    expect(coordinates).toEqual({ latitude: 51.5, longitude: -0.13 })
  })

  it.each([
    [1, 'permission-denied'],
    [2, 'position-unavailable'],
    [3, 'timeout'],
  ] as const)('maps PositionError code %i to GeolocationError code "%s"', async (code, expectedCode) => {
    const geolocation = buildFakeGeolocation()
    vi.mocked(geolocation.getCurrentPosition).mockImplementation((_success, error) => {
      error?.({
        code,
        message: 'native error',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      } as GeolocationPositionError)
    })

    const provider = new BrowserGeolocationProvider({ geolocation })

    await expect(provider.getCurrentPosition()).rejects.toBeInstanceOf(GeolocationError)
    await expect(provider.getCurrentPosition()).rejects.toMatchObject({ code: expectedCode })
  })
})
