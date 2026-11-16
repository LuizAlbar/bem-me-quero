import Link from 'next/link'
import Image from 'next/image'
import { desc, eq } from 'drizzle-orm'
import { AlertTriangle, ArrowRight, Layers, Package, Plus, Sparkles } from 'lucide-react'
import { db } from '@/db'
import { categories, products } from '@/db/schema'
import { formatCurrency } from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [allProducts, allCategories] = await Promise.all([
    db.query.products.findMany({
      with: { category: true },
      orderBy: [desc(products.createdAt)],
    }),
    db.select().from(categories),
  ])

  const totalProducts = allProducts.length
  const totalCategories = allCategories.length
  const featuredProducts = allProducts.filter((p) => p.featured).length
  const lowOrUnavailable = allProducts.filter(
    (p) => p.availability === 'low' || p.availability === 'unavailable',
  ).length

  const recentProducts = allProducts.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-editorial text-3xl text-[#22251f] sm:text-4xl">
            Visão Geral da Loja
          </h1>
          <p className="mt-1 text-xs text-muted">
            Gerencie o catálogo, categorias e estoque da Bem Me Quero.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/produtos" className="button-primary gap-2 !px-4 text-xs">
            <Plus size={15} /> Novo Produto
          </Link>
          <Link href="/admin/categorias" className="button-secondary gap-2 !px-4 text-xs">
            <Plus size={15} /> Nova Categoria
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 min-[390px]:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total de Produtos"
          value={totalProducts}
          icon={<Package size={20} className="text-[#596a49]" />}
        />
        <MetricCard
          label="Categorias Ativas"
          value={totalCategories}
          icon={<Layers size={20} className="text-[#596a49]" />}
        />
        <MetricCard
          label="Produtos em Destaque"
          value={featuredProducts}
          icon={<Sparkles size={20} className="text-[#cb8f98]" />}
        />
        <MetricCard
          label="Atenção ao Estoque"
          value={lowOrUnavailable}
          alert={lowOrUnavailable > 0}
          icon={<AlertTriangle size={20} className="text-[#cb8f98]" />}
        />
      </div>

      {/* Recent Products */}
      <div className="rounded-2xl border border-[#e8e3df] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0ece8] pb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#22251f]">Últimos Produtos</h2>
            <p className="text-xs text-muted">Recém adicionados ou atualizados no catálogo</p>
          </div>
          <Link
            href="/admin/produtos"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#596a49] hover:underline"
          >
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-[#f0ece8]">
          {recentProducts.map((p) => {
            const firstImg = p.images?.[0]?.url
            return (
              <div
                key={p.id}
                className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-[#f4eee9]">
                    {firstImg ? (
                      <Image src={firstImg} alt="" fill sizes="44px" className="object-cover" />
                    ) : (
                      <div className="grid size-full place-items-center text-[10px] text-muted">
                        Sem foto
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 break-words">
                    <p className="text-xs font-semibold text-[#22251f]">{p.name}</p>
                    <p className="text-[11px] text-muted">
                      {p.category?.name || 'Sem categoria'} · {formatCurrency(Number(p.price))}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {p.featured && (
                    <span className="rounded-full bg-[#f8e1dd] px-2.5 py-0.5 text-[10px] font-semibold text-[#8a3341]">
                      Destaque
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      p.availability === 'available'
                        ? 'bg-[#dce1cf]/70 text-[#596a49]'
                        : p.availability === 'low'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {p.availability === 'available'
                      ? 'Disponível'
                      : p.availability === 'low'
                        ? 'Pouco estoque'
                        : 'Esgotado'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  alert = false,
}: {
  label: string
  value: number
  icon: React.ReactNode
  alert?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition-all ${
        alert ? 'border-[#cb8f98]/40 bg-[#f8e1dd]/20' : 'border-[#e8e3df] bg-white'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        <div className="rounded-xl bg-[#fffaf7] p-2">{icon}</div>
      </div>
      <p className="mt-3 font-editorial text-3xl font-semibold text-[#22251f]">{value}</p>
    </div>
  )
}
