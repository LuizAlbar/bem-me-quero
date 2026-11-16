'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function AdminDialog({
  title,
  onClose,
  busy = false,
  wide = false,
  children,
}: {
  title: string
  onClose: () => void
  busy?: boolean
  wide?: boolean
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    if (dialog && !dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      opener?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-busy={busy}
      className={`admin-dialog m-auto max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] rounded-2xl bg-white p-5 text-ink sm:p-8 ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onClose()
      }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <h2 id={titleId} className="font-editorial text-2xl">
          {title}
        </h2>
        <button
          type="button"
          className="icon-link text-muted"
          onClick={onClose}
          disabled={busy}
          aria-label="Fechar formulário"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  )
}
