import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  isDemonstrationProduct,
  isReferenceImage,
  isDemonstrationTestimonial,
  getReviewedBenefits,
} from './content-review'

const reference = {
  id: 'img-mascara-1',
  url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
}

test('withholds unchanged demonstration products without deleting their records', () => {
  assert.equal(
    isDemonstrationProduct({
      slug: 'mascara-cilios-volume-alongamento-intenso',
      images: [reference],
    }),
    true,
  )
  assert.equal(
    isDemonstrationProduct({
      slug: 'mascara-cilios-volume-alongamento-intenso',
      images: [{ id: 'real', url: '/uploads/mascara.jpg' }, reference],
    }),
    false,
  )
  assert.equal(isDemonstrationProduct({ slug: 'produto-cadastrado-pela-loja', images: [] }), false)
})

test('recognizes only known sample photography and preserves store uploads', () => {
  assert.equal(isReferenceImage(reference.url), true)
  assert.equal(isReferenceImage('https://store.test/real-product.jpg'), false)
  assert.equal(isReferenceImage('/assets/categories/lips.png'), false)
})

test('does not publish seeded testimonials or unconfirmed commercial promises', () => {
  assert.equal(
    isDemonstrationTestimonial({
      displayName: 'Camila Rocha',
      text: 'Amei o gloss e o batom matte! As cores são ainda mais lindas pessoalmente e não ressecam nada a boca. O atendimento no WhatsApp foi impecável!',
    }),
    true,
  )
  assert.equal(
    isDemonstrationTestimonial({
      displayName: 'Camila Rocha',
      text: 'Depoimento atualizado pela loja.',
    }),
    false,
  )
  const result = getReviewedBenefits({
    shippingTitle: 'Frete facilitado',
    shippingText: 'Entrega rápida e segura para todo o Brasil.',
    paymentTitle: 'Pagamento flexível',
    paymentText: 'Pague via Pix ou parcele suas compras no cartão de crédito.',
    supportTitle: 'Atendimento com carinho',
    supportText: 'Tire suas dúvidas e faça seu pedido direto pelo WhatsApp.',
  })
  assert.equal(result?.shippingText, undefined)
  assert.equal(result?.paymentText, undefined)
  assert.equal(result?.supportTitle, 'Atendimento com carinho')
})
