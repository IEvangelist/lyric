import { Heart, Telescope } from 'lucide-react'

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
          Made with <Heart className="size-3.5 fill-primary text-primary" /> for Lyric ·{' '}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
