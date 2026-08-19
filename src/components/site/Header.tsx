import { Telescope } from 'lucide-react'

const links = [
  { href: '#about', label: 'About' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#swimming', label: 'Swimming' },
  { href: '#goals', label: 'Goals' },
]

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-3 flex items-center justify-between rounded-full border border-white/10 bg-background/55 px-4 py-2 backdrop-blur-md">
          <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
            <Telescope className="size-5 text-primary" />
            <span>Lyric</span>
          </a>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
