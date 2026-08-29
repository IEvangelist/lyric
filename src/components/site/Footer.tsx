import { Heart, Telescope } from 'lucide-react'
import { copyrightNotice, LICENSE_NAME, LICENSE_URL } from '@/lib/site-meta'

export function Footer() {
  return (
    <footer className="px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 text-sm text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Telescope className="size-4 text-primary" />
            Lyric
          </div>
          <p className="mt-3">Reach for the stars.</p>
        </div>
        <div className="sm:text-right">
          <p className="flex items-center gap-1.5 sm:justify-end">
            Made with <Heart className="size-3.5 fill-primary text-primary" /> for Lyric
          </p>
          <p className="mt-3 text-xs text-muted-foreground/80">
            {copyrightNotice()} <span aria-hidden="true">/</span>{' '}
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="noreferrer license"
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {LICENSE_NAME} Licensed
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
