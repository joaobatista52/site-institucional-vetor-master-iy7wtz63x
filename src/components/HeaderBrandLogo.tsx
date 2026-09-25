import type { CSSProperties } from 'react'
// HeaderBrandLogo — logotipo vetorial oficial
import logo5eCleanOfficial from '@/assets/logo-5e-clean-ccemici-25set26-63b73.png'

interface HeaderBrandLogoProps {
  className?: string
  style?: CSSProperties
}

/**
 * HeaderBrandLogo — Cabeçalho fixo VETOR MASTER
 *
 * Logomarca 5e-clean oficial:
 * Horizontal colorida (VETOR azul #0066CC, MASTER verde #22B14C, tagline "DIREÇÃO • CONEXÃO • CRESCIMENTO").
 * Exibida na navbar glass dark (#0B1120 / rgba(11,17,32,0.85)).
 * Respiro generoso ≥ altura do "V", sem distorção nem sombra.
 */
export default function HeaderBrandLogo({ className = '', style }: HeaderBrandLogoProps) {
  return (
    <div
      className={`header-brand-logo-wrap flex items-center select-none ${className}`}
      style={style}
    >
      <img
        src={logo5eCleanOfficial}
        alt="VETOR MASTER — Direção • Conexão • Crescimento"
        loading="eager"
        decoding="async"
        className="header-brand-logo-img"
      />
    </div>
  )
}
