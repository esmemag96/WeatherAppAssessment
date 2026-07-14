import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useReducedMotion(): Ref<boolean> {
  const prefersReducedMotion = ref(false)
  let query: MediaQueryList | null = null

  function onChange(event: MediaQueryListEvent): void {
    prefersReducedMotion.value = event.matches
  }

  onMounted(() => {
    query = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = query.matches
    query.addEventListener('change', onChange)
  })

  onUnmounted(() => {
    query?.removeEventListener('change', onChange)
  })

  return prefersReducedMotion
}
