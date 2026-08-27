import { useEffect, useRef, useState } from 'react'
import { Camera, Images, Play } from 'lucide-react'
import type { Capture } from '@/lib/site-data'
import { captures, shotsForCapture } from '@/lib/site-data'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/Reveal'
import { Lightbox, type LightboxItem } from '@/components/Lightbox'
import { Section } from './Section'

type GalleryItem = {
  captureIndex: number
  shotIndex: number
  item: LightboxItem
}

const galleryItems: GalleryItem[] = captures.flatMap((capture, captureIndex) => {
  const shots = shotsForCapture(capture)
  return shots.map((shot, shotIndex) => ({
    captureIndex,
    shotIndex,
    item: {
      id: capture.id,
      title: capture.title,
      subtitle: capture.subtitle,
      description: capture.description,
      kind: capture.kind,
      video: capture.video,
      poster: capture.poster,
      ...shot,
      stack:
        shots.length > 1
          ? {
              current: shotIndex + 1,
              total: shots.length,
              isLatest: shotIndex === 0,
            }
          : undefined,
    },
  }))
})

/** Resolve the gallery item encoded in a `?photo=<id>&shot=<number>` query string. */
function indexFromSearch(search: string): number | null {
  const params = new URLSearchParams(search)
  const id = params.get('photo')
  if (!id) return null
  const requestedShot = Number.parseInt(params.get('shot') ?? '1', 10) - 1
  const found = galleryItems.findIndex(
    ({ item, shotIndex }) => item.id === id && shotIndex === requestedShot,
  )
  return found === -1 ? null : found
}

function CaptureCard({ capture, onOpen }: { capture: Capture; onOpen: () => void }) {
  const isVideo = capture.kind === 'video'
  const shotCount = shotsForCapture(capture).length
  const isStack = shotCount > 1
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={isStack ? `Open ${capture.title}, ${shotCount} photos` : undefined}
      className="group relative block w-full overflow-hidden rounded-xl text-left ring-1 ring-white/10 transition-all outline-none hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={capture.image}
          alt={capture.alt}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
        {isVideo && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
              <Play className="size-6 translate-x-0.5 fill-current" />
            </span>
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div>
            <h3 className="text-lg font-semibold">{capture.title}</h3>
            <p className="text-xs text-muted-foreground">{capture.subtitle}</p>
          </div>
          <Badge variant="secondary" className="gap-1 backdrop-blur-sm">
            {isVideo ? (
              <Play className="size-3" />
            ) : isStack ? (
              <Images className="size-3" />
            ) : (
              <Camera className="size-3" />
            )}
            {isVideo ? 'Video' : isStack ? `${shotCount} photos` : 'Photo'}
          </Badge>
        </div>
      </div>
    </button>
  )
}

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(() =>
    typeof window === 'undefined' ? null : indexFromSearch(window.location.search),
  )
  // A shared link cold-boots straight into zoom mode; that first open paints an
  // opaque backdrop so the page behind never flashes. Every later open fades.
  const [entrance, setEntrance] = useState<'instant' | 'fade'>(() =>
    typeof window !== 'undefined' && indexFromSearch(window.location.search) !== null
      ? 'instant'
      : 'fade',
  )
  const syncingFromPop = useRef(false)

  const openAt = (index: number) => {
    setEntrance('fade')
    setOpenIndex(galleryItems.findIndex(({ captureIndex }) => captureIndex === index))
  }

  // Keep the URL in sync so each shot in a stack is deep-linkable.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (syncingFromPop.current) {
      syncingFromPop.current = false
      return
    }
    const url = new URL(window.location.href)
    const currentPhoto = url.searchParams.get('photo')
    const currentShot = url.searchParams.get('shot')
    const active = openIndex === null ? null : galleryItems[openIndex]
    const desiredPhoto = active?.item.id ?? null
    const desiredShot = active && active.shotIndex > 0 ? String(active.shotIndex + 1) : null
    if (currentPhoto === desiredPhoto && currentShot === desiredShot) return
    if (desiredPhoto === null) {
      url.searchParams.delete('photo')
      url.searchParams.delete('shot')
    } else {
      url.searchParams.set('photo', desiredPhoto)
      if (desiredShot === null) url.searchParams.delete('shot')
      else url.searchParams.set('shot', desiredShot)
    }
    // Opening from a closed state adds a history entry so Back closes the view;
    // navigating between photos or closing just rewrites the current entry.
    if (currentPhoto === null && desiredPhoto !== null) window.history.pushState({}, '', url)
    else window.history.replaceState({}, '', url)
  }, [openIndex])

  // Reflect browser back/forward into the open state.
  useEffect(() => {
    const onPop = () => {
      syncingFromPop.current = true
      setEntrance('fade')
      setOpenIndex(indexFromSearch(window.location.search))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <Section
      id="gallery"
      eyebrow="Captured by Lyric"
      title="Through the eyepiece"
      description="Deep-sky objects and our nearest neighbor, every frame photographed by Lyric himself."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {captures.map((capture, index) => (
          <Reveal key={capture.id} delay={index * 110}>
            <CaptureCard capture={capture} onOpen={() => openAt(index)} />
          </Reveal>
        ))}
      </div>

      <Lightbox
        item={openIndex === null ? null : galleryItems[openIndex].item}
        entrance={entrance}
        onClose={() => setOpenIndex(null)}
        hasPrev
        hasNext
        onPrev={() =>
          setOpenIndex((index) =>
            index === null ? index : (index + galleryItems.length - 1) % galleryItems.length,
          )
        }
        onNext={() =>
          setOpenIndex((index) => (index === null ? index : (index + 1) % galleryItems.length))
        }
      />
    </Section>
  )
}
