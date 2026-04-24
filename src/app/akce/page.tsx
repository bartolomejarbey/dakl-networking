import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { EventList } from '@/components/event/EventList'
import type { Event } from '@/types/database'

// Hardcoded data for now — will be replaced with Supabase queries once connected
const baseEvent: Event = {
  id: '1',
  slug: 'kayak-beach-bar',
  name: 'Nerizeny networking na lodi',
  type: 'lod',
  starts_at: '2026-04-24T15:00:00+02:00',
  ends_at: '2026-04-24T23:30:00+02:00',
  location_name: 'Kayak Beach Bar',
  location_address: 'Naplavka, Zeleznicni most, Praha 2',
  location_gps_lat: null,
  location_gps_lng: null,
  price_czk: 2290,
  capacity: 150,
  short_description: 'Jedny z nejlepsich ROI business akci v CR. Lod, jidlo, piti, DJs, beachvolejbal, paddleboardy.',
  long_description: null,
  program_json: null,
  meta_title: null,
  meta_description: null,
  og_image_url: null,
  hero_image_url: null,
  status: 'published',
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  created_by: null,
}

const allEvents: Event[] = [
  baseEvent,
  {
    ...baseEvent,
    id: '2',
    slug: 'degustace-vin-znojmo',
    name: 'Degustace vin z Moravy — Znojmo',
    type: 'vino',
    starts_at: '2026-05-22T17:00:00+02:00',
    ends_at: '2026-05-22T23:00:00+02:00',
    location_name: 'Vinny sklep',
    location_address: 'Znojmo',
    price_czk: 1890,
    capacity: 80,
    status: 'draft',
  },
  {
    ...baseEvent,
    id: '3',
    slug: 'morske-plody-pobrezni',
    name: 'Degustace morskych plodu — Pobrezni',
    type: 'more',
    starts_at: '2026-06-19T18:00:00+02:00',
    ends_at: '2026-06-19T23:00:00+02:00',
    location_name: 'Pobrezni',
    location_address: 'Pobrezni, Praha 8',
    price_czk: 2490,
    capacity: 100,
    status: 'draft',
  },
  {
    ...baseEvent,
    id: '4',
    slug: 'garden-party-rooftop',
    name: 'Garden party na strese',
    type: 'garden',
    starts_at: '2026-07-17T16:00:00+02:00',
    ends_at: '2026-07-17T23:00:00+02:00',
    location_name: 'Rooftop',
    location_address: 'Praha — Upresnime',
    price_czk: 1990,
    capacity: 120,
    status: 'draft',
  },
  {
    ...baseEvent,
    id: '5',
    slug: 'prvni-lod-podoli',
    name: 'Prvni lod roku — Podoli',
    type: 'lod',
    starts_at: '2026-03-21T16:00:00+01:00',
    ends_at: '2026-03-21T23:00:00+01:00',
    location_name: 'Podoli',
    location_address: 'Podoli, Praha 4',
    price_czk: 2190,
    capacity: 150,
    status: 'archived',
  },
  {
    ...baseEvent,
    id: '6',
    slug: 'zimni-degustace-vinohrady',
    name: 'Zimni degustace vin — Vinohrady',
    type: 'vino',
    starts_at: '2026-02-15T18:00:00+01:00',
    ends_at: '2026-02-15T23:00:00+01:00',
    location_name: 'Vinohrady',
    location_address: 'Vinohrady, Praha 2',
    price_czk: 1890,
    capacity: 150,
    status: 'archived',
  },
  {
    ...baseEvent,
    id: '7',
    slug: 'first-meeting-2026',
    name: 'First meeting 2026 — Letna',
    type: 'jine',
    starts_at: '2026-01-18T17:00:00+01:00',
    ends_at: '2026-01-18T23:00:00+01:00',
    location_name: 'Letna',
    location_address: 'Letna, Praha 7',
    price_czk: 2290,
    capacity: 150,
    status: 'archived',
  },
  {
    ...baseEvent,
    id: '8',
    slug: 'vanocni-dinner-karlin',
    name: 'Vanocni dinner — Karlin',
    type: 'jine',
    starts_at: '2025-12-08T18:00:00+01:00',
    ends_at: '2025-12-08T23:00:00+01:00',
    location_name: 'Karlin',
    location_address: 'Karlin, Praha 8',
    price_czk: 2490,
    capacity: 150,
    status: 'archived',
  },
]

export default function AkcePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero section */}
        <section className="bg-forest pt-[140px] pb-20 lg:pb-28">
          <Container>
            <h1 className="font-serif text-cream text-[clamp(40px,5.2vw,72px)] leading-[1.08] max-w-[900px]">
              Co se deje. Co bylo. Kam prijdes.
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/70 mt-6">
              47 akci za 3 roky. Kazda jina. Kazda stoji za to.
            </p>
          </Container>
        </section>

        {/* Event list with filters */}
        <section className="bg-cream py-16 lg:py-24">
          <Container>
            <EventList events={allEvents} />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
