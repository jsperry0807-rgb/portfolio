import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Resets the scroll position on navigation. Without this, visiting a new page
 * keeps the previous page's scroll offset, which breaks the page transition.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // 'instant' overrides the global `scroll-behavior: smooth` so the jump
    // doesn't animate while the new page is fading in.
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
