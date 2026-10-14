/**
 * Pulls public repository data from the GitHub REST API and writes it to
 * `src/data/github.generated.ts`, which the site imports at build time.
 *
 *   npm run sync:github
 *
 * What it collects:
 *   - profile totals (repos, followers)
 *   - every repo: description, topics, language, stars, last push
 *   - language byte counts per repo
 *   - dependencies from every package.json / requirements.txt / pyproject.toml /
 *     Cargo.toml in the repo (workspaces included, node_modules and archive
 *     folders excluded), aggregated across repos so the site can show what you
 *     actually use and how often
 *
 * Environment:
 *   GITHUB_USERNAME  account to read (CI passes the repo owner automatically)
 *   GITHUB_TOKEN     optional — lifts the API rate limit from 60/hr to 5000/hr.
 *                    Manifest files are read from raw.githubusercontent.com,
 *                    which is CDN-served and does not use the API limit.
 *
 * The script never breaks a build: if GitHub is unreachable it keeps the
 * snapshot that is already committed, and only writes an empty one if there
 * is nothing to fall back on.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'

const USERNAME = process.env.GITHUB_USERNAME?.trim() || 'jsperry0807-rgb'
const TOKEN = process.env.GITHUB_TOKEN?.trim() || ''

const OUTPUT = 'src/data/github.generated.ts'
const PER_PAGE = 100
const MAX_PAGES = 5
/** How many repos to fetch per-language byte counts for (one request each). */
const LANGUAGE_LOOKUPS = 15
/** Upper bound on manifest files read per repo. */
const MAX_MANIFESTS_PER_REPO = 12
/** Upper bound on technologies attached to a single repo. */
const MAX_TECHNOLOGIES_PER_REPO = 8

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'portfolio-github-sync',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
}

/** Paths that hold generated, vendored, or retired code. */
const EXCLUDED_PATH =
  /(^|\/)(node_modules|dist|build|out|target|vendor|archive|coverage|\.next|\.nuxt|\.venv|venv|site-packages)\//

/* -------------------------------------------------------------------------- */
/* What each package means                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Packages worth naming on the site, with the category they belong to.
 *
 * Anything not listed here still gets picked up when it appears in two or more
 * repos — that is a real habit rather than a one-off. Everything else is left
 * out so the list stays curated instead of exhaustive.
 */
const DEPENDENCY_INFO = {
  /* Frameworks */
  next: { name: 'Next.js', category: 'framework' },
  express: { name: 'Express', category: 'framework' },
  fastify: { name: 'Fastify', category: 'framework' },
  hono: { name: 'Hono', category: 'framework' },
  electron: { name: 'Electron', category: 'framework' },
  bevy: { name: 'Bevy', category: 'framework' },
  flask: { name: 'Flask', category: 'framework' },
  django: { name: 'Django', category: 'framework' },
  fastapi: { name: 'FastAPI', category: 'framework' },

  /* Libraries */
  react: { name: 'React', category: 'library' },
  'react-dom': { name: 'React', category: 'library' },
  typescript: { name: 'TypeScript', category: 'library' },
  tailwindcss: { name: 'Tailwind CSS', category: 'library' },
  'framer-motion': { name: 'Framer Motion', category: 'library' },
  motion: { name: 'Framer Motion', category: 'library' },
  'lucide-react': { name: 'Lucide', category: 'library' },
  'react-router': { name: 'React Router', category: 'library' },
  'react-router-dom': { name: 'React Router', category: 'library' },
  'react-hot-toast': { name: 'react-hot-toast', category: 'library' },
  'radix-ui': { name: 'Radix UI', category: 'library' },
  shadcn: { name: 'shadcn/ui', category: 'library' },
  three: { name: 'Three.js', category: 'library' },
  '@react-three/fiber': { name: 'React Three Fiber', category: 'library' },
  zod: { name: 'Zod', category: 'library' },
  '@zodios/express': { name: 'Zodios', category: 'library' },
  '@zodios/openapi': { name: 'Zodios', category: 'library' },
  zustand: { name: 'Zustand', category: 'library' },
  '@tanstack/react-query': { name: 'TanStack Query', category: 'library' },
  'react-hook-form': { name: 'React Hook Form', category: 'library' },
  mongoose: { name: 'Mongoose', category: 'library' },
  pg: { name: 'PostgreSQL', category: 'library' },
  'better-sqlite3': { name: 'SQLite', category: 'library' },
  prisma: { name: 'Prisma', category: 'library' },
  '@prisma/client': { name: 'Prisma', category: 'library' },
  '@prisma/adapter-pg': { name: 'Prisma', category: 'library' },
  bullmq: { name: 'BullMQ', category: 'library' },
  openai: { name: 'OpenAI API', category: 'library' },
  octokit: { name: 'Octokit', category: 'library' },
  passport: { name: 'Passport', category: 'library' },
  'passport-github2': { name: 'Passport', category: 'library' },
  jose: { name: 'JOSE', category: 'library' },
  bcryptjs: { name: 'bcrypt', category: 'library' },
  helmet: { name: 'Helmet', category: 'library' },
  pino: { name: 'Pino', category: 'library' },
  'pino-http': { name: 'Pino', category: 'library' },
  winston: { name: 'Winston', category: 'library' },
  'electron-updater': { name: 'electron-updater', category: 'library' },
  trystero: { name: 'Trystero', category: 'library' },
  serde: { name: 'Serde', category: 'library' },
  rayon: { name: 'Rayon', category: 'library' },
  glam: { name: 'glam', category: 'library' },
  tokio: { name: 'Tokio', category: 'library' },
  ndshape: { name: 'ndshape', category: 'library' },
  'block-mesh': { name: 'block-mesh', category: 'library' },
  bevy_mesh: { name: 'bevy_mesh', category: 'library' },
  'bevy_common_assets': { name: 'bevy_common_assets', category: 'library' },
  wgpu: { name: 'wgpu', category: 'library' },
  'wgpu-types': { name: 'wgpu', category: 'library' },
  numpy: { name: 'NumPy', category: 'library' },
  pandas: { name: 'Pandas', category: 'library' },
  scipy: { name: 'SciPy', category: 'library' },
  matplotlib: { name: 'Matplotlib', category: 'library' },
  pillow: { name: 'Pillow', category: 'library' },
  requests: { name: 'Requests', category: 'library' },
  pygame: { name: 'Pygame', category: 'library' },
  'pygame-ce': { name: 'Pygame', category: 'library' },
  torch: { name: 'PyTorch', category: 'library' },
  'opencv-python': { name: 'OpenCV', category: 'library' },

  /* Tooling */
  vite: { name: 'Vite', category: 'tool' },
  'electron-vite': { name: 'electron-vite', category: 'tool' },
  'electron-builder': { name: 'electron-builder', category: 'tool' },
  eslint: { name: 'ESLint', category: 'tool' },
  prettier: { name: 'Prettier', category: 'tool' },
  oxlint: { name: 'oxlint', category: 'tool' },
  vitest: { name: 'Vitest', category: 'tool' },
  jest: { name: 'Jest', category: 'tool' },
  playwright: { name: 'Playwright', category: 'tool' },
  '@playwright/test': { name: 'Playwright', category: 'tool' },
  'swagger-ui-express': { name: 'Swagger', category: 'tool' },
  'swagger-jsdoc': { name: 'Swagger', category: 'tool' },
  pnpm: { name: 'pnpm', category: 'tool' },
  npm: { name: 'npm', category: 'tool' },
  yarn: { name: 'Yarn', category: 'tool' },
  uvicorn: { name: 'Uvicorn', category: 'tool' },

  /* Detected from files rather than manifests */
  docker: { name: 'Docker', category: 'tool' },
  'docker compose': { name: 'Docker Compose', category: 'tool' },
  'github actions': { name: 'GitHub Actions', category: 'tool' },
}

/**
 * Never useful as a skill. Config glue, type stubs, formatting plugins, and
 * internal workspace packages all land here.
 */
const IGNORED_PACKAGES = [
  /^@types\//,
  /^@eslint\//,
  /^@babel\//,
  /^@vitejs\//,
  /^@tailwindcss\//,
  /^@testing-library\//,
  /^@electron-toolkit\//,
  /^@electron\//,
  /^@repo\//,
  /^@myapp\//,
  /^@dev-journal\//,
  /^eslint-/,
  /^typescript-eslint$/,
  /^@typescript-eslint\//,
  /^(cors|dotenv|globals|nodemon|tsx|concurrently|rimraf|cross-env|husky|lint-staged|postcss|autoprefixer|tar|https-proxy-agent|socks-proxy-agent|electron-log|prisma-json-types-generator|typedoc|supertest|dotenv-cli|wait-on|npm-run-all|class-variance-authority|express-rate-limit|tw-animate-css|react-hot-toast|tinyglobby|pidtree)$/,
]

function isIgnored(packageName) {
  return IGNORED_PACKAGES.some((pattern) => pattern.test(packageName))
}

/** Resolves a raw package name to the skill it represents. */
function resolvePackage(ecosystem, packageName) {
  const info = DEPENDENCY_INFO[packageName.toLowerCase()]
  if (info) return { name: info.name, category: info.category, known: true }
  return { name: packageName, category: 'library', known: false }
}

/* -------------------------------------------------------------------------- */
/* Manifest parsing                                                           */
/* -------------------------------------------------------------------------- */

const MANIFESTS = [
  { basename: 'package.json', ecosystem: 'npm', parse: parsePackageJson },
  { basename: 'requirements.txt', ecosystem: 'python', parse: parseRequirementsTxt },
  { basename: 'pyproject.toml', ecosystem: 'python', parse: parsePyprojectToml },
  { basename: 'Cargo.toml', ecosystem: 'cargo', parse: parseCargoToml },
]

const MANIFEST_BY_BASENAME = new Map(MANIFESTS.map((entry) => [entry.basename, entry]))

/** `dependencies` + `devDependencies`, skipping workspace/file references. */
function parsePackageJson(text) {
  const manifest = JSON.parse(text)
  const packages = []
  let packageManager = null

  for (const group of ['dependencies', 'devDependencies']) {
    for (const [name, spec] of Object.entries(manifest[group] ?? {})) {
      const value = String(spec)
      if (value.startsWith('workspace:') || value.startsWith('file:') || value.startsWith('link:')) {
        continue
      }
      packages.push(name)
    }
  }

  const declared = manifest.packageManager ?? manifest.devEngines?.packageManager?.name
  if (typeof declared === 'string' && declared) {
    packageManager = declared.split('@')[0].trim().toLowerCase()
  }

  return packageManager ? [...packages, packageManager] : packages
}

/** Requirement lines, with versions, extras, and markers stripped. */
function parseRequirementsTxt(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, '').trim())
    .filter((line) => line && !line.startsWith('-'))
    .map(stripRequirement)
    .filter(Boolean)
}

/** Dependency names from a pyproject.toml (PEP 621 or Poetry). */
function parsePyprojectToml(text) {
  const packages = []
  let inArray = false
  let inDependencySection = false

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim()
    if (!line) continue

    if (inArray) {
      const quoted = /^["']([^"']+)["']/.exec(line)
      if (quoted) packages.push(stripRequirement(quoted[1]))
      if (line.includes(']')) inArray = false
      continue
    }

    const section = /^\[(.+)\]$/.exec(line)
    if (section) {
      const key = section[1]
      const dotted = /^(?:tool\.)?poetry\.dependencies\.(.+)$/.exec(key)
      if (dotted) packages.push(dotted[1].replace(/^"|"$/g, ''))
      inDependencySection = /^(?:tool\.)?poetry\.dependencies$/.test(key)
      continue
    }

    const arrayStart = /^(?:dependencies|optional-dependencies\.[A-Za-z0-9_-]+)\s*=\s*\[(.*)$/.exec(line)
    if (arrayStart) {
      const inline = arrayStart[1]
      for (const match of inline.matchAll(/["']([^"']+)["']/g)) {
        packages.push(stripRequirement(match[1]))
      }
      inArray = !inline.includes(']')
      continue
    }

    if (!inDependencySection) continue

    const assignment = /^([A-Za-z0-9._-]+|"[^"]+")\s*=/.exec(line)
    if (assignment) packages.push(assignment[1].replace(/^"|"$/g, ''))
  }

  return packages
}

/** Crate names from every dependency section of a Cargo.toml. */
function parseCargoToml(text) {
  const crates = []
  let inDependencySection = false

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim()
    if (!line) continue

    const section = /^\[(.+)\]$/.exec(line)
    if (section) {
      const key = section[1]
      // `[dependencies.foo]` declares a single crate.
      const dotted = /^(?:workspace\.|target\..*\.)?(?:dev-|build-)?dependencies\.(.+)$/.exec(key)
      if (dotted) crates.push(dotted[1].replace(/^"|"$/g, ''))

      inDependencySection =
        /^(?:workspace\.)?(?:dev-|build-)?dependencies$/.test(key) ||
        /^target\..*\.(?:dev-|build-)?dependencies$/.test(key)
      continue
    }

    if (!inDependencySection) continue

    const assignment = /^([A-Za-z0-9_-]+|"[^"]+")\s*=/.exec(line)
    if (assignment) crates.push(assignment[1].replace(/^"|"$/g, ''))
  }

  return crates
}

function stripRequirement(value) {
  return value
    .split(/[<>=!~;[\s]/)[0]
    .replace(/^["']|["']$/g, '')
    .trim()
}

/* -------------------------------------------------------------------------- */
/* File-based signals                                                         */
/* -------------------------------------------------------------------------- */

/** Skills inferred from the presence of well-known files. */
const FILE_SIGNALS = [
  { pattern: /(^|\/)Dockerfile(?:\..+)?$/i, packages: [['docker', 'tool']] },
  { pattern: /(^|\/)docker-compose\.ya?ml$/i, packages: [['docker compose', 'tool']] },
  { pattern: /^\.github\/workflows\/.+\.ya?ml$/i, packages: [['github actions', 'tool']] },
]

/* -------------------------------------------------------------------------- */
/* GitHub access                                                              */
/* -------------------------------------------------------------------------- */

async function request(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `${response.status} ${response.statusText} for ${path}${body ? ` — ${body.slice(0, 160)}` : ''}`,
    )
  }

  return response.json()
}

/** Reads a file straight from the CDN — this does not use the API limit. */
async function fetchRawFile(repo, path) {
  const url = `https://raw.githubusercontent.com/${USERNAME}/${repo.name}/${repo.defaultBranch}/${path}`
  const response = await fetch(url, { headers: { 'User-Agent': headers['User-Agent'] } })

  return response.ok ? response.text() : null
}

/** Every blob path in the repo, or null when the tree cannot be read. */
async function fetchTreePaths(repo) {
  const tree = await request(
    `/repos/${USERNAME}/${repo.name}/git/trees/${repo.defaultBranch}?recursive=1`,
  )

  return (tree.tree ?? []).filter((entry) => entry.type === 'blob').map((entry) => entry.path)
}

/* -------------------------------------------------------------------------- */
/* Collection                                                                 */
/* -------------------------------------------------------------------------- */

async function fetchProfile() {
  const profile = await request(`/users/${USERNAME}`)

  return {
    login: profile.login,
    name: profile.name ?? null,
    bio: profile.bio ?? null,
    avatarUrl: profile.avatar_url,
    url: profile.html_url,
    publicRepos: profile.public_repos ?? 0,
    followers: profile.followers ?? 0,
    following: profile.following ?? 0,
    createdAt: profile.created_at,
  }
}

async function fetchRepos() {
  const repos = []

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const batch = await request(
      `/users/${USERNAME}/repos?per_page=${PER_PAGE}&page=${page}&sort=pushed&direction=desc&type=owner`,
    )

    for (const repo of batch) {
      repos.push({
        name: repo.name,
        url: repo.html_url,
        description: repo.description ?? null,
        homepage: repo.homepage ? repo.homepage : null,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        language: repo.language ?? null,
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        archived: Boolean(repo.archived),
        fork: Boolean(repo.fork),
        defaultBranch: repo.default_branch || 'main',
        pushedAt: repo.pushed_at,
        createdAt: repo.created_at,
        languages: {},
        technologies: [],
      })
    }

    if (batch.length < PER_PAGE) break
  }

  return repos
}

/** Runs `worker` over `items` with a small concurrency cap. */
async function mapWithLimit(items, limit, worker) {
  const results = []
  let cursor = 0

  async function run() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await worker(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run))
  return results
}

async function attachLanguages(repos) {
  // Language byte counts are garnish — failing to get them must not sink the
  // sync, so each lookup swallows its own error.
  const targets = repos.filter((repo) => !repo.archived).slice(0, LANGUAGE_LOOKUPS)

  await mapWithLimit(targets, 5, async (repo) => {
    try {
      repo.languages = await request(`/repos/${USERNAME}/${repo.name}/languages`)
    } catch {
      repo.languages = {}
    }
  })
}

/* -------------------------------------------------------------------------- */
/* Commit activity                                                            */
/* -------------------------------------------------------------------------- */

/**
 * GitHub's contribution calendar, which is only exposed over GraphQL. This is
 * the same data behind the graph on a profile page: one request returns a year
 * of daily counts plus per-repository commit totals.
 */
const CONTRIBUTION_QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      totalRepositoriesWithContributedCommits
      restrictedContributionsCount
      commitContributionsByRepository(maxRepositories: 100) {
        repository { nameWithOwner }
        contributions { totalCount }
      }
      contributionCalendar {
        totalContributions
        weeks {
          firstDay
          contributionDays { date contributionCount weekday }
        }
      }
    }
  }
}`

async function fetchContributions() {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: CONTRIBUTION_QUERY, variables: { login: USERNAME } }),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} from the GraphQL API`)
  }

  const payload = await response.json()
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join('; '))
  }

  const collection = payload.data?.user?.contributionsCollection
  if (!collection?.contributionCalendar) throw new Error('no contribution data returned')

  const weeks = collection.contributionCalendar.weeks.map((week) => ({
    firstDay: week.firstDay,
    days: week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      weekday: day.weekday,
    })),
  }))
  const days = weeks.flatMap((week) => week.days)

  let longestStreak = 0
  let run = 0
  for (const day of days) {
    if (day.count > 0) {
      run += 1
      longestStreak = Math.max(longestStreak, run)
    } else {
      run = 0
    }
  }

  const byRepository = collection.commitContributionsByRepository
    .map((entry) => ({
      name: entry.repository.nameWithOwner,
      commits: entry.contributions.totalCount,
    }))
    .filter((entry) => entry.commits > 0)
    .sort((a, b) => b.commits - a.commits)

  // Whether a repo belongs to a person or an organization changes how it should
  // be described on the site: an org repo isn't "someone else's".
  const owners = [...new Set(byRepository.map((entry) => entry.name.split('/')[0]))]
  const ownerTypes = new Map()
  await mapWithLimit(owners, 4, async (owner) => {
    try {
      const data = await request(`/users/${owner}`)
      ownerTypes.set(owner, data.type === 'Organization' ? 'organization' : 'user')
    } catch {
      ownerTypes.set(owner, 'user')
    }
  })

  return {
    source: 'graphql',
    contributions: collection.contributionCalendar.totalContributions,
    commits: collection.totalCommitContributions,
    pullRequests: collection.totalPullRequestContributions,
    issues: collection.totalIssueContributions,
    reviews: collection.totalPullRequestReviewContributions,
    repositories: collection.totalRepositoriesWithContributedCommits,
    privateContributions: collection.restrictedContributionsCount,
    activeDays: days.filter((day) => day.count > 0).length,
    totalDays: days.length,
    longestStreak,
    windowStart: days[0]?.date ?? '',
    windowEnd: days.at(-1)?.date ?? '',
    weeks,
    byRepository: byRepository.map((entry) => ({
      ...entry,
      owner: entry.name.split('/')[0],
      ownerType: ownerTypes.get(entry.name.split('/')[0]) ?? 'user',
    })),
  }
}

/**
 * Reads the snapshot already on disk. Contribution data is the one thing this
 * script can't always fetch — the GraphQL API rejects some CI tokens — so a
 * failed lookup falls back to what is already committed rather than blanking
 * the section on the site.
 */
function readPreviousSnapshot() {
  if (!existsSync(OUTPUT)) return null

  try {
    const text = readFileSync(OUTPUT, 'utf8')
    const marker = 'githubSnapshot: GithubSnapshot = '
    const start = text.indexOf(marker)
    if (start === -1) return null
    return JSON.parse(text.slice(start + marker.length).trim())
  } catch {
    return null
  }
}

/**
 * Reads every manifest in a repo and returns the packages it declares plus the
 * skills implied by the files it contains. Falls back to root-level manifests
 * when the tree API is unavailable (rate limited, empty repo, and so on).
 */
async function collectRepoFacts(repo) {
  let paths = null
  try {
    paths = await fetchTreePaths(repo)
  } catch {
    paths = null
  }

  const packages = []
  const signals = []

  if (paths) {
    const usable = paths.filter((path) => !EXCLUDED_PATH.test(path))

    for (const signal of FILE_SIGNALS) {
      if (usable.some((path) => signal.pattern.test(path))) {
        for (const [name] of signal.packages) signals.push(name)
      }
    }

    const manifestPaths = usable
      .filter((path) => MANIFEST_BY_BASENAME.has(path.split('/').pop()))
      .slice(0, MAX_MANIFESTS_PER_REPO)

    await mapWithLimit(manifestPaths, 4, async (path) => {
      const manifest = MANIFEST_BY_BASENAME.get(path.split('/').pop())
      const text = await fetchRawFile(repo, path).catch(() => null)
      if (!text) return

      try {
        for (const name of manifest.parse(text)) {
          if (name && !isIgnored(name)) packages.push({ ecosystem: manifest.ecosystem, name })
        }
      } catch {
        console.warn(`  ! Could not parse ${repo.name}/${path}`)
      }
    })
  } else {
    for (const manifest of MANIFESTS) {
      const text = await fetchRawFile(repo, manifest.basename).catch(() => null)
      if (!text) continue
      try {
        for (const name of manifest.parse(text)) {
          if (name && !isIgnored(name)) packages.push({ ecosystem: manifest.ecosystem, name })
        }
      } catch {
        // Ignore unparseable fallback manifests.
      }
    }
  }

  return { packages, signals }
}

/* -------------------------------------------------------------------------- */
/* Aggregation                                                                */
/* -------------------------------------------------------------------------- */

function aggregateLanguages(repos) {
  const bytes = new Map()

  for (const repo of repos) {
    for (const [name, count] of Object.entries(repo.languages ?? {})) {
      bytes.set(name, (bytes.get(name) ?? 0) + count)
    }
  }

  return [...bytes.entries()]
    .map(([name, total]) => ({ name, bytes: total }))
    .sort((a, b) => b.bytes - a.bytes)
}

/**
 * Builds the global dependency list. Packages that resolve to the same skill
 * (react + react-dom, prisma + @prisma/client) are merged into one entry.
 */
function aggregateDependencies(repoFacts) {
  const usage = new Map()

  for (const [repoName, facts] of repoFacts) {
    for (const pkg of facts.packages) {
      const resolved = resolvePackage(pkg.ecosystem, pkg.name)
      const key = `${pkg.ecosystem}:${resolved.name.toLowerCase()}`
      const existing = usage.get(key) ?? {
        package: pkg.name,
        name: resolved.name,
        ecosystem: pkg.ecosystem,
        category: resolved.category,
        known: resolved.known,
        repos: new Set(),
      }
      existing.repos.add(repoName)
      usage.set(key, existing)
    }

    for (const signal of facts.signals) {
      const resolved = DEPENDENCY_INFO[signal]
      const key = `file:${resolved.name.toLowerCase()}`
      const existing = usage.get(key) ?? {
        package: signal,
        name: resolved.name,
        ecosystem: 'tooling',
        category: resolved.category,
        known: true,
        repos: new Set(),
      }
      existing.repos.add(repoName)
      usage.set(key, existing)
    }
  }

  const dependencies = []

  for (const entry of usage.values()) {
    // Unknown packages only earn a spot if they show up in more than one repo.
    if (!entry.known && entry.repos.size < 2) continue

    dependencies.push({
      package: entry.package,
      name: entry.name,
      ecosystem: entry.ecosystem,
      category: entry.category,
      repos: [...entry.repos].sort(),
      repoCount: entry.repos.size,
    })
  }

  return dependencies.sort(
    (a, b) => b.repoCount - a.repoCount || a.name.localeCompare(b.name),
  )
}

/** Notable technologies used by a single repo, most-used across the site first. */
function attachTechnologies(repoFacts, dependencies) {
  const notable = new Map(dependencies.map((entry) => [entry.name, entry]))

  for (const facts of repoFacts.values()) {
    const names = new Set()

    for (const pkg of facts.packages) {
      const resolved = resolvePackage(pkg.ecosystem, pkg.name)
      if (notable.has(resolved.name)) names.add(resolved.name)
    }

    for (const signal of facts.signals) {
      const resolved = DEPENDENCY_INFO[signal]
      if (resolved) names.add(resolved.name)
    }

    facts.technologies = [...names]
      .sort((a, b) => {
        const left = notable.get(a)?.repoCount ?? 0
        const right = notable.get(b)?.repoCount ?? 0
        return right - left || a.localeCompare(b)
      })
      .slice(0, MAX_TECHNOLOGIES_PER_REPO)
  }
}

/* -------------------------------------------------------------------------- */
/* Output                                                                     */
/* -------------------------------------------------------------------------- */

function emptySnapshot() {
  return {
    fetchedAt: new Date().toISOString(),
    profile: null,
    repos: [],
    dependencies: [],
    contributions: null,
    totals: { repos: 0, stars: 0, languages: [] },
  }
}

function write(snapshot) {
  const contents = `// Generated by scripts/fetch-github.mjs — do not edit by hand.
// Refresh it with: npm run sync:github
import type { GithubSnapshot } from './github-types'

export const githubSnapshot: GithubSnapshot = ${JSON.stringify(snapshot, null, 2)}
`

  writeFileSync(OUTPUT, contents)
}

async function main() {
  const profile = await fetchProfile()
  const repos = await fetchRepos()
  await attachLanguages(repos)

  const repoFacts = new Map()
  await mapWithLimit(repos, 3, async (repo) => {
    try {
      repoFacts.set(repo.name, await collectRepoFacts(repo))
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      console.warn(`  ! Could not read ${repo.name}: ${reason}`)
      repoFacts.set(repo.name, { packages: [], signals: [] })
    }
  })

  const dependencies = aggregateDependencies(repoFacts)
  attachTechnologies(repoFacts, dependencies)

  for (const repo of repos) {
    const facts = repoFacts.get(repo.name)
    repo.technologies = facts?.technologies ?? []
  }

  const previous = readPreviousSnapshot()

  let contributions = null
  try {
    contributions = await fetchContributions()
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    console.warn(`  ! Contribution activity unavailable: ${reason}`)
    // Never let a failed lookup wipe data that is already committed.
    contributions = previous?.contributions ?? null
    if (contributions) console.warn('    Keeping the contribution activity from the last sync.')
  }

  const snapshot = {
    fetchedAt: new Date().toISOString(),
    profile,
    repos,
    dependencies,
    contributions,
    totals: {
      repos: repos.filter((repo) => !repo.fork).length,
      stars: repos.reduce((sum, repo) => sum + repo.stars, 0),
      languages: aggregateLanguages(repos),
    },
  }

  write(snapshot)

  const technologies = snapshot.repos.reduce((sum, repo) => sum + repo.technologies.length, 0)
  const commits = contributions ? ` · ${contributions.commits} commits/yr` : ''
  console.log(
    `GitHub sync: ${repos.length} repos · ${snapshot.totals.languages.length} languages · ` +
      `${dependencies.length} dependencies · ${technologies} repo technologies${commits} -> ${OUTPUT}`,
  )
}

try {
  await main()
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error)
  console.warn(`GitHub sync failed: ${reason}`)

  if (existsSync(OUTPUT)) {
    console.warn(`Keeping the existing ${OUTPUT}.`)
  } else {
    write(emptySnapshot())
    console.warn(`Wrote an empty ${OUTPUT} so the build can continue.`)
  }
}
