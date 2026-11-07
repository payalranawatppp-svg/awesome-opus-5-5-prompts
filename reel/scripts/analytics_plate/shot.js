// usage: node shot.js page.html out.png width height
const { chromium } = require('playwright');
(async () => {
  const [,, html, out, w, h] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +(process.argv[6]||1) });
  await p.goto('file://' + html);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out, fullPage: true, omitBackground: true });
  await b.close();
})();
