import type { Location } from '@/entities/location'

/** "Region, Country" subtitle for a location row, e.g. "California, United States". Omits either part gracefully when absent. */
export function formatLocationSubtitle(location: Pick<Location, 'admin1' | 'country'>): string {
  return [location.admin1, location.country].filter(Boolean).join(', ')
}
