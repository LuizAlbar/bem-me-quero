'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Edit2, Image as ImageIcon, Plus, Trash2 } from 'lucide-react'
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  uploadImageAction,
} from '@/app/admin/actions'
import { AdminDialog } from '@/components/AdminDialog'
import { AdminFeedback } from '@/components/AdminFeedback'
import { AdminImageField } from '@/components/AdminImageField'
import { useAdminFeedback } from '@/lib/use-admin-feedback'
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
  const { pending: loading, error, message, reset, run } = useAdminFeedback()
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  function openCreate() {
    setEditingCategory(null)
    setImageUrl('')
    reset()
    setModalOpen(true)
  }

  function openEdit(category: Category) {
    setEditingCategory(category)
    setImageUrl(category.imageUrl || '')
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
        editingCategory
          ? updateCategoryAction(editingCategory.id, formData)
          : createCategoryAction(formData),
      'Categoria salva.',
    )
    if (result?.success) setModalOpen(false)
  }

  async function handleDelete(id: string, name: string) {
    if (confirm(`Excluir a categoria "${name}"?`)) {
      await run(() => deleteCategoryAction(id), 'Categoria excluída.')
    }
  }

  return (
    <div className="space-y-6">
      {!modalOpen && <AdminFeedback error={error} message={message} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-editorial text-3xl text-[#22251f]">Categorias</h1>
          <p className="mt-1 text-xs text-muted">
            Organize os produtos por categorias e coleções da loja.
          </p>
        </div>
        <button type="button" onClick={openCreate} className="button-primary gap-2 !px-4 text-xs">
          <Plus size={15} /> Nova Categoria
        </button>
      </div>

      <div className="rounded-2xl border border-[#e8e3df] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#f0ece8] bg-[#fffaf7] text-muted">
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
              {!categories.length && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted">
                    Cadastre sua primeira categoria.
                  </td>
                </tr>
              )}
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#fffaf7]/60">
                  <td className="px-5 py-3.5">
                    <div className="relative size-10 overflow-hidden rounded-lg bg-[#f4eee9]">
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-[10px] text-muted">
                          <ImageIcon size={14} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#22251f]">{cat.name}</td>
                  <td className="px-5 py-3.5 text-muted">{cat.slug}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-[#dce1cf]/60 px-2.5 py-0.5 text-[11px] font-semibold text-[#596a49]">
                      {productCounts[cat.id] || 0} produtos
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted">{cat.order}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(cat)}
                        title="Editar"
                        aria-label={`Editar ${cat.name}`}
                        disabled={loading}
                        className="grid size-11 place-items-center rounded-lg text-muted hover:bg-[#fffaf7] hover:text-[#596a49]"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
                        title="Excluir"
                        aria-label={`Excluir ${cat.name}`}
                        disabled={loading}
                        className="grid size-11 place-items-center rounded-lg text-muted hover:bg-[#f8e1dd] hover:text-[#8a3341]"
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
        <AdminDialog
          title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          onClose={() => setModalOpen(false)}
          busy={loading}
        >
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <AdminFeedback error={error} />
            <fieldset disabled={loading} className="space-y-4">
              <div>
                <label
                  htmlFor="category-name"
                  className="block text-xs font-semibold text-[#4e504a]"
                >
                  Nome da Categoria *
                </label>
                <input
                  id="category-name"
                  name="name"
                  type="text"
                  required
                  defaultValue={editingCategory?.name || ''}
                  placeholder="Ex: Lábios"
                  className="form-control mt-1.5"
                />
              </div>

              <div>
                <label
                  htmlFor="category-slug"
                  className="block text-xs font-semibold text-[#4e504a]"
                >
                  Slug (URL amigável)
                </label>
                <input
                  id="category-slug"
                  name="slug"
                  type="text"
                  defaultValue={editingCategory?.slug || ''}
                  placeholder="labios (deixe vazio para gerar automático)"
                  className="form-control mt-1.5"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="block text-xs font-semibold text-[#4e504a]"
                >
                  Descrição
                </label>
                <textarea
                  id="category-description"
                  name="description"
                  rows={2}
                  defaultValue={editingCategory?.description || ''}
                  placeholder="Breve descrição dos produtos desta categoria"
                  className="form-control mt-1.5"
                />
              </div>

              <AdminImageField
                value={imageUrl}
                onChange={setImageUrl}
                onUpload={handleFileUpload}
                uploading={uploading}
                disabled={loading}
                category
              />

              <div>
                <label
                  htmlFor="category-order"
                  className="block text-xs font-semibold text-[#4e504a]"
                >
                  Ordem de Exibição
                </label>
                <input
                  id="category-order"
                  name="order"
                  type="number"
                  defaultValue={editingCategory?.order ?? 0}
                  className="form-control mt-1.5 w-24"
                />
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
                  {uploading ? 'Enviando imagem...' : loading ? 'Salvando...' : 'Salvar Categoria'}
                </button>
              </div>
            </fieldset>
          </form>
        </AdminDialog>
      )}
    </div>
  )
}
