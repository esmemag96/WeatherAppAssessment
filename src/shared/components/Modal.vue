<!--
  Modal
  -----
  Purpose:
    Generic overlay dialog (Level 2 elevation per the design spec: higher
    opacity surface + pronounced drop shadow to separate it from the
    dashboard). Used for confirmations, pickers, or any focused task that
    should interrupt the current screen.

  Props:
    - open (boolean, required): controlled visibility.
    - title (string, optional).
    - dismissible (boolean, default true): clicking the backdrop or the
      close button emits `close`.

  Slots:
    - default: modal body.
    - footer: optional action row.

  Events:
    - close: requested close (backdrop click, close button, Escape key).

  Usage:
    <Modal :open="isOpen" title="Remove favorite?" @close="isOpen = false">
      <p>This will remove London from your favorites.</p>
      <template #footer>
        <Button variant="ghost" @click="isOpen = false">Cancel</Button>
        <Button variant="danger" @click="confirm">Remove</Button>
      </template>
    </Modal>
-->
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

import IconButton from '@/shared/ui/IconButton.vue'
import Icon from '@/shared/ui/Icon.vue'

interface Props {
  open: boolean
  title?: string
  dismissible?: boolean
}

const { open, dismissible = true } = defineProps<Props>()

const emit = defineEmits<{ close: [] }>()

function handleBackdropClick(): void {
  if (dismissible) emit('close')
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open && dismissible) emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-swift"
      leave-active-class="transition-opacity duration-200 ease-swift"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[90] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-scrim backdrop-blur-sm" @click="handleBackdropClick" />

        <Transition
          appear
          enter-active-class="transition-all duration-300 ease-swift"
          enter-from-class="scale-95 opacity-0"
        >
          <div
            role="dialog"
            aria-modal="true"
            :aria-label="title"
            class="relative z-10 w-full max-w-app rounded-2xl border border-border-subtle bg-glass-fill/90 p-container-padding shadow-modal backdrop-blur-xl dark:bg-surface-container-high/95"
          >
            <div v-if="title || dismissible" class="mb-4 flex items-center justify-between gap-4">
              <h2 v-if="title" class="font-headline-md text-headline-md text-on-surface">{{ title }}</h2>
              <IconButton v-if="dismissible" label="Close" @click="emit('close')">
                <Icon name="close" />
              </IconButton>
            </div>

            <div class="text-body-lg text-on-surface-variant">
              <slot />
            </div>

            <div v-if="$slots.footer" class="mt-6 flex justify-end gap-3">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
