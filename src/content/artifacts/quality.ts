import type { QualityMetricData } from './types'

export const qualityContent = {
  title: 'Quality',
  subtitle: 'Testing strategy and engineering quality indicators.',
  metrics: [
    {
      id: 'typescript',
      label: 'TypeScript',
      status: 'Passing (strict)',
      description: 'Strict mode enabled throughout. vue-tsc passes on build.',
      futureImprovement: 'Stricter eslint rules for explicit return types on public APIs.',
    },
    {
      id: 'vitest',
      label: 'Vitest',
      status: '190+ tests passing',
      description: 'Unit tests for mappers, stores, composables, and components.',
      futureImprovement: 'Coverage reporting in CI with meaningful thresholds.',
    },
    {
      id: 'playwright',
      label: 'Playwright',
      status: 'Planned',
      description: 'E2E tests for search, forecast, favorites, and settings flows.',
      futureImprovement: 'Run against preview deployments on pull requests.',
    },
    {
      id: 'responsive',
      label: 'Responsive',
      status: 'Implemented',
      description: 'Mobile-first layout from 320px to 1440px with tested breakpoints.',
      futureImprovement: 'Visual regression tests for key viewport sizes.',
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      status: 'Manual + planned automation',
      description: 'Keyboard navigation, semantic structure, and WCAG 2.1 AA contrast targets.',
      futureImprovement: 'axe-core integration in CI pipeline.',
    },
    {
      id: 'performance',
      label: 'Performance',
      status: 'Pending measurement',
      description: 'Lazy-loaded routes, minimal initial bundle, cached API responses.',
      futureImprovement: 'Lighthouse CI with performance budgets.',
    },
    {
      id: 'build',
      label: 'Build Status',
      status: 'Passing',
      description: 'vue-tsc and Vite production build complete without errors.',
      futureImprovement: 'Bundle size monitoring with size-limit checks.',
    },
  ] satisfies QualityMetricData[],
}
