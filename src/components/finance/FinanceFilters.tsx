import Link from 'next/link'
import type { FinanceFilters as Filters, FinanceOption } from '@/lib/finance-input'

export function FinanceFilters({
  filters,
  categories,
  products,
  action,
}: {
  filters: Filters
  categories: FinanceOption[]
  products: FinanceOption[]
  action: '/admin' | '/admin/financeiro'
}) {
  return (
    <form
      action={action}
      method="get"
      className="grid min-w-0 grid-cols-1 gap-4 rounded-2xl border border-border bg-white p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3"
      aria-label="Filtrar lançamentos"
    >
      <label className="min-w-0 text-xs font-semibold text-ink">
        De
        <input type="date" name="from" defaultValue={filters.from} className="form-control mt-2" />
      </label>
      <label className="min-w-0 text-xs font-semibold text-ink">
        Até
        <input type="date" name="to" defaultValue={filters.to} className="form-control mt-2" />
      </label>
      <label className="min-w-0 text-xs font-semibold text-ink">
        Categoria
        <select name="category" defaultValue={filters.category} className="form-control mt-2">
          <option value="">Todas as categorias</option>
          <option value="none">Sem categoria</option>
          {filters.category &&
            filters.category !== 'none' &&
            !categories.some((item) => item.id === filters.category) && (
              <option value={filters.category}>Categoria removida</option>
            )}
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="min-w-0 text-xs font-semibold text-ink">
        Tipo
        <select name="kind" defaultValue={filters.kind} className="form-control mt-2">
          <option value="">Entradas e saídas</option>
          <option value="income">Entradas</option>
          <option value="expense">Saídas</option>
        </select>
      </label>
      <label className="min-w-0 text-xs font-semibold text-ink">
        Produto
        <select name="product" defaultValue={filters.product} className="form-control mt-2">
          <option value="">Todos os produtos</option>
          {filters.product && !products.some((item) => item.id === filters.product) && (
            <option value={filters.product}>Produto removido</option>
          )}
          {products.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap items-end gap-3">
        <button type="submit" className="button-primary">
          Aplicar filtros
        </button>
        <Link
          href={action}
          className="flex min-h-11 items-center text-xs font-semibold text-brand underline underline-offset-4"
        >
          Mês atual
        </Link>
        <Link
          href={`${action}?from=&to=`}
          className="flex min-h-11 items-center text-xs font-semibold text-brand underline underline-offset-4"
        >
          Todo o período
        </Link>
      </div>
    </form>
  )
}
