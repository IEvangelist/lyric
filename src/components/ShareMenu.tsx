import { useEffect, useRef, useState } from 'react'
import { Check, Link2, Mail, Share2, TriangleAlert } from 'lucide-react'
import { buildShareTargets, getShareUrl, type SharePlatformKey } from '@/lib/share'
import { cn } from '@/lib/utils'
import {
  BlueskyIcon,
  FacebookIcon,
  LinkedInIcon,
  PinterestIcon,
  RedditIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
} from '@/components/BrandIcons'

type BrandGlyph = React.ComponentType<{ className?: string }>

/** The minimal capture shape the share menu needs. */
export type ShareCapture = {
  id: string
  title: string
  description: string
  image: string
}

const PLATFORM_ICONS: Record<SharePlatformKey, BrandGlyph> = {
  x: XIcon,
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  reddit: RedditIcon,
  bluesky: BlueskyIcon,
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  pinterest: PinterestIcon,
  email: Mail,
}

/**
 * Synchronous clipboard fallback for contexts where the async Clipboard API is
 * unavailable or blocked (sandboxed/proxied iframes, some in-app webviews).
 * Returns whether the copy succeeded so the UI can always report an outcome.
 */
function copyViaExecCommand(text: string): boolean {
  if (typeof document === 'undefined') return false
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '0'
  textarea.style.opacity = '0'
  textarea.style.pointerEvents = 'none'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(textarea)
  return ok
}

type CopyState = 'idle' | 'copied' | 'error'

type ShareMenuProps = {
  capture: ShareCapture
  open: boolean
  onOpenChange: (open: boolean) => void
}

const triggerClass =
  'grid place-items-center rounded-full border border-white/15 bg-black/35 text-white/85 shadow-lg shadow-black/20 backdrop-blur-md transition hover:bg-black/55 hover:text-white active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'

export function ShareMenu({ capture, open, onOpenChange }: ShareMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const shareUrl = getShareUrl(capture.id)
  const title = `${capture.title} — Lyric`
  const text = capture.description
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  const imageAbs = capture.image.startsWith('http') ? capture.image : `${origin}${capture.image}`
  const targets = buildShareTargets({ url: shareUrl, title, text, image: imageAbs })

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  // Close on outside pointer-down while open.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) onOpenChange(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open, onOpenChange])

  // Reset the copy affordance whenever the menu closes.
  useEffect(() => {
    if (!open) setCopyState('idle')
  }, [open])

  async function copyLink() {
    let ok = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        ok = true
      }
    } catch {
      // The async Clipboard API is blocked in some sandboxed/proxied iframes;
      // fall through to the execCommand fallback below.
    }
    if (!ok) ok = copyViaExecCommand(shareUrl)
    setCopyState(ok ? 'copied' : 'error')
    if (ok) window.setTimeout(() => setCopyState('idle'), 2200)
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url: shareUrl })
      onOpenChange(false)
    } catch {
      // User cancelled or share failed; leave the menu open.
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Share"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation()
          onOpenChange(!open)
        }}
        className={`${triggerClass} size-11`}
      >
        <Share2 className="size-5" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={`Share ${capture.title}`}
          onClick={(event) => event.stopPropagation()}
          className="absolute top-13 right-0 z-20 max-h-[calc(100dvh-5rem)] w-[min(18rem,calc(100vw-2rem))] origin-top-right overflow-y-auto rounded-2xl border border-white/10 bg-background/95 p-3 text-left shadow-2xl ring-1 ring-black/40 backdrop-blur-xl duration-150 animate-in fade-in-0 zoom-in-95"
        >
          <p className="px-1 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Share this capture
          </p>

          {canNativeShare && (
            <button
              type="button"
              onClick={nativeShare}
              className="mb-2 flex w-full items-center gap-2 rounded-lg bg-primary/15 px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/25"
            >
              <Share2 className="size-4" />
              Share…
            </button>
          )}

          <div className="grid grid-cols-3 gap-1.5">
            {targets.map((target) => {
              const Icon = PLATFORM_ICONS[target.key]
              return (
                <a
                  key={target.key}
                  href={target.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => onOpenChange(false)}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2 py-3 text-[11px] text-foreground/80 transition hover:border-primary/40 hover:bg-white/10 hover:text-foreground"
                >
                  <Icon className="size-5" />
                  {target.label}
                </a>
              )
            })}
          </div>

          <button
            type="button"
            onClick={copyLink}
            aria-label="Copy link"
            className={cn(
              'mt-2 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition',
              copyState === 'copied' && 'border-emerald-400/40 bg-emerald-400/15 text-emerald-300',
              copyState === 'error' && 'border-amber-400/40 bg-amber-400/10 text-amber-200',
              copyState === 'idle' &&
                'border-white/10 bg-white/5 text-foreground/90 hover:bg-white/10',
            )}
          >
            {copyState === 'copied' ? (
              <Check className="size-4" />
            ) : copyState === 'error' ? (
              <TriangleAlert className="size-4" />
            ) : (
              <Link2 className="size-4" />
            )}
            <span className="truncate" role="status" aria-live="polite">
              {copyState === 'copied'
                ? 'Link copied!'
                : copyState === 'error'
                  ? 'Copy it manually below'
                  : 'Copy link'}
            </span>
          </button>

          {copyState === 'error' && (
            <input
              readOnly
              value={shareUrl}
              onFocus={(event) => event.currentTarget.select()}
              ref={(node) => node?.select()}
              className="mt-1.5 w-full rounded-md border border-amber-400/30 bg-black/40 px-2 py-1.5 text-xs text-foreground/80 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
            />
          )}
        </div>
      )}
    </div>
  )
}
