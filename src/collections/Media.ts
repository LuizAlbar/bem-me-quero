import type { CollectionConfig } from 'payload'

import { createFolderField, createTagField } from 'payload'
import { revalidateTag } from 'next/cache'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        for (const tag of ['storefront', 'products', 'categories', 'banners', 'store-settings']) {
          revalidateTag(tag, 'max')
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        for (const tag of ['storefront', 'products', 'categories', 'banners', 'store-settings']) {
          revalidateTag(tag, 'max')
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  upload: {
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
      return headers
    },
  },
}
