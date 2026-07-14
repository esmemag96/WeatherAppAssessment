<!--
  Divider
  -------
  Purpose:
    Hairline separator used between list rows (Settings groups, Favorites
    stats) and sections. Mirrors the low-opacity white hairlines used
    everywhere in the mockups (`divide-white/5`, `border-white/10`).

  Props:
    - orientation ('horizontal' | 'vertical', default 'horizontal').
    - inset (boolean, default false): adds horizontal padding so the line
      doesn't touch the edges of its container.

  Slots / Events: none.

  Usage:
    <Divider />
    <Divider orientation="vertical" />
-->
<script setup lang="ts">
import { cn } from '@/shared/utils'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  inset?: boolean
}

const { orientation = 'horizontal', inset = false } = defineProps<Props>()
</script>

<template>
  <hr
    v-if="orientation === 'horizontal'"
    :class="cn('border-t border-divider', inset && 'mx-4')"
  />
  <div v-else class="w-px self-stretch bg-border-subtle" role="separator" aria-orientation="vertical" />
</template>
