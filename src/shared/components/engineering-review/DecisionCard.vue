<script setup lang="ts">
import { ref } from 'vue'

import type { DecisionRecord } from '@/content/artifacts/types'

import DecisionTabs from './DecisionTabs.vue'

defineProps<{
  record: DecisionRecord
}>()

const expanded = ref(false)
</script>

<template>
  <div class="ax-card overflow-hidden transition-shadow hover:shadow-sm">
    <div class="flex items-start justify-between gap-4 p-5">
      <div class="min-w-0">
        <h3 class="text-sm font-semibold ax-heading">{{ record.title }}</h3>
        <p class="mt-1 text-sm ax-muted">{{ record.summary }}</p>
      </div>
      <button
        type="button"
        class="ax-focus ax-btn-secondary shrink-0 rounded-lg px-3 py-1.5 text-xs"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'Close' : 'Expand' }}
      </button>
    </div>
    <DecisionTabs v-if="expanded" :record="record" />
  </div>
</template>
