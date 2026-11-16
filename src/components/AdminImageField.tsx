'use client'

import Image from 'next/image'
import { useId, type ChangeEvent } from 'react'
import { Loader2, Upload } from 'lucide-react'

export function AdminImageField({
  value,
  onChange,
  onUpload,
  uploading,
  disabled,
  category = false,
}: {
  value: string
  onChange: (value: string) => void
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  uploading: boolean
  disabled: boolean
  category?: boolean
}) {
  const id = useId()
  let preview: string | null = null
  try {
    if (new URL(value).protocol === 'https:') preview = value
  } catch {
    if (value.startsWith('/') && !value.startsWith('//')) preview = value
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-semibold text-ink">
        {category ? 'Imagem da categoria' : 'Foto principal do produto'}
      </label>
      <input
        id={id}
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Cole a URL da imagem"
        className="form-control"
      />
      <label className="flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-xl border border-border px-3 text-sm text-brand focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
        {uploading ? (
          <Loader2 size={16} className="animate-spin motion-reduce:animate-none" />
        ) : (
          <Upload size={16} />
        )}
        {uploading ? 'Enviando imagem...' : 'Selecionar imagem'}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onUpload}
          disabled={disabled}
        />
      </label>
      {category && (
        <p className="text-xs text-muted">Prefira uma foto quadrada com o produto centralizado.</p>
      )}
      {preview && (
        <div className="rounded-xl bg-surface p-3">
          <Image
            src={preview}
            alt={category ? 'Prévia da categoria' : 'Prévia do produto'}
            width={360}
            height={240}
            className="mx-auto h-36 w-full object-contain"
          />
        </div>
      )}
    </div>
  )
}
