<script setup lang="ts">
import type { RetrospectiveItem } from '@/content/artifacts/retrospective'

defineProps<{
  workedWell: RetrospectiveItem[]
  wouldImprove: RetrospectiveItem[]
  wouldDoNext: RetrospectiveItem[]
}>()
</script>

<template>
  <div class="er-retro-grid">
    <div class="er-retro-column">
      <h3 class="ax-emerald-heading">What went well</h3>
      <ul class="mt-4 space-y-4">
        <li v-for="item in workedWell" :key="item.title">
          <p class="text-sm font-semibold leading-snug ax-heading">{{ item.title }}</p>
          <p class="mt-1 text-sm leading-relaxed ax-muted">{{ item.body }}</p>
        </li>
      </ul>
    </div>
    <div class="er-retro-column">
      <h3 class="ax-amber-heading">What I'd improve</h3>
      <ul class="mt-4 space-y-4">
        <li v-for="item in wouldImprove" :key="item.title">
          <p class="text-sm font-semibold leading-snug ax-heading">{{ item.title }}</p>
          <p class="mt-1 text-sm leading-relaxed ax-muted">{{ item.body }}</p>
        </li>
      </ul>
    </div>
    <div class="er-retro-column">
      <h3 class="er-text-primary">What I'd do next</h3>
      <ul class="mt-4 space-y-4">
        <li v-for="item in wouldDoNext" :key="item.title">
          <p class="text-sm font-semibold leading-snug ax-heading">{{ item.title }}</p>
          <p class="mt-1 text-sm leading-relaxed ax-muted">{{ item.body }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
