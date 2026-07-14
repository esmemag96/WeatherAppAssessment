import { describe, expect, it } from 'vitest'

import { formatFullDate, formatHourLabel, formatWeekdayLabel } from './datetime'

describe('formatFullDate', () => {
  it('formats a date-time timestamp as weekday, day and short month', () => {
    expect(formatFullDate('2026-10-14T08:00')).toBe('Wednesday, 14 Oct')
  })

  it('formats a date-only string without shifting to the previous day', () => {
    // A naive `new Date('2026-10-14')` parses as UTC midnight, which would
    // render as "Oct 13" in any timezone behind UTC - this must not happen.
    expect(formatFullDate('2026-10-14')).toBe('Wednesday, 14 Oct')
  })
})

describe('formatHourLabel', () => {
  it('formats a timestamp as a 12-hour hour label', () => {
    expect(formatHourLabel('2026-10-14T14:00')).toBe('2 PM')
    expect(formatHourLabel('2026-10-14T00:00')).toBe('12 AM')
  })
})

describe('formatWeekdayLabel', () => {
  it('formats a date-only string as a short weekday label', () => {
    expect(formatWeekdayLabel('2026-10-14')).toBe('Wed')
  })

  it('does not shift a date-only string to the previous day', () => {
    expect(formatWeekdayLabel('2026-01-01')).toBe('Thu')
  })
})
