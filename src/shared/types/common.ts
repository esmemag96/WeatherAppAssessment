/**
 * Generic helper types shared across the app. Domain-specific types
 * (weather, location, etc.) belong in `src/entities/**`, not here.
 */
export type Nullable<T> = T | null

export type Optional<T> = T | undefined

/** Discriminated union for representing the lifecycle of an async operation. */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<TData, TError = string> {
  status: AsyncStatus
  data: Nullable<TData>
  error: Nullable<TError>
}
