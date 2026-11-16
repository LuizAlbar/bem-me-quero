'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Edit2, Image as ImageIcon, Plus, Search, Sparkles, Trash2 } from 'lucide-react'
import {
  createProductAction,
  deleteProductAction,
  toggleProductFeaturedAction,
  updateProductAction,
  uploadImageAction,
} from '@/app/admin/actions'
import { formatCurrency } from '@/components/ProductCard'
import { AdminDialog } from '@/components/AdminDialog'
import { AdminFeedback } from '@/components/AdminFeedback'
import { AdminImageField } from '@/components/AdminImageField'
import { useAdminFeedback } from '@/lib/use-admin-feedback'
import { normalizeSearch } from '@/lib/catalog'
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
  const { pending: loading, error, message, reset, run } = useAdminFeedback()
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  // Filtros de listagem
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.categoryId === selectedCategory
      const matchQuery =
        !searchQuery ||
        normalizeSearch(p.name).includes(normalizeSearch(searchQuery)) ||
        normalizeSearch(p.slug).includes(normalizeSearch(searchQuery))
      return matchCategory && matchQuery
    })
  }, [products, selectedCategory, searchQuery])

  function openCreate() {
    setEditingProduct(null)
    setImageUrl('')
    reset()
    setModalOpen(true)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setImageUrl(product.images?.[0]?.url || '')
    reset()
    setModalOpen(true)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const result = await run(() => uploadImageAction(formData))
    if (result?.success && result.url) setImageUrl(result.url)
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('imageUrl', imageUrl)
    const result = await run(
      () =>
        editingProduct
          ? updateProductAction(editingProduct.id, formData)
          : createProductAction(formData),
      'Produto salvo.',
    )
    if (result?.success) setModalOpen(false)
  }

  async function handleDelete(id: string, name: string) {
    if (confirm(`Excluir o produto "${name}"?`)) {
      await run(() => deleteProductAction(id), 'Produto excluído.')
    }
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    await run(() => toggleProductFeaturedAction(id, current), 'Destaque atualizado.')
  }

  return (
    <div className="space-y-6">
      {!modalOpen && <AdminFeedback error={error} message={message} />}
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-editorial text-3xl text-[#22251f]">Produtos</h1>
          <p className="mt-1 text-xs text-muted">
            Cadastre novos produtos, gerencie preços, estoques e destaques.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="button-primary gap-2 !px-4 text-xs">
          <Plus size={15} /> Novo Produto
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e8e3df] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar produtos no painel"
            placeholder="Buscar por nome ou slug..."
            className="form-control pl-9"
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <label htmlFor="admin-category-filter" className="text-xs font-semibold text-muted">
            Categoria:
          </label>
          <select
            id="admin-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control w-auto"
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
            <thead className="border-b border-[#f0ece8] bg-[#fffaf7] text-muted">
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
              {!filteredProducts.length && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
              {filteredProducts.map((p) => {
                const firstImg = p.images?.[0]?.url
                return (
                  <tr key={p.id} className="hover:bg-[#fffaf7]/60">
                    <td className="px-5 py-3.5">
                      <div className="relative size-11 overflow-hidden rounded-lg bg-[#f4eee9]">
                        {firstImg ? (
                          <Image src={firstImg} alt="" fill sizes="44px" className="object-cover" />
                        ) : (
                          <div className="grid size-full place-items-center text-[10px] text-muted">
                            <ImageIcon size={14} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-[#22251f]">{p.name}</p>
                      <p className="text-[11px] text-muted">/{p.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[#4e504a]">
                      {p.category?.name || <span className="text-muted">Sem categoria</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-[#596a49]">
                          {formatCurrency(Number(p.salePrice || p.price))}
                        </span>
                        {p.salePrice && (
                          <span className="text-[10px] text-muted line-through">
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
                        disabled={loading}
                        aria-pressed={p.featured}
                        aria-label={`Destacar ${p.name} na home`}
                        className={`inline-flex min-h-11 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                          p.featured
                            ? 'bg-[#f8e1dd] text-[#8a3341] hover:bg-[#f0ece8]'
                            : 'bg-[#f0ece8] text-muted hover:bg-[#e8e3df]'
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
                          aria-label={`Editar ${p.name}`}
                          disabled={loading}
                          className="grid size-11 place-items-center rounded-lg text-muted hover:bg-[#fffaf7] hover:text-[#596a49]"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Excluir"
                          aria-label={`Excluir ${p.name}`}
                          disabled={loading}
                          className="grid size-11 place-items-center rounded-lg text-muted hover:bg-[#f8e1dd] hover:text-[#8a3341]"
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
        <AdminDialog
          title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
          onClose={() => setModalOpen(false)}
          busy={loading}
          wide
        >
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <AdminFeedback error={error} />
            <fieldset disabled={loading} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="product-name"
                    className="block text-xs font-semibold text-[#4e504a]"
                  >
                    Nome do Produto *
                  </label>
                  <input
                    id="product-name"
                    name="name"
                    type="text"
                    required
                    defaultValue={editingProduct?.name || ''}
                    placeholder="Ex: Batom Matte Aveludado"
                    className="form-control mt-1.5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-slug"
                    className="block text-xs font-semibold text-[#4e504a]"
                  >
                    Slug (URL amigável)
                  </label>
                  <input
                    id="product-slug"
                    name="slug"
                    type="text"
                    defaultValue={editingProduct?.slug || ''}
                    placeholder="batom-matte (deixe vazio para gerar automático)"
                    className="form-control mt-1.5"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="product-categoryId"
                    className="block text-xs font-semibold text-[#4e504a]"
                  >
                    Categoria
                  </label>
                  <select
                    id="product-categoryId"
                    name="categoryId"
                    defaultValue={editingProduct?.categoryId || ''}
                    className="form-control mt-1.5"
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
                  <label
                    htmlFor="product-price"
                    className="block text-xs font-semibold text-[#4e504a]"
                  >
                    Preço (R$) *
                  </label>
                  <input
                    id="product-price"
                    name="price"
                    inputMode="decimal"
                    type="text"
                    required
                    defaultValue={editingProduct?.price ? String(editingProduct.price) : ''}
                    placeholder="49.90"
                    className="form-control mt-1.5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-salePrice"
                    className="block text-xs font-semibold text-[#4e504a]"
                  >
                    Preço Promocional (R$)
                  </label>
                  <input
                    id="product-salePrice"
                    name="salePrice"
                    inputMode="decimal"
                    type="text"
                    defaultValue={editingProduct?.salePrice ? String(editingProduct.salePrice) : ''}
                    placeholder="Opcional"
                    className="form-control mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="product-description"
                  className="block text-xs font-semibold text-[#4e504a]"
                >
                  Descrição do Produto *
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  rows={3}
                  required
                  defaultValue={editingProduct?.description || ''}
                  placeholder="Apresente os benefícios, fórmula e diferenciais do produto..."
                  className="form-control mt-1.5"
                />
              </div>

              {/* Imagem do Produto (com upload WebP para Supabase Storage) */}
              <AdminImageField
                value={imageUrl}
                onChange={setImageUrl}
                onUpload={handleFileUpload}
                uploading={uploading}
                disabled={loading}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="product-availability"
                    className="block text-xs font-semibold text-[#4e504a]"
                  >
                    Disponibilidade
                  </label>
                  <select
                    id="product-availability"
                    name="availability"
                    defaultValue={editingProduct?.availability || 'available'}
                    className="form-control mt-1.5"
                  >
                    <option value="available">Disponível</option>
                    <option value="low">Pouco Estoque</option>
                    <option value="unavailable">Esgotado</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="product-badge"
                    className="block text-xs font-semibold text-[#4e504a]"
                  >
                    Etiqueta / Selo
                  </label>
                  <select
                    id="product-badge"
                    name="badge"
                    defaultValue={editingProduct?.badge || 'none'}
                    className="form-control mt-1.5"
                  >
                    <option value="none">Nenhum</option>
                    <option value="best-seller">Seleção da loja</option>
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
                  <label
                    htmlFor="product-details"
                    className="block text-xs font-semibold text-[#4e504a]"
                  >
                    Detalhes Técnicos
                  </label>
                  <input
                    id="product-details"
                    name="details"
                    type="text"
                    defaultValue={editingProduct?.details || ''}
                    placeholder="Ex: Contém 30ml. Vegano e cruelty-free."
                    className="form-control mt-1.5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="product-usage"
                    className="block text-xs font-semibold text-[#4e504a]"
                  >
                    Modo de Uso
                  </label>
                  <input
                    id="product-usage"
                    name="usage"
                    type="text"
                    defaultValue={editingProduct?.usage || ''}
                    placeholder="Ex: Aplique da raiz às pontas..."
                    className="form-control mt-1.5"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-[#f0ece8] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="min-h-11 rounded-xl px-4 py-2 text-sm font-semibold text-muted hover:bg-[#f0ece8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="button-primary !px-5 text-xs disabled:opacity-50"
                >
                  {uploading ? 'Enviando imagem...' : loading ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>
            </fieldset>
          </form>
        </AdminDialog>
      )}
    </div>
  )
}
