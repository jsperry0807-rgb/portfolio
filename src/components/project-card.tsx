import { ArrowUpRight, Star } from 'lucide-react'
import { GitHubIcon } from '@/components/brand-icons'
import { Spotlight } from '@/components/spotlight'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Project } from '@/data/portfolio'
import { formatDate, formatRelativeTime } from '@/lib/format'
import { languageColor } from '@/lib/language-colors'

/** Tags shown before collapsing the rest into a "+N" chip. */
const MAX_TAGS = 4

const linkClasses =
  'inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground'

/**
 * One project. The stack, language, stars, and update time all come from the
 * GitHub snapshot, so the card stays accurate without any upkeep.
 */
export function ProjectCard({ project }: { project: Project }) {
  const visibleTags = project.tags.slice(0, MAX_TAGS)
  const extraTags = project.tags.length - visibleTags.length

  return (
    <Spotlight className="h-full rounded-xl">
      <Card className="h-full transition-colors duration-300 hover:ring-brand/30">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            {project.repo ? (
              <CardTitle className="text-base">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="decoration-brand/40 underline-offset-4 hover:underline"
                >
                  {project.title}
                </a>
              </CardTitle>
            ) : (
              <CardTitle className="text-base">{project.title}</CardTitle>
            )}

            {project.featured ? <Badge className="text-[0.65rem]">Featured</Badge> : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
            {project.language ? (
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full"
                  style={{ backgroundColor: languageColor(project.language) }}
                />
                {project.language}
              </span>
            ) : null}

            {project.year ? <span>{project.year}</span> : null}

            {project.stars ? (
              <span className="flex items-center gap-1">
                <Star className="size-3" />
                {project.stars}
              </span>
            ) : null}

            {project.pushedAt ? (
              <span title={formatDate(project.pushedAt)}>
                updated {formatRelativeTime(project.pushedAt)}
              </span>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          {project.description ? (
            <p className="text-pretty text-sm text-muted-foreground">{project.description}</p>
          ) : null}

          {project.tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap items-center gap-1.5">
              {visibleTags.map((tag) => (
                <li key={tag}>
                  <Badge variant="outline" className="text-[0.7rem] font-normal text-muted-foreground">
                    {tag}
                  </Badge>
                </li>
              ))}
              {extraTags > 0 ? (
                <li className="px-1 font-mono text-[0.7rem] text-muted-foreground">+{extraTags}</li>
              ) : null}
            </ul>
          ) : null}
        </CardContent>

        <CardFooter className="gap-4">
          {project.repo ? (
            <a className={linkClasses} href={project.repo} target="_blank" rel="noreferrer">
              <GitHubIcon className="size-3.5" />
              Code
            </a>
          ) : null}

          {project.live ? (
            <a className={linkClasses} href={project.live} target="_blank" rel="noreferrer">
              <ArrowUpRight className="size-3.5" />
              Live
            </a>
          ) : null}
        </CardFooter>
      </Card>
    </Spotlight>
  )
}
