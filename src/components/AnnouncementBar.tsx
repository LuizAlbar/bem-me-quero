'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { SettingsView } from '@/lib/store-data'
import { getWhatsAppUrl } from '@/lib/contact-links'

export function AnnouncementBar({ settings }: { settings: SettingsView }) {
  const [index, setIndex] = useState(0)
  const whatsapp = getWhatsAppUrl(settings.whatsapp)
  const announcements = [
    { text: 'Sua próxima make favorita está aqui. Explore a coleção', href: '/produtos' },
    {
      text: 'Encontre sua make com atendimento personalizado',
      href: whatsapp || '/#contato',
    },
  ]
  const announcement = announcements[index]

  return (
    <div className="announcement-bar" aria-label="Destaques da loja">
      <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between gap-2 px-2 sm:px-5">
        <button
          type="button"
          className="grid h-full w-8 shrink-0 place-items-center"
          aria-label="Destaque anterior"
          onClick={() =>
            setIndex((current) => (current + announcements.length - 1) % announcements.length)
          }
        >
          <ChevronLeft size={14} />
        </button>
        <Link
          href={announcement.href}
          className="text-center text-[10px] font-medium leading-tight sm:text-xs"
          target={announcement.href.startsWith('https:') ? '_blank' : undefined}
          rel={announcement.href.startsWith('https:') ? 'noopener noreferrer' : undefined}
        >
          {announcement.text}
        </Link>
        <button
          type="button"
          className="grid h-full w-8 shrink-0 place-items-center"
          aria-label="Próximo destaque"
          onClick={() => setIndex((current) => (current + 1) % announcements.length)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
