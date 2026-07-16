/** Minimal Open-Meteo payloads for Playwright route mocks. */

export const MOCK_GEOCODING = {
  results: [
    {
      id: 2643743,
      name: 'London',
      latitude: 51.50853,
      longitude: -0.12574,
      timezone: 'Europe/London',
      country: 'United Kingdom',
      country_code: 'GB',
      admin1: 'England',
    },
  ],
}

export const MOCK_FORECAST = {
  latitude: 51.5,
  longitude: -0.13,
  timezone: 'Europe/London',
  current: {
    time: '2026-01-01T12:00',
    temperature_2m: 8.4,
    apparent_temperature: 6.1,
    dew_point_2m: 3.2,
    relative_humidity_2m: 72,
    weather_code: 3,
    wind_speed_10m: 14.2,
    wind_direction_10m: 225,
    visibility: 18000,
    is_day: 1,
  },
  hourly: {
    time: ['2026-01-01T12:00', '2026-01-01T13:00'],
    temperature_2m: [8.4, 9.1],
    weather_code: [3, 61],
    precipitation_probability: [10, 40],
  },
  daily: {
    time: ['2026-01-01', '2026-01-02'],
    temperature_2m_max: [9.5, 10.2],
    temperature_2m_min: [3.1, 4.0],
    weather_code: [3, 95],
    precipitation_probability_max: [20, 80],
  },
}

export const MOCK_AIR_QUALITY = {
  latitude: 51.5,
  longitude: -0.13,
  current: {
    time: '2026-01-01T12:00',
    us_aqi: 55,
    uv_index: 3,
  },
}
