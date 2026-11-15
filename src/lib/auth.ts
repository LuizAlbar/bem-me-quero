import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'bmq_admin_session'
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 dias

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'bem-me-quero-super-secret-key-fallback-change-in-env'
  return new TextEncoder().encode(secret)
}

export type SessionPayload = {
  userId: string
  email: string
  name: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(user: {
  id: string
  email: string
  name: string
  role: string
}): Promise<string> {
  const secret = getJwtSecret()
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return token
}

export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret)
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
    }
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
