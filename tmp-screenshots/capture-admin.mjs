import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

const pages = [
  { name: '01-homepage', url: `${BASE}/` },
  { name: '13-sitemap', url: `${BASE}/sitemap.xml` },
  { name: '14-robots', url: `${BASE}/robots.txt` },
  { name: '15-admin-login', url: `${BASE}/admin/login` },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });

  for (const p of pages) {
    try {
      const page = await context.newPage();
      await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `tmp-screenshots/${p.name}.png`, fullPage: true, timeout: 60000 });
      console.log(`OK: ${p.name}`);
      await page.close();
    } catch (e) {
      console.log(`FAIL: ${p.name} - ${e.message?.slice(0, 100)}`);
    }
  }

  await browser.close();
})();
