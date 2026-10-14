import type { LanguageSlice } from '@/data/skills'

/**
 * Stacked bar showing the language mix across every repo, with a legend.
 * Widths come from real byte counts, so this is measured, not guessed.
 */
export function LanguageBar({ slices }: { slices: LanguageSlice[] }) {
  if (slices.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex h-2.5 w-full gap-px overflow-hidden rounded-full bg-muted">
        {slices.map((slice) => (
          <div
            key={slice.name}
            className="h-full transition-opacity hover:opacity-80"
            style={{ width: `${slice.percent}%`, backgroundColor: slice.color }}
            title={`${slice.name} — ${slice.percent.toFixed(1)}%`}
          />
        ))}
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {slices.map((slice) => (
          <li key={slice.name} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-foreground/90">{slice.name}</span>
            <span className="font-mono text-muted-foreground">{slice.percent.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
