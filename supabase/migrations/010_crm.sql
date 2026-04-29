-- =========================================================================
-- CRM — customer tags, notes, follow-ups + canonical customer view
-- =========================================================================
-- Email is the canonical customer identifier (no user accounts on the public
-- site). Admin-only RLS on all CRM tables.

CREATE TABLE customer_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  tag VARCHAR(40) NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(email, tag)
);

CREATE INDEX idx_customer_tags_email ON customer_tags(email);
CREATE INDEX idx_customer_tags_tag ON customer_tags(tag);

CREATE TABLE customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_customer_notes_email ON customer_notes(email, created_at DESC);
CREATE INDEX idx_customer_notes_pinned ON customer_notes(email, is_pinned) WHERE is_pinned = TRUE;

CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  due_at TIMESTAMPTZ NOT NULL,
  subject VARCHAR(200) NOT NULL,
  body TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  completion_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  CONSTRAINT follow_ups_status_check CHECK (status IN ('pending', 'done', 'snoozed', 'cancelled'))
);

CREATE INDEX idx_follow_ups_due ON follow_ups(status, due_at);
CREATE INDEX idx_follow_ups_email ON follow_ups(email);
CREATE INDEX idx_follow_ups_order ON follow_ups(order_id) WHERE order_id IS NOT NULL;

-- Canonical customer view: aggregates orders + tags
CREATE OR REPLACE VIEW customer_overview AS
SELECT
  o.customer_email AS email,
  MAX(o.customer_first_name || ' ' || o.customer_last_name) AS full_name,
  MAX(o.customer_phone) AS phone,
  COUNT(DISTINCT o.id) AS order_count,
  COUNT(DISTINCT o.id) FILTER (WHERE o.payment_status = 'paid') AS paid_order_count,
  COALESCE(SUM(o.total_czk) FILTER (WHERE o.payment_status = 'paid'), 0) AS lifetime_value_czk,
  MAX(o.created_at) AS last_order_at,
  MIN(o.created_at) AS first_order_at,
  BOOL_OR(o.is_company) AS has_company_orders,
  BOOL_OR(o.customer_is_vat_payer) AS is_vat_payer,
  COALESCE(
    ARRAY_AGG(DISTINCT t.tag) FILTER (WHERE t.tag IS NOT NULL),
    ARRAY[]::VARCHAR[]
  ) AS tags
FROM orders o
LEFT JOIN customer_tags t ON t.email = o.customer_email
GROUP BY o.customer_email;

-- RLS: admin-only access
ALTER TABLE customer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_tags" ON customer_tags FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
);

CREATE POLICY "admin_all_notes" ON customer_notes FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
);

CREATE POLICY "admin_all_followups" ON follow_ups FOR ALL USING (
  auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
);

-- Trigger: auto-update updated_at on customer_notes + follow_ups
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_customer_notes_updated_at
  BEFORE UPDATE ON customer_notes
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_follow_ups_updated_at
  BEFORE UPDATE ON follow_ups
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
