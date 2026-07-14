import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants'

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
  { path: '/search', redirect: ROUTE_PATHS.search },
  { path: '/favorites', redirect: ROUTE_PATHS.favorites },
  { path: '/settings', redirect: ROUTE_PATHS.settings },
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
