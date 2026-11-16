export default function ProductLoading() {
  return (
    <main aria-busy="true" className="mx-auto max-w-[1320px] px-5 py-8 md:px-8 lg:px-10">
      <p role="status" className="mb-6 text-sm text-muted">
        Carregando produto...
      </p>
      <div className="grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-16" aria-hidden="true">
        <div className="skeleton aspect-[5/4]" />
        <div className="space-y-6">
          <div className="skeleton h-20 w-4/5" />
          <div className="skeleton h-8 w-24" />
          <div className="skeleton h-28 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    </main>
  )
}
