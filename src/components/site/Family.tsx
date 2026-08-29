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
      <Reveal className="max-w-5xl">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl ring-1 ring-white/10 transition-shadow hover:ring-primary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <img
            src={family}
            alt={familyAlt}
            width={1600}
            height={1200}
            loading="lazy"
            className="w-full transition-transform duration-700 group-hover:scale-[1.015]"
          />
        </button>
      </Reveal>

      <Lightbox
        item={
          open
            ? {
                title: 'Kennedy Space Center',
                subtitle: 'NASA Visitor Complex, Florida',
                alt: familyAlt,
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
