import { describe, expect, it } from 'vitest'

import { resolveHeroBackgroundImage } from './HeroBackgroundImages'
import type { WeatherVisual } from './WeatherVisualResolver'

const ALL_VISUALS: WeatherVisual[] = [
  'clear',
  'partly-cloudy',
  'cloudy',
  'fog',
  'rain',
  'snow',
  'storm',
  'hot',
  'cold',
  'night',
]

describe('resolveHeroBackgroundImage', () => {
  it('resolves a bundled image url for every visual', () => {
    for (const visual of ALL_VISUALS) {
      expect(resolveHeroBackgroundImage(visual)).toBeTruthy()
    }
  })
})
