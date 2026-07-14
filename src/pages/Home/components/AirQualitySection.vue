<!--
  AirQualitySection
  -----------------
  Purpose:
    "Air Quality" module of the Weather dashboard: current US AQI with
    its category label/description, visualized with a ring + progress
    bar. Hidden entirely when no reading is available (the air-quality
    API is a best-effort secondary source - see
    `forecastStore.loadForecast` - so a missing reading is expected, not
    an error state). UV Index is shown separately, as one of the
    `WeatherDetailsSection` bento tiles.

  Props:
    - item (AirQualityItem | null, required): pre-formatted display
      values; the section renders nothing when null.

  The AQI ring visualizes `usAqi` against a 0-100 reference scale (the
  EPA's "Good"/"Moderate" range) rather than the full 0-500 index, the
  same "reference max, not an absolute ceiling" convention used by the
  Wind metric card's bar - it keeps the ring meaningfully filled for the
  vast majority of real-world readings instead of looking perpetually
  empty.
-->
<script setup lang="ts">
import { computed } from 'vue'

import { SectionHeader } from '@/shared/components'
import { Card, Icon } from '@/shared/ui'

export interface AirQualityItem {
  usAqi: number
  categoryLabel: string
  description: string
}

const props = defineProps<{ item: AirQualityItem | null }>()

const ringPercent = computed(() => Math.min(100, Math.max(0, props.item?.usAqi ?? 0)))
const ringStyle = computed(() => ({
  background: `conic-gradient(var(--color-secondary) ${ringPercent.value * 3.6}deg, rgba(255, 255, 255, 0.08) 0deg)`,
}))
</script>

<template>
  <section v-if="item" class="space-y-2">
    <SectionHeader title="Air Quality" uppercase>
      <template #icon><Icon name="air" size="sm" class="mr-2 text-secondary" /></template>
    </SectionHeader>

    <Card rounded="3xl" padding="lg" class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="font-headline-md text-headline-md text-on-surface">{{ item.usAqi }} - {{ item.categoryLabel }}</p>
          <p class="mt-1 font-body-md text-body-md text-on-surface-variant">{{ item.description }}</p>
        </div>
        <div class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full" :style="ringStyle">
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low">
            <span class="font-numeric-data text-numeric-data text-secondary">{{ item.usAqi }}</span>
          </div>
        </div>
      </div>

      <div class="h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
        <div class="h-full rounded-full bg-secondary" :style="{ width: `${ringPercent}%` }" />
      </div>
    </Card>
  </section>
</template>
