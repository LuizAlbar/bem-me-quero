import { cache } from 'react'
import { asc, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { banners, categories, products, testimonials } from '@/db/schema'
import { readStoreSettings } from '@/lib/store-settings'
import {
  isDemonstrationProduct,
  isDemonstrationTestimonial,
  getReviewedBenefits,
  isReferenceImage,
} from '@/lib/content-review'

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

export const FALLBACK_SETTINGS: SettingsView = {
  storeName: 'Bem Me Quero Maquiagens',
  logo: {
    id: 'bem-me-quero-logo',
    url: '/assets/logo.png',
    alt: 'Bem Me Quero Maquiagens',
    width: 2172,
    height: 724,
  },
  shortText:
    'Produtos de maquiagem e cuidados escolhidos com carinho para realçar o que faz você ser você.',
  contactMessage: 'Olá! Vim pelo site da Bem Me Quero e gostaria de consultar a disponibilidade de',
  usefulLinks: [
    { id: 'link-1', label: 'Início', url: '/' },
    { id: 'link-2', label: 'Catálogo de Produtos', url: '/produtos' },
    { id: 'link-3', label: 'Categorias', url: '/#categorias' },
  ],
}

export const getCategories = cache(async (): Promise<CategoryView[]> => {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.visible, true))
      .orderBy(asc(categories.order))

    if (!rows.length) return []

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
    console.warn('Erro ao carregar categorias do banco:', error)
    return []
  }
})

export const getProducts = cache(async (): Promise<ProductView[]> => {
  try {
    const rows = await db.query.products.findMany({
      with: { category: true },
      orderBy: [desc(products.createdAt)],
    })

    if (!rows.length) return []

    return rows
      .filter((product) => !isDemonstrationProduct(product))
      .map((prod) => ({
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
        images: (prod.images || []).filter((image) => !isReferenceImage(image.url)),
        availability: prod.availability as 'available' | 'low' | 'unavailable',
        featured: prod.featured,
        badge: prod.badge as 'none' | 'best-seller' | 'new' | 'highlight' | 'offer',
        variants: prod.variants || [],
        details: prod.details,
        usage: prod.usage,
      }))
  } catch (error) {
    console.warn('Erro ao carregar produtos do banco:', error)
    throw new Error('Não foi possível carregar os produtos. Tente novamente.')
  }
})

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  try {
    const prod = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: { category: true },
    })

    if (!prod || isDemonstrationProduct(prod)) return null

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
      images: (prod.images || []).filter((image) => !isReferenceImage(image.url)),
      availability: prod.availability as 'available' | 'low' | 'unavailable',
      featured: prod.featured,
      badge: prod.badge as 'none' | 'best-seller' | 'new' | 'highlight' | 'offer',
      variants: prod.variants || [],
      details: prod.details,
      usage: prod.usage,
    }
  } catch (error) {
    console.warn(`Erro ao carregar produto ${slug} do banco:`, error)
    throw new Error('Não foi possível carregar o produto. Tente novamente.')
  }
}

export async function getBanners(): Promise<BannerView[]> {
  try {
    const rows = await db.select().from(banners).orderBy(asc(banners.order))

    if (!rows.length) return []

    return rows.map((b) => ({
      id: b.id,
      placement: b.placement as 'hero' | 'campaign' | 'institutional',
      eyebrow:
        b.placement === 'campaign' && b.eyebrow === 'Coleção Leveza'
          ? 'Seleção Bem Me Quero'
          : b.eyebrow,
      title: b.title,
      description:
        b.description ===
        'Produtos multifuncionais desenvolvidos para valorizar sua beleza única de forma descomplicada.'
          ? 'Uma seleção de maquiagens para valorizar sua beleza, do seu jeito.'
          : b.description,
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

    return rows
      .filter((testimonial) => !isDemonstrationTestimonial(testimonial))
      .map((t) => ({
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

export const getStoreSettings = cache(async (): Promise<SettingsView> => {
  try {
    const row = await readStoreSettings()
    if (!row) return FALLBACK_SETTINGS

    return {
      storeName: row.storeName,
      logo: FALLBACK_SETTINGS.logo,
      whatsapp: row.whatsapp,
      instagram: row.instagram,
      shortText: row.shortText,
      contactMessage: row.contactMessage,
      benefits: getReviewedBenefits(row.benefits),
      usefulLinks: row.usefulLinks,
    }
  } catch (error) {
    console.warn('Erro ao carregar configurações da loja do banco:', error)
    return FALLBACK_SETTINGS
  }
})
