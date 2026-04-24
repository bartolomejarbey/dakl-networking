import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import type { NewsletterSubscriber } from '@/types/database'

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  source: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = subscribeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'validation_error', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, firstName, source } = parsed.data
    const supabase = createAdminClient()

    // Check if subscriber already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single<Pick<NewsletterSubscriber, 'id' | 'status'>>()

    if (existing) {
      // If unsubscribed, reactivate
      if (existing.status === 'unsubscribed') {
        const confirmToken = crypto.randomUUID()

        await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'pending',
            confirm_token: confirmToken,
            first_name: firstName || null,
            source: source || null,
          } as never)
          .eq('id', existing.id)

        // TODO: send confirmation email

        return NextResponse.json({ success: true })
      }

      // Already active or pending
      return NextResponse.json({ already_subscribed: true })
    }

    // New subscriber
    const confirmToken = crypto.randomUUID()

    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        first_name: firstName || null,
        status: 'pending' as const,
        source: source || null,
        confirm_token: confirmToken,
      } as never)

    if (insertError) {
      console.error('Newsletter subscribe insert error:', insertError)
      return NextResponse.json(
        { error: 'internal_error', message: 'Failed to subscribe' },
        { status: 500 }
      )
    }

    // TODO: send confirmation email

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { error: 'internal_error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
