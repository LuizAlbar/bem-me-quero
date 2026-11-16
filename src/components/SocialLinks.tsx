import type { SettingsView } from '@/lib/store-data'
import { getWhatsAppUrl } from '@/lib/contact-links'

export function SocialLinks({
  settings,
  className = '',
}: {
  settings: SettingsView
  className?: string
}) {
  const whatsapp = getWhatsAppUrl(settings.whatsapp)
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {settings.instagram && (
        <a
          href={settings.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link"
          aria-label="Instagram da Bem Me Quero"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
          </svg>
        </a>
      )}
      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link"
          aria-label="WhatsApp da Bem Me Quero"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.6-4.8A8.5 8.5 0 1 1 20.5 11.5Z" />
            <path d="m8.5 7.5 1.5 2-1 1c.8 1.6 2 2.8 3.5 3.5l1-1 2 1.5c-.2 1.2-1 1.8-2 1.5-3.4-1-5.8-3.4-6.5-6.5-.2-.8.3-1.7 1.5-2Z" />
          </svg>
        </a>
      )}
    </div>
  )
}
