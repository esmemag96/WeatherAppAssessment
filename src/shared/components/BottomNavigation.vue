<!--
  BottomNavigation
  ----------------
  Purpose:
    Persistent, blurred glass bottom tab bar (Weather / Search / Settings)
    used across every mobile screen in the mockups. Purely presentational -
    it renders a generic list of items and highlights the active one by
    name; AppShell supplies the actual routes.

  Props:
    - items (NavItem[], required): { name: string; label: string; icon: string; to: RouteLocationRaw }[]
    - activeName (string, required): the `name` of the currently active item.

  Slots: none.
  Events: none (uses RouterLink internally for navigation).

  Usage:
    <BottomNavigation
      :items="[{ name: 'home', label: 'Weather', icon: 'filter_drama', to: '/' }]"
      active-name="home"
    />
-->
<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

import { cn } from '@/shared/utils'
import Icon from '@/shared/ui/Icon.vue'

export interface BottomNavItem {
  name: string
  label: string
  icon: string
  to: RouteLocationRaw
}

interface Props {
  items: BottomNavItem[]
  activeName: string
}

defineProps<Props>()
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 flex h-20 items-center justify-around border-t border-border-subtle bg-glass-fill/80 px-4 pb-[env(safe-area-inset-bottom)] shadow-nav backdrop-blur-xl dark:bg-surface/80"
    aria-label="Primary"
  >
    <RouterLink
      v-for="item in items"
      :key="item.name"
      v-slot="{ isActive, navigate, href }"
      :to="item.to"
      custom
    >
      <a
        :href="href"
        :class="
          cn(
            'flex flex-col items-center gap-1 transition-all duration-200 ease-swift active:scale-90',
            isActive || item.name === activeName
              ? 'text-primary dark:text-secondary-fixed'
              : 'text-on-surface-variant hover:text-primary',
          )
        "
        @click="navigate"
      >
        <Icon :name="item.icon" :filled="isActive || item.name === activeName" />
        <span class="font-label-caps text-label-caps uppercase">{{ item.label }}</span>
      </a>
    </RouterLink>
  </nav>
</template>
