<script setup lang="ts">
import type { ArchitectureLayerData } from '@/content/artifacts/types'

defineProps<{
  layers: ArchitectureLayerData[]
  caption: string
}>()
</script>

<template>
  <figure class="ax-card overflow-hidden">
    <div
      class="ax-dashed flex aspect-[2/1] items-center justify-center p-8"
      role="img"
      :aria-label="caption"
    >
      <div class="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
        <div
          v-for="layer in layers"
          :key="layer.id"
          class="er-flow-node text-center text-xs font-medium"
        >
          {{ layer.name }}
        </div>
      </div>
    </div>
    <figcaption class="px-5 py-3 text-xs ax-faint">{{ caption }}</figcaption>
  </figure>
</template>
