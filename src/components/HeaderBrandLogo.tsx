import type { CSSProperties } from 'react'
import faviconSymbol from '@/assets/logo-5-favicon-vetor-master-14jul26-4a4e9.png'

interface HeaderBrandLogoProps {
  className?: string
  style?: CSSProperties
}

/**
 * HeaderBrandLogo — Cabeçalho fixo VETOR MASTER
 *
 * Composição aprovada:
 * - Símbolo hexagonal favicon (~44px desktop / ~34px mobile)
 * - Wordmark em tipografia Michroma (peso regular 400, fonte oficial):
 *   - "VETOR" no azul #0066CC
 *   - Espaço entre as duas palavras mantido (.wordmark-space)
 *   - "MASTER" no verde #22B14C
 */
export default function HeaderBrandLogo({ className = '', style }: HeaderBrandLogoProps) {
  return (
    <div className={`header-brand-unit flex items-center select-none ${className}`} style={style}>
      {/* Símbolo Hexagonal Favicon com máscara/recorte para remover margem branca excessiva do PNG */}
      <div className="header-symbol-crop relative flex items-center justify-center shrink-0 overflow-hidden">
        <img
          src={faviconSymbol}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="header-symbol-img"
        />
      </div>

      {/* Wordmark VETOR MASTER tipográfico Michroma (regular 400) com espaço entre as palavras */}
      <div className="header-wordmark-container flex items-center" aria-label="VETOR MASTER">
        <span className="header-wordmark" translate="no">
          <span className="wordmark-vetor">VETOR</span>
          <span className="wordmark-space" aria-hidden="true">
            {' '}
          </span>
          <span className="wordmark-master">MASTER</span>
        </span>
      </div>
    </div>
  )
}
