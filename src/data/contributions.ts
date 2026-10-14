/**
 * Commit activity for the about page, derived from the contribution calendar
 * in the GitHub snapshot (`npm run sync:github` refreshes it).
 *
 * The headline numbers are GitHub's own, so they match what a visitor sees on
 * the profile. `contributionConfig` in `portfolio.ts` controls which repos are
 * named individually; everything else is grouped into "Other" so the listed
 * numbers still add up to the total.
 */
import { githubSnapshot } from '@/data/github.generated'
import type { GithubCommitStats } from '@/data/github-types'
import { contributionConfig } from '@/data/portfolio'
import { projects } from '@/data/projects'

export interface ContributionRepo {
  /** Display name — the project title when the repo is on the site. */
  name: string
  commits: number
  /** `own` when the repo is yours, `org` when an organization owns it,
   *  `shared` when it belongs to another person. */
  relation: 'own' | 'org' | 'shared'
}

export interface ContributionBreakdown {
  repos: ContributionRepo[]
  /** Repos folded into the "Other" row. */
  otherRepos: number
  otherCommits: number
}

export interface ContributionSummary {
  contributions: number
  commits: number
  pullRequests: number
  issues: number
  reviews: number
  privateContributions: number
  /** Repositories contributed to during the window. */
  repositories: number
  activeDays: number
  totalDays: number
  longestStreak: number
  /** Commits per week across the whole window. */
  commitsPerWeek: number
  /** Share of days with at least one contribution, as a percentage. */
  activePercent: number
  windowStart: string
  windowEnd: string
  weeks: GithubCommitStats['weeks']
}

const stats = githubSnapshot.contributions
const username = githubSnapshot.profile?.login ?? ''

/** Maps every repo that appears on the site to its nice display title. */
const titleByRepo = new Map(
  projects
    .filter((project) => project.repoName)
    .map((project) => [project.repoName!.toLowerCase(), project.title]),
)

/** Strips the owner and any `-main` / `-master` suffix GitHub adds on fork. */
function displayName(nameWithOwner: string): string {
  const bare = nameWithOwner.split('/').pop() ?? nameWithOwner
  const key = bare.toLowerCase()

  const known = titleByRepo.get(key)
  if (known) return known

  const cleaned = bare.replace(/[-_](main|master|dev)$/i, '')
  return cleaned
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => (/^[0-9]d$/i.test(part) ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(' ')
}

function buildBreakdown(): ContributionBreakdown | null {
  if (!stats) return null

  const hidden = new Set(contributionConfig.hiddenRepos.map((name) => name.toLowerCase()))

  const allowed = stats.byRepository.filter(
    (entry) => !hidden.has((entry.name.split('/').pop() ?? '').toLowerCase()),
  )
  const listed = allowed.slice(0, contributionConfig.maxRepos)
  const rest = allowed.slice(contributionConfig.maxRepos)
  // Repos dropped by `hiddenRepos` are counted in "Other" too, so the rows add
  // up to the headline commit total.
  const hiddenCommits = stats.byRepository
    .filter((entry) => hidden.has((entry.name.split('/').pop() ?? '').toLowerCase()))
    .reduce((sum, entry) => sum + entry.commits, 0)

  const repos = listed.map((entry) => ({
    name: displayName(entry.name),
    commits: entry.commits,
    relation: (entry.owner === username
      ? 'own'
      : entry.ownerType === 'organization'
        ? 'org'
        : 'shared') as ContributionRepo['relation'],
  }))

  return {
    repos,
    otherRepos: rest.length + (hiddenCommits > 0 ? stats.byRepository.length - allowed.length : 0),
    otherCommits: rest.reduce((sum, entry) => sum + entry.commits, 0) + hiddenCommits,
  }
}

export const contributions = stats ?? null
export const contributionBreakdown: ContributionBreakdown | null = buildBreakdown()

export const contributionSummary: ContributionSummary | null = stats
  ? {
      contributions: stats.contributions,
      commits: stats.commits,
      pullRequests: stats.pullRequests,
      issues: stats.issues,
      reviews: stats.reviews,
      privateContributions: stats.privateContributions,
      repositories: stats.repositories,
      activeDays: stats.activeDays,
      totalDays: stats.totalDays,
      longestStreak: stats.longestStreak,
      commitsPerWeek: stats.commits / Math.max(1, stats.weeks.length),
      activePercent: stats.totalDays > 0 ? (stats.activeDays / stats.totalDays) * 100 : 0,
      windowStart: stats.windowStart,
      windowEnd: stats.windowEnd,
      weeks: stats.weeks,
    }
  : null
