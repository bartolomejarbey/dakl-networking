export type Database = {
  public: {
    Tables: {
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Event, 'id'>>
      }
      event_guests: {
        Row: EventGuest
        Insert: Omit<EventGuest, 'id' | 'created_at'>
        Update: Partial<Omit<EventGuest, 'id'>>
      }
      faqs: {
        Row: FAQ
        Insert: Omit<FAQ, 'id' | 'created_at'>
        Update: Partial<Omit<FAQ, 'id'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Order, 'id'>>
      }
      order_events: {
        Row: OrderEvent
        Insert: Omit<OrderEvent, 'id' | 'created_at'>
        Update: Partial<Omit<OrderEvent, 'id'>>
      }
      newsletter_subscribers: {
        Row: NewsletterSubscriber
        Insert: Omit<NewsletterSubscriber, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NewsletterSubscriber, 'id'>>
      }
      newsletter_campaigns: {
        Row: NewsletterCampaign
        Insert: Omit<NewsletterCampaign, 'id' | 'created_at'>
        Update: Partial<Omit<NewsletterCampaign, 'id'>>
      }
      articles: {
        Row: Article
        Insert: Omit<Article, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Article, 'id'>>
      }
      media: {
        Row: Media
        Insert: Omit<Media, 'id' | 'created_at'>
        Update: Partial<Omit<Media, 'id'>>
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, 'id' | 'created_at'>
        Update: Partial<Omit<Testimonial, 'id'>>
      }
      podcast_episodes: {
        Row: PodcastEpisode
        Insert: Omit<PodcastEpisode, 'id' | 'created_at'>
        Update: Partial<Omit<PodcastEpisode, 'id'>>
      }
      settings: {
        Row: Setting
        Insert: Setting
        Update: Partial<Setting>
      }
      customer_tags: {
        Row: CustomerTag
        Insert: Omit<CustomerTag, 'id' | 'created_at'>
        Update: Partial<Omit<CustomerTag, 'id'>>
      }
      customer_notes: {
        Row: CustomerNote
        Insert: Omit<CustomerNote, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CustomerNote, 'id'>>
      }
      follow_ups: {
        Row: FollowUp
        Insert: Omit<FollowUp, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<FollowUp, 'id'>>
      }
    }
    Views: {
      customer_overview: {
        Row: CustomerOverview
      }
    }
    Functions: {
      reserve_spots: {
        Args: { p_event_id: string; p_quantity: number }
        Returns: boolean
      }
      next_order_number: {
        Args: Record<string, never>
        Returns: string
      }
      get_availability: {
        Args: { p_event_id: string }
        Returns: { capacity: number; sold: number; available: number }[]
      }
    }
  }
}

export type Event = {
  id: string
  slug: string
  name: string
  type: EventType
  starts_at: string
  ends_at: string
  location_name: string | null
  location_address: string | null
  location_gps_lat: number | null
  location_gps_lng: number | null
  price_czk: number
  capacity: number
  short_description: string | null
  long_description: string | null
  program_json: ProgramItem[] | null
  meta_title: string | null
  meta_description: string | null
  og_image_url: string | null
  hero_image_url: string | null
  status: EventStatus
  published_at: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export type EventType = 'lod' | 'vino' | 'more' | 'garden' | 'jine'

export type EventStatus = 'draft' | 'published' | 'archived' | 'cancelled'

export type ProgramItem = {
  time: string
  title: string
  description?: string
}

export type EventGuest = {
  id: string
  event_id: string
  name: string
  role: string | null
  bio: string | null
  photo_url: string | null
  sort_order: number
  created_at: string
}

export type FAQ = {
  id: string
  event_id: string | null
  question: string
  answer: string
  category: string | null
  sort_order: number
  created_at: string
}

export type Order = {
  id: string
  order_number: string
  event_id: string
  customer_email: string
  customer_first_name: string
  customer_last_name: string
  customer_phone: string | null
  preferred_language: string
  is_company: boolean
  company_name: string | null
  company_ico: string | null
  company_dic: string | null
  billing_address: string | null
  billing_city: string | null
  billing_zip: string | null
  billing_country: string
  quantity: number
  unit_price_czk: number
  total_czk: number
  dietary_restrictions: string | null
  source: string | null
  customer_note: string | null
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  paid_at: string | null
  comgate_transaction_id: string | null
  invoice_number: string | null
  invoice_pdf_url: string | null
  proforma_pdf_url: string | null
  customer_is_vat_payer: boolean | null
  issuer_key: 'issuer_payer' | 'issuer_nonpayer' | null
  issuer_snapshot: IssuerSettings | null
  qr_payment_string: string | null
  invoice_issued_at: string | null
  invoice_due_at: string | null
  agreed_terms: boolean
  agreed_gdpr: boolean
  agreed_newsletter: boolean
  created_at: string
  updated_at: string
  ip_address: string | null
  user_agent: string | null
}

export type IssuerSettings = {
  name: string
  ico: string
  dic: string | null
  address_street: string
  address_city: string
  address_zip: string
  address_country: string
  bank_account: string
  bank_code: string
  bank_iban: string
  is_vat_payer: boolean
  vat_rate: number
  email: string
  phone: string
}

export type CustomerTag = {
  id: string
  email: string
  tag: string
  color: string | null
  created_at: string
  created_by: string | null
}

export type CustomerNote = {
  id: string
  email: string
  body: string
  is_pinned: boolean
  created_at: string
  updated_at: string
  created_by: string | null
}

export type FollowUpStatus = 'pending' | 'done' | 'snoozed' | 'cancelled'

export type FollowUp = {
  id: string
  email: string
  order_id: string | null
  due_at: string
  subject: string
  body: string | null
  status: FollowUpStatus
  completed_at: string | null
  completion_note: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export type CustomerOverview = {
  email: string
  full_name: string | null
  phone: string | null
  order_count: number
  paid_order_count: number
  lifetime_value_czk: number
  last_order_at: string | null
  first_order_at: string | null
  has_company_orders: boolean | null
  is_vat_payer: boolean | null
  tags: string[]
}

export type PaymentMethod = 'qr_comgate' | 'bank_transfer'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'

export type OrderEvent = {
  id: string
  order_id: string
  event_type: string
  description: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  created_by: string | null
}

export type NewsletterSubscriber = {
  id: string
  email: string
  first_name: string | null
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced'
  source: string | null
  tags: string[] | null
  confirm_token: string | null
  confirmed_at: string | null
  unsubscribed_at: string | null
  created_at: string
  updated_at: string
}

export type NewsletterCampaign = {
  id: string
  subject: string
  preview_text: string | null
  content_md: string
  content_html: string | null
  segment_json: Record<string, unknown> | null
  scheduled_at: string | null
  sent_at: string | null
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
  recipients_count: number | null
  opened_count: number
  clicked_count: number
  publish_as_article: boolean
  article_slug: string | null
  published_at: string | null
  created_at: string
  created_by: string | null
}

export type Article = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content_md: string
  category: string | null
  related_event_id: string | null
  author_name: string
  author_photo_url: string | null
  cover_image_url: string | null
  og_image_url: string | null
  status: string
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  reading_time_minutes: number | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export type Media = {
  id: string
  url: string
  filename: string | null
  mime_type: string | null
  size_bytes: number | null
  width: number | null
  height: number | null
  event_id: string | null
  alt_text: string | null
  photographer: string | null
  taken_at: string | null
  tags: string[] | null
  is_featured: boolean
  sort_order: number
  created_at: string
  uploaded_by: string | null
}

export type Testimonial = {
  id: string
  quote: string
  author_name: string
  author_role: string | null
  author_photo_url: string | null
  related_event_id: string | null
  related_event_type: string | null
  is_published: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
}

export type PodcastEpisode = {
  id: string
  slug: string
  title: string
  description: string | null
  episode_number: number | null
  youtube_url: string | null
  spotify_url: string | null
  apple_podcasts_url: string | null
  cover_image_url: string | null
  published_at: string | null
  duration_seconds: number | null
  created_at: string
}

export type Setting = {
  key: string
  value: Record<string, unknown>
  updated_at: string
}
