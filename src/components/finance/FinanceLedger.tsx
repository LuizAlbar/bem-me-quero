'use client'

import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { AdminDialog } from '@/components/AdminDialog'
import { AdminFeedback } from '@/components/AdminFeedback'
import { FinanceEntryForm } from '@/components/finance/FinanceEntryForm'
import { useAdminFeedback } from '@/lib/use-admin-feedback'
import {
  financeQuery,
  formatCents,
  formatCivilDate,
  type FinanceFilters,
  type FinanceOption,
  type FinanceProductOption,
} from '@/lib/finance-input'
import type { FinanceRecord } from '@/lib/finance-data'
import { deleteFinanceEntryAction } from '@/app/admin/(panel)/financeiro/actions'

export function FinanceLedger({
  records,
  categories,
  products,
  filters,
  page,
  pageCount,
  today,
  children,
}: {
  records: FinanceRecord[]
  categories: FinanceOption[]
  products: FinanceProductOption[]
  filters: FinanceFilters
  page: number
  pageCount: number
  today: string
  children: ReactNode
}) {
  const [editing, setEditing] = useState<FinanceRecord | 'new' | null>(null)
  const [deleting, setDeleting] = useState<FinanceRecord | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const { pending, error, run, reset } = useAdminFeedback()

  async function remove() {
    if (!deleting || pending) return
    const data = new FormData()
    data.set('id', deleting.id)
    data.set('version', deleting.version)
    const result = await run(() => deleteFinanceEntryAction(data))
    if (result?.success) {
      setDeleting(null)
      setNotice('Lançamento excluído.')
    }
  }

  return (
    <section aria-labelledby="ledger-title" className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          className="button-primary gap-2"
          onClick={() => {
            setNotice(null)
            setEditing('new')
          }}
        >
          <Plus size={17} aria-hidden="true" />
          Novo lançamento
        </button>
      </div>
      <AdminFeedback error={null} message={notice} />
      {children}
      <h2 id="ledger-title" className="font-editorial text-2xl text-ink">
        Lançamentos
      </h2>
      {records.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-6 text-sm text-muted">
          Nenhum lançamento encontrado. Cadastre uma entrada ou saída, ou ajuste os filtros.
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-white">
          {records.map((entry) => (
            <li
              key={entry.id}
              className="flex min-w-0 flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span
                    className={`font-semibold ${entry.kind === 'income' ? 'text-brand' : 'text-danger'}`}
                  >
                    {entry.kind === 'income' ? 'Entrada' : 'Saída'}
                  </span>
                  <time dateTime={entry.occurredOn} className="text-muted">
                    {formatCivilDate(entry.occurredOn)}
                  </time>
                </div>
                <h3 className="mt-1 break-words text-sm font-semibold text-ink">{entry.title}</h3>
                <p className="mt-1 break-words text-xs leading-5 text-muted">
                  {entry.categoryName || 'Sem categoria'}
                  {entry.productName ? ` · ${entry.productName}` : ''}
                </p>
              </div>
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-5 gap-y-2 lg:justify-end">
                <p className="break-words text-base font-semibold tabular-nums text-ink">
                  {entry.kind === 'expense' ? '− ' : '+ '}
                  {formatCents(entry.amountCents)}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="min-h-11 px-2 text-xs font-semibold text-brand underline underline-offset-4"
                    aria-label={`Editar ${entry.title}`}
                    onClick={() => {
                      setNotice(null)
                      setEditing(entry)
                    }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="min-h-11 px-2 text-xs font-semibold text-danger underline underline-offset-4"
                    aria-label={`Excluir ${entry.title}`}
                    onClick={() => {
                      reset()
                      setNotice(null)
                      setDeleting(entry)
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {pageCount > 1 && (
        <nav
          aria-label="Páginas de lançamentos"
          className="flex flex-wrap items-center justify-between gap-3 text-xs"
        >
          <span className="text-muted">
            Página {page} de {pageCount}
          </span>
          <div className="flex flex-wrap gap-3">
            {page > 1 && (
              <Link
                className="button-secondary"
                href={`/admin/financeiro?${financeQuery(filters, page - 1)}`}
              >
                Anterior
              </Link>
            )}
            {page < pageCount && (
              <Link
                className="button-secondary"
                href={`/admin/financeiro?${financeQuery(filters, page + 1)}`}
              >
                Próxima
              </Link>
            )}
          </div>
        </nav>
      )}
      {editing && (
        <FinanceEntryForm
          entry={editing === 'new' ? null : editing}
          categories={categories}
          products={products}
          today={today}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            setNotice('Lançamento salvo. Os indicadores seguem os filtros selecionados.')
          }}
        />
      )}
      {deleting && (
        <AdminDialog title="Excluir lançamento?" onClose={() => setDeleting(null)} busy={pending}>
          <p className="mt-5 break-words text-sm leading-6 text-muted">
            “{deleting.title}”, de {formatCents(deleting.amountCents)}, será removido dos
            indicadores.
          </p>
          <div className="mt-4">
            <AdminFeedback error={error} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={pending} className="button-primary" onClick={remove}>
              {pending ? 'Excluindo...' : 'Excluir lançamento'}
            </button>
            <button
              type="button"
              disabled={pending}
              className="button-secondary"
              onClick={() => setDeleting(null)}
            >
              Cancelar
            </button>
          </div>
        </AdminDialog>
      )}
    </section>
  )
}
