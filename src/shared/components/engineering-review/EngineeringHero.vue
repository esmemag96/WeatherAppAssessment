<script setup lang="ts">
import type { HeroStat } from '@/content/artifacts/types'

import ReviewLink from './ReviewLink.vue'

defineProps<{
  title: string
  badge: string
  author: string
  description: string
  narrativeQuestion: string
  stats: HeroStat[]
  appLink: string
  githubLink: string
  docsLink: string
  fictionalNote: string
}>()
</script>

<template>
  <section id="summary" class="er-section">
    <div class="mx-auto max-w-4xl text-center">
      <p class="text-sm font-medium tracking-wide ax-muted uppercase">{{ badge }}</p>
      <p class="mt-2 text-base font-medium ax-heading">{{ author }}</p>
      <h1 class="mt-3 text-4xl font-semibold tracking-tight ax-heading sm:text-5xl md:text-6xl">
        {{ title }}
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-base ax-muted">{{ description }}</p>
      <p class="mx-auto mt-6 max-w-lg text-sm ax-faint italic">{{ narrativeQuestion }}</p>

      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="ax-card p-5 text-left">
          <p class="ax-label">{{ stat.label }}</p>
          <p class="er-stat-value mt-1">{{ stat.value }}</p>
          <p class="mt-1 text-xs ax-faint">{{ stat.description }}</p>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap justify-center gap-3">
        <ReviewLink :href="appLink" new-tab variant="primary">Launch Application</ReviewLink>
        <ReviewLink :href="githubLink" external variant="secondary">GitHub</ReviewLink>
        <ReviewLink :href="docsLink" variant="ghost">Source Documentation</ReviewLink>
      </div>

      <p class="mt-8 text-xs ax-faint">{{ fictionalNote }}</p>
    </div>
  </section>
</template>
