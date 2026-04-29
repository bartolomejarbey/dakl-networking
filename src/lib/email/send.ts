import { Resend } from 'resend'
import { OrderConfirmation, type OrderConfirmationProps } from '@/emails/OrderConfirmation'
import { ProformaSent, type ProformaSentProps } from '@/emails/ProformaSent'
import { FollowUpReminder, type FollowUpReminderProps } from '@/emails/FollowUpReminder'

let cachedClient: Resend | null = null

function client(): Resend {
  if (!cachedClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('RESEND_API_KEY is not set')
    cachedClient = new Resend(apiKey)
  }
  return cachedClient
}

const FROM_DEFAULT = 'DaKl Networking <david@daklnetworking.cz>'
function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || FROM_DEFAULT
}

export interface PdfAttachment {
  filename: string
  content: Buffer
}

export async function sendOrderConfirmation(
  to: string,
  props: OrderConfirmationProps,
  attachment?: PdfAttachment
) {
  return client().emails.send({
    from: fromAddress(),
    to,
    subject: `${props.isProforma ? 'Proforma' : 'Faktura'} ${props.orderNumber} — DaKl Networking`,
    react: OrderConfirmation(props),
    attachments: attachment ? [attachment] : undefined,
  })
}

export async function sendProformaEmail(
  to: string,
  props: ProformaSentProps,
  attachment?: PdfAttachment
) {
  return client().emails.send({
    from: fromAddress(),
    to,
    subject: `Proforma ${props.orderNumber} — zaplať a vidíme se na akci`,
    react: ProformaSent(props),
    attachments: attachment ? [attachment] : undefined,
  })
}

export async function sendFollowUpReminder(to: string, props: FollowUpReminderProps) {
  return client().emails.send({
    from: fromAddress(),
    to,
    subject: `Follow-up: ${props.subject}`,
    react: FollowUpReminder(props),
  })
}
