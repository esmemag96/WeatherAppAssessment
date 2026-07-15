import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants'

const ARTIFACT_HASH_REDIRECTS: Record<string, string> = {
  'project-brief': '#summary',
  discovery: '#uncertainty',
  'competitor-analysis': '#competitors',
  'product-requirements': '#summary',
  design: '#design',
  architecture: '#architecture',
  adrs: '#architecture',
  'implementation-plan': '#implementation',
  'testing-strategy': '#implementation',
  deployment: '#deployment',
  retrospective: '#retrospective',
}

/**
 * Route components are lazy-loaded so the initial bundle only ships the
 * shell + whichever page the user lands on.
 */
const routes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.landing,
    name: ROUTE_NAMES.landing,
    component: () => import('@/pages/Landing'),
  },
  {
    path: ROUTE_PATHS.home,
    component: () => import('@/app/layouts/AppShell.vue'),
    children: [
      {
        path: '',
        name: ROUTE_NAMES.home,
        component: () => import('@/pages/Home'),
      },
      {
        path: 'search',
        name: ROUTE_NAMES.search,
        component: () => import('@/pages/Search'),
      },
      {
        path: 'favorites',
        name: ROUTE_NAMES.favorites,
        component: () => import('@/pages/Favorites'),
      },
      {
        path: 'settings',
        name: ROUTE_NAMES.settings,
        component: () => import('@/pages/Settings'),
      },
    ],
  },
  {
    path: ROUTE_PATHS.artifacts,
    name: ROUTE_NAMES.artifacts,
    component: () => import('@/pages/Artifacts'),
  },
  ...Object.entries(ARTIFACT_HASH_REDIRECTS).map(([segment, hash]) => ({
    path: `/artifacts/${segment}`,
    redirect: `${ROUTE_PATHS.artifacts}${hash}`,
  })),
  { path: '/search', redirect: ROUTE_PATHS.search },
  { path: '/favorites', redirect: ROUTE_PATHS.favorites },
  { path: '/settings', redirect: ROUTE_PATHS.settings },
  { path: '/journey', redirect: ROUTE_PATHS.artifacts },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, top: 80, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})
