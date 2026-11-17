import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminFeedback } from '@/components/AdminFeedback'
import { verifySession } from '@/lib/auth'
import { readStoreSettings } from '@/lib/store-settings'
import { SettingsForm } from './SettingsForm'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  if (!(await verifySession())) redirect('/admin/login')

  let settings
  try {
    settings = await readStoreSettings()
  } catch {
    return (
      <div className="max-w-2xl space-y-5">
        <h1 className="font-editorial text-3xl text-ink">Configurações</h1>
        <AdminFeedback error="Não foi possível carregar as configurações da loja." />
        <Link href="/admin/configuracoes" className="button-secondary">
          Tentar novamente
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-editorial text-3xl text-ink">Configurações</h1>
        <p className="mt-1 text-sm leading-6 text-muted">Gerencie os contatos exibidos na loja.</p>
      </div>
      <SettingsForm
        settings={{ whatsapp: settings?.whatsapp ?? null, instagram: settings?.instagram ?? null }}
      />
    </div>
  )
}
