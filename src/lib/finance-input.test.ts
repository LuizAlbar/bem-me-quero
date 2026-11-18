import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  formatCents,
  parseAmountCents,
  parseFinanceEntry,
  parseFinanceFilters,
  isCivilDate,
  getBusinessDate,
} from './finance-input'

const productId = '52be5f7b-8910-44b3-b365-2b8c37b8e370'
function entry(overrides: Record<string, string> = {}) {
  const data = new FormData()
  for (const [key, value] of Object.entries({
    kind: 'income',
    title: 'Venda avulsa',
    amount: '19,90',
    occurredOn: '2026-11-17',
    productId: '',
    categoryId: '',
    ...overrides,
  }))
    data.set(key, value)
  return parseFinanceEntry(data)
}

test('converte valores brasileiros em centavos sem arredondamento de ponto flutuante', () => {
  assert.equal(parseAmountCents('1.234,56'), 123456)
  assert.equal(parseAmountCents('0,29'), 29)
  assert.equal(parseAmountCents('12'), 1200)
  assert.equal(parseAmountCents('9999999,99'), 999999999)
})
test('rejeita valores ambíguos, negativos, frações de centavo e acima do limite', () => {
  for (const input of [
    '',
    '0',
    '-1',
    '1.234',
    '1.00',
    '12,345',
    '1e3',
    'NaN',
    '10.00,20',
    '10000000',
    'R$ 20',
  ])
    assert.equal(parseAmountCents(input), null, input)
})
test('formata totais grandes e negativos preservando os centavos', () => {
  assert.equal(formatCents('900719925474099129'), 'R$ 9.007.199.254.740.991,29')
  assert.equal(formatCents('-29'), '-R$ 0,29')
})
test('valida datas civis reais e ano bissexto', () => {
  assert.equal(isCivilDate('2024-02-29'), true)
  for (const day of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-1-01', '0000-01-01'])
    assert.equal(isCivilDate(day), false)
})
test('usa a data de São Paulo mesmo quando UTC já mudou de dia', () => {
  assert.equal(getBusinessDate(new Date('2026-12-01T01:00:00Z')), '2026-11-30')
})
test('aceita gasto nomeado e entrada vinculada a produto sem título manual', () => {
  assert.equal(entry({ kind: 'expense', title: '  Embalagens  ' }).success, true)
  const linked = entry({ productId, title: '' })
  assert.equal(linked.success, true)
  if (linked.success) assert.equal(linked.data.productId, productId)
  assert.equal(entry({ title: '' }).success, false)
})
test('valida enum, data, título, valor e relações antes de persistir', () => {
  const badEntries: Record<string, string>[] = [
    { kind: 'profit' },
    { occurredOn: '2026-02-30' },
    { amount: '0,00' },
    { productId: 'wrong' },
    { categoryId: 'wrong' },
    { title: 'a'.repeat(201) },
  ]
  for (const bad of badEntries) assert.equal(entry(bad).success, false)
})
test('filtros padrão cobrem o mês civil completo, incluindo dezembro e fevereiro', () => {
  const december = parseFinanceFilters({}, '2026-12-10')
  assert.deepEqual(december.success && [december.data.from, december.data.to], [
    '2026-12-01',
    '2026-12-31',
  ])
  const february = parseFinanceFilters({}, '2024-02-10')
  assert.equal(february.success && february.data.to, '2024-02-29')
})
test('aceita período aberto e filtros por categoria, produto e tipo', () => {
  const parsed = parseFinanceFilters({
    from: '',
    to: '',
    category: 'none',
    product: productId,
    kind: 'expense',
    page: '2',
  })
  assert.equal(parsed.success, true)
  if (parsed.success)
    assert.deepEqual(parsed.data, {
      from: '',
      to: '',
      category: 'none',
      product: productId,
      kind: 'expense',
      page: 2,
    })
})
test('não troca silenciosamente filtros inválidos por indicadores de outro período', () => {
  for (const params of [
    { from: '2026-12-01', to: '2026-11-01' },
    { from: '2026-02-30' },
    { category: "' OR 1=1" },
    { kind: 'foo' },
    { page: '-1' },
    { page: '1e2' },
    { from: ['2026-01-01', '2026-12-01'] },
  ])
    assert.equal(parseFinanceFilters(params).success, false)
})
