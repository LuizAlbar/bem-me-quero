'use client'

import { useState } from 'react'
import { Edit2, Image as ImageIcon, Loader2, Plus, Trash2, Upload, X } from 'lucide-react'
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  uploadImageAction,
} from '@/app/admin/actions'
import type { Category } from '@/db/schema'

export function CategoriesManager({
  categories,
  productCounts,
}: {
  categories: Category[]
  productCounts: Record<string, number>
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  function openCreate() {
    setEditingCategory(null)
    setImageUrl('')
    setError(null)
    setModalOpen(true)
  }

  function openEdit(category: Category) {
    setEditingCategory(category)
    setImageUrl(category.imageUrl || '')
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
      setError(res.error || 'Erro ao fazer upload da imagem.')
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('imageUrl', imageUrl)

    let res: { error?: string; success?: boolean } | undefined

    if (editingCategory) {
      res = await updateCategoryAction(editingCategory.id, formData)
    } else {
      res = await createCategoryAction(formData)
    }

    setLoading(false)

    if (res?.error) {
      setError(res.error)
    } else {
      setModalOpen(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) {
      await deleteCategoryAction(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-editorial text-3xl text-[#22251f]">Categorias</h1>
          <p className="mt-1 text-xs text-[#77766f]">
            Organize os produtos por categorias e coleções da loja.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="button-primary gap-2 !min-h-10 !px-4 text-xs"
        >
          <Plus size={15} /> Nova Categoria
        </button>
      </div>

      <div className="rounded-2xl border border-[#e8e3df] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#f0ece8] bg-[#fffaf7] text-[#77766f]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Imagem</th>
                <th className="px-5 py-3.5 font-semibold">Nome</th>
                <th className="px-5 py-3.5 font-semibold">Slug</th>
                <th className="px-5 py-3.5 font-semibold">Produtos</th>
                <th className="px-5 py-3.5 font-semibold">Ordem</th>
                <th className="px-5 py-3.5 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece8]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#fffaf7]/60">
                  <td className="px-5 py-3.5">
                    <div className="relative size-10 overflow-hidden rounded-lg bg-[#f4eee9]">
                      {cat.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cat.imageUrl} alt={cat.name} className="size-full object-cover" />
                      ) : (
                        <div className="grid size-full place-items-center text-[10px] text-[#77766f]">
                          <ImageIcon size={14} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#22251f]">{cat.name}</td>
                  <td className="px-5 py-3.5 text-[#77766f]">{cat.slug}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-[#dce1cf]/60 px-2.5 py-0.5 text-[11px] font-semibold text-[#596a49]">
                      {productCounts[cat.id] || 0} produtos
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#77766f]">{cat.order}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(cat)}
                        title="Editar"
                        className="grid size-8 place-items-center rounded-lg text-[#77766f] hover:bg-[#fffaf7] hover:text-[#596a49]"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
                        title="Excluir"
                        className="grid size-8 place-items-center rounded-lg text-[#77766f] hover:bg-[#f8e1dd] hover:text-[#8a3341]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar / Editar Categoria */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#f0ece8] pb-4">
              <h2 className="font-editorial text-2xl text-[#22251f]">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
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

              <div>
                <label className="block text-xs font-semibold text-[#4e504a]">
                  Nome da Categoria *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={editingCategory?.name || ''}
                  placeholder="Ex: Lábios"
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
                  defaultValue={editingCategory?.slug || ''}
                  placeholder="labios (deixe vazio para gerar automático)"
                  className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4e504a]">Descrição</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingCategory?.description || ''}
                  placeholder="Breve descrição dos produtos desta categoria"
                  className="mt-1.5 w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4e504a]">
                  Imagem da Categoria
                </label>
                <div className="mt-1.5 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Cole uma URL ou use o upload abaixo"
                      className="w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e8e3df] bg-[#fffaf7] px-3 py-1.5 text-xs font-medium text-[#596a49] hover:bg-[#dce1cf]/40">
                      {uploading ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Upload size={13} />
                      )}
                      <span>
                        {uploading ? 'Comprimindo e enviando...' : 'Fazer upload de imagem (WebP)'}
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

              <div>
                <label className="block text-xs font-semibold text-[#4e504a]">
                  Ordem de Exibição
                </label>
                <input
                  name="order"
                  type="number"
                  defaultValue={editingCategory?.order ?? 0}
                  className="mt-1.5 w-24 rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 px-3.5 py-2 text-xs focus:border-[#596a49] focus:bg-white focus:outline-none"
                />
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
                  {loading ? 'Salvando...' : 'Salvar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
