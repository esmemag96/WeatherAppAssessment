type ClassValue = string | number | null | undefined | false | ClassValue[]

function flatten(values: ClassValue[], out: string[]): void {
  for (const value of values) {
    if (!value) continue
    if (Array.isArray(value)) {
      flatten(value, out)
    } else {
      out.push(String(value))
    }
  }
}

/**
 * Minimal `classnames`-style helper for conditionally joining Tailwind
 * class strings without pulling in an extra dependency.
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = []
  flatten(values, out)
  return out.join(' ')
}
