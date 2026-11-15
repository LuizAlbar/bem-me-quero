import { asc, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { banners, categories, products, storeSettings, testimonials } from '@/db/schema'

export type MediaValue = {
  id: string | number
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export type CategoryView = {
  id: string | number
  name: string
  slug: string
  description?: string | null
  image?: MediaValue | string | number | null
}

export type ProductView = {
  id: string | number
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number | null
  category?: CategoryView | string | number | null
  images?: Array<MediaValue | string | number> | null
  availability?: 'available' | 'low' | 'unavailable' | null
  featured?: boolean | null
  badge?: 'none' | 'best-seller' | 'new' | 'highlight' | 'offer' | null
  variants?: Array<{ id?: string | null; name: string; color?: string | null }> | null
  details?: string | null
  usage?: string | null
}

export type BannerView = {
  id: string | number
  placement: 'hero' | 'campaign' | 'institutional'
  desktopImage?: MediaValue | string | number | null
  mobileImage?: MediaValue | string | number | null
  eyebrow?: string | null
  title: string
  description?: string | null
  buttonLabel?: string | null
  link?: string | null
}

export type TestimonialView = {
  id: string | number
  displayName: string
  text: string
  rating?: number | null
}

export type SettingsView = {
  storeName?: string | null
  logo?: MediaValue | string | number | null
  instagram?: string | null
  whatsapp?: string | null
  shortText?: string | null
  contactMessage?: string | null
  benefits?: {
    shippingTitle?: string | null
    shippingText?: string | null
    supportTitle?: string | null
    supportText?: string | null
    paymentTitle?: string | null
    paymentText?: string | null
  } | null
  usefulLinks?: Array<{ id?: string | null; label: string; url: string }> | null
}

export const FALLBACK_CATEGORIES: CategoryView[] = [
  {
    id: 'cat-labios',
    name: 'Lábios',
    slug: 'labios',
    description: 'Batons cremosos, mates, gloss labial e hidratantes com cores apaixonantes.',
    image: {
      id: 'img-cat-labios',
      url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      alt: 'Categoria de Lábios - Batons e Gloss',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'cat-olhos',
    name: 'Olhos',
    slug: 'olhos',
    description: 'Máscaras de cílios, delineadores, sombras e lápis para um olhar marcante.',
    image: {
      id: 'img-cat-olhos',
      url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      alt: 'Categoria de Olhos - Máscaras e Sombras',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'cat-pele',
    name: 'Pele',
    slug: 'pele',
    description: 'Bases, corretivos, blushes e iluminadores para um acabamento leve e radiante.',
    image: {
      id: 'img-cat-pele',
      url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      alt: 'Categoria de Pele - Bases e Blushes',
      width: 800,
      height: 1000,
    },
  },
  {
    id: 'cat-skincare',
    name: 'Skincare',
    slug: 'skincare',
    description: 'Séruns, brumas hidratantes e óleos faciais para preparar e cuidar da sua pele.',
    image: {
      id: 'img-cat-skincare',
      url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      alt: 'Categoria de Skincare - Séruns e Brumas',
      width: 800,
      height: 1000,
    },
  },
]

export const FALLBACK_PRODUCTS: ProductView[] = [
  {
    id: 'prod-gloss-labial',
    name: 'Gloss Labial Hidratante Brilho Espelhado',
    slug: 'gloss-labial-hidratante-brilho-espelhado',
    description:
      'Fórmula enriquecida com ácido hialurônico e óleo de jojoba. Proporciona brilho espelhado intenso sem sensação pegajosa, deixando os lábios macios e volumosos.',
    price: 42.9,
    salePrice: 38.9,
    category: FALLBACK_CATEGORIES[0],
    images: [
      {
        id: 'img-gloss-1',
        url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
        alt: 'Gloss Labial Hidratante',
      },
    ],
    availability: 'available',
    featured: true,
    badge: 'best-seller',
  },
]

export const FALLBACK_SETTINGS: SettingsView = {
  storeName: 'Bem Me Quero Maquiagens',
  logo: {
    id: 'bem-me-quero-logo',
    url: '/assets/logo.png',
    alt: 'Bem Me Quero Maquiagens',
    width: 2172,
    height: 724,
  },
  instagram: 'https://instagram.com/bemmequero.make',
  whatsapp: '5511999999999',
  shortText:
    'Produtos de maquiagem e cuidados escolhidos com carinho para realçar o que faz você ser você.',
  contactMessage: 'Olá! Vim pelo site da Bem Me Quero e gostaria de consultar a disponibilidade de',
  benefits: {
    shippingTitle: 'Frete facilitado',
    shippingText: 'Entrega rápida e segura para todo o Brasil.',
    supportTitle: 'Atendimento com carinho',
    supportText: 'Tire suas dúvidas e faça seu pedido direto pelo WhatsApp.',
    paymentTitle: 'Pagamento flexível',
    paymentText: 'Pague via Pix ou parcele suas compras no cartão de crédito.',
  },
  usefulLinks: [
    { id: 'link-1', label: 'Início', url: '/' },
    { id: 'link-2', label: 'Catálogo de Produtos', url: '/produtos' },
    { id: 'link-3', label: 'Categorias', url: '/#categorias' },
    { id: 'link-4', label: 'Fale Conosco', url: 'https://wa.me/5511999999999' },
  ],
}

export async function getCategories(): Promise<CategoryView[]> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.visible, true))
      .orderBy(asc(categories.order))

    if (!rows.length) return FALLBACK_CATEGORIES

    return rows.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.imageUrl
        ? {
            id: `img-${cat.id}`,
            url: cat.imageUrl,
            alt: cat.name,
          }
        : null,
    }))
  } catch (error) {
    console.warn('Erro ao carregar categorias do banco, usando fallback:', error)
    return FALLBACK_CATEGORIES
  }
}

export async function getProducts(): Promise<ProductView[]> {
  try {
    const rows = await db.query.products.findMany({
      with: { category: true },
      orderBy: [desc(products.createdAt)],
    })

    if (!rows.length) return FALLBACK_PRODUCTS

    return rows.map((prod) => ({
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      price: Number(prod.price),
      salePrice: prod.salePrice ? Number(prod.salePrice) : null,
      category: prod.category
        ? {
            id: prod.category.id,
            name: prod.category.name,
            slug: prod.category.slug,
            description: prod.category.description,
            image: prod.category.imageUrl
              ? { id: `img-${prod.category.id}`, url: prod.category.imageUrl }
              : null,
          }
        : null,
      images: prod.images || [],
      availability: prod.availability as 'available' | 'low' | 'unavailable',
      featured: prod.featured,
      badge: prod.badge as 'none' | 'best-seller' | 'new' | 'highlight' | 'offer',
      variants: prod.variants || [],
      details: prod.details,
      usage: prod.usage,
    }))
  } catch (error) {
    console.warn('Erro ao carregar produtos do banco, usando fallback:', error)
    return FALLBACK_PRODUCTS
  }
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  try {
    const prod = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: { category: true },
    })

    if (!prod) return null

    return {
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      price: Number(prod.price),
      salePrice: prod.salePrice ? Number(prod.salePrice) : null,
      category: prod.category
        ? {
            id: prod.category.id,
            name: prod.category.name,
            slug: prod.category.slug,
            description: prod.category.description,
            image: prod.category.imageUrl
              ? { id: `img-${prod.category.id}`, url: prod.category.imageUrl }
              : null,
          }
        : null,
      images: prod.images || [],
      availability: prod.availability as 'available' | 'low' | 'unavailable',
      featured: prod.featured,
      badge: prod.badge as 'none' | 'best-seller' | 'new' | 'highlight' | 'offer',
      variants: prod.variants || [],
      details: prod.details,
      usage: prod.usage,
    }
  } catch (error) {
    console.warn(`Erro ao carregar produto ${slug} do banco:`, error)
    return null
  }
}

export async function getBanners(): Promise<BannerView[]> {
  try {
    const rows = await db.select().from(banners).orderBy(asc(banners.order))

    if (!rows.length) return []

    return rows.map((b) => ({
      id: b.id,
      placement: b.placement as 'hero' | 'campaign' | 'institutional',
      eyebrow: b.eyebrow,
      title: b.title,
      description: b.description,
      buttonLabel: b.buttonLabel,
      link: b.link,
      desktopImage: b.desktopImageUrl
        ? { id: `img-d-${b.id}`, url: b.desktopImageUrl, alt: b.title }
        : null,
      mobileImage: b.mobileImageUrl
        ? { id: `img-m-${b.id}`, url: b.mobileImageUrl, alt: b.title }
        : null,
    }))
  } catch (error) {
    console.warn('Erro ao carregar banners do banco:', error)
    return []
  }
}

export async function getTestimonials(): Promise<TestimonialView[]> {
  try {
    const rows = await db.select().from(testimonials).orderBy(asc(testimonials.order))

    return rows.map((t) => ({
      id: t.id,
      displayName: t.displayName,
      text: t.text,
      rating: t.rating,
    }))
  } catch (error) {
    console.warn('Erro ao carregar depoimentos do banco:', error)
    return []
  }
}

export async function getStoreSettings(): Promise<SettingsView> {
  try {
    const [row] = await db.select().from(storeSettings).limit(1)
    if (!row) return FALLBACK_SETTINGS

    return {
      storeName: row.storeName,
      logo: FALLBACK_SETTINGS.logo,
      whatsapp: row.whatsapp,
      instagram: row.instagram,
      shortText: row.shortText,
      contactMessage: row.contactMessage,
      benefits: row.benefits,
      usefulLinks: row.usefulLinks,
    }
  } catch (error) {
    console.warn('Erro ao carregar configurações da loja do banco:', error)
    return FALLBACK_SETTINGS
  }
}
