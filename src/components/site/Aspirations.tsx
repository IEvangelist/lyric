import { GraduationCap, Rocket, Telescope } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Section } from './Section'

const roadmap = [
  {
    icon: Telescope,
    title: 'Keep exploring',
    text: 'Photograph more deep-sky objects, one clear night at a time.',
  },
  {
    icon: GraduationCap,
    title: 'Study astrophysics',
    text: 'Head to college to study the physics of stars and galaxies.',
  },
  {
    icon: Rocket,
    title: 'Decode the universe',
    text: 'Turn curiosity into discovery about how it all works.',
  },
]

export function Aspirations() {
  return (
    <Section id="goals" title="Aiming for astrophysics">
      <div className="grid items-stretch gap-12 py-4 md:grid-cols-2 md:gap-16">
        <Reveal>
          <figure className="flex h-full flex-col justify-between">
            <blockquote className="text-2xl font-medium leading-snug tracking-[-0.02em] text-balance sm:text-3xl">
              “The cosmos is within us. We are made of star-stuff.”
            </blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="block font-medium text-foreground">Carl Sagan</span>
              <span className="text-muted-foreground">Astronomer</span>
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={120}>
          <figure className="flex h-full flex-col justify-between">
            <blockquote className="text-2xl font-medium leading-snug tracking-[-0.02em] text-balance sm:text-3xl">
              “The universe is under no obligation to make sense to you.”
            </blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="block font-medium text-foreground">Neil deGrasse Tyson</span>
              <span className="text-muted-foreground">Astrophysicist</span>
            </figcaption>
          </figure>
        </Reveal>
      </div>

      <div className="mt-14 grid items-start gap-8 sm:grid-cols-3">
        {roadmap.map((step, index) => (
          <Reveal key={step.title} delay={index * 90}>
            <article>
              <step.icon className="size-5 text-primary" />
              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-pretty text-muted-foreground">{step.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
