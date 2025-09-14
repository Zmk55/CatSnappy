import { encode } from 'blurhash'
import sharp from 'sharp'

export async function generateBlurhash(imageBuffer: Buffer): Promise<string> {
  try {
    // Resize image to small size for blurhash generation
    const { data, info } = await sharp(imageBuffer)
      .resize(32, 32, { fit: 'inside' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    // Generate blurhash
    const blurhash = encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      4, // componentX
      4 // componentY
    )

    return blurhash
  } catch (error) {
    console.error('Error generating blurhash:', error)
    // Return a default blurhash for cat-themed placeholder
    return 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.'
  }
}

export function getBlurDataURL(blurhash: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="24" fill="#9ca3af">
        🐱 Loading...
      </text>
    </svg>`
  ).toString('base64')}`
}
