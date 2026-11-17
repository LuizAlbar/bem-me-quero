import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, ChevronDown, MessageCircle } from 'lucide-react'
import { ProductCard, formatCurrency } from '@/components/ProductCard'
import { getProductBySlug, getProducts, getStoreSettings, type MediaValue } from '@/lib/store-data'
import { getProductPrice, hasSalePrice } from '@/lib/catalog'
import { getWhatsAppUrl } from '@/lib/contact-links'
import { ProductMedia } from '@/components/ProductMedia'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, products, settings] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
    getStoreSettings(),
  ])
  if (!product) notFound()

  const images =
    product.images?.filter((image): image is MediaValue => typeof image === 'object') || []
  const category = typeof product.category === 'object' ? product.category : null
  const related = products
    .filter(
      (item) =>
        item.id !== product.id &&
        typeof item.category === 'object' &&
        item.category?.id === category?.id,
    )
    .slice(0, 4)
  const message = `${settings.contactMessage || 'Olá! Gostaria de consultar a disponibilidade de'} ${product.name}.`
  const whatsapp = getWhatsAppUrl(settings.whatsapp, message)
  const contactHref = whatsapp || '/#contato'

  return (
    <main>
      <div className="mx-auto max-w-[1320px] px-5 py-5 md:px-8 lg:px-10">
        <Link
          href="/produtos"
          className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-brand"
        >
          <ArrowLeft size={15} /> Voltar aos produtos
        </Link>
      </div>
      <section className="mx-auto grid max-w-[1320px] gap-10 px-5 pb-20 md:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-16 lg:px-10 lg:pb-28">
        <div>
          {images.length ? (
            <div className="grid grid-cols-2 gap-3">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`product-image relative overflow-hidden bg-paper ${
                    index === 0 ? 'col-span-2 aspect-[5/4]' : 'aspect-[4/5]'
                  }`}
                >
                  <ProductMedia
                    images={[image]}
                    name={`${product.name} — imagem ${index + 1}`}
                    priority={index === 0}
                    sizes={
                      index === 0
                        ? '(max-width: 1024px) 100vw, 55vw'
                        : '(max-width: 1024px) 50vw, 28vw'
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="product-image relative aspect-[5/4] overflow-hidden bg-paper">
              <ProductMedia images={[]} name={product.name} sizes="100vw" />
            </div>
          )}
        </div>
        <div className="lg:sticky lg:top-28 lg:h-fit">
          {category && <p className="eyebrow">{category.name}</p>}
          <h1 className="page-title mt-4">{product.name}</h1>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-xl font-semibold text-[#596a49]">
              {formatCurrency(getProductPrice(product))}
            </span>
            {hasSalePrice(product) && (
              <span className="text-sm text-muted line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm">
            <span
              className={`size-2 rounded-full ${
                product.availability === 'unavailable' ? 'bg-[#cb8f98]' : 'bg-[#596a49]'
              }`}
            />
            {product.availability === 'unavailable'
              ? 'Indisponível no momento'
              : product.availability === 'low'
                ? 'Estoque baixo — consulte a disponibilidade'
                : 'Disponível para consulta'}
          </div>
          <p className="mt-7 text-[15px] leading-7 text-[#5f615b]">{product.description}</p>

          {product.variants?.length ? (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.13em]">Variações</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <span
                    key={variant.id || variant.name}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#e8e3df] bg-white px-3 text-xs"
                  >
                    {variant.color && (
                      <span
                        className="size-4 rounded-full border border-black/10"
                        style={{ backgroundColor: variant.color }}
                      />
                    )}
                    {variant.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <a
            href={contactHref}
            target={whatsapp ? '_blank' : undefined}
            rel={whatsapp ? 'noreferrer' : undefined}
            className="button-primary mt-9 w-full gap-2"
          >
            <MessageCircle size={18} />
            {whatsapp ? 'Pedir no WhatsApp' : 'Consultar disponibilidade'}
          </a>
          {!whatsapp && (
            <p className="mt-3 text-center text-xs text-muted">
              O WhatsApp será exibido quando cadastrado nas configurações da loja.
            </p>
          )}

          <div className="mt-10 divide-y divide-[#e8e3df] border-y border-[#e8e3df]">
            {product.details && <Detail title="Detalhes" text={product.details} />}
            {product.usage && <Detail title="Modo de uso" text={product.usage} />}
            <div className="flex gap-3 py-5 text-sm text-[#5f615b]">
              <Check size={18} className="shrink-0 text-[#596a49]" />
              Atendimento próximo para ajudar na sua escolha.
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1320px] px-5 section-spacing md:px-8 lg:px-10">
            <p className="eyebrow">Você também pode gostar</p>
            <h2 className="section-title mt-3">Complete sua seleção</h2>
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function Detail({ title, text }: { title: string; text: string }) {
  return (
    <details className="product-detail py-2">
      <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm font-semibold">
        {title}{' '}
        <ChevronDown
          size={17}
          className="transition-transform motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>
      <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
    </details>
  )
}
