<!--
  Button
  ------
  Purpose:
    Primary interactive control. Covers every button treatment seen in the
    mockups: solid primary ("Retry"), solid secondary ("Explore Locations"),
    glass secondary ("Offline Settings"), and outlined danger ("Sign Out").

  Props:
    - variant ('primary' | 'secondary' | 'ghost' | 'danger', default 'primary').
    - size ('sm' | 'md' | 'lg', default 'md').
    - type ('button' | 'submit', default 'button').
    - disabled (boolean, default false).
    - loading (boolean, default false): shows a spinner and disables clicks
      while preserving layout width.
    - block (boolean, default false): expands to fill container width.

  Slots:
    - default: button label.
    - icon-left / icon-right: optional icon slots (place an <Icon> inside).

  Events:
    - click: native click, blocked while disabled/loading.

  Usage:
    <Button variant="primary" size="lg" block @click="retry">
      <template #icon-left><Icon name="refresh" /></template>
      Retry
    </Button>
-->
<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/shared/utils'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const {
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  block = false,
} = defineProps<Props>()

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-primary text-on-primary shadow-glow-primary hover:brightness-110',
  secondary: 'bg-secondary text-on-secondary-container shadow-lg hover:brightness-110',
  ghost:
    'bg-glass-fill/80 backdrop-blur-md border border-border-subtle text-on-surface hover:bg-overlay-hover dark:bg-surface-container-low/80 dark:backdrop-blur-md',
  danger: 'bg-error/5 border border-error/20 text-error hover:bg-error/10',
}

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-9 px-3 text-body-md rounded-lg gap-1.5',
  md: 'h-row-height-sm px-4 text-title-lg rounded-xl gap-2',
  lg: 'h-row-height-md px-6 text-title-lg rounded-xl gap-2',
}

const isDisabled = computed(() => disabled || loading)

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center font-headline-md transition-all duration-300 ease-swift active:scale-95',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
    variantClasses[variant],
    sizeClasses[size],
    block && 'w-full',
  ),
)
</script>

<template>
  <button :type="type" :disabled="isDisabled" :class="classes">
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot v-else name="icon-left" />
    <slot />
    <slot v-if="!loading" name="icon-right" />
  </button>
</template>
