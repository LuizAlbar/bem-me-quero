import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'

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

export const getCategories = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'categories',
      overrideAccess: false,
      draft: false,
      depth: 1,
      limit: 20,
      sort: 'order',
      where: { visible: { equals: true } },
    })
    return result.docs as CategoryView[]
  },
  ['store-categories-v2'],
  { tags: ['categories', 'storefront'] },
)

export const getProducts = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      overrideAccess: false,
      draft: false,
      depth: 2,
      limit: 100,
      sort: '-createdAt',
    })
    return result.docs as ProductView[]
  },
  ['store-products-v2'],
  { tags: ['products', 'storefront'] },
)

export async function getProductBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'products',
        overrideAccess: false,
        draft: false,
        depth: 2,
        limit: 1,
        where: { slug: { equals: slug } },
      })
      return (result.docs[0] as ProductView | undefined) ?? null
    },
    ['store-product-v2', slug],
    { tags: ['products', `products:${slug}`] },
  )()
}

export const getBanners = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'banners',
      overrideAccess: false,
      draft: false,
      depth: 1,
      limit: 10,
    })
    return result.docs as BannerView[]
  },
  ['store-banners-v2'],
  { tags: ['banners', 'storefront'] },
)

export const getTestimonials = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'testimonials',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 12,
      sort: 'order',
    })
    return result.docs as TestimonialView[]
  },
  ['store-testimonials-v2'],
  { tags: ['testimonials', 'storefront'] },
)

export const getStoreSettings = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    return (await payload.findGlobal({
      slug: 'store-settings',
      overrideAccess: false,
      depth: 1,
    })) as SettingsView
  },
  ['store-settings-v2'],
  { tags: ['store-settings', 'storefront'] },
)
