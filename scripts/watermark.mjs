// Bakes a visible copyright watermark into the gallery stills so the *actual*
// served / downloaded / OpenGraph image carries the mark (a DOM overlay only
// protects the on-screen view, not the file people can grab directly).
//
// Pristine originals live in `media-src/captures/` (git-ignored, kept locally)
// and the watermarked JPEGs are written to `public/media/captures/`, which is
// what the site publishes. Re-run with `npm run watermark` whenever the
// originals change. Idempotent: it always sources the pristine originals, so it
// never double-stamps.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'media-src', 'captures')
const outDir = join(root, 'public', 'media', 'captures')

// Mirrors copyrightNotice() in src/lib/site-meta.ts. Kept inline so this
// framework-free build script has no TypeScript import.
const TEXT = `© ${new Date().getFullYear()}–present Lyric Pine`

function escapeXml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  )
}

function watermarkSvg(width, height, text) {
  const pad = Math.round(width * 0.022)
  const fontSize = Math.max(15, Math.round(width * 0.026))
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000000" flood-opacity="0.85" />
    </filter>
  </defs>
  <text x="${width - pad}" y="${height - pad}" text-anchor="end"
        font-family="sans-serif" font-size="${fontSize}" font-weight="600"
        letter-spacing="0.5" fill="#ffffff" fill-opacity="0.72" filter="url(#shadow)">${escapeXml(text)}</text>
</svg>`,
  )
}

async function main() {
  let files
  try {
    files = (await readdir(srcDir)).filter((name) => /\.jpe?g$/i.test(name))
  } catch {
    console.error(`No source directory: ${srcDir}\nAdd the pristine originals there, then re-run.`)
    process.exit(1)
  }

  if (files.length === 0) {
    console.error(`No source images in ${srcDir}`)
    process.exit(1)
  }

  await mkdir(outDir, { recursive: true })

  for (const file of files) {
    const input = await readFile(join(srcDir, file))
    const { width, height } = await sharp(input).metadata()
    const overlay = watermarkSvg(width, height, TEXT)
    const output = await sharp(input)
      .composite([{ input: overlay, top: 0, left: 0 }])
      .jpeg({ quality: 90, mozjpeg: true })
      .toBuffer()
    await writeFile(join(outDir, file), output)
    console.log(`  ✓ ${file}  ${width}×${height}`)
  }

  console.log(`\nWatermarked ${files.length} image(s) → public/media/captures/`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
