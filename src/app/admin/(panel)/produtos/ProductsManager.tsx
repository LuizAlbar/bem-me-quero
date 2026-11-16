'use client'

import { useMemo, useState } from 'react'
import {
  Edit2,
  Image as ImageIcon,
  Loader2,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import {
  createProductAction,
  deleteProductAction,
  toggleProductFeaturedAction,
  updateProductAction,
  uploadImageAction,
} from '@/app/admin/actions'
import { formatCurrency } from '@/components/ProductCard'
import type { Category, Product } from '@/db/schema'

export function ProductsManager({
  products,
  categories,
}: {
  products: (Product & { category?: Category | null })[]
  categories: Category[]
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Filtros de listagem
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.categoryId === selectedCategory
      const matchQuery =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchQuery
    })
  }, [products, selectedCategory, searchQuery])

  function openCreate() {
    setEditingProduct(null)
    setImageUrl('')
    setError(null)
    setModalOpen(true)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setImageUrl(product.images?.[0]?.url || '')
    setError(null)
    setModalOpen(true)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadImageAction(formData)
    setUploading(false)

    if (res.success && res.url) {
      setImageUrl(res.url)
    } else {
      setError(res.error || 'Erro ao processar imagem.')
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('imageUrl', imageUrl)

    let res: { error?: string; success?: boolean } | undefined

    if (editingProduct) {
      res = await updateProductAction(editingProduct.id, formData)
    } else {
      res = await createProductAction(formData)
    }

    setLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      setModalOpen(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      await deleteProductAction(id)
    }
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    await toggleProductFeaturedAction(id, current)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-editorial text-3xl text-[#22251f]">Produtos</h1>
          <p className="mt-1 text-xs text-[#77766f]">
            Cadastre novos produtos, gerencie preços, estoques e destaques.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="button-primary gap-2 !min-h-10 !px-4 text-xs"
        >
          <Plus size={15} /> Novo Produto
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e8e3df] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77766f]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome ou slug..."
            className="w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 py-2 pl-9 pr-3 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-[#77766f]">Categoria:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
          >
            <option value="all">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#e8e3df] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#f0ece8] bg-[#fffaf7] text-[#77766f]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Foto</th>
                <th className="px-5 py-3.5 font-semibold">Produto</th>
                <th className="px-5 py-3.5 font-semibold">Categoria</th>
                <th className="px-5 py-3.5 font-semibold">Preço</th>
                <th className="px-5 py-3.5 font-semibold">Disponibilidade</th>
                <th className="px-5 py-3.5 font-semibold">Destaque</th>
                <th className="px-5 py-3.5 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece8]">
              {filteredProducts.map((p) => {
                const firstImg = p.images?.[0]?.url
                return (
                  <tr key={p.id} className="hover:bg-[#fffaf7]/60">
                    <td className="px-5 py-3.5">
                      <div className="relative size-11 overflow-hidden rounded-lg bg-[#f4eee9]">
                        {firstImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={firstImg} alt={p.name} className="size-full object-cover" />
                        ) : (
                          <div className="grid size-full place-items-center text-[10px] text-[#77766f]">
                            <ImageIcon size={14} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-[#22251f]">{p.name}</p>
                      <p className="text-[11px] text-[#77766f]">/{p.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[#4e504a]">
                      {p.category?.name || <span className="text-[#a09e97]">Sem categoria</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-[#596a49]">
                          {formatCurrency(Number(p.salePrice || p.price))}
                        </span>
                        {p.salePrice && (
                          <span className="text-[10px] text-[#77766f] line-through">
                            {formatCurrency(Number(p.price))}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
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
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p.id, p.featured)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                          p.featured
                            ? 'bg-[#f8e1dd] text-[#8a3341] hover:bg-[#f0ece8]'
                            : 'bg-[#f0ece8] text-[#77766f] hover:bg-[#e8e3df]'
                        }`}
                      >
                        <Sparkles size={11} />
                        {p.featured ? 'Na Home' : 'Não'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          title="Editar"
                          className="grid size-8 place-items-center rounded-lg text-[#77766f] hover:bg-[#fffaf7] hover:text-[#596a49]"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Excluir"
                          className="grid size-8 place-items-center rounded-lg text-[#77766f] hover:bg-[#f8e1dd] hover:text-[#8a3341]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar / Editar Produto */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[#f0ece8] pb-4">
              <h2 className="font-editorial text-2xl text-[#22251f]">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-[#77766f] hover:bg-[#f0ece8]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {error && (
                <div className="rounded-xl border border-[#cb8f98]/30 bg-[#f8e1dd]/40 p-3 text-xs font-medium text-[#8a3341]">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#4e504a]">
                    Nome do Produto *
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={editingProduct?.name || ''}
                    placeholder="Ex: Batom Matte Aveludado"
                    className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4e504a]">
                    Slug (URL amigável)
                  </label>
                  <input
                    name="slug"
                    type="text"
                    defaultValue={editingProduct?.slug || ''}
                    placeholder="batom-matte (deixe vazio para gerar automático)"
                    className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4e504a]">Categoria</label>
                  <select
                    name="categoryId"
                    defaultValue={editingProduct?.categoryId || ''}
                    className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4e504a]">Preço (R$) *</label>
                  <input
                    name="price"
                    type="text"
                    required
                    defaultValue={editingProduct?.price ? String(editingProduct.price) : ''}
                    placeholder="49.90"
                    className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4e504a]">
                    Preço Promocional (R$)
                  </label>
                  <input
                    name="salePrice"
                    type="text"
                    defaultValue={editingProduct?.salePrice ? String(editingProduct.salePrice) : ''}
                    placeholder="Opcional"
                    className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4e504a]">
                  Descrição do Produto *
                </label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  defaultValue={editingProduct?.description || ''}
                  placeholder="Apresente os benefícios, fórmula e diferenciais do produto..."
                  className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Imagem do Produto (com upload WebP para Supabase Storage) */}
              <div>
                <label className="block text-xs font-semibold text-[#4e504a]">
                  Foto Principal do Produto
                </label>
                <div className="mt-1.5 space-y-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Cole a URL da imagem ou utilize o upload abaixo"
                    className="w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                  />

                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e8e3df] bg-[#fffaf7] px-3 py-1.5 text-xs font-medium text-[#596a49] hover:bg-[#dce1cf]/40">
                      {uploading ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Upload size={13} />
                      )}
                      <span>
                        {uploading
                          ? 'Comprimindo e enviando para o Supabase Storage...'
                          : 'Fazer upload de imagem (WebP)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>

                    {imageUrl && (
                      <span className="truncate text-[11px] text-[#596a49]">Imagem pronta</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4e504a]">
                    Disponibilidade
                  </label>
                  <select
                    name="availability"
                    defaultValue={editingProduct?.availability || 'available'}
                    className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                  >
                    <option value="available">Disponível</option>
                    <option value="low">Pouco Estoque</option>
                    <option value="unavailable">Esgotado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4e504a]">
                    Etiqueta / Selo
                  </label>
                  <select
                    name="badge"
                    defaultValue={editingProduct?.badge || 'none'}
                    className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                  >
                    <option value="none">Nenhum</option>
                    <option value="best-seller">Mais Vendido</option>
                    <option value="new">Novidade</option>
                    <option value="highlight">Destaque</option>
                    <option value="offer">Oferta</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    value="true"
                    defaultChecked={editingProduct?.featured || false}
                    className="size-4 rounded border-[#e8e3df] text-[#596a49] focus:ring-[#596a49]"
                  />
                  <label htmlFor="featured" className="text-xs font-semibold text-[#4e504a]">
                    Destacar na Home
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#4e504a]">
                    Detalhes Técnicos
                  </label>
                  <input
                    name="details"
                    type="text"
                    defaultValue={editingProduct?.details || ''}
                    placeholder="Ex: Contém 30ml. Vegano e cruelty-free."
                    className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4e504a]">Modo de Uso</label>
                  <input
                    name="usage"
                    type="text"
                    defaultValue={editingProduct?.usage || ''}
                    placeholder="Ex: Aplique da raiz às pontas..."
                    className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[#f0ece8] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-[#77766f] hover:bg-[#f0ece8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="button-primary !min-h-9 !px-5 text-xs disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
