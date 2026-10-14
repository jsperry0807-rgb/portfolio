import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the site works on GitHub Pages regardless of repo name
  // (e.g. https://user.github.io/portfolio/)
  base: './',
})
