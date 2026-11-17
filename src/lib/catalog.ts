import type { CategoryView, ProductView } from './store-data'

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR')
}

export function hasSalePrice(
  product: Pick<ProductView, 'price' | 'salePrice'>,
): product is Pick<ProductView, 'price' | 'salePrice'> & { salePrice: number } {
  return (
    product.salePrice != null &&
    Number.isFinite(product.salePrice) &&
    product.salePrice >= 0 &&
    product.salePrice < product.price
  )
}

export function getProductPrice(product: Pick<ProductView, 'price' | 'salePrice'>): number {
  return hasSalePrice(product) ? product.salePrice : product.price
}

export function getCategoryFromSearch(search: string, categories: CategoryView[]): string {
  const selected = new URLSearchParams(search).get('categoria')
  return selected && categories.some((category) => category.slug === selected) ? selected : 'all'
}

export type CatalogFilters = { category: string; query: string; sort: string; availability: string }

export function getCatalogFiltersFromSearch(
  search: string,
  categories: CategoryView[],
): CatalogFilters {
  const params = new URLSearchParams(search)
  const sort = params.get('ordem') || 'recent'
  const availability = params.get('disponibilidade') || 'all'
  return {
    category: getCategoryFromSearch(search, categories),
    query: (params.get('busca') || '').slice(0, 200),
    sort: ['recent', 'low', 'high', 'name'].includes(sort) ? sort : 'recent',
    availability: ['all', 'available', 'low', 'unavailable'].includes(availability)
      ? availability
      : 'all',
  }
}

export function getCatalogSearch(filters: CatalogFilters, currentSearch = ''): string {
  const params = new URLSearchParams(currentSearch)
  for (const [key, value, fallback] of [
    ['categoria', filters.category, 'all'],
    ['busca', filters.query.trim(), ''],
    ['ordem', filters.sort, 'recent'],
    ['disponibilidade', filters.availability, 'all'],
  ]) {
    if (value === fallback) params.delete(key)
    else params.set(key, value)
  }
  return params.toString()
}

export function filterCatalog(
  products: ProductView[],
  filters: {
    query?: string
    category?: string
    availability?: string
    sort?: string
  },
): ProductView[] {
  const query = normalizeSearch(filters.query || '')
  return products
    .filter((product) => {
      const category = typeof product.category === 'object' ? product.category?.slug : undefined
      return (
        (!filters.category || filters.category === 'all' || category === filters.category) &&
        (!filters.availability ||
          filters.availability === 'all' ||
          product.availability === filters.availability) &&
        (!query || normalizeSearch(product.name).includes(query))
      )
    })
    .sort((a, b) => {
      if (filters.sort === 'low') return getProductPrice(a) - getProductPrice(b)
      if (filters.sort === 'high') return getProductPrice(b) - getProductPrice(a)
      if (filters.sort === 'name') return a.name.localeCompare(b.name, 'pt-BR')
      return 0
    })
}
