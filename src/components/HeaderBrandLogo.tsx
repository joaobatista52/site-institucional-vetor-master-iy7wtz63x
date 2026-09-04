import type { CSSProperties } from 'react'
import faviconSymbol from '@/assets/logo-5-favicon-vetor-master-14jul26-4a4e9.png'
import WordmarkSvg from '@/components/WordmarkSvg'

interface HeaderBrandLogoProps {
  className?: string
  style?: CSSProperties
}

/**
 * HeaderBrandLogo — Cabeçalho fixo VETOR MASTER
 *
 * Composição aprovada:
 * - Símbolo hexagonal favicon (~44px desktop / ~34px mobile)
 * - Wordmark 100% vetorizado VETOR MASTER a partir da arte original:
 *   - Detalhes tipográficos preservados (corte/estilo exclusivo do A e do R)
 *   - "VETOR" em azul (#0066CC) e "MASTER" em verde (#22B14C)
 *   - SEM espaço entre as palavras (unidas harmonicamente como wordmark único)
 *   - Substitui o texto em fonte Inter 900 anterior
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

      {/* Wordmark VETOR MASTER Vetorizado Original — Sem espaço entre as palavras */}
      <div className="header-wordmark-container flex items-center" aria-label="VETOR MASTER">
        <WordmarkSvg className="header-wordmark-vector" />
      </div>
    </div>
  )
}
