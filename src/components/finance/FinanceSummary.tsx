import { formatCents } from '@/lib/finance-input'
import type { FinanceTotals } from '@/lib/finance-data'

export function FinanceSummary({ totals }: { totals: FinanceTotals }) {
  const net = BigInt(totals.income) - BigInt(totals.expense)
  return (
    <section
      aria-label="Resumo financeiro do período"
      className="rounded-2xl border border-border bg-white"
    >
      <dl className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[
          { label: 'Entradas', value: formatCents(totals.income), color: 'text-brand' },
          { label: 'Saídas', value: formatCents(totals.expense), color: 'text-danger' },
          {
            label: 'Resultado do período',
            value: formatCents(net),
            color: net < 0n ? 'text-danger' : 'text-ink',
          },
        ].map((item) => (
          <div key={item.label} className="min-w-0 p-5">
            <dt className="text-xs font-medium text-muted">{item.label}</dt>
            <dd
              className={`mt-2 break-words text-xl font-semibold tabular-nums lg:text-2xl ${item.color}`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-border px-5 py-3 text-xs leading-5 text-muted">
        {totals.count} {totals.count === 1 ? 'lançamento' : 'lançamentos'} no período. Resultado =
        entradas recebidas − saídas pagas.
      </p>
    </section>
  )
}
