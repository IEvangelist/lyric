import { Heart, Telescope } from 'lucide-react'
import { copyrightNotice, LICENSE_NAME, LICENSE_URL } from '@/lib/site-meta'

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Telescope className="size-4 text-primary" />
          Lyric
        </div>
        <p>Reach for the stars.</p>
        <p className="flex items-center gap-1.5">
          Made with <Heart className="size-3.5 fill-primary text-primary" /> for Lyric
        </p>
        <p className="text-xs text-muted-foreground/80">
          {copyrightNotice()} ·{' '}
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
    </footer>
  )
}
