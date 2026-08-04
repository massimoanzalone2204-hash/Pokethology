const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  } catch(e) {
    console.error("Goto error:", e);
  }
  await page.waitForTimeout(3000);
  await browser.close();
})();
