import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'

/**
 * Wraps a page so it fades/slides in on navigation and out before the next page
 * appears. Pair this with `<AnimatePresence mode="wait">` in App.tsx — "wait"
 * makes the exit finish before the enter starts, which avoids pages
 * cross-fading into each other.
 *
 * Motion is skipped for users who have "reduce motion" enabled.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()

  const variants: Variants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.28, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -8,
      transition: { duration: shouldReduceMotion ? 0 : 0.18, ease: 'easeIn' },
    },
  }

  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}
