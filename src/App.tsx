import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router'
import { site } from '@/data/portfolio'
import { SiteLayout } from '@/layouts/site-layout'
import { AboutPage } from '@/pages/about'
import { ContactPage } from '@/pages/contact'
import { ExperiencePage } from '@/pages/experience'
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'
import { ProjectsPage } from '@/pages/projects'

function App() {
  const location = useLocation()

  // Keeps the browser tab title in sync with the content file.
  useEffect(() => {
    document.title = `${site.name} — ${site.role}`
  }, [])

  return (
    <SiteLayout>
      {/*
        `mode="wait"` plays the outgoing page's exit animation to completion
        before the incoming page enters, so pages never overlap mid-transition.
        Keying Routes on the pathname is what lets AnimatePresence detect the swap.
      */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </SiteLayout>
  )
}

export default App
