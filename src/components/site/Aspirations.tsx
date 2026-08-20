import { GraduationCap, Rocket, Telescope } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Section } from './Section'

const roadmap = [
  { icon: Telescope, title: 'Keep exploring', text: 'Photograph more deep-sky objects, one clear night at a time.' },
  { icon: GraduationCap, title: 'Study astrophysics', text: 'Head to college to study the physics of stars and galaxies.' },
  { icon: Rocket, title: 'Decode the universe', text: 'Turn curiosity into discovery about how it all works.' },
]

export function Aspirations() {
  return (
    <Section id="goals" title="Aiming for astrophysics">
      <Reveal className="mx-auto max-w-3xl">
        <figure className="rounded-2xl border border-white/10 bg-card/50 px-6 py-10 backdrop-blur-sm sm:px-12">
          <blockquote className="text-center text-2xl font-medium text-balance sm:text-3xl">
            “The cosmos is within us. We are made of star-stuff.”
          </blockquote>
          <figcaption className="mt-4 text-center text-sm text-muted-foreground">
            Carl Sagan
          </figcaption>
        </figure>
      </Reveal>

      <div className="mt-14 grid gap-8 sm:grid-cols-3">
        {roadmap.map((step, index) => (
          <Reveal key={step.title} delay={index * 90}>
            <div className="relative flex h-full flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-semibold text-primary">
                  0{index + 1}
                </span>
                <span className="hidden h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent sm:block" />
              </div>
              <div className="flex items-center gap-2">
                <step.icon className="size-4 text-primary" />
                <h3 className="font-semibold">{step.title}</h3>
              </div>
              <p className="text-sm text-pretty text-muted-foreground">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-16 max-w-3xl">
        <figure className="border-l-2 border-primary/50 pl-6">
          <blockquote className="text-lg text-pretty text-foreground/90 sm:text-xl">
            “The universe is under no obligation to make sense to you.”
          </blockquote>
          <figcaption className="mt-3 text-sm font-medium">
            Neil deGrasse Tyson <span className="text-muted-foreground">· Astrophysicist</span>
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  )
}
