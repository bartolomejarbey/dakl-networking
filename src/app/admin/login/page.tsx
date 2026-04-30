import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Přihlášení · Admin',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ next?: string; error?: string }>
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const params = await searchParams
  return <LoginForm nextPath={params.next} initialError={params.error === 'forbidden' ? 'Nemáš administrátorská oprávnění.' : undefined} />
}
