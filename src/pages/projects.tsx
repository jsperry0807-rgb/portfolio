import { motion } from 'framer-motion'
import { PageTransition } from '@/components/page-transition'
import { ProjectCard } from '@/components/project-card'
import { Section } from '@/components/section'
import { projects } from '@/data/projects'
import { fadeUp, staggerChildren, viewportOnce } from '@/lib/motion'

export function ProjectsPage() {
  return (
    <PageTransition>
      <Section
        id="projects"
        eyebrow="Projects"
        title="Things I've built"
        description="Pulled from my GitHub account at build time. The stack on each card is detected from that repo's manifests — package.json, requirements.txt, or Cargo.toml."
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
