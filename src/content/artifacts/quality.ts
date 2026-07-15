import type { QualityMetricData } from './types'

export const qualityContent = {
  title: 'Quality',
  subtitle: 'Honest status per area — what is done, what is partial, and what is planned.',
  metrics: [
    {
      id: 'typescript',
      label: 'TypeScript',
      status: 'complete',
      description:
        'Strict mode is enabled via the Vue TypeScript preset. The app is written in TypeScript throughout, including domain types and mappers.',
      futureImprovements: 'Tighten lint rules for explicit return types on public APIs.',
    },
    {
      id: 'vitest',
      label: 'Vitest',
      status: 'partial',
      description:
        '190 unit tests cover domain logic, mappers, stores, repositories, and key UI components — but store edge cases and full coverage reporting are not yet in place.',
      futureImprovements: 'Extend coverage to remaining store edge cases and add coverage reporting in CI.',
    },
    {
      id: 'playwright',
      label: 'Playwright',
      status: 'planned',
      description:
        'No end-to-end tests yet — deprioritized in favor of data-layer unit tests within the one-week scope.',
      futureImprovements: 'Add a small smoke-test suite covering search → forecast → favorite as the highest-value path.',
    },
    {
      id: 'responsive',
      label: 'Responsive',
      status: 'complete',
      description: 'Layout adapts across mobile and desktop breakpoints, including the Engineering Review and weather app.',
      futureImprovements: 'Validate against a wider device matrix, including small Android devices.',
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      status: 'partial',
      description:
        'Semantic markup, keyboard navigation, and ARIA labels cover the core search-to-forecast flow — a full WCAG AA audit has not been run.',
      futureImprovements: 'A full screen-reader pass and a color-contrast audit against WCAG AA.',
    },
    {
      id: 'performance',
      label: 'Performance',
      status: 'complete',
      description: 'Static SPA with lazy-loaded routes; no server round-trip beyond the weather API itself.',
      futureImprovements: 'Add a Lighthouse budget to CI to catch regressions automatically.',
    },
    {
      id: 'build-status',
      label: 'Build status',
      status: 'partial',
      description:
        'Production build, type-check, and Vitest all pass locally and deploy to Vercel — automated CI gates (lint, test, type-check on every push) are not configured yet.',
      futureImprovements: 'Add automated checks as a required CI gate before deploy.',
    },
  ] satisfies QualityMetricData[],
}
