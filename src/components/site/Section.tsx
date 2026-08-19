import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/Reveal'

type SectionProps = {
  id?: string
  eyebrow?: string
  title?: string
  description?: string
  children: ReactNode
  className?: string
  align?: 'center' | 'left'
}

export function Section({ id, eyebrow, title, description, children, className, align = 'center' }: SectionProps) {
  const centered = align === 'center'
  return (
    <section id={id} className={cn('relative scroll-mt-24 px-4 py-24 sm:py-32', className)}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title || description) && (
          <Reveal className={cn('mb-14 max-w-2xl', centered && 'mx-auto text-center')}>
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  'mt-4 max-w-xl text-muted-foreground text-pretty',
                  centered && 'mx-auto',
                )}
              >
                {description}
              </p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
