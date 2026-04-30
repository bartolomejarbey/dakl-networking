'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateAndStoreInvoice } from '@/lib/invoicing/orchestrate'
import { sendOrderConfirmation, sendProformaEmail } from '@/lib/email/send'
import type { Order, Event, IssuerSettings, FollowUpStatus } from '@/types/database'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://daklnetworking.cz'

interface ActionResult {
  ok?: boolean
  error?: string
  message?: string
}

async function requireAdmin(): Promise<{ id: string; email: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.user_metadata as { role?: string })?.role !== 'admin') {
    throw new Error('Forbidden')
  }
  return { id: user.id, email: user.email! }
}

export async function regenerateInvoice(orderId: string, isProforma = false): Promise<ActionResult> {
  await requireAdmin()
  try {
    await generateAndStoreInvoice({ orderId, isProforma })
    revalidatePath(`/admin/orders/${orderId}`)
    return { ok: true, message: 'Dokument znovu vygenerován.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Chyba při generování' }
  }
}

function paymentMethodLabel(method: string): string {
  return method === 'qr_comgate' ? 'Karta / QR' : 'Bankovní převod'
}

function formatCzechDateTime(iso: string): string {
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${day}.${month}.${d.getFullYear()} · ${time}`
}

function formatCzechDate(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

export async function sendInvoiceEmail(orderId: string): Promise<ActionResult> {
  await requireAdmin()
  try {
    const supabase = createAdminClient()
    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single<Order>()
    if (!order) throw new Error('Objednávka nenalezena')

    let regenerated: { pdfBuffer: Buffer; qrDataUrl: string } | null = null
    if (!order.invoice_pdf_url && !order.proforma_pdf_url) {
      regenerated = await generateAndStoreInvoice({ orderId, isProforma: order.payment_status !== 'paid' })
    }

    let pdfBuffer: Buffer
    if (regenerated) {
      pdfBuffer = regenerated.pdfBuffer
    } else {
      // Re-render to attach (we don't store the buffer, just regenerate)
      const isProforma = order.payment_status !== 'paid'
      const fresh = await generateAndStoreInvoice({ orderId, isProforma })
      pdfBuffer = fresh.pdfBuffer
    }

    let eventName = 'DaKl Networking'
    let eventVenue: string | null = null
    let eventDateLabel = ''
    if (order.event_id) {
      const { data: ev } = await supabase
        .from('events')
        .select('name, location_name, location_address, starts_at')
        .eq('id', order.event_id)
        .single<Pick<Event, 'name' | 'location_name' | 'location_address' | 'starts_at'>>()
      if (ev) {
        eventName = ev.name
        eventVenue = [ev.location_name, ev.location_address?.split(',')[0]?.trim()].filter(Boolean).join(' · ') || null
        eventDateLabel = formatCzechDateTime(ev.starts_at)
      }
    }

    const isProforma = order.payment_status !== 'paid'

    if (isProforma) {
      const issuer = order.issuer_snapshot as IssuerSettings | null
      const generated = regenerated ?? (await generateAndStoreInvoice({ orderId, isProforma: true }))
      if (!issuer) throw new Error('Issuer snapshot missing')
      await sendProformaEmail(
        order.customer_email,
        {
          orderNumber: order.order_number,
          customerFirstName: order.customer_first_name,
          eventName,
          totalCzk: order.total_czk,
          bankAccount: issuer.bank_account,
          bankCode: issuer.bank_code,
          iban: issuer.bank_iban,
          variableSymbol: order.order_number.replace(/\D/g, ''),
          dueDate: order.invoice_due_at ? formatCzechDate(order.invoice_due_at) : '—',
          qrDataUrl: generated.qrDataUrl,
          appUrl: APP_URL,
        },
        { filename: `proforma_${order.order_number}.pdf`, content: generated.pdfBuffer }
      )
    } else {
      await sendOrderConfirmation(
        order.customer_email,
        {
          orderNumber: order.order_number,
          customerFirstName: order.customer_first_name,
          eventName,
          eventDate: eventDateLabel,
          eventVenue,
          totalCzk: order.total_czk,
          paymentMethodLabel: paymentMethodLabel(order.payment_method),
          isProforma: false,
          appUrl: APP_URL,
        },
        { filename: `${order.order_number}.pdf`, content: pdfBuffer }
      )
    }

    await supabase.from('order_events').insert({
      order_id: orderId,
      event_type: 'invoice_resent',
      description: `Dokument odeslán znovu na ${order.customer_email}`,
    } as never)

    revalidatePath(`/admin/orders/${orderId}`)
    return { ok: true, message: 'E-mail odeslán.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Chyba při odesílání' }
  }
}

export async function markOrderPaid(orderId: string): Promise<ActionResult> {
  const admin = await requireAdmin()
  try {
    const supabase = createAdminClient()
    const { data: order } = await supabase.from('orders').select('payment_status').eq('id', orderId).single<Pick<Order, 'payment_status'>>()
    if (order?.payment_status === 'paid') {
      return { error: 'Objednávka už je zaplacená.' }
    }

    await supabase
      .from('orders')
      .update({ payment_status: 'paid', paid_at: new Date().toISOString() } as never)
      .eq('id', orderId)

    await supabase.from('order_events').insert({
      order_id: orderId,
      event_type: 'paid',
      description: `Označeno jako zaplaceno administrátorem (${admin.email})`,
      created_by: admin.id,
    } as never)

    // Trigger invoice generation + email
    await regenerateInvoice(orderId, false)
    await sendInvoiceEmail(orderId)

    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath('/admin/orders')
    return { ok: true, message: 'Označeno jako zaplaceno.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Chyba' }
  }
}

const noteSchema = z.object({
  email: z.string().email(),
  body: z.string().min(1, 'Text poznámky'),
  isPinned: z.boolean().optional(),
})

export async function addCustomerNote(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin()
  const parsed = noteSchema.safeParse({
    email: formData.get('email'),
    body: formData.get('body'),
    isPinned: formData.get('isPinned') === 'on',
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message }
  }
  const supabase = createAdminClient()
  await supabase.from('customer_notes').insert({
    email: parsed.data.email,
    body: parsed.data.body,
    is_pinned: parsed.data.isPinned ?? false,
    created_by: admin.id,
  } as never)
  revalidatePath(`/admin/customers/${encodeURIComponent(parsed.data.email)}`)
  // Revalidate any order detail that uses this email
  revalidatePath('/admin/orders')
  return { ok: true, message: 'Poznámka přidána.' }
}

const tagSchema = z.object({
  email: z.string().email(),
  tag: z.string().min(1).max(40),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal('')),
})

export async function addCustomerTag(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin()
  const parsed = tagSchema.safeParse({
    email: formData.get('email'),
    tag: formData.get('tag'),
    color: formData.get('color') || undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message }
  }
  const supabase = createAdminClient()
  const { error } = await supabase.from('customer_tags').insert({
    email: parsed.data.email,
    tag: parsed.data.tag,
    color: parsed.data.color || null,
    created_by: admin.id,
  } as never)
  if (error && !error.message.includes('duplicate')) {
    return { error: error.message }
  }
  revalidatePath(`/admin/customers/${encodeURIComponent(parsed.data.email)}`)
  return { ok: true, message: error ? 'Tag už existuje.' : 'Tag přidán.' }
}

export async function removeCustomerTag(email: string, tag: string): Promise<ActionResult> {
  await requireAdmin()
  const supabase = createAdminClient()
  await supabase.from('customer_tags').delete().eq('email', email).eq('tag', tag)
  revalidatePath(`/admin/customers/${encodeURIComponent(email)}`)
  return { ok: true }
}

const followUpSchema = z.object({
  email: z.string().email(),
  orderId: z.string().uuid().optional().or(z.literal('')),
  dueAt: z.string().min(1, 'Datum'),
  subject: z.string().min(1, 'Předmět').max(200),
  body: z.string().optional(),
})

export async function scheduleFollowUp(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin()
  const parsed = followUpSchema.safeParse({
    email: formData.get('email'),
    orderId: formData.get('orderId') || undefined,
    dueAt: formData.get('dueAt'),
    subject: formData.get('subject'),
    body: formData.get('body') || undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message }
  }
  const supabase = createAdminClient()
  await supabase.from('follow_ups').insert({
    email: parsed.data.email,
    order_id: parsed.data.orderId || null,
    due_at: new Date(parsed.data.dueAt).toISOString(),
    subject: parsed.data.subject,
    body: parsed.data.body || null,
    status: 'pending',
    created_by: admin.id,
  } as never)
  revalidatePath('/admin/followups')
  revalidatePath(`/admin/customers/${encodeURIComponent(parsed.data.email)}`)
  return { ok: true, message: 'Follow-up naplánován.' }
}

export async function updateFollowUpStatus(
  followUpId: string,
  status: FollowUpStatus,
  completionNote?: string
): Promise<ActionResult> {
  const admin = await requireAdmin()
  const supabase = createAdminClient()
  const updates: Record<string, unknown> = { status }
  if (status === 'done') {
    updates.completed_at = new Date().toISOString()
    if (completionNote) updates.completion_note = completionNote
  }
  await supabase.from('follow_ups').update(updates as never).eq('id', followUpId)
  revalidatePath('/admin/followups')
  return { ok: true }
}
