<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import type { ArchitectureDiagramData } from '@/content/artifacts/types'
import { Icon } from '@/shared/ui'

const props = defineProps<{
  diagram: ArchitectureDiagramData
  caption: string
}>()

const lightboxOpen = ref(false)

const isSvg = computed(() => props.diagram.src.toLowerCase().endsWith('.svg'))

const srcSet = computed(() => {
  if (isSvg.value || !props.diagram.src2x) return undefined
  return `${props.diagram.src} 1x, ${props.diagram.src2x} 2x`
})

const lightboxSrc = computed(() => props.diagram.src2x ?? props.diagram.src)

function openLightbox() {
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeLightbox()
}

function setScrollLock(locked: boolean) {
  document.documentElement.classList.toggle('er-scroll-locked', locked)
}

watch(lightboxOpen, (open) => {
  setScrollLock(open)
  if (open) {
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  setScrollLock(false)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <figure class="ax-card overflow-hidden er-fade-in">
    <div class="ax-border border-b px-5 py-4">
      <p class="text-sm leading-relaxed ax-body">{{ diagram.explanation }}</p>
      <ul class="mt-3 grid gap-2 sm:grid-cols-2">
        <li
          v-for="highlight in diagram.highlights"
          :key="highlight"
          class="flex gap-2 text-xs ax-muted"
        >
          <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" aria-hidden="true" />
          <span>{{ highlight }}</span>
        </li>
      </ul>
    </div>

    <div class="bg-zinc-950 p-3 sm:p-4">
      <div class="er-diagram-frame mx-auto w-full">
        <img
          :src="diagram.src"
          :srcset="srcSet"
          :width="diagram.width"
          :height="diagram.height"
          :alt="diagram.alt"
          class="er-diagram-image mx-auto rounded-lg"
          loading="lazy"
          decoding="async"
        />
        <button
          type="button"
          class="ax-focus er-diagram-expand"
          @click="openLightbox"
        >
          <Icon name="zoom_in" size="sm" aria-hidden="true" />
          View full size
        </button>
      </div>
    </div>

    <figcaption class="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-xs ax-faint">
      <span>{{ caption }}</span>
      <a :href="lightboxSrc" target="_blank" rel="noopener noreferrer" class="ax-link">
        Open {{ isSvg ? 'SVG' : 'image' }} in new tab
      </a>
    </figcaption>
  </figure>

  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      leave-active-class="transition-opacity duration-150 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="lightboxOpen"
        class="er-diagram-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="diagram.alt"
        @click.self="closeLightbox"
      >
        <button
          type="button"
          class="er-diagram-lightbox-close ax-focus"
          aria-label="Close full-size diagram"
          @click="closeLightbox"
        >
          <Icon name="close" size="md" />
        </button>

        <div class="er-diagram-lightbox-scroll">
          <img
            :src="lightboxSrc"
            :alt="diagram.alt"
            class="er-diagram-lightbox-image"
            decoding="async"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
