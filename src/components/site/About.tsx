import { Calendar, MapPin, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { Section } from './Section'

const facts = [
  { icon: Calendar, label: 'Age', value: '14 years old' },
  { icon: MapPin, label: 'Home', value: 'Wisconsin' },
  { icon: Sparkles, label: 'Dream major', value: 'Astrophysics' },
]

export function About() {
  return (
    <Section id="about" title="A stargazer with a plan" align="left">
      <div className="grid items-start gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-7">
          <p className="text-2xl leading-snug tracking-[-0.02em] text-pretty text-muted-foreground sm:text-3xl">
            Lyric is fourteen and endlessly curious about what&apos;s out there. When he
            isn&apos;t pointing a telescope at distant nebulae, he&apos;s logging laps in the
            pool. His goal: study{' '}
            <span className="font-medium text-foreground">astrophysics</span> and help decode
            how the universe works.
          </p>
        </Reveal>

        <Reveal delay={120} className="md:col-span-4 md:col-start-9">
          <dl className="grid gap-7">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-4">
                <fact.icon className="size-5 shrink-0 text-primary" />
                <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                <dd className="ml-auto font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
