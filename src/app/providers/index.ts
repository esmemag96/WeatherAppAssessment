import { createPinia } from 'pinia'
import type { App } from 'vue'

import { router } from '@/app/router'

/**
 * Installs all global providers (router, state management, and any
 * future providers - e.g. a query client) onto the app instance. Kept
 * separate from `main.ts` so bootstrapping stays a one-line call and new
 * providers can be added here without touching the entry point.
 */
export function installAppProviders(app: App): void {
  app.use(createPinia())
  app.use(router)
}
