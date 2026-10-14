import { ArrowUpRight } from 'lucide-react'
import { GitHubIcon } from '@/components/brand-icons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { Project } from '@/data/portfolio'

const linkClasses =
  'inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground'

/** Single project card, shared by the home page and the projects page. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="h-full transition-shadow hover:ring-brand/40">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{project.year}</span>
          {project.featured ? (
            <Badge variant="secondary" className="text-[0.65rem]">
              Featured
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-pretty text-muted-foreground">{project.description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline">{tag}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>

      {project.repo || project.live ? (
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
              Live demo
            </a>
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
  )
}
