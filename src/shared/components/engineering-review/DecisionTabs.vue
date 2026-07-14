<script setup lang="ts">
import { ref } from 'vue'

import type { DecisionRecord } from '@/content/artifacts/types'

defineProps<{
  record: DecisionRecord
}>()

const activeTab = ref<'context' | 'decision' | 'alternatives' | 'tradeoffs' | 'future'>('context')

const tabs = [
  { id: 'context' as const, label: 'Context' },
  { id: 'decision' as const, label: 'Decision' },
  { id: 'alternatives' as const, label: 'Alternatives' },
  { id: 'tradeoffs' as const, label: 'Trade-offs' },
  { id: 'future' as const, label: 'Future' },
]
</script>

<template>
  <div class="ax-border border-t">
    <div class="flex gap-1 overflow-x-auto px-5 pt-3" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        class="ax-focus min-h-11 shrink-0 rounded-t-lg px-3 py-2 text-xs font-medium"
        :class="activeTab === tab.id ? 'ax-nav-active' : 'ax-nav-inactive'"
        :aria-selected="activeTab === tab.id"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="px-5 py-4 text-sm ax-body" role="tabpanel">
      <p v-if="activeTab === 'context'">{{ record.context }}</p>
      <p v-if="activeTab === 'decision'">{{ record.decision }}</p>
      <ul v-if="activeTab === 'alternatives'" class="list-inside list-disc space-y-1 ax-muted">
        <li v-for="alt in record.alternatives" :key="alt">{{ alt }}</li>
      </ul>
      <ul v-if="activeTab === 'tradeoffs'" class="list-inside list-disc space-y-1 ax-muted">
        <li v-for="t in record.tradeoffs" :key="t">{{ t }}</li>
      </ul>
      <p v-if="activeTab === 'future'">{{ record.futureEvolution }}</p>
    </div>
  </div>
</template>
