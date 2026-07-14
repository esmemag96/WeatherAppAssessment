import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { router } from '@/app/router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants'

describe('artifact routes', () => {
  it('resolves landing page at root', async () => {
    await router.push(ROUTE_PATHS.landing)
    await flushPromises()
    expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.landing)
  })

  it('resolves weather app at /app', async () => {
    await router.push(ROUTE_PATHS.home)
    await flushPromises()
    expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.home)
  })

  it('resolves artifacts experience at /artifacts', async () => {
    await router.push(ROUTE_PATHS.artifacts)
    await flushPromises()
    expect(router.currentRoute.value.name).toBe(ROUTE_NAMES.artifacts)
  })

  it('redirects legacy artifact detail routes to anchored sections', async () => {
    const redirects = [
      { from: '/artifacts/project-brief', hash: '#summary' },
      { from: '/artifacts/discovery', hash: '#uncertainty' },
      { from: '/artifacts/architecture', hash: '#architecture' },
      { from: '/artifacts/adrs', hash: '#decisions' },
      { from: '/artifacts/retrospective', hash: '#retrospective' },
    ] as const

    for (const { from, hash } of redirects) {
      await router.push(from)
      await flushPromises()
      expect(router.currentRoute.value.path).toBe(ROUTE_PATHS.artifacts)
      expect(router.currentRoute.value.hash).toBe(hash)
    }
  })

  it('redirects legacy /journey to artifacts', async () => {
    await router.push('/journey')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe(ROUTE_PATHS.artifacts)
  })

  it('redirects legacy /search to /app/search', async () => {
    await router.push('/search')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe(ROUTE_PATHS.search)
  })
})
