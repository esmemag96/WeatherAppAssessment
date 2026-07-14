<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  href: string
  external?: boolean
  newTab?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
}>()

const linkClasses =
  'ax-focus ax-link-btn inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors'
</script>

<template>
  <a
    v-if="external || newTab"
    :href="href"
    :target="external || newTab ? '_blank' : undefined"
    :rel="external || newTab ? 'noopener noreferrer' : undefined"
    :class="[
      linkClasses,
      {
        'ax-btn-primary': variant === 'primary',
        'ax-btn-secondary': variant === 'secondary' || !variant,
        'ax-btn-ghost': variant === 'ghost',
      },
    ]"
  >
    <slot />
    <span v-if="external || newTab" class="ml-1 text-xs opacity-50" aria-hidden="true">↗</span>
  </a>
  <RouterLink
    v-else
    :to="href"
    :class="[
      linkClasses,
      {
        'ax-btn-primary': variant === 'primary',
        'ax-btn-secondary': variant === 'secondary' || !variant,
        'ax-btn-ghost': variant === 'ghost',
      },
    ]"
  >
    <slot />
  </RouterLink>
</template>
