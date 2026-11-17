import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  filterCatalog,
  getCategoryFromSearch,
  getProductPrice,
  normalizeSearch,
  getCatalogFiltersFromSearch,
  getCatalogSearch,
} from './catalog'
import type { ProductView } from './store-data'

const products: ProductView[] = [
  {
    id: '1',
    name: 'Máscara de Cílios',
    slug: 'mascara',
    description: '',
    price: 50,
    availability: 'low',
    category: { id: 'eyes', name: 'Olhos', slug: 'olhos' },
  },
  {
    id: '2',
    name: 'Gloss Rosa',
    slug: 'gloss',
    description: '',
    price: 40,
    salePrice: 25,
    availability: 'available',
    category: { id: 'lips', name: 'Lábios', slug: 'labios' },
  },
  {
    id: '3',
    name: 'Batom',
    slug: 'batom',
    description: '',
    price: 30,
    salePrice: 0,
    availability: 'unavailable',
    category: { id: 'lips', name: 'Lábios', slug: 'labios' },
  },
]

test('searches Portuguese product names with or without accents', () => {
  assert.equal(normalizeSearch('  MÁSCARA  '), 'mascara')
  assert.deepEqual(
    filterCatalog(products, { query: 'mascara de cilios' }).map((p) => p.id),
    ['1'],
  )
})
test('combines category, availability and query without changing the catalog', () => {
  assert.deepEqual(
    filterCatalog(products, { category: 'labios', availability: 'available', query: 'ROSA' }).map(
      (p) => p.id,
    ),
    ['2'],
  )
  assert.equal(products[0].id, '1')
  assert.equal(filterCatalog(products, { query: 'inexistente' }).length, 0)
})
test('sorts by the effective price, including a zero sale price', () => {
  assert.equal(getProductPrice(products[2]), 0)
  assert.deepEqual(
    filterCatalog(products, { sort: 'low' }).map((p) => p.id),
    ['3', '2', '1'],
  )
  assert.deepEqual(
    filterCatalog(products, { sort: 'high' }).map((p) => p.id),
    ['1', '2', '3'],
  )
})
test('only accepts published categories from a URL and resets missing ones', () => {
  const categories = [{ id: 'lips', name: 'Lábios', slug: 'labios' }]
  assert.equal(getCategoryFromSearch('?categoria=labios', categories), 'labios')
  assert.equal(getCategoryFromSearch('?categoria=unknown', categories), 'all')
  assert.equal(getCategoryFromSearch('', categories), 'all')
})

test('does not advertise an invalid or more expensive sale price', () => {
  for (const salePrice of [-1, 50, 70, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.equal(getProductPrice({ price: 50, salePrice }), 50)
  }
  assert.equal(getProductPrice({ price: 50, salePrice: 0 }), 0)
})

test('restores all filters from a shareable URL and preserves unrelated parameters', () => {
  const categories = [{ id: 'lips', name: 'Lábios', slug: 'labios' }]
  const filters = getCatalogFiltersFromSearch(
    '?categoria=labios&busca=gloss&ordem=low&disponibilidade=available',
    categories,
  )
  assert.deepEqual(filters, {
    category: 'labios',
    query: 'gloss',
    sort: 'low',
    availability: 'available',
  })
  const params = new URLSearchParams(getCatalogSearch(filters, '?utm_source=instagram'))
  assert.equal(params.get('utm_source'), 'instagram')
  assert.equal(params.get('busca'), 'gloss')
  assert.equal(
    getCatalogSearch({ category: 'all', query: '', sort: 'recent', availability: 'all' }),
    '',
  )
  assert.equal(
    getCatalogFiltersFromSearch('?ordem=invalid&disponibilidade=bad', categories).sort,
    'recent',
  )
})
