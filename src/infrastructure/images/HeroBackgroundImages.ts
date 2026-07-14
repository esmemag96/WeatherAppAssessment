import clearImage from '@/assets/weather/clear.png'
import cloudyImage from '@/assets/weather/cloudy.png'
import coldImage from '@/assets/weather/cold.png'
import fogImage from '@/assets/weather/fog.png'
import hotImage from '@/assets/weather/hot.png'
import nightImage from '@/assets/weather/night.png'
import partlyCloudyImage from '@/assets/weather/partly-cloudy.png'
import rainImage from '@/assets/weather/rain.png'
import snowImage from '@/assets/weather/snow.png'
import stormImage from '@/assets/weather/storm.png'

import type { WeatherVisual } from './WeatherVisualResolver'

/**
 * `WeatherVisual` -> bundled background image. Images are imported as
 * ES modules (not referenced by public-folder path) so Vite fingerprints
 * and code-splits them like any other asset - no separate image API or
 * network round-trip is needed, which is the most efficient option for
 * a fixed, small set of backgrounds like this.
 */
const HERO_IMAGE_BY_VISUAL: Partial<Record<WeatherVisual, string>> = {
  clear: clearImage,
  'partly-cloudy': partlyCloudyImage,
  cloudy: cloudyImage,
  fog: fogImage,
  rain: rainImage,
  snow: snowImage,
  storm: stormImage,
  hot: hotImage,
  cold: coldImage,
  night: nightImage,
}

export function resolveHeroBackgroundImage(visual: WeatherVisual): string | undefined {
  return HERO_IMAGE_BY_VISUAL[visual]
}
