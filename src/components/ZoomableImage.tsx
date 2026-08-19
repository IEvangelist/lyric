import { useState, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

type ZoomableImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}

export function ZoomableImage({ src, alt, className, imgClassName }: ZoomableImageProps) {
  const [zoomed, setZoomed] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    if (!zoomed) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setOrigin(`${x}% ${y}%`)
  }

  return (
    <div
      className={cn(
        'relative flex h-[50vh] items-center justify-center overflow-hidden rounded-lg bg-black/30 sm:h-[64vh]',
        className,
      )}
      onMouseMove={handleMove}
      onMouseLeave={() => setOrigin('50% 50%')}
      onDoubleClick={() => setZoomed(false)}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        onClick={() => setZoomed((value) => !value)}
        style={{ transformOrigin: origin }}
        className={cn(
          'max-h-full max-w-full select-none object-contain transition-transform duration-300 ease-out',
          zoomed ? 'scale-[2.4] cursor-zoom-out' : 'cursor-zoom-in',
          imgClassName,
        )}
      />
    </div>
  )
}
