import type { Access } from 'payload'

export const publicOrEditor: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

export const editorOnly: Access = ({ req }) => Boolean(req.user)
