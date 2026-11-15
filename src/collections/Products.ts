import type { CollectionConfig } from 'payload'
import { editorOnly, publicOrEditor } from '@/access/publicOrEditor'
import { revalidateStore, revalidateStoreDelete } from '@/hooks/revalidateStore'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produto', plural: 'Produtos' },
  admin: {
    group: 'Loja',
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'category',
      'price',
      'availability',
      'featured',
      '_status',
      'updatedAt',
    ],
  },
  access: {
    read: publicOrEditor,
    create: editorOnly,
    update: editorOnly,
    delete: editorOnly,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateStore('products')],
    afterDelete: [revalidateStoreDelete('products')],
  },
  fields: [
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'name' },
    {
      name: 'description',
      label: 'Descrição',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'price', label: 'Preço (R$)', type: 'number', required: true, min: 0 },
        {
          name: 'salePrice',
          label: 'Preço promocional (R$)',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      name: 'images',
      label: 'Imagens',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
    },
    {
      name: 'availability',
      label: 'Disponibilidade',
      type: 'select',
      required: true,
      defaultValue: 'available',
      options: [
        { label: 'Disponível', value: 'available' },
        { label: 'Estoque baixo', value: 'low' },
        { label: 'Indisponível', value: 'unavailable' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      label: 'Destacar em Mais vendidos',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'badge',
      label: 'Selo',
      type: 'select',
      options: [
        { label: 'Sem selo', value: 'none' },
        { label: 'Mais vendido', value: 'best-seller' },
        { label: 'Novo', value: 'new' },
        { label: 'Destaque', value: 'highlight' },
        { label: 'Oferta', value: 'offer' },
      ],
      defaultValue: 'none',
      admin: { position: 'sidebar' },
    },
    {
      name: 'variants',
      label: 'Cores e variações',
      type: 'array',
      fields: [
        { name: 'name', label: 'Nome', type: 'text', required: true },
        { name: 'color', label: 'Cor (HEX)', type: 'text' },
      ],
    },
    { name: 'details', label: 'Detalhes', type: 'textarea' },
    { name: 'usage', label: 'Modo de uso', type: 'textarea' },
  ],
}
