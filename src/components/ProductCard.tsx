import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { MediaValue, ProductView } from '@/lib/store-data'
import { getProductPrice } from '@/lib/catalog'

const badgeLabels = {
  'best-seller': 'Seleção da loja',
  new: 'Novo',
  highlight: 'Destaque',
  offer: 'Oferta',
}

export function ProductCard({ product }: { product: ProductView }) {
  const image = product.images?.find((item) => typeof item === 'object') as MediaValue | undefined
  const category = typeof product.category === 'object' ? product.category : null

  return (
    <article className="group min-w-0">
      <Link
        href={`/produto/${product.slug}`}
        className="block rounded-xl"
        aria-label={`${product.name}, ${formatCurrency(getProductPrice(product))}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#f4eee9]">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="grid h-full place-items-center px-6 text-center text-sm text-muted">
              Imagem do produto
            </div>
          )}
          {product.badge && product.badge !== 'none' && (
            <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-md bg-[#fffaf7]/95 px-2 py-1 text-[10px] font-semibold text-brand">
              {badgeLabels[product.badge]}
            </span>
          )}
          {product.availability === 'unavailable' && (
            <span className="absolute inset-x-3 bottom-3 rounded-lg bg-[#22251f]/85 px-3 py-2 text-center text-xs text-white">
              Indisponível no momento
            </span>
          )}
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 hidden size-10 place-items-center rounded-full bg-white text-brand md:grid"
          >
            <ArrowUpRight size={17} />
          </span>
        </div>
        <div className="pt-4">
          {category && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              {category.name}
            </p>
          )}
          <div className="mt-2 flex flex-col items-start gap-2">
            <h3 className="min-h-10 min-w-0 line-clamp-2 break-words text-[15px] font-medium leading-5">
              {product.name}
            </h3>
            <div className="flex flex-wrap items-baseline gap-x-2 text-sm tabular-nums">
              {product.salePrice != null && product.salePrice < product.price ? (
                <>
                  <span className="font-semibold text-brand">
                    {formatCurrency(product.salePrice)}
                  </span>
                  <span className="text-xs text-muted line-through">
                    {formatCurrency(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-semibold text-brand">
                  {formatCurrency(getProductPrice(product))}
                </span>
              )}
            </div>
          </div>
          <span className="mt-3 inline-block text-xs font-semibold text-[#596a49] underline decoration-[#a4af85] underline-offset-4 md:hidden">
            Ver detalhes
          </span>
        </div>
      </Link>
    </article>
  )
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
