import { motion } from 'framer-motion'
import { ContributionGraph } from '@/components/contribution-graph'
import { LanguageBar } from '@/components/language-bar'
import { PageTransition } from '@/components/page-transition'
import { Section } from '@/components/section'
import { Badge } from '@/components/ui/badge'
import { contributionBreakdown, contributionSummary } from '@/data/contributions'
import { about } from '@/data/portfolio'
import { githubStats, languageBreakdown, skillGroups } from '@/data/skills'
import { formatRelativeTime } from '@/lib/format'
import { fadeUp, staggerChildren, viewportOnce } from '@/lib/motion'

const stats = [
  { label: 'Public repos', value: String(githubStats.repositories) },
  { label: 'Languages', value: String(githubStats.languages) },
  ...(githubStats.stars > 0 ? [{ label: 'Stars', value: String(githubStats.stars) }] : []),
  { label: 'On GitHub since', value: githubStats.since },
  { label: 'Last pushed', value: formatRelativeTime(githubStats.lastPush) },
].filter((stat) => stat.value)

/** Headline commit numbers, all straight from the contribution calendar. */
const activity = contributionSummary
  ? [
      {
        label: 'Contributions',
        value: contributionSummary.contributions.toLocaleString(),
        hint: 'last 12 months',
      },
      {
        label: 'Commits',
        value: contributionSummary.commits.toLocaleString(),
        hint: `~${Math.round(contributionSummary.commitsPerWeek)} per week`,
      },
      {
        label: 'Active days',
        value: String(contributionSummary.activeDays),
        hint: `${Math.round(contributionSummary.activePercent)}% of days`,
      },
      {
        label: 'Longest streak',
        value: `${contributionSummary.longestStreak} ${contributionSummary.longestStreak === 1 ? 'day' : 'days'}`,
        hint: 'in a row',
      },
    ]
  : []

/** The longest bar is drawn full width so the proportions stay readable. */
const maxCommits = contributionBreakdown
  ? Math.max(...contributionBreakdown.repos.map((repo) => repo.commits), 1)
  : 1

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
        id="numbers"
        eyebrow="By the numbers"
        title="What my repos say"
        description="Counted from the GitHub API at build time — nothing here was typed in by hand."
        divider
      >
        <motion.dl
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <dd className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
                {stat.value}
              </dd>
              <dt className="mt-1 font-mono text-xs tracking-wider text-muted-foreground/70 uppercase">
                {stat.label}
              </dt>
            </motion.div>
          ))}
        </motion.dl>

        {languageBreakdown.length > 0 ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-12 rounded-xl border border-border/60 bg-card/40 p-6"
          >
            <h3 className="mb-5 font-mono text-xs tracking-wider text-brand uppercase">
              Language mix
            </h3>
            <LanguageBar slices={languageBreakdown} />
          </motion.div>
        ) : null}
      </Section>

      {contributionSummary ? (
        <Section
          id="activity"
          eyebrow="Activity"
          title="How much I actually work"
          description="From GitHub's public contribution calendar — the same numbers behind the graph on my profile. No streaks I typed in by hand."
          divider
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="rounded-xl border border-border/60 bg-card/40 p-6"
          >
            <ContributionGraph
              weeks={contributionSummary.weeks}
              total={contributionSummary.contributions}
            />
          </motion.div>

          <motion.dl
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
          >
            {activity.map((item) => (
              <motion.div key={item.label} variants={fadeUp}>
                <dd className="font-heading text-2xl font-medium tracking-tight md:text-3xl">
                  {item.value}
                </dd>
                <dt className="mt-1 font-mono text-xs tracking-wider text-muted-foreground/70 uppercase">
                  {item.label}
                </dt>
                <p className="mt-0.5 text-xs text-muted-foreground/70">{item.hint}</p>
              </motion.div>
            ))}
          </motion.dl>

          {contributionBreakdown && contributionBreakdown.repos.length > 0 ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="mt-12 rounded-xl border border-border/60 bg-card/40 p-6"
            >
              <h3 className="font-mono text-xs tracking-wider text-brand uppercase">
                Where my commits went
              </h3>

              <ul className="mt-5 space-y-4">
                {contributionBreakdown.repos.map((repo) => (
                  <li key={repo.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm">
                        {repo.name}
                        {repo.relation !== 'own' ? (
                          <span className="ml-2 font-mono text-[0.6rem] tracking-wide text-muted-foreground/60 uppercase">
                            {repo.relation === 'org' ? 'org' : 'shared'}
                          </span>
                        ) : null}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{repo.commits}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${Math.max(3, (repo.commits / maxCommits) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}

                {contributionBreakdown.otherRepos > 0 ? (
                  <li>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm text-muted-foreground">
                        Other
                        <span className="ml-2 font-mono text-[0.6rem] text-muted-foreground/60">
                          {contributionBreakdown.otherRepos}{' '}
                          {contributionBreakdown.otherRepos === 1 ? 'repo' : 'repos'}
                        </span>
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {contributionBreakdown.otherCommits}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-muted-foreground/30"
                        style={{
                          width: `${Math.max(3, (contributionBreakdown.otherCommits / maxCommits) * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ) : null}
              </ul>

              <p className="mt-6 font-mono text-xs text-muted-foreground/70">
                {contributionSummary.repositories} repositories
                {contributionSummary.pullRequests > 0
                  ? ` · ${contributionSummary.pullRequests} pull requests`
                  : ''}
                {contributionSummary.issues > 0 ? ` · ${contributionSummary.issues} issues` : ''}
                {contributionSummary.privateContributions > 0
                  ? ` · plus ${contributionSummary.privateContributions} private`
                  : ''}
              </p>
            </motion.div>
          ) : null}
        </Section>
      ) : null}

      <Section
        id="skills"
        eyebrow="Skills"
        title="What I work with"
        description="Languages measured by bytes written, and libraries and tools detected in package.json, requirements.txt, and Cargo.toml across my repos."
        divider
      >
        <div className="space-y-8">
          {skillGroups.map((group) => (
            <motion.div
              key={group.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid gap-3 sm:grid-cols-[11rem_1fr] sm:gap-8"
            >
              <h3 className="font-mono text-xs tracking-wider text-brand uppercase sm:pt-1.5">
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    <Badge variant="outline" className="gap-1.5 font-normal">
                      {skill.name}
                      {skill.count > 0 ? (
                        <span className="font-mono text-[0.65rem] text-muted-foreground">
                          ×{skill.count}
                        </span>
                      ) : null}
                    </Badge>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 font-mono text-xs text-muted-foreground/70">
          Detected from {githubStats.repositories} repos · synced{' '}
          {formatRelativeTime(githubStats.fetchedAt)}
        </p>
      </Section>
    </PageTransition>
  )
}
