import type { ArchitectureLayerData } from './types'

export const architectureContent = {
  title: 'Technical Direction',
  subtitle:
    'Since the project does not require accounts, a database, or server-side business logic, I decided to build it as a frontend single-page application — and used Eraser to visualize the system before writing code.',
  goal:
    'Isolate external services behind clear boundaries so replacing Open-Meteo — or adding a backend later — does not require rewriting the application.',
  principle:
    'I do not want the rest of the application to depend directly on whichever weather provider I choose.',
  diagramTool: 'Eraser',
  diagramToolUrl: 'https://www.eraser.io',
  eraserQuestions: [
    'What responsibilities should each part of the application have?',
    'How should information flow through the system?',
    'Which parts are most likely to change in the future?',
    'Where should external services be isolated?',
  ],
  simplifiedFlow: ['Presentation', 'Application', 'Domain', 'Infrastructure'],
  layers: [
    {
      id: 'presentation',
      label: 'Presentation',
      responsibility: 'Everything the user interacts with — pages, components, and layout.',
      keyFiles: ['HomePage.vue', 'WeatherHeroCard.vue', 'SearchBar.vue', 'BottomNavigation.vue'],
      dependencies: ['Application layer (stores and composables)'],
      tradeoffs: 'UI never calls external APIs directly — every action goes through application state.',
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
      keyFiles: ['weather.types.ts', 'WeatherMapper.ts', 'WeatherAlertResolver.ts'],
      dependencies: [],
      tradeoffs: 'Pure types and mappers are easy to test, but require a translation step from API shapes.',
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      responsibility: 'Communicates with external services and browser storage.',
      keyFiles: ['OpenMeteoWeatherRepository.ts', 'LocalStorageRepository.ts'],
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
      'The application is organized into four main responsibilities. If I ever replace Open-Meteo — or even introduce a backend later — most of the application should remain unchanged.',
    highlights: [
      'Presentation reads application state — never external APIs directly',
      'Domain types define what the app expects, independent of any provider',
      'Infrastructure adapters translate Open-Meteo responses into clean domain entities',
      'Favorites and settings persist in browser storage — no backend required',
    ],
  },
  diagramCaption: 'Architecture diagram created with Eraser — presentation, application, domain, and infrastructure.',
}
