import { Button } from '@/components/ui/button'
import { withBase } from '@/lib/site-data'

const andromeda = withBase('media/captures/andromeda-galaxy-m31.jpg')

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[100dvh] overflow-hidden px-4 pt-20 pb-10 sm:pt-24 sm:pb-16"
    >
      <div className="mx-auto grid min-h-[calc(100dvh-7.5rem)] max-w-6xl items-center gap-8 sm:min-h-[calc(100dvh-10rem)] sm:gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-10 lg:gap-12">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-primary">Lyric Pine</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-[4rem]">
            Chasing galaxies and gold.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            A 14-year-old astrophotographer and Wisconsin state-level swimmer, aiming for a future
            in astrophysics.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-9">
            <Button
              size="lg"
              className="h-11 px-6 text-sm"
              nativeButton={false}
              render={<a href="#gallery" />}
            >
              View captures
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 text-sm"
              nativeButton={false}
              render={<a href="#about" />}
            >
              Meet Lyric
            </Button>
          </div>
        </div>

        <figure className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-card">
            <img
              src={andromeda}
              alt="The Andromeda Galaxy, photographed by Lyric through his telescope"
              width={1848}
              height={916}
              fetchPriority="high"
              decoding="async"
              className="w-full"
            />
          </div>
          <figcaption className="mt-4 flex flex-col gap-1 px-1 text-sm sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="font-medium text-foreground">Andromeda Galaxy</p>
              <p className="text-muted-foreground">Messier 31, Andromeda</p>
            </div>
            <time dateTime="2026-08-28" className="text-muted-foreground">
              Captured Aug 28, 2026
            </time>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
