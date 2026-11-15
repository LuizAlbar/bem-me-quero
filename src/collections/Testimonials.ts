import type { CollectionConfig } from 'payload'
import { editorOnly, publicOrEditor } from '@/access/publicOrEditor'
import { revalidateStore, revalidateStoreDelete } from '@/hooks/revalidateStore'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Depoimento', plural: 'Depoimentos' },
  admin: {
    group: 'Conteúdo',
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'order', '_status'],
    description: 'Publique somente depoimentos reais e autorizados.',
  },
  access: {
    read: publicOrEditor,
    create: editorOnly,
    update: editorOnly,
    delete: editorOnly,
  },
  versions: { drafts: true },
  hooks: {
    afterChange: [revalidateStore('testimonials')],
    afterDelete: [revalidateStoreDelete('testimonials')],
  },
  fields: [
    { name: 'displayName', label: 'Nome autorizado', type: 'text', required: true },
    { name: 'text', label: 'Depoimento', type: 'textarea', required: true },
    {
      name: 'rating',
      label: 'Avaliação opcional',
      type: 'number',
      min: 1,
      max: 5,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      label: 'Ordem',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
