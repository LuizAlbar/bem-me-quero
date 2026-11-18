export type FinanceKind = 'income' | 'expense'
export type ParseResult<T> = { success: true; data: T } | { success: false; error: string }
export type FinanceEntryInput = {
  kind: FinanceKind
  title: string
  amountCents: number
  occurredOn: string
  productId: string | null
  categoryId: string | null
}
export type FinanceFilters = {
  from: string
  to: string
  category: string
  product: string
  kind: '' | FinanceKind
  page: number
}
export type FinanceSearchParams = Record<string, string | string[] | undefined>
export type FinanceOption = { id: string; name: string }
export type FinanceProductOption = FinanceOption & { categoryId: string | null }

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

export function parseAmountCents(value: string): number | null {
  const trimmed = value.trim()
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(trimmed)) return null
  // Dots without a decimal comma are ambiguous (1.234 vs 1.23).
  if (trimmed.includes('.') && !trimmed.includes(',')) return null
  const [whole, fraction = ''] = trimmed.replaceAll('.', '').split(',')
  if (whole.length > 10) return null
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  return Number.isSafeInteger(cents) && cents > 0 && cents <= 999999999 ? cents : null
}

export function formatCents(cents: string | number | bigint) {
  const value = BigInt(cents)
  const absolute = value < 0n ? -value : value
  return `${value < 0n ? '-' : ''}R$\u00a0${(absolute / 100n).toLocaleString('pt-BR')},${String(absolute % 100n).padStart(2, '0')}`
}

export function isCivilDate(value: string) {
  if (!/^[1-9]\d{3}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function getBusinessDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const part = (type: string) => parts.find((item) => item.type === type)?.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function formatCivilDate(value: string) {
  return value.split('-').reverse().join('/')
}

export function parseFinanceEntry(form: FormData): ParseResult<FinanceEntryInput> {
  const fields = ['kind', 'title', 'amount', 'occurredOn', 'productId', 'categoryId'] as const
  if (fields.some((key) => typeof form.get(key) !== 'string'))
    return { success: false, error: 'Preencha os dados do lançamento.' }
  const read = (key: string) => String(form.get(key)).trim()
  const kind = read('kind')
  if (kind !== 'income' && kind !== 'expense')
    return { success: false, error: 'Selecione entrada ou saída.' }
  const amountCents = parseAmountCents(read('amount'))
  if (amountCents === null)
    return {
      success: false,
      error: 'Informe um valor entre R$ 0,01 e R$ 9.999.999,99, usando vírgula para os centavos.',
    }
  const occurredOn = read('occurredOn')
  if (!isCivilDate(occurredOn)) return { success: false, error: 'Informe uma data válida.' }
  const productId = read('productId') || null
  const categoryId = read('categoryId') || null
  if ((productId && !isUuid(productId)) || (categoryId && !isUuid(categoryId)))
    return { success: false, error: 'Produto ou categoria inválidos.' }
  const title = read('title')
  if ((!title && !productId) || title.length > 200)
    return {
      success: false,
      error: 'Informe um título com até 200 caracteres ou selecione um produto.',
    }
  return { success: true, data: { kind, title, amountCents, occurredOn, productId, categoryId } }
}

export function parseFinanceFilters(
  params: FinanceSearchParams,
  today = getBusinessDate(),
): ParseResult<FinanceFilters> {
  const keys = ['from', 'to', 'category', 'product', 'kind', 'page'] as const
  if (keys.some((key) => Array.isArray(params[key])))
    return { success: false, error: 'Filtros duplicados. Selecione uma única opção por campo.' }
  const read = (key: string) => (typeof params[key] === 'string' ? params[key] : '')
  const defaultPeriod = params.from === undefined && params.to === undefined
  const year = Number(today.slice(0, 4))
  const month = Number(today.slice(5, 7))
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const from = defaultPeriod ? `${today.slice(0, 7)}-01` : read('from')
  const to = defaultPeriod ? `${today.slice(0, 7)}-${lastDay}` : read('to')
  if ((from && !isCivilDate(from)) || (to && !isCivilDate(to)) || (from && to && from > to))
    return {
      success: false,
      error: 'Revise o período: use datas válidas e início anterior ou igual ao fim.',
    }
  const category = read('category')
  const product = read('product')
  const kind = read('kind')
  if ((category && category !== 'none' && !isUuid(category)) || (product && !isUuid(product)))
    return { success: false, error: 'Categoria, produto ou tipo de lançamento inválido.' }
  if (kind !== '' && kind !== 'income' && kind !== 'expense')
    return { success: false, error: 'Tipo de lançamento inválido.' }
  const pageString = read('page') || '1'
  if (!/^\d{1,6}$/.test(pageString) || Number(pageString) < 1 || Number(pageString) > 100000)
    return { success: false, error: 'Página inválida.' }
  return { success: true, data: { from, to, category, product, kind, page: Number(pageString) } }
}

export function financeQuery(filters: FinanceFilters, page = 1) {
  return new URLSearchParams({
    from: filters.from,
    to: filters.to,
    category: filters.category,
    product: filters.product,
    kind: filters.kind,
    page: String(page),
  }).toString()
}
