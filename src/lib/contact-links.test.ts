import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getWhatsAppUrl } from './contact-links'

test('builds a WhatsApp link with international digits and an intact product message', () => {
  const message = 'Olá! Quero o Gloss & Blush, cor #2. Pode me ajudar?'
  const url = new URL(getWhatsAppUrl('+55 (11) 99999-9999', message)!)
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/5511999999999')
  assert.equal(url.searchParams.get('text'), message)
  assert.equal(url.hash, '')
})

test('omits unavailable WhatsApp contacts and optional messages', () => {
  assert.equal(getWhatsAppUrl(null), null)
  assert.equal(getWhatsAppUrl(''), null)
  assert.equal(getWhatsAppUrl('---'), null)
  assert.equal(getWhatsAppUrl('5511999999999'), 'https://wa.me/5511999999999')
})
