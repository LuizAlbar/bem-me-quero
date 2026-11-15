import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const refresh = (tag: string) => {
  revalidateTag(tag, 'max')
}

export const revalidateStore =
  (tag: string): CollectionAfterChangeHook =>
  ({ doc, previousDoc }) => {
    refresh(tag)
    refresh('storefront')

    const currentSlug = typeof doc?.slug === 'string' ? doc.slug : undefined
    const previousSlug = typeof previousDoc?.slug === 'string' ? previousDoc.slug : undefined

    if (currentSlug) refresh(`${tag}:${currentSlug}`)
    if (previousSlug && previousSlug !== currentSlug) refresh(`${tag}:${previousSlug}`)

    return doc
  }

export const revalidateStoreDelete =
  (tag: string): CollectionAfterDeleteHook =>
  ({ doc }) => {
    refresh(tag)
    refresh('storefront')
    if (typeof doc?.slug === 'string') refresh(`${tag}:${doc.slug}`)
    return doc
  }
