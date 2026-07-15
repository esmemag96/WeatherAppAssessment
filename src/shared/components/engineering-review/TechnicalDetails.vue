<script setup lang="ts">
import { ref } from 'vue'

import { Icon } from '@/shared/ui'

defineProps<{
  label?: string
}>()

const open = ref(false)
</script>

<template>
  <div class="ax-technical-shell er-fade-in overflow-hidden">
    <button
      type="button"
      class="ax-focus ax-technical-trigger flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="flex items-center gap-2">
        <span class="ax-proposal-icon ax-proposal-icon-technical" aria-hidden="true">
          <Icon name="code" size="sm" />
        </span>
        <span class="text-sm font-medium ax-heading">{{ label ?? 'Technical details' }}</span>
      </span>
      <Icon
        name="expand_more"
        size="md"
        class="shrink-0 transition-transform duration-300 ease-out ax-muted"
        :class="{ 'rotate-180': open }"
        aria-hidden="true"
      />
    </button>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[4000px] opacity-100"
      leave-from-class="max-h-[4000px] opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-if="open" class="ax-border border-t px-5 pb-5 pt-4">
        <slot />
      </div>
    </Transition>
  </div>
</template>
