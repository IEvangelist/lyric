import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = join(root, 'media-src', 'captures')
const output = join(sourceDir, 'lunar-eclipse-collage.png')

const placements = [
  { file: 'lunar-eclipse-03-original.png', left: -55, top: 245 },
  { file: 'lunar-eclipse-04-original.png', left: 285, top: 80 },
  { file: 'lunar-eclipse-05-original.png', left: 625, top: 245 },
]

async function main() {
  // Screen blending makes each source's black sky transparent without cutting
  // hard edges around the Moon.
  const layers = await Promise.all(
    placements.map(async ({ file, left, top }) => ({
      input: await sharp(join(sourceDir, file)).resize({ width: 700 }).png().toBuffer(),
      left,
      top,
      blend: 'screen',
    })),
  )

  await sharp({
    create: {
      width: 1280,
      height: 720,
      channels: 3,
      background: '#05040b',
    },
  })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(output)

  console.log(`Created ${output}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
