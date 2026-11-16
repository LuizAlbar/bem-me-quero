'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { SocialLinks } from '@/components/SocialLinks'
import { formatCurrency } from '@/components/ProductCard'
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
  const isHome = usePathname() === '/'
  const menuRef = useRef<HTMLDialogElement>(null)
  const searchRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const menu = menuRef.current
    const search = searchRef.current
    if (menuOpen && menu && !menu.open) menu.showModal()
    if (!menuOpen && menu?.open) menu.close()
    if (searchOpen && search && !search.open) search.showModal()
    if (!searchOpen && search?.open) search.close()
    const previousOverflow = document.body.style.overflow
    if (menuOpen || searchOpen) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen, searchOpen])

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
      <header className={`${isHome ? 'absolute inset-x-0 top-0' : 'relative bg-[#fffaf7]'} z-50`}>
        <AnnouncementBar settings={settings} />
        <div className={`store-navbar ${isHome ? '' : 'border-b border-[#e8e3df]'}`}>
          <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between gap-1 px-3 sm:px-5 lg:grid lg:h-24 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
            <button
              type="button"
              className="icon-link lg:hidden"
              aria-label="Abrir menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={21} strokeWidth={1.7} />
            </button>
            <Link href="/" aria-label="Bem Me Quero Maquiagens — Início" className="w-fit">
              <BrandMark logo={settings.logo} />
            </Link>
            <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
              {links.map(([label, href]) => (
                <Link key={label} href={href} className="nav-link text-[13px] font-medium">
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-1 lg:justify-self-end">
              <button
                type="button"
                className="icon-link"
                aria-label="Buscar produtos"
                aria-haspopup="dialog"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen(true)}
              >
                <Search size={20} strokeWidth={1.7} />
              </button>
              <SocialLinks settings={settings} className="hidden md:flex" />
            </div>
          </div>
        </div>
      </header>

      <dialog
        ref={menuRef}
        className="store-dialog fixed inset-0 m-0 h-svh max-h-none w-[min(88vw,380px)] max-w-none bg-[#fffaf7] p-6 text-[#22251f] shadow-2xl"
        aria-label="Menu da loja"
        onCancel={() => setMenuOpen(false)}
        onClick={(event) => {
          if (
            event.target === event.currentTarget &&
            event.clientX > event.currentTarget.getBoundingClientRect().right
          )
            setMenuOpen(false)
        }}
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
        <SocialLinks settings={settings} />
      </dialog>

      <dialog
        ref={searchRef}
        className="store-dialog fixed inset-0 m-0 h-svh max-h-none w-full max-w-none bg-[#fffaf7] p-0 text-[#22251f]"
        aria-label="Buscar na loja"
        onCancel={() => setSearchOpen(false)}
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
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-20 min-w-0 flex-1 bg-transparent px-5 font-editorial text-3xl outline-none placeholder:text-[#aaa69f] md:text-5xl"
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
      </dialog>
    </>
  )
}
