/* Planet Formation Temperatures Plot -------------------------------------------
   Faithful rebuild of the ClassAction "formationtemps.swf" (graphClass and
   layoutClass, decompiled). The solar nebula's temperature fell with distance
   from the young Sun. The SWF models that with a straight line on log-log axes
   through two anchor points — 600 K at Earth (1 AU) and 175 K at Jupiter
   (5.203 AU) — and sits every planet on it.

   Choose a temperature and a red ring marks where in the nebula it applied,
   while the condensation sequence on the right splits into what was already
   solid there (above the red line) and what was still gas (below). Hovering a
   planet or the ring shows its temperature and distance, as in the original.
   The planet pictures are the SWF's own bitmaps, extracted to PNG.           */
Sim.create({
  id: "formationtemps",
  width: 760, height: 530,
  strings: {
    en: {
      "ft.temp": "Temperature", "ft.hint": "Hover over a planet, or over the red ring, for its temperature and distance.",
      "ft.yAxis": "Temperature (Kelvin)", "ft.xAxis": "Distance from the Sun (AU)", "ft.solid": "Solid", "ft.gas": "Gas",
      "ft.rDist": "this temperature is at", "ft.rSolids": "already condensed", "ft.au": " AU", "ft.none": "nothing",
      "ft.metalox": "Metal Oxides (1500 K)", "ft.feni": "Metallic Fe/Ni (1300 K)", "ft.silic": "Silicates (1200 K)",
      "ft.feld": "Feldspars (1000 K)", "ft.troil": "Troilite (FeS) (680 K)", "ft.water": "Water (175 K)",
      "ft.ammon": "Ammonia (150 K)", "ft.meth": "Methane (120 K)", "ft.arne": "Argon - Neon (65 K)",
      "pl.mercury": "Mercury", "pl.venus": "Venus", "pl.earth": "Earth", "pl.mars": "Mars", "pl.jupiter": "Jupiter",
      "pl.saturn": "Saturn", "pl.uranus": "Uranus", "pl.neptune": "Neptune", "pl.pluto": "Pluto"
    },
    id: {
      "ft.temp": "Suhu", "ft.hint": "Arahkan penunjuk ke planet, atau ke cincin merah, untuk melihat suhu dan jaraknya.",
      "ft.yAxis": "Suhu (Kelvin)", "ft.xAxis": "Jarak dari Matahari (SA)", "ft.solid": "Padat", "ft.gas": "Gas",
      "ft.rDist": "suhu ini berada di", "ft.rSolids": "sudah mengembun", "ft.au": " SA", "ft.none": "tidak ada",
      "ft.metalox": "Oksida Logam (1500 K)", "ft.feni": "Fe/Ni Logam (1300 K)", "ft.silic": "Silikat (1200 K)",
      "ft.feld": "Feldspar (1000 K)", "ft.troil": "Troilit (FeS) (680 K)", "ft.water": "Air (175 K)",
      "ft.ammon": "Amonia (150 K)", "ft.meth": "Metana (120 K)", "ft.arne": "Argon - Neon (65 K)",
      "pl.mercury": "Merkurius", "pl.venus": "Venus", "pl.earth": "Bumi", "pl.mars": "Mars", "pl.jupiter": "Jupiter",
      "pl.saturn": "Saturnus", "pl.uranus": "Uranus", "pl.neptune": "Neptunus", "pl.pluto": "Pluto"
    }
  },
  about: {
    en: "<p>The planets formed from a spinning disc of gas and dust around the young Sun. Close in the disc was hot; far out it was bitterly cold. What each planet is made of depends largely on which materials could <strong>condense</strong> into solid grains at its distance.</p>" +
        "<p>Metals and rocky silicates condense above about 1000 K, so they were solid almost everywhere — but near the Sun they were the <em>only</em> solids available. That is why the inner planets are small, dense and rocky. Beyond the <strong>snow line</strong>, near 175 K, water ice joined in, and ices of ammonia and methane further out still. With far more solid material to build from, the outer planets grew massive enough to capture huge atmospheres of hydrogen and helium.</p>" +
        "<p>The straight line on these log-log axes is a simple model through two anchor points: about 600 K at Earth's distance and 175 K at Jupiter's. Real discs were messier, and cooled as the Sun settled down, but the pattern explains the rocky-inside, gas-and-ice-outside architecture of the Solar System.</p>",
    id: "<p>Planet terbentuk dari piringan gas dan debu yang berputar di sekitar Matahari muda. Di bagian dalam piringan panas; jauh di luar sangat dingin. Bahan penyusun setiap planet banyak ditentukan oleh bahan apa yang dapat <strong>mengembun</strong> menjadi butiran padat pada jaraknya.</p>" +
        "<p>Logam dan silikat berbatu mengembun di atas sekitar 1000 K, sehingga padat hampir di mana saja — tetapi di dekat Matahari hanya itulah bahan padat yang tersedia. Karena itu planet dalam berukuran kecil, rapat, dan berbatu. Di luar <strong>garis salju</strong>, sekitar 175 K, es air ikut mengembun, lalu es amonia dan metana lebih jauh lagi. Dengan bahan padat yang jauh lebih banyak, planet luar tumbuh cukup besar untuk menangkap atmosfer hidrogen dan helium yang sangat tebal.</p>" +
        "<p>Garis lurus pada sumbu log-log ini adalah model sederhana melalui dua titik acuan: sekitar 600 K di jarak Bumi dan 175 K di jarak Jupiter. Piringan sebenarnya lebih rumit dan mendingin seiring menuanya Matahari, tetapi polanya menjelaskan susunan Tata Surya: berbatu di dalam, gas dan es di luar.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, LOG = Math.log10;
    var OY = -30;                                     // the SWF's title bar is cropped away
    var L = { x: 32.9, y: 29 + OY };                  // the layout clip on the stage
    var G = { x: L.x + 98, y: L.y + 50 };             // myGraph inside the layout
    var FONT = "Verdana, Geneva, sans-serif";          // sizes below are fitted to the SWF's own text
    /* ---- graphClass: the pixel grid is read off four marker clips ---- */
    var T_PX_HIGH = 0, T_PX_LOW = 300, T_HIGH = 2000, T_LOW = 20;
    var D_PX_HIGH = 350, D_PX_LOW = 0, D_HIGH = 50, D_LOW = 0.1;
    var EARTH_T = 600, EARTH_D = 1, JUP_T = 175, JUP_D = 5.203;
    var SLOPE = (LOG(EARTH_T) - LOG(JUP_T)) / (LOG(EARTH_D) - LOG(JUP_D));
    var AXIS_Y = 350;                                 // the distance axis; its ticks hang below it

    var PLANETS = [
      { key: "pl.mercury", img: "mercury", d: 0.387, w: 10, h: 10, dx: 10 },
      { key: "pl.venus", img: "venus", d: 0.723, w: 15, h: 15, dx: 15 },
      { key: "pl.earth", img: "earth", d: 1, t: EARTH_T, w: 15, h: 15, dx: 15 },
      { key: "pl.mars", img: "mars", d: 1.524, w: 10, h: 10, dx: 10 },
      { key: "pl.jupiter", img: "jupiter", d: JUP_D, t: JUP_T, w: 25, h: 25, dx: 20 },
      { key: "pl.saturn", img: "saturn", d: 9.529, w: 30, h: 41, dx: 20 },
      { key: "pl.uranus", img: "uranus", d: 19.19, w: 20, h: 20, dx: 15 },
      { key: "pl.neptune", img: "neptune", d: 30.06, w: 20, h: 20, dx: 20 },
      { key: "pl.pluto", img: "pluto", d: 39.53, w: 8, h: 8, dx: 10 }
    ];
    var TICKS_T = [[2000, 0], [1000, 1], [500, 0], [200, 0], [100, 1], [50, 0], [20, 0]];
    var TICKS_D = [[0.1, 1], [0.2, 0], [0.5, 0], [1, 1], [2, 0], [5, 0], [10, 1], [20, 0], [50, 0]];
    // the tick labels are static text in myGraph: [text, size, left x, baseline y], relative to the graph (from the SWF's own matrices)
    var TICK_LABELS = [
      ["2000", 12, -48.8, 4.722], ["1000", 14, -59.4, 49.426], ["500", 12, -40.25, 95.022], ["200", 12, -40.25, 154.722],
      ["100", 14, -49.45, 199.426], ["50", 12, -31.7, 244.722], ["20", 12, -31.7, 304.722],
      ["0.1", 14, -12.5, 381.031], ["0.2", 12, 28.25, 374.127], ["0.5", 12, 79.85, 374.027], ["1.0", 14, 117.2, 381.026],
      ["2.0", 12, 157.95, 374.027], ["5.0", 12, 209.45, 374.027], ["10", 14, 249.25, 381.026],
      ["20", 12, 289.75, 374.027], ["50", 12, 341.35, 374.027]
    ];
    // the condensation labels: the temperature each stands for, its centre x on the stage and its baseline in the layout
    // (read off the SWF; every one is bold 12 px static text except the metal-oxide and argon-neon TextFields, which are device-font
    // fields: Ruffle sets them in its own thinner fallback face, which 10.5 px regular Verdana matches best)
    var SEQ = [
      { key: "ft.metalox", T: 1500, cx: 652.3, by: 39.732, dyn: true }, { key: "ft.feni", T: 1300, cx: 652.45, by: 98.43 },
      { key: "ft.silic", T: 1200, cx: 652.175, by: 127.73 }, { key: "ft.feld", T: 1000, cx: 652.275, by: 186.23 },
      { key: "ft.troil", T: 680, cx: 652.2, by: 279.93 }, { key: "ft.water", T: 175, cx: 652.25, by: 425.791 },
      { key: "ft.ammon", T: 150, cx: 652.35, by: 435.03 }, { key: "ft.meth", T: 120, cx: 652.1, by: 445.83 },
      { key: "ft.arne", T: 65, cx: 652.13, by: 460.062, dyn: true }
    ];
    // layoutClass anchors the overlay on the centres of the first and last label clips
    var PX_HIGH = 35.6, PX_LOW = 455.9, TEMP_HIGH = 1500, TEMP_LOW = 65;
    var PANEL = { x: L.x + 532, y: L.y + 26, w: 170, h: 440 };   // shape 98's interior
    var OVL = L.x + 612;                                          // myOverlay's x on the stage

    var temp = 600, hover = null;
    var imgs = {};
    PLANETS.forEach(function (p) {
      var im = new Image();
      im.onload = function () { S.requestDraw(); };
      im.src = "../assets/img/sims/planets/" + p.img + ".png";
      imgs[p.img] = im;
    });

    S.group("ft.temp");
    var tCtl = S.slider({
      labelKey: "ft.temp", min: LOG(35), max: LOG(1520), value: LOG(temp), step: (LOG(1520) - LOG(35)) / 2000,
      format: function (v) { return Math.round(Math.pow(10, v)) + " K"; },
      on: function (v) { temp = Math.round(Math.pow(10, v)); upd(); }     // logarithmic slider, 0 decimals
    });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ft.hint");
    tCtl.input.parentNode.parentNode.appendChild(hint);
    var outDist = S.readout({ labelKey: "ft.rDist" });
    var outSolids = S.readout({ labelKey: "ft.rSolids" });

    function findTemp(d) { return Math.pow(10, SLOPE * (LOG(d) - LOG(EARTH_D)) + LOG(EARTH_T)); }
    function findDist(k) { return Math.pow(10, (LOG(k) - LOG(EARTH_T)) / SLOPE + LOG(EARTH_D)); }
    function findX(d) { return G.x + (D_PX_HIGH - D_PX_LOW) / (LOG(D_HIGH) - LOG(D_LOW)) * (LOG(d) - LOG(D_HIGH)) + D_PX_HIGH; }
    function findY(k) { return G.y + (T_PX_HIGH - T_PX_LOW) / (LOG(T_HIGH) - LOG(T_LOW)) * (LOG(k) - LOG(T_HIGH)) + T_PX_HIGH; }
    function overlayY(k) { return L.y + (PX_HIGH - PX_LOW) / (TEMP_HIGH - TEMP_LOW) * (k - TEMP_HIGH) + PX_HIGH; }
    function planetT(p) { return p.t || findTemp(p.d); }
    function round2(x) { return Math.round(100 * x) / 100; }

    function upd() {
      outDist(round2(findDist(temp)) + I18N.t("ft.au"));
      var solid = SEQ.filter(function (s) { return s.T >= temp; });
      outSolids(solid.length ? solid.length + " / " + SEQ.length : I18N.t("ft.none"));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- rollOver/rollOut on each planet and on the ring ---- */
    function stageXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stageXY(ev), h = null;
      if (Math.hypot(p.x - findX(findDist(temp)), p.y - findY(temp)) < 20) h = "ring";
      PLANETS.forEach(function (pl) {
        if (Math.abs(p.x - findX(pl.d)) < pl.w / 2 + 2 && Math.abs(p.y - findY(planetT(pl))) < pl.h / 2 + 2) h = pl;
      });
      if (h !== hover) { hover = h; S.requestDraw(); }
    });
    S.canvas.addEventListener("pointerleave", function () { if (hover) { hover = null; S.requestDraw(); } });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      FlashText.begin(ctx);
      S.clear();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.fillStyle = "#fafafa"; ctx.fillRect(7, 37 + OY, 746, 516);        // the window panel
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(7.5, 37.5 + OY, 745, 515);
      drawAxes(ctx, t);
      ctx.strokeStyle = "rgba(0,0,0,0.7)"; ctx.lineWidth = 3;               // lineStyle(3, 0, 70)
      ctx.beginPath();
      ctx.moveTo(findX(0.2), findY(findTemp(0.2)));
      ctx.lineTo(findX(65), findY(findTemp(65)));
      ctx.stroke();
      PLANETS.forEach(function (pl) {
        var im = imgs[pl.img];
        if (im.complete && im.naturalWidth) ctx.drawImage(im, findX(pl.d) - pl.w / 2, findY(planetT(pl)) - pl.h / 2, pl.w, pl.h);
      });
      ctx.strokeStyle = "#ff0000"; ctx.lineWidth = 3.64;                    // the 33 px circle, scaled to 40
      ctx.beginPath(); ctx.arc(findX(findDist(temp)), findY(temp), 18.2, 0, TAU); ctx.stroke();
      drawSequence(ctx, t);
      if (hover) readout(ctx, t);
    });

    function drawAxes(ctx, t) {
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 3; ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.moveTo(G.x, G.y - 11.5); ctx.lineTo(G.x, G.y + 322);              // the temperature axis
      ctx.lineTo(G.x - 5, G.y + 327); ctx.lineTo(G.x + 5, G.y + 333);       // ... with its scale break
      ctx.lineTo(G.x - 5, G.y + 339); ctx.lineTo(G.x, G.y + 344);
      ctx.lineTo(G.x, G.y + AXIS_Y); ctx.lineTo(G.x + 391.6, G.y + AXIS_Y);
      ctx.stroke();
      TICKS_T.forEach(function (k) {                                         // out to the left of the axis
        var y = findY(k[0]);
        ctx.beginPath(); ctx.moveTo(G.x - (k[1] ? 16.5 : 11.5), y); ctx.lineTo(G.x + 1.5, y); ctx.stroke();
      });
      TICKS_D.forEach(function (d) {                                         // down from the axis
        var x = findX(d[0]);
        ctx.beginPath();
        ctx.moveTo(x, G.y + AXIS_Y - 1.5); ctx.lineTo(x, G.y + (d[1] ? 366 : 361)); ctx.stroke();
      });
      ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      TICK_LABELS.forEach(function (k) {
        ctx.font = "bold " + k[1] + "px " + FONT;
        FlashText.fillStatic(ctx, k[0], G.x + k[2], G.y + k[3]);
      });
      ctx.font = "bold 14px " + FONT;
      FlashText.fillStatic(ctx, t("ft.xAxis"), G.x + 189.65, G.y + 406.3, "center");
      ctx.save();
      ctx.translate(G.x - 68.5, G.y + 172.9); ctx.rotate(-Math.PI / 2);
      FlashText.fillStatic(ctx, t("ft.yAxis"), 0, 0, "center");
      ctx.restore();
    }

    // the condensation sequence: labels on a linear temperature scale, split by the red line
    function drawSequence(ctx, t) {
      var ly = overlayY(temp);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
      ctx.save();
      ctx.beginPath(); ctx.rect(PANEL.x, PANEL.y, PANEL.w, PANEL.h); ctx.clip();   // shape 108 masks the overlay
      ctx.fillStyle = "rgba(0,153,0,0.2)"; ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, ly - PANEL.y);
      ctx.fillStyle = "rgba(71,173,222,0.2)"; ctx.fillRect(PANEL.x, ly, PANEL.w, PANEL.y + PANEL.h - ly);
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#46576d";
      SEQ.forEach(function (s) {
        var str = t(s.key);
        ctx.font = (s.dyn ? "10.5px " : "bold 12px ") + FONT;
        var lw = s.dyn ? FlashText.width(ctx, str) : FlashText.widthStatic(ctx, str);
        ctx.save(); ctx.translate(s.cx, L.y + s.by); ctx.scale(Math.min(1, (PANEL.w - 6) / lw), 1);   // a translation too long for the panel is squeezed to fit
        if (s.dyn) FlashText.fill(ctx, str, 0, 0); else FlashText.fillStatic(ctx, str, 0, 0);
        ctx.restore();
      });
      ctx.fillStyle = "#ff0000"; ctx.fillRect(L.x + 530.5, ly - 1.5, 173, 3);
      ctx.font = "bold 12px " + FONT;
      ctx.save(); ctx.translate(OVL - 65.976, ly - 22.16); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#009900"; FlashText.fillStatic(ctx, t("ft.solid"), 0, 0); ctx.restore();
      ctx.save(); ctx.translate(OVL - 65.976, ly + 19.24); ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#47adde"; FlashText.fillStatic(ctx, t("ft.gas"), 0, 0); ctx.restore();
      ctx.restore();
      ctx.strokeStyle = "#c4d5e5"; ctx.lineWidth = 3;
      ctx.strokeRect(PANEL.x - 1.5, PANEL.y - 1.5, PANEL.w + 3, PANEL.h + 3);
    }

    // the readout clip: a white box hung off the right of whatever the pointer is over
    function readout(ctx, t) {
      var x, y, hot, dist;
      if (hover === "ring") { hot = temp; dist = round2(findDist(temp)); x = findX(dist) + 20; y = findY(temp); }
      else { hot = Math.round(planetT(hover)); dist = hover.d; x = findX(hover.d) + hover.dx; y = findY(planetT(hover)); }
      var head = hover === "ring" ? 0 : 17;             // the SWF box, with room for the planet's name
      ctx.fillStyle = "#ffffff"; ctx.fillRect(x, y - 46.3 - head, 78, 46.3 + head);
      ctx.strokeStyle = "#c4d5e5"; ctx.lineWidth = 3;
      ctx.strokeRect(x - 1.5, y - 47.8 - head, 81, 49.3 + head);
      ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      if (head) { ctx.font = "bold 12px " + FONT; FlashText.fill(ctx, t(hover.key), x + 6, y - 35); }
      ctx.font = "14px " + FONT;
      FlashText.fill(ctx, hot + " K", x + 6, y - 25);
      FlashText.fill(ctx, dist + " AU", x + 6, y - 5.5);
    }

    upd();
  }
});
