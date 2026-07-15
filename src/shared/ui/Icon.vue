<!--
  Icon
  ----
  Purpose:
    Thin, typed wrapper around Google's "Material Symbols Outlined" variable
    font - the exact icon set used throughout every Esmeralda Weather App mockup (1.5px
    stroke weight, with a `FILL` axis used to indicate active/emphasized
    states, e.g. a filled cloud icon for the current hour, or a filled
    star for a saved favorite).

  Props:
    - name (string, required): the Material Symbol ligature, e.g. "search",
      "filter_drama", "location_on". Browse names at fonts.google.com/icons.
    - size ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', default 'md')
    - filled (boolean, default false): switches on the FILL axis, used for
      "selected"/"active" states (bottom nav active tab, current-hour tile).
    - weight (100-700, default 400): stroke weight axis.
    - label (string, optional): accessible name. When omitted the icon is
      treated as purely decorative (aria-hidden).

  Slots: none.
  Events: none (purely presentational; wrap in IconButton for interactivity).

  Usage:
    <Icon name="filter_drama" />
    <Icon name="star" filled size="lg" label="Saved to favorites" />
-->
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  filled?: boolean
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  label?: string
}

const { name, size = 'md', filled = false, weight = 400, label } = defineProps<Props>()

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
  '2xl': 'text-6xl',
}

const variationSettings = computed(
  () => `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
)
</script>

<template>
  <span
    class="material-symbols-outlined pointer-events-none inline-block select-none leading-none"
    :class="sizeClasses[size]"
    :style="{ fontVariationSettings: variationSettings }"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label"
    :role="label ? 'img' : undefined"
  >{{ name }}</span>
</template>
