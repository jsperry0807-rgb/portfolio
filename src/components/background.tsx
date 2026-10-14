/**
 * Decorative page background: a technical grid, two slowly drifting violet
 * glows, and a film-grain overlay. Purely cosmetic, so it is aria-hidden and
 * ignores pointer events.
 */
export function Background() {
  const gridMask = 'radial-gradient(ellipse 75% 55% at 50% 0%, black, transparent)'

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="bg-grid absolute inset-0"
        style={{ maskImage: gridMask, WebkitMaskImage: gridMask }}
      />

      <div className="animate-drift absolute -top-56 left-1/2 h-152 w-256 -translate-x-1/2 rounded-full bg-brand/12 blur-[150px]" />
      <div className="animate-drift absolute top-1/4 -right-48 h-104 w-104 rounded-full bg-brand-2/10 blur-[140px] [animation-delay:-7s]" />

      <div className="bg-noise absolute inset-0 opacity-[0.04]" />
    </div>
  )
}
