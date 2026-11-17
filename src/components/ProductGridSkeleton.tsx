export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-x-6"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="min-w-0">
          <div className="skeleton aspect-[4/5]" />
          <div className="skeleton mt-4 h-3 w-16" />
          <div className="skeleton mt-3 h-10 w-full" />
          <div className="skeleton mt-3 h-5 w-20" />
          <div className="skeleton mt-3 h-8 w-24" />
        </div>
      ))}
    </div>
  )
}
