/** Formatting helpers for the timestamps that come back from GitHub. */

/** "3 days ago" style formatting. Returns '' for missing or invalid input. */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  if (!iso) return ''

  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''

  const seconds = Math.round((now - then) / 1000)
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ]

  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return formatter.format(-Math.round(seconds / secondsInUnit), unit)
    }
  }

  return 'just now'
}

/** "Oct 2026" style formatting. Returns '' for missing or invalid input. */
export function formatMonthYear(iso: string): string {
  if (!iso) return ''

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/** "12 Oct 2026" style formatting. Returns '' for missing or invalid input. */
export function formatDate(iso: string): string {
  if (!iso) return ''

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** "Wed, 12 Oct 2026" style formatting. Returns '' for missing or invalid input. */
export function formatFullDate(iso: string): string {
  if (!iso) return ''

  // Dates from the contribution calendar are plain `YYYY-MM-DD`, so parse them
  // as UTC to avoid the day shifting in western timezones.
  const date = new Date(`${iso.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
