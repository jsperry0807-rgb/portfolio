# Portfolio

Personal portfolio site built with React, TypeScript, and Vite. Deployed automatically to GitHub Pages.

**Live site:** https://jsperry0807-rgb.github.io/portfolio/

## Stack

- **React 19** + **TypeScript** (Vite)
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui** — components live in `src/components/ui`, config in `components.json`
- **Framer Motion** — animations
- **Lucide React** — icons
- **Font:** Geist Variable (`@fontsource-variable/geist`)

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
npm run lint     # oxlint
```

## Project structure

```
src/
  components/ui/   # shadcn components
  lib/utils.ts     # cn() class-merge helper
  assets/          # images
  App.tsx          # root component
  index.css        # Tailwind import + shadcn theme tokens (light/dark)
```

## Adding shadcn components

```bash
npx shadcn@latest add card
npx shadcn@latest add dialog dropdown-menu
```

Notes on this project's setup:

- The `@/*` path alias maps to `src/*`. It is declared in **both** `tsconfig.json` and
  `tsconfig.app.json` — the shadcn CLI reads the root `tsconfig.json`, so removing it there
  breaks `shadcn add`/`init`.
- TypeScript 7 removed `baseUrl`, so aliases use `paths` on its own.
- Dark mode uses the `.dark` class variant (see `src/index.css`).

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes
`dist/` to GitHub Pages. The workflow can also be run manually from the Actions tab
("Run workflow") via `workflow_dispatch`.

`vite.config.ts` sets `base: './'` (relative paths), so the build works whether the site is served
from a subpath (`/portfolio/`) or a custom domain, with no config changes.
