import type { CompetitorCardData } from './types'

export const competitorsContent = {
  title: 'Looking at Existing Products',
  subtitle:
    'Once I had a better idea of who would use the application, I looked at how other weather apps solve the same problem — not to copy one app, but to understand what already works well within a two-week time limit.',
  framing:
    'Keep what works — current weather focus, fast search, clear forecasts, condition visuals, mobile-first — and explicitly leave out radar, news, ads, advanced metrics, city image APIs, and accounts.',
  productsReviewed: ['Apple Weather', 'Google Weather', 'AccuWeather', 'The Weather Channel', 'Windy'],
  kept: [
    'A strong focus on the current weather',
    'A short path from search to forecast',
    'Clear hourly and daily forecasts',
    'Weather-condition visuals',
    'A mobile-first experience',
  ],
  leftOut: [
    'Radar maps',
    'Weather news',
    'Advertisements',
    'Advanced weather metrics',
    'City image APIs',
    'User accounts and synchronization',
  ],
  competitors: [
    {
      id: 'apple-weather',
      name: 'Apple Weather',
      worksWell: 'Condition-based backgrounds make the current state legible at a glance.',
      doesntWork: 'Dense secondary data competes with the primary number.',
      adopted: 'Condition-driven visuals as the emotional anchor of the screen.',
      rejected: 'Long stacks of secondary metric modules — out of scope for this MVP.',
    },
    {
      id: 'google-weather',
      name: 'Google Weather',
      worksWell: 'Extremely fast search-to-result path with minimal friction.',
      doesntWork: 'Visually plain — function over any sense of place or mood.',
      adopted: 'A search flow with as few steps as possible between typing and seeing a result.',
      rejected: 'The purely utilitarian visual tone — this app wanted more warmth.',
    },
    {
      id: 'accuweather',
      name: 'AccuWeather',
      worksWell: 'Strong hourly and daily breakdowns for people who want detail.',
      doesntWork: 'Ad density and information overload undermine trust in the core forecast.',
      adopted: 'Clear hourly/daily structure, kept lightweight.',
      rejected: 'Any monetization-driven UI patterns — irrelevant and distracting here.',
    },
    {
      id: 'weather-channel',
      name: 'The Weather Channel',
      worksWell: 'Strong editorial framing during severe weather events.',
      doesntWork: "Heavy, video-and-article-first homepage slows down the one thing you're there for.",
      adopted: 'Nothing directly — the editorial layer is out of scope for an MVP.',
      rejected: 'Content/media-first layout — this app is a tool, not a media property.',
    },
    {
      id: 'windy',
      name: 'Windy',
      worksWell: 'Exceptional for people who want to explore data spatially (maps, layers).',
      doesntWork: "Steep learning curve for someone who just wants today's forecast.",
      adopted: 'Respect for people who want more detail, without forcing it on everyone.',
      rejected: 'Map-first navigation — too complex for the stated single-location use case.',
    },
  ] satisfies CompetitorCardData[],
}
