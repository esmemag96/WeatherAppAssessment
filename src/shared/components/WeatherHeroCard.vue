<!--
  WeatherHeroCard
  ---------------
  Purpose:
    The large "current conditions" hero shown at the top of the Weather
    dashboard: a background photo of the location, a gradient overlay for
    legibility, the condition label + date, an optional "Live" badge, the
    big temperature reading, high/low, feels-like, and a condition icon.

    Purely presentational - it receives already-formatted display strings
    (no unit conversion, no domain types) so it can be reused verbatim
    once real forecast data is wired in during feature implementation.

    Text always renders in white with a dark scrim because the hero sits
    on photographic/illustrated backgrounds that can be dark regardless
    of the app's light/dark theme (mirrors Apple Weather).

  Props:
    - backgroundImageUrl (string, optional): falls back to a plain
      surface gradient when omitted (e.g. while loading).
    - condition (string, required): e.g. "Partly Cloudy".
    - dateLabel (string, required): e.g. "Monday, 14 Oct".
    - temperatureLabel (string, required): e.g. "68".
    - highLowLabel (string, optional): e.g. "H: 72° L: 56°".
    - feelsLikeLabel (string, optional): e.g. "Feels like 66°".
    - icon (string, default 'filter_drama'): condition icon name.
    - live (boolean, default false): shows the pulsing "Live" badge.

  Slots: none.
  Events: none.

  Usage:
    <WeatherHeroCard
      background-image-url="https://..."
      condition="Partly Cloudy"
      date-label="Monday, 14 Oct"
      temperature-label="68"
      high-low-label="H: 72° L: 56°"
      feels-like-label="Feels like 66°"
      live
    />
-->
<script setup lang="ts">
import Badge from '@/shared/ui/Badge.vue'
import Icon from '@/shared/ui/Icon.vue'

interface Props {
  backgroundImageUrl?: string
  condition: string
  dateLabel: string
  temperatureLabel: string
  highLowLabel?: string
  feelsLikeLabel?: string
  icon?: string
  live?: boolean
}

const { icon = 'filter_drama', live = false } = defineProps<Props>()
</script>

<template>
  <section class="group relative h-[420px] overflow-hidden rounded-3xl shadow-2xl">
    <div class="absolute inset-0 z-0">
      <img
        v-if="backgroundImageUrl"
        :src="backgroundImageUrl"
        alt=""
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div v-else class="h-full w-full bg-gradient-to-br from-primary-container via-secondary-container/60 to-tertiary-container/40" />
      <!-- Dark scrim is always image-based (not theme tokens) so text stays legible in light mode. -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"
        aria-hidden="true"
      />
    </div>

    <div class="relative z-10 flex h-full flex-col justify-between p-container-padding text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.45)]">
      <div class="flex items-start justify-between">
        <div>
          <p class="font-label-caps text-label-caps uppercase tracking-widest text-white/90">
            {{ condition }}
          </p>
          <h2 class="font-headline-lg text-headline-lg">{{ dateLabel }}</h2>
        </div>
        <Badge v-if="live" variant="on-media" dot pulse>Live</Badge>
      </div>

      <div class="flex items-end justify-between">
        <div>
          <div class="flex items-start">
            <span class="text-display-metrics-sm leading-none sm:text-display-metrics">
              {{ temperatureLabel }}
            </span>
            <span class="mt-2 text-headline-lg font-bold text-white/90">°</span>
          </div>
          <p v-if="highLowLabel" class="mt-2 font-body-lg text-body-lg text-white/85">
            {{ highLowLabel }}
          </p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <Icon :name="icon" filled size="2xl" class="text-white drop-shadow-md" />
          <span v-if="feelsLikeLabel" class="font-label-caps text-label-caps text-white/85">
            {{ feelsLikeLabel }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
