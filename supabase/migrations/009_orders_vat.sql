-- =========================================================================
-- ORDERS — VAT payer flag + issuer snapshot + payment QR
-- =========================================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_is_vat_payer BOOLEAN,
  ADD COLUMN IF NOT EXISTS issuer_key VARCHAR(20),
  ADD COLUMN IF NOT EXISTS issuer_snapshot JSONB,
  ADD COLUMN IF NOT EXISTS qr_payment_string TEXT,
  ADD COLUMN IF NOT EXISTS invoice_issued_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS invoice_due_at TIMESTAMPTZ;

COMMENT ON COLUMN orders.customer_is_vat_payer IS 'Whether the customer registered as a VAT payer in checkout. Drives issuer_key selection.';
COMMENT ON COLUMN orders.issuer_key IS 'Key into settings table: issuer_payer | issuer_nonpayer';
COMMENT ON COLUMN orders.issuer_snapshot IS 'Frozen copy of issuer settings at the time the invoice was generated, so subsequent settings edits do not retroactively alter past invoices.';
COMMENT ON COLUMN orders.qr_payment_string IS 'SPAYD format string used to render the bank-transfer QR code (storeable for re-render).';
