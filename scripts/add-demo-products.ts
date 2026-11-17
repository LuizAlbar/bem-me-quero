import sharp from 'sharp'
import { db } from '../src/db'
import { categories, products } from '../src/db/schema'
import { eq } from 'drizzle-orm'

// Additive and safe to rerun: existing products are never changed or deleted.
// Public reference images: https://dummyjson.com/docs/products
const imageBase = 'https://cdn.dummyjson.com/product-images/'
const definitions = [
  {
    slug: 'demo-batom-vermelho',
    name: 'Batom vermelho',
    category: 'labios',
    price: '24.90',
    asset: 'beauty/red-lipstick',
    photos: 1,
    featured: true,
  },
  {
    slug: 'demo-mascara-lash-princess',
    name: 'Máscara de cílios Lash Princess',
    category: 'olhos',
    price: '39.90',
    asset: 'beauty/essence-mascara-lash-princess',
    photos: 1,
    featured: true,
  },
  {
    slug: 'demo-paleta-sombras-espelho',
    name: 'Paleta de sombras com espelho',
    category: 'olhos',
    price: '59.90',
    asset: 'beauty/eyeshadow-palette-with-mirror',
    photos: 1,
    featured: false,
  },
  {
    slug: 'demo-po-facial',
    name: 'Pó facial',
    category: 'pele',
    price: '29.90',
    asset: 'beauty/powder-canister',
    photos: 1,
    featured: true,
  },
  {
    slug: 'demo-sabonete-corporal-olay',
    name: 'Sabonete corporal Olay',
    category: 'skincare',
    price: '34.90',
    asset: 'skin-care/olay-ultra-moisture-shea-butter-body-wash',
    photos: 2,
    featured: false,
  },
  {
    slug: 'demo-hidratante-corporal-vaseline',
    name: 'Hidratante corporal Vaseline',
    category: 'skincare',
    price: '39.90',
    asset: 'skin-care/vaseline-men-body-and-face-lotion',
    photos: 2,
    featured: true,
  },
]

async function main() {
  const allCategories = await db.select().from(categories).where(eq(categories.visible, true))
  const categoryIds = new Map(allCategories.map((category) => [category.slug, category.id]))
  const entries = definitions.map((definition) => {
    const categoryId = categoryIds.get(definition.category)
    if (!categoryId) throw new Error(`Categoria não encontrada ou oculta: ${definition.category}`)
    return {
      name: `Demonstração · ${definition.name}`,
      slug: definition.slug,
      description: `${definition.name} em cadastro de demonstração. Imagem pública de referência e preço ilustrativo; este item não representa o estoque real da loja.`,
      price: definition.price,
      salePrice: null,
      categoryId,
      images: Array.from({ length: definition.photos }, (_, index) => ({
        id: `${definition.slug}-photo-${index + 1}`,
        url: `${imageBase}${definition.asset}/${index + 1}.webp`,
        alt: `${definition.name} — imagem de referência ${index + 1}`,
      })),
      availability: 'unavailable',
      featured: definition.featured,
      badge: 'none',
      variants: [],
      details:
        'Cadastro temporário para visualizar a vitrine. Confirme produtos, valores e disponibilidade reais com a loja antes de realizar um pedido.',
      usage: null,
    }
  })

  // Finish network validation before opening the database transaction.
  const urls = [...new Set(entries.flatMap((entry) => entry.images.map((image) => image.url)))]
  await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
        throw new Error(`Imagem pública indisponível: ${url}`)
      }
      const metadata = await sharp(Buffer.from(await response.arrayBuffer())).metadata()
      if (!metadata.width || !metadata.height || metadata.width < 400 || metadata.height < 400) {
        throw new Error(`Resolução insuficiente para a imagem: ${url}`)
      }
    }),
  )

  const inserted = await db.transaction((transaction) =>
    transaction
      .insert(products)
      .values(entries)
      .onConflictDoNothing({ target: products.slug })
      .returning({ id: products.id, name: products.name, slug: products.slug }),
  )

  console.log(
    JSON.stringify(
      {
        inserted: inserted.length,
        preservedExisting: entries.length - inserted.length,
        imagesChecked: urls.length,
        products: inserted,
      },
      null,
      2,
    ),
  )
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(
      error instanceof Error
        ? error.message
        : 'Não foi possível cadastrar os produtos demonstrativos.',
    )
    process.exit(1)
  })
