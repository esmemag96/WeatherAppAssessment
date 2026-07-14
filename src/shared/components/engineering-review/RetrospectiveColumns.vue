<script setup lang="ts">
defineProps<{
  workedWell: string[]
  tradeoffsAccepted: string[]
  nextIteration: string[]
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <div class="ax-panel-emerald p-5">
      <h3 class="ax-emerald-heading">Worked Well</h3>
      <ul class="mt-3 space-y-2">
        <li v-for="item in workedWell" :key="item" class="text-sm ax-muted">{{ item }}</li>
      </ul>
    </div>
    <div class="ax-panel-amber p-5">
      <h3 class="ax-amber-heading">Trade-offs Accepted</h3>
      <ul class="mt-3 space-y-2">
        <li v-for="item in tradeoffsAccepted" :key="item" class="text-sm ax-muted">{{ item }}</li>
      </ul>
    </div>
    <div class="ax-card-muted p-5">
      <h3 class="ax-label">Next Iteration</h3>
      <ul class="mt-3 space-y-2">
        <li v-for="item in nextIteration" :key="item" class="text-sm ax-muted">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
