import Image from 'next/image'
import type { MediaValue } from '@/lib/store-data'

export function BrandMark({
  logo,
  inverse = false,
}: {
  logo?: MediaValue | string | number | null
  inverse?: boolean
}) {
  if (logo && typeof logo === 'object' && logo.url) {
    return (
      <span className="relative block h-12 w-36">
        <Image
          src={logo.url}
          alt={logo.alt || 'Bem Me Quero Maquiagens'}
          fill
          className="object-contain object-left"
          sizes="144px"
        />
      </span>
    )
  }

  return (
    <span className={`leading-none ${inverse ? 'text-[#fffaf7]' : 'text-[#596a49]'}`}>
      <span className="block font-editorial text-[25px] tracking-[-0.03em]">Bem me quero</span>
      <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.28em]">
        Maquiagens
      </span>
    </span>
  )
}
