<script setup lang="ts">
import type { AiWorkflowStageData } from '@/content/artifacts/types'

import TimelineStep from './TimelineStep.vue'

const props = defineProps<{
  stages: AiWorkflowStageData[]
  activeId: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

function select(id: string): void {
  emit('select', id)
}

const active = () => props.stages.find((s) => s.id === props.activeId) ?? props.stages[0]!
</script>

<template>
  <div class="space-y-8">
    <div
      class="flex gap-2 overflow-x-auto pb-2"
      role="tablist"
      aria-label="AI workflow stages"
    >
      <template v-for="(stage, index) in stages" :key="stage.id">
        <TimelineStep
          :label="stage.label"
          :active="activeId === stage.id"
          @click="select(stage.id)"
        />
        <span
          v-if="index < stages.length - 1"
          class="hidden shrink-0 self-center text-sm ax-arrow sm:inline"
          aria-hidden="true"
        >
          →
        </span>
      </template>
    </div>

    <div
      v-if="active()"
      class="grid gap-4 sm:grid-cols-2"
      role="tabpanel"
      :aria-label="`${active().label} workflow details`"
    >
      <div class="ax-card p-5">
        <h4 class="ax-label">AI Contribution</h4>
        <ul class="mt-3 space-y-2">
          <li
            v-for="item in active().aiContribution"
            :key="item"
            class="flex gap-2 text-sm ax-muted"
          >
            <span class="ax-faint" aria-hidden="true">•</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <div class="ax-card p-5">
        <h4 class="ax-emerald-heading">Engineer Responsibility</h4>
        <ul class="mt-3 space-y-2">
          <li
            v-for="item in active().engineerResponsibility"
            :key="item"
            class="flex gap-2 text-sm ax-muted"
          >
            <span class="ax-faint" aria-hidden="true">•</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
