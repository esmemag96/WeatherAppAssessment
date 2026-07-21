<!--
  SettingsPage
  ------------
  Composition only - no store access happens in this file. The
  temperature unit and its persistence come from `useSettingsPage`,
  the sole point where `useSettingsStore` is touched.
-->
<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { PageContainer, PageHeader, SectionHeader } from '@/shared/components'
import { ROUTE_PATHS } from '@/shared/constants'
import { Card, Chip, Divider, Icon } from '@/shared/ui'

import { useSettingsPage } from './useSettingsPage'

const {
  temperatureUnit,
  windSpeedUnit,
  theme,
  setTemperatureUnit,
  setWindSpeedUnit,
  setTheme,
} = useSettingsPage()
</script>

<template>
  <PageContainer>
    <PageHeader title="Settings" subtitle="Units, theme, and preferences." />

    <div class="space-y-3">
      <SectionHeader title="Appearance" uppercase />
      <Card rounded="xl" padding="md" class="flex items-center justify-between">
        <span class="flex items-center gap-3 font-body-lg text-body-lg text-on-surface">
          <span class="inline-flex items-center gap-0.5 text-on-surface-variant" aria-hidden="true">
            <Icon name="wb_sunny" size="sm" />
            <Icon name="dark_mode" size="sm" />
          </span>
          Theme
        </span>
        <div class="flex gap-1 rounded-lg bg-surface-container-highest p-1">
          <Chip :selected="theme === 'light'" @click="setTheme('light')">Light</Chip>
          <Chip :selected="theme === 'dark'" @click="setTheme('dark')">Dark</Chip>
        </div>
      </Card>
    </div>

    <div class="space-y-3">
      <SectionHeader title="Units" uppercase />
      <Card rounded="xl" padding="md" class="flex items-center justify-between">
        <span class="flex items-center gap-3 font-body-lg text-body-lg text-on-surface">
          <Icon name="thermostat" class="text-on-surface-variant" />
          Temperature
        </span>
        <div class="flex gap-1 rounded-lg bg-surface-container-highest p-1">
          <Chip :selected="temperatureUnit === 'celsius'" @click="setTemperatureUnit('celsius')">°C</Chip>
          <Chip :selected="temperatureUnit === 'fahrenheit'" @click="setTemperatureUnit('fahrenheit')">°F</Chip>
        </div>
      </Card>
      <Card rounded="xl" padding="md" class="flex items-center justify-between">
        <span class="flex items-center gap-3 font-body-lg text-body-lg text-on-surface">
          <Icon name="air" class="text-on-surface-variant" />
          Wind speed
        </span>
        <div class="flex gap-1 rounded-lg bg-surface-container-highest p-1">
          <Chip :selected="windSpeedUnit === 'kph'" @click="setWindSpeedUnit('kph')">km/h</Chip>
          <Chip :selected="windSpeedUnit === 'mph'" @click="setWindSpeedUnit('mph')">mph</Chip>
        </div>
      </Card>
    </div>

    <div class="space-y-3">
      <SectionHeader title="About" uppercase />
      <Card rounded="xl" padding="none">
        <div class="flex items-center justify-between p-4">
          <span class="flex items-center gap-3 font-body-lg text-body-lg text-on-surface">
            <Icon name="cloud" class="text-on-surface-variant" />
            Data Provider
          </span>
          <span class="font-body-md text-body-md text-on-surface-variant">Open-Meteo</span>
        </div>
        <Divider />
        <RouterLink
          :to="ROUTE_PATHS.artifacts"
          class="flex items-center justify-between p-4 transition-colors hover:bg-overlay-hover"
        >
          <span class="flex items-center gap-3 font-body-lg text-body-lg text-on-surface">
            <Icon name="menu_book" class="text-on-surface-variant" />
            Engineering Review
          </span>
          <Icon name="chevron_right" class="text-on-surface-variant" />
        </RouterLink>
      </Card>
    </div>
  </PageContainer>
</template>
