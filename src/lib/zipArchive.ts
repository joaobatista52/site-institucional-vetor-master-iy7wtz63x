/**
 * Utilitário de compactação ZIP leve e nativo (sem dependências externas)
 * Implementa o formato ZIP padrão (PK\x03\x04 e PK\x01\x02) com Store (sem compressão).
 * Perfeito para empacotar múltiplos arquivos de clientes/anexos no navegador.
 */

// Tabela CRC32 pré-calculada
const crcTable: Uint32Array = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[i] = c >>> 0
  }
  return table
})()

export function calculateCrc32(data: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

export interface ZipEntry {
  filename: string
  data: Uint8Array
  date?: Date
}

/**
 * Gera um Uint8Array contendo um arquivo ZIP padrão com Store (método 0, não comprimido).
 */
export function createZipArchive(entries: ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder()
  const localHeaders: Uint8Array[] = []
  const centralHeaders: Uint8Array[] = []

  let currentOffset = 0

  for (const entry of entries) {
    const filenameBytes = encoder.encode(entry.filename)
    const dataBytes = entry.data
    const crc = calculateCrc32(dataBytes)
    const size = dataBytes.length

    const fileDate = entry.date || new Date()
    // Conversão MS-DOS date / time
    const dosTime =
      (fileDate.getHours() << 11) | (fileDate.getMinutes() << 5) | (fileDate.getSeconds() >> 1)
    const dosDate =
      ((fileDate.getFullYear() - 1980) << 9) | ((fileDate.getMonth() + 1) << 5) | fileDate.getDate()

    // 1. Local File Header (30 bytes + filename + data)
    const localHeader = new Uint8Array(30 + filenameBytes.length + size)
    const lView = new DataView(localHeader.buffer)

    lView.setUint32(0, 0x04034b50, true) // Local file header signature
    lView.setUint16(4, 20, true) // Version needed to extract (2.0)
    lView.setUint16(6, 0x0800, true) // General purpose bit flag (UTF-8)
    lView.setUint16(8, 0, true) // Compression method: 0 (store)
    lView.setUint16(10, dosTime, true)
    lView.setUint16(12, dosDate, true)
    lView.setUint32(14, crc, true)
    lView.setUint32(18, size, true) // Compressed size
    lView.setUint32(22, size, true) // Uncompressed size
    lView.setUint16(26, filenameBytes.length, true)
    lView.setUint16(28, 0, true) // Extra field length

    localHeader.set(filenameBytes, 30)
    localHeader.set(dataBytes, 30 + filenameBytes.length)

    localHeaders.push(localHeader)

    // 2. Central Directory Header (46 bytes + filename)
    const centralHeader = new Uint8Array(46 + filenameBytes.length)
    const cView = new DataView(centralHeader.buffer)

    cView.setUint32(0, 0x02014b50, true) // Central directory header signature
    cView.setUint16(4, 20, true) // Version made by
    cView.setUint16(6, 20, true) // Version needed to extract
    cView.setUint16(8, 0x0800, true) // General purpose bit flag (UTF-8)
    cView.setUint16(10, 0, true) // Compression method: 0
    cView.setUint16(12, dosTime, true)
    cView.setUint16(14, dosDate, true)
    cView.setUint32(16, crc, true)
    cView.setUint32(20, size, true)
    cView.setUint32(24, size, true)
    cView.setUint16(28, filenameBytes.length, true)
    cView.setUint16(30, 0, true) // Extra field length
    cView.setUint16(32, 0, true) // Comment length
    cView.setUint16(34, 0, true) // Disk number start
    cView.setUint16(36, 0, true) // Internal file attributes
    cView.setUint32(38, 0, true) // External file attributes
    cView.setUint32(42, currentOffset, true) // Relative offset of local header

    centralHeader.set(filenameBytes, 46)
    centralHeaders.push(centralHeader)

    currentOffset += localHeader.length
  }

  const centralDirectoryOffset = currentOffset
  const centralDirectorySize = centralHeaders.reduce((acc, h) => acc + h.length, 0)

  // 3. End of Central Directory Record (22 bytes)
  const eocd = new Uint8Array(22)
  const eView = new DataView(eocd.buffer)

  eView.setUint32(0, 0x06054b50, true) // EOCD signature
  eView.setUint16(4, 0, true) // Number of this disk
  eView.setUint16(6, 0, true) // Disk where central directory starts
  eView.setUint16(8, entries.length, true) // Total entries on this disk
  eView.setUint16(10, entries.length, true) // Total entries
  eView.setUint32(12, centralDirectorySize, true)
  eView.setUint32(16, centralDirectoryOffset, true)
  eView.setUint16(20, 0, true) // Comment length

  const totalLength = currentOffset + centralDirectorySize + eocd.length
  const finalZip = new Uint8Array(totalLength)

  let pos = 0
  for (const lh of localHeaders) {
    finalZip.set(lh, pos)
    pos += lh.length
  }
  for (const ch of centralHeaders) {
    finalZip.set(ch, pos)
    pos += ch.length
  }
  finalZip.set(eocd, pos)

  return finalZip
}
