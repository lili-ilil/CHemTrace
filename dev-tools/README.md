# dev-tools

Tools for checking and rebuilding the website. None of them is needed to view or publish the site.

## tests/ (Node.js and Playwright)

Start a local server in `docs`, port 8765:

```
cd docs
python -m http.server 8765
```

In a second terminal, from the repository folder:

```
npm install playwright
npx playwright install chromium
node dev-tools/tests/self_test.js
```

| File | What it checks |
|---|---|
| `self_test.js` | Runs `SMP.selfTest()`: 22 checks in version 0.14.0 (mass balance, Kd relations, plume, air, redox ladder, completeness of every metal) |
| `all_metals.js` | Every metal × release route × release pattern runs without NaN or undefined; prints key results; writes PHREEQC test files to `tests/out/pqi/` |
| `exports.js` | PHREEQC, HYDRUS, MODFLOW and JSON exports for every metal and route |
| `ui.js` | Explore panels for every metal, every Advanced example, the release-pattern menu |
| `layout.js` | All pages at desktop and phone width: no sideways scrolling, no broken in-page links |
| `maps.js` | Site lookup backgrounds and the Map / Aerial image switch |

Each script exits with code 1 if something fails. Screenshots and files go to `tests/out/` (not uploaded). To test the published site instead, set `CHEMTRACE_URL`, for example `CHEMTRACE_URL=https://<user>.github.io/<repository> node dev-tools/tests/self_test.js`.

## phreeqc/ (Python and phreeqpython: `pip install phreeqpython`)

- `minteq.v4.dat`: the MINTEQ v4 database shipped with PHREEQC (USGS, public domain).
- `run_pq.py`: runs exported `.pqi` files and prints the batch result and the column breakthrough. `python dev-tools/phreeqc/run_pq.py "dev-tools/tests/out/pqi/*.pqi"`
- `check_ph.py`: confirms each batch holds its target pH. Same usage.

## generators/ (Python)

- `assumptions.py`: writes `docs/assumptions.html` (97 assumptions in 0.14.0) from the table inside the script, using the page header of `docs/validation.html`. Edit the table there, then run `python dev-tools/generators/assumptions.py`.
- `atlas_percentiles.py`: prints the soil-atlas percentiles for Cd, Cr, Cu, Ni and Zn used in `ATLAS_PCT` in `docs/assets/js/app.js`.
