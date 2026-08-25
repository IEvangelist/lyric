import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ZoomableImage } from '@/components/ZoomableImage'
import { ShareMenu } from '@/components/ShareMenu'
import { copyrightNotice } from '@/lib/site-meta'

export type LightboxItem = {
  /** Present for gallery captures with a crawlable share page; enables sharing. */
  id?: string
  title: string
  subtitle?: string
  description?: string
  alt?: string
  image: string
  kind: 'image' | 'video'
  video?: string
  poster?: string
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
  'grid place-items-center rounded-full border border-white/10 bg-white/5 text-foreground/80 backdrop-blur-sm transition hover:bg-white/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'

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

  const itemId = item?.id

  // Collapse the share popover whenever the visible capture changes.
  useEffect(() => {
    setShareOpen(false)
  }, [itemId])

  useEffect(() => {
    if (!item) return
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (shareOpen) setShareOpen(false)
        else onClose()
      } else if (event.key === 'ArrowLeft' && hasPrev && !shareOpen) {
        onPrev?.()
      } else if (event.key === 'ArrowRight' && hasNext && !shareOpen) {
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
    : 'bg-background/95 duration-200 animate-in fade-in-0'

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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center px-4 py-14 backdrop-blur-xl sm:px-8 ${overlayClass}`}
    >
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
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
          className={`${controlClass} size-10`}
        >
          <X className="size-5" />
        </button>
      </div>

      {hasPrev && (
        <button
          type="button"
          aria-label="Previous"
          onClick={(event) => {
            event.stopPropagation()
            setShareOpen(false)
            onPrev?.()
          }}
          className={`${controlClass} absolute top-1/2 left-3 z-10 size-11 -translate-y-1/2 sm:left-6`}
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          aria-label="Next"
          onClick={(event) => {
            event.stopPropagation()
            setShareOpen(false)
            onNext?.()
          }}
          className={`${controlClass} absolute top-1/2 right-3 z-10 size-11 -translate-y-1/2 sm:right-6`}
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      <div className="flex flex-col items-center gap-5" onClick={(event) => event.stopPropagation()}>
        <div className={`relative ${instant ? 'zoom-media-in' : ''}`}>
          {isVideo ? (
            <video
              key={item.video}
              className="max-h-[78vh] max-w-[92vw] rounded-xl bg-black"
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              poster={item.poster}
            >
              <source src={item.video} type="video/mp4" />
            </video>
          ) : (
            <ZoomableImage
              key={item.image}
              src={item.image}
              alt={item.alt ?? item.title}
              onSwipePrev={onPrev}
              onSwipeNext={onNext}
            />
          )}
          {isVideo && (
            <span className="pointer-events-none absolute right-3 bottom-2 z-10 font-medium tracking-wide text-[10px] text-white/40 select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              {copyrightNotice()}
            </span>
          )}
        </div>

        <div key={item.id} className="pointer-events-none max-w-2xl text-center">
          <h2
            className="fly-in font-heading text-xl font-semibold tracking-tight"
            style={flyDelay(40)}
          >
            {item.title}
          </h2>
          {item.subtitle && (
            <p className="fly-in mt-1 text-sm text-primary/80" style={flyDelay(130)}>
              {item.subtitle}
            </p>
          )}
          {item.description && (
            <p
              className="fly-in mx-auto mt-2 max-w-xl text-sm text-pretty text-muted-foreground"
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
