/* Hertzsprung-Russell Diagram Explorer ----------------------------------------
   Faithful rebuild of the NAAP "HR Diagram Explorer" (hrExplorer.swf):
     • a log L vs log T diagram (temperature reversed) with the main sequence,
       isoradius lines, an instability strip and luminosity-class regions,
     • a draggable red-× cursor giving temperature, luminosity and radius
       (R = √L /(T/T☉)²) plus a star-vs-Sun Size Comparison,
     • plottable star catalogs: the nearest stars, the brightest stars, both,
       or the overlap — reproducing the classic selection-bias lesson.            */
Sim.create({
  id: "hr-diagram",
  width: 660, height: 648,
  strings: {
    en: {
      "hr.cursor": "Cursor", "hr.temp": "temperature", "hr.lum": "luminosity",
      "hr.options": "Options", "hr.ms": "show main sequence", "hr.iso": "show isoradius lines",
      "hr.lc": "show luminosity classes", "hr.inst": "show instability strip", "hr.plot": "plotted stars",
      "hr.none": "no stars", "hr.near": "the nearest stars", "hr.bright": "the brightest stars",
      "hr.both": "both", "hr.overlap": "the overlap",
      "hr.rTemp": "temperature", "hr.rLum": "luminosity", "hr.rRad": "radius", "hr.rType": "spectral type",
      "hr.size": "Size comparison", "hr.star": "star", "hr.sun": "Sun"
    },
    id: {
      "hr.cursor": "Kursor", "hr.temp": "suhu", "hr.lum": "luminositas",
      "hr.options": "Opsi", "hr.ms": "tampilkan deret utama", "hr.iso": "tampilkan garis isoradius",
      "hr.lc": "tampilkan kelas luminositas", "hr.inst": "tampilkan jalur ketakstabilan", "hr.plot": "bintang diplot",
      "hr.none": "tanpa bintang", "hr.near": "bintang terdekat", "hr.bright": "bintang tercerah",
      "hr.both": "keduanya", "hr.overlap": "irisan",
      "hr.rTemp": "suhu", "hr.rLum": "luminositas", "hr.rRad": "radius", "hr.rType": "tipe spektral",
      "hr.size": "Perbandingan ukuran", "hr.star": "bintang", "hr.sun": "Matahari"
    }
  },
  about: {
    en: "<p>The <strong>H-R diagram</strong> plots stars by luminosity against temperature (hot on the left). Most stars fall on the diagonal <strong>main sequence</strong>; cool dim red dwarfs sit lower-right, hot luminous stars upper-left, with red giants above the sequence and white dwarfs below it.</p>" +
        "<p>Because L = 4πR²σT⁴, every diagonal <strong>isoradius line</strong> marks one stellar size. Drag the red × (or the sliders) and read the temperature, luminosity and the resulting radius, with a Sun-sized comparison.</p>" +
        "<p>Plot <strong>the nearest stars</strong> and then <strong>the brightest stars</strong>: they barely overlap. Nearby stars are mostly faint red dwarfs; the brightest are rare, hugely luminous giants seen across great distances — a striking selection effect.</p>",
    id: "<p><strong>Diagram H-R</strong> memplot bintang berdasar luminositas terhadap suhu (panas di kiri). Sebagian besar bintang berada di diagonal <strong>deret utama</strong>; katai merah redup di kanan-bawah, bintang panas terang di kiri-atas, raksasa merah di atas deret dan katai putih di bawahnya.</p>" +
        "<p>Karena L = 4πR²σT⁴, setiap diagonal <strong>garis isoradius</strong> menandai satu ukuran bintang. Seret tanda × merah (atau penggeser) dan baca suhu, luminositas, serta radiusnya, dengan perbandingan seukuran Matahari.</p>" +
        "<p>Plot <strong>bintang terdekat</strong> lalu <strong>bintang tercerah</strong>: hampir tak beririsan. Bintang dekat umumnya katai merah redup; yang tercerah adalah raksasa langka nan terang yang terlihat dari jarak jauh — efek seleksi yang mencolok.</p>"
  },
  build: function (S) {
    var Tmin = 2300, Tmax = 42000, Lmin = 1e-4, Lmax = 1e6, TSUN = 5772;
    var pad = { l: 56, r: 18, t: 16, b: 172 };
    var Tc = 5800, Lc = 1.0;        // cursor

    var STARS = [
      { n: "Proxima Cen", T: 3042, L: 0.0017, near: 1 }, { n: "α Cen A", T: 5790, L: 1.52, near: 1, bright: 1 },
      { n: "α Cen B", T: 5260, L: 0.50, near: 1 }, { n: "Barnard's", T: 3134, L: 0.0035, near: 1 },
      { n: "Wolf 359", T: 2800, L: 0.0014, near: 1 }, { n: "Lalande 21185", T: 3828, L: 0.026, near: 1 },
      { n: "Sirius A", T: 9940, L: 25.4, near: 1, bright: 1 }, { n: "Sirius B", T: 25000, L: 0.056, near: 1 },
      { n: "Ross 154", T: 3340, L: 0.0038, near: 1 }, { n: "ε Eridani", T: 5084, L: 0.34, near: 1 },
      { n: "61 Cyg A", T: 4526, L: 0.15, near: 1 }, { n: "Procyon A", T: 6530, L: 6.93, near: 1, bright: 1 },
      { n: "τ Ceti", T: 5344, L: 0.52, near: 1 },
      { n: "Canopus", T: 7350, L: 10700, bright: 1 }, { n: "Arcturus", T: 4286, L: 170, bright: 1 },
      { n: "Vega", T: 9602, L: 40, bright: 1 }, { n: "Capella", T: 4970, L: 79, bright: 1 },
      { n: "Rigel", T: 12100, L: 120000, bright: 1 }, { n: "Betelgeuse", T: 3590, L: 126000, bright: 1 },
      { n: "Altair", T: 7550, L: 10.6, bright: 1 }, { n: "Aldebaran", T: 3910, L: 439, bright: 1 },
      { n: "Antares", T: 3660, L: 75900, bright: 1 }, { n: "Spica", T: 22400, L: 20500, bright: 1 },
      { n: "Pollux", T: 4865, L: 33, bright: 1 }, { n: "Fomalhaut", T: 8590, L: 16, bright: 1 },
      { n: "Deneb", T: 8525, L: 196000, bright: 1 }, { n: "Regulus", T: 12460, L: 288, bright: 1 }
    ];
    var MS = [[42000, 2e5], [30000, 5e4], [20000, 1.5e4], [14000, 2.3e3], [10000, 60], [8000, 12],
              [7000, 5], [6000, 1.5], [5772, 1], [5000, 0.35], [4000, 0.07], [3300, 0.012], [2800, 0.003], [2300, 0.0007]];

    /* ---- controls ---- */
    S.group("hr.cursor");
    var tCtl = S.slider({ labelKey: "hr.temp", min: Tmin, max: Tmax, step: 10, value: Tc, unit: " K",
      format: function (v) { return Math.round(v).toLocaleString() + " K"; }, on: function (v) { Tc = v; upd(); } });
    var lCtl = S.slider({ labelKey: "hr.lum", min: -4, max: 6, step: 0.01, value: 0,
      format: function (v) { return fmtL(Math.pow(10, v)); }, on: function (v) { Lc = Math.pow(10, v); upd(); } });

    S.group("hr.options");
    var optMS = S.toggle({ labelKey: "hr.ms", value: true });
    var optIso = S.toggle({ labelKey: "hr.iso", value: true });
    var optLC = S.toggle({ labelKey: "hr.lc", value: false });
    var optInst = S.toggle({ labelKey: "hr.inst", value: false });
    var plot = S.select({ labelKey: "hr.plot", value: "none",
      options: [{ v: "none", labelKey: "hr.none" }, { v: "near", labelKey: "hr.near" }, { v: "bright", labelKey: "hr.bright" },
                { v: "both", labelKey: "hr.both" }, { v: "overlap", labelKey: "hr.overlap" }] });

    var oT = S.readout({ labelKey: "hr.rTemp" }), oL = S.readout({ labelKey: "hr.rLum" });
    var oR = S.readout({ labelKey: "hr.rRad" }), oType = S.readout({ labelKey: "hr.rType" });

    function radius() { return Math.sqrt(Lc) / Math.pow(Tc / TSUN, 2); }
    function specType(T) { return T >= 30000 ? "O" : T >= 10000 ? "B" : T >= 7500 ? "A" : T >= 6000 ? "F" : T >= 5200 ? "G" : T >= 3700 ? "K" : "M"; }
    function fmtL(L) { return L >= 1000 ? L.toExponential(1) + " L☉" : L >= 1 ? L.toFixed(1) + " L☉" : L >= 0.001 ? L.toFixed(3) + " L☉" : L.toExponential(1) + " L☉"; }
    function upd() {
      oT(Math.round(Tc).toLocaleString() + " K");
      oL(fmtL(Lc));
      oR(radius() >= 10 ? radius().toFixed(0) + " R☉" : radius().toFixed(2) + " R☉");
      oType(specType(Tc));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- plot geometry (log T reversed, log L) ---- */
    function xOf(T) { return pad.l + (Math.log(Tmax) - Math.log(T)) / (Math.log(Tmax) - Math.log(Tmin)) * (S.W - pad.l - pad.r); }
    function yOf(L) { return (S.H - pad.b) - (Math.log(L) - Math.log(Lmin)) / (Math.log(Lmax) - Math.log(Lmin)) * (S.H - pad.b - pad.t); }
    function invT(px) { return Math.exp(Math.log(Tmax) - (px - pad.l) / (S.W - pad.l - pad.r) * (Math.log(Tmax) - Math.log(Tmin))); }
    function invL(py) { return Math.exp(Math.log(Lmin) + ((S.H - pad.b) - py) / (S.H - pad.b - pad.t) * (Math.log(Lmax) - Math.log(Lmin))); }

    /* ---- drag the cursor ---- */
    var drag = false;
    function evtPos(e) { var r = S.canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * (S.W / r.width), y: (e.clientY - r.top) * (S.H / r.height) }; }
    S.canvas.addEventListener("pointerdown", function (e) {
      var p = evtPos(e);
      if (Math.hypot(p.x - xOf(Tc), p.y - yOf(Lc)) < 30 || (p.x > pad.l && p.x < S.W - pad.r && p.y > pad.t && p.y < S.H - pad.b)) {
        drag = true; S.canvas.setPointerCapture(e.pointerId); applyDrag(p); e.preventDefault();
      }
    });
    S.canvas.addEventListener("pointermove", function (e) { if (drag) applyDrag(evtPos(e)); });
    S.canvas.addEventListener("pointerup", function () { drag = false; });
    function applyDrag(p) {
      Tc = Math.max(Tmin, Math.min(Tmax, invT(p.x))); Lc = Math.max(Lmin, Math.min(Lmax, invL(p.y)));
      tCtl.set(Tc); lCtl.set(Math.log(Lc) / Math.LN10);
    }

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      var x0 = pad.l, x1 = W - pad.r, y0 = H - pad.b, y1 = pad.t;
      // frame
      ctx.fillStyle = "#05070f"; roundRect(ctx, x0, y1, x1 - x0, y0 - y1, 8); ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      ctx.save(); roundRect(ctx, x0, y1, x1 - x0, y0 - y1, 8); ctx.clip();

      // luminosity-class regions
      if (optLC.value()) {
        region(ctx, "rgba(255,120,120,0.08)", [[42000, 2e5], [3000, 1e3], [2300, 1e3], [2300, 1e6], [42000, 1e6]]);   // (super)giants
        region(ctx, "rgba(120,180,255,0.07)", [[30000, 0.5], [9000, 1e-2], [9000, 1e-4], [42000, 1e-4], [42000, 0.5]]); // white dwarfs
      }
      // instability strip
      if (optInst.value()) region(ctx, "rgba(182,146,255,0.16)", [[7800, 5], [6600, 5], [5200, 1e5], [6200, 1e5]]);

      // grid lines (labels drawn after the clip is released)
      [40000, 20000, 10000, 5000, 2300].forEach(function (T) { var gx = xOf(T); ctx.strokeStyle = "#16213f"; ctx.beginPath(); ctx.moveTo(gx, y1); ctx.lineTo(gx, y0); ctx.stroke(); });
      for (var e = -4; e <= 6; e++) { var gy = yOf(Math.pow(10, e)); ctx.strokeStyle = "#16213f"; ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x1, gy); ctx.stroke(); }

      // isoradius lines
      if (optIso.value()) {
        [1000, 100, 10, 1, 0.1, 0.01, 0.001].forEach(function (R) {
          ctx.strokeStyle = "rgba(120,220,150,0.5)"; ctx.setLineDash([5, 4]); ctx.lineWidth = 1; ctx.beginPath();
          var first = true;
          for (var T = Tmin; T <= Tmax; T *= 1.08) { var L = R * R * Math.pow(T / TSUN, 4); if (L < Lmin || L > Lmax) { first = true; continue; } var X = xOf(T), Y = yOf(L); first ? (ctx.moveTo(X, Y), first = false) : ctx.lineTo(X, Y); }
          ctx.stroke(); ctx.setLineDash([]);
          // label near top
          var Ltop = Lmax * 0.6, Tlab = TSUN * Math.pow(Ltop / (R * R), 0.25);
          if (Tlab > Tmin && Tlab < Tmax) { ctx.fillStyle = "rgba(150,230,170,0.9)"; ctx.font = "9px system-ui"; ctx.textAlign = "left"; ctx.fillText(R + " R☉", xOf(Tlab) + 3, yOf(Ltop)); }
        });
      }

      // main sequence
      if (optMS.value()) {
        ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 2.4; ctx.beginPath();
        MS.forEach(function (p, i) { var X = xOf(p[0]), Y = yOf(p[1]); i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); });
        ctx.stroke();
      }

      // plotted stars
      var mode = plot.value();
      if (mode !== "none") {
        STARS.forEach(function (s) {
          var show = mode === "near" ? s.near : mode === "bright" ? s.bright : mode === "both" ? (s.near || s.bright) : (s.near && s.bright);
          if (!show) return;
          var X = xOf(s.T), Y = yOf(s.L), rgb = tempToRGB(s.T);
          ctx.fillStyle = "rgb(" + rgb.map(Math.round).join(",") + ")";
          ctx.beginPath(); ctx.arc(X, Y, 4, 0, 2 * Math.PI); ctx.fill();
          var ring = (s.near && s.bright) ? "#fff" : s.bright ? "#ffd166" : "#6ea8fe";
          ctx.strokeStyle = ring; ctx.lineWidth = 1.4; ctx.stroke();
        });
      }

      // cursor ×
      var cx = xOf(Tc), cy = yOf(Lc);
      ctx.strokeStyle = "#ff3b3b"; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(cx - 7, cy - 7); ctx.lineTo(cx + 7, cy + 7); ctx.moveTo(cx + 7, cy - 7); ctx.lineTo(cx - 7, cy + 7); ctx.stroke();
      ctx.restore();

      // tick labels (outside the clip so they aren't cut off)
      ctx.fillStyle = "#9fabce"; ctx.font = "10px system-ui"; ctx.textAlign = "center";
      [40000, 20000, 10000, 5000, 2300].forEach(function (T) { ctx.fillText(T >= 1000 ? (T / 1000) + "k" : T, xOf(T), y0 + 14); });
      ctx.textAlign = "right";
      for (var e2 = -4; e2 <= 6; e2++) ctx.fillText("10" + sup(e2), x0 - 4, yOf(Math.pow(10, e2)) + 3);

      // axis titles
      ctx.fillStyle = "#9fabce"; ctx.font = "12px system-ui"; ctx.textAlign = "center";
      ctx.fillText("Temperature (K)", (x0 + x1) / 2, y0 + 30);
      ctx.save(); ctx.translate(15, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("Luminosity (L☉)", 0, 0); ctx.restore();

      // ---- size comparison strip ----
      drawSizeComparison(ctx, y0 + 44);
    });
    upd();

    function drawSizeComparison(ctx, top) {
      var W = S.W;
      ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left";
      ctx.fillText(I18N.t("hr.size").toUpperCase(), 14, top);
      var by = top + 48, R = radius();
      var sunR = 22, starR = Math.max(3, Math.min(46, sunR * Math.pow(R, 0.42)));
      var rgbS = tempToRGB(Tc), rgbSun = tempToRGB(TSUN);
      // star
      ball(ctx, 110, by, starR, rgbS, I18N.t("hr.star") + "  (" + (R >= 10 ? R.toFixed(0) : R.toFixed(2)) + " R☉)");
      // sun
      ball(ctx, 270, by, sunR, rgbSun, I18N.t("hr.sun") + "  (1 R☉)");
      function ball(ctx, x, y, r, rgb, label) {
        var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
        g.addColorStop(0, "rgb(" + rgb.map(function (v) { return Math.min(255, v + 40); }).map(Math.round).join(",") + ")");
        g.addColorStop(1, "rgb(" + rgb.map(Math.round).join(",") + ")");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
        ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.fillText(label, x, top + 110);
      }
    }

    function region(ctx, fill, pts) { ctx.fillStyle = fill; ctx.beginPath(); pts.forEach(function (p, i) { var X = xOf(p[0]), Y = yOf(p[1]); i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); }); ctx.closePath(); ctx.fill(); }
    function sup(e) { return String(e).replace(/[-0-9]/g, function (d) { return "⁻⁰¹²³⁴⁵⁶⁷⁸⁹"["-0123456789".indexOf(d)]; }); }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});

/* blackbody colour (Tanner Helland approximation), T in K */
function tempToRGB(T) {
  var t = T / 100, r, g, b;
  if (t <= 66) r = 255; else r = clamp(329.7 * Math.pow(t - 60, -0.1332));
  if (t <= 66) g = clamp(99.47 * Math.log(t) - 161.12); else g = clamp(288.12 * Math.pow(t - 60, -0.0755));
  if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = clamp(138.52 * Math.log(t - 10) - 305.04);
  return [r, g, b];
  function clamp(x) { return Math.max(0, Math.min(255, x)); }
}
