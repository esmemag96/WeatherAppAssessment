/**
 * Single source of truth for route names and paths.
 * Referenced by the router config and by any navigation UI
 * to avoid magic strings.
 */
export const ROUTE_NAMES = {
  landing: 'landing',
  home: 'home',
  search: 'search',
  favorites: 'favorites',
  settings: 'settings',
  artifacts: 'artifacts',
  artifactsProjectBrief: 'artifacts-project-brief',
  artifactsDiscovery: 'artifacts-discovery',
  artifactsCompetitorAnalysis: 'artifacts-competitor-analysis',
  artifactsProductRequirements: 'artifacts-product-requirements',
  artifactsDesign: 'artifacts-design',
  artifactsArchitecture: 'artifacts-architecture',
  artifactsAdrs: 'artifacts-adrs',
  artifactsImplementationPlan: 'artifacts-implementation-plan',
  artifactsTestingStrategy: 'artifacts-testing-strategy',
  artifactsDeployment: 'artifacts-deployment',
  artifactsRetrospective: 'artifacts-retrospective',
} as const

export const ROUTE_PATHS = {
  landing: '/',
  home: '/app',
  search: '/app/search',
  favorites: '/app/favorites',
  settings: '/app/settings',
  artifacts: '/artifacts',
  artifactsProjectBrief: '/artifacts/project-brief',
  artifactsDiscovery: '/artifacts/discovery',
  artifactsCompetitorAnalysis: '/artifacts/competitor-analysis',
  artifactsProductRequirements: '/artifacts/product-requirements',
  artifactsDesign: '/artifacts/design',
  artifactsArchitecture: '/artifacts/architecture',
  artifactsAdrs: '/artifacts/adrs',
  artifactsImplementationPlan: '/artifacts/implementation-plan',
  artifactsTestingStrategy: '/artifacts/testing-strategy',
  artifactsDeployment: '/artifacts/deployment',
  artifactsRetrospective: '/artifacts/retrospective',
} as const

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
