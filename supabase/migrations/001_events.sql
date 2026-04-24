-- =========================================================================
-- EVENTS & TICKETING
-- =========================================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'lod', 'vino', 'more', 'garden', 'jine'

  -- Datum a místo
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  location_name VARCHAR(200),
  location_address TEXT,
  location_gps_lat DECIMAL(10, 7),
  location_gps_lng DECIMAL(10, 7),

  -- Cena a kapacita
  price_czk INTEGER NOT NULL,
  capacity INTEGER NOT NULL,

  -- Obsah (rich text markdown)
  short_description TEXT,
  long_description TEXT,
  program_json JSONB, -- [{time: "15:00", title: "Příchod", description: "..."}]

  -- SEO
  meta_title VARCHAR(200),
  meta_description VARCHAR(300),
  og_image_url TEXT,
  hero_image_url TEXT,

  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived', 'cancelled'
  published_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_events_status_starts_at ON events(status, starts_at);
CREATE INDEX idx_events_slug ON events(slug);

-- Lineup / hosté per event
CREATE TABLE event_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  role VARCHAR(100),
  bio TEXT,
  photo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ per event (+ shared FAQ)
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE, -- NULL = global FAQ
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50), -- 'o_akcich', 'platba', 'storno', 'tech', 'partneri'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
