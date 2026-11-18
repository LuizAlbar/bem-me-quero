'use client'

import { useRef, useState, type FormEvent } from 'react'
import { AdminFeedback } from '@/components/AdminFeedback'
import { useAdminFeedback } from '@/lib/use-admin-feedback'
import { getInstagramHandle } from '@/lib/contact-links'
import type { StoreSocialSettings } from '@/lib/store-settings-input'
import { updateStoreContactsAction } from './actions'

export function SettingsForm({ settings }: { settings: StoreSocialSettings }) {
  const { pending, error, message, run, reset } = useAdminFeedback()
  const instagramHandle = getInstagramHandle(settings.instagram)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState({
    whatsapp: settings.whatsapp || '',
    instagram: instagramHandle ? `@${instagramHandle}` : settings.instagram || '',
  })
  const [values, setValues] = useState(saved)
  const editRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function finishEditing() {
    setEditing(false)
    requestAnimationFrame(() => editRef.current?.focus())
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editing || pending) return
    const data = new FormData(event.currentTarget)
    const result = await run(() => updateStoreContactsAction(data), 'Configurações salvas.')
    if (result?.success && result.settings) {
      const handle = getInstagramHandle(result.settings.instagram)
      const next = {
        whatsapp: result.settings.whatsapp || '',
        instagram: handle ? `@${handle}` : result.settings.instagram || '',
      }
      setSaved(next)
      setValues(next)
      finishEditing()
    }
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
            ref={inputRef}
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={64}
            value={values.whatsapp}
            readOnly={!editing}
            onChange={(event) => setValues({ ...values, whatsapp: event.target.value })}
            aria-describedby="whatsapp-hint"
            className="form-control mt-2 read-only:bg-surface read-only:text-muted"
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
            value={values.instagram}
            readOnly={!editing}
            onChange={(event) => setValues({ ...values, instagram: event.target.value })}
            aria-describedby="instagram-hint"
            className="form-control mt-2 read-only:bg-surface read-only:text-muted"
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
      <div className="flex flex-wrap gap-3">
        {editing ? (
          <>
            <button key="save" type="submit" disabled={pending} className="button-primary">
              {pending ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              key="cancel"
              type="button"
              disabled={pending}
              className="button-secondary"
              onClick={() => {
                setValues(saved)
                reset()
                finishEditing()
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            key="edit"
            ref={editRef}
            type="button"
            className="button-primary"
            onClick={() => {
              reset()
              setEditing(true)
              requestAnimationFrame(() => inputRef.current?.focus())
            }}
          >
            Editar
          </button>
        )}
      </div>
    </form>
  )
}
