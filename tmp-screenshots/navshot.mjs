import { chromium } from 'playwright';
const BASE = process.env.BASE_URL || 'http://localhost:3001';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Zoom into the navbar wordmark (top-left corner)
  await page.screenshot({
    path: 'tmp-screenshots/16-wordmark-nav-zoom.png',
    fullPage: false,
    clip: { x: 30, y: 12, width: 320, height: 90 },
  });

  // Zoom into the footer wordmark
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  // The footer Wordmark is rendered near top-left of footer
  const wm = await page.locator('footer >> text=DaKl').first();
  if (await wm.count()) {
    const box = await wm.boundingBox();
    if (box) {
      await page.screenshot({
        path: 'tmp-screenshots/17-wordmark-footer-zoom.png',
        fullPage: false,
        clip: { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 20), width: 480, height: 220 },
      });
    }
  }

  await browser.close();
  console.log('done');
})();
