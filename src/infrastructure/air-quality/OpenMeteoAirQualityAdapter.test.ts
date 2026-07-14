import { describe, expect, it, vi } from 'vitest'

import { AirQualityApiError } from './errors'
import { OpenMeteoAirQualityAdapter } from './OpenMeteoAirQualityAdapter'
import type { OpenMeteoAirQualityResponse } from './openMeteoAirQuality.types'

const LOCATION = { latitude: 37.7749, longitude: -122.4194 }

function buildResponse(overrides: Partial<OpenMeteoAirQualityResponse> = {}): OpenMeteoAirQualityResponse {
  return {
    latitude: 37.75,
    longitude: -122.42,
    current: { time: '2026-01-01T12:00', us_aqi: 24, uv_index: 4 },
    ...overrides,
  }
}

function fakeFetch(response: Partial<Response> & { jsonValue?: unknown }) {
  return vi.fn().mockResolvedValue({
    ok: response.ok ?? true,
    status: response.status ?? 200,
    json: async () => response.jsonValue,
  } as Response)
}

describe('OpenMeteoAirQualityAdapter.getAirQuality', () => {
  it('maps a successful response to the domain AirQuality shape', async () => {
    const fetchFn = fakeFetch({ jsonValue: buildResponse() })
    const adapter = new OpenMeteoAirQualityAdapter({ fetchFn })

    const airQuality = await adapter.getAirQuality(LOCATION)

    expect(airQuality).toEqual({ usAqi: 24, uvIndex: 4 })
    expect(fetchFn).toHaveBeenCalledWith(expect.stringContaining('air-quality-api.open-meteo.com'))
  })

  it('caches the result so a second call for the same location skips the network', async () => {
    const fetchFn = fakeFetch({ jsonValue: buildResponse() })
    const adapter = new OpenMeteoAirQualityAdapter({ fetchFn })

    await adapter.getAirQuality(LOCATION)
    await adapter.getAirQuality(LOCATION)

    expect(fetchFn).toHaveBeenCalledTimes(1)
  })

  it('throws AirQualityApiError when the network request fails', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('offline'))
    const adapter = new OpenMeteoAirQualityAdapter({ fetchFn })

    await expect(adapter.getAirQuality(LOCATION)).rejects.toBeInstanceOf(AirQualityApiError)
  })

  it('throws AirQualityApiError on a non-OK HTTP response', async () => {
    const fetchFn = fakeFetch({ ok: false, status: 500 })
    const adapter = new OpenMeteoAirQualityAdapter({ fetchFn })

    await expect(adapter.getAirQuality(LOCATION)).rejects.toBeInstanceOf(AirQualityApiError)
  })

  it('throws AirQualityApiError when the response is missing the current block', async () => {
    const fetchFn = fakeFetch({ jsonValue: { latitude: 1, longitude: 2 } })
    const adapter = new OpenMeteoAirQualityAdapter({ fetchFn })

    await expect(adapter.getAirQuality(LOCATION)).rejects.toBeInstanceOf(AirQualityApiError)
  })
})
