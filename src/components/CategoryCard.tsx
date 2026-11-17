import Image from 'next/image'
import Link from 'next/link'
import type { CategoryView, MediaValue } from '@/lib/store-data'
import { isSafeImageSource } from '@/lib/image-upload'

export function CategoryCard({
  category,
  priority = false,
}: {
  category: CategoryView
  priority?: boolean
}) {
  const image =
    category.image && typeof category.image === 'object'
      ? (category.image as MediaValue)
      : typeof category.image === 'string'
        ? { id: `img-${category.id}`, url: category.image, alt: category.name }
        : null

  return (
    <Link
      href={`/produtos?categoria=${category.slug}`}
      className="category-card group mx-auto block w-full max-w-[300px] rounded-xl text-center"
      aria-label={`Ver produtos da categoria ${category.name}`}
    >
      <div className="category-image relative aspect-square w-full overflow-hidden rounded-full bg-surface">
        {image?.url && isSafeImageSource(image.url) ? (
          <Image
            src={image.url}
            alt={image?.alt || `Categoria ${category.name} - Bem Me Quero`}
            fill
            priority={priority}
            className="object-cover object-center"
            sizes="(max-width: 767px) calc((100vw - 60px) / 2), (max-width: 1023px) 300px, (max-width: 1319px) 22vw, 300px"
          />
        ) : (
          <div className="grid h-full place-items-center text-xs text-muted">{category.name}</div>
        )}
      </div>

      <h3 className="mt-4 font-editorial text-[clamp(1.4rem,2vw,1.9rem)] leading-tight text-ink transition-colors group-hover:text-brand">
        {category.name}
      </h3>
    </Link>
  )
}
