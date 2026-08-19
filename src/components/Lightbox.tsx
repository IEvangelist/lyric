import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ZoomableImage } from '@/components/ZoomableImage'

export type LightboxItem = {
  title: string
  subtitle?: string
  description?: string
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
}

const controlClass =
  'grid place-items-center rounded-full border border-white/10 bg-white/5 text-foreground/80 backdrop-blur-sm transition hover:bg-white/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none'

export function Lightbox({ item, onClose, onPrev, onNext, hasPrev, hasNext }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!item) return
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowLeft' && hasPrev) onPrev?.()
      else if (event.key === 'ArrowRight' && hasNext) onNext?.()
    }
    document.addEventListener('keydown', onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [item, hasPrev, hasNext, onClose, onPrev, onNext])

  if (!item) return null

  const isVideo = item.kind === 'video'

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 px-4 py-14 backdrop-blur-xl duration-200 animate-in fade-in-0 sm:px-8"
    >
      <button
        ref={closeRef}
        type="button"
        aria-label="Close"
        onClick={(event) => {
          event.stopPropagation()
          onClose()
        }}
        className={`${controlClass} absolute top-4 right-4 z-10 size-10`}
      >
        <X className="size-5" />
      </button>

      {hasPrev && (
        <button
          type="button"
          aria-label="Previous"
          onClick={(event) => {
            event.stopPropagation()
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
            onNext?.()
          }}
          className={`${controlClass} absolute top-1/2 right-3 z-10 size-11 -translate-y-1/2 sm:right-6`}
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      <div className="flex flex-col items-center gap-5" onClick={(event) => event.stopPropagation()}>
        {isVideo ? (
          <video
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
          <ZoomableImage key={item.image} src={item.image} alt={item.title} />
        )}

        <div className="pointer-events-none max-w-2xl text-center">
          <h2 className="font-heading text-xl font-semibold tracking-tight">{item.title}</h2>
          {item.subtitle && <p className="mt-1 text-sm text-primary/80">{item.subtitle}</p>}
          {item.description && (
            <p className="mx-auto mt-2 max-w-xl text-sm text-pretty text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
