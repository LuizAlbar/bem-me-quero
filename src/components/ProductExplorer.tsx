'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import type { CategoryView, ProductView } from '@/lib/store-data'

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

  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get('categoria')
    if (selected && categories.some((item) => item.slug === selected)) {
      setCategory(selected)
    }
  }, [categories])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    const list = products.filter((product) => {
      const productCategory =
        typeof product.category === 'object' ? product.category?.slug : undefined
      return (
        (category === 'all' || productCategory === category) &&
        (availability === 'all' || product.availability === availability) &&
        (!normalized || product.name.toLocaleLowerCase('pt-BR').includes(normalized))
      )
    })
    return [...list].sort((a, b) => {
      if (sort === 'low') return (a.salePrice || a.price) - (b.salePrice || b.price)
      if (sort === 'high') return (b.salePrice || b.price) - (a.salePrice || a.price)
      if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR')
      return 0
    })
  }, [availability, category, products, query, sort])

  return (
    <div>
      <div className="flex flex-col gap-5 border-y border-[#e8e3df] py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-none flex min-w-0 gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`filter-chip ${category === 'all' ? 'filter-chip-active' : ''}`}
          >
            Todos
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.slug)}
              className={`filter-chip ${category === item.slug ? 'filter-chip-active' : ''}`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#e8e3df] bg-white px-3 lg:w-52">
            <span className="sr-only">Buscar produto</span>
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar produto"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            {query && (
              <button type="button" aria-label="Limpar busca" onClick={() => setQuery('')}>
                <X size={15} />
              </button>
            )}
          </label>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl border border-[#e8e3df] lg:hidden"
            aria-label="Abrir filtros e ordenação"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((current) => !current)}
          >
            <SlidersHorizontal size={17} />
          </button>
          <label
            className={`${filtersOpen ? 'flex' : 'hidden'} w-full items-center sm:w-auto lg:flex`}
          >
            <span className="sr-only">Filtrar por disponibilidade</span>
            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#e8e3df] bg-white px-3 text-sm outline-none focus:border-[#596a49]"
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
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#e8e3df] bg-white px-3 text-sm outline-none focus:border-[#596a49]"
            >
              <option value="recent">Mais recentes</option>
              <option value="low">Menor preço</option>
              <option value="high">Maior preço</option>
              <option value="name">Nome</option>
            </select>
          </label>
        </div>
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
          <p className="mx-auto mt-3 max-w-md text-sm text-[#77766f]">
            Tente limpar a busca ou escolher outra categoria.
          </p>
          <button
            type="button"
            className="button-secondary mt-6"
            onClick={() => {
              setCategory('all')
              setAvailability('all')
              setQuery('')
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}
