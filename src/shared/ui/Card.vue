<!--
  Card
  ----
  Purpose:
    Base surface container implementing the Nimbus elevation system. Every
    card-like block in the app (hero sections, metric tiles, list rows,
    modals, toasts) composes this instead of re-declaring the glass effect,
    per the "use composition instead of duplication" rule.

    "glass" reproduces the mockups' `.glass-card` treatment (translucent
    surface, blurred backdrop, brighter top border to fake a light source
    from above) using plain Tailwind utilities so it stays themeable via
    the design tokens in `style.css` without any bespoke CSS.

  Props:
    - variant ('glass' | 'solid' | 'outline', default 'glass').
    - padding ('none' | 'sm' | 'md' | 'lg', default 'md').
    - rounded ('lg' | 'xl' | '2xl' | '3xl', default 'xl').
    - interactive (boolean, default false): adds hover/press affordances
      for cards that act as buttons/links (favorite rows, explore tiles).
    - as (string, default 'div'): render as a different root element.

  Slots:
    - default: card content.

  Events: none (listen for native `click` etc. directly on the component
  when `interactive` is set - they fall through via attrs).

  Usage:
    <Card rounded="3xl" padding="lg">...</Card>
    <Card variant="outline" interactive @click="select">...</Card>
-->
<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/shared/utils'

interface Props {
  variant?: 'glass' | 'solid' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'lg' | 'xl' | '2xl' | '3xl'
  interactive?: boolean
  as?: string
}

const {
  variant = 'glass',
  padding = 'md',
  rounded = 'xl',
  interactive = false,
  as = 'div',
} = defineProps<Props>()

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  glass: 'bg-glass-fill/85 backdrop-blur-xl border border-border-subtle border-t-glass-highlight shadow-glass',
  solid: 'bg-glass-fill/90 backdrop-blur-sm border border-border-subtle dark:bg-surface-container dark:backdrop-blur-none',
  outline: 'bg-transparent border border-border-subtle',
}

const paddingClasses: Record<NonNullable<Props['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-container-padding',
}

const roundedClasses: Record<NonNullable<Props['rounded']>, string> = {
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

const classes = computed(() =>
  cn(
    variantClasses[variant],
    paddingClasses[padding],
    roundedClasses[rounded],
    interactive &&
      'cursor-pointer transition-transform duration-300 ease-swift hover:scale-[1.02] active:scale-95',
  ),
)
</script>

<template>
  <component :is="as" :type="as === 'button' ? 'button' : undefined" :class="classes">
    <slot />
  </component>
</template>
