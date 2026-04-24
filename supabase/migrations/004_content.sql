-- =========================================================================
-- CONTENT: Articles, Media, Testimonials, Podcast, Settings
-- =========================================================================

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  excerpt TEXT,
  content_md TEXT NOT NULL,

  category VARCHAR(50), -- 'newsletter', 'clanek', 'recap', 'rozhovor'
  related_event_id UUID REFERENCES events(id),

  author_name VARCHAR(100) DEFAULT 'David Kladišovský',
  author_photo_url TEXT,

  cover_image_url TEXT,
  og_image_url TEXT,

  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMPTZ,

  meta_title VARCHAR(200),
  meta_description VARCHAR(300),

  reading_time_minutes INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_articles_status_published ON articles(status, published_at DESC);

-- Media library
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename VARCHAR(200),
  mime_type VARCHAR(50),
  size_bytes BIGINT,
  width INTEGER,
  height INTEGER,

  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  alt_text VARCHAR(300),
  photographer VARCHAR(100),
  taken_at TIMESTAMPTZ,
  tags TEXT[],

  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_media_event_id ON media(event_id);

-- Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_role VARCHAR(100),
  author_photo_url TEXT,

  related_event_id UUID REFERENCES events(id),
  related_event_type VARCHAR(50),

  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Podcast episodes
CREATE TABLE podcast_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  episode_number INTEGER,

  youtube_url TEXT,
  spotify_url TEXT,
  apple_podcasts_url TEXT,

  cover_image_url TEXT,

  published_at TIMESTAMPTZ,
  duration_seconds INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Key-value settings
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings
INSERT INTO settings (key, value) VALUES
  ('invoice_series', '{"prefix": "CN-2026-", "current": 0}'::JSONB),
  ('company_info', '{"name": "Conventus s.r.o.", "ico": "", "dic": "", "address": "", "bank_account": "", "bank_code": ""}'::JSONB);
