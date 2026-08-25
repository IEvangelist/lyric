import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type ZoomableImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** Called on a horizontal swipe-right while the image is not zoomed. */
  onSwipePrev?: () => void
  /** Called on a horizontal swipe-left while the image is not zoomed. */
  onSwipeNext?: () => void
}

const MAX_SCALE = 4
const DOUBLE_TAP_SCALE = 2.5
const DOUBLE_TAP_MS = 280
const TAP_MOVE_TOLERANCE = 10

type GestureMode = 'none' | 'pan' | 'pinch' | 'swipe'

/**
 * Touch-first image viewer. Supports pinch-to-zoom, drag-to-pan while zoomed,
 * double-tap (or double-click) to toggle zoom at a point, wheel-to-zoom on
 * desktop, and a horizontal swipe to move to the previous/next image while at
 * rest. All input is handled through Pointer Events, so mouse, touch, and pen
 * share one code path. The transform is written imperatively to avoid a React
 * re-render on every move.
 */
export function ZoomableImage({
  src,
  alt,
  className,
  imgClassName,
  onSwipePrev,
  onSwipeNext,
}: ZoomableImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const view = useRef({ scale: 1, tx: 0, ty: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const start = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    scale: 1,
    dist: 0,
    midX: 0,
    midY: 0,
    swipeDx: 0,
    moved: false,
    mode: 'none' as GestureMode,
  })
  const lastTap = useRef(0)
  const [zoomed, setZoomed] = useState(false)

  const size = () => {
    const el = containerRef.current
    return { w: el?.clientWidth ?? 0, h: el?.clientHeight ?? 0 }
  }

  const rel = (clientX: number, clientY: number) => {
    const rect = containerRef.current!.getBoundingClientRect()
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const applyTransform = useCallback((transition: boolean) => {
    const img = imgRef.current
    if (!img) return
    const { scale, tx, ty } = view.current
    img.style.transition = transition ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
    img.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`
  }, [])

  const setView = useCallback(
    (scale: number, tx: number, ty: number, transition = false) => {
      const { w, h } = size()
      const clampedScale = Math.min(MAX_SCALE, Math.max(1, scale))
      const minX = w * (1 - clampedScale)
      const minY = h * (1 - clampedScale)
      view.current = {
        scale: clampedScale,
        tx: Math.min(0, Math.max(minX, tx)),
        ty: Math.min(0, Math.max(minY, ty)),
      }
      applyTransform(transition)
      const nowZoomed = clampedScale > 1.01
      setZoomed((current) => (current === nowZoomed ? current : nowZoomed))
    },
    [applyTransform],
  )

  // Reset when the underlying image changes (callers also remount via key, but
  // this keeps state honest if they don't).
  useEffect(() => {
    view.current = { scale: 1, tx: 0, ty: 0 }
    applyTransform(false)
    setZoomed(false)
  }, [src, applyTransform])

  const midpoint = () => {
    const pts = [...pointers.current.values()]
    return {
      x: pts.reduce((sum, p) => sum + p.x, 0) / pts.length,
      y: pts.reduce((sum, p) => sum + p.y, 0) / pts.length,
    }
  }

  const distance = () => {
    const [a, b] = [...pointers.current.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  const beginSinglePointer = (x: number, y: number) => {
    start.current.mode = view.current.scale > 1.01 ? 'pan' : 'swipe'
    start.current.x = x
    start.current.y = y
    start.current.tx = view.current.tx
    start.current.ty = view.current.ty
    start.current.scale = view.current.scale
    start.current.swipeDx = 0
    start.current.moved = false
  }

  const handleTap = (clientX: number, clientY: number) => {
    const now = Date.now()
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      lastTap.current = 0
      if (view.current.scale > 1.01) {
        setView(1, 0, 0, true)
      } else {
        const p = rel(clientX, clientY)
        setView(DOUBLE_TAP_SCALE, p.x * (1 - DOUBLE_TAP_SCALE), p.y * (1 - DOUBLE_TAP_SCALE), true)
      }
    } else {
      lastTap.current = now
    }
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    try {
      containerRef.current?.setPointerCapture(event.pointerId)
    } catch {
      // Ignore: the pointer may already be released on some platforms.
    }
    const p = rel(event.clientX, event.clientY)
    pointers.current.set(event.pointerId, p)

    if (pointers.current.size === 1) {
      beginSinglePointer(p.x, p.y)
    } else if (pointers.current.size === 2) {
      start.current.mode = 'pinch'
      start.current.dist = distance()
      start.current.scale = view.current.scale
      start.current.tx = view.current.tx
      start.current.ty = view.current.ty
      const m = midpoint()
      start.current.midX = m.x
      start.current.midY = m.y
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, rel(event.clientX, event.clientY))

    const s = start.current
    if (pointers.current.size >= 2 && s.mode === 'pinch') {
      const scale = Math.min(MAX_SCALE, Math.max(1, s.scale * (distance() / s.dist)))
      const k = scale / s.scale
      const m = midpoint()
      setView(scale, m.x - (s.midX - s.tx) * k, m.y - (s.midY - s.ty) * k)
      return
    }

    const p = pointers.current.get(event.pointerId)!
    const dx = p.x - s.x
    const dy = p.y - s.y
    if (Math.abs(dx) + Math.abs(dy) > TAP_MOVE_TOLERANCE) s.moved = true

    if (s.mode === 'pan') {
      setView(view.current.scale, s.tx + dx, s.ty + dy)
    } else if (s.mode === 'swipe' && Math.abs(dx) > Math.abs(dy)) {
      s.swipeDx = dx
      const img = imgRef.current
      if (img) {
        img.style.transition = 'none'
        img.style.transform = `translate3d(${dx}px, 0, 0) scale(1)`
      }
    }
  }

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.delete(event.pointerId)
    const s = start.current

    if (pointers.current.size === 0) {
      if (s.mode === 'swipe') {
        const threshold = Math.max(60, size().w * 0.18)
        if (s.swipeDx <= -threshold && onSwipeNext) {
          onSwipeNext()
          return
        }
        if (s.swipeDx >= threshold && onSwipePrev) {
          onSwipePrev()
          return
        }
        applyTransform(true) // snap back to rest
      }
      if (!s.moved) handleTap(event.clientX, event.clientY)
      s.mode = 'none'
    } else if (pointers.current.size === 1) {
      // Dropped from a pinch to a single finger: continue as a pan/swipe.
      const [remaining] = [...pointers.current.values()]
      beginSinglePointer(remaining.x, remaining.y)
    }
  }

  // Wheel-to-zoom on desktop needs a non-passive listener to preventDefault.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const p = rel(event.clientX, event.clientY)
      const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15
      const scale = Math.min(MAX_SCALE, Math.max(1, view.current.scale * factor))
      const k = scale / view.current.scale
      setView(scale, p.x - (p.x - view.current.tx) * k, p.y - (p.y - view.current.ty) * k)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [setView])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-flex touch-none overflow-hidden rounded-xl select-none',
        zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in',
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onContextMenu={(event) => event.preventDefault()}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        style={{ transformOrigin: '0 0', willChange: 'transform' }}
        className={cn(
          'max-h-[82vh] max-w-[94vw] object-contain',
          'pointer-events-none select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]',
          imgClassName,
        )}
      />
    </div>
  )
}
