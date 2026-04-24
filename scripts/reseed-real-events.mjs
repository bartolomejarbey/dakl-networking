#!/usr/bin/env node
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'pozlwuuakouzaiumamzy'

if (!TOKEN) {
  console.error('Missing SUPABASE_ACCESS_TOKEN')
  process.exit(1)
}

const API = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`

async function run(query) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`${res.status}: ${text}`)
  }
  return JSON.parse(text)
}

console.log('Wiping fake seed events + testimonials + event FAQs...')
await run(`DELETE FROM faqs WHERE event_id IS NOT NULL;`)
await run(`DELETE FROM event_guests;`)
await run(`DELETE FROM events;`)
await run(`DELETE FROM testimonials;`)

console.log('Inserting 3 real events...')
const program = [
  { time: '15:00', title: 'Příchod a registrace', description: 'Welcome drink, check-in' },
  { time: '15:30', title: 'Jídlo a pití', description: 'Alko i nealko, vše v ceně' },
  { time: '16:00', title: 'DJs', description: 'Od chill odpoledních beatů po taneční večer' },
  { time: '16:30', title: 'Aktivity', description: 'Beachvolejbal, paddleboardy, kajaky, motorový člun' },
  { time: '20:00', title: 'Networking peak', description: 'Hlavní vlna networkingu' },
  { time: '23:30', title: 'Konec', description: 'Děkujeme a těšíme se příště' },
]
const programJson = JSON.stringify(program).replace(/'/g, "''")

await run(`
INSERT INTO events (slug, name, type, starts_at, ends_at, location_name, location_address, price_czk, capacity, short_description, program_json, status, published_at)
VALUES
  ('kayak-beach-bar', 'Neřízený networking na lodi', 'lod',
   '2026-04-24T15:00:00+02:00', '2026-04-24T23:30:00+02:00',
   'Kayak Beach Bar', 'Náplavka, Železniční most, Praha 2', 2290, 150,
   'Loď, jídlo, pití, DJs, beachvolejbal, paddleboardy. Jeden večer, 150 lidí, co něco dělají.',
   '${programJson}'::jsonb,
   'published', NOW() - INTERVAL '30 days'),

  ('ochutnavka-morskych-plodu', 'Ochutnávka mořských plodů', 'more',
   '2026-03-23T18:00:00+01:00', '2026-03-23T23:00:00+01:00',
   'Praha', 'Praha', 2490, 100,
   NULL, NULL,
   'archived', NOW() - INTERVAL '60 days'),

  ('degustace-vina-wood-and-steak', 'Degustace vína', 'vino',
   '2026-02-26T18:00:00+01:00', '2026-02-26T23:00:00+01:00',
   'Wood and Steak', 'Praha', 1890, 60,
   NULL, NULL,
   'archived', NOW() - INTERVAL '80 days');
`)

const check = await run(`SELECT slug, name, starts_at, status FROM events ORDER BY starts_at;`)
console.log('\nFinal events in DB:')
console.table(check)
