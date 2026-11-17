'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'
import type { CategoryView, ProductView } from '@/lib/store-data'
import {
  filterCatalog,
  getCatalogFiltersFromSearch,
  getCatalogSearch,
  type CatalogFilters,
} from '@/lib/catalog'

export function ProductExplorer({
  products,
  categories,
  compact = false,
  contactHref,
}: {
  products: ProductView[]
  categories: CategoryView[]
  compact?: boolean
  contactHref?: string | null
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
      const filters = getCatalogFiltersFromSearch(window.location.search, categories)
      setCategory(filters.category)
      setQuery(filters.query)
      setSort(filters.sort)
      setAvailability(filters.availability)
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
  const filterCount = [
    category !== 'all',
    availability !== 'all',
    Boolean(query.trim()),
    sort !== 'recent',
  ].filter(Boolean).length

  function updateUrl(next: Partial<CatalogFilters>, replace = false) {
    if (compact) return
    const url = new URL(window.location.href)
    url.search = getCatalogSearch({ category, availability, query, sort, ...next }, url.search)
    if (url.href !== window.location.href) {
      if (replace) window.history.replaceState(null, '', url)
      else window.history.pushState(null, '', url)
    }
  }

  function selectCategory(value: string) {
    setCategory(value)
    setVisible(initialVisible)
    updateUrl({ category: value })
  }

  function resetFilters() {
    setCategory('all')
    setVisible(initialVisible)
    setAvailability('all')
    setSort('recent')
    setQuery('')
    updateUrl({ category: 'all', availability: 'all', query: '', sort: 'recent' })
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
                updateUrl({ query: event.target.value }, true)
                setVisible(initialVisible)
              }}
              placeholder="Buscar produto"
              maxLength={200}
              className="h-full min-w-0 flex-1 bg-transparent pr-3 text-base outline-none placeholder:text-muted"
            />
            {query && (
              <button
                type="button"
                className="grid size-11 shrink-0 place-items-center"
                aria-label="Limpar busca"
                onClick={() => {
                  setQuery('')
                  updateUrl({ query: '' }, true)
                }}
              >
                <X size={15} />
              </button>
            )}
          </label>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl border border-[#e8e3df] lg:hidden"
            aria-label={`Abrir filtros e ordenação${filterCount ? `, ${filterCount} ativos` : ''}`}
            aria-expanded={filtersOpen}
            aria-controls={`${id}-availability ${id}-sort`}
            onClick={() => setFiltersOpen((current) => !current)}
          >
            <span className="relative">
              <SlidersHorizontal size={17} />
              {filterCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-3 -top-3 grid size-4 place-items-center rounded-full bg-brand text-[10px] text-white"
                >
                  {filterCount}
                </span>
              )}
            </span>
          </button>
          <label
            className={`filter-options ${filtersOpen ? 'flex' : 'hidden'} w-full items-center sm:w-auto lg:flex`}
          >
            <span className="sr-only">Filtrar por disponibilidade</span>
            <select
              id={`${id}-availability`}
              value={availability}
              onChange={(event) => {
                setAvailability(event.target.value)
                updateUrl({ availability: event.target.value })
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
            className={`filter-options ${filtersOpen ? 'flex' : 'hidden'} w-full items-center sm:w-auto lg:flex`}
          >
            <span className="sr-only">Ordenar produtos</span>
            <select
              id={`${id}-sort`}
              value={sort}
              onChange={(event) => {
                setSort(event.target.value)
                updateUrl({ sort: event.target.value })
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
          <h3 className="font-editorial text-3xl">
            {hasFilters ? 'Nenhum produto encontrado' : 'Catálogo em atualização'}
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            {hasFilters
              ? 'Tente limpar a busca ou escolher outra categoria.'
              : contactHref
                ? 'Consulte os produtos disponíveis pelo WhatsApp.'
                : 'Nenhum produto disponível no momento.'}
          </p>
          {!hasFilters && contactHref && (
            <Link
              href={contactHref}
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary mt-6"
            >
              Falar no WhatsApp
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
