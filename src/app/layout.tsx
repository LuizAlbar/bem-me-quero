import React from 'react'
import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
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
  icons: {
    icon: [
      { url: '/assets/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/assets/favicon.png',
  },
  openGraph: {
    title: 'Bem Me Quero Maquiagens',
    description:
      'Maquiagens e cosméticos escolhidos com carinho para realçar a sua beleza natural.',
    type: 'website',
    images: [
      {
        url: '/assets/logo.png',
        width: 2172,
        height: 724,
        alt: 'Bem Me Quero Maquiagens',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-[#fffaf7] text-[#22251f] antialiased">{children}</body>
    </html>
  )
}
