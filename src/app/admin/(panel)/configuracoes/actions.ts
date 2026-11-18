'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { parseStoreSocialSettings } from '@/lib/store-settings-input'
import { saveStoreSocialSettings } from '@/lib/store-settings'

export async function updateStoreContactsAction(formData: FormData) {
  if (!(await verifySession())) redirect('/admin/login')

  const parsed = parseStoreSocialSettings(formData.get('whatsapp'), formData.get('instagram'))
  if (!parsed.success) return { success: false, error: parsed.error }

  try {
    await saveStoreSocialSettings(parsed.data)
  } catch {
    return { success: false, error: 'Não foi possível salvar as configurações. Tente novamente.' }
  }

  revalidatePath('/', 'layout')
  return { success: true, settings: parsed.data }
}
