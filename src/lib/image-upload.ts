export const MAX_IMAGE_BYTES = 8 * 1024 * 1024
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export function validateImageUpload(file: { size: number; type: string }): string | null {
  if (!Number.isFinite(file.size) || file.size <= 0) return 'Selecione uma imagem válida.'
  if (file.size > MAX_IMAGE_BYTES) return 'A imagem deve ter no máximo 8 MB.'
  if (!IMAGE_TYPES.includes(file.type)) return 'Use uma imagem JPG, PNG, WebP ou AVIF.'
  return null
}

export function isSafeImageSource(value: string): boolean {
  if (/[\\\u0000-\u001f]/.test(value)) return false
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}
