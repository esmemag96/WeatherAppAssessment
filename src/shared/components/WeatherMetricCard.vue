<!--
  WeatherMetricCard
  -----------------
  Purpose:
    A single tile in the "bento grid" of weather metrics (UV Index,
    Humidity, Wind, Visibility). Each metric visualizes its value
    differently (a progress bar, a bar chart, a compass, ...), so the
    visualization itself is a slot rather than a prop - this keeps the
    card generic and avoids teaching it about every possible metric type.

  Props:
    - label (string, required): e.g. "UV Index".
    - icon (string, required): leading icon name.
    - value (string, required): e.g. "4", "62%".
    - description (string, optional): e.g. "Moderate", "Dew point 54°".

  Slots:
    - visual: optional bottom visualization (progress bar, mini bar chart,
      compass, etc.) - see ForecastDailyRow's bar for a reusable pattern.

  Usage:
    <WeatherMetricCard label="UV Index" icon="wb_sunny" value="4" description="Moderate">
      <template #visual>
        <div class="h-1 w-full rounded-full bg-surface-variant">
          <div class="h-full w-2/5 rounded-full bg-tertiary" />
        </div>
      </template>
    </WeatherMetricCard>
-->
<script setup lang="ts">
import Card from '@/shared/ui/Card.vue'
import Icon from '@/shared/ui/Icon.vue'

interface Props {
  label: string
  icon: string
  value: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <Card rounded="3xl" padding="md" class="flex h-40 flex-col justify-between">
    <div class="flex items-center gap-2 text-on-surface-variant">
      <Icon :name="icon" size="sm" />
      <span class="font-label-caps text-label-caps uppercase">{{ label }}</span>
    </div>
    <div class="space-y-1">
      <p class="font-headline-md text-headline-md text-on-surface">{{ value }}</p>
      <p v-if="description" class="font-body-md text-body-md text-on-surface-variant">{{ description }}</p>
    </div>
    <slot name="visual" />
  </Card>
</template>
