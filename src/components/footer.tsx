import { SocialLinks } from '@/components/social-links'
import { site } from '@/data/portfolio'

// Computed once at module load so it isn't an impure call during render.
const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {currentYear} {site.name}
        </p>
        <SocialLinks />
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="transition-colors hover:text-foreground"
        >
          Back to top
        </button>
      </div>
    </footer>
  )
}
