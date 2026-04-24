import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { EventHero } from '@/components/event/EventHero'
import { EventProgram } from '@/components/event/EventProgram'
import { EventLocation } from '@/components/event/EventLocation'
import { EventFAQ } from '@/components/event/EventFAQ'
import { EventCTA } from '@/components/event/EventCTA'
import type { Event } from '@/types/database'

const HARDCODED_EVENT: Event = {
  id: '1',
  slug: 'kayak-beach-bar',
  name: 'Nerizeny networking na lodi',
  type: 'lod',
  starts_at: '2026-04-24T15:00:00+02:00',
  ends_at: '2026-04-24T23:30:00+02:00',
  location_name: 'Kayak Beach Bar',
  location_address: 'Naplavka, Zeleznicni most, Praha 2',
  location_gps_lat: 50.0693,
  location_gps_lng: 14.4148,
  price_czk: 2290,
  capacity: 150,
  hero_image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80',
  short_description: 'Neformat networking pro podnikatele na lodi. Jidlo, piti, DJs, aktivity — vse v cene.',
  long_description: 'Cely vecer na lodi. Zadny prednasky, zadny program ktery te nuti sedeti. Volny pohyb, jidlo a piti po celou dobu, DJs, paddleboardy, beachvolejbal. Potkej lidi, co neco delaji.',
  program_json: [
    { time: '15:00', title: 'Prichod a registrace', description: 'Check-in, uvitaci drink' },
    { time: '15:30', title: 'Jidlo a piti', description: 'Bufet po celou dobu akce' },
    { time: '16:00', title: 'DJs', description: 'Od chill beatu po tanecni set' },
    { time: '16:30', title: 'Aktivity', description: 'Paddleboardy, kajaky, beachvolejbal' },
    { time: '20:00', title: 'Networking peak', description: 'Hlavni cast vecera' },
    { time: '23:30', title: 'Konec', description: 'Posledni drink a rozlouceni' },
  ],
  meta_title: 'Nerizeny networking na lodi | Conventus',
  meta_description: 'Neformat networking pro podnikatele na lodi Kayak Beach Bar. 24. dubna 2026, Praha.',
  og_image_url: null,
  status: 'published',
  published_at: '2026-03-01T10:00:00+01:00',
  created_at: '2026-03-01T10:00:00+01:00',
  updated_at: '2026-03-01T10:00:00+01:00',
  created_by: null,
}

const HARDCODED_FAQS = [
  {
    question: 'Co je zahrnuto v cene?',
    answer: 'Vsechno. Jidlo, piti (alkoholicke i nealkoholicke), aktivity, vstup.',
  },
  {
    question: 'Jaky je dress code?',
    answer: 'Casual / smart casual. Jsi na plazi u reky, ne v kancelari.',
  },
  {
    question: 'Muzu prijit sam/sama?',
    answer: 'Samozrejme. Vetsina lidi prichazi sama.',
  },
  {
    question: 'Jak probiha platba?',
    answer: 'Po vyplneni prihlasky te presmerujeme na platebni branu.',
  },
  {
    question: 'Muzu akci stornovat?',
    answer: 'Ano, do 48 hodin pred akci. Vratime 100 % castky.',
  },
]

const SOLD_COUNT = 47

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params

  // For now, only return hardcoded data for kayak-beach-bar
  if (slug !== 'kayak-beach-bar') {
    notFound()
  }

  const event = HARDCODED_EVENT

  return (
    <>
      <Navbar
        ctaHref={`/akce/${event.slug}/prihlaska`}
        ctaLabel="Prihlasit se"
      />
      <main>
        <EventHero event={event} soldCount={SOLD_COUNT} />
        {event.program_json && (
          <EventProgram program={event.program_json} />
        )}
        <EventLocation event={event} />
        <EventFAQ faqs={HARDCODED_FAQS} />
        <EventCTA event={event} soldCount={SOLD_COUNT} />
      </main>
      <Footer />
    </>
  )
}
