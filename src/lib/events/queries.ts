import { createAdminClient } from '@/lib/supabase/admin'
import type { Event } from '@/types/database'

const EVENT_FIELDS = `
  id, slug, name, type, starts_at, ends_at,
  location_name, location_address, location_gps_lat, location_gps_lng,
  price_czk, capacity,
  short_description, long_description, program_json,
  meta_title, meta_description, og_image_url, hero_image_url,
  status, published_at, created_at, updated_at, created_by
`

/** All published + draft events sorted by upcoming-first then archive (newest-first). */
export async function listPublicEvents(): Promise<Event[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('events')
    .select(EVENT_FIELDS)
    .neq('status', 'cancelled')
    .order('starts_at', { ascending: false })
  return ((data ?? []) as Event[]).slice().sort((a, b) => {
    const order = { published: 0, draft: 1, archived: 2, cancelled: 3 } as const
    const oa = order[a.status as keyof typeof order] ?? 9
    const ob = order[b.status as keyof typeof order] ?? 9
    if (oa !== ob) return oa - ob
    return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime()
  })
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('events')
    .select(EVENT_FIELDS)
    .eq('slug', slug)
    .maybeSingle<Event>()
  return data
}

export async function listAdminEvents(): Promise<Event[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('events')
    .select(EVENT_FIELDS)
    .order('starts_at', { ascending: false })
  return (data ?? []) as Event[]
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('events').select(EVENT_FIELDS).eq('id', id).maybeSingle<Event>()
  return data
}
