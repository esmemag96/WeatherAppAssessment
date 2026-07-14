<script setup lang="ts">
import type { SectionNavItem } from '@/content/artifacts/types'

import { scrollToSection } from '@/shared/composables'

defineProps<{
  sections: SectionNavItem[]
  activeSection: string
  progress: number
  variant?: 'vertical' | 'horizontal'
}>()
</script>

<template>
  <nav aria-label="Section navigation" :class="variant === 'horizontal' ? '' : 'space-y-4'">
    <div class="er-progress-track" aria-hidden="true">
      <div class="er-progress-fill" :style="{ width: `${progress}%` }" />
    </div>

    <!-- Vertical (desktop) -->
    <ul v-if="variant !== 'horizontal'" class="space-y-0.5">
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

    <!-- Horizontal (mobile) -->
    <ul v-else class="mt-2 flex gap-2 overflow-x-auto pb-1">
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
