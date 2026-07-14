<script setup lang="ts">
defineProps<{
  steps: string[]
  caption: string
}>()
</script>

<template>
  <figure class="ax-card p-6">
    <div class="flex flex-col items-center gap-2">
      <template v-for="(step, index) in steps" :key="step">
        <div class="er-flow-node w-full max-w-xs text-sm font-medium">
          {{ step }}
        </div>
        <span v-if="index < steps.length - 1" class="ax-arrow" aria-hidden="true">↓</span>
      </template>
    </div>
    <figcaption class="mt-6 text-center text-sm ax-muted">{{ caption }}</figcaption>
  </figure>
</template>
