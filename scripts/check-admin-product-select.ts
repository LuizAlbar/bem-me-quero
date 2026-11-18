import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { db } from '../src/db'
import { products } from '../src/db/schema'

// Requires agent-browser and an authenticated admin session. Never submits the form.
const session = process.env.BMQ_BROWSER_SESSION || 'bmq-select-check'
const origin = process.env.BMQ_TEST_ORIGIN || 'http://localhost:3000'
const nativeControl = process.argv.includes('--native-control')
const directory = 'tasks/evidence/admin-select'
const select = 'dialog select[name=productId]'
const ab = (...args: string[]) =>
  execFileSync('agent-browser', ['--session', session, ...args], {
    encoding: 'utf8',
    timeout: 35000,
  }).trim()
const evaluate = <T>(code: string): T => JSON.parse(ab('eval', code))
const activate = (selector: string) => {
  ab('focus', selector)
  ab('press', 'Enter')
}

try {
  const catalog = await db
    .select({ id: products.id, categoryId: products.categoryId })
    .from(products)
  const results = []
  mkdirSync(directory, { recursive: true })
  for (const width of [320, 390, 768, 1024, 1440]) {
    ab('set', 'viewport', String(width), '900')
    ab('open', `${origin}/admin/financeiro`)
    assert.equal(
      evaluate('location.pathname'),
      '/admin/financeiro',
      `Autentique a sessão ${session} no admin antes de executar.`,
    )
    activate('section[aria-labelledby=ledger-title] button.button-primary')
    ab('wait', 'dialog[open]')
    if (nativeControl)
      evaluate(
        `(() => {const style=document.createElement('style');style.textContent='${select}, ${select}::picker(select) { appearance: auto !important; }';document.head.append(style);return true})()`,
      )
    const values = evaluate<string[]>(
      `[...document.querySelector(${JSON.stringify(select)}).options].map(option=>option.value).filter(Boolean)`,
    )
    assert.ok(values.length, 'Cadastre ao menos um produto para conferir a seleção real.')
    const target =
      values
        .map((id) => catalog.find((product) => product.id === id))
        .find((product) => product?.categoryId) ||
      catalog.find((product) => product.id === values[0])!
    for (const kind of ['income', 'expense']) {
      ab('select', 'dialog select[name=kind]', kind)
      // Two separate ordinary clicks: open, release, then click the option. No drag/select API.
      ab('click', select)
      ab('wait', 'select:open')
      if (width === 320 || width === 1440)
        ab('screenshot', `${directory}/options-${kind}-${width}.png`)
      if (!nativeControl)
        evaluate(
          `document.querySelector(${JSON.stringify(`${select} option[value="${target.id}"]`)}).scrollIntoView({block:'nearest',behavior:'instant'})`,
        )
      ab('click', `${select} option[value="${target.id}"]`)
      ab(
        'wait',
        '--fn',
        `document.querySelector(${JSON.stringify(select)}).value === ${JSON.stringify(target.id)}`,
      )
      assert.equal(
        evaluate('document.querySelector("dialog select[name=categoryId]").value'),
        target.categoryId || '',
      )
      assert.equal(evaluate('document.querySelector("dialog input[name=title]").required'), false)
      assert.equal(
        evaluate('new FormData(document.querySelector("dialog form")).get("productId")'),
        target.id,
      )
      assert.equal(evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
    }
    // Select the last item with keyboard, close only the picker with Escape, then clear by click.
    ab('focus', select)
    ab('press', 'Space')
    ab('wait', 'select:open')
    ab('press', 'End')
    ab('press', 'Enter')
    assert.equal(evaluate(`document.querySelector(${JSON.stringify(select)}).value`), values.at(-1))
    ab('press', 'Space')
    ab('wait', 'select:open')
    ab('press', 'Escape')
    assert.equal(
      evaluate(
        '!!document.querySelector("dialog[open]") && !document.querySelector("select:open")',
      ),
      true,
    )
    ab('click', select)
    evaluate(
      `document.querySelector(${JSON.stringify(`${select} option[value=""]`)}).scrollIntoView({block:'nearest',behavior:'instant'})`,
    )
    ab('click', `${select} option[value=""]`)
    ab('wait', '--fn', `document.querySelector(${JSON.stringify(select)}).value === ''`)
    assert.equal(evaluate('document.querySelector("dialog input[name=title]").required'), true)
    const picker = evaluate<{ width: number; height: number; optionHeight: number }>(
      `(() => {const e=document.querySelector(${JSON.stringify(select)});return {width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,optionHeight:e.options[0].getBoundingClientRect().height}})()`,
    )
    assert.ok(picker.height >= 44)
    ab('press', 'Escape')
    ab('wait', '--fn', '!document.querySelector("dialog[open]")')
    results.push({
      width,
      clickReleaseClick: true,
      kinds: ['income', 'expense'],
      categoryAndFormData: true,
      keyboardEndEnter: true,
      escapePreservesDialog: true,
      clearSelection: true,
      pageOverflow: false,
      controlHeight: picker.height,
    })
    console.log(`Produto ${width}px: clique, categoria, FormData, teclado e Escape aprovados.`)
  }
  writeFileSync(`${directory}/regression.json`, JSON.stringify(results, null, 2) + '\n')
} finally {
  await globalThis.__dbClient?.end()
}
