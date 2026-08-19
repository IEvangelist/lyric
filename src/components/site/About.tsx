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
      <div className="grid gap-10 md:grid-cols-5 md:gap-14">
        <Reveal className="md:col-span-3">
          <p className="text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            Lyric is fourteen and endlessly curious about what&apos;s out there. When he
            isn&apos;t pointing a telescope at distant nebulae, he&apos;s logging laps in the
            pool. His goal: study{' '}
            <span className="font-medium text-foreground">astrophysics</span> and help decode
            how the universe works.
          </p>
        </Reveal>

        <Reveal delay={120} className="md:col-span-2">
          <dl className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-card/40 px-6 backdrop-blur-sm">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-4 py-4">
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
