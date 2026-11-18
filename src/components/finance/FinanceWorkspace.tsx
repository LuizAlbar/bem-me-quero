import Link from 'next/link'
import { unstable_rethrow } from 'next/navigation'
import { AdminFeedback } from '@/components/AdminFeedback'
import { FinanceFilters } from '@/components/finance/FinanceFilters'
import { FinanceSummary } from '@/components/finance/FinanceSummary'
import { FinanceReport } from '@/components/finance/FinanceReport'
import { FinanceLedger } from '@/components/finance/FinanceLedger'
import { getFinanceData } from '@/lib/finance-data'
import { getBusinessDate, parseFinanceFilters, type FinanceSearchParams } from '@/lib/finance-input'

export async function FinanceWorkspace({
  params,
  mode,
}: {
  params: FinanceSearchParams
  mode: 'dashboard' | 'ledger'
}) {
  const action = mode === 'dashboard' ? '/admin' : '/admin/financeiro'
  const today = getBusinessDate()
  const parsed = parseFinanceFilters(params, today)
  if (!parsed.success)
    return (
      <div className="space-y-3">
        <AdminFeedback error={parsed.error} />
        <Link href={action} className="button-secondary">
          Redefinir filtros
        </Link>
      </div>
    )
  let data
  try {
    data = await getFinanceData(parsed.data)
  } catch (error) {
    unstable_rethrow(error)
    return (
      <div className="space-y-3">
        <AdminFeedback error="Não foi possível carregar o financeiro. Tente novamente." />
        <Link href={action} className="button-secondary">
          Tentar novamente
        </Link>
      </div>
    )
  }
  const controls = (
    <>
      <FinanceFilters
        key={JSON.stringify(parsed.data)}
        action={action}
        filters={parsed.data}
        categories={data.categories}
        products={data.products}
      />
      <FinanceSummary totals={data.summary} />
    </>
  )
  return mode === 'dashboard' ? (
    <div className="min-w-0 space-y-6">
      {controls}
      <FinanceReport monthly={data.monthly} byCategory={data.byCategory} />
    </div>
  ) : (
    <FinanceLedger
      records={data.records}
      categories={data.categories}
      products={data.products}
      filters={parsed.data}
      page={data.page}
      pageCount={data.pageCount}
      today={today}
    >
      {controls}
    </FinanceLedger>
  )
}
