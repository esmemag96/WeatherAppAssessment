import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import { describe, expect, it } from 'vitest'

import BottomNavigation, { type BottomNavItem } from './BottomNavigation.vue'

const Home = defineComponent({ render: () => h('div', 'home') })
const Search = defineComponent({ render: () => h('div', 'search') })

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Home },
      { path: '/search', name: 'search', component: Search },
    ],
  })
}

const items: BottomNavItem[] = [
  { name: 'home', label: 'Weather', icon: 'filter_drama', to: '/' },
  { name: 'search', label: 'Search', icon: 'search', to: '/search' },
]

describe('BottomNavigation', () => {
  it('marks the item matching activeName as active', () => {
    const wrapper = mount(BottomNavigation, {
      props: { items, activeName: 'search' },
      global: { plugins: [createTestRouter()] },
    })

    const links = wrapper.findAll('a')
    expect(links[1]!.classes()).toContain('text-primary')
    expect(links[0]!.classes()).not.toContain('text-primary')
  })

  /**
   * Regression test: this row previously used `@click.prevent="navigate"`.
   * Vue's `.prevent` modifier calls `event.preventDefault()` *before*
   * invoking `navigate`, and vue-router's `navigate` aborts silently
   * (via its internal `guardEvent`) whenever `event.defaultPrevented`
   * is already `true` - so every click was swallowed and `router.push`
   * was never called. `navigate` already calls `preventDefault` itself
   * when it decides to proceed, so the handler must stay a plain
   * `@click="navigate"`.
   */
  it('actually navigates when a nav link is clicked', async () => {
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    const wrapper = mount(
      defineComponent({
        components: { BottomNavigation, RouterView },
        render: () => h('div', [h(BottomNavigation, { items, activeName: 'home' }), h(RouterView)]),
      }),
      { global: { plugins: [router] } },
    )
    await flushPromises()

    await wrapper.findAll('a')[1]!.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/search')
    expect(wrapper.text()).toContain('search')
  })
})
