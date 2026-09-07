import type { CSSProperties } from 'react'
// HeaderBrandLogo — logotipo vetorial oficial
import vetorMasterSvg from '@/assets/vetor-master2.svg'

interface HeaderBrandLogoProps {
  className?: string
  style?: CSSProperties
}

/**
 * HeaderBrandLogo — Cabeçalho fixo VETOR MASTER
 *
 * Logomarca vetorial oficial a partir de vetor-master2.svg:
 * Nós hexagonais, seta de crescimento, wordmark "VETOR MASTER" e tagline "DIREÇÃO · CONEXÃO · CRESCIMENTO"
 * Alturas de leitura generosa: até ~50px no desktop / proporcional no mobile, sem scale hacks.
 */
export default function HeaderBrandLogo({ className = '', style }: HeaderBrandLogoProps) {
  return (
    <div
      className={`header-brand-logo-wrap flex items-center select-none ${className}`}
      style={style}
    >
      <img
        src={vetorMasterSvg}
        alt="VETOR MASTER — Direção · Conexão · Crescimento"
        loading="eager"
        decoding="async"
        className="header-brand-logo-img"
      />
    </div>
  )
}
