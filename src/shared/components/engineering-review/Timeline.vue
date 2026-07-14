<script setup lang="ts">
import type { TimelineStepData } from '@/content/artifacts/types'

import TimelineStep from './TimelineStep.vue'

const props = defineProps<{
  steps: TimelineStepData[]
  activeId: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

function select(id: string): void {
  emit('select', id)
}

const active = () => props.steps.find((s) => s.id === props.activeId) ?? props.steps[0]!
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[auto_1fr]">
    <div class="flex flex-col items-center gap-1 lg:items-start">
      <template v-for="(step, index) in steps" :key="step.id">
        <TimelineStep
          :label="step.label"
          :active="activeId === step.id"
          @click="select(step.id)"
        />
        <span v-if="index < steps.length - 1" class="text-lg ax-arrow" aria-hidden="true">↓</span>
      </template>
    </div>

    <div v-if="active()" class="ax-card p-6">
      <dl class="grid gap-4 sm:grid-cols-2">
        <div>
          <dt class="ax-label">Missing information</dt>
          <dd class="mt-1 text-sm ax-body">{{ active().missing }}</dd>
        </div>
        <div>
          <dt class="ax-label">Assumption</dt>
          <dd class="mt-1 text-sm ax-body">{{ active().assumption }}</dd>
        </div>
        <div>
          <dt class="ax-label">Rationale</dt>
          <dd class="mt-1 text-sm ax-muted">{{ active().rationale }}</dd>
        </div>
        <div>
          <dt class="ax-label">Impact</dt>
          <dd class="mt-1 text-sm ax-muted">{{ active().impact }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
