import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkoutSchema } from '@/types/checkout'
import { createComgatePayment } from '@/lib/comgate/api'
import { generateAndStoreInvoice } from '@/lib/invoicing/orchestrate'
import { sendProformaEmail } from '@/lib/email/send'
import type { Event, Order } from '@/types/database'

const initiateSchema = checkoutSchema.extend({
  eventId: z.string().uuid(),
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://daklnetworking.cz'

function paymentMethodLabel(method: string): string {
  return method === 'qr_comgate' ? 'Karta / QR' : 'Bankovní převod'
}

function formatCzechDate(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

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
    const isCompany = data.billingType === 'company'
    const customerIsVatPayer = isCompany ? data.customerIsVatPayer : false

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
        is_company: isCompany,
        company_name: data.companyName || null,
        company_ico: data.ico || null,
        company_dic: customerIsVatPayer ? data.dic || null : null,
        billing_address: data.billingStreet || null,
        billing_city: data.billingCity || null,
        billing_zip: data.billingZip || null,
        billing_country: 'CZ',
        customer_is_vat_payer: customerIsVatPayer,
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

    await supabase.from('order_events').insert({
      order_id: order.id,
      event_type: 'created',
      description: 'Order created',
    } as never)

    if (data.paymentMethod === 'qr_comgate') {
      try {
        const payment = await createComgatePayment({
          orderId: order.id,
          amount: totalCzk,
          email: data.email,
          label: `DaKl Networking ${event.name}`,
        })

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

    // Bank transfer flow → generate proforma + send email
    try {
      const generated = await generateAndStoreInvoice({
        orderId: order.id,
        isProforma: true,
        dueDays: 7,
      })

      // Re-fetch order with updated proforma + issuer fields
      const { data: refreshedOrder } = await supabase
        .from('orders')
        .select('*, issuer_snapshot, invoice_due_at')
        .eq('id', order.id)
        .single<Order>()

      const issuer = refreshedOrder?.issuer_snapshot
      const dueAt = refreshedOrder?.invoice_due_at ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

      if (issuer) {
        await sendProformaEmail(
          data.email,
          {
            orderNumber: orderNumber as string,
            customerFirstName: data.firstName,
            eventName: event.name,
            totalCzk,
            bankAccount: issuer.bank_account,
            bankCode: issuer.bank_code,
            iban: issuer.bank_iban,
            variableSymbol: (orderNumber as string).replace(/\D/g, ''),
            dueDate: formatCzechDate(dueAt),
            qrDataUrl: generated.qrDataUrl,
            appUrl: APP_URL,
          },
          {
            filename: `proforma_${orderNumber}.pdf`,
            content: generated.pdfBuffer,
          }
        )

        await supabase.from('order_events').insert({
          order_id: order.id,
          event_type: 'proforma_sent',
          description: `Proforma e-mail sent to ${data.email}`,
        } as never)
      }
    } catch (proformaError) {
      // Non-fatal — order is created, payment instructions are still returned
      console.error('Proforma generation failed (non-fatal):', proformaError)
      await supabase.from('order_events').insert({
        order_id: order.id,
        event_type: 'proforma_failed',
        description:
          proformaError instanceof Error
            ? proformaError.message
            : 'Proforma generation failed',
      } as never)
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      bankDetails: {
        account: process.env.BANK_ACCOUNT_NUMBER,
        bankCode: process.env.BANK_CODE,
        variableSymbol: orderNumber,
      },
      method: paymentMethodLabel(data.paymentMethod),
    })
  } catch (error) {
    console.error('Checkout initiate error:', error)
    return NextResponse.json(
      { error: 'internal_error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
