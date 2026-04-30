import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminShell } from './AdminShell'
import type { IssuerSettings } from '@/types/database'
import { isPlaceholderIssuer } from '@/lib/invoicing/issuer'

export const metadata: Metadata = {
  title: 'Admin · DaKl Networking',
  robots: { index: false, follow: false },
}

async function getIssuerPlaceholderState(): Promise<boolean> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'issuer_payer')
      .single<{ value: IssuerSettings }>()
    return data ? isPlaceholderIssuer(data.value) : true
  } catch {
    return true
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Public login page is rendered as its own page route — but it ALSO uses
  // this layout. Detect that case and bypass the auth gate so the login form
  // renders (the middleware lets /admin/login through).
  // Note: we rely on the middleware as the primary gate; this server check
  // is defence-in-depth.
  if (!user) {
    return <>{children}</>
  }

  const role = (user.user_metadata as { role?: string })?.role
  if (role !== 'admin') {
    redirect('/admin/login?error=forbidden')
  }

  const issuerPlaceholder = await getIssuerPlaceholderState()

  return (
    <AdminShell
      user={{ email: user.email!, name: (user.user_metadata as { name?: string })?.name ?? null }}
      issuerPlaceholder={issuerPlaceholder}
    >
      {children}
    </AdminShell>
  )
}
