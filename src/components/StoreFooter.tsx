import Link from 'next/link'
import { BrandMark } from '@/components/BrandMark'
import { SocialLinks } from '@/components/SocialLinks'
import type { SettingsView } from '@/lib/store-data'

export function StoreFooter({ settings }: { settings: SettingsView }) {
  const year = new Date().getFullYear()
  return (
    <footer id="contato" className="bg-[#596a49] text-[#fffaf7]">
      <div className="section-spacing mx-auto grid max-w-[1320px] gap-8 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-10">
        <div className="lg:col-span-2">
          <BrandMark logo={settings.logo} inverse />
          <p className="mt-6 max-w-md text-sm leading-6 text-[#fffaf7]/95">
            {settings.shortText || 'Uma curadoria de beleza para realçar o que faz você ser você.'}
          </p>
          <SocialLinks settings={settings} className="mt-5" />
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/95">
            Navegue
          </h2>
          <nav
            className="mt-3 flex flex-col text-sm [&_a]:flex [&_a]:min-h-11 [&_a]:items-center"
            aria-label="Navegação do rodapé"
          >
            <Link href="/">Início</Link>
            <Link href="/produtos">Produtos</Link>
            <Link href="/#categorias">Categorias</Link>
            <Link href="/#mais-vendidos">Destaques</Link>
          </nav>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/95">
            Informações
          </h2>
          <div className="mt-3 flex flex-col text-sm [&_a]:flex [&_a]:min-h-11 [&_a]:items-center">
            {settings.usefulLinks?.length
              ? settings.usefulLinks.map((link) => (
                  <a key={link.id || link.url} href={link.url}>
                    {link.label}
                  </a>
                ))
              : null}
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 py-6 text-xs text-white/95 md:flex-row md:justify-between md:px-8 lg:px-10">
          <p>© {year} Bem Me Quero Maquiagens.</p>
          <p>Beleza com cuidado, leveza e intenção.</p>
        </div>
      </div>
    </footer>
  )
}
