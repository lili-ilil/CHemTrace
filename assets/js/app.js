/* CHemTrace (formerly Swiss Metal Pathways) – app */
(function(){
"use strict";

/* ================= METALS ================= */
const METALS = {
  As:{name:"Arsenic", site:"Mine dump",
    sig:"A metalloid that switches between arsenate As(V) and the more mobile, more toxic arsenite As(III) as redox conditions change. Iron oxides are its main sink: when they dissolve, arsenic is released.",
    forms:["As(V) arsenate · H₂AsO₄⁻ / HAsO₄²⁻","As(III) arsenite · H₃AsO₃","Arsenopyrite · FeAsS","Methylated · MMA, DMA","Arsenobetaine (fish, non-toxic)"],
    sources:["Geogenic: As-rich crystalline rock and ore in Valais, Graubünden and Ticino","Old mine dumps and sulfide waste","Historical arsenical pesticides and CCA-treated wood","Combustion and waste incineration"],
    health:["high","Inorganic As is a Group 1 carcinogen (skin, lung, bladder). Chronic exposure also causes skin lesions, cardiovascular disease and diabetes. Drinking water and rice are the main routes."],
    lever:"Keep arsenic bound to iron oxides: avoid reducing conditions in soils and aquifers, and treat affected drinking water with iron-based adsorbents."},
  Hg:{name:"Mercury", site:"Waste canal",
    sig:"The only metal that travels the globe as a gas. Its danger depends on methylation: microbes in oxygen-poor water turn inorganic mercury into methylmercury, which builds up in fish.",
    forms:["Hg⁰ · elemental vapour","Hg(II) · HgCl₂, Hg–thiol complexes","HgS · cinnabar / metacinnabar","CH₃Hg⁺ · methylmercury"],
    sources:["Legacy chemical industry: Lonza Visp wastewater until the mid-1970s, spread with dredged canal sediment","Waste incineration and crematoria (dental amalgam)","Long-range atmospheric deposition","Glacier melt releasing stored legacy Hg"],
    health:["high","Methylmercury harms the developing brain and crosses the placenta. Hg⁰ vapour damages the nervous system and lungs; inorganic Hg salts damage the kidneys."],
    lever:"Stop methylation: keep lake bottoms and sediments oxic, keep Hg away from wetlands, and capture Hg in flue gas before it enters the global pool."},
  Pb:{name:"Lead", site:"Range berm",
    sig:"A particle-loving metal. Pb²⁺ binds tightly to organic matter, iron and manganese oxides and phosphate, so it moves mostly with particles and stays close to where it lands, often for centuries.",
    forms:["Pb²⁺ sorbed to humus and oxides","Metallic Pb (bullets)","Cerussite PbCO₃ / hydrocerussite","Pyromorphite Pb₅(PO₄)₃Cl","Galena PbS"],
    sources:["About 4,000 shooting-range sites; about 100 t of Pb still fired per year","Legacy leaded petrol in roadside soils","Old paint, roof flashing and façades","Waste incineration fly ash"],
    health:["high","No known safe level (WHO). Lowers children's IQ and causes behaviour problems; raises blood pressure and harms kidneys in adults. Stored in bone and released again in pregnancy."],
    lever:"Trap it where it lands: artificial bullet traps, soil removal, phosphate stabilisation, and particle retention in runoff and rivers."}
};

/* ================= COMPARTMENTS ================= */
const C = {
 air:{name:"Atmosphere", zone:"Boundary layer to free troposphere", base:{As:3,Hg:5,Pb:3},
  As:{forms:[["As₂O₃ (arsenolite) on fine particles","From smelting, coal and waste combustion"],["Arsine and methylarsines · AsH₃, (CH₃)₃As","Trace gases from wetlands and microbes; minor fluxes"]],
   what:"Arsenic travels almost entirely on fine particles (PM2.5). Rain and dry deposition remove it within days to weeks, so most of it lands in the region where it was emitted.",
   risk:["med","Inhaled As-bearing particles are a lung-cancer risk near smelters and coal plants. At Swiss background levels, air is a minor route compared with water and food."],
   trap:["Fabric filters or electrostatic precipitators at the stack","Cool flue gas before filtering so As₂O₃ condenses onto particles","Control dust from tailings and soil remediation works"],
   swiss:"The LRV sets immission limits for lead and cadmium, but none for arsenic.",
   inputs:["emission rate","particle size","stack height","wind field","rain intensity"],
   sc:{storm:[0,"Rain scavenges particles efficiently: wet deposition peaks."]}},
  Hg:{forms:[["Hg⁰ · gaseous elemental mercury","More than 90% of airborne Hg; lifetime of months to about a year"],["Hg(II) · HgCl₂, HgBr₂ (gaseous oxidised)","Water-soluble, deposits close to sources"],["Particle-bound Hg","Deposits with dust and rain"]],
   what:"Hg⁰ mixes around the globe and is slowly oxidised to Hg(II), which rain and snow wash out. Soils, snow and lakes reduce part of it back to Hg⁰ and re-emit it, so mercury can hop several times before it is buried.",
   risk:["med","Outdoor Hg⁰ is far below harmful levels. Indoor vapour from spills, amalgam work or contaminated ground can be harmful."],
   trap:["Activated carbon (often brominated) injected into or fixed in the flue gas","Wet scrubbers capture Hg(II); Hg⁰ must be oxidised first","Amalgam separators in dental practices"],
   swiss:"Switzerland is a Party to the Minamata Convention on Mercury.",
   inputs:["emission speciation (Hg⁰ / Hg(II) / particulate)","global background","wind & precipitation"],
   sc:{storm:[0,"Wet deposition of Hg(II) peaks during storms."]}},
  Pb:{forms:[["Pb on fine and coarse particles · PbO, PbSO₄","Industrial and combustion sources"],["Pb halides from leaded petrol","The historical main source"],["Resuspended road and soil dust","Today a large share of airborne Pb"]],
   what:"Lead has no significant gas phase and falls out with particles, mostly near its sources. Fine particles travel far: Alpine ice recorded lead from medieval mining in Britain.",
   risk:["med","Inhalation is now a minor route in Switzerland. It was the main route in the leaded-petrol era."],
   trap:["Fabric filters or electrostatic precipitators at the stack","Street sweeping and dust control","Stable lead isotopes (²⁰⁶Pb/²⁰⁷Pb) fingerprint the source"],
   swiss:"LRV limits: Pb in PM10 500 ng/m³ and Pb in dust deposition 100 µg/(m²·d), both as annual means.",
   inputs:["emission rate","particle size","deposition velocity","wind & precipitation"],
   sc:{storm:[0,"Rain scavenges Pb-bearing particles: wet deposition peaks."]}}
 },
 glacier:{name:"Glacier & snowpack", zone:"Above ~2,500 m · ice archive", base:{As:2,Hg:3,Pb:2},
  As:{forms:[["As(V) on mineral dust and cryoconite","Geogenic and deposited"],["Dissolved arsenate in meltwater","Released during melt"]],
   what:"Snow and firn store atmospheric deposition layer by layer, and fine mineral dust in the ice carries geogenic arsenic. Melting releases both, mostly bound to glacial flour.",
   risk:["low","No direct exposure. Matters as a delayed source to rivers and reservoirs."],
   trap:["Proglacial lakes and hydropower reservoirs trap glacial flour and the As sorbed to it","Check reservoir sediments before flushing operations"],
   swiss:"Swiss glaciers are losing volume quickly, so deposits stored in the ice are being released now.",
   inputs:["glacier extent & melt (GLAMOS)","suspended sediment","As in ice and cryoconite"],
   sc:{melt:[1,"Melt season moves the stored load into the river within weeks."]}},
  Hg:{forms:[["Hg(II) in fresh snow","Partly photoreduced to Hg⁰ and re-emitted"],["Hg bound to cryoconite and organic matter","Archived in firn and ice"]],
   what:"Fresh snow loses part of its mercury back to the air within days, as sunlight reduces Hg(II) to Hg⁰. What stays is archived in firn and ice and released when the glacier melts.",
   risk:["low","No direct exposure. A growing, climate-sensitive source to downstream lakes."],
   trap:["Proglacial lakes and reservoirs trap particle-bound Hg; watch their anoxic bottom water for methylation"],
   swiss:"A 2026 study of two French Alpine lakes found mercury accumulation roughly doubling in the glacier-fed lake, consistent with Hg released from shrinking ice.",
   inputs:["glacier melt (GLAMOS)","Hg in ice and cryoconite","reservoir operation"],
   sc:{melt:[1,"Legacy Hg leaves with meltwater and sediment."]}},
  Pb:{forms:[["Pb-bearing aerosol particles","Stored layer by layer in snow and ice"]],
   what:"Alpine ice is an archive of lead pollution. The Colle Gnifetti ice core records medieval lead mining, industrialisation, and the rise and fall of leaded petrol.",
   risk:["low","No direct exposure. Melt releases particle-bound Pb to rivers."],
   trap:["Reservoirs and proglacial lakes settle out particle-bound Pb"],
   swiss:"Colle Gnifetti lies on Monte Rosa, on the Swiss–Italian border.",
   inputs:["melt rate","Pb in ice"],
   sc:{melt:[1,"Melt releases particle-bound Pb from older ice layers."]}}
 },
 bedrock:{name:"Bedrock & ore veins", zone:"Crystalline Alps and valley basement", base:{As:2,Hg:1,Pb:1},
  As:{forms:[["Arsenopyrite FeAsS, As-bearing pyrite","Primary minerals in ore veins"],["Scorodite FeAsO₄·2H₂O, As on Fe oxides","Weathering products"]],
   what:"Oxygen and water oxidise sulfide minerals and release arsenate. Freshly formed iron oxides catch much of it again; the rest enters fracture water and streams.",
   risk:["med","Indirect: springs and wells fed by fractured crystalline rock can exceed 10 µg/L."],
   trap:["The source is natural and diffuse, so manage it at the water supply","Choose or blend low-As springs","Iron-oxide adsorption filters at the spring"],
   swiss:"Elevated groundwater arsenic occurs almost only in the Alps and south of the Alps, mainly in crystalline fractured aquifers (FOEN, NAQUA).",
   inputs:["geology (GeoCover)","fracture flow paths","spring As, Fe, O₂"],
   sc:{reducing:[1,"Reducing fracture water keeps As as mobile As(III) and dissolves Fe oxides."]}},
  Hg:{forms:[["Cinnabar HgS","Rare in Switzerland; one of the least soluble minerals"],["Trace Hg in sulfide ores",""]],
   what:"Natural mercury in Swiss rocks is low. Weathering releases very little, so geogenic Hg is rarely a management target here.",
   risk:["low","Negligible from rock in Switzerland."],
   trap:["No action normally needed"],
   swiss:"",
   inputs:["geology (GeoCover)"], sc:{}},
  Pb:{forms:[["Galena PbS","In ore veins"],["Pb in K-feldspar and other silicates","Diffuse background"],["Anglesite PbSO₄, cerussite PbCO₃","Weathering products"]],
   what:"Galena weathers slowly. The Pb²⁺ it releases is quickly caught again as carbonate, sulfate or sorbed species.",
   risk:["low","Natural background rarely needs control."],
   trap:["No action normally needed"],
   swiss:"",
   inputs:["geology (GeoCover)"], sc:{acidic:[1,"Acidic water weathers galena faster and keeps Pb²⁺ in solution."]}}
 },
 forest:{name:"Mountain forest soil", zone:"~1,000–1,800 m · often acidic", base:{As:2,Hg:2,Pb:2},
  As:{forms:[["As(V) inner-sphere complexes on Fe/Al oxides","Main binding form"],["Organo-As, DMA","From microbial methylation"]],
   what:"Forest canopies comb particles out of the air, so forest soils collect deposition. Unlike cationic metals, arsenate binds better at low pH; it desorbs above pH 8 and where phosphate competes for sites.",
   risk:["low","Little direct exposure."],
   trap:["Keep forest cover to stabilise soil and limit erosion of As-bearing particles"],
   swiss:"Many Alpine forest soils on crystalline rock are acidic and naturally As-rich.",
   inputs:["pH","Fe/Al oxides (oxalate)","organic carbon","throughfall"],
   sc:{acidic:[-1,"Low pH strengthens arsenate sorption on Fe oxides, the opposite of Pb."],reducing:[2,"Waterlogged patches reduce As(V) to As(III) and dissolve Fe oxides."]}},
  Hg:{forms:[["Hg(II) bound to thiol (–SH) groups of organic matter","Main binding form"],["Hg⁰","Re-emitted to air"]],
   what:"Leaves take up Hg⁰ from the air and drop it with litterfall, so forest floors are major mercury sinks. Hg(II) sticks to reduced sulfur in organic matter and moves mainly with dissolved organic carbon (DOC).",
   risk:["low","Little direct exposure; feeds Hg to streams with DOC."],
   trap:["Protect forest wetlands and peat from drainage and repeated flooding, which promote methylation"],
   swiss:"NABO background Hg in Swiss topsoils is about 0.03–0.29 mg/kg.",
   inputs:["organic carbon & DOC export","litterfall","wetland fraction"],
   sc:{reducing:[1,"Waterlogged organic soils and wetlands become methylation hotspots."],acidic:[1,"Acidic soils export more DOC-bound Hg to streams."]}},
  Pb:{forms:[["Pb²⁺ bound to humus","Main binding form"],["Pb–DOC complexes","In acidic seepage water"]],
   what:"Forest humus holds decades of atmospheric lead. Below about pH 5, Pb becomes more soluble and moves downward with dissolved organic carbon.",
   risk:["low","Little direct exposure."],
   trap:["Liming acidic soils lowers Pb solubility (check side effects)","Keep humus layers intact: erosion moves the Pb stock"],
   swiss:"NABO has tracked Pb in topsoil at over 100 long-term sites since 1985.",
   inputs:["pH","organic carbon","DOC","humus thickness"],
   sc:{acidic:[1,"Below pH ~5, sorption weakens and Pb leaches with DOC."]}}
 },
 farm:{name:"Farmland & gardens", zone:"Valley floor · ~450–700 m", base:{As:2,Hg:2,Pb:1},
  As:{forms:[["As(V) sorbed on Fe oxides and clay edges","Aerated soils"],["As(III)","Waterlogged soils"]],
   what:"In aerated, calcareous valley soils arsenate stays on iron oxides. Phosphate fertiliser competes for the same sites and can push As into solution. Flooding or heavy irrigation dissolves Fe oxides and releases As(III).",
   risk:["med","Vegetable uptake is usually low. Soil ingestion by children and rice from flooded fields are the main concerns."],
   trap:["Iron-based amendments (Fe oxides, zero-valent iron) immobilise As","Avoid phosphate amendments on As-rich soils: P displaces arsenate","Avoid long waterlogging; drain"],
   swiss:"In some old orchards and vineyards, historical arsenical pesticides such as lead arsenate left As and Pb together in topsoil.",
   inputs:["pH","Fe oxides","P status","drainage class","background As"],
   sc:{reducing:[2,"Waterlogging dissolves Fe oxides: As(III) is released."],acidic:[-1,"Acidic soils hold arsenate more strongly."],storm:[1,"Erosion moves As-bearing particles to the river."]}},
  Hg:{forms:[["Hg(II)–organic matter complexes","Main binding form"],["HgS and Hg on Fe oxides",""],["Hg⁰","Spills and contaminated sediment"]],
   what:"Mercury binds strongly in topsoil and moves little downward. It leaves mainly through erosion, re-emission as Hg⁰ and, in flooded soils, as methylmercury.",
   risk:["med","Soil ingestion by children in gardens and playgrounds. Swiss remediation value: 2 mg/kg."],
   trap:["Excavation and disposal of hotspots (the Visp approach)","Thermal desorption for heavily contaminated soil","Stabilisation with sulfur or thiol sorbents in aerated soil"],
   swiss:"Around Visp (VS), mercury from Lonza wastewater reached gardens and fields via dredged canal sediment. By 2026 Lonza had removed about 3,500 kg of Hg from 174 residential parcels and about 175,000 m² in total.",
   inputs:["total Hg","organic carbon","land use","flooding frequency"],
   sc:{reducing:[1,"Flooded fields can form methylmercury."],storm:[1,"Erosion moves Hg-rich topsoil."]}},
  Pb:{forms:[["Pb²⁺ on organic matter, Fe/Mn oxides, clay","Main binding form"],["Cerussite PbCO₃","Calcareous soils"],["Pyromorphite Pb₅(PO₄)₃Cl","Where phosphate is present"]],
   what:"In neutral and calcareous soils lead hardly moves and stays in the top 20 cm for centuries. It leaves the field mainly by erosion and as soil stuck to vegetables, not through roots.",
   risk:["med","Children ingest soil and dust hand-to-mouth; leafy vegetables carry soil particles."],
   trap:["Phosphate amendments turn Pb into insoluble pyromorphite (not on As-rich soils)","Excavate where remediation values are exceeded","Raised beds and clean topsoil in gardens"],
   swiss:"VBBo guide value 50 mg/kg; trigger value 200 mg/kg for food and fodder crops. AltlV remediation values: 1,000 mg/kg in gardens and playgrounds, 2,000 mg/kg in agriculture.",
   inputs:["total Pb","pH","organic carbon","P","erosion risk"],
   sc:{acidic:[1,"Below pH ~5, Pb starts to leach."],storm:[1,"Erosion is the main way Pb leaves the field."]}}
 },
 town:{name:"Town & industry", zone:"Stacks, roofs, roads, sewers", base:{As:3,Hg:4,Pb:3},
  As:{forms:[["As in fly ash and flue-gas particles","Waste incineration, combustion"],["CCA-treated wood","Chromated copper arsenate"],["Industrial effluents","Glass, electronics, metallurgy"]],
   what:"Urban arsenic comes mostly from point sources: combustion, specific industries and old treated wood. Runoff carries particles into the sewer.",
   risk:["med","Occupational exposure and burning treated wood are the main concerns."],
   trap:["Flue-gas cleaning at the source","Collect CCA-treated wood separately; never burn it","Iron coagulation in industrial wastewater pre-treatment"],
   swiss:"SwissPRTR lists facility releases of As, Hg and Pb to air, water and soil above reporting thresholds.",
   inputs:["SwissPRTR releases","emission inventory","sewer catchment"],
   sc:{storm:[1,"Sewer overflows send untreated runoff to the river."]}},
  Hg:{forms:[["Hg⁰ and Hg(II) in flue gas","Waste incineration, crematoria"],["Hg in wastewater","Amalgam, legacy products"]],
   what:"Today's Swiss emissions are small compared with the legacy. Mercury thermometers, batteries and most lamps are phased out.",
   risk:["med","Mainly through the air and food chain."],
   trap:["Activated carbon and scrubbers in flue gas","Amalgam separators in dental practices","Separate collection of Hg-containing waste"],
   swiss:"SwissPRTR reports facility mercury releases to air and water.",
   inputs:["SwissPRTR releases","stack parameters","Hg speciation"],
   sc:{storm:[1,"Sewer overflows bypass treatment."]}},
  Pb:{forms:[["Pb in old paint, roof flashing, façades","Washed off by rain"],["Roadside Pb from leaded petrol","Legacy; leaded petrol banned in 2000"],["Pb in incineration fly ash",""]],
   what:"Runoff from roofs, façades and roads carries lead particles into sewers and streams. Historic urban soils often hold centuries of lead.",
   risk:["med","Dust and soil in older neighbourhoods; old paint during renovation."],
   trap:["Road runoff treatment (SABA): settling and filter soils","Infiltration through biologically active soil (swales)","Lead-safe renovation of old paint"],
   swiss:"FOEN names roof, façade and road runoff, leaded-petrol legacy, old paint and ammunition as human sources of Pb in groundwater.",
   inputs:["impervious area","runoff","building age","traffic legacy"],
   sc:{storm:[1,"First flush washes Pb particles off roofs and roads."]}}
 },
 site:{name:"Contaminated site", zone:"", base:{As:3,Hg:3,Pb:2},
  As:{zone:"Mine dump", forms:[["Arsenopyrite and scorodite in tailings",""],["Ferric arsenates, As-rich Fe oxides","Secondary minerals"],["Dissolved As(V) in acidic seepage",""]],
   what:"Exposed sulfide waste oxidises much faster than intact rock. Seepage can carry high arsenate loads; iron precipitates downstream catch part of them.",
   risk:["med","Local: seepage water, dust, and soil ingestion on or near the dump."],
   trap:["Cover and cap to cut oxygen and water inflow","Permeable reactive barrier with zero-valent iron or Fe oxides in the seepage path","Collect seepage and treat with Fe(III) coagulation"],
   swiss:"Contaminated sites are listed in the cantonal registers (Kataster der belasteten Standorte).",
   inputs:["waste mineralogy","seepage flux & chemistry","cover design"],
   sc:{storm:[1,"Heavy rain flushes oxidation products out of the dump."],reducing:[1,"Reducing seepage carries As(III)."]}},
  Hg:{zone:"Chemical waste canal & landfill", forms:[["Hg⁰ droplets and HgS","In sediments and waste"],["Hg(II) complexes","In seepage"],["CH₃Hg⁺","Formed in anoxic zones"]],
   what:"Chlor-alkali and other Hg-based processes left mercury in canals and landfills. These keep releasing Hg for decades, and their anoxic zones can methylate it.",
   risk:["high","Local direct contact, vapour, and contaminated fish downstream."],
   trap:["Dredge and dispose of canal sediments","Sealing (cut-off) walls around landfills","Activated-carbon caps on sediments to cut MeHg uptake"],
   swiss:"Still open at Visp: removing Hg from the Grossgrundkanal and remediating the Gamsenried landfill, where a sealing wall is planned.",
   inputs:["Hg inventory & speciation","hydraulic gradients","redox zones"],
   sc:{reducing:[1,"Anoxic zones methylate Hg."],storm:[1,"Floods remobilise canal sediment."]}},
  Pb:{zone:"Shooting range", forms:[["Metallic Pb bullets and fragments",""],["Hydrocerussite Pb₃(CO₃)₂(OH)₂, cerussite PbCO₃, PbO","Corrosion crusts"],["Antimony (Sb) co-contaminant","More mobile than Pb, as antimonate"]],
   what:"Bullets in earth berms corrode over decades, and berm soil can hold tens of grams of lead per kilogram. Antimony from the bullet alloy migrates faster than lead.",
   risk:["med","Local soil contact; grazing animals; groundwater where the water table is shallow."],
   trap:["Artificial (closed) bullet traps at active ranges","Excavate and dispose of berm soil","Phosphate or Fe amendments for residual contamination (watch Sb)"],
   swiss:"About 4,000 shooting-range sites are in the cantonal registers, with tens of thousands of tonnes of Pb and Sb in the ground. Over 1,200 were remediated by 2025; federal (VASA) funding requires completion by 2045.",
   inputs:["rounds fired","berm volume","pH, carbonate, P","depth to groundwater"],
   sc:{acidic:[1,"Acidic soil speeds corrosion and leaching."],storm:[1,"Runoff erodes berm soil."]}}
 },
 people:{name:"People & food chain", zone:"Wells, gardens, fish, air", base:{As:0,Hg:0,Pb:0},
  As:{forms:[["Inorganic As(III) / As(V)","In water and rice; toxic"],["Arsenobetaine","In fish; practically non-toxic"]],
   what:"Exposure is mostly by ingestion. The body methylates inorganic arsenic to MMA and DMA for excretion; some trivalent intermediates are themselves toxic.",
   risk:["high","IARC Group 1 carcinogen (skin, lung, bladder). Also skin lesions, cardiovascular disease and diabetes. WHO drinking-water guideline: 10 µg/L."],
   trap:["Treat drinking water at the source (see Groundwater)","Vary rice sources; cook rice in excess water"],
   swiss:"Swiss drinking-water maximum: 10 µg/L (TBDV).",
   inputs:["drinking-water source","diet (rice, seafood)","sensitive groups"], sc:{}},
  Hg:{forms:[["CH₃Hg⁺ from fish","About 95% absorbed by the gut"],["Hg⁰ vapour","Inhaled; about 80% absorbed"],["Hg²⁺ salts","Poorly absorbed"]],
   what:"Methylmercury crosses the placenta and the blood–brain barrier, so the fetus is the most sensitive receptor.",
   risk:["high","MeHg harms the developing brain (EFSA tolerable weekly intake 1.3 µg/kg body weight). Hg⁰ vapour damages nerves and lungs; inorganic Hg damages kidneys."],
   trap:["Fish advice: pregnant women limit large predatory fish","Ventilate and clean Hg spills professionally; never vacuum them"],
   swiss:"Swiss remediation value for Hg in garden and playground soil: 2 mg/kg (AltlV).",
   inputs:["fish consumption","garden use","indoor vapour sources"], sc:{}},
  Pb:{forms:[["Pb²⁺ in dust, soil, food and water",""],["Pb stored in bone","Over 90% of the adult body burden; stays for decades"]],
   what:"Children absorb a much larger share of ingested lead than adults. Lead stored in bone returns to the blood during pregnancy.",
   risk:["high","No known safe level (WHO). Lowers IQ, raises blood pressure, harms kidneys. IHME attributes more than 3.5 million deaths worldwide in 2023 to lead exposure."],
   trap:["Clean soil in playgrounds and gardens","Wet-clean house dust","Flush taps; replace old lead pipes"],
   swiss:"Swiss remediation value for Pb in garden and playground soil: 1,000 mg/kg (AltlV).",
   inputs:["children's play areas","garden produce","housing age"], sc:{}}
 },
 wwtp:{name:"Wastewater treatment (ARA)", zone:"Sewer outlet to river", base:{As:3,Hg:2,Pb:1},
  As:{forms:[["Dissolved As(V)","Largely passes through"],["As on Fe-sludge flocs","Where iron salts are dosed"]],
   what:"Conventional treatment removes only part of the arsenic. Removal improves where iron salts are dosed for phosphorus removal.",
   risk:["low","Diluted in the receiving river."],
   trap:["Iron salt dosing for P removal also co-precipitates arsenate","Sludge goes to incineration, not to fields"],
   swiss:"Since 2006 sewage sludge may no longer be spread on Swiss farmland; it is incinerated.",
   inputs:["inflow load","Fe dosing","sludge fate"],
   sc:{storm:[1,"Combined sewer overflows bypass treatment."]}},
  Hg:{forms:[["Hg on sludge particles","Most of the load"],["Hg–DOC complexes","In the effluent"]],
   what:"Most of the incoming mercury ends up in sewage sludge.",
   risk:["low","Small direct effect; sludge handling matters."],
   trap:["Sludge incineration with flue-gas Hg capture","Amalgam separators upstream"],
   swiss:"Since 2006 sewage sludge may no longer be spread on Swiss farmland; it is incinerated.",
   inputs:["influent load","sludge Hg","overflow frequency"],
   sc:{storm:[1,"Combined sewer overflows bypass treatment."]}},
  Pb:{forms:[["Pb bound to sludge","Most of the load"],["Small dissolved fraction","In the effluent"]],
   what:"Lead follows particles, so primary and secondary settling move most of it into the sludge.",
   risk:["low","Effective barrier in dry weather."],
   trap:["Sludge incineration; metals end up in the ash","Source control upstream"],
   swiss:"Since 2006 sewage sludge may no longer be spread on Swiss farmland; it is incinerated.",
   inputs:["influent load","overflow frequency"],
   sc:{storm:[2,"Sewer overflows release untreated, particle-rich water."]}}
 },
 river:{name:"River", zone:"Glacier-fed · high suspended load", base:{As:4,Hg:3,Pb:3},
  As:{forms:[["Dissolved arsenate · H₂AsO₄⁻ / HAsO₄²⁻","Dominant in oxygenated water"],["As on Fe-oxide-coated suspended particles",""]],
   what:"In oxygenated rivers As(V) dominates. Glacier-fed rivers carry heavy suspended loads that adsorb or release arsenic depending on pH and particle iron content.",
   risk:["low","Rivers rarely exceed limits; they matter as transport to lakes and to bank-filtration wells."],
   trap:["Sediment retention basins capture the particulate fraction","Monitor bank-filtration wells near As-rich tributaries"],
   swiss:"NADUF stations track river chemistry and loads; Eawag publishes the data openly.",
   inputs:["discharge (FOEN)","suspended sediment","dissolved & total As"],
   sc:{melt:[0,"Suspended load peaks; the particulate As share rises."],storm:[1,"Floods mobilise As-bearing sediment."]}},
  Hg:{forms:[["Hg(II) on suspended particles","Main transport form"],["Hg(II)–DOM complexes","Dissolved"],["Traces of MeHg",""]],
   what:"Rivers move mercury mostly on particles and with dissolved organic matter, so loads spike with floods and snowmelt.",
   risk:["low","Matters as transport to lakes and fish."],
   trap:["Sediment traps and retention basins below hotspots","Dredge contaminated reaches such as canals"],
   swiss:"Mercury from Visp entered the Rhone through the Grossgrundkanal.",
   inputs:["discharge & suspended sediment","DOC","total & dissolved Hg"],
   sc:{storm:[1,"Floods move most of the particle-bound Hg."],melt:[1,"Snowmelt flushes Hg from soils and glaciers."]}},
  Pb:{forms:[["Pb on suspended particles","Dominant"],["Pb–carbonate and Pb–DOM complexes","Minor dissolved share"]],
   what:"Most river lead travels on suspended sediment, so a few flood days can carry a large share of the annual load.",
   risk:["low","Matters as transport to lakes and floodplains."],
   trap:["Sediment retention basins and wetlands capture particle-bound Pb","Stabilise banks of contaminated floodplains"],
   swiss:"NADUF stations track river chemistry and loads; Eawag publishes the data openly.",
   inputs:["discharge & suspended sediment","floodplain soils"],
   sc:{storm:[1,"Floods carry most of the particle-bound Pb."],melt:[1,"Snowmelt raises the suspended load."]}}
 },
 lake:{name:"Lake water column", zone:"Epilimnion over hypolimnion", base:{As:3,Hg:3,Pb:2},
  As:{forms:[["As(V)","Oxic surface water"],["As(III) and DMA","Excreted by phytoplankton"],["As(III)","Anoxic bottom water"]],
   what:"Algae take up arsenate by mistake for phosphate and excrete As(III) and methylated forms. Settling iron-rich particles carry arsenic to the bottom.",
   risk:["low","Lake water used for drinking is treated; concentrations are usually low."],
   trap:["Keep the hypolimnion oxygenated: anoxia releases As (and P) from sediments"],
   swiss:"Several Swiss lakes, such as Baldeggersee, Sempachersee and Hallwilersee, have been artificially aerated to counter bottom-water anoxia.",
   inputs:["stratification & O₂ profile","residence time","Fe & P cycling"],
   sc:{reducing:[2,"Anoxic bottom water: As(III) builds up as Fe oxides dissolve."]}},
  Hg:{forms:[["Hg(II) and Hg⁰","Dissolved"],["CH₃Hg⁺ methylmercury","Made by anaerobic microbes carrying hgcAB genes"],["MeHg in plankton and fish","Biomagnified"]],
   what:"Methylation happens at oxic–anoxic boundaries and in sediments, and in deep lakes also on settling particles in oxic water. Methylmercury biomagnifies up to a million-fold or more from water to predatory fish.",
   risk:["high","Fish is the main human route for methylmercury."],
   trap:["Aeration keeps bottom water oxic and limits methylation","Cut Hg inputs from catchment hotspots","Fish consumption advice for large predatory fish"],
   swiss:"University of Geneva researchers (2022) found mercury methylation by anaerobic microbes in the oxic water column of a deep lake, on settling particles.",
   inputs:["O₂ profile & stratification","sulfate, DOC, productivity","food-web structure"],
   sc:{reducing:[2,"Anoxic hypolimnion: methylation increases and MeHg accumulates."],acidic:[1,"Fish in acidic lakes tend to carry more Hg."]}},
  Pb:{forms:[["Pb on settling particles","Main form"],["Low dissolved Pb²⁺",""]],
   what:"Sinking particles scavenge lead within days to weeks, so dissolved concentrations stay low.",
   risk:["low","Lake water and fish carry little Pb."],
   trap:["The lake is itself an efficient trap: avoid resuspending its sediment"],
   swiss:"",
   inputs:["particle settling flux","inflow load"], sc:{}}
 },
 sediment:{name:"Lake sediment", zone:"Final sink and archive", base:{As:1,Hg:2,Pb:1},
  As:{forms:[["As(V) on Fe(III) oxyhydroxides","Oxic surface layer"],["As(III)","After reductive dissolution"],["As sulfides, As on FeS and pyrite","Sulfidic layers"]],
   what:"The oxic top millimetres act as an iron-oxide lid that catches arsenic diffusing upward. Deeper down, arsenic cycles between dissolved As(III) and sulfide phases.",
   risk:["low","Indirect, through release to the water."],
   trap:["Preserve the oxic sediment surface (aeration)","Cap with Fe-rich or reactive material where release is a problem"],
   swiss:"",
   inputs:["sediment Fe, S, organic C","porewater profiles","bottom-water O₂"],
   sc:{reducing:[2,"The Fe-oxide lid dissolves; As(III) escapes to the water."]}},
  Hg:{forms:[["HgS, Hg on sulfides and organic matter","Main sink"],["CH₃Hg⁺ in porewater","Produced here"]],
   what:"Sediments are both the main mercury sink and the main methylation reactor. Sulfate- and iron-reducing bacteria produce methylmercury; too much sulfide binds Hg as HgS and slows methylation again.",
   risk:["med","Feeds methylmercury into the food web."],
   trap:["Activated-carbon or biochar caps reduce MeHg flux and uptake","Clean sand caps on hotspots","Keep bottom water oxygenated"],
   swiss:"Sediment cores record the history of atmospheric mercury deposition, which peaked in the 20th century.",
   inputs:["sediment Hg, S, organic C","porewater MeHg","bioturbation"],
   sc:{reducing:[1,"More methylation and MeHg release."]}},
  Pb:{forms:[["Pb on Fe/Mn oxides and organic matter",""],["PbS","Sulfidic sediment"]],
   what:"Lead is well preserved in sediment, and under sulfidic conditions it forms PbS, which is even less soluble. ²¹⁰Pb dating gives these sediment layers their age.",
   risk:["low","Only if resuspended."],
   trap:["Leave stable sediment in place; dredging can remobilise Pb"],
   swiss:"",
   inputs:["sediment Pb profile","²¹⁰Pb dating"],
   sc:{reducing:[-1,"Sulfide forms; Pb is locked as PbS."]}}
 },
 gw:{name:"Groundwater", zone:"Valley gravel and fractured-rock aquifers", base:{As:3,Hg:2,Pb:1},
  As:{forms:[["As(V)","Oxic gravel aquifers"],["As(III)","Reducing aquifers with Fe²⁺"],["Thioarsenates","Sulfidic water"]],
   what:"Groundwater is where arsenic matters most for health. In oxic Swiss gravel aquifers it is mostly below 1 µg/L; fractured crystalline aquifers in the Alps can exceed 10 µg/L.",
   risk:["high","Drinking water is the main exposure route for inorganic arsenic. Swiss limit: 10 µg/L."],
   trap:["Granular ferric hydroxide (GFH) adsorption filters","Oxidise As(III) to As(V), then coagulate with Fe(III) and filter","Permeable reactive barriers with zero-valent iron","Blend with low-As water or change the source"],
   swiss:"FOEN NAQUA: As is above the 10 µg/L drinking-water limit at one site each in Valais and Graubünden, and above the indicator value at about 1% of sites.",
   inputs:["aquifer type","O₂, NO₃⁻, Fe²⁺, Mn²⁺","flow velocity & direction","wells & protection zones"],
   sc:{reducing:[2,"As(III) dominates and Fe oxides dissolve: concentrations can rise sharply."],acidic:[-1,"Arsenate sorbs more strongly at lower pH."]}},
  Hg:{forms:[["Hg(II)–DOM complexes","Main dissolved form"],["Dissolved Hg⁰",""]],
   what:"Usually very low, because soils hold mercury. Exceptions are plumes below landfills and chemical sites, where DOC and chloride can mobilise it.",
   risk:["med","Low in general; relevant below contaminated sites. Swiss drinking-water limit: 1 µg/L."],
   trap:["Pump-and-treat with activated carbon or thiol resins","Permeable reactive barriers with zero-valent iron or sulfur-modified media","Hydraulic containment with sealing walls"],
   swiss:"Swiss drinking-water maximum: 1 µg/L (TBDV).",
   inputs:["DOC, Cl⁻, redox","plume extent","well capture zones"],
   sc:{reducing:[1,"Reductive dissolution of Fe oxides releases bound Hg."]}},
  Pb:{forms:[["Pb²⁺ and Pb–carbonate complexes","Dissolved"],["Colloid-bound Pb","Fast transport"]],
   what:"Usually below 1 µg/L. Exceptions are karst aquifers, where water flows fast through open conduits, and colloid-facilitated transport.",
   risk:["low","No NAQUA site exceeds the 10 µg/L limit. Old lead pipes and brass fittings can add Pb at the tap."],
   trap:["Protect karst recharge areas (Jura) from Pb sources","Coagulation-filtration or ion exchange if needed"],
   swiss:"FOEN NAQUA: Pb is above the 1 µg/L indicator value at over 4% of sites, mainly in Jura karst and Mittelland gravel aquifers.",
   inputs:["aquifer type (karst vs gravel)","colloids, DOC, pH"],
   sc:{acidic:[1,"Lower pH keeps more Pb dissolved."]}}
 }
};
const ORDER = ["air","glacier","bedrock","forest","farm","site","town","wwtp","river","lake","sediment","gw","people"];

/* ================= PATHWAYS ================= */
// [id, from, to, process, d]
const PATHS = [
 ["stack_air","town","air","emission","M892,298 C886,248 836,206 762,180 S652,152 600,142"],
 ["air_glacier","air","glacier","deposition","M600,142 C520,122 400,92 262,96"],
 ["air_forest","air","forest","deposition","M640,160 C580,190 506,228 462,262"],
 ["air_farm","air","farm","deposition","M700,170 C690,250 660,320 640,378"],
 ["air_lake","air","lake","deposition","M770,170 C890,210 1010,300 1070,390"],
 ["air_people","air","people","inhalation","M830,200 C825,270 815,320 808,352"],
 ["glacier_river","glacier","river","meltwater","M352,178 C380,205 410,232 440,258 S500,315 530,340 S570,378 600,402"],
 ["river_lake","river","lake","river inflow","M600,402 C660,416 720,404 780,410 S880,418 940,410 S975,405 1000,404"],
 ["bedrock_gw","bedrock","gw","fracture flow","M200,330 C240,420 320,500 430,540 S600,530 700,505"],
 ["bedrock_river","bedrock","river","weathering & springs","M300,322 C330,318 360,300 404,226"],
 ["forest_gw","forest","gw","leaching","M470,320 C480,400 520,460 600,490"],
 ["forest_river","forest","river","erosion & DOC","M440,282 C455,302 478,330 504,318"],
 ["farm_gw","farm","gw","leaching","M640,424 C642,445 646,470 650,500"],
 ["farm_river","farm","river","erosion","M626,392 C630,398 634,404 640,410"],
 ["site_gw","site","gw","seepage","M738,404 C742,440 760,478 800,505"],
 ["site_river","site","river","runoff","M760,396 C766,400 772,405 780,410"],
 ["town_wwtp","town","wwtp","sewer","M884,384 C896,390 906,392 918,393"],
 ["wwtp_river","wwtp","river","effluent","M930,396 C934,401 938,405 944,409"],
 ["town_river","town","river","storm overflow","M862,384 C866,396 870,406 876,414"],
 ["gw_people","gw","people","wells","M836,500 L836,384"],
 ["gw_lake","gw","lake","exfiltration","M900,500 C940,500 980,495 1010,490"],
 ["lake_sediment","lake","sediment","settling","M1086,430 C1088,470 1092,505 1096,540"],
 ["sediment_lake","sediment","lake","release from sediment","M1150,544 C1150,515 1148,492 1146,468"],
 ["lake_people","lake","people","fish & drinking water","M1110,472 C1020,430 900,390 840,372"],
 ["soil_air","farm","air","re-emission","M652,380 C642,320 632,260 620,200"],
 ["farm_people","farm","people","crops & soil contact","M690,384 C730,372 760,368 786,372"],
 ["glacier_air","glacier","air","snow re-emission","M236,74 C262,46 304,40 360,52"],
 ["lake_air","lake","air","evasion","M1150,388 C1150,340 1140,290 1120,240"]
];
const GWPATHS = new Set(["bedrock_gw","forest_gw","farm_gw","site_gw","gw_lake","gw_people"]);

// weight, phase (d dissolved, p particle, g gas)
const W = {
 As:{stack_air:[.5,"p"],air_glacier:[.3,"p"],air_forest:[.3,"p"],air_farm:[.3,"p"],air_lake:[.2,"p"],air_people:[.15,"p"],
  glacier_river:[.5,"p"],river_lake:[.7,"d"],bedrock_gw:[.9,"d"],bedrock_river:[.6,"d"],forest_gw:[.2,"d"],forest_river:[.25,"p"],
  farm_gw:[.3,"d"],farm_river:[.3,"p"],site_gw:[.6,"d"],site_river:[.5,"d"],town_wwtp:[.3,"d"],wwtp_river:[.3,"d"],town_river:[.1,"p"],
  gw_people:[.9,"d"],gw_lake:[.5,"d"],lake_sediment:[.5,"p"],sediment_lake:[.15,"d"],lake_people:[.2,"d"],soil_air:[.05,"g"],
  farm_people:[.3,"p"],glacier_air:[0,"g"],lake_air:[0,"g"]},
 Hg:{stack_air:[.9,"g"],air_glacier:[.6,"d"],air_forest:[.7,"g"],air_farm:[.5,"d"],air_lake:[.6,"d"],air_people:[.2,"g"],
  glacier_river:[.5,"p"],river_lake:[.6,"p"],bedrock_gw:[.05,"d"],bedrock_river:[.1,"p"],forest_gw:[.1,"d"],forest_river:[.5,"d"],
  farm_gw:[.1,"d"],farm_river:[.4,"p"],site_gw:[.5,"d"],site_river:[.6,"p"],town_wwtp:[.5,"p"],wwtp_river:[.2,"p"],town_river:[.15,"p"],
  gw_people:[.1,"d"],gw_lake:[.1,"d"],lake_sediment:[.7,"p"],sediment_lake:[.3,"d"],lake_people:[.8,"d"],soil_air:[.6,"g"],
  farm_people:[.3,"p"],glacier_air:[.5,"g"],lake_air:[.5,"g"]},
 Pb:{stack_air:[.5,"p"],air_glacier:[.4,"p"],air_forest:[.5,"p"],air_farm:[.5,"p"],air_lake:[.4,"p"],air_people:[.2,"p"],
  glacier_river:[.5,"p"],river_lake:[.8,"p"],bedrock_gw:[.1,"d"],bedrock_river:[.2,"p"],forest_gw:[.1,"d"],forest_river:[.4,"p"],
  farm_gw:[.05,"d"],farm_river:[.6,"p"],site_gw:[.2,"d"],site_river:[.5,"p"],town_wwtp:[.6,"p"],wwtp_river:[.15,"p"],town_river:[.5,"p"],
  gw_people:[.1,"d"],gw_lake:[.05,"d"],lake_sediment:[.9,"p"],sediment_lake:[.02,"d"],lake_people:[.05,"d"],soil_air:[0,"g"],
  farm_people:[.7,"p"],glacier_air:[0,"g"],lake_air:[0,"g"]}
};
const MODS = {
 reducing:{As:{bedrock_gw:1.5,farm_gw:2.5,site_gw:1.5,sediment_lake:4,gw_people:1.5,forest_gw:2,gw_lake:1.4},
           Hg:{lake_people:1.6,sediment_lake:2,site_gw:1.3},
           Pb:{sediment_lake:.5}},
 acid:{As:{farm_gw:.6,forest_gw:.6,gw_people:.85},
       Hg:{forest_river:1.3,lake_people:1.3},
       Pb:{forest_gw:4,farm_gw:5,site_gw:3,gw_people:2,bedrock_gw:2}},
 melt:{all:{glacier_river:2.5,river_lake:1.5,glacier_air:1.2,bedrock_river:1.3}},
 storm:{all:{farm_river:3,site_river:2,forest_river:2,town_river:4,river_lake:2,wwtp_river:1.5,air_glacier:1.5,air_forest:1.5,air_farm:1.5,air_lake:1.5}},
 base:{all:{gw_lake:1.5,river_lake:.7}}
};

/* ================= STATE ================= */
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const S = {metal:"As", redox:"oxic", ph:"calc", water:"base", playing:!reduceMotion, pinned:null, hover:null};
try{ const m = localStorage.getItem("smp-metal"); if(m && METALS[m]) S.metal = m; }catch(e){}

const NS = "http://www.w3.org/2000/svg";
const $ = s => document.querySelector(s);
const root = document.documentElement;
const scene = $("#scene"), guidesG = $("#guides"), partsG = $("#particles"), panel = $("#panel");

/* trees */
(function(){
  const g = $("#trees"); const ys = x => 118 + (x - 290) * 0.926;
  let html = "";
  for(let x = 372, i = 0; x <= 560; x += 11, i++){
    const h = 16 + ((i * 7) % 9); const cls = i % 2 ? "s-tree2" : "s-tree";
    const yb = ys(x) + 2;
    html += `<path class="${cls}" d="M${x-6},${(ys(x-6)+2).toFixed(1)} L${x},${(yb-h).toFixed(1)} L${x+6},${(ys(x+6)+2).toFixed(1)} Z"/>`;
  }
  g.innerHTML = html;
})();

/* ================= FLOWS ================= */
let flow = []; // {id, el, len, w, phase, from, to, parts:[]}
const pathEls = {};
PATHS.forEach(([id,,,,d])=>{
  const p = document.createElementNS(NS,"path"); p.setAttribute("d", d); p.setAttribute("class","guide"); p.dataset.id = id;
  guidesG.appendChild(p); pathEls[id] = p;
});

function effWeight(id){
  const m = S.metal; let w = (W[m][id]||[0])[0];
  const apply = (o)=>{ if(o && o[id]) w *= o[id]; };
  if(S.redox === "reducing") apply(MODS.reducing[m]);
  if(S.ph === "acid") apply(MODS.acid[m]);
  apply(MODS[S.water].all);
  return Math.min(1.3, w);
}
function speedFor(id, phase){
  let v = phase === "g" ? 62 : phase === "p" ? 36 : 28;
  if(GWPATHS.has(id)) v *= .45;
  if(S.water === "storm" && !GWPATHS.has(id)) v *= 1.6;
  if(S.water === "melt" && (id === "glacier_river" || id === "river_lake")) v *= 1.35;
  return v;
}
function buildFlows(){
  partsG.innerHTML = ""; flow = [];
  PATHS.forEach(([id, from, to, proc])=>{
    const el = pathEls[id]; const len = el.getTotalLength();
    const w = effWeight(id); const phase = (W[S.metal][id]||[0,"d"])[1];
    el.style.strokeWidth = w < .03 ? 0 : (1 + w * 7).toFixed(2);      // wide range, so condition changes are easy to see
    el.style.display = w < .03 ? "none" : "";
    const f = {id, from, to, proc, el, len, w, phase, parts:[]};
    if(w >= .03){
      let n = Math.round(w * len / 30); n = Math.max(1, Math.min(18, n));
      for(let i = 0; i < n; i++){
        let node;
        if(phase === "p"){ node = document.createElementNS(NS,"rect"); node.setAttribute("width","6.5"); node.setAttribute("height","6.5"); node.setAttribute("class","pt pt-p"); }
        else { node = document.createElementNS(NS,"circle"); node.setAttribute("r", phase === "g" ? "3.9" : "3.6"); node.setAttribute("class","pt " + (phase === "g" ? "pt-g" : "pt-d")); }
        partsG.appendChild(node);
        f.parts.push({node, s:(i + Math.random() * .6) / n});
      }
    }
    flow.push(f);
  });
  placeAll(0);
  highlight();
}
function placeAll(dt){
  for(const f of flow){
    if(!f.parts.length) continue;
    const v = speedFor(f.id, f.phase) / f.len;
    for(const p of f.parts){
      p.s += v * dt; if(p.s > 1) p.s -= 1;
      const pt = f.el.getPointAtLength(p.s * f.len);
      const a = Math.min(1, p.s * 7, (1 - p.s) * 7);
      if(p.node.tagName === "rect"){ p.node.setAttribute("x", (pt.x - 3.25).toFixed(1)); p.node.setAttribute("y", (pt.y - 3.25).toFixed(1)); }
      else { p.node.setAttribute("cx", pt.x.toFixed(1)); p.node.setAttribute("cy", pt.y.toFixed(1)); }
      p.node.style.fillOpacity = p.node.style.strokeOpacity = a.toFixed(2);
    }
  }
}
let last = 0;
function tick(t){
  const dt = last ? Math.min(.05, (t - last) / 1000) : 0; last = t;
  if(S.playing) placeAll(dt);
  requestAnimationFrame(tick);
}

function activeId(){ return S.hover || S.pinned; }
function highlight(){
  const id = activeId();
  document.querySelectorAll(".hit").forEach(h => h.classList.toggle("active", h.dataset.c === id));
  partsG.classList.toggle("dimmed", !!id);
  for(const f of flow){
    const on = !id || f.from === id || f.to === id;
    f.el.classList.toggle("dim", !on);
    f.parts.forEach(p => p.node.classList.toggle("on", !!id && on));
  }
}

/* ================= PANEL ================= */
const esc = s => String(s).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const SEV = {low:"Low", med:"Medium", high:"High"};
const PHASE = {d:"dissolved", p:"particle-bound", g:"gas"};
const SCN = {reducing:"Reducing", acidic:"Acidic", melt:"Snowmelt", storm:"Storm"};

function activeScen(){ const a = []; if(S.redox === "reducing") a.push("reducing"); if(S.ph === "acid") a.push("acidic"); if(S.water !== "base") a.push(S.water); return a; }
function scenText(){
  const p = [S.redox === "reducing" ? "reducing" : "oxic", S.ph === "acid" ? "acidic" : "calcareous", {base:"base flow", melt:"snowmelt", storm:"storm"}[S.water]];
  return p.join(" · ");
}

function renderOverview(){
  if(S.adv && RES) return renderAdvOverview();
  const M = METALS[S.metal];
  panel.innerHTML = `
    <div class="p-bar"><span class="p-zone">Metal profile · ${esc(scenText())}</span></div>
    <h2><span class="sym">${S.metal}</span> ${esc(M.name)}</h2>
    <p class="sig">${esc(M.sig)}</p>
    <section><h3>Forms in nature</h3><ul class="forms">${M.forms.map(f=>`<li><span class="f">${esc(f)}</span></li>`).join("")}</ul></section>
    <section><h3>Main sources in Switzerland</h3><ul class="plain">${M.sources.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></section>
    <section><h3>Threat to people</h3><p class="risk"><span class="sev sev-${M.health[0]}">${SEV[M.health[0]]}</span>${esc(M.health[1])}</p></section>
    <section><h3>Best control lever</h3><p class="risk">${esc(M.lever)}</p></section>
    <section><h3>Explore a compartment</h3><div class="chips">${ORDER.map(id=>`<button class="chip" data-go="${id}">${esc(C[id].name)}</button>`).join("")}</div></section>`;
}

function renderComp(id){
  const c = C[id], d = c[S.metal], M = METALS[S.metal];
  const zone = d.zone || c.zone;
  const sc = activeScen().filter(k => d.sc && d.sc[k]);
  let mob = c.base[S.metal]; sc.forEach(k => mob += d.sc[k][0]); mob = Math.max(1, Math.min(5, mob));
  const mobTxt = ["", "Very low", "Low", "Moderate", "High", "Very high"][mob];
  const outs = flow.filter(f => f.from === id && f.w >= .03).sort((a,b)=>b.w - a.w);
  const ins = flow.filter(f => f.to === id && f.w >= .03).sort((a,b)=>b.w - a.w);
  const pinned = S.pinned === id;
  panel.innerHTML = `
    <div class="p-bar"><button class="p-back" data-back="1">← ${S.adv ? "Run summary" : esc(M.name) + " profile"}</button><span class="p-state">${pinned ? "Pinned" : "Preview · click to pin"}</span></div>
    <div><p class="p-zone">${esc(zone)}</p><h2>${esc(c.name)} <span class="sym">· ${S.metal}</span></h2></div>
    ${id === "people" ? "" : `<div class="mob">Mobility here <span class="bars" aria-hidden="true">${[1,2,3,4,5].map(i=>`<i class="${i<=mob?"on":""}"></i>`).join("")}</span><b>${mobTxt}</b></div>`}
    ${S.adv ? advBlock(id) : ""}
    <section><h3>Forms you will find</h3><ul class="forms">${d.forms.map(([f,n])=>`<li><span class="f">${esc(f)}</span>${n?`<span class="fn">${esc(n)}</span>`:""}</li>`).join("")}</ul></section>
    <section><h3>What happens here</h3><p class="risk">${esc(d.what)}</p></section>
    ${sc.length ? `<div class="scen"><strong>In this scenario</strong>${sc.map(k=>`<span><b>${SCN[k]}:</b> ${esc(d.sc[k][1])}</span>`).join("")}</div>` : ""}
    ${outs.length ? `<section><h3>Moves on to</h3><div class="chips">${outs.map(f=>`<button class="chip" data-go="${f.to}">→ ${esc(C[f.to].name)}<small>${esc(f.proc)} · ${PHASE[f.phase]}</small></button>`).join("")}</div></section>` : ""}
    ${ins.length ? `<section><h3>Arrives from</h3><div class="chips">${ins.map(f=>`<button class="chip" data-go="${f.from}">${esc(C[f.from].name)}<small>${esc(f.proc)}</small></button>`).join("")}</div></section>` : ""}
    <section><h3>Threat to people</h3><p class="risk"><span class="sev sev-${d.risk[0]}">${SEV[d.risk[0]]}</span>${esc(d.risk[1])}</p></section>
    <section><h3>Where and how to trap it</h3><ul class="trap">${d.trap.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></section>
    ${d.swiss ? `<div class="swiss"><span class="flag" aria-label="Switzerland"></span><span>${esc(d.swiss)}</span></div>` : ""}
    <section><h3>Model inputs that matter here</h3><div class="tags">${d.inputs.map(t=>`<span>${esc(t)}</span>`).join("")}</div></section>`;
}

let shownId;
function render(){
  const id = activeId();
  if(id) renderComp(id); else renderOverview();
  if(id !== shownId){ panel.scrollTop = 0; shownId = id; }
}

/* ================= EVENTS ================= */
panel.addEventListener("click", e=>{
  const go = e.target.closest("[data-go]"); if(go){ S.pinned = go.dataset.go; S.hover = null; highlight(); render(); return; }
  if(e.target.closest("[data-back]")){ S.pinned = null; S.hover = null; highlight(); render(); }
});
/* Hover intent: the outline follows the pointer at once, but the panel text only
   changes after the pointer settles (90 ms), and leaving a compartment waits 160 ms,
   so crossing a boundary or a small gap does not flash the panel back and forth. */
let hoverT = 0;
function hoverTo(id){
  clearTimeout(hoverT);
  if(id){ S.hover = id; highlight(); hoverT = setTimeout(render, 90); }
  else hoverT = setTimeout(() => { S.hover = null; highlight(); render(); }, 160);
}
document.querySelectorAll(".hit").forEach(h=>{
  const id = h.dataset.c;
  h.setAttribute("tabindex","0"); h.setAttribute("role","button"); h.setAttribute("aria-label", C[id].name);
  h.addEventListener("pointerenter", e=>{ if(e.pointerType === "touch") return; hoverTo(id); });
  h.addEventListener("pointerleave", e=>{ if(e.pointerType === "touch") return; if(S.hover === id) hoverTo(null); });
  h.addEventListener("click", ()=>{ clearTimeout(hoverT); S.pinned = (S.pinned === id && !S.hover) ? null : id; S.hover = null; highlight(); render(); });
  h.addEventListener("focus", ()=>{ S.hover = id; highlight(); render(); });
  h.addEventListener("blur", ()=>{ if(S.hover === id){ S.hover = null; highlight(); render(); } });
  h.addEventListener("keydown", e=>{ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); S.pinned = id; S.hover = null; highlight(); render(); } });
});

const chgG = $("#chgLabels"); let chgTimer = 0;
function setMetal(m){
  clearChanges();
  S.metal = m; root.setAttribute("data-metal", m);
  $("#metalSel").value = m; $("#metalSym").textContent = m;
  $("#siteLbl").textContent = METALS[m].site;
  C.site.zone = C.site[m].zone;
  try{ localStorage.setItem("smp-metal", m); }catch(e){}
  if(S.adv){ advMetalChanged(); runAdv(); }
  buildFlows(); render(); drawScene();
}
$("#metalSel").addEventListener("change", e => setMetal(e.target.value));
/* after a condition switch, mark the flows that changed: red thicker, green thinner, with the factor */
const SCN_LBL = {redox:{oxic:"Oxic", reducing:"Reducing"}, ph:{calc:"Calcareous 7–8", acid:"Acidic 4–5"}, water:{base:"Base flow", melt:"Snowmelt", storm:"Storm"}};
function weightsNow(){ const o = {}; PATHS.forEach(([id]) => { o[id] = effWeight(id); }); return o; }
function clearChanges(){ clearTimeout(chgTimer); chgG.innerHTML = ""; chgG.classList.remove("fade"); flow.forEach(f => f.el.classList.remove("chg-up", "chg-down")); $("#chgLive").textContent = ""; }
function showChanges(prev, title){
  clearTimeout(chgTimer); chgG.classList.remove("fade"); chgG.innerHTML = "";
  flow.forEach(f => f.el.classList.remove("chg-up", "chg-down"));
  const ch = [];
  for(const f of flow){
    const a = prev[f.id] || 0, b = f.w;
    if(a < .03 && b < .03) continue;
    const r = a < .03 ? Infinity : b / a;
    if(r >= 1.2 || r <= 1 / 1.2) ch.push({f, a, b, r, up:b > a});
  }
  const fac = c => c.b < .03 ? "stops" : c.a < .03 ? "new" : c.up ? "×" + fmt(c.r) : "÷" + fmt(1 / c.r);
  ch.forEach(c => {
    if(c.b < .03) return;
    c.f.el.classList.add(c.up ? "chg-up" : "chg-down");
    const pt = c.f.el.getPointAtLength(c.f.len * 0.55), t = document.createElementNS(NS, "text");
    t.setAttribute("x", (pt.x + 8).toFixed(1)); t.setAttribute("y", (pt.y - 6).toFixed(1)); t.setAttribute("class", "chg-lbl" + (c.up ? "" : " down")); t.textContent = fac(c);
    chgG.appendChild(t);
  });
  ch.sort((x, y) => Math.abs(Math.log(Math.max(1e-3, y.r === Infinity ? 1e3 : y.r))) - Math.abs(Math.log(Math.max(1e-3, x.r === Infinity ? 1e3 : x.r))));
  const lines = ch.slice(0, 3).map(c => ({txt:`${C[c.f.from].name} → ${C[c.f.to].name} (${c.f.proc})`, fac:fac(c), up:c.up}));
  const head = ch.length ? `${title}: ${ch.length} flow${ch.length > 1 ? "s" : ""} of ${METALS[S.metal].name.toLowerCase()} changed` : `${title}: no visible change for ${METALS[S.metal].name.toLowerCase()}`;
  const g = document.createElementNS(NS, "g"); g.setAttribute("class", "chg-note"); g.setAttribute("transform", "translate(300,556)");
  const h = 30 + lines.length * 20;
  g.innerHTML = `<rect x="0" y="0" width="600" height="${h}" rx="4"/><text class="t" x="12" y="21">${esc(head)}</text>` + lines.map((l, i) => `<text x="12" y="${42 + i * 20}"><tspan class="${l.up ? "up" : "down"}">${esc(l.fac)}</tspan> ${esc(l.txt)}</text>`).join("");
  chgG.appendChild(g);
  $("#chgLive").textContent = head + (lines.length ? ". " + lines.map(l => `${l.txt} ${l.fac}`).join("; ") : "");
  chgTimer = setTimeout(() => { chgG.classList.add("fade"); flow.forEach(f => f.el.classList.remove("chg-up", "chg-down")); chgTimer = setTimeout(() => { chgG.innerHTML = ""; chgG.classList.remove("fade"); }, 700); }, 9000);
}
document.querySelectorAll(".seg[data-key]").forEach(seg=>{
  seg.addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    if(S[seg.dataset.key] === b.dataset.v) return;
    const prev = S.adv ? null : weightsNow();
    S[seg.dataset.key] = b.dataset.v;
    seg.querySelectorAll("button").forEach(x => x.setAttribute("aria-checked", String(x === b)));
    scene.classList.toggle("scene-storm", S.water === "storm");
    scene.classList.toggle("scene-melt", S.water === "melt");
    if(S.adv) runAdv();
    buildFlows(); render(); drawScene();
    if(prev) showChanges(prev, SCN_LBL[seg.dataset.key][b.dataset.v]);
  });
});

/* theme switch */
const themeSeg = $("#themeSeg");
function effTheme(){
  const t = root.getAttribute("data-theme");
  if(t === "dark" || t === "light") return t;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function paintTheme(){ const t = effTheme(); themeSeg.querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", String(b.dataset.theme === t))); }
themeSeg.addEventListener("click", e=>{
  const b = e.target.closest("button"); if(!b) return;
  root.setAttribute("data-theme", b.dataset.theme);
  try{ localStorage.setItem("smp-theme", b.dataset.theme); }catch(_){}
  paintTheme();
});
try{ const t = localStorage.getItem("smp-theme"); if(t === "dark" || t === "light") root.setAttribute("data-theme", t); }catch(_){}
if(window.matchMedia){ try{ window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", paintTheme); }catch(_){} }
new MutationObserver(paintTheme).observe(root, {attributes:true, attributeFilter:["data-theme"]});
paintTheme();
function setPlay(on){
  S.playing = on; $("#playBtn").setAttribute("aria-pressed", String(!on));
  $("#playIcon").textContent = on ? "❚❚" : "▶"; $("#playTxt").textContent = on ? "Pause" : "Play";
}
$("#playBtn").addEventListener("click", ()=> setPlay(!S.playing));

/* ================= REFERENCE CONTENT ================= */
const INPUTS = [
 ["Release (source term)", [
  ["Metal and chemical form","PbO vs metallic Pb, Hg⁰ vs HgCl₂, As₂O₃ vs arsenate: sets solubility, volatility and toxicity from the first step.","User, permits, SwissPRTR"],
  ["Physical state and particle size","Gas, PM2.5, PM10, coarse dust, dissolved, solid waste: controls travel distance and deposition.","User, emission measurements"],
  ["Mass or flux, and time pattern","Single pulse or continuous release, start and end: needed for the mass balance and for dynamic runs.","User"],
  ["Release point","Coordinates in LV95, height or depth, stack exit velocity and temperature.","swisstopo, user"],
  ["Co-released substances","Sb at shooting ranges, sulfate, chloride, DOC, phosphate: they change speciation and mobility.","User, site investigation"]]],
 ["Location and landscape", [
  ["Coordinates and elevation","EPSG:2056 (LV95); elevation drives temperature, snow cover and runoff.","swissALTI3D"],
  ["Catchment and flow network","Where water from the site ends up: river reach, lake, aquifer.","FOEN catchment subdivision, hydrological data"],
  ["Land use","Gardens, playgrounds, cropland, forest and wetland change both fate and exposure.","FSO land-use statistics"],
  ["Glaciers and reservoirs","Melt timing, sediment trapping, reservoir flushing.","GLAMOS, swissTLM3D"],
  ["Receptors","Drinking-water wells and protection zones, playgrounds, fisheries.","Cantonal geoportals"]]],
 ["Soil", [
  ["pH (CaCl₂)","Pb mobility rises below about pH 5; arsenate desorbs above about pH 8.","NABO, cantonal soil surveys"],
  ["Organic carbon and DOC","Binds Hg and Pb; mercury moves with DOC.","Soil surveys"],
  ["Fe, Mn and Al oxides","The main arsenic sink and an important Pb sink (oxalate or dithionite extraction).","Site sampling"],
  ["Texture, clay, CEC, carbonate","Sorption capacity and buffering.","Soil maps, sampling"],
  ["Water regime and drainage","Waterlogging releases As and enables Hg methylation.","Soil maps (hydromorphy)"],
  ["Phosphate status","Locks Pb as pyromorphite but displaces arsenate.","Agricultural soil tests"],
  ["Background concentrations","Separates the new release from what is already there.","NABO, cantonal data"]]],
 ["Water and aquifer", [
  ["Aquifer type and hydraulics","Gravel, karst or fractured rock; depth to water table, hydraulic conductivity, gradient.","Hydrogeological maps (swisstopo), cantonal data"],
  ["Redox indicators","O₂, NO₃⁻, Fe²⁺, Mn²⁺, SO₄²⁻ and H₂S decide between As(V) and As(III), and whether Hg can be methylated.","NAQUA"],
  ["Major chemistry","pH, alkalinity, Ca and Mg, DOC, Cl⁻, suspended sediment.","NAQUA, NADUF"],
  ["Lake properties","Depth, stratification, bottom-water O₂, residence time.","Cantonal lake monitoring"],
  ["River discharge and sediment load","Floods move most particle-bound Pb and Hg.","FOEN hydrological data"]]],
 ["Weather and climate", [
  ["Precipitation","Amount and intensity drive wet deposition, leaching and erosion.","MeteoSwiss open data"],
  ["Temperature, snow cover, melt timing","Controls snowmelt pulses and Hg re-emission.","MeteoSwiss open data"],
  ["Wind speed and direction","Plume direction and dispersion from stacks.","MeteoSwiss stations"],
  ["Future climate","Wetter winters, drier summers and glacier loss change pathways.","CH2025 climate scenarios"]]],
 ["Scenario and time", [
  ["Steady state or dynamic","Metals do not degrade: horizons of years to decades are normal.","User"],
  ["Event scenarios","Snowmelt peak, flood, drought, lake anoxia, liming or acidification, land-use change.","User"]]],
 ["Exposure and endpoints", [
  ["Pathways to include","Drinking water, fish, crops, soil and dust ingestion, inhalation.","User"],
  ["Population","Children, pregnant women, anglers, workers.","User, census"],
  ["Benchmarks","TBDV, AltlV, VBBo, LRV (see reference values).","fedlex.admin.ch"]]],
 ["Uncertainty and trapping options", [
  ["Parameter ranges","Distributions for Kd, rates and inputs; Monte Carlo runs and sensitivity.","Literature, site data"],
  ["Candidate measures","Where to trap, with which method, expected removal efficiency and cost.","User, case studies"]]]
];
$("#inputGroups").innerHTML = INPUTS.map(([g, rows], i)=>`
  <div class="group"><h3><span class="n">${String(i+1).padStart(2,"0")}</span>${esc(g)}</h3>
  <div class="rows">${rows.map(([b,s,em])=>`<div class="row"><b>${esc(b)}</b><span>${esc(s)}</span><em>${esc(em)}</em></div>`).join("")}</div></div>`).join("");

/* one group at a time */
(function(){
  const box = $("#inputGroups"), tabs = $("#carTabs"), n = INPUTS.length; let gi = 0;
  tabs.innerHTML = INPUTS.map(([g], j)=>`<button data-i="${j}">${esc(g)}</button>`).join("");
  function show(i){
    gi = (i + n) % n;
    box.querySelectorAll(".group").forEach((g, j) => { g.hidden = j !== gi; });
    tabs.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", String(j === gi)));
    $("#carCount").textContent = `${gi + 1} / ${n}`;
    $("#carNextName").textContent = INPUTS[(gi + 1) % n][0];
    $("#carSide").setAttribute("aria-label", "Next group: " + INPUTS[(gi + 1) % n][0]);
    const cur = tabs.children[gi]; if(cur && tabs.scrollWidth > tabs.clientWidth) tabs.scrollLeft = cur.offsetLeft - tabs.offsetLeft - 8;
  }
  tabs.addEventListener("click", e => { const b = e.target.closest("[data-i]"); if(b) show(+b.dataset.i); });
  $("#carPrev").addEventListener("click", () => show(gi - 1));
  $("#carNext").addEventListener("click", () => show(gi + 1));
  $("#carSide").addEventListener("click", () => show(gi + 1));
  $("#inputCar").addEventListener("keydown", e => { if(e.key === "ArrowRight"){ e.preventDefault(); show(gi + 1); } else if(e.key === "ArrowLeft"){ e.preventDefault(); show(gi - 1); } });
  let x0 = null;
  box.addEventListener("pointerdown", e => { x0 = e.clientX; });
  box.addEventListener("pointerup", e => { if(x0 == null) return; const dx = e.clientX - x0; x0 = null; if(Math.abs(dx) > 50) show(gi + (dx < 0 ? 1 : -1)); });
  show(0);
})();

const DATA = [
 ["MeteoSwiss open data","Station measurements, climate data, radar and forecasts, free since May 2025. Downloadable as files; an API for single queries is planned, not before end of 2026.","Weather inputs","https://opendatadocs.meteoswiss.ch"],
 ["CH2025 climate scenarios","Daily scenarios per station and on a grid.","Future-climate runs","https://opendata.swiss/en/dataset/klimaszenarien-ch2025-gitter-daily-gridded"],
 ["swisstopo geodata","swissALTI3D elevation, swissTLM3D (glaciers, waters, buildings), GeoCover geology, hydrogeological maps.","Landscape, geology","https://www.swisstopo.admin.ch"],
 ["FOEN hydrological data","Discharge, water levels and temperature of rivers and lakes.","Rivers and lakes","https://www.hydrodaten.admin.ch"],
 ["NAQUA groundwater monitoring","Groundwater quality including trace elements (2018 pilot: about 550 sites, 20+ elements).","Aquifer chemistry","https://www.bafu.admin.ch/de/spurenelemente-im-grundwasser"],
 ["NADUF river monitoring","Long-term river chemistry and loads, published by Eawag.","River chemistry","https://opendata.eawag.ch/group/about/naduf-national-long-term-surveillance-of-swiss-rivers"],
 ["NABO soil monitoring","Topsoil Cd, Zn, Cu, Hg, Pb, Ni, Cr, Co at over 100 sites, 1985–2019. No arsenic.","Soil background","https://www.bafu.admin.ch/de/visualisierung-der-schwermetallbelastung-des-bodens"],
 ["SwissPRTR","Facility releases of pollutants to air, water and soil above reporting thresholds.","Source terms","https://www.Bafu.admin.ch/dam/bafu/de/dokumente/chemikalien/fachinfo-daten/haeufige_fragen_zuswissprtr.pdf.download.pdf/haeufige_fragen_zuswissprtr.pdf"],
 ["Contaminated-site registers","Cantonal registers (Kataster der belasteten Standorte); federal ones for military, airports and public transport.","Known hotspots","https://www.bafu.admin.ch/de/schiessanlagen"],
 ["GLAMOS","Glacier mass balance, length and volume change.","Glacier melt","https://www.glamos.ch"],
 ["FSO land-use statistics","Land use and land cover in a 100 m grid.","Land use","https://www.bfs.admin.ch"],
 ["Soil maps","National soil mapping is patchy; start from cantonal soil maps and the Competence Centre for Soils (KOBO).","Soil properties","https://ccsols.ch"]
];
$("#dataGrid").innerHTML = DATA.map(([h,p,f,u])=>`<div class="ds"><span class="for">${esc(f)}</span><h3><a href="${u}" target="_blank" rel="noopener">${esc(h)}</a></h3><p>${esc(p)}</p></div>`).join("");

/* ================= ADVANCED MODE ================= */
const YEAR_S = 31557600;
const KDSS = {As:Math.pow(10,4.0), Pb:Math.pow(10,5.7), Hg:Math.pow(10,5.3)};
const KDRANGE = {As:"2–20,000", Pb:"10–100,000", Hg:"160–630,000"};
const LIM = {
  tbdv:{As:10, Hg:1, Pb:10},
  altl1:{As:50, Hg:1, Pb:50},
  gschv:{Hg:0.01, Pb:1},
  guide:{Hg:0.5, Pb:50},
  trigger:{Pb:200},
  remGarden:{As:50, Hg:2, Pb:1000},
  remAgri:{Pb:2000},
  lrvDep:{Pb:100}
};
const FORMS = {
  As:[
    {id:"asV", label:"Arsenate As(V), dissolved or salt", fr:100, sp:"V"},
    {id:"asIII", label:"Arsenite As(III)", fr:100, sp:"III"},
    {id:"as2o3", label:"As₂O₃ dust (oxidises to As(V) in soil)", fr:100, sp:"V"},
    {id:"aspy", label:"Arsenopyrite or sulfide tailings", fr:5, sp:"V", site:true},
    {id:"cca", label:"CCA-treated wood or its ash", fr:50, sp:"V"}],
  Hg:[
    {id:"hg2", label:"Hg(II) salt, e.g. HgCl₂", fr:100},
    {id:"hgsed", label:"Hg-rich canal or river sediment", fr:50},
    {id:"hg0", label:"Elemental Hg⁰ (liquid or vapour)", fr:20},
    {id:"hgs", label:"Cinnabar HgS", fr:1}],
  Pb:[
    {id:"pb2", label:"Pb²⁺ salt or dissolved Pb", fr:100},
    {id:"pbo", label:"PbO and other Pb dust", fr:60},
    {id:"pbm", label:"Metallic Pb (ammunition)", fr:10, site:true},
    {id:"pbash", label:"Pb in fly ash", fr:30},
    {id:"pbs", label:"Galena PbS", fr:2}]
};
const PRESETS = {
  visp:{label:"Visp, Rhone valley (VS)", note:"Visp: dry inner-Alpine valley floor, calcareous Rhone alluvium over a shallow gravel aquifer.",
    v:{precip:600, infil:25, pH:7.5, oc:2, fe:3, pstat:"normal", drain:"well", rhob:1.35, theta:0.25, bg:{As:10,Hg:0.1,Pb:25},
       aq:"porous", wt:2, K:1e-3, grad:0.002, thick:30, ne:0.2, gwpH:7.6, redox:"suboxic", aqFe:0.5, aqOC:0.1, bgGw:{As:1,Hg:0.01,Pb:0.5},
       Q:40, ssc:100, bgRiv:{As:1,Hg:0.002,Pb:0.1}, lakeO2:"oxic", doc:1.5, lpH:8, so4:"mod", wet:"none", lakeTau:11.4, troph:"meso", elev:650, pm10:11.6, pm25:6.7}},
  plateau:{label:"Swiss Plateau gravel plain", note:"Swiss Plateau: neutral to slightly acidic arable soils over a productive gravel aquifer; lakes with seasonal bottom-water anoxia.",
    v:{precip:1100, infil:40, pH:6.5, oc:2, fe:4, pstat:"normal", drain:"well", rhob:1.3, theta:0.3, bg:{As:8,Hg:0.1,Pb:30},
       aq:"porous", wt:8, K:2e-3, grad:0.003, thick:15, ne:0.2, gwpH:7.4, redox:"oxic", aqFe:0.5, aqOC:0.1, bgGw:{As:0.5,Hg:0.005,Pb:0.3},
       Q:10, ssc:20, bgRiv:{As:0.8,Hg:0.002,Pb:0.2}, lakeO2:"seasonal", doc:3, lpH:8.2, so4:"mod", wet:"some", lakeTau:1.2, troph:"meso", elev:510, pm10:10.1, pm25:7.5}},
  jura:{label:"Jura karst", note:"Jura: clay- and humus-rich soils over karst limestone; thick unsaturated zone but fast conduit flow.",
    v:{precip:1450, infil:60, pH:6.8, oc:4, fe:6, pstat:"normal", drain:"well", rhob:1.1, theta:0.35, bg:{As:12,Hg:0.15,Pb:40},
       aq:"karst", wt:30, K:5e-3, grad:0.01, thick:30, ne:0.02, gwpH:7.4, redox:"oxic", aqFe:0.2, aqOC:0.05, bgGw:{As:0.3,Hg:0.005,Pb:0.5},
       Q:5, ssc:10, bgRiv:{As:0.5,Hg:0.002,Pb:0.3}, lakeO2:"oxic", doc:3, lpH:8, so4:"low", wet:"some", lakeTau:8.2, troph:"oligo", elev:1030, pm10:11.9, pm25:7.5}},
  ticino:{label:"Ticino crystalline valley", note:"Ticino: acidic soils on gneiss with naturally high As, a fractured-rock aquifer and a deep lake with permanent bottom-water anoxia, as in the northern basin of Lake Lugano.",
    v:{precip:1560, infil:40, pH:5.0, oc:4, fe:6, pstat:"normal", drain:"well", rhob:1.1, theta:0.3, bg:{As:25,Hg:0.1,Pb:35},
       aq:"fractured", wt:5, K:1e-6, grad:0.05, thick:20, ne:0.01, gwpH:6.8, redox:"oxic", aqFe:1, aqOC:0.05, bgGw:{As:3,Hg:0.005,Pb:0.2},
       Q:15, ssc:30, bgRiv:{As:2,Hg:0.002,Pb:0.1}, lakeO2:"perm", doc:2, lpH:7.8, so4:"low", wet:"none", lakeTau:11.9, troph:"eu", elev:650, pm10:9.7, pm25:7.6}}
};
const BASE = {preset:"plateau", medium:"soil", form:"", pattern:"continuous", amount:10, duration:20, horizon:100, reactive:100,
  area:1000, footprint:10, fdep:"", gwWidth:50, gwThick:5, wellDist:200, depthMix:20, bgReactive:20, loss:0,
  kdSoil:"", kdAq:"", kdSS:"", land:"garden", drink:"yes", bw:10, ir:0.25, rba:100, fish:"none", siteName:"",
  eros:"", sdr:10, er:1.5, sbShare:3, sbMobile:12, kdSb:20,
  rivDist:500, fastShare:0, trapEff:90, floodEros:10, floodSdr:30, floodPlain:10, budT:1, flood:"none",
  srcE:"", srcN:"", gwDir:"", slope:"", mapLim:"tbdv", season:"year", hgEvas:10,
  rlOn:"off", satDays:"", o2In:8, no3In:15, so4In:30, docIn:1, docSrc:0, aqMn:0.2,
  stackH:30, windU:2.5, windFrom:"", windShare:40, pGas0:"", pRgm:"", pFine:"", pCoarse:"", pLarge:"", forestShare:"", sealedShare:"", drainSys:"urban", resusp:"",
  snowDays:"", snowReem:50, snowRun:30, hgSoilF:10, bgDep:{As:"", Hg:"", Pb:""}, bgAir:{As:"", Hg:"", Pb:""},
  roadL:1000, aadt:15000, hgv:6, roadEra:"today", efRoad:"", roadDir:"90", glArea:5, glLoss:1.4, glConc:{As:0.1, Hg:0.01, Pb:2}, glShare:20};
const EXAMPLES = {
  As:{short:"mine-dump seepage", preset:"ticino", v:{medium:"gw", form:"asV", amount:0.01, horizon:100, gwWidth:50, gwThick:10, wellDist:200, land:"agri", drink:"yes", fish:"none"}},
  Hg:{short:"Visp garden", preset:"visp", v:{medium:"soil", form:"hgsed", pattern:"pulse", amount:0.5, horizon:100, area:200, depthMix:30, land:"garden", drink:"no", fish:"monthly", reactive:50}},
  Pb:{short:"shooting range", preset:"plateau", v:{medium:"soil", form:"pbm", pattern:"continuous", amount:400, duration:50, horizon:100, area:500, depthMix:50, land:"agri", drink:"yes", fish:"none", reactive:10}}
};
const TABS = [{id:"rel", label:"Release"},{id:"site", label:"Site & climate"},{id:"air", label:"Air & surface"},{id:"soil", label:"Soil"},{id:"gw", label:"Groundwater"},{id:"sw", label:"River & lake"},{id:"bud", label:"Budget & floods"},{id:"redox", label:"Redox (optional)"},{id:"exp", label:"Exposure"}];
const soilLike = I => I.medium === "soil" || I.medium === "air" || I.medium === "road";
const FIELDS = [
  {k:"medium", tab:"rel", label:"Released to", type:"select", structural:true, opts:m => [["soil","Soil surface"],["air","Air (stack or chimney)"]].concat(m === "Pb" ? [["road","Road traffic"]] : [], [["gw","Groundwater, directly"],["river","River"],["glacier","Glacier melt (old deposition)"]]), help:"Where the metal first enters the environment. Road traffic and glacier melt calculate the release from their own inputs."},
  {k:"form", tab:"rel", label:"Chemical form", type:"select", structural:true, opts:m => FORMS[m].map(f => [f.id, f.label]), show:I => I.medium !== "glacier", help:"Sets the default reactive fraction and, for air, the particle sizes."},
  {k:"pattern", tab:"rel", label:"Release pattern", type:"select", structural:true, opts:[["continuous","Continuous"],["pulse","Single event"]], show:I => I.medium === "soil" || I.medium === "air"},
  {k:"amount", tab:"rel", label:I => soilLike(I) && I.pattern === "pulse" ? "Mass released" : "Release rate", unit:I => soilLike(I) && I.pattern === "pulse" ? "kg" : "kg/yr", gt:0, show:I => I.medium !== "road" && I.medium !== "glacier", help:I => soilLike(I) ? "" : "Groundwater and river releases are treated as continuous."},
  {k:"roadL", tab:"rel", label:"Road length", unit:"m", gt:0, max:1e6, show:I => I.medium === "road"},
  {k:"aadt", tab:"rel", label:"Traffic", unit:"vehicles/day", min:0, max:300000, show:I => I.medium === "road", help:"Average daily traffic. Swiss counts: ASTRA and cantonal traffic counting stations.", src:"ASTRA traffic counts"},
  {k:"hgv", tab:"rel", label:"Heavy vehicles", unit:"%", min:0, max:100, show:I => I.medium === "road", help:"Each heavy vehicle counts as four cars (assumption)."},
  {k:"roadEra", tab:"rel", label:"Traffic period", type:"select", opts:[["today","Today: brake, tyre and road wear"],["leaded","Leaded petrol era (until 2000)"]], show:I => I.medium === "road", help:"Leaded petrol was banned in Switzerland in 2000; roadside soils still hold its lead."},
  {k:"efRoad", tab:"rel", label:"Emission factor (optional)", unit:"mg/vehicle-km", min:0, max:1000, optional:true, show:I => I.medium === "road", help:"Empty: 0.076 mg Pb per car-km today (EMEP/EEA Guidebook 2023, brake and tyre wear) or 10 mg in the leaded-petrol era (assumption)."},
  {k:"roadDir", tab:"rel", label:"Road runs", type:"select", opts:[["0","North–south"],["45","Northeast–southwest"],["90","East–west"],["135","Northwest–southeast"]], show:I => I.medium === "road", help:"Draws the roadside strip on the spread map."},
  {k:"glArea", tab:"rel", label:"Glacier area", unit:"km²", gt:0, max:100, show:I => I.medium === "glacier", help:"Swiss glaciers covered 861 km² in 2023 (GLAMOS).", src:"GLAMOS glacier inventory"},
  {k:"glLoss", tab:"rel", label:"Ice loss", unit:"m water/yr", min:0, max:10, show:I => I.medium === "glacier", help:"Average thinning in metres of water. Swiss glaciers lost 1.1–1.7 m a year in 2017–2025 (GLAMOS)."},
  {k:"glConc", tab:"rel", perMetal:true, label:() => `${S.metal} in ice from 1950–1990`, unit:"ng/g", min:0, max:1000, show:I => I.medium === "glacier", help:() => ({Pb:"Colle Gnifetti ice core: 1.0–2.7 ng/g as decade means for 1960–1990, peak 5.6 in 1972 (Sigl et al. 2018).", Hg:"Assumption: total Hg in Alpine ice of that period is not well known.", As:"Assumption: arsenic in Alpine ice is not well known."})[S.metal]},
  {k:"glShare", tab:"rel", label:"Share of meltwater from that ice", unit:"%", min:0, max:100, show:I => I.medium === "glacier", help:"The ice of 1950–1990 is only part of what melts each year. Assumption: 20%."},
  {k:"duration", tab:"rel", label:"Duration of release", unit:"years", gt:0, max:2000, show:I => soilLike(I) && I.pattern === "continuous"},
  {k:"horizon", tab:"rel", label:"Assessment horizon", unit:"years", gt:0, max:100000},
  {k:"reactive", tab:"rel", label:"Reactive fraction", unit:"%", min:0, max:100, show:soilLike, help:"Share that can dissolve and sorb: salts 100%, metallic Pb about 10%, sulfides 1–5%."},
  {k:"area", tab:"rel", label:"Affected area", unit:"m²", gt:0, show:I => I.medium === "soil"},
  {k:"footprint", tab:"rel", label:"Deposition footprint", unit:"km²", gt:0, show:I => I.medium === "air", help:"The area around the stack you assess: a circle of this size."},
  {k:"fdep", tab:"rel", label:"Share deposited in footprint (optional)", unit:"%", min:0, max:100, optional:true, show:I => I.medium === "air", help:"Empty: calculated from particle size, release height, wind and rain (Air & surface tab). Enter a measured or modelled value (e.g. AERMOD) to replace it."},
  {k:"gwWidth", tab:"rel", label:"Plume width", unit:"m", gt:0, show:I => I.medium === "gw"},
  {k:"gwThick", tab:"rel", label:"Mixing thickness", unit:"m", gt:0, show:I => I.medium === "gw", help:"Capped at the aquifer thickness."},
  {k:"wellDist", tab:"rel", label:"Distance to well or spring", unit:"m", min:0, show:I => I.medium === "gw"},
  {k:"sbShare", tab:"rel", label:"Antimony in bullets", unit:"% of Pb", min:0, max:20, show:I => I.medium === "soil" && I.form === "pbm", help:"2–5% in Swiss ammunition (FOEN)."},
  {k:"sbMobile", tab:"rel", label:"Mobile antimony fraction", unit:"%", min:0, max:100, show:I => I.medium === "soil" && I.form === "pbm", help:"8–15% measured (FOEN)."},
  {k:"kdSb", tab:"rel", label:"Antimony Kd", unit:"L/kg", gt:0, show:I => I.medium === "soil" && I.form === "pbm", help:"About 20 L/kg below pH 8 (FOEN)."},
  {k:"precip", tab:"site", label:"Precipitation", unit:"mm/yr", gt:0, max:6000, help:"Use the 1991–2020 normal of the nearest MeteoSwiss station.", src:"MeteoSwiss climate normals (opendata.swiss)"},
  {k:"infil", tab:"site", label:"Infiltration share", unit:"%", gt:0, max:100, help:"Share of precipitation that recharges groundwater."},
  {k:"elev", tab:"site", label:"Elevation", unit:"m a.s.l.", min:0, max:4800, help:"Sets how long snow covers the ground.", src:"swisstopo height service (filled from the map)"},
  {k:"pm10", tab:"site", label:"Fine dust PM10, annual mean", unit:"µg/m³", min:0, max:200, help:"Background air quality. LRV limit 20 µg/m³.", src:"FOEN annual maps 2023–2025 (filled from the map); NABEL or cantonal stations"},
  {k:"pm25", tab:"site", label:"Fine dust PM2.5, annual mean", unit:"µg/m³", min:0, max:200, help:"LRV limit 10 µg/m³.", src:"FOEN annual maps 2023–2025"},
  {k:"stackH", tab:"air", label:"Release height", unit:"m", min:0, max:500, show:I => I.medium === "air", help:"Stack height, or about 1 m for dust from the ground. Plume rise is ignored, which is cautious near the source."},
  {k:"windU", tab:"air", label:"Mean wind speed", unit:"m/s", min:0.3, max:20, show:I => I.medium === "air" || I.medium === "road", help:"Swiss Plateau 1.4–2.5 m/s, inner Alpine valleys 0.9–1.6 m/s (Graf et al. 2019).", src:"MeteoSwiss station climatology"},
  {k:"windFrom", tab:"air", label:"Prevailing wind from", type:"select", structural:true, opts:[["","Not set: the same in all directions"],["0","North"],["45","Northeast (Bise)"],["90","East"],["135","Southeast"],["180","South"],["225","Southwest"],["270","West"],["315","Northwest"]], show:I => I.medium === "air", help:"Shapes the deposition footprint on the spread map. Swiss Plateau: southwest to west winds, and the Bise from the northeast; valleys follow the valley.", src:"MeteoSwiss wind roses"},
  {k:"windShare", tab:"air", label:"Share of time from that direction", unit:"%", min:0, max:100, show:I => I.medium === "air" && I.windFrom !== "", help:"Within ±45° of it; the rest of the time the wind is spread evenly."},
  {k:"pGas0", tab:"air", label:"Hg⁰ gas", unit:"% of emission", min:0, max:100, optional:true, show:I => I.medium === "air" && S.metal === "Hg", help:"Waste incineration: about 20% Hg⁰, 60% Hg(II) gas, 20% on particles; coal plants about 50/40/10 (US EPA speciation factors)."},
  {k:"pRgm", tab:"air", label:"Hg(II) gas", unit:"% of emission", min:0, max:100, optional:true, show:I => I.medium === "air" && S.metal === "Hg"},
  {k:"pFine", tab:"air", label:"Fine particles (< 2.5 µm)", unit:"% of emission", min:0, max:100, optional:true, show:I => I.medium === "air", help:"Empty fields use the split for the chemical form. Fine particles travel tens of kilometres; filtered stacks emit mostly fine particles."},
  {k:"pCoarse", tab:"air", label:"Coarse particles (2.5–10 µm)", unit:"% of emission", min:0, max:100, optional:true, show:I => I.medium === "air"},
  {k:"pLarge", tab:"air", label:"Large dust (> 10 µm)", unit:"% of emission", min:0, max:100, optional:true, show:I => I.medium === "air", help:"Dust from heaps, tailings and handling lands within a few hundred metres."},
  {k:"forestShare", tab:"air", label:"Forest in the footprint", unit:"%", min:0, max:100, optional:true, show:I => I.medium === "air" || I.medium === "road", help:"Forest canopies catch about three times more fine dust than fields, and leaves take up Hg⁰. Empty: 100% if the land use is forest, otherwise 30% (Swiss average)."},
  {k:"sealedShare", tab:"air", label:"Sealed surfaces in the footprint", unit:"%", min:0, max:100, optional:true, show:I => I.medium === "air", help:"Roofs, roads and squares: rain washes what lands there into drains. Empty: from the land use."},
  {k:"drainSys", tab:"air", label:"Drainage of sealed surfaces", type:"select", opts:() => Object.entries(DRAIN).map(([k, d]) => [k, d.label]), show:I => I.medium === "air" || I.medium === "road", help:"Where runoff goes: straight to a stream, onto road shoulders, to an oil separator, a road-runoff treatment plant (SABA) or a sewage works (Steiner & Hermann 2023 for FOEN)."},
  {k:"resusp", tab:"air", label:"Dust blown up again (optional)", unit:"%/yr of topsoil metal", min:0, max:10, optional:true, show:soilLike, help:"Wind lifting dust from bare ground. Empty: 0.05% on industrial ground, 0.01% on fields, 0.005% in gardens, 0 in forest (assumption). About 30% of it leaves the area; the rest lands close by."},
  {k:"snowDays", tab:"air", label:"Snow-cover days (optional)", unit:"days/yr", min:0, max:365, optional:true, show:I => I.medium === "air", help:"Empty: from elevation (Hydrological Atlas of Switzerland, shortened for today's climate). Above about 3200 m snow stays all year and the metal is stored in firn."},
  {k:"snowReem", tab:"air", label:"Hg re-emitted from snow", unit:"%", min:0, max:100, show:I => I.medium === "air" && S.metal === "Hg", help:"Sunlight turns Hg in snow back into Hg⁰ gas before melt: about 50–60% at Swiss latitudes (model, Durnford et al. 2012)."},
  {k:"snowRun", tab:"air", label:"Snowmelt running off to streams", unit:"%", min:0, max:100, show:I => I.medium === "air", help:"Share of what was stored in the snowpack that leaves with surface runoff at melt; the rest enters the soil. Assumption: 30%."},
  {k:"hgSoilF", tab:"air", label:"Hg⁰ emission from soil", unit:"ng/(m²·h) per mg/kg", min:0, max:1000, show:I => soilLike(I) && S.metal === "Hg", help:"Background soils emit 1–2 ng/(m²·h); contaminated soils 20–800 (Zhu et al. 2016; Floreani et al. 2023). Default 10 per mg/kg; ×10 for elemental Hg, ×0.1 for cinnabar."},
  {k:"bgDep", tab:"air", perMetal:true, label:() => `Background ${S.metal} deposition (optional)`, unit:"µg/(m²·d)", min:0, max:1000, optional:true, show:I => I.medium === "air" || I.medium === "road", help:() => S.metal === "Pb" ? "Empty: the nearest suitable NABEL station (2024)." : S.metal === "Hg" ? "Empty: about 5 µg/m²/yr wet deposition." : "No Swiss measurement is published for arsenic."},
  {k:"bgAir", tab:"air", perMetal:true, label:() => `Background ${S.metal} in air (optional)`, unit:"ng/m³", min:0, max:10000, optional:true, show:I => I.medium === "air" || I.medium === "road", help:() => S.metal === "Pb" ? "Empty: Pb in PM10 at the nearest NABEL station (2024)." : S.metal === "Hg" ? "Empty: gaseous Hg at the nearest NABEL site (Osterwalder et al. 2024)." : "No Swiss measurement is published for arsenic."},
  {k:"pH", tab:"soil", label:"Soil pH", unit:"–", min:2, max:11, src:"NABO, cantonal soil surveys"},
  {k:"oc", tab:"soil", label:"Organic carbon", unit:"%", min:0.01, max:60},
  {k:"fe", tab:"soil", label:"Oxalate-extractable Fe", unit:"g/kg", min:0, max:200, help:"Main sink for arsenic."},
  {k:"pstat", tab:"soil", label:"Phosphate status", type:"select", opts:[["normal","Normal"],["high","High (heavily fertilised)"]]},
  {k:"drain", tab:"soil", label:"Water regime", type:"select", opts:[["well","Well drained"],["periodic","Periodically waterlogged"],["perm","Permanently waterlogged"]]},
  {k:"depthMix", tab:"soil", label:"Mixing depth", unit:"cm", gt:0, max:500, help:"20 cm for arable or garden topsoil; 50 cm or more for berms."},
  {k:"rhob", tab:"soil", label:"Bulk density", unit:"kg/L", min:0.1, max:2.5},
  {k:"theta", tab:"soil", label:"Water content", unit:"m³/m³", gt:0, max:0.7},
  {k:"bg", tab:"soil", perMetal:true, label:() => `Background ${S.metal} in soil`, unit:"mg/kg", min:0, src:"NABO, cantonal data"},
  {k:"bgReactive", tab:"soil", label:"Reactive share of background", unit:"%", min:0, max:100},
  {k:"loss", tab:"soil", label:"Other losses", unit:"%/yr", min:0, max:100, help:"For example crop offtake or mixing into deeper soil. Erosion, Hg⁰ emission and blown dust are set separately."},
  {k:"slope", tab:"soil", label:"Slope at the source (optional)", unit:"%", min:0, max:300, optional:true, help:"Filled from swisstopo terrain when the spread map loads. Scales the default erosion with the RUSLE slope factor relative to a 5% slope (assumption)."},
  {k:"eros", tab:"soil", label:"Erosion rate (optional)", unit:"t/ha/yr", min:0, max:200, optional:true, help:"Empty uses the default for the land use: 0.7 t/ha/yr on arable land (measured, Frienisberg BE)."},
  {k:"sdr", tab:"soil", label:"Sediment delivery to river", unit:"%", min:0, max:100, help:"Share of eroded soil that reaches a stream. Assumed 10%."},
  {k:"er", tab:"soil", label:"Metal enrichment in eroded soil", unit:"×", min:0.5, max:5, help:"Fine particles carry more metal. Assumed 1.5."},
  {k:"kdSoil", tab:"soil", label:"Measured Kd (optional)", unit:"L/kg", gt:0, optional:true, help:"Leave empty to use the screening relation."},
  {k:"aq", tab:"gw", label:"Aquifer type", type:"select", opts:[["porous","Gravel or sand"],["karst","Karst"],["fractured","Fractured crystalline rock"]]},
  {k:"wt", tab:"gw", label:"Depth to water table", unit:"m", min:0},
  {k:"K", tab:"gw", label:"Hydraulic conductivity", unit:"m/s", gt:0, max:1, help:"Gravel 1e-3 to 1e-2; fractured rock 1e-7 to 1e-5."},
  {k:"grad", tab:"gw", label:"Hydraulic gradient", unit:"m/m", gt:0, max:1},
  {k:"thick", tab:"gw", label:"Aquifer thickness", unit:"m", gt:0},
  {k:"ne", tab:"gw", label:"Effective porosity", unit:"–", gt:0, max:0.6},
  {k:"gwpH", tab:"gw", label:"Groundwater pH", unit:"–", min:3, max:11, src:"NAQUA"},
  {k:"redox", tab:"gw", label:"Redox state", type:"select", opts:[["oxic","Oxic"],["suboxic","Suboxic (NO₃⁻ or Mn reducing)"],["anoxic","Anoxic (Fe reducing)"],["sulfidic","Sulfidic"]], src:"O₂, NO₃⁻, Fe²⁺, H₂S from NAQUA or site wells"},
  {k:"aqFe", tab:"gw", label:"Aquifer Fe oxides", unit:"g/kg", min:0},
  {k:"aqOC", tab:"gw", label:"Aquifer organic carbon", unit:"%", min:0.01, max:20},
  {k:"bgGw", tab:"gw", perMetal:true, label:() => `Background ${S.metal} in groundwater`, unit:"µg/L", min:0, src:"NAQUA"},
  {k:"kdAq", tab:"gw", label:"Aquifer Kd (optional)", unit:"L/kg", gt:0, optional:true},
  {k:"gwDir", tab:"gw", label:"Groundwater flow direction", unit:"° from north", min:0, max:360, optional:true, help:"Recommended: read it from the cantonal groundwater map or your own wells, or click Set direction on the spread map. Empty: the terrain direction stands in, as support only.", src:"Cantonal groundwater maps; FOEN hydrogeological map 1:100,000"},
  {k:"Q", tab:"sw", label:"River discharge", unit:"m³/s", gt:0, src:"FOEN hydrological data"},
  {k:"ssc", tab:"sw", label:"Suspended sediment", unit:"mg/L", min:0},
  {k:"bgRiv", tab:"sw", perMetal:true, label:() => `Background dissolved ${S.metal} in river`, unit:"µg/L", min:0, src:"NADUF"},
  {k:"kdSS", tab:"sw", label:"Kd on suspended matter (optional)", unit:"L/kg", gt:0, optional:true, help:"Default: median from Allison & Allison (2005)."},
  {k:"troph", tab:"sw", label:"Lake trophic state", type:"select", opts:[["oligo","Nutrient-poor (oligotrophic)"],["meso","Moderate (mesotrophic)"],["eu","Nutrient-rich (eutrophic)"]], help:"More nutrients mean more algae; their decay uses up oxygen at the lake bottom and feeds methylating bacteria.", src:"Cantonal lake monitoring (phosphorus, chlorophyll)"},
  {k:"season", tab:"sw", label:"Lake season", type:"select", opts:[["year","Year average"],["summer","Summer: stratified, sunny"],["winter","Winter: mixed, little light"]], help:"Which moment the lake results describe: methylation and the forms in lake water. Summer: stratified, seasonal anoxia at the bottom, strong sunlight at the surface. Winter: mixed and oxic. The multi-year budget always runs the seasonal cycle."},
  {k:"hgEvas", tab:"sw", label:"Hg⁰ escape from lake water", unit:"%/yr", min:0, max:500, show:() => S.metal === "Hg", help:"Sunlight reduces dissolved Hg(II) to Hg⁰ gas, which escapes to air. Year average; the budget runs it twice as fast from May to September and slower in winter. Assumption: 10% of the lake-water Hg per year for deep lakes. Shallow lakes can lose much more."},
  {k:"lakeO2", tab:"sw", label:"Lake bottom-water oxygen", type:"select", opts:[["auto","Estimate from trophic state"],["oxic","Oxic all year"],["seasonal","Seasonal anoxia"],["perm","Permanent anoxia"]], src:"Cantonal lake monitoring"},
  {k:"doc", tab:"sw", label:"Dissolved organic carbon", unit:"mg/L", min:0},
  {k:"lpH", tab:"sw", label:"Lake pH", unit:"–", min:3, max:11},
  {k:"so4", tab:"sw", label:"Sulfate", type:"select", opts:[["low","Low (below 10 mg/L)"],["mod","Moderate (10–50 mg/L)"],["high","High (above 50 mg/L)"]]},
  {k:"wet", tab:"sw", label:"Wetlands in the catchment", type:"select", opts:[["none","None"],["some","Some"],["many","Many"]]},
  {k:"srcE", tab:"rel", label:"Source location E (LV95)", unit:"m", min:2480000, max:2840000, optional:true, help:"Set it on the spread map with Move source. Empty: the preset's place, or the site you filled from the map."},
  {k:"srcN", tab:"rel", label:"Source location N (LV95)", unit:"m", min:1070000, max:1300000, optional:true},
  {k:"rivDist", tab:"bud", label:"Groundwater path to river or lake", unit:"m", gt:0, help:"How far groundwater flows from the source before it seeps into surface water."},
  {k:"fastShare", tab:"bud", label:"Seepage taking fast paths", unit:"%", min:0, max:100, show:I => soilLike(I) && I.aq === "porous", help:"Cracks, root channels and fine particles can carry seepage straight to the water table. 0 = slow matrix flow only. Karst and fractured rock are always treated as fast."},
  {k:"lakeTau", tab:"bud", label:"Lake water residence time", unit:"years", min:0, max:100, help:"Lake Zurich 1.2, Lake Neuchâtel 8.2, Lake Geneva 11.4, Lake Lugano north basin 11.9. Enter 0 if no lake lies downstream.", src:"Canton of Schwyz (Lake Zurich); lake data summaries"},
  {k:"trapEff", tab:"bud", label:"River particles settling in the lake", unit:"%", min:0, max:100, help:"Bulk sediment retention measured at 97–98% in Lake Geneva and Lake Brienz. Metals ride on the finest particles, which settle least, so 90% is a cautious default."},
  {k:"floodEros", tab:"bud", label:"Soil loss in one extreme flood", unit:"t/ha", min:0, max:500, help:"Assumption: 10 t/ha in one event, about 14 years of average arable erosion."},
  {k:"floodSdr", tab:"bud", label:"Flood-eroded soil reaching the river", unit:"%", min:0, max:100, help:"Assumption: 30%. Heavy runoff connects fields to streams."},
  {k:"rlOn", tab:"redox", label:"Redox ladder", type:"select", structural:true, opts:[["off","Off: use the choices on the Soil and Groundwater tabs"],["on","On: calculate them from the data below"]], help:"For users with water-chemistry data. Microbes burn organic carbon with oxygen first, then nitrate, manganese and iron oxides, then sulfate; the ladder works out which step is reached below the source."},
  {k:"satDays", tab:"redox", label:"Days per year the topsoil is water-saturated", unit:"days", min:0, max:366, optional:true, show:I => I.rlOn === "on", help:"Empty keeps the water regime on the Soil tab. Fewer than 14 days: well drained; up to 180: periodically waterlogged; more: permanently. Low organic carbon (under 1%) moves it one step towards oxic.", src:"Site observation; BLW soil suitability map (waterlogging)"},
  {k:"o2In", tab:"redox", label:"Oxygen in the water reaching the aquifer", unit:"mg/L", min:0, max:20, show:I => I.rlOn === "on", src:"Recharge or upstream groundwater (NAQUA, site wells)"},
  {k:"no3In", tab:"redox", label:"Nitrate", unit:"mg/L as NO₃", min:0, max:500, show:I => I.rlOn === "on"},
  {k:"so4In", tab:"redox", label:"Sulfate", unit:"mg/L", min:0, max:3000, show:I => I.rlOn === "on"},
  {k:"docIn", tab:"redox", label:"Biodegradable organic carbon reaching the aquifer", unit:"mg C/L", min:0, max:5000, show:I => I.rlOn === "on", help:"Usually 0.5–2 mg/L under fields and forests; more under wetlands or peat."},
  {k:"docSrc", tab:"redox", label:"Extra organic carbon from the release", unit:"mg C/L", min:0, max:50000, show:I => I.rlOn === "on", help:"For example landfill leachate, manure or sewage. 0 if the release carries none."},
  {k:"aqMn", tab:"redox", label:"Reactive manganese oxides in the aquifer", unit:"g/kg", min:0, max:100, show:I => I.rlOn === "on", help:"Reactive iron oxides come from the Groundwater tab."},
  {k:"floodPlain", tab:"bud", label:"Flood particles left on floodplains", unit:"%", min:0, max:100, help:"Assumption: 10% of the flood's particle load settles on flooded land."},
  {k:"land", tab:"exp", label:"Land use at the source", type:"select", opts:[["garden","Garden or playground"],["agri","Agriculture"],["forest","Forest"],["ind","Industrial or commercial"]]},
  {k:"drink", tab:"exp", label:"Groundwater used for drinking", type:"select", opts:[["yes","Yes"],["no","No"]]},
  {k:"bw", tab:"exp", label:"Child body weight", unit:"kg", gt:0},
  {k:"ir", tab:"exp", label:"Soil and dust ingestion", unit:"g/d", min:0, max:10, help:"0.25 g/d is the 95th percentile used for the Swiss Hg value."},
  {k:"rba", tab:"exp", label:"Relative bioavailability", unit:"%", min:0, max:100},
  {k:"fish", tab:"exp", label:"Local fish eaten", type:"select", opts:[["none","None"],["monthly","About monthly"],["weekly","Weekly or more"]]}
];
const TABNOTES = {
  rel: () => "",
  site: I => I.preset === "custom" ? (I.siteName ? `Values filled from the map at ${I.siteName}. Edit any of them if you have site data.` : "Custom site values.") : PRESETS[I.preset].note + " Illustrative defaults: replace with MeteoSwiss station normals and site data.",
  air: I => I.medium === "air" ? "How the emission spreads and lands: particle size, release height, wind and rain decide how much falls in the footprint; forests, snow and sealed surfaces decide where it goes next." : I.medium === "road" ? "Wind, forest and drainage values used for the road release." : soilLike(I) ? "Hg⁰ emission and blown dust from the topsoil. The other values apply to releases to air." : "These values apply to releases to air, roads and soils.",
  soil: I => "Kd is estimated from pH, organic carbon and Fe oxides unless you enter a measured value." + (I.rlOn === "on" && I.satDays !== "" ? " Water regime: set by the redox ladder." : ""),
  gw: I => (I.medium === "gw" ? "The release enters the aquifer directly." : "Used for leaching from soil and the long-term groundwater estimate.") + (I.rlOn === "on" ? " Redox state: set by the redox ladder." : ""),
  sw: I => (riverLike(I) ? "River values drive the river calculation. " : "River values apply when the release goes to a river. ") + (S.metal === "Hg" ? "Lake values drive the methylation index." : "Lake oxygen also sets the redox state shown on the profile."),
  bud: () => "These settings drive the mass budget below the results. Flood values are assumptions: replace them with event data if you have it.",
  redox: I => I.rlOn === "on" ? "The ladder now sets the soil water regime (if you give saturation days) and the aquifer redox state; its electron balance appears among the results. Switching it off keeps the last calculated values." : "Off. Switch on if you have oxygen, nitrate, sulfate and organic-carbon data for the water reaching the aquifer.",
  exp: () => "The child soil-ingestion dose is calculated for gardens and playgrounds."
};
const MEDIUM_LBL = {soil:"soil", air:"air", road:"a road (traffic)", gw:"groundwater", river:"a river", glacier:"a glacier-fed river (melt)"};
const BPOS = {air:[1046,58], forest:[470,300], farm:[692,350], site:[740,354], people:[854,330], gw:[790,500], river:[712,432], lake:[1010,436], sediment:[1100,549]};
const RPOS = {stack:[892,298], farm:[640,392], site:[740,392], forest:[500,322], gw:[700,500], river:[780,410]};
const METHODS_HTML = () => `<ol>
<li><b>Soil Kd.</b> Pb uses the published regression log Kd = 1.99 + 0.42·pH (Carlon et al. 2004, Environmental Pollution 127). Hg(II) is treated as bound to organic matter, Kd = Koc·f<sub>oc</sub> with log Koc 5.5, which reproduces the median soil Kd compiled by Allison &amp; Allison (2005) at 2% organic carbon. For As no robust generic regression exists and US EPA (2004) recommends site-measured values, so the page uses a semi-empirical relation anchored to the Allison &amp; Allison median: log Kd = 2.77 + 0.9·log Fe<sub>ox</sub> − 0.25·max(0, pH−7) + 0.1·max(0, 7−pH), minus 0.3 for high phosphate, 0.7 for As(III) and 0.5 or 1.2 for periodic or permanent waterlogging. All values are clamped to the soil ranges of Allison &amp; Allison (2005). A measured Kd always replaces the default.</li>
<li><b>Topsoil mass balance.</b> dS/dt = J − (k<sub>leach</sub> + k<sub>erosion</sub> + k<sub>other</sub>)·S, with k<sub>leach</sub> = f<sub>r</sub>·q / (d·(θ + ρ<sub>b</sub>·Kd)) and k<sub>erosion</sub> = E·ER / (d·ρ<sub>b</sub>); q = precipitation × infiltration share, d = mixing depth, f<sub>r</sub> = reactive fraction, E = erosion rate, ER = enrichment ratio.</li>
<li><b>Seepage water.</b> C<sub>w</sub> = (f<sub>r</sub>·ΔC + f<sub>bg</sub>·C<sub>bg</sub>) / (Kd + θ/ρ<sub>b</sub>), compared with the AltlV Annex 1 value. For Pb it is capped at the solubility of lead carbonate, about 300 µg/L at pH 7–9, rising to about 10 mg/L in acidic soil (sulfate control), as reported in the FOEN shooting-range study.</li>
<li><b>Erosion to rivers.</b> Load = C<sub>soil</sub>·E·ER·A·SDR. Defaults: 0.7 t/ha/yr on arable land (mean measured at Frienisberg BE, 1997–2007, Prasuhn); 0.3 gardens, 0.05 forest, 1 industrial and 2 t/ha/yr on bare berms and dumps (assumptions). ER 1.5 and sediment delivery ratio 10% are assumptions. River concentration = load ÷ Q, dissolved share 1/(1 + Kd<sub>ss</sub>·SSC).</li>
<li><b>Antimony at shooting ranges.</b> For metallic Pb, Sb is added at 3% of the Pb mass (2–5% in bullets), Kd 20 L/kg below pH 8 and a mobile fraction of 12% (8–15%), with seepage capped at about 5 mg/L (Ca-antimonate solubility). All values from the FOEN shooting-range study.</li>
<li><b>Travel time to the water table.</b> t = L·θ·R / q, R = 1 + ρ<sub>b</sub>·Kd<sub>sub</sub>/θ; subsoil Kd uses 30% of topsoil organic carbon. Preferential flow, colloids and DOC-facilitated transport are not included.</li>
<li><b>Groundwater under the source.</b> C<sub>gw</sub> = C<sub>bg</sub> + C<sub>w</sub>/DAF with DAF = 1 + K·i·d<sub>m</sub>/(I·L) and d<sub>m</sub> = √(0.0112·L²) + d<sub>a</sub>·(1 − exp(−L·I/(K·i·d<sub>a</sub>))) ≤ d<sub>a</sub>; L = √area (US EPA Soil Screening Guidance).</li>
<li><b>Direct release to groundwater.</b> C = E / (K·i·W·b). Travel time t = X·R/(K·i/n<sub>e</sub>) with R = 1 + 1.8·Kd<sub>aq</sub>/n<sub>e</sub> in gravel and sand, and R = 1 in karst and fractured rock.</li>
<li><b>River releases.</b> C<sub>tot</sub> = E/Q; default log Kd<sub>ss</sub>: As 4.0, Pb 5.7, Hg 5.3 (medians, Allison &amp; Allison 2005). Snowmelt multiplies Q by 2 and SSC by 3; storm by 5 and 10. The particle-bound load settles in the lake at the trapping efficiency (default 90%).</li>
<li><b>Air releases: deposition by size and weather.</b> The emission is split by chemical form into Hg⁰ gas, Hg(II) gas, fine (&lt; 2.5 µm), coarse (2.5–10 µm) and large (&gt; 10 µm) particles. Each class follows a long-term plume averaged over wind sectors: the ground-level share g(x) = √(2/π)·exp(−H<sub>e</sub>²/2σ<sub>z</sub>²)/σ<sub>z</sub> with σ<sub>z</sub> = 0.06x(1 + 0.0015x)<sup>−½</sup> (Briggs 1973, neutral), capped by a mixing height of ${AIR_HMIX} m; large particles sink at their settling velocity (H<sub>e</sub> = H − v<sub>s</sub>x/u). Along the way the plume loses mass by dry deposition, v<sub>d</sub>·g(x)/u per metre, and by rain, W·P/8766/u per metre (W washout coefficient, P precipitation in mm/yr), so no mass is counted twice. Dry deposition velocities over open land and forest (cm/s): Hg(II) gas 1.0 and 1.7, fine 0.1 and 0.3, coarse 0.5 and 1.5, large 3.5 and 4.0; Hg⁰ 0 and 0.06 (leaf uptake). Washout coefficients from US EPA (HHRAP). What lands within the footprint (a circle of the area you set) enters the topsoil mass balance; what lands within 50 km counts as regional deposition; the rest is carried further. The wind direction you set sends a share of the time into a 90° sector and spreads the rest evenly; it changes the map and the most exposed point (beyond 100 m), not the totals.</li>
<li><b>Forests, snow and sealed surfaces.</b> Dry deposition is shared between open land, forest and sealed surfaces in proportion to area × deposition velocity; rain deposits by area. Hg⁰ taken up by leaves from April to October reaches the soil with the litter in October and November. Snow cover lasts D = 0.114·h − 32 days at elevation h (Hydrological Atlas of Switzerland plate 3.6, shortened for today's climate), centred on early February at 1000 m; above about 3200 m snow lies all year and the metal is stored. What lands on snow waits in the snowpack; for Hg a share (default 50%, model value 57% at Swiss latitudes, Durnford et al. 2012) returns to air; the rest leaves at melt, with the share you set running off to streams. Rain on sealed surfaces drains as set: direct to water, road shoulders, oil separators, road-runoff treatment plants (SABA) or sewage works, which retain 15%, 100%, 30%, 90% and 70% (Steiner &amp; Hermann 2023 for FOEN).</li>
<li><b>Back to air.</b> Topsoil emits Hg⁰ at F = f·C<sub>soil</sub> (default f = 10 ng/m²/h per mg/kg; ×10 for elemental Hg, ×0.1 for cinnabar), a loss rate k = f·8766·10⁻⁶/(ρ<sub>b</sub>·1000·d) per year. Wind lifts dust from bare ground at a rate set by land use (0.05%/yr industrial, 0.01% fields, 0.005% gardens; assumptions); 30% of it leaves the area.</li>
<li><b>Road traffic.</b> Release = traffic × length × emission factor, with heavy vehicles counted four times. Pb today 0.076 mg per car-km from brake and tyre wear (EMEP/EEA Guidebook 2023); 10 mg per car-km in the leaded-petrol era (assumption). Today 40% lands on the road surface, 50% beside the road and 10% is carried by air; for leaded petrol 20/30/50. Of the road-surface dust, 30% is blown back to the roadside before rain washes the rest into the drains. Of all roadside deposition, 75% stays within 5 m of the road (Sieber, Kawecki &amp; Nowack 2019); that strip is the assessed soil.</li>
<li><b>Glacier melt.</b> Release = glacier area × ice loss × metal in ice from 1950–1990 × the share of meltwater from that ice. It then follows the river calculation. Pb in that ice: 1.0–2.7 ng/g as decade means (Colle Gnifetti, Sigl et al. 2018); the Hg and As values and the meltwater share are assumptions.</li>
<li><b>Background air.</b> PM10 and PM2.5 are FOEN annual maps (mean of 2023–2025, averaged to 1 km). Background Pb in PM10 and in deposition is the nearest NABEL station of a similar kind (2024); gaseous Hg from the 2022–23 Swiss survey (Osterwalder et al. 2024). They are added to the release for the comparison with the LRV, not to the mass budget.</li>
<li><b>Child soil ingestion.</b> Dose = C<sub>soil</sub>·IR·RBA/BW, with 0.25 g/d and 10 kg as in the Agroscope derivation of the Swiss Hg value. Reference points: As BMDL<sub>05</sub> 0.06 µg/kg bw per day (EFSA 2024); Pb BMDL<sub>01</sub> 0.50 µg/kg bw per day (EFSA 2010); inorganic Hg TWI 4 µg/kg bw per week (EFSA 2012).</li>
<li><b>Hg methylation index (0–10).</b> Bottom-water oxygen (0, 3, 4) + trophic state (0, 0.5, 1) + wetlands (0, 1, 2) + DOC (0, 1, 1.5) + pH (0, 0.5, 1.5) + sulfate (0, 1, 0.5), capped at 10. A qualitative ranking of known drivers, not a concentration.</li>
<li><b>Lake state and season.</b> With bottom-water oxygen on "estimate", a nutrient-poor lake is taken as oxic and a moderately or very nutrient-rich lake as seasonally anoxic (algae sink and are decomposed in the deep water; many Swiss Plateau lakes behave like this). A seasonally anoxic lake counts as anoxic in summer and oxic in winter; the year setting uses the mean. In lake water, sunlight and algae drive two Hg losses: Hg(II) is reduced to dissolved gaseous Hg⁰ that escapes to air (default 10% of the lake-water Hg per year on average, run in the budget at ×2 from May to September and ×2/7 in the other months; an assumption for deep lakes, scaled from inland-lake evasion of about 1 ng/m²/h, Denkenberger et al. 2012), and methylmercury is broken down by light (Sellers et al. 1996), which lowers its share in summer surface water. The lake box loses mass at the rate 1/τ + k<sub>Hg⁰</sub>. The season setting changes the snapshot results (methylation index, forms in lake water), not the multi-year budget. Methylated arsenic shares in lake water rise with trophic state and in summer (algae methylate As).</li>
<li><b>Redox ladder (optional).</b> An electron balance per litre of water reaching the aquifer, in mmol e⁻/L: organic carbon 4·DOC/12 is set against O₂ 4·O₂/32, then NO₃⁻ 5·NO₃/62. Any surplus reduces the Mn and Fe oxides held by the sediment (2 and 1 e⁻ per atom, a stock of a·1000/M·ρ<sub>b</sub>/n<sub>e</sub> per litre of pore water, ρ<sub>b</sub> 1.8 kg/L); once they are used up in the first ${LAD_ZONE} m (t = stock/surplus·${LAD_ZONE} m/v) sulfate is reduced (8 e⁻). The step reached by the budget year sets the aquifer redox state; days of topsoil saturation set the soil water regime (&lt;14 well drained, ≤180 periodic, more permanent; below 1% organic carbon one step drier). It ignores kinetics, pH buffering and mixing; use a reactive transport code for those.</li>
<li><b>Mass budget.</b> Monthly steps up to the chosen year. Topsoil follows the mass balance above. Leached metal waits below the root zone for the matrix travel time, or arrives at once along fast paths (the fast-path share in gravel; always in karst and fractured rock). It then crosses the aquifer to surface water in t = X·R/v, with R as in the groundwater item and v = K·i/n<sub>e</sub>; while in the aquifer, 1/R of it is dissolved and the rest sorbed. Eroded soil reaches the river at the delivery ratio; the rest stays downslope. In the river the particle-bound share settles in the lake at the trapping efficiency (default 90%; 97–98% measured for bulk sediment in Lake Geneva and Lake Brienz) and the rest passes downstream; the dissolved share mixes into the lake and leaves with first-order flushing over the water residence time. For air releases the share not deposited leaves the footprint. A flood removes E<sub>flood</sub>·ER/(d·ρ<sub>b</sub>) of the topsoil metal; part reaches the river with SSC ×10, and part of its particles settles on floodplains. The best estimate spreads return-period floods as expected values; Monte Carlo runs draw random flood years. Mass is conserved: the rows add up to the released mass.</li>
<li><b>Spread map.</b> Terrain comes from the swisstopo profile service on a 50 m grid over a 2.4 km window. Slope uses central differences. The runoff path follows the steepest descent until it meets a stream of the swisstopo VECTOR25 river network, a hollow or the window edge. The terrain direction is a plane fitted within 1 km and is only a stand-in for the groundwater direction you set. Groundwater spread uses the Domenico (1987) continuous plane source without decay: C = C<sub>0</sub>/4 · erfc((x − vt/R)/(2√(α<sub>x</sub>vt/R))) · [erf((y + Y/2)/(2√(α<sub>y</sub>x))) − erf((y − Y/2)/(2√(α<sub>y</sub>x)))] · erf(Z/(2√(α<sub>z</sub>x))), with α<sub>x</sub> = 0.83·(log<sub>10</sub>x)<sup>2.414</sup> m (Xu &amp; Eckstein 1995, as in US EPA BIOSCREEN), α<sub>y</sub> = α<sub>x</sub>/10 and α<sub>z</sub> = α<sub>x</sub>/100. For soil and air releases C<sub>0</sub> is the seepage concentration divided by the DAF, over the source width √A and the DAF mixing depth; it starts at the matrix travel time, and at once for the fast-path share. For direct releases C<sub>0</sub> is the plume concentration over the plume width and mixing thickness. The source is held at its peak, which is cautious. Red marks cells where background plus plume exceeds the chosen standard at the best estimate; amber marks cells where at least 10% of 100 Monte Carlo runs exceed it. Karst is not drawn as a plume. The default erosion is multiplied by S(slope)/S(5%), with the RUSLE slope factor S of McCool et al. (1987), only at a location you set.</li>
<li><b>Forms by phase.</b> Five scenarios change the conditions on top of your inputs (waterlogged: permanently waterlogged soil and an anoxic aquifer; acidified: soil pH −1.5; floods: 1-in-10-year floods; anoxic lake: permanent bottom-water anoxia and many wetlands). The mass budget is rerun for each at the budget year. Topsoil, downslope and floodplain soil keep the non-reactive share in the original form; of the reactive share, θ/(θ + ρ<sub>b</sub>·Kd) is in pore water and the rest on solids. Forms then follow indicative rules from general geochemistry, not fitted to Swiss data: arsenic is mainly As(V) on iron oxides when oxic and As(III) when reducing (As(III) share of solids 5%, 30%, 70% for well drained, periodically and permanently waterlogged soil; of pore water 10%, 50%, 85%), with arsenic sulfides in anoxic sediment; mercury is mainly Hg(II) bound to reduced-sulfur groups of organic matter, with methylmercury at 0.2–3% of soil Hg, 0.4–2% of lake-sediment Hg (Lake Geneva about 0.4%, Lake Maggiore below 2%) and 3–40% of lake-water Hg depending on oxygen and wetlands, and HgS forming in reducing soil and anoxic sediment; lead is mainly bound to organic matter and oxides, with carbonates at pH ≥ 6.5 (20%) or ≥ 7.5 (40%), sulfides under reducing conditions and pyromorphite where phosphate is high. River water passing downstream is split into dissolved and particle-bound with the suspended-matter Kd. Treat the shares as orders of magnitude.</li>
<li><b>Sensitivity.</b> Spearman rank correlation between each sampled input multiplier and the result across the Monte Carlo runs. A value near ±1 means that input alone sets the order of the results; below 0.1 is noise. It ranks inputs within the stated spreads, so entering a measured value narrows that input and shrinks its bar.</li>
<li><b>Uncertainty.</b> ${MC_N} Monte Carlo runs with a fixed seed. Kd varies log-normally with σ = 0.7 log units for Pb and Hg and 0.8 for As (0.3 when you enter a measured Kd); suspended-matter Kd σ 0.5; erosion σ 0.4 log units; hydraulic conductivity σ 0.3 log units; infiltration ±30%; reactive fraction ×0.5–1.5; deposition share ×0.5–2; background ±30%. The bar shows the 5–95% range, the dot the median and the red tick the limit. These spreads are judgement-based and wider than many site studies would find.</li>
</ol>`;

const clone = o => JSON.parse(JSON.stringify(o));
const num = v => (v === "" || v == null) ? 0 : Number(v);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const SUPS = {"-":"⁻","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
// results are screening estimates, often uncertain by a factor of 10: show two significant figures, not more
const NF = new Intl.NumberFormat("en-US", {maximumSignificantDigits:2});
const APP_VERSION = "0.12.3", APP_DATE = "2026-10-31";
function fmt(v){
  if(v == null || isNaN(v)) return "–";
  if(!isFinite(v)) return "∞";
  const a = Math.abs(v);
  if(a === 0) return "0";
  if(a >= 1e7 || a < 1e-3){ const p = v.toExponential(1).split("e"); return p[0] + " × 10" + String(Number(p[1])).split("").map(c => SUPS[c] || c).join(""); }
  return NF.format(v);
}
const fmtYr = t => (!isFinite(t) || t > 1e6) ? "> 1 million" : fmt(t);
function fmtPct(p){
  if(!(p > 0)) return "0%";
  const v = p * 100;
  if(v < 0.01) return "<0.01%";
  if(v >= 99) return v >= 99.9999 ? "100%" : ">99%";
  return fmt(v) + "%";
}
const RANK = {info:0, ok:1, check:2, warn:3, crit:4};
const worse = (a, b) => (a == null || RANK[b] > RANK[a]) ? b : a;

let INP = null, RES = null;
S.adv = false; S.tab = "rel";
const SITE_KEYS = new Set(Object.keys(PRESETS.plateau.v));

function freshInputs(pid){ return Object.assign(clone(BASE), clone(PRESETS[pid].v), {preset:pid}); }
function formOf(){ return FORMS[S.metal].find(f => f.id === INP.form) || FORMS[S.metal][0]; }
function loadExample(refresh){
  const ex = EXAMPLES[S.metal];
  INP = Object.assign(freshInputs(ex.preset), clone(ex.v));
  const f = formOf(); INP.form = f.id; if(ex.v.reactive == null) INP.reactive = f.fr;
  if(refresh !== false){ advMetalChanged(); refreshAll(); saveAdv(); }
}
const KD_SIG = {As:0.8, Pb:0.7, Hg:0.7};
function kdFn(m, p){
  let lg;
  if(m === "As"){
    // semi-empirical, anchored to the Allison & Allison (2005) soil median (log 3.4) at 5 g/kg Fe-ox and pH 7
    lg = 2.77 + 0.9 * Math.log10(Math.max(p.fe, 0.05)) - 0.25 * Math.max(0, p.pH - 7) + 0.1 * Math.max(0, 7 - p.pH) - (p.pHigh ? 0.3 : 0);
    if(p.sp === "III") lg -= 0.7;
    if(p.drain === "periodic") lg -= 0.5; else if(p.drain === "perm") lg -= 1.2;
    if(p.redox === "suboxic") lg -= 0.3; else if(p.redox === "anoxic") lg -= 1.2; else if(p.redox === "sulfidic") lg -= 0.7;
    lg = clamp(lg, 0.3, 4.3);
  } else if(m === "Pb"){
    // published regression: log Kd = 1.99 + 0.42 pH (Carlon et al. 2004)
    lg = 1.99 + 0.42 * p.pH;
    if(p.redox === "sulfidic") lg += 0.5;
    lg = clamp(lg, 0.7, 5.0);
  } else {
    // Hg(II) bound to organic matter: Kd = Koc x foc with log Koc 5.5 (gives the Allison & Allison median, log 3.8, at 2% OC)
    lg = 5.5 + Math.log10(Math.max(p.oc, 0.02) / 100);
    if(p.redox === "sulfidic") lg += 0.5;
    lg = clamp(lg, 2.2, 5.8);
  }
  return Math.pow(10, lg);
}
// Pb solubility in soil solution: about 0.3 mg/L (carbonate control) at pH 7-9, about 10 mg/L (sulfate control) in acidic soil
function pbCap(pH){
  if(pH > 9.5) return 1e5;
  const lg = pH <= 5 ? 4.0 : pH >= 7 ? 2.48 : 4.0 - (pH - 5) / 2 * 1.52;
  return Math.pow(10, lg);
}
const SB_CAP = 5000; // Ca-antimonate solubility, about 4-6 mg/L
// RUSLE slope steepness factor (McCool et al. 1987); default erosion is scaled relative to an assumed 5% slope
function slopeS(pct){ const t = Math.atan(Math.max(0, pct) / 100), s = Math.sin(t); return pct < 9 ? 10.8 * s + 0.03 : 16.8 * s - 0.5; }
const slopeFactor = I => num(I.slope) > 0 ? slopeS(Number(I.slope)) / slopeS(5) : 1;
function erosDefault(I){
  const f = formOf();
  const base = f.site ? 2 : {agri:0.7, garden:0.3, forest:0.05, ind:1}[I.land];
  return base * slopeFactor(I);
}
const erosRate = I => num(I.eros) || erosDefault(I);
const resuspOf = I => I.resusp !== "" && I.resusp != null ? num(I.resusp) : I.medium === "road" ? 0.01 : ({ind:0.05, agri:0.01, garden:0.005, forest:0}[I.land] || 0);
function dafFn(Kmy, i, da, I, L){
  const Ki = Kmy * i;
  const d = Math.min(da, Math.sqrt(0.0112 * L * L) + da * (1 - Math.exp(-(L * I) / (Ki * da))));
  return {d, daf: 1 + Ki * d / (I * L)};
}
// lake bottom-water oxygen: 0 oxic, 1 seasonal anoxia, 2 permanent anoxia (or seasonal anoxia during summer)
const lakeO2Of = I => I.lakeO2 === "auto" ? ({oligo:"oxic", meso:"seasonal", eu:"seasonal"}[I.troph] || "oxic") : I.lakeO2;
function lakeLevel(I, ignoreSeason){
  const b = {oxic:0, seasonal:1, perm:2}[lakeO2Of(I)] || 0;
  if(ignoreSeason || b !== 1 || !I.season || I.season === "year") return b;
  return I.season === "summer" ? 2 : 0;
}
const lakeLabel = I => { const l = lakeLevel(I), base = lakeO2Of(I); return (l === 2 ? (base === "seasonal" ? "anoxic in summer" : "permanently anoxic") : l === 1 ? "seasonally anoxic" : (base === "seasonal" ? "oxic in winter" : "oxic")) + (I.lakeO2 === "auto" ? " (from trophic state)" : ""); };
const SEASON_EVAS = {year:1, summer:2, winter:2 / 7};   // 5 summer months ×2 and 7 winter months ×2/7 average to 1
function methylIndex(I){
  let s = [0, 3, 4][lakeLevel(I)] + ({oligo:0, meso:0.5, eu:1}[I.troph] || 0);
  s += {none:0, some:1, many:2}[I.wet];
  s += I.doc > 5 ? 1.5 : I.doc >= 2 ? 1 : 0;
  s += I.lpH < 6 ? 1.5 : I.lpH < 7.5 ? 0.5 : 0;
  s += {low:0, mod:1, high:0.5}[I.so4];
  return Math.min(10, s);
}
function soilStatus(m, Cs, land){
  const rem = land === "garden" ? LIM.remGarden[m] : land === "agri" ? LIM.remAgri[m] : null;
  const trig = (land === "agri" || land === "garden") ? LIM.trigger[m] : null;
  const guide = LIM.guide[m];
  const useTxt = land === "garden" ? "gardens and playgrounds" : "agriculture";
  if(rem && Cs > rem) return ["crit","Exceeds remediation value", `AltlV Annex 3 remediation value for ${useTxt}: ${rem} mg/kg`];
  if(trig && Cs > trig) return ["warn","Above trigger value", `VBBo trigger value for food and fodder crops: ${trig} mg/kg`];
  if(guide && Cs > guide) return ["warn","Above guide value", `VBBo guide value: ${guide} mg/kg`];
  const refs = [guide ? `guide ${guide}` : null, trig ? `trigger ${trig}` : null, rem ? `remediation ${rem}` : null].filter(Boolean);
  if(!refs.length) return ["info","No Swiss value", m === "As" ? "No VBBo value for As; the AltlV value (50 mg/kg) covers only gardens and playgrounds" : "No Swiss soil value for this land use"];
  return ["ok","Below Swiss values", "Swiss values (mg/kg): " + refs.join(", ")];
}

const ONES = {kd:1, kdAq:1, kdSS:1, infil:1, react:1, eros:1, K:1, fdep:1, bg:1, evas:1};
const MC_N = 400;
function core(I, m, u){
  const form = formOf(), sp = form.sp || "V", o = {};
  const q = I.precip / 1000 * I.infil / 100 * u.infil;
  const Kmy = I.K * YEAR_S * u.K, qAq = Kmy * I.grad, H = I.horizon;
  const pHigh = I.pstat === "high";
  const kdUser = num(I.kdSoil);
  o.kdCalc = kdFn(m, {pH:I.pH, oc:I.oc, fe:I.fe, pHigh, sp, drain:I.drain});
  const Kd = (kdUser || o.kdCalc) * u.kd;
  const kdSub = (kdUser || kdFn(m, {pH:I.pH, oc:I.oc * 0.3, fe:I.fe, pHigh, sp, drain:I.drain})) * u.kd;
  o.kdAqCalc = kdFn(m, {pH:I.gwpH, oc:I.aqOC, fe:I.aqFe, sp, redox:I.redox});
  const kdAq = (num(I.kdAq) || o.kdAqCalc) * u.kdAq;
  const kdSS = (num(I.kdSS) || KDSS[m]) * u.kdSS;
  let Q = I.Q, ssc = I.ssc;
  if(S.water === "melt"){ Q *= 2; ssc *= 3; } else if(S.water === "storm"){ Q *= 5; ssc *= 10; }
  const fd = 1 / (1 + kdSS * ssc * 1e-6);
  Object.assign(o, {q, Kmy, qAq, H, Kd, kdSub, kdAq, kdSS, Q, ssc, fd});

  if(soilLike(I)){
    const air = I.medium === "air", road = I.medium === "road";
    const A = air ? I.footprint * 1e6 : road ? Math.max(1, num(I.roadL)) * 2 * ROAD_STRIP : I.area;
    let share = 1;
    if(air){
      // calculated deposition, or your share in the footprint with the calculated split between land surfaces
      const sh = airShares(I, m, u.fdep), own = I.fdep !== "" && I.fdep != null;
      o.airScale = own && sh.loc > 0 ? Math.min(1, num(I.fdep) / 100 * u.fdep) / sh.loc : 1;
      share = Math.min(1, sh.sAs * o.airScale); o.air = sh; o.airOwn = own;
      const pk = airPeak(I, sh);
      o.depMaxF = pk.dep.dep * o.airScale; o.depX = pk.dep.x; o.airPM = pk.air.cPM; o.airGasC = pk.air.cGas; o.airX = pk.air.x;
    } else if(road){ o.road = roadShares(I, u.fdep); share = o.road.strip; }
    const d = I.depthMix / 100, Ms = d * I.rhob * 1000, fr = Math.min(1, I.reactive / 100 * u.react);
    const E = erosRate(I) * u.eros * 0.1;                       // kg/(m2 yr)
    const kE = E * I.er / Ms;
    // Hg⁰ emission from the topsoil, proportional to its Hg content; dust blown off bare ground (the part leaving the area)
    const kEv = m === "Hg" ? num(I.hgSoilF) * 8766e-6 / (I.rhob * 1000 * d) * ({hg0:10, hgs:0.1}[I.form] || 1) * (u.evas || 1) : 0;
    const kRs = resuspOf(I) / 100 * RESUSP_EXPORT;
    const kL = fr * q / (d * (I.theta + I.rhob * Kd)), kO = I.loss / 100, k = kL + kO + kE + kEv + kRs;
    o.kEv = kEv; o.kRs = kRs;
    let J = 0, Speak, SH, tPeak;
    const acc = (J0, kk, t) => kk > 0 ? J0 / kk * (1 - Math.exp(-kk * t)) : J0 * t;
    if(I.pattern === "pulse"){
      const S0 = I.amount * 1e6 * share / A; Speak = S0; tPeak = 0; SH = S0 * Math.exp(-k * H);
    } else {
      J = I.amount * 1e6 * share / A; tPeak = Math.min(I.duration, H); Speak = acc(J, k, tPeak);
      SH = I.duration >= H ? acc(J, k, H) : acc(J, k, I.duration) * Math.exp(-k * (H - I.duration));
    }
    const bg = I.bg[m] * u.bg, dC = Speak / Ms, dCH = SH / Ms, Ctot = bg + dC;
    const den = Kd + I.theta / I.rhob;
    let cwAdd = fr * dC / den * 1000, cwBg = I.bgReactive / 100 * bg / den * 1000, capped = false, cap = null;
    if(m === "Pb"){ cap = pbCap(I.pH); if(cwAdd + cwBg > cap){ const s = cap / (cwAdd + cwBg); cwAdd *= s; cwBg *= s; capped = true; } }
    const cw = cwAdd + cwBg;
    const leachKg = q * cwAdd * A / 1e6;
    const Lz = Math.max(0, I.wt - d), Rv = 1 + I.rhob * kdSub / I.theta, tArr = Lz * I.theta * Rv / q;
    const D = dafFn(Kmy, I.grad, I.thick, q, Math.sqrt(A));
    const cgw = I.bgGw[m] * u.bg + cwAdd / D.daf;
    const erosKg = Ctot * E * I.er * A * (I.sdr / 100) * 1e-6;
    const rivTot = erosKg * 1e9 / (Q * YEAR_S * 1000);
    const rivD = I.bgRiv[m] * u.bg + rivTot * fd;
    const dose = I.land === "garden" ? Ctot * I.ir * I.rba / 100 / I.bw : NaN;
    if(air){ o.depMax = (I.pattern === "pulse" ? I.amount * 1e6 : I.amount * 1e9 / 365) * o.depMaxF; }
    Object.assign(o, {A, share, d, Ms, fr, E, kE, kL, kO, k, J, Speak, SH, tPeak, bg, dC, dCH, Ctot, cwAdd, cwBg, cw, cap, capped,
      leachKg, Lz, Rv, tArr, D, cgw, erosKg, rivTot, rivD, dose, half: k > 0 ? Math.LN2 / k : Infinity, dep: J * 1000 / 365});
    if(m === "Pb" && I.form === "pbm" && I.medium === "soil"){
      const kdSb = I.kdSb * u.kd, frSb = Math.min(1, I.sbMobile / 100 * u.react), rel = I.sbShare / 100;
      const kLs = frSb * q / (d * (I.theta + I.rhob * kdSb)), ks = kLs + kO + kE;
      const Ss = I.pattern === "pulse" ? I.amount * 1e6 * share * rel / A : acc(J * rel, ks, Math.min(I.duration, H));
      const sbC = Ss / Ms;
      let sbCw = frSb * sbC / (kdSb + I.theta / I.rhob) * 1000, sbCapped = false;
      if(sbCw > SB_CAP){ sbCw = SB_CAP; sbCapped = true; }
      const Rs = 1 + I.rhob * kdSb / I.theta, tSb = Lz * I.theta * Rs / q;
      o.sb = {sbC, sbCw, sbCapped, tSb, sbGw: sbCw / D.daf, half: ks > 0 ? Math.LN2 / ks : Infinity};
    }
  } else if(I.medium === "gw"){
    const b = Math.min(I.gwThick, I.thick), flowL = qAq * I.gwWidth * b * 1000;
    const cAdd = I.amount * 1e9 / flowL, cgw = I.bgGw[m] * u.bg + cAdd;
    const porous = I.aq === "porous", Raq = porous ? 1 + 1.8 * kdAq / I.ne : 1, v = qAq / I.ne, tW = I.wellDist * Raq / v;
    Object.assign(o, {b, flowL, cAdd, cgw, porous, Raq, v, tW});
  } else {
    const cTot = I.amount * 1e9 / (Q * YEAR_S * 1000), cD = I.bgRiv[m] * u.bg + cTot * fd;
    Object.assign(o, {cTot, cD, sedKg: I.amount * (1 - fd) * (I.lakeTau > 0 ? I.trapEff / 100 : 0)});
  }
  return o;
}
function rng(seed){
  return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function gauss(r){ let a = 0; while(a === 0) a = r(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * r()); }
function monteCarlo(m){
  const r = rng(20261026), r2 = rng(20261028), out = [];
  const sKd = num(INP.kdSoil) ? 0.3 : KD_SIG[m], sAq = num(INP.kdAq) ? 0.3 : KD_SIG[m], sSS = num(INP.kdSS) ? 0.3 : 0.5;
  for(let i = 0; i < MC_N; i++){
    const u = {
      kd: Math.pow(10, sKd * gauss(r)), kdAq: Math.pow(10, sAq * gauss(r)), kdSS: Math.pow(10, sSS * gauss(r)),
      infil: 0.7 + 0.6 * r(), react: 0.5 + r(), eros: Math.pow(10, 0.4 * gauss(r)), K: Math.pow(10, 0.3 * gauss(r)),
      fdep: Math.pow(2, 2 * r() - 1), bg: 0.7 + 0.6 * r()
    };
    u.evas = Math.pow(10, 0.5 * gauss(r2));
    const o = core(INP, m, u); o.u = u; out.push(o);
  }
  return out;
}
function stat(arr, f, lim){
  const v = arr.map(f).filter(x => typeof x === "number" && isFinite(x)).sort((a, b) => a - b);
  if(!v.length) return null;
  const qq = p => v[Math.min(v.length - 1, Math.round(p * (v.length - 1)))];
  return {p5:qq(0.05), p50:qq(0.5), p95:qq(0.95), pex: lim != null ? v.filter(x => x > lim).length / v.length : null, lim};
}
function soilLimFor(m, land){
  const rem = land === "garden" ? LIM.remGarden[m] : land === "agri" ? LIM.remAgri[m] : null;
  return rem || ((land === "agri" || land === "garden") ? LIM.trigger[m] : null) || LIM.guide[m] || null;
}

/* ================= AIR AND LAND SURFACE =================
   Screening rules between a release to air (or a road) and soil, water and air: deposition by size class and weather,
   wind direction, forests, snow, sealed surfaces, re-emission. All are documented in the methods and the assumptions page. */
// size and phase classes: dry deposition velocity over open land (vd) and forest (vdF) in cm/s, settling velocity vs in cm/s,
// below-cloud washout W in 1/s per mm/h of rain (US EPA HHRAP example values)
const AIR_CLS = [
  {k:"gas0", label:"Hg⁰ gas", vd:0, vdF:0.06, vs:0, W:0},
  {k:"rgm", label:"Hg(II) gas", vd:1.0, vdF:1.7, vs:0, W:3e-4},
  {k:"fine", label:"Fine particles (< 2.5 µm)", vd:0.1, vdF:0.3, vs:0, W:6e-5},
  {k:"coarse", label:"Coarse particles (2.5–10 µm)", vd:0.5, vdF:1.5, vs:0.18, W:3e-4},
  {k:"large", label:"Large dust (> 10 µm)", vd:3.5, vdF:4.0, vs:3.2, W:6.7e-4}
];
// default mass split of an emission by chemical form, % of [Hg⁰ gas, Hg(II) gas, fine, coarse, large]
const AIR_SPLIT = {asV:[0, 0, 70, 25, 5], asIII:[0, 0, 70, 25, 5], as2o3:[0, 0, 80, 15, 5], aspy:[0, 0, 10, 40, 50], cca:[0, 0, 70, 25, 5],
  hg2:[20, 60, 20, 0, 0], hgsed:[0, 0, 10, 40, 50], hg0:[100, 0, 0, 0, 0], hgs:[0, 0, 10, 40, 50],
  pb2:[0, 0, 70, 25, 5], pbo:[0, 0, 60, 30, 10], pbm:[0, 0, 5, 25, 70], pbash:[0, 0, 90, 10, 0], pbs:[0, 0, 10, 40, 50]};
const SPLIT_KEYS = ["pGas0", "pRgm", "pFine", "pCoarse", "pLarge"];
const AIR_HMIX = 700, R_FAR = 50000, RESUSP_EXPORT = 0.3, ROAD_STRIP = 5, ROAD_NEAR = 0.75, ROAD_RESUSP = 0.3;
const airSplitDef = I => AIR_SPLIT[I.form] || [0, 0, 60, 30, 10];
function airSplit(I){
  const def = airSplitDef(I), own = SPLIT_KEYS.some(k => I[k] !== "" && I[k] != null);
  const v = own ? SPLIT_KEYS.map(k => Math.max(0, num(I[k]))) : def.slice();
  if(S.metal !== "Hg"){ v[0] = 0; v[1] = 0; }
  const s = v.reduce((a, b) => a + b, 0) || 1;
  return v.map(x => x / s);
}
const sigZ = x => 0.06 * x / Math.sqrt(1 + 0.0015 * x);                 // Briggs (1973), open country, neutral (class D)
const AIR_R = (() => { const r = [0]; for(let i = 0; i <= 160; i++) r.push(5 * Math.pow(R_FAR / 5, i / 160)); return r; })();   // ring edges: 0, 5 m … 50 km
const landShares = I => {
  const fF = I.forestShare === "" || I.forestShare == null ? (I.land === "forest" ? 1 : 0.3) : clamp(num(I.forestShare) / 100, 0, 1);
  const fS = I.sealedShare === "" || I.sealedShare == null ? (I.land === "ind" ? 0.5 : I.land === "garden" ? 0.3 : 0.05) : clamp(num(I.sealedShare) / 100, 0, 1);
  return {fF, fS:Math.min(fS, 1 - fF), fO:Math.max(0, 1 - fF - Math.min(fS, 1 - fF))};
};
// deposition profile: for each class, the fraction of the release deposited dry and wet in each ring, and what is left airborne
function airProfile(I, uf, opt){
  const H = opt && opt.H != null ? opt.H : Math.max(0, num(I.stackH)), u = Math.max(0.3, num(I.windU) || 2.5), x0 = opt && opt.x0 || 0;
  const rain = Math.max(0, num(I.precip)) / 8766, {fF} = landShares(I), split = opt && opt.split || airSplit(I);
  return AIR_CLS.map((c, ci) => {
    const w = split[ci], vdm = ((1 - fF) * c.vd + fF * c.vdF) / 100 * uf, kw = c.W * rain * uf / u, n = AIR_R.length;
    const dry = new Float64Array(n), wet = new Float64Array(n), M = new Float64Array(n), G = new Float64Array(n);
    let m = 1; M[0] = 1;
    for(let j = 1; j < n; j++){
      const a = Math.max(AIR_R[j - 1], x0), b = AIR_R[j];
      if(b <= x0 || !(w > 0)){ M[j] = m; continue; }
      const x = a > 0 ? Math.sqrt(a * b) : b / 2, sz = sigZ(x), He = Math.max(0, H - c.vs / 100 * x / u);
      const g = sz >= 0.8 * AIR_HMIX ? 1 / AIR_HMIX : Math.sqrt(2 / Math.PI) * Math.exp(-He * He / (2 * sz * sz)) / sz;
      const kd = vdm * g / u, k = kd + kw, loss = k > 0 ? m * (1 - Math.exp(-k * (b - a))) : 0;
      if(loss > 0){ dry[j] = loss * kd / k; wet[j] = loss * kw / k; }
      m -= loss; M[j] = m; G[j] = g;
    }
    return {c, w, dry, wet, M, G, vdm};
  });
}
// part of ring sums out to radius R (linear within the ring that contains R)
function ringSum(arr, R){
  let s = 0;
  for(let j = 1; j < AIR_R.length; j++){
    const a = AIR_R[j - 1], b = AIR_R[j];
    if(b <= R) s += arr[j]; else { if(R > a) s += arr[j] * (R - a) / (b - a); break; }
  }
  return s;
}
// angular density of wind directions (per radian) towards bearing az (deg), with a share p from the prevailing direction (±45°)
function windDens(I, az){
  if(I.windFrom === "" || I.windFrom == null) return 1 / (2 * Math.PI);
  const p = clamp(num(I.windShare) / 100, 0, 1), down = (Number(I.windFrom) + 180) % 360;
  const d = Math.abs(((az - down) % 360 + 540) % 360 - 180);
  return (1 - p) / (2 * Math.PI) + (d <= 45 ? p / (Math.PI / 2) : 0);
}
const windMax = I => windDens(I, I.windFrom === "" || I.windFrom == null ? 0 : (Number(I.windFrom) + 180) % 360);
/* snow cover from elevation: Hydrological Atlas of Switzerland plate 3.6 regressions, shortened for the current climate (Klein et al. 2016) */
function snowSeason(I){
  const h = Math.max(0, num(I.elev));
  const D = I.snowDays === "" || I.snowDays == null ? clamp(0.1138 * h - 32, 0, 365) : clamp(num(I.snowDays), 0, 365);
  const perennial = D >= 335, frac = new Array(12).fill(0), mdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let meltMo = -1;
  if(D > 0){
    const c = (243 + 0.0183 * h + 134.9) % 365, s = c - D / 2, e = c + D / 2;
    let d0 = 0;
    for(let mo = 0; mo < 12; mo++){
      const d1 = d0 + mdays[mo];
      let ov = 0; for(const sh of [-365, 0, 365]) ov += Math.max(0, Math.min(d1, e + sh) - Math.max(d0, s + sh));
      frac[mo] = perennial ? 1 : Math.min(1, ov / mdays[mo]); d0 = d1;
    }
    const ed = ((e % 365) + 365) % 365; let acc = 0; for(let mo = 0; mo < 12; mo++){ acc += mdays[mo]; if(ed < acc){ meltMo = mo; break; } }
  }
  return {D, frac, meltMo: perennial ? -1 : meltMo, perennial, f:D / 365};
}
const snowReemOf = (I, m) => m === "Hg" ? clamp(num(I.snowReem) / 100, 0, 1) : 0;
/* drainage of sealed surfaces and road runoff (Steiner & Hermann 2023 for FOEN) and the share each route retains */
const DRAIN = {
  motorway:{label:"Motorway outside towns", r:{direct:37, shoulder:2.8, oil:41, saba:19, wwtp:0}},
  rural:{label:"Road outside towns", r:{direct:60, shoulder:17, oil:0, saba:13, wwtp:10}},
  urban:{label:"In towns: streets, squares and roofs", r:{direct:40, shoulder:1, oil:0, saba:4, wwtp:55}}
};
const RETAIN = {direct:0.15, shoulder:1, oil:0.3, saba:0.9, wwtp:0.7};
function drainSplit(I){
  const r = (DRAIN[I.drainSys] || DRAIN.urban).r, tot = Object.values(r).reduce((a, b) => a + b, 0) || 1;
  let soil = r.shoulder / tot, treat = 0, water = 0;
  for(const k of ["direct", "oil", "saba", "wwtp"]){ treat += r[k] / tot * RETAIN[k]; water += r[k] / tot * (1 - RETAIN[k]); }
  return {soil, treat, water};
}
/* road traffic as a line source: emission factor × traffic, then road surface, roadside strip and air */
const ROAD_EF = {today:{Pb:0.076}, leaded:{Pb:10}};          // mg per car-kilometre; heavy vehicles count ×4 (assumption)
const ROAD_SPLIT = {today:{road:0.4, side:0.5, air:0.1}, leaded:{road:0.2, side:0.3, air:0.5}};
const roadEF = (I, m) => I.efRoad !== "" && I.efRoad != null ? num(I.efRoad) : ((ROAD_EF[I.roadEra] || ROAD_EF.today)[m] || 0);
const roadRate = (I, m) => num(I.aadt) * 365 * num(I.roadL) / 1000 * roadEF(I, m) * (1 + 3 * clamp(num(I.hgv), 0, 100) / 100) * 1e-6;
function roadShares(I, uf){
  const sp = ROAD_SPLIT[I.roadEra] || ROAD_SPLIT.today, dr = drainSplit(I);
  const wash = sp.road * (1 - ROAD_RESUSP);
  const toStrip = (sp.side + sp.road * ROAD_RESUSP) * ROAD_NEAR + wash * dr.soil;
  const nearOut = (sp.side + sp.road * ROAD_RESUSP) * (1 - ROAD_NEAR);
  const prof = airProfile(I, uf, {H:1, x0:25, split:[0, 0, 1, 0, 0]})[2];
  const airDep = sp.air * (1 - prof.M[prof.M.length - 1]);
  return {strip:toStrip, regDep:nearOut + airDep, treat:wash * dr.treat, water:wash * dr.water, far:sp.air - airDep, sp, dr};
}
/* glacier melt releasing metal deposited in the 1950s–1980s */
const glacierRate = (I, m) => num(I.glArea) * num(I.glLoss) * num(I.glConc[m]) * clamp(num(I.glShare), 0, 100) / 100;
const riverLike = I => I.medium === "river" || I.medium === "glacier";
// release rate for releases that are calculated from other inputs
function applyDerived(I){
  if(!I) return;
  if(I.medium === "road"){ I.amount = Number(roadRate(I, S.metal).toPrecision(4)); I.pattern = "continuous"; }
  else if(I.medium === "glacier") I.amount = Number(glacierRate(I, S.metal).toPrecision(4));
}
/* where an air release goes: shares of the emission, by surface and process */
function airShares(I, m, uf){
  const prof = airProfile(I, uf), R = Math.sqrt(Math.max(1e-6, num(I.footprint)) * 1e6 / Math.PI), ls = landShares(I), sn = snowSeason(I), re = snowReemOf(I, m);
  const out = {R, loc:0, dryLoc:0, wetLoc:0, reg:0, far:0, open:0, forest:0, foliar:0, sealed:0, gasFar:0, cls:[], sn, ls, prof};
  let dens = 0;                                     // deposition per m² of the assessed land use, relative to release ÷ footprint area
  const forestLand = I.land === "forest";
  prof.forEach(p => {
    const ld = ringSum(p.dry, R) * p.w, lw = ringSum(p.wet, R) * p.w, tot = (1 - p.M[p.M.length - 1]) * p.w;
    const vdm = (1 - ls.fF) * p.c.vd + ls.fF * p.c.vdF;
    const fOpen = vdm > 0 ? (1 - ls.fF) * p.c.vd / vdm : 0, fFor = vdm > 0 ? ls.fF * p.c.vdF / vdm : 0;
    const dOpen = ld * fOpen, dFor = ld * fFor;
    out.loc += ld + lw; out.dryLoc += ld; out.wetLoc += lw; out.reg += tot - ld - lw; out.far += p.M[p.M.length - 1] * p.w;
    if(p.c.k === "gas0"){ out.foliar += dFor; out.gasFar += p.M[p.M.length - 1] * p.w; }
    else { out.forest += dFor + lw * ls.fF; out.open += dOpen * (ls.fO / Math.max(1e-12, ls.fO + ls.fS)) + lw * ls.fO; out.sealed += dOpen * (ls.fS / Math.max(1e-12, ls.fO + ls.fS)) + lw * ls.fS; }
    const dSurf = forestLand ? (vdm > 0 ? ld * p.c.vdF / vdm : 0) : (vdm > 0 ? ld * p.c.vd / vdm : 0);
    const snowLoss = p.c.k === "gas0" ? 0 : (sn.perennial ? 1 : sn.f * (re + (1 - re) * num(I.snowRun) / 100));
    dens += dSurf * (1 - snowLoss) + lw * (1 - snowLoss);
    out.cls.push({k:p.c.k, label:p.c.label, w:p.w, loc:ld + lw, dry:ld, wet:lw, far:p.M[p.M.length - 1] * p.w});
  });
  out.sAs = dens;
  return out;
}
// deposition per m² at distance x along the most exposed direction, and the added air concentration there (per kg/yr released)
function airPoint(I, sh, x, open){
  const rho = windMax(I), u = Math.max(0.3, num(I.windU) || 2.5);
  let j = 1; while(j < AIR_R.length - 1 && AIR_R[j] < x) j++;
  const a = AIR_R[j - 1], b = AIR_R[j], rm = a > 0 ? Math.sqrt(a * b) : b / 2;
  let dep = 0, cPM = 0, cGas = 0;
  sh.prof.forEach(p => {
    const vdm = p.vdm > 0 ? p.vdm : 0, vs = open ? p.c.vd : p.c.vdF, ratio = vdm > 0 ? vs / ((1 - sh.ls.fF) * p.c.vd + sh.ls.fF * p.c.vdF) : 0;
    dep += p.w * (p.dry[j] * ratio + p.wet[j]) * rho / (rm * (b - a));
    const conc = p.w * p.M[j] * p.G[j] * rho / (u * rm);       // per (kg/s) released, kg/m³
    if(p.c.k === "fine" || p.c.k === "coarse") cPM += conc; else if(p.c.k !== "large") cGas += conc;
  });
  const perKgYr = 1 / YEAR_S;
  return {dep, cPM:cPM * perKgYr * 1e12, cGas:cGas * perKgYr * 1e12};     // dep: fraction per m² per yr; air in ng/m³ per kg/yr
}
// most exposed point beyond 100 m (outside the plant site): highest deposition on open land and highest air concentration
function airPeak(I, sh){
  let best = {x:0, dep:0}, bestC = {x:0, cPM:0, cGas:0};
  for(let j = 1; j < AIR_R.length; j++){
    const x = Math.sqrt(Math.max(AIR_R[j - 1], 1) * AIR_R[j]); if(x < 100) continue;     // outside the plant site
    const p = airPoint(I, sh, x, true);
    if(p.dep > best.dep) best = {x, dep:p.dep};
    if(p.cPM + p.cGas > bestC.cPM + bestC.cGas) bestC = {x, cPM:p.cPM, cGas:p.cGas};
  }
  return {dep:best, air:bestC};
}
/* NABEL background (BAFU/Empa, annual means 2024): Pb in PM10 (ng/m³) and in dust deposition (µg/m²/d); Hg⁰ (ng/m³, Osterwalder et al. 2024) */
const NABEL = [
  {c:"BER", n:"Bern-Bollwerk", t:"urban, traffic", E:2600170, N:1199990, h:536, pbPM:1.5, pbDep:4.5, hg:1.27},
  {c:"LAU", n:"Lausanne-César-Roux", t:"urban, traffic", E:2538690, N:1152615, h:530, pbPM:1.0, pbDep:8.9, hg:1.38},
  {c:"LUG", n:"Lugano-Università", t:"urban", E:2717610, N:1096645, h:280, pbPM:1.9, pbDep:null, hg:1.30},
  {c:"ZUE", n:"Zürich-Kaserne", t:"urban", E:2682450, N:1247990, h:409, pbPM:1.5, pbDep:2.7, hg:1.51},
  {c:"BAS", n:"Basel-Binningen", t:"suburban", E:2610890, N:1265605, h:316, pbPM:2.0, pbDep:2.8, hg:1.40},
  {c:"DUE", n:"Dübendorf-Empa", t:"suburban", E:2688675, N:1250900, h:432, pbPM:1.3, pbDep:null, hg:1.35},
  {c:"HAE", n:"Härkingen-A1", t:"rural, motorway", E:2628875, N:1240180, h:431, pbPM:1.9, pbDep:2.4, hg:1.47},
  {c:"SIO", n:"Sion-Aéroport-A9", t:"rural, motorway", E:2592545, N:1118745, h:483, pbPM:2.5, pbDep:null, hg:1.42},
  {c:"MAG", n:"Magadino-Cadenazzo", t:"rural", E:2715500, N:1113195, h:203, pbPM:1.5, pbDep:3.4, hg:1.25},
  {c:"PAY", n:"Payerne", t:"rural", E:2562285, N:1184775, h:489, pbPM:0.9, pbDep:1.2, hg:1.27},
  {c:"TAE", n:"Tänikon", t:"rural", E:2710500, N:1259810, h:538, pbPM:1.2, pbDep:null, hg:1.30},
  {c:"BRM", n:"Beromünster", t:"rural", E:2655840, N:1226780, h:797, pbPM:1.6, pbDep:null, hg:1.29},
  {c:"CHA", n:"Chaumont", t:"rural, above 1000 m", E:2565085, N:1211040, h:1136, pbPM:0.6, pbDep:null, hg:1.34},
  {c:"RIG", n:"Rigi-Seebodenalp", t:"rural, above 1000 m", E:2677835, N:1213440, h:1031, pbPM:1.2, pbDep:1.6, hg:1.21},
  {c:"DAV", n:"Davos-Seehornwald", t:"rural, above 1000 m", E:2784455, N:1187735, h:1637, pbPM:null, pbDep:null, hg:1.16},
  {c:"JUN", n:"Jungfraujoch", t:"high Alpine", E:2641910, N:1155280, h:3580, pbPM:0.1, pbDep:null, hg:1.35}
];
const HG_WETDEP = 5 / 365;                       // µg/m²/d: about 5 µg/m²/yr (Schauinsland near Basel 8.1 in 2024; German background 3–8)
function nabelFor(I, key){
  const s = srcOf(), urban = I.land === "ind" || I.land === "garden";
  const pool = NABEL.filter(st => st[key] != null && (urban ? true : !/traffic/.test(st.t)) && (num(I.elev) > 900 || st.h < 1500));
  let best = null, bd = Infinity;
  pool.forEach(st => { const d = Math.hypot(st.E - s.E, st.N - s.N) + (num(I.elev) > 900 && st.h < 900 ? 3e4 : 0); if(d < bd){ bd = d; best = st; } });
  return best ? {st:best, km:bd / 1000} : null;
}
// background deposition (µg/m²/d) and air (ng/m³) for the metal, with where it comes from
function bgAirOf(I, m){
  const own = v => v !== "" && v != null && isFinite(Number(v));
  const dep = own(I.bgDep[m]) ? {v:num(I.bgDep[m]), src:"your value"} : m === "Pb" ? (n => n ? {v:n.st.pbDep, src:`NABEL ${n.st.n} (${n.st.t}), 2024`} : null)(nabelFor(I, "pbDep")) : m === "Hg" ? {v:HG_WETDEP, src:"wet deposition about 5 µg/m²/yr (Schauinsland and German background stations)"} : null;
  const air = own(I.bgAir[m]) ? {v:num(I.bgAir[m]), src:"your value"} : m === "Pb" ? (n => n ? {v:n.st.pbPM, src:`NABEL ${n.st.n}, Pb in PM10, 2024`} : null)(nabelFor(I, "pbPM")) : m === "Hg" ? (n => n ? {v:n.st.hg, src:`gaseous Hg at NABEL ${n.st.n} (Osterwalder et al. 2024)`} : null)(nabelFor(I, "hg")) : null;
  return {dep, air};
}
// air limits for comparison: LRV Pb in PM10; EU target value for As in PM10; WHO guideline for inorganic Hg vapour
const AIR_LIM = {Pb:{v:500, txt:"LRV limit for Pb in PM10: 500 ng/m³, annual mean"}, As:{v:6, txt:"EU target value for As in PM10: 6 ng/m³ (no Swiss limit)"}, Hg:{v:1000, txt:"WHO guideline for inorganic Hg vapour: 1 µg/m³, annual mean (no Swiss limit)"}};

/* ---------- mass budget: where the released kilograms are after T years ---------- */
const BUD = [
  {k:"top", label:"Topsoil at the source"},
  {k:"snow", label:"In snowpack, firn or glacier ice"},
  {k:"litter", label:"In tree leaves (Hg⁰ uptake), falling with the litter"},
  {k:"down", label:"Washed downslope, still in soil"},
  {k:"fp", label:"Floodplain soil (flood deposits)"},
  {k:"regDep", label:"Deposited outside the footprint or roadside strip"},
  {k:"sub", label:"Below the root zone, not yet in groundwater"},
  {k:"gwD", label:"Groundwater, dissolved"},
  {k:"gwS", label:"Groundwater, held on aquifer sediment"},
  {k:"lakeW", label:"Lake water"},
  {k:"sed", label:"Lake sediment"},
  {k:"out", label:"Carried downstream past the lake"},
  {k:"treat", label:"Caught in road-runoff treatment, drains or sewage sludge"},
  {k:"air", label:"Carried further than 50 km in air"},
  {k:"evas", label:"Escaped from lake water as Hg⁰ gas"},
  {k:"reEm", label:"Re-emitted to air from soil and snow (Hg⁰)"},
  {k:"rem", label:"Other losses you set (e.g. crop offtake)"}
];
const BUD_T = [1, 5, 10, 25, 50, 100];
const FLOODS = {
  none:{label:"No floods", rp:0},
  once:{label:"One extreme flood in year 1", rp:0},
  rp30:{label:"Extreme floods about every 30 years", rp:30},
  rp10:{label:"Extreme floods about every 10 years (more extremes)", rp:10}
};
// Flood events as {t, w}: best estimate spreads each return-period flood over its years (w = 1/RP);
// with a random generator r, each year floods with probability 1/RP (w = 1).
function floodPlan(kind, T, r){
  const ev = [], f = FLOODS[kind];
  if(kind === "once"){ if(T >= 0.5) ev.push({t:0.5, w:1}); }
  else if(f && f.rp){ const p = 1 / f.rp; for(let y = 0; y + 0.5 <= T; y++){ if(r){ if(r() < p) ev.push({t:y + 0.5, w:1}); } else ev.push({t:y + 0.5, w:p}); } }
  return ev;
}
function budget(I, m, u, T, ev, snapT){
  const o = core(I, m, u), dt = 1 / 12, n = Math.max(1, Math.round(T / dt));
  const series = [], snaps = (snapT || []).slice().sort((a, b) => a - b); let si = 0;
  const B = {}; BUD.forEach(b => { B[b.k] = 0; });
  const porous = I.aq === "porous", soil = soilLike(I), air = I.medium === "air";
  const Raq = porous ? 1 + 1.8 * o.kdAq / I.ne : 1, vel = o.qAq / I.ne;
  const tGR = vel > 0 ? I.rivDist * Raq / vel : Infinity;
  const fdB = 1 / (1 + o.kdSS * I.ssc * 1e-6), fdF = 1 / (1 + o.kdSS * I.ssc * 10 * 1e-6);
  const lake = I.lakeTau > 0, trap = lake ? I.trapEff / 100 : 0, tau = I.lakeTau;
  // sunlight turns Hg(II) into Hg⁰ gas that escapes: summer rate May–September, winter rate otherwise (annual mean = the input)
  const kEv0 = lake && m === "Hg" ? (I.hgEvas || 0) / 100 : 0;
  const road = I.medium === "road", sh = air ? o.air : null, rs = road ? o.road : null, sn = air ? sh.sn : null, reS = snowReemOf(I, m), dsp = drainSplit(I);
  // with your own footprint share, the difference is taken from (or given to) the regional and far shares
  const sc = air ? o.airScale : 1, locA = air ? sh.loc * sc : 0, dLoc = air ? sh.loc - locA : 0;
  const regA = air ? Math.max(0, sh.reg + dLoc) : 0, farA = air ? Math.max(0, sh.far + Math.min(0, sh.reg + dLoc)) : 0;
  const gasFarA = air && sh.far > 0 ? sh.gasFar * farA / sh.far : 0;
  let Wsn = 0, Cl = 0, airGas = 0;
  const fast = soil ? (porous ? I.fastShare / 100 : 1) : 0;
  const tArr = soil ? o.tArr : 0, k = soil ? o.k : 0;
  const dA = Math.round(tArr / dt), dR = Math.round(tGR / dt);
  const pulse = soil && I.pattern === "pulse";
  const gwIn = new Float64Array(n), evAt = new Map();
  ev.forEach(e => { const i = Math.min(n - 1, Math.floor(e.t / dt)); evAt.set(i, (evAt.get(i) || 0) + e.w); });
  const route = (load, flood) => {               // particles settle or pass on; returns the dissolved part
    if(!(load > 0)) return 0;
    const fd = flood ? fdF : fdB; let p = load * (1 - fd);
    if(flood){ const f = p * I.floodPlain / 100; B.fp += f; p -= f; }
    B.sed += p * trap; B.out += p * (1 - trap);
    return load * fd;
  };
  let S = 0, W = 0, rel = 0, cumLeach = 0, cumIn = 0, cumOut = 0, nEv = 0;
  for(let i = 0; i < n; i++){
    const t0 = i * dt;
    let relStep, rIn = 0, rFlood = 0;
    if(soil) relStep = pulse ? (i === 0 ? I.amount : 0) : (t0 < I.duration ? I.amount * Math.min(dt, I.duration - t0) : 0);
    else relStep = I.amount * dt;
    rel += relStep;
    if(soil){
      let toSoil = relStep;
      if(air){
        const mo = i % 12, fs = sn.frac[mo], grow = mo >= 3 && mo <= 9;
        const onLand = relStep * (sh.open + sh.forest) * sc, toSnow = onLand * fs, reem = toSnow * reS;
        B.reEm += reem; Wsn += toSnow - reem; toSoil = onLand - toSnow;
        // Hg⁰ taken up by leaves in the growing season (April–October) falls with the litter in October and November
        const fol = relStep * sh.foliar * sc, up = grow ? Math.min(fol * 12 / 7, fol + relStep * gasFarA) : 0;
        Cl += up;
        if(mo === 9){ const x = Cl * 0.5; Cl -= x; toSoil += x; } else if(mo === 10){ toSoil += Cl; Cl = 0; }
        if(mo === sn.meltMo && Wsn > 0){ rIn += Wsn * num(I.snowRun) / 100; toSoil += Wsn * (1 - num(I.snowRun) / 100); Wsn = 0; }
        const seal = relStep * sh.sealed * sc;
        toSoil += seal * dsp.soil; B.treat += seal * dsp.treat; rIn += seal * dsp.water;
        B.regDep += relStep * regA;
        const far = relStep * farA + fol - up; B.air += far; airGas += relStep * gasFarA + fol - up;
      } else if(road){
        toSoil = relStep * rs.strip; B.regDep += relStep * rs.regDep; B.treat += relStep * rs.treat; rIn += relStep * rs.water; B.air += relStep * rs.far;
      }
      const S0 = S + (pulse ? toSoil : 0), e = Math.exp(-k * dt);   // for a pulse, toSoil is the whole input of this step
      const S1 = k > 0 ? (pulse ? S0 * e : S0 * e + toSoil / dt / k * (1 - e)) : S0 + (pulse ? 0 : toSoil);
      const loss = S0 + (pulse ? 0 : toSoil) - S1; S = S1;
      let leach = 0;
      if(k > 0 && loss > 0){
        leach = loss * o.kL / k; const lE = loss * o.kE / k;
        B.rem += loss * o.kO / k; B.down += lE * (1 - I.sdr / 100); rIn += lE * I.sdr / 100;
        B.reEm += loss * o.kEv / k; B.regDep += loss * o.kRs / k;
      }
      const w = evAt.get(i);
      if(w){ const fe = Math.min(0.95, I.floodEros * 0.1 * u.eros * I.er / o.Ms) * w, m2 = S * fe; S -= m2; rFlood += m2 * I.floodSdr / 100; B.down += m2 * (1 - I.floodSdr / 100); nEv += w; }
      cumLeach += leach;
      gwIn[i] += leach * fast;
      if(i + dA < n) gwIn[i + dA] += leach * (1 - fast);
    } else if(I.medium === "gw") gwIn[i] += relStep;
    else rIn += relStep;
    cumIn += gwIn[i];
    if(i - dR >= 0){ const g = gwIn[i - dR]; cumOut += g; rIn += g; }
    const diss = route(rIn, false) + route(rFlood, true);
    if(lake){
      const mo = i % 12, kEv = kEv0 * (mo >= 4 && mo <= 8 ? SEASON_EVAS.summer : SEASON_EVAS.winter), lam = 1 / tau + kEv;
      const e = Math.exp(-lam * dt), W1 = W * e + diss / dt * (1 - e) / lam, gone = W + diss - W1; B.out += gone / tau / lam; B.evas += gone * kEv / lam; W = W1;
    }
    else B.out += diss;
    B.snow = Wsn; B.litter = Cl;
    while(si < snaps.length && snaps[si] <= (i + 1) * dt + 1e-9){
      const c = Object.assign({}, B), g = cumIn - cumOut;
      c.top = S; c.lakeW = W; c.sub = soil ? cumLeach - cumIn : 0; c.gwD = g / Raq; c.gwS = g - c.gwD;
      series.push({t:snaps[si], B:c, rel}); si++;
    }
  }
  B.top = S; B.lakeW = W; B.sub = soil ? cumLeach - cumIn : 0;
  const g = cumIn - cumOut; B.gwD = g / Raq; B.gwS = g - B.gwD;
  return {B, rel, tArr, tGR, Raq, fdB, fdF, nEv, lake, series, o, airGas, sn};
}
function budgetRun(I, m, MC){
  const T = I.budT, fk = I.flood;
  const c = budget(I, m, ONES, T, floodPlan(fk, T, null));
  const rF = rng(20261027);
  const runs = MC.map(x => budget(I, m, x.u, T, floodPlan(fk, T, FLOODS[fk].rp ? rF : null)));
  const share = {};
  BUD.forEach(b => { share[b.k] = stat(runs, x => x.rel > 0 ? x.B[b.k] / x.rel : NaN); });
  const anyFlood = FLOODS[fk].rp ? runs.filter(x => x.nEv > 0).length / runs.length : (fk === "once" ? 1 : 0);
  return {T, fk, c, runs, share, anyFlood};
}

/* ---------- sensitivity: which uncertain input drives each result ---------- */
const FACT = [
  {k:"kd", label:"Soil Kd", meas:"Measure Kd, or run a leaching (eluate) test, on site soil.", use:I => soilLike(I)},
  {k:"react", label:"Reactive fraction", meas:"Measure the reactive fraction with a selective extraction (for example EDTA or sequential extraction).", use:I => soilLike(I)},
  {k:"eros", label:"Erosion rate", meas:"Survey erosion on the site or install sediment traps at the field edge.", use:I => soilLike(I)},
  {k:"infil", label:"Infiltration", meas:"Estimate groundwater recharge from a water balance or a lysimeter.", use:I => soilLike(I)},
  {k:"fdep", label:"Deposition velocity and washout", meas:"Measure bulk deposition around the stack (Bergerhoff samplers), or run a dispersion model.", use:I => I.medium === "air"},
  {k:"evas", label:"Hg⁰ emission from soil", meas:"Measure the Hg⁰ flux from the soil with a flux chamber.", use:I => soilLike(I) && S.metal === "Hg"},
  {k:"K", label:"Hydraulic conductivity", meas:"Run a pumping test or slug test in the aquifer.", use:I => !riverLike(I)},
  {k:"kdAq", label:"Aquifer Kd", meas:"Run batch sorption tests on aquifer material.", use:I => !riverLike(I)},
  {k:"kdSS", label:"Kd on suspended matter", meas:"Measure dissolved and total metal in the river together with suspended sediment.", use:() => true},
  {k:"bg", label:"Background level", meas:"Sample reference soil and water away from the source.", use:() => true},
  {k:"floods", label:"Number of floods", meas:"Not measurable in advance: plan for it with erosion control and flood-safe storage.", use:() => false}
];
function ranks(a){
  const idx = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]), r = new Array(a.length);
  for(let i = 0; i < idx.length;){ let j = i; while(j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; for(let q = i; q <= j; q++) r[idx[q][1]] = (i + j) / 2; i = j + 1; }
  return r;
}
function spearman(a, b){
  const keep = a.map((v, i) => isFinite(v) && isFinite(b[i]));
  const x = ranks(a.filter((v, i) => keep[i])), y = ranks(b.filter((v, i) => keep[i])), n = x.length;
  if(n < 20) return NaN;
  let mx = 0, my = 0; for(let i = 0; i < n; i++){ mx += x[i]; my += y[i]; } mx /= n; my /= n;
  let sxy = 0, sxx = 0, syy = 0; for(let i = 0; i < n; i++){ const p = x[i] - mx, q = y[i] - my; sxy += p * q; sxx += p * p; syy += q * q; }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
}
function sensitivity(item, R){
  const fac = FACT.filter(f => f.k === "floods" ? item.bud && FLOODS[R.bud.fk].rp : f.use(INP));
  return fac.map(f => {
    const xs = f.k === "floods" ? R.bud.runs.map(b => b.nEv) : R.MC.map(x => x.u[f.k]);
    return {f, rho: spearman(xs, item.vals)};
  }).filter(d => isFinite(d.rho)).sort((a, b) => Math.abs(b.rho) - Math.abs(a.rho));
}

function compute(){
  const m = S.metal, I = INP, rows = [], sugg = [];
  const form = formOf(), o = core(I, m, ONES), MC = monteCarlo(m);
  const st = (f, lim) => { const s = stat(MC, f, lim); if(s) s.f = f; return s; };
  const drinkC = c => I.drink === "yes" ? [c, "people"] : [c];
  const soilComp = form.site ? "site" : ({garden:"farm", agri:"farm", forest:"forest", ind:"site"}[I.land]);
  const tbdv = LIM.tbdv[m];
  const drinkTxt = I.drink === "yes" ? "aquifer used for drinking" : "aquifer not used for drinking";
  const range = num(I.kdSoil) ? "" : ` (typical soil range ${KDRANGE[m]} L/kg)`;
  let relPos;
  const add = r => {
    if(!r.vtxt) r.vtxt = fmt(r.v);
    if(r.mc && r.mc.lim != null && r.status === "ok" && r.mc.pex >= 0.1 && !r.noUpgrade){ r.status = "check"; r.tag = "Possible exceedance"; }
    rows.push(r); return r;
  };

  if(soilLike(I)){
    const air = I.medium === "air", road = I.medium === "road";
    relPos = air ? RPOS.stack : road ? RPOS.site : RPOS[soilComp];
    if(air){
      const sh = o.air, lv = LIM.lrvDep[m], bgA = bgAirOf(I, m), dirTxt = I.windFrom !== "" ? ` ${compass((Number(I.windFrom) + 180) % 360)} of the source` : "";
      const pct = x => fmtPct(x), within = `${pct(sh.loc * o.airScale)} of the release lands within the footprint (${pct(sh.dryLoc / Math.max(1e-12, sh.loc))} of it dry, ${pct(sh.wetLoc / Math.max(1e-12, sh.loc))} with rain)`;
      if(I.pattern === "pulse"){
        add({id:"dep", comp:["air"], label:"Deposited at the most exposed point", v:o.depMax, unit:"mg/m²", mc:st(x => x.depMax), status:"info", tag:"Info", ref:`${fmt(o.depX)} m${dirTxt}; footprint average ${fmt(o.Speak)} mg/m²`, how:`Single event; the LRV limit applies to annual means. ${within}`});
      } else {
        const bg = bgA.dep ? bgA.dep.v : 0, tot = o.depMax + bg;
        add({id:"dep", key:true, comp:["air"], label:"Deposition at the most exposed point", v:tot, unit:"µg/(m²·d)", mc:st(x => x.depMax + bg, lv || null), status: lv ? (tot > lv ? "crit" : "ok") : "info", tag: lv ? (tot > lv ? "Exceeds LRV" : "Below LRV") : "No LRV value",
          ref:`Added ${fmt(o.depMax)} at ${fmt(o.depX)} m${dirTxt}${bgA.dep ? ` + background ${fmt(bg)} (${bgA.dep.src})` : ""}. ${lv ? `LRV limit ${lv} µg/(m²·d), annual mean` : `The LRV sets no deposition limit for ${METALS[m].name.toLowerCase()}`}`,
          how:`Footprint average on this land use: ${fmt(o.dep)} µg/(m²·d). ${within}`,
          bench: m === "Pb" ? "NABEL 2024: 1.2 µg/(m²·d) at rural Payerne to 8.9 at Lausanne city centre; 92 next to the Gerlafingen steel works in 2010" : ""});
        const al = AIR_LIM[m], cAdd = (o.airPM + o.airGasC) * I.amount, bgc = bgA.air ? bgA.air.v : 0, ctot = cAdd + bgc;
        add({id:"airC", comp:["air", "people"], label:m === "Hg" ? "Mercury in air at the most exposed point" : `${m} in fine dust at the most exposed point`, v:ctot, unit:"ng/m³", mc:st(x => (x.airPM + x.airGasC) * I.amount + bgc, al.v),
          status: ctot > al.v ? "crit" : "ok", tag: ctot > al.v ? (m === "Pb" ? "Exceeds LRV" : "Above guideline") : (m === "Pb" ? "Below LRV" : "Below guideline"),
          ref:`Added ${fmt(cAdd)} at ${fmt(o.airX)} m${dirTxt}${bgA.air ? ` + background ${fmt(bgc)} (${bgA.air.src})` : " (no Swiss background value)"}. ${al.txt}`,
          how:`Annual mean at ground level, ${m === "Hg" ? "gas and particles" : "PM10 particles"}; stack ${fmt(I.stackH)} m, wind ${fmt(I.windU)} m/s`});
        const big = sh.cls.filter(c => c.w > 0).map(c => `${c.label.toLowerCase()} ${pct(c.w)}: ${pct(c.loc / c.w)} lands in the footprint`).join("; ");
        add({id:"airSplit", comp:["air"], label:"Where the emission goes", v:sh.loc * o.airScale * 100, unit:"% in the footprint", status:"info", tag:"Info",
          ref:`${pct(Math.max(0, sh.reg + sh.loc * (1 - o.airScale)))} lands within 50 km, ${pct(sh.far)} travels further${m === "Hg" && sh.gasFar > 0.01 ? " (mostly Hg⁰, which stays in air for about 6 months)" : ""}`, how:big});
      }
    }
    if(road){
      const rs = o.road;
      add({id:"roadRel", comp:["site"], label:"Release from the road", v:I.amount, unit:"kg/yr", status:"info", tag:"Info",
        ref:`${fmt(I.aadt)} vehicles/day × ${fmt(I.roadL / 1000)} km × ${fmt(roadEF(I, m))} mg per car-km (heavy vehicles ×4)`,
        how:`Roadside strip (0–${ROAD_STRIP} m on both sides): ${fmtPct(rs.strip)}; further from the road: ${fmtPct(rs.regDep)}; drains to water: ${fmtPct(rs.water)}; caught in treatment or drains: ${fmtPct(rs.treat)}; carried far in air: ${fmtPct(rs.far)}`,
        bench:"Swiss tyre-wear budget: almost three quarters stays within 5 m of the road, about 20% reaches surface waters (Sieber, Kawecki & Nowack 2019, Empa)"});
    }
    if((air || road) && num(I.pm10) > 0){
      const over = num(I.pm10) > 20 || num(I.pm25) > 10;
      add({id:"pm", comp:["air", "people"], label:"Background fine dust at the site", v:num(I.pm10), unit:"µg/m³ PM10", status: over ? "warn" : "ok", tag: over ? "Above LRV (background)" : "Below LRV",
        ref:`PM2.5 ${fmt(num(I.pm25))} µg/m³. LRV annual limits: PM10 20, PM2.5 10 µg/m³`, how:"Annual mean 2023–2025 from the FOEN maps (map sites) before this release; it shows how much dust people here already breathe"});
    }
    if(m === "Hg" && o.kEv > 0){
      const fx = num(I.hgSoilF) * o.Ctot * ({hg0:10, hgs:0.1}[I.form] || 1);
      add({id:"hgEv", comp:[soilComp, "air"], label:"Hg⁰ emission from the topsoil", v:fx, unit:"ng/(m²·h)", status:"info", tag:"Info", ref:`At the peak topsoil Hg; the topsoil loses ${fmt(o.kEv * 100)}%/yr of the added Hg to air this way`,
        how:"Proportional to soil Hg; summer fluxes are higher, winter fluxes lower", bench:"Background soils 1–2 ng/(m²·h); contaminated soils of 2–25 mg/kg 15–800 ng/(m²·h), highest in summer (Zhu et al. 2016; Floreani et al. 2023)"});
    }
    const ss = soilStatus(m, o.Ctot, I.land);
    add({id:"soilC", key:true, comp:[soilComp], label:"Peak topsoil concentration", v:o.Ctot, unit:"mg/kg", mc:st(x => x.Ctot, soilLimFor(m, I.land)), status:ss[0], tag:ss[1], ref:ss[2], how:`Background ${fmt(o.bg)} + added ${fmt(o.dC)} mg/kg at year ${fmt(o.tPeak)}, mixed into ${fmt(I.depthMix)} cm`,
      bench: m === "Hg" ? "NABO background in Swiss topsoils: 0.03–0.29 mg/kg" : (I.form === "pbm" && !air ? "Bullet-trap soils (< 0.5 mm fraction) at 7 Swiss ranges: about 1,400 to 516,000 mg/kg (GEOTEST 2007 for FOEN)" : "")});
    add({id:"soilH", comp:[soilComp], label:`Topsoil after ${fmt(o.H)} years`, v:o.bg + o.dCH, unit:"mg/kg", status:"info", tag:"Info", ref:`Topsoil half-life ${fmtYr(o.half)} years`, how:`Loss rates per year: leaching ${fmt(o.kL)}, erosion ${fmt(o.kE)}, other ${fmt(o.kO)}`,
      bench: m === "Pb" ? "NABO 1985–2009: topsoil Pb unchanged at 70 of 100 sites and lower at 29, as a long half-life predicts; part of the decline is mixing into deeper soil, which this model does not include (Gubler et al. 2015)" : m === "Hg" ? "NABO 1985–2009: topsoil Hg fell at 63 sites, 27 unchanged, 3 rose (Gubler et al. 2015). That is faster than leaching and erosion explain: re-emission and mixing into deeper soil are missing by default, so set Other losses to test them" : ""});
    add({id:"kd", comp:[soilComp], label:"Kd in topsoil", v:o.Kd, unit:"L/kg", status:"info", tag: num(I.kdSoil) ? "Your value" : (m === "Pb" ? "Published fit" : "Estimated"), ref: num(I.kdSoil) ? `Your value; the default relation gives ${fmt(o.kdCalc)} L/kg` : ({Pb:`log Kd = 1.99 + 0.42·pH (Carlon et al. 2004) = ${Math.log10(o.Kd).toFixed(2)}`, Hg:`Kd = Koc·foc, log Koc 5.5 → log Kd ${Math.log10(o.Kd).toFixed(2)}`, As:`Semi-empirical (Fe oxides, pH, redox) → log Kd ${Math.log10(o.Kd).toFixed(2)}; US EPA advises site-measured Kd for As`})[m], how:`Uncertainty σ ${num(I.kdSoil) ? 0.3 : KD_SIG[m]} log units${range}`});
    const al = LIM.altl1[m];
    add({id:"pore", key:true, comp:[soilComp], label:"Seepage water leaving the topsoil", v:o.cw, unit:"µg/L", mc:st(x => x.cw, al), status: o.cw > al ? "crit" : "ok", tag: o.cw > al ? "Exceeds AltlV" : "Below AltlV",
      ref:`AltlV Annex 1 concentration value: ${al} µg/L` + (m === "As" ? " (10 µg/L proposed in 2024)" : "") + (o.capped ? `. Capped at Pb solubility, about ${fmt(o.cap)} µg/L at pH ${fmt(I.pH)}` : ""),
      how:`Added ${fmt(o.cwAdd)} + background ${fmt(o.cwBg)} µg/L; reactive fraction ${fmt(I.reactive)}%`,
      bench: I.form === "pbm" && !air ? "Bullet-trap eluates (lab test, water:solid 10:1, < 0.5 mm): 40–700 µg/L at 5 of 7 Swiss ranges (GEOTEST 2007 for FOEN). Pore water and eluate are nearly equal when Kd is far above 10 L/kg" : ""});
    add({id:"leach", comp:[soilComp, "gw"], label:"Leaching below the topsoil", v:o.leachKg, unit:"kg/yr", status:"info", tag:"Info", ref:`Net infiltration ${fmt(o.q * 1000)} mm/yr`, how:`Flux ${fmt(o.q * o.cwAdd)} mg/(m²·yr) over ${fmt(o.A)} m²`});
    add({id:"eros", comp:[soilComp, "river"], label:"Eroded to surface water", v:o.erosKg, unit:"kg/yr", status:"info", tag: o.kE > 5 * o.kL ? "Main loss path" : "Info", ref:`Erosion ${fmt(o.E * 10)} t/ha/yr${num(I.eros) ? "" : (num(I.slope) > 0 ? ` (land-use default × ${fmt(slopeFactor(I))} for a ${fmt(I.slope)}% slope)` : " (default for this land use)")} × enrichment ${fmt(I.er)} × delivery ${fmt(I.sdr)}%`, how:`At peak topsoil concentration, over ${fmt(o.A)} m²`,
      bench: I.land === "agri" && !form.site ? "Measured mean on arable land, Frienisberg (BE), 1997–2007: 0.7 t/ha/yr (Prasuhn)" : ""});
    const g = LIM.gschv[m];
    add({id:"rivE", comp:["river"], label:"River, dissolved, from erosion", v:o.rivD, unit:"µg/L", mc:st(x => x.rivD, g || null), status: g ? (o.rivD > g ? "crit" : "ok") : "info", tag: g ? (o.rivD > g ? "Exceeds GSchV" : "Below GSchV") : "No GSchV value", ref: g ? `GSchV Annex 2: ${g} µg/L dissolved` : "No GSchV value for As", how:`Background ${fmt(I.bgRiv[m])} + ${fmt(o.rivTot)} µg/L × ${fmt(o.fd * 100)}% dissolved; Q ${fmt(o.Q)} m³/s`});
    const fast = I.aq !== "porous";
    add({id:"tarr", comp:["gw"], label:"Travel time to the water table", v:o.tArr, vtxt:fmtYr(o.tArr), unit:"years", mc:st(x => x.tArr), status: fast ? "check" : (o.tArr <= o.H ? "warn" : "check"), tag: fast ? "Fast paths likely" : (o.tArr <= o.H ? "Within horizon" : "Matrix flow only"), ref: fast ? "Karst or fractured rock: preferential flow can arrive within days to months" : `${fmt(o.Lz)} m unsaturated zone, retardation R = ${fmt(o.Rv)}. Fast paths can be much quicker: test them with the fast-path share (Budget & floods tab)`, how:`Subsoil Kd ${fmt(o.kdSub)} L/kg; matrix flow only`,
      bench: m === "Pb" || I.form === "pbm" ? "Shooting ranges: Pb 0.5–3 µg/L and Sb 2–50 µg/L already found directly downgradient after decades of use (GEOTEST 2007 for FOEN), far sooner than matrix flow predicts. The report names preferential flow paths as a key factor" : ""});
    const arrived = fast || o.tArr <= o.H;
    const gs = o.cgw > tbdv ? (arrived ? ["crit","Exceeds TBDV"] : ["check","Exceeds if it arrives"]) : ["ok","Below TBDV"];
    add({id:"gwPot", key:true, noUpgrade:!arrived, comp:drinkC("gw"), label:"Groundwater under the source, long term", v:o.cgw, unit:"µg/L", mc:st(x => x.cgw, tbdv), status:gs[0], tag:gs[1], ref:`Drinking-water limit (TBDV) ${tbdv} µg/L · ${drinkTxt}`, how:`Background ${fmt(I.bgGw[m])} + ${fmt(o.cwAdd)} / DAF ${fmt(o.D.daf)} (mixing depth ${fmt(o.D.d)} m)`,
      bench: I.form === "pbm" && !air ? "Directly downgradient of bullet traps: 0.5–3 µg/L at 4 Swiss ranges, about 30 µg/L at an acidic one (GEOTEST 2007 for FOEN)" : (m === "As" ? "NAQUA 2018: As above 10 µg/L at 2 of 524 stations and above 5 µg/L at 7; mostly below 1 µg/L on the Plateau. Higher values come from crystalline rock, not soil: enter them as background" : "")});
    if(o.sb){
      const sb = o.sb;
      add({id:"sbPore", key:true, comp:[soilComp], label:"Antimony in seepage water", v:sb.sbCw, unit:"µg/L", mc:st(x => x.sb && x.sb.sbCw, 10), status: sb.sbCw > 10 ? "crit" : "ok", tag: sb.sbCw > 10 ? "Exceeds AltlV" : "Below AltlV", ref:"AltlV concentration value for Sb in eluate: 10 µg/L" + (sb.sbCapped ? ". Capped at Ca-antimonate solubility, about 5,000 µg/L" : ""), how:`${fmt(I.sbShare)}% Sb in bullets, ${fmt(sb.sbC)} mg/kg in topsoil, Kd ${fmt(I.kdSb)} L/kg, mobile ${fmt(I.sbMobile)}%`, bench:"Batch eluates (water:solid 10:1): 200–5,000 µg/L (GEOTEST 2007 for FOEN). Field lysimeter seepage from a calcareous range soil is far lower: 40–110 µg/L drained, 2–5 µg/L waterlogged (Hockmann et al. 2015)"});
      add({id:"sbGw", comp:["gw"], label:"Antimony in groundwater, long term", v:sb.sbGw, unit:"µg/L", mc:st(x => x.sb && x.sb.sbGw), status:"info", tag: sb.tSb <= o.H ? "Arrives within horizon" : "Info", ref:`Reaches the water table after about ${fmtYr(sb.tSb)} years by matrix flow`, how:`Seepage ÷ DAF ${fmt(o.D.daf)}`, bench:"Directly downgradient of bullet traps: 2–50 µg/L (GEOTEST 2007 for FOEN). The model is about 2× above the highest value because seepage sits at the batch-eluate solubility; field seepage is lower (see above)"});
    }
    if(I.land === "garden"){
      let s, tag, ref, lim;
      if(m === "Hg"){ const sh = o.dose / 0.571; s = sh > 1 ? "crit" : sh > 0.1 ? "warn" : "ok"; tag = `${fmt(sh * 100)}% of TWI`; lim = 0.571; ref = "Inorganic Hg TWI 4 µg/kg bw per week (EFSA 2012). The Swiss Hg value allots 10% of it to soil."; }
      else { const bm = m === "As" ? 0.06 : 0.5, moe = bm / o.dose; s = moe < 1 ? "crit" : moe < 10 ? "warn" : "ok"; tag = `MOE ${fmt(moe)}`; lim = bm; ref = m === "As" ? "EFSA 2024 BMDL05 0.06 µg/kg bw per day (skin cancer); no safe intake identified" : "EFSA 2010 BMDL01 0.50 µg/kg bw per day (children's IQ); no threshold"; }
      add({id:"dose", key:true, comp:["people"], label:"Child soil-ingestion dose", v:o.dose, unit:"µg/kg bw per day", mc:st(x => x.dose, lim), status:s, tag, ref, how:`${fmt(o.Ctot)} mg/kg × ${fmt(I.ir)} g/d × ${fmt(I.rba)}% ÷ ${fmt(I.bw)} kg`});
    }
  } else if(I.medium === "gw"){
    const gs = o.cgw > tbdv ? (o.tW <= o.H ? ["crit","Exceeds TBDV"] : ["check","Exceeds if it arrives"]) : ["ok","Below TBDV"];
    add({id:"gwC", key:true, comp:drinkC("gw"), label:"Groundwater in the plume", v:o.cgw, unit:"µg/L", mc:st(x => x.cgw, tbdv), status:gs[0], tag:gs[1], ref:`Drinking-water limit (TBDV) ${tbdv} µg/L · ${drinkTxt}`, how:`Background ${fmt(I.bgGw[m])} + ${fmt(I.amount)} kg/yr in ${fmt(o.flowL / 1000)} m³/yr of groundwater`,
      bench: m === "As" ? "NAQUA 2018: As above 10 µg/L at 2 of 524 stations and above 5 µg/L at 7; mostly below 1 µg/L on the Plateau, higher locally in crystalline fractured-rock aquifers" : ""});
    add({id:"tW", key:true, comp:["gw"], label:"Travel time to the well", v:o.tW, vtxt:fmtYr(o.tW), unit:"years", mc:st(x => x.tW), status:"info", tag: o.tW <= o.H ? "Within horizon" : "Beyond horizon", ref: o.porous ? `Retardation R = ${fmt(o.Raq)} (aquifer Kd ${fmt(o.kdAq)} L/kg)` : "No retardation assumed: karst and fractured rock have fast paths", how:`${fmt(I.wellDist)} m at ${fmt(o.v)} m/yr seepage velocity`});
    add({id:"darcy", comp:["gw"], label:"Groundwater flux (Darcy)", v:o.qAq, unit:"m/yr", status:"info", tag:"Info", ref:`K ${I.K} m/s × gradient ${I.grad}`, how:`Plume ${fmt(I.gwWidth)} m wide × ${fmt(o.b)} m thick`});
    relPos = RPOS.gw;
  } else {
    const g = LIM.gschv[m];
    const s = g ? (o.cD > g ? ["crit","Exceeds GSchV"] : ["ok","Below GSchV"]) : (o.cD > 10 ? ["warn","Above 10 µg/L"] : ["info","No GSchV value"]);
    const ev = S.water === "base" ? "base flow" : S.water === "melt" ? "snowmelt (Q×2, SSC×3)" : "storm (Q×5, SSC×10)";
    add({id:"rivD", key:true, comp:["river"], label:"Dissolved in the river", v:o.cD, unit:"µg/L", mc:st(x => x.cD, g || null), status:s[0], tag:s[1], ref: g ? `GSchV Annex 2: ${g} µg/L dissolved` : "No GSchV value for As; the drinking-water limit is 10 µg/L", how:`Background ${fmt(I.bgRiv[m])} + ${fmt(o.cTot)} µg/L × ${fmt(o.fd * 100)}% dissolved; ${ev}`});
    add({id:"rivT", comp:["river"], label:"Added total concentration", v:o.cTot, unit:"µg/L", status:"info", tag:"Info", ref:`Discharge ${fmt(o.Q)} m³/s, ${ev}`, how:`${fmt(I.amount)} kg/yr ÷ discharge`});
    add({id:"fd", comp:["river"], label:"Dissolved share", v:o.fd * 100, unit:"%", mc:st(x => x.fd * 100), status:"info", tag:"Info", ref:`Kd on suspended matter ${fmt(o.kdSS)} L/kg, SSC ${fmt(o.ssc)} mg/L`, how:"1 / (1 + Kd × SSC)",
      bench: m === "As" ? "Rhine at Weil am Rhein 2015, suspended solids median 5.6 mg/L: dissolved As median 0.74 µg/L vs total 0.81 µg/L, about 90% dissolved (model at 5.6 mg/L: 95%)" : m === "Pb" ? "Rhine at Weil am Rhein 2015: dissolved Pb below detection in 12 of 13 samples while total Pb had a median of 0.18 µg/L, so mostly particle-bound (model at 5.6 mg/L: 26% dissolved)" : ""});
    add({id:"sed", comp:["sediment","lake"], label:"Particle-bound load settling in the lake", v:o.sedKg, unit:"kg/yr", status:"info", tag:"Info", ref: I.lakeTau > 0 ? `${fmt(I.trapEff)}% of the particles settle in the lake (Budget & floods tab)` : "No lake downstream (Budget & floods tab)", how:"Becomes part of the sediment archive",
      bench:"Bulk sediment retained: about 97% in Lake Brienz (Müller et al. 2007) and 98% in Lake Geneva (Loizeau et al. 2012). Metals ride on the finest particles, so the default 90% is cautious"});
    relPos = RPOS.river;
    if(I.medium === "glacier") add({id:"glRel", comp:["river"], label:"Release from glacier melt", v:I.amount, unit:"kg/yr", status:"info", tag:"Info",
      ref:`${fmt(I.glArea)} km² × ${fmt(I.glLoss)} m water/yr × ${fmt(I.glConc[m])} ng/g × ${fmt(I.glShare)}% from 1950–1990 ice`, how:"Metal deposited from air decades ago, released as the ice melts",
      bench:"Hg accumulation doubled in recent decades in a glacier-fed lake in the French Alps, while a rain-fed lake followed the decline in emissions (Mattio et al. 2026)"});
  }
  if(m === "Hg"){
    const mi = methylIndex(I);
    const s = mi > 6 ? ["crit","High"] : mi >= 3 ? ["warn","Moderate"] : ["ok","Low"];
    add({id:"methyl", key:true, comp:["lake","sediment"], label:"Methylation potential downstream", v:mi, unit:"/ 10", status:s[0], tag:s[1], ref:`Bottom water ${lakeLabel(I)}, ${({oligo:"nutrient-poor", meso:"moderately nutrient-rich", eu:"nutrient-rich"})[I.troph] || ""} lake, wetlands ${I.wet}, DOC ${fmt(I.doc)} mg/L, pH ${fmt(I.lpH)}`, how:"Qualitative index of known drivers, not a concentration", bench:"Methylmercury is a small share of total Hg in Swiss lake sediment: about 0.4% in Lake Geneva surface sediment (Gascón Díez et al. 2018) and below 2% in Lake Maggiore (CIPAIS 2017). In fish it is 70–80% of the Hg (CIPAIS 2017)"});
  }
  if(I.rlOn === "on"){
    const L = redoxLadder(I), t = ladderText(L);
    add({id:"ladder", comp:["gw"], label:"Redox state below the source (ladder)", v:L.pe, vtxt:LAD_LBL[L.cls], unit:"", status:"info", tag:"Calculated", ref:t.how + (L.drain ? ` Topsoil: ${({well:"well drained", periodic:"periodically waterlogged", perm:"permanently waterlogged"})[L.drain]} from ${fmt(num(I.satDays))} saturated days${num(I.oc) < 1 ? " and low organic carbon" : ""}.` : ""), how:t.bal});
    if(num(I.docSrc) > 0 && L.cls !== "oxic") sugg.push("Organic carbon from the release drives the aquifer towards reducing conditions, which dissolves the Fe and Mn oxides that hold As and Pb: cut the organic load, or test aeration, before relying on sorption.");
  }

  const R = id => rows.find(r => r.id === id) || {};
  const stOf = id => R(id).status;
  if(stOf("soilC") === "crit") sugg.push("Excavate and dispose of soil above the AltlV remediation value, or restrict its use for gardens, playgrounds and crops.");
  else if(stOf("soilC") === "warn") sugg.push("Stop further input and check use restrictions: the soil is above a VBBo guide or trigger value.");
  if(stOf("pore") === "crit") sugg.push({As:"Cut oxygen and water inflow with a cover or cap, and fix arsenic with iron: Fe-oxide amendments or a zero-valent-iron barrier in the seepage path.", Pb:"Immobilise lead with phosphate (not on As-rich soils) or by liming acidic soil; at active ranges install artificial bullet traps.", Hg:"Remove mercury hotspots or contain them with a sealing wall; keep the soil aerated to avoid methylation."}[m]);
  if(stOf("sbPore") === "crit") sugg.push("Antimony leaches much faster than lead and phosphate does not hold it: collect or treat seepage with iron-based sorbents and monitor Sb in groundwater.");
  if(soilLike(I) && o.kE > 5 * o.kL) sugg.push("Erosion, not leaching, is the main way the metal leaves this soil: keep vegetation cover, add buffer strips or sediment traps, and avoid bare ground.");
  if(stOf("gwPot") === "check" || stOf("gwC") === "check") sugg.push("Groundwater could exceed the limit in part of the uncertainty range or if fast paths exist: monitor seepage and groundwater below the source.");
  if(stOf("gwPot") === "crit" || stOf("gwC") === "crit") sugg.push({As:"Protect the water supply: iron-hydroxide (GFH) adsorbers, oxidation with Fe(III) coagulation, or blending with low-arsenic water.", Pb:"Contain the plume hydraulically, or treat the water by coagulation-filtration or ion exchange.", Hg:"Contain the plume with sealing walls; treat the water with activated carbon or thiol resins."}[m]);
  if(I.aq !== "porous" && !riverLike(I)) sugg.push("Karst or fractured rock: fast paths bypass soil retention. Protect recharge areas and sample springs after heavy rain.");
  if(stOf("rivD") === "crit" || stOf("rivE") === "crit") sugg.push("Retain particles before they reach the river: settling basins, runoff treatment and sediment traps below the source.");
  if(stOf("dep") === "crit") sugg.push("Upgrade flue-gas cleaning (fabric filters or electrostatic precipitators) and monitor dust deposition around the stack.");
  if(m === "Hg" && stOf("methyl") !== "ok") sugg.push("Limit methylation: keep lake bottom water oxic (aeration) and avoid flooding Hg-rich soils and wetlands.");
  if(m === "Hg" && I.fish !== "none" && stOf("methyl") !== "ok") sugg.push("Advise pregnant women and children on fish consumption and measure methylmercury in predatory fish.");
  if(m === "Hg" && soilLike(I) && !(I.loss > 0)) sugg.push("Mercury leaves Swiss topsoils faster than leaching, erosion and Hg⁰ emission explain (NABO trend data), probably by mixing into deeper soil: set Other losses on the Soil tab to test it.");
  if(m === "Hg" && I.form === "hg0") sugg.push("Elemental mercury re-emits to air: measure soil-gas Hg, ventilate buildings and set Other losses to include re-emission.");
  if(m === "As" && I.drain !== "well") sugg.push("Waterlogging releases As(III): improve drainage or add iron, and avoid phosphate fertiliser on this soil.");
  if(m === "Pb" && I.pH < 5.5) sugg.push("Lime the soil: lead mobility rises sharply below pH 5 to 5.5.");
  if(["crit","warn"].includes(stOf("dose"))) sugg.push("Reduce direct contact: clean topsoil cover or raised beds in gardens, and keep children off bare contaminated soil.");
  if(soilLike(I) && !num(I.kdSoil)) sugg.push("Measure Kd (or a leaching test) on site samples: it is the largest source of uncertainty in these results.");
  if(I.medium === "road") sugg.push("Most traffic metal stays within 5 m of the road: keep the shoulders vegetated, don't grow food there, and send road runoff over shoulders, retention soil filters or a road-runoff treatment plant (SABA) rather than straight into streams.");
  if(I.medium === "glacier") sugg.push("Glacier melt releases metal deposited decades ago and cannot be stopped at the source: sample sediment and fish in glacier-fed lakes after hot summers, and site drinking-water intakes with this in mind.");
  if(stOf("airC") === "crit") sugg.push("Air above the limit at the most exposed point: improve dust filters on the stack, and check which homes and schools lie in the main wind direction.");
  if(!sugg.length) sugg.push("No exceedance at screening level. Confirm with measured soil, seepage and groundwater data before deciding.");

  const bud = budgetRun(I, m, MC);
  const ser = budget(I, m, ONES, 100, floodPlan(I.flood, 100, null), SERIES_T).series;
  const forms = formsRun(I, m);
  const sens = rows.filter(r => r.mc && r.mc.f).map(r => ({id:r.id, label:r.label, unit:r.unit, vals:MC.map(r.mc.f)}));
  BUD.forEach(b => { const s = bud.share[b.k]; if(s && s.p95 > 1e-6) sens.push({id:"bud-" + b.k, bud:true, label:`Budget: ${b.label.charAt(0).toLowerCase() + b.label.slice(1)}, year ${bud.T}`, unit:"share", vals:bud.runs.map(x => x.rel > 0 ? x.B[b.k] / x.rel : NaN)}); });
  if(bud.c.rel > 0){
    const top = BUD.map(b => [b.k, bud.c.B[b.k] / bud.c.rel]).sort((x, y) => y[1] - x[1])[0], pc = fmtPct(top[1]), yr = `${bud.T} year${bud.T > 1 ? "s" : ""}`;
    const adv = {
      top:`After ${yr}, ${pc} of the released metal is still in the topsoil at the source. If measurements confirm this, trapping works best here: excavation, cover or immobilisation before erosion and leaching spread it.`,
      down:`After ${yr}, the largest share (${pc}) has washed downslope. Sample field margins and the foot of the slope, and add buffer strips.`,
      fp:`After ${yr}, the largest share (${pc}) sits in floodplain soil. Sample flooded land and restrict its use where limits are exceeded.`,
      sub:`After ${yr}, the largest share (${pc}) is below the root zone on its way to groundwater. Monitor seepage and the water table below the source.`,
      gwD:`After ${yr}, the largest share (${pc}) is dissolved in groundwater. Protect wells and consider a reactive barrier or hydraulic containment.`,
      gwS:`After ${yr}, the largest share (${pc}) is held on aquifer sediment. It stays a slow-release source: monitor wells downgradient.`,
      lakeW:`After ${yr}, the largest share (${pc}) is dissolved in lake water. Cut the input; the lake flushes it out over about ${fmt(I.lakeTau)} years.`,
      sed:`After ${yr}, the largest share (${pc}) is in lake sediment. Leave it buried, keep bottom water oxic, and contain any dredging.`,
      out:`After ${yr}, the largest share (${pc}) has passed downstream. Intercept it at the source or in a retention basin before the river.`,
      air:`After ${yr}, the largest share (${pc}) has left in air. Flue-gas cleaning at the stack is the only place to trap it.`,
      rem:`After ${yr}, the largest share (${pc}) went to the other losses you set. Check crops and soil gas.`,
      snow:`After ${yr}, the largest share (${pc}) is held in snow or firn. It leaves in a pulse at snowmelt: sample meltwater streams in spring.`,
      litter:`After ${yr}, the largest share (${pc}) is in tree leaves and reaches the forest floor with the autumn litter.`,
      regDep:`After ${yr}, the largest share (${pc}) has landed outside the assessed area. Widen the sampling area, mainly downwind, before deciding where to act.`,
      treat:`After ${yr}, the largest share (${pc}) is caught in road-runoff treatment, drains or sewage sludge. Keep these maintained and dispose of the sludge safely.`,
      reEm:`After ${yr}, the largest share (${pc}) has returned to air as Hg⁰ from soil and snow. It is deposited again over a wide region.`,
      evas:`After ${yr}, the largest share (${pc}) escaped from lake water as Hg⁰ gas. It returns with rain over a wide region, so cutting the input upstream of the lake is the lever.`
    }[top[0]];
    if(adv) sugg.unshift(adv);
  }

  const compStatus = {};
  rows.forEach(r => r.comp.forEach(c => { compStatus[c] = worse(compStatus[c], r.status); }));
  const nC = rows.filter(r => r.status === "crit").length, nW = rows.filter(r => r.status === "warn" || r.status === "check").length;
  const summary = (nC ? `${nC} result${nC > 1 ? "s exceed" : " exceeds"} a Swiss limit or health reference point.` : nW ? `No limit exceeded at the best estimate; ${nW} result${nW > 1 ? "s need" : " needs"} checking.` : "All screened results are below Swiss limits.") + ` Ranges come from ${MC_N} Monte Carlo runs. Screening only: confirm with site data.`;
  return {rows, sugg:[...new Set(sugg)], compStatus, relPos, summary, bud, sens, MC, ser, forms, o0:o, title:`Release to ${MEDIUM_LBL[I.medium]}`, form, kdCalc:o.kdCalc, kdAqCalc:o.kdAqCalc, kdSSdef:KDSS[m]};
}

function deriveConditions(){
  const I = INP, why = [];
  if(I.drain !== "well") why.push("waterlogged soil, Soil tab");
  if(I.redox === "anoxic" || I.redox === "sulfidic") why.push("anoxic aquifer, Groundwater tab");
  if(lakeLevel(I) > 0) why.push("lake bottom-water anoxia, River & lake tab");
  S.redox = why.length ? "reducing" : "oxic";
  S.ph = I.pH < 5.5 ? "acid" : "calc";
  $("#derivedTxt").textContent = `${why.length ? "Reducing (" + why.join("; ") + ")" : "Oxic"} · ${S.ph === "acid" ? "Acidic" : "Near-neutral"} (soil pH ${fmt(I.pH)}, Soil tab)`;
  $("#derivedTxt").title = "Read from your inputs, not set here. Soil pH below 5.5 counts as acidic. Redox turns reducing when the soil is waterlogged, the aquifer is anoxic or sulfidic, or the lake has bottom-water anoxia. These switch the profile's flows and scenario notes.";
}
function rangeHTML(r){
  if(!r.mc) return "";
  const {p5, p50, p95, pex, lim} = r.mc;
  const txt = `90% range ${fmt(p5)}–${fmt(p95)} ${esc(r.unit)}` + (pex != null ? ` · ${fmt(pex * 100)}% of runs above ${fmt(lim)}` : "");
  const lo = Math.min(p5, lim != null ? lim : p5), hi = Math.max(p95, lim != null ? lim : p95);
  if(!(lo > 0) || !(hi > 0) || !isFinite(hi)) return `<div class="rng"><span>${txt}</span></div>`;
  const L0 = Math.log10(lo) - 0.3, L1 = Math.log10(hi) + 0.3, pos = v => (Math.log10(v) - L0) / (L1 - L0) * 100;
  return `<div class="rng"><div class="rbar" aria-hidden="true"><span class="rspan" style="left:${pos(p5).toFixed(1)}%;width:${Math.max(0.8, pos(p95) - pos(p5)).toFixed(1)}%"></span><span class="rmed" style="left:${pos(p50).toFixed(1)}%"></span>${lim != null ? `<span class="rlim" style="left:${pos(lim).toFixed(1)}%"></span>` : ""}</div><span>${txt}</span></div>`;
}
function renderResults(){
  const R = RES, I = INP;
  const amt = soilLike(I) && I.pattern === "pulse" ? `${fmt(I.amount)} kg once` : `${fmt(I.amount)} kg/yr` + (soilLike(I) ? ` for ${fmt(I.duration)} years` : "");
  $("#resIntro").textContent = `${METALS[S.metal].name} · ${R.form.label} · released to ${MEDIUM_LBL[I.medium]} · ${amt} · ${I.preset === "custom" ? "custom site" : PRESETS[I.preset].label}. ${R.summary}`;
  $("#resGrid").innerHTML = R.rows.map(r => `<div class="res" data-s="${r.status}"><div class="rl"><span>${esc(r.label)}</span><span class="pill ${r.status}">${esc(r.tag)}</span></div><div class="rv">${esc(r.vtxt)}<small>${esc(r.unit)}</small></div>${rangeHTML(r)}<div class="rr">${esc(r.ref)}</div><div class="rh">${esc(r.how)}</div>${r.bench ? `<div class="bench"><b>Measured</b>${esc(r.bench)}</div>` : ""}</div>`).join("");
  $("#suggList").innerHTML = R.sugg.map(s => `<li>${esc(s)}</li>`).join("");
  renderBudget(); renderSens(); renderSeries(); renderForms(); renderSpread(); renderFurther();
  const ph = (id, v) => { const el = document.getElementById(id); if(el) el.placeholder = "default: " + fmt(v); };
  ph("f-kdSoil", R.kdCalc); ph("f-kdAq", R.kdAqCalc); ph("f-kdSS", R.kdSSdef); ph("f-eros", erosDefault(INP));
  const m = S.metal, o0 = R.o0 || {};
  if(o0.air) ph("f-fdep", o0.air.loc * 100);
  const dv = airSplitDef(I); SPLIT_KEYS.forEach((k, i) => ph("f-" + k, dv[i]));
  const ls = landShares(Object.assign({}, I, {forestShare:"", sealedShare:""})); ph("f-forestShare", ls.fF * 100); ph("f-sealedShare", ls.fS * 100);
  ph("f-snowDays", snowSeason(Object.assign({}, I, {snowDays:""})).D); ph("f-resusp", resuspOf(Object.assign({}, I, {resusp:""})));
  ph("f-efRoad", (ROAD_EF[I.roadEra] || ROAD_EF.today)[m] || 0);
  const bga = bgAirOf(Object.assign({}, I, {bgDep:{As:"", Hg:"", Pb:""}, bgAir:{As:"", Hg:"", Pb:""}}), m);
  if(bga.dep) ph("f-bgDep", bga.dep.v); if(bga.air) ph("f-bgAir", bga.air.v);
}
function renderBudget(){
  const R = RES, bd = R.bud, c = bd.c, I = INP;
  $("#budTSeg").querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", String(Number(b.dataset.t) === bd.T)));
  $("#floodSel").value = bd.fk;
  $("#budTitle").textContent = `Where is the metal after ${bd.T} year${bd.T > 1 ? "s" : ""}?`;
  const shown = BUD.filter(b => c.B[b.k] > 0 || (bd.share[b.k] && bd.share[b.k].p95 > 0));
  const soilR = soilLike(I), rel = {top:soilR, down:soilR, fp:soilR && bd.fk !== "none", sub:soilR, gwD:!riverLike(I), gwS:!riverLike(I) && I.aq === "porous", lakeW:I.lakeTau > 0, sed:I.lakeTau > 0, out:true, air:I.medium === "air" || I.medium === "road", evas:S.metal === "Hg" && I.lakeTau > 0 && I.hgEvas > 0, rem:soilR && I.loss > 0,
    snow:I.medium === "air" && bd.c.o.air && bd.c.o.air.sn.D > 0, litter:I.medium === "air" && S.metal === "Hg" && landShares(I).fF > 0, regDep:I.medium === "air" || I.medium === "road", treat:I.medium === "road" || (I.medium === "air" && landShares(I).fS > 0), reEm:S.metal === "Hg" && soilR};
  const hidden = BUD.filter(b => !shown.includes(b) && rel[b.k]);
  const row = b => {
    const p = c.rel > 0 ? c.B[b.k] / c.rel : 0, s = bd.share[b.k];
    const w = p > 0 ? Math.max(0.6, p * 100) : 0;
    const wh = s ? `<span class="bwhisk" style="left:${(s.p5 * 100).toFixed(2)}%;width:${Math.max(0.4, (s.p95 - s.p5) * 100).toFixed(2)}%"></span>` : "";
    return `<div class="bud-row" role="row"><span class="bl" role="cell">${esc(b.label)}</span><span class="bbar" role="cell" aria-hidden="true"><span class="bfill" style="width:${w.toFixed(2)}%"></span>${wh}</span><span class="bp" role="cell">${fmtPct(p)}</span><span class="bk" role="cell">${fmt(c.B[b.k])} kg</span><span class="br" role="cell">${s ? `${fmtPct(s.p5)} – ${fmtPct(s.p95)}` : ""}</span></div>`;
  };
  $("#budRows").innerHTML = `<div class="bud-row bud-hd" role="row"><span role="columnheader">Where it is</span><span role="columnheader" class="bbar-h">Share of the released mass</span><span role="columnheader">Share</span><span role="columnheader">Mass</span><span role="columnheader">90% range</span></div>` + shown.map(row).join("");
  const sum = BUD.reduce((a, b) => a + c.B[b.k], 0), N = [];
  N.push(`Released by year ${bd.T}: ${fmt(c.rel)} kg. The rows add up to ${c.rel > 0 && Math.abs(sum / c.rel - 1) < 1e-6 ? "100%" : fmtPct(c.rel > 0 ? sum / c.rel : 0)} of it (mass check). Bars show the best estimate; the thin line marks the 90% range of ${MC_N} runs.`);
  if(soilLike(I)) N.push(`Seepage reaches the water table after about ${fmtYr(c.tArr)} years by slow matrix flow${I.aq === "porous" ? (I.fastShare > 0 ? `; ${fmt(I.fastShare)}% of it takes fast paths and arrives within the month` : "; set a fast-path share on the Budget & floods tab to test cracks and colloids") : "; in karst and fractured rock it is treated as arriving at once"}.`);
  if(!riverLike(I)) N.push(`Groundwater reaches the river or lake after about ${fmtYr(c.tGR)} years (${fmt(I.rivDist)} m${c.Raq > 1 ? `, metal ${fmt(c.Raq)} times slower than the water` : ""}).`);
  if(bd.fk === "once") N.push(`One extreme flood in mid-year 1: ${fmt(I.floodEros)} t/ha soil loss, ${fmt(I.floodSdr)}% of it reaching the river, ${fmt(I.floodPlain)}% of the river particles left on floodplains.`);
  else if(bd.fk !== "none") N.push(`Best estimate spreads each 1-in-${FLOODS[bd.fk].rp}-year flood over its return period; the ranges come from runs with random flood years. ${fmtPct(bd.anyFlood)} of runs had at least one flood by year ${bd.T}.`);
  if(bd.fk !== "none" && !soilLike(I)) N.push("Floods act on eroding soil in this budget, so they change little for river and groundwater releases.");
  if(I.medium === "air" && c.o.air){
    const sn = c.o.air.sn, mon = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    if(sn.D > 0) N.push(sn.perennial ? `Snow lies all year at ${fmt(I.elev)} m: what lands here is stored in firn and glacier ice.` : `Snow covers the ground about ${fmt(sn.D)} days a year at ${fmt(I.elev)} m. What lands on snow waits in the snowpack${S.metal === "Hg" ? `; ${fmt(I.snowReem)}% of its mercury returns to air before melt` : ""}, and leaves at melt in ${mon[sn.meltMo] || "spring"}: ${fmt(I.snowRun)}% runs off to streams, the rest soaks into the soil.`);
    if(S.metal === "Hg" && landShares(I).fF > 0) N.push("Forest leaves take up Hg⁰ from April to October; it reaches the forest floor with the litter in October and November.");
  }
  if(hidden.length) N.push(`Nothing has reached these yet: ${hidden.map(b => b.label.charAt(0).toLowerCase() + b.label.slice(1)).join("; ")}.`);
  if(S.metal === "Hg" && I.lakeTau > 0 && I.hgEvas > 0) N.push(`Lake water loses its dissolved Hg as Hg⁰ gas at ${fmt(I.hgEvas)}% per year on average: ${fmt(I.hgEvas * SEASON_EVAS.summer)}%/yr from May to September, when sunlight reduces Hg(II), and ${fmt(I.hgEvas * SEASON_EVAS.winter)}%/yr the rest of the year. The season setting changes the forms, not the budget.`);
  N.push("Not included: dissolved metal scavenged into lake sediment, remobilised river and lake sediment, waterlogging after floods (arsenic release, Hg methylation), pumping by wells, and mixing into deeper soil unless you set Other losses.");
  $("#budNote").innerHTML = N.map(t => `<li>${esc(t)}</li>`).join("");
}
function renderSens(){
  const R = RES, items = R.sens, sel = $("#sensSel");
  if(!items.some(it => it.id === S.sensSel)) S.sensSel = (items.find(it => R.rows.some(r => r.id === it.id && r.key)) || items[0] || {}).id;
  sel.innerHTML = items.map(it => `<option value="${it.id}"${it.id === S.sensSel ? " selected" : ""}>${esc(it.label)}</option>`).join("");
  const it = items.find(x => x.id === S.sensSel), out = $("#sensRows"), note = $("#sensNote");
  if(!it){ out.innerHTML = ""; note.textContent = "No uncertain result to analyse in this scenario."; return; }
  const d = sensitivity(it, R);
  if(!d.length){ out.innerHTML = ""; note.textContent = "This result does not vary across the runs (it is capped or fixed), so no input can be ranked."; return; }
  out.innerHTML = `<div class="sens-row sens-hd"><span>Uncertain input</span><span>Strength of the link</span><span>A higher value…</span></div>` + d.map(x => {
    const a = Math.abs(x.rho), minor = a < 0.1;
    return `<div class="sens-row${minor ? " minor" : ""}"><span class="sl">${esc(x.f.label)}</span><span class="sbar" aria-hidden="true"><span class="sfill" style="width:${(a * 100).toFixed(1)}%"></span></span><span class="sv">${minor ? "barely matters" : (x.rho > 0 ? "raises the result" : "lowers the result")} <b>${x.rho >= 0 ? "+" : "−"}${a.toFixed(2)}</b></span></div>`;
  }).join("");
  const top = d[0];
  note.innerHTML = Math.abs(top.rho) >= 0.3 ? `<b>Measure first:</b> ${esc(top.f.meas)} ${esc(top.f.label)} explains the most spread in this result.` : "No single input dominates this result; the spread comes from several inputs together.";
}
const runRow = r => `<div class="runrow"><span>${esc(r.label)}<b>${esc(r.vtxt)} ${esc(r.unit)}</b>${r.mc ? `<small class="rr90">90% range ${fmt(r.mc.p5)}–${fmt(r.mc.p95)}</small>` : ""}</span><span class="pill ${r.status}">${esc(r.tag)}</span></div>`;
function reportText(){
  const R = RES, I = INP, M = METALS[S.metal];
  const L = [];
  L.push(`CHemTrace – screening report · version ${APP_VERSION} (${APP_DATE})`);
  L.push(`${new Date().toISOString().slice(0, 10)}`);
  L.push("");
  L.push(`Metal: ${M.name} (${S.metal}) · form: ${R.form.label}`);
  L.push(`Release: to ${MEDIUM_LBL[I.medium]}, ${soilLike(I) && I.pattern === "pulse" ? fmt(I.amount) + " kg once" : fmt(I.amount) + " kg/yr" + (soilLike(I) ? " for " + fmt(I.duration) + " years" : "")}, horizon ${fmt(I.horizon)} years`);
  L.push(`Site: ${I.preset === "custom" ? (I.siteName ? "map location LV95 " + I.siteName : "custom values") : PRESETS[I.preset].label} · soil pH ${fmt(I.pH)}, OC ${fmt(I.oc)}%, Fe-ox ${fmt(I.fe)} g/kg · aquifer ${I.aq}, redox ${I.redox} · land use ${I.land}`);
  if(I.medium === "air") L.push(`Air: release height ${fmt(I.stackH)} m, wind ${fmt(I.windU)} m/s${I.windFrom !== "" ? ` mostly from ${compass(Number(I.windFrom))} (${fmt(I.windShare)}% of the time)` : ", direction not set"}, particle split ${airSplit(I).map((v, i) => AIR_CLS[i].label + " " + fmtPct(v)).filter(x => !/ 0%$/.test(x)).join(", ")}, forest ${fmtPct(landShares(I).fF)}, sealed ${fmtPct(landShares(I).fS)}, elevation ${fmt(I.elev)} m, background PM10 ${fmt(I.pm10)} µg/m³`);
  if(I.medium === "road") L.push(`Road: ${fmt(I.roadL)} m, ${fmt(I.aadt)} vehicles/day, ${fmt(I.hgv)}% heavy, ${I.roadEra === "leaded" ? "leaded-petrol era" : "today's traffic"}, emission factor ${fmt(roadEF(I, S.metal))} mg per car-km, drainage: ${(DRAIN[I.drainSys] || DRAIN.urban).label}`);
  if(I.medium === "glacier") L.push(`Glacier: ${fmt(I.glArea)} km², ice loss ${fmt(I.glLoss)} m water/yr, ${fmt(I.glConc[S.metal])} ng/g in 1950–1990 ice, ${fmt(I.glShare)}% of the melt from that ice`);
  L.push(`Conditions: ${$("#derivedTxt").textContent} · water regime ${S.water}`);
  L.push("");
  L.push(R.summary);
  L.push("");
  L.push("Results");
  R.rows.forEach(r => L.push(`- ${r.label}: ${r.vtxt} ${r.unit} [${r.tag}]` + (r.mc ? ` (90% range ${fmt(r.mc.p5)}–${fmt(r.mc.p95)}${r.mc.pex != null ? `, ${fmt(r.mc.pex * 100)}% of runs above ${fmt(r.mc.lim)}` : ""})` : "") + ` — ${r.ref}`));
  L.push("");
  const bd = R.bud;
  L.push(`Mass budget after ${bd.T} years (${FLOODS[bd.fk].label.toLowerCase()}), share of the ${fmt(bd.c.rel)} kg released`);
  BUD.forEach(b => { const v = bd.c.B[b.k]; if(v > 0) L.push(`- ${b.label}: ${fmtPct(v / bd.c.rel)} (${fmt(v)} kg; 90% range ${fmtPct(bd.share[b.k].p5)}–${fmtPct(bd.share[b.k].p95)})`); });
  L.push("");
  if(R.forms){
    L.push(`Forms by phase after ${R.forms[0].T} year${R.forms[0].T > 1 ? "s" : ""} (share of all released; main forms)`);
    R.forms.forEach((r, i) => {
      const parts = PHASES.map(p => { const tot = r.tot[p.k]; if(!(tot > 0)) return `${p.label} 0%`; const top = Object.entries(r.F[p.k]).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k, v]) => `${formLabel(S.metal, k, r.origLabel)} ${fmtPct(v / tot)}`).join(", "); return `${p.label} ${fmtPct(tot / r.rel)} (${top})`; });
      L.push(`- ${i + 1}. ${r.sc.label}: ${parts.join("; ")}`);
    });
    L.push("");
  }
  if(SP.act && SP.act.length){
    const s = srcOf(), d = gwDirection();
    L.push(`Where to act (spread map, year ${FRAMES[SP.frame]}; source E ${Math.round(s.E)}, N ${Math.round(s.N)}; groundwater direction ${d ? Math.round(d.az) + "° " + (d.src === "user" ? "set by user" : "from terrain, not set by user") : "not set"})`);
    SP.act.forEach(x => L.push(`- ${x}`));
    L.push("");
  }
  L.push("Main uncertainty drivers (Spearman rank correlation over the Monte Carlo runs)");
  R.sens.filter(it => R.rows.some(r => r.id === it.id && r.key)).forEach(it => { const d = sensitivity(it, R).filter(x => Math.abs(x.rho) >= 0.1).slice(0, 2); if(d.length) L.push(`- ${it.label}: ${d.map(x => `${x.f.label} ${x.rho >= 0 ? "+" : "−"}${Math.abs(x.rho).toFixed(2)}`).join(", ")}`); });
  L.push("");
  L.push("Where and how to trap it");
  R.sugg.forEach(s => L.push(`- ${s}`));
  L.push("");
  L.push("CHemTrace · © 2026 Li-Ling T. ETH Zürich · contact: litail@ethz.ch");
  L.push("Intended use: an overview of the whole system to form assumptions and a first plan of where to act and what to measure; teaching; comparing scenarios. Check the priorities with specialised models (exports for PHREEQC, HYDRUS-1D and MODFLOW 6) and site data. Not for AltlV decisions, remediation design, concentrations or arrival times at a specific well, or individual health-risk assessments.");
  L.push("Screening-level estimate from documented equations (see the page's methods). It does not replace a site investigation. Check limit values against the current text on fedlex.admin.ch.");
  return L.join("\n");
}

function renderAdvOverview(){
  const R = RES;
  panel.innerHTML = `
    <div class="p-bar"><span class="p-zone">Screening run · ${esc(scenText())}</span></div>
    <h2><span class="sym">${S.metal}</span> ${esc(R.title)}</h2>
    <p class="risk">${esc(R.summary)}</p>
    <section><h3>Key results</h3><div class="runlist">${R.rows.filter(r => r.key).map(runRow).join("")}</div></section>
    ${(() => { const c = R.bud.c; const t3 = BUD.map(b => [b, c.rel > 0 ? c.B[b.k] / c.rel : 0]).filter(x => x[1] > 0).sort((x, y) => y[1] - x[1]).slice(0, 3); return t3.length ? `<section><h3>Where it is after ${R.bud.T} yr</h3><div class="runlist">${t3.map(([b, p]) => `<div class="runrow"><span>${esc(b.label)}<b>${fmtPct(p)}</b></span></div>`).join("")}</div></section>` : ""; })()}
    <section><h3>Where to act first</h3><ul class="trap">${R.sugg.slice(0, 3).map(s => `<li>${esc(s)}</li>`).join("")}</ul></section>
    <p class="mini">Hover a compartment for its field guide · <a href="#results">all results and equations</a></p>`;
}
function advBlock(id){
  if(!RES) return "";
  const rs = RES.rows.filter(r => r.comp.includes(id) && (r.key || r.status !== "info")).slice(0, 4);
  return rs.length ? `<div class="yours"><h3>Your scenario here</h3><div class="runlist">${rs.map(runRow).join("")}</div></div>` : "";
}
function drawScene(){
  const bg = $("#badges"), rm = $("#relMark");
  if(!S.adv || !RES){ bg.innerHTML = ""; rm.innerHTML = ""; return; }
  const sym = {ok:"✓", warn:"!", check:"?", crit:"!"};
  bg.innerHTML = Object.entries(RES.compStatus).filter(([c, s]) => BPOS[c] && s !== "info").map(([c, s]) => { const [x, y] = BPOS[c]; return `<g class="bdg ${s}"><circle cx="${x}" cy="${y}" r="10"/><text x="${x}" y="${y + 0.5}">${sym[s]}</text></g>`; }).join("");
  const [x, y] = RES.relPos;
  rm.innerHTML = `<circle class="rel-ring" cx="${x}" cy="${y}" r="14"/><circle class="rel-dot" cx="${x}" cy="${y}" r="5"/>`;
}
/* ================= REDOX LADDER (optional) =================
   Electron balance per litre of water reaching the aquifer (mmol e⁻/L): organic carbon (4 e⁻ per C) is burnt with O₂ (4 e⁻),
   then NO₃⁻ → N₂ (5 e⁻), then Mn(IV) and Fe(III) oxides held by the sediment, then SO₄²⁻ → H₂S (8 e⁻).
   The oxides are a stock, not a flux: the surplus eats them away near the source, so the zone turns sulfidic once they are used up. */
const LAD_ZONE = 10, LAD_RB = 1.8, LAD_PE = {oxic:8, suboxic:4, anoxic:0, sulfidic:-3};
const LAD_LBL = {oxic:"Oxic", suboxic:"Suboxic (nitrate reducing)", anoxic:"Anoxic (Mn and Fe reducing)", sulfidic:"Sulfidic (sulfate reducing)"};
function redoxLadder(I){
  const ne = Math.max(0.005, num(I.ne) || 0.2), T = num(I.budT) || 1;
  const e = {o2:4 * num(I.o2In) / 32, no3:5 * num(I.no3In) / 62, so4:8 * num(I.so4In) / 96, doc:4 * (num(I.docIn) + num(I.docSrc)) / 12};
  const cap = {mn:2 * num(I.aqMn) * 1000 / 54.94 * LAD_RB / ne, fe:num(I.aqFe) * 1000 / 55.85 * LAD_RB / ne};
  const v = num(I.K) * YEAR_S * num(I.grad) / ne;
  const s1 = e.doc - e.o2, s2 = s1 - e.no3;
  let cls, tEx = Infinity, meth = false;
  if(s1 <= 0) cls = "oxic";
  else if(s2 <= 0) cls = "suboxic";
  else {
    tEx = v > 0 ? (cap.mn + cap.fe) / s2 * LAD_ZONE / v : Infinity;
    cls = tEx <= T && e.so4 > 0 ? "sulfidic" : "anoxic";
    meth = tEx <= T && s2 > e.so4;
  }
  let drain = null;
  if(I.satDays !== "" && I.satDays != null && isFinite(Number(I.satDays))){
    const d = num(I.satDays); let k = d < 14 ? 0 : d <= 180 ? 1 : 2;
    if(num(I.oc) < 1 && k > 0) k--;
    drain = ["well", "periodic", "perm"][k];
  }
  return {cls, e, cap, v, s1, s2, tEx, T, meth, drain, pe:LAD_PE[cls]};
}
// with the ladder on, its classes replace the choices on the Soil and Groundwater tabs
function applyLadder(I){
  if(!I || I.rlOn !== "on") return null;
  const L = redoxLadder(I);
  I.redox = L.cls;
  if(L.drain) I.drain = L.drain;
  return L;
}
function ladderText(L){
  const f = x => fmt(Math.max(0, x));
  const bal = `Electron balance, mmol e⁻/L: organic carbon ${f(L.e.doc)} against O₂ ${f(L.e.o2)}, nitrate ${f(L.e.no3)}, sulfate ${f(L.e.so4)}; oxide stock in the sediment Mn ${f(L.cap.mn)}, Fe ${f(L.cap.fe)} per litre of pore water`;
  let how;
  if(L.cls === "oxic") how = "Oxygen is enough to burn all the organic carbon: oxides stay intact.";
  else if(L.cls === "suboxic") how = "Oxygen runs out, nitrate takes the rest: Mn and Fe oxides stay intact.";
  else if(!isFinite(L.tEx)) how = "Organic carbon is left after oxygen and nitrate; with no groundwater flow the oxides are not used up.";
  else how = `Organic carbon is left after oxygen and nitrate. It uses up the Mn and Fe oxides in the first ${LAD_ZONE} m of the aquifer in about ${fmtYr(L.tEx)} years${L.cls === "sulfidic" ? `, within the budget year (${L.T}): sulfate is now reduced${L.meth ? " and runs out too, so methane forms" : ""}` : `, later than the budget year (${L.T}): until then the oxides are being dissolved, and sulfate reduction follows`}.`;
  return {bal, how};
}

const ladderLocks = I => ({redox:I.rlOn === "on", drain:I.rlOn === "on" && I.satDays !== "" && I.satDays != null});
function syncLadderFields(){
  if(typeof document === "undefined") return;
  const lk = ladderLocks(INP);
  ["redox", "drain"].forEach(k => { const el = document.getElementById("f-" + k); if(!el) return; el.value = INP[k]; el.disabled = lk[k]; el.title = lk[k] ? "Set by the redox ladder (Redox tab)" : ""; });
}
function runAdv(){ applyLadder(INP); syncLadderFields(); applyDerived(INP); RES = compute(); deriveConditions(); renderResults(); }
function refreshAll(){ if(S.adv) runAdv(); buildFlows(); render(); drawScene(); }
function saveAdv(){ try{ localStorage.setItem("smp-adv", JSON.stringify({v:1, adv:S.adv, tab:S.tab, inp:INP})); }catch(e){} }

function fieldHTML(f){
  const id = "f-" + f.k, v = f.perMetal ? INP[f.k][S.metal] : INP[f.k];
  const unit = typeof f.unit === "function" ? f.unit(INP) : (f.unit || "");
  const lab = typeof f.label === "function" ? f.label(INP) : f.label;
  let ctl;
  if(f.type === "select"){
    const opts = typeof f.opts === "function" ? f.opts(S.metal) : f.opts;
    const lk = (f.k === "redox" || f.k === "drain") && ladderLocks(INP)[f.k];
    ctl = `<select id="${id}" data-k="${f.k}"${lk ? ' disabled title="Set by the redox ladder (Redox tab)"' : ""}>${opts.map(([val, l]) => `<option value="${val}"${String(v) === String(val) ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  } else {
    ctl = `<input id="${id}" data-k="${f.k}" type="number" step="any" inputmode="decimal" value="${v === "" || v == null ? "" : v}"${f.optional ? ' placeholder="calculated"' : ""}>`;
  }
  return `<div class="fld"><label for="${id}">${esc(lab)}${unit ? `<span class="u">${esc(unit)}</span>` : ""}</label>${ctl}${(typeof f.help === "function" ? f.help(INP) : f.help) ? `<span class="help">${esc(typeof f.help === "function" ? f.help(INP) : f.help)}</span>` : ""}${f.src ? `<span class="src">${esc(f.src)}</span>` : ""}<span class="err" hidden></span></div>`;
}
function renderForm(){
  $("#advTabs").innerHTML = TABS.map(t => `<button role="tab" id="tab-${t.id}" data-tab="${t.id}" aria-selected="${S.tab === t.id}" aria-controls="tp-${t.id}" tabindex="${S.tab === t.id ? 0 : -1}">${esc(t.label)}</button>`).join("");
  $("#advPanels").innerHTML = TABS.map(t => {
    const note = TABNOTES[t.id](INP);
    const fs = FIELDS.filter(f => f.tab === t.id && (!f.show || f.show(INP)));
    return `<div class="fields" role="tabpanel" id="tp-${t.id}" aria-labelledby="tab-${t.id}"${S.tab === t.id ? "" : " hidden"}>${note ? `<p class="tabnote">${esc(note)}</p>` : ""}${fs.map(fieldHTML).join("")}</div>`;
  }).join("");
}
function selectTab(id, focus){
  S.tab = id;
  document.querySelectorAll("#advTabs [role=tab]").forEach(b => { const on = b.dataset.tab === id; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; if(on && focus) b.focus(); });
  document.querySelectorAll("#advPanels [role=tabpanel]").forEach(p => { p.hidden = p.id !== "tp-" + id; });
  saveAdv();
}
function advMetalChanged(){
  if(!FORMS[S.metal].some(f => f.id === INP.form)){ const f = FORMS[S.metal][0]; INP.form = f.id; INP.reactive = f.fr; }
  if(INP.medium === "road" && S.metal !== "Pb") INP.medium = "soil";
  $("#presetSel").value = INP.preset;
  $("#loadExample").textContent = "Load example: " + EXAMPLES[S.metal].short;
  renderForm();
}
function validate(f, v){
  if(!isFinite(v)) return "Enter a number.";
  if(f.gt != null && v <= f.gt) return `Must be greater than ${f.gt}.`;
  if(f.min != null && v < f.min) return `Must be at least ${f.min}.`;
  if(f.max != null && v > f.max) return `Must be at most ${f.max}.`;
  return "";
}
function sanitize(src){
  const out = freshInputs(src && PRESETS[src.preset] ? src.preset : "plateau");
  if(!src || typeof src !== "object") return out;
  if(src.preset === "custom") out.preset = "custom";
  if(typeof src.siteName === "string") out.siteName = src.siteName.slice(0, 80);
  for(const f of FIELDS){
    const v = src[f.k]; if(v === undefined) continue;
    if(f.perMetal){ if(v && typeof v === "object") ["As","Hg","Pb"].forEach(mm => { if(typeof v[mm] === "number" && !validate(f, v[mm])) out[f.k][mm] = v[mm]; }); continue; }
    if(f.type === "select"){
      if(f.k === "form"){ if(typeof v === "string") out.form = v; }
      else if((typeof f.opts === "function" ? f.opts(S.metal) : f.opts).some(o => o[0] === v)) out[f.k] = v;
      continue;
    }
    if(f.optional && v === ""){ out[f.k] = ""; continue; }
    if(typeof v === "number" && !validate(f, v)) out[f.k] = v;
  }
  if(BUD_T.includes(src.budT)) out.budT = src.budT;
  if(FLOODS[src.flood]) out.flood = src.flood;
  if(src.mapLim === "tbdv" || src.mapLim === "altl") out.mapLim = src.mapLim;
  if(src.slopeSrc === "terrain") out.slopeSrc = "terrain";
  return out;
}
let advTimer = 0;
function schedule(){ clearTimeout(advTimer); advTimer = setTimeout(() => { refreshAll(); saveAdv(); }, 140); }
const fieldDef = k => FIELDS.find(f => f.k === k);
function setVal(f, v){ if(f.perMetal) INP[f.k][S.metal] = v; else INP[f.k] = v; }
function markCustom(k){
  if(!SITE_KEYS.has(k) || INP.preset === "custom") return;
  INP.preset = "custom"; $("#presetSel").value = "custom";
  const n = document.querySelector("#tp-site .tabnote"); if(n) n.textContent = TABNOTES.site(INP);
}
function setMode(adv, quiet){
  S.adv = adv;
  $("#modeSeg").querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", String((b.dataset.mode === "advanced") === adv)));
  $("#adv").hidden = !adv; $("#results").hidden = !adv;
  $("#ctlRedox").hidden = adv; $("#ctlPh").hidden = adv; $("#ctlDerived").hidden = !adv;
  if(adv){ if(!INP) loadExample(false); advMetalChanged(); showMapIfNeeded(); }
  else {
    S.redox = document.querySelector('.seg[data-key="redox"] [aria-checked="true"]').dataset.v;
    S.ph = document.querySelector('.seg[data-key="ph"] [aria-checked="true"]').dataset.v;
    RES = null;
  }
  S.pinned = null; S.hover = null;
  if(!quiet){ refreshAll(); saveAdv(); }
}
function initAdv(){
  $("#presetSel").innerHTML = Object.entries(PRESETS).map(([id, p]) => `<option value="${id}">${esc(p.label)}</option>`).join("") + `<option value="custom">Custom values</option>`;
  $("#methods").innerHTML = METHODS_HTML();
  $("#modeSeg").addEventListener("click", e => { const b = e.target.closest("button"); if(b && (b.dataset.mode === "advanced") !== S.adv) setMode(b.dataset.mode === "advanced"); });
  $("#goAdv").addEventListener("click", () => { if(!S.adv) setMode(true); $("#adv").scrollIntoView({behavior: reduceMotion ? "auto" : "smooth", block:"start"}); });
  $("#applyPreset").addEventListener("click", () => {
    const id = $("#presetSel").value; if(!PRESETS[id]) return;
    Object.assign(INP, clone(PRESETS[id].v), {preset:id, siteName:"", srcE:"", srcN:""}); renderForm(); refreshAll(); saveAdv();
  });
  $("#loadExample").addEventListener("click", () => loadExample(true));
  $("#budTSeg").innerHTML = BUD_T.map(t => `<button role="radio" aria-checked="false" data-t="${t}">${t} yr</button>`).join("");
  $("#floodSel").innerHTML = Object.entries(FLOODS).map(([k, f]) => `<option value="${k}">${esc(f.label)}</option>`).join("");
  $("#budTSeg").addEventListener("click", e => { const b = e.target.closest("button[data-t]"); if(!b || Number(b.dataset.t) === INP.budT) return; INP.budT = Number(b.dataset.t); refreshAll(); saveAdv(); });
  $("#floodSel").addEventListener("change", e => { INP.flood = e.target.value; refreshAll(); saveAdv(); });
  $("#sensSel").addEventListener("change", e => { S.sensSel = e.target.value; renderSens(); });
  $("#advTabs").addEventListener("click", e => { const b = e.target.closest("[data-tab]"); if(b) selectTab(b.dataset.tab); });
  $("#advTabs").addEventListener("keydown", e => {
    if(e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const ids = TABS.map(t => t.id); let i = ids.indexOf(S.tab) + (e.key === "ArrowRight" ? 1 : -1); i = (i + ids.length) % ids.length;
    e.preventDefault(); selectTab(ids[i], true);
  });
  $("#advPanels").addEventListener("input", e => {
    const el = e.target, k = el.dataset && el.dataset.k; if(!k || el.tagName !== "INPUT") return;
    const f = fieldDef(k), box = el.closest(".fld"), err = box.querySelector(".err"), raw = el.value.trim();
    let msg = "";
    if(raw === "" && f.optional) setVal(f, "");
    else { const v = raw === "" ? NaN : Number(raw); msg = validate(f, v); if(!msg) setVal(f, v); }
    box.classList.toggle("bad", !!msg); err.textContent = msg; err.hidden = !msg;
    if(msg) return;
    if(k === "slope") INP.slopeSrc = "";
    markCustom(k); schedule();
  });
  $("#advPanels").addEventListener("change", e => {
    const el = e.target, k = el.dataset && el.dataset.k; if(!k || el.tagName !== "SELECT") return;
    const f = fieldDef(k); setVal(f, el.value); markCustom(k);
    if(k === "form"){ const fo = formOf(); INP.reactive = fo.fr; }
    if(k === "medium" && INP.medium === "road" && S.metal === "Pb" && INP.form === "pb2"){ INP.form = "pbo"; INP.reactive = formOf().fr; }
    if(f.structural){ renderForm(); const n = document.getElementById("f-" + k); if(n) n.focus(); }
    schedule();
  });
  $("#copyJson").addEventListener("click", () => {
    const txt = JSON.stringify({app:"chemtrace", version:1, appVersion:APP_VERSION, metal:S.metal, inputs:INP}, null, 2), btn = $("#copyJson");
    const show = () => { $("#jsonBox").hidden = false; $("#jsonTxt").value = txt; $("#jsonTxt").focus(); $("#jsonTxt").select(); $("#jsonMsg").textContent = "Copy the selected text."; };
    try{ navigator.clipboard.writeText(txt).then(() => { btn.textContent = "Copied"; setTimeout(() => { btn.textContent = "Copy inputs"; }, 1600); }, show); }catch(e){ show(); }
  });
  $("#further").addEventListener("click", e => {
    const b = e.target.closest("button[data-x]"); if(!b || b.disabled) return;
    const x = EXPORTS[b.dataset.x];
    try{ downloadText(x.file(S.metal), x.make(), x.type); }
    catch(err){ const n = $("#furtherNote"); n.hidden = false; n.textContent = "Could not build the file: " + err.message; }
  });
  $("#copyReport").addEventListener("click", () => {
    const txt = reportText(), btn = $("#copyReport");
    const show = () => { $("#jsonBox").hidden = false; $("#jsonTxt").value = txt; $("#jsonTxt").focus(); $("#jsonTxt").select(); $("#jsonMsg").textContent = "Copy the selected report text."; };
    try{ navigator.clipboard.writeText(txt).then(() => { btn.textContent = "Report copied"; setTimeout(() => { btn.textContent = "Copy report"; }, 1600); }, show); }catch(e){ show(); }
  });
  $("#pasteJson").addEventListener("click", () => { $("#jsonBox").hidden = false; $("#jsonTxt").value = ""; $("#jsonTxt").focus(); $("#jsonMsg").textContent = "Paste inputs copied from this page, then Apply."; });
  $("#jsonClose").addEventListener("click", () => { $("#jsonBox").hidden = true; });
  $("#jsonApply").addEventListener("click", () => {
    let o; try{ o = JSON.parse($("#jsonTxt").value); }catch(e){ $("#jsonMsg").textContent = "That is not valid JSON."; return; }
    const src = o && o.inputs ? o.inputs : o;
    const n = src && typeof src === "object" ? FIELDS.filter(f => src[f.k] !== undefined).length : 0;
    if(!n){ $("#jsonMsg").textContent = "No matching inputs found."; return; }
    INP = sanitize(src);
    if(o.metal && METALS[o.metal] && o.metal !== S.metal) setMetal(o.metal); else { advMetalChanged(); refreshAll(); }
    saveAdv(); $("#jsonMsg").textContent = `Applied ${n} inputs.`;
  });
  let saved = null; try{ saved = JSON.parse(localStorage.getItem("smp-adv") || "null"); }catch(e){}
  if(saved && saved.v === 1 && saved.inp && typeof saved.inp === "object"){ INP = sanitize(saved.inp); if(TABS.some(t => t.id === saved.tab)) S.tab = saved.tab; }
  return location.hash === "#advanced" || !!(saved && saved.adv);
}

/* ================= SITE LOOKUP (map + Swiss data grid) ================= */
const GRID = {meta:null, layers:{}, ok:null};
// Geochemical soil atlas (Agroscope/FOEN): topsoil 0-20 cm percentiles, mg/kg (Reusser, soil.ch presentation)
const ATLAS_PCT = {As:{p:[2.7,5.5,7.9,12.1,35.2], tif:40}, Hg:{p:[0.027,0.046,0.066,0.097,0.181], tif:0.302}, Pb:{p:[13,19,24,31,52], tif:64}};
const CLASS_LBL = ["", "lowest 5%", "5–10th percentile", "10–25th percentile", "25–50th percentile", "50–75th percentile", "75–90th percentile", "90–95th percentile", "highest 5%"];
const FE_OX = [null, 1.5, 2, 2.5, 3.5, 4.5, 6, 7.5, 9]; // assumed oxalate-Fe (g/kg) per total-Fe percentile class
const HYDRO = {
  1:{lbl:"Very productive aquifer in a valley floor (gravel)", aq:"porous", K:3e-3, ne:0.2},
  2:{lbl:"Productive aquifer, partly outside valley floors", aq:"porous", K:1e-3, ne:0.2},
  3:{lbl:"Less productive loose-rock aquifer (e.g. moraine)", aq:"porous", K:1e-4, ne:0.15},
  4:{lbl:"Karst aquifer", aq:"karst", K:5e-3, ne:0.02},
  5:{lbl:"Less productive fractured or porous bedrock", aq:"fractured", K:1e-6, ne:0.01},
  6:{lbl:"No productive groundwater", aq:"fractured", K:1e-7, ne:0.01},
  7:{lbl:"Glacier or firn", aq:null}, 8:{lbl:"Lake or river", aq:null}};
const ROCK = {1:"Loose sediments", 2:"Sedimentary rock", 3:"Magmatic rock", 4:"Metamorphic rock", 5:"Glacier", 6:"Water"};
const LU4 = {1:{lbl:"Settlement", land:"garden"}, 2:{lbl:"Agriculture", land:"agri"}, 3:{lbl:"Forest and woodland", land:"forest"}, 4:{lbl:"Unproductive (rock, water, glacier)", land:"forest"}};
let SITE = null, map = null, mapMarker = null;

function atlasValue(m, c){
  const t = ATLAS_PCT[m]; if(!t || !c) return null;
  const [p5, p25, p50, p75, p95] = t.p, ln = Math.log, g = (a, b) => Math.sqrt(a * b);
  const p10 = Math.exp(ln(p5) + 0.376 * (ln(p25) - ln(p5))), p90 = Math.exp(ln(p75) + 0.626 * (ln(p95) - ln(p75)));
  return [null, p5 * 0.8, g(p5, p10), g(p10, p25), g(p25, p50), g(p50, p75), g(p75, p90), g(p90, p95), g(p95, t.tif)][c];
}
async function loadGrid(){
  if(GRID.ok !== null) return GRID.ok;
  try{
    const [m, b] = await Promise.all([fetch("data/grid.json").then(r => { if(!r.ok) throw 0; return r.json(); }), fetch("data/grid.bin").then(r => { if(!r.ok) throw 0; return r.arrayBuffer(); })]);
    const n = m.ncols * m.nrows;
    m.layers.forEach(L0 => { GRID.layers[L0.name] = {spec:L0, arr: L0.type === "u8" ? new Uint8Array(b, L0.byteOffset, n) : L0.type === "u16" ? new Uint16Array(b, L0.byteOffset, n) : new Int16Array(b, L0.byteOffset, n)}; });
    GRID.meta = m; GRID.ok = true;
  }catch(e){ GRID.ok = false; }
  return GRID.ok;
}
function sampleGrid(name, E, N, search){
  const g = GRID.layers[name]; if(!g) return null;
  const m = GRID.meta, s = g.spec, c0 = Math.floor((E - m.x0) / m.res), r0 = Math.floor((m.y1 - N) / m.res);
  for(let d = 0; d <= (search == null ? 2 : search); d++){
    let best = null, bd = 1e9;
    for(let dr = -d; dr <= d; dr++) for(let dc = -d; dc <= d; dc++){
      if(Math.max(Math.abs(dr), Math.abs(dc)) !== d) continue;
      const r = r0 + dr, c = c0 + dc; if(r < 0 || c < 0 || r >= m.nrows || c >= m.ncols) continue;
      const v = g.arr[r * m.ncols + c]; if(v === s.nodata) continue;
      const dd = dr * dr + dc * dc; if(dd < bd){ bd = dd; best = (v - s.offset) / s.scale; }
    }
    if(best !== null) return {v:best, km:d};
  }
  return null;
}
// swisstopo approximate formulas (accuracy about 1 m)
function wgsToLv95(lat, lng){
  const p = (lat * 3600 - 169028.66) / 10000, l = (lng * 3600 - 26782.5) / 10000;
  return {E: 2600072.37 + 211455.93 * l - 10938.51 * l * p - 0.36 * l * p * p - 44.54 * l * l * l,
          N: 1200147.07 + 308807.95 * p + 3745.25 * l * l + 76.63 * p * p - 194.56 * l * l * p + 119.79 * p * p * p};
}
function lv95ToWgs(E, N){
  const y = (E - 2600000) / 1e6, x = (N - 1200000) / 1e6;
  const l = 2.6779094 + 4.728982 * y + 0.791484 * y * x + 0.1306 * y * x * x - 0.0436 * y * y * y;
  const p = 16.9023892 + 3.238272 * x - 0.270978 * y * y - 0.002528 * x * x - 0.0447 * y * y * x - 0.0140 * x * x * x;
  return {lat: p * 100 / 36, lng: l * 100 / 36};
}
function readSite(E, N){
  const v = k => { const s = sampleGrid(k, E, N); return s ? s.v : null; };
  const site = {E:Math.round(E), N:Math.round(N), precip:v("precip"), temp:v("temp"), ph:v("ph"), clay:v("clay"), soc:v("soc"),
    hydro:v("hydro"), rock:v("rock"), lu4:v("lu4"), luSet:v("lu_set"), pm10:v("pm10"), pm25:v("pm25"), atl:{}};
  ["As","Pb","Hg","Sb","Fe","Ca"].forEach(k => { site.atl[k] = v("atl_" + k); });
  site.oc = site.soc != null ? site.soc / 60 : null;
  site.inside = site.precip != null && E > 2480000 && E < 2840000 && N > 1070000 && N < 1300000;
  return site;
}
const r2 = x => x == null ? null : Math.round(x * 100) / 100;
function siteRows(s){
  const rows = [];
  const add = (k, v, src) => rows.push(`<tr><td>${esc(k)}</td><td>${v}</td><td>${esc(src)}</td></tr>`);
  add("Coordinates", `E ${s.E.toLocaleString("de-CH")}, N ${s.N.toLocaleString("de-CH")}`, "LV95");
  add("Elevation", `<span id="spElev">…</span>`, "swisstopo");
  add("Precipitation", s.precip != null ? `${fmt(s.precip)} mm/yr` : "–", "MeteoSwiss 1991–2020");
  add("Mean temperature", s.temp != null ? `${fmt(s.temp)} °C` : "–", "MeteoSwiss 1991–2020");
  add("Soil pH (0–30 cm)", s.ph != null ? fmt(s.ph) : "–", "KOBO 2022");
  add("Clay (0–30 cm)", s.clay != null ? `${fmt(s.clay)} %` : "–", "KOBO 2022");
  add("Organic carbon", s.oc != null ? `≈ ${fmt(s.oc)} % (from ${fmt(s.soc)} t/ha, 0–120 cm)` : "– (no soil map in settlements)", "KOBO 2022, converted");
  add("Aquifer", s.hydro && HYDRO[s.hydro] ? esc(HYDRO[s.hydro].lbl) : "–", "Hydrogeological map 1:500,000");
  add("Bedrock", s.rock && ROCK[s.rock] ? esc(ROCK[s.rock]) : "–", "Hydrogeological map 1:500,000");
  add("Land use", s.lu4 && LU4[s.lu4] ? `${esc(LU4[s.lu4].lbl)}${s.luSet != null && s.lu4 !== 1 && s.luSet > 20 ? ` (${fmt(s.luSet)}% settlement)` : ""}` : "–", "BFS land-use statistics");
  ["As","Pb","Hg"].forEach(k => { const c = s.atl[k]; add(`Background ${k}`, c ? `≈ ${fmt(atlasValue(k, c))} mg/kg <span class="mini">(${CLASS_LBL[c]})</span>` : "–", "Geochemical soil atlas"); });
  ["Sb","Fe","Ca"].forEach(k => { const c = s.atl[k]; add(`${({Sb:"Antimony", Fe:"Iron", Ca:"Calcium"})[k]} in topsoil`, c ? CLASS_LBL[c] : "–", "Geochemical soil atlas"); });
  add("Fine dust PM10 / PM2.5", s.pm10 != null ? `${fmt(s.pm10)} / ${fmt(s.pm25)} µg/m³ <span class="mini">(LRV 20 / 10)</span>` : "–", "FOEN annual maps, mean 2023–2025");
  const nb = NABEL.map(st => [st, Math.hypot(st.E - s.E, st.N - s.N)]).sort((a, b) => a[1] - b[1])[0];
  if(nb) add("Nearest NABEL station", `${esc(nb[0].n)} (${esc(nb[0].t)}), ${fmt(nb[1] / 1000)} km: Pb in PM10 ${fmt(nb[0].pbPM)} ng/m³${nb[0].pbDep != null ? `, Pb deposition ${fmt(nb[0].pbDep)} µg/(m²·d)` : ""}`, "NABEL 2024 (BAFU/Empa)");
  return rows.join("");
}
function showSite(s){
  SITE = s;
  const info = $("#spInfo"), btn = $("#spApply");
  if(!s.inside){ info.innerHTML = `<p>This point is outside the Swiss data grid. Pick a place in Switzerland.</p>`; btn.disabled = true; return; }
  const notes = [];
  if(s.rock === 3 || s.rock === 4) notes.push("Crystalline bedrock: springs and wells can carry natural arsenic (NAQUA).");
  if(s.atl.Ca >= 6) notes.push("High soil calcium: probably calcareous, which keeps lead immobile.");
  if(s.hydro === 4) notes.push("Karst: water can travel from the surface to springs within days.");
  info.innerHTML = `<table class="sp-table"><tbody>${siteRows(s)}</tbody></table>${notes.length ? `<ul class="sp-notes">${notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}<p class="mini">1 km grid; values are regional estimates, not measurements at this spot.</p>`;
  btn.disabled = false;
  $("#spE").value = s.E; $("#spN").value = s.N;
  fetch(`https://api3.geo.admin.ch/rest/services/height?easting=${s.E}&northing=${s.N}&sr=2056`).then(r => r.json()).then(j => {
    const el = document.getElementById("spElev"); if(el) el.textContent = j && j.height != null ? `${fmt(Number(j.height))} m a.s.l.` : "–";
    if(j && j.height != null && SITE === s) s.elev = Math.round(Number(j.height));
  }).catch(() => { const el = document.getElementById("spElev"); if(el) el.textContent = "not available offline"; });
  if(map){
    const ll = lv95ToWgs(s.E, s.N);
    if(mapMarker) mapMarker.setLatLng([ll.lat, ll.lng]);
    else mapMarker = window.L.circleMarker([ll.lat, ll.lng], {radius:8, className:"sp-marker"}).addTo(map);
  }
}
async function pickLv95(E, N){
  const ok = await loadGrid();
  if(!ok){ $("#spInfo").innerHTML = `<p>The Swiss data grid (data/grid.bin) could not be loaded. Open the site through a web server, not as a local file.</p>`; return; }
  showSite(readSite(E, N));
}
function applySite(){
  const s = SITE; if(!s || !s.inside) return;
  const m = S.metal;
  if(s.precip != null) INP.precip = Math.round(s.precip);
  if(s.ph != null) INP.pH = Math.round(s.ph * 10) / 10;
  if(s.oc != null) INP.oc = Math.round(s.oc * 10) / 10;
  if(s.atl.Fe) INP.fe = FE_OX[s.atl.Fe];
  ["As","Pb","Hg"].forEach(k => { const c = s.atl[k]; if(c){ const v = atlasValue(k, c); INP.bg[k] = Number(v.toPrecision(2)); } });
  const h = HYDRO[s.hydro];
  if(h && h.aq){ INP.aq = h.aq; INP.K = h.K; INP.ne = h.ne; }
  if(s.lu4 && LU4[s.lu4]) INP.land = LU4[s.lu4].land;
  if(s.pm10 != null){ INP.pm10 = Math.round(s.pm10 * 10) / 10; INP.pm25 = Math.round(s.pm25 * 10) / 10; }
  if(s.elev != null) INP.elev = s.elev;
  INP.preset = "custom"; INP.siteName = `E ${s.E}, N ${s.N}`; INP.srcE = s.E; INP.srcN = s.N;
  $("#presetSel").value = "custom";
  renderForm(); refreshAll(); saveAdv();
  $("#spApply").textContent = "Inputs filled ✓";
  setTimeout(() => { $("#spApply").textContent = "Fill inputs from this site"; }, 1800);
}
function initMap(){
  if(map || typeof window.L === "undefined" || !document.getElementById("spMap")) return;
  const LF = window.L;
  map = LF.map("spMap", {minZoom:7, maxZoom:17, maxBounds:[[45.4, 5.4], [48.2, 11.0]], maxBoundsViscosity:0.8}).setView([46.82, 8.23], 7);
  LF.tileLayer("https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg",
    {maxZoom:18, attribution:'© <a href="https://www.swisstopo.admin.ch/" target="_blank" rel="noopener">swisstopo</a>'}).addTo(map);
  map.on("click", e => { const p = wgsToLv95(e.latlng.lat, e.latlng.lng); pickLv95(p.E, p.N); });
  if(SITE && SITE.inside){ const ll = lv95ToWgs(SITE.E, SITE.N); mapMarker = LF.circleMarker([ll.lat, ll.lng], {radius:8, className:"sp-marker"}).addTo(map); }
}
function initSite(){
  $("#spGo").addEventListener("click", () => {
    const E = Number($("#spE").value), N = Number($("#spN").value);
    if(!(E > 2400000 && E < 2900000 && N > 1000000 && N < 1350000)){ $("#spInfo").innerHTML = "<p>Enter LV95 coordinates, for example E 2634000, N 1127500 (Visp).</p>"; return; }
    pickLv95(E, N);
    if(map){ const ll = lv95ToWgs(E, N); map.setView([ll.lat, ll.lng], Math.max(map.getZoom(), 11)); }
  });
  $("#spApply").addEventListener("click", applySite);
}
function showMapIfNeeded(){
  if(!S.adv) return;
  initMap();
  if(map) setTimeout(() => map.invalidateSize(), 60);
  initSpreadMap();
  if(SP.map) setTimeout(() => { SP.map.invalidateSize(); renderSpread(); }, 80);
}

/* ================= BUDGET OVER TIME (chart) ================= */
const SERIES_T = [0.5, 1, 2, 3, 5, 7, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
// fixed slot per compartment group, so a colour always means the same place (validated categorical order)
const SER_G = [
  {k:"top", label:"At the source: topsoil, snow, leaves", keys:["top", "snow", "litter"]},
  {k:"down", label:"Soil elsewhere and treatment sludge", keys:["down", "fp", "regDep", "treat"]},
  {k:"sub", label:"Below the root zone", keys:["sub"]},
  {k:"gw", label:"Groundwater", keys:["gwD", "gwS"]},
  {k:"lakeW", label:"Lake water", keys:["lakeW"]},
  {k:"sed", label:"Lake sediment", keys:["sed"]},
  {k:"out", label:"Downstream past the lake", keys:["out"]},
  {k:"air", label:"Air and other losses", keys:["air", "rem", "evas", "reEm"]}
];
function renderSeries(){
  const box = $("#serChart"); if(!box || !RES || !RES.ser) return;
  const ser = RES.ser.filter(p => p.rel > 0);
  if(!ser.length){ box.innerHTML = ""; return; }
  const val = (p, g) => g.keys.reduce((a, k) => a + p.B[k], 0) / p.rel;
  const LO = 1e-5, groups = SER_G.map((g, i) => ({...g, slot:i + 1, v:ser.map(p => val(p, g))})).filter(g => g.v.some(v => v > LO));
  const W = Math.round(Math.max(300, Math.min(860, box.clientWidth || 760))), H = W < 520 ? 230 : 260, ml = 58, mr = 14, mt = 12, mb = 34, pw = W - ml - mr, ph = H - mt - mb;
  if(!renderSeries.bound){ renderSeries.bound = true; let tm = 0; window.addEventListener("resize", () => { clearTimeout(tm); tm = setTimeout(() => { if(S.adv && RES) renderSeries(); }, 200); }); }
  const X = t => ml + t / 100 * pw, L0 = Math.log10(LO), Y = v => mt + (1 - (Math.log10(Math.max(v, LO)) - L0) / (0 - L0)) * ph;
  const yt = [[1e-5, "0.001%"], [1e-4, "0.01%"], [1e-3, "0.1%"], [1e-2, "1%"], [1e-1, "10%"], [1, "100%"]].map(([v, lb]) => `<g class="sc-tick"><line x1="${ml}" x2="${W - mr}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}"/><text x="${ml - 8}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end">${lb}</text></g>`).join("");
  const xt = (W < 520 ? [0, 25, 50, 75, 100] : [0, 10, 25, 50, 75, 100]).map(t => `<text class="sc-x" x="${X(t).toFixed(1)}" y="${H - 12}" text-anchor="middle">${t}</text>`).join("");
  const lines = groups.map(g => `<polyline class="sc-line s${g.slot}" points="${ser.map((p, i) => `${X(p.t).toFixed(1)},${Y(g.v[i]).toFixed(1)}`).join(" ")}"/>`).join("");
  box.innerHTML = `<div class="sc-legend">${groups.map(g => `<span><i class="sw s${g.slot}"></i>${esc(g.label)}</span>`).join("")}</div>
    <div class="sc-plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Share of the released metal in each place over 100 years, logarithmic scale">${yt}${xt}<text class="sc-x" x="${ml + pw / 2}" y="${H - 1}" text-anchor="middle">years since the release started</text>${lines}<line class="sc-cross" id="scCross" x1="0" x2="0" y1="${mt}" y2="${mt + ph}" visibility="hidden"/><rect class="sc-hit" x="${ml}" y="${mt}" width="${pw}" height="${ph}"/></svg><div class="sc-tip" id="scTip" hidden></div></div>
    <details class="sc-table"><summary>Show as a table</summary><div class="tbl-wrap"><table><thead><tr><th>Year</th>${groups.map(g => `<th>${esc(g.label)}</th>`).join("")}</tr></thead><tbody>${ser.map((p, i) => `<tr><td>${p.t}</td>${groups.map(g => `<td>${fmtPct(g.v[i])}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`;
  const svg = box.querySelector("svg"), hit = box.querySelector(".sc-hit"), cross = $("#scCross"), tip = $("#scTip");
  const show = ev => {
    const r = svg.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width * W;
    let bi = 0; ser.forEach((p, i) => { if(Math.abs(X(p.t) - x) < Math.abs(X(ser[bi].t) - x)) bi = i; });
    const p = ser[bi]; cross.setAttribute("x1", X(p.t)); cross.setAttribute("x2", X(p.t)); cross.setAttribute("visibility", "visible");
    tip.hidden = false; tip.innerHTML = `<b>Year ${p.t}</b>` + groups.map(g => `<span><i class="sw s${g.slot}"></i>${esc(g.label)} <b>${fmtPct(g.v[bi])}</b></span>`).join("");
    const left = X(p.t) / W * r.width; tip.style.left = Math.min(Math.max(0, left + 12), r.width - tip.offsetWidth - 4) + "px";
  };
  hit.addEventListener("pointermove", show); hit.addEventListener("pointerdown", show);
  hit.addEventListener("pointerleave", () => { cross.setAttribute("visibility", "hidden"); tip.hidden = true; });
}

/* ================= SPREAD MAP: where to act over time ================= */
const SRC_DEF = {visp:[2634000, 1127500, "Visp"], plateau:[2612900, 1214950, "Kirchberg (BE)"], jura:[2553000, 1217000, "La Chaux-de-Fonds"], ticino:[2706350, 1096670, "Astano (TI)"]};
const FRAMES = BUD_T;
const SP = {map:null, ov:{}, terrain:null, tKey:"", tState:"idle", tMsg:"", frame:null, playing:false, timer:0, mode:"", cache:null, fitKey:"", act:[]};
const COMPASS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
const compass = a => COMPASS[Math.round(((a % 360) + 360) % 360 / 22.5) % 16];
function srcOf(){
  if(num(INP.srcE) && num(INP.srcN)) return {E:Number(INP.srcE), N:Number(INP.srcN), label:INP.siteName && INP.preset === "custom" ? "your site" : "your location", def:false};
  const d = SRC_DEF[INP.preset] || SRC_DEF.plateau;
  return {E:d[0], N:d[1], label:d[2] + " (preset place)", def:true};
}
const toLL = (E, N) => { const w = lv95ToWgs(E, N); return [w.lat, w.lng]; };
async function loadTerrain(E, N){
  const key = `${Math.round(E / 25) * 25},${Math.round(N / 25) * 25}`;
  if(SP.tKey === key && (SP.tState === "ok" || SP.tState === "loading")) return;
  SP.tKey = key; SP.tState = "loading"; SP.terrain = null; SP.tMsg = "Loading terrain and streams from swisstopo…"; renderSpreadStatus();
  const n = 49, step = 50, half = (n - 1) / 2 * step, x0 = E - half, y0 = N - half, Z = new Float32Array(n * n).fill(NaN);
  try{
    let next = 0, done = 0;
    const worker = async () => {
      while(next < n){
        const j = next++, y = y0 + j * step;
        const geom = JSON.stringify({type:"LineString", coordinates:[[x0, y], [x0 + 2 * half, y]]});
        const r = await fetch(`https://api3.geo.admin.ch/rest/services/profile.json?sr=2056&nb_points=${n}&geom=${encodeURIComponent(geom)}`);
        if(!r.ok) throw new Error("terrain " + r.status);
        (await r.json()).forEach(p => { const i = Math.round(p.dist / step); const z = p.alts && (p.alts.COMB != null ? p.alts.COMB : p.alts.DTM25); if(i >= 0 && i < n && z != null) Z[j * n + i] = z; });
        done++; if(done % 7 === 0 && SP.tKey === key){ SP.tMsg = `Loading terrain from swisstopo… ${Math.round(done / n * 100)}%`; renderSpreadStatus(); }
      }
    };
    await Promise.all(Array.from({length:8}, worker));
    const env = [x0, y0, x0 + 2 * half, y0 + 2 * half].join(",");
    let rivers = [];
    try{
      const r = await fetch(`https://api3.geo.admin.ch/rest/services/api/MapServer/identify?geometry=${env}&geometryType=esriGeometryEnvelope&layers=all:ch.swisstopo.vec25-gewaessernetz_referenz&mapExtent=${env}&imageDisplay=600,600,96&tolerance=0&sr=2056&returnGeometry=true&geometryFormat=geojson&limit=200`);
      const j = await r.json();
      (j.results || []).forEach(f => { const g = f.geometry; if(!g) return; const parts = g.type === "MultiLineString" ? g.coordinates : g.type === "LineString" ? [g.coordinates] : []; parts.forEach(c => rivers.push({c, name:(f.properties && f.properties.name || "").trim(), kind:f.properties && f.properties.objectval_de || ""})); });
    }catch(e){ rivers = null; }
    for(let k = 0; k < Z.length; k++) if(isNaN(Z[k])){ const i = k % n, j = (k - i) / n; const nb = [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]].map(([a, b]) => a >= 0 && a < n && b >= 0 && b < n ? Z[b * n + a] : NaN).filter(v => !isNaN(v)); if(nb.length) Z[k] = nb.reduce((a, b) => a + b, 0) / nb.length; }
    if(SP.tKey !== key) return;
    SP.terrain = deriveTerrain({E, N, n, step, x0, y0, Z, rivers}); SP.tState = "ok"; SP.tMsg = "";
    // apply the slope only at a real location; the preset places are illustrative
    if(srcOf().def){ if(INP.slopeSrc === "terrain"){ INP.slope = ""; INP.slopeSrc = ""; renderForm(); refreshAll(); saveAdv(); return; } }
    else if(!num(INP.slope) || INP.slopeSrc === "terrain"){
      const sl = Math.round(SP.terrain.slope * 10) / 10;
      if(String(INP.slope) !== String(sl)){ INP.slope = sl; INP.slopeSrc = "terrain"; renderForm(); refreshAll(); saveAdv(); return; }
    }
    renderSpread();
  }catch(e){
    if(SP.tKey !== key) return;
    SP.tState = "fail"; SP.tMsg = "The swisstopo terrain service could not be reached, so slope, runoff path and terrain direction are missing. Set the groundwater direction yourself."; renderSpread();
  }
}
function deriveTerrain(T){
  const {n, step, Z, x0, y0} = T, c = (n - 1) / 2, z = (i, j) => Z[j * n + i];
  const gx = (z(c + 1, c) - z(c - 1, c)) / (2 * step), gy = (z(c, c + 1) - z(c, c - 1)) / (2 * step);
  const slope = Math.hypot(gx, gy) * 100, aspect = (Math.atan2(-gx, -gy) * 180 / Math.PI + 360) % 360;
  // plane fitted to the terrain within 1 km: a stand-in for the water-table slope
  let sx = 0, sy = 0, sz = 0, sxx = 0, syy = 0, sxy = 0, sxz = 0, syz = 0, cnt = 0;
  for(let j = 0; j < n; j++) for(let i = 0; i < n; i++){
    const dx = (i - c) * step, dy = (j - c) * step; if(dx * dx + dy * dy > 1e6) continue; const v = z(i, j); if(isNaN(v)) continue;
    sx += dx; sy += dy; sz += v; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; sxz += dx * v; syz += dy * v; cnt++;
  }
  const mx = sx / cnt, my = sy / cnt, mz = sz / cnt, cxx = sxx / cnt - mx * mx, cyy = syy / cnt - my * my, cxy = sxy / cnt - mx * my, cxz = sxz / cnt - mx * mz, cyz = syz / cnt - my * mz;
  const det = cxx * cyy - cxy * cxy, b = (cxz * cyy - cyz * cxy) / det, d = (cyz * cxx - cxz * cxy) / det;
  const planeAz = (Math.atan2(-b, -d) * 180 / Math.PI + 360) % 360, planeGrad = Math.hypot(b, d);
  // runoff path: steepest descent until a stream, a hollow or the edge of the 2.4 km window
  const segs = []; (T.rivers || []).forEach(r => { for(let k = 1; k < r.c.length; k++) segs.push([r.c[k - 1], r.c[k], r]); });
  const nearRiver = (E, N) => { let best = 1e9, who = null; for(const [a, b2, r] of segs){ const vx = b2[0] - a[0], vy = b2[1] - a[1], L2 = vx * vx + vy * vy || 1; let t = ((E - a[0]) * vx + (N - a[1]) * vy) / L2; t = Math.max(0, Math.min(1, t)); const dd = Math.hypot(E - a[0] - t * vx, N - a[1] - t * vy); if(dd < best){ best = dd; who = r; } } return [best, who]; };
  let i = c, j = c, len = 0, stop = "hollow", stream = null; const path = [[T.E, T.N]], seen = new Set([j * n + i]);
  for(let s = 0; s < 300; s++){
    const [dr, who] = segs.length ? nearRiver(x0 + i * step, y0 + j * step) : [1e9, null];
    if(dr < 35 && s > 0){ stop = "stream"; stream = who; break; }
    let bi = -1, bj = -1, bs = 0;
    for(let dj = -1; dj <= 1; dj++) for(let di = -1; di <= 1; di++){
      if(!di && !dj) continue; const a = i + di, b2 = j + dj; if(a < 0 || b2 < 0 || a >= n || b2 >= n) continue;
      const sdrop = (z(i, j) - z(a, b2)) / (step * Math.hypot(di, dj)); if(sdrop > bs && !seen.has(b2 * n + a)){ bs = sdrop; bi = a; bj = b2; }
    }
    if(bi < 0){ stop = "hollow"; break; }
    len += step * Math.hypot(bi - i, bj - j); i = bi; j = bj; seen.add(j * n + i); path.push([x0 + i * step, y0 + j * step]);
    if(i === 0 || j === 0 || i === n - 1 || j === n - 1){ stop = "edge"; break; }
  }
  return {...T, slope, aspect, planeAz, planeGrad, path, pathLen:len, stop, stream, riversOk:T.rivers != null};
}
function gwDirection(){
  if(INP.gwDir !== "" && INP.gwDir != null && isFinite(INP.gwDir)) return {az:((Number(INP.gwDir) % 360) + 360) % 360, src:"user"};
  if(SP.terrain) return {az:SP.terrain.planeAz, src:"terrain", flat:SP.terrain.planeGrad < 0.005};
  return null;
}
function spreadLimit(m){ return INP.mapLim === "altl" ? {v:LIM.altl1[m], name:"AltlV concentration value"} : {v:LIM.tbdv[m], name:"drinking-water limit (TBDV)"}; }
// error function (Abramowitz & Stegun 7.1.26) for the Domenico plume
function erf(x){ const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)); }
// Domenico (1987) continuous plane source, no decay, retarded velocity; x along flow from the source plane, y across.
// Dispersivity from plume length (Xu & Eckstein 1995, as in US EPA BIOSCREEN): ax = 0.83 (log10 L)^2.414, ay = ax/10, az = ax/100
function framePrep(P, t){
  return P.srcs.filter(s => s.C0 > 0 && t - s.t0 > 0).map(s => ({C0:s.C0, vt:P.vr * (t - s.t0), Y:P.Y, Z:P.Z, under:P.under}));
}
// dispersivity grows with distance from the source (Xu & Eckstein 1995 relation, as used in US EPA BIOSCREEN)
const axAt = x => 0.83 * Math.pow(Math.log10(Math.max(10, x)), 2.414);
function cAt(x, y, Q, ax){
  let c = 0;
  for(const q of Q){
    if(x <= 0){ if(q.under && x > -q.Y && Math.abs(y) <= q.Y / 2) c += q.C0; continue; }
    const a = 1 - erf((x - q.vt) / (2 * Math.sqrt(ax * q.vt) + 1e-9)); if(a < 1e-9) continue;
    const sy = 2 * Math.sqrt(ax / 10 * x);
    c += q.C0 / 4 * a * (erf((y + q.Y / 2) / sy) - erf((y - q.Y / 2) / sy)) * erf(q.Z / (2 * Math.sqrt(ax / 100 * x)));
  }
  return c;
}
function plumeParams(I, m, o, u){
  const porous = I.aq === "porous", R = porous ? 1 + 1.8 * o.kdAq / I.ne : 1, vr = o.qAq / I.ne / R;
  const bg = I.bgGw[m] * u.bg;
  if(I.medium === "gw") return {vr, R, bg, Y:I.gwWidth, Z:o.b, under:false, srcs:[{C0:o.cAdd, t0:0}]};
  const air = I.medium === "air", Y = air ? Math.sqrt(I.footprint * 1e6) : Math.sqrt(I.area);
  const C0 = o.cwAdd / o.D.daf, f = porous ? I.fastShare / 100 : 1;
  return {vr, R, bg, Y, Z:o.D.d, under:true, srcs:[{C0:C0 * f, t0:0}, {C0:C0 * (1 - f), t0:o.tArr}]};
}
function spreadSetup(){
  const I = INP, m = S.metal, R = RES; if(!R) return null;
  const key = R; if(SP.cache && SP.cache.key === key) return SP.cache;
  const dir = gwDirection(), src = srcOf();
  const cache = {key, dir, src, frames:{}, ok:false, why:""};
  SP.cache = cache;
  if(riverLike(I)){ cache.why = "river"; return cache; }
  if(I.aq === "karst"){ cache.why = "karst"; return cache; }
  if(!dir){ cache.why = "nodir"; return cache; }
  const oC = core(I, m, ONES), PC = plumeParams(I, m, oC, ONES);
  const runs = R.MC.slice(0, 100).map(x => plumeParams(I, m, x, x.u));
  const vr90 = runs.map(p => p.vr).sort((a, b) => a - b)[Math.floor(runs.length * 0.9)] || PC.vr;
  const th = dir.az * Math.PI / 180, fE = Math.sin(th), fN = Math.cos(th), lE = -fN, lN = fE;
  const world = (x, y) => [src.E + x * fE + y * lE, src.N + x * fN + y * lN];
  const soilX = I.medium === "gw" ? 0 : PC.Y / 2;                     // the source plane sits at the down-gradient edge of the source area
  Object.assign(cache, {ok:true, oC, PC, runs, vr90, world, soilX, Y:PC.Y});
  return cache;
}
function spreadFrame(c, t){
  if(c.frames[t]) return c.frames[t];
  const m = S.metal, lim = spreadLimit(m).v, soilX = c.soilX, Y = c.Y, nx = 96, ny = 48;
  const bgOver = c.PC.bg >= lim, thr = P => bgOver ? 0.1 * lim : lim - P.bg;   // if background alone breaks the limit, map where the release adds 10% of it
  const QC = framePrep(c.PC, t), tC = thr(c.PC), QR = c.runs.map(P => [framePrep(P, t), thr(P)]);
  // size the grid to where runs can exceed by this year: scan the centre line of every run
  const runLen = (Q, th) => { if(!Q.length) return 0; const reach = Math.max(...Q.map(q => q.vt)) * 1.5 + Y, top = Math.log10(Math.max(reach, 2)); let last = 0;
    for(let k = 0; k <= 90; k++){ const x = Math.pow(10, k / 90 * top); if(cAt(x, 0, Q, axAt(x)) > th) last = x; } return last; };
  const lens = QR.map(([Q, th]) => runLen(Q, th)).sort((a, b) => a - b), p90 = lens[Math.floor(lens.length * 0.9)], lc = runLen(QC, tC);
  const L = Math.min(15000, Math.max(3 * Y, 60, 1.3 * Math.max(p90, lc) + 0.5 * Y));
  const Wh = Math.min(6000, Y / 2 + 4 * Math.sqrt(axAt(L) / 10 * L) + 0.25 * Y + 5);
  const xs = c.soilX > 0 ? Math.max(Y, 20) : Math.min(Y, 0.05 * L), x0 = -xs, dx = (L + xs) / nx, dy = 2 * Wh / ny;
  const nodes = []; for(let jj = 0; jj <= ny; jj++){ const row = []; for(let ii = 0; ii <= nx; ii++){ const [E, N] = c.world(x0 + ii * dx, -Wh + jj * dy); row.push(toLL(E, N)); } nodes.push(row); }
  const best = new Uint8Array(nx * ny), pex = new Float32Array(nx * ny);
  for(let ii = 0; ii < nx; ii++){
    const x = x0 + (ii + 0.5) * dx - soilX, ax = axAt(x);
    for(let jj = 0; jj < ny; jj++){
      const y = -Wh + (jj + 0.5) * dy, k = jj * nx + ii;
      if(QC.length && cAt(x, y, QC, ax) > tC) best[k] = 1;
      let e = 0; for(const [Q, th] of QR) if(Q.length && cAt(x, y, Q, ax) > th) e++;
      pex[k] = e / QR.length;
    }
  }
  const zone = mask => { let n = 0, xmax = -1e9, ymin = 1e9, ymax = -1e9; for(let jj = 0; jj < ny; jj++) for(let ii = 0; ii < nx; ii++) if(mask(jj * nx + ii)){ n++; xmax = Math.max(xmax, x0 + (ii + 1) * dx); ymin = Math.min(ymin, -Wh + jj * dy); ymax = Math.max(ymax, -Wh + (jj + 1) * dy); } return n ? {area:n * dx * dy, len:Math.max(0, xmax), wid:ymax - ymin} : null; };
  const f = {t, best, pex, lim, bgOver, nx, ny, x0, dx, dy, Wh, L, nodes, zB:zone(k => best[k]), zP:zone(k => pex[k] >= 0.1)};
  c.frames[t] = f; return f;
}
function cssVar(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || "#888"; }
// geodienste.ch fair use: at most 10 WMS requests a minute, each image at most 360,000 pixels.
// So the cantonal layer is one image per map view, requested after panning stops and only while it is switched on.
const CW = {on:false, img:null, timer:0, times:[], seq:0, attr:'Groundwater protection: cantons via <a href="https://www.geodienste.ch" target="_blank" rel="noopener">geodienste.ch</a>'};
const CW_URL = "https://geodienste.ch/db/planerischer_gewaesserschutz_v1_2_0/deu", CW_MAXPX = 360000, CW_PER_MIN = 9;
function cantWms(on){
  CW.on = on; clearTimeout(CW.timer);
  if(on){ SP.map.attributionControl.addAttribution(CW.attr); cantSchedule(0); }
  else { SP.map.attributionControl.removeAttribution(CW.attr); if(CW.img){ SP.map.removeLayer(CW.img); CW.img = null; } CW.seq++; }
}
function cantSchedule(delay){
  clearTimeout(CW.timer);
  const now = Date.now(); CW.times = CW.times.filter(t => now - t < 60000);
  const wait = CW.times.length >= CW_PER_MIN ? 60000 - (now - CW.times[0]) + 50 : 0;     // stay under the per-minute limit
  CW.timer = setTimeout(cantLoad, Math.max(delay == null ? 600 : delay, wait));
}
function cantLoad(){
  if(!CW.on || !SP.map) return;
  const LF = window.L, b = SP.map.getBounds(), sz = SP.map.getSize();
  const k = Math.min(1, Math.sqrt(CW_MAXPX / Math.max(1, sz.x * sz.y))), w = Math.max(1, Math.floor(sz.x * k)), h = Math.max(1, Math.floor(sz.y * k));
  const sw = LF.CRS.EPSG3857.project(b.getSouthWest()), ne = LF.CRS.EPSG3857.project(b.getNorthEast());
  const url = `${CW_URL}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=gewaesserschutzbereiche,grundwasserschutzareale,grundwasserschutzzonen&STYLES=&CRS=EPSG:3857&BBOX=${sw.x.toFixed(1)},${sw.y.toFixed(1)},${ne.x.toFixed(1)},${ne.y.toFixed(1)}&WIDTH=${w}&HEIGHT=${h}&FORMAT=image/png&TRANSPARENT=true`;
  const seq = ++CW.seq; CW.times.push(Date.now());
  if(!SP.map.getPane("cantPane")){ const pn = SP.map.createPane("cantPane"); pn.style.zIndex = 350; pn.style.pointerEvents = "none"; }   // under the plume and markers
  const img = LF.imageOverlay(url, b, {opacity:0.45, interactive:false, pane:"cantPane"});
  img.once("load", () => { if(seq !== CW.seq || !CW.on){ SP.map.removeLayer(img); return; } if(CW.img) SP.map.removeLayer(CW.img); CW.img = img; });
  img.once("error", () => { if(seq === CW.seq) SP.map.removeLayer(img); });
  img.addTo(SP.map);
}
function initSpreadMap(){
  if(SP.map || typeof window.L === "undefined" || !document.getElementById("spMap2")) return;
  const LF = window.L;
  SP.map = LF.map("spMap2", {minZoom:8, maxZoom:18, maxBounds:[[45.4, 5.4], [48.2, 11.0]], maxBoundsViscosity:0.8, preferCanvas:true, zoomSnap:0.5}).setView([46.82, 8.23], 8);
  SP.canvas = LF.canvas({padding:0.3});
  LF.tileLayer("https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg", {maxZoom:19, attribution:'© <a href="https://www.swisstopo.admin.ch/" target="_blank" rel="noopener">swisstopo</a>'}).addTo(SP.map);
  SP.ov.cant = null;   // cantonal protection zones: one image per map view, see cantWms()
  SP.ov.hk100 = LF.tileLayer("https://wmts.geo.admin.ch/1.0.0/ch.bafu.hydrogeologische-karte_100/default/current/3857/{z}/{x}/{y}.png", {maxZoom:19, opacity:0.75, attribution:"Hydrogeological map 1:100,000 © FOEN"});
  SP.ov.tracer = LF.tileLayer("https://wmts.geo.admin.ch/1.0.0/ch.bafu.hydrogeologie-markierversuche/default/current/3857/{z}/{x}/{y}.png", {maxZoom:19, attribution:"Tracer tests © FOEN"});
  SP.draw = LF.layerGroup().addTo(SP.map);
  SP.map.on("click", e => {
    if(!SP.mode) return;
    const p = wgsToLv95(e.latlng.lat, e.latlng.lng), s = srcOf();
    if(SP.mode === "dir"){ const az = (Math.atan2(p.E - s.E, p.N - s.N) * 180 / Math.PI + 360) % 360; INP.gwDir = Math.round(az); }
    else if(SP.mode === "src"){ INP.srcE = Math.round(p.E); INP.srcN = Math.round(p.N); SP.fitKey = ""; }
    SP.mode = ""; $("#spMap2").classList.remove("picking"); renderForm(); refreshAll(); saveAdv();
  });
  document.querySelectorAll("#spLayers input[data-ov]").forEach(cb => cb.addEventListener("change", () => {
    const leg = document.getElementById("leg-" + cb.dataset.ov); if(leg) leg.hidden = !cb.checked;
    if(cb.dataset.ov === "cant"){ cantWms(cb.checked); return; }
    const l = SP.ov[cb.dataset.ov]; if(l){ if(cb.checked) l.addTo(SP.map); else SP.map.removeLayer(l); }
  }));
  SP.map.on("moveend", () => { if(CW.on) cantSchedule(); });
  $("#spTerrDir").addEventListener("change", () => drawSpread());
  $("#spT").addEventListener("input", e => { SP.frame = Number(e.target.value); drawSpread(); });
  $("#spPlay").addEventListener("click", () => setSpreadPlay(!SP.playing));
  $("#spLim").addEventListener("change", e => { INP.mapLim = e.target.value; SP.cache = null; drawSpread(); saveAdv(); });
  $("#spDir").addEventListener("click", e => {
    const b = e.target.closest("button[data-act]"); if(!b) return;
    const a = b.dataset.act;
    if(a === "dir" || a === "src"){ SP.mode = SP.mode === a ? "" : a; $("#spMap2").classList.toggle("picking", !!SP.mode); renderSpreadStatus(); return; }
    if(a === "clear"){ INP.gwDir = ""; renderForm(); refreshAll(); saveAdv(); }
    if(a === "home"){ INP.srcE = ""; INP.srcN = ""; SP.fitKey = ""; renderForm(); refreshAll(); saveAdv(); }
  });
}
/* Support layers drawer: opens to the left over the map when the button beside the map is clicked */
(function(){
  const dr = $("#spDrawer"), btn = $("#spLayersBtn"); if(!dr || !btn) return;
  const set = open => {
    dr.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open));
    if(open){ const f = dr.querySelector("input"); if(f) f.focus({preventScroll:true}); if(window.innerWidth <= 860) dr.scrollIntoView({block:"nearest", behavior:reduceMotion ? "auto" : "smooth"}); }
  };
  btn.addEventListener("click", () => set(!dr.classList.contains("open")));
  $("#spDrawerX").addEventListener("click", () => { set(false); btn.focus(); });
  dr.addEventListener("keydown", e => { if(e.key === "Escape"){ set(false); btn.focus(); } });
  const count = () => { const n = [...dr.querySelectorAll("input[data-ov]")].filter(x => x.checked).length; $("#spLayersCnt").textContent = n ? `${n} on` : ""; };
  dr.addEventListener("change", count); count();
})();
function setSpreadPlay(on){
  SP.playing = on; clearInterval(SP.timer);
  $("#spPlay").innerHTML = on ? "❚❚ Pause" : "▶ Play"; $("#spPlay").setAttribute("aria-pressed", String(on));
  if(on){ if(SP.frame >= FRAMES.length - 1) SP.frame = -1; SP.timer = setInterval(() => { SP.frame++; if(SP.frame >= FRAMES.length){ SP.frame = FRAMES.length - 1; setSpreadPlay(false); return; } $("#spT").value = SP.frame; drawSpread(); }, reduceMotion ? 1600 : 1000); SP.frame++; if(SP.frame < FRAMES.length){ $("#spT").value = SP.frame; drawSpread(); } }
}
function renderSpreadStatus(){
  const el = $("#spDir"); if(!el || !INP) return;
  const s = srcOf(), d = gwDirection(), T = SP.terrain, picking = SP.mode;
  const srcTxt = `<b>Source:</b> ${esc(s.label)}, E ${Math.round(s.E).toLocaleString("de-CH")}, N ${Math.round(s.N).toLocaleString("de-CH")}`;
  let dirTxt;
  if(d && d.src === "user") dirTxt = `<span class="pill ok">Set by you</span> Groundwater flows towards <b>${Math.round(d.az)}° (${compass(d.az)})</b>.`;
  else if(d) dirTxt = `<span class="pill check">Not set</span> Using the terrain direction <b>${Math.round(d.az)}° (${compass(d.az)})</b> as a stand-in${d.flat ? ", but the terrain is nearly flat here, so it says little" : ""}. Set the real direction from the cantonal groundwater map or your wells.`;
  else dirTxt = `<span class="pill check">Not set</span> Set the groundwater direction to draw the spread: click <b>Set direction</b>, then click a point downstream of the source.`;
  const terr = T ? `<b>Terrain:</b> slope ${fmt(T.slope)}% at the source (${s.def ? "not applied to erosion at the preset's illustrative place; move the source to your site" : INP.slopeSrc === "terrain" ? "used to scale erosion" : `your slope of ${fmt(INP.slope)}% is used instead`}). ${T.stop === "stream" ? `Runoff reaches ${T.stream && T.stream.name ? esc(T.stream.name) : "a stream"} after about ${fmt(Math.round(T.pathLen / 10) * 10)} m.` : T.stop === "edge" ? `Runoff runs more than ${fmt(Math.round(T.pathLen / 10) * 10)} m downhill, beyond the 2.4 km terrain window.` : `Runoff collects in a hollow after about ${fmt(Math.round(T.pathLen / 10) * 10)} m${T.riversOk ? "" : " (stream data unavailable)"}.`}` : (SP.tMsg ? esc(SP.tMsg) : "");
  el.innerHTML = `<p>${srcTxt}. <button class="btn ghost sm" data-act="src" aria-pressed="${picking === "src"}">${picking === "src" ? "Click the map…" : "Move source"}</button>${num(INP.srcE) ? ` <button class="btn ghost sm" data-act="home">Use preset place</button>` : ""}</p>
    <p>${dirTxt} <button class="btn sm" data-act="dir" aria-pressed="${picking === "dir"}">${picking === "dir" ? "Click a point downstream…" : (d && d.src === "user" ? "Change direction" : "Set direction")}</button>${d && d.src === "user" ? ` <button class="btn ghost sm" data-act="clear">Clear</button>` : ""}</p>
    ${terr ? `<p class="mini">${terr}</p>` : ""}`;
  const a = $("#spGeoLink"); if(a) a.href = `https://map.geo.admin.ch/?lang=en&E=${Math.round(s.E)}&N=${Math.round(s.N)}&zoom=9&layers=ch.bafu.hydrogeologische-karte_100,ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen,ch.bafu.hydrogeologie-markierversuche`;
}
function renderSpread(){
  if(!S.adv || !RES || !$("#spread")) return;
  if(SP.frame == null){ const k = FRAMES.indexOf(INP.budT); SP.frame = k >= 0 ? k : 2; }
  $("#spT").max = FRAMES.length - 1; $("#spT").value = SP.frame; $("#spLim").value = INP.mapLim || "tbdv";
  const s = srcOf();
  if(typeof window.L === "undefined"){ $("#spAct").innerHTML = "<li>The map library could not load. Open the site through a web server.</li>"; return; }
  initSpreadMap();
  loadTerrain(s.E, s.N);
  SP.cache = null;
  drawSpread();
}
/* deposition field around a stack: topsoil above the soil standard, by year, shaped by the wind */
const DEP_NA = 36;
function depRing(sh, j, forest){
  const a = AIR_R[j - 1], b = AIR_R[j], rm = a > 0 ? Math.sqrt(a * b) : b / 2;
  let d = 0;
  sh.prof.forEach(p => { const vmix = (1 - sh.ls.fF) * p.c.vd + sh.ls.fF * p.c.vdF, ratio = vmix > 0 ? (forest ? p.c.vdF : p.c.vd) / vmix : 0; d += p.w * (p.dry[j] * ratio + p.wet[j]) / (rm * (b - a)); });
  return d;     // fraction of the release per m² (per year if continuous) per radian of wind-direction density
}
function depSetup(){
  const I = INP, m = S.metal, R = RES;
  if(!R || I.medium !== "air") return null;
  if(SP.dep && SP.dep.key === R) return SP.dep;
  // the lowest Swiss soil value for this land use: VBBo guide value, else trigger value, else AltlV remediation value
  const g = LIM.guide[m], tr = (I.land === "agri" || I.land === "garden") ? LIM.trigger[m] : null, rv = I.land === "garden" ? LIM.remGarden[m] : I.land === "agri" ? LIM.remAgri[m] : null;
  const lim = g || tr || rv || null, limName = g ? "VBBo guide value" : tr ? "VBBo trigger value" : rv ? "AltlV remediation value" : "", forest = I.land === "forest";
  const o = core(I, m, ONES), runs = R.MC.slice(0, 100);
  const re = snowReemOf(I, m), snowF = o => { const sn = o.air.sn; return sn.perennial ? 0 : 1 - sn.f * (re + (1 - re) * num(I.snowRun) / 100); };
  const prep = x => ({x, d:AIR_R.map((_, j) => j ? depRing(x.air, j, forest) * x.airScale * snowF(x) : 0), bg:I.bg[m] * (x.u ? x.u.bg : 1)});
  const C = prep(o), Rr = runs.map(prep), Ms = I.depthMix / 100 * I.rhob * 1000;
  const conc = (P, j, rho, t) => {
    const k = P.x.k, J = I.amount * 1e6 * P.d[j] * rho, D = I.duration;
    const Sm = I.pattern === "pulse" ? J * Math.exp(-k * t) : (k > 0 ? J / k * (1 - Math.exp(-k * Math.min(t, D))) * Math.exp(-k * Math.max(0, t - D)) : J * Math.min(t, D));
    return P.bg + Sm / Ms;
  };
  SP.dep = {key:R, lim, limName, C, Rr, conc, frames:{}};
  return SP.dep;
}
function depFrame(t){
  const D = depSetup(); if(!D) return null;
  if(!D.lim) return {t, cells:[], rB:0, rP:0, lim:null};
  if(D.frames[t]) return D.frames[t];
  const I = INP, az = k => (k + 0.5) * 360 / DEP_NA, rhos = Array.from({length:DEP_NA}, (_, k) => windDens(I, az(k)));
  const j0 = AIR_R.findIndex(r => r >= 20), cells = [];
  let rB = 0, rP = 0, dirB = null, best = 0;
  for(let j = Math.max(1, j0); j < AIR_R.length; j++){
    let any = false;
    for(let k = 0; k < DEP_NA; k++){
      const cb = D.conc(D.C, j, rhos[k], t), b = cb > D.lim;
      let e = 0; for(const P of D.Rr) if(D.conc(P, j, rhos[k], t) > D.lim) e++;
      const pe = e / D.Rr.length;
      if(b || pe >= 0.1){ cells.push({j, k, b}); any = true; if(b){ rB = Math.max(rB, AIR_R[j]); if(cb > best){ best = cb; dirB = az(k); } } else rP = Math.max(rP, AIR_R[j]); }
    }
    if(!any && AIR_R[j] > 3 * Math.max(rB, rP, 200)) break;
  }
  const f = {t, cells, rB, rP: Math.max(rP, rB), dirB, lim:D.lim, limName:D.limName};
  D.frames[t] = f; return f;
}
function drawSpread(){
  if(!SP.map || !RES) return;
  renderSpreadStatus();
  const LF = window.L, I = INP, m = S.metal, t = FRAMES[SP.frame], c = spreadSetup(), s = srcOf(), T = SP.terrain;
  $("#spTout").textContent = `${t} year${t > 1 ? "s" : ""}`; $("#spActT").textContent = t;
  SP.draw.clearLayers();
  const crit = cssVar("--crit"), warn = cssVar("--warn"), ink = cssVar("--ink"), water = cssVar("--water-deep"), soilC = cssVar("--soil");
  const fit = [toLL(s.E, s.N)];
  let f = null;
  // source area, drawn aligned with the flow so it lines up with the plume
  const dir = gwDirection(), th = (dir ? dir.az : 0) * Math.PI / 180, fE = Math.sin(th), fN = Math.cos(th);
  const ser = RES.ser.find(p => p.t === t), Ms = I.depthMix / 100 * I.rhob * 1000;
  let soilTxt = null;
  if(soilLike(I)){
    soilTxt = {};
    const air = I.medium === "air", A = air ? I.footprint * 1e6 : I.area, h = Math.sqrt(A) / 2;
    const corner = (a, b) => toLL(s.E + a * fE - b * fN, s.N + a * fN + b * fE);
    const conc = ser ? I.bg[m] + ser.B.top * 1e6 / (A * Ms) : null, ss = conc != null ? soilStatus(m, conc, I.land) : ["info"];
    const col = ss[0] === "crit" ? crit : ss[0] === "warn" ? warn : soilC;
    let shape;
    if(air) shape = LF.circle(toLL(s.E, s.N), {radius:Math.sqrt(A / Math.PI), renderer:SP.canvas, color:col, weight:2, fillColor:col, fillOpacity:0.06});
    else if(I.medium === "road"){
      const ra = Number(I.roadDir) * Math.PI / 180, hl = num(I.roadL) / 2, rE = Math.sin(ra), rN = Math.cos(ra);
      const pt = (a, b) => toLL(s.E + a * rE + b * rN, s.N + a * rN - b * rE);
      shape = LF.polygon([pt(-hl, -ROAD_STRIP), pt(hl, -ROAD_STRIP), pt(hl, ROAD_STRIP), pt(-hl, ROAD_STRIP)], {renderer:SP.canvas, color:col, weight:4, fillColor:col, fillOpacity:0.5});
      fit.push(pt(-hl, 0), pt(hl, 0));
    }
    else shape = LF.polygon([corner(-h, -h), corner(h, -h), corner(h, h), corner(-h, h)], {renderer:SP.canvas, color:col, weight:2, fillColor:col, fillOpacity:0.35});
    shape.bindTooltip(`${air ? "Deposition footprint (average)" : I.medium === "road" ? `Roadside strip, ${ROAD_STRIP} m on each side` : "Source area"} · topsoil ${fmt(conc)} mg/kg`).addTo(SP.draw);
    if(air){
      const df = depFrame(t);
      if(df && df.cells.length){
        const q = (r, a) => toLL(s.E + r * Math.sin(a * Math.PI / 180), s.N + r * Math.cos(a * Math.PI / 180)), da = 360 / DEP_NA;
        const quads = sel => df.cells.filter(sel).map(cl => { const r0 = AIR_R[cl.j - 1], r1 = AIR_R[cl.j], a0 = cl.k * da, a1 = a0 + da; return [[q(r0, a0), q(r1, a0), q(r1, a1), q(r0, a1)]]; });
        const qp = quads(cl => !cl.b), qb = quads(cl => cl.b);
        if(qp.length) LF.polygon(qp, {renderer:SP.canvas, stroke:false, fillColor:warn, fillOpacity:0.42, interactive:false}).addTo(SP.draw);
        if(qb.length) LF.polygon(qb, {renderer:SP.canvas, stroke:false, fillColor:crit, fillOpacity:0.6, interactive:false}).addTo(SP.draw);
        const rr = Math.max(df.rP, 100); fit.push(toLL(s.E + rr, s.N + rr), toLL(s.E - rr, s.N - rr));
      }
      soilTxt.dep = df;
    }
    if(air){ const r = Math.sqrt(A / Math.PI); fit.push(toLL(s.E + r, s.N + r), toLL(s.E - r, s.N - r)); }
    soilTxt = Object.assign(soilTxt || {}, {conc, ss, A});
  }
  // runoff path
  if(T && T.path.length > 1 && soilLike(I)){
    LF.polyline(T.path.map(([E, N]) => toLL(E, N)), {renderer:SP.canvas, color:warn, weight:4, opacity:0.9, dashArray:"6 5"}).bindTooltip("Runoff path: eroded soil washes this way").addTo(SP.draw);
    const end = T.path[T.path.length - 1];
    LF.circleMarker(toLL(end[0], end[1]), T.stop === "stream" ? {renderer:SP.canvas, radius:6, color:"#fff", weight:2, fillColor:crit, fillOpacity:1} : {renderer:SP.canvas, radius:5, color:warn, weight:2, fillColor:"#fff", fillOpacity:1}).bindTooltip(T.stop === "stream" ? "Reaches the stream here" : "Collects here").addTo(SP.draw);
    T.path.forEach(([E, N]) => fit.push(toLL(E, N)));
  }
  LF.circleMarker(toLL(s.E, s.N), {renderer:SP.canvas, radius:4, color:ink, weight:2, fillColor:cssVar("--metal"), fillOpacity:1}).bindTooltip("Release point").addTo(SP.draw);
  // groundwater zones, drawn above the source and path so small early plumes stay visible
  if(c && c.ok){
    f = spreadFrame(c, t);
    const rings = sel => { const out = []; for(let jj = 0; jj < f.ny; jj++) for(let ii = 0; ii < f.nx; ii++) if(sel(jj * f.nx + ii)) out.push([[f.nodes[jj][ii], f.nodes[jj][ii + 1], f.nodes[jj + 1][ii + 1], f.nodes[jj + 1][ii]]]); return out; };
    const rp = rings(k => !f.best[k] && f.pex[k] >= 0.1), rb = rings(k => f.best[k]);
    if(rp.length) LF.polygon(rp, {renderer:SP.canvas, stroke:false, fillColor:warn, fillOpacity:0.42, interactive:false}).addTo(SP.draw);
    if(rb.length) LF.polygon(rb, {renderer:SP.canvas, stroke:false, fillColor:crit, fillOpacity:0.6, interactive:false}).addTo(SP.draw);
    // fit to the zone of the last frame, so the animation keeps one scale and shows the growth
    const noZone = I.medium === "air" && !(fl => fl.zP || fl.zB)(spreadFrame(c, FRAMES[FRAMES.length - 1]));   // air: the footprint and deposition set the view when groundwater shows nothing
    const fl = spreadFrame(c, FRAMES[FRAMES.length - 1]), zl = Math.max((fl.zP || fl.zB || {len:noZone ? 0 : 3 * c.Y}).len, (f.zP || f.zB || {len:0}).len), zw = Math.max(noZone ? 0 : c.Y, ((fl.zP || fl.zB || {wid:noZone ? 0 : c.Y}).wid) / 2);
    c.fitL = zl;
    if(zl > 0) fit.push(toLL(...c.world(zl, 0)), toLL(...c.world(zl / 2, zw)), toLL(...c.world(zl / 2, -zw)));
  }
  // direction arrows: yours solid, terrain dashed (support); green with a white halo, wind blue and dotted
  const arrow = (az, len, style, halo) => { const a = az * Math.PI / 180, e = [s.E + len * Math.sin(a), s.N + len * Math.cos(a)], hd = len * 0.22;
    const wing = d => { const b = (az + 180 + d) * Math.PI / 180; return toLL(e[0] + hd * Math.sin(b), e[1] + hd * Math.cos(b)); };
    const draw = st => { const o = Object.assign({renderer:SP.canvas, weight:3, interactive:false}, st);
      LF.polyline([toLL(s.E, s.N), toLL(e[0], e[1])], o).addTo(SP.draw); LF.polyline([wing(-28), toLL(e[0], e[1]), wing(28)], o).addTo(SP.draw); };
    if(halo) draw(Object.assign({}, style, {color:"#fff", opacity:0.9, weight:(style.weight || 3) + 4}));
    draw(style); };
  const alen = Math.max(120, Math.min(1500, c && c.ok && c.fitL ? c.fitL * 0.45 : 300)), dirC = cssVar("--dir");
  if(dir && dir.src === "user") arrow(dir.az, alen, {color:dirC, opacity:1, weight:4}, true);
  if(I.medium === "air" && I.windFrom !== "") arrow((Number(I.windFrom) + 180) % 360, Math.max(alen * 0.9, 1.3 * Math.sqrt(num(I.footprint) * 1e6 / Math.PI)), {color:cssVar("--water-deep"), opacity:0.9, dashArray:"2 6"});
  if(T && $("#spTerrDir").checked) arrow(T.planeAz, alen * 0.8, {color:dirC, opacity:0.85, dashArray:"6 7"}, true);
  const df0 = I.medium === "air" ? depFrame(FRAMES[FRAMES.length - 1]) : null;
  const fk = `${Math.round(s.E)},${Math.round(s.N)},${dir ? Math.round(dir.az) : "-"},${c && c.ok ? Number((c.fitL || 0).toPrecision(1)) : 0},${I.medium},${df0 ? Number(df0.rP.toPrecision(1)) : 0}`;
  if(df0 && df0.rP > 0){ const rr = df0.rP * 1.1; fit.push(toLL(s.E + rr, s.N + rr), toLL(s.E - rr, s.N - rr)); }
  if(SP.fitKey !== fk){ SP.fitKey = fk; const b = LF.latLngBounds(fit); SP.map.fitBounds(b.pad(0.25), {maxZoom:16}); }
  renderSpreadAct(c, f, t, soilTxt);
}
function renderSpreadAct(c, f, t, soilTxt){
  const I = INP, m = S.metal, T = SP.terrain, L = [], lim = spreadLimit(m), ser = RES.ser.find(p => p.t === t);
  const yr = `${t} year${t > 1 ? "s" : ""}`;
  if(soilTxt && soilTxt.dep){
    const df = soilTxt.dep, towards = I.windFrom !== "" ? `, furthest towards the ${compass((Number(I.windFrom) + 180) % 360)}` : "";
    if(!df.lim) L.push(`<b>Deposition:</b> no Swiss soil value for ${METALS[m].name.toLowerCase()} on this land use, so the map shows no soil zone.`);
    else if(df.rB > 0) L.push(`<b>Topsoil above the ${df.limName} (${fmt(df.lim)} mg/kg)</b> up to ${fmt(Math.round(df.rB))} m from the stack by year ${t}${towards}. <b>Sample these soils first, then decide on removal, cover or use restrictions.</b>`);
    else L.push(`<b>Deposition:</b> no topsoil above the ${df.limName} (${fmt(df.lim)} mg/kg) at the best estimate by year ${t}.`);
    if(df.rP > df.rB * 1.2 + 10) L.push(`<b>Possibly above</b> (at least 10% of runs): up to ${fmt(Math.round(df.rP))} m. Measure bulk deposition there (Bergerhoff samplers) to narrow it down.`);
    if(I.windFrom === "") L.push("Set the prevailing wind (Air & surface tab) to see which side of the stack gets most.");
  }
  if(soilTxt && soilTxt.conc != null){
    const st = soilTxt.ss, area = soilTxt.A >= 1e6 ? `${fmt(soilTxt.A / 1e6)} km²` : `${fmt(soilTxt.A)} m²`;
    L.push(st[0] === "crit" || st[0] === "warn" ? `<b>Soil at the source${I.medium === "air" ? " (footprint average)" : I.medium === "road" ? " (roadside strip)" : ""}:</b> ${fmt(soilTxt.conc)} mg/kg over ${area}, above the ${esc(st[2].replace(/: ([\d,.]+ mg\/kg)$/, " ($1)"))}. <b>Investigate this area first for removal or cover.</b>` : `<b>Soil at the source:</b> ${fmt(soilTxt.conc)} mg/kg over ${area}, below Swiss soil values.`);
  }
  if(soilLike(I) && ser){
    const dk = ser.B.down + ser.B.fp;
    if(dk > 0) L.push(`<b>Downslope:</b> ${fmt(dk)} kg washed off by year ${t}${T ? ` along the ${fmt(Math.round(T.pathLen / 10) * 10)} m runoff path${T.stop === "stream" ? " to the stream" : ""}` : ""}. Sample the field edge and where the path flattens.`);
  }
  if(c && c.why === "river") L.push("A river release follows the river, not the land: see the mass budget for where it settles.");
  else if(c && c.why === "karst") L.push("<b>Karst:</b> water runs through conduits to springs, often kilometres away within days, so a plume shape would mislead. Turn on <b>Tracer tests</b> to see where tracer tests were run nearby; their results (which springs the water reached, and how fast) are held by the canton. Sample springs after heavy rain.");
  else if(c && c.why === "nodir") L.push("<b>Groundwater:</b> set the flow direction to draw where the plume goes.");
  else if(f){
    const pre = c.dir.src === "user" ? "" : " (direction from terrain, not yet set by you)";
    if(f.bgOver) L.push(`Background groundwater (${fmt(c.PC.bg)} µg/L) already exceeds the ${esc(lim.name)}, so the zones show where the release adds at least 10% of the limit on top.`);
    if(f.zB) L.push(`<b>Groundwater above the ${esc(lim.name)} (${lim.v} µg/L):</b> up to ${fmt(Math.round(f.zB.len))} m downstream and ${fmt(Math.round(f.zB.wid))} m wide by year ${t}${pre}. <b>Check wells and springs in the red zone first.</b>`);
    else L.push(`<b>Groundwater:</b> no zone above the ${esc(lim.name)} at the best estimate by year ${t}${pre}.`);
    if(f.zP && (!f.zB || f.zP.len > f.zB.len * 1.2 + f.dx)) L.push(`<b>Possibly above the limit</b> (at least 10% of runs): up to ${fmt(Math.round(f.zP.len))} m downstream. Consider monitoring wells at the edge of the amber zone.`);
    if(soilLike(I) && I.aq === "porous" && !(I.fastShare > 0) && c.oC.tArr > t) L.push(`Seepage needs ${c.oC.tArr > 1e6 ? "more than a million" : "about " + fmt(c.oC.tArr)} years to reach the water table by slow matrix flow. Shooting-range data show metals can arrive in decades through fast paths: test that with the fast-path share (Budget & floods tab).`);
    if(c.PC.vr * 100 < 5) L.push(`${METALS[m].name} moves only about ${c.PC.vr * 100 < 1 ? fmt(c.PC.vr * 1e4) + " cm" : fmt(c.PC.vr * 100) + " m"} per century in this aquifer, so any zone stays close to the source.`);
    if(I.aq === "fractured") L.push("Fractured rock: the plume is drawn as if the rock were evenly porous. Real flow follows fractures, so treat the shape as a rough corridor.");
  }
  L.push("Turn on <b>Cantonal protection zones</b> to see whether S1–S3 zones of drinking-water wells or springs lie in the coloured area.");
  SP.act = L.map(x => x.replace(/<[^>]+>/g, ""));
  $("#spAct").innerHTML = L.map(x => `<li>${x}</li>`).join("");
}

/* ================= FORMS BY PHASE: five condition scenarios ================= */
// Each scenario changes the conditions on top of the user's inputs; the mass budget is rerun for it,
// then each compartment's mass is split into chemical forms with the indicative rules in FORM_RULES.
const SCEN = [
  {k:"today", label:"Today as entered", what:"Your inputs, unchanged", mod:I => I},
  {k:"wet", label:"Waterlogged, reducing soil", what:"Soil permanently waterlogged; aquifer anoxic (iron-reducing)", mod:I => Object.assign(I, {drain:"perm", redox:I.redox === "sulfidic" ? "sulfidic" : "anoxic"})},
  {k:"acid", label:"Acidified soil", what:"Soil pH 1.5 units lower", mod:I => Object.assign(I, {pH:Math.max(3.5, Math.round((I.pH - 1.5) * 10) / 10)})},
  {k:"flood", label:"Extreme floods every ~10 years", what:"Random 1-in-10-year floods with your flood settings (best estimate spreads them evenly)", mod:I => Object.assign(I, {flood:"rp10"})},
  {k:"lake", label:"Anoxic lake bottom and wetlands", what:"Lake bottom water permanently anoxic; many wetlands in the catchment", mod:I => Object.assign(I, {lakeO2:"perm", wet:"many"})}
];
const SCEN_KEYS = ["drain", "redox", "pH", "flood", "lakeO2", "wet"];
// fixed colour slot per form, so a colour always means the same form, in every phase and scenario
const FORM_DEF = {
  As:[{k:"orig", label:"Original form, not yet weathered"}, {k:"asV_s", label:"Arsenate As(V) on iron oxides"}, {k:"asIII_s", label:"Arsenite As(III) in reduced solids"}, {k:"asS", label:"Arsenic sulfides"},
      {k:"asV_d", label:"Arsenate As(V), dissolved"}, {k:"asIII_d", label:"Arsenite As(III), dissolved"}, {k:"asMe", label:"Methylated arsenic, dissolved"}, {k:"dust", label:"Arsenic on dust particles"}],
  Hg:[{k:"orig", label:"Original form, not yet weathered"}, {k:"hgOM", label:"Hg(II) bound to organic matter"}, {k:"hgS", label:"Mercury sulfide HgS, formed"}, {k:"meHg", label:"Methylmercury"},
      {k:"hgD", label:"Dissolved Hg(II), bound to dissolved organic carbon"}, {k:"hg0", label:"Elemental Hg⁰ gas"}, {k:"dust", label:"Hg(II) on dust particles"}],
  Pb:[{k:"orig", label:"Original form, not yet weathered"}, {k:"pbSorb", label:"Pb on organic matter and oxides"}, {k:"pbCO3", label:"Lead carbonates"}, {k:"pbS", label:"Lead sulfide, formed"},
      {k:"pbPO4", label:"Lead phosphate (pyromorphite)"}, {k:"pbD", label:"Dissolved Pb, free and with organic carbon"}, {k:"dust", label:"Lead in dust particles"}]
};
const PHASES = [{k:"soil", label:"Soil and sediment"}, {k:"water", label:"Water"}, {k:"air", label:"Air"}];
// Indicative shares (assumptions from general geochemistry; see methods). r = soil redox 0 oxic / 1 periodically waterlogged / 2 permanently,
// a = aquifer 0 oxic / 1 suboxic / 2 anoxic / 3 sulfidic, l = lake bottom water 0 oxic / 1 seasonal / 2 permanent anoxia, s = sulfate factor
const FORM_RULES = {
  As:{
    soilSolid:(x, c) => { const f3 = [0.05, 0.3, 0.7][c.r]; return {asIII_s:x * f3, asV_s:x * (1 - f3)}; },
    soilWater:(x, c) => { const me = [0.02, 0.05, 0.1][c.r], f3 = [0.1, 0.5, 0.85][c.r]; return {asMe:x * me, asIII_d:x * (1 - me) * f3, asV_d:x * (1 - me) * (1 - f3)}; },
    gwWater:(x, c) => { const f3 = [0.05, 0.3, 0.8, 0.9][c.a]; return {asIII_d:x * f3, asV_d:x * (1 - f3)}; },
    gwSolid:(x, c) => c.a === 3 ? {asS:x * 0.6, asIII_s:x * 0.3, asV_s:x * 0.1} : {asIII_s:x * [0.05, 0.3, 0.8][c.a], asV_s:x * (1 - [0.05, 0.3, 0.8][c.a])},
    lakeWater:(x, c) => { const f3 = [0.05, 0.15, 0.3][c.l], me = {year:{oligo:0.03, meso:0.05, eu:0.1}, summer:{oligo:0.05, meso:0.1, eu:0.2}, winter:{oligo:0.02, meso:0.02, eu:0.03}}[c.season][c.troph]; return {asMe:x * me, asIII_d:x * (1 - me) * f3, asV_d:x * (1 - me) * (1 - f3)}; },
    sed:(x, c) => { const sS = [0, 0.2, 0.5][c.lY] * c.s, f5 = [0.7, 0.4, 0.15][c.lY]; return {asS:x * sS, asV_s:x * f5, asIII_s:x * (1 - sS - f5)}; },
    riverD:x => ({asV_d:x * 0.9, asIII_d:x * 0.1}), riverP:x => ({asV_s:x}),
    air:x => ({dust:x})
  },
  Hg:{
    soilSolid:(x, c) => { const me = [0.002, 0.01, 0.03][c.r], hs = [0, 0.05, 0.2][c.r]; return {meHg:x * me, hgS:x * hs, hgOM:x * (1 - me - hs)}; },
    soilWater:(x, c) => { const me = [0.02, 0.1, 0.3][c.r]; return {meHg:x * me, hgD:x * (1 - me)}; },
    gwWater:(x, c) => { const me = c.a >= 2 ? 0.05 : 0.01; return {meHg:x * me, hgD:x * (1 - me)}; },
    gwSolid:(x, c) => c.a === 3 ? {hgS:x * 0.5, hgOM:x * 0.5} : {hgOM:x},
    lakeWater:(x, c) => { const me = Math.min(0.4, [0.03, 0.1, 0.2][c.l] + c.wet + {oligo:0, meso:0.02, eu:0.05}[c.troph]) * {year:1, summer:0.7, winter:1.2}[c.season]; return {meHg:x * me, hgD:x * (1 - me)}; },
    sed:(x, c) => { const me = [0.004, 0.01, 0.02][c.lY], hs = [0.1, 0.3, 0.5][c.lY] * c.s; return {meHg:x * me, hgS:x * hs, hgOM:x * (1 - me - hs)}; },
    riverD:x => ({meHg:x * 0.02, hgD:x * 0.98}), riverP:x => ({hgOM:x}),
    air:(x, c) => c.form === "hg0" ? {hg0:x} : {dust:x}
  },
  Pb:{
    soilSolid:(x, c) => { const cb = c.pH >= 7.5 ? 0.4 : c.pH >= 6.5 ? 0.2 : 0, ps = [0, 0.05, 0.15][c.r], pp = c.pHigh ? 0.15 : 0; return {pbCO3:x * cb, pbS:x * ps, pbPO4:x * pp, pbSorb:x * (1 - cb - ps - pp)}; },
    soilWater:x => ({pbD:x}),
    gwWater:x => ({pbD:x}),
    gwSolid:(x, c) => c.a === 3 ? {pbS:x * 0.5, pbSorb:x * 0.5} : {pbSorb:x},
    lakeWater:x => ({pbD:x}),
    sed:(x, c) => { const ps = [0, 0.2, 0.5][c.lY] * c.s; return {pbS:x * ps, pbSorb:x * (1 - ps)}; },
    riverD:x => ({pbD:x}), riverP:x => ({pbSorb:x}),
    air:x => ({dust:x})
  }
};
function formSplit(I, m, b){
  const o = b.o, B = b.B, R = FORM_RULES[m], F = {soil:{}, water:{}, air:{}}, form = FORMS[m].find(f => f.id === I.form) || FORMS[m][0];
  let harvest = 0;
  const put = (ph, obj) => { for(const k in obj){ const v = obj[k]; if(v > 0) F[ph][k] = (F[ph][k] || 0) + v; } };
  const c = {r:I.drain === "perm" ? 2 : I.drain === "periodic" ? 1 : 0, a:{oxic:0, suboxic:1, anoxic:2, sulfidic:3}[I.redox] || 0,
    l:lakeLevel(I), lY:lakeLevel(I, true), season:I.season || "year", troph:I.troph || "meso", s:I.so4 === "low" ? 0.5 : 1, wet:{none:0, some:0.02, many:0.05}[I.wet] || 0, pH:I.pH, pHigh:I.pstat === "high", form:I.form};
  if(soilLike(I)){
    const fr = Math.min(1, I.reactive / 100), soilM = B.top + B.down + B.fp + B.regDep;
    const fwTop = I.theta / (I.theta + I.rhob * o.Kd), fwSub = I.theta / (I.theta + I.rhob * o.kdSub);
    put("soil", {orig:soilM * (1 - fr)});
    put("soil", R.soilSolid(soilM * fr * (1 - fwTop), c)); put("water", R.soilWater(soilM * fr * fwTop, c));
    put("soil", R.soilSolid(B.sub * (1 - fwSub), c)); put("water", R.soilWater(B.sub * fwSub, c));
  }
  put("water", R.gwWater(B.gwD, c)); put("soil", R.gwSolid(B.gwS, c));
  put("water", R.lakeWater(B.lakeW, c)); put("soil", R.sed(B.sed, c));
  const trap = b.lake ? I.trapEff / 100 : 0, dsh = b.fdB / (b.fdB + (1 - b.fdB) * (1 - trap) || 1);
  put("water", R.riverD(B.out * dsh, c)); put("water", R.riverP(B.out * (1 - dsh), c));
  put("soil", R.soilSolid(B.litter + B.treat, c));
  put("water", m === "Hg" ? {hgD:B.snow} : {dust:B.snow});
  if(m === "Hg"){ const g = Math.min(B.air, b.airGas || 0); put("air", {hg0:g + B.rem + B.evas + B.reEm}); put("air", R.air(B.air - g, Object.assign({}, c, {form:"dust"}))); }
  else { put("air", R.air(B.air, c)); harvest = B.rem; }
  const tot = {}; PHASES.forEach(p => { tot[p.k] = Object.values(F[p.k]).reduce((a, v) => a + v, 0); });
  return {F, tot, harvest, rel:b.rel, origLabel:form.label};
}
function formsRun(I0, m){
  const T = I0.budT;
  return SCEN.map(sc => {
    const I = sc.mod(clone(I0)), same = sc.k !== "today" && SCEN_KEYS.every(k => I[k] === I0[k]);
    const b = budget(I, m, ONES, T, floodPlan(I.flood, T, null));
    return {sc, I, same, T, ...formSplit(I, m, b)};
  });
}
const formLabel = (m, k, origLabel) => k === "orig" ? `Original form: ${origLabel}` : (FORM_DEF[m].find(f => f.k === k) || {label:k}).label;
function renderForms(){
  const box = $("#formsBody"); if(!box || !RES || !RES.forms) return;
  const m = S.metal, FD = FORM_DEF[m], runs = RES.forms, T = runs[0].T, slot = k => FD.findIndex(f => f.k === k) + 1;
  $("#formsTitle").textContent = `Which forms, in which phase, after ${T} year${T > 1 ? "s" : ""}: five scenarios`;
  const used = new Set(); runs.forEach(r => PHASES.forEach(p => Object.keys(r.F[p.k]).forEach(k => used.add(k))));
  const legend = FD.filter(f => used.has(f.k)).map(f => `<span><i class="fsw fs${slot(f.k)}"></i>${esc(formLabel(m, f.k, runs[0].origLabel))}</span>`).join("");
  const cell = (r, p) => {
    const tot = r.tot[p.k], share = r.rel > 0 ? tot / r.rel : 0;
    if(!(tot > 0)) return `<div class="fcell empty"><div class="fph"><span>${esc(p.label)}</span><b>0%</b></div><p class="fnone">None</p></div>`;
    const items = Object.entries(r.F[p.k]).map(([k, v]) => [k, v / tot]).sort((a, b) => slot(a[0]) - slot(b[0]));
    const bar = items.filter(([, f]) => f > 0).map(([k, f]) => `<i class="fseg fs${slot(k)}" style="flex-grow:${Math.max(f, 0.004).toFixed(4)}" title="${esc(formLabel(m, k, r.origLabel))}: ${fmtPct(f)} of this phase, ${fmtPct(f * share)} of all released"></i>`).join("");
    const top = items.slice().sort((a, b) => b[1] - a[1]).slice(0, 3).filter(([, f]) => f >= 0.01);
    return `<div class="fcell"><div class="fph"><span>${esc(p.label)}</span><b>${fmtPct(share)}</b></div><div class="fbar" role="img" aria-label="${esc(p.label)}: ${esc(top.map(([k, f]) => formLabel(m, k, r.origLabel) + " " + fmtPct(f)).join(", "))}">${bar}</div>
      <ul class="ftop">${top.map(([k, f]) => `<li><i class="fsw fs${slot(k)}"></i>${esc(formLabel(m, k, r.origLabel))} <b>${fmtPct(f)}</b></li>`).join("")}</ul></div>`;
  };
  // the biggest shift against today, in percentage points of a phase (forms) or of the total (phases)
  const base = runs[0], shr = (r, p, k) => r.tot[p] > 0 ? (r.F[p][k] || 0) / r.tot[p] : 0;
  const change = r => {
    if(r === base || r.same) return "";
    let best = null;
    PHASES.forEach(p => {
      const dp = r.tot[p.k] / r.rel - base.tot[p.k] / base.rel;
      if(!best || Math.abs(dp) > Math.abs(best.d)) best = {d:dp, txt:`<b>${esc(p.label)}</b> ${fmtPct(base.tot[p.k] / base.rel)} → ${fmtPct(r.tot[p.k] / r.rel)} of the metal`};
      new Set([...Object.keys(r.F[p.k]), ...Object.keys(base.F[p.k])]).forEach(k => {
        const d = shr(r, p.k, k) - shr(base, p.k, k);
        if(Math.abs(d) > Math.abs(best.d)) best = {d, txt:`<b>${esc(formLabel(m, k, r.origLabel))}</b> in ${esc(p.label.toLowerCase())}: ${fmtPct(shr(base, p.k, k))} → ${fmtPct(shr(r, p.k, k))}`};
      });
    });
    return best && Math.abs(best.d) >= 0.005 ? `<span class="fchg">Biggest change from today: ${best.txt}</span>` : `<span class="fchg">Little change from today</span>`;
  };
  const rows = runs.map((r, i) => `<div class="frow"><div class="fscen"><b>${i + 1}. ${esc(r.sc.label)}</b><span>${esc(r.same ? "Same as today for your inputs" : r.sc.what)}</span>${change(r)}${r.harvest > 0 ? `<span>Removed with harvest: ${fmtPct(r.harvest / r.rel)}</span>` : ""}</div>${PHASES.map(p => cell(r, p)).join("")}</div>`).join("");
  // what changes: the main form in water across scenarios
  const mainW = runs.map(r => { const e = Object.entries(r.F.water).sort((a, b) => b[1] - a[1])[0]; return e ? `${formLabel(m, e[0], r.origLabel)} (${fmtPct(e[1] / r.tot.water)})` : null; });
  const tbl = `<details class="sc-table"><summary>Show as a table</summary><div class="tbl-wrap"><table><thead><tr><th>Scenario</th><th>Phase</th><th>Form</th><th>Share of phase</th><th>Share of all released</th><th>Mass</th></tr></thead><tbody>${runs.map((r, i) => PHASES.map(p => Object.entries(r.F[p.k]).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<tr><td>${i + 1}. ${esc(r.sc.label)}</td><td>${esc(p.label)}</td><td>${esc(formLabel(m, k, r.origLabel))}</td><td>${fmtPct(v / r.tot[p.k])}</td><td>${fmtPct(v / r.rel)}</td><td>${fmt(v)} kg</td></tr>`).join("")).join("")).join("")}</tbody></table></div></details>`;
  box.innerHTML = `<div class="flegend">${legend}</div><div class="fgrid"><div class="frow fhead"><span>Scenario</span>${PHASES.map(p => `<span>${esc(p.label)}</span>`).join("")}</div>${rows}</div>
    <p class="fsum">${mainW.some(Boolean) ? `<b>Main form in water:</b> ${runs.map((r, i) => `${i + 1}. ${esc(mainW[i] || "none")}`).join(" · ")}.` : ""}</p>${tbl}`;
}

/* ================= SCRIPTING API (for reproducible runs from the browser console) ================= */
window.SMP = window.CHemTrace = Object.freeze({
  _spread(){ const c = spreadSetup(); if(!c || !c.ok) return c && c.why; const f = spreadFrame(c, FRAMES[SP.frame]); const xs = []; for(let jj = 0; jj < f.ny; jj++) for(let ii = 0; ii < f.nx; ii++) if(f.best[jj * f.nx + ii]) xs.push([f.x0 + (ii + 0.5) * f.dx, -f.Wh + (jj + 0.5) * f.dy]); const [E, N] = c.world(xs.length ? xs[0][0] : 0, 0); return {dir:c.dir, n:xs.length, xmin:Math.min(...xs.map(v => v[0])), xmax:Math.max(...xs.map(v => v[0])), ymin:Math.min(...xs.map(v => v[1])), ymax:Math.max(...xs.map(v => v[1])), dx:f.dx, dy:f.dy, x0:f.x0, Y:c.Y, zB:f.zB, zP:f.zP}; },
  version:`${APP_VERSION} (${APP_DATE})`, presets:clone(PRESETS), base:clone(BASE), floods:Object.keys(FLOODS), budgetYears:BUD_T.slice(),
  // Automated code checks (verification, not validation): SMP.selfTest() in the browser console prints a table
  selfTest(){
    const out = [], ok = (check, pass, detail) => out.push({check, pass:!!pass, detail});
    const keepM = S.metal, keepI = INP, keepW = S.water;
    const setup = (metal, src) => { S.metal = metal; S.water = "base"; INP = Object.assign(freshInputs(PRESETS[src.preset] ? src.preset : "plateau"), clone(src)); if(!FORMS[metal].some(f => f.id === INP.form)) INP.form = FORMS[metal][0].id; const f = formOf(); if(src.reactive == null) INP.reactive = f.fr; return INP; };
    try{
      const ref = [[0.5, 0.5204998778], [1, 0.8427007929], [2, 0.995322265], [-1, -0.8427007929]];
      const e = Math.max(...ref.map(([x, v]) => Math.abs(erf(x) - v)));
      ok("Error function matches reference values", e < 2e-7, `largest error ${e.toExponential(1)} (method limit 1.5e-7)`);
      ok("Pb Kd follows log Kd = 1.99 + 0.42·pH", Math.abs(Math.log10(kdFn("Pb", {pH:6.5})) - (1.99 + 0.42 * 6.5)) < 1e-9, "pH 6.5");
      ok("Hg Kd equals Koc × organic carbon fraction", Math.abs(kdFn("Hg", {oc:2}) / (Math.pow(10, 5.5) * 0.02) - 1) < 1e-9, "2% organic carbon");
      const lo = kdFn("As", {fe:0.01, pH:12, drain:"perm", redox:"anoxic", sp:"III", pHigh:true}), hi = kdFn("Pb", {pH:14});
      ok("Kd stays inside the literature ranges at extreme inputs", lo >= Math.pow(10, 0.3) - 1e-9 && hi <= 1e5 + 1e-6, `As ${fmt(lo)} L/kg, Pb ${fmt(hi)} L/kg`);
      // topsoil mass balance against its analytical solution
      setup("As", {preset:"plateau", medium:"soil", form:"asV", pattern:"continuous", amount:50, duration:1000, drain:"perm", land:"agri"});
      const oA = core(INP, "As", ONES), b10 = budget(INP, "As", ONES, 10, []), an = 50 / oA.k * (1 - Math.exp(-oA.k * 10));
      ok("Topsoil follows S(t) = J/k·(1 − e^(−kt))", Math.abs(b10.B.top / an - 1) < 1e-6, `year 10: ${fmt(b10.B.top)} kg vs ${fmt(an)} kg`);
      // mass conservation everywhere
      let worst = 0, nCase = 0, worstF = 0;
      for(const m of ["As", "Hg", "Pb"]) for(const medium of ["soil", "air", "gw", "river"]) for(const flood of ["none", "once", "rp10"]) for(const T of [1, 25, 100]){
        setup(m, {preset:"plateau", medium, pattern:medium === "soil" ? "pulse" : "continuous", amount:10, duration:50, flood, budT:T, fastShare:10, loss:1});
        const b = budget(INP, m, ONES, T, floodPlan(flood, T, null)), sum = Object.values(b.B).reduce((a, v) => a + v, 0);
        worst = Math.max(worst, Math.abs(sum / b.rel - 1)); nCase++;
        if(T === 25) formsRun(INP, m).forEach(r => { const tot = r.tot.soil + r.tot.water + r.tot.air + r.harvest; worstF = Math.max(worstF, Math.abs(tot / r.rel - 1)); });
      }
      ok("Mass budget conserves mass", worst < 1e-9, `${nCase} cases, largest error ${worst.toExponential(1)}`);
      ok("Forms by phase add up to the released mass", worstF < 1e-9, `largest error ${worstF.toExponential(1)}`);
      // Monte Carlo is reproducible
      setup("Pb", {preset:"plateau", medium:"soil", form:"pbm"});
      const r1 = monteCarlo("Pb").slice(0, 20).map(x => x.cw), r2 = monteCarlo("Pb").slice(0, 20).map(x => x.cw);
      ok("Uncertainty runs are reproducible (fixed seed)", r1.every((v, i) => v === r2[i]), "two identical runs");
      // groundwater plume behaviour
      const P = {vr:10, Y:20, Z:5, under:false, srcs:[{C0:100, t0:0}]}, Q = framePrep(P, 1000), c = (x, y) => cAt(x, y, Q, axAt(x));
      ok("Plume is symmetric across the flow", Math.abs(c(150, 6) - c(150, -6)) < 1e-9, `${fmt(c(150, 6))} vs ${fmt(c(150, -6))}`);
      ok("Plume falls with distance at steady state", c(10, 0) > c(100, 0) && c(100, 0) > c(1000, 0), `${fmt(c(10, 0))} > ${fmt(c(100, 0))} > ${fmt(c(1000, 0))}`);
      ok("Plume equals the source next to it and is zero upstream", Math.abs(c(0.5, 0) / 100 - 1) < 0.05 && c(-50, 0) === 0, `${fmt(c(0.5, 0))} next to a source of 100`);
      const early = cAt(500, 0, framePrep(P, 10), axAt(500));
      ok("Plume has not reached beyond its travel distance", early < 1e-3, `at 500 m after 10 years (front near 100 m): ${fmt(early)}`);
      // groundwater dilution factor
      const d1 = dafFn(100, 0.003, 15, 0.4, 30).daf, d2 = dafFn(1000, 0.003, 15, 0.4, 30).daf;
      ok("Dilution factor is at least 1 and grows with conductivity", d1 >= 1 && d2 > d1, `${fmt(d1)} then ${fmt(d2)}`);
      // Hg⁰ escape from lake water: mass stays closed, summer loses more than winter
      let wEv = 0; const ev = {};
      for(const hgEvas of [10, 50]) for(const T of [1, 10, 100]){
        setup("Hg", {preset:"plateau", medium:"river", form:"hg2", amount:5, budT:T, hgEvas});
        const b = budget(INP, "Hg", ONES, T, []), sum = Object.values(b.B).reduce((a, v) => a + v, 0);
        wEv = Math.max(wEv, Math.abs(sum / b.rel - 1)); if(T === 10) ev[hgEvas] = b.B.evas / b.rel;
      }
      const cyc = (5 * SEASON_EVAS.summer + 7 * SEASON_EVAS.winter) / 12;
      ok("Hg⁰ escape from lakes keeps the budget closed", wEv < 1e-9 && ev[50] > ev[10] && ev[10] > 0 && Math.abs(cyc - 1) < 1e-12, `largest error ${wEv.toExponential(1)}; year 10 escaped ${fmtPct(ev[10])} at 10%/yr, ${fmtPct(ev[50])} at 50%/yr; seasonal cycle averages ${fmt(cyc)}`);
      // air: every class of the emission is accounted for, coarse dust lands closer than fine particles, wind keeps the total
      setup("Pb", {preset:"plateau", medium:"air", form:"pbo", stackH:30});
      const prof = airProfile(INP, 1), sumErr = Math.max(...prof.map(p => Math.abs(p.dry.reduce((a, v) => a + v, 0) + p.wet.reduce((a, v) => a + v, 0) + p.M[p.M.length - 1] - 1)));
      const med = p => { const tot = p.dry.map((v, j) => v + p.wet[j]); const T = tot.reduce((a, v) => a + v, 0); let c = 0; for(let j = 1; j < tot.length; j++){ c += tot[j]; if(c >= T / 2) return AIR_R[j]; } return Infinity; };
      const mF = med(prof[2]), mC = med(prof[4]);
      const wsum = I => { let t = 0; for(let k = 0; k < 360; k++) t += windDens(I, k + 0.5) * Math.PI / 180; return t; };
      const w1 = wsum(INP), w2 = wsum(Object.assign({}, INP, {windFrom:"225", windShare:60}));
      ok("Air deposition accounts for the whole emission", sumErr < 1e-9 && Math.abs(w1 - 1) < 1e-9 && Math.abs(w2 - 1) < 1e-9, `largest error ${sumErr.toExponential(1)}; wind directions sum to ${fmt(w2)}`);
      ok("Coarse dust lands closer than fine particles", mC < mF, `half of the large dust within ${fmt(mC)} m, half of the fine particles only beyond ${fmt(mF)} m`);
      // the budget stays closed with snow, forests, sealed surfaces, roads and glacier melt
      let wN = 0, nN = 0;
      const cases = [["Hg", {medium:"air", form:"hg2", elev:1600, land:"forest", sealedShare:20}], ["Pb", {medium:"air", form:"pbo", elev:2000, sealedShare:40, windFrom:"225"}], ["Pb", {medium:"air", form:"pbo", fdep:30}],
        ["Pb", {medium:"air", form:"pbs", pattern:"pulse", elev:3300}], ["Pb", {medium:"road"}], ["Pb", {medium:"road", roadEra:"leaded"}], ["As", {medium:"glacier"}], ["Hg", {medium:"soil", form:"hg0", pattern:"pulse"}]];
      for(const [mm, src] of cases) for(const T of [1, 10, 100]){
        setup(mm, Object.assign({preset:"plateau", amount:10, duration:50, budT:T}, src)); applyDerived(INP);
        const b = budget(INP, mm, ONES, T, []), sum = Object.values(b.B).reduce((a, v) => a + v, 0);
        wN = Math.max(wN, Math.abs(sum / b.rel - 1)); nN++;
        formsRun(INP, mm).forEach(r => { const tot = r.tot.soil + r.tot.water + r.tot.air + r.harvest; wN = Math.max(wN, Math.abs(tot / r.rel - 1)); });
      }
      ok("Budget and forms stay closed with snow, forests, roads and glacier melt", wN < 1e-9, `${nN} cases, largest error ${wN.toExponential(1)}`);
      // redox ladder steps down as organic carbon rises
      const ORD = ["oxic", "suboxic", "anoxic", "sulfidic"], cls = [1, 5, 10, 500].map(doc => { setup("As", {preset:"plateau", medium:"soil", rlOn:"on", docIn:doc, budT:1}); return redoxLadder(INP).cls; });
      ok("Redox ladder steps down as organic carbon rises", cls.every((c, i) => i === 0 || ORD.indexOf(c) >= ORD.indexOf(cls[i - 1])) && cls[0] === "oxic" && cls[3] === "sulfidic", `1, 5, 10, 500 mg C/L: ${cls.join(", ")}`);
    }catch(err){ ok("Checks ran without errors", false, String(err)); }
    finally{ S.metal = keepM; INP = keepI; S.water = keepW; }
    const passed = out.filter(r => r.pass).length;
    if(console.table) console.table(out);
    return {version:`${APP_VERSION} (${APP_DATE})`, passed, total:out.length, checks:out};
  },
  // added deposition (µg/m²/d, open land, most exposed direction) and air concentration (ng/m³) at the given distances for a release to air
  depositionProfile(metal, inputs, xs){
    const keepM = S.metal, keepI = INP;
    try{
      S.metal = metal; INP = Object.assign(freshInputs(PRESETS[inputs && inputs.preset] ? inputs.preset : "plateau"), clone(inputs || {}), {medium:"air"});
      if(!FORMS[metal].some(f => f.id === INP.form)) INP.form = FORMS[metal][0].id;
      const sh = airShares(INP, metal, 1);
      return (xs || [100, 200, 500, 1000, 2000, 5000]).map(x => { const p = airPoint(INP, sh, x, true); return {x, dep:p.dep * INP.amount * 1e9 / 365, air:(p.cPM + p.cGas) * INP.amount}; });
    } finally { S.metal = keepM; INP = keepI; }
  },
  // text of an export file for the current Advanced inputs, or for given ones: kind = phreeqc, hydrus, modflow or json
  exportFile(kind, metal, inputs){
    if(!EXPORTS[kind]) throw new Error("kind must be " + Object.keys(EXPORTS).join(", "));
    const keepM = S.metal, keepI = INP, keepW = S.water;
    try{
      if(metal){ if(!METALS[metal]) throw new Error("metal must be As, Hg or Pb"); S.metal = metal; }
      S.water = "base";
      if(inputs){ INP = Object.assign(freshInputs(PRESETS[inputs.preset] ? inputs.preset : "plateau"), clone(inputs)); if(!FORMS[S.metal].some(f => f.id === INP.form)) INP.form = FORMS[S.metal][0].id; const f = formOf(); if(inputs.reactive == null) INP.reactive = f.fr; applyLadder(INP); applyDerived(INP); }
      if(!INP) throw new Error("no inputs");
      if(!exportOK(INP)[kind]) throw new Error(kind + " export does not apply to a release to " + MEDIUM_LBL[INP.medium]);
      return {name:EXPORTS[kind].file(S.metal), text:EXPORTS[kind].make()};
    } finally { S.metal = keepM; INP = keepI; S.water = keepW; }
  },
  run(metal, inputs){
    if(!METALS[metal]) throw new Error("metal must be As, Hg or Pb");
    const keepM = S.metal, keepI = INP, keepW = S.water;
    try{
      S.metal = metal; S.water = "base";
      const src = inputs || {};
      INP = Object.assign(freshInputs(PRESETS[src.preset] ? src.preset : "plateau"), clone(src));
      if(!FORMS[metal].some(f => f.id === INP.form)) INP.form = FORMS[metal][0].id;
      const f = formOf(); if(src.reactive == null) INP.reactive = f.fr;
      const lad = applyLadder(INP); applyDerived(INP);
      const R = compute(), o = core(INP, metal, ONES);
      return {
        results: R.rows.map(r => ({id:r.id, label:r.label, value:r.v, unit:r.unit, tag:r.tag, p5:r.mc ? r.mc.p5 : null, p50:r.mc ? r.mc.p50 : null, p95:r.mc ? r.mc.p95 : null})),
        budget: {years:R.bud.T, floods:R.bud.fk, releasedKg:R.bud.c.rel, kg:Object.assign({}, R.bud.c.B), share90:Object.fromEntries(BUD.map(b => [b.k, R.bud.share[b.k]]))},
        forms: R.forms.map(r => ({scenario:r.sc.label, changed:r.sc.what, sameAsToday:r.same, years:r.T, releasedKg:r.rel, harvestKg:r.harvest,
          phases:Object.fromEntries(PHASES.map(p => [p.k, {kg:r.tot[p.k], forms:Object.fromEntries(Object.entries(r.F[p.k]).map(([k, v]) => [formLabel(metal, k, r.origLabel), v]))}]))})),
        drivers: R.sens.map(it => ({id:it.id, label:it.label, ranking:sensitivity(it, R).map(x => ({input:x.f.label, rho:x.rho}))})),
        internals: {Kd:o.Kd, kLeach:o.kL, kErosion:o.kE, kOther:o.kO, halfLife:o.half, travelToWaterTable:o.tArr, DAF:o.D ? o.D.daf : null, dissolvedShareRiver:o.fd, seepage:o.cw, seepageAdded:o.cwAdd, topsoilPeak:o.Ctot, sb:o.sb || null},
        ladder: lad ? {redox:lad.cls, drain:lad.drain, pe:lad.pe, electrons:lad.e, oxideStock:lad.cap, yearsToUseUpOxides:isFinite(lad.tEx) ? lad.tEx : null} : null,
        inputs: clone(INP)
      };
    } finally { S.metal = keepM; INP = keepI; S.water = keepW; }
  }
});

/* ================= EXPORTS FOR SPECIALISED MODELS =================
   This site gives the overview. These files hand the current scenario to codes built for the detail:
   PHREEQC (speciation, sorption, 1D reactive transport), HYDRUS-1D (unsaturated flow and transport),
   MODFLOW 6 with GWT (groundwater flow and plume). Every value comes from the current inputs;
   placeholders are marked ASSUMED. */
const MWT = {As:74.92, Hg:200.59, Pb:207.2};
const SOIL_REDOX = {well:"oxic", periodic:"suboxic", perm:"anoxic"};
const PQ_MIN = {Pb:["Cerussite", "Hydrocerussite", "Anglesite", "Pb(OH)2", "Galena"], Hg:["Montroydite", "Cinnabar", "Metacinnabar", "Hgmetal(l)"], As:["Arsenolite", "Orpiment", "Realgar"]};
// pe held in PHREEQC: oxic water is left to its dissolved O₂; the others are held by adding H₂ (a stand-in for organic carbon)
const PQ_PE = {oxic:null, suboxic:4, anoxic:0, sulfidic:-3.5};
const pq = v => { if(!isFinite(v) || v === 0) return "0"; const a = Math.abs(v); return a >= 1e4 || a < 1e-2 ? v.toExponential(3) : String(Number(v.toPrecision(4))); };
const xeDisp = L => L > 1 ? 0.83 * Math.pow(Math.log10(L), 2.414) : 0.1 * L;   // Xu & Eckstein (1995) longitudinal dispersivity, m
function exportCtx(){
  const m = S.metal, I = INP, o = core(I, m, ONES), soil = soilLike(I), riv = riverLike(I);
  const site = I.preset === "custom" ? (I.siteName ? "map location LV95 " + I.siteName : "custom site") : PRESETS[I.preset].label;
  const lad = I.rlOn === "on" ? redoxLadder(I) : null;
  return {m, I, o, soil, riv, site, lad, form:formOf(), date:new Date().toISOString().slice(0, 10), tag:`CHemTrace ${APP_VERSION}`};
}
// which exports make sense for this release
const exportOK = I => ({phreeqc:true, hydrus:soilLike(I), modflow:!riverLike(I), json:true});

function phreeqcInput(){
  const c = exportCtx(), {m, I, o, soil, riv} = c, mw = MWT[m];
  const zone = soil ? SOIL_REDOX[I.drain] : riv ? "oxic" : I.redox, pe = PQ_PE[zone], pe0txt = pe == null ? "set by dissolved O2" : String(pe);
  const o2 = I.rlOn === "on" ? I.o2In : 8;
  const pH = soil ? I.pH : riv ? I.lpH : I.gwpH;
  const kgL = soil ? I.rhob / I.theta : LAD_RB / I.ne;            // kg of solids per litre of pore water
  const fe = soil ? I.fe : I.aqFe, molFe = fe * kgL / 55.847;      // Fe oxides (oxalate-extractable) per litre of pore water
  const cScr = soil ? o.cw : riv ? o.cD : o.cgw, kdScr = soil ? o.Kd : riv ? o.kdSS : o.kdAq;
  const noSurf = !soil && !riv && I.aq !== "porous";               // karst and fractured rock: the website uses no sorption (R = 1)
  const tot = soil ? (o.fr * o.dC + I.bgReactive / 100 * o.bg) * kgL / 1000 / mw : cScr * (1 + (noSurf ? 0 : kdScr * kgL)) / 1e6 / mw;
  const where = soil ? "seepage water below the topsoil" : riv ? "river water" : "groundwater at the source";
  const chem = I.rlOn === "on" ? {so4:I.so4In, no3:I.no3In, src:"Redox tab"} : {so4:30, no3:15, src:"ASSUMED"};
  const pe0 = {oxic:"oxic", suboxic:"suboxic", anoxic:"anoxic", sulfidic:"sulfidic"}[zone];
  const L = [];
  L.push(`DATABASE minteq.v4.dat`);
  L.push(`TITLE ${c.tag}: ${m} at ${c.site}, ${where}`);
  L.push(`# Generated ${c.date}. A starting file for a specialist, not a result: check every line.`);
  L.push(`# Lines marked ASSUMED are placeholders. Replace them with your water analysis (major ions, alkalinity, Eh).`);
  L.push(`# Database: minteq.v4.dat, shipped with PHREEQC 3 (USGS). Command line: phreeqc chemtrace.pqi chemtrace.pqo minteq.v4.dat`);
  L.push(`#`);
  L.push(`# Screening values from the website, for comparison:`);
  L.push(`#   redox class ${pe0} (pe ${pe0txt}), pH ${pq(pH)}`);
  L.push(`#   dissolved ${m}: ${pq(cScr)} ug/L, Kd ${pq(kdScr)} L/kg${soil ? `, topsoil ${pq(o.Ctot)} mg/kg at the peak` : ""}`);
  if(noSurf) L.push(`#   ${I.aq} aquifer: water flows in conduits or fractures with little contact, so no sorbing surface is included`);
  else if(!riv) L.push(`#   per litre of pore water: ${pq(kgL)} kg of solids, ${pq(molFe)} mol Fe as oxides, ${pq(tot)} mol reactive ${m}`);
  L.push(`#`);
  L.push(riv ? `# Question: which dissolved species and minerals control ${m} in the river water?` :
    `# Question 1 (batch, chemtrace_batch.sel): do sorption on iron oxides and mineral solubility give the same dissolved ${m} and Kd?`);
  if(!riv) L.push(`# Question 2 (column, chemtrace_column.sel): when does ${m} arrive at the ${soil ? "water table" : "receptor"}, and at what concentration?`);
  L.push(`# Not represented: binding to organic matter (large for Hg and Pb: add humic sites, e.g. SURFACE with Hum or a`);
  L.push(`#   NICA-Donnan or WHAM model), clay exchange, redox kinetics, colloids and preferential flow.`);
  if(m === "Hg") L.push(`# For Hg the website Kd comes from organic matter (Koc), so expect a much lower Kd here until humic binding is added.`);
  L.push(``);
  L.push(`PHASES`);
  L.push(`Fix_pe          # holds pe at the chosen redox class (see EQUILIBRIUM_PHASES)`);
  L.push(`    e- = e-`);
  L.push(`    log_k 0.0`);
  L.push(`Fix_H+          # holds the measured pH (the soil or aquifer buffers it) by adding or removing ${pH < 6.5 ? "HCl" : "CO2"}`);
  L.push(`    H+ = H+`);
  L.push(`    log_k 0.0`);
  L.push(``);
  const sol = (n, label, metal) => {
    L.push(`SOLUTION ${n}  ${label}`);
    L.push(`    temp      10           # ASSUMED, typical Swiss groundwater`);
    L.push(`    pH        ${pq(pH)}`);
    L.push(`    pe        ${pe == null ? 8 : pe}            # redox class ${pe0}: ${pe == null ? "dissolved O2 below sets it" : "held by Fix_pe"}; suboxic 4, anoxic 0, sulfidic -3.5 (or measured Eh/59 mV)`);
    L.push(`    redox     ${pe == null ? "O(0)/O(-2)     # pe from dissolved O2" : "pe"}`);
    L.push(`    units     mg/L`);
    L.push(`    Ca        40${pH < 6 ? "          " : " charge   "}  # ASSUMED${pH < 6 ? "" : ", adjusted to balance charge"}`);
    L.push(`    Mg        8            # ASSUMED`);
    L.push(`    Na        5            # ASSUMED`);
    L.push(`    K         1.5          # ASSUMED`);
    L.push(`    Cl        ${pH < 6 ? "10 charge    # ASSUMED, adjusted to balance charge (acidic water)" : "10           # ASSUMED"}`);
    L.push(`    S(6)      ${pq(chem.so4)}           # sulfate, ${chem.src}`);
    L.push(`    N(5)      ${pq(chem.no3)} as NO3    # nitrate, ${chem.src}`);
    L.push(`    C(4)      1 CO2(g) ${riv ? "-3.0   # ASSUMED, river water near air" : "-2.0   # ASSUMED, soil air about 1% CO2"}`);
    if(metal > 0) L.push(`    ${m}        ${pq(metal / 1000)}       # ${pq(metal)} ug/L from the screening model`);
    if(pe == null) L.push(`    O(0)      ${pq(o2)}            # dissolved O2, ${I.rlOn === "on" ? "Redox tab" : "ASSUMED"}`);
    L.push(`    -water    1            # kg`);
  };
  const surf = (n, eq) => {
    if(noSurf){ L.push(`# SURFACE ${n}: none (${I.aq} aquifer). Add fracture-coating oxides here if you have measured them.`); return; }
    L.push(`SURFACE ${n}  iron oxides as hydrous ferric oxide (Dzombak & Morel 1990: 0.2 weak and 0.005 strong sites per Fe, 600 m2/g)`);
    L.push(`    -equilibrate with solution ${eq}`);
    L.push(`    Hfo_wOH   ${pq(0.2 * molFe)}   600   ${pq(89 * molFe)}    # mol sites, m2/g, g of oxide`);
    L.push(`    Hfo_sOH   ${pq(0.005 * molFe)}`);
  };
  const phases = n => {
    L.push(`EQUILIBRIUM_PHASES ${n}`);
    L.push(`    Fix_H+    ${-pH}   ${pH < 6.5 ? "HCl" : "CO2"}   10    # holds pH ${pq(pH)}`);
    if(pe != null) L.push(`    Fix_pe    ${-pe}   H2   1    # adds H2 (stand-in for organic carbon) until pe = ${pe}`);
    PQ_MIN[m].forEach(p => L.push(`    ${p.padEnd(15)} 0  0    # may precipitate; none present at the start`));
  };
  const siList = PQ_MIN[m].concat(["Calcite"]).join("  ");
  if(riv){
    sol(1, "river water with the screening dissolved concentration", cScr);
    L.push(`SELECTED_OUTPUT 1`);
    L.push(`    -file     chemtrace_river.sel`);
    L.push(`    -pH true`);
    L.push(`    -pe true`);
    L.push(`    -totals   ${m}`);
    L.push(`    -si       ${siList}`);
    L.push(`END`);
    L.push(`# Particles: the website uses Kd ${pq(kdScr)} L/kg on ${pq(o.ssc)} mg/L suspended matter. To model it, add a SURFACE for the`);
    L.push(`# suspended Fe and Mn oxides and organic matter of your river (analyse them on filtered particles).`);
    return L.join("\n") + "\n";
  }
  L.push(`# ---- Question 1: batch equilibrium at the source (numbered 100 so the column below does not reuse it) ----`);
  sol(100, `background ${soil ? "soil water" : "groundwater"} (no added ${m})`, 0);
  surf(100, 100);
  L.push(`END`);
  L.push(``);
  L.push(`USE solution 100`);
  if(!noSurf) L.push(`USE surface 100`);
  phases(100);
  const salt = m === "Pb" ? "PbCO3" : m === "Hg" ? "Hg(OH)2" : (c.form.sp === "III" ? "H3AsO3" : "H3AsO4");
  L.push(`REACTION 100  total reactive ${m} per litre of pore water (screening estimate: dissolved + sorbed), added as ${salt}`);
  L.push(`    ${salt}   1`);
  L.push(`    ${pq(tot)} moles in 1 steps`);
  L.push(`SELECTED_OUTPUT 1`);
  L.push(`    -file     chemtrace_batch.sel`);
  L.push(`    -reset    false`);
  L.push(`    -pH true`);
  L.push(`    -pe true`);
  L.push(`    -si       ${siList}`);
  L.push(`USER_PUNCH 1`);
  L.push(`    -headings dissolved_ug/L  sorbed_mg/kg  precipitated_mg/kg  Kd_L/kg`);
  L.push(`    10 w = TOT("water")`);
  L.push(`    20 d = TOT("${m}") * w`);
  L.push(`    30 s = SURF("${m}", "Hfo")`);
  L.push(`    40 p = ${pq(tot)} - d - s`);
  L.push(`    50 IF p < 0 THEN p = 0`);
  L.push(`    60 PUNCH d / w * ${mw} * 1e6`);
  L.push(`    70 PUNCH s * ${mw} * 1000 / ${pq(kgL)}`);
  L.push(`    80 PUNCH p * ${mw} * 1000 / ${pq(kgL)}`);
  L.push(`    90 IF d > 0 THEN PUNCH s / (d / w) / ${pq(kgL)} ELSE PUNCH 0`);
  L.push(`END`);
  L.push(``);
  // column: topsoil to water table, or source to receptor in the aquifer
  const N = 10;
  const len = soil ? Math.max(0.1, o.Lz) : Math.max(1, I.medium === "gw" ? I.wellDist : I.rivDist);
  const vYr = soil ? o.q / I.theta : o.qAq / I.ne;                  // pore-water velocity, m/yr
  const dtYr = len / N / Math.max(vYr, 1e-9);
  let shifts = Math.ceil(I.horizon / dtYr), capped = false;
  if(shifts > 1000){ shifts = 1000; capped = true; }
  const disp = soil ? Math.max(0.01, len / 10) : xeDisp(len);
  const cIn = soil ? o.cw : o.cgw;
  L.push(`# ---- Question 2: 1D column, ${soil ? `topsoil to the water table (${pq(len)} m of subsoil)` : `source to ${I.medium === "gw" ? "the well or spring" : "the river"} (${pq(len)} m of aquifer)`} ----`);
  L.push(`# Pore-water velocity ${pq(vYr)} m/yr, so one cell (${pq(len / N)} m) per ${pq(dtYr)} years.`);
  if(capped) L.push(`# Fast flow: ${pq(I.horizon)} years would need ${Math.ceil(I.horizon / dtYr)} shifts. Capped at 1000 shifts = ${pq(1000 * dtYr)} years; raise -shifts`, `#   (slow) or use the MODFLOW 6 download for the plume and this column for the chemistry.`);
  if(!soil && I.aq !== "porous") L.push(`# WARNING: ${I.aq} aquifer. A porous-medium column misrepresents conduit flow; use tracer tests and a dual-porosity or conduit model.`);
  L.push(`SELECTED_OUTPUT 1`);
  L.push(`    -active   false`);
  sol(0, `inflow: ${soil ? "seepage water leaving the topsoil at the peak" : "groundwater at the source"}`, cIn);
  sol(`1-${N}`, `background water in the column (no added ${m})`, 0);
  surf(`1-${N}`, 1);
  phases(`1-${N}`);
  L.push(`END`);
  L.push(``);
  L.push(`SELECTED_OUTPUT 2`);
  L.push(`    -file     chemtrace_column.sel`);
  L.push(`    -reset    false`);
  L.push(`USER_PUNCH 2`);
  L.push(`    -headings years  cell  depth_m  dissolved_ug/L  sorbed_mg/kg`);
  L.push(`    10 PUNCH TOTAL_TIME / 31557600, CELL_NO, DIST`);
  L.push(`    20 PUNCH TOT("${m}") * ${mw} * 1e6`);
  L.push(`    30 PUNCH ${noSurf ? "0" : `SURF("${m}", "Hfo") * ${mw} * 1000 / ${pq(kgL)}`}`);
  L.push(`TRANSPORT`);
  L.push(`    -cells                 ${N}`);
  L.push(`    -lengths               ${pq(len / N)}`);
  L.push(`    -shifts                ${shifts}`);
  L.push(`    -time_step             ${pq(dtYr * YEAR_S)}    # seconds`);
  L.push(`    -flow_direction        forward`);
  L.push(`    -boundary_conditions   flux flux`);
  L.push(`    -dispersivities        ${pq(disp)}    # m, ${soil ? "ASSUMED one tenth of the path" : "Xu & Eckstein (1995) at this distance"}`);
  L.push(`    -diffusion_coefficient 1e-9`);
  L.push(`    -punch_cells           1-${N}       # rows for every cell: the last cell is the breakthrough, all cells show the front`);
  L.push(`    -punch_frequency       ${Math.max(1, Math.ceil(shifts / 20))}`);
  L.push(`END`);
  L.push(`# Website screening estimate: ${soil ? `arrival at the water table ${fmtYr(o.tArr)} years` : `travel time ${fmtYr(I.medium === "gw" ? o.tW : len * (I.aq === "porous" ? 1 + LAD_RB * o.kdAq / I.ne : 1) / Math.max(vYr, 1e-9))} years`} (Kd ${pq(soil ? o.kdSub : o.kdAq)} L/kg).`);
  return L.join("\n") + "\n";
}

function hydrusSheet(){
  const c = exportCtx(), {m, I, o} = c;
  const prof = Math.max(o.d + 0.1, I.wt) * 100, top = o.d * 100;      // cm
  const qcm = o.q * 100 / 365.25;                                    // cm/d
  const cTop = I.pattern === "pulse" ? 0 : (o.J > 0 && o.q > 0 ? o.fr * o.J / o.q : 0);  // reactive input per infiltrating water, continuous release (mg/m²/yr ÷ m/yr = µg/L)
  const cIni = o.cwAdd;                                               // µg/L in topsoil water at the peak
  const R = [["Section", "HYDRUS-1D field", "Value", "Unit", "Source", "Note"]];
  const add = (s, f, v, u, src, n) => R.push([s, f, v, u, src, n || ""]);
  add("About", `${c.tag}: ${m} at ${c.site}`, c.date, "", "", "Starting values for HYDRUS-1D (PC-Progress). Not a result: replace every ASSUMED value with site data.");
  add("Main processes", "Water flow / Solute transport", "on / on", "", "", "Solute transport: General solute transport, equilibrium model");
  add("Geometry", "Depth of the soil profile", pq(prof), "cm", "Groundwater tab: depth to water table", I.wt * 100 < prof ? "Raised to the topsoil mixing depth" : "");
  add("Geometry", "Number of materials", "2", "", "", "1 = topsoil (mixing layer), 2 = subsoil");
  add("Geometry", "Material 1 from 0 to", pq(top), "cm", "Release tab: mixing depth", "");
  add("Time", "Time units / Final time", `days / ${pq(I.horizon * 365.25)}`, "d", "Release tab: assessment horizon", `${pq(I.horizon)} years`);
  add("Water flow", "Hydraulic model", "van Genuchten-Mualem, no hysteresis", "", "", "");
  ["1 topsoil", "2 subsoil"].forEach(mat => {
    add(`Water flow, material ${mat}`, "Qr / Qs / Alpha / n / Ks / l", "0.078 / 0.43 / 0.036 / 1.56 / 24.96 / 0.5", "- / - / 1/cm / - / cm/d / -", "ASSUMED: HYDRUS catalogue, loam (Carsel & Parrish 1988)", "Use Rosetta with your texture and bulk density");
  });
  add("Water flow BC", "Upper boundary", "Atmospheric BC with daily data (best) or constant flux", "", "", "MeteoSwiss station data for precipitation and evapotranspiration");
  add("Water flow BC", "Constant flux (if used)", pq(-qcm), "cm/d", "Site tab: precipitation × infiltration share", "Negative = into the soil; mean net infiltration " + pq(o.q * 1000) + " mm/yr");
  add("Water flow BC", "Lower boundary", I.wt <= 3 ? "Constant pressure head 0 cm (water table)" : "Free drainage", "", "Groundwater tab", "");
  add("Water flow IC", "Initial condition", "Pressure head -100 cm, or run water flow alone first and use its end state", "cm", "ASSUMED", "");
  add("Solute transport", "Mass units / Number of solutes", "ug / 1", "", "", "With length in cm, 1 ug/cm3 = 1000 ug/L");
  add("Solute transport", "Time weighting / Space weighting", "Crank-Nicholson / Galerkin FE", "", "HYDRUS defaults", "Keep the Peclet and Courant numbers below 2 and 1");
  add("Solute parameters, material 1", "Bulk.d. / Disp. / Frac / ThImob", `${pq(I.rhob)} / ${pq(Math.max(1, prof / 10))} / 1 / 0`, "g/cm3 / cm / - / -", "Soil tab; dispersivity ASSUMED one tenth of the profile", "");
  add("Solute parameters, material 2", "Bulk.d. / Disp. / Frac / ThImob", `${pq(I.rhob)} / ${pq(Math.max(1, prof / 10))} / 1 / 0`, "g/cm3 / cm / - / -", "ASSUMED same as topsoil", "Measure subsoil bulk density");
  add("Solute parameters", "Diffus. W / Diffus. G", "0.8 / 0", "cm2/d", "Free-water diffusion of metal ions", "");
  add("Reaction, material 1", "Kd / Nu / Beta", `${pq(o.Kd)} / 0 / 1`, "cm3/g / - / -", num(I.kdSoil) ? "Your measured Kd" : "Website estimate (Soil tab)", "Linear sorption; 1 L/kg = 1 cm3/g. Better: fit Freundlich (Beta) to a batch test");
  add("Reaction, material 2", "Kd / Nu / Beta", `${pq(o.kdSub)} / 0 / 1`, "cm3/g / - / -", "Website estimate: subsoil with 30% of the topsoil organic carbon", "");
  if(o.fr < 1) add("Reaction", "Non-reactive share", pq((1 - o.fr) * 100), "%", "Release tab: reactive share", "HYDRUS treats all metal as reactive: enter only the reactive part below");
  add("Solute BC", "Upper boundary", I.pattern === "pulse" ? "Concentration flux BC, cTop = 0" : "Concentration flux BC", "", "", "");
  add("Solute BC", "cTop (continuous release)", I.pattern === "pulse" ? "0" : `${pq(cTop / 1000)}`, "ug/cm3", "Release tab: deposition or load ÷ infiltration", I.pattern === "pulse" ? "Pulse release: the metal starts in the topsoil (initial condition)" : `= ${pq(cTop)} ug/L for ${pq(Math.min(I.duration, I.horizon) * 365.25)} days, then 0; reactive share only`);
  add("Solute BC", "Lower boundary", "Zero concentration gradient", "", "", "");
  add("Solute IC", "Liquid concentration in material 1", I.pattern === "pulse" ? pq(cIni / 1000) : "0", "ug/cm3", I.pattern === "pulse" ? "Website: topsoil seepage water after the release" : "", I.pattern === "pulse" ? `= ${pq(cIni)} ug/L; HYDRUS adds the sorbed part with Kd` : "Add background if you model it");
  add("Observation", "Observation node", pq(prof), "cm", "", "At the water table: compare its breakthrough with the website");
  add("Compare", "Website: arrival at the water table", fmtYr(o.tArr), "years", "Screening, slow matrix flow", "");
  add("Compare", "Website: seepage water at the peak", pq(o.cw), "ug/L", "Screening", "Includes the reactive background");
  add("Compare", "Website: topsoil half-life", fmtYr(o.half), "years", "Screening", "Leaching, erosion and other losses");
  add("Not in HYDRUS-1D standard", "Erosion, runoff, preferential flow", "", "", "", "Use the dual-permeability option for macropores; erosion is a separate model");
  return R.map(r => r.map(v => { const s = String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(",")).join("\r\n") + "\r\n";
}

function modflowScript(){
  const c = exportCtx(), {m, I, o, soil} = c, gw = I.medium === "gw";
  const Kd = o.kdAq, R = I.aq === "porous" ? 1 + LAD_RB * Kd / I.ne : 1;
  const dist = gw ? Math.max(10, I.wellDist) : Math.max(10, I.rivDist);
  const loadKgYr = gw ? I.amount : o.leachKg;
  const srcW = gw ? I.gwWidth : Math.sqrt(o.A), srcL = gw ? 0 : Math.sqrt(o.A);
  const lim = (I.drink === "yes" ? LIM.tbdv : LIM.altl1)[m];
  const P = [];
  P.push(`"""${c.tag}: MODFLOW 6 groundwater flow and transport (GWT) starting model.`);
  P.push(``);
  P.push(`${m} at ${c.site}. Generated ${c.date} from the screening inputs.`);
  P.push(`A starting point for a specialist, not a result. Replace every value marked ASSUMED.`);
  P.push(``);
  P.push(`What it builds: an aquifer block aligned with the groundwater flow (x points downgradient),`);
  P.push(`steady flow between two fixed-head boundaries that give your hydraulic gradient, and transient`);
  P.push(`transport of ${m} with linear sorption from the source cells for the assessment horizon.`);
  P.push(`It prints the concentration at the receptor ${pq(dist)} m downgradient and writes chemtrace_receptor.csv`);
  P.push(`(and chemtrace_plume.png if matplotlib is installed).`);
  P.push(``);
  P.push(`Needs Python 3, flopy (pip install flopy) and the mf6 program from`);
  P.push(`https://github.com/MODFLOW-ORG/modflow6/releases (or: get-modflow :flopy). Set MF6_EXE if mf6 is not on the PATH.`);
  P.push(`Run: python chemtrace_modflow6.py`);
  P.push(``);
  P.push(`Real sites need more: the measured water-table map, rivers as boundaries, pumping wells, recharge,`);
  P.push(`heterogeneous K and, for karst or fractured rock, a conduit or dual-porosity model instead of this one.`);
  P.push(`"""`);
  P.push(`import os`);
  P.push(`import numpy as np`);
  P.push(`import flopy`);
  P.push(``);
  P.push(`# ---- inputs from the website (m, days, kg) ----`);
  P.push(`K = ${pq(I.K * 86400)}            # hydraulic conductivity, m/d (Groundwater tab: ${pq(I.K)} m/s)`);
  P.push(`GRADIENT = ${pq(I.grad)}         # hydraulic gradient`);
  P.push(`THICK = ${pq(I.thick)}             # saturated aquifer thickness, m`);
  P.push(`POROSITY = ${pq(I.ne)}          # effective porosity`);
  P.push(`KD = ${pq(Kd)}                # L/kg, aquifer Kd (${num(I.kdAq) ? "your value" : "website estimate"})${I.aq !== "porous" ? "; the website uses no retardation in " + I.aq + " rock" : ""}`);
  P.push(`BULK_DENSITY = 1800.0        # kg/m3, ASSUMED as in the website`);
  P.push(`LOAD = ${pq(loadKgYr)}              # kg/yr of ${m} entering the aquifer (${gw ? "Release tab" : "website leaching flux at the peak topsoil concentration"})`);
  P.push(`SRC_WIDTH = ${pq(srcW)}         # m across the flow`);
  P.push(`SRC_LENGTH = ${pq(srcL)}        # m along the flow (0 = one cell)`);
  P.push(`YEARS = ${pq(I.horizon)}             # assessment horizon`);
  P.push(`DIST = ${pq(dist)}              # m to the ${gw ? "well or spring" : "river or lake"}`);
  P.push(`BACKGROUND = ${pq(I.bgGw[m])}        # ug/L in groundwater`);
  P.push(`LIMIT = ${pq(lim)}             # ug/L, ${I.drink === "yes" ? "drinking-water limit (TBDV)" : "AltlV Annex 1 concentration value"}`);
  P.push(`NLAY = 3                     # ASSUMED layering; the source enters the top layer`);
  if(soil) P.push(`DELAY = ${pq(isFinite(o.tArr) ? o.tArr : 1e9)}            # years before the seepage reaches the water table (website estimate); the load starts then`);
  else P.push(`DELAY = 0.0`);
  P.push(``);
  P.push(`# ---- website screening values, for comparison ----`);
  P.push(gw ? `# concentration mixed over the plume section: ${pq(o.cgw)} ug/L; travel time to the receptor: ${fmtYr(o.tW)} years (retardation ${pq(R)})` :
    `# groundwater under the source (DAF ${pq(o.D.daf)}): ${pq(o.cgw)} ug/L; retardation in the aquifer ${pq(R)}`);
  P.push(``);
  P.push(`# ---- grid: x downgradient, y across ----`);
  P.push(`LX = max(1.5 * DIST, DIST + 200.0)`);
  P.push(`X0 = -max(50.0, SRC_LENGTH)        # model starts upgradient of the source`);
  P.push(`LY = max(200.0, 6.0 * SRC_WIDTH, 0.4 * LX)`);
  P.push(`DX = float(np.clip(round((LX - X0) / 120.0), 2, 25))`);
  P.push(`NCOL = int(np.ceil((LX - X0) / DX))`);
  P.push(`NROW = int(np.ceil(LY / DX)) | 1           # odd, so a row runs along the centre line`);
  P.push(`xc = X0 + (np.arange(NCOL) + 0.5) * DX`);
  P.push(`yc = (np.arange(NROW) - NROW // 2) * DX`);
  P.push(`v = K * GRADIENT / POROSITY                 # pore-water velocity, m/d`);
  P.push(`R = ${I.aq === "porous" ? "1.0 + BULK_DENSITY * KD / 1000.0 / POROSITY" : "1.0                                    # website: no retardation in " + I.aq + " rock"}`);
  P.push(`NSTP = int(np.clip(np.ceil(v / R * YEARS * 365.25 / DX), 50, 400))   # implicit scheme: more steps sharpen the front`);
  P.push(`if DELAY >= YEARS:`);
  P.push(`    print(f"Note: the website expects slow seepage to reach the water table only after {DELAY:.3g} years, beyond the horizon.")`);
  P.push(`    print("This run starts the load at once, to show the plume once it has arrived (or what fast paths would do).")`);
  P.push(`    DELAY = 0.0`);
  P.push(`# two periods when the load starts late: nothing until the seepage arrives, then the load`);
  P.push(`periods = [(YEARS * 365.25, NSTP, 1.0)] if DELAY <= 0 else [(DELAY * 365.25, max(5, NSTP // 10), 1.0), ((YEARS - DELAY) * 365.25, NSTP, 1.0)]`);
  P.push(``);
  P.push(`ws = "chemtrace_mf6"`);
  P.push(`exe = os.environ.get("MF6_EXE", "mf6")`);
  P.push(`sim = flopy.mf6.MFSimulation(sim_name="smp", sim_ws=ws, exe_name=exe)`);
  P.push(`flopy.mf6.ModflowTdis(sim, time_units="days", nper=len(periods), perioddata=periods)`);
  P.push(``);
  P.push(`# flow`);
  P.push(`gwf = flopy.mf6.ModflowGwf(sim, modelname="flow", save_flows=True)`);
  P.push(`ims_flow = flopy.mf6.ModflowIms(sim, filename="flow.ims", complexity="SIMPLE", inner_dvclose=1e-8, outer_dvclose=1e-8)`);
  P.push(`dz = THICK / NLAY`);
  P.push(`botm = [THICK - dz * (k + 1) for k in range(NLAY)]`);
  P.push(`flopy.mf6.ModflowGwfdis(gwf, nlay=NLAY, nrow=NROW, ncol=NCOL, delr=DX, delc=DX, top=THICK, botm=botm)`);
  P.push(`flopy.mf6.ModflowGwfnpf(gwf, icelltype=0, k=K, k33=K / 10.0, save_specific_discharge=True)   # k33 ASSUMED K/10`);
  P.push(`h0 = THICK + GRADIENT * (LX - X0)`);
  P.push(`flopy.mf6.ModflowGwfic(gwf, strt=h0)`);
  P.push(`chd = [[(k, i, 0), h0] for k in range(NLAY) for i in range(NROW)] + [[(k, i, NCOL - 1), THICK] for k in range(NLAY) for i in range(NROW)]`);
  P.push(`flopy.mf6.ModflowGwfchd(gwf, stress_period_data=chd)`);
  P.push(`flopy.mf6.ModflowGwfoc(gwf, budget_filerecord="flow.cbc", head_filerecord="flow.hds", saverecord=[("HEAD", "LAST"), ("BUDGET", "LAST")])`);
  P.push(``);
  P.push(`# transport (concentration in kg/m3; x 1e6 gives ug/L)`);
  P.push(`gwt = flopy.mf6.ModflowGwt(sim, modelname="trans")`);
  P.push(`ims_trans = flopy.mf6.ModflowIms(sim, filename="trans.ims", linear_acceleration="BICGSTAB", inner_dvclose=1e-10, outer_dvclose=1e-10)`);
  P.push(`sim.register_ims_package(ims_flow, ["flow"])`);
  P.push(`sim.register_ims_package(ims_trans, ["trans"])`);
  P.push(`flopy.mf6.ModflowGwtdis(gwt, nlay=NLAY, nrow=NROW, ncol=NCOL, delr=DX, delc=DX, top=THICK, botm=botm)`);
  P.push(`flopy.mf6.ModflowGwtic(gwt, strt=0.0)`);
  P.push(`flopy.mf6.ModflowGwtadv(gwt, scheme="TVD")`);
  P.push(`alh = 0.83 * np.log10(max(DIST, 10.0)) ** 2.414   # Xu & Eckstein (1995) at the receptor distance`);
  P.push(`flopy.mf6.ModflowGwtdsp(gwt, alh=alh, ath1=alh / 10.0, atv=alh / 100.0, diffc=0.0)`);
  P.push(`flopy.mf6.ModflowGwtmst(gwt, porosity=POROSITY, sorption=${I.aq === "porous" ? '"linear"' : "None"}, bulk_density=BULK_DENSITY, distcoef=KD / 1000.0)   # distcoef in m3/kg`);
  P.push(`src_cells = [(0, i, j) for i in range(NROW) for j in range(NCOL)`);
  P.push(`             if abs(yc[i]) <= max(SRC_WIDTH / 2.0, DX / 2.0) and -max(SRC_LENGTH, DX) / 2.0 <= xc[j] - SRC_LENGTH / 2.0 <= max(SRC_LENGTH, DX) / 2.0]`);
  P.push(`rate = LOAD / 365.25 / len(src_cells)          # kg/d per cell`);
  P.push(`flopy.mf6.ModflowGwtsrc(gwt, stress_period_data={len(periods) - 1: [[c, rate] for c in src_cells]})`);
  P.push(`flopy.mf6.ModflowGwtssm(gwt)   # inflow across the fixed-head boundaries carries no ${m}`);
  P.push(`flopy.mf6.ModflowGwtoc(gwt, concentration_filerecord="trans.ucn", saverecord=[("CONCENTRATION", "ALL")])`);
  P.push(`flopy.mf6.ModflowGwfgwt(sim, exgtype="GWF6-GWT6", exgmnamea="flow", exgmnameb="trans")`);
  P.push(``);
  P.push(`sim.write_simulation(silent=True)`);
  P.push(`ok, _ = sim.run_simulation(silent=True)`);
  P.push(`if not ok:`);
  P.push(`    raise SystemExit("MODFLOW 6 did not finish: see the listing files in " + ws)`);
  P.push(``);
  P.push(`# ---- results ----`);
  P.push(`ucn = gwt.output.concentration()`);
  P.push(`times = np.array(ucn.get_times())`);
  P.push(`jr = int(np.argmin(np.abs(xc - DIST)))`);
  P.push(`ir = NROW // 2`);
  P.push(`rec = np.array([ucn.get_data(totim=t)[0, ir, jr] for t in times]) * 1e6 + BACKGROUND`);
  P.push(`np.savetxt(os.path.join(ws, "chemtrace_receptor.csv"), np.c_[times / 365.25, rec], delimiter=",", header="years,${m}_ug_per_L_top_layer", comments="")`);
  P.push(`print(f"${m} at {DIST:.0f} m downgradient, top layer: {rec[-1]:.3g} ug/L after {YEARS:g} years (limit {LIMIT:g} ug/L)")`);
  P.push(`above = times[rec > LIMIT]`);
  P.push(`print("Above the limit from year", round(above[0] / 365.25, 1)) if above.size else print("Below the limit at the receptor over the horizon")`);
  P.push(`last = ucn.get_data(totim=times[-1])[0] * 1e6 + BACKGROUND`);
  P.push(`print(f"Area above the limit in the top layer: {(last > LIMIT).sum() * DX * DX:.0f} m2")`);
  P.push(`try:`);
  P.push(`    import matplotlib`);
  P.push(`    matplotlib.use("Agg")`);
  P.push(`    import matplotlib.pyplot as plt`);
  P.push(`    fig, ax = plt.subplots(figsize=(8, 4))`);
  P.push(`    cs = ax.contourf(xc, yc, np.log10(np.maximum(last, 1e-6)), levels=20, cmap="viridis")`);
  P.push(`    ax.contour(xc, yc, last, levels=[LIMIT], colors="red")`);
  P.push(`    ax.plot([DIST], [0], "k^")`);
  P.push(`    ax.set_xlabel("m downgradient"); ax.set_ylabel("m across")`);
  P.push(`    ax.set_title(f"${m}, top layer, year {YEARS:g}: log10 ug/L; red = limit")`);
  P.push(`    fig.colorbar(cs, ax=ax)`);
  P.push(`    fig.savefig(os.path.join(ws, "chemtrace_plume.png"), dpi=150, bbox_inches="tight")`);
  P.push(`except ImportError:`);
  P.push(`    pass`);
  return P.join("\n") + "\n";
}

function resultsJson(){
  const r = SMP.run(S.metal, clone(INP));
  return JSON.stringify(Object.assign({app:"chemtrace", appVersion:APP_VERSION, generated:new Date().toISOString(), metal:S.metal}, r), null, 2) + "\n";
}
const EXPORTS = {
  phreeqc:{file:m => `chemtrace_${m}_phreeqc.pqi`, type:"text/plain", make:phreeqcInput},
  hydrus:{file:m => `chemtrace_${m}_hydrus1d.csv`, type:"text/csv", make:hydrusSheet},
  modflow:{file:m => `chemtrace_${m}_modflow6.py`, type:"text/x-python", make:modflowScript},
  json:{file:m => `chemtrace_${m}_run.json`, type:"application/json", make:resultsJson}
};
function downloadText(name, text, type){
  const b = new Blob([text], {type:(type || "text/plain") + ";charset=utf-8"}), a = document.createElement("a");
  a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
function renderFurther(){
  const box = $("#further"); if(!box || !INP) return;
  const ok = exportOK(INP);
  box.querySelectorAll("button[data-x]").forEach(b => {
    const k = b.dataset.x; b.disabled = !ok[k];
    const n = box.querySelector(`[data-xn="${k}"]`);
    if(n) n.textContent = ok[k] ? EXPORTS[k].file(S.metal) : (k === "hydrus" ? "For soil and air releases (there is no soil path here)." : "For releases that reach groundwater.");
  });
  const w = [];
  if(!riverLike(INP) && INP.aq !== "porous") w.push(`This is a ${INP.aq === "karst" ? "karst" : "fractured-rock"} aquifer: porous-medium codes misrepresent fast conduit flow. Use tracer tests and a conduit or dual-porosity model for the groundwater part.`);
  if(riverLike(INP)) w.push("River release: the PHREEQC file covers speciation of the river water. For lake and river mass balances, a box model such as AQUASIM (Eawag) is the next step.");
  $("#furtherNote").textContent = w.join(" ");
  $("#furtherNote").hidden = !w.length;
}

/* ================= INIT ================= */
setPlay(S.playing);
initSite();
if(initAdv()) setMode(true, true);
setMetal(S.metal);
(function(){ const sc = $(".stage-scroll"); if(sc.scrollWidth > sc.clientWidth) sc.scrollLeft = (sc.scrollWidth - sc.clientWidth) * .6; })();
requestAnimationFrame(tick);
if(S.adv) showMapIfNeeded();
})();
