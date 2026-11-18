import assert from 'node:assert/strict'
import { eq, sql } from 'drizzle-orm'
import { db } from '../src/db'
import { categories, financialEntries, products } from '../src/db/schema'

// Integration checks use only newly created rows and always roll back.
class RollbackSuccess extends Error {}
try {
  await db.transaction(async (tx) => {
    const [category] = await tx
      .insert(categories)
      .values({ name: 'QA financeiro — rollback', slug: `qa-finance-${crypto.randomUUID()}` })
      .returning()
    const [product] = await tx
      .insert(products)
      .values({
        name: 'QA financeiro — rollback',
        slug: `qa-finance-${crypto.randomUUID()}`,
        description: 'Temporary transactional fixture',
        price: '1.00',
        categoryId: category.id,
      })
      .returning()
    const [income] = await tx
      .insert(financialEntries)
      .values({
        title: 'QA financeiro — rollback',
        kind: 'income',
        amountCents: 29,
        occurredOn: '2026-11-17',
        productId: product.id,
        categoryId: category.id,
      })
      .returning()
    await tx.insert(financialEntries).values({
      title: 'QA financeiro — rollback',
      kind: 'expense',
      amountCents: 10,
      occurredOn: '2026-11-17',
      categoryId: category.id,
    })
    const totals = await tx.execute(
      sql`select sum(case when kind = 'income' then amount_cents else -amount_cents end)::text as net from financial_entries where category_id = ${category.id}`,
    )
    assert.equal(totals[0].net, '19')
    await tx.delete(products).where(eq(products.id, product.id))
    await tx.delete(categories).where(eq(categories.id, category.id))
    const [preserved] = await tx
      .select()
      .from(financialEntries)
      .where(eq(financialEntries.id, income.id))
    assert.equal(preserved.productId, null)
    assert.equal(preserved.categoryId, null)
    assert.equal(preserved.amountCents, 29)
    assert.equal(preserved.title, income.title)
    // Savepoints let each rejected constraint be checked without aborting this transaction.
    for (const changes of [
      { amountCents: 0 },
      { amountCents: -1 },
      { amountCents: 1000000000 },
      { title: '' },
    ]) {
      await assert.rejects(
        tx.transaction((savepoint) =>
          savepoint.insert(financialEntries).values({
            title: 'QA financeiro — rollback',
            kind: 'income',
            amountCents: 1,
            occurredOn: '2026-11-17',
            ...changes,
          }),
        ),
      )
    }
    const protection = await tx.execute(
      sql`select relrowsecurity as rls, has_table_privilege('anon', 'public.financial_entries', 'SELECT') as anon_read, has_table_privilege('authenticated', 'public.financial_entries', 'SELECT') as user_read from pg_class where oid = 'public.financial_entries'::regclass`,
    )
    assert.equal(protection[0].rls, true)
    assert.equal(protection[0].anon_read, false)
    assert.equal(protection[0].user_read, false)
    throw new RollbackSuccess()
  })
} catch (error) {
  if (!(error instanceof RollbackSuccess)) throw error
  console.log(
    'Financeiro: cálculos exatos, constraints, preservação de histórico e proteção pública conferidos; fixtures revertidas.',
  )
} finally {
  await globalThis.__dbClient?.end()
}
