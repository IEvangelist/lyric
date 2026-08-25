// Framework-free site metadata shared by the React app and the Vite build.
// Kept DOM/`import.meta`-free so it can be imported from vite.config.ts too.

export const SITE_NAME = 'Lyric: Space & Swimming'

export const SITE_DESCRIPTION =
  'Astrophotography by Lyric — a 14-year-old aspiring astrophysicist and state-level swimmer. Nebulae, galaxies, the Moon, and the Sun captured through a backyard telescope.'

export const AUTHOR = 'Lyric Pine'

export const LICENSE_NAME = 'MIT'

export const LICENSE_URL = 'https://opensource.org/licenses/MIT'

/**
 * Dynamic copyright / watermark line, e.g. `© 2026–present Lyric Pine`.
 * The year is resolved at render time so it never goes stale.
 */
export function copyrightNotice(year: number = new Date().getFullYear()): string {
  return `© ${year}–present ${AUTHOR}`
}
