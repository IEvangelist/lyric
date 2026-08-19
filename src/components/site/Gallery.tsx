import { useState } from 'react'
import { Camera, Play } from 'lucide-react'
import type { Capture } from '@/lib/site-data'
import { captures } from '@/lib/site-data'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/Reveal'
import { Lightbox } from '@/components/Lightbox'
import { Section } from './Section'

function CaptureCard({ capture, onOpen }: { capture: Capture; onOpen: () => void }) {
  const isVideo = capture.kind === 'video'
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-xl text-left ring-1 ring-white/10 transition-all outline-none hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={capture.image}
          alt={capture.title}
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
            {isVideo ? <Play className="size-3" /> : <Camera className="size-3" />}
            {isVideo ? 'Video' : 'Photo'}
          </Badge>
        </div>
      </div>
    </button>
  )
}

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
            <CaptureCard capture={capture} onOpen={() => setOpenIndex(index)} />
          </Reveal>
        ))}
      </div>

      <Lightbox
        item={openIndex === null ? null : captures[openIndex]}
        onClose={() => setOpenIndex(null)}
        hasPrev
        hasNext
        onPrev={() =>
          setOpenIndex((index) =>
            index === null ? index : (index + captures.length - 1) % captures.length,
          )
        }
        onNext={() =>
          setOpenIndex((index) => (index === null ? index : (index + 1) % captures.length))
        }
      />
    </Section>
  )
}
