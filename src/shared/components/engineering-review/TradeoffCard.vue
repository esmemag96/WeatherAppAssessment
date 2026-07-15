<script setup lang="ts">
import type { TradeoffItem } from '@/content/artifacts/types'

defineProps<{
  item: TradeoffItem
}>()
</script>

<template>
  <div class="ax-card p-5">
    <h3 class="text-sm font-semibold ax-heading">{{ item.decision }}</h3>
    <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
      <span class="ax-card-inner rounded-md px-3 py-1.5 ax-body">{{ item.why }}</span>
      <span class="ax-arrow" aria-hidden="true">↓</span>
      <span class="ax-card-inner rounded-md px-3 py-1.5 ax-amber-text">{{ item.cost }}</span>
      <span class="ax-arrow" aria-hidden="true">↓</span>
      <span class="ax-card-inner rounded-md px-3 py-1.5 ax-muted">{{ item.future }}</span>
    </div>
    <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-3 lg:hidden">
      <div><dt class="ax-label">Why</dt><dd class="mt-1 ax-muted">{{ item.why }}</dd></div>
      <div><dt class="ax-label">Cost</dt><dd class="mt-1 ax-muted">{{ item.cost }}</dd></div>
      <div><dt class="ax-label">Future</dt><dd class="mt-1 ax-muted">{{ item.future }}</dd></div>
    </dl>
  </div>
</template>
