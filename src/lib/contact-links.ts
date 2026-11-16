export function getWhatsAppUrl(phone?: string | null, message?: string): string | null {
  const digits = phone?.replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}
