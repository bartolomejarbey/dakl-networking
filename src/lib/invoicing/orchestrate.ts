import { createAdminClient } from '@/lib/supabase/admin'
import { getIssuerForOrder } from './issuer'
import { buildSpaydString, variableSymbolFromOrderNumber } from './spayd'
import { spaydQrDataUrl } from './qr'
import { renderInvoicePdf } from './render'
import type { Order } from '@/types/database'

const STORAGE_BUCKET = 'invoices'

export interface GeneratedInvoice {
  pdfBuffer: Buffer
  pdfPath: string
  signedUrl: string
  qrDataUrl: string
  spaydString: string
  invoiceNumber: string
}

export interface GenerateInvoiceOptions {
  orderId: string
  isProforma?: boolean
  /** Days from issue date until due. Defaults: 0 for invoice, 7 for proforma. */
  dueDays?: number
}

/**
 * End-to-end invoice generation:
 *  1. Fetch order + event
 *  2. Resolve issuer based on customer_is_vat_payer
 *  3. Build SPAYD payment string + QR data URL
 *  4. Render PDF
 *  5. Upload to Supabase Storage `invoices/`
 *  6. Update order columns (invoice_pdf_url / proforma_pdf_url, issuer snapshot, qr string)
 *  7. Insert order_events audit row
 *
 * Idempotent-ish: re-running for the same order overwrites the existing PDF
 * in storage and updates DB columns. Useful for the admin "Re-generate" action.
 */
export async function generateAndStoreInvoice({
  orderId,
  isProforma = false,
  dueDays,
}: GenerateInvoiceOptions): Promise<GeneratedInvoice> {
  const supabase = createAdminClient()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    throw new Error(`Invoice generation: order ${orderId} not found`)
  }

  const typedOrder = order as Order

  let eventName: string | undefined
  if (typedOrder.event_id) {
    const { data: event } = await supabase
      .from('events')
      .select('name')
      .eq('id', typedOrder.event_id)
      .single()
    eventName = (event as { name?: string } | null)?.name
  }

  const isVatPayer = typedOrder.customer_is_vat_payer ?? false
  const issuer = await getIssuerForOrder(isVatPayer)

  const issuedAt = new Date()
  const dueAt = new Date(issuedAt)
  const effectiveDueDays = dueDays ?? (isProforma ? 7 : 14)
  dueAt.setDate(dueAt.getDate() + effectiveDueDays)

  const spaydString = buildSpaydString({
    iban: issuer.bank_iban,
    amountCzk: typedOrder.total_czk,
    variableSymbol: variableSymbolFromOrderNumber(typedOrder.order_number),
    message: `DAKL ${typedOrder.order_number}`,
    dueDate: dueAt,
  })
  const qrDataUrl = await spaydQrDataUrl(spaydString)

  const invoiceNumber = typedOrder.invoice_number ?? typedOrder.order_number

  const pdfBuffer = await renderInvoicePdf({
    order: { ...typedOrder, invoice_number: invoiceNumber, invoice_due_at: dueAt.toISOString(), invoice_issued_at: issuedAt.toISOString() },
    issuer,
    qrPngDataUrl: qrDataUrl,
    eventName,
    isProforma,
  })

  const filename = isProforma
    ? `proforma_${typedOrder.order_number}.pdf`
    : `${typedOrder.order_number}.pdf`
  const pdfPath = filename

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(pdfPath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Invoice generation: storage upload failed — ${uploadError.message}`)
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(pdfPath, 60 * 60 * 24 * 365) // 1 year

  if (signError || !signed) {
    throw new Error(`Invoice generation: signed URL failed — ${signError?.message}`)
  }

  // Update order
  const updates: Partial<Order> = {
    issuer_key: issuer.key,
    issuer_snapshot: issuer,
    qr_payment_string: spaydString,
    invoice_issued_at: issuedAt.toISOString(),
    invoice_due_at: dueAt.toISOString(),
    invoice_number: invoiceNumber,
  }
  if (isProforma) {
    updates.proforma_pdf_url = signed.signedUrl
  } else {
    updates.invoice_pdf_url = signed.signedUrl
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update(updates as never)
    .eq('id', orderId)

  if (updateError) {
    throw new Error(`Invoice generation: order update failed — ${updateError.message}`)
  }

  // Audit
  await supabase
    .from('order_events')
    .insert({
      order_id: orderId,
      event_type: isProforma ? 'proforma_generated' : 'invoice_generated',
      description: `${isProforma ? 'Proforma' : 'Faktura'} ${invoiceNumber} vygenerována (${issuer.key})`,
      metadata: { issuer_key: issuer.key, pdf_path: pdfPath } as never,
    } as never)

  return {
    pdfBuffer,
    pdfPath,
    signedUrl: signed.signedUrl,
    qrDataUrl,
    spaydString,
    invoiceNumber,
  }
}
