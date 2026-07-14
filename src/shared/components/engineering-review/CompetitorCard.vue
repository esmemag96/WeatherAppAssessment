<script setup lang="ts">
import type { CompetitorCardData } from '@/content/artifacts/types'

defineProps<{
  competitor: CompetitorCardData
}>()
</script>

<template>
  <div class="ax-card flex w-64 shrink-0 flex-col p-5 sm:w-auto">
    <h3 class="text-sm font-semibold ax-heading">{{ competitor.name }}</h3>
    <dl class="mt-4 space-y-3 text-sm">
      <div>
        <dt class="text-xs ax-faint">Works well</dt>
        <dd class="mt-0.5 ax-body">{{ competitor.worksWell }}</dd>
      </div>
      <div>
        <dt class="text-xs ax-faint">Doesn't</dt>
        <dd class="mt-0.5 ax-muted">{{ competitor.doesNot }}</dd>
      </div>
      <div>
        <dt class="text-xs ax-emerald-text">Adopted</dt>
        <dd class="mt-0.5 ax-muted">{{ competitor.adopted }}</dd>
      </div>
      <div>
        <dt class="text-xs ax-faint">Rejected</dt>
        <dd class="mt-0.5 ax-muted">{{ competitor.rejected }}</dd>
      </div>
    </dl>
  </div>
</template>
