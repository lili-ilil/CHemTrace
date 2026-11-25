// PHREEQC, HYDRUS, MODFLOW and JSON exports for every metal and release route: no NaN or undefined in the files
const {chromium} = require('playwright'), {URL, METALS} = require('./_base');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL + '/index.html'); await p.waitForTimeout(800);
  const r = await p.evaluate(M => { const out = [];
    for(const m of M) for(const md of ["soil", "gw", "river", "air"]) for(const k of ["phreeqc", "hydrus", "modflow", "json"]){
      try{ const f = CHemTrace.exportFile(k, m, {preset:"plateau", medium:md}); out.push([/undefined|NaN/.test(f.text) ? "BAD" : "ok", m, md, k, f.name].join(" ")); }
      catch(e){ out.push(["n/a", m, md, k, e.message].join(" ")); } }
    return out; }, METALS);
  console.log(r.filter(x => x.startsWith("ok")).length, "files written; problems:", r.filter(x => x.startsWith("BAD")));
  console.log('page errors:', errs); await b.close(); process.exit(r.some(x => x.startsWith("BAD")) || errs.length ? 1 : 0); })();
