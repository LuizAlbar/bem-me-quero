'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, Mail } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import { loginAction } from '@/app/admin/actions'

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined)

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#fffaf7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#596a49] hover:underline"
        >
          <ArrowLeft size={14} /> Voltar para a loja
        </Link>
        <div className="mt-6 flex flex-col items-center text-center">
          <BrandMark className="h-12 w-36" />
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#596a49]">
            Painel Administrativo
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-[#e8e3df] bg-white p-8 shadow-sm">
          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="rounded-xl border border-[#cb8f98]/30 bg-[#f8e1dd]/40 p-3 text-xs font-medium text-[#8a3341]">
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#4e504a]">
                E-mail
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#77766f]">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="larissa@bemmequero.com.br"
                  className="w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 py-2.5 pl-10 pr-3.5 text-sm text-[#22251f] placeholder:text-[#a09e97] focus:border-[#596a49] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#596a49]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#4e504a]">
                Senha
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#77766f]">
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 py-2.5 pl-10 pr-3.5 text-sm text-[#22251f] placeholder:text-[#a09e97] focus:border-[#596a49] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#596a49]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="button-primary w-full justify-center disabled:opacity-60"
            >
              {isPending ? 'Entrando...' : 'Entrar no painel'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#77766f]">
            Área de acesso restrito à equipe da loja.
          </p>
        </div>
      </div>
    </div>
  )
}
