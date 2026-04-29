import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

const pages = [
  { name: '01-homepage', url: `${BASE}/` },
  { name: '02-akce', url: `${BASE}/akce` },
  { name: '03-event-detail', url: `${BASE}/akce/kayak-beach-bar` },
  { name: '04-checkout', url: `${BASE}/akce/kayak-beach-bar/prihlaska` },
  { name: '05-confirmation', url: `${BASE}/akce/kayak-beach-bar/potvrzeni?order=CN-2026-0042` },
  { name: '06-faq', url: `${BASE}/faq` },
  { name: '07-david', url: `${BASE}/david-kladisovsky` },
  { name: '08-kontakt', url: `${BASE}/kontakt` },
  { name: '09-podminky', url: `${BASE}/podminky` },
  { name: '10-gdpr', url: `${BASE}/ochrana-osobnich-udaju` },
  { name: '11-404', url: `${BASE}/neexistuje` },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
  });

  for (const p of pages) {
    try {
      const page = await context.newPage();
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `tmp-screenshots/${p.name}.png`, fullPage: true });
      console.log(`OK: ${p.name}`);
      await page.close();
    } catch (e) {
      console.log(`FAIL: ${p.name} - ${e.message}`);
    }
  }

  // Money shot — Aftermath section close-up
  try {
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);
    const aftermath = await page.locator('[data-folio="02"]').first();
    if (await aftermath.count()) {
      await aftermath.scrollIntoViewIfNeeded();
      // Scroll a bit further so the entire stat ledger is in view
      await page.evaluate(() => window.scrollBy(0, 200));
      await page.waitForTimeout(3000);
      await aftermath.screenshot({ path: 'tmp-screenshots/12-aftermath-zoom.png' });
      console.log('OK: 12-aftermath-zoom');
    }
    await page.close();
  } catch (e) {
    console.log(`FAIL: 12-aftermath-zoom - ${e.message}`);
  }

  await browser.close();
})();
