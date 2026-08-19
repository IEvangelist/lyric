import lagoon from '@/assets/lagoon-nebula-m8.jpg'
import veil from '@/assets/veil-nebula.jpg'

const BASE = import.meta.env.BASE_URL

export type Capture = {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  kind: 'image' | 'video'
  video?: string
  poster?: string
}

export const captures: Capture[] = [
  {
    id: 'lagoon',
    title: 'Lagoon Nebula',
    subtitle: 'Messier 8 · Sagittarius',
    description:
      'A vast stellar nursery around 4,000 light-years away, glowing pink as newborn stars light up clouds of hydrogen gas.',
    image: lagoon,
    kind: 'image',
  },
  {
    id: 'veil',
    title: 'Veil Nebula',
    subtitle: 'Supernova remnant · Cygnus',
    description:
      'The delicate, wispy shockwave left behind by a star that exploded thousands of years ago, still expanding across the sky.',
    image: veil,
    kind: 'image',
  },
  {
    id: 'moon',
    title: 'The Moon',
    subtitle: 'Waxing gibbous · filmed live',
    description:
      'Our nearest neighbor, captured through the eyepiece: craters, maria, and the rugged terminator in motion.',
    image: `${BASE}media/moon-poster.jpg`,
    poster: `${BASE}media/moon-poster.jpg`,
    video: `${BASE}media/moon.mp4`,
    kind: 'video',
  },
]

export const strokes = [
  {
    name: 'Freestyle',
    blurb: 'His strongest event, and where he earned an “A” time standard.',
    standard: true,
  },
  { name: 'Breaststroke', blurb: 'Precision timing and an explosive pull off every wall.' },
  { name: 'Butterfly', blurb: 'Rhythm, power, and total commitment lap after lap.' },
]
