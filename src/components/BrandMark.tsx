import Image from 'next/image'
import type { MediaValue } from '@/lib/store-data'

export function BrandMark({
  logo,
  inverse = false,
  className = '',
}: {
  logo?: MediaValue | string | number | null
  inverse?: boolean
  className?: string
}) {
  const resolvedUrl =
    typeof logo === 'object' && logo?.url
      ? logo.url
      : typeof logo === 'string' && logo.length > 0
        ? logo
        : inverse
          ? '/assets/logo-white.png'
          : '/assets/logo.png'

  const alt = typeof logo === 'object' && logo?.alt ? logo.alt : 'Bem Me Quero Maquiagens'

  return (
    <span className={`relative block shrink-0 ${className || 'h-14 w-44 sm:h-16 sm:w-52'}`}>
      <Image
        src={resolvedUrl}
        alt={alt}
        fill
        priority
        className={`object-contain object-left ${
          inverse && resolvedUrl !== '/assets/logo-white.png' ? 'brightness-0 invert' : ''
        }`}
        sizes="(max-width: 640px) 176px, 208px"
      />
    </span>
  )
}
