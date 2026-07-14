import type { TimelineStepData } from './types'

export const uncertaintyContent = {
  title: 'Reducing Uncertainty',
  subtitle: 'How an ambiguous requirement was decomposed into actionable scope.',
  steps: [
    {
      id: 'requirement',
      label: 'Requirement',
      missing: 'Forecast granularity, location input, platform, and quality expectations were undefined.',
      assumption: 'A responsive web app with search-based location selection satisfies the stated need.',
      rationale: 'The requirement mentions web and selected location — no mention of native apps or accounts.',
      impact: 'Native apps or authentication would expand scope beyond the assessment boundary.',
    },
    {
      id: 'questions',
      label: 'Questions',
      missing: 'What data horizons, persistence model, and failure modes are expected?',
      assumption: 'Current + hourly + daily forecasts with local persistence are sufficient for MVP.',
      rationale: 'Consumer weather products consistently surface these horizons as baseline value.',
      impact: 'Radar, alerts, or historical data would require additional providers and UI complexity.',
    },
    {
      id: 'assumptions',
      label: 'Assumptions',
      missing: 'Who is the user, what browsers matter, and what accessibility standard applies?',
      assumption: 'Casual users on modern browsers; WCAG 2.1 AA as the target standard.',
      rationale: 'Assessment context implies consumer UX with professional quality expectations.',
      impact: 'Enterprise or legacy browser support would change the technology and testing strategy.',
    },
    {
      id: 'product-scope',
      label: 'Product Scope',
      missing: 'Which features are in vs. out for a first release?',
      assumption: 'Search, dashboard, favorites, settings in scope. Auth, radar, notifications out.',
      rationale: 'Explicit scope boundaries prevent feature creep during a time-boxed assessment.',
      impact: 'Scope expansion would delay delivery of a coherent, testable MVP.',
    },
    {
      id: 'architecture',
      label: 'Architecture',
      missing: 'How should external APIs integrate without coupling domain logic to provider schemas?',
      assumption: 'Repository and adapter pattern with pure mappers between provider and domain types.',
      rationale: 'Provider schemas change; domain types should remain stable for UI and stores.',
      impact: 'Direct API calls in components would make provider swaps costly and tests brittle.',
    },
    {
      id: 'implementation',
      label: 'Implementation',
      missing: 'What delivery order minimizes risk and enables incremental validation?',
      assumption: 'Epic-based delivery: foundation → infrastructure → features → quality → deployment.',
      rationale: 'Each epic produces a testable increment before dependent work begins.',
      impact: 'Big-bang implementation would delay feedback on architecture and UX decisions.',
    },
    {
      id: 'deployment',
      label: 'Deployment',
      missing: 'Where and how should the application be hosted and validated?',
      assumption: 'Static SPA on Vercel with preview deployments per pull request.',
      rationale: 'No backend means static hosting is sufficient; Vercel provides CI integration.',
      impact: 'Self-managed infrastructure would add operational overhead without MVP benefit.',
    },
  ] satisfies TimelineStepData[],
}
