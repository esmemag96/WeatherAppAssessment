import type { ArchitectureLayerData } from './types'

export const architectureContent = {
  title: 'Technical Direction',
  subtitle:
    'Since the project does not require accounts, a database, or server-side business logic, I decided to build it as a frontend single-page application — and used Eraser to visualize the system before writing code.',
  goal: 'Put the weather API behind a clear boundary so screens and stores never talk to it directly.',
  principle: 'Screens talk to stores. Stores talk to repositories. Only infrastructure talks to Open-Meteo.',
  diagramTool: 'Eraser',
  diagramToolUrl: 'https://www.eraser.io',
  eraserQuestions: [
    'What responsibilities should each part of the application have?',
    'How should information flow through the system?',
    'Which parts are most likely to change in the future?',
    'Where should external services be isolated?',
  ],
  layers: [
    {
      id: 'presentation',
      label: 'Presentation',
      responsibility: 'Everything the user interacts with — pages, components, and layout.',
      keyFiles: ['HomePage.vue', 'WeatherHeroCard.vue', 'SearchBar.vue', 'BottomNavigation.vue'],
      dependencies: ['Application layer (stores and composables)'],
      tradeoffs:
        'Pages stay thin and never call fetch — orchestration goes through stores and page composables.',
    },
    {
      id: 'application',
      label: 'Application',
      responsibility: 'Coordinates user actions and shared state across the app.',
      keyFiles: ['forecastStore.ts', 'favoritesStore.ts', 'settingsStore.ts', 'useWeatherDashboard.ts'],
      dependencies: ['Domain types', 'Repositories'],
      tradeoffs: 'One store per feature keeps ownership clear, at the cost of slightly more files.',
    },
    {
      id: 'domain',
      label: 'Domain',
      responsibility: 'Represents the application\'s core concepts — locations, forecasts, settings, and alerts.',
      keyFiles: ['weather.types.ts', 'location.types.ts', 'settings.types.ts', 'weather-alert.types.ts'],
      dependencies: [],
      tradeoffs: 'Pure types are easy to test, but require a translation step from API shapes.',
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      responsibility: 'Talks to APIs and browser storage, then translates responses into domain types.',
      keyFiles: [
        'OpenMeteoWeatherAdapter.ts',
        'WeatherMapper.ts',
        'WeatherAlertResolver.ts',
        'LocalStorageRepository.ts',
      ],
      dependencies: ['External APIs (Open-Meteo)', 'Browser LocalStorage'],
      tradeoffs: 'An interface with a single implementation today — the cost of a seam that keeps the app swappable.',
    },
  ] satisfies ArchitectureLayerData[],
  diagram: {
    src: '/engineering/architecture-diagram.svg',
    width: 1318,
    height: 1362,
    alt: 'Layered architecture diagram showing Presentation, Application, Domain, and Infrastructure tiers for the Weather App SPA.',
    explanation:
      'Four layers, each with one job: what the user sees, how actions are coordinated, the core concepts, and how we reach APIs and storage.',
    highlights: [
      'Pages compose stores and shared UI — network calls stay in infrastructure',
      'Domain types describe locations and forecasts in our own words',
      'Adapters and mappers translate Open-Meteo into those types',
      'Favorites and settings live in LocalStorage — no backend required',
    ],
  },
  diagramCaption: 'Architecture diagram created with Eraser — presentation, application, domain, and infrastructure.',
}
