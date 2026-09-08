import type { CSSProperties, ImgHTMLAttributes } from 'react'
import logo5StackedOfficial from '@/assets/logo-5-vetor-master-06jul26-6e3d7.png'
import logo5eHorizontalOfficial from '@/assets/logo-5e-vetor-master-14jul26-7f7d4.png'
import logo5dFooterOfficial from '@/assets/logo-5e-vetor-master-14jul26-6e983.png'
import vetorMaster2Svg from '@/assets/vetor-master2.svg'
import vetorMaster2ReverseSvg from '@/assets/vetor-master2-reverse.svg'

/**
 * LOGOMARCAS OFICIAIS VETOR MASTER — Hierarquia Oficial:
 *
 * 1. Logo 5 (Oficial Principal - Vetor ACIMA do nome):
 *    Arquivo oficial: logo-5-vetor-master-06jul26-6e3d7.png
 *    Usada em: Infográfico / Painel do Hero (ponto focal em destaque máximo) e Preloader.
 *
 * 2. Logo 5e / SVG Vetorial Oficial:
 *    Arquivo oficial: vetor-master2.svg / vetor-master2-reverse.svg
 *    Usada em: Cabeçalho (Header), Painel da Prisão do Fundador e Rodapé (versão reversa para fundo escuro).
 *
 * 3. Logo 5d / Fallback PNGs mantidos para compatibilidade.
 */

export type LogoVariant =
  | 'logo5'
  | 'logo5e'
  | 'logo5d'
  | 'stacked'
  | 'horizontal'
  | 'svg'
  | 'svg-reverse'

export interface BrandLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  variant?: LogoVariant
  light?: boolean
  className?: string
  style?: CSSProperties
  alt?: string
}

function resolveLogoSrc(variant: LogoVariant, light?: boolean): string {
  switch (variant) {
    case 'svg':
      return light ? vetorMaster2ReverseSvg : vetorMaster2Svg
    case 'svg-reverse':
      return vetorMaster2ReverseSvg
    case 'logo5e':
    case 'horizontal':
      return light ? vetorMaster2ReverseSvg : vetorMaster2Svg
    case 'logo5d':
      return light ? vetorMaster2ReverseSvg : logo5dFooterOfficial
    case 'logo5':
    case 'stacked':
    default:
      return logo5StackedOfficial
  }
}

/**
 * Componente Geral BrandLogo
 * - variant="logo5" (ou "stacked"): Logo 5 Oficial (vetor ACIMA do nome - Hero/Infográfico)
 * - variant="logo5e" (ou "horizontal"): Logo 5e (vetor ao LADO do nome - Cabeçalho / Console)
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
  const logoSrc = resolveLogoSrc(variant, light)

  return (
    <img
      src={logoSrc}
      alt={alt}
      loading="eager"
      decoding="async"
      className={`brand-logo-img ${light ? 'brand-logo-light' : ''} ${className}`}
      style={style}
      {...props}
    />
  )
}
