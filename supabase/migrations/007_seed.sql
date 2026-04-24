-- =========================================================================
-- SEED DATA
-- =========================================================================

-- Upcoming events
INSERT INTO events (slug, name, type, starts_at, ends_at, location_name, location_address, price_czk, capacity, short_description, long_description, program_json, status, published_at, hero_image_url) VALUES

('kayak-beach-bar', 'Neřízený networking na lodi', 'lod',
 '2026-04-24 15:00:00+02', '2026-04-24 23:30:00+02',
 'Kayak Beach Bar', 'Náplavka, Železniční most, Praha 2',
 2290, 150,
 'Jedny z nejlepších ROI business akcí v ČR. Loď, jídlo, pití, DJs, beachvolejbal, paddleboardy.',
 E'## Co tě čeká na palubě\n\nKayak Beach Bar u Železničního mostu. Celý bar jen pro nás. Jídlo a pití v ceně, DJs od odpoledne do noci, beachvolejbalový kurt, paddleboardy a kajaky zdarma, motorový člun pro odvážné.\n\n## Dress code\n\nCasual / smart casual. Jsi na pláži u řeky, ne v kanceláři.\n\n## Parkování\n\nNejbližší parking: Náplavka P+R nebo ulice v okolí. Doporučujeme MHD — zastávka Výtoň (tram 2, 3, 17).',
 '[{"time":"15:00","title":"Příchod a registrace","description":"Welcome drink, check-in"},{"time":"15:30","title":"Jídlo a pití","description":"Alko i nealko, vše v ceně"},{"time":"16:00","title":"DJs","description":"Od chill odpoledních beatů po taneční večer"},{"time":"16:30","title":"Aktivity","description":"Beachvolejbal, paddleboardy, kajaky, motorový člun"},{"time":"20:00","title":"Networking peak","description":"Hlavní vlna networkingu"},{"time":"23:30","title":"Konec","description":"Děkujeme a těšíme se příště"}]'::JSONB,
 'published', NOW(),
 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80'),

('degustace-vin-znojmo', 'Degustace vín z Moravy — Znojmo', 'vino',
 '2026-05-22 17:00:00+02', '2026-05-22 23:00:00+02',
 'Vinný sklep', 'Znojmo',
 1890, 80,
 'Moravská vína, sklep, networking v komorní atmosféře.',
 NULL,
 NULL,
 'draft', NULL, NULL),

('morske-plody-pobrezni', 'Degustace mořských plodů — Pobřežní', 'more',
 '2026-06-19 18:00:00+02', '2026-06-19 23:00:00+02',
 'Pobřežní', 'Pobřežní, Praha 8',
 2490, 100,
 'Mořské plody, šampaňské, networking u vody.',
 NULL,
 NULL,
 'draft', NULL, NULL),

('garden-party-rooftop', 'Garden party na střeše', 'garden',
 '2026-07-17 16:00:00+02', '2026-07-17 23:00:00+02',
 'Rooftop', 'Praha — Upřesníme',
 1990, 120,
 'Letní garden party na střeše s výhledem na Prahu.',
 NULL,
 NULL,
 'draft', NULL, NULL);

-- Past events
INSERT INTO events (slug, name, type, starts_at, ends_at, location_name, location_address, price_czk, capacity, short_description, status, published_at) VALUES

('prvni-lod-podoli', 'První loď roku — Podolí', 'lod',
 '2026-03-21 16:00:00+01', '2026-03-21 23:00:00+01',
 'Podolí', 'Podolí, Praha 4',
 2190, 150,
 'Zahájení sezóny na lodi v Podolí.',
 'archived', '2026-02-15 10:00:00+01'),

('zimni-degustace-vinohrady', 'Zimní degustace vín — Vinohrady', 'vino',
 '2026-02-15 18:00:00+01', '2026-02-15 23:00:00+01',
 'Vinohrady', 'Vinohrady, Praha 2',
 1890, 150,
 'Zimní degustace moravských vín na Vinohradech.',
 'archived', '2026-01-20 10:00:00+01'),

('first-meeting-2026', 'First meeting 2026 — Letná', 'jine',
 '2026-01-18 17:00:00+01', '2026-01-18 23:00:00+01',
 'Letná', 'Letná, Praha 7',
 2290, 150,
 'Novoroční setkání. Start roku s lidmi, co něco dělají.',
 'archived', '2025-12-15 10:00:00+01'),

('vanocni-dinner-karlin', 'Vánoční dinner — Karlín', 'jine',
 '2025-12-08 18:00:00+01', '2025-12-08 23:00:00+01',
 'Karlín', 'Karlín, Praha 8',
 2490, 150,
 'Vánoční dinner networking v Karlíně.',
 'archived', '2025-11-10 10:00:00+01');

-- Testimonials
INSERT INTO testimonials (quote, author_name, author_role, is_published, is_featured, sort_order) VALUES
('Přišel jsem poznat dva investory. Odešel jsem s kontakty na pět. Nejlepší cena–výkon poměr za posledních deset let v byznysu.',
 'Martin H.', 'zakladatel SaaS firmy', true, true, 1),
('Byla jsem skeptická. „Další networking." Po čtvrt hodině jsem věděla, že tohle je jiné. Na Conventu se lidi filtrují jinak.',
 'Eva B.', 'CEO agentury', true, true, 2),
('Jednou za měsíc si dám dovolenou na den, jedu do Prahy, jdu na Conventus. Za tři roky jsem z toho udělal slušnou část obratu.',
 'Petr V.', 'majitel výrobní firmy', true, true, 3);

-- Global FAQ
INSERT INTO faqs (event_id, question, answer, category, sort_order) VALUES
(NULL, 'Kdo může přijít na akci?', 'Conventus je pro aktivní podnikatele — vlastníky firem, freelancery, manažery. David filtruje účastníky, aby kvalita zůstala vysoká. Žádní MLM lovci, žádní teenageři s vizitkou.', 'o_akcich', 1),
(NULL, 'Co je zahrnuto v ceně?', 'Všechno. Jídlo, pití (alkoholické i nealkoholické), aktivity, vstup. Zaplatíš jednou a máš celý večer.', 'o_akcich', 2),
(NULL, 'Jaký je dress code?', 'Záleží na typu akce. Loď = casual/smart casual. Dinner = smart casual. Vždy upřesníme v pozvánce.', 'o_akcich', 3),
(NULL, 'Můžu přijít sám/sama?', 'Samozřejmě. Většina lidí přichází sama. Právě proto to děláme — abys poznal nové lidi.', 'o_akcich', 4),
(NULL, 'Jak probíhá platba?', 'Po vyplnění přihlášky tě přesměrujeme na platební bránu (QR platba kartou). Alternativně můžeš zaplatit bankovním převodem — pošleme ti proforma fakturu.', 'platba', 5),
(NULL, 'Dostanu fakturu?', 'Ano, automaticky po zaplacení. Faktura na firmu i na fyzickou osobu.', 'platba', 6),
(NULL, 'Můžu akci stornovat?', 'Ano, do 48 hodin před akcí. Vrátíme ti 100 % částky. Po tomto termínu není storno možné.', 'storno', 7),
(NULL, 'Nedostal/a jsem potvrzovací email.', 'Zkontroluj spam/promotions složku. Pokud email nenajdeš, napiš na david@conventus.cz a vyřešíme to.', 'tech', 8);
