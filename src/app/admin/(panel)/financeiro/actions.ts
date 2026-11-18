'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { categories, financialEntries, products } from '@/db/schema'
import { verifySession } from '@/lib/auth'
import { isUuid, parseFinanceEntry } from '@/lib/finance-input'

function refreshFinance() {
  revalidatePath('/admin')
  revalidatePath('/admin/financeiro')
}

function parseVersion(value: FormDataEntryValue | null) {
  return typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
    !Number.isNaN(Date.parse(value))
    ? new Date(value)
    : null
}

export async function saveFinanceEntryAction(form: FormData) {
  if (!(await verifySession())) redirect('/admin/login')
  const parsed = parseFinanceEntry(form)
  if (!parsed.success) return { success: false, error: parsed.error }
  const id = form.get('id')
  if (typeof id !== 'string' || (id && !isUuid(id)))
    return { success: false, error: 'Lançamento inválido.' }
  const version = id ? parseVersion(form.get('version')) : null
  if (id && !version)
    return { success: false, error: 'Atualize a página antes de editar este lançamento.' }
  try {
    const result = await db.transaction(async (tx) => {
      const { productId, categoryId } = parsed.data
      const product = productId
        ? (
            await tx
              .select({ name: products.name })
              .from(products)
              .where(eq(products.id, productId))
              .limit(1)
          )[0]
        : null
      if (productId && !product)
        return {
          success: false,
          error: 'Este produto foi removido. Selecione outro ou informe um título.',
        }
      if (
        categoryId &&
        !(
          await tx
            .select({ id: categories.id })
            .from(categories)
            .where(eq(categories.id, categoryId))
            .limit(1)
        ).length
      )
        return { success: false, error: 'Esta categoria foi removida. Selecione outra.' }
      const values = {
        ...parsed.data,
        title: parsed.data.title || product?.name.slice(0, 200) || '',
        updatedAt: new Date(),
      }
      const rows =
        id && version
          ? await tx
              .update(financialEntries)
              .set(values)
              .where(and(eq(financialEntries.id, id), eq(financialEntries.updatedAt, version)))
              .returning({ id: financialEntries.id })
          : await tx.insert(financialEntries).values(values).returning({ id: financialEntries.id })
      if (!rows.length)
        return {
          success: false,
          error: 'Este lançamento foi alterado ou removido. Atualize a página e tente novamente.',
        }
      return { success: true }
    })
    if (result.success) refreshFinance()
    return result
  } catch {
    return { success: false, error: 'Não foi possível salvar o lançamento. Tente novamente.' }
  }
}

export async function deleteFinanceEntryAction(form: FormData) {
  if (!(await verifySession())) redirect('/admin/login')
  const id = form.get('id')
  const version = parseVersion(form.get('version'))
  if (typeof id !== 'string' || !isUuid(id) || !version)
    return { success: false, error: 'Lançamento inválido. Atualize a página.' }
  try {
    const rows = await db
      .delete(financialEntries)
      .where(and(eq(financialEntries.id, id), eq(financialEntries.updatedAt, version)))
      .returning({ id: financialEntries.id })
    if (!rows.length)
      return {
        success: false,
        error: 'Este lançamento foi alterado ou removido. Atualize a página e tente novamente.',
      }
    refreshFinance()
    return { success: true }
  } catch {
    return { success: false, error: 'Não foi possível excluir o lançamento. Tente novamente.' }
  }
}
