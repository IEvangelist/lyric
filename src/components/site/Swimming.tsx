import { Trophy, Waves } from 'lucide-react'
import { strokes } from '@/lib/site-data'
import { Reveal } from '@/components/Reveal'
import { Section } from './Section'

const [featuredStroke, ...supportingStrokes] = strokes

export function Swimming() {
  return (
    <Section
      id="swimming"
      title="Racing for Express"
      description="A Wisconsin state-level competitor for Express, with an earned “A” time standard in freestyle."
    >
      <div className="grid gap-8 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-7">
          <article className="flex h-full min-h-96 flex-col justify-between rounded-2xl border border-primary/25 bg-primary/10 p-8 sm:p-10">
            <div className="flex items-center gap-3 text-sm font-medium text-primary">
              <Trophy className="size-5" />
              Earned time standard
            </div>
            <div className="mt-16">
              <p className="text-6xl font-semibold tracking-[-0.05em] text-foreground sm:text-7xl">
                “A”
              </p>
              <h3 className="mt-4 text-2xl font-semibold">{featuredStroke.name}</h3>
              <p className="mt-2 max-w-md leading-relaxed text-pretty text-muted-foreground">
                {featuredStroke.blurb}
              </p>
            </div>
            <p className="mt-12 text-sm font-medium text-foreground/80">
              Wisconsin state competitor for Express
            </p>
          </article>
        </Reveal>

        <div className="grid content-center gap-12 py-4 md:col-span-5">
          {supportingStrokes.map((stroke, index) => (
            <Reveal key={stroke.name} delay={(index + 1) * 90}>
              <article className="grid grid-cols-[auto_1fr] gap-5">
                <Waves className="mt-1 size-5 text-primary" />
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">{stroke.name}</h3>
                  <p className="mt-2 leading-relaxed text-pretty text-muted-foreground">
                    {stroke.blurb}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
