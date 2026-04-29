import { renderToBuffer } from '@react-pdf/renderer'
import { InvoicePdf, type InvoicePdfData } from './InvoicePdf'

export async function renderInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  const buffer = await renderToBuffer(<InvoicePdf {...data} />)
  return buffer
}
