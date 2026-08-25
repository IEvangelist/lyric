// Share-link helpers. `getShareUrl` points at the crawlable per-image share
// page (see the `lyric-og-share` Vite plugin), so pasted links unfurl with a
// rich card and then deep-link into the SPA zoom view.

export type SharePlatformKey =
  | 'x'
  | 'facebook'
  | 'linkedin'
  | 'reddit'
  | 'bluesky'
  | 'whatsapp'
  | 'telegram'
  | 'pinterest'
  | 'email'

export type ShareTarget = {
  key: SharePlatformKey
  label: string
  href: string
}

/** Absolute URL of the share page for a capture id, e.g. `.../lyric/share/lagoon/`. */
export function getShareUrl(id: string): string {
  const base = import.meta.env.BASE_URL
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return `${origin}${base}share/${encodeURIComponent(id)}/`
}

type ShareInput = {
  url: string
  title: string
  text: string
  image?: string
}

/** Build the ordered list of platform share links for a capture. */
export function buildShareTargets({ url, title, text, image }: ShareInput): ShareTarget[] {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const body = encodeURIComponent(text)
  const textWithUrl = encodeURIComponent(`${text} ${url}`)
  const media = image ? encodeURIComponent(image) : ''

  return [
    { key: 'x', label: 'X', href: `https://twitter.com/intent/tweet?text=${body}&url=${u}` },
    { key: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    { key: 'reddit', label: 'Reddit', href: `https://www.reddit.com/submit?url=${u}&title=${t}` },
    { key: 'bluesky', label: 'Bluesky', href: `https://bsky.app/intent/compose?text=${textWithUrl}` },
    { key: 'whatsapp', label: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${textWithUrl}` },
    { key: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${body}` },
    {
      key: 'pinterest',
      label: 'Pinterest',
      href: `https://www.pinterest.com/pin/create/button/?url=${u}&media=${media}&description=${t}`,
    },
    { key: 'email', label: 'Email', href: `mailto:?subject=${t}&body=${textWithUrl}` },
  ]
}
