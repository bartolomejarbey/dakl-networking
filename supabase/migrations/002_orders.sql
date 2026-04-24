-- =========================================================================
-- ORDERS & PAYMENTS
-- =========================================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL, -- 'CN-2026-0001'
  event_id UUID REFERENCES events(id),

  -- Zákazník
  customer_email VARCHAR(200) NOT NULL,
  customer_first_name VARCHAR(100) NOT NULL,
  customer_last_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(30),
  preferred_language VARCHAR(5) DEFAULT 'cs',

  -- Fakturace
  is_company BOOLEAN DEFAULT FALSE,
  company_name VARCHAR(200),
  company_ico VARCHAR(20),
  company_dic VARCHAR(20),
  billing_address TEXT,
  billing_city VARCHAR(100),
  billing_zip VARCHAR(10),
  billing_country VARCHAR(2) DEFAULT 'CZ',

  -- Objednávka
  quantity INTEGER DEFAULT 1,
  unit_price_czk INTEGER NOT NULL,
  total_czk INTEGER NOT NULL,

  -- Dodatečné info
  dietary_restrictions VARCHAR(50),
  source VARCHAR(50), -- 'instagram', 'linkedin', 'pritel', 'google', 'jine'
  customer_note TEXT,

  -- Platba
  payment_method VARCHAR(20) NOT NULL, -- 'qr_comgate', 'bank_transfer'
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded', 'cancelled'
  paid_at TIMESTAMPTZ,
  comgate_transaction_id VARCHAR(100),

  -- Faktura
  invoice_number VARCHAR(20),
  invoice_pdf_url TEXT,
  proforma_pdf_url TEXT,

  -- Consents
  agreed_terms BOOLEAN NOT NULL,
  agreed_gdpr BOOLEAN NOT NULL,
  agreed_newsletter BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_orders_event_id ON orders(event_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Audit log per order
CREATE TABLE order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'created', 'payment_initiated', 'paid', 'invoice_sent', 'refunded', 'note_added'
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);
