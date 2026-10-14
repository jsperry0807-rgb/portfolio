import { motion } from 'framer-motion'
import { PageTransition } from '@/components/page-transition'
import { Section } from '@/components/section'
import { Badge } from '@/components/ui/badge'
import { about, skillGroups } from '@/data/portfolio'
import { fadeUp, staggerChildren, viewportOnce } from '@/lib/motion'

export function AboutPage() {
  return (
    <PageTransition>
      <Section id="about" eyebrow="About" title="A bit about me">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-12">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-4"
          >
            {about.paragraphs.map((paragraph, index) => (
              <motion.p key={index} variants={fadeUp} className="text-pretty text-muted-foreground">
                {paragraph}
              </motion.p>
            ))}
          </motion.div>

          <motion.dl
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid h-fit grid-cols-2 gap-x-6 gap-y-5 rounded-xl border border-border/60 bg-card/40 p-6 md:grid-cols-1"
          >
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-xs tracking-wider text-muted-foreground/70 uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-sm">{fact.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </Section>

      <Section
        id="skills"
        eyebrow="Skills"
        title="What I work with"
        description="Tools and languages I use regularly, plus a few I'm actively learning."
        divider
      >
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-4 sm:grid-cols-3"
        >
          {skillGroups.map((group) => (
            <motion.div
              key={group.title}
              variants={fadeUp}
              className="rounded-xl border border-border/60 bg-card/40 p-6"
            >
              <h3 className="font-mono text-xs tracking-wider text-brand uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <Badge variant="outline">{item}</Badge>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </Section>
    </PageTransition>
  )
}
