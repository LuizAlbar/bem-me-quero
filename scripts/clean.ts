import * as dotenv from 'dotenv'
dotenv.config()

import postgres from 'postgres'

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || ''

if (!connectionString) {
  console.error('ERRO: DATABASE_URL ou DIRECT_URL não definida no .env')
  process.exit(1)
}

const sql = postgres(connectionString, { prepare: false })

async function clean() {
  console.log('🧹 Limpando dados do banco...')
  try {
    await sql`DELETE FROM products`
    await sql`DELETE FROM categories`
    await sql`DELETE FROM banners`
    await sql`DELETE FROM testimonials`
    await sql`DELETE FROM store_settings`
    await sql`DELETE FROM users`

    console.log('✅ Banco limpo com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao limpar o banco:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

clean()
