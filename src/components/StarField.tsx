import { useMemo } from 'react'

type Star = {
  top: string
  left: string
  size: number
  duration: number
  delay: number
  opacity: number
}

export function StarField({ count = 90 }: { count?: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: count }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() < 0.86 ? 1 : 2,
        duration: 2.4 + Math.random() * 4,
        delay: Math.random() * 6,
        opacity: 0.35 + Math.random() * 0.6,
      })),
    [count],
  )

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {stars.map((star, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-star"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            boxShadow: star.size > 1 ? '0 0 5px 1px oklch(0.9 0.05 260 / 0.7)' : undefined,
          }}
        />
      ))}
    </div>
  )
}
