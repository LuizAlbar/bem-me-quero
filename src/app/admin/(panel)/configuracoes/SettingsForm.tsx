'use client'

import type { FormEvent } from 'react'
import { AdminFeedback } from '@/components/AdminFeedback'
import { useAdminFeedback } from '@/lib/use-admin-feedback'
import { getInstagramHandle } from '@/lib/contact-links'
import type { StoreSocialSettings } from '@/lib/store-settings-input'
import { updateStoreContactsAction } from './actions'

export function SettingsForm({ settings }: { settings: StoreSocialSettings }) {
  const { pending, error, message, run, reset } = useAdminFeedback()
  const instagramHandle = getInstagramHandle(settings.instagram)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    await run(() => updateStoreContactsAction(data), 'Configurações salvas.')
  }

  return (
    <form onSubmit={handleSubmit} onChange={reset} className="space-y-5" aria-busy={pending}>
      <fieldset
        disabled={pending}
        className="min-w-0 space-y-5 rounded-2xl border border-border bg-white p-5 sm:p-6"
      >
        <legend className="sr-only">Contatos da loja</legend>
        <h2 className="font-editorial text-2xl text-ink">Contatos da loja</h2>
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-semibold text-ink">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={64}
            defaultValue={settings.whatsapp || ''}
            aria-describedby="whatsapp-hint"
            className="form-control mt-2"
          />
          <p id="whatsapp-hint" className="mt-2 text-xs leading-5 text-muted">
            Inclua o código do país e o DDD.
          </p>
        </div>
        <div>
          <label htmlFor="instagram" className="block text-sm font-semibold text-ink">
            Instagram
          </label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={200}
            defaultValue={instagramHandle ? `@${instagramHandle}` : settings.instagram || ''}
            aria-describedby="instagram-hint"
            className="form-control mt-2"
          />
          <p id="instagram-hint" className="mt-2 text-xs leading-5 text-muted">
            Nome de usuário, @usuário ou link do perfil.
          </p>
        </div>
        <p className="text-xs leading-5 text-muted">
          Deixe um campo vazio para ocultar esse contato na loja.
        </p>
      </fieldset>
      <AdminFeedback error={error} message={message} />
      <button type="submit" disabled={pending} className="button-primary w-full sm:w-fit">
        {pending ? 'Salvando...' : 'Salvar configurações'}
      </button>
    </form>
  )
}
