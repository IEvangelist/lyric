// Pure, DOM-free helpers that render the per-image share pages and sitemap.
//
// These are used in two places:
//   1. The Vite build (`generateBundle`) emits one static HTML file per
//      capture at `share/<id>/index.html` plus `sitemap.xml`.
//   2. The Vite dev middleware serves the same HTML on the fly so the OG
//      preview can be exercised locally without a full build.
//
// Social crawlers (Facebook, X, LinkedIn, Slack, Discord, Bluesky, ...) do not
// execute JavaScript, so the crawlable OpenGraph / Twitter / JSON-LD metadata
// must live in the server-rendered <head>. Human visitors get a matching dark
// splash that then hands off smoothly to the SPA "zoom mode" deep link.

import type { Capture } from '../src/lib/captures.ts'
import { copyrightNotice } from '../src/lib/site-meta.ts'

export type SiteConfig = {
  /** Absolute origin with no trailing slash, e.g. `https://ievangelist.github.io`. */
  origin: string
  /** App base path with leading and trailing slash, e.g. `/lyric/`. */
  base: string
  siteName: string
  siteDescription: string
  author: string
  licenseName: string
  licenseUrl: string
}

const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Escape a string for safe use in HTML text and double-quoted attributes. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => escapeMap[char])
}

/** Serialize JSON-LD, neutralizing `<` so it can never break out of the script. */
function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

/** Join origin + base + a base-relative path into an absolute URL. */
export function absoluteUrl(config: SiteConfig, relativePath: string): string {
  return `${config.origin}${config.base}${relativePath.replace(/^\/+/, '')}`
}

/** Absolute, crawlable URL of the share page for a capture. */
export function shareUrl(config: SiteConfig, capture: Capture): string {
  return `${config.origin}${config.base}share/${capture.id}/`
}

/** SPA deep link (absolute URL) that opens the capture in zoom mode. */
export function appDeepLink(config: SiteConfig, capture: Capture): string {
  return `${config.origin}${config.base}?photo=${encodeURIComponent(capture.id)}`
}

function structuredData(config: SiteConfig, capture: Capture) {
  const url = shareUrl(config, capture)
  const imageUrl = absoluteUrl(config, capture.image)
  const homeUrl = `${config.origin}${config.base}`

  const person = {
    '@type': 'Person',
    name: config.author,
    url: homeUrl,
  }

  const website = {
    '@type': 'WebSite',
    name: config.siteName,
    url: homeUrl,
  }

  const image = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${url}#image`,
    name: capture.title,
    caption: capture.subtitle,
    description: capture.description,
    contentUrl: imageUrl,
    thumbnailUrl: imageUrl,
    url,
    width: capture.width,
    height: capture.height,
    representativeOfPage: true,
    creator: person,
    copyrightHolder: person,
    creditText: config.author,
    copyrightNotice: copyrightNotice(),
    copyrightYear: new Date().getFullYear(),
    license: config.licenseUrl,
    acquireLicensePage: homeUrl,
    isPartOf: website,
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
      { '@type': 'ListItem', position: 2, name: 'Gallery', item: `${homeUrl}#gallery` },
      { '@type': 'ListItem', position: 3, name: capture.title, item: url },
    ],
  }

  const graph: unknown[] = [image, breadcrumb]

  if (capture.kind === 'video' && capture.video) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: capture.title,
      description: capture.description,
      thumbnailUrl: [imageUrl],
      contentUrl: absoluteUrl(config, capture.video),
      embedUrl: url,
      creator: person,
      isPartOf: website,
    })
  }

  return graph
}

export function renderSharePage(config: SiteConfig, capture: Capture): string {
  const url = shareUrl(config, capture)
  const imageUrl = absoluteUrl(config, capture.image)
  const target = appDeepLink(config, capture)
  const title = `${capture.title} - ${config.siteName}`
  const isHttps = config.origin.startsWith('https://')
  const isVideo = capture.kind === 'video'
  const copyright = copyrightNotice()

  const secureUrlTag = isHttps
    ? `\n    <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />`
    : ''

  const videoMeta =
    isVideo && capture.video
      ? `
    <meta property="og:video" content="${escapeHtml(absoluteUrl(config, capture.video))}" />
    <meta property="og:video:type" content="video/mp4" />
    <meta name="twitter:player:stream" content="${escapeHtml(absoluteUrl(config, capture.video))}" />`
      : ''

  return `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(capture.description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="${escapeHtml(config.author)}" />
    <meta name="copyright" content="${escapeHtml(copyright)}" />
    <link rel="license" href="${escapeHtml(config.licenseUrl)}" />
    <meta name="theme-color" content="#12101f" />
    <link rel="icon" type="image/svg+xml" href="${escapeHtml(config.base)}favicon.svg" />

    <meta property="og:type" content="${isVideo ? 'video.other' : 'article'}" />
    <meta property="og:site_name" content="${escapeHtml(config.siteName)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${escapeHtml(capture.title)}" />
    <meta property="og:description" content="${escapeHtml(capture.description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />${secureUrlTag}
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="${capture.width}" />
    <meta property="og:image:height" content="${capture.height}" />
    <meta property="og:image:alt" content="${escapeHtml(capture.alt)}" />${videoMeta}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(capture.title)}" />
    <meta name="twitter:description" content="${escapeHtml(capture.description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(capture.alt)}" />

    <meta property="article:author" content="${escapeHtml(config.author)}" />
    <meta property="article:section" content="Astrophotography" />

    <script type="application/ld+json">${jsonLd(structuredData(config, capture))}</script>

    <script>
      // Crawlers don't run JS, so they still index the full head + splash below.
      // Human visitors are handed straight to the SPA zoom view before this page
      // paints, so the interactive result loads smoothly with no flash of splash.
      (function () {
        try { location.replace(${JSON.stringify(target)}); } catch (e) {}
      })();
    </script>

    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      html, body { margin: 0; height: 100%; }
      body {
        background: oklch(0.15 0.028 275);
        color: #f4f2fb;
        font-family: 'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif;
        display: grid;
        place-items: center;
        min-height: 100dvh;
        padding: 3.5rem 1.25rem;
        background-image:
          radial-gradient(1200px 820px at 50% -12%, oklch(0.30 0.06 285 / 0.22), transparent 62%),
          radial-gradient(1000px 900px at 50% 120%, oklch(0.26 0.05 330 / 0.14), transparent 60%);
      }
      .stage { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; max-width: min(92vw, 1100px); }
      .frame {
        position: relative;
        border-radius: 0.9rem;
        overflow: hidden;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
        opacity: 0;
        transform: scale(0.965);
        animation: rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      .frame img { display: block; max-height: 74vh; max-width: 92vw; object-fit: contain; }
      .watermark {
        position: absolute;
        right: 0.6rem;
        bottom: 0.55rem;
        margin: 0;
        padding: 0.18rem 0.5rem;
        font-size: 0.72rem;
        letter-spacing: 0.01em;
        color: rgba(244, 242, 251, 0.82);
        background: rgba(10, 8, 20, 0.32);
        border-radius: 0.45rem;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(2px);
        pointer-events: none;
      }
      .caption { max-width: 42rem; text-align: center; }
      .caption h1 { font-size: 1.4rem; font-weight: 600; letter-spacing: -0.01em; margin: 0; }
      .caption .sub { margin: 0.35rem 0 0; font-size: 0.9rem; color: #b7a6f0; }
      .caption p { margin: 0.55rem auto 0; max-width: 34rem; font-size: 0.9rem; line-height: 1.5; color: #b9b4cc; }
      .fly { opacity: 0; transform: translateY(14px); animation: fly 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      .cta { margin-top: 0.4rem; display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #cbb6ff; text-decoration: none; }
      .cta:hover { text-decoration: underline; }
      @keyframes rise { to { opacity: 1; transform: none; } }
      @keyframes fly { to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) {
        .frame, .fly { animation: none; opacity: 1; transform: none; }
      }
    </style>
  </head>
  <body>
    <main class="stage">
      <div class="frame">
        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(capture.alt)}" width="${capture.width}" height="${capture.height}" />
        <span class="watermark">${escapeHtml(copyright)}</span>
      </div>
      <div class="caption">
        <h1 class="fly" style="animation-delay: 0.12s">${escapeHtml(capture.title)}</h1>
        <p class="sub fly" style="animation-delay: 0.22s">${escapeHtml(capture.subtitle)}</p>
        <p class="fly" style="animation-delay: 0.32s">${escapeHtml(capture.description)}</p>
        <a class="cta fly" style="animation-delay: 0.42s" href="${escapeHtml(target)}">Open in the interactive gallery &rarr;</a>
      </div>
    </main>
  </body>
</html>
`
}

/**
 * Base SEO tags injected into the SPA's index.html <head> at build/dev time.
 * Centralized here so the home page shares one source of truth (origin, author,
 * license, dynamic copyright year) with the per-image share pages.
 */
export function renderBaseHeadTags(config: SiteConfig): string {
  const homeUrl = `${config.origin}${config.base}`

  const person = {
    '@type': 'Person',
    name: config.author,
    url: homeUrl,
    jobTitle: 'Astrophotographer',
  }

  const website = {
    '@type': 'WebSite',
    name: config.siteName,
    url: homeUrl,
    description: config.siteDescription,
    inLanguage: 'en',
    author: person,
    copyrightHolder: person,
    copyrightYear: new Date().getFullYear(),
    copyrightNotice: copyrightNotice(),
    license: config.licenseUrl,
  }

  const graph = { '@context': 'https://schema.org', '@graph': [person, website] }

  return `    <link rel="canonical" href="${escapeHtml(homeUrl)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="${escapeHtml(config.author)}" />
    <meta name="copyright" content="${escapeHtml(copyrightNotice())}" />
    <link rel="license" href="${escapeHtml(config.licenseUrl)}" />
    <link rel="sitemap" type="application/xml" href="${escapeHtml(config.base)}sitemap.xml" />
    <script type="application/ld+json">${jsonLd(graph)}</script>`
}

export function renderSitemap(config: SiteConfig, captures: Capture[]): string {  const homeUrl = `${config.origin}${config.base}`
  const urls = [homeUrl, ...captures.map((capture) => shareUrl(config, capture))]
  const body = urls
    .map(
      (loc, index) =>
        `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n    <priority>${index === 0 ? '1.0' : '0.7'}</priority>\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}
