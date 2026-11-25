// Reads data files the way the Import data tab does and prints what was recognised.
// Without arguments it reads the samples in tests/samples; pass your own files to check them:
//   node dev-tools/tests/import.js path/to/foen_file.csv
const {chromium} = require('playwright'), fs = require('fs'), path = require('path'), {URL} = require('./_base');
const files = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(path.join(__dirname, 'samples')).map(f => path.join(__dirname, 'samples', f));
(async () => { const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(URL + '/index.html'); await p.waitForTimeout(800); let fails = 0;
  for(const f of files){
    const buf = fs.readFileSync(f); let text = buf.toString('utf8'); if(text.includes('�')) text = buf.toString('latin1');   // older Swiss files are often Latin-1
    const r = await p.evaluate(([t, n]) => SMP.readData(t, n), [text, path.basename(f)]);
    console.log('\n' + path.basename(f));
    if(r.error){ fails++; console.log('  not read:', r.error); continue; }
    console.log(`  ${r.rows} rows, delimiter ${r.delimiter}${r.decimalComma ? ', decimal comma' : ''}${Object.keys(r.metadata).length ? ', metadata ' + JSON.stringify(r.metadata) : ''}`);
    r.series.forEach(s => { const st = s.summary; console.log(`  series: ${s.kind} (${s.column}, ${s.unit}): ${st.n} values, ${st.step}, mean ${st.mean != null ? +st.mean.toPrecision(4) : '–'}` + (st.q347 != null ? `, Q347 ${+st.q347.toPrecision(3)}` : '') + (st.annual != null ? `, ${Math.round(st.annual)} mm/yr over ${st.years} years` : '')); });
    r.metals.forEach(m => console.log(`  metal: ${m.metal}${m.species ? ' (' + m.species + ')' : ''}${m.site ? ' at ' + m.site : ''} ${m.n} values (${m.belowDetection} below detection), median ${m.median}, max ${m.max} ${m.unit}, medium guess: ${m.medium}`));
    if(!r.series.length && !r.metals.length){ fails++; console.log('  nothing recognised: set the columns by hand in the Import data tab'); }
  }
  console.log('\npage errors:', errs); await b.close(); process.exit(fails || errs.length ? 1 : 0); })();
