import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { IssueCoverSection } from '@/components/home/IssueCoverSection'
import { AftermathSection } from '@/components/home/AftermathSection'
import { PrinciplesSection } from '@/components/home/PrinciplesSection'
import { ArchiveIndexSection } from '@/components/home/ArchiveIndexSection'
import { OrganizerSection } from '@/components/home/OrganizerSection'
import { BonumSection } from '@/components/home/BonumSection'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import type { Event } from '@/types/database'

const baseEvent = {
  meta_title: null,
  meta_description: null,
  og_image_url: null,
  hero_image_url: null,
  long_description: null,
  program_json: null,
  location_gps_lat: null,
  location_gps_lng: null,
  published_at: null,
  created_at: '2025-12-01T00:00:00Z',
  updated_at: '2026-04-25T00:00:00Z',
  created_by: null,
} as const

const calendarEvents: Event[] = [
  {
    ...baseEvent,
    id: 'next',
    slug: 'pripravujeme',
    name: 'Příští vydání',
    type: 'jine',
    starts_at: '2099-01-01T18:00:00+02:00',
    ends_at: '2099-01-01T23:00:00+02:00',
    location_name: 'TBA',
    location_address: 'Praha',
    price_czk: 0,
    capacity: 150,
    short_description: 'Datum oznámíme přihlášeným odběratelům jako prvním.',
    status: 'draft',
  },
  {
    ...baseEvent,
    id: '1',
    slug: 'kayak-beach-bar',
    name: 'Neřízený networking na lodi',
    type: 'lod',
    starts_at: '2026-04-24T15:00:00+02:00',
    ends_at: '2026-04-24T23:30:00+02:00',
    location_name: 'Kayak Beach Bar',
    location_address: 'Náplavka, Železniční most, Praha 2',
    price_czk: 2290,
    capacity: 150,
    short_description: 'Loď, jídlo, pití, DJs, beachvolejbal, paddleboardy. Jeden večer, 150 lidí, co něco dělají.',
    status: 'archived',
  },
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
    short_description: null,
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
    short_description: null,
    status: 'archived',
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar ctaHref="#odber" ctaLabel="Odebírat" />
      <main>
        <IssueCoverSection issue="04" edition="Duben 2026" />
        <AftermathSection />
        <PrinciplesSection />
        <ArchiveIndexSection events={calendarEvents} />
        <OrganizerSection />
        <BonumSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
