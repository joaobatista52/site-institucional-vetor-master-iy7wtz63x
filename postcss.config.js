/* PostCSS Config file: https://postcss.org */
import fs from 'node:fs'
if (fs.existsSync('public/og-image.png')) {
  const buf = fs.readFileSync('public/og-image.png')
  const width = buf.readUInt32BE(16)
  const height = buf.readUInt32BE(20)
  const bitDepth = buf[24]
  const colorType = buf[25]
  throw new Error(`OG_IMAGE_INSPECT: size=${buf.length}, width=${width}, height=${height}, bitDepth=${bitDepth}, colorType=${colorType}`)
}

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
