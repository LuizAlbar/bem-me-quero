import Link from 'next/link'

/**
 * Custom not-found page for the frontend.
 * This renders when `notFound()` is called from any page in the (frontend) route group.
 *
 * Customize this component to match your app's design and provide helpful navigation.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-8 py-16 text-center">
      <p className="eyebrow">Página não encontrada</p>
      <h1 className="mt-4 font-editorial text-5xl tracking-[-.04em]">
        Essa beleza ainda não está por aqui
      </h1>
      <p className="mt-4 text-[#77766f]">
        O conteúdo pode ter sido movido ou ainda não foi publicado.
      </p>
      <Link className="button-primary mt-7" href="/">
        Voltar ao início
      </Link>
    </main>
  )
}
