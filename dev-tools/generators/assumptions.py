import html, re, sys, os
# writes docs/assumptions.html; set CHEMTRACE_SITE to use another website folder
SITE = os.environ.get('CHEMTRACE_SITE') or os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'docs'))
src = open(os.path.join(SITE, 'validation.html'), encoding='utf-8').read()
head = src[:src.index('</style>')]
head = head.replace('<title>Validation · CHemTrace</title>','<title>Assumptions · CHemTrace</title>')
head = re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="Every default and assumption in CHemTrace, with its value, what it affects and its basis: published source, Swiss data, legal value or developer assumption.">', head)
E = html.escape
B = {"pub":("ok","Published"),"ch":("ok","Swiss data"),"law":("info","Legal value"),"dev":("check","Developer assumption")}
P = {"high":"High","med":"Medium","low":"Low"}
sections = [
 ("chem","Soil chemistry",[
  ("Pb Kd in soil","log Kd = 1.99 + 0.42·pH, kept within 10<sup>0.7</sup>–10<sup>5.0</sup> L/kg","All lead results in soil and seepage","pub","","Carlon et al. 2004; range from Allison &amp; Allison 2005"),
  ("Hg Kd in soil","Kd = Koc × organic carbon fraction, log Koc 5.5, kept within 10<sup>2.2</sup>–10<sup>5.8</sup> L/kg","All mercury results in soil and seepage","dev","high","Chosen so that 2% organic carbon gives the Allison &amp; Allison (2005) median (log 3.8)"),
  ("As Kd in soil","log Kd = 2.77 + 0.9·log Fe<sub>ox</sub> − 0.25·max(0, pH − 7) + 0.1·max(0, 7 − pH)","All arsenic results in soil and seepage","dev","high","Built for this tool and anchored to the Allison &amp; Allison (2005) median; US EPA advises measured Kd for arsenic"),
  ("As Kd adjustments","High phosphate −0.3; As(III) −0.7; periodically or permanently waterlogged −0.5 or −1.2; aquifer suboxic, anoxic or sulfidic −0.3, −1.2, −0.7 (log units)","Arsenic under reducing or phosphate-rich conditions","dev","high","Direction from general geochemistry; sizes set by the developer"),
  ("Cd, Cu, Zn and Ni Kd in soil","log Kd = a·pH + b·log OC + c with OC in %: Cd 0.48, 0.82, −0.65; Cu 0.21, 0.51, 1.75; Zn 0.62, 0, −0.97; Ni 0.72, 0, −1.75; kept within the Allison &amp; Allison soil ranges (log 0.1–5.0, 0.1–3.6, −1.0–5.0, 1.0–3.8)","All cadmium, copper, zinc and nickel results in soil, seepage and groundwater","pub","","Sauvé, Hendershot &amp; Allen 2000; ranges from Allison &amp; Allison 2005"),
  ("Cr(VI) Kd","log Kd = 1.1 + 0.5·log(Fe<sub>ox</sub>/5) − 0.2·(pH − 7), kept within 10<sup>−0.7</sup>–10<sup>3.3</sup> L/kg","Chromate in soil and groundwater","dev","high","Anchored to the Allison &amp; Allison (2005) Cr(VI) median (log 1.1) at 5 g/kg Fe oxides and pH 7; the slopes are the developer's"),
  ("Cr(III) Kd","10<sup>3.9</sup> L/kg; background chromium always counts as Cr(III)","Chromium released as Cr(III), and background seepage","pub","","Allison &amp; Allison 2005 median"),
  ("Share of chromium as Cr(VI)","Released as Cr(VI): soil well drained 80%, periodically waterlogged 30%, permanently 5%; aquifer oxic 100%, suboxic 50%, anoxic 5%, sulfidic 1%. Released as Cr(III): 1% of these (oxidation by Mn oxides). Effective Kd = 1 / (f<sub>6</sub>/Kd<sub>6</sub> + (1 − f<sub>6</sub>)/Kd<sub>3</sub>)","Chromium Kd, forms, travel time and Cr(VI) checks","dev","high","Direction from Palmer &amp; Puls 1994 (Fe(II) reduces Cr(VI) within minutes, organic matter within weeks at neutral pH); the shares are the developer's"),
  ("Cr(III) solubility limit","50 µg/L above pH 5, rising 30-fold per pH unit below","Chromium seepage when released as Cr(III)","dev","med","Palmer &amp; Puls 1994: Cr(OH)₃ keeps Cr(III) below about 50 µg/L at pH 5–12; the acidic slope is the developer's"),
  ("No solubility limit for Cd, Cu, Zn and Ni","Dissolved concentration is not limited by carbonate or hydroxide minerals","Seepage at very high loads","dev","med","Cautious; the PHREEQC export shows which minerals would precipitate"),
  ("Sulfidic conditions","Kd +0.5 log units for Pb, Hg, Cd, Cu, Zn and Ni","These metals in sulfidic aquifers","dev","low",""),
  ("Kd ranges","Clamped to the soil ranges in Allison &amp; Allison (2005)","Extreme inputs","pub","",""),
  ("Pb solubility limit","About 300 µg/L at pH 7–9, about 10 mg/L at pH 5 or below, log-linear in between","Lead seepage at high loads","ch","","Values from the FOEN shooting-range study (GEOTEST 2007); the interpolation is the developer's"),
  ("Kd on suspended matter","log Kd 4.0 (As), 5.7 (Pb), 5.3 (Hg), 5.0 (Cd), 4.7 (Cu), 5.1 (Zn), 4.3 (Ni), 5.1 (Cr(III)), 4.2 (Cr(VI))","Dissolved share in rivers and lakes","pub","","Medians from Allison &amp; Allison 2005 (Cr(VI): mean)"),
  ("Aquifer retardation","R = 1 + 1.8·Kd/n<sub>e</sub> (bulk density 1.8 kg/L) in gravel and sand; R = 1 in karst and fractured rock","Travel times and plume in groundwater","dev","med","Standard form; bulk density and the no-retardation rule are the developer's"),
  ("Subsoil Kd","Uses 30% of the topsoil organic carbon","Travel time to the water table","dev","med",""),
  ("Reactive fraction by form","Salts 100%; CCA wood 50%; sulfide tailings 5%; Hg-rich sediment 50%; Hg⁰ 20%; cinnabar 1%; PbO dust 60%; metallic Pb 10%; fly ash 30%; galena 2%; phosphate fertiliser Cd 80%; Cu fungicide 80%; manure Cu and Zn 60%; incineration ash Cd and Zn 50%, Ni 30%; wear dust Cu 30%; tyre wear Zn 20%; metallic Ni 5%; chromite ore residue 30%; Cr(III) slag 5%; ores and serpentinite 2–5%","Seepage, leaching and forms","dev","high","Editable on the Release tab"),
  ("Reactive share of background","20%","Background seepage","dev","med",""),
  ("Antimony at shooting ranges","3% of the Pb mass; Kd 20 L/kg; mobile fraction 12%; solubility about 5 mg/L","Antimony results","ch","","FOEN shooting-range study; field seepage is much lower (see validation test 5)"),
 ]),
 ("site","Site data from the map",[
  ("Topsoil organic carbon","Soil carbon stock 0–120 cm ÷ 60","Hg Kd at map sites","dev","high","Assumes 60% of the stock in 0–30 cm and a bulk density of 1.2 t/m³"),
  ("Oxalate iron","1.5–9 g/kg by soil-atlas iron class","As Kd at map sites","dev","high",""),
  ("Soil-atlas classes to mg/kg","Agroscope percentiles; class value is the geometric mean of its bounds, 10th and 90th percentiles interpolated","Background of all eight metals at map sites","ch","","Percentiles from Agroscope; the conversion is the developer's"),
  ("Soil-atlas percentiles for Cd, Cr, Cu, Ni, Zn","Lognormal fitted to the published 10th, 50th and 90th percentiles, separately below and above the median, to give the 5th, 25th, 75th and 95th","Background Cd, Cr, Cu, Ni, Zn at map sites","dev","med","Percentiles from Reusser et al. 2023 (CHIMIA)"),
  ("Aquifer class to K and porosity","Gravel 3×10⁻³ or 1×10⁻³ m/s; moraine 1×10⁻⁴; karst 5×10⁻³ (porosity 0.02); fractured rock 1×10⁻⁶ or 1×10⁻⁷ (0.01)","Groundwater results at map sites","dev","med","Typical values, not site measurements"),
  ("Land use","Settlement → garden; unproductive land → forest","Which Swiss soil values apply","dev","low",""),
  ("Preset sites","All values of the four presets","Examples","dev","low","Illustrative"),
  ("Preset backgrounds for Cd, Cu, Zn, Ni, Cr","Soil, groundwater and river background in the four presets, e.g. Plateau soil Cd 0.25, Cr 30, Cu 20, Ni 27, Zn 64 mg/kg; groundwater Cd 0.01, Cr 0.3, Cu 0.5, Ni 0.5, Zn 1 µg/L","Results of the new metals before you enter site data","dev","med","Plateau soil from the soil-atlas medians; groundwater and river values set below the NAQUA and GSchV indicator values"),
  ("Preset places on the spread map","Visp, Kirchberg (BE), La Chaux-de-Fonds, Astano (TI)","Spread map before you set a source","dev","low","Illustrative; slope is not applied there"),
 ]),
 ("ero","Erosion and floods",[
  ("Erosion on arable land","0.7 t/ha/yr","Erosion and downslope transport","ch","","Mean measured at Frienisberg (BE), 1997–2007 (Prasuhn)"),
  ("Erosion on other land","Gardens 0.3, forest 0.05, industrial 1, bare berms and dumps 2 t/ha/yr","Erosion and downslope transport","dev","med",""),
  ("Enrichment and delivery","Eroded soil carries 1.5 times the metal; 10% reaches a stream","River loads from erosion","dev","med",""),
  ("Slope factor","Default erosion × S(slope)/S(5%), S from McCool et al. 1987","Erosion at a location you set","dev","med","Published factor; the 5% reference slope is the developer's"),
  ("Extreme flood","10 t/ha soil loss; 30% reaches the river; 10% of its particles settle on floodplains; suspended sediment ×10","Flood scenarios","dev","high",""),
  ("Snowmelt and storm","Discharge ×2 and sediment ×3; discharge ×5 and sediment ×10","River results under these water regimes","dev","med",""),
 ]),
 ("gw","Groundwater",[
  ("Dilution factor","US EPA soil screening method","Groundwater under the source","pub","",""),
  ("Travel time","Matrix flow: t = L·θ·R/q","Arrival at the water table","pub","","Arrival is wrong in kind where fast paths exist (validation test 3)"),
  ("Plume","Domenico (1987); dispersivity 0.83·(log<sub>10</sub>x)<sup>2.414</sup> m (Xu &amp; Eckstein 1995); transverse ÷10, vertical ÷100","Spread map","pub","","The ratios are common defaults"),
  ("Source in the plume","Held at its peak concentration","Spread map","dev","low","Cautious"),
  ("Fast paths","0% in gravel and sand by default; karst and fractured rock treated as fast","Budget and spread map","dev","high","Editable on the Budget &amp; floods tab"),
  ("Path to surface water","500 m","When groundwater reaches the river or lake","dev","med",""),
  ("Direct releases are steady","Releases straight into groundwater or a river are yearly loads; a single event is possible only for releases to soil and air","Groundwater and river results","dev","low","For a one-off spill into groundwater, release it to the soil surface or spread its mass over the years it leaks"),
  ("Terrain direction","Plane fitted to the terrain within 1 km","Stand-in until you set the groundwater direction","dev","high","Support only"),
  ("Amber zone","At least 10% of the uncertainty runs above the standard","Spread map","dev","low",""),
 ]),
 ("sw","Rivers and lakes",[
  ("Lake water residence time","Lake Zurich 1.2, Lake Neuchâtel 8.2, Lake Geneva 11.4, Lake Lugano north basin 11.9 years","Metal in lake water","ch","","Canton of Schwyz; lake data summaries"),
  ("Lake trapping","90% of river particles settle","Lake sediment and downstream shares","dev","med","Bulk sediment retention measured at about 97–98%"),
  ("Methylation index","Points for bottom-water oxygen, trophic state, wetlands, DOC, pH and sulfate","Mercury methylation potential","dev","med","Qualitative ranking only"),
  ("Trophic state and bottom-water oxygen","With oxygen on Estimate: nutrient-poor lakes oxic; moderately or very nutrient-rich lakes seasonally anoxic","Lake redox, methylation, forms in lake water","dev","med","General limnology; many Swiss Plateau lakes have seasonal anoxia"),
  ("Season","Summer: seasonal anoxia counts as anoxic; winter: oxic; the multi-year budget runs May–September as summer","Methylation index and forms in lake water","dev","med",""),
  ("Hg⁰ escape from lake water","10% of the lake-water Hg per year; ×2 from May to September, ×2/7 in the other months","Hg in lake water and the air share of the budget","dev","high","Scaled from inland-lake evasion of about 1 ng/m²/h (Denkenberger et al. 2012); shallow lakes lose much more"),
  ("Methylmercury in lake water","3%, 10% or 20% of the dissolved Hg for oxic, seasonal or permanent anoxia, plus wetland and trophic terms (+2% or +5%); ×0.7 in summer, ×1.2 in winter; at most 40%","Forms in lake water","dev","high","Summer factor for breakdown by light (Sellers et al. 1996)"),
  ("Methylated arsenic in lake water","Year 3, 5, 10%; summer 5, 10, 20%; winter 2, 2, 3% for nutrient-poor, moderate and nutrient-rich lakes","Forms in lake water","dev","med","Algae methylate arsenic in summer"),
  ("Lake chemistry","Dissolved metal is not scavenged to the sediment","Lake water and downstream shares","dev","med","Simplification"),
 ]),
 ("redox","Redox ladder (optional)",[
  ("Electron balance","O₂ 4, NO₃⁻ to N₂ 5, organic carbon 4, SO₄²⁻ to H₂S 8 electrons; Mn(IV) 2 and Fe(III) 1 per atom, Mn oxides reduced before Fe oxides; dissolved hydrocarbons 0.42 mmol e⁻ per mg; COD 0.125 mmol e⁻ per mg O₂","Predominant electron-accepting process and aquifer redox condition with the ladder on","pub","","Standard redox stoichiometry; hydrocarbons from benzene 0.38, toluene 0.39, alkanes 0.44"),
  ("Organic contamination","Counts only as an electron donor; its own fate and transformation products are not calculated; release of arsenic naturally present in the sediment is not calculated","The ladder with organic contamination set","dev","med","Organic transformation would be poorly constrained at screening level"),
  ("Oxide stock","All Mn and Fe oxides count as available to microbes; bulk density 1.8 kg/L","Time until sulfate is reduced","dev","high","Only part of the oxides is microbially available, so the real time can be shorter"),
  ("Reaction zone","The first 10 m of the aquifer below the source","Time until sulfate is reduced","dev","med",""),
  ("Time horizon","The process reached by the budget year is the predominant one and sets the redox condition; the ladder names the dominant process and does not calculate species","All results with the ladder on","dev","med",""),
  ("Water regime from saturation","Fewer than 14 days well drained, up to 180 periodic, more permanent; below 1% organic carbon one step drier","Soil water regime with the ladder on","dev","med",""),
  ("Default water chemistry","O₂ 8, NO₃⁻ 15, SO₄²⁻ 30 mg/L; organic carbon 1 mg C/L; Mn oxides 0.2 g/kg","The ladder until you enter data","dev","med","Illustrative Swiss Plateau groundwater"),
 ]),
 ("exports","Exports for specialised models",[
  ("PHREEQC water chemistry","Ca 40, Mg 8, Na 5, K 1.5, Cl 10 mg/L; 10 °C; soil air 1% CO₂, river 0.1%, each unless entered on the Water analysis tab; charge balance on the first ion not measured","PHREEQC file","dev","high","Placeholders: replace with a water analysis"),
  ("PHREEQC redox and pH","Oxic set by dissolved O₂; suboxic pe 4, anoxic 0, sulfidic −3.5, or pe from a measured Eh, held by adding H₂; pH held with CO₂ (HCl below pH 6.5, NaOH for Pb, Cd, Cu, Zn and Ni with a measured alkalinity); arsenate added as a sodium salt matched to the pH, chromate as Na₂CrO₄, Cr(III) as Cr(OH)₃, the other metals as carbonates","PHREEQC file","dev","med",""),
  ("PHREEQC sorption","Hydrous ferric oxide from the oxalate Fe: 0.2 weak and 0.005 strong sites per Fe, 600 m²/g, 89 g per mol Fe","PHREEQC file","pub","","Dzombak &amp; Morel 1990; organic-matter binding not included"),
  ("HYDRUS hydraulic parameters","Loam: θr 0.078, θs 0.43, α 0.036 /cm, n 1.56, Ks 24.96 cm/d","HYDRUS sheet","pub","","Carsel &amp; Parrish 1988; replace with Rosetta estimates from texture"),
  ("MODFLOW 6 set-up","3 layers; vertical K = K/10; bulk density 1.8 t/m³; fixed heads for the gradient; dispersivity from Xu &amp; Eckstein at the receptor distance; slow seepage beyond the horizon starts at once","MODFLOW script","dev","med",""),
 ]),
 ("exp","Exposure",[
  ("Child soil ingestion","0.25 g/d, 10 kg body weight","Child dose","ch","","As in the Agroscope derivation of the Swiss Hg value"),
  ("Health reference points","As BMDL<sub>05</sub> 0.06 and Pb BMDL<sub>01</sub> 0.50 µg/kg bw per day; inorganic Hg TWI 4 and Cd TWI 2.5 µg/kg bw per week; Cu ADI 0.07 mg/kg bw per day; Ni TDI 13 µg/kg bw per day; Cr(III) TDI 0.3 mg/kg bw per day; Zn oral reference dose 0.3 mg/kg bw per day; Cr(VI) TDI 1.1 µg/kg bw per day","Child dose ratings","pub","","EFSA 2024, 2010, 2012, 2009, 2023, 2020, 2014; US EPA IRIS (Zn); Food Safety Commission of Japan 2019 (Cr(VI))"),
  ("Dose ratings with a tolerable intake","Above 100% of the TWI, ADI, reference dose or TDI: critical; above 10%: warning","Child dose for Hg, Cd, Cu, Zn, Ni and Cr","dev","med","The 10% step follows the Swiss Hg value, which allots 10% of the TWI to soil"),
  ("Cr(VI) dose","Only the Cr(VI) share of the added chromium counts; background chromium is Cr(III)","Child dose for chromium","dev","med",""),
  ("Relative bioavailability","100% by default","Child dose","dev","med","Cautious; often 30–50% for arsenic"),
 ]),
 ("forms","Forms by phase",[
  ("Form shares","As(III) share by soil water regime; methylmercury shares; HgS and lead sulfide shares in reducing conditions; lead carbonate share by pH; and the other rules in the methods","Forms-by-phase panel","dev","high","Methylmercury in lake sediment is supported by Swiss data (Lake Geneva about 0.4%, Lake Maggiore below 2%)"),
  ("Form shares of Cd, Cu, Zn, Ni, Cr","Carbonate shares by pH (Cd, Cu, Zn); sulfide shares in reducing soil, aquifer and sediment; Cu in soil water 98% and in rivers 90% bound to organic carbon; chromate share of dissolved Cr from the Cr(VI) share and its about 500 times weaker sorption","Forms-by-phase panel","dev","high","Cu organic binding: more than 99% in Swiss drainage water (Aldrich et al. 2002)"),
  ("Scenario definitions","Waterlogged: permanently waterlogged soil, anoxic aquifer; acidified: pH −1.5; floods: 1 in 10 years; anoxic lake: permanent anoxia, many wetlands","Forms-by-phase panel","dev","low",""),
 ]),
 ("unc","Uncertainty",[
  ("Input spreads","Kd σ 0.7 log (Pb, Hg, Cu, Ni), 0.8 (As, Cd, Zn, Cr), 0.3 if measured; suspended-matter Kd 0.5; erosion 0.4; conductivity 0.3 log units; infiltration ±30%; reactive fraction ×0.5–1.5; deposition share ×0.5–2; background ±30%","All ranges and the sensitivity chart","dev","high","Judgement-based and deliberately wide"),
  ("Runs","400 runs with a fixed seed","All ranges","pub","","Standard Monte Carlo method"),
 ]),
 ("air","Air and land surface",[
  ("Size split by chemical form","% of Hg⁰ gas / Hg(II) gas / fine / coarse / large particles, for example Pb fly ash 0/0/90/10/0, PbO dust 0/0/60/30/10, Hg(II) salt 20/60/20/0/0, Cu fungicide spray 0/0/30/50/20, brake and catenary wear 0/0/20/60/20, ores, manure and fertiliser 0/0/10/40/50","How much of an air release lands nearby","dev","high","Hg split from US EPA speciation factors for waste incineration (Godfrey et al. 2020); particle splits loosely follow EMEP/EEA PM2.5/TSP ratios"),
  ("Dry deposition velocities","Open land / forest, cm/s: Hg(II) gas 1.0 / 1.7, fine 0.1 / 0.3, coarse 0.5 / 1.5, large dust 3.5 / 4.0, Hg⁰ 0 / 0.06 (leaf uptake)","Deposition near and far","pub","","Zhang &amp; He 2014; Zhang et al. 2012; Obrist et al. 2021; the coarse values are the least certain"),
  ("Washout by rain","Fine 6×10⁻⁵, coarse and Hg(II) gas 3×10⁻⁴, large 6.7×10⁻⁴ per second per mm/h of rain","Wet deposition","pub","","US EPA HHRAP 2005 example values; the Hg(II) value is the developer's"),
  ("Plume","Briggs (1973) σz for neutral conditions, mixing height 700 m, no plume rise, averaged over wind sectors","Deposition pattern and air concentration","dev","med","Standard screening form; mixing height from the Payerne and Schaffhausen boundary-layer climatology (Collaud Coen et al. 2014), rounded"),
  ("Wind","Mean 2.5 m/s; the prevailing direction you set gets its share in a 90° sector, the rest is spread evenly","Most exposed point and map","ch","","Graf et al. 2019: 1.4–2.5 m/s on the Swiss Plateau"),
  ("Most exposed point","Searched beyond 100 m from the source","Deposition and air results","dev","med","Treats the first 100 m as the plant site"),
  ("Regional and far","Deposited between the footprint and 50 km counts as regional; beyond 50 km as carried far","Budget rows","dev","low",""),
  ("Forest and sealed shares","Forest 30% (100% if the land use is forest); sealed 5% for fields, 30% for gardens, 50% for industrial land","Where deposition goes","dev","med",""),
  ("Hg leaf uptake and litter","Uptake April to October, reaching the soil with the litter in October and November","Hg in forest soils","pub","","Wohlgemuth et al. 2020; litterfall 10–25 µg/m²/yr in European forests"),
  ("Snow cover","D = 0.114·h − 32 days, centred on early February at 1000 m; all year above about 3200 m","Snow storage and melt","ch","","Hydrological Atlas of Switzerland plate 3.6 (northern Alps), shortened by about 20 days for today's climate (Klein et al. 2016); the south side has less snow"),
  ("Hg re-emission from snow","50% of the Hg landing on snow returns to air before melt","Mercury budget","pub","","Model: 57% at 45–60°N (Durnford et al. 2012)"),
  ("Snowmelt runoff","30% of what the snowpack held runs off to streams at melt","Meltwater pulse to rivers","dev","high",""),
  ("Drainage of sealed surfaces and roads","Route shares by road type; retention direct 15%, road shoulder 100%, oil separator 30%, SABA 90%, sewage works 70%","Road and roof runoff","ch","","Steiner &amp; Hermann 2023 for FOEN (tyre-wear retention used for metals)"),
  ("Hg⁰ emission from soil","10 ng/m²/h per mg/kg soil Hg; ×10 for elemental Hg, ×0.1 for cinnabar","Hg topsoil loss and Hg in air","pub","","Fits 1–2 ng/m²/h for background soils (Zhu et al. 2016) and 15–800 at 2–25 mg/kg (Floreani et al. 2023); the form factors are the developer's"),
  ("Blown dust","0.05%/yr on industrial ground, 0.01% on fields, 0.005% in gardens, 0 in forest; 30% of it leaves the area","Small loss from bare soil","dev","med",""),
  ("Road emission factors","Pb 0.076 mg per car-km today; 10 mg per car-km in the leaded-petrol era; heavy vehicles count four times","Road releases","dev","high","Today's value from the EMEP/EEA Guidebook 2023 (brake and tyre wear); the leaded-era value and the heavy-vehicle factor are assumptions"),
  ("Road partition","Today 40% on the road surface, 50% beside the road, 10% in air; leaded era 20/30/50; 30% of road-surface dust blown back to the roadside; 75% of roadside deposition within 5 m","Roadside soil and runoff","dev","high","75% within 5 m from Sieber, Kawecki &amp; Nowack 2019 (Empa)"),
  ("Glacier ice","Pb 2 ng/g, Hg 0.01 ng/g, As 0.1 ng/g in 1950–1990 ice; 20% of the melt comes from that ice","Glacier melt releases","dev","high","Pb from the Colle Gnifetti record (decade means 1.0–2.7 ng/g, Sigl et al. 2018); Hg, As and the meltwater share are assumptions"),
  ("Background air","Pb in PM10 and Pb deposition at the nearest suitable NABEL station (2024); gaseous Hg from Osterwalder et al. 2024; Hg wet deposition 5 µg/m²/yr; Cd deposition 0.03 µg/(m²·d) and Cd in PM10 0.05 ng/m³, Zn deposition 10 µg/(m²·d) (NABEL 2023, low end); none for Cu, Ni, Cr; PM10 and PM2.5 from the FOEN maps (2023–2025)","LRV comparisons","ch","","Added for comparison only, not to the mass budget"),
  ("Air limits","LRV Pb in PM10 500 ng/m³ and Cd 1.5 ng/m³; LRV deposition Pb 100, Cd 2, Zn 400 µg/(m²·d); EU target values As 6 and Ni 20 ng/m³; WHO guideline for inorganic Hg vapour 1 µg/m³; none for Cu, Zn and Cr in air","Air results","law","","LRV Annex 7; EU Directive 2004/107/EC; WHO Air Quality Guidelines for Europe 2000"),
 ]),
 ("law","Swiss limit values",[
  ("Limits","TBDV drinking water as amended on 19 June 2026 (Pb 5 µg/L, to be met by 1 February 2036; total Cr 20 µg/L); AltlV Annex 1 and 3 as of 1 December 2025 (As 10 µg/L; Pb in gardens 300 mg/kg); GSchV; VBBo guide and trigger values; LRV","All status labels","law","","Check against the current text on fedlex.admin.ch"),
  ("Trigger values by land use","Agriculture: Pb 200, Cd 2 (food and fodder), Cu 150 (fodder) mg/kg; gardens: Pb 200, Cd 2 (food crops)","Soil status labels","law","","VBBo Annex 1; the stricter food-crop values are used for gardens"),
  ("Chromium values","AltlV seepage value (20 µg/L) and garden remediation value (100 mg/kg) refer to Cr(VI): the remediation value is compared with the Cr(VI) share of the added chromium; seepage compares total dissolved Cr","Chromium status labels","dev","low","Cautious for Cr(III)"),
 ]),
]
rows_all = [r for _,_,rs in sections for r in rs]
cnt = {k:sum(1 for r in rows_all if r[3]==k) for k in B}
hi = sum(1 for r in rows_all if r[3]=="dev" and r[4]=="high")
toc = '\n'.join(f'      <a href="#{sid}">{E(t)}</a>' for sid,t,_ in sections)
def row(r):
    item,val,used,basis,prio,note = r
    cls,lab = B[basis]
    pr = f'<span class="prio {prio}">{P[prio]}</span>' if basis=="dev" else ""
    return f'<tr><td><b>{E(item)}</b></td><td>{val}</td><td>{E(used)}</td><td><span class="pill {cls}">{lab}</span>{pr}</td><td>{note}</td></tr>'
body = ''.join(f'''
      <section id="{sid}">
        <h2>{E(t)}</h2>
        <div class="tbl-wrap"><table>
          <thead><tr><th>Item</th><th>Value</th><th>Affects</th><th>Basis</th><th>Note</th></tr></thead>
          <tbody>{''.join(row(r) for r in rs)}</tbody>
        </table></div>
      </section>''' for sid,t,rs in sections)
page = head + '''.man-body .tbl-wrap table{min-width:760px}
.prio{display:inline-block; margin-left:6px; font-family:var(--f-mono); font-size:10.5px; text-transform:uppercase; letter-spacing:.04em; color:var(--ink-3)}
.prio.high{color:var(--crit)}
.prio.med{color:var(--warn)}
td .pill{white-space:nowrap}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div class="title-block">
      <a class="logo-link" href="index.html" aria-label="CHemTrace home"><svg class="logo-svg" viewBox="3.1 -70.8 550.3 72.8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="#FF3B3B" d="M38.8 -10.4Q51.9 -10.4 56.9 -23.4L69.5 -18.7Q65.4 -8.7 57.6 -3.9Q49.8 1 38.8 1Q22.2 1 13.2 -8.4Q4.1 -17.8 4.1 -34.7Q4.1 -51.7 12.8 -60.7Q21.6 -69.8 38.2 -69.8Q50.3 -69.8 57.9 -65Q65.5 -60.1 68.6 -50.7L55.9 -47.2Q54.3 -52.4 49.6 -55.4Q44.9 -58.5 38.5 -58.5Q28.7 -58.5 23.7 -52.4Q18.6 -46.4 18.6 -34.7Q18.6 -22.9 23.8 -16.6Q29 -10.4 38.8 -10.4ZM123.3 0V-29.5H93.3V0H78.9V-68.8H93.3V-41.4H123.3V-68.8H137.7V0Z"/><path fill="currentColor" d="M173 1Q161.1 1 154.7 -6.1Q148.3 -13.1 148.3 -26.7Q148.3 -39.7 154.8 -46.8Q161.3 -53.8 173.2 -53.8Q184.6 -53.8 190.6 -46.3Q196.6 -38.7 196.6 -24.2V-23.8H162.7Q162.7 -16.1 165.6 -12.1Q168.5 -8.2 173.7 -8.2Q181 -8.2 182.9 -14.5L195.8 -13.4Q190.2 1 173 1ZM173 -45.2Q168.2 -45.2 165.6 -41.8Q163 -38.4 162.8 -32.4H183.3Q183 -38.8 180.3 -42Q177.6 -45.2 173 -45.2ZM238.1 0V-29.6Q238.1 -43.6 230.1 -43.6Q226 -43.6 223.4 -39.3Q220.8 -35.1 220.8 -28.3V0H207V-41Q207 -45.3 206.9 -48Q206.8 -50.7 206.6 -52.8H219.7Q219.9 -51.9 220.1 -47.9Q220.4 -43.8 220.4 -42.3H220.6Q223.1 -48.4 226.9 -51.1Q230.7 -53.9 235.9 -53.9Q248 -53.9 250.6 -42.3H250.9Q253.6 -48.5 257.4 -51.2Q261.1 -53.9 266.9 -53.9Q274.7 -53.9 278.7 -48.6Q282.8 -43.4 282.8 -33.5V0H269.1V-29.6Q269.1 -43.6 261.1 -43.6Q257.1 -43.6 254.6 -39.7Q252 -35.8 251.8 -29V0ZM326.7 -57.7V0H312.3V-57.7H290.1V-68.8H349V-57.7ZM351.5 0V-40.4Q351.5 -44.8 351.4 -47.7Q351.3 -50.6 351.1 -52.8H364.2Q364.4 -52 364.6 -47.5Q364.8 -43 364.8 -41.6H365Q367 -47.1 368.6 -49.4Q370.2 -51.7 372.3 -52.8Q374.5 -53.9 377.7 -53.9Q380.3 -53.9 381.9 -53.1V-41.7Q378.6 -42.4 376.1 -42.4Q370.9 -42.4 368.1 -38.2Q365.2 -34.1 365.2 -25.9V0ZM402.6 1Q395 1 390.7 -3.2Q386.4 -7.4 386.4 -14.9Q386.4 -23.1 391.7 -27.4Q397.1 -31.7 407.2 -31.8L418.6 -32V-34.7Q418.6 -39.9 416.8 -42.4Q415 -44.9 410.9 -44.9Q407.1 -44.9 405.3 -43.2Q403.5 -41.5 403.1 -37.5L388.8 -38.1Q390.1 -45.8 395.8 -49.8Q401.6 -53.8 411.5 -53.8Q421.5 -53.8 426.9 -48.9Q432.3 -43.9 432.3 -34.9V-15.6Q432.3 -11.2 433.3 -9.5Q434.3 -7.8 436.7 -7.8Q438.2 -7.8 439.7 -8.1V-0.7Q438.5 -0.4 437.5 -0.1Q436.5 0.1 435.5 0.2Q434.6 0.4 433.5 0.5Q432.4 0.6 430.9 0.6Q425.7 0.6 423.3 -2Q420.8 -4.5 420.3 -9.4H420Q414.3 1 402.6 1ZM418.6 -24.5 411.6 -24.4Q406.8 -24.2 404.8 -23.3Q402.8 -22.5 401.7 -20.7Q400.7 -18.9 400.7 -16Q400.7 -12.3 402.4 -10.4Q404.2 -8.6 407 -8.6Q410.3 -8.6 412.9 -10.4Q415.6 -12.1 417.1 -15.2Q418.6 -18.3 418.6 -21.8ZM468.1 1Q456.1 1 449.5 -6.2Q443 -13.3 443 -26.1Q443 -39.2 449.6 -46.5Q456.2 -53.8 468.3 -53.8Q477.6 -53.8 483.7 -49.1Q489.8 -44.4 491.4 -36.2L477.5 -35.5Q477 -39.6 474.6 -42Q472.3 -44.4 468 -44.4Q457.4 -44.4 457.4 -26.7Q457.4 -8.4 468.2 -8.4Q472.1 -8.4 474.7 -10.9Q477.3 -13.3 478 -18.2L491.7 -17.6Q491 -12.2 487.9 -7.9Q484.7 -3.7 479.6 -1.3Q474.5 1 468.1 1ZM523.3 1Q511.4 1 505 -6.1Q498.6 -13.1 498.6 -26.7Q498.6 -39.7 505.1 -46.8Q511.6 -53.8 523.5 -53.8Q534.9 -53.8 540.9 -46.3Q546.9 -38.7 546.9 -24.2V-23.8H513Q513 -16.1 515.8 -12.1Q518.7 -8.2 524 -8.2Q531.2 -8.2 533.2 -14.5L546.1 -13.4Q540.5 1 523.3 1ZM523.3 -45.2Q518.5 -45.2 515.8 -41.8Q513.2 -38.4 513.1 -32.4H533.6Q533.2 -38.8 530.5 -42Q527.8 -45.2 523.3 -45.2Z"/></svg></a>
      <span class="kicker">Contaminants in Swiss landscapes · now As · Hg · Pb · Cd · Cu · Zn · Ni · Cr, more in progress</span>
      <h1>Assumptions</h1>
      <p class="lede">Every default and assumption in the model, what it affects and where it comes from. Version 0.14.0, 25 November 2026.</p>
    </div>
    <a class="btn" href="index.html">Open the platform</a>
  </header>

  <div class="man">
    <nav class="toc" aria-label="Contents">
      <b>Contents</b>
      <a href="#read">How to read this page</a>
''' + toc + '''
      <a href="validation.html">Validation →</a>
    </nav>

    <main class="man-body">
      <section id="read">
        <h2>How to read this page</h2>
        <p class="lead">''' + f'{len(rows_all)} items are listed. {cnt["dev"]} are developer assumptions, set for this tool without a published source; {hi} of them are marked high priority for expert review because they drive key results.' + '''</p>
        <div class="tbl-wrap"><table>
          <thead><tr><th>Basis</th><th>Meaning</th><th>Items</th></tr></thead>
          <tbody>
            <tr><td><span class="pill ok">Published</span></td><td>Equation or value from a peer-reviewed or official international source</td><td>''' + str(cnt["pub"]) + '''</td></tr>
            <tr><td><span class="pill ok">Swiss data</span></td><td>Measured in Switzerland or taken from a Swiss agency report</td><td>''' + str(cnt["ch"]) + '''</td></tr>
            <tr><td><span class="pill info">Legal value</span></td><td>Set in Swiss ordinances; check the current text</td><td>''' + str(cnt["law"]) + '''</td></tr>
            <tr><td><span class="pill check">Developer assumption</span></td><td>Set by the developer for this tool; needs expert review. Priority <span class="prio high">High</span> <span class="prio med">Medium</span> <span class="prio low">Low</span> shows how much it moves key results</td><td>''' + str(cnt["dev"]) + '''</td></tr>
          </tbody>
        </table></div>
        <p>Most values can be changed in Advanced mode, and entering measured data replaces the default. The equations are listed under "Screening equations and assumptions" on the platform, and the comparison with measurements is on the <a href="validation.html">validation page</a>.</p>
      </section>''' + body + '''
      <p class="back"><a href="index.html">← Back to the platform</a> · <a href="manual.html">User manual</a> · <a href="validation.html">Validation</a></p>
    </main>
  </div>

  <footer>CHemTrace · screening estimates for contaminants in Switzerland (now As, Hg, Pb, Cd, Cu, Zn, Ni and Cr).<span class="copy">© 2026 Li-Ling T. ETH Zürich · Version 0.14.0, 25 November 2026 · Contact: <a href="mailto:litail@ethz.ch">litail@ethz.ch</a></span></footer>
</div>
</body>
</html>
'''
open(os.path.join(SITE, 'assumptions.html'), 'w', encoding='utf-8').write(page)
print(len(rows_all), cnt, 'high', hi)
