<script setup lang="ts">
import type { QualityMetricData } from '@/content/artifacts/types'

defineProps<{
  metric: QualityMetricData
}>()
</script>

<template>
  <div class="ax-card p-5">
    <div class="flex items-start justify-between gap-2">
      <h3 class="text-sm font-semibold ax-heading">{{ metric.label }}</h3>
      <span class="shrink-0 rounded-md ax-status-badge text-xs">{{ metric.status }}</span>
    </div>
    <p class="mt-3 text-sm ax-muted">{{ metric.description }}</p>
    <p class="mt-3 text-xs ax-faint">
      <span class="font-medium ax-muted">Future:</span> {{ metric.futureImprovement }}
    </p>
  </div>
</template>
