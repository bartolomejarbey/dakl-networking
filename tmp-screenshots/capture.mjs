import { chromium } from 'playwright';

const pages = [
  { name: '01-homepage', url: 'http://localhost:3002/' },
  { name: '02-akce', url: 'http://localhost:3002/akce' },
  { name: '03-event-detail', url: 'http://localhost:3002/akce/kayak-beach-bar' },
  { name: '04-checkout', url: 'http://localhost:3002/akce/kayak-beach-bar/prihlaska' },
  { name: '05-confirmation', url: 'http://localhost:3002/akce/kayak-beach-bar/potvrzeni' },
  { name: '06-faq', url: 'http://localhost:3002/faq' },
  { name: '07-david', url: 'http://localhost:3002/david-kladisovsky' },
  { name: '08-kontakt', url: 'http://localhost:3002/kontakt' },
  { name: '09-podminky', url: 'http://localhost:3002/podminky' },
  { name: '10-gdpr', url: 'http://localhost:3002/ochrana-osobnich-udaju' },
  { name: '11-404', url: 'http://localhost:3002/neexistuje' },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  for (const p of pages) {
    try {
      const page = await context.newPage();
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `tmp-screenshots/${p.name}.png`, fullPage: true });
      console.log(`OK: ${p.name}`);
      await page.close();
    } catch (e) {
      console.log(`FAIL: ${p.name} - ${e.message}`);
    }
  }

  await browser.close();
})();
