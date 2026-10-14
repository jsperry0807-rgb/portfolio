import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { Button } from '@/components/ui/button'
import { nav, site } from '@/data/portfolio'
import { cn } from '@/lib/utils'

function desktopLinkClasses({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-lg px-3 py-1.5 text-sm transition-colors',
    isActive ? 'bg-muted/60 text-foreground' : 'text-muted-foreground hover:text-foreground',
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6"
      >
        <Link to="/" className="font-mono text-sm font-medium tracking-tight">
          {site.name}
          <span className="text-brand">.</span>
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
          {nav.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} end={item.path === '/'} className={desktopLinkClasses}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link to="/contact">Get in touch</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t border-border/60 bg-background md:hidden"
          >
            <ul className="mx-auto w-full max-w-5xl px-6 py-2">
              {nav.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-lg py-2 text-sm transition-colors',
                        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="py-2">
                <Button asChild size="sm" className="w-full">
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    Get in touch
                  </Link>
                </Button>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
