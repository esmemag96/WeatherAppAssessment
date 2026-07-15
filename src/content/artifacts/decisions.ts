import type { DecisionRecord } from './types'

export const decisionsContent = {
  title: 'Key Engineering Decisions',
  subtitle: 'Nine choices that shaped stack, data flow, persistence, and delivery.',
  records: [
    {
      id: 'vue-vite',
      title: 'Vue 3 + Vite',
      summary: 'A modern web app foundation that is fast to build and easy to test.',
      why: 'The assessment needs a component-based app built and reviewed within a one-week window.',
      decisionPlain: 'Build the interface with Vue 3 and Composition API, on Vite for fast dev and production builds.',
      benefits: [
        'Fast iteration during development',
        'Clear component structure for reviewers',
        'Lazy-loaded routes keep initial load small',
        'Composition API keeps logic testable outside SFCs',
      ],
      tabs: {
        context: 'The assessment needs a component-based app, built and reviewed within a one-week window.',
        decision: 'Build the interface with Vue 3 and Composition API, on Vite for fast dev and production builds.',
        alternatives:
          'React or Svelte would have worked equally well — Vue was chosen for familiarity and velocity, not because the others are worse.',
        tradeoffs: 'None significant at this scale; the choice matters far less than what was built inside it.',
        future:
          'The component boundaries were kept clean enough that a framework migration, while unlikely to be needed, would not require a domain-logic rewrite.',
      },
    },
    {
      id: 'pinia',
      title: 'Pinia',
      summary: 'Shared application state lives in predictable, testable stores.',
      why: 'Forecast, favorites, settings, and search all need to share data across screens without tangled prop-passing.',
      decisionPlain: 'One Pinia store per feature — each screen reads and updates state through a clear API.',
      benefits: [
        'Easier to reason about data flow',
        'Stores can be tested without the UI',
        'Devtools support for debugging',
        'Feature boundaries stay explicit',
      ],
      tabs: {
        context:
          'Forecast, favorites, settings, and search all need to share data across screens without tangled prop-passing.',
        decision: 'One Pinia store per feature — each screen reads and updates state through a clear API.',
        alternatives:
          'A single global store was considered and rejected — it would blur ownership between unrelated features.',
        tradeoffs: 'Slightly more boilerplate than one big store, in exchange for clearer boundaries.',
        future: 'New features add their own store without touching existing ones.',
      },
    },
    {
      id: 'open-meteo',
      title: 'Open-Meteo',
      summary: 'Weather data comes from a free API — no keys, no paid setup.',
      why: 'An MVP should not depend on API key management or a paid weather contract on day one.',
      decisionPlain: 'Fetch forecasts, search, and air quality directly from Open-Meteo in the browser.',
      benefits: [
        'Zero API key configuration',
        'No backend required to hide secrets',
        'Covers forecast, geocoding, and air quality',
        'Provider details isolated from the UI',
      ],
      tabs: {
        context: 'An MVP should not depend on API key management or a paid weather contract on day one.',
        decision: 'Fetch forecasts, search, and air quality directly from Open-Meteo in the browser.',
        alternatives:
          'Paid providers (OpenWeather, Tomorrow.io) offer more data, but require key management this app has no server to hide behind.',
        tradeoffs: 'Fewer data fields than a premium provider; no formal uptime SLA.',
        future: 'The repository pattern means switching providers later touches one adapter, not the app.',
      },
    },
    {
      id: 'no-backend',
      title: 'No backend',
      summary: 'The entire product runs in the browser — no server to build or operate.',
      why: 'Accounts, sync, and server-side caching were out of scope. A backend would add infrastructure without adding user value.',
      decisionPlain: 'Ship a static single-page app that talks to Open-Meteo directly and saves preferences in the browser.',
      benefits: [
        'Zero infrastructure to operate',
        'Deployment is a static build',
        'No secrets or session management',
        'Reviewers can use the app with zero setup',
      ],
      tabs: {
        context:
          'Accounts, sync, and server-side caching were out of scope. A backend would add infrastructure without adding user value.',
        decision:
          'Ship a static single-page app that talks to Open-Meteo directly and saves preferences in the browser.',
        alternatives:
          'A thin API gateway was considered for response caching — rejected as unnecessary complexity for this scope.',
        tradeoffs: 'No shared cache across users; no server-side rate limiting of the public API on the app\'s behalf.',
        future: 'A backend gateway is the natural next step if usage or provider requirements changed.',
      },
    },
    {
      id: 'repository-pattern',
      title: 'Repository pattern',
      summary: 'The UI never talks to Open-Meteo directly — it always goes through a repository.',
      why: 'If screens fetch weather themselves, swapping providers means touching every screen.',
      decisionPlain: 'Introduce repository interfaces that adapters implement — screens depend on the interface, never the API.',
      benefits: [
        'Screens stay stable when providers change',
        'Clear contract between UI and data layer',
        'Adapters are swappable without UI changes',
        'Easier to mock in tests',
      ],
      tabs: {
        context: 'If screens fetch weather themselves, swapping providers means touching every screen.',
        decision:
          'Introduce repository interfaces that adapters implement — screens depend on the interface, never the API.',
        alternatives: 'Direct API calls in composables would have shipped faster, at the cost of this boundary.',
        tradeoffs: 'One layer of indirection for logic that, today, has only one implementation.',
        future: 'Adding a second provider or an offline cache means writing one new adapter, not touching a single component.',
      },
    },
    {
      id: 'mapper-pattern',
      title: 'Mapper pattern',
      summary: 'External API shapes never leak into the app\'s own domain types.',
      why: 'Open-Meteo\'s response shape is not the shape the app wants to reason about internally.',
      decisionPlain: 'Pure mapper functions translate API responses into stable domain types before anything else touches them.',
      benefits: [
        'Domain types stay provider-agnostic',
        'Mappers are pure and easy to unit test',
        'UI reads stable shapes regardless of API changes',
        'Provider quirks isolated to one file each',
      ],
      tabs: {
        context: 'Open-Meteo\'s response shape is not the shape the app wants to reason about internally.',
        decision:
          'Pure mapper functions translate API responses into stable domain types before anything else touches them.',
        alternatives:
          'Using API response types directly throughout the app would be less code, but ties the whole app\'s language to one provider\'s format.',
        tradeoffs: 'A translation step to write and maintain for each provider added.',
        future: 'Provider-specific quirks are isolated to one file each, instead of scattered across components.',
      },
    },
    {
      id: 'localstorage',
      title: 'LocalStorage persistence',
      summary: 'Favorites and settings survive a page refresh, with no login required.',
      why: 'Returning users expect their saved preferences to still be there tomorrow.',
      decisionPlain:
        'Persist favorites and settings to the browser\'s storage behind the same repository interface used for weather data.',
      benefits: [
        'No account system required',
        'Preferences survive refresh',
        'Same repository pattern as weather data',
        'Swappable for backend storage later',
      ],
      tabs: {
        context: 'Returning users expect their saved preferences to still be there tomorrow.',
        decision:
          'Persist favorites and settings to the browser\'s storage behind the same repository interface used for weather data.',
        alternatives:
          'A backend-backed account system would be more durable, but was out of scope for an account-less MVP.',
        tradeoffs: 'Preferences are per-device only — clearing browser data clears them too.',
        future: 'The storage repository could be swapped for a backend-backed one without changing any component.',
      },
    },
    {
      id: 'condition-visuals',
      title: 'Weather-condition hero imagery',
      summary: 'The background reflects the weather — not just the city.',
      why: 'A dashboard of numbers alone is functional but forgettable; the brief asked for a shippable weather app.',
      decisionPlain:
        'Curated, condition-and-time-of-day background images selected client-side — no external image API required.',
      benefits: [
        'Condition is legible at a glance',
        'No extra network dependency for visuals',
        'Consistent visual quality',
        'Selection logic is easy to extend',
      ],
      tabs: {
        context:
          'A dashboard of numbers alone is functional but forgettable; the brief called an ambiguous requirement into a shippable weather app.',
        decision:
          'Curated, condition-and-time-of-day background images selected client-side — no external image API required.',
        alternatives:
          'A dynamic image API per city was considered and rejected — adds a network dependency and inconsistent visual quality for a small win.',
        tradeoffs: 'Fewer unique visuals than a live image API; no location-specific photography.',
        future: 'A provider-backed image API could slot in behind the same selection logic later.',
      },
    },
    {
      id: 'vercel-deployment',
      title: 'Vercel deployment',
      summary: 'Every change previews live before it reaches a real user.',
      why: 'Production and preview URLs with minimal DevOps overhead were needed for a solo, one-week build.',
      decisionPlain:
        'Deploy to Vercel with automatic previews on every change and a stable production URL for the assessment.',
      benefits: [
        'Reviewers open a URL — no local setup',
        'Preview deployments on every change',
        'Static SPA hosting with minimal config',
        'Security headers configured in vercel.json',
      ],
      tabs: {
        context: 'Production and preview URLs with minimal DevOps overhead were needed for a solo, one-week build.',
        decision:
          'Deploy to Vercel with automatic previews on every change and a stable production URL for the assessment.',
        alternatives:
          'Self-managed static hosting (S3 + CloudFront) offers more control, at the cost of setup time not justified here.',
        tradeoffs: 'Vendor-specific configuration; acceptable for an MVP of this scope.',
        future: 'Migrating host later is a configuration change, not an architecture change.',
      },
    },
  ] satisfies DecisionRecord[],
}
