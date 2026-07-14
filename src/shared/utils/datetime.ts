/**
 * ISO-8601 -> display-label date/time formatting shared by any feature
 * rendering forecast timestamps. Kept generic (no domain knowledge, no
 * "is this today" business logic - that stays a page/feature concern)
 * so it can format any timestamp, not just weather ones.
 */

/**
 * Parses an ISO date/time string as a *local* date. `new Date(...)`
 * treats a bare date ("2026-07-09") as UTC midnight but a date-time
 * without an offset ("2026-07-09T14:00") as local time - that
 * inconsistency silently shifts date-only values by a day near UTC
 * boundaries, so date-only strings are parsed manually instead.
 */
function parseIsoAsLocal(iso: string): Date {
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch
    return new Date(Number(year), Number(month) - 1, Number(day))
  }
  return new Date(iso)
}

/**
 * Formats an ISO timestamp/date as e.g. "Monday, 14 Oct". Built from
 * separate `Intl.DateTimeFormat` calls (rather than one call with
 * `weekday`/`day`/`month` options together) because the day/month
 * order in the combined output is locale-dependent - this pins the
 * "day before month" order the design specifies regardless of locale.
 */
export function formatFullDate(iso: string): string {
  const date = parseIsoAsLocal(iso)
  const weekday = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(date)
  const month = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(date)
  return `${weekday}, ${date.getDate()} ${month}`
}

/** Formats an ISO timestamp as an hour label, e.g. "2 PM". */
export function formatHourLabel(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).format(parseIsoAsLocal(iso))
}

/** Formats an ISO timestamp/date as a short weekday label, e.g. "Tue". */
export function formatWeekdayLabel(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(parseIsoAsLocal(iso))
}
