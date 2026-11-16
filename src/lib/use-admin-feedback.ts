'use client'

import { useState } from 'react'

export function useAdminFeedback() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  function reset() {
    setError(null)
    setMessage(null)
  }

  async function run<T extends { error?: string; success?: boolean }>(
    action: () => Promise<T>,
    successMessage?: string,
  ): Promise<T | null> {
    setPending(true)
    reset()
    try {
      const result = await action()
      if (result.error || result.success === false) {
        setError(result.error || 'Não foi possível concluir. Tente novamente.')
        return null
      }
      setMessage(successMessage || null)
      return result
    } catch {
      setError('Não foi possível concluir. Verifique sua conexão e tente novamente.')
      return null
    } finally {
      setPending(false)
    }
  }
  return { pending, error, message, reset, run }
}
