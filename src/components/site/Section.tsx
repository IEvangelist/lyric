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

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  align = 'left',
}: SectionProps) {
  const centered = align === 'center'
  return (
    <section id={id} className={cn('relative scroll-mt-24 px-4 py-20 sm:py-28', className)}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || title || description) && (
          <Reveal className={cn('mb-10 max-w-3xl sm:mb-14', centered && 'mx-auto text-center')}>
            {eyebrow && (
              <p className="mb-3 text-sm font-semibold text-primary">{eyebrow}</p>
            )}
            {title && (
              <h2 className="text-4xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  'mt-4 max-w-2xl leading-relaxed text-muted-foreground text-pretty',
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
