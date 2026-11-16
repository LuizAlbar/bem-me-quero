import type { ReactNode } from 'react'

export const metadata = {
  title: 'Painel Admin | Bem Me Quero',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children
}
