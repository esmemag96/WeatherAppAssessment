<!--
  SearchSuggestion
  ----------------
  Purpose:
    A single selectable row representing a location - reused for both
    "Recent Searches" rows and live geocoding suggestion rows (identical
    visual treatment in the mockups). Purely presentational: given a name/
    subtitle/optional weather snapshot, it renders the row and emits
    `select`.

  Props:
    - name (string, required): location name, e.g. "London".
    - subtitle (string, optional): country/region, e.g. "United Kingdom".
    - icon (string, default 'history'): leading icon name.
    - temperatureLabel (string, optional): e.g. "12°".
    - conditionLabel (string, optional): e.g. "Overcast".
    - conditionVariant ('primary' | 'secondary' | 'tertiary' | 'neutral',
      default 'neutral'): tints the temperature/condition text.

  Events:
    - select: emitted on click/Enter.

  Usage:
    <SearchSuggestion
      name="London"
      subtitle="United Kingdom"
      temperature-label="12°"
      condition-label="Overcast"
      condition-variant="primary"
      @select="onSelect(location)"
    />
-->
<script setup lang="ts">
import { computed } from 'vue'

import Card from '@/shared/ui/Card.vue'
import Icon from '@/shared/ui/Icon.vue'
import { cn } from '@/shared/utils'

interface Props {
  name: string
  subtitle?: string
  icon?: string
  temperatureLabel?: string
  conditionLabel?: string
  conditionVariant?: 'primary' | 'secondary' | 'tertiary' | 'neutral'
}

const { icon = 'history', conditionVariant = 'neutral' } = defineProps<Props>()

defineEmits<{ select: [] }>()

const textClasses: Record<NonNullable<Props['conditionVariant']>, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  neutral: 'text-on-surface',
}

const conditionClasses = computed(() => textClasses[conditionVariant])
</script>

<template>
  <Card
    as="button"
    rounded="xl"
    padding="md"
    interactive
    class="flex w-full items-center justify-between text-left"
    @click="$emit('select')"
  >
    <div class="flex items-center gap-4">
      <Icon :name="icon" class="text-on-surface-variant" />
      <div>
        <p class="font-title-lg text-title-lg leading-tight text-on-surface">{{ name }}</p>
        <p v-if="subtitle" class="font-body-md text-body-md text-on-surface-variant">{{ subtitle }}</p>
      </div>
    </div>
    <div v-if="temperatureLabel || conditionLabel" class="text-right">
      <p v-if="temperatureLabel" :class="cn('font-numeric-data text-headline-md leading-tight', conditionClasses)">
        {{ temperatureLabel }}
      </p>
      <p v-if="conditionLabel" class="font-label-caps text-label-caps text-on-surface-variant uppercase">
        {{ conditionLabel }}
      </p>
    </div>
  </Card>
</template>
