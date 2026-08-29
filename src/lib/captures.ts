// Single source of truth for gallery captures.
//
// This module is intentionally framework-free (no `import.meta`, no DOM, no
// asset imports) so it can be consumed both by the React app (via site-data.ts)
// and by the Vite build plugin that pre-renders per-image share pages.
//
// All media paths are relative to the site base (import.meta.env.BASE_URL);
// consumers prepend the base as needed.

export type CaptureKind = 'image' | 'video'
export type CaptureVariant = 'Enhanced' | 'Original'

export type CaptureShot = {
  alt: string
  image: string
  width: number
  height: number
  /** ISO 8601 date on which this shot was captured. */
  capturedOn: string
  variant?: CaptureVariant
}

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
  /** ISO 8601 date on which the primary/latest shot was captured. */
  capturedOn: string
  variant?: CaptureVariant
  /** Other shots grouped with the primary image, in gallery navigation order. */
  additionalShots?: CaptureShot[]
  kind: CaptureKind
  /** Path relative to the site base (video only). */
  video?: string
  /** Path relative to the site base (video only). */
  poster?: string
}

/** Return every shot with the primary/latest image first. */
export function shotsForCapture(capture: Capture): CaptureShot[] {
  return [
    {
      alt: capture.alt,
      image: capture.image,
      width: capture.width,
      height: capture.height,
      capturedOn: capture.capturedOn,
      variant: capture.variant,
    },
    ...(capture.additionalShots ?? []),
  ]
}

const captureDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatCaptureDate(capturedOn: string): string {
  return captureDateFormatter.format(new Date(`${capturedOn}T00:00:00Z`))
}

export const captures: Capture[] = [
  {
    id: 'andromeda',
    title: 'Andromeda Galaxy',
    subtitle: 'Messier 31 · Andromeda',
    description:
      'The nearest major galaxy to the Milky Way, about 2.5 million light-years away, with a brilliant core, sweeping dust lanes, and two companion galaxies.',
    alt: 'The Andromeda Galaxy (Messier 31): a bright oval core and broad spiral disk crossed by dark dust lanes amid a dense star field.',
    image: 'media/captures/andromeda-galaxy-m31.jpg',
    width: 1848,
    height: 916,
    capturedOn: '2026-08-28',
    kind: 'image',
  },
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
    capturedOn: '2026-08-18',
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
    capturedOn: '2026-08-17',
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
    capturedOn: '2026-08-04',
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
    capturedOn: '2026-05-05',
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
    capturedOn: '2026-08-24',
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
    capturedOn: '2026-08-23',
    kind: 'image',
  },
  {
    id: 'pelican',
    title: 'Pelican Nebula',
    subtitle: 'IC 5070 · Cygnus',
    description:
      'An emission nebula roughly 1,800 light-years away, its dark dust lanes and glowing hydrogen tracing the outline of a pelican in Cygnus.',
    alt: 'The Pelican Nebula (IC 5070): faint red hydrogen clouds and dark dust lanes amid a dense field of stars.',
    image: 'media/captures/ic-5070.jpg',
    width: 1888,
    height: 928,
    capturedOn: '2026-08-27',
    kind: 'image',
  },
  {
    id: 'lunar-eclipse-sequence',
    title: 'Lunar Eclipse Sequence',
    subtitle: 'Three original frames · one arc',
    description:
      'Three original frames trace the eclipse from near-total shadow into brighter partial phases in one sweeping composition.',
    alt: 'Three original views of the lunar eclipse arranged from left to right in a sweeping arc.',
    image: 'media/captures/lunar-eclipse-collage.jpg',
    width: 1280,
    height: 720,
    capturedOn: '2026-08-27',
    kind: 'image',
  },
  {
    id: 'lunar-eclipse',
    title: 'Lunar Eclipse',
    subtitle: 'Deep partial eclipse · Earth’s shadow',
    description:
      'Earth’s shadow swept across the Moon, leaving a thin brilliant rim and revealing a copper-red glow near maximum eclipse.',
    alt: 'An enhanced view of the Moon near maximum partial lunar eclipse, glowing copper red beneath a thin bright rim.',
    image: 'media/captures/lunar-eclipse-03-enhanced.jpg',
    width: 1280,
    height: 720,
    capturedOn: '2026-08-27',
    variant: 'Enhanced',
    additionalShots: [
      {
        alt: 'The original view of the Moon near maximum partial lunar eclipse, mostly in shadow beneath a thin bright rim.',
        image: 'media/captures/lunar-eclipse-03-original.jpg',
        width: 1280,
        height: 720,
        capturedOn: '2026-08-27',
        variant: 'Original',
      },
      {
        alt: 'The partially eclipsed Moon with its cratered surface brightly visible beyond Earth’s curved shadow.',
        image: 'media/captures/lunar-eclipse-04-original.jpg',
        width: 1280,
        height: 720,
        capturedOn: '2026-08-27',
        variant: 'Original',
      },
      {
        alt: 'An enhanced view of the partially eclipsed Moon with detailed craters visible along its illuminated side.',
        image: 'media/captures/lunar-eclipse-05-enhanced.jpg',
        width: 1280,
        height: 720,
        capturedOn: '2026-08-27',
        variant: 'Enhanced',
      },
      {
        alt: 'The original view of the partially eclipsed Moon with Earth’s shadow crossing its cratered surface.',
        image: 'media/captures/lunar-eclipse-05-original.jpg',
        width: 1280,
        height: 720,
        capturedOn: '2026-08-27',
        variant: 'Original',
      },
    ],
    kind: 'image',
  },
  {
    id: 'lunar-eclipse-timelapse',
    title: 'Lunar Eclipse Timelapse',
    subtitle: 'Deep partial eclipse · time lapse',
    description:
      'A compressed view of the eclipse’s changing phases, from bright crescents to the copper-red glow near maximum eclipse.',
    alt: 'The copper-red Moon near maximum partial lunar eclipse, used as the time-lapse poster image.',
    image: 'media/captures/lunar-eclipse-03-enhanced.jpg',
    width: 1280,
    height: 720,
    capturedOn: '2026-08-27',
    poster: 'media/captures/lunar-eclipse-03-enhanced.jpg',
    video: 'media/lunar-eclipse-timelapse.mp4',
    kind: 'video',
  },
  {
    id: 'pacman',
    title: 'Pacman Nebula',
    subtitle: 'NGC 281 · Cassiopeia',
    description:
      'A glowing emission nebula roughly 9,500 light-years away, sculpted by young stars and dark dust lanes into its familiar arcade-game silhouette.',
    alt: 'The Pacman Nebula (NGC 281): a glowing red emission nebula crossed by dark dust lanes in a dense star field.',
    image: 'media/captures/ngc-281.jpg',
    width: 1828,
    height: 724,
    capturedOn: '2026-08-27',
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
    capturedOn: '2026-03-29',
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
    capturedOn: '2026-03-30',
    poster: 'media/sun-poster.jpg',
    video: 'media/sun.mp4',
    kind: 'video',
  },
]
