<script setup lang="ts">
import { Icon } from '@/shared/ui'

defineProps<{
  why: string
  decision: string
  benefits: string[]
}>()

const benefitIcons = ['check_circle', 'trending_up', 'shield', 'speed', 'groups'] as const
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-3">
    <article class="ax-proposal-why er-fade-in p-5">
      <div class="flex items-center gap-2">
        <span class="ax-proposal-icon ax-proposal-icon-why" aria-hidden="true">
          <Icon name="help" size="sm" />
        </span>
        <h3 class="text-sm font-semibold ax-heading">Why?</h3>
      </div>
      <p class="mt-3 text-sm leading-relaxed ax-body">{{ why }}</p>
    </article>

    <article class="ax-proposal-decision er-fade-in p-5" style="animation-delay: 80ms">
      <div class="flex items-center gap-2">
        <span class="ax-proposal-icon ax-proposal-icon-decision" aria-hidden="true">
          <Icon name="lightbulb" size="sm" />
        </span>
        <h3 class="text-sm font-semibold ax-heading">Decision</h3>
      </div>
      <p class="mt-3 text-sm leading-relaxed ax-body">{{ decision }}</p>
    </article>

    <article class="ax-proposal-benefits er-fade-in p-5" style="animation-delay: 160ms">
      <div class="flex items-center gap-2">
        <span class="ax-proposal-icon ax-proposal-icon-benefits" aria-hidden="true">
          <Icon name="verified" size="sm" />
        </span>
        <h3 class="text-sm font-semibold ax-heading">Benefits</h3>
      </div>
      <ul class="mt-3 space-y-2">
        <li v-for="(benefit, index) in benefits" :key="benefit" class="flex gap-2 text-sm ax-muted">
          <Icon
            :name="benefitIcons[index % benefitIcons.length] ?? 'check'"
            size="sm"
            class="mt-0.5 shrink-0 ax-emerald-text"
            aria-hidden="true"
          />
          <span>{{ benefit }}</span>
        </li>
      </ul>
    </article>
  </div>
</template>
