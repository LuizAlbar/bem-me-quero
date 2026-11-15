import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

export const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'bem-me-quero-media'

/**
 * Garante que o bucket público de mídia exista no Supabase Storage.
 */
export async function ensureStorageBucket(): Promise<boolean> {
  if (!supabaseUrl || !supabaseKey) return false

  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const exists = buckets?.some((b) => b.name === BUCKET_NAME)

    if (!exists) {
      await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
      })
    }
    return true
  } catch (err) {
    console.error('Erro ao verificar bucket do Supabase:', err)
    return false
  }
}

/**
 * Comprime a imagem para WebP em alta resolução e envia para o Supabase Storage.
 * Retorna a URL pública da imagem.
 */
export async function compressAndUploadImage(
  inputBuffer: Buffer | Uint8Array,
  originalFilename: string,
): Promise<{ url: string; width: number; height: number; sizeBytes: number }> {
  await ensureStorageBucket()

  // Converte e otimiza para WebP com sharp
  const image = sharp(inputBuffer)
  const metadata = await image.metadata()

  let pipeline = image.rotate() // respeita orientação EXIF

  // Redimensiona mantendo proporção se for maior que 1600px
  if (metadata.width && metadata.width > 1600) {
    pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true })
  }

  const webpBuffer = await pipeline.webp({ quality: 82, effort: 4 }).toBuffer()

  const finalMetadata = await sharp(webpBuffer).metadata()

  const sanitizedBase = originalFilename
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .slice(0, 40)

  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  const path = `produtos/${sanitizedBase}-${timestamp}-${randomSuffix}.webp`

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(path, webpBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 ano de cache
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Falha no upload para o Supabase Storage: ${uploadError.message}`)
  }

  const { data } = supabaseAdmin.storage.from(BUCKET_NAME).getPublicUrl(path)

  return {
    url: data.publicUrl,
    width: finalMetadata.width || 800,
    height: finalMetadata.height || 800,
    sizeBytes: webpBuffer.length,
  }
}
