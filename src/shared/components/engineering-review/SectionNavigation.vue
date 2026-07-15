<script setup lang="ts">
import type { SectionNavItem } from '@/content/artifacts/types'

import { scrollToSection } from '@/shared/composables'
import { Icon } from '@/shared/ui'

defineProps<{
  sections: SectionNavItem[]
  activeSection: string
  progress: number
  variant?: 'vertical' | 'horizontal' | 'sidebar'
}>()

const emit = defineEmits<{
  navigate: []
}>()

function navigateTo(sectionId: string) {
  scrollToSection(sectionId)
  emit('navigate')
}
</script>

<template>
  <nav
    aria-label="Section navigation"
    :class="variant === 'horizontal' ? 'min-w-0 w-full' : variant === 'sidebar' ? 'flex-1 space-y-2' : 'space-y-4'"
  >
    <div v-if="variant !== 'sidebar'" class="er-progress-track" aria-hidden="true">
      <div class="er-progress-fill" :style="{ width: `${progress}%` }" />
    </div>

    <ul
      v-if="variant === 'sidebar'"
      class="space-y-1"
    >
      <li v-for="section in sections" :key="section.id">
        <button
          type="button"
          class="er-sidebar-link ax-focus w-full"
          :class="activeSection === section.id ? 'er-sidebar-link-active' : 'er-sidebar-link-inactive'"
          :aria-current="activeSection === section.id ? 'true' : undefined"
          @click="navigateTo(section.id)"
        >
          <Icon
            :name="section.icon ?? 'circle'"
            size="md"
            :filled="activeSection === section.id"
            aria-hidden="true"
          />
          <span class="font-body-lg text-body-lg">{{ section.label }}</span>
        </button>
      </li>
    </ul>

    <ul v-else-if="variant !== 'horizontal'" class="space-y-0.5">
      <li v-for="section in sections" :key="section.id">
        <button
          type="button"
          class="ax-focus w-full rounded-md px-3 py-2 text-left text-sm transition-colors"
          :class="activeSection === section.id ? 'ax-nav-active' : 'ax-nav-inactive'"
          :aria-current="activeSection === section.id ? 'true' : undefined"
          @click="scrollToSection(section.id)"
        >
          {{ section.label }}
        </button>
      </li>
    </ul>

    <ul v-else class="-mx-1 mt-2 flex max-w-full gap-2 overflow-x-auto px-1 pb-1">
      <li v-for="section in sections" :key="section.id" class="shrink-0">
        <button
          type="button"
          class="ax-focus min-h-11 rounded-full px-4 py-2 text-sm transition-colors"
          :class="activeSection === section.id ? 'ax-pill-active' : 'ax-pill-inactive'"
          :aria-current="activeSection === section.id ? 'true' : undefined"
          @click="scrollToSection(section.id)"
        >
          {{ section.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>
