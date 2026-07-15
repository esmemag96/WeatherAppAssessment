<!--
  Toast
  -----
  Purpose:
    Transient notification that slides in from the bottom (per the
    Esmeralda Weather App motion spec) and optionally auto-dismisses. A single reusable
    primitive - queuing/stacking multiple toasts is left to whatever
    feature-level composable/store manages notifications later.

  Props:
    - show (boolean, required): controlled visibility.
    - message (string, required).
    - variant ('info' | 'success' | 'warning' | 'error', default 'info').
    - autoDismissMs (number, optional): if set, emits `dismiss` after this
      delay (visual affordance only - the parent still owns `show`).

  Events:
    - dismiss: requested close (auto-timer elapsed, or close button pressed).

  Usage:
    <Toast :show="toast.visible" message="Added to favorites" variant="success" :auto-dismiss-ms="3000" @dismiss="toast.visible = false" />
-->
<script setup lang="ts">
import { watch } from 'vue'

import Icon from '@/shared/ui/Icon.vue'
import { cn } from '@/shared/utils'

interface Props {
  show: boolean
  message: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  autoDismissMs?: number
}

const { show, variant = 'info', autoDismissMs } = defineProps<Props>()

const emit = defineEmits<{ dismiss: [] }>()

const variantIcon: Record<NonNullable<Props['variant']>, string> = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
}

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  info: 'text-primary',
  success: 'text-secondary',
  warning: 'text-tertiary',
  error: 'text-error',
}

let timer: ReturnType<typeof setTimeout> | undefined

watch(
  () => show,
  (isShown) => {
    clearTimeout(timer)
    if (isShown && autoDismissMs) {
      timer = setTimeout(() => emit('dismiss'), autoDismissMs)
    }
  },
  { immediate: true },
)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-500 ease-swift"
      leave-active-class="transition-all duration-300 ease-swift"
      enter-from-class="translate-y-4 opacity-0"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="show"
        role="status"
        class="fixed inset-x-4 bottom-24 z-[80] mx-auto flex max-w-app items-center gap-3 rounded-xl border border-border-subtle bg-glass-fill/90 px-4 py-3 shadow-modal backdrop-blur-xl dark:bg-surface-container-high/95 dark:backdrop-blur-md"
      >
        <Icon :name="variantIcon[variant]" :class="variantClasses[variant]" />
        <p class="flex-1 font-body-md text-body-md text-on-surface">{{ message }}</p>
        <button
          type="button"
          aria-label="Dismiss"
          :class="cn('text-on-surface-variant hover:text-on-surface')"
          @click="$emit('dismiss')"
        >
          <Icon name="close" size="sm" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
