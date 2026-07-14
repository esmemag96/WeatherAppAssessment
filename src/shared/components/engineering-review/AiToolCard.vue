<script setup lang="ts">
import type { AiToolCardData } from '@/content/artifacts/types'

defineProps<{
  tool: AiToolCardData
}>()
</script>

<template>
  <div class="ax-card flex flex-col p-5">
    <h3 class="text-sm font-semibold ax-heading">{{ tool.name }}</h3>

    <div class="mt-4">
      <h4 class="ax-label">Purpose</h4>
      <ul class="mt-2 space-y-1">
        <li v-for="purpose in tool.purposes" :key="purpose" class="text-sm ax-muted">
          {{ purpose }}
        </li>
      </ul>
    </div>

    <div class="mt-4">
      <h4 class="ax-label">Typical output</h4>
      <p class="mt-2 text-sm ax-body">{{ tool.typicalOutput }}</p>
    </div>

    <div class="mt-4">
      <h4 class="ax-label">Why it was used</h4>
      <p class="mt-2 text-sm ax-muted">{{ tool.whyUsed }}</p>
    </div>
  </div>
</template>
