/**
 * GitHub's linguist colors for the languages this site is likely to encounter.
 * Only used for the language breakdown bar, so a missing language falls back to
 * a neutral gray rather than breaking anything.
 */
const LANGUAGE_COLORS: Record<string, string> = {
  'C#': '#178600',
  'C++': '#f34b7d',
  Assembly: '#6E4C13',
  Astro: '#ff5a03',
  Batchfile: '#C1F12E',
  C: '#555555',
  CSS: '#563d7c',
  Cython: '#fedf5b',
  Dart: '#00B4AB',
  Dockerfile: '#384d54',
  Elixir: '#6e4a7e',
  GLSL: '#5686a5',
  Go: '#00ADD8',
  HTML: '#e34c26',
  Haskell: '#5e5086',
  Java: '#b07219',
  JavaScript: '#f1e05a',
  Kotlin: '#A97BFF',
  Less: '#1d365d',
  Lua: '#000080',
  Makefile: '#427819',
  PHP: '#4F5D95',
  PowerShell: '#012456',
  Python: '#3572A5',
  Ruby: '#701516',
  Rust: '#dea584',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Svelte: '#ff3e00',
  Swift: '#F05138',
  TypeScript: '#3178c6',
  Vue: '#41b883',
  Zig: '#ec915c',
}

/** Color used for "Other" and any language missing from the map. */
export const FALLBACK_LANGUAGE_COLOR = 'oklch(0.6 0.01 285)'

export function languageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? FALLBACK_LANGUAGE_COLOR
}
