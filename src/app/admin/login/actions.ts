'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const credentialsSchema = z.object({
  email: z.string().email('Zadej platný e-mail'),
  password: z.string().min(8, 'Heslo musí mít alespoň 8 znaků'),
  next: z.string().optional(),
})

export interface LoginActionState {
  error?: string
  fieldErrors?: Record<string, string[]>
}

export async function loginAdmin(
  _prev: LoginActionState | undefined,
  formData: FormData
): Promise<LoginActionState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next') ?? undefined,
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: error.message === 'Invalid login credentials' ? 'Špatný e-mail nebo heslo.' : error.message }
  }

  const role = (data.user?.user_metadata as { role?: string })?.role
  if (role !== 'admin') {
    await supabase.auth.signOut()
    return { error: 'Tento účet nemá administrátorská oprávnění.' }
  }

  const target = parsed.data.next && parsed.data.next.startsWith('/admin') ? parsed.data.next : '/admin'
  redirect(target)
}

export async function logoutAdmin(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
