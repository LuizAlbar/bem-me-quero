import React from 'react'
import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { getProducts, getStoreSettings } from '@/lib/store-data'
import { StoreHeader } from '@/components/StoreHeader'
import { StoreFooter } from '@/components/StoreFooter'
import './styles.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Bem Me Quero Maquiagens | Realce o que faz você ser você',
  description: 'Maquiagens e cosméticos escolhidos com carinho para realçar a sua beleza natural.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Bem Me Quero Maquiagens',
    description:
      'Maquiagens e cosméticos escolhidos com carinho para realçar a sua beleza natural.',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [products, settings] = await Promise.all([getProducts(), getStoreSettings()])

  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-[#fffaf7] text-[#22251f] antialiased">
        <a className="bypass-link" href="#root">
          Pular para o conteúdo
        </a>
        <StoreHeader products={products} settings={settings} />
        <div id="root" tabIndex={-1}>
          {children}
        </div>
        <StoreFooter settings={settings} />
      </body>
    </html>
  )
}
