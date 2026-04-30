'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface ActionResult {
  ok?: boolean
  error?: string
  message?: string
}

async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.user_metadata as { role?: string })?.role !== 'admin') {
    throw new Error('Forbidden')
  }
}

const issuerSchema = z.object({
  key: z.enum(['issuer_payer', 'issuer_nonpayer']),
  name: z.string().min(2).max(200),
  ico: z.string().regex(/^\d{6,10}$/, 'IČO musí být 6–10 číslic'),
  dic: z.string().regex(/^CZ\d{8,10}$/, 'DIČ ve tvaru CZ12345678').optional().or(z.literal('')),
  address_street: z.string().min(2).max(200),
  address_city: z.string().min(2).max(100),
  address_zip: z.string().min(3).max(10),
  address_country: z.string().length(2).default('CZ'),
  bank_account: z.string().min(2).max(50),
  bank_code: z.string().regex(/^\d{4}$/, 'Kód banky 4 číslice'),
  bank_iban: z.string().regex(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/, 'IBAN nesedí'),
  is_vat_payer: z.boolean(),
  vat_rate: z.number().min(0).max(30),
  email: z.string().email().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal('')),
})

export async function updateIssuer(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const parsed = issuerSchema.safeParse({
    key: formData.get('key'),
    name: formData.get('name'),
    ico: formData.get('ico'),
    dic: formData.get('dic') || undefined,
    address_street: formData.get('address_street'),
    address_city: formData.get('address_city'),
    address_zip: formData.get('address_zip'),
    address_country: formData.get('address_country') || 'CZ',
    bank_account: formData.get('bank_account'),
    bank_code: formData.get('bank_code'),
    bank_iban: (formData.get('bank_iban') as string)?.replace(/\s+/g, ''),
    is_vat_payer: formData.get('is_vat_payer') === 'on' || formData.get('is_vat_payer') === 'true',
    vat_rate: Number(formData.get('vat_rate') ?? 0),
    email: formData.get('email') || '',
    phone: formData.get('phone') || '',
  })

  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') }
  }

  const { key, ...value } = parsed.data
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('settings')
    .update({ value: value as never, updated_at: new Date().toISOString() } as never)
    .eq('key', key)

  if (error) return { error: error.message }
  revalidatePath('/admin/settings')
  revalidatePath('/admin')
  return { ok: true, message: `${key === 'issuer_payer' ? 'Plátce DPH' : 'Neplátce'} uložen.` }
}

const invoiceSeriesSchema = z.object({
  prefix: z.string().min(1).max(20),
})

export async function updateInvoiceSeries(_prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const parsed = invoiceSeriesSchema.safeParse({ prefix: formData.get('prefix') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message }

  const supabase = createAdminClient()
  const { data: existing } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'invoice_series')
    .single<{ value: { current: number } }>()

  await supabase
    .from('settings')
    .update({
      value: { prefix: parsed.data.prefix, current: existing?.value?.current ?? 0 } as never,
    } as never)
    .eq('key', 'invoice_series')

  revalidatePath('/admin/settings')
  return { ok: true, message: 'Série faktur upravena.' }
}
