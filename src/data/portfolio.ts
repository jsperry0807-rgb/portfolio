/**
 * All of the site's content lives in this file.
 *
 * Edit the values below to update the site — you shouldn't need to touch any
 * component code. Anything marked TODO is a placeholder you should replace.
 */

export interface Social {
  label: string
  href: string
  icon: 'github' | 'linkedin' | 'mail'
}

export interface NavItem {
  /** Route path, e.g. '/projects'. */
  path: string
  label: string
}

export interface Project {
  title: string
  description: string
  tags: string[]
  year: string
  /** Link to the source code. Leave out to hide the link. */
  repo?: string
  /** Link to a live demo. Leave out to hide the link. */
  live?: string
  /** Featured projects are highlighted in the grid. */
  featured?: boolean
  /** GitHub repo this entry is linked to, if any. */
  repoName?: string
  /** Primary language, straight from GitHub. */
  language?: string
  stars?: number
  /** ISO date of the last push. */
  pushedAt?: string
  /** True when the entry was built from live GitHub data rather than written by hand. */
  fromGithub?: boolean
}

/**
 * A hand-written entry, matched to a GitHub repo by `repoName`. These always
 * appear on the site and define the running order, so you can curate the grid
 * without documenting every repo on GitHub.
 *
 * Anything you leave out (title, description, tags) is filled in from the repo.
 */
export interface ProjectOverride {
  /** Repo name on GitHub, case-insensitive. */
  repoName: string
  title?: string
  /** Replaces the repo description. Required to show a repo that has none. */
  description?: string
  /** Merged with the repo's topics and primary language. */
  tags?: string[]
  featured?: boolean
}

export interface ExperienceItem {
  type: 'education' | 'work' | 'activity'
  title: string
  org: string
  period: string
  description: string
  highlights?: string[]
}

export const site = {
  name: 'Jace Sperry',
  role: 'Student & Developer',
  /** Shown under your name in the hero. Keep it to a sentence or two. */
  tagline:
    'I build full-stack web apps with TypeScript and React, and write Rust when I want to get closer to the metal.',
  location: 'North East, PA',
  email: 'jsperry0807@gmail.com',
  /** Shown as a pill at the top of the hero. Set to '' to hide it. */
  availability: 'Open to internships and collaborations',
  /**
   * Drop your resume in the `public/` folder and set this to the file name,
   * e.g. 'resume.pdf'. Set it to '' to hide the resume buttons entirely.
   *
   * Left empty for now so the site doesn't link to a placeholder PDF. Add your
   * resume to `public/` and set this back to 'resume.pdf' to switch it on.
   */
  resumeUrl: '',
}

export const nav: NavItem[] = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/experience', label: 'Experience' },
  { path: '/contact', label: 'Contact' },
]

export const socials: Social[] = [
  { label: 'GitHub', href: 'https://github.com/jsperry0807-rgb', icon: 'github' },
  { label: 'Email', href: 'mailto:jsperry0807@gmail.com', icon: 'mail' },
  // LinkedIn is hidden until there's a real profile to point at. Replace the URL
  // and uncomment to bring it back:
  // { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle', icon: 'linkedin' },
]

export const about = {
  paragraphs: [
    "I'm a student who got into programming by breaking things and figuring out how to fix them. These days I spend most of my time building web apps with React and TypeScript.",
    "Right now I'm working on personal projects to sharpen my skills, and I'm always looking for something new to learn or a problem worth solving.",
  ],
  facts: [
    { label: 'Based in', value: site.location },
    { label: 'Focus', value: 'Web development' },
    { label: 'Currently', value: 'Building side projects' },
    { label: 'Open to', value: 'Internships & collabs' },
  ],
}

/**
 * The projects on the site. These are hand-written entries matched to your
 * GitHub repos by `repoName` — they define the order and the copy.
 *
 * `tags` are filled in automatically from the technologies detected in each
 * repo (see scripts/fetch-github.mjs), so you normally don't need to list them.
 * Anything you don't specify (title, tags, live URL, year) comes from GitHub.
 *
 * Repos you own that have a description but no entry here are appended
 * automatically — documenting a repo on GitHub is enough to get it on the site.
 */
export const projectOverrides: ProjectOverride[] = [
  {
    repoName: 'website-upgrader',
    // TODO: confirm this description
    description:
      'Crawls a site, classifies its pages, and rebuilds them as an immersive 3D experience. Express API backed by SQLite.',
    featured: true,
  },
  {
    repoName: 'Voxel-Game',
    featured: true,
    // TODO: confirm this description
    description:
      'A voxel engine and game written from scratch in Rust, split into a core crate and a Bevy renderer.',
  },
  {
    repoName: 'dev-journal',
    featured: true,
    // TODO: confirm this description
    description:
      'A developer journal: Express and Prisma API with background jobs, plus a React front end.',
  },
  {
    repoName: 'idea-incubator',
    featured: true,
    // TODO: confirm this description
    description:
      'A pnpm monorepo for capturing and developing project ideas — React client, Express and Prisma API with JWT auth.',
  },
  {
    repoName: 'ShadowMesh',
    // TODO: confirm this description
    description: 'An Electron desktop app built with React, TypeScript, and Vite.',
  },
  {
    repoName: 'slot-game',
    // TODO: confirm this description
    description: 'A browser-based slot machine built with plain HTML, CSS, and JavaScript.',
  },
  {
    repoName: 'Agent-Based-Artificial-Life-Ecosystem-Simulator',
    title: 'Artificial Life Ecosystem',
    // TODO: confirm this description
    description: 'An agent-based simulation of a virtual ecosystem, written in Python.',
  },
  {
    repoName: 'portfolio',
    title: 'This Portfolio',
    description:
      'This site — React, TypeScript, and Tailwind, with its content generated from the GitHub API at build time.',
  },
]

export const projectConfig = {
  /**
   * Repos that never appear on the site. These have no description on GitHub
   * yet, so there is nothing honest to show. Add a description to the repo and
   * remove it from this list to put it back on the site.
   */
  hiddenRepos: ['lead-hound', 'agentic-os', 'Claude-Code-Setup', 'fullStackTwemp'],
  /** Append your own documented repos automatically. */
  autoIncludeDocumented: true,
  /** Safety cap on how many auto-added repos appear. */
  maxAutoProjects: 6,
}

/**
 * Skills that can't be discovered from a dependency manifest — anything you
 * use but never `npm install`. Merged into the "Tools" group.
 */
export const skillExtras: string[] = ['Git']

/**
 * Commit activity on the about page. The numbers come straight from GitHub's
 * contribution calendar; this only decides which repos get named.
 */
export const contributionConfig = {
  /**
   * Counted in the totals but never listed by name — template, tutorial, and
   * setup repos that don't say much on a portfolio. Matched on the repo name
   * without its owner.
   */
  hiddenRepos: ['Vite_Template', 'Debug-Project', 'GitDemo', 'Claude-Code-Setup'],
  /** How many repos to name before the rest are grouped into "Other". */
  maxRepos: 6,
}

export const experience: ExperienceItem[] = [
  {
    type: 'education',
    title: 'High School Diploma',
    org: 'Your School', // TODO
    period: '2023 — 2027',
    description: 'Relevant coursework, clubs, or a particular focus.',
  },
  {
    type: 'activity',
    title: 'Coding Club Member',
    org: 'Your School', // TODO
    period: '2024 — Present',
    description: 'What you did and what you contributed.',
    highlights: ['Built something with a team', 'Helped others debug their code'],
  },
  // Hidden until the real role is filled in. Replace the details below and
  // uncomment the block to show it:
  // {
  //   type: 'work',
  //   title: 'Your Job or Internship',
  //   org: 'Company Name',
  //   period: 'Summer 2025',
  //   description: 'One line about your role and the impact you had.',
  //   highlights: ['Shipped a feature that did X', 'Worked with Y technology'],
  // },
]

export const contact = {
  heading: "Let's build something",
  blurb:
    "I'm open to internships, collaborations, and interesting problems. The fastest way to reach me is email.",
}
