import { getInstagramUrl } from './contact-links'

export type StoreSocialSettings = { whatsapp: string | null; instagram: string | null }

type SettingsInputResult =
  | { success: true; data: StoreSocialSettings }
  | { success: false; error: string }

export function parseStoreSocialSettings(
  whatsapp: unknown,
  instagram: unknown,
): SettingsInputResult {
  if (typeof whatsapp !== 'string' || typeof instagram !== 'string') {
    return { success: false, error: 'Envie o WhatsApp e o Instagram como texto.' }
  }
  if (whatsapp.length > 64 || instagram.length > 200) {
    return { success: false, error: 'Os contatos informados excedem o tamanho permitido.' }
  }

  const phone = whatsapp.trim()
  const digits = phone.replace(/\D/g, '')
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || !/^[1-9]\d{7,14}$/.test(digits))) {
    return {
      success: false,
      error: 'Informe o WhatsApp com código do país e DDD, usando de 8 a 15 dígitos.',
    }
  }

  const profile = getInstagramUrl(instagram)
  if (instagram.trim() && !profile) {
    return { success: false, error: 'Informe um usuário ou link de perfil válido do Instagram.' }
  }

  return { success: true, data: { whatsapp: phone ? digits : null, instagram: profile } }
}
