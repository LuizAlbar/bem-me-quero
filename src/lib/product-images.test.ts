import assert from 'node:assert/strict'
import { test } from 'node:test'
import { updatePrimaryImage } from './product-images'

test('editing the cover preserves secondary photos and stable image identities', () => {
  const images = [
    { id: 'cover', url: 'https://example.test/original.jpg', alt: 'Original' },
    { id: 'detail', url: 'https://example.test/detail.jpg', alt: 'Detalhe' },
  ]
  const updated = updatePrimaryImage(images, 'https://example.test/new.jpg', 'Gloss')
  assert.deepEqual(updated, [
    { id: 'cover', url: 'https://example.test/new.jpg', alt: 'Gloss' },
    images[1],
  ])
  assert.equal(images[0].url, 'https://example.test/original.jpg')
})

test('a missing cover field never erases the existing gallery', () => {
  const images = [{ id: 'cover', url: 'https://example.test/cover.jpg' }]
  assert.deepEqual(updatePrimaryImage(images, '', 'Gloss'), images)
  assert.equal(updatePrimaryImage([], 'https://example.test/new.jpg', 'Gloss').length, 1)
})
