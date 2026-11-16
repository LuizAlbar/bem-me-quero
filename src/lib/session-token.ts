import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE_NAME = 'bmq_admin_session'
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60

export type SessionPayload = {
  userId: string
  email: string
  name: string
  role: string
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret || new TextEncoder().encode(secret).length < 32) {
    throw new Error('Configure SESSION_SECRET com pelo menos 32 bytes aleatórios.')
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(user: SessionPayload): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getJwtSecret())
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ['HS256'],
      requiredClaims: ['exp', 'iat'],
      maxTokenAge: SESSION_MAX_AGE,
    })
    const { userId, email, name, role } = payload
    if (
      typeof userId !== 'string' ||
      !userId ||
      typeof email !== 'string' ||
      !email ||
      typeof name !== 'string' ||
      !name ||
      role !== 'admin'
    )
      return null

    return { userId, email, name, role }
  } catch {
    return null
  }
}
