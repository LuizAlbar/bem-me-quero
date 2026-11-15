import type { CollectionConfig } from 'payload'
import { editorOnly, publicOrEditor } from '@/access/publicOrEditor'
import { revalidateStore, revalidateStoreDelete } from '@/hooks/revalidateStore'

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: { singular: 'Banner', plural: 'Banners' },
  admin: {
    group: 'Conteúdo',
    useAsTitle: 'title',
    defaultColumns: ['title', 'placement', '_status', 'updatedAt'],
  },
  access: {
    read: publicOrEditor,
    create: editorOnly,
    update: editorOnly,
    delete: editorOnly,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateStore('banners')],
    afterDelete: [revalidateStoreDelete('banners')],
  },
  fields: [
    {
      name: 'placement',
      label: 'Área',
      type: 'select',
      required: true,
      options: [
        { label: 'Hero principal', value: 'hero' },
        { label: 'Banner promocional', value: 'campaign' },
        { label: 'Banner institucional', value: 'institutional' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'desktopImage',
      label: 'Imagem desktop',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mobileImage',
      label: 'Imagem mobile',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'eyebrow', label: 'Sobrelinha', type: 'text' },
    { name: 'title', label: 'Título', type: 'text', required: true },
    { name: 'description', label: 'Descrição', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'buttonLabel', label: 'Texto do botão', type: 'text' },
        { name: 'link', label: 'Destino do botão', type: 'text' },
      ],
    },
  ],
}
