import Image from 'next/image'
import Link from 'next/link'
import type { CategoryView } from '@/lib/store-data'

export function CategoryCard({ category }: { category: CategoryView }) {
  const image = typeof category.image === 'object' ? category.image : null

  return (
    <Link
      href={`/produtos?categoria=${category.slug}`}
      aria-label={category.name}
      className="group mx-auto flex w-full min-w-0 max-w-[300px] flex-col items-center rounded-xl text-center"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-full bg-[#f4eee9]">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || category.name}
            fill
            quality={90}
            className="object-cover object-center transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"
            sizes="(min-width: 1320px) 292px, (min-width: 1024px) calc((100vw - 152px) / 4), (min-width: 660px) 300px, calc((100vw - 60px) / 2)"
          />
        ) : (
          <div className="grid h-full place-items-center px-4 text-xs text-muted">
            Imagem da categoria
          </div>
        )}
      </div>
      <h3 className="mt-4 max-w-full break-words font-editorial text-2xl font-normal leading-tight text-navigation md:text-[28px]">
        {category.name}
      </h3>
    </Link>
  )
}
