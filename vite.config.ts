import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { captures } from './src/lib/captures.ts'
import { AUTHOR, LICENSE_NAME, LICENSE_URL, SITE_DESCRIPTION, SITE_NAME } from './src/lib/site-meta.ts'
import { renderBaseHeadTags, renderSharePage, renderSitemap, type SiteConfig } from './scripts/share-html.ts'

const BASE = '/lyric/'

// Production origin used for absolute OpenGraph URLs at build time. Override
// with SITE_ORIGIN (e.g. `http://localhost:4173`) to preview a built site.
const PROD_ORIGIN = (process.env.SITE_ORIGIN ?? 'https://ievangelist.github.io').replace(/\/+$/, '')

function baseConfig(origin: string): SiteConfig {
  return {
    origin,
    base: BASE,
    siteName: SITE_NAME,
    siteDescription: SITE_DESCRIPTION,
    author: AUTHOR,
    licenseName: LICENSE_NAME,
    licenseUrl: LICENSE_URL,
  }
}

/**
 * Generates the crawlable per-image share pages and sitemap.
 * - In dev, serves them from an on-the-fly middleware (origin derived from the
 *   request) so the OpenGraph preview can be exercised without a build.
 * - In build, emits static `share/<id>/index.html` files plus `sitemap.xml`.
 */
function ogSharePlugin(): Plugin {
  const shareRoute = new RegExp(`^${BASE}share/([^/?#]+)/?(?:index\\.html)?$`)

  return {
    name: 'lyric-og-share',

    transformIndexHtml(html) {
      const tags = renderBaseHeadTags(baseConfig(PROD_ORIGIN))
      return html.replace('</head>', `${tags}\n  </head>`)
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0]

        if (url === `${BASE}sitemap.xml`) {
          const proto = (req.headers['x-forwarded-proto'] as string) ?? 'http'
          const origin = `${proto}://${req.headers.host}`
          res.setHeader('Content-Type', 'application/xml; charset=utf-8')
          res.end(renderSitemap(baseConfig(origin), captures))
          return
        }

        const match = shareRoute.exec(url)
        if (!match) {
          next()
          return
        }

        const capture = captures.find((item) => item.id === decodeURIComponent(match[1]))
        if (!capture) {
          next()
          return
        }

        const proto = (req.headers['x-forwarded-proto'] as string) ?? 'http'
        const origin = `${proto}://${req.headers.host}`
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(renderSharePage(baseConfig(origin), capture))
      })
    },

    generateBundle() {
      const config = baseConfig(PROD_ORIGIN)

      for (const capture of captures) {
        this.emitFile({
          type: 'asset',
          fileName: `share/${capture.id}/index.html`,
          source: renderSharePage(config, capture),
        })
      }

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: renderSitemap(config, captures),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), ogSharePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
