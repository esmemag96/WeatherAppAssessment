<script setup lang="ts">
import type { ArchitectureLayerData } from '@/content/artifacts/types'

defineProps<{
  layer: ArchitectureLayerData
}>()
</script>

<template>
  <div class="ax-card p-5">
    <h3 class="text-sm font-semibold ax-heading">{{ layer.label }}</h3>
    <p class="mt-2 text-sm ax-muted">{{ layer.responsibility }}</p>
    <dl class="mt-4 grid gap-4 text-sm sm:grid-cols-3">
      <div>
        <dt class="ax-label">Key files</dt>
        <dd class="mt-1 ax-body">
          <span v-if="layer.keyFiles.length">{{ layer.keyFiles.join(', ') }}</span>
          <span v-else class="ax-faint">—</span>
        </dd>
      </div>
      <div>
        <dt class="ax-label">Dependencies</dt>
        <dd class="mt-1 ax-body">{{ layer.dependencies.join(', ') }}</dd>
      </div>
      <div>
        <dt class="ax-label">Trade-off</dt>
        <dd class="mt-1 ax-muted">{{ layer.tradeoffs }}</dd>
      </div>
    </dl>
  </div>
</template>
