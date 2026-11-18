'use client'

import { useState, type FormEvent } from 'react'
import { AdminDialog } from '@/components/AdminDialog'
import { AdminFeedback } from '@/components/AdminFeedback'
import { useAdminFeedback } from '@/lib/use-admin-feedback'
import type { FinanceOption, FinanceProductOption } from '@/lib/finance-input'
import type { FinanceRecord } from '@/lib/finance-data'
import { saveFinanceEntryAction } from '@/app/admin/(panel)/financeiro/actions'

export function FinanceEntryForm({
  entry,
  categories,
  products,
  today,
  onSaved,
  onCancel,
}: {
  entry: FinanceRecord | null
  categories: FinanceOption[]
  products: FinanceProductOption[]
  today: string
  onSaved: () => void
  onCancel: () => void
}) {
  const { pending, error, run } = useAdminFeedback()
  const [productId, setProductId] = useState(entry?.productId || '')
  const [categoryId, setCategoryId] = useState(entry?.categoryId || '')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const data = new FormData(event.currentTarget)
    const result = await run(() => saveFinanceEntryAction(data))
    if (result?.success) onSaved()
  }

  return (
    <AdminDialog
      title={entry ? 'Editar lançamento' : 'Novo lançamento'}
      onClose={onCancel}
      busy={pending}
      wide
    >
      <form onSubmit={submit} className="mt-5 space-y-5" aria-busy={pending}>
        <input type="hidden" name="id" value={entry?.id || ''} />
        <input type="hidden" name="version" value={entry?.version || ''} />
        <fieldset disabled={pending} className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <legend className="sr-only">Dados do lançamento</legend>
          <label className="min-w-0 text-sm font-semibold">
            Tipo
            <select
              name="kind"
              className="form-control mt-2"
              defaultValue={entry?.kind || 'income'}
            >
              <option value="income">Entrada recebida</option>
              <option value="expense">Saída paga</option>
            </select>
          </label>
          <label className="min-w-0 text-sm font-semibold">
            Data
            <input
              name="occurredOn"
              type="date"
              required
              defaultValue={entry?.occurredOn || today}
              className="form-control mt-2"
            />
          </label>
          <label className="min-w-0 text-sm font-semibold sm:col-span-2">
            Produto <span className="font-normal text-muted">(opcional)</span>
            <select
              name="productId"
              value={productId}
              onChange={(event) => {
                const id = event.target.value
                setProductId(id)
                if (id)
                  setCategoryId(products.find((product) => product.id === id)?.categoryId || '')
              }}
              className="form-control form-select mt-2"
            >
              <option value="">Sem vínculo com produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <div className="min-w-0 sm:col-span-2">
            <label htmlFor="finance-entry-title" className="text-sm font-semibold">
              Título{' '}
              {productId && <span className="font-normal text-muted">(opcional com produto)</span>}
            </label>
            <input
              id="finance-entry-title"
              name="title"
              required={!productId}
              maxLength={200}
              defaultValue={entry?.title || ''}
              className="form-control mt-2"
              aria-describedby="finance-title-hint"
            />
            <p
              id="finance-title-hint"
              className="mt-1 block text-xs font-normal leading-5 text-muted"
            >
              Nome do gasto ou da entrada. Se vazio, será usado o nome do produto.
            </p>
          </div>
          <label className="min-w-0 text-sm font-semibold">
            Valor (R$)
            <input
              name="amount"
              type="text"
              inputMode="decimal"
              maxLength={16}
              required
              defaultValue={entry ? (entry.amountCents / 100).toFixed(2).replace('.', ',') : ''}
              placeholder="0,00"
              className="form-control mt-2"
            />
          </label>
          <label className="min-w-0 text-sm font-semibold">
            Categoria <span className="font-normal text-muted">(opcional)</span>
            <select
              name="categoryId"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="form-control mt-2"
            >
              <option value="">Sem categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
        <AdminFeedback error={error} />
        <div className="flex flex-wrap gap-3 border-t border-border pt-5">
          <button type="submit" disabled={pending} className="button-primary">
            {pending ? 'Salvando...' : 'Salvar lançamento'}
          </button>
          <button type="button" disabled={pending} onClick={onCancel} className="button-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </AdminDialog>
  )
}
