<!--
  SearchInput
  -----------
  Purpose:
    Glassmorphic pill text input with a leading search icon and a focus
    ring, matching the Search page's "Search for a city..." field and the
    desktop header search box. Presentational/controlled: it only emits
    events, it never calls a repository or store directly.

  Props:
    - modelValue (string, required): supports v-model.
    - placeholder (string, default 'Search for a city...').
    - loading (boolean, default false): swaps the leading icon for a spinner.
    - clearable (boolean, default true): shows a trailing clear (x) button
      whenever there is text.
    - disabled (boolean, default false).
    - autofocus (boolean, default false).

  Events:
    - update:modelValue (string).
    - submit (string): emitted on Enter.
    - clear: emitted when the clear button is pressed.
    - focus / blur: native focus events passthrough.

  Usage:
    <SearchInput v-model="query" @submit="search" @clear="clearSuggestions" />
-->
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import { cn } from '@/shared/utils'
import Icon from './Icon.vue'

interface Props {
  modelValue: string
  placeholder?: string
  loading?: boolean
  clearable?: boolean
  disabled?: boolean
  autofocus?: boolean
}

const {
  modelValue,
  placeholder = 'Search for a city...',
  loading = false,
  clearable = true,
  disabled = false,
  autofocus = false,
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [string]
  submit: [string]
  clear: []
  focus: [FocusEvent]
  blur: [FocusEvent]
}>()

const inputRef = useTemplateRef<HTMLInputElement>('input')

const showClear = computed(() => clearable && modelValue.length > 0 && !loading)

function handleInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function handleClear(): void {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}
</script>

<template>
  <div class="relative">
    <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center">
      <span
        v-if="loading"
        class="h-4 w-4 animate-spin rounded-full border-2 border-on-surface-variant border-t-transparent"
        aria-hidden="true"
      />
      <Icon v-else name="search" class="text-outline-variant" />
    </span>

    <input
      ref="input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :autofocus="autofocus"
      :class="
        cn(
          'h-14 w-full rounded-xl border border-border-subtle bg-glass-fill/70 pl-12 text-body-lg text-on-surface',
          'backdrop-blur-md transition-all duration-300 ease-swift placeholder-on-surface-variant/50 outline-none',
          'focus:border-secondary-fixed focus:ring-2 focus:ring-secondary-fixed/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          showClear ? 'pr-11' : 'pr-4',
        )
      "
      @input="handleInput"
      @keydown.enter="emit('submit', modelValue)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />

    <button
      v-if="showClear"
      type="button"
      aria-label="Clear search"
      class="absolute inset-y-0 right-3 flex items-center text-on-surface-variant hover:text-on-surface"
      @click="handleClear"
    >
      <Icon name="close" size="sm" />
    </button>
  </div>
</template>
