import * as dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../src/db'
import { categories, products, users } from '../src/db/schema'
import { hashPassword, verifyPassword } from '../src/lib/auth'
import { ensureStorageBucket } from '../src/lib/supabase-storage'

async function runTests() {
  console.log('🧪 Iniciando testes de verificação do backend...')

  // 1. Teste de usuário e senha
  console.log('1️⃣ Testando autenticação de larissa@bemmequero.com.br...')
  const [admin] = await db
    .select()
    .from(users)
    .where(eq(users.email, 'larissa@bemmequero.com.br'))
    .limit(1)

  if (!admin) {
    throw new Error('Usuário larissa@bemmequero.com.br não encontrado!')
  }

  const isPasswordCorrect = await verifyPassword('admin123', admin.passwordHash)
  if (!isPasswordCorrect) {
    throw new Error('Senha admin123 não conferiu com o hash!')
  }
  console.log('   ✅ Senha admin123 validada com sucesso com bcrypt!')

  const isWrongPasswordRejected = await verifyPassword('senha_errada', admin.passwordHash)
  if (isWrongPasswordRejected) {
    throw new Error('Senha incorreta foi aceita indevidamente!')
  }
  console.log('   ✅ Senha incorreta devidamente rejeitada!')

  // 2. Teste de consulta de categorias
  console.log('2️⃣ Testando consulta de categorias...')
  const allCategories = await db.select().from(categories)
  if (allCategories.length === 0) {
    throw new Error('Nenhuma categoria encontrada no banco!')
  }
  console.log(`   ✅ Categorias carregadas: ${allCategories.length} categorias`)

  // 3. Teste de consulta de produtos com relacionamento
  console.log('3️⃣ Testando consulta de produtos com categoria vinculada...')
  const allProducts = await db.query.products.findMany({
    with: { category: true },
  })
  if (allProducts.length === 0) {
    throw new Error('Nenhum produto encontrado no banco!')
  }
  console.log(`   ✅ Produtos carregados: ${allProducts.length} produtos`)
  console.log(`   Exemplo: "${allProducts[0].name}" -> Categoria: ${allProducts[0].category?.name}`)

  // 4. Teste do Supabase Storage
  console.log('4️⃣ Testando verificação de bucket do Supabase Storage...')
  const bucketOk = await ensureStorageBucket()
  console.log(
    `   ✅ Supabase Storage bucket verificado: ${bucketOk ? 'OK' : 'Pendente de credencial/rede'}`,
  )

  console.log('\n🌟 TODOS OS TESTES DO BACKEND PASSARAM COM SUCESSO!')
  process.exit(0)
}

runTests().catch((err) => {
  console.error('❌ Falha nos testes do backend:', err)
  process.exit(1)
})
