import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isSafeImageSource, validateImageUpload, MAX_IMAGE_BYTES } from './image-upload'

test('accepts supported photos and reports empty, oversized or unsupported uploads', () => {
  assert.equal(validateImageUpload({ size: 2048, type: 'image/png' }), null)
  assert.ok(validateImageUpload({ size: MAX_IMAGE_BYTES + 1, type: 'image/jpeg' }))
  assert.ok(validateImageUpload({ size: 0, type: 'image/png' }))
  assert.ok(validateImageUpload({ size: 20, type: 'image/svg+xml' }))
})

test('permits local assets and HTTPS photos without executable or malformed sources', () => {
  for (const value of ['/assets/categories/lips.png', 'https://store.test/photo.webp'])
    assert.equal(isSafeImageSource(value), true)
  for (const value of [
    'javascript:alert(1)',
    '//evil.test/x',
    'https://user:pass@evil.test/x',
    '/\\evil.test/x',
    'data:image/svg+xml,x',
    'invalid',
  ])
    assert.equal(isSafeImageSource(value), false)
})
