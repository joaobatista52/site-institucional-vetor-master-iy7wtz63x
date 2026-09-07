import fs from 'node:fs'
import zlib from 'node:zlib'

const inputPath = 'src/assets/vetor-dc3d7.svgz'
const outputPath = 'src/assets/logo-vetor-master.svg'

console.log('Reading input file:', inputPath)
const buffer = fs.readFileSync(inputPath)
console.log('Input buffer length:', buffer.length)
console.log('First 4 bytes:', buffer.subarray(0, 4))

let svgContent = ''

// Check gzip magic bytes: 0x1f 0x8b
if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
  console.log('Detected gzip header (0x1f 0x8b), decompressing with gunzipSync...')
  const decompressed = zlib.gunzipSync(buffer)
  svgContent = decompressed.toString('utf-8')
} else {
  // Try zlib inflate or raw text
  try {
    const decompressed = zlib.inflateSync(buffer)
    svgContent = decompressed.toString('utf-8')
  } catch (err) {
    console.log('Not zlib inflate, reading as utf-8 string')
    svgContent = buffer.toString('utf-8')
  }
}

console.log('Decompressed length:', svgContent.length)
console.log('First 200 chars:', svgContent.substring(0, 200))
console.log('Has <svg?:', svgContent.includes('<svg'))
console.log('Has viewBox?:', svgContent.includes('viewBox'))

fs.writeFileSync('svg-temp-sample.txt', svgContent.substring(0, 500))
