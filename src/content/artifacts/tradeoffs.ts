import type { TradeoffItem } from './types'

export const tradeoffsContent = {
  title: 'Trade-offs',
  subtitle: 'Every shortcut was intentional — each gap has a reason and a future path.',
  items: [
    {
      id: 'no-backend',
      decision: 'No backend',
      why: 'Simpler MVP, zero infrastructure to operate for a one-week solo build.',
      cost: 'No server-side cache, no shared rate-limiting in front of the public API.',
      future: 'A thin backend gateway if usage or provider requirements change.',
    },
    {
      id: 'weather-visuals',
      decision: 'Curated weather visuals',
      why: 'Avoids an external image provider and the network dependency it adds.',
      cost: 'No city-specific photography — visuals are condition-based, not location-based.',
      future: 'A provider abstraction for imagery, matching the pattern already used for weather data.',
    },
    {
      id: 'localstorage-only',
      decision: 'LocalStorage-only persistence',
      why: 'No account system needed for an MVP with no cross-device requirement.',
      cost: 'Preferences don\'t follow a user across devices or survive clearing browser data.',
      future: 'A backend-backed storage repository, swapped in behind the existing interface.',
    },
    {
      id: 'single-provider',
      decision: 'Single weather provider',
      why: 'One free, keyless API was enough to prove the architecture without added complexity.',
      cost: 'No fallback if Open-Meteo has an outage; fewer data fields than a premium provider.',
      future: 'A second adapter behind the same repository interface for redundancy.',
    },
    {
      id: 'e2e-deprioritized',
      decision: 'End-to-end tests deprioritized',
      why: 'Unit coverage on the data layer (where the actual logic lives) was the higher-value use of limited time.',
      cost: 'No automated protection against UI regressions in the full user flow.',
      future: 'A small Playwright smoke suite covering the one critical path.',
    },
  ] satisfies TradeoffItem[],
}
