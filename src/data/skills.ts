/**
 * Derives the skills shown on the site from the generated GitHub snapshot
 * instead of a hand-maintained list:
 *
 *   - Languages           from real byte counts across every repo
 *   - Frameworks/Libraries  from package.json / requirements.txt / Cargo.toml
 *   - Tools               from the same manifests, plus anything in
 *                         `skillExtras` that no manifest can reveal
 *
 * Run `npm run sync:github` to refresh the underlying data.
 */
import { githubSnapshot } from '@/data/github.generated'
import { skillExtras } from '@/data/portfolio'
import { languageColor } from '@/lib/language-colors'

export interface Skill {
  name: string
  /** How many of your repos declare or use this. 0 for manual extras. */
  count: number
}

export interface SkillGroup {
  title: string
  skills: Skill[]
}

export interface LanguageSlice {
  name: string
  bytes: number
  percent: number
  color: string
}

/** Formats GitHub reports as languages that aren't really languages. */
const CONFIG_FORMATS = new Set(['batchfile', 'dockerfile', 'makefile', 'procfile'])

const LANGUAGE_LIMIT = 8
const LIBRARY_LIMIT = 12
const TOOL_LIMIT = 10
/** Below this, a dependency is a one-off rather than something you use. */
const USAGE_THRESHOLD = 2

const realLanguages = githubSnapshot.totals.languages.filter(
  (entry) => !CONFIG_FORMATS.has(entry.name.toLowerCase()),
)
const languageNames = new Set(githubSnapshot.totals.languages.map((entry) => entry.name.toLowerCase()))

function languageSkills(): Skill[] {
  // No count here: how many repos mention a language says little (JavaScript
  // shows up in config files), whereas the byte share in the language mix does.
  return realLanguages.slice(0, LANGUAGE_LIMIT).map((entry) => ({
    name: entry.name,
    count: 0,
  }))
}

/**
 * Most-used first. A package needs to appear in at least two repos to count as
 * something you use — except frameworks, which are few enough that a single
 * repo (Bevy, Electron) is still worth naming.
 */
function dependencySkills(categories: string[], limit: number): Skill[] {
  return githubSnapshot.dependencies
    .filter((dependency) => categories.includes(dependency.category))
    .filter((dependency) => !languageNames.has(dependency.name.toLowerCase()))
    .filter(
      (dependency) =>
        dependency.repoCount >= USAGE_THRESHOLD || dependency.category === 'framework',
    )
    .slice(0, limit)
    .map((dependency) => ({ name: dependency.name, count: dependency.repoCount }))
}

function buildSkillGroups(): SkillGroup[] {
  return [
    { title: 'Languages', skills: languageSkills() },
    {
      title: 'Frameworks & Libraries',
      skills: dependencySkills(['framework', 'library'], LIBRARY_LIMIT),
    },
    {
      title: 'Tools',
      skills: [
        ...dependencySkills(['tool'], TOOL_LIMIT),
        ...skillExtras.map((name) => ({ name, count: 0 })),
      ],
    },
  ].filter((group) => group.skills.length > 0)
}

export const skillGroups: SkillGroup[] = buildSkillGroups()

function buildLanguageBreakdown(): LanguageSlice[] {
  const all = githubSnapshot.totals.languages
  const total = all.reduce((sum, entry) => sum + entry.bytes, 0)
  if (total === 0) return []

  const slices: LanguageSlice[] = all.slice(0, 6).map((entry) => ({
    name: entry.name,
    bytes: entry.bytes,
    percent: (entry.bytes / total) * 100,
    color: languageColor(entry.name),
  }))

  const rest = all.slice(6)
  if (rest.length > 0) {
    const bytes = rest.reduce((sum, entry) => sum + entry.bytes, 0)
    slices.push({
      name: 'Other',
      bytes,
      percent: (bytes / total) * 100,
      color: languageColor('Other'),
    })
  }

  return slices
}

/** Top languages by bytes, largest first, with an "Other" bucket. */
export const languageBreakdown: LanguageSlice[] = buildLanguageBreakdown()

const ownRepos = githubSnapshot.repos.filter((repo) => !repo.fork)
const lastPush = ownRepos
  .map((repo) => repo.pushedAt)
  .filter(Boolean)
  .sort()
  .at(-1)

/** Totals used by the "By the numbers" panel on the about page. */
export const githubStats = {
  username: githubSnapshot.profile?.login ?? '',
  profileUrl: githubSnapshot.profile?.url ?? '',
  repositories: githubSnapshot.profile?.publicRepos ?? ownRepos.length,
  stars: githubSnapshot.totals.stars,
  languages: realLanguages.length,
  /** Year the account was created. */
  since: (githubSnapshot.profile?.createdAt ?? '').slice(0, 4),
  lastPush: lastPush ?? '',
  /** When the snapshot was pulled. */
  fetchedAt: githubSnapshot.fetchedAt,
}
