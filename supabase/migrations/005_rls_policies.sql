-- =========================================================================
-- ROW LEVEL SECURITY POLICIES
-- =========================================================================

-- EVENTS: public reads published, admin CRUD
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_events" ON events
  FOR SELECT USING (status IN ('published', 'archived', 'cancelled'));

CREATE POLICY "admin_full_events" ON events
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- EVENT_GUESTS: public reads via published events
ALTER TABLE event_guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_event_guests" ON event_guests
  FOR SELECT USING (
    event_id IN (SELECT id FROM events WHERE status = 'published')
  );

CREATE POLICY "admin_full_event_guests" ON event_guests
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- FAQS: public reads all
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_faqs" ON faqs
  FOR SELECT USING (true);

CREATE POLICY "admin_full_faqs" ON faqs
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- ORDERS: admin only
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_orders" ON orders
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ORDER_EVENTS: admin only
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_order_events" ON order_events
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- NEWSLETTER: admin/editor only
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_only_newsletter" ON newsletter_subscribers
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- NEWSLETTER_CAMPAIGNS: admin/editor only
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_only_campaigns" ON newsletter_campaigns
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- ARTICLES: public reads published
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "admin_full_articles" ON articles
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- MEDIA: public reads all
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_media" ON media
  FOR SELECT USING (true);

CREATE POLICY "admin_full_media" ON media
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- TESTIMONIALS: public reads published
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_testimonials" ON testimonials
  FOR SELECT USING (is_published = true);

CREATE POLICY "admin_full_testimonials" ON testimonials
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- PODCAST_EPISODES: public reads all with published_at
ALTER TABLE podcast_episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_published_podcasts" ON podcast_episodes
  FOR SELECT USING (published_at IS NOT NULL);

CREATE POLICY "admin_full_podcasts" ON podcast_episodes
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' IN ('admin', 'editor')
    )
  );

-- SETTINGS: public reads, admin writes
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_settings" ON settings
  FOR SELECT USING (true);

CREATE POLICY "admin_write_settings" ON settings
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );
