import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { categories, products } from '@/db/schema'
import { CategoriesManager } from './CategoriesManager'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const [allCategories, allProducts] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.order)),
    db.select({ categoryId: products.categoryId }).from(products),
  ])

  const productCounts: Record<string, number> = {}
  for (const p of allProducts) {
    if (p.categoryId) {
      productCounts[p.categoryId] = (productCounts[p.categoryId] || 0) + 1
    }
  }

  return <CategoriesManager categories={allCategories} productCounts={productCounts} />
}
