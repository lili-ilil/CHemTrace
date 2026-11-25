// Runs SMP.selfTest() in the page and prints every check (22 in version 0.14.0)
const {chromium} = require('playwright'), {URL} = require('./_base');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL + '/index.html'); await p.waitForTimeout(800);
  const r = await p.evaluate(() => { const t0 = performance.now(); const r = SMP.selfTest(); r.ms = performance.now() - t0; return r; });
  console.log(r.version, r.passed + '/' + r.total, 'in', r.ms.toFixed(0), 'ms');
  r.checks.forEach(c => console.log((c.pass ? 'PASS ' : 'FAIL ') + c.check + ' — ' + c.detail));
  console.log('page errors:', errs); await b.close(); process.exit(r.passed === r.total && !errs.length ? 0 : 1); })();
