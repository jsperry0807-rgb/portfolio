import type { Variants } from 'framer-motion'

/** Shared ease so every reveal in the site moves with the same personality. */
const easeOut = [0.16, 1, 0.3, 1] as const

/** Fades, lifts, and un-blurs an element into view. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: easeOut },
  },
}

/** Fades in without moving. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: easeOut } },
}

/** Slides in from the left — used by the timeline and list rows. */
export const slideIn: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
}

/** Wrap children in this to reveal them one after another. */
export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

/** Slower stagger for large blocks like grids. */
export const staggerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

/** Reveals text one line/word at a time from behind a mask. */
export const maskUp: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: easeOut } },
}

/** Shared viewport config so sections animate once, slightly before fully in view. */
export const viewportOnce = { once: true, amount: 0.15 } as const
