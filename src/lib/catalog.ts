import type { CategoryView, ProductView } from './store-data'

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR')
}

export function getProductPrice(product: Pick<ProductView, 'price' | 'salePrice'>): number {
  return product.salePrice ?? product.price
}

export function getCategoryFromSearch(search: string, categories: CategoryView[]): string {
  const selected = new URLSearchParams(search).get('categoria')
  return selected && categories.some((category) => category.slug === selected) ? selected : 'all'
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
