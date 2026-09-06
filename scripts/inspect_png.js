import fs from 'node:fs'
import zlib from 'node:zlib'

function readPNG(buffer) {
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
    } else if (type === 'IDAT') {
      idatChunks.push(data)
    }
  }

  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks))
  return { width, height, bitDepth, colorType, decompressed }
}

const files = [
  'src/assets/logo-5-vetor-master-06jul26-6e3d7.png',
  'src/assets/logo-5e-vetor-master-14jul26-7f7d4.png',
  'src/assets/logo-5e-vetor-master-14jul26-6e983.png',
  'src/assets/logo-5a-vetor-master-14jul26-9062c.png',
  'src/assets/logo-5-favicon-vetor-master-14jul26-4a4e9.png',
]

const result = {}
for (const file of files) {
  const buf = fs.readFileSync(file)
  const info = readPNG(buf)
  result[file] = {
    width: info.width,
    height: info.height,
    bitDepth: info.bitDepth,
    colorType: info.colorType,
    rawLen: info.decompressed.length,
  }
}
fs.writeFileSync('scripts/inspect_result.json', JSON.stringify(result, null, 2))
console.log('Done inspect')
