/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet, Image as PdfImage, Font } from '@react-pdf/renderer'
import type { Order, IssuerSettings } from '@/types/database'

// Built-in Helvetica avoids network font fetches at render time. Instrument
// Serif could be registered later with Font.register({ family: 'Instrument Serif', src: ttfUrl }).
Font.registerHyphenationCallback((word) => [word])

const COLORS = {
  ink: '#12201F',
  inkSoft: '#2A3838',
  cream: '#F5EFE2',
  forest: '#163933',
  forestDeep: '#0F2926',
  orange: '#E97940',
  hairline: '#1F252420',
}

const styles = StyleSheet.create({
  page: {
    padding: 56,
    backgroundColor: '#FBF8EF',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.ink,
    lineHeight: 1.45,
  },
  // Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  brandBlock: { flexDirection: 'column', maxWidth: 260 },
  brandTitle: { fontFamily: 'Helvetica-Oblique', fontSize: 26, color: COLORS.ink, marginBottom: 6 },
  brandSub: { fontFamily: 'Helvetica', fontSize: 8, letterSpacing: 1.6, color: COLORS.inkSoft, textTransform: 'uppercase' },
  invoiceMetaBlock: { textAlign: 'right' },
  invoiceLabel: { fontFamily: 'Helvetica', fontSize: 8, letterSpacing: 1.6, color: COLORS.inkSoft, textTransform: 'uppercase', marginBottom: 4 },
  invoiceNumber: { fontFamily: 'Helvetica-Bold', fontSize: 18, color: COLORS.ink },
  invoiceMeta: { fontFamily: 'Helvetica', fontSize: 9, color: COLORS.inkSoft, marginTop: 6 },
  // Hairline
  hairline: { height: 0.5, backgroundColor: '#1F2524', opacity: 0.18, marginVertical: 16 },
  hairlineThick: { height: 1.2, backgroundColor: COLORS.orange, marginTop: 6, marginBottom: 0 },
  // Two-column block (issuer / customer)
  partiesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  party: { flexBasis: '48%' },
  partyTitle: { fontFamily: 'Helvetica', fontSize: 8, letterSpacing: 1.6, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 8 },
  partyName: { fontFamily: 'Helvetica-Bold', fontSize: 13, color: COLORS.ink, marginBottom: 4 },
  partyLine: { fontSize: 10, color: COLORS.inkSoft, lineHeight: 1.5 },
  partyMono: { fontFamily: 'Courier', fontSize: 9, color: COLORS.inkSoft, marginTop: 4 },
  // Line items
  lineItemsHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ink,
    marginTop: 8,
  },
  lineItemsHeaderCell: { fontFamily: 'Helvetica', fontSize: 8, letterSpacing: 1.6, color: COLORS.inkSoft, textTransform: 'uppercase' },
  lineRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1F252430',
  },
  cellDescription: { flex: 4, paddingRight: 8 },
  cellQty: { flex: 0.6, textAlign: 'right' },
  cellUnit: { flex: 1.2, textAlign: 'right' },
  cellSubtotal: { flex: 1.4, textAlign: 'right' },
  cellMain: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: COLORS.ink },
  cellSub: { fontFamily: 'Helvetica', fontSize: 9, color: COLORS.inkSoft, marginTop: 2 },
  // Totals
  totalsBlock: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 },
  totalsTable: { width: 220 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  totalsLabel: { fontFamily: 'Helvetica', fontSize: 9, color: COLORS.inkSoft, textTransform: 'uppercase', letterSpacing: 1.4 },
  totalsValue: { fontFamily: 'Helvetica', fontSize: 10, color: COLORS.ink },
  totalsGrand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 6,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.ink,
  },
  totalsGrandLabel: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: COLORS.ink, letterSpacing: 1.2, textTransform: 'uppercase' },
  totalsGrandValue: { fontFamily: 'Helvetica-Bold', fontSize: 16, color: COLORS.ink },
  // Payment block (bank details + QR)
  paymentBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1F252420',
  },
  paymentInfo: { flex: 1, paddingRight: 24 },
  paymentTitle: { fontFamily: 'Helvetica', fontSize: 8, letterSpacing: 1.6, color: COLORS.orange, textTransform: 'uppercase', marginBottom: 8 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  paymentLabel: { fontFamily: 'Helvetica', fontSize: 8, letterSpacing: 1.4, color: COLORS.inkSoft, textTransform: 'uppercase' },
  paymentValue: { fontFamily: 'Courier', fontSize: 11, color: COLORS.ink },
  qrBlock: { width: 140, alignItems: 'center' },
  qrImage: { width: 130, height: 130 },
  qrCaption: { fontFamily: 'Helvetica', fontSize: 8, letterSpacing: 1.4, color: COLORS.inkSoft, textTransform: 'uppercase', marginTop: 6, textAlign: 'center' },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 56,
    right: 56,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#1F252420',
  },
  footerLine: { fontFamily: 'Helvetica', fontSize: 8, letterSpacing: 1.4, color: '#1F2524', opacity: 0.55, textTransform: 'uppercase', textAlign: 'center' },
  // Note (non-VAT issuer disclosure)
  nonVatNote: {
    marginTop: 16,
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#1F252430',
    backgroundColor: '#F5EFE280',
  },
  nonVatNoteText: { fontFamily: 'Helvetica-Oblique', fontSize: 9, color: COLORS.inkSoft, lineHeight: 1.4 },
})

export interface InvoicePdfData {
  order: Order
  issuer: IssuerSettings & { key: string }
  qrPngDataUrl?: string
  eventName?: string
  isProforma?: boolean
}

function formatCzk(value: number): string {
  return new Intl.NumberFormat('cs-CZ', { style: 'decimal', maximumFractionDigits: 0 })
    .format(value)
    .replace(/ /g, ' ') + ' Kč'
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${d.getFullYear()}`
}

export function InvoicePdf({ order, issuer, qrPngDataUrl, eventName, isProforma }: InvoicePdfData) {
  const itemDescription = `Vstupné · ${eventName || 'DaKl Networking'}`

  const baseTotal = order.total_czk
  const vatRate = issuer.vat_rate || 0
  const isVatPayer = issuer.is_vat_payer

  // For VAT-payer issuer: total INCLUDES 21 % VAT.
  //  baseAmount = total / 1.21; vatAmount = total - baseAmount.
  // For non-VAT issuer: total is total, no VAT breakdown.
  const baseAmount = isVatPayer ? Math.round(baseTotal / (1 + vatRate / 100)) : baseTotal
  const vatAmount = isVatPayer ? baseTotal - baseAmount : 0
  const unitPriceBase = isVatPayer ? Math.round(order.unit_price_czk / (1 + vatRate / 100)) : order.unit_price_czk

  const orderNumber = order.order_number
  const issuedDate = order.invoice_issued_at ?? order.paid_at ?? order.created_at
  const dueDate = order.invoice_due_at

  const documentTitle = isProforma ? 'Zálohová faktura' : 'Faktura'

  return (
    <Document title={`${documentTitle} ${orderNumber}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.brandBlock}>
            <Text style={styles.brandTitle}>DaKl Networking</Text>
            <Text style={styles.brandSub}>Pražské vydání · Ročník IV · 2026</Text>
          </View>
          <View style={styles.invoiceMetaBlock}>
            <Text style={styles.invoiceLabel}>{documentTitle} č.</Text>
            <Text style={styles.invoiceNumber}>{order.invoice_number ?? orderNumber}</Text>
            <Text style={styles.invoiceMeta}>Vystaveno: {formatDate(issuedDate)}</Text>
            {dueDate && <Text style={styles.invoiceMeta}>Splatnost: {formatDate(dueDate)}</Text>}
            <Text style={styles.invoiceMeta}>Variabilní symbol: {orderNumber.replace(/\D/g, '')}</Text>
          </View>
        </View>

        <View style={styles.hairlineThick} />

        {/* Parties */}
        <View style={[styles.partiesRow, { marginTop: 24 }]}>
          <View style={styles.party}>
            <Text style={styles.partyTitle}>§ Dodavatel</Text>
            <Text style={styles.partyName}>{issuer.name}</Text>
            <Text style={styles.partyLine}>{issuer.address_street}</Text>
            <Text style={styles.partyLine}>
              {issuer.address_zip} {issuer.address_city}, {issuer.address_country}
            </Text>
            <Text style={styles.partyMono}>IČO: {issuer.ico}</Text>
            {issuer.dic ? (
              <Text style={styles.partyMono}>DIČ: {issuer.dic}</Text>
            ) : (
              <Text style={[styles.partyMono, { fontFamily: 'Helvetica-Oblique' }]}>Neplátce DPH</Text>
            )}
            {issuer.email && <Text style={[styles.partyMono, { marginTop: 4 }]}>{issuer.email}</Text>}
          </View>
          <View style={styles.party}>
            <Text style={styles.partyTitle}>§ Odběratel</Text>
            {order.is_company && order.company_name ? (
              <>
                <Text style={styles.partyName}>{order.company_name}</Text>
                <Text style={styles.partyLine}>
                  {order.customer_first_name} {order.customer_last_name}
                </Text>
              </>
            ) : (
              <Text style={styles.partyName}>
                {order.customer_first_name} {order.customer_last_name}
              </Text>
            )}
            {order.billing_address && <Text style={styles.partyLine}>{order.billing_address}</Text>}
            {(order.billing_zip || order.billing_city) && (
              <Text style={styles.partyLine}>
                {order.billing_zip} {order.billing_city}, {order.billing_country || 'CZ'}
              </Text>
            )}
            {order.company_ico && <Text style={styles.partyMono}>IČO: {order.company_ico}</Text>}
            {order.company_dic && <Text style={styles.partyMono}>DIČ: {order.company_dic}</Text>}
            <Text style={[styles.partyMono, { marginTop: 4 }]}>{order.customer_email}</Text>
          </View>
        </View>

        {/* Line items */}
        <View style={styles.lineItemsHeader}>
          <Text style={[styles.lineItemsHeaderCell, styles.cellDescription]}>Popis</Text>
          <Text style={[styles.lineItemsHeaderCell, styles.cellQty]}>Ks</Text>
          <Text style={[styles.lineItemsHeaderCell, styles.cellUnit]}>
            Cena {isVatPayer ? 'bez DPH' : ''}
          </Text>
          <Text style={[styles.lineItemsHeaderCell, styles.cellSubtotal]}>Celkem</Text>
        </View>
        <View style={styles.lineRow}>
          <View style={styles.cellDescription}>
            <Text style={styles.cellMain}>{itemDescription}</Text>
            <Text style={styles.cellSub}>Objednávka {orderNumber}</Text>
          </View>
          <Text style={[styles.cellMain, styles.cellQty]}>{order.quantity}×</Text>
          <Text style={[styles.cellMain, styles.cellUnit]}>{formatCzk(unitPriceBase)}</Text>
          <Text style={[styles.cellMain, styles.cellSubtotal]}>{formatCzk(unitPriceBase * order.quantity)}</Text>
        </View>

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalsTable}>
            {isVatPayer ? (
              <>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Základ</Text>
                  <Text style={styles.totalsValue}>{formatCzk(baseAmount)}</Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>DPH {vatRate} %</Text>
                  <Text style={styles.totalsValue}>{formatCzk(vatAmount)}</Text>
                </View>
              </>
            ) : (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Mezisoučet</Text>
                <Text style={styles.totalsValue}>{formatCzk(baseTotal)}</Text>
              </View>
            )}
            <View style={styles.totalsGrand}>
              <Text style={styles.totalsGrandLabel}>K úhradě</Text>
              <Text style={styles.totalsGrandValue}>{formatCzk(baseTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Non-VAT note */}
        {!isVatPayer && (
          <View style={styles.nonVatNote}>
            <Text style={styles.nonVatNoteText}>
              Dodavatel není plátcem DPH. Faktura je vystavena bez DPH dle § 6 zákona č. 235/2004 Sb.
            </Text>
          </View>
        )}

        {/* Payment + QR */}
        <View style={styles.paymentBlock}>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>§ Platba</Text>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Účet</Text>
              <Text style={styles.paymentValue}>{issuer.bank_account}/{issuer.bank_code}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>IBAN</Text>
              <Text style={styles.paymentValue}>{issuer.bank_iban}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Variabilní symbol</Text>
              <Text style={styles.paymentValue}>{orderNumber.replace(/\D/g, '')}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Forma úhrady</Text>
              <Text style={styles.paymentValue}>
                {order.payment_method === 'qr_comgate' ? 'Karta / QR' : 'Bankovní převod'}
              </Text>
            </View>
            {dueDate && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Splatnost</Text>
                <Text style={styles.paymentValue}>{formatDate(dueDate)}</Text>
              </View>
            )}
          </View>

          {qrPngDataUrl && (
            <View style={styles.qrBlock}>
              <PdfImage src={qrPngDataUrl} style={styles.qrImage} />
              <Text style={styles.qrCaption}>Naskenuj v bankovní aplikaci</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLine}>
            {documentTitle} {orderNumber} · Vystaveno digitálně · DaKl Networking · Praha · MMXXVI
          </Text>
        </View>
      </Page>
    </Document>
  )
}
