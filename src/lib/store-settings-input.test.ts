import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseStoreSocialSettings } from './store-settings-input'

test('normalizes contacts without changing the supplied phone digits', () => {
  assert.deepEqual(parseStoreSocialSettings('+55 (83) 9115-5229', '@bemequeromake'), {
    success: true,
    data: { whatsapp: '558391155229', instagram: 'https://www.instagram.com/bemequeromake/' },
  })
})

test('empty contacts disable social links', () => {
  assert.deepEqual(parseStoreSocialSettings('  ', ''), {
    success: true,
    data: { whatsapp: null, instagram: null },
  })
})

test('rejects malformed phones, non-text values and invalid Instagram URLs', () => {
  for (const phone of [
    'abc558391155229',
    '123',
    '0558391155229',
    '1234567890123456',
    new Blob(['phone']),
  ]) {
    assert.equal(parseStoreSocialSettings(phone, 'bemequeromake').success, false)
  }
  for (const instagram of [
    'javascript:alert(1)',
    'https://evil.test/bemequeromake',
    'https://instagram.com/p/post',
    new Blob(['profile']),
  ]) {
    assert.equal(parseStoreSocialSettings('558391155229', instagram).success, false)
  }
})
