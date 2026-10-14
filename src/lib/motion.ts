import type { Variants } from 'framer-motion'

/** Fades and lifts an element into view. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

/** Fades in without moving. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

/** Wrap a list of `fadeUp` children to reveal them one after another. */
export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

/** Shared viewport config so sections animate once, slightly before fully in view. */
export const viewportOnce = { once: true, amount: 0.2 } as const
