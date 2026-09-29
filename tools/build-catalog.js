/* ===========================================================================
   tools/build-catalog.js  —  DEV TOOL (run once with Node, output is committed)
   ---------------------------------------------------------------------------
   Parses the original astro.unl.edu/animationsLinks.html (saved under astroUNL/)
   and emits assets/js/catalog-data.js, a static data file consumed at runtime.

   It produces:
     • the faithful ClassAction + NAAP section → module → 126-entry listing
     • a deduplicated, topic-grouped list for the home page
     • Indonesian title translations + topic/module names (descriptions stay EN)
     • the mapping from original animations to our rebuilt simulations

   Run:  node tools/build-catalog.js
   =========================================================================== */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
// Prefer the vendored copy (committed, makes the build reproducible);
// fall back to a full astroUNL/ site download if present.
const SRC = fs.existsSync(path.join(__dirname, "animationsLinks.html"))
  ? path.join(__dirname, "animationsLinks.html")
  : path.join(ROOT, "astroUNL", "animationsLinks.html");
const OUT = path.join(ROOT, "assets", "js", "catalog-data.js");
const SITE = path.join(ROOT, "astroUNL");      // full download (gitignored); used only to copy assets
const ORIG = path.join(ROOT, "originals");     // committed preview .jpg + original .swf, path-preserving

const html = fs.readFileSync(SRC, "utf8");

// preview/swf live under originals/ with the original relative path preserved
function assetsFor(href) {
  const rel = href.replace(/\.html$/, "");
  return { preview: "originals/" + rel + ".jpg", swf: "originals/" + rel + ".swf" };
}
let copied = 0;
function copyAssets(href) {
  if (!fs.existsSync(SITE)) return;            // fresh clone: assets already committed
  const rel = href.replace(/\.html$/, "");
  [".jpg", ".swf"].forEach(function (ext) {
    const src = path.join(SITE, rel + ext), dst = path.join(ORIG, rel + ext);
    if (fs.existsSync(src) && !fs.existsSync(dst)) {
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.copyFileSync(src, dst); copied++;
    }
  });
}

/* ---- 1. parse resourceData {id: {desc, src, title}} ---- */
const rd = {};
const block = html.slice(html.indexOf("resourceData = {"), html.indexOf("/* ]]>"));
const re = /(\bca\d+|\bnaap\d+):\s*\{desc:\s*"((?:[^"\\]|\\.)*)",\s*src:\s*"([^"]*)",\s*title:\s*"((?:[^"\\]|\\.)*)"\}/g;
let m;
while ((m = re.exec(block))) {
  rd[m[1]] = { desc: decode(m[2]), src: m[3], title: decode(m[4]) };
}

/* ---- 2. parse the section → module → items structure ---- */
// Split into ClassAction (<h3>ClassAction</h3>..) and NAAP (<h3>NAAP</h3>..)
const sections = [];
const h3re = /<h3>(ClassAction|NAAP)<\/h3>([\s\S]*?)(?=<h3>|<\/div>\s*<!-- end listContainer)/g;
let hm;
while ((hm = h3re.exec(html))) {
  const secName = hm[1] === "NAAP" ? "NAAP Labs" : "ClassAction";
  const modules = [];
  const modre = /<div class="moduleTitle">([\s\S]*?)<\/div>\s*<div class="moduleItems">([\s\S]*?)<\/div>/g;
  let mm;
  while ((mm = modre.exec(hm[2]))) {
    const modTitle = decode(stripTags(mm[1]).trim());
    const items = [];
    const lire = /<a id="(ca\d+|naap\d+)" href="([^"]+)">/g;
    let lm;
    while ((lm = lire.exec(mm[2]))) items.push({ id: lm[1], href: lm[2] });
    modules.push({ title: modTitle, items });
  }
  sections.push({ id: hm[1] === "NAAP" ? "naap" : "classaction", title: secName, modules });
}

/* ---- 3. translation + mapping dictionaries ---- */
const TITLE_ID = require("./catalog-id-titles.js");        // EN title -> ID title
const MODULE_ID = {
  "Introductory Concepts": "Konsep Pengantar",
  "Basic Motions & Ancient Astronomy": "Gerak Dasar & Astronomi Kuno",
  "Coordinates and Motions": "Koordinat dan Gerak",
  "Lunar Cycles": "Siklus Bulan",
  "Renaissance Astronomy": "Astronomi Renaisans",
  "Light & Spectra": "Cahaya & Spektrum",
  "Telescopes and Astronomical Instruments": "Teleskop dan Instrumen Astronomi",
  "Sun and Solar Energy": "Matahari dan Energi Surya",
  "Stellar Properties": "Sifat Bintang",
  "Binary and Variable Stars": "Bintang Ganda dan Variabel",
  "Milky Way Galaxy": "Galaksi Bima Sakti",
  "Cosmology": "Kosmologi",
  "Solar System Characteristics": "Karakteristik Tata Surya",
  "ExtraSolar Planets": "Planet Luar Surya",
  "Solar System Debris": "Puing Tata Surya",
  "200 Level": "Tingkat Lanjut",
  "Solar System Models": "Model Tata Surya",
  "Basic Coordinates and Seasons": "Koordinat Dasar dan Musim",
  "The Rotating Sky": "Langit Berputar",
  "Motions of the Sun": "Gerak Matahari",
  "Planetary Orbit Simulator": "Simulator Orbit Planet",
  "Lunar Phase Simulator": "Simulator Fase Bulan",
  "Blackbody Curves and UBV Filters": "Kurva Benda Hitam dan Filter UBV",
  "Hydrogen Energy Levels": "Tingkat Energi Hidrogen",
  "Hertzsprung-Russell Diagram": "Diagram Hertzsprung-Russell",
  "Eclipsing Binary Simulator": "Simulator Biner Gerhana",
  "Atmospheric Retention": "Retensi Atmosfer",
  "Extrasolar Planets": "Planet Luar Surya",
  "Variable Star Photometry": "Fotometri Bintang Variabel",
  "Cosmic Distance Ladder": "Tangga Jarak Kosmik",
  "Habitable Zones": "Zona Layak Huni"
};

// topic taxonomy for the home page
const TOPICS = [
  ["math", "General & Math", "Umum & Matematika", "Foundational tools, scale and angular measurement.", "Alat dasar, skala, dan pengukuran sudut."],
  ["coords", "Coordinates & the Celestial Sphere", "Koordinat & Bola Langit", "Horizon and equatorial systems; the rotating sky.", "Sistem horizon dan ekuatorial; langit yang berputar."],
  ["sun", "Motions of the Sun & Seasons", "Gerak Matahari & Musim", "The Sun's daily and yearly paths, the ecliptic and seasons.", "Lintasan harian dan tahunan Matahari, ekliptika, dan musim."],
  ["moon", "Lunar Phases & Eclipses", "Fase Bulan & Gerhana", "Why the Moon shows phases, tides and how eclipses happen.", "Mengapa Bulan berfase, pasang surut, dan terjadinya gerhana."],
  ["orbits", "Planetary Orbits & Renaissance Astronomy", "Orbit Planet & Astronomi Renaisans", "Kepler's laws, retrograde motion, gravity and configurations.", "Hukum Kepler, gerak retrograd, gravitasi, dan konfigurasi."],
  ["light", "Light, Spectra & Atoms", "Cahaya, Spektrum & Atom", "Blackbody radiation, spectra, the hydrogen atom and Doppler shift.", "Radiasi benda hitam, spektrum, atom hidrogen, dan Doppler."],
  ["telescopes", "Telescopes & Instruments", "Teleskop & Instrumen", "How telescopes, detectors and optics gather light.", "Bagaimana teleskop, detektor, dan optik mengumpulkan cahaya."],
  ["solar", "The Sun & Solar System", "Matahari & Tata Surya", "Solar fusion, planet formation and solar-system properties.", "Fusi surya, pembentukan planet, dan sifat tata surya."],
  ["stars", "Stellar Properties & the H-R Diagram", "Sifat Bintang & Diagram H-R", "Luminosity, temperature, distance and the lives of stars.", "Luminositas, suhu, jarak, dan kehidupan bintang."],
  ["binary", "Binary & Variable Stars", "Bintang Ganda & Variabel", "Eclipsing binaries, center of mass and variable-star photometry.", "Biner gerhana, pusat massa, dan fotometri bintang variabel."],
  ["exoplanets", "Extrasolar Planets", "Planet Luar Surya", "Detecting planets by transits, radial velocity and timing.", "Mendeteksi planet via transit, kecepatan radial, dan pewaktuan."],
  ["galaxy", "The Milky Way", "Bima Sakti", "Galactic rotation, dark matter and spiral structure.", "Rotasi galaksi, materi gelap, dan struktur spiral."],
  ["cosmology", "Cosmology & Distances", "Kosmologi & Jarak", "Lookback time, redshift, the distance ladder and expansion.", "Waktu tilik-balik, pergeseran merah, tangga jarak, dan ekspansi."],
  ["atmosphere", "Atmospheres & Habitable Zones", "Atmosfer & Zona Layak Huni", "Gas retention, escape velocity and where water can exist.", "Retensi gas, kecepatan lepas, dan tempat air bisa ada."]
];

const MODULE_TOPIC = {
  "Introductory Concepts": "math",
  "Basic Motions & Ancient Astronomy": "coords",
  "Coordinates and Motions": "coords",
  "Lunar Cycles": "moon",
  "Renaissance Astronomy": "orbits",
  "Light & Spectra": "light",
  "Telescopes and Astronomical Instruments": "telescopes",
  "Sun and Solar Energy": "solar",
  "Stellar Properties": "stars",
  "Binary and Variable Stars": "binary",
  "Milky Way Galaxy": "galaxy",
  "Cosmology": "cosmology",
  "Solar System Characteristics": "solar",
  "ExtraSolar Planets": "exoplanets",
  "Solar System Debris": "solar",
  "200 Level": "coords",
  "Solar System Models": "orbits",
  "Basic Coordinates and Seasons": "sun",
  "The Rotating Sky": "coords",
  "Motions of the Sun": "sun",
  "Planetary Orbit Simulator": "orbits",
  "Lunar Phase Simulator": "moon",
  "Blackbody Curves and UBV Filters": "light",
  "Hydrogen Energy Levels": "light",
  "Hertzsprung-Russell Diagram": "stars",
  "Eclipsing Binary Simulator": "binary",
  "Atmospheric Retention": "atmosphere",
  "Extrasolar Planets": "exoplanets",
  "Variable Star Photometry": "binary",
  "Cosmic Distance Ladder": "cosmology",
  "Habitable Zones": "atmosphere"
};
const SLUG_TOPIC = { lookbacktimesim: "cosmology", smallangledemo: "math" };

// our rebuilt simulations, keyed by original slug (lowercased basename)
const READY = {
  smallangledemo: "small-angle",
  lightdetector: "flux-inverse-square",
  sunmotions: "sun-motions",
  lps: "lunar-phases", lunarapplet: "lunar-phases",
  kepler: "kepler",
  blackbody: "blackbody", bbexplorer: "blackbody",
  hydrogen_atom: "hydrogen-atom", hydrogenatom: "hydrogen-atom",
  hrexplorer: "hr-diagram",
  ebs: "eclipsing-binary", eclipsingbinarysim: "eclipsing-binary",
  transitsimulator: "exoplanet-transit",
  parallaxexplorer: "parallax",
  ellipsedemo: "ellipsedemo",
  retrograde: "retrograde",
  altazimuth: "altazimuth",
  dopplershift: "dopplershift",
  radialvelocitysimulator: "radial-velocity",
  stellarhabitablezone: "habitable-zone",
  emspectrum: "em-spectrum",
  centerofmass: "center-of-mass",
  synodiccalculator: "synodic-period",
  gravcalc: "gravcalc",
  snellslaw: "snellslaw",
  stellarmag: "stellarmag",
  balloon: "balloon",
  daylighthoursexplorer: "daylighthoursexplorer",
  keplers_third: "keplers_third",
  stellarlum: "stellarlum",
  stellarvel: "stellarvel",
  sunsrays: "sunsrays",
  galacticredshift: "galacticredshift",
  obliquity: "obliquity",
  tidesim: "tidesim",
  lookbacktimesim: "lookbacktimesim",
  lightcurve: "lightcurve",
  venusphases: "venusphases",
  radecdemo: "radecdemo",
  sunpaths: "sunpaths",
  parallaxdiag: "parallaxdiag",
  telescope10: "telescope10",
  configurationssimulator: "configurationssimulator",
  filters: "filters",
  meridaltdiagram: "meridaltdiagram",
  latsim: "latsim",
  mooninc: "mooninc",
  synodiclag: "synodiclag",
  wagonwheel: "wagonwheel",
  gravalgebra: "gravalgebra",
  shadowsim: "shadowsim",
  buckets: "buckets",
  marsorbit: "marsorbit",
  threeviewsspectra: "threeviewsspectra",
  ca_extrasolarplanets_graph: "ca_extrasolarplanets_graph",
  eclipsetable: "eclipsetable",
  lunar_phaser: "lunar_phaser",
  pathtracer: "pathtracer",
  radialvelocitydemo: "radialvelocitydemo",
  formationtemps: "formationtemps",
  solarsystemproperties: "solarsystemproperties",
  ca_extrasolarplanets_starwobble: "ca_extrasolarplanets_starwobble",
  bigdipper: "bigdipper",
  gasretentionplot: "gasRetentionPlot",
  milkywayrotationalvelocity: "milkywayrotationalvelocity",
  sncurveexplorer: "snCurveExplorer",
  clusterfittingexplorer: "clusterFittingExplorer",
  antipodesexplorer: "antipodesexplorer",
  seasonsim: "seasonsim",
  phasedemonstrator: "phaseDemonstrator",
  moonphases: "moonphases",
  positionsdemonstrator: "positionsdemonstrator",
  moonphaseshorizondiagram: "positionsdemonstrator",
  fullmoondec: "fullmoondec",
  celestialhorizon: "celestialhorizon",
  ce_hc: "ce_hc", celhorcomp: "ce_hc",
  fusion01: "fusion01",
  fusion02: "fusion02",
  hammerthrower: "hammerthrower",
  trafficdensity: "trafficdensity",
  seasons_ecliptic: "seasons_ecliptic", eclipticsimulator: "seasons_ecliptic",
  zodiac: "zodiac",
  sunmotionsoverview: "sunmotionsoverview",
  moonbisector: "moonbisector", moonbisectordemo: "moonbisector",
  siderealsolartime: "siderealSolarTime",
  spectroparallax: "spectroparallax",
  longlat: "longlat",
  horizon: "horizon",
  siderealtimeandhourangledemo: "siderealtimeandhourangledemo",
  dipperclock: "dipperclock",
  drivingthroughsnow: "drivingthroughsnow",
  photometrysimulator: "photometrysimulator",
  registrationsimulator: "registrationsimulator",
  blinkcomparatorsimulator: "blinkcomparatorsimulator",
  pulsarperiodsim001: "pulsarperiodsim001",
  earthorbitplot: "earthorbitplot",
  spectrum010: "spectrum010",
  milkywayhabitability: "milkyWayHabitability",
  meltednail: "meltednail",
  lunarphasequizzer: "lunarphasequizzer",
  variablestarphotometryanalyzer: "variableStarPhotometryAnalyzer",
  gasretentionsimulator: "gasRetentionSimulator",
  transitmovie: "transitmovie",
  daylightsimulator: "daylightsimulator",
  heliacalrisingsim: "heliacalrisingsim",
  basketball: "basketball"
};

// href-specific overrides — for slugs that collide between DIFFERENT animations sharing a
// SWF basename (e.g. ptolemaic.swf is both NAAP's "Ptolemaic System Simulator" and ClassAction's
// "Ptolemaic Phases of Venus"). Keyed by the exact item href; checked before the slug map.
const READY_HREF = {
  "naap/ssm/animations/ptolemaic.html": "ptolemaic",          // the NAAP Ptolemaic System Simulator
  "classaction/animations/renaissance/ptolemaic.html": "ptolemaicvenus"   // ClassAction Ptolemaic Phases of Venus
};

/* ---- 4. assemble entries ---- */
function slugOf(href) { return path.basename(href, ".html"); }
function topicFor(moduleTitle, slug, title) {
  if (SLUG_TOPIC[slug.toLowerCase()]) return SLUG_TOPIC[slug.toLowerCase()];
  if (moduleTitle === "Coordinates and Motions") {
    if (/sun|season|daylight|ecliptic|zodiac|obliquit/i.test(title)) return "sun";
    return "coords";
  }
  return MODULE_TOPIC[moduleTitle] || "math";
}

const outSections = sections.map(function (sec) {
  return {
    id: sec.id,
    title: { en: sec.title, id: sec.id === "naap" ? "NAAP Labs" : "ClassAction" },
    modules: sec.modules.map(function (mod) {
      return {
        title: { en: mod.title, id: MODULE_ID[mod.title] || mod.title },
        items: mod.items.map(function (it) {
          const data = rd[it.id] || { title: it.id, desc: "" };
          const slug = slugOf(it.href);
          copyAssets(it.href);
          const a = assetsFor(it.href);
          return {
            srcId: it.id, slug: slug, href: it.href, preview: a.preview, swf: a.swf,
            title: { en: data.title, id: TITLE_ID[data.title] || data.title },
            desc: data.desc,
            ready: READY_HREF[it.href] || READY[slug.toLowerCase()] || null,
            topic: topicFor(mod.title, slug, data.title)
          };
        })
      };
    })
  };
});

/* ---- 5. dedupe for the topic browse ---- */
const seen = {};
const sims = [];
outSections.forEach(function (sec) {
  sec.modules.forEach(function (mod) {
    mod.items.forEach(function (it) {
      const key = it.ready ? "sim:" + it.ready : "slug:" + it.slug.toLowerCase();
      if (seen[key]) {
        // prefer a cleaner representative title (NAAP / no "(NAAP)" suffix / shorter)
        const cur = seen[key];
        const better = (sec.id === "naap" && !/\(NAAP\)/.test(it.title.en)) ||
          (it.title.en.length < cur.title.en.length && !/\(NAAP\)/.test(it.title.en));
        if (better) { cur.title = it.title; cur.desc = it.desc; cur.preview = it.preview; cur.swf = it.swf; cur.href = it.href; }
        cur.count++;
        return;
      }
      const sim = {
        key: key, slug: it.slug, ready: it.ready, topic: it.topic,
        title: it.title, desc: it.desc, href: it.href, preview: it.preview, swf: it.swf, count: 1
      };
      seen[key] = sim; sims.push(sim);
    });
  });
});

/* ---- 6. emit ---- */
const data = {
  topics: TOPICS.map(function (t) {
    return { id: t[0], title: { en: t[1], id: t[2] }, desc: { en: t[3], id: t[4] } };
  }),
  sims: sims.map(function (s) {
    return { slug: s.slug, topic: s.topic, ready: s.ready, title: s.title, desc: s.desc,
      preview: s.preview, swf: s.swf, href: s.href };
  }),
  sections: outSections
};

const banner = "/* AUTO-GENERATED by tools/build-catalog.js — do not edit by hand.\n" +
  "   Source: astroUNL/animationsLinks.html (UNL NAAP & ClassAction).\n" +
  "   Regenerate after changing the build script or translations. */\n";
fs.writeFileSync(OUT, banner + "window.ANIM = " + JSON.stringify(data, null, 1) + ";\n");

/* ---- summary ---- */
const total = outSections.reduce((a, s) => a + s.modules.reduce((b, m) => b + m.items.length, 0), 0);
const ready = sims.filter((s) => s.ready).length;
console.log("entries (faithful):", total);
console.log("unique sims (topic browse):", sims.length, "| ready:", ready);
console.log("assets copied into originals/:", copied, fs.existsSync(SITE) ? "" : "(astroUNL/ not present — using committed assets)");
console.log("untranslated titles:", sims.filter((s) => s.title.en === s.title.id &&
  !/^(NAAP|ClassAction)/.test(s.title.en)).map((s) => s.title.en).join(" | ") || "(none)");

/* ---- helpers ---- */
function stripTags(s) { return s.replace(/<[^>]*>/g, ""); }
function decode(s) {
  return s.replace(/&amp;/g, "&").replace(/&ndash;/g, "–").replace(/&mdash;/g, "—")
    .replace(/&#0?155;/g, "›").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\\"/g, '"').replace(/\\'/g, "'");
}
