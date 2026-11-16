import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { after, before, test } from 'node:test'
import { decodeJwt, SignJWT } from 'jose'
import { createSessionToken, SESSION_MAX_AGE, verifySessionToken } from './session-token'

const originalSecret = process.env.SESSION_SECRET
const secret = randomBytes(32).toString('hex')
const admin = { userId: 'admin-1', name: 'Equipe', email: 'admin@example.test', role: 'admin' }

before(() => {
  process.env.SESSION_SECRET = secret
})
after(() => {
  if (originalSecret === undefined) delete process.env.SESSION_SECRET
  else process.env.SESSION_SECRET = originalSecret
})

test('keeps an authenticated admin session for exactly seven days', async () => {
  const token = await createSessionToken(admin)
  const claims = decodeJwt(token)
  assert.equal(SESSION_MAX_AGE, 604800)
  assert.equal(claims.exp! - claims.iat!, 604800)
  assert.deepEqual(await verifySessionToken(token), admin)
})

test('rejects expired, forged, incomplete and non-admin sessions', async () => {
  const key = new TextEncoder().encode(secret)
  const sign = (claims: Record<string, unknown>, expiration: string) =>
    new SignJWT(claims)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiration)
      .sign(key)

  assert.equal(await verifySessionToken(await sign(admin, '-1s')), null)
  assert.equal(await verifySessionToken('invalid.token.signature'), null)
  assert.equal(await verifySessionToken(await sign({ role: 'admin' }, '7d')), null)
  assert.equal(await verifySessionToken(await sign({ ...admin, role: 'customer' }, '7d')), null)

  const forged = await new SignJWT(admin)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(randomBytes(32))
  assert.equal(await verifySessionToken(forged), null)

  const noExpiration = await new SignJWT(admin)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(key)
  assert.equal(await verifySessionToken(noExpiration), null)
})

test('refuses to create sessions without a strong environment secret', async () => {
  for (const value of ['', 'too-short']) {
    process.env.SESSION_SECRET = value
    await assert.rejects(createSessionToken(admin), /SESSION_SECRET/)
  }
  process.env.SESSION_SECRET = secret
})
