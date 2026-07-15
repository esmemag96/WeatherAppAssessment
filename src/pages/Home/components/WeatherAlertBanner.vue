<!--
  WeatherAlertBanner
  ------------------
  Purpose:
    Surfaces a single locally-derived weather advisory (see
    `resolveWeatherAlerts`) between the hero card and the hourly
    forecast. Colored by severity - "severe" borrows the `error` token,
    "moderate" the `tertiary` token - matching `Badge`/`OfflineBanner`'s
    existing severity language instead of introducing new colors.

  Props:
    - alert (WeatherAlert, required).

  Slots/Events: none.

  Usage:
    <WeatherAlertBanner v-for="alert in alerts" :key="alert.id" :alert="alert" />
-->
<script setup lang="ts">
import type { WeatherAlert } from '@/entities/weather'
import Icon from '@/shared/ui/Icon.vue'

defineProps<{ alert: WeatherAlert }>()

// Light mode's sky-blue page background washed out the original /10 fill
// (the card's own boundary nearly disappeared) - a stronger fill in light
// mode restores contrast; dark mode's near-black background already reads
// fine at a lower fill, so it stays lighter there.
const severityClasses: Record<WeatherAlert['severity'], string> = {
  severe: 'border-error/30 bg-error/20 dark:bg-error/12 text-error',
  moderate: 'border-tertiary/30 bg-tertiary/20 dark:bg-tertiary/12 text-tertiary',
}
</script>

<template>
  <div
    role="alert"
    :class="[
      'flex items-start gap-3 rounded-2xl border px-4 py-3.5',
      severityClasses[alert.severity],
    ]"
  >
    <Icon name="warning" filled size="sm" class="mt-0.5 shrink-0" />
    <div class="min-w-0 flex-1">
      <p class="font-title-lg text-title-lg leading-tight">{{ alert.title }}</p>
      <p class="mt-1 font-body-md text-body-md opacity-90">{{ alert.description }}</p>
      <p class="mt-1.5 font-label-caps text-label-caps uppercase tracking-widest opacity-60">
        Automated advisory · based on forecast data
      </p>
    </div>
  </div>
</template>
