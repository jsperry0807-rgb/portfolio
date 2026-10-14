import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Hero } from '@/components/hero'
import { PageTransition } from '@/components/page-transition'
import { ProjectCard } from '@/components/project-card'
import { Section } from '@/components/section'
import { Button } from '@/components/ui/button'
import { contact, projects } from '@/data/portfolio'
import { fadeUp, staggerChildren, viewportOnce } from '@/lib/motion'

// Prefer projects flagged as featured, but fall back to the first couple so the
// section is never empty if you remove every `featured: true`.
const featured = projects.filter((project) => project.featured)
const highlights = featured.length > 0 ? featured : projects.slice(0, 2)

export function HomePage() {
  return (
    <PageTransition>
      <Hero />

      <Section
        id="work"
        eyebrow="Projects"
        title="Selected work"
        description="A couple of things I've built recently. There's more on the projects page."
        divider
      >
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-4 sm:grid-cols-2"
        >
          {highlights.map((project) => (
            <motion.div key={project.title} variants={fadeUp} className="h-full">
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/projects">
              View all projects
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>

      <Section eyebrow="Contact" title={contact.heading} description={contact.blurb} divider>
        <Button asChild size="lg" className="bg-brand text-background hover:bg-brand/85">
          <Link to="/contact">
            Get in touch
            <ArrowRight />
          </Link>
        </Button>
      </Section>
    </PageTransition>
  )
}
