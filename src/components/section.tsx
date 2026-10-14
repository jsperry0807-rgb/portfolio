import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SectionProps {
  id?: string
  /** Small label shown above the heading, e.g. "Projects". */
  eyebrow: string
  title: string
  description?: string
  /** Draws a divider line above the section. Use when a page stacks sections. */
  divider?: boolean
  children: ReactNode
  className?: string
}

/** Consistent page section: spacing, heading, and reveal animation. */
export function Section({
  id,
  eyebrow,
  title,
  description,
  divider = false,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('py-16 md:py-24', divider && 'border-t border-border/60', className)}
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <motion.header
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-10 md:mb-14"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-brand" aria-hidden="true" />
            <span className="font-mono text-xs tracking-[0.2em] text-brand uppercase">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">{description}</p>
          ) : null}
        </motion.header>
        {children}
      </div>
    </section>
  )
}
