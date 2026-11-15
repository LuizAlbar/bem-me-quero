import React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { BodyCustomCode, renderHeadCustomCode } from '@/lib/make-custom-code'
import { makeSiteSettings, sanitizeHtmlAttribute } from '@/lib/make-site-settings'
import { getProducts, getStoreSettings } from '@/lib/store-data'
import { StoreHeader } from '@/components/StoreHeader'
import { StoreFooter } from '@/components/StoreFooter'
import './styles.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
})

const defaultTitle = 'Bem Me Quero Maquiagens'
const title = makeSiteSettings.title ?? defaultTitle
const description =
  makeSiteSettings.description ?? 'Maquiagens escolhidas com carinho para realçar a sua beleza.'
const favicon = makeSiteSettings.icons?.icon ?? '/favicon.svg'
const socialImage = makeSiteSettings.openGraph?.image
const googleAnalyticsId = sanitizeHtmlAttribute(makeSiteSettings.analytics?.googleAnalyticsId)

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title,
  description,
  robots: makeSiteSettings.robots?.index === false ? { follow: false, index: false } : undefined,
  icons: favicon ? { icon: favicon } : undefined,
  openGraph: {
    title,
    description,
    images: socialImage ? [socialImage] : undefined,
  },
  twitter: socialImage
    ? {
        card: 'summary_large_image',
        images: [socialImage],
      }
    : undefined,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const language = sanitizeHtmlAttribute(makeSiteSettings.language) || 'pt-BR'
  const addBypassLinks = makeSiteSettings.accessibility?.addBypassLinks === true
  const customScripts = makeSiteSettings.customScripts

  return (
    <html lang={language} className={`${dmSans.variable} ${cormorant.variable}`}>
      <head>
        {renderHeadCustomCode(customScripts?.headStart, 'head-start')}
        {renderHeadCustomCode(customScripts?.headEnd, 'head-end')}
      </head>
      <body className="min-h-screen bg-[#fffaf7] text-[#22251f] antialiased">
        <BodyCustomCode html={customScripts?.bodyStart} />
        {addBypassLinks && (
          <a className="figma-bypass-link" href="#root">
            Pular para o conteúdo
          </a>
        )}
        <StoreHeader products={await getProducts()} settings={await getStoreSettings()} />
        <div id="root" tabIndex={-1}>
          {children}
        </div>
        <StoreFooter settings={await getStoreSettings()} />
        {googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="figma-google-analytics" strategy="afterInteractive">
              {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(googleAnalyticsId)});
`}
            </Script>
          </>
        )}
        <BodyCustomCode html={customScripts?.bodyEnd} />
      </body>
    </html>
  )
}
