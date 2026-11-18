import { formatCents } from '@/lib/finance-input'
import type { FinanceGroup } from '@/lib/finance-data'

export function FinanceReport({
  monthly,
  byCategory,
}: {
  monthly: FinanceGroup[]
  byCategory: FinanceGroup[]
}) {
  const max = monthly.reduce((largest, row) => {
    const value =
      BigInt(row.income) > BigInt(row.expense) ? BigInt(row.income) : BigInt(row.expense)
    return value > largest ? value : largest
  }, 1n)
  const width = (value: string) => Number((BigInt(value) * 10000n) / max) / 100
  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-2">
      <section className="min-w-0 rounded-2xl border border-border bg-white p-5">
        <h2 className="font-editorial text-2xl text-ink">Movimentação mensal</h2>
        <p className="mt-1 text-xs leading-5 text-muted">
          Até 12 meses com lançamentos no período selecionado.
        </p>
        {monthly.length === 0 ? (
          <p className="py-8 text-sm text-muted">Nenhuma movimentação neste período.</p>
        ) : (
          <ul className="mt-5 space-y-5">
            {monthly.map((row) => (
              <li key={row.label} className="space-y-2">
                <h3 className="text-xs font-semibold text-ink">
                  {row.label.slice(5)}/{row.label.slice(0, 4)}
                </h3>
                {(['income', 'expense'] as const).map((kind) => (
                  <div key={kind}>
                    <div className="flex flex-wrap justify-between gap-x-3 text-xs leading-5">
                      <span className="text-muted">
                        {kind === 'income' ? 'Entradas' : 'Saídas'}
                      </span>
                      <span className="break-words font-medium tabular-nums text-ink">
                        {formatCents(row[kind])}
                      </span>
                    </div>
                    <div aria-hidden="true" className="mt-1 h-2 rounded-full bg-surface">
                      <div
                        className={`h-2 rounded-full ${kind === 'income' ? 'bg-brand' : 'bg-danger'}`}
                        style={{ width: `${width(row[kind])}%` }}
                      />
                    </div>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="min-w-0 rounded-2xl border border-border bg-white p-5">
        <h2 className="font-editorial text-2xl text-ink">Resultado por categoria</h2>
        {byCategory.length === 0 ? (
          <p className="py-8 text-sm text-muted">Cadastre uma entrada ou saída para começar.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {byCategory.map((row, index) => (
              <li key={`${row.label}-${index}`} className="py-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="break-words text-sm font-semibold text-ink">{row.label}</h3>
                  <p className="break-words text-sm font-semibold tabular-nums text-ink">
                    {formatCents(BigInt(row.income) - BigInt(row.expense))}
                  </p>
                </div>
                <p className="mt-1 break-words text-xs leading-5 text-muted">
                  Entradas {formatCents(row.income)} · Saídas {formatCents(row.expense)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
