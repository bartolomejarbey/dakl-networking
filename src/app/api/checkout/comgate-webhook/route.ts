import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyComgateWebhook } from '@/lib/comgate/webhook-verify'
import { generateAndStoreInvoice } from '@/lib/invoicing/orchestrate'
import { sendOrderConfirmation } from '@/lib/email/send'
import type { Order, Event } from '@/types/database'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://daklnetworking.cz'

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    if (!verifyComgateWebhook(formData)) {
      return new Response('1', { status: 403 })
    }

    const transId = formData.get('transId') as string | null
    const status = formData.get('status') as string | null

    if (!transId || !status) {
      return new Response('1', { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, event_id, payment_status')
      .eq('comgate_transaction_id', transId)
      .single<Pick<Order, 'id' | 'event_id' | 'payment_status'>>()

    if (orderError || !order) {
      console.error('Comgate webhook: order not found for transId:', transId)
      return new Response('0')
    }

    if (status === 'PAID') {
      // Idempotency: bail if already paid + invoiced
      if (order.payment_status === 'paid') {
        return new Response('0')
      }

      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString(),
        } as never)
        .eq('id', order.id)

      await supabase.from('order_events').insert({
        order_id: order.id,
        event_type: 'paid',
        description: `Payment confirmed via Comgate (transId: ${transId})`,
      } as never)

      // Generate invoice + send confirmation. Non-fatal: webhook still returns
      // success even if these fail, so admin can retry from /admin/orders.
      try {
        const generated = await generateAndStoreInvoice({
          orderId: order.id,
          isProforma: false,
          dueDays: 0,
        })

        const { data: fullOrder } = await supabase
          .from('orders')
          .select('*')
          .eq('id', order.id)
          .single<Order>()

        let eventName = 'DaKl Networking'
        let eventVenue: string | null = null
        let eventDateLabel = ''
        if (fullOrder?.event_id) {
          const { data: ev } = await supabase
            .from('events')
            .select('name, location_name, location_address, starts_at')
            .eq('id', fullOrder.event_id)
            .single<Pick<Event, 'name' | 'location_name' | 'location_address' | 'starts_at'>>()
          if (ev) {
            eventName = ev.name
            eventVenue = [ev.location_name, ev.location_address?.split(',')[0]?.trim()]
              .filter(Boolean)
              .join(' · ') || null
            eventDateLabel = formatCzechDateTime(ev.starts_at)
          }
        }

        if (fullOrder) {
          await sendOrderConfirmation(
            fullOrder.customer_email,
            {
              orderNumber: fullOrder.order_number,
              customerFirstName: fullOrder.customer_first_name,
              eventName,
              eventDate: eventDateLabel,
              eventVenue,
              totalCzk: fullOrder.total_czk,
              paymentMethodLabel: paymentMethodLabel(fullOrder.payment_method),
              isProforma: false,
              appUrl: APP_URL,
            },
            {
              filename: `${fullOrder.order_number}.pdf`,
              content: generated.pdfBuffer,
            }
          )

          await supabase.from('order_events').insert({
            order_id: order.id,
            event_type: 'invoice_sent',
            description: `Invoice e-mail sent to ${fullOrder.customer_email}`,
          } as never)
        }
      } catch (invoiceError) {
        console.error('Invoice/email pipeline failed (non-fatal):', invoiceError)
        await supabase.from('order_events').insert({
          order_id: order.id,
          event_type: 'invoice_failed',
          description:
            invoiceError instanceof Error
              ? invoiceError.message
              : 'Invoice generation or email send failed',
        } as never)
      }
    } else if (status === 'CANCELLED') {
      await supabase
        .from('orders')
        .update({ payment_status: 'cancelled' } as never)
        .eq('id', order.id)

      await supabase.from('order_events').insert({
        order_id: order.id,
        event_type: 'cancelled',
        description: `Payment cancelled via Comgate (transId: ${transId})`,
      } as never)
    }

    return new Response('0')
  } catch (error) {
    console.error('Comgate webhook error:', error)
    return new Response('1', { status: 500 })
  }
}
