import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type ZoomableImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** Called on a horizontal swipe-right while the image is at rest. */
  onSwipePrev?: () => void
  /** Called on a horizontal swipe-left while the image is at rest. */
  onSwipeNext?: () => void
}

const MAX_SCALE = 5
const DOUBLE_TAP_SCALE = 2.5
const DOUBLE_TAP_MS = 280
const TAP_MOVE_TOLERANCE = 10

type GestureMode = 'none' | 'pan' | 'pinch' | 'swipe'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Full-bleed, touch-first image viewer. The image is laid out `object-contain`
 * inside a container that fills its parent, and all gestures act on the whole
 * surface so there is no dead space to hunt for. Supports pinch-to-zoom,
 * drag-to-pan while zoomed, double-tap (or double-click) to zoom toward a
 * point, wheel-to-zoom on desktop, and a horizontal swipe to move between
 * images while at rest. Everything runs through Pointer Events so mouse, touch,
 * and pen share one path, and the transform is written imperatively to avoid a
 * React re-render on every move.
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

  // Transform state, kept in a ref so pointer math never waits on React.
  // tx/ty translate the image's center (transform-origin is center center).
  const view = useRef({ scale: 1, tx: 0, ty: 0 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const start = useRef({
    clientX: 0,
    clientY: 0,
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

  // Container geometry + the image's laid-out (untransformed) size. offsetWidth
  // /Height ignore the CSS transform, so they always give the contain-fitted
  // base size regardless of the current zoom.
  const geom = () => {
    const el = containerRef.current
    const img = imgRef.current
    const rect = el?.getBoundingClientRect()
    const cw = el?.clientWidth ?? 0
    const ch = el?.clientHeight ?? 0
    return {
      cw,
      ch,
      baseW: img?.offsetWidth ?? 0,
      baseH: img?.offsetHeight ?? 0,
      cx: (rect?.left ?? 0) + cw / 2,
      cy: (rect?.top ?? 0) + ch / 2,
    }
  }

  // Pointer position relative to the container center.
  const rel = (clientX: number, clientY: number) => {
    const { cx, cy } = geom()
    return { x: clientX - cx, y: clientY - cy }
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
      const { cw, ch, baseW, baseH } = geom()
      const s = clamp(scale, 1, MAX_SCALE)
      // How far the (scaled) image can travel before its edge crosses the frame.
      const maxX = Math.max(0, (baseW * s - cw) / 2)
      const maxY = Math.max(0, (baseH * s - ch) / 2)
      view.current = {
        scale: s,
        tx: clamp(tx, -maxX, maxX),
        ty: clamp(ty, -maxY, maxY),
      }
      applyTransform(transition)
      const nowZoomed = s > 1.01
      setZoomed((current) => (current === nowZoomed ? current : nowZoomed))
    },
    [applyTransform],
  )

  // Reset when the underlying image changes.
  useEffect(() => {
    view.current = { scale: 1, tx: 0, ty: 0 }
    applyTransform(false)
    setZoomed(false)
  }, [src, applyTransform])

  // Re-clamp on resize / orientation change so a rotated frame never leaves the
  // image parked off-center or out of bounds.
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      const { scale, tx, ty } = view.current
      setView(scale, tx, ty)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [setView])

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

  const beginSinglePointer = (clientX: number, clientY: number) => {
    start.current.mode = view.current.scale > 1.01 ? 'pan' : 'swipe'
    start.current.clientX = clientX
    start.current.clientY = clientY
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
    pointers.current.set(event.pointerId, rel(event.clientX, event.clientY))

    if (pointers.current.size === 1) {
      beginSinglePointer(event.clientX, event.clientY)
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
      const scale = clamp(s.scale * (distance() / s.dist), 1, MAX_SCALE)
      const k = scale / s.scale
      const m = midpoint()
      setView(scale, m.x - k * (s.midX - s.tx), m.y - k * (s.midY - s.ty))
      return
    }

    const dx = event.clientX - s.clientX
    const dy = event.clientY - s.clientY
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
      if (s.mode === 'swipe' && s.moved) {
        const { cw } = geom()
        const threshold = Math.max(60, cw * 0.18)
        if (s.swipeDx <= -threshold && onSwipeNext) return onSwipeNext()
        if (s.swipeDx >= threshold && onSwipePrev) return onSwipePrev()
        applyTransform(true) // snap back to rest
      }
      if (!s.moved) handleTap(event.clientX, event.clientY)
      s.mode = 'none'
    } else if (pointers.current.size === 1) {
      // Dropped from a pinch to a single finger: keep panning from here.
      const [id] = [...pointers.current.keys()]
      const p = pointers.current.get(id)!
      const { cx, cy } = geom()
      beginSinglePointer(p.x + cx, p.y + cy)
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
      const scale = clamp(view.current.scale * factor, 1, MAX_SCALE)
      const k = scale / view.current.scale
      setView(scale, p.x * (1 - k) + k * view.current.tx, p.y * (1 - k) + k * view.current.ty)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [setView])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex h-full w-full touch-none items-center justify-center overflow-hidden select-none',
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
        style={{ transformOrigin: 'center center', willChange: 'transform' }}
        className={cn(
          'max-h-full max-w-full object-contain',
          'pointer-events-none select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]',
          imgClassName,
        )}
      />
    </div>
  )
}
