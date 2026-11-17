import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  getInstagramHandle,
  getInstagramUrl,
  getWhatsAppUrl,
  resolveStoreLink,
} from './contact-links'

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

test('normalizes Instagram profiles and rejects unsafe or non-profile destinations', () => {
  for (const value of [
    'bemequeromake',
    '@bemequeromake',
    'https://www.instagram.com/bemequeromake/',
  ]) {
    assert.equal(getInstagramUrl(value), 'https://www.instagram.com/bemequeromake/')
    assert.equal(getInstagramHandle(value), 'bemequeromake')
  }
  for (const value of [
    null,
    '',
    'javascript:alert(1)',
    'https://instagram.com.evil.test/shop',
    'https://instagram.com/p/123',
    'https://user@instagram.com/shop',
    'bad handle',
  ]) {
    assert.equal(getInstagramUrl(value), null)
  }
})

test('resolves legacy store contact links from settings, retaining WhatsApp messages', () => {
  const settings = { whatsapp: '558391155229', instagram: 'bemequeromake' }
  assert.equal(
    resolveStoreLink('https://wa.me/5511999999999?text=Ol%C3%A1%20%26%20oi', settings),
    'https://wa.me/558391155229?text=Ol%C3%A1%20%26%20oi',
  )
  assert.equal(
    resolveStoreLink('https://api.whatsapp.com/send?phone=5511999999999', settings),
    'https://wa.me/558391155229',
  )
  assert.equal(
    resolveStoreLink('https://instagram.com/oldprofile', settings),
    'https://www.instagram.com/bemequeromake/',
  )
  assert.equal(resolveStoreLink('/produtos?categoria=pele', settings), '/produtos?categoria=pele')
  assert.equal(resolveStoreLink('https://example.com', settings), 'https://example.com')
  assert.equal(resolveStoreLink('https://wa.me/5511999999999', {}), null)
  assert.equal(resolveStoreLink('https://instagram.com/oldprofile', {}), null)
})
