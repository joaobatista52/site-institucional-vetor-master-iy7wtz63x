import type { CSSProperties, SVGProps } from 'react'

/**
 * LOGOMARCAS OFICIAIS VETOR MASTER
 *
 * Cores de Marca Oficiais:
 * - Azul Estratégico: #0066CC
 * - Verde Crescimento: #22B14C
 * - Cinza Corporativo: #333333
 * - Laranja Energia (acento moderado): #FF9900
 *
 * 1. Logo 5 (Oficial Principal - Vertical / Stacked):
 *    Vetor ACIMA do nome "VETOR MASTER".
 *    Usada em: Cabeçalho, Hero, Preloader, Rodapé.
 *
 * 2. Logo 5e (Variante Horizontal / Wide):
 *    Vetor ao LADO do nome "VETOR MASTER".
 *    Usada em: Espaços estreitos/horizontais específicos.
 */

interface LogoProps extends SVGProps<SVGSVGElement> {
  variant?: 'stacked' | 'horizontal'
  light?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Ícone do Vetor de Marca (3 segmentos geométricos que simbolizam Direção, Conexão e Crescimento)
 */
export function VetorSymbol({
  className = '',
  light = false,
  size = 48,
  ...props
}: SVGProps<SVGSVGElement> & { light?: boolean; size?: number | string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="vmVetorBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light ? '#60A5FA' : '#0066CC'} />
          <stop offset="100%" stopColor={light ? '#3B82F6' : '#004F9F'} />
        </linearGradient>
        <linearGradient id="vmVetorGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light ? '#4ADE80' : '#22B14C'} />
          <stop offset="100%" stopColor={light ? '#22C55E' : '#18883A'} />
        </linearGradient>
      </defs>

      {/* Vetor Esquerdo / Direção (Azul) */}
      <path d="M20 78 L52 18 L64 36 L40 82 Z" fill="url(#vmVetorBlue)" />

      {/* Vetor Direito Superior / Crescimento (Verde) */}
      <path d="M60 18 L100 78 L80 82 L52 38 Z" fill="url(#vmVetorGreen)" />

      {/* Ponto de Convergência / Conexão Central (Losango Conector) */}
      <polygon
        points="52,38 68,38 78,56 60,62"
        fill={light ? '#FFFFFF' : '#0066CC'}
        opacity={light ? '0.95' : '0.9'}
      />

      {/* Traço de Impulso Dinâmico / Base do Vetor */}
      <circle cx="78" cy="56" r="4.5" fill={light ? '#4ADE80' : '#22B14C'} />
    </svg>
  )
}

/**
 * Logo 5 (Oficial Principal): Vetor ACIMA do nome VETOR MASTER
 */
export function LogoStacked({
  light = false,
  className = '',
  ...props
}: SVGProps<SVGSVGElement> & { light?: boolean }) {
  const textColor = light ? '#FFFFFF' : '#1A1A1A'
  const subColor = light ? '#93C5FD' : '#0066CC'
  const taglineColor = light ? 'rgba(255,255,255,0.72)' : '#707070'

  return (
    <svg
      viewBox="0 0 240 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="VETOR MASTER — Inteligência Estratégica Determinística"
      {...props}
    >
      <defs>
        <linearGradient id="lsBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light ? '#60A5FA' : '#0066CC'} />
          <stop offset="100%" stopColor={light ? '#3B82F6' : '#004F9F'} />
        </linearGradient>
        <linearGradient id="lsGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light ? '#4ADE80' : '#22B14C'} />
          <stop offset="100%" stopColor={light ? '#22C55E' : '#18883A'} />
        </linearGradient>
      </defs>

      {/* Ícone Vetor Centralizado Acima */}
      <g transform="translate(95, 4)">
        {/* Asa Azul - Direção */}
        <path d="M5 40 L23 4 L30 14 L17 42 Z" fill="url(#lsBlue)" />
        {/* Asa Verde - Crescimento */}
        <path d="M28 4 L48 40 L38 42 L24 16 Z" fill="url(#lsGreen)" />
        {/* Conector Central */}
        <polygon
          points="24,16 32,16 37,27 28,30"
          fill={light ? '#FFFFFF' : '#0066CC'}
          opacity="0.95"
        />
        <circle cx="37" cy="27" r="2.8" fill={light ? '#4ADE80' : '#22B14C'} />
      </g>

      {/* Tipografia Principal VETOR MASTER */}
      <text
        x="120"
        y="68"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="17.5"
        fontWeight="800"
        letterSpacing="3.2"
        fill={textColor}
      >
        VETOR <tspan fill={subColor}>MASTER</tspan>
      </text>

      {/* Slogan Subordinado: DIREÇÃO · CONEXÃO · CRESCIMENTO */}
      <text
        x="120"
        y="85"
        textAnchor="middle"
        fontFamily="'Inter', sans-serif"
        fontSize="6.2"
        fontWeight="700"
        letterSpacing="2.2"
        fill={taglineColor}
      >
        DIREÇÃO · CONEXÃO · CRESCIMENTO
      </text>
    </svg>
  )
}

/**
 * Logo 5e (Variante Horizontal): Vetor ao LADO do nome VETOR MASTER
 */
export function LogoHorizontal({
  light = false,
  className = '',
  ...props
}: SVGProps<SVGSVGElement> & { light?: boolean }) {
  const textColor = light ? '#FFFFFF' : '#1A1A1A'
  const subColor = light ? '#93C5FD' : '#0066CC'
  const taglineColor = light ? 'rgba(255,255,255,0.72)' : '#707070'

  return (
    <svg
      viewBox="0 0 280 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="VETOR MASTER"
      {...props}
    >
      <defs>
        <linearGradient id="lhBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light ? '#60A5FA' : '#0066CC'} />
          <stop offset="100%" stopColor={light ? '#3B82F6' : '#004F9F'} />
        </linearGradient>
        <linearGradient id="lhGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={light ? '#4ADE80' : '#22B14C'} />
          <stop offset="100%" stopColor={light ? '#22C55E' : '#18883A'} />
        </linearGradient>
      </defs>

      {/* Vetor à Esquerda */}
      <g transform="translate(8, 8)">
        <path d="M4 36 L20 4 L26 13 L15 38 Z" fill="url(#lhBlue)" />
        <path d="M24 4 L42 36 L34 38 L21 15 Z" fill="url(#lhGreen)" />
        <polygon
          points="21,15 28,15 32,25 25,27"
          fill={light ? '#FFFFFF' : '#0066CC'}
          opacity="0.95"
        />
        <circle cx="32" cy="25" r="2.5" fill={light ? '#4ADE80' : '#22B14C'} />
      </g>

      {/* Tipografia VETOR MASTER */}
      <text
        x="64"
        y="33"
        fontFamily="'Inter', sans-serif"
        fontSize="17.5"
        fontWeight="800"
        letterSpacing="2.8"
        fill={textColor}
      >
        VETOR <tspan fill={subColor}>MASTER</tspan>
      </text>

      {/* Subtítulo */}
      <text
        x="65"
        y="47"
        fontFamily="'Inter', sans-serif"
        fontSize="6.2"
        fontWeight="700"
        letterSpacing="1.9"
        fill={taglineColor}
      >
        DIREÇÃO · CONEXÃO · CRESCIMENTO
      </text>
    </svg>
  )
}

/**
 * Componente Geral BrandLogo
 * Default: variant="stacked" (Logo 5 Oficial - vetor ACIMA do nome)
 * Variante: variant="horizontal" (Logo 5e - vetor ao LADO do nome para espaços estreitos)
 */
export default function BrandLogo({
  variant = 'stacked',
  light = false,
  className = '',
  style,
  ...props
}: LogoProps) {
  if (variant === 'horizontal') {
    return (
      <LogoHorizontal
        light={light}
        className={`brand-logo-svg brand-logo-horizontal ${className}`}
        style={style}
        {...props}
      />
    )
  }

  return (
    <LogoStacked
      light={light}
      className={`brand-logo-svg brand-logo-stacked ${className}`}
      style={style}
      {...props}
    />
  )
}
