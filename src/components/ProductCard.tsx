import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { MediaValue, ProductView } from '@/lib/store-data'

const badgeLabels = {
  'best-seller': 'Mais vendido',
  new: 'Novo',
  highlight: 'Destaque',
  offer: 'Oferta',
}

export function ProductCard({ product }: { product: ProductView }) {
  const image = product.images?.find((item) => typeof item === 'object') as MediaValue | undefined
  const category = typeof product.category === 'object' ? product.category : null

  return (
    <article className="group min-w-0">
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#f4eee9]">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="grid h-full place-items-center px-6 text-center text-sm text-[#77766f]">
              Imagem do produto
            </div>
          )}
          {product.badge && product.badge !== 'none' && (
            <span className="absolute left-3 top-3 rounded-md bg-[#fffaf7]/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#596a49]">
              {badgeLabels[product.badge]}
            </span>
          )}
          {product.availability === 'unavailable' && (
            <span className="absolute inset-x-3 bottom-3 rounded-lg bg-[#22251f]/85 px-3 py-2 text-center text-xs text-white">
              Indisponível no momento
            </span>
          )}
          <span className="absolute bottom-3 right-3 hidden size-10 place-items-center rounded-full bg-white text-[#596a49] shadow-sm transition-transform group-hover:-translate-y-0.5 md:grid">
            <ArrowUpRight size={17} />
          </span>
        </div>
        <div className="pt-4">
          {category && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#77766f]">
              {category.name}
            </p>
          )}
          <div className="mt-1.5 flex flex-col items-start justify-between gap-2 lg:flex-row lg:gap-3">
            <h3 className="min-w-0 break-words text-[15px] font-medium leading-5">
              {product.name}
            </h3>
            <div className="shrink-0 text-sm lg:text-right">
              {product.salePrice ? (
                <>
                  <span className="block font-semibold text-[#596a49]">
                    {formatCurrency(product.salePrice)}
                  </span>
                  <span className="text-xs text-[#77766f] line-through">
                    {formatCurrency(product.price)}
                  </span>
                </>
              ) : (
                <span>{formatCurrency(product.price)}</span>
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
