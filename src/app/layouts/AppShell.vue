<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useTheme } from '@/shared/composables'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants'
import { Icon, IconButton } from '@/shared/ui'
import { BottomNavigation, type BottomNavItem } from '@/shared/components'

// The mockups' bottom nav only shows 3 slots (Weather / Search / Settings)
// on any single screen, but the `favorites_hi_fi` screen is itself a
// distinct, real page in the design hand-off. Per "do not change the
// information architecture", Favorites keeps its own tab here rather than
// being dropped, matching the routes already established for this app.
const navItems: BottomNavItem[] = [
  { name: ROUTE_NAMES.home, label: 'Weather', icon: 'filter_drama', to: ROUTE_PATHS.home },
  { name: ROUTE_NAMES.search, label: 'Search', icon: 'search', to: ROUTE_PATHS.search },
  { name: ROUTE_NAMES.favorites, label: 'Favorites', icon: 'star', to: ROUTE_PATHS.favorites },
  { name: ROUTE_NAMES.settings, label: 'Settings', icon: 'settings', to: ROUTE_PATHS.settings },
]

const route = useRoute()
const router = useRouter()
const activeName = computed(() => (typeof route.name === 'string' ? route.name : ''))

const { isDark, setTheme } = useTheme()

function toggleTheme(): void {
  setTheme(isDark.value ? 'light' : 'dark')
}
</script>

<template>
  <div class="min-h-screen bg-transparent dark:bg-background">
    <header
      class="fixed inset-x-0 top-0 z-50 flex h-row-height-md items-center justify-between border-b border-border-subtle bg-glass-fill/75 px-container-padding shadow-glass backdrop-blur-xl dark:bg-surface/80 dark:shadow-2xl dark:backdrop-blur-md"
    >
      <div class="flex items-center gap-2 rounded-lg p-1 transition-colors duration-200 hover:bg-overlay-hover active:scale-95">
        <Icon name="location_on" class="text-primary" />
        <span class="font-headline-md text-headline-md font-bold text-on-surface">Nimbus Digital</span>
      </div>
      <div class="flex items-center gap-1">
        <IconButton :label="isDark ? 'Switch to light mode' : 'Switch to dark mode'" @click="toggleTheme">
          <Icon :name="isDark ? 'light_mode' : 'dark_mode'" />
        </IconButton>
        <IconButton label="Engineering Review" @click="router.push(ROUTE_PATHS.artifacts)">
          <Icon name="menu_book" />
        </IconButton>
      </div>
    </header>

    <main class="pt-row-height-md pb-24">
      <RouterView />
    </main>

    <BottomNavigation :items="navItems" :active-name="activeName" />
  </div>
</template>
