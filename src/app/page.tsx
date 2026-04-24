import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { PrinciplesSection } from '@/components/home/PrinciplesSection'
import { FeaturedEventSection } from '@/components/home/FeaturedEventSection'
import { CalendarSection } from '@/components/home/CalendarSection'
import { StatsSection } from '@/components/home/StatsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { OrganizerSection } from '@/components/home/OrganizerSection'
import { BonumSection } from '@/components/home/BonumSection'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import type { Event, Testimonial } from '@/types/database'

// Hardcoded data for now — will be replaced with Supabase queries once connected
const featuredEvent: Event = {
  id: '1',
  slug: 'kayak-beach-bar',
  name: 'Neřízený networking na lodi',
  type: 'lod',
  starts_at: '2026-04-24T15:00:00+02:00',
  ends_at: '2026-04-24T23:30:00+02:00',
  location_name: 'Kayak Beach Bar',
  location_address: 'Náplavka, Železniční most, Praha 2',
  location_gps_lat: null,
  location_gps_lng: null,
  price_czk: 2290,
  capacity: 150,
  short_description: 'Jedny z nejlepších ROI business akcí v ČR. Loď, jídlo, pití, DJs, beachvolejbal, paddleboardy.',
  long_description: null,
  program_json: [
    { time: '15:00', title: 'Příchod a registrace', description: 'Welcome drink, check-in' },
    { time: '15:30', title: 'Jídlo a pití', description: 'Alko i nealko, vše v ceně' },
    { time: '16:00', title: 'DJs', description: 'Od chill odpoledních beatů po taneční večer' },
    { time: '16:30', title: 'Aktivity', description: 'Beachvolejbal, paddleboardy, kajaky, motorový člun' },
    { time: '20:00', title: 'Networking peak', description: 'Hlavní vlna networkingu' },
    { time: '23:30', title: 'Konec', description: 'Děkujeme a těšíme se příště' },
  ],
  meta_title: null,
  meta_description: null,
  og_image_url: null,
  hero_image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80',
  status: 'published',
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  created_by: null,
}

const calendarEvents: Event[] = [
  featuredEvent,
  {
    ...featuredEvent,
    id: '2',
    slug: 'degustace-vin-znojmo',
    name: 'Degustace vín z Moravy — Znojmo',
    type: 'vino',
    starts_at: '2026-05-22T17:00:00+02:00',
    ends_at: '2026-05-22T23:00:00+02:00',
    location_name: 'Vinný sklep',
    location_address: 'Znojmo',
    price_czk: 1890,
    capacity: 80,
    status: 'draft',
    hero_image_url: null,
  },
  {
    ...featuredEvent,
    id: '3',
    slug: 'morske-plody-pobrezni',
    name: 'Degustace mořských plodů — Pobřežní',
    type: 'more',
    starts_at: '2026-06-19T18:00:00+02:00',
    ends_at: '2026-06-19T23:00:00+02:00',
    location_name: 'Pobřežní',
    location_address: 'Pobřežní, Praha 8',
    price_czk: 2490,
    capacity: 100,
    status: 'draft',
    hero_image_url: null,
  },
  {
    ...featuredEvent,
    id: '4',
    slug: 'garden-party-rooftop',
    name: 'Garden party na střeše',
    type: 'garden',
    starts_at: '2026-07-17T16:00:00+02:00',
    ends_at: '2026-07-17T23:00:00+02:00',
    location_name: 'Rooftop',
    location_address: 'Praha — Upřesníme',
    price_czk: 1990,
    capacity: 120,
    status: 'draft',
    hero_image_url: null,
  },
  {
    ...featuredEvent,
    id: '5',
    slug: 'prvni-lod-podoli',
    name: 'První loď roku — Podolí',
    type: 'lod',
    starts_at: '2026-03-21T16:00:00+01:00',
    ends_at: '2026-03-21T23:00:00+01:00',
    location_name: 'Podolí',
    location_address: 'Podolí, Praha 4',
    price_czk: 2190,
    capacity: 150,
    status: 'archived',
    hero_image_url: null,
  },
  {
    ...featuredEvent,
    id: '6',
    slug: 'zimni-degustace-vinohrady',
    name: 'Zimní degustace vín — Vinohrady',
    type: 'vino',
    starts_at: '2026-02-15T18:00:00+01:00',
    ends_at: '2026-02-15T23:00:00+01:00',
    location_name: 'Vinohrady',
    location_address: 'Vinohrady, Praha 2',
    price_czk: 1890,
    capacity: 150,
    status: 'archived',
    hero_image_url: null,
  },
  {
    ...featuredEvent,
    id: '7',
    slug: 'first-meeting-2026',
    name: 'First meeting 2026 — Letná',
    type: 'jine',
    starts_at: '2026-01-18T17:00:00+01:00',
    ends_at: '2026-01-18T23:00:00+01:00',
    location_name: 'Letná',
    location_address: 'Letná, Praha 7',
    price_czk: 2290,
    capacity: 150,
    status: 'archived',
    hero_image_url: null,
  },
  {
    ...featuredEvent,
    id: '8',
    slug: 'vanocni-dinner-karlin',
    name: 'Vánoční dinner — Karlín',
    type: 'jine',
    starts_at: '2025-12-08T18:00:00+01:00',
    ends_at: '2025-12-08T23:00:00+01:00',
    location_name: 'Karlín',
    location_address: 'Karlín, Praha 8',
    price_czk: 2490,
    capacity: 150,
    status: 'archived',
    hero_image_url: null,
  },
]

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'Přišel jsem poznat dva investory. Odešel jsem s kontakty na pět. Nejlepší cena–výkon poměr za posledních deset let v byznysu.',
    author_name: 'Martin H.',
    author_role: 'zakladatel SaaS firmy',
    author_photo_url: null,
    related_event_id: null,
    related_event_type: null,
    is_published: true,
    is_featured: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    quote: 'Byla jsem skeptická. „Další networking." Po čtvrt hodině jsem věděla, že tohle je jiné. Na Conventu se lidi filtrují jinak.',
    author_name: 'Eva B.',
    author_role: 'CEO agentury',
    author_photo_url: null,
    related_event_id: null,
    related_event_type: null,
    is_published: true,
    is_featured: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    quote: 'Jednou za měsíc si dám dovolenou na den, jedu do Prahy, jdu na Conventus. Za tři roky jsem z toho udělal slušnou část obratu.',
    author_name: 'Petr V.',
    author_role: 'majitel výrobní firmy',
    author_photo_url: null,
    related_event_id: null,
    related_event_type: null,
    is_published: true,
    is_featured: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar
        ctaHref="/akce/kayak-beach-bar/prihlaska"
        ctaLabel="Přihlásit na 24.4."
      />
      <main>
        <HeroSection
          ctaHref="/akce/kayak-beach-bar/prihlaska"
          ctaLabel="Přihlásit na 24.4."
          nextEventDate="2026-04-24T15:00:00+02:00"
          nextEventVenue="Kayak Beach Bar · 24.04.26"
        />
        <PrinciplesSection />
        <FeaturedEventSection event={featuredEvent} soldCount={113} />
        <CalendarSection events={calendarEvents} />
        <StatsSection />
        <TestimonialsSection testimonials={testimonials} />
        <OrganizerSection />
        <BonumSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
