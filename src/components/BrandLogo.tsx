import type { CSSProperties, ImgHTMLAttributes } from 'react'
import logoStackedOfficial from '@/assets/logo-5-vetor-master-06jul26-6e3d7.png'
import logoHorizontalOfficial from '@/assets/logo-5e-vetor-master-14jul26-7f7d4.png'

/**
 * LOGOMARCAS OFICIAIS VETOR MASTER
 *
 * 1. Logo 5 (Oficial Principal - Vertical / Stacked):
 *    Vetor ACIMA do nome "VETOR MASTER".
 *    Arquivo oficial: logo-5-vetor-master-06jul26-6e3d7.png
 *    Usada em: Cabeçalho, Hero, Preloader, Rodapé.
 *
 * 2. Logo 5e (Variante Horizontal / Wide):
 *    Vetor ao LADO do nome "VETOR MASTER".
 *    Arquivo oficial: logo-5e-vetor-master-14jul26-7f7d4.png
 *    Usada em: Espaços estreitos/horizontais específicos.
 */

export interface BrandLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  variant?: 'stacked' | 'horizontal'
  light?: boolean
  className?: string
  style?: CSSProperties
  alt?: string
}

/**
 * Componente Geral BrandLogo
 * Default: variant="stacked" (Logo 5 Oficial - vetor ACIMA do nome)
 * Variante: variant="horizontal" (Logo 5e Oficial - vetor ao LADO do nome)
 */
export default function BrandLogo({
  variant = 'stacked',
  light = false,
  className = '',
  style,
  alt = 'VETOR MASTER — Direção · Conexão · Crescimento',
  ...props
}: BrandLogoProps) {
  const isHorizontal = variant === 'horizontal'
  const logoSrc = isHorizontal ? logoHorizontalOfficial : logoStackedOfficial

  return (
    <img
      src={logoSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      className={`brand-logo-img ${isHorizontal ? 'brand-logo-horizontal' : 'brand-logo-stacked'} ${
        light ? 'brand-logo-light' : ''
      } ${className}`}
      style={style}
      {...props}
    />
  )
}
