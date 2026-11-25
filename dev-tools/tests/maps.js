// Site lookup (soil-atlas background of all eight metals) and the Map / Aerial image switch on both maps
const {chromium} = require('playwright'), path = require('path'), {URL, OUT} = require('./_base');
(async () => { const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1400, height:950}}); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL + '/index.html'); await p.waitForTimeout(600); await p.click('#mAdv'); await p.waitForTimeout(800);
  await p.selectOption('#metalSel', 'Ni'); await p.waitForTimeout(300);
  for(const [n, E, N] of [["Davos", 2783500, 1186500], ["Visp", 2634000, 1127500], ["La Chaux-de-Fonds", 2553000, 1217000]]){
    await p.fill('#spE', String(E)); await p.fill('#spN', String(N)); await p.click('#spGo'); await p.waitForTimeout(700);
    console.log(n, '::', await p.evaluate(() => [...document.querySelectorAll('#spInfo tr')].filter(r => /Background|Other metals/.test(r.textContent)).map(r => r.innerText.replace(/\s+/g, ' ')).join(' || ')));
  }
  const lab = await p.$('#spMap .leaflet-control-layers-base label:nth-child(2)'); await lab.scrollIntoViewIfNeeded(); await lab.click(); await p.waitForTimeout(600);
  console.log('after choosing Aerial image on the site map:', await p.evaluate(() => ['spMap', 'spMap2'].map(id => id + ' shows ' + document.getElementById(id).dataset.base).join(', ')));
  const m2 = await p.$('#spMap2'); await m2.scrollIntoViewIfNeeded(); await p.waitForTimeout(1500); await m2.screenshot({path: path.join(OUT, 'spread_aerial.png')});
  console.log('page errors:', errs); await b.close(); process.exit(errs.length ? 1 : 0); })();
