import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE_NAME = 'bmq_admin_session'

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'bem-me-quero-super-secret-key-fallback-change-in-env'
  return new TextEncoder().encode(secret)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
    let isValid = false

    if (token) {
      try {
        await jwtVerify(token, getJwtSecret())
        isValid = true
      } catch {
        isValid = false
      }
    }

    // Se estiver em /admin/login e já for válido, redireciona para o painel
    if (pathname === '/admin/login') {
      if (isValid) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }

    // Se não estiver logado, redireciona para /admin/login
    if (!isValid) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
