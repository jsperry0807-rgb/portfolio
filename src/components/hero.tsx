import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import { Link } from 'react-router'
import { SocialLinks } from '@/components/social-links'
import { Button } from '@/components/ui/button'
import { site } from '@/data/portfolio'
import { fadeUp, staggerChildren } from '@/lib/motion'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-20">
      {/* Soft accent glow behind the heading. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/2 h-104 w-184 -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-6">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {site.availability ? (
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              {site.availability}
            </motion.div>
          ) : null}

          <motion.h1
            variants={fadeUp}
            className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
          >
            {site.name}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 font-mono text-sm text-brand md:text-base">
            {site.role}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground"
          >
            {site.tagline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-brand text-background hover:bg-brand/85">
              <Link to="/projects">
                View projects
                <ArrowRight />
              </Link>
            </Button>
            {site.resumeUrl ? (
              <Button asChild size="lg" variant="outline">
                <a href={site.resumeUrl} download>
                  <Download />
                  Resume
                </a>
              </Button>
            ) : null}
            <SocialLinks className="sm:ml-1" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
