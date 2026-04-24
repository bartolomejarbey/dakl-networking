-- =========================================================================
-- NEWSLETTER
-- =========================================================================

CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(200) UNIQUE NOT NULL,
  first_name VARCHAR(100),

  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'active', 'unsubscribed', 'bounced'
  source VARCHAR(50), -- 'homepage_form', 'checkout', 'event_signup', 'manual'
  tags TEXT[],

  confirm_token VARCHAR(100),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Newsletter campaigns
CREATE TABLE newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject VARCHAR(300) NOT NULL,
  preview_text VARCHAR(300),
  content_md TEXT NOT NULL,
  content_html TEXT,

  segment_json JSONB,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,

  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed'
  recipients_count INTEGER,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,

  publish_as_article BOOLEAN DEFAULT FALSE,
  article_slug VARCHAR(100),
  published_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);
