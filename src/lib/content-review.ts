// These exact photographs and records originated in scripts/seed.ts, not store photography.
// Keep the source records editable in the admin; never present them as verified inventory.
const samplePhotoIds = new Set([
  'photo-1586495777744-4413f21062fa',
  'photo-1631214524020-7e18db9a8f92',
  'photo-1591360236480-4ed861025fa1',
  'photo-1512496015851-a90fb38ba796',
  'photo-1522337360788-8b13dee7a37e',
  'photo-1556228720-195a672e8a03',
])
const sampleSlugs = new Set([
  'gloss-labial-hidratante-brilho-espelhado',
  'batom-matte-aveludado-longa-duracao',
  'mascara-cilios-volume-alongamento-intenso',
  'paleta-sombras-neutras-iluminadas',
  'blush-liquido-efeito-natural-pessego',
  'base-liquida-acabamento-natural-glow',
  'serum-facial-hidratante-acido-hialuronico',
  'bruma-fixadora-hidratante-iluminadora',
])

export function isReferenceImage(value?: string | null): boolean {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.hostname === 'images.unsplash.com' && samplePhotoIds.has(url.pathname.slice(1))
  } catch {
    return false
  }
}

export function isDemonstrationProduct(product: {
  slug: string
  images?: Array<{ url?: string | null } | string | number> | null
}): boolean {
  const images = product.images || []
  return (
    sampleSlugs.has(product.slug) &&
    images.length > 0 &&
    images.every((image) => typeof image === 'object' && isReferenceImage(image.url))
  )
}

const sampleTestimonials: Record<string, string> = {
  'Camila Rocha':
    'Amei o gloss e o batom matte! As cores são ainda mais lindas pessoalmente e não ressecam nada a boca. O atendimento no WhatsApp foi impecável!',
  'Juliana Mendes':
    'A base tem uma cobertura linda e leve, exatamente como eu procurava pro meu dia a dia no trabalho. A entrega chegou super bem embalada e com cheirinho gostoso.',
  'Beatriz Silveira':
    'A máscara de cílios e o blush líquido já viraram meus queridinhos oficiais! Duram o dia todo sem borrar. Já recomendei pra todas as minhas amigas.',
}

export function isDemonstrationTestimonial(testimonial: {
  displayName: string
  text: string
}): boolean {
  return sampleTestimonials[testimonial.displayName] === testimonial.text
}

type Benefits = {
  shippingTitle?: string | null
  shippingText?: string | null
  paymentTitle?: string | null
  paymentText?: string | null
  supportTitle?: string | null
  supportText?: string | null
}

export function getReviewedBenefits(benefits?: Benefits | null): Benefits | null {
  if (!benefits) return null
  const reviewed = { ...benefits }
  if (reviewed.shippingText === 'Entrega rápida e segura para todo o Brasil.') {
    delete reviewed.shippingTitle
    delete reviewed.shippingText
  }
  if (reviewed.paymentText === 'Pague via Pix ou parcele suas compras no cartão de crédito.') {
    delete reviewed.paymentTitle
    delete reviewed.paymentText
  }
  return reviewed
}
