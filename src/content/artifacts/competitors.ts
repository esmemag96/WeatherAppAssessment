import type { CompetitorCardData } from './types'

export const competitorsContent = {
  title: 'Competitor Insights',
  subtitle: 'Reference products evaluated for patterns worth adopting or rejecting.',
  competitors: [
    {
      name: 'Apple Weather',
      worksWell: 'Condition-based hero with clear visual hierarchy',
      doesNot: 'Platform-specific patterns not portable to web',
      adopted: 'Hierarchy, hero treatment, metric grouping',
      rejected: 'Native navigation patterns, full-screen maps',
    },
    {
      name: 'Google Weather',
      worksWell: 'Fast search with minimal chrome',
      doesNot: 'Limited extended forecast depth',
      adopted: 'Debounced search, essential-metrics-first layout',
      rejected: 'Embedded search-product shell',
    },
    {
      name: 'AccuWeather',
      worksWell: 'Rich supplementary metrics (UV, air quality)',
      doesNot: 'High density and advertising reduce clarity',
      adopted: 'Selected metrics: humidity, wind, UV, air quality',
      rejected: 'Aggressive density, premium gating, ads',
    },
    {
      name: 'Weather Channel',
      worksWell: 'Structured forecast sections by horizon',
      doesNot: 'Editorial content distracts from forecast data',
      adopted: 'Hourly and daily section structure',
      rejected: 'News feed, video content, promotional layout',
    },
    {
      name: 'Windy',
      worksWell: 'Exceptional map-based visualization',
      doesNot: 'Steep learning curve for casual users',
      adopted: 'Accurate wind display, data precision',
      rejected: 'Map-centric UX, multi-layer controls',
    },
  ] satisfies CompetitorCardData[],
  designPrinciples: [
    'Apple-style hierarchy with Google-style simplicity',
    'Useful metrics without AccuWeather-level density',
    'Clear state communication for loading, error, and offline',
    'Restrained scope — no maps, radar, or content feeds',
  ],
}
