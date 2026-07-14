import type { Location } from '@/entities/location'
import type {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherCondition,
  WeatherForecast,
} from '@/entities/weather'

import type {
  OpenMeteoForecastResponse,
  OpenMeteoGeocodingResponse,
  OpenMeteoGeocodingResult,
} from './openMeteo.types'

/**
 * WMO weather interpretation codes -> domain `WeatherCondition`.
 * @see https://open-meteo.com/en/docs (WMO Weather interpretation codes)
 */
const WMO_CODE_TO_CONDITION: Record<number, WeatherCondition> = {
  0: 'clear',
  1: 'partly-cloudy',
  2: 'partly-cloudy',
  3: 'cloudy',
  45: 'fog',
  48: 'fog',
  51: 'rain',
  53: 'rain',
  55: 'rain',
  56: 'rain',
  57: 'rain',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  66: 'rain',
  67: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  80: 'rain',
  81: 'rain',
  82: 'rain',
  85: 'snow',
  86: 'snow',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
}

/**
 * Converts Open-Meteo API DTOs into domain models. This is the only
 * place in the codebase allowed to know about Open-Meteo's response
 * shapes or WMO weather codes.
 */
export const WeatherMapper = {
  toCondition(wmoCode: number): WeatherCondition {
    return WMO_CODE_TO_CONDITION[wmoCode] ?? 'unknown'
  },

  toLocation(result: OpenMeteoGeocodingResult): Location {
    return {
      id: String(result.id),
      name: result.name,
      country: result.country,
      admin1: result.admin1,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
    }
  },

  toLocations(response: OpenMeteoGeocodingResponse): Location[] {
    return (response.results ?? []).map((result) => WeatherMapper.toLocation(result))
  },

  toCurrentWeather(dto: OpenMeteoForecastResponse['current']): CurrentWeather {
    return {
      temperatureC: dto.temperature_2m,
      feelsLikeC: dto.apparent_temperature,
      dewPointC: dto.dew_point_2m,
      condition: WeatherMapper.toCondition(dto.weather_code),
      humidityPercent: dto.relative_humidity_2m,
      windSpeedKph: dto.wind_speed_10m,
      windDirectionDeg: dto.wind_direction_10m,
      visibilityMeters: dto.visibility,
      isDay: dto.is_day === 1,
      observedAt: dto.time,
    }
  },

  toHourlyForecast(dto: OpenMeteoForecastResponse['hourly']): HourlyForecast[] {
    return dto.time.map((time, index) => ({
      time,
      temperatureC: dto.temperature_2m[index] ?? 0,
      condition: WeatherMapper.toCondition(dto.weather_code[index] ?? -1),
      precipitationChancePercent: dto.precipitation_probability[index] ?? 0,
    }))
  },

  toDailyForecast(dto: OpenMeteoForecastResponse['daily']): DailyForecast[] {
    return dto.time.map((date, index) => ({
      date,
      minTemperatureC: dto.temperature_2m_min[index] ?? 0,
      maxTemperatureC: dto.temperature_2m_max[index] ?? 0,
      condition: WeatherMapper.toCondition(dto.weather_code[index] ?? -1),
      precipitationChancePercent: dto.precipitation_probability_max[index] ?? 0,
    }))
  },

  toWeatherForecast(dto: OpenMeteoForecastResponse, location: Location, fetchedAt: string): WeatherForecast {
    return {
      location,
      current: WeatherMapper.toCurrentWeather(dto.current),
      hourly: WeatherMapper.toHourlyForecast(dto.hourly),
      daily: WeatherMapper.toDailyForecast(dto.daily),
      updatedAt: fetchedAt,
    }
  },
}
