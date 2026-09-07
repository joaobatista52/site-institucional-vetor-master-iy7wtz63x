/* PostCSS Config file: https://postcss.org */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

function parsePNG(buf) {
  let pos = 8
  let width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0
  const idatChunks = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.slice(pos + 4, pos + 8).toString('ascii')
    const data = buf.slice(pos + 8, pos + 8 + len)
    pos += 12 + len
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
      interlace = data[12]
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    }
  }
  return { width, height, bitDepth, colorType, interlace, idat: Buffer.concat(idatChunks) }
}

function unfilterScanlines(raw, width, height, bpp) {
  const stride = width * bpp
  const out = Buffer.alloc(width * height * bpp)
  let rawPos = 0
  let outPos = 0

  function paethPredictor(a, b, c) {
    const p = a + b - c
    const pa = Math.abs(p - a)
    const pb = Math.abs(p - b)
    const pc = Math.abs(p - c)
    if (pa <= pb && pa <= pc) return a
    if (pb <= pc) return b
    return c
  }

  for (let y = 0; y < height; y++) {
    const filter = raw[rawPos++]
    const prevLineStart = (y - 1) * stride
    const curLineStart = y * stride

    for (let x = 0; x < stride; x++) {
      const val = raw[rawPos++]
      const a = (x >= bpp) ? out[curLineStart + x - bpp] : 0
      const b = (y > 0) ? out[prevLineStart + x] : 0
      const c = (y > 0 && x >= bpp) ? out[prevLineStart + x - bpp] : 0
      let recon = 0

      switch (filter) {
        case 0:
          recon = val
          break
        case 1:
          recon = (val + a) & 0xff
          break
        case 2:
          recon = (val + b) & 0xff
          break
        case 3:
          recon = (val + Math.floor((a + b) / 2)) & 0xff
          break
        case 4:
          recon = (val + paethPredictor(a, b, c)) & 0xff
          break
        default:
          recon = val
      }
      out[outPos++] = recon
    }
  }
  return out
}

function findBoundingBox(pixels, width, height, bpp) {
  let minX = width, maxX = 0, minY = height, maxY = 0
  const isWhite = (r, g, b, a) => {
    if (bpp === 4 && a < 20) return true
    return r >= 253 && g >= 253 && b >= 253
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * bpp
      const r = pixels[idx]
      const g = pixels[idx + 1]
      const b = pixels[idx + 2]
      const a = (bpp === 4) ? pixels[idx + 3] : 255
      if (!isWhite(r, g, b, a)) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  return { minX, maxX, minY, maxY, cropW: maxX - minX + 1, cropH: maxY - minY + 1 }
}

const targets = [
  'src/assets/logo-5-favicon-vetor-master-14jul26-4a4e9.png',
  'src/assets/logo-5-vetor-master-06jul26-6e3d7.png',
  'src/assets/logo-5a-vetor-master-14jul26-9062c.png',
  'src/assets/logo-5e-vetor-master-14jul26-6e983.png',
  'src/assets/logo-5e-vetor-master-14jul26-7f7d4.png',
]

const result = {}
for (const t of targets) {
  try {
    const buf = fs.readFileSync(path.resolve(process.cwd(), t))
    const parsed = parsePNG(buf)
    const decompressed = zlib.inflateSync(parsed.idat)
    const bpp = (parsed.colorType === 6 ? 4 : 3)
    const pixels = unfilterScanlines(decompressed, parsed.width, parsed.height, bpp)
    const bbox = findBoundingBox(pixels, parsed.width, parsed.height, bpp)
    // Sample some pixel RGB values
    const corners = {
      tl: [pixels[0], pixels[1], pixels[2]],
      tr: [pixels[(parsed.width - 1) * bpp], pixels[(parsed.width - 1) * bpp + 1], pixels[(parsed.width - 1) * bpp + 2]],
      center: [
        pixels[(Math.floor(parsed.height / 2) * parsed.width + Math.floor(parsed.width / 2)) * bpp],
        pixels[(Math.floor(parsed.height / 2) * parsed.width + Math.floor(parsed.width / 2)) * bpp + 1],
        pixels[(Math.floor(parsed.height / 2) * parsed.width + Math.floor(parsed.width / 2)) * bpp + 2]
      ]
    }
    // Also let's inspect the bounding box scanlines: are pixels near minX, maxX, minY, maxY truly content?
    const borderSamples = {
      atMinY: pixels.subarray((bbox.minY * parsed.width + bbox.minX) * bpp, (bbox.minY * parsed.width + bbox.minX + 5) * bpp),
      atMaxY: pixels.subarray((bbox.maxY * parsed.width + bbox.minX) * bpp, (bbox.maxY * parsed.width + bbox.minX + 5) * bpp),
    }
    result[t] = { width: parsed.width, height: parsed.height, bpp, interlace: parsed.interlace, corners, ...bbox, borderSamples }
  } catch (e) {
    result[t] = { error: e.message }
  }
}
fs.writeFileSync(path.resolve(process.cwd(), 'src/png_bbox.json'), JSON.stringify(result, null, 2))

// Helper to analyze the SVG paths
try {
  const svgFile = path.resolve(process.cwd(), 'src/assets/vetor-master-logo.svg')
  if (fs.existsSync(svgFile)) {
    const content = fs.readFileSync(svgFile, 'utf8')
    const matches = [...content.matchAll(/<path\s+fill="([^"]+)"\s+d="([^"]+)"/g)]
    const analysis = matches.map(m => {
      const fill = m[1]
      const d = m[2]
      return { fill, dStart: d.slice(0, 100), dLen: d.length }
    })
    fs.writeFileSync(path.resolve(process.cwd(), 'src/svg_paths_analysis.json'), JSON.stringify(analysis, null, 2))
  }
} catch (err) {
  // ignore
}

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
