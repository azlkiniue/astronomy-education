/* Solar System Properties Explorer ---------------------------------------------
   Faithful rebuild of the ClassAction "solarsystemproperties.swf" (histoClass,
   decompiled). A bar chart of one property at a time for the nine classical
   planets, with the terrestrial planets, the jovian planets and Pluto each in
   their own colour and each able to be hidden.

   The axis is chosen the way the SWF does it: a "good" high (ceil, to 10s above
   20) and low (floor, or 0.1 / 0.001 on a log axis), switching to a logarithmic
   scale whenever the raw spread exceeds 70. Hovering a bar swaps its colour for
   the number it stands for, as in the original. The rotation-period data is in
   the SWF too, but its radio button is hidden there, so it is left out here.  */
Sim.create({
  id: "solarsystemproperties",
  width: 700, height: 455,
  strings: {
    en: {
      "ssp.prop": "Property", "ssp.groups": "Types of planets", "ssp.hint": "Hover over a bar to read its value.",
      "ssp.terr": "Terrestrial", "ssp.jov": "Jovian", "ssp.plu": "Pluto (not a planet)",
      "ssp.axis": "Semi-major Axis (AU)", "ssp.orbital": "Orbital Period (yr)", "ssp.mass": "Mass (Earth masses)",
      "ssp.radius": "Radius (Earth radii)", "ssp.satellite": "Satellites", "ssp.density": "Density (g/cm³)",
      "ssp.axisS": "Semi-Major Axis", "ssp.orbitalS": "Orbital Period", "ssp.massS": "Mass",
      "ssp.radiusS": "Radius", "ssp.satelliteS": "Satellites", "ssp.densityS": "Density",
      "ssp.scale": "scale", "ssp.log": "logarithmic", "ssp.lin": "linear", "ssp.shown": "planets shown",
      "pl.mercury": "Mercury", "pl.venus": "Venus", "pl.earth": "Earth", "pl.mars": "Mars", "pl.jupiter": "Jupiter",
      "pl.saturn": "Saturn", "pl.uranus": "Uranus", "pl.neptune": "Neptune", "pl.pluto": "Pluto"
    },
    id: {
      "ssp.prop": "Sifat", "ssp.groups": "Jenis planet", "ssp.hint": "Arahkan penunjuk ke sebuah batang untuk melihat nilainya.",
      "ssp.terr": "Kebumian", "ssp.jov": "Jovian", "ssp.plu": "Pluto (bukan planet)",
      "ssp.axis": "Sumbu Semi-Mayor (SA)", "ssp.orbital": "Periode Orbit (thn)", "ssp.mass": "Massa (massa Bumi)",
      "ssp.radius": "Jari-jari (jari-jari Bumi)", "ssp.satellite": "Satelit", "ssp.density": "Kerapatan (g/cm³)",
      "ssp.axisS": "Sumbu semi-mayor", "ssp.orbitalS": "Periode orbit", "ssp.massS": "Massa",
      "ssp.radiusS": "Jari-jari", "ssp.satelliteS": "Satelit", "ssp.densityS": "Kerapatan",
      "ssp.scale": "skala", "ssp.log": "logaritmik", "ssp.lin": "linear", "ssp.shown": "planet ditampilkan",
      "pl.mercury": "Merkurius", "pl.venus": "Venus", "pl.earth": "Bumi", "pl.mars": "Mars", "pl.jupiter": "Jupiter",
      "pl.saturn": "Saturnus", "pl.uranus": "Uranus", "pl.neptune": "Neptunus", "pl.pluto": "Pluto"
    }
  },
  about: {
    en: "<p>Lined up side by side, the planets sort themselves into families. The four <strong>terrestrial</strong> planets huddle close to the Sun and are small, dense and rocky. The four <strong>jovian</strong> planets orbit far out, are enormous, have low densities and keep dozens of moons apiece. Pluto fits neither pattern — it is tiny, icy and on a tilted, eccentric orbit, which is why it was reclassified as a dwarf planet in 2006.</p>" +
        "<p>Watch what happens to the axis as you change property. Semi-major axis, radius and density span less than a factor of a hundred, so a linear scale works. Mass runs from Pluto's 0.002 Earth masses to Jupiter's 318 — five orders of magnitude — so the chart switches to a <strong>logarithmic</strong> axis, where each gridline is ten times the one below. Bar charts on a log axis are worth reading carefully: a bar twice as tall means a value ten times, not two times, larger.</p>" +
        "<p>The moon counts are the SWF's own 2009 figures. Surveys have since pushed Saturn past 270 known moons and Jupiter past 90, but the pattern the chart shows — gas giants with swarms of satellites, inner planets with almost none — has only become clearer.</p>",
    id: "<p>Disandingkan berdampingan, planet-planet mengelompok menjadi keluarga. Empat planet <strong>kebumian</strong> berkerumun dekat Matahari: kecil, rapat, dan berbatu. Empat planet <strong>jovian</strong> mengorbit jauh di luar: sangat besar, berkerapatan rendah, dan memiliki puluhan bulan. Pluto tidak masuk pola mana pun — mungil, berselimut es, dengan orbit miring dan lonjong, sebabnya ia digolongkan ulang sebagai planet kerdil pada 2006.</p>" +
        "<p>Perhatikan sumbunya saat Anda berganti sifat. Sumbu semi-mayor, jari-jari, dan kerapatan hanya merentang kurang dari seratus kali lipat, sehingga skala linear memadai. Massa merentang dari 0,002 massa Bumi (Pluto) hingga 318 (Jupiter) — lima orde besaran — sehingga grafik beralih ke sumbu <strong>logaritmik</strong>, yang setiap garisnya sepuluh kali garis di bawahnya. Grafik batang berskala logaritmik harus dibaca dengan cermat: batang dua kali lebih tinggi berarti nilainya sepuluh kali, bukan dua kali, lebih besar.</p>" +
        "<p>Jumlah bulan adalah angka 2009 dari SWF aslinya. Survei sejak itu membawa Saturnus melewati 270 bulan yang diketahui dan Jupiter melewati 90, tetapi pola yang ditunjukkan grafik ini — raksasa gas dengan gerombolan satelit, planet dalam nyaris tanpa satelit — justru semakin jelas.</p>"
  },
  build: function (S) {
    var LOG = Math.log10;
    var OY = -30;                                     // crop the SWF's title bar
    var EX = { x: 8, y: 432.65 + OY };                // the "explorer" clip's origin = the graph baseline
    var FONT = "Verdana, Geneva, sans-serif";
    var PIXEL_HIGH = -350, PIXEL_LOW = 0;             // high_tick._y / low_tick._y
    var X_OFFSET = 100.1, GRAPH_LEN = 562.24, BAR_W0 = 80, TICK_X = 70;
    var COL = { terr: "#f58181", jov: "#80a9e6", plu: "#74cf7c" };

    var NAMES = ["pl.mercury", "pl.venus", "pl.earth", "pl.mars", "pl.jupiter", "pl.saturn", "pl.uranus", "pl.neptune", "pl.pluto"];
    var GROUPS = [{ key: "terr", first: 0, last: 3 }, { key: "jov", first: 4, last: 7 }, { key: "plu", first: 8, last: 8 }];
    var DATA = {                                      // the SWF's own arrays, Mercury … Pluto
      axis: [0.39, 0.72, 1, 1.52, 5.2, 9.5, 19.2, 30.1, 39.5],
      orbital: [0.24, 0.62, 1, 1.9, 11.9, 29.4, 84, 164, 248],
      mass: [0.055, 0.82, 1, 0.11, 318, 95, 15, 17, 0.002],
      radius: [0.38, 0.95, 1, 0.53, 11.2, 9.5, 4, 3.9, 0.2],
      satellite: [0, 0, 1, 2, 63, 62, 27, 13, 3],
      density: [5.4, 5.2, 5.5, 3.91, 1.3, 0.7, 1.3, 1.6, 2.1]
    };
    var VARS = ["axis", "orbital", "mass", "radius", "satellite", "density"];

    var variable = "axis", show = { terr: true, jov: true, plu: true }, hover = -1;

    S.group("ssp.prop");
    S.select({
      labelKey: "ssp.prop", value: variable,
      options: VARS.map(function (v) { return { v: v, labelKey: "ssp." + v + "S" }; }),
      on: function (v) { variable = v; upd(); }
    });
    S.group("ssp.groups");
    GROUPS.forEach(function (g) {
      S.toggle({ labelKey: "ssp." + g.key, value: true, on: function (b) { show[g.key] = b; upd(); } });
    });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ssp.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var outScale = S.readout({ labelKey: "ssp.scale" });
    var outShown = S.readout({ labelKey: "ssp.shown" });

    /* ---- histoClass: pick a "good" axis, log if the raw spread exceeds 70 ---- */
    function goodHigh(v) { return v > 20 ? Math.ceil(v / 10) * 10 : Math.ceil(v); }
    function goodLow(v, log) {
      if (log) return v === 0 ? 0 : (v < 0.01 ? 0.001 : 0.1);
      return v < 0 ? 0 : (v < 20 ? Math.floor(v) : Math.floor(v / 10) * 10);
    }
    function axis() {
      var a = DATA[variable], hi = Math.max.apply(null, a), lo = Math.min.apply(null, a);
      var log = Math.abs(hi - lo) > 70;
      var high = goodHigh(hi), low = goodLow(lo, log);
      if (log && low === 0) low = 0.01;               // the SWF's fallback when the data reaches zero
      return { high: high, low: low, log: log };
    }
    function pixelVal(val, ax) {                      // a NEGATIVE offset from the baseline
      var span = PIXEL_HIGH - PIXEL_LOW;
      return ax.log ? span / (LOG(ax.high) - LOG(ax.low)) * (LOG(val) - LOG(ax.high)) + PIXEL_HIGH
                    : span / (ax.high - ax.low) * (val - ax.high) + PIXEL_HIGH;
    }
    function ticks(ax) {                              // the intermediate marks, between low and high
      var out = [], v = ax.low, guard = 0;
      while (v < ax.high && guard++ < 200) {
        v = ax.log ? v * 10 : v + (ax.high < 15 ? 1 : 5);
        if (v < ax.high) out.push(v);
      }
      return out;
    }
    function visible() {                              // indices of the planets on show, in order
      var out = [];
      GROUPS.forEach(function (g) {
        if (!show[g.key]) return;
        for (var i = g.first; i <= g.last; i++) out.push({ i: i, group: g.key });
      });
      return out;
    }
    function bars() {                                 // spaceBars(): halve the bar until the gaps fit
      var vis = visible(), n = vis.length, w = BAR_W0, gap = 0;
      if (!n) return [];
      do { gap = (GRAPH_LEN - n * w) / (n + 1); if (gap < 10) w /= 2; } while (gap < 10 && w > 0.5);
      return vis.map(function (v, k) {
        return { i: v.i, group: v.group, x: EX.x + X_OFFSET + gap + (w + gap) * k, w: w };
      });
    }

    function upd() {
      var ax = axis();
      outScale(I18N.t(ax.log ? "ssp.log" : "ssp.lin"));
      outShown(visible().length + " / 9");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- the bars' own rollOver: swap the colour for the value ---- */
    S.canvas.addEventListener("pointermove", function (ev) {
      var r = S.canvas.getBoundingClientRect();
      var x = (ev.clientX - r.left) * S.W / r.width, y = (ev.clientY - r.top) * S.H / r.height;
      var ax = axis(), h = -1;
      bars().forEach(function (b) {
        var top = EX.y + pixelVal(DATA[variable][b.i], ax);
        if (x >= b.x && x <= b.x + b.w && y >= top && y <= EX.y) h = b.i;
      });
      if (h !== hover) { hover = h; S.requestDraw(); }
    });
    S.canvas.addEventListener("pointerleave", function () { if (hover >= 0) { hover = -1; S.requestDraw(); } });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N), ax = axis(), vals = DATA[variable];
      S.clear();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.fillStyle = "#fafafa"; ctx.fillRect(7, 7, 686, 441);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(7.5, 7.5, 685, 440);

      ctx.fillStyle = "#000000"; ctx.font = "bold 14px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("ssp." + variable), EX.x + 375, EX.y - 374);

      ctx.strokeStyle = "#333333"; ctx.lineWidth = 2;                 // the baseline and the two end ticks
      ctx.beginPath();
      ctx.moveTo(EX.x + X_OFFSET - 1.12, EX.y); ctx.lineTo(EX.x + X_OFFSET + 561.12, EX.y);
      ctx.stroke();
      ctx.font = "12px " + FONT; ctx.textAlign = "right";
      [[ax.high, PIXEL_HIGH], [ax.low, PIXEL_LOW]].forEach(function (p) { mark(ctx, p[0], EX.y + p[1]); });
      ticks(ax).forEach(function (v) { mark(ctx, v, EX.y + pixelVal(v, ax)); });

      bars().forEach(function (b) {
        var h = -pixelVal(vals[b.i], ax), top = EX.y - h, hot = hover === b.i;
        ctx.fillStyle = "#ffffff"; ctx.fillRect(b.x, top, b.w, h);     // myBack
        if (!hot) { ctx.fillStyle = COL[b.group]; ctx.fillRect(b.x, top, b.w, h); }
        ctx.strokeStyle = "#333333"; ctx.lineWidth = 2;
        ctx.strokeRect(b.x, top, b.w, h);
        ctx.fillStyle = "#000000"; ctx.textAlign = "center";
        if (hot) { ctx.font = "14px " + FONT; ctx.textBaseline = "bottom"; ctx.fillText(String(vals[b.i]), b.x + b.w / 2, top - 4); }
        ctx.font = "bold 12px " + FONT; ctx.textBaseline = "top";
        ctx.fillText(t(NAMES[b.i]), b.x + b.w / 2, EX.y + 6, b.w + 24);
      });
    });

    function mark(ctx, label, y) {                    // a 12 px tick with its value to the left
      var ctx2 = ctx;
      ctx2.strokeStyle = "#333333"; ctx2.lineWidth = 2;
      ctx2.beginPath(); ctx2.moveTo(EX.x + TICK_X - 1, y); ctx2.lineTo(EX.x + TICK_X + 11, y); ctx2.stroke();
      ctx2.fillStyle = "#000000"; ctx2.textAlign = "right"; ctx2.textBaseline = "middle";
      ctx2.fillText(String(label), EX.x + TICK_X - 10, y);
    }

    upd();
  }
});
