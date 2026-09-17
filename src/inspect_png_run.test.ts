// @ts-nocheck
import { describe, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { inflateSync } from 'node:zlib'

describe('inspect images', () => {
  it('reads png headers', () => {
    const files = [
      'src/assets/logo-5e-vetor-master-14jul26-7f7d4.png',
      'src/assets/logo-5-vetor-master-06jul26-6e3d7.png',
      'src/assets/logo-5e-vetor-master-14jul26-6e983.png',
      'src/assets/logo-5a-vetor-master-14jul26-9062c.png'
    ]

    for (const f of files) {
      const buf = fs.readFileSync(path.resolve(f))
      const width = buf.readUInt32BE(16)
      const height = buf.readUInt32BE(20)
      const bitDepth = buf[24]
      const colorType = buf[25]

      let pos = 8
      const idat = []
      while (pos < buf.length) {
        const len = buf.readUInt32BE(pos)
        const type = buf.toString('ascii', pos + 4, pos + 8)
        const data = buf.subarray(pos + 8, pos + 8 + len)
        pos += 12 + len
        if (type === 'IDAT') idat.push(data)
        if (type === 'IEND') break
      }
      const decompressed = inflateSync(Buffer.concat(idat))
      console.log(`FILE_INFO:${f}:${width}:${height}:${bitDepth}:${colorType}:${decompressed.length}`)
    }
  })
})
