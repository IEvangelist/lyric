import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, ChevronLeft, ChevronRight, Images, X } from 'lucide-react'
import { ZoomableImage } from '@/components/ZoomableImage'
import { ShareMenu } from '@/components/ShareMenu'
import { formatCaptureDate } from '@/lib/site-data'
import { copyrightNotice } from '@/lib/site-meta'

export type LightboxItem = {
  /** Present for gallery captures with a crawlable share page; enables sharing. */
  id?: string
  title: string
  subtitle?: string
  description?: string
  alt?: string
  image: string
  capturedOn?: string
  kind: 'image' | 'video'
  video?: string
  poster?: string
  stack?: {
    current: number
    total: number
    isLatest: boolean
  }
}

type LightboxProps = {
  item: LightboxItem | null
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  hasPrev?: boolean
  hasNext?: boolean
  /**
   * How the overlay first appears. `instant` (used for shared deep links that
   * cold-boot straight into zoom mode) paints an opaque backdrop immediately so
   * the page behind never flashes; the media and caption fly in on their own.
   * `fade` cross-fades the whole overlay, which looks best when opening from the
   * gallery grid that stays visible behind it.
   */
  entrance?: 'instant' | 'fade'
}

const controlClass =
  'grid place-items-center rounded-full border border-white/15 bg-black/35 text-white/85 shadow-lg shadow-black/20 backdrop-blur-md transition hover:bg-black/55 hover:text-white active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'

function flyDelay(ms: number) {
  return { '--fly-delay': `${ms}ms` } as React.CSSProperties
}

export function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  entrance = 'fade',
}: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [shareOpen, setShareOpen] = useState(false)

  const itemImage = item?.image

  // Collapse the share popover whenever the visible shot changes.
  useEffect(() => {
    setShareOpen(false)
  }, [itemImage])

  useEffect(() => {
    if (!item) return
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (shareOpen) setShareOpen(false)
        else onClose()
      } else if (event.key === 'ArrowLeft' && hasPrev && !shareOpen) {
        event.preventDefault()
        onPrev?.()
      } else if (event.key === 'ArrowRight' && hasNext && !shareOpen) {
        event.preventDefault()
        onNext?.()
      }
    }
    document.addEventListener('keydown', onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [item, hasPrev, hasNext, shareOpen, onClose, onPrev, onNext])

  if (!item) return null

  const isVideo = item.kind === 'video'
  const instant = entrance === 'instant'
  const overlayClass = instant
    ? 'bg-background'
    : 'bg-background duration-200 animate-in fade-in-0'

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={() => {
        if (shareOpen) setShareOpen(false)
        else onClose()
      }}
      onContextMenu={(event) => event.preventDefault()}
      className={`fixed inset-0 z-[100] h-dvh overflow-hidden ${overlayClass}`}
    >
      <div
        className={`lightbox-media absolute inset-0 ${instant ? 'zoom-media-in' : ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        {isVideo ? (
          <div className="relative flex size-full items-center justify-center">
            <video
              key={item.video}
              className="max-h-full max-w-full bg-black object-contain sm:rounded-xl"
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              poster={item.poster}
            >
              <source src={item.video} type="video/mp4" />
            </video>
            <span className="pointer-events-none absolute right-3 bottom-2 z-10 text-[10px] font-medium tracking-wide text-white/40 select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              {copyrightNotice()}
            </span>
          </div>
        ) : (
          <ZoomableImage
            key={item.image}
            src={item.image}
            alt={item.alt ?? item.title}
            onSwipePrev={onPrev}
            onSwipeNext={onNext}
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-black/60 to-transparent"
      />

      {item.stack && (
        <div className="lightbox-top-left pointer-events-none absolute z-10 flex h-9 items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 text-xs font-medium text-white/85 shadow-lg shadow-black/20 backdrop-blur-md">
          <Images className="size-4" />
          <span>
            {item.stack.current} of {item.stack.total}
          </span>
          {item.stack.isLatest && (
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary uppercase">
              Latest
            </span>
          )}
        </div>
      )}

      <div className="lightbox-top-right absolute z-20 flex items-center gap-2">
        {item.id && (
          <ShareMenu
            capture={{
              id: item.id,
              title: item.title,
              description: item.description ?? '',
              image: item.image,
            }}
            open={shareOpen}
            onOpenChange={setShareOpen}
          />
        )}
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={(event) => {
            event.stopPropagation()
            onClose()
          }}
          className={`${controlClass} size-11`}
        >
          <X className="size-5" />
        </button>
      </div>

      {hasPrev && (
        <button
          type="button"
          aria-label="Previous image"
          aria-keyshortcuts="ArrowLeft"
          onClick={(event) => {
            event.stopPropagation()
            setShareOpen(false)
            onPrev?.()
          }}
          className={`${controlClass} lightbox-prev absolute z-10 size-12`}
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          aria-label="Next image"
          aria-keyshortcuts="ArrowRight"
          onClick={(event) => {
            event.stopPropagation()
            setShareOpen(false)
            onNext?.()
          }}
          className={`${controlClass} lightbox-next absolute z-10 size-12`}
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      <div
        key={item.image}
        className="lightbox-caption pointer-events-none absolute inset-x-0 bottom-0 z-[1] text-center"
      >
        <div className="mx-auto w-full max-w-2xl">
          <h2
            className="fly-in font-heading text-lg font-semibold tracking-tight text-white sm:text-xl"
            style={flyDelay(40)}
          >
            {item.title}
          </h2>
          {(item.subtitle || item.capturedOn) && (
            <div
              className="fly-in mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-white/70 sm:text-sm"
              style={flyDelay(130)}
            >
              {item.subtitle && <span className="text-primary/90">{item.subtitle}</span>}
              {item.subtitle && item.capturedOn && <span aria-hidden="true">·</span>}
              {item.capturedOn && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  <time dateTime={item.capturedOn}>{formatCaptureDate(item.capturedOn)}</time>
                </span>
              )}
            </div>
          )}
          {item.description && (
            <p
              className="lightbox-description fly-in mx-auto mt-2 max-w-xl text-sm leading-relaxed text-pretty text-white/65"
              style={flyDelay(220)}
            >
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
