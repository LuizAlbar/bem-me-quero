import { readFile } from 'node:fs/promises'
import { sql } from 'drizzle-orm'
import { db } from '../src/db'
import { parseStoreSocialSettings } from '../src/lib/store-settings-input'
import { readStoreSettings, saveStoreSocialSettings } from '../src/lib/store-settings'

// Usage: pnpm exec tsx scripts/configure-store-contacts.ts <international-phone> <instagram-profile>
async function main() {
  const parsed = parseStoreSocialSettings(process.argv[2], process.argv[3])
  if (!parsed.success) throw new Error(parsed.error)

  const migration = await readFile(
    new URL('../drizzle/0000_store_social_settings.sql', import.meta.url),
    'utf8',
  )
  await db.execute(sql.raw(migration))
  await saveStoreSocialSettings(parsed.data)
  const saved = await readStoreSettings()
  if (saved?.whatsapp !== parsed.data.whatsapp || saved?.instagram !== parsed.data.instagram) {
    throw new Error('Não foi possível verificar os contatos salvos.')
  }
  console.log('Campos verificados e contatos da loja salvos:', parsed.data)
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : 'Falha ao configurar os contatos da loja.',
    )
    process.exit(1)
  })
