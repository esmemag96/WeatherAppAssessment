<!--
  IconButton
  ----------
  Purpose:
    Circular icon-only tap target for compact actions (header search
    trigger, back navigation, profile edit, modal close, notification
    bell). Always requires an accessible `label` since there is no
    visible text.

  Props:
    - label (string, required): accessible name (aria-label).
    - variant ('ghost' | 'glass' | 'solid', default 'ghost').
    - size ('sm' | 'md' | 'lg', default 'md').
    - disabled (boolean, default false).

  Slots:
    - default: expects a single <Icon>.

  Events:
    - click: native click, blocked while disabled.

  Usage:
    <IconButton label="Search" @click="openSearch">
      <Icon name="search" />
    </IconButton>
-->
<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/shared/utils'

interface Props {
  label: string
  variant?: 'ghost' | 'glass' | 'solid'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const { label, variant = 'ghost', size = 'md', disabled = false } = defineProps<Props>()

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  ghost: 'text-on-surface-variant hover:bg-overlay-hover hover:text-on-surface',
  glass: 'bg-glass-fill/80 backdrop-blur-xl border border-border-subtle text-on-surface dark:bg-surface-container-low/80 dark:backdrop-blur-md',
  solid: 'bg-surface-container-highest text-on-surface hover:bg-surface-variant',
}

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center rounded-full transition-all duration-200 ease-swift active:scale-90',
    'disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100',
    variantClasses[variant],
    sizeClasses[size],
  ),
)
</script>

<template>
  <button type="button" :aria-label="label" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
