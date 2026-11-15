import type { CollectionConfig } from 'payload'
import { editorOnly, publicOrEditor } from '@/access/publicOrEditor'
import { revalidateStore, revalidateStoreDelete } from '@/hooks/revalidateStore'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categoria', plural: 'Categorias' },
  admin: {
    group: 'Loja',
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'visible', '_status'],
  },
  access: {
    read: publicOrEditor,
    create: editorOnly,
    update: editorOnly,
    delete: editorOnly,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateStore('categories')],
    afterDelete: [revalidateStoreDelete('categories')],
  },
  fields: [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'name' },
    {
      name: 'description',
      label: 'Descrição curta',
      type: 'textarea',
      maxLength: 180,
    },
    {
      name: 'image',
      label: 'Imagem de capa',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'order',
      label: 'Ordem',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'visible',
      label: 'Visível na vitrine',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
