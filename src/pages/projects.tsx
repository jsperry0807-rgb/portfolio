import { motion } from 'framer-motion'
import { PageTransition } from '@/components/page-transition'
import { ProjectCard } from '@/components/project-card'
import { Section } from '@/components/section'
import { projects } from '@/data/portfolio'
import { fadeUp, staggerChildren, viewportOnce } from '@/lib/motion'

export function ProjectsPage() {
  return (
    <PageTransition>
      <Section
        id="projects"
        eyebrow="Projects"
        title="Things I've built"
        description="A selection of projects I'm proud of. Replace the placeholders in src/data/portfolio.ts with your own work."
      >
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-4 sm:grid-cols-2"
        >
          {projects.map((project) => (
            <motion.div key={project.title} variants={fadeUp} className="h-full">
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </PageTransition>
  )
}
