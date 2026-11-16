import { ProductExplorer } from '@/components/ProductExplorer'
import { getCategories, getProducts } from '@/lib/store-data'

export const metadata = {
  title: 'Produtos | Bem Me Quero Maquiagens',
  description: 'Conheça a curadoria de maquiagem da Bem Me Quero.',
}

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])

  return (
    <main>
      <section className="bg-[#f8e1dd]/55">
        <div className="mx-auto max-w-[1320px] px-5 section-spacing md:px-8 lg:px-10">
          <p className="eyebrow">Catálogo</p>
          <h1 className="page-title mt-4 max-w-3xl">Beleza para cada versão de você</h1>
          <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#63645f]">
            Explore nossa seleção, filtre por categoria e encontre o produto que combina com a sua
            rotina.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-5 section-spacing md:px-8 lg:px-10">
        <ProductExplorer products={products} categories={categories} />
      </section>
    </main>
  )
}
