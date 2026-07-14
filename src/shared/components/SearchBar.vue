<!--
  SearchBar
  ---------
  Purpose:
    Search page/section composition: the glass `SearchInput` primitive
    plus the "Use Current Location" quick action shown beneath it. Still
    fully controlled/presentational - no geolocation or repository calls
    happen here, they belong to the Search feature that consumes this.

  Props:
    - modelValue (string, required).
    - placeholder (string, optional): forwarded to SearchInput.
    - loading (boolean, default false): forwarded to SearchInput.
    - showCurrentLocation (boolean, default true): toggles the quick
      action button.

  Events:
    - update:modelValue (string)
    - submit (string)
    - clear
    - use-current-location: emitted when the quick action is pressed.

  Usage:
    <SearchBar v-model="query" :loading="isLoading" @use-current-location="locate" />
-->
<script setup lang="ts">
import SearchInput from '@/shared/ui/SearchInput.vue'
import Button from '@/shared/ui/Button.vue'
import Icon from '@/shared/ui/Icon.vue'

interface Props {
  modelValue: string
  placeholder?: string
  loading?: boolean
  showCurrentLocation?: boolean
}

const { showCurrentLocation = true } = defineProps<Props>()

defineEmits<{
  'update:modelValue': [string]
  submit: [string]
  clear: []
  'use-current-location': []
}>()
</script>

<template>
  <div class="space-y-4">
    <SearchInput
      :model-value="modelValue"
      :placeholder="placeholder"
      :loading="loading"
      @update:model-value="$emit('update:modelValue', $event)"
      @submit="$emit('submit', $event)"
      @clear="$emit('clear')"
    />
    <Button
      v-if="showCurrentLocation"
      variant="ghost"
      block
      @click="$emit('use-current-location')"
    >
      <template #icon-left><Icon name="my_location" /></template>
      Use Current Location
    </Button>
  </div>
</template>
