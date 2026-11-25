// Every metal × release route × release pattern runs without NaN or undefined; prints the key results.
// Also writes PHREEQC files for the new metals to tests/out/pqi/ (run them with ../phreeqc/run_pq.py).
const {chromium} = require('playwright'), fs = require('fs'), path = require('path'), {URL, OUT} = require('./_base');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL + '/index.html'); await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const out = [], bad = [];
    const routes = m => ["soil", "air", "gw", "river"].concat(m === "Pb" ? ["road"] : [], ["As", "Hg", "Pb"].includes(m) ? ["glacier"] : []);
    for(const m of ["As", "Hg", "Pb", "Cd", "Cu", "Zn", "Ni", "Cr"]) for(const md of routes(m)) for(const pat of ["continuous", "pulse"]){
      let res; try{ res = CHemTrace.run(m, {preset:"plateau", medium:md, pattern:pat, amount:md === "soil" ? 10 : 1, land:"garden"}); }catch(e){ bad.push(m + "/" + md + ": " + e.message); continue; }
      res.results.forEach(x => { const s = JSON.stringify(x); if(/NaN|undefined|Infinity/.test(s)) bad.push(m + "/" + md + "/" + pat + " " + x.id); });
      if(pat === "continuous") out.push([m, md, res.results.filter(x => ["soilC", "pore", "gwPot", "gwC", "rivD", "dose", "airC", "dep", "kd"].includes(x.id)).map(x => x.id + "=" + (+x.value).toPrecision(3) + " [" + x.tag + "]").join("; ")]);
    }
    return {out, bad};
  });
  r.out.forEach(x => console.log(x.join(" | "))); console.log("problems:", r.bad.length, r.bad.slice(0, 20));
  const dir = path.join(OUT, 'pqi'); fs.mkdirSync(dir, {recursive: true});
  const cases = {Cd_soil:["Cd", {preset:"plateau", medium:"soil", form:"cd2", amount:5}], Cd_acid:["Cd", {preset:"ticino", medium:"soil", form:"cd2", amount:5}],
    Cu_soil:["Cu", {preset:"visp", medium:"soil", form:"cufung", amount:2, area:10000}], Cu_river:["Cu", {preset:"plateau", medium:"river", form:"cu2", amount:50}],
    Zn_soil:["Zn", {preset:"plateau", medium:"soil", form:"zn2", amount:2, area:200}], Ni_gw:["Ni", {preset:"plateau", medium:"gw", form:"ni2", amount:0.5}],
    Cr6_gw:["Cr", {preset:"plateau", medium:"gw", form:"cr6", amount:0.5}], Cr6_anox:["Cr", {preset:"plateau", medium:"gw", form:"cr6", amount:0.5, redox:"anoxic"}],
    Cr3_soil:["Cr", {preset:"plateau", medium:"soil", form:"cr3", amount:5}], Pb_soil:["Pb", {preset:"plateau", medium:"soil", form:"pb2", amount:5}], As_gw:["As", {preset:"plateau", medium:"gw"}]};
  for(const [k, [m, inp]] of Object.entries(cases)){ const f = await p.evaluate(([m, inp]) => CHemTrace.exportFile('phreeqc', m, inp), [m, inp]); fs.writeFileSync(path.join(dir, k + '.pqi'), f.text); }
  console.log('PHREEQC files in', dir); console.log('page errors:', errs); await b.close(); process.exit(r.bad.length || errs.length ? 1 : 0); })();
