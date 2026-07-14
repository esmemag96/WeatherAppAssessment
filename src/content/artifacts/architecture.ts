import type { ArchitectureLayerData } from './types'

export const architectureContent = {
  title: 'Architecture',
  subtitle: 'Layered design with provider abstraction at the infrastructure boundary.',
  principle: 'External providers should never define the application\'s domain language.',
  simplifiedFlow: ['User', 'Search', 'Repository', 'Mapper', 'Store', 'UI'],
  layers: [
    {
      id: 'ui',
      name: 'UI',
      responsibility: 'Pages and composed components. No direct API calls.',
      keyFiles: ['HomePage.vue', 'SearchPage.vue', 'WeatherHeroCard.vue', 'BottomNavigation.vue'],
      dependencies: ['Store'],
      tradeoff: 'Thin pages require composables for all orchestration.',
    },
    {
      id: 'store',
      name: 'Store',
      responsibility: 'Pinia stores coordinate actions, caching, and persistence.',
      keyFiles: ['forecastStore.ts', 'favoritesStore.ts', 'settingsStore.ts', 'searchStore.ts'],
      dependencies: ['Repository', 'Domain'],
      tradeoff: 'Centralized state simplifies testing but couples stores to repositories.',
    },
    {
      id: 'repository',
      name: 'Repository',
      responsibility: 'Provider-agnostic interfaces for forecast retrieval.',
      keyFiles: ['WeatherRepository.ts', 'OpenMeteoWeatherAdapter.ts', 'AirQualityRepository.ts'],
      dependencies: ['Mapper', 'External API'],
      tradeoff: 'More interfaces than direct calls, but swappable providers.',
    },
    {
      id: 'mapper',
      name: 'Mapper',
      responsibility: 'Pure functions converting provider schemas to domain types.',
      keyFiles: ['WeatherMapper.ts', 'AirQualityMapper.ts'],
      dependencies: ['Domain'],
      tradeoff: 'Mapping overhead on every provider change, but UI stays stable.',
    },
    {
      id: 'search',
      name: 'Search',
      responsibility: 'Location search UI with debounced suggestions and geolocation.',
      keyFiles: ['useSearchPage.ts', 'SearchBar.vue', 'useGeolocation.ts'],
      dependencies: ['Store', 'Repository'],
      tradeoff: 'Geolocation adds permission complexity but reduces mobile friction.',
    },
    {
      id: 'user',
      name: 'User',
      responsibility: 'End user interacting via browser on mobile or desktop.',
      keyFiles: [],
      dependencies: ['UI'],
      tradeoff: 'No offline-first strategy — connectivity loss shows error states.',
    },
  ] satisfies ArchitectureLayerData[],
  diagramCaption: 'Complete architecture diagram — layered responsibilities across presentation, state, domain, and infrastructure.',
}
