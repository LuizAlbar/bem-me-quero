import { FinanceWorkspace } from '@/components/finance/FinanceWorkspace'
import type { FinanceSearchParams } from '@/lib/finance-input'

export const dynamic = 'force-dynamic'

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<FinanceSearchParams>
}) {
  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="font-editorial text-3xl text-ink sm:text-4xl">Financeiro</h1>
        <p className="mt-1 text-sm text-muted">Entradas e gastos da loja.</p>
      </div>
      <FinanceWorkspace params={await searchParams} mode="ledger" />
    </div>
  )
}
