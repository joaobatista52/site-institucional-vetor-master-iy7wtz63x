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
  if (typeof window !== 'undefined' && !(window as any).__png_checked) {
    (window as any).__png_checked = true
    const checkImg = (name: string, url: string) => {
      const img = new Image()
      img.onload = () => {
        const c = document.createElement('canvas')
        c.width = img.width
        c.height = img.height
        const ctx = c.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        const idata = ctx.getImageData(0, 0, img.width, img.height)
        let minX = img.width, maxX = 0, minY = img.height, maxY = 0
        const d = idata.data
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4
            const r = d[idx], g = d[idx + 1], b = d[idx + 2], a = d[idx + 3]
            if (a > 15 && !(r > 245 && g > 245 && b > 245)) {
              if (x < minX) minX = x
              if (x > maxX) maxX = x
              if (y < minY) minY = y
              if (y > maxY) maxY = y
            }
          }
        }
        const cropW = maxX - minX + 1
        const cropH = maxY - minY + 1
        // Create cropped canvas
        const cropCanvas = document.createElement('canvas')
        cropCanvas.width = cropW
        cropCanvas.height = cropH
        const cropCtx = cropCanvas.getContext('2d')
        if (cropCtx) {
          cropCtx.drawImage(c, minX, minY, cropW, cropH, 0, 0, cropW, cropH)
          const dataUrl = cropCanvas.toDataURL('image/png')
          document.body.setAttribute(`data-crop-${name}`, `${cropW}x${cropH}`)
          // Send to backend logs via dummy fetch
          fetch(`/api/collections/_pb_users_auth_/records?page=1&perPage=1&crop=${name}&w=${cropW}&h=${cropH}&minX=${minX}&minY=${minY}`).catch(() => {})
        }
      }
      img.src = url
    }
    checkImg('logo5eHorizontal', logo5eHorizontalOfficial)
    checkImg('logo5dFooter', logo5dFooterOfficial)
    checkImg('logo5Stacked', logo5StackedOfficial)
  }

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
