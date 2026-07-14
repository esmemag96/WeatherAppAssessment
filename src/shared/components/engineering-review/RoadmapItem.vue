<script setup lang="ts">
import type { RoadmapItemData } from '@/content/artifacts/types'

import ExpandablePanel from './ExpandablePanel.vue'

defineProps<{
  item: RoadmapItemData
  expanded: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="ax-card overflow-hidden">
    <button
      type="button"
      class="ax-focus flex w-full items-center gap-4 p-5 text-left"
      :aria-expanded="expanded"
      @click="emit('toggle')"
    >
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-sm font-semibold ax-heading">{{ item.name }}</h3>
          <span class="text-xs ax-faint">{{ item.progress }}%</span>
        </div>
        <div class="er-roadmap-bar mt-3">
          <div class="er-roadmap-fill" :style="{ width: `${item.progress}%` }" />
        </div>
      </div>
    </button>
    <ExpandablePanel v-if="expanded" :open="expanded">
      <dl class="grid gap-4 px-5 pb-5 text-sm sm:grid-cols-2">
        <div class="sm:col-span-2">
          <dt class="ax-label">Goal</dt>
          <dd class="mt-1 ax-body">{{ item.goal }}</dd>
        </div>
        <div>
          <dt class="ax-label">Deliverables</dt>
          <dd class="mt-1">
            <ul class="list-inside list-disc ax-muted">
              <li v-for="d in item.deliverables" :key="d">{{ d }}</li>
            </ul>
          </dd>
        </div>
        <div>
          <dt class="ax-label">Dependencies</dt>
          <dd class="mt-1 ax-muted">{{ item.dependencies.length ? item.dependencies.join(', ') : 'None' }}</dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="ax-label">Definition of done</dt>
          <dd class="mt-1">
            <ul class="list-inside list-disc ax-muted">
              <li v-for="d in item.definitionOfDone" :key="d">{{ d }}</li>
            </ul>
          </dd>
        </div>
      </dl>
    </ExpandablePanel>
  </div>
</template>
