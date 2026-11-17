'use client'

import Image from 'next/image'
import { useId, useState, type ChangeEvent } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { isReferenceImage } from '@/lib/content-review'
import { IMAGE_TYPES, isSafeImageSource, validateImageUpload } from '@/lib/image-upload'

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
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void | Promise<void>
  uploading: boolean
  disabled: boolean
  category?: boolean
}) {
  const id = useId()
  const [uploadError, setUploadError] = useState<string | null>(null)
  const preview = isSafeImageSource(value) ? value : null

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-xs font-semibold text-ink">
        {category ? 'Imagem da categoria' : 'Foto principal do produto'}
      </label>
      <input
        id={id}
        type="text"
        inputMode="url"
        value={value}
        onChange={(event) => {
          setUploadError(null)
          onChange(event.target.value)
        }}
        disabled={disabled}
        placeholder="Cole a URL da imagem"
        aria-describedby={`${id}-hint`}
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
          accept={IMAGE_TYPES.join(',')}
          className="sr-only"
          onChange={async (event) => {
            const input = event.currentTarget
            const file = input.files?.[0]
            if (!file) return
            const error = validateImageUpload(file)
            setUploadError(error)
            if (error) input.value = ''
            else {
              try {
                await onUpload(event)
              } finally {
                input.value = ''
              }
            }
          }}
          disabled={disabled}
        />
      </label>
      <p id={`${id}-hint`} className="text-xs leading-5 text-muted">
        JPG, PNG, WebP ou AVIF · até 8 MB.
      </p>
      {uploadError && (
        <p role="alert" className="text-xs text-danger">
          {uploadError}
        </p>
      )}
      {category && (
        <p className="text-xs text-muted">Prefira uma foto quadrada com o produto centralizado.</p>
      )}
      <p className="text-xs leading-5 text-muted">
        Use uma foto nítida do produto, com boa luz e sem cortes na embalagem.
      </p>
      {!category && isReferenceImage(value) && (
        <p role="status" className="rounded-xl bg-blush/50 p-3 text-xs leading-5 text-danger">
          Foto de demonstração. Substitua por uma foto real antes de publicar este produto.
        </p>
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
