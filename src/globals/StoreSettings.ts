import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  label: 'Configurações da loja',
  admin: { group: 'Configurações' },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateTag('store-settings', 'max')
        revalidateTag('storefront', 'max')
        return doc
      },
    ],
  },
  fields: [
    { name: 'storeName', label: 'Nome da loja', type: 'text', required: true },
    { name: 'logo', label: 'Logotipo oficial', type: 'upload', relationTo: 'media' },
    { name: 'instagram', label: 'Instagram', type: 'text' },
    { name: 'whatsapp', label: 'WhatsApp', type: 'text' },
    { name: 'shortText', label: 'Texto institucional curto', type: 'textarea' },
    { name: 'contactMessage', label: 'Mensagem padrão de contato', type: 'textarea' },
    {
      name: 'benefits',
      label: 'Benefícios',
      type: 'group',
      fields: [
        { name: 'shippingTitle', label: 'Título — entrega', type: 'text' },
        { name: 'shippingText', label: 'Texto — entrega', type: 'text' },
        { name: 'supportTitle', label: 'Título — atendimento', type: 'text' },
        { name: 'supportText', label: 'Texto — atendimento', type: 'text' },
        { name: 'paymentTitle', label: 'Título — pagamento', type: 'text' },
        { name: 'paymentText', label: 'Texto — pagamento', type: 'text' },
      ],
    },
    {
      name: 'usefulLinks',
      label: 'Links úteis',
      type: 'array',
      fields: [
        { name: 'label', label: 'Rótulo', type: 'text', required: true },
        { name: 'url', label: 'URL', type: 'text', required: true },
      ],
    },
  ],
}
