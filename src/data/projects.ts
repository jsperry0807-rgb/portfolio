/**
 * Builds the project list shown on the site by combining the hand-written
 * entries in `portfolio.ts` with live repository data from GitHub.
 *
 * Hand-written entries always render and come first, so you control the
 * running order. Any repo you own that has a description and no entry is
 * appended automatically.
 */
import { githubSnapshot } from '@/data/github.generated'
import type { GithubRepo } from '@/data/github-types'
import {
  projectConfig,
  projectOverrides,
  type Project,
  type ProjectOverride,
} from '@/data/portfolio'

const repoByName = new Map(
  githubSnapshot.repos.map((repo) => [repo.name.toLowerCase(), repo]),
)
const username = githubSnapshot.profile?.login ?? ''

/** `website-upgrader` -> `Website Upgrader`. CamelCase names are left alone. */
function titleize(name: string) {
  if (!/[-_]/.test(name)) return name

  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function unique(values: (string | null | undefined)[]) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

function toProject(repo: GithubRepo | undefined, override?: ProjectOverride): Project {
  const repoName = repo?.name ?? override?.repoName ?? ''

  return {
    title: override?.title ?? titleize(repoName),
    description: override?.description ?? repo?.description ?? '',
    // The language goes first so it always survives trimming, then the
    // technologies detected in that specific repo.
    tags: unique([repo?.language, ...(override?.tags ?? []), ...(repo?.technologies ?? [])]).slice(
      0,
      8,
    ),
    year: (repo?.pushedAt ?? '').slice(0, 4),
    repo: repo?.url ?? (username && repoName ? `https://github.com/${username}/${repoName}` : undefined),
    live: repo?.homepage ?? undefined,
    featured: override?.featured ?? false,
    repoName,
    language: repo?.language ?? undefined,
    stars: repo?.stars ?? 0,
    pushedAt: repo?.pushedAt,
    fromGithub: Boolean(repo),
  }
}

function buildProjects(): Project[] {
  const used = new Set<string>()

  const curated = projectOverrides.map((override) => {
    const repo = repoByName.get(override.repoName.toLowerCase())
    if (repo) used.add(repo.name.toLowerCase())
    return toProject(repo, override)
  })

  if (!projectConfig.autoIncludeDocumented) return curated

  const hidden = new Set(projectConfig.hiddenRepos.map((name) => name.toLowerCase()))

  const discovered = githubSnapshot.repos
    .filter((repo) => !repo.fork && !hidden.has(repo.name.toLowerCase()))
    .filter((repo) => !used.has(repo.name.toLowerCase()))
    .filter((repo) => Boolean(repo.description?.trim()))
    .sort((a, b) => (b.pushedAt ?? '').localeCompare(a.pushedAt ?? ''))
    .slice(0, projectConfig.maxAutoProjects)
    .map((repo) => toProject(repo))

  return [...curated, ...discovered]
}

/** Every project, hand-written entries first. */
export const projects: Project[] = buildProjects()

/** The subset shown on the home page. */
export const featuredProjects: Project[] = projects.filter((project) => project.featured)
