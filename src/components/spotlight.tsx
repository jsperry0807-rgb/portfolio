import { useRef, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Wraps content in a soft violet highlight that tracks the cursor, so cards
 * feel lit rather than just bordered. Inherits its corner radius from the
 * child. Pointer position is written to CSS variables instead of state to
 * avoid re-rendering on every mouse move.
 */
export function Spotlight({
  children,
  className,
  radius = '260px',
}: {
  children: ReactNode
  className?: string
  radius?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const element = containerRef.current
    if (!element) return

    const bounds = element.getBoundingClientRect()
    element.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`)
    element.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={cn('group/spotlight relative', className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        style={{
          background: `radial-gradient(${radius} circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--brand-muted), transparent 72%)`,
        }}
      />
      {children}
    </div>
  )
}
