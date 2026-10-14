// GitHub Pages serves 404.html for any unknown path. Since this is a single-page
// app with client-side routing, copying the built index.html there lets deep
// links like /portfolio/projects work on a hard refresh or when shared directly.
import { copyFileSync, existsSync } from 'node:fs'

const index = 'dist/index.html'

if (!existsSync(index)) {
  console.error(`Could not find ${index}. Run the build before this script.`)
  process.exit(1)
}

copyFileSync(index, 'dist/404.html')
console.log('Copied dist/index.html -> dist/404.html (SPA deep links)')
