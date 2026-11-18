import 'server-only'

import { and, asc, desc, eq, gte, isNull, lte, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { categories, financialEntries, products } from '@/db/schema'
import { verifySession } from '@/lib/auth'
import type { FinanceFilters } from '@/lib/finance-input'

export const FINANCE_PAGE_SIZE = 20
export type FinanceTotals = { income: string; expense: string; count: number }
export type FinanceGroup = FinanceTotals & { label: string }
export type FinanceRecord = {
  id: string
  kind: 'income' | 'expense'
  title: string
  amountCents: number
  occurredOn: string
  productId: string | null
  categoryId: string | null
  productName: string | null
  categoryName: string | null
  version: string
}

const totals = {
  income: sql<string>`coalesce(sum(case when ${financialEntries.kind} = 'income' then ${financialEntries.amountCents} else 0 end), 0)::text`,
  expense: sql<string>`coalesce(sum(case when ${financialEntries.kind} = 'expense' then ${financialEntries.amountCents} else 0 end), 0)::text`,
  count: sql<number>`count(*)::int`,
}

export async function getFinanceData(filters: FinanceFilters) {
  if (!(await verifySession())) redirect('/admin/login')
  const condition = and(
    filters.from ? gte(financialEntries.occurredOn, filters.from) : undefined,
    filters.to ? lte(financialEntries.occurredOn, filters.to) : undefined,
    filters.category === 'none'
      ? isNull(financialEntries.categoryId)
      : filters.category
        ? eq(financialEntries.categoryId, filters.category)
        : undefined,
    filters.product ? eq(financialEntries.productId, filters.product) : undefined,
    filters.kind ? eq(financialEntries.kind, filters.kind) : undefined,
  )
  const month = sql<string>`to_char(${financialEntries.occurredOn}, 'YYYY-MM')`
  const [summaryRows, monthlyRows, categoryRows, categoryOptions, productOptions] =
    await Promise.all([
      db.select(totals).from(financialEntries).where(condition),
      db
        .select({ label: month, ...totals })
        .from(financialEntries)
        .where(condition)
        .groupBy(month)
        .orderBy(desc(month))
        .limit(12),
      db
        .select({ label: sql<string>`coalesce(${categories.name}, 'Sem categoria')`, ...totals })
        .from(financialEntries)
        .leftJoin(categories, eq(financialEntries.categoryId, categories.id))
        .where(condition)
        .groupBy(financialEntries.categoryId, categories.name)
        .orderBy(asc(categories.name)),
      db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .orderBy(asc(categories.name)),
      db
        .select({ id: products.id, name: products.name, categoryId: products.categoryId })
        .from(products)
        .orderBy(asc(products.name)),
    ])
  const summary = summaryRows[0]
  const pageCount = Math.max(1, Math.ceil(summary.count / FINANCE_PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)
  const rows = await db
    .select({
      id: financialEntries.id,
      kind: financialEntries.kind,
      title: financialEntries.title,
      amountCents: financialEntries.amountCents,
      occurredOn: financialEntries.occurredOn,
      productId: financialEntries.productId,
      categoryId: financialEntries.categoryId,
      productName: products.name,
      categoryName: categories.name,
      updatedAt: financialEntries.updatedAt,
    })
    .from(financialEntries)
    .leftJoin(products, eq(financialEntries.productId, products.id))
    .leftJoin(categories, eq(financialEntries.categoryId, categories.id))
    .where(condition)
    .orderBy(
      desc(financialEntries.occurredOn),
      desc(financialEntries.createdAt),
      desc(financialEntries.id),
    )
    .limit(FINANCE_PAGE_SIZE)
    .offset((page - 1) * FINANCE_PAGE_SIZE)
  const records: FinanceRecord[] = rows.map(({ updatedAt, ...row }) => ({
    ...row,
    version: updatedAt.toISOString(),
  }))
  return {
    summary,
    monthly: monthlyRows.reverse(),
    byCategory: categoryRows,
    categories: categoryOptions,
    products: productOptions,
    records,
    page,
    pageCount,
  }
}
