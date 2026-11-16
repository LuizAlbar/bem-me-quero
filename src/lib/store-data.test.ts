import assert from 'node:assert/strict'
import { afterEach, mock, test } from 'node:test'
import { db } from '../db'
import { FALLBACK_SETTINGS, getProducts } from './store-data'

afterEach(() => mock.restoreAll())

test('an empty catalog never publishes demonstration products or prices', async () => {
  mock.method(db.query.products, 'findMany', async () => [])
  assert.deepEqual(await getProducts(), [])
})

test('a failed catalog request does not replace real products with fabricated ones', async () => {
  mock.method(db.query.products, 'findMany', async () => {
    throw new Error('unavailable')
  })
  mock.method(console, 'warn', () => {})
  assert.deepEqual(await getProducts(), [])
})

test('unconfigured settings never promise shipping, payment terms or a fake contact', () => {
  assert.equal(FALLBACK_SETTINGS.benefits, undefined)
  assert.equal(FALLBACK_SETTINGS.whatsapp, undefined)
})
