<script setup lang="ts">
import type { PersonaData } from '@/content/artifacts/types'
import { Icon } from '@/shared/ui'

defineProps<{
  persona: PersonaData
  intro?: string
}>()
</script>

<template>
  <div class="glass-card er-fade-in overflow-hidden">
    <div v-if="persona.image" class="er-persona-visual er-persona-visual--profile">
      <img
        :src="persona.image"
        :alt="persona.imageAlt ?? `${persona.name} persona`"
        class="er-persona-visual__image"
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
      <div
        v-if="!persona.image"
        class="er-persona-avatar flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-semibold"
        aria-hidden="true"
      >
        {{ persona.name.charAt(0) }}
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 class="font-title-lg text-title-lg ax-heading">{{ persona.name }}</h3>
          <span class="text-sm ax-faint">{{ persona.age }} · {{ persona.occupation }}</span>
        </div>

        <p v-if="intro" class="mt-3 text-sm leading-relaxed ax-body">{{ intro }}</p>

        <div class="mt-5">
          <p class="ax-label">Uses the app</p>
          <ul class="mt-2 grid gap-1.5 sm:grid-cols-2">
            <li v-for="moment in persona.usesAppWhen" :key="moment" class="flex gap-2 text-sm ax-muted">
              <Icon name="check" size="sm" class="mt-0.5 shrink-0 ax-emerald-text" aria-hidden="true" />
              <span>{{ moment }}</span>
            </li>
          </ul>
        </div>

        <div class="ax-panel-emerald mt-5 px-4 py-3">
          <p class="ax-emerald-heading text-xs">Main goal</p>
          <p class="mt-1 text-sm ax-body">{{ persona.mainGoal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
