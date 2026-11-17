import { ProductGridSkeleton } from '@/components/ProductGridSkeleton'

export default function CatalogLoading() {
  return (
    <main className="mx-auto max-w-[1320px] px-5 py-12 md:px-8 lg:px-10" aria-busy="true">
      <p className="mb-8 text-sm text-muted" role="status">
        Carregando produtos...
      </p>
      <div aria-hidden="true" className="mb-8 space-y-4">
        <div className="skeleton h-14 w-3/4 max-w-sm" />
        <div className="skeleton h-11 w-full" />
      </div>
      <ProductGridSkeleton />
    </main>
  )
}
