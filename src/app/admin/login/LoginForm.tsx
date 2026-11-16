'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { BrandMark } from '@/components/BrandMark'
import { loginAction } from '@/app/admin/actions'

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined)
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <main className="flex min-h-svh flex-col justify-center bg-[#fffaf7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center text-center">
          <BrandMark />
          <h1 className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#596a49]">
            Painel Administrativo
          </h1>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-2xl border border-[#e8e3df] bg-white p-6 shadow-sm sm:p-8">
          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div
                role="alert"
                className="rounded-xl border border-[#cb8f98]/30 bg-[#f8e1dd]/40 p-3 text-xs font-medium text-[#8a3341]"
              >
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
                  className="w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 py-2.5 pl-10 pr-3.5 text-base text-[#22251f] placeholder:text-[#a09e97] focus:border-[#596a49] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#596a49]"
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
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#e8e3df] bg-[#fffaf7]/60 py-2.5 pl-10 pr-12 text-base text-[#22251f] placeholder:text-[#a09e97] focus:border-[#596a49] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#596a49]"
                />
                <button
                  type="button"
                  aria-label={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-controls="password"
                  aria-pressed={passwordVisible}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-xl text-[#596a49]"
                  onClick={() => setPasswordVisible((visible) => !visible)}
                >
                  {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
        </div>
      </div>
    </main>
  )
}
