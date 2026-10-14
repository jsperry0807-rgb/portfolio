import { motion } from 'framer-motion'
import { ArrowUpRight, Download, Mail } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'
import { Section } from '@/components/section'
import { socialIcons } from '@/components/social-icons'
import { Button } from '@/components/ui/button'
import { contact, site, socials } from '@/data/portfolio'
import { fadeUp, staggerChildren, viewportOnce } from '@/lib/motion'

export function ContactPage() {
  return (
    <PageTransition>
      <Section id="contact" eyebrow="Contact" title={contact.heading} description={contact.blurb}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg" className="bg-brand text-background hover:bg-brand/85">
            <a href={`mailto:${site.email}`}>
              <Mail />
              {site.email}
            </a>
          </Button>

          {site.resumeUrl ? (
            <Button asChild size="lg" variant="outline">
              <a href={site.resumeUrl} download>
                <Download />
                Resume
              </a>
            </Button>
          ) : null}
        </motion.div>

        <motion.ul
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 grid gap-3 sm:grid-cols-2"
        >
          {socials.map((social) => {
            const Icon = socialIcons[social.icon]
            // Only web links open in a new tab; `mailto:` should hand off to the
            // mail client instead of leaving a blank browser tab behind.
            const isWebLink = social.href.startsWith('http')

            return (
              <motion.li key={social.label} variants={fadeUp}>
                <a
                  href={social.href}
                  target={isWebLink ? '_blank' : undefined}
                  rel={isWebLink ? 'noreferrer' : undefined}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/40 p-4 text-sm transition-colors hover:border-brand/40"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4 text-brand" />
                    {social.label}
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </a>
              </motion.li>
            )
          })}
        </motion.ul>
      </Section>
    </PageTransition>
  )
}
