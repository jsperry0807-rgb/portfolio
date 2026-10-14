/**
 * Shape of the snapshot written by `scripts/fetch-github.mjs`.
 *
 * These types are the contract between the sync script and the site, so they
 * are hand-written and kept stable while the generated file is replaced.
 */

export interface GithubRepo {
  name: string
  url: string
  description: string | null
  homepage: string | null
  topics: string[]
  language: string | null
  stars: number
  forks: number
  archived: boolean
  fork: boolean
  /** Branch used when reading manifest files. */
  defaultBranch: string
  /** ISO date of the last push. */
  pushedAt: string
  /** ISO date the repo was created. */
  createdAt: string
  /** Bytes per language, best-effort — `{}` if the lookup was skipped. */
  languages: Record<string, number>
  /** Notable skills this repo actually declares or contains, best-first. */
  technologies: string[]
}

export type DependencyEcosystem = 'npm' | 'python' | 'cargo' | 'tooling'
export type DependencyCategory = 'framework' | 'library' | 'tool'

export interface GithubDependency {
  /** Package name exactly as written in the manifest. */
  package: string
  /** Human-friendly name for display. */
  name: string
  ecosystem: DependencyEcosystem
  category: DependencyCategory
  /** This user's repos that declare the package. */
  repos: string[]
  /** `repos.length`, precomputed for sorting. */
  repoCount: number
}

export interface GithubProfile {
  login: string
  name: string | null
  bio: string | null
  avatarUrl: string
  url: string
  publicRepos: number
  followers: number
  following: number
  createdAt: string
}

export interface GithubLanguageTotal {
  name: string
  bytes: number
}

export interface GithubContributionDay {
  /** ISO date, e.g. `2026-10-14`. */
  date: string
  count: number
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number
}

export interface GithubContributionWeek {
  /** ISO date of the week's Sunday. */
  firstDay: string
  /** Up to seven days — the first and last weeks of the window can be partial. */
  days: GithubContributionDay[]
}

export interface GithubRepoCommits {
  /** `owner/name`, exactly as GitHub reports it. */
  name: string
  commits: number
  /** Owner of the repository. */
  owner: string
  /** Whether that owner is a person or an organization. */
  ownerType: 'user' | 'organization'
}

/**
 * Commit activity for the last twelve months, from GitHub's contribution
 * calendar — the same data behind the graph on a profile page.
 *
 * Only public activity is included. Contributions to private repositories are
 * counted in `privateContributions` but never broken down.
 */
export interface GithubCommitStats {
  source: 'graphql'
  /** Everything: commits, pull requests, issues, and reviews. */
  contributions: number
  /** Commits to default branches. */
  commits: number
  pullRequests: number
  issues: number
  reviews: number
  /** Repositories contributed to during the window. */
  repositories: number
  /** Contributions in private repos that GitHub does not disclose. */
  privateContributions: number
  /** Days with at least one contribution. */
  activeDays: number
  /** Length of the window in days. */
  totalDays: number
  /** Longest run of consecutive active days. */
  longestStreak: number
  /** First day of the window. */
  windowStart: string
  /** Last day of the window. */
  windowEnd: string
  /** Weekly grid, oldest first — the heatmap. */
  weeks: GithubContributionWeek[]
  /** Commits per repository in the window, most first. */
  byRepository: GithubRepoCommits[]
}

export interface GithubSnapshot {
  /** ISO timestamp of the sync that produced this file. */
  fetchedAt: string
  profile: GithubProfile | null
  repos: GithubRepo[]
  /** Aggregated from every repo's dependency manifests, most-used first. */
  dependencies: GithubDependency[]
  /** Commit activity for the last year, or null if it could not be read. */
  contributions: GithubCommitStats | null
  totals: {
    repos: number
    stars: number
    /** Aggregated across the repos that had a language lookup, largest first. */
    languages: GithubLanguageTotal[]
  }
}
