import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Sparkles } from 'lucide-react'
import { PageTransition } from '@/components/page-transition'
import { Section } from '@/components/section'
import { experience } from '@/data/portfolio'
import { fadeUp, staggerChildren, viewportOnce } from '@/lib/motion'

const typeIcons = {
  education: GraduationCap,
  work: Briefcase,
  activity: Sparkles,
} as const

export function ExperiencePage() {
  return (
    <PageTransition>
      <Section
        id="experience"
        eyebrow="Experience"
        title="Where I've been"
        description="School, work, and the things I do outside of class."
      >
        <motion.ol
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-8"
        >
          {experience.map((item, index) => {
            const Icon = typeIcons[item.type]
            const isLast = index === experience.length - 1

            return (
              <motion.li
                key={`${item.title}-${item.org}`}
                variants={fadeUp}
                className="grid grid-cols-[auto_1fr] gap-4"
              >
                <div className="flex flex-col items-center">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card text-brand">
                    <Icon className="size-4" />
                  </span>
                  {isLast ? null : (
                    <span aria-hidden="true" className="mt-2 w-px flex-1 bg-border/60" />
                  )}
                </div>

                <div className={isLast ? undefined : 'pb-2'}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <span className="font-mono text-xs text-muted-foreground/70">{item.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.org}</p>
                  <p className="mt-2 text-pretty text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  {item.highlights?.length ? (
                    <ul className="mt-3 space-y-1.5">
                      {item.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2 text-sm">
                          <span
                            aria-hidden="true"
                            className="mt-2 size-1 shrink-0 rounded-full bg-brand"
                          />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </motion.li>
            )
          })}
        </motion.ol>
      </Section>
    </PageTransition>
  )
}
