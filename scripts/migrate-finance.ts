import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import postgres from 'postgres'

const url = process.env.DIRECT_URL || process.env.DATABASE_URL
if (!url) throw new Error('Configure DIRECT_URL ou DATABASE_URL.')
const client = postgres(url, { prepare: false, max: 1 })
try {
  const migration = await readFile(
    new URL('../drizzle/0001_financial_entries.sql', import.meta.url),
    'utf8',
  )
  await client.begin(async (transaction) => {
    await transaction`select pg_advisory_xact_lock(hashtext('bmq-financial-migration'))`
    await transaction.unsafe(migration)
  })
  console.log('Migração financeira aplicada. Registros existentes preservados.')
} finally {
  await client.end()
}
