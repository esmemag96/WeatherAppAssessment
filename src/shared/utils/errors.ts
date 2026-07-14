/**
 * Extracts a user-displayable message from an unknown thrown value,
 * falling back to a generic message. Used by stores to turn typed
 * infrastructure errors (or anything else that gets thrown) into a
 * simple string for `error` state, without the UI needing to know
 * about specific error classes.
 */
export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
