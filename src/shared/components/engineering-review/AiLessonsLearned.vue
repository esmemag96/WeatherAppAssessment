<script setup lang="ts">
import type { AiLessonsColumn } from '@/content/artifacts/types'

defineProps<{
  columns: AiLessonsColumn[]
}>()

const panelClass = ['ax-panel-emerald', 'ax-panel-amber', 'ax-card-muted'] as const
const headingClass = ['ax-emerald-heading', 'ax-amber-heading', 'ax-label'] as const
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <div
      v-for="(column, index) in columns"
      :key="column.title"
      class="p-5"
      :class="panelClass[index] ?? 'ax-card-muted'"
    >
      <h3 :class="headingClass[index] ?? 'ax-label'">{{ column.title }}</h3>
      <ul class="mt-3 space-y-2">
        <li v-for="item in column.items" :key="item" class="text-sm ax-muted">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
