import Link from 'next/link'
import { Camera, MessageCircle } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import type { SettingsView } from '@/lib/store-data'

export function StoreFooter({ settings }: { settings: SettingsView }) {
  const year = new Date().getFullYear()
  return (
    <footer id="contato" className="bg-[#596a49] text-[#fffaf7]">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-10 lg:py-20">
        <div className="lg:col-span-2">
          <BrandMark logo={settings.logo} inverse />
          <p className="mt-6 max-w-md text-sm leading-6 text-[#fffaf7]/75">
            {settings.shortText || 'Uma curadoria de beleza para realçar o que faz você ser você.'}
          </p>
          <div className="mt-7 flex gap-3">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="grid size-11 place-items-center rounded-full border border-white/25 hover:bg-white/10"
                aria-label="Instagram"
              >
                <Camera size={19} />
              </a>
            )}
            <a
              href={
                settings.whatsapp
                  ? `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`
                  : '#contato'
              }
              className="grid size-11 place-items-center rounded-full border border-white/25 hover:bg-white/10"
              aria-label="WhatsApp"
              target={settings.whatsapp ? '_blank' : undefined}
              rel={settings.whatsapp ? 'noreferrer' : undefined}
            >
              <MessageCircle size={19} />
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Navegue
          </h2>
          <nav className="mt-5 flex flex-col gap-3 text-sm">
            <Link href="/">Início</Link>
            <Link href="/produtos">Produtos</Link>
            <Link href="/#categorias">Categorias</Link>
            <Link href="/#mais-vendidos">Mais vendidos</Link>
          </nav>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            Informações
          </h2>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {settings.usefulLinks?.length ? (
              settings.usefulLinks.map((link) => (
                <a key={link.id || link.url} href={link.url}>
                  {link.label}
                </a>
              ))
            ) : (
              <p className="text-white/60">Links úteis serão adicionados em breve.</p>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 py-6 text-xs text-white/55 md:flex-row md:justify-between md:px-8 lg:px-10">
          <p>© {year} Bem Me Quero Maquiagens.</p>
          <p>Beleza com cuidado, leveza e intenção.</p>
        </div>
      </div>
    </footer>
  )
}
