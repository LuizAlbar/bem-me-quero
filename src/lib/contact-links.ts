export function getWhatsAppUrl(phone?: string | null, message?: string): string | null {
  const digits = phone?.replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export function getInstagramHandle(profile?: string | null): string | null {
  let username = profile?.trim().replace(/^@/, '')
  if (!username) return null

  if (/^(https?:\/\/|(?:www\.)?instagram\.com\/)/i.test(username)) {
    try {
      const url = new URL(/^https?:\/\//i.test(username) ? username : `https://${username}`)
      if (
        url.protocol !== 'https:' ||
        !['instagram.com', 'www.instagram.com'].includes(url.hostname) ||
        url.username ||
        url.password ||
        url.port
      )
        return null
      username = url.pathname.replace(/^\//, '').replace(/\/$/, '')
    } catch {
      return null
    }
  }

  if (
    !/^[a-zA-Z0-9_](?:[a-zA-Z0-9._]{0,28}[a-zA-Z0-9_])?$/.test(username) ||
    username.includes('..') ||
    ['p', 'reel', 'reels', 'stories', 'explore', 'direct', 'accounts'].includes(
      username.toLowerCase(),
    )
  )
    return null

  return username
}

export function getInstagramUrl(profile?: string | null): string | null {
  const username = getInstagramHandle(profile)
  return username ? `https://www.instagram.com/${username}/` : null
}

type ContactSettings = { whatsapp?: string | null; instagram?: string | null }

// Existing banner/footer contact URLs must follow the contacts saved in the admin.
export function resolveStoreLink(href: string, settings: ContactSettings): string | null {
  try {
    const url = new URL(href)
    if (
      [
        'wa.me',
        'www.wa.me',
        'whatsapp.com',
        'www.whatsapp.com',
        'api.whatsapp.com',
        'web.whatsapp.com',
      ].includes(url.hostname)
    ) {
      return getWhatsAppUrl(settings.whatsapp, url.searchParams.get('text') || undefined)
    }
    if (['instagram.com', 'www.instagram.com'].includes(url.hostname)) {
      return getInstagramUrl(settings.instagram)
    }
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? href : null
  } catch {
    return (href.startsWith('/') && !href.startsWith('//')) || href.startsWith('#') ? href : null
  }
}
