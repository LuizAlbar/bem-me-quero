'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'
import type { MediaValue } from '@/lib/store-data'
import { isReferenceImage } from '@/lib/content-review'
import { isSafeImageSource } from '@/lib/image-upload'

export function ProductMedia({
  images,
  name,
  sizes,
  priority = false,
  swap = false,
}: {
  images?: Array<MediaValue | string | number> | null
  name: string
  sizes: string
  priority?: boolean
  swap?: boolean
}) {
  const [failed, setFailed] = useState<string[]>([])
  const seen = new Set<string>()
  const available = (images || []).filter((image): image is MediaValue & { url: string } => {
    if (
      typeof image !== 'object' ||
      !image.url ||
      !isSafeImageSource(image.url) ||
      isReferenceImage(image.url) ||
      failed.includes(image.url) ||
      seen.has(image.url)
    )
      return false
    seen.add(image.url)
    return true
  })

  if (!available.length)
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center text-muted">
        <ImageOff size={24} strokeWidth={1.3} aria-hidden="true" />
        <span className="text-xs leading-5">Imagem em breve</span>
      </div>
    )

  return available
    .slice(0, swap ? 2 : 1)
    .map((image, index) => (
      <Image
        key={image.url}
        src={image.url}
        alt={index === 0 ? image.alt || name : ''}
        fill
        priority={priority && index === 0}
        sizes={sizes}
        className={`object-contain p-3 ${index === 1 ? 'product-secondary' : ''}`}
        onError={() => setFailed((current) => [...current, image.url])}
      />
    ))
}
