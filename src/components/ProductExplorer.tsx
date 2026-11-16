'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import type { CategoryView, ProductView } from '@/lib/store-data'
import { filterCatalog, getCategoryFromSearch } from '@/lib/catalog'

export function ProductExplorer({
  products,
  categories,
  compact = false,
}: {
  products: ProductView[]
  categories: CategoryView[]
  compact?: boolean
}) {
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('recent')
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [visible, setVisible] = useState(compact ? 8 : 12)
  const [availability, setAvailability] = useState('all')
  const id = useId()
  const initialVisible = compact ? 8 : 12

  useEffect(() => {
    if (compact) return
    const syncCategory = () => {
      setCategory(getCategoryFromSearch(window.location.search, categories))
      setVisible(initialVisible)
    }
    syncCategory()
    window.addEventListener('popstate', syncCategory)
    return () => window.removeEventListener('popstate', syncCategory)
  }, [categories, compact, initialVisible])

  const filtered = useMemo(
    () => filterCatalog(products, { category, availability, query, sort }),
    [availability, category, products, query, sort],
  )
  const hasFilters =
    category !== 'all' || availability !== 'all' || Boolean(query.trim()) || sort !== 'recent'

  function selectCategory(value: string) {
    setCategory(value)
    setVisible(initialVisible)
    if (!compact) {
      const url = new URL(window.location.href)
      if (value === 'all') url.searchParams.delete('categoria')
      else url.searchParams.set('categoria', value)
      // Native history integrates with Next's router without refetching the catalog.
      // https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api
      if (url.href !== window.location.href) window.history.pushState(null, '', url)
    }
  }

  function resetFilters() {
    selectCategory('all')
    setAvailability('all')
    setSort('recent')
    setQuery('')
  }

  return (
    <div>
      <div className="flex flex-col gap-5 border-y border-[#e8e3df] py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-none flex min-w-0 gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => selectCategory('all')}
            aria-pressed={category === 'all'}
            className={`filter-chip ${category === 'all' ? 'filter-chip-active' : ''}`}
          >
            Todos
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectCategory(item.slug)}
              aria-pressed={category === item.slug}
              className={`filter-chip ${category === item.slug ? 'filter-chip-active' : ''}`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-white pl-3 lg:w-52 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
            <span className="sr-only">Buscar produto</span>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setVisible(initialVisible)
              }}
              placeholder="Buscar produto"
              className="h-full min-w-0 flex-1 bg-transparent pr-3 text-base outline-none placeholder:text-muted"
            />
            {query && (
              <button
                type="button"
                className="grid size-11 shrink-0 place-items-center"
                aria-label="Limpar busca"
                onClick={() => setQuery('')}
              >
                <X size={15} />
              </button>
            )}
          </label>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl border border-[#e8e3df] lg:hidden"
            aria-label="Abrir filtros e ordenação"
            aria-expanded={filtersOpen}
            aria-controls={`${id}-availability ${id}-sort`}
            onClick={() => setFiltersOpen((current) => !current)}
          >
            <SlidersHorizontal size={17} />
          </button>
          <label
            className={`${filtersOpen ? 'flex' : 'hidden'} w-full items-center sm:w-auto lg:flex`}
          >
            <span className="sr-only">Filtrar por disponibilidade</span>
            <select
              id={`${id}-availability`}
              value={availability}
              onChange={(event) => {
                setAvailability(event.target.value)
                setVisible(initialVisible)
              }}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-base"
            >
              <option value="all">Disponibilidade</option>
              <option value="available">Disponíveis</option>
              <option value="low">Estoque baixo</option>
              <option value="unavailable">Indisponíveis</option>
            </select>
          </label>
          <label
            className={`${filtersOpen ? 'flex' : 'hidden'} w-full items-center sm:w-auto lg:flex`}
          >
            <span className="sr-only">Ordenar produtos</span>
            <select
              id={`${id}-sort`}
              value={sort}
              onChange={(event) => {
                setSort(event.target.value)
                setVisible(initialVisible)
              }}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-base"
            >
              <option value="recent">Mais recentes</option>
              <option value="low">Menor preço</option>
              <option value="high">Maior preço</option>
              <option value="name">Nome</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 flex min-h-11 items-center justify-between gap-4 text-sm text-muted">
        <p role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'}
        </p>
        {hasFilters && (
          <button
            type="button"
            className="min-h-11 font-semibold text-brand underline underline-offset-4"
            onClick={resetFilters}
          >
            Limpar filtros
          </button>
        )}
      </div>

      {filtered.length ? (
        <>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
            {filtered.slice(0, visible).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {visible < filtered.length && (
            <div className="mt-14 text-center">
              <button
                type="button"
                className="button-secondary"
                onClick={() => setVisible((current) => current + 8)}
              >
                Carregar mais
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-2xl bg-[#f8e1dd]/45 px-5 py-16 text-center">
          <h3 className="font-editorial text-3xl">Nenhum produto por aqui</h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            {hasFilters
              ? 'Tente limpar a busca ou escolher outra categoria.'
              : 'Nenhum produto disponível no momento.'}
          </p>
        </div>
      )}
    </div>
  )
}
