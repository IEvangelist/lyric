import { Trophy, Waves } from 'lucide-react'
import { strokes } from '@/lib/site-data'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Reveal } from '@/components/Reveal'
import { Section } from './Section'

export function Swimming() {
  return (
    <Section
      id="swimming"
      title="Racing for Express"
      description="A Wisconsin state-level competitor for Express, with an earned “A” time standard in freestyle."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {strokes.map((stroke, index) => (
          <Reveal key={stroke.name} delay={index * 90}>
            <Card
              className={cn(
                'h-full gap-4 border-l-2 py-7 pr-5 pl-6 ring-white/10 backdrop-blur-sm',
                stroke.standard ? 'border-l-aurora' : 'border-l-white/10',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <Waves className="size-5 text-aurora" />
                {stroke.standard && (
                  <Badge variant="secondary" className="gap-1">
                    <Trophy className="size-3 text-aurora" />
                    “A” standard
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{stroke.name}</h3>
                <p className="mt-1 text-sm text-pretty text-muted-foreground">{stroke.blurb}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-card/60 px-6 py-5 text-center backdrop-blur-sm sm:flex-row sm:gap-3">
          <Trophy className="size-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Wisconsin state competitor</span> swimming
            for Express.
          </p>
        </div>
      </Reveal>
    </Section>
  )
}
