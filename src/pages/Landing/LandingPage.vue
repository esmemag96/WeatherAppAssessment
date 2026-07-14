<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { ROUTE_PATHS } from '@/shared/constants'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
    <div class="max-w-lg">
      <h1 class="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
        Weather Forecast Application
      </h1>
      <p class="mt-3 text-base text-zinc-400">Senior Frontend Engineering Assessment</p>

      <p class="mt-8 text-sm leading-relaxed text-zinc-500">
        The application demonstrates the implementation. The engineering review summarizes the decisions, architecture, and quality strategy behind it.
      </p>

      <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <RouterLink
          :to="ROUTE_PATHS.home"
          class="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
        >
          View Application
        </RouterLink>
        <RouterLink
          :to="ROUTE_PATHS.artifacts"
          class="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
        >
          View Engineering Review
        </RouterLink>
      </div>
    </div>
  </div>
</template>
