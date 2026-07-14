<!--
  Badge
  -----
  Purpose:
    Small pill-shaped status indicator. Covers the "Live" indicator with a
    pulsing dot on the hero card, and the diagnostic chips on the error
    screen ("ERR_TIMEOUT_408", "NODE_US_EAST").

  Props:
    - variant ('neutral' | 'primary' | 'secondary' | 'tertiary' | 'error',
      default 'neutral').
    - dot (boolean, default false): renders a small leading status dot
      instead of/alongside the icon slot.
    - pulse (boolean, default false): animates the dot (`animate-pulse`).

  Slots:
    - default: label text.
    - icon: optional leading icon, replaces the dot.

  Usage:
    <Badge variant="secondary" dot pulse>Live</Badge>
    <Badge variant="neutral"><template #icon><Icon name="dns" size="xs" /></template>NODE_US_EAST</Badge>
-->
<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/shared/utils'

interface Props {
  variant?: 'neutral' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'on-media'
  dot?: boolean
  pulse?: boolean
}

const { variant = 'neutral', dot = false, pulse = false } = defineProps<Props>()

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  neutral: 'bg-surface-container-low text-on-surface-variant border-border-subtle',
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/20',
  error: 'bg-error/10 text-error border-error/20',
  /** Frosted pill for badges sitting on top of photographic hero imagery. */
  'on-media': 'bg-white/20 text-white border-white/30 backdrop-blur-sm',
}

const dotClasses: Record<NonNullable<Props['variant']>, string> = {
  neutral: 'bg-outline',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  error: 'bg-error',
  'on-media': 'bg-white',
}

const classes = computed(() =>
  cn(
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-label-caps text-label-caps',
    variantClasses[variant],
  ),
)
</script>

<template>
  <span :class="classes">
    <slot name="icon">
      <span
        v-if="dot"
        :class="cn('h-1.5 w-1.5 rounded-full', dotClasses[variant], pulse && 'animate-pulse')"
      />
    </slot>
    <slot />
  </span>
</template>
