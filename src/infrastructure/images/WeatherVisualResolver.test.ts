import { describe, expect, it } from 'vitest'

import { resolveWeatherVisual } from './WeatherVisualResolver'

describe('resolveWeatherVisual', () => {
  it('returns "night" whenever it is not daytime, regardless of temperature or condition', () => {
    expect(resolveWeatherVisual('clear', 20, false)).toBe('night')
    expect(resolveWeatherVisual('rain', 40, false)).toBe('night')
    expect(resolveWeatherVisual('snow', -10, false)).toBe('night')
  })

  it('returns "hot" once temperature reaches 32C during the day, regardless of condition', () => {
    expect(resolveWeatherVisual('clear', 32, true)).toBe('hot')
    expect(resolveWeatherVisual('rain', 40, true)).toBe('hot')
  })

  it('returns "cold" at or below 0C during the day, regardless of condition', () => {
    expect(resolveWeatherVisual('clear', 0, true)).toBe('cold')
    expect(resolveWeatherVisual('cloudy', -15, true)).toBe('cold')
  })

  it('maps each domain condition to its own visual for mild daytime temperatures', () => {
    expect(resolveWeatherVisual('clear', 15, true)).toBe('clear')
    expect(resolveWeatherVisual('partly-cloudy', 15, true)).toBe('partly-cloudy')
    expect(resolveWeatherVisual('cloudy', 15, true)).toBe('cloudy')
    expect(resolveWeatherVisual('fog', 15, true)).toBe('fog')
    expect(resolveWeatherVisual('rain', 15, true)).toBe('rain')
    expect(resolveWeatherVisual('snow', 15, true)).toBe('snow')
    expect(resolveWeatherVisual('thunderstorm', 15, true)).toBe('storm')
  })

  it('falls back to "cloudy" for an unknown condition at mild daytime temperatures', () => {
    expect(resolveWeatherVisual('unknown', 15, true)).toBe('cloudy')
  })

  it('is unaffected by the display unit - callers always pass Celsius', () => {
    // 32C is the "hot" threshold; a Fahrenheit value would need conversion
    // before being passed in, so a raw 32 always means 32C, never 32F.
    expect(resolveWeatherVisual('clear', 32, true)).toBe('hot')
    expect(resolveWeatherVisual('clear', 31, true)).toBe('clear')
  })
})
