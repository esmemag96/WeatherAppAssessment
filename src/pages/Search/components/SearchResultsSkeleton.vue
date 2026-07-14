<!--
  SearchResultsSkeleton
  ----------------------
  Purpose:
    Loading state for the suggestions list while a search is pending
    (debounce window + in-flight request) - shimmering rows
    approximating `SearchSuggestion`'s shape, built entirely from the
    shared `LoadingSkeleton` primitive.

  Props / Slots / Events: none - static placeholder layout.
-->
<script setup lang="ts">
import { Card, LoadingSkeleton } from '@/shared/ui'
</script>

<template>
  <div class="space-y-2" role="status" aria-busy="true" aria-label="Searching for locations">
    <Card v-for="n in 4" :key="n" rounded="xl" padding="md" class="flex items-center gap-4">
      <LoadingSkeleton shape="circle" width="24px" height="24px" />
      <div class="flex-1 space-y-2">
        <LoadingSkeleton width="45%" height="14px" />
        <LoadingSkeleton width="30%" height="12px" />
      </div>
    </Card>
  </div>
</template>
