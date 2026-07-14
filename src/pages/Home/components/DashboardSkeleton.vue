<!--
  DashboardSkeleton
  ------------------
  Purpose:
    Loading state for the Weather dashboard: shimmering placeholders
    approximating the hero card, hourly strip, daily list and details
    grid (per the "Dashboard Loading" mockup), built entirely from the
    shared `LoadingSkeleton` primitive - no bespoke markup/CSS.

  Props / Slots / Events: none - static placeholder layout.
-->
<script setup lang="ts">
import { Card, LoadingSkeleton } from '@/shared/ui'
</script>

<template>
  <div class="space-y-gutter" role="status" aria-busy="true" aria-label="Loading the forecast">
    <Card rounded="3xl" padding="lg" class="flex h-[420px] flex-col justify-between">
      <div class="flex items-start justify-between">
        <div class="space-y-2">
          <LoadingSkeleton width="96px" height="12px" />
          <LoadingSkeleton width="180px" height="28px" />
        </div>
        <LoadingSkeleton shape="pill" width="64px" height="24px" />
      </div>
      <div class="flex items-end justify-between">
        <div class="space-y-2">
          <LoadingSkeleton width="140px" height="72px" />
          <LoadingSkeleton width="120px" height="16px" />
        </div>
        <LoadingSkeleton shape="circle" width="48px" height="48px" />
      </div>
    </Card>

    <div class="flex gap-4 overflow-hidden">
      <LoadingSkeleton v-for="n in 6" :key="n" rounded="2xl" width="80px" height="128px" />
    </div>

    <div class="space-y-3">
      <LoadingSkeleton v-for="n in 5" :key="n" height="56px" rounded="lg" />
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <LoadingSkeleton v-for="n in 3" :key="n" height="160px" rounded="2xl" />
    </div>
  </div>
</template>
