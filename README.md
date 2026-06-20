# Cosmos Lab — Interactive Astronomy Simulations

A modern, **bilingual (English / Bahasa Indonesia)** recreation of the classic
[UNL Astronomy](https://astro.unl.edu/animationsLinks.html) Flash applets
(the **NAAP** and **ClassAction** projects), rebuilt in **plain HTML + vanilla
JavaScript** so they run on any device with no plugins — Flash is long gone, but
the physics is forever.

- **No build step, no framework, no runtime dependencies.** Just static files.
- **HiDPI `<canvas>` rendering** with a small shared simulation framework.
- **Full internationalization** — every label switches between EN/ID instantly,
  and the choice is remembered.
- **Deployable as-is** to GitHub Pages, Cloudflare Pages, Netlify, or any static host.

> _Sebuah pembuatan ulang modern dan dwibahasa dari applet astronomi Flash klasik
> UNL, dibangun dengan HTML & JavaScript murni agar berjalan di perangkat apa pun.
> Tanpa langkah build, tanpa framework — cukup file statis._

---

## Run locally

It's just static files, so any static server works:

```bash
# Python (built in on macOS/Linux)
python3 -m http.server 4178
# then open http://localhost:4178

# or Node
npx serve .
```

Opening `index.html` directly via `file://` also works, because translations and
the catalog are plain `<script>` files (no `fetch`).

---

## Project structure

```
.
├── index.html                 # home — topic-grouped catalog browse
├── originals.html             # the faithful "All 126" ClassAction + NAAP listing
├── play.html                  # plays an original .swf via the Ruffle emulator
├── favicon.svg                # site icon
├── sims/<id>.html             # one tiny HTML host per rebuilt simulation
├── assets/
│   ├── css/styles.css         # all styling (dark space theme)
│   ├── img/og-banner.svg      # social-share image
│   └── js/
│       ├── i18n.js            # translation engine + shared UI strings
│       ├── ui.js              # shared header / footer / language switch / nav
│       ├── catalog-data.js    # GENERATED data: 126 entries + topics (do not edit)
│       ├── home.js            # renders the topic-browse home page
│       ├── originals.js       # renders the faithful 126 listing
│       ├── play.js            # drives the Ruffle player
│       ├── sim.js             # shared framework for a simulation page
│       └── sims/<id>.js       # the logic for each individual simulation
├── originals/                 # bundled original previews (.jpg) + animations (.swf)
├── tools/
│   ├── animationsLinks.html   # vendored source catalog (UNL), for reproducible builds
│   ├── catalog-id-titles.js   # Indonesian title translations
│   └── build-catalog.js       # regenerates catalog-data.js + copies originals/ assets
└── .github/workflows/deploy.yml   # GitHub Pages deploy
```

### Play the original (Flash via Ruffle)

Every one of the 126 entries can be played right now — even before it's rebuilt —
via [`play.html?a=<slug>`](play.html), which runs the original `.swf` in the browser
through the [Ruffle](https://ruffle.rs) emulator (no plugin needed). The original
animations and their preview screenshots are bundled under `originals/` (~15 MB),
and `tools/build-catalog.js` copies them there automatically from a local `astroUNL/`
download when present. Ruffle itself is loaded from its CDN; vendor it under `assets/`
and update the `<script>` in `play.html` for full offline use.

### How the catalog works

The catalog is **generated**, not hand-written. `tools/build-catalog.js` parses
the original `animationsLinks.html` (all 126 ClassAction + NAAP animations) and
emits `assets/js/catalog-data.js`, which the site loads at runtime. It produces:

- the **126-entry faithful listing** (`originals.html`) in the original ClassAction
  and NAAP module groupings, and
- a **deduplicated, topic-grouped list** (`index.html`) — ~106 unique simulations
  across 14 topics.

Each entry knows whether it has been rebuilt (`ready`). Titles, topic names and
module names are bilingual; the longer descriptions are currently English and are
being translated in a later pass.

Regenerate after editing the build script, translations, or mappings:

```bash
node tools/build-catalog.js
```

---

## Adding a new simulation

Each simulation is one self-contained file. To rebuild an original animation as an
interactive `my-sim`:

**1.** Map the original animation's slug to your new id in the `READY` table in
`tools/build-catalog.js`, then run `node tools/build-catalog.js`. (The slug is the
filename of the original animation, e.g. `dopplershift` → `doppler-shift`.) This
marks every catalog entry for that animation as interactive and links it to
`sims/my-sim.html`.

**2.** Create the host page (identical for every sim — copy an existing one):

```html
<!-- sims/my-sim.html -->
<!DOCTYPE html><html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="../assets/css/styles.css">
</head><body>
  <script src="../assets/js/i18n.js"></script>
  <script src="../assets/js/ui.js"></script>
  <script src="../assets/js/catalog-data.js"></script>
  <script src="../assets/js/sim.js"></script>
  <script src="../assets/js/sims/my-sim.js"></script>
</body></html>
```

**3.** Write the simulation in `assets/js/sims/my-sim.js`:

```js
Sim.create({
  id: "my-sim",
  width: 760, height: 460,
  strings: { en: { "k.label": "Speed" }, id: { "k.label": "Kecepatan" } },
  about:   { en: "<p>…</p>", id: "<p>…</p>" },
  build: function (S) {
    var v = 1;
    S.slider({ labelKey: "k.label", min: 0, max: 10, value: v, on: function (x){ v = x; } });
    S.onDraw(function () {
      S.clear();
      // draw with S.ctx in a (0,0)–(S.W,S.H) coordinate space
    });
  }
});
```

The framework (`sim.js`) gives you the page chrome, a HiDPI canvas, and i18n-aware
controls: `S.slider`, `S.toggle`, `S.select`, `S.button`, `S.readout`,
`S.group`, `S.onDraw` / `S.requestDraw`, and `S.loop` + `S.playPause` for
animation. Titles/descriptions come from the catalog entry automatically.

---

## Deployment

### GitHub Pages (automated)
A workflow is included at `.github/workflows/deploy.yml`. Push to `main`, then in
your repo go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
That's it — the site publishes from the repo root. (`.nojekyll` is included so
Pages serves the files verbatim.)

### Cloudflare Pages
Create a project from your repo with:
- **Build command:** _(leave empty)_
- **Build output directory:** `/` (the repo root)

### Netlify / any static host
Drag-and-drop the folder, or point the host at the repo root. No build needed.

---

## The 11 interactive simulations so far

| Topic | Simulation |
|---|---|
| Math | Small-Angle Approximation |
| Light | Inverse-Square Law |
| Sun & Seasons | Motions of the Sun |
| Lunar | Lunar Phase Simulator |
| Orbits | Planetary Orbit Simulator (Kepler's laws) |
| Blackbody | Blackbody Curves & Wien's Law |
| Spectra | Hydrogen Atom & Spectral Lines |
| H-R | H-R Diagram Explorer |
| Binary | Eclipsing Binary Simulator |
| Exoplanets | Exoplanet Transit Simulator |
| Cosmology | Stellar Parallax |

The full catalog of **126 original animations** (≈106 unique) is browsable on the
home page and the [All 126](originals.html) page; the remaining ones are scaffolded
and ready to be rebuilt with the pattern above.

---

## Credits & attribution

The original simulations were created by the **University of Nebraska–Lincoln
Astronomy Education Group** (NAAP & ClassAction projects). This is an independent,
educational re-implementation in modern web technology and is **not affiliated
with UNL**. All code here is original.

## License

MIT — see [LICENSE](LICENSE).
