// Single source of truth for gallery captures.
//
// This module is intentionally framework-free (no `import.meta`, no DOM, no
// asset imports) so it can be consumed both by the React app (via site-data.ts)
// and by the Vite build plugin that pre-renders per-image share pages.
//
// All media paths are relative to the site base (import.meta.env.BASE_URL);
// consumers prepend the base as needed.

export type CaptureKind = 'image' | 'video'

export type Capture = {
  id: string
  title: string
  subtitle: string
  description: string
  /** Descriptive alt text used for <img> and og:image:alt. */
  alt: string
  /** Path relative to the site base, e.g. `media/captures/lagoon-nebula-m8.jpg`. */
  image: string
  /** Intrinsic width of `image`, used for og:image:width. */
  width: number
  /** Intrinsic height of `image`, used for og:image:height. */
  height: number
  kind: CaptureKind
  /** Path relative to the site base (video only). */
  video?: string
  /** Path relative to the site base (video only). */
  poster?: string
}

export const captures: Capture[] = [
  {
    id: 'lagoon',
    title: 'Lagoon Nebula',
    subtitle: 'Messier 8 · Sagittarius',
    description:
      'A vast stellar nursery around 4,000 light-years away, glowing pink as newborn stars light up clouds of hydrogen gas.',
    alt: 'The Lagoon Nebula (Messier 8): glowing pink clouds of hydrogen gas around a bright cluster of newborn stars.',
    image: 'media/captures/lagoon-nebula-m8.jpg',
    width: 1828,
    height: 784,
    kind: 'image',
  },
  {
    id: 'veil',
    title: 'Veil Nebula',
    subtitle: 'Supernova remnant · Cygnus',
    description:
      'The delicate, wispy shockwave left behind by a star that exploded thousands of years ago, still expanding across the sky.',
    alt: 'The Veil Nebula in Cygnus: delicate wisps of red and teal gas from an ancient supernova shockwave.',
    image: 'media/captures/c-33.jpg',
    width: 1752,
    height: 792,
    kind: 'image',
  },
  {
    id: 'dumbbell',
    title: 'Dumbbell Nebula',
    subtitle: 'Messier 27 · Vulpecula',
    description:
      'A planetary nebula about 1,360 light-years away, the glowing gas shell cast off by a dying Sun-like star.',
    alt: 'The Dumbbell Nebula (Messier 27): a glowing double-lobed shell of gas cast off by a dying star.',
    image: 'media/captures/dumbbell-nebula-m27.jpg',
    width: 1060,
    height: 772,
    kind: 'image',
  },
  {
    id: 'black-eye',
    title: 'Black Eye Galaxy',
    subtitle: 'Messier 64 · Coma Berenices',
    description:
      'A spiral galaxy roughly 17 million light-years away, named for the dark band of dust sweeping across its bright core.',
    alt: 'The Black Eye Galaxy (Messier 64): a bright spiral galaxy with a dark band of dust across its core.',
    image: 'media/captures/black-eye-galaxy-m64.jpg',
    width: 1736,
    height: 792,
    kind: 'image',
  },
  {
    id: 'north-america',
    title: 'North America Nebula',
    subtitle: 'Caldwell 20 · Cygnus',
    description:
      'A vast cloud of glowing hydrogen about 1,600 light-years away, its bright ridges shaped uncannily like the continent it is named for.',
    alt: 'The North America Nebula (Caldwell 20): a cloud of glowing hydrogen shaped like the North American continent.',
    image: 'media/captures/c-20.jpg',
    width: 1544,
    height: 996,
    kind: 'image',
  },
  {
    id: 'ring',
    title: 'Ring Nebula',
    subtitle: 'Messier 57 · Lyra',
    description:
      'A planetary nebula some 2,500 light-years away — the glowing smoke ring of gas puffed off by a dying star at its center.',
    alt: 'The Ring Nebula (Messier 57): a glowing smoke ring of gas surrounding a dying central star.',
    image: 'media/captures/m-57.jpg',
    width: 1636,
    height: 672,
    kind: 'image',
  },
  {
    id: 'moon',
    title: 'The Moon',
    subtitle: 'Waxing gibbous · filmed live',
    description:
      'Our nearest neighbor, captured through the eyepiece: craters, maria, and the rugged terminator in motion.',
    alt: 'The waxing gibbous Moon filmed through a telescope, showing craters, maria, and the rugged terminator.',
    image: 'media/moon-poster.jpg',
    width: 1280,
    height: 720,
    poster: 'media/moon-poster.jpg',
    video: 'media/moon.mp4',
    kind: 'video',
  },
  {
    id: 'sun',
    title: 'The Sun',
    subtitle: 'Our star · filmed live',
    description:
      'Our nearest star, filmed live through the eyepiece: a churning sphere of plasma about 93 million miles away.',
    alt: 'The Sun filmed through a telescope with a solar filter, a churning sphere of plasma.',
    image: 'media/sun-poster.jpg',
    width: 1280,
    height: 720,
    poster: 'media/sun-poster.jpg',
    video: 'media/sun.mp4',
    kind: 'video',
  },
]
