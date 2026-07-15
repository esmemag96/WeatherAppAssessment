<!--
  FavoritesPage
  -------------
  Composition only - no store/API access happens in this file. The
  list, empty state, and the select/remove flows come from
  `useFavoritesPage`, the sole point where `useFavoritesStore` /
  `useForecastStore` are touched.
-->
<script setup lang="ts">
import { EmptyState, PageContainer, PageHeader } from '@/shared/components'

import FavoriteLocationRow from './components/FavoriteLocationRow.vue'
import { useFavoritesPage } from './useFavoritesPage'

const {
  favoriteItems,
  draggingIndex,
  dragOverIndex,
  onReorderStart,
  onReorderMove,
  onReorderEnd,
  selectFavorite,
  removeFavorite,
} = useFavoritesPage()
</script>

<template>
  <PageContainer>
    <PageHeader title="Favorites" subtitle="Press and hold the handle to reorder your saved locations." />

    <EmptyState
      v-if="favoriteItems.length === 0"
      icon="star"
      title="No favorites yet"
      description="Star a location's forecast to save it here for quick access."
    />

    <div v-else class="space-y-2">
      <FavoriteLocationRow
        v-for="(item, index) in favoriteItems"
        :key="item.id"
        :reorder-index="index"
        :name="item.name"
        :weather-status="item.weatherStatus"
        :condition-label="item.conditionLabel"
        :temperature-label="item.temperatureLabel"
        :icon="item.icon"
        :icon-color-class="item.iconColorClass"
        :dragging="draggingIndex === index"
        :drag-over="dragOverIndex === index && draggingIndex !== index"
        @select="selectFavorite(item.location)"
        @remove="removeFavorite(item.id)"
        @reorder-start="onReorderStart"
        @reorder-move="onReorderMove"
        @reorder-end="onReorderEnd"
      />
    </div>
  </PageContainer>
</template>
