import type { CSSProperties, ImgHTMLAttributes } from 'react'
import logo5StackedOfficial from '@/assets/logo-5-vetor-master-06jul26-6e3d7.png'
import logo5eHorizontalOfficial from '@/assets/logo-5e-vetor-master-14jul26-7f7d4.png'
import logo5dFooterOfficial from '@/assets/logo-5e-vetor-master-14jul26-6e983.png'

/**
 * LOGOMARCAS OFICIAIS VETOR MASTER — Hierarquia Oficial:
 *
 * 1. Logo 5 (Oficial Principal - Vetor ACIMA do nome):
 *    Arquivo oficial: logo-5-vetor-master-06jul26-6e3d7.png
 *    Usada em: Infográfico / Painel do Hero (ponto focal em destaque máximo) e Preloader.
 *
 * 2. Logo 5e (Variante Horizontal / Wide - Vetor ao LADO do nome):
 *    Arquivo oficial: logo-5e-vetor-master-14jul26-7f7d4.png
 *    Usada em: Cabeçalho (Header) no maior tamanho possível.
 *
 * 3. Logo 5d (Variante Completa com Tríade Direção/Conexão/Crescimento):
 *    Arquivo oficial: logo-5e-vetor-master-14jul26-6e983.png (Logo 5d)
 *    Usada em: Rodapé (Footer) no maior tamanho possível.
 */

export type LogoVariant = 'logo5' | 'logo5e' | 'logo5d' | 'stacked' | 'horizontal'

export interface BrandLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  variant?: LogoVariant
  light?: boolean
  className?: string
  style?: CSSProperties
  alt?: string
}

function resolveLogoSrc(variant: LogoVariant): string {
  switch (variant) {
    case 'logo5e':
    case 'horizontal':
      return logo5eHorizontalOfficial
    case 'logo5d':
      return logo5dFooterOfficial
    case 'logo5':
    case 'stacked':
    default:
      return logo5StackedOfficial
  }
}

/**
 * Componente Geral BrandLogo
 * - variant="logo5" (ou "stacked"): Logo 5 Oficial (vetor ACIMA do nome - Hero/Infográfico)
 * - variant="logo5e" (ou "horizontal"): Logo 5e (vetor ao LADO do nome - Cabeçalho)
 * - variant="logo5d": Logo 5d (com Tríade Direção/Conexão/Crescimento - Rodapé)
 */
export default function BrandLogo({
  variant = 'logo5',
  light = false,
  className = '',
  style,
  alt = 'VETOR MASTER — Direção · Conexão · Crescimento',
  ...props
}: BrandLogoProps) {
  const logoSrc = resolveLogoSrc(variant)
  const variantClass = `brand-logo-${variant}`

  return (
    <img
      src={logoSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      className={`brand-logo-img ${variantClass} ${light ? 'brand-logo-light' : ''} ${className}`}
      style={style}
      {...props}
    />
  )
}
