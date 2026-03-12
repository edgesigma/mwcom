const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Desktop
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/tmp/desktop.png', fullPage: true });

  // Mobile
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/tmp/mobile.png', fullPage: true });

  await browser.close();
  console.log('Screenshots saved to /tmp/desktop.png and /tmp/mobile.png');
})();
