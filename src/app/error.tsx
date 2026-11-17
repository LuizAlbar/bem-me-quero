'use client'

import Link from 'next/link'
import { BrandMark } from '@/components/BrandMark'

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <main className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-start justify-center gap-6 px-5 py-16">
      <BrandMark />
      <div role="alert">
        <h1 className="section-title">Não foi possível carregar esta página</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Verifique sua conexão e tente novamente.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={retry} className="button-primary">
          Tentar novamente
        </button>
        <Link href="/" className="button-secondary">
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
