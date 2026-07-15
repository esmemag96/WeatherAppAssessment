<script setup lang="ts">
import type { RoadmapItemData } from '@/content/artifacts/types'

defineProps<{
  items: RoadmapItemData[]
}>()
</script>

<template>
  <div class="er-milestone-grid">
    <article
      v-for="(item, index) in items"
      :key="item.id"
      class="glass-card er-milestone-card er-fade-in"
      :style="{ animationDelay: `${index * 30}ms` }"
    >
      <span class="er-milestone-index">{{ String(index + 1).padStart(2, '0') }}</span>
      <div class="min-w-0">
        <p class="text-sm font-bold ax-heading">{{ item.label }}</p>
        <p class="text-[10px] leading-snug ax-muted">{{ item.goal }}</p>
      </div>
    </article>
  </div>
</template>
