import { asc, desc } from 'drizzle-orm'
import { db } from '@/db'
import { categories, products } from '@/db/schema'
import { ProductsManager } from './ProductsManager'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const [allProducts, allCategories] = await Promise.all([
    db.query.products.findMany({
      with: { category: true },
      orderBy: [desc(products.createdAt)],
    }),
    db.select().from(categories).orderBy(asc(categories.order)),
  ])

  return <ProductsManager products={allProducts} categories={allCategories} />
}
