'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Menu, MessageCircle, Search, X } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import type { ProductView, SettingsView } from '@/lib/store-data'

export function StoreHeader({
  products,
  settings,
}: {
  products: ProductView[]
  settings: SettingsView
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    if (!normalized) return []
    return products.filter((product) =>
      product.name.toLocaleLowerCase('pt-BR').includes(normalized),
    )
  }, [products, query])

  const links = [
    ['Início', '/'],
    ['Produtos', '/produtos'],
    ['Categorias', '/#categorias'],
    ['Mais vendidos', '/#mais-vendidos'],
    ['Contato', '/#contato'],
  ]

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e8e3df]/80 bg-[#fffaf7]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[78px] max-w-[1320px] items-center justify-between px-5 lg:px-10">
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-[#22251f] lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={21} strokeWidth={1.7} />
          </button>
          <Link href="/" aria-label="Bem Me Quero Maquiagens — Início">
            <BrandMark logo={settings.logo} />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
            {links.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="nav-link text-[13px] font-medium text-[#3f423b]"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full transition-colors hover:bg-[#f8e1dd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#596a49]"
              aria-label="Buscar produtos"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} strokeWidth={1.7} />
            </button>
            <a
              className="hidden size-11 place-items-center rounded-full transition-colors hover:bg-[#f8e1dd] sm:grid"
              href={
                settings.whatsapp
                  ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`
                  : '/#contato'
              }
              aria-label="Falar com a Bem Me Quero"
              target={settings.whatsapp ? '_blank' : undefined}
              rel={settings.whatsapp ? 'noreferrer' : undefined}
            >
              <MessageCircle size={20} strokeWidth={1.7} />
            </a>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-[#22251f]/25 transition-opacity ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      >
        <aside
          className={`h-full w-[min(88vw,380px)] bg-[#fffaf7] p-6 shadow-2xl transition-transform ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-[#e8e3df] pb-5">
            <BrandMark logo={settings.logo} />
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full"
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
            >
              <X size={21} />
            </button>
          </div>
          <nav className="flex flex-col py-8" aria-label="Navegação mobile">
            {links.map(([label, href], index) => (
              <Link
                key={label}
                href={href}
                className="flex min-h-14 items-center justify-between border-b border-[#e8e3df] font-editorial text-[28px]"
                onClick={() => setMenuOpen(false)}
              >
                {label}
                <span className="font-sans text-xs text-[#77766f]">0{index + 1}</span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      <div
        className={`fixed inset-0 z-[70] bg-[#fffaf7] transition-opacity ${
          searchOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!searchOpen}
      >
        <div className="mx-auto max-w-4xl px-5 py-8 md:py-16">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77766f]">
              Buscar na loja
            </p>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-[#e8e3df]"
              aria-label="Fechar busca"
              onClick={() => {
                setSearchOpen(false)
                setQuery('')
              }}
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-12 flex items-center border-b border-[#596a49]">
            <Search size={26} strokeWidth={1.4} />
            <input
              autoFocus={searchOpen}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-20 w-full bg-transparent px-5 font-editorial text-3xl outline-none placeholder:text-[#aaa69f] md:text-5xl"
              placeholder="O que você procura?"
              aria-label="Digite o nome do produto"
            />
            {query && (
              <button
                type="button"
                className="text-sm underline underline-offset-4"
                onClick={() => setQuery('')}
              >
                Limpar
              </button>
            )}
          </div>
          <div className="mt-8">
            {query && results.length === 0 && (
              <p className="rounded-xl bg-white p-8 text-[#77766f]">
                Nenhum produto encontrado. Tente outro termo.
              </p>
            )}
            <div className="grid gap-3">
              {results.slice(0, 6).map((product) => (
                <Link
                  key={product.id}
                  href={`/produto/${product.slug}`}
                  className="flex items-center justify-between rounded-xl border border-[#e8e3df] bg-white p-5 transition-colors hover:border-[#a4af85]"
                  onClick={() => setSearchOpen(false)}
                >
                  <span>{product.name}</span>
                  <span className="text-sm text-[#77766f]">
                    {formatCurrency(product.salePrice || product.price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}
