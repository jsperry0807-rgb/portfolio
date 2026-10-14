import { Mail } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '@/components/brand-icons'
import type { Social } from '@/data/portfolio'

/** Maps `Social['icon']` to a component, so the data file stays plain strings. */
export const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: Mail,
} as const satisfies Record<Social['icon'], unknown>
