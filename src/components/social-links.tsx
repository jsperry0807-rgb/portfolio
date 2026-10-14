import { Button } from '@/components/ui/button'
import { socialIcons } from '@/components/social-icons'
import { socials } from '@/data/portfolio'
import { cn } from '@/lib/utils'

/** Icon links for every entry in `socials`. Edit the links in src/data/portfolio.ts. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {socials.map((social) => {
        const Icon = socialIcons[social.icon]
        // Only web links open in a new tab; `mailto:` should hand off to the
        // mail client instead of leaving a blank browser tab behind.
        const isWebLink = social.href.startsWith('http')

        return (
          <Button key={social.label} asChild variant="ghost" size="icon">
            <a
              href={social.href}
              target={isWebLink ? '_blank' : undefined}
              rel={isWebLink ? 'noreferrer' : undefined}
              aria-label={social.label}
              title={social.label}
            >
              <Icon />
            </a>
          </Button>
        )
      })}
    </div>
  )
}
