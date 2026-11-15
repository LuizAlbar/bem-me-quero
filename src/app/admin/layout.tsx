import React from 'react'
import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ExternalLink, Layers, LayoutDashboard, LogOut, Package } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import { verifySession } from '@/lib/auth'
import { logoutAction } from '@/app/admin/actions'

export const metadata = {
  title: 'Painel Admin | Bem Me Quero',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-invoke-path') || ''

  // Se estiver na rota de login, não aplica sidebar nem barreira
  const session = await verifySession()

  // Se não autenticado e não for login, checa no servidor
  // (Nota: em Server Component, se for /admin/login podemos checar a url ou tratar no client/layout)
  // Vamos verificar: se não houver sessão:
  if (!session) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-[#fbf8f5]">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between border-r border-[#e8e3df] bg-white p-5">
        <div>
          <div className="flex items-center justify-between border-b border-[#f0ece8] pb-5">
            <Link href="/admin" className="flex flex-col gap-1">
              <BrandMark className="h-9 w-28" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#596a49]">
                Admin
              </span>
            </Link>
          </div>

          <nav className="mt-6 flex flex-col gap-1.5">
            <NavLink href="/admin" icon={<LayoutDashboard size={18} />} label="Visão Geral" />
            <NavLink href="/admin/produtos" icon={<Package size={18} />} label="Produtos" />
            <NavLink href="/admin/categorias" icon={<Layers size={18} />} label="Categorias" />
          </nav>
        </div>

        <div className="border-t border-[#f0ece8] pt-5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-[#596a49] hover:bg-[#fffaf7]"
          >
            <span>Ver Loja</span>
            <ExternalLink size={14} />
          </Link>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#fffaf7] p-3">
            <div className="min-w-0 pr-2">
              <p className="truncate text-xs font-semibold text-[#22251f]">{session.name}</p>
              <p className="truncate text-[11px] text-[#77766f]">{session.email}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Sair"
                className="grid size-8 place-items-center rounded-lg text-[#77766f] hover:bg-[#f8e1dd] hover:text-[#8a3341]"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#4e504a] transition-colors hover:bg-[#fffaf7] hover:text-[#596a49]"
    >
      <span className="text-[#77766f]">{icon}</span>
      {label}
    </Link>
  )
}
