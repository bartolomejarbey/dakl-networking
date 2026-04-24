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
  name: 'Neřízený networking na lodi',
  type: 'lod',
  starts_at: '2026-04-24T15:00:00+02:00',
  ends_at: '2026-04-24T23:30:00+02:00',
  location_name: 'Kayak Beach Bar',
  location_address: 'Náplavka, Železniční most, Praha 2',
  location_gps_lat: 50.0693,
  location_gps_lng: 14.4148,
  price_czk: 2290,
  capacity: 150,
  hero_image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80',
  short_description: 'Neformátní networking pro podnikatele na lodi. Jídlo, pití, DJs, aktivity — vše v ceně.',
  long_description: 'Celý večer na lodi. Žádné přednášky, žádný program, který tě nutí sedět. Volný pohyb, jídlo a pití po celou dobu, DJs, paddleboardy, beachvolejbal. Potkej lidi, co něco dělají.',
  program_json: [
    { time: '15:00', title: 'Příchod a registrace', description: 'Check-in, uvítací drink' },
    { time: '15:30', title: 'Jídlo a pití', description: 'Bufet po celou dobu akce' },
    { time: '16:00', title: 'DJs', description: 'Od chill beatů po taneční set' },
    { time: '16:30', title: 'Aktivity', description: 'Paddleboardy, kajaky, beachvolejbal' },
    { time: '20:00', title: 'Networking peak', description: 'Hlavní část večera' },
    { time: '23:30', title: 'Konec', description: 'Poslední drink a rozloučení' },
  ],
  meta_title: 'Neřízený networking na lodi | DaKl Networking',
  meta_description: 'Neformátní networking pro podnikatele na lodi Kayak Beach Bar. 24. dubna 2026, Praha.',
  og_image_url: null,
  status: 'published',
  published_at: '2026-03-01T10:00:00+01:00',
  created_at: '2026-03-01T10:00:00+01:00',
  updated_at: '2026-03-01T10:00:00+01:00',
  created_by: null,
}

const HARDCODED_FAQS = [
  {
    question: 'Co je zahrnuto v ceně?',
    answer: 'Všechno. Jídlo, pití (alkoholické i nealkoholické), aktivity, vstup.',
  },
  {
    question: 'Jaký je dress code?',
    answer: 'Casual / smart casual. Jsi na pláži u řeky, ne v kanceláři.',
  },
  {
    question: 'Můžu přijít sám/sama?',
    answer: 'Samozřejmě. Většina lidí přichází sama.',
  },
  {
    question: 'Jak probíhá platba?',
    answer: 'Po vyplnění přihlášky tě přesměrujeme na platební bránu.',
  },
  {
    question: 'Můžu akci stornovat?',
    answer: 'Ano, do 48 hodin před akcí. Vrátíme 100 % částky.',
  },
]

const SOLD_COUNT = 47

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params

  if (slug !== 'kayak-beach-bar') {
    notFound()
  }

  const event = HARDCODED_EVENT

  return (
    <>
      <Navbar
        ctaHref={`/akce/${event.slug}/prihlaska`}
        ctaLabel="Přihlásit se"
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
