import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ExternalLink,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Wallet,
} from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import { verifySession } from '@/lib/auth'
import { logoutAction } from '@/app/admin/actions'

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  return (
    <div className="flex min-h-svh flex-col bg-[#fbf8f5] md:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full shrink-0 flex-col justify-between gap-5 border-b border-[#e8e3df] bg-white p-4 md:sticky md:top-0 md:h-svh md:w-60 md:border-r md:border-b-0 md:p-5">
        <div>
          <div className="flex items-center justify-between border-b border-[#f0ece8] pb-5">
            <Link href="/admin" className="flex flex-col gap-1">
              <BrandMark className="h-9 w-28" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#596a49]">
                Admin
              </span>
            </Link>
          </div>

          <nav
            aria-label="Navegação administrativa"
            className="mt-4 flex flex-wrap gap-1 md:mt-6 md:flex-col md:gap-1.5"
          >
            <NavLink href="/admin" icon={<LayoutDashboard size={18} />} label="Visão Geral" />
            <NavLink href="/admin/financeiro" icon={<Wallet size={18} />} label="Financeiro" />
            <NavLink href="/admin/produtos" icon={<Package size={18} />} label="Produtos" />
            <NavLink href="/admin/categorias" icon={<Layers size={18} />} label="Categorias" />
            <NavLink
              href="/admin/configuracoes"
              icon={<Settings size={18} />}
              label="Configurações"
            />
          </nav>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#f0ece8] pt-3 md:block md:pt-5">
          <Link
            href="/"
            target="_blank"
            className="flex min-h-11 items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-[#596a49] hover:bg-[#fffaf7]"
          >
            <span>Ver Loja</span>
            <ExternalLink size={14} />
          </Link>

          <div className="flex min-w-0 items-center justify-between gap-2 rounded-xl bg-[#fffaf7] p-3 md:mt-3">
            <div className="min-w-0 pr-2">
              <p className="truncate text-xs font-semibold text-[#22251f]">{session.name}</p>
              <p className="truncate text-[11px] text-muted">{session.email}</p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Sair"
                className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-[#596a49] hover:bg-[#f8e1dd] hover:text-[#8a3341]"
              >
                <LogOut size={16} />
                Sair
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#4e504a] transition-colors hover:bg-[#fffaf7] hover:text-[#596a49]"
    >
      <span className="text-muted">{icon}</span>
      {label}
    </Link>
  )
}
