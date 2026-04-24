import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { EventList } from '@/components/event/EventList'
import type { Event } from '@/types/database'

const baseEvent: Event = {
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
  short_description:
    'Loď, jídlo, pití, DJs, beachvolejbal, paddleboardy. Jeden večer, 150 lidí, co něco dělají.',
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
    slug: 'ochutnavka-morskych-plodu',
    name: 'Ochutnávka mořských plodů',
    type: 'more',
    starts_at: '2026-03-23T18:00:00+01:00',
    ends_at: '2026-03-23T23:00:00+01:00',
    location_name: 'Praha',
    location_address: 'Praha',
    price_czk: 2490,
    capacity: 100,
    status: 'archived',
  },
  {
    ...baseEvent,
    id: '3',
    slug: 'degustace-vina-wood-and-steak',
    name: 'Degustace vína',
    type: 'vino',
    starts_at: '2026-02-26T18:00:00+01:00',
    ends_at: '2026-02-26T23:00:00+01:00',
    location_name: 'Wood and Steak',
    location_address: 'Praha',
    price_czk: 1890,
    capacity: 60,
    status: 'archived',
  },
]

export default function AkcePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-forest pt-[140px] pb-20 lg:pb-28">
          <Container>
            <h1 className="font-serif text-cream text-[clamp(40px,5.2vw,72px)] leading-[1.08] max-w-[900px]">
              Co se děje. Co bylo. Kam přijdeš.
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/70 mt-6">
              DaKl Networking · Praha · 2026
            </p>
          </Container>
        </section>

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
