<!--
  SearchPage
  ----------
  Composition only - no store/API access happens in this file. All
  state (recent/loading/error/empty/results) and the select-a-location
  flow come from `useSearchPage`, which is the sole point where
  `useSearchStore` / `useForecastStore` / `useRecentSearchesStore` /
  `useGeolocation` are touched. Each state maps 1:1 onto an existing
  shared component (`SearchBar`, `EmptyState`, `ErrorState`) or a small
  page-local list/skeleton built from `SearchSuggestion` - see
  `DESIGN_SYSTEM.md` for the full component catalogue.

  `SearchBar`'s built-in "Use Current Location" quick action is shown
  whenever geolocation is supported and routed through the same
  select-a-location flow as picking a suggestion row.
-->
<script setup lang="ts">
import { EmptyState, ErrorState, PageContainer, PageHeader, SearchBar, SectionHeader } from '@/shared/components'

import SearchResultsList from './components/SearchResultsList.vue'
import SearchResultsSkeleton from './components/SearchResultsSkeleton.vue'
import { useSearchPage } from './useSearchPage'

const {
  query,
  status,
  isLoading,
  errorMessage,
  suggestions,
  recentSearches,
  setQuery,
  submitQuery,
  clearQuery,
  retry,
  selectLocation,
  clearRecentSearches,
  isGeolocationSupported,
  isLocating,
  locationError,
  useCurrentLocation,
} = useSearchPage()
</script>

<template>
  <PageContainer>
    <PageHeader title="Search" subtitle="Find a city to check its forecast." />

    <SearchBar
      :model-value="query"
      :loading="isLoading || isLocating"
      :show-current-location="isGeolocationSupported"
      @update:model-value="setQuery"
      @submit="submitQuery"
      @clear="clearQuery"
      @use-current-location="useCurrentLocation"
    />
    <p v-if="locationError" class="font-body-md text-body-md text-error">{{ locationError }}</p>

    <SearchResultsSkeleton v-if="status === 'loading'" />

    <ErrorState
      v-else-if="status === 'error'"
      title="Couldn't search locations"
      :description="errorMessage ?? 'Something went wrong while searching. Please try again.'"
      @retry="retry"
    />

    <EmptyState
      v-else-if="status === 'empty'"
      icon="wrong_location"
      title="No matches found"
      :description="`We couldn't find a city matching \u201c${query.trim()}\u201d.`"
    />

    <SearchResultsList
      v-else-if="status === 'results'"
      :items="suggestions"
      icon="location_on"
      @select="selectLocation"
    />

    <template v-else>
      <SectionHeader title="Recent Searches">
        <template #action>
          <button
            v-if="recentSearches.length"
            type="button"
            class="font-label-caps text-label-caps uppercase text-primary hover:underline"
            @click="clearRecentSearches"
          >
            Clear All
          </button>
        </template>
      </SectionHeader>

      <EmptyState
        v-if="recentSearches.length === 0"
        icon="history"
        title="No recent searches"
        description="Cities you search for will show up here."
      />
      <SearchResultsList v-else :items="recentSearches" icon="history" @select="selectLocation" />
    </template>
  </PageContainer>
</template>
