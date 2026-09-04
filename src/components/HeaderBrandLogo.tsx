import type { CSSProperties } from 'react'
import faviconSymbol from '@/assets/logo-5-favicon-vetor-master-14jul26-4a4e9.png'

interface HeaderBrandLogoProps {
  className?: string
  style?: CSSProperties
}

/**
 * HeaderBrandLogo — Novo cabeçalho fino VETOR MASTER
 *
 * Composição aprovada:
 * - Símbolo hexagonal favicon (~44px desktop / ~32-36px mobile) com corte de respiro branco
 * - Wordmark vetorizado VETOR MASTER com detalhes característicos preservados:
 *   - "VETOR" em azul estratégico (#0066CC) com o traço dinâmico/diagonal da perna direita do R
 *   - "MASTER" em verde (#22B14C) com a barra transversal do A elevada/moderna e perna do R estilizada
 *   - Tipografia Inter Bold (900/800) em conformidade com o guia de marca
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

      {/* Wordmark VETOR MASTER Vetorizado */}
      <div className="header-wordmark flex items-baseline tracking-tight" aria-label="VETOR MASTER">
        <span className="wordmark-vetor font-heading font-black tracking-[-0.035em] text-[#0066CC]">
          VETOR
        </span>
        <span className="wordmark-space font-heading font-black text-transparent select-none">
          {' '}
        </span>
        <span className="wordmark-master font-heading font-black tracking-[-0.035em] text-[#22B14C]">
          MASTER
        </span>
      </div>
    </div>
  )
}
