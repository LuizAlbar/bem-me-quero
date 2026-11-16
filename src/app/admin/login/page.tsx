import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { LoginForm } from './LoginForm'

export default async function AdminLoginPage() {
  if (await verifySession()) redirect('/admin')
  return <LoginForm />
}
