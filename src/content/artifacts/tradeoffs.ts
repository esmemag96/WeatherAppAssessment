import type { TradeoffItem } from './types'

export const tradeoffsContent = {
  title: 'Trade-offs',
  subtitle: 'Honest assessment of decisions accepted and their costs.',
  items: [
    {
      id: 'no-backend',
      decision: 'No backend',
      reason: 'Simpler MVP without server infrastructure or authentication.',
      cost: 'No server-side cache, no cross-device sync, no API key protection.',
      futureImprovement: 'Backend gateway for provider proxy and user accounts.',
    },
    {
      id: 'hero-visuals',
      decision: 'Weather-condition visuals',
      reason: 'Avoid external image provider dependency and licensing.',
      cost: 'No city-specific imagery; less visual variety across locations.',
      futureImprovement: 'Provider abstraction for optional photography.',
    },
    {
      id: 'local-storage',
      decision: 'Browser-only persistence',
      reason: 'No accounts required; adequate for single-device returning users.',
      cost: 'Data lost on browser clear or device change.',
      futureImprovement: 'Synced storage with authenticated backend.',
    },
    {
      id: 'open-meteo',
      decision: 'Free-tier weather API',
      reason: 'No API keys, billing, or backend proxy for MVP.',
      cost: 'No SLA; outages surface as client-side errors.',
      futureImprovement: 'Paid provider with backend proxy and fallback.',
    },
    {
      id: 'no-e2e',
      decision: 'No E2E suite yet',
      reason: 'Unit and composable tests cover critical logic within time constraints.',
      cost: 'Full browser flows not automatically validated in CI.',
      futureImprovement: 'Playwright suite against preview deployments.',
    },
    {
      id: 'limited-offline',
      decision: 'Limited offline support',
      reason: 'No service worker or offline cache in MVP scope.',
      cost: 'Connectivity loss shows errors instead of stale cached data.',
      futureImprovement: 'PWA with service worker and forecast caching.',
    },
  ] satisfies TradeoffItem[],
}
