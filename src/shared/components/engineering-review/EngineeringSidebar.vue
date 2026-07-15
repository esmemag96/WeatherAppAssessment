<script setup lang="ts">
import type { SectionNavItem } from '@/content/artifacts/types'
import { RouterLink } from 'vue-router'

import { Icon } from '@/shared/ui'
import CoherentAttribution from './CoherentAttribution.vue'
import SectionNavigation from './SectionNavigation.vue'

defineProps<{
  portalTitle: string
  portalSubtitle: string
  author: string
  authorRole: string
  sections: SectionNavItem[]
  activeSection: string
  progress: number
  appLink: string
  githubLink: string
  coherentText: string
  coherentLogoDarkMode: string
  coherentLogoLightMode: string
  isDark: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <aside
    class="er-sidebar flex h-dvh w-[280px] shrink-0 flex-col border-r py-6 px-4"
    aria-label="Engineering review navigation"
  >
    <div class="mb-10 px-4">
      <h1 class="font-headline-md text-headline-md font-bold tracking-tight ax-heading">{{ portalTitle }}</h1>
      <p class="text-sm opacity-70 ax-muted">{{ portalSubtitle }}</p>
    </div>

    <SectionNavigation
      :sections="sections"
      :active-section="activeSection"
      :progress="progress"
      variant="sidebar"
      @navigate="emit('close')"
    />

    <div class="mt-auto">
      <CoherentAttribution
        compact
        :text="coherentText"
        :logo-dark-mode="coherentLogoDarkMode"
        :logo-light-mode="coherentLogoLightMode"
        :is-dark="isDark"
      />

      <div class="border-t pt-6 px-4" style="border-color: var(--er-sidebar-border)">
      <div class="mb-6 flex items-center gap-3">
        <div class="er-author-avatar flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
          {{ author.charAt(0) }}
        </div>
        <div>
          <p class="text-sm font-bold ax-heading">{{ authorRole }}</p>
          <p class="text-xs ax-muted">{{ author }}</p>
        </div>
      </div>
      <RouterLink
        :to="appLink"
        class="ax-focus flex items-center gap-2 text-xs ax-muted transition-colors hover:er-text-primary"
        @click="emit('close')"
      >
        <Icon name="menu_book" size="sm" aria-hidden="true" />
        Launch Application
      </RouterLink>
      <a
        :href="githubLink"
        target="_blank"
        rel="noopener noreferrer"
        class="ax-focus mt-2 flex items-center gap-2 text-xs ax-muted transition-colors hover:er-text-primary"
        @click="emit('close')"
      >
        <Icon name="code" size="sm" aria-hidden="true" />
        GitHub Repository
      </a>
    </div>
    </div>
  </aside>
</template>
