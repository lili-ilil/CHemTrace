# CHemTrace

A website that traces contaminants through Swiss landscapes: their forms, pathways, threats to people and where to trap them. Eight metals are available now: arsenic, mercury, lead, cadmium, copper, zinc, nickel and chromium; more contaminants are being added. (Formerly called Swiss Metal Pathways.)

Contact: Li-Ling T., ETH Zürich, litail@ethz.ch

**What it is for.** It gives an overview of the whole system (soil, air, groundwater, rivers and lakes together) so you can form assumptions and a first plan: where to act first and what to measure. The detail belongs in site investigations and specialised models; the website exports its inputs to PHREEQC, HYDRUS-1D and MODFLOW 6 for that step.

- **Explore mode** is the interactive landscape and field guide.
- **Advanced mode** is a screening calculator with Monte Carlo uncertainty, Swiss limit values and a map of Switzerland. Clicking the map fills the inputs from national datasets.
- **Mass budget** shows where the released kilograms are after 1–100 years, with optional flood scenarios. **Sensitivity** ranks which uncertain input drives each result.
- **Spread map** shows, year by year, where soil and groundwater are above the Swiss standard, with the groundwater direction set by the user and cantonal and federal maps as support.
- **Forms by phase** compares five condition scenarios (today, waterlogged, acidified, floods, anoxic lake) and shows which chemical forms the metal takes in soil and sediment, water and air.
- **Lakes and redox:** lake trophic state and season, Hg⁰ escape and methylmercury breakdown in sunlit lake water, and an optional redox ladder that works out the soil and aquifer redox state from oxygen, nitrate, sulfate and organic carbon.
- **Air and land surface:** deposition by particle size, release height, wind and rain; a wind-shaped deposition zone on the spread map; forests and mercury leaf litter; snow, firn and mercury re-emission; sealed surfaces and road-runoff drainage; road traffic (lead) and glacier melt as release types; PM10 and PM2.5 from the FOEN maps and NABEL background values.
- **Where to act first:** every source–pathway–receptor link is rated Act now, Measure first, Monitor or Record only, from consequence, time to impact, the share of uncertainty runs above the Swiss value, measured values and a stress test; the user can override each rating with a reason. A screening priority, not a legal classification.
- **What to measure next:** a measurement plan in order of priority, with where, how and when.
- **Import data:** reads CSV or text files from FOEN hydrological stations, NAQUA/NADUF/NAWA and laboratory tables, NABEL and MeteoSwiss station data in the browser; sets discharge, Q347, precipitation, depth to groundwater and background values, and feeds measured values to the priority rating.
- **Take it further:** downloads a PHREEQC input file, a HYDRUS-1D parameter sheet, a MODFLOW 6 (FloPy) script and a JSON of the whole run, filled with the current inputs. Placeholders are marked ASSUMED.
- **Validation** (`validation.html`) compares the model with published Swiss measurements.
- **Scripting:** in the browser console, `SMP.run("Pb", {...inputs})` (also available as `CHemTrace.run`) reruns any scenario and returns results, ranges, the budget and the drivers; `SMP.exportFile("phreeqc", "Pb", {...inputs})` returns an export file as text; `SMP.depositionProfile("Pb", {...inputs})` returns deposition and air concentration with distance for a release to air.
- **Code checks:** `SMP.selfTest()` in the browser console runs 24 automated checks (mass conservation for all eight metals including snow, forests, roads and glaciers; Kd relations including the Sauvé regressions and chromium; plume and deposition behaviour; lake Hg⁰ escape; redox ladder; release pattern; completeness of every metal's data; data import; priority rules; reproducibility). `SMP.readData(text)` reads a data table as the Import data tab does. Run it after every change.

Current version: 0.15.0 (25 November 2026). The version history is in `CHANGELOG.md` (not shown on the website); update `APP_VERSION` in `assets/js/app.js`, the footers and `CHANGELOG.md` together.

The site is fully static: HTML, CSS, JavaScript and two data files. It needs no build step and no server code.

## Folder layout

```
SwissMetalModel/               the repository
  README.md                    this file (shown on github.com, not part of the website)
  CHANGELOG.md                 version history
  .gitignore                   keeps data/, work/ and not-on-github/ out of the repository
  docs/                        the website: GitHub Pages publishes this folder
    index.html                 page markup
    manual.html                user manual with examples
    validation.html            benchmark checks against published Swiss data
    assumptions.html           every default and assumption (generated, see dev-tools)
    assets/css/styles.css      all styles (light and dark theme)
    assets/js/app.js           model engine, Explore mode, Advanced mode, site lookup
    assets/img/                logo and favicon
    assets/vendor/leaflet/     Leaflet 1.9.4 map library (BSD-2 licence)
    assets/fonts/              Archivo and IBM Plex Mono, self-hosted (SIL OFL)
    data/grid.json             grid description (LV95, 1 km, 353 × 225 cells)
    data/grid.bin              22 data layers, binary
    .nojekyll                  tells GitHub Pages to serve files as they are
  tools/process_data.py        rebuilds docs/data/grid.* from the files in data/
  dev-tools/                   tests, PHREEQC runner and page generator (see dev-tools/README.md)
  data/                        raw downloads, about 2 GB (not uploaded)
  not-on-github/               posters, screenshots, the old Word/PDF manual (not uploaded)
```

## Run it on your computer

The data files are loaded with `fetch`, so open the page through a small web server, not by double-clicking `index.html`.

```
cd docs
python -m http.server 8000
```

Then open http://localhost:8000 in a browser.

## Put it online

Upload to the repository: `docs`, `tools`, `dev-tools`, `README.md`, `CHANGELOG.md` and `.gitignore`. Do not upload `data` (about 2 GB, and each provider's own terms apply) or `not-on-github`.

- **GitHub Pages from `/docs`:** upload the items above, then open **Settings → Pages**, choose **Deploy from a branch**, branch `main`, folder `/docs`, and save. On the free GitHub plan the repository must be public, so everything uploaded is visible on github.com; a private repository needs a paid plan.
- **Two repositories (free):** keep `README.md`, `CHANGELOG.md`, `tools` and `dev-tools` in a private repository, and upload only the contents of `docs` to a public repository published from `main`, folder `/ (root)`.
- **Cloudflare Pages (free):** connect Cloudflare Pages to a private repository, leave the build command empty and set the build output directory to `docs`.

The site address depends on the host and repository name, for example `https://<your-user>.github.io/<repository>/`. For an ethz.ch address, ask ETH IT Services or your department IT for static web hosting and upload the contents of `docs`.

## Live services used in the browser

- swisstopo map tiles: `wmts.geo.admin.ch`, layers `ch.swisstopo.pixelkarte-grau` (map) and `ch.swisstopo.swissimage` (aerial image)
- swisstopo elevation service: `api3.geo.admin.ch/rest/services/height`
- swisstopo profile service (terrain for the spread map): `api3.geo.admin.ch/rest/services/profile.json`
- swisstopo river network VECTOR25 (identify service): `api3.geo.admin.ch/rest/services/api/MapServer/identify`
- FOEN layers on `wmts.geo.admin.ch`: hydrogeological map 1:100,000, tracer tests, and wastewater treatment plants (`ch.bafu.gewaesserschutz-klaeranlagen_anteilq347`)
- Sewer network via the geodienste.ch utility cadastre WMS (`leitungskataster_v2_0_0`, layer `abwasser`); public only where the canton allows it (Aargau, Geneva and Glarus in a November 2026 test), fees and terms set by the cantons and utilities. It shares the request budget below with the protection zones.
- Cantonal groundwater protection zones via geodienste.ch WMS (`planerischer_gewaesserschutz_v1_2_0`); coverage and terms of use vary by canton
  - To stay within the geodienste.ch fair-use rules (10 WMS requests a minute, at most 360,000 pixels per image; web applications with up to about 10,000 users a day count as fair use), the page requests one image per map view, only while the layer is switched on and after panning stops, and at most 9 a minute. If you expect more traffic, contact geodienste@kgk-cgc.ch before going live.

The federal services are free. Keep the "© swisstopo" and FOEN attributions visible, and check the geodienste.ch terms for the cantons you show.

## Data in `data/grid.bin`

| Layer | Source | Notes |
|---|---|---|
| precip, temp | MeteoSwiss spatial climate normals 1991–2020 | Source: MeteoSwiss |
| ph, clay | KOBO soil property maps, 0–30 cm, 2022 | CC BY 4.0, averaged to 1 km |
| soc | KOBO soil carbon stock 0–120 cm, 2022 | CC BY 4.0. Topsoil organic carbon ≈ stock ÷ 60 (assumes 60% of the stock in 0–30 cm and a bulk density of 1.2 t/m³) |
| atl_As, atl_Pb, atl_Hg, atl_Sb, atl_Fe, atl_Ca, atl_Cd, atl_Cu, atl_Zn, atl_Ni, atl_Cr | FOEN/Agroscope Geochemical soil atlas of Switzerland (EPSG:3857 class rasters in `data/soil_atlas`) | Percentile classes 1–8. As, Pb and Hg are converted to mg/kg with the published percentiles (Agroscope); Cd, Cr, Cu, Ni and Zn with a lognormal fitted to the 10th, 50th and 90th percentiles of Reusser et al. 2023. The Fe class sets an assumed oxalate-Fe. The five 0.14.0 layers are appended after pm25 |
| hydro, rock | swisstopo/FOEN Hydrogeological map 1:500,000 (GK500 V1.3) | Aquifer class and rock type, rasterised at cell centres |
| lu4, lu_set | BFS Swiss land-use statistics (current state) | Majority land-use class per km² and settlement share |
| pm10, pm25 | FOEN annual mean maps of PM10 and PM2.5 (100 m, 2023–2025) | Mean of the three years, averaged to 1 km. Downloaded by `process_data.py pm` from data.geo.admin.ch |

All layers are on the LV95 (EPSG:2056) 1 km grid of the MeteoSwiss data. They give regional estimates, not values for a specific parcel.

## Rebuild the data

On a computer with Python 3 and `pip install numpy rasterio pyproj shapely pyogrio`, keep the downloaded files in `data` as they are now. From the `SwissMetalModel` folder, run:

```
python tools/process_data.py all
```

On the first run it extracts what it needs into `SwissMetalModel/work` (about 1.3 GB; you can delete that folder afterwards). It then writes `docs/data/grid.bin` and `docs/data/grid.json`.

## Checks and tools

`dev-tools/` holds browser tests (Node.js and Playwright), a PHREEQC runner for the exported files and the generator of `assumptions.html`. Instructions are in `dev-tools/README.md`. Quick check after any change: open the site, press F12 and run `SMP.selfTest()` (24 of 24 should pass). To check a real FOEN file before relying on the import: `node dev-tools/tests/import.js path/to/file.csv`.

## Licences and credits

- Model and site code: © 2026 Li-Ling T. ETH Zürich (litail@ethz.ch). No licence has been chosen yet.
- Data: see the table above. Credit each source as stated by its provider.
- Leaflet: BSD-2-Clause. Fonts: SIL Open Font License (licence files in `assets/fonts`).

The results are screening-level estimates from documented equations. They do not replace a site investigation, and limit values should be checked against the current text on fedlex.admin.ch.
