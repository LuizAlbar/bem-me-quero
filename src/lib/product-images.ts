import type { Product } from '@/db/schema'

export function updatePrimaryImage(
  images: Product['images'],
  url: string,
  name: string,
): Product['images'] {
  if (!url) return images
  return [{ id: images[0]?.id || `img-${Date.now()}`, url, alt: name }, ...images.slice(1)]
}
