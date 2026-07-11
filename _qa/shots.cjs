const { chromium } = require('/sessions/hopeful-epic-shannon/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
(async () => {
  const base = 'file://' + process.cwd() + '/';
  const shots = [
    ['index.html', 1440, 'home-desktop', false],
    ['index.html', 390, 'home-mobile', true],
    ['about.html', 1440, 'about-desktop', false],
    ['practice-areas.html', 1440, 'practice-desktop', false],
    ['team.html', 1280, 'team-desktop', false],
    ['insights.html', 1440, 'insights-desktop', false],
    ['contact.html', 390, 'contact-mobile', true],
    ['industries.html', 768, 'industries-tablet', false],
  ];
  const browser = await chromium.launch({ executablePath: '/sessions/hopeful-epic-shannon/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome' });
  for (const [page, width, name, full] of shots) {
    const ctx = await browser.newContext({ viewport:{ width, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(base+page, { waitUntil:'load', timeout:15000 }).catch(()=>{});
    await p.waitForTimeout(900);
    await p.screenshot({ path:`_qa/${name}.png`, fullPage: full });
    const o = await p.evaluate(()=>({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    console.log(name.padEnd(20), 'overflowX=' + (o.sw>o.iw+1 ? 'YES('+o.sw+'>'+o.iw+')':'no'));
    await ctx.close();
  }
  await browser.close();
  console.log('done');
})();
