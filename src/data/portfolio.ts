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
}

export interface SkillGroup {
  title: string
  items: string[]
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
  name: 'Your Name', // TODO
  role: 'Student & Developer',
  /** Shown under your name in the hero. Keep it to a sentence or two. */
  tagline:
    'I build web apps and tinker with whatever catches my interest. Currently focused on learning TypeScript and shipping side projects.',
  location: 'Your City, State', // TODO
  email: 'you@example.com', // TODO
  /** Shown as a pill at the top of the hero. Set to '' to hide it. */
  availability: 'Open to internships and collaborations',
  /**
   * Drop your resume in the `public/` folder and set this to the file name,
   * e.g. 'resume.pdf'. Set it to '' to hide the resume buttons entirely.
   */
  resumeUrl: 'resume.pdf',
}

export const nav: NavItem[] = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/experience', label: 'Experience' },
  { path: '/contact', label: 'Contact' },
]

export const socials: Social[] = [
  // TODO: update these links
  { label: 'GitHub', href: 'https://github.com/jsperry0807-rgb', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle', icon: 'linkedin' },
  { label: 'Email', href: 'mailto:you@example.com', icon: 'mail' },
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

export const projects: Project[] = [
  {
    title: 'Project One', // TODO
    description:
      'A short description of what this project does, why you built it, and what you learned along the way.',
    tags: ['React', 'TypeScript', 'Tailwind'],
    year: '2026',
    repo: 'https://github.com/jsperry0807-rgb',
    live: '',
    featured: true,
  },
  {
    title: 'Project Two', // TODO
    description:
      'Another project. Mention the interesting technical problem you solved, not just the features.',
    tags: ['Vite', 'Framer Motion'],
    year: '2025',
    repo: 'https://github.com/jsperry0807-rgb',
    featured: true,
  },
  {
    title: 'Project Three', // TODO
    description: 'Even a small tool or school project belongs here if it shows something you can do.',
    tags: ['JavaScript'],
    year: '2025',
    repo: 'https://github.com/jsperry0807-rgb',
  },
  {
    title: 'Project Four', // TODO
    description: 'Swap this one out, or delete it if you only want to show a few projects.',
    tags: ['Python'],
    year: '2024',
    repo: 'https://github.com/jsperry0807-rgb',
  },
]

export const skillGroups: SkillGroup[] = [
  { title: 'Languages', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS'] },
  { title: 'Frameworks & Libraries', items: ['React', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion'] },
  { title: 'Tools', items: ['Git', 'GitHub', 'Vite', 'VS Code'] },
]

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
  {
    type: 'work',
    title: 'Your Job or Internship',
    org: 'Company Name', // TODO
    period: 'Summer 2025',
    description: 'One line about your role and the impact you had.',
    highlights: ['Shipped a feature that did X', 'Worked with Y technology'],
  },
]

export const contact = {
  heading: "Let's build something",
  blurb:
    "I'm open to internships, collaborations, and interesting problems. The fastest way to reach me is email.",
}
