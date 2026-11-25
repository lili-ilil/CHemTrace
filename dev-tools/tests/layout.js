// All pages at desktop and phone width: no sideways scrolling, no broken in-page links, no script errors
const {chromium} = require('playwright'), path = require('path'), {URL, OUT} = require('./_base');
(async () => { const b = await chromium.launch(); const errs = []; let fails = 0;
  for(const vw of [1400, 400]){ const p = await b.newPage({viewport:{width:vw, height:900}}); p.on('pageerror', e => errs.push(e.message));
    for(const pg of ['index.html', 'manual.html', 'validation.html', 'assumptions.html']){
      await p.goto(URL + '/' + pg); await p.waitForTimeout(400);
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const broken = await p.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].filter(a => a.getAttribute('href').length > 1 && !document.querySelector(a.getAttribute('href'))).map(a => a.getAttribute('href')));
      if(ov > 0 || broken.length) fails++; console.log(vw + 'px', pg, 'overflow', ov, 'broken links', broken);
    }
    await p.goto(URL + '/index.html'); await p.waitForTimeout(500); await p.click('#mAdv'); await p.waitForTimeout(800);
    console.log(vw + 'px Advanced overflow', await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
    await p.screenshot({path: path.join(OUT, `advanced_${vw}.png`)}); await p.close(); }
  console.log('page errors:', errs); await b.close(); process.exit(fails || errs.length ? 1 : 0); })();
