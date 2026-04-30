import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { IssueCoverSection } from '@/components/home/IssueCoverSection'
import { AftermathSection } from '@/components/home/AftermathSection'
import { PrinciplesSection } from '@/components/home/PrinciplesSection'
import { ArchiveIndexSection } from '@/components/home/ArchiveIndexSection'
import { OrganizerSection } from '@/components/home/OrganizerSection'
import { BonumSection } from '@/components/home/BonumSection'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { listPublicEvents } from '@/lib/events/queries'
import type { Event } from '@/types/database'

export const revalidate = 60

const NEXT_PLACEHOLDER: Event = {
  id: 'next',
  slug: 'pripravujeme',
  name: 'Příští vydání',
  type: 'jine',
  starts_at: '2099-01-01T18:00:00+02:00',
  ends_at: '2099-01-01T23:00:00+02:00',
  location_name: 'TBA',
  location_address: 'Praha',
  location_gps_lat: null,
  location_gps_lng: null,
  price_czk: 0,
  capacity: 150,
  short_description: 'Datum oznámíme přihlášeným odběratelům jako prvním.',
  long_description: null,
  program_json: null,
  meta_title: null,
  meta_description: null,
  og_image_url: null,
  hero_image_url: null,
  status: 'draft',
  published_at: null,
  created_at: '2025-12-01T00:00:00Z',
  updated_at: '2026-04-25T00:00:00Z',
  created_by: null,
}

export default async function HomePage() {
  const dbEvents = await listPublicEvents()
  const hasUpcoming = dbEvents.some((e) => e.status === 'published' || e.status === 'draft')
  const events = hasUpcoming ? dbEvents : [NEXT_PLACEHOLDER, ...dbEvents]

  return (
    <>
      <Navbar ctaHref="#odber" ctaLabel="Odebírat" />
      <main>
        <IssueCoverSection issue="04" edition="Duben 2026" />
        <AftermathSection />
        <PrinciplesSection />
        <ArchiveIndexSection events={events} />
        <OrganizerSection />
        <BonumSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
