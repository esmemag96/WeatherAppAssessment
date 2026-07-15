<script setup lang="ts">
import type { AiWorkflowStageData } from '@/content/artifacts/types'

defineProps<{
  stages: AiWorkflowStageData[]
  activeId: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <div class="er-ai-workflow">
    <ol class="er-ai-workflow__rail" aria-label="Engineering workflow stages">
      <li v-for="(stage, index) in stages" :key="stage.id" class="er-ai-workflow__step">
        <button
          type="button"
          class="er-ai-workflow__node ax-focus"
          :class="{ 'er-ai-workflow__node--active': activeId === stage.id }"
          :aria-current="activeId === stage.id ? 'true' : undefined"
          @click="emit('select', stage.id)"
        >
          <span class="er-ai-workflow__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="er-ai-workflow__label">{{ stage.label }}</span>
        </button>
        <span v-if="index < stages.length - 1" class="er-ai-workflow__arrow" aria-hidden="true">↓</span>
      </li>
    </ol>

    <div
      v-for="stage in stages"
      v-show="activeId === stage.id"
      :key="`panel-${stage.id}`"
      class="er-ai-workflow__panel"
      role="region"
      :aria-label="`${stage.label} contributions`"
    >
      <div>
        <h4 class="ax-label">Where AI contributed</h4>
        <ul class="mt-3 space-y-2">
          <li v-for="item in stage.aiContribution" :key="item" class="flex gap-2 text-sm ax-muted">
            <span class="er-text-primary shrink-0" aria-hidden="true">→</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <div>
        <h4 class="ax-emerald-heading text-xs uppercase tracking-widest">What I owned</h4>
        <ul class="mt-3 space-y-2">
          <li v-for="item in stage.engineerResponsibility" :key="item" class="flex gap-2 text-sm ax-muted">
            <span class="ax-emerald-text shrink-0" aria-hidden="true">→</span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
