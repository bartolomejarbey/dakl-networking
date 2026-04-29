-- =========================================================================
-- STORAGE — invoices bucket (private, admin-managed)
-- =========================================================================
-- Stores generated invoice and proforma PDFs. Service-role writes from API
-- routes; admins read via signed URLs from the dashboard.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('invoices', 'invoices', false, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE
  SET file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS on storage.objects: only admins can read; only service role writes
DROP POLICY IF EXISTS "admin_read_invoices" ON storage.objects;
CREATE POLICY "admin_read_invoices" ON storage.objects FOR SELECT USING (
  bucket_id = 'invoices'
  AND auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
);

-- Note: writes happen via Supabase service role client which bypasses RLS,
-- so no INSERT policy is needed here. Public reads are NEVER allowed.
