<script setup lang="ts">
import type { DecisionRecord } from '@/content/artifacts/types'

import DecisionTabs from './DecisionTabs.vue'
import TechnicalDetails from './TechnicalDetails.vue'
import { Icon } from '@/shared/ui'

defineProps<{
  record: DecisionRecord
}>()
</script>

<template>
  <article class="ax-decision-card er-fade-in overflow-hidden">
    <div class="p-5">
      <h3 class="text-base font-semibold ax-heading">{{ record.title }}</h3>
      <p class="mt-1 text-sm ax-muted">{{ record.summary }}</p>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="ax-proposal-why rounded-lg p-3">
          <p class="text-xs font-medium uppercase tracking-wide ax-faint">Why</p>
          <p class="mt-1 text-sm ax-body">{{ record.why }}</p>
        </div>
        <div class="ax-proposal-decision rounded-lg p-3">
          <p class="text-xs font-medium uppercase tracking-wide ax-faint">Decision</p>
          <p class="mt-1 text-sm ax-body">{{ record.decisionPlain }}</p>
        </div>
      </div>

      <ul class="mt-3 space-y-1.5">
        <li v-for="benefit in record.benefits" :key="benefit" class="flex gap-2 text-sm ax-muted">
          <Icon name="check_circle" size="sm" class="shrink-0 ax-emerald-text" aria-hidden="true" />
          <span>{{ benefit }}</span>
        </li>
      </ul>
    </div>

    <TechnicalDetails label="Implementation details">
      <DecisionTabs :record="record" />
    </TechnicalDetails>
  </article>
</template>
