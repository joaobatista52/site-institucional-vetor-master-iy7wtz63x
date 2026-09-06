import fs from 'node:fs'
import zlib from 'node:zlib'

function readPNG(buffer) {
  const sig = buffer.subarray(0, 8)
  if (!sig.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    throw new Error('Not a PNG')
  }

  let offset = 8
  let width = 0
  let height = 0
  let bitDepth = 0
  let colorType = 0
  const idatChunks = []

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii')
    const data = buffer.subarray(offset + 8, offset + 8 + length)
    offset += 12 + length

    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      bitDepth = data[8]
      colorType = data[9]
      console.log(`IHDR: ${width}x${height}, depth=${bitDepth}, colorType=${colorType}`)
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    }
  }

  const compressed = Buffer.concat(idatChunks)
  const decompressed = zlib.inflateSync(compressed)
  console.log(`Decompressed length: ${decompressed.length}`)

  return { width, height, bitDepth, colorType, decompressed }
}

for (const file of [
  'src/assets/logo-5-favicon-vetor-master-14jul26-4a4e9.png',
  'src/assets/logo-5-vetor-master-06jul26-6e3d7.png',
  'src/assets/logo-5e-vetor-master-14jul26-7f7d4.png',
  'src/assets/logo-5e-vetor-master-14jul26-6e983.png',
  'src/assets/logo-5a-vetor-master-14jul26-9062c.png',
]) {
  console.log('=== Checking', file, '===')
  const buf = fs.readFileSync(file)
  readPNG(buf)
}
