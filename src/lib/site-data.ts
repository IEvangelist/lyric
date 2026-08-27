import {
  captures as rawCaptures,
  type Capture,
  type CaptureKind,
  type CaptureShot,
} from './captures'

const BASE = import.meta.env.BASE_URL

/** Prepend the site base to a media path that is relative to it. */
export function withBase(path: string): string {
  return `${BASE}${path}`
}

export { shotsForCapture } from './captures'
export type { Capture, CaptureKind, CaptureShot }

// Resolve every relative media path to a base-aware URL for runtime use.
export const captures: Capture[] = rawCaptures.map((capture) => ({
  ...capture,
  image: withBase(capture.image),
  previousShots: capture.previousShots?.map((shot) => ({
    ...shot,
    image: withBase(shot.image),
  })),
  video: capture.video ? withBase(capture.video) : undefined,
  poster: capture.poster ? withBase(capture.poster) : undefined,
}))

export const strokes = [
  {
    name: 'Freestyle',
    blurb: 'His strongest event, and where he earned an “A” time standard.',
    standard: true,
  },
  { name: 'Breaststroke', blurb: 'Precision timing and an explosive pull off every wall.' },
  { name: 'Butterfly', blurb: 'Rhythm, power, and total commitment lap after lap.' },
]
