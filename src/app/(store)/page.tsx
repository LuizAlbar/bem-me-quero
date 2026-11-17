import { CreditCard, MessageCircle, Truck } from 'lucide-react'
import { BannerSection } from '@/components/BannerSection'
import { CategoryCard } from '@/components/CategoryCard'
import { HeroBanner } from '@/components/HeroBanner'
import { ProductCard } from '@/components/ProductCard'
import { SectionHeading } from '@/components/SectionHeading'
import { ProductExplorer } from '@/components/ProductExplorer'
import { Reveal } from '@/components/Reveal'
import { getWhatsAppUrl } from '@/lib/contact-links'
import {
  getBanners,
  getCategories,
  getProducts,
  getStoreSettings,
  getTestimonials,
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
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4)

  const benefits = [
    {
      icon: <Truck size={23} strokeWidth={1.5} />,
      title: settings.benefits?.shippingTitle,
      text: settings.benefits?.shippingText,
    },
    {
      icon: <MessageCircle size={23} strokeWidth={1.5} />,
      title: settings.benefits?.supportTitle,
      text: settings.benefits?.supportText,
    },
    {
      icon: <CreditCard size={23} strokeWidth={1.5} />,
      title: settings.benefits?.paymentTitle,
      text: settings.benefits?.paymentText,
    },
  ].filter((benefit): benefit is typeof benefit & { title: string; text: string } =>
    Boolean(benefit.title?.trim() && benefit.text?.trim()),
  )

  return (
    <main>
      <HeroBanner banner={hero} settings={settings} />

      <section
        id="categorias"
        className="mx-auto max-w-[1320px] px-5 section-spacing md:px-8 lg:px-10"
      >
        <SectionHeading
          eyebrow="Comprar por categoria"
          title="Sua beleza, do seu jeito"
          text="Encontre os produtos que combinam com o seu momento e a sua rotina."
          href="/produtos"
          linkLabel="Ver todas as categorias"
        />
        {categories.length ? (
          <Reveal
            stagger
            className="mt-12 grid grid-cols-2 gap-x-5 gap-y-8 md:gap-x-10 md:gap-y-10 lg:grid-cols-4 lg:gap-8"
          >
            {categories.slice(0, 4).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </Reveal>
        ) : (
          <EmptyContent text="Nenhuma categoria disponível no momento." />
        )}
      </section>

      {featuredProducts.length > 0 && (
        <section id="mais-vendidos" className="bg-paper">
          <div className="mx-auto max-w-[1320px] px-5 section-spacing md:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Nossa seleção"
              title="Destaques da loja"
              text="Uma seleção especial de produtos em destaque na nossa vitrine."
              href="/produtos"
              linkLabel="Ver todos os produtos"
            />
            {featuredProducts.length ? (
              <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyContent text="Nenhum destaque disponível no momento." />
            )}
          </div>
        </section>
      )}

      <BannerSection banner={campaign} variant="campaign" settings={settings} />

      <section
        id="produtos"
        className="mx-auto max-w-[1320px] px-5 section-spacing md:px-8 lg:px-10"
      >
        <SectionHeading
          eyebrow="Nossa curadoria"
          title="Descubra nossos produtos"
          text="Maquiagens para acompanhar seus dias com leveza, cor e personalidade."
        />
        <div className="mt-8">
          <ProductExplorer
            products={products}
            categories={categories}
            compact
            contactHref={getWhatsAppUrl(settings.whatsapp)}
          />
        </div>
      </section>

      <div id="conheca">
        <BannerSection banner={institutional} variant="institutional" settings={settings} />
      </div>

      {testimonials.length > 0 && (
        <section className="bg-[#f8e1dd]/45">
          <div className="mx-auto max-w-[1320px] px-5 section-spacing md:px-8 lg:px-10">
            <SectionHeading eyebrow="Depoimentos" title="O carinho de quem compra com a gente" />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {testimonials.slice(0, 3).map((testimonial) => (
                <figure key={testimonial.id} className="rounded-card bg-paper p-6 md:p-8">
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
      )}

      {benefits.length > 0 && (
        <section className="border-b border-border bg-petal">
          <div
            className={`mx-auto grid max-w-[1320px] gap-6 px-5 py-10 md:px-8 lg:px-10 ${benefits.length > 1 ? 'md:grid-cols-3' : ''}`}
          >
            {benefits.map((benefit) => (
              <Benefit key={benefit.title} {...benefit} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

function Benefit({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-4 py-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#dce1cf] text-[#596a49]">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1.5 text-xs leading-5 text-muted">{text}</p>
      </div>
    </div>
  )
}

function EmptyContent({ text }: { text: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-[#d6d0ca] px-6 py-14 text-center text-sm text-muted">
      {text}
    </div>
  )
}
