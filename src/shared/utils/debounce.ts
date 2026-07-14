/** A debounced function, with an explicit `cancel` for cleanup on unmount or on an immediate/bypassing action. */
export interface Debounced<Args extends unknown[]> {
  (...args: Args): void
  cancel(): void
}

/**
 * Generic trailing-edge debounce - delays invoking `fn` until `delayMs`
 * has elapsed since the last call. Kept dependency-free and unaware of
 * Vue/search specifics so any feature can reuse it (not just search-as-
 * you-type).
 */
export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delayMs: number): Debounced<Args> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debounced = ((...args: Args) => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = undefined
      fn(...args)
    }, delayMs)
  }) as Debounced<Args>

  debounced.cancel = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = undefined
  }

  return debounced
}
