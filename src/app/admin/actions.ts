'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { categories, products, users } from '@/db/schema'
import { createSession, destroySession, verifyPassword, verifySession } from '@/lib/auth'
import { compressAndUploadImage } from '@/lib/supabase-storage'
import { updatePrimaryImage } from '@/lib/product-images'

/* =========================================================
   AUTH ACTIONS
   ========================================================= */

export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get('email') || '')
    .trim()
    .toLowerCase()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return { error: 'Informe o e-mail e a senha para continuar.' }
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

    if (!user || user.role !== 'admin') {
      return { error: 'E-mail ou senha incorretos.' }
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return { error: 'E-mail ou senha incorretos.' }
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return { error: 'Erro ao autenticar. Verifique sua conexão com o banco.' }
  }

  redirect('/admin')
}

export async function logoutAction() {
  await destroySession()
  redirect('/admin/login')
}

/* =========================================================
   STORAGE / UPLOAD ACTION (Comprime WebP e envia ao Supabase)
   ========================================================= */

export async function uploadImageAction(formData: FormData): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  const session = await verifySession()
  if (!session) return { success: false, error: 'Acesso não autorizado.' }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) {
    return { success: false, error: 'Nenhum arquivo enviado.' }
  }

  // Validação de tipo MIME
  if (!file.type.startsWith('image/')) {
    return { success: false, error: 'O arquivo enviado não é uma imagem válida.' }
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const result = await compressAndUploadImage(buffer, file.name)

    return { success: true, url: result.url }
  } catch (error) {
    console.error('Erro no upload de imagem:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Falha ao processar e salvar imagem.',
    }
  }
}

/* =========================================================
   CATEGORY ACTIONS
   ========================================================= */

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function createCategoryAction(formData: FormData) {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  const name = String(formData.get('name') || '').trim()
  const customSlug = String(formData.get('slug') || '').trim()
  const slug = customSlug ? slugify(customSlug) : slugify(name)
  const description = String(formData.get('description') || '').trim() || null
  const imageUrl = String(formData.get('imageUrl') || '').trim() || null
  const order = Number(formData.get('order') || 0)

  if (!name || !slug) {
    return { error: 'O nome da categoria é obrigatório.' }
  }

  try {
    await db.insert(categories).values({
      name,
      slug,
      description,
      imageUrl,
      order,
      visible: true,
    })

    revalidatePath('/')
    revalidatePath('/produtos')
    revalidatePath('/admin/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return { error: 'Não foi possível criar a categoria. O slug já pode estar em uso.' }
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  const name = String(formData.get('name') || '').trim()
  const customSlug = String(formData.get('slug') || '').trim()
  const slug = customSlug ? slugify(customSlug) : slugify(name)
  const description = String(formData.get('description') || '').trim() || null
  const imageUrl = String(formData.get('imageUrl') || '').trim() || null
  const order = Number(formData.get('order') || 0)

  if (!name || !slug) {
    return { error: 'O nome e o slug são obrigatórios.' }
  }

  try {
    await db
      .update(categories)
      .set({
        name,
        slug,
        description,
        imageUrl,
        order,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))

    revalidatePath('/')
    revalidatePath('/produtos')
    revalidatePath('/admin/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error)
    return { error: 'Erro ao atualizar categoria.' }
  }
}

export async function deleteCategoryAction(id: string) {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  try {
    await db.delete(categories).where(eq(categories.id, id))

    revalidatePath('/')
    revalidatePath('/produtos')
    revalidatePath('/admin/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return { error: 'Erro ao excluir categoria. Verifique se há produtos vinculados.' }
  }
}

/* =========================================================
   PRODUCT ACTIONS
   ========================================================= */

export async function createProductAction(formData: FormData) {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  const name = String(formData.get('name') || '').trim()
  const customSlug = String(formData.get('slug') || '').trim()
  const slug = customSlug ? slugify(customSlug) : slugify(name)
  const description = String(formData.get('description') || '').trim()
  const price = String(formData.get('price') || '0').replace(',', '.')
  const salePriceRaw = String(formData.get('salePrice') || '')
    .replace(',', '.')
    .trim()
  const salePrice = salePriceRaw ? salePriceRaw : null
  const categoryId = String(formData.get('categoryId') || '').trim() || null
  const availability = String(formData.get('availability') || 'available')
  const featured = formData.get('featured') === 'true'
  const badge = String(formData.get('badge') || 'none')
  const imageUrl = String(formData.get('imageUrl') || '').trim()
  const details = String(formData.get('details') || '').trim() || null
  const usage = String(formData.get('usage') || '').trim() || null

  if (!name || !slug || !description || !price) {
    return { error: 'Preencha os campos obrigatórios (Nome, Descrição e Preço).' }
  }

  const images = imageUrl ? [{ id: `img-${Date.now()}`, url: imageUrl, alt: name }] : []

  try {
    await db.insert(products).values({
      name,
      slug,
      description,
      price,
      salePrice,
      categoryId,
      images,
      availability,
      featured,
      badge,
      details,
      usage,
    })

    revalidatePath('/')
    revalidatePath('/produtos')
    revalidatePath(`/produto/${slug}`)
    revalidatePath('/admin/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return { error: 'Erro ao criar produto. O slug já pode estar em uso.' }
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  const name = String(formData.get('name') || '').trim()
  const customSlug = String(formData.get('slug') || '').trim()
  const slug = customSlug ? slugify(customSlug) : slugify(name)
  const description = String(formData.get('description') || '').trim()
  const price = String(formData.get('price') || '0').replace(',', '.')
  const salePriceRaw = String(formData.get('salePrice') || '')
    .replace(',', '.')
    .trim()
  const salePrice = salePriceRaw ? salePriceRaw : null
  const categoryId = String(formData.get('categoryId') || '').trim() || null
  const availability = String(formData.get('availability') || 'available')
  const featured = formData.get('featured') === 'true'
  const badge = String(formData.get('badge') || 'none')
  const imageUrl = String(formData.get('imageUrl') || '').trim()
  const details = String(formData.get('details') || '').trim() || null
  const usage = String(formData.get('usage') || '').trim() || null

  if (!name || !slug || !description || !price) {
    return { error: 'Preencha os campos obrigatórios (Nome, Descrição e Preço).' }
  }

  try {
    const existing = await db.query.products.findFirst({
      where: eq(products.id, id),
    })

    if (!existing) return { error: 'Produto não encontrado. Atualize a página e tente novamente.' }
    const images = updatePrimaryImage(existing.images, imageUrl, name)

    await db
      .update(products)
      .set({
        name,
        slug,
        description,
        price,
        salePrice,
        categoryId,
        images,
        availability,
        featured,
        badge,
        details,
        usage,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))

    revalidatePath('/')
    revalidatePath('/produtos')
    revalidatePath(`/produto/${slug}`)
    revalidatePath('/admin/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return { error: 'Erro ao atualizar produto.' }
  }
}

export async function deleteProductAction(id: string) {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  try {
    await db.delete(products).where(eq(products.id, id))

    revalidatePath('/')
    revalidatePath('/produtos')
    revalidatePath('/admin/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return { error: 'Erro ao excluir produto.' }
  }
}

export async function toggleProductFeaturedAction(id: string, currentFeatured: boolean) {
  const session = await verifySession()
  if (!session) redirect('/admin/login')

  try {
    await db
      .update(products)
      .set({ featured: !currentFeatured, updatedAt: new Date() })
      .where(eq(products.id, id))

    revalidatePath('/')
    revalidatePath('/produtos')
    revalidatePath('/admin/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao alternar destaque do produto:', error)
    return { error: 'Erro ao atualizar destaque.' }
  }
}
