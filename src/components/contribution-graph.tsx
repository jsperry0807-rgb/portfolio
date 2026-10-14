/**
 * A GitHub-style contribution heatmap: one column per week, one cell per day.
 * Intensities are drawn from the violet brand token so it matches the rest of
 * the site rather than GitHub's greens.
 *
 * Hovering a cell shows a tooltip with that day's total. GitHub's calendar
 * counts contributions (commits, pull requests, issues, and reviews) rather
 * than commits alone, so the tooltip says "contributions" to stay accurate.
 */
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import type { GithubContributionDay, GithubContributionWeek } from '@/data/github-types'
import { formatFullDate } from '@/lib/format'

/** Buckets a day's contribution count into one of five shades. */
function shadeFor(count: number): number {
  if (count <= 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

function colorFor(shade: number): string {
  if (shade === 0) return 'var(--muted)'
  const strength = [0, 24, 44, 68, 100][shade]
  return `color-mix(in oklab, var(--brand) ${strength}%, var(--muted))`
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Gap between the cell and the tooltip, in pixels. */
const TOOLTIP_GAP = 10
/** Half the tooltip's widest expected width, used to keep it on screen. */
const TOOLTIP_EDGE = 90

interface HoveredDay {
  day: GithubContributionDay
  /** Viewport coordinates of the cell's top center. */
  x: number
  y: number
}

function contributionLabel(count: number): string {
  if (count === 0) return 'No contributions'
  return `${count.toLocaleString()} ${count === 1 ? 'contribution' : 'contributions'}`
}

export function ContributionGraph({
  weeks,
  total,
}: {
  weeks: GithubContributionWeek[]
  total: number
}) {
  const [hovered, setHovered] = useState<HoveredDay | null>(null)
  const graphRef = useRef<HTMLDivElement>(null)

  // The tooltip is positioned in viewport coordinates, so it would be left
  // behind by any scroll. Dismiss it instead of chasing the cell.
  useEffect(() => {
    if (!hovered) return

    const dismiss = () => setHovered(null)
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!graphRef.current?.contains(event.target as Node)) setHovered(null)
    }

    window.addEventListener('scroll', dismiss, { passive: true })
    window.addEventListener('resize', dismiss)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      window.removeEventListener('scroll', dismiss)
      window.removeEventListener('resize', dismiss)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [hovered])

  if (weeks.length === 0) return null

  const labelFor = (week: GithubContributionWeek, index: number) => {
    const month = new Date(`${week.firstDay}T00:00:00Z`).getUTCMonth()
    const previous = index === 0 ? -1 : new Date(`${weeks[index - 1].firstDay}T00:00:00Z`).getUTCMonth()
    // Only label a column when the month changes, and skip crowding at the start.
    return month !== previous && index > 0 ? MONTHS[month] : ''
  }

  const showTooltip = (event: PointerEvent<HTMLSpanElement>, day: GithubContributionDay) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setHovered({ day, x: rect.left + rect.width / 2, y: rect.top })
  }

  // A touch pointer leaves the cell as soon as the finger lifts, which would
  // wipe the tooltip the moment it appeared. Only mouse-out dismisses it.
  const hideForPointer = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== 'touch') setHovered(null)
  }

  return (
    <div ref={graphRef}>
      <div
        role="img"
        aria-label={`Contribution graph: ${total} contributions over the last year`}
        onScroll={() => setHovered(null)}
        className="overflow-x-auto pb-1"
      >
        <div className="min-w-max">
          {/* Month labels line up with the columns below. */}
          <div className="flex gap-[3px] pl-9">
            {weeks.map((week, index) => (
              <div
                key={week.firstDay}
                className="w-3 overflow-visible font-mono text-[0.6rem] whitespace-nowrap text-muted-foreground/60"
              >
                {labelFor(week, index)}
              </div>
            ))}
          </div>

          <div className="mt-1.5 flex gap-[3px]">
            <div className="flex w-9 shrink-0 flex-col gap-[3px] pr-2 font-mono text-[0.6rem] text-muted-foreground/60">
              <span className="h-3" />
              <span className="flex h-3 items-center">Mon</span>
              <span className="h-3" />
              <span className="flex h-3 items-center">Wed</span>
              <span className="h-3" />
              <span className="flex h-3 items-center">Fri</span>
              <span className="h-3" />
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
              {weeks.flatMap((week) =>
                week.days.map((day) => (
                  <span
                    key={day.date}
                    aria-hidden="true"
                    onPointerEnter={(event) => showTooltip(event, day)}
                    // Touch pointers never fire pointerenter, so a tap needs its
                    // own handler to reveal the same tooltip.
                    onPointerDown={(event) => showTooltip(event, day)}
                    onPointerLeave={hideForPointer}
                    onPointerCancel={hideForPointer}
                    className="size-3 cursor-default rounded-[3px] ring-foreground/40 ring-inset transition-shadow hover:ring-1"
                    style={{ backgroundColor: colorFor(shadeFor(day.count)) }}
                  />
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted-foreground">
          {total.toLocaleString()} contributions in the last year
        </p>
        <div className="flex items-center gap-1.5 font-mono text-[0.6rem] text-muted-foreground/60">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((shade) => (
            <span
              key={shade}
              aria-hidden="true"
              className="size-3 rounded-[3px]"
              style={{ backgroundColor: colorFor(shade) }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {hovered
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-full rounded-lg border border-border/60 bg-popover px-2.5 py-1.5 whitespace-nowrap shadow-lg shadow-black/30"
              style={{
                left: Math.min(Math.max(hovered.x, TOOLTIP_EDGE), window.innerWidth - TOOLTIP_EDGE),
                top: hovered.y - TOOLTIP_GAP,
              }}
            >
              <p className="text-xs font-medium text-popover-foreground">
                {contributionLabel(hovered.day.count)}
              </p>
              <p className="mt-0.5 font-mono text-[0.6rem] text-muted-foreground">
                {formatFullDate(hovered.day.date)}
              </p>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
