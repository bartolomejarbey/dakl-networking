import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkoutSchema } from '@/types/checkout'
import { createComgatePayment } from '@/lib/comgate/api'
import type { Event, Order } from '@/types/database'

const initiateSchema = checkoutSchema.extend({
  eventId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = initiateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'validation_error', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const supabase = createAdminClient()

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', data.eventId)
      .single<Event>()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'event_not_found', message: 'Event does not exist' },
        { status: 404 }
      )
    }

    // Check availability and reserve spots
    const { data: reserved, error: reserveError } = await supabase.rpc(
      'reserve_spots' as never,
      { p_event_id: data.eventId, p_quantity: data.quantity } as never
    )

    if (reserveError || !reserved) {
      return NextResponse.json(
        { error: 'sold_out', message: 'Not enough spots available' },
        { status: 400 }
      )
    }

    // Generate order number
    const { data: orderNumber, error: orderNumberError } = await supabase.rpc(
      'next_order_number' as never
    )

    if (orderNumberError || !orderNumber) {
      return NextResponse.json(
        { error: 'internal_error', message: 'Failed to generate order number' },
        { status: 500 }
      )
    }

    const totalCzk = event.price_czk * data.quantity

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber as string,
        event_id: data.eventId,
        customer_email: data.email,
        customer_first_name: data.firstName,
        customer_last_name: data.lastName,
        customer_phone: data.phone || null,
        preferred_language: 'cs',
        is_company: data.billingType === 'company',
        company_name: data.companyName || null,
        company_ico: data.ico || null,
        company_dic: data.dic || null,
        billing_address: data.billingStreet || null,
        billing_city: data.billingCity || null,
        billing_zip: data.billingZip || null,
        billing_country: 'CZ',
        quantity: data.quantity,
        unit_price_czk: event.price_czk,
        total_czk: totalCzk,
        dietary_restrictions: data.dietaryRestrictions || null,
        source: data.source || null,
        customer_note: data.customerNote || null,
        payment_method: data.paymentMethod,
        payment_status: 'pending' as const,
        agreed_terms: data.agreedTerms,
        agreed_gdpr: data.agreedGdpr,
        agreed_newsletter: data.agreedNewsletter,
        ip_address: request.headers.get('x-forwarded-for') || null,
        user_agent: request.headers.get('user-agent') || null,
      } as never)
      .select()
      .single<Order>()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'internal_error', message: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Insert order event
    await supabase.from('order_events').insert({
      order_id: order.id,
      event_type: 'created',
      description: 'Order created',
    } as never)

    // Handle payment method
    if (data.paymentMethod === 'qr_comgate') {
      try {
        const payment = await createComgatePayment({
          orderId: order.id,
          amount: totalCzk,
          email: data.email,
          label: `DaKl Networking ${event.name}`,
        })

        // Update order with Comgate transaction ID
        await supabase
          .from('orders')
          .update({ comgate_transaction_id: payment.transId } as never)
          .eq('id', order.id)

        return NextResponse.json({
          orderId: order.id,
          orderNumber,
          paymentUrl: payment.redirectUrl,
        })
      } catch (paymentError) {
        // Update order status to failed
        await supabase
          .from('orders')
          .update({ payment_status: 'failed' } as never)
          .eq('id', order.id)

        await supabase.from('order_events').insert({
          order_id: order.id,
          event_type: 'payment_failed',
          description:
            paymentError instanceof Error
              ? paymentError.message
              : 'Payment gateway error',
        } as never)

        return NextResponse.json(
          { error: 'payment_error', message: 'Failed to initiate payment' },
          { status: 502 }
        )
      }
    }

    // Bank transfer
    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      bankDetails: {
        account: process.env.BANK_ACCOUNT_NUMBER,
        bankCode: process.env.BANK_CODE,
        variableSymbol: orderNumber,
      },
    })
  } catch (error) {
    console.error('Checkout initiate error:', error)
    return NextResponse.json(
      { error: 'internal_error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
