'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface ActionResult {
  ok?: boolean
  error?: string
  message?: string
  id?: string
}

async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.user_metadata as { role?: string })?.role !== 'admin') {
    throw new Error('Forbidden')
  }
  return user
}

const programItemSchema = z.object({
  time: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
})

const baseSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, 'Slug: jen malá písmena, čísla, pomlčky'),
  name: z.string().min(2).max(200),
  type: z.enum(['lod', 'vino', 'more', 'garden', 'jine']),
  starts_at: z.string().min(10),
  ends_at: z.string().min(10),
  location_name: z.string().optional().or(z.literal('')),
  location_address: z.string().optional().or(z.literal('')),
  location_gps_lat: z.preprocess((v) => (v === '' || v === null ? null : Number(v)), z.number().nullable()),
  location_gps_lng: z.preprocess((v) => (v === '' || v === null ? null : Number(v)), z.number().nullable()),
  price_czk: z.coerce.number().int().min(0),
  capacity: z.coerce.number().int().min(0),
  short_description: z.string().optional().or(z.literal('')),
  long_description: z.string().optional().or(z.literal('')),
  hero_image_url: z.string().optional().or(z.literal('')),
  meta_title: z.string().optional().or(z.literal('')),
  meta_description: z.string().optional().or(z.literal('')),
  og_image_url: z.string().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived', 'cancelled']),
  program_json: z.string().optional().or(z.literal('')),
})

function parseProgram(json: string | undefined): unknown {
  if (!json) return null
  try {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed)) return null
    return parsed.map((item) => programItemSchema.parse(item))
  } catch {
    throw new Error('Program JSON není platný (musí být array { time, title, description? })')
  }
}

export async function createEvent(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin()
  const parsed = baseSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join('; ') }

  let program
  try {
    program = parseProgram(parsed.data.program_json)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Program JSON' }
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('events')
    .insert({
      ...parsed.data,
      location_name: parsed.data.location_name || null,
      location_address: parsed.data.location_address || null,
      hero_image_url: parsed.data.hero_image_url || null,
      short_description: parsed.data.short_description || null,
      long_description: parsed.data.long_description || null,
      meta_title: parsed.data.meta_title || null,
      meta_description: parsed.data.meta_description || null,
      og_image_url: parsed.data.og_image_url || null,
      program_json: program,
      published_at: parsed.data.status === 'published' ? new Date().toISOString() : null,
      created_by: user.id,
    } as never)
    .select('id')
    .single<{ id: string }>()

  if (error || !data) return { error: error?.message ?? 'Chyba' }

  revalidatePath('/admin/events')
  revalidatePath('/akce')
  revalidatePath('/')
  redirect(`/admin/events/${data.id}`)
}

export async function updateEvent(id: string, _prev: unknown, formData: FormData): Promise<ActionResult> {
  await requireAdmin()
  const parsed = baseSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join('; ') }

  let program
  try {
    program = parseProgram(parsed.data.program_json)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Program JSON' }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('events')
    .update({
      ...parsed.data,
      location_name: parsed.data.location_name || null,
      location_address: parsed.data.location_address || null,
      hero_image_url: parsed.data.hero_image_url || null,
      short_description: parsed.data.short_description || null,
      long_description: parsed.data.long_description || null,
      meta_title: parsed.data.meta_title || null,
      meta_description: parsed.data.meta_description || null,
      og_image_url: parsed.data.og_image_url || null,
      program_json: program,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(`/admin/events/${id}`)
  revalidatePath('/admin/events')
  revalidatePath(`/akce/${parsed.data.slug}`)
  revalidatePath('/akce')
  revalidatePath('/')
  return { ok: true, message: 'Uloženo.' }
}

export async function setEventStatus(id: string, status: 'draft' | 'published' | 'archived' | 'cancelled'): Promise<ActionResult> {
  await requireAdmin()
  const supabase = createAdminClient()
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (status === 'published') updates.published_at = new Date().toISOString()
  await supabase.from('events').update(updates as never).eq('id', id)
  revalidatePath('/admin/events')
  revalidatePath(`/admin/events/${id}`)
  revalidatePath('/')
  revalidatePath('/akce')
  return { ok: true, message: 'Status změněn.' }
}
