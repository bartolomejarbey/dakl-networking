import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyComgateWebhook } from '@/lib/comgate/webhook-verify'
import type { Order } from '@/types/database'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Verify webhook authenticity
    if (!verifyComgateWebhook(formData)) {
      return new Response('1', { status: 403 })
    }

    const transId = formData.get('transId') as string | null
    const status = formData.get('status') as string | null

    if (!transId || !status) {
      return new Response('1', { status: 400 })
    }

    const supabase = createAdminClient()

    // Find order by Comgate transaction ID
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('comgate_transaction_id', transId)
      .single<Pick<Order, 'id'>>()

    if (orderError || !order) {
      console.error('Comgate webhook: order not found for transId:', transId)
      return new Response('0')
    }

    if (status === 'PAID') {
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

      // TODO: send confirmation email
      // TODO: generate invoice
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

    // Comgate expects '0' in body for success
    return new Response('0')
  } catch (error) {
    console.error('Comgate webhook error:', error)
    return new Response('1', { status: 500 })
  }
}
