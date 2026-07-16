<script setup lang="ts">
import { useRouter } from 'vue-router'

import { Icon } from '@/shared/ui'

const props = defineProps<{
  title: string
  badge: string
  description: string
  appLink: string
  githubLink: string
}>()

const router = useRouter()

function launchApplication() {
  void router.push(props.appLink)
}
</script>

<template>
  <section id="summary" class="er-section !pt-0">
    <div class="glass-card er-hero-card er-fade-in">
      <div class="relative z-10 max-w-3xl">
        <span class="er-badge">{{ badge }}</span>
        <h1 class="mt-3 font-display-metrics text-display-metrics-sm leading-none ax-heading sm:mt-4 sm:text-display-metrics">
          {{ title }}
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed ax-body sm:mt-4 sm:font-body-lg sm:text-body-lg">
          {{ description }}
        </p>

        <div class="er-hero-actions mt-5 sm:mt-8">
          <button type="button" class="ax-btn-primary ax-focus er-hero-cta" @click="launchApplication">
            <Icon name="rocket_launch" size="sm" aria-hidden="true" />
            Launch Application
          </button>
          <a
            :href="githubLink"
            class="ax-btn-secondary ax-focus er-hero-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="code" size="sm" aria-hidden="true" />
            GitHub Repository
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
