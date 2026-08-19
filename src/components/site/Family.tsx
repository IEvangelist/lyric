import { useState } from 'react'
import family from '@/assets/family-ksc.jpg'
import { Reveal } from '@/components/Reveal'
import { Lightbox } from '@/components/Lightbox'
import { Section } from './Section'

const familyAlt = "Lyric with his family at NASA's Kennedy Space Center Visitor Complex"

export function Family() {
  const [open, setOpen] = useState(false)

  return (
    <Section
      id="family"
      title="Family & the final frontier"
      description="A trip to NASA's Kennedy Space Center: towering rockets, the Space Shuttle Atlantis, and the whole crew together."
    >
      <Reveal className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-2 ring-1 ring-white/5 backdrop-blur-sm transition hover:ring-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <img
            src={family}
            alt={familyAlt}
            loading="lazy"
            className="w-full rounded-xl transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </button>
      </Reveal>

      <Lightbox
        item={
          open
            ? {
                title: 'Kennedy Space Center',
                subtitle: 'NASA Visitor Complex, Florida',
                image: family,
                kind: 'image',
              }
            : null
        }
        onClose={() => setOpen(false)}
      />
    </Section>
  )
}
