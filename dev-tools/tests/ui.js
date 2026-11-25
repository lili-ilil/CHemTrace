// Explore: every compartment panel for every metal; Advanced: every example and the release-pattern menu. Screenshots in tests/out/
const {chromium} = require('playwright'), path = require('path'), {URL, OUT, METALS} = require('./_base');
(async () => { const b = await chromium.launch(); const errs = []; const p = await b.newPage({viewport:{width:1400, height:950}});
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if(m.type() === 'error') errs.push(m.text()); });
  await p.goto(URL + '/index.html'); await p.waitForTimeout(800); let fails = 0;
  for(const m of METALS){
    await p.selectOption('#metalSel', m); await p.waitForTimeout(150);
    const bad = await p.evaluate(() => { const out = []; document.querySelectorAll('.hit').forEach(h => { h.dispatchEvent(new FocusEvent('focus')); if(/undefined|NaN/.test(document.querySelector('#panel').innerText)) out.push(h.dataset.c); }); return out; });
    if(bad.length) fails++; console.log('Explore', m, bad.length ? 'problems in ' + bad.join(', ') : 'ok');
  }
  await p.screenshot({path: path.join(OUT, 'explore.png')});
  await p.click('#mAdv'); await p.waitForTimeout(900);
  for(const m of METALS){
    await p.selectOption('#metalSel', m); await p.waitForTimeout(250); await p.click('#loadExample'); await p.waitForTimeout(700);
    const i = await p.evaluate(() => ({intro:document.querySelector('#resIntro').textContent.slice(0, 120), key:[...document.querySelectorAll('#resGrid .res')].slice(0, 3).map(r => r.querySelector('.rl span').textContent + ': ' + r.querySelector('.rv').textContent + ' [' + r.querySelector('.pill').textContent + ']'), bad:/undefined|NaN/.test(document.body.innerText)}));
    if(i.bad) fails++; console.log('\nAdvanced', m, '·', i.intro); i.key.forEach(k => console.log('  ' + k));
  }
  await p.selectOption('#metalSel', 'Pb'); await p.waitForTimeout(200);
  for(const md of ["soil", "gw", "river", "road"]){ await p.selectOption('#f-medium', md); await p.waitForTimeout(400);
    console.log('Release pattern, Pb to', md, '→', await p.evaluate(() => { const e = document.querySelector('#f-pattern'); return e ? (e.disabled ? 'fixed: ' : 'free: ') + [...e.options].map(o => o.textContent).join('/') : 'missing'; })); }
  console.log('\npage errors:', errs); await b.close(); process.exit(fails || errs.length ? 1 : 0); })();
