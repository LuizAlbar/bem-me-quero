import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CreditCard, MessageCircle, Truck } from 'lucide-react'
import { BannerSection } from '@/components/BannerSection'
import { ProductCard } from '@/components/ProductCard'
import { ProductExplorer } from '@/components/ProductExplorer'
import {
  getBanners,
  getCategories,
  getProducts,
  getStoreSettings,
  getTestimonials,
  type MediaValue,
} from '@/lib/store-data'

export default async function HomePage() {
  const [categories, products, banners, testimonials, settings] = await Promise.all([
    getCategories(),
    getProducts(),
    getBanners(),
    getTestimonials(),
    getStoreSettings(),
  ])
  const hero = banners.find((banner) => banner.placement === 'hero')
  const campaign = banners.find((banner) => banner.placement === 'campaign')
  const institutional = banners.find((banner) => banner.placement === 'institutional')
  const bestSellers = products.filter((product) => product.featured).slice(0, 4)
  const heroDesktop =
    hero && typeof hero.desktopImage === 'object' ? (hero.desktopImage as MediaValue) : null
  const heroMobile =
    hero && typeof hero.mobileImage === 'object' ? (hero.mobileImage as MediaValue) : null

  return (
    <main>
      <section className="relative min-h-[70vh] overflow-hidden bg-[#f8e1dd] lg:min-h-[calc(100vh-78px)]">
        <div className="grid min-h-[70vh] lg:min-h-[calc(100vh-78px)] lg:grid-cols-[.82fr_1.18fr]">
          <div className="relative z-10 flex items-end px-5 pb-12 pt-14 md:px-10 lg:items-center lg:px-[max(48px,calc((100vw-1320px)/2+40px))] lg:py-20">
            <div className="max-w-xl">
              <p className="eyebrow">{hero?.eyebrow || 'Beleza para seu dia a dia'}</p>
              <h1 className="mt-5 font-editorial text-[47px] leading-[.91] tracking-[-.045em] sm:text-6xl lg:text-[76px]">
                {hero?.title || 'Realce o que faz você ser você.'}
              </h1>
              <p className="mt-6 max-w-md text-[15px] leading-7 text-[#4f514b] md:text-base">
                {hero?.description || 'Seus favoritos de maquiagem, escolhidos com carinho.'}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link href={hero?.link || '/#produtos'} className="button-primary">
                  {hero?.buttonLabel || 'Explorar produtos'}
                </Link>
                <Link
                  href="/#conheca"
                  className="text-sm font-semibold text-[#596a49] underline decoration-[#a4af85] underline-offset-4"
                >
                  Conhecer a loja
                </Link>
              </div>
            </div>
          </div>
          <div className="relative order-first min-h-[48vh] lg:order-none lg:min-h-0">
            {heroMobile?.url || heroDesktop?.url ? (
              <>
                {heroMobile?.url && (
                  <Image
                    src={heroMobile.url}
                    alt={heroMobile.alt || hero?.title || 'Campanha Bem Me Quero'}
                    fill
                    priority
                    className="object-cover object-center lg:hidden"
                    sizes="100vw"
                  />
                )}
                {heroDesktop?.url && (
                  <Image
                    src={heroDesktop.url}
                    alt={heroDesktop.alt || hero?.title || 'Campanha Bem Me Quero'}
                    fill
                    priority
                    className={`object-cover ${heroMobile?.url ? 'hidden lg:block' : ''}`}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                )}
              </>
            ) : (
              <div className="grid h-full place-items-center bg-[#ead0cb] text-sm text-[#77766f]">
                Imagem editorial da campanha
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="categorias"
        className="mx-auto max-w-[1320px] px-5 py-20 md:px-8 lg:px-10 lg:py-28"
      >
        <SectionHeading
          eyebrow="Comprar por categoria"
          title="Sua beleza, do seu jeito"
          text="Encontre os produtos que combinam com o seu momento e a sua rotina."
          href="/produtos"
          linkLabel="Ver todas as categorias"
        />
        {categories.length ? (
          <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:gap-5 lg:grid-cols-4 lg:gap-6">
            {categories.slice(0, 4).map((category) => {
              const image =
                typeof category.image === 'object' ? (category.image as MediaValue) : null
              return (
                <Link
                  key={category.id}
                  href={`/produtos?categoria=${category.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[14px] bg-[#f4eee9]">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt || category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-xs text-[#77766f]">
                        Imagem da categoria
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <h3 className="font-editorial text-2xl leading-none md:text-[28px]">
                      {category.name}
                    </h3>
                    <ArrowRight
                      size={17}
                      className="text-[#596a49] transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <EmptyContent text="As categorias publicadas aparecerão aqui." />
        )}
      </section>

      <section id="mais-vendidos" className="bg-white">
        <div className="mx-auto max-w-[1320px] px-5 py-20 md:px-8 lg:px-10 lg:py-28">
          <SectionHeading
            eyebrow="Favoritos"
            title="Os queridinhos de vocês"
            text="Uma seleção especial de produtos em destaque na nossa vitrine."
            href="/produtos"
            linkLabel="Ver todos os produtos"
          />
          {bestSellers.length ? (
            <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyContent text="Os produtos destacados no admin aparecerão aqui." />
          )}
        </div>
      </section>

      <BannerSection banner={campaign} variant="campaign" />

      <section
        id="produtos"
        className="mx-auto max-w-[1320px] px-5 py-20 md:px-8 lg:px-10 lg:py-28"
      >
        <SectionHeading
          eyebrow="Nossa curadoria"
          title="Descubra nossos produtos"
          text="Maquiagens para acompanhar seus dias com leveza, cor e personalidade."
        />
        <div className="mt-10">
          <ProductExplorer products={products} categories={categories} compact />
        </div>
      </section>

      <div id="conheca">
        <BannerSection banner={institutional} variant="institutional" />
      </div>

      <section className="bg-[#f8e1dd]/45">
        <div className="mx-auto max-w-[1320px] px-5 py-20 md:px-8 lg:px-10 lg:py-28">
          <SectionHeading
            eyebrow="Depoimentos"
            title="O carinho de quem compra com a gente"
            text="Experiências reais, publicadas somente com autorização."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {(testimonials.length
              ? testimonials.slice(0, 3)
              : [
                  {
                    id: 'empty-1',
                    text: '[Depoimento real a inserir]',
                    displayName: '[Nome da cliente]',
                  },
                  {
                    id: 'empty-2',
                    text: '[Depoimento real a inserir]',
                    displayName: '[Nome da cliente]',
                  },
                  {
                    id: 'empty-3',
                    text: '[Depoimento real a inserir]',
                    displayName: '[Nome da cliente]',
                  },
                ]
            ).map((testimonial) => (
              <figure key={testimonial.id} className="rounded-2xl bg-[#fffaf7] p-7 md:p-8">
                <span className="font-editorial text-5xl leading-none text-[#cb8f98]">“</span>
                <blockquote className="mt-4 text-[15px] leading-7 text-[#4e504a]">
                  {testimonial.text}
                </blockquote>
                <figcaption className="mt-7 text-xs font-semibold uppercase tracking-[0.13em] text-[#596a49]">
                  {testimonial.displayName}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#e8e3df] bg-[#fffaf7]">
        <div className="mx-auto grid max-w-[1320px] px-5 py-14 md:grid-cols-3 md:px-8 lg:px-10">
          <Benefit
            icon={<Truck size={23} strokeWidth={1.5} />}
            title={settings.benefits?.shippingTitle || 'Frete grátis'}
            text={settings.benefits?.shippingText || 'Frete facilitado para todo o Brasil.'}
          />
          <Benefit
            icon={<MessageCircle size={23} strokeWidth={1.5} />}
            title={settings.benefits?.supportTitle || 'Atendimento online'}
            text={settings.benefits?.supportText || 'Fale com a gente para tirar suas dúvidas.'}
          />
          <Benefit
            icon={<CreditCard size={23} strokeWidth={1.5} />}
            title={settings.benefits?.paymentTitle || 'Pagamento flexível'}
            text={settings.benefits?.paymentText || 'Pix ou cartão de crédito parcelado.'}
          />
        </div>
      </section>
    </main>
  )
}

function SectionHeading({
  eyebrow,
  title,
  text,
  href,
  linkLabel,
}: {
  eyebrow: string
  title: string
  text: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-editorial text-[39px] leading-[.98] tracking-[-.035em] md:text-5xl lg:text-[56px]">
          {title}
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-6 text-[#77766f]">{text}</p>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="w-fit text-sm font-semibold text-[#596a49] underline decoration-[#a4af85] underline-offset-4"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

function Benefit({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-4 border-b border-[#e8e3df] py-7 last:border-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#dce1cf] text-[#596a49]">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1.5 text-xs leading-5 text-[#77766f]">{text}</p>
      </div>
    </div>
  )
}

function EmptyContent({ text }: { text: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-[#d6d0ca] px-6 py-14 text-center text-sm text-[#77766f]">
      {text}
    </div>
  )
}
