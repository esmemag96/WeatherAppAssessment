<script setup lang="ts">
import type { ArchitectureLayerData } from '@/content/artifacts/types'

import ArchitectureLayer from './ArchitectureLayer.vue'

const FLOW_TO_LAYER: Record<string, string> = {
  User: 'user',
  Search: 'search',
  Repository: 'repository',
  Mapper: 'mapper',
  Store: 'store',
  UI: 'ui',
}

const props = defineProps<{
  flow: string[]
  layers: ArchitectureLayerData[]
  principle: string
  activeId: string
}>()

const emit = defineEmits<{
  selectLayer: [id: string]
}>()

function layerIdForStep(step: string): string {
  return FLOW_TO_LAYER[step] ?? step.toLowerCase()
}

const active = () => props.layers.find((l) => l.id === props.activeId)
</script>

<template>
  <div class="space-y-8">
    <p class="ax-panel-blue px-4 py-3">{{ principle }}</p>

    <div>
      <p class="mb-3 text-xs font-medium uppercase tracking-wide ax-faint">Explore by layer</p>
      <div class="flex flex-wrap items-center justify-center gap-2" role="img" aria-label="Simplified architecture flow">
        <template v-for="(step, index) in flow" :key="step">
          <button
            type="button"
            class="ax-focus er-flow-node min-h-11 text-sm font-medium transition-all"
            :class="{ 'er-flow-node-active': activeId === layerIdForStep(step) }"
            @click="emit('selectLayer', layerIdForStep(step))"
          >
            {{ step }}
          </button>
          <span v-if="index < flow.length - 1" class="ax-arrow" aria-hidden="true">↓</span>
        </template>
      </div>
    </div>

    <ArchitectureLayer v-if="active()" :layer="active()!" />
  </div>
</template>
