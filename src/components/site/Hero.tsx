import { Button } from '@/components/ui/button'
import { withBase } from '@/lib/site-data'

const lagoon = withBase('media/captures/lagoon-nebula-m8.jpg')

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4"
    >
      <div className="absolute inset-0 -z-10">
        <img src={lagoon} alt="" aria-hidden="true" className="size-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/65 to-background" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          Future astrophysicist · Age 14
        </span>
        <h1 className="text-glow text-6xl font-semibold tracking-tight sm:text-8xl">Lyric</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-balance text-muted-foreground sm:text-xl">
          Chasing galaxies and gold. A young stargazer photographing the cosmos and racing at the
          state level.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="h-11 px-6 text-sm" nativeButton={false} render={<a href="#about" />}>
            Meet Lyric
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 px-6 text-sm"
            nativeButton={false}
            render={<a href="#gallery" />}
          >
            See his captures
          </Button>
        </div>
      </div>
    </section>
  )
}
