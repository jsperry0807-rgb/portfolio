import type { ReactNode } from 'react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ScrollToTop } from '@/components/scroll-to-top'

/**
 * Persistent chrome around every page. The navbar and footer stay mounted
 * across navigation (so they don't re-animate); only the children swap.
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ScrollToTop />
      <Navbar />
      {/* pt-16 clears the fixed navbar. */}
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}
