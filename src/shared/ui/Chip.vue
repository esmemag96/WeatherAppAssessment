<!--
  Chip
  ----
  Purpose:
    Small selectable control used for segmented toggles (Settings' °C/°F
    and km/h/mph switches) and categorical labels. Stateless/controlled -
    the parent owns the selected value and passes `selected` down, so this
    stays reusable for any future toggle group without embedding business
    logic here.

  Props:
    - selected (boolean, default false).
    - variant ('segmented' | 'outline', default 'segmented').
    - disabled (boolean, default false).

  Slots:
    - default: chip label.

  Events:
    - click: emitted on press (parent decides what "selecting" means).

  Usage:
    <div class="flex gap-1 rounded-lg bg-surface-container-highest p-1">
      <Chip :selected="unit === 'c'" @click="unit = 'c'">°C</Chip>
      <Chip :selected="unit === 'f'" @click="unit = 'f'">°F</Chip>
    </div>
-->
<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/shared/utils'

interface Props {
  selected?: boolean
  variant?: 'segmented' | 'outline'
  disabled?: boolean
}

const { selected = false, variant = 'segmented', disabled = false } = defineProps<Props>()

defineEmits<{ click: [MouseEvent] }>()

const classes = computed(() => {
  if (variant === 'outline') {
    return cn(
      'rounded-full border px-3 py-1',
      selected ? 'border-primary bg-primary/10 text-primary' : 'border-border-subtle text-on-surface-variant',
    )
  }
  return cn(
    'rounded-md px-4 py-1 transition-all duration-200 ease-swift',
    selected
      ? 'bg-primary-container/60 text-primary shadow-sm dark:bg-secondary-container/30 dark:text-on-secondary-container'
      : 'text-on-surface-variant hover:text-on-surface',
  )
})
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :aria-pressed="selected"
    :class="cn('font-label-caps text-label-caps font-bold disabled:cursor-not-allowed disabled:opacity-50', classes)"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
