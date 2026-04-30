const TOKEN = process.env.SUPABASE_ACCESS_TOKEN
if (!TOKEN) { console.error('Missing SUPABASE_ACCESS_TOKEN'); process.exit(1) }
const API = `https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_REF || 'pozlwuuakouzaiumamzy'}/database/query`

const queries = [
  ['issuer settings', `SELECT key FROM settings WHERE key LIKE 'issuer_%' ORDER BY key`],
  ['new order columns', `SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name IN ('customer_is_vat_payer','issuer_key','issuer_snapshot','qr_payment_string','invoice_issued_at','invoice_due_at') ORDER BY column_name`],
  ['crm tables', `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('customer_tags','customer_notes','follow_ups') ORDER BY table_name`],
  ['customer_overview view', `SELECT table_name FROM information_schema.views WHERE table_schema='public' AND table_name='customer_overview'`],
  ['invoices bucket', `SELECT id, public, file_size_limit FROM storage.buckets WHERE id='invoices'`],
]

for (const [label, sql] of queries) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  })
  const data = await res.json()
  console.log(`[${label}]`, JSON.stringify(data))
}
