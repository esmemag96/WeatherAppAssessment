<!--
  LoadingSkeleton
  ---------------
  Purpose:
    Shimmering placeholder block used to build loading states (see the
    "Dashboard Loading" mockup: shimmering title bars, avatar circles and
    table rows while data is in flight). Purely presentational - pages
    compose several of these to approximate their own final layout.

  Props:
    - shape ('rect' | 'circle' | 'pill', default 'rect').
    - width (string, default '100%'): any valid CSS width.
    - height (string, default '1rem'): any valid CSS height.
    - rounded (string, optional): Tailwind rounded-* class override for
      shape="rect" (defaults to "rounded-lg").

  Slots / Events: none.

  Usage:
    <LoadingSkeleton shape="circle" width="48px" height="48px" />
    <LoadingSkeleton width="60%" height="2.5rem" />
-->
<script setup lang="ts">
import { computed } from 'vue'

import { cn } from '@/shared/utils'

interface Props {
  shape?: 'rect' | 'circle' | 'pill'
  width?: string
  height?: string
  rounded?: string
}

const { shape = 'rect', width = '100%', height = '1rem', rounded } = defineProps<Props>()

const shapeClass = computed(() => {
  if (shape === 'circle') return 'rounded-full'
  if (shape === 'pill') return 'rounded-full'
  return rounded ?? 'rounded-lg'
})
</script>

<template>
  <span
    :class="cn('relative block overflow-hidden bg-overlay-subtle', shapeClass)"
    :style="{ width, height }"
    aria-hidden="true"
  >
    <span
      class="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-overlay-shimmer to-transparent"
    />
  </span>
</template>
