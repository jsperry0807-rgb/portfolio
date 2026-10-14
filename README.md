# Portfolio

Personal portfolio site built with React, TypeScript, and Vite. Deployed automatically to GitHub Pages.

**Live site:** https://jsperry0807-rgb.github.io/portfolio/

## Stack

- **React 19** + **TypeScript** (Vite)
- **React Router v8** — multi-page routing with animated page transitions
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui** — components live in `src/components/ui`, config in `components.json`
- **Framer Motion** — page transitions and scroll reveals
- **Lucide React** — icons (brand logos live in `src/components/brand-icons.tsx`)
- **Font:** Geist Variable (`@fontsource-variable/geist`)

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check, build to dist/, generate dist/404.html
npm run preview  # preview the production build locally
npm run lint     # oxlint
```

> `npm run preview` serves the site at **http://localhost:4173/portfolio/** because the build
> uses `base: '/portfolio/'` to match the GitHub Pages sub-path.

## Project structure

```
src/
  pages/            # one file per route
    home.tsx  about.tsx  projects.tsx  experience.tsx  contact.tsx  not-found.tsx
  layouts/
    site-layout.tsx # navbar + footer that persist across navigation
  components/
    ui/             # shadcn components (generated)
    page-transition.tsx  # fade/slide wrapper used by every page
    section.tsx          # shared section shell (eyebrow, heading, reveal)
    navbar.tsx  footer.tsx  hero.tsx  project-card.tsx  social-links.tsx
    brand-icons.tsx      # GitHub / LinkedIn logos (lucide no longer ships brand icons)
  data/
    portfolio.ts    # ALL site content lives here
  lib/
    motion.ts       # shared animation variants
    utils.ts        # cn() class-merge helper
```

## Editing content

Everything you'd want to change — name, tagline, social links, projects, skills, experience —
is in **`src/data/portfolio.ts`**. Placeholder values are marked with `// TODO`.
Components read from that file, so you don't need to touch JSX to update content.

## Adding a page

1. Create `src/pages/blog.tsx`:

   ```tsx
   import { PageTransition } from '@/components/page-transition'
   import { Section } from '@/components/section'

   export function BlogPage() {
     return (
       <PageTransition>
         <Section eyebrow="Blog" title="Writing">
           <p className="text-muted-foreground">Coming soon.</p>
         </Section>
       </PageTransition>
     )
   }
   ```

2. Register the route in `src/App.tsx`:

   ```tsx
   <Route path="/blog" element={<BlogPage />} />
   ```

3. Add it to the nav in `src/data/portfolio.ts`:

   ```ts
   { path: '/blog', label: 'Blog' },
   ```

Wrap the page in `<PageTransition>` and the enter/exit animation is handled for you.

## How the transitions work

- `App.tsx` wraps the routes in `<AnimatePresence mode="wait">` and keys `<Routes>` on
  `location.pathname`, so the router swaps routes while Framer Motion animates.
- `mode="wait"` plays the outgoing page's exit to completion before the incoming page enters,
  which prevents pages from cross-fading into each other.
- The navbar and footer live in `SiteLayout`, *outside* `AnimatePresence`, so they never re-animate.
- `ScrollToTop` resets the scroll position on navigation (using `behavior: 'instant'` so it
  doesn't fight the global `scroll-behavior: smooth`).
- `useReducedMotion()` disables the movement for users with "reduce motion" enabled.

## Routing on GitHub Pages

`vite.config.ts` sets `base: '/portfolio/'` and `main.tsx` derives the router's `basename` from
`import.meta.env.BASE_URL`, so the two can't drift apart.

GitHub Pages serves `dist/404.html` for unknown paths. `scripts/copy-404.mjs` (wired up as
`postbuild`) copies `index.html` there so deep links like `/portfolio/projects` work on a hard
refresh or when shared directly.

**If you rename the repo or add a custom domain,** change `base` in `vite.config.ts` to match
(`'/'` for a custom domain such as `example.com`). Nothing else needs to change.

## Adding shadcn components

```bash
npx shadcn@latest add dialog dropdown-menu
```

Notes on this project's setup:

- The `@/*` path alias maps to `src/*`. It is declared in **both** `tsconfig.json` and
  `tsconfig.app.json` — the shadcn CLI reads the root `tsconfig.json`, so removing it there
  breaks `shadcn add`/`init` with "Could not load the workspace config".
- TypeScript 7 removed `baseUrl`, so aliases use `paths` on its own.
- Dark mode is the default (`<html class="dark">`) and uses the `.dark` class variant.
- The accent color is `--brand` in `src/index.css`, exposed to Tailwind as
  `bg-brand` / `text-brand` / `border-brand`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes
`dist/` to GitHub Pages. The workflow can also be run manually from the Actions tab
("Run workflow") via `workflow_dispatch`.
