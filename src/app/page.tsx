import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/home/HeroSection'
import { PrinciplesSection } from '@/components/home/PrinciplesSection'
import { FeaturedEventSection } from '@/components/home/FeaturedEventSection'
import { CalendarSection } from '@/components/home/CalendarSection'
import { OrganizerSection } from '@/components/home/OrganizerSection'
import { BonumSection } from '@/components/home/BonumSection'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import type { Event } from '@/types/database'

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
  short_description:
    'Loď, jídlo, pití, DJs, beachvolejbal, paddleboardy. Jeden večer, 150 lidí, co něco dělají.',
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
  hero_image_url:
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80',
  status: 'published',
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  created_by: null,
}

const LIVE_UNTIL = '2026-04-26T00:00:00+02:00'

const calendarEvents: Event[] = [
  featuredEvent,
  {
    ...featuredEvent,
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
    short_description: null,
    program_json: null,
    hero_image_url: null,
    status: 'archived',
  },
  {
    ...featuredEvent,
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
    short_description: null,
    program_json: null,
    hero_image_url: null,
    status: 'archived',
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
          ctaLabel="PŘIHLÁSIT NA 24.4. →"
          nextEventDate={featuredEvent.starts_at}
          nextEventVenue="Kayak Beach Bar · 24.04.26"
          liveUntilDate={LIVE_UNTIL}
        />
        <FeaturedEventSection event={featuredEvent} soldCount={113} />
        <PrinciplesSection />
        <CalendarSection events={calendarEvents} />
        <OrganizerSection />
        <BonumSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
