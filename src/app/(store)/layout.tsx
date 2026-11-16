import type { ReactNode } from 'react'
import { StoreHeader } from '@/components/StoreHeader'
import { StoreFooter } from '@/components/StoreFooter'
import { getProducts, getStoreSettings } from '@/lib/store-data'

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const [products, settings] = await Promise.all([getProducts(), getStoreSettings()])

  return (
    <>
      <a className="bypass-link" href="#root">
        Pular para o conteúdo
      </a>
      <StoreHeader products={products} settings={settings} />
      <div id="root" tabIndex={-1}>
        {children}
      </div>
      <StoreFooter settings={settings} />
    </>
  )
}
