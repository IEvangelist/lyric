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
      className={cn('relative inline-flex overflow-hidden rounded-xl', className)}
      onMouseMove={handleMove}
      onMouseLeave={() => setOrigin('50% 50%')}
      onDoubleClick={() => setZoomed(false)}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        onClick={(event) => {
          event.stopPropagation()
          setZoomed((value) => !value)
        }}
        style={{ transformOrigin: origin }}
        className={cn(
          'max-h-[78vh] max-w-[92vw] select-none object-contain transition-transform duration-300 ease-out',
          zoomed ? 'scale-[2.6] cursor-zoom-out' : 'cursor-zoom-in',
          imgClassName,
        )}
      />
    </div>
  )
}
