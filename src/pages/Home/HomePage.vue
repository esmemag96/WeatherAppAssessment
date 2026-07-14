<!--
  HomePage (Weather dashboard)
  -----------------------------
  Composition only - no store/API access happens in this file. All
  state (loading/error/empty/no-location/ready) and every formatted
  label come from `useWeatherDashboard`, which is the sole point where
  Pinia stores and infrastructure are touched. Each state maps 1:1 onto
  an existing shared component (`DashboardSkeleton`, `ErrorState`,
  `EmptyState`) or a small page-local section built from the design
  system's forecast/metric components - see the composable's doc
  comment and `DESIGN_SYSTEM.md` for the full component catalogue.

  Responsive layout: uses `PageContainer`'s `wide` variant (the
  `container-app-wide` token `DESIGN_SYSTEM.md` §4.7 reserved for "a
  future desktop dashboard") instead of the default mobile-shell width.
  Below that cap it behaves identically to every other page (mobile);
  above it, content now uses the full tablet/desktop viewport instead
  of staying pinned to a 448px column, and each section's own
  already-responsive grid (`WeatherDetailsSection`'s `sm:grid-cols-3`,
  the hourly strip's natural wrap-free scroll) fills the extra room -
  no new breakpoints or bespoke desktop components needed.
-->
<script setup lang="ts">
import { EmptyState, ErrorState, OfflineBanner, PageContainer, PageHeader, WeatherHeroCard } from '@/shared/components'
import { Button, FavoriteButton, Icon } from '@/shared/ui'

import AirQualitySection from './components/AirQualitySection.vue'
import DailyForecastSection from './components/DailyForecastSection.vue'
import DashboardSkeleton from './components/DashboardSkeleton.vue'
import HourlyForecastSection from './components/HourlyForecastSection.vue'
import LocationPermissionPrompt from './components/LocationPermissionPrompt.vue'
import WeatherDetailsSection from './components/WeatherDetailsSection.vue'
import { useWeatherDashboard } from './useWeatherDashboard'

const {
  isOffline,
  status,
  location,
  isFavorite,
  isLoading,
  errorMessage,
  headerTitle,
  headerSubtitle,
  hero,
  hourlyItems,
  dailyItems,
  metricItems,
  airQuality,
  toggleFavorite,
  goToSearch,
  retry,
  showLocationPrompt,
  isLocating,
  locationError,
  allowLocation,
  dismissLocationPrompt,
} = useWeatherDashboard()
</script>

<template>
  <PageContainer width="wide">
    <OfflineBanner :visible="isOffline" :retry-label="status === 'error' ? 'Retry' : undefined" @retry="retry" />

    <PageHeader :title="headerTitle" :subtitle="headerSubtitle">
      <template #actions>
        <FavoriteButton v-if="location" v-model="isFavorite" show-label @toggle="toggleFavorite" />
      </template>
    </PageHeader>

    <DashboardSkeleton v-if="status === 'loading'" />

    <ErrorState
      v-else-if="status === 'error'"
      title="Couldn't load the forecast"
      :description="errorMessage ?? 'Something went wrong while fetching the latest conditions.'"
      :retrying="isLoading"
      @retry="retry"
    />

    <EmptyState
      v-else-if="status === 'no-location'"
      icon="location_off"
      title="No location selected"
      description="Search for a city or use your current location to see its forecast here."
    >
      <template #actions>
        <div class="flex flex-col items-center gap-3 sm:flex-row">
          <Button variant="primary" @click="goToSearch">
            <template #icon-left><Icon name="search" /></template>
            Search cities
          </Button>
          <Button variant="ghost" :loading="isLocating" @click="allowLocation">
            <template #icon-left><Icon name="my_location" /></template>
            Use my location
          </Button>
        </div>
      </template>
    </EmptyState>

    <EmptyState
      v-else-if="status === 'empty'"
      icon="cloud_off"
      title="No forecast data"
      description="We couldn't find hourly or daily details for this location yet."
    >
      <template #actions>
        <Button variant="secondary" @click="retry">Try again</Button>
      </template>
    </EmptyState>

    <template v-else-if="hero">
      <WeatherHeroCard
        :background-image-url="hero.backgroundImageUrl"
        :condition="hero.condition"
        :date-label="hero.dateLabel"
        :temperature-label="hero.temperatureLabel"
        :high-low-label="hero.highLowLabel"
        :feels-like-label="hero.feelsLikeLabel"
        :icon="hero.icon"
        :live="hero.live"
      />
      <HourlyForecastSection :items="hourlyItems" />
      <AirQualitySection :item="airQuality" />
      <WeatherDetailsSection :items="metricItems" />
      <DailyForecastSection :items="dailyItems" />
    </template>

    <LocationPermissionPrompt
      :open="showLocationPrompt"
      :loading="isLocating"
      :error-message="locationError"
      @allow="allowLocation"
      @dismiss="dismissLocationPrompt"
    />
  </PageContainer>
</template>
