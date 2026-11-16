import assert from 'node:assert/strict'
import { test } from 'node:test'
import { filterCatalog, getCategoryFromSearch, getProductPrice, normalizeSearch } from './catalog'
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
