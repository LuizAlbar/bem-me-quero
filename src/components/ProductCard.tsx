import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { ProductView } from '@/lib/store-data'
import { getProductPrice, hasSalePrice } from '@/lib/catalog'
import { ProductMedia } from '@/components/ProductMedia'

const badgeLabels = {
  'best-seller': 'Seleção da loja',
  new: 'Novo',
  highlight: 'Destaque',
  offer: 'Oferta',
}

export function ProductCard({ product }: { product: ProductView }) {
  const category = typeof product.category === 'object' ? product.category : null
  const badge = product.badge === 'offer' && !hasSalePrice(product) ? 'none' : product.badge

  return (
    <article className="product-card group min-w-0">
      <Link
        href={`/produto/${product.slug}`}
        className="block rounded-xl"
        aria-label={`${product.name}, ${formatCurrency(getProductPrice(product))}`}
      >
        <div className="product-image relative aspect-[4/5] overflow-hidden bg-paper">
          <ProductMedia
            images={product.images}
            name={product.name}
            sizes="(max-width: 767px) calc((100vw - 52px) / 2), (max-width: 1023px) 30vw, (max-width: 1319px) 23vw, 292px"
            swap
          />
          {badge && badge !== 'none' && (
            <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-md bg-[#fffaf7]/95 px-2 py-1 text-[10px] font-semibold text-brand">
              {badgeLabels[badge]}
            </span>
          )}
          {product.availability === 'unavailable' && (
            <span className="absolute inset-x-3 bottom-3 rounded-lg bg-[#22251f]/85 px-3 py-2 text-center text-xs text-white">
              Indisponível no momento
            </span>
          )}
        </div>
        <div className="pt-4">
          {category && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              {category.name}
            </p>
          )}
          <div className="mt-2 flex flex-col items-start gap-2">
            <h3 className="min-h-10 min-w-0 break-words text-sm font-medium leading-5 sm:text-[15px]">
              {product.name}
            </h3>
            <div className="flex flex-wrap items-baseline gap-x-2 text-sm tabular-nums">
              {hasSalePrice(product) ? (
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
          <span className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-brand underline decoration-brand/40 underline-offset-4">
            Ver detalhes{' '}
            <ArrowUpRight
              size={15}
              className="detail-arrow transition-transform"
              aria-hidden="true"
            />
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
