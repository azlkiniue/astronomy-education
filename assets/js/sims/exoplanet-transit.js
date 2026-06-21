/* Exoplanet Transit Simulator -------------------------------------------------
   Faithful rebuild of the NAAP "Transit Simulator" (transitSimulator.swf):
     • a face-on view of a planet transiting its star (impact parameter set by
       the inclination),
     • the normalized-flux light curve with a phase cursor, an optional set of
       noisy "simulated measurements", and the eclipse depth / duration,
     • Planet (radius, semimajor axis), Star (mass → main-sequence type/T/R),
       System (inclination, phase), animation and real-exoplanet presets.
   Depth = (R_p/R_★)², period from Kepler III, duration from the transit chord.   */
Sim.create({
  id: "exoplanet-transit",
  width: 760, height: 560,
  strings: {
    en: {
      "tr.presets": "Presets", "tr.preset": "set parameters for",
      "tr.planet": "Planet", "tr.radius": "radius", "tr.a": "semimajor axis",
      "tr.star": "Star", "tr.mass": "mass",
      "tr.sys": "System", "tr.incl": "inclination", "tr.phase": "phase",
      "tr.anim": "Animation", "tr.start": "start animation", "tr.pause": "pause animation", "tr.speed": "speed",
      "tr.data": "Measurements", "tr.theory": "show theoretical curve", "tr.sim": "show simulated measurements",
      "tr.noise": "noise", "tr.number": "number",
      "tr.period": "orbital period", "tr.depth": "eclipse depth", "tr.dur": "transit duration", "tr.startype": "star",
      "tr.flux": "Normalized Flux", "tr.viewTitle": "transit", "tr.none": "— select a preset —"
    },
    id: {
      "tr.presets": "Preset", "tr.preset": "atur parameter untuk",
      "tr.planet": "Planet", "tr.radius": "radius", "tr.a": "sumbu semimayor",
      "tr.star": "Bintang", "tr.mass": "massa",
      "tr.sys": "Sistem", "tr.incl": "inklinasi", "tr.phase": "fase",
      "tr.anim": "Animasi", "tr.start": "mulai animasi", "tr.pause": "jeda animasi", "tr.speed": "kecepatan",
      "tr.data": "Pengukuran", "tr.theory": "tampilkan kurva teoretis", "tr.sim": "tampilkan pengukuran simulasi",
      "tr.noise": "derau", "tr.number": "jumlah",
      "tr.period": "periode orbit", "tr.depth": "kedalaman gerhana", "tr.dur": "durasi transit", "tr.startype": "bintang",
      "tr.flux": "Fluks Ternormalisasi", "tr.viewTitle": "transit", "tr.none": "— pilih preset —"
    }
  },
  about: {
    en: "<p>When a planet crosses in front of its star, it blocks a sliver of light and the star dims slightly — a <strong>transit</strong>. The dip's depth is just the area ratio, (R<sub>planet</sub> / R<sub>star</sub>)², so a Jupiter across a Sun-like star dims it about 1%.</p>" +
        "<p>Set the planet's radius and orbit, the star's mass (which fixes its size and temperature), and the <strong>inclination</strong>. Edge-on orbits give a flat-bottomed transit; tilt it and the planet clips the star's edge (a grazing, V-shaped, shallower dip) until the transit disappears.</p>" +
        "<p>Turn on <strong>simulated measurements</strong> with realistic noise to see how astronomers actually detect planets — and load a real-exoplanet preset to compare.</p>",
    id: "<p>Ketika planet melintas di depan bintangnya, ia menghalangi sedikit cahaya dan bintang sedikit meredup — sebuah <strong>transit</strong>. Kedalaman lekukannya hanyalah rasio luas, (R<sub>planet</sub> / R<sub>bintang</sub>)², jadi Jupiter di depan bintang mirip-Matahari meredupkannya sekitar 1%.</p>" +
        "<p>Atur radius dan orbit planet, massa bintang (yang menetapkan ukuran dan suhunya), dan <strong>inklinasi</strong>. Orbit tepi-pandang memberi transit beralas datar; miringkan dan planet menyerempet tepi bintang (lekukan dangkal berbentuk V) hingga transit lenyap.</p>" +
        "<p>Nyalakan <strong>pengukuran simulasi</strong> dengan derau realistis untuk melihat bagaimana astronom benar-benar mendeteksi planet — dan muat preset eksoplanet nyata untuk membandingkan.</p>"
  },
  build: function (S) {
    var RSUN_AU = 0.0046524, RJUP_RSUN = 0.10045;
    var P = { Rp: 1.32, a: 0.047, M: 1.09, incl: 86.929 };
    var phase = 0, speed = 0.04, noise = 0.002, number = 50, seed = 1;
    var PRESETS = {
      "HD 209458 b": { Rp: 1.38, a: 0.047, M: 1.15, incl: 86.7 },
      "HD 189733 b": { Rp: 1.14, a: 0.031, M: 0.80, incl: 85.7 },
      "TrES-1": { Rp: 1.08, a: 0.039, M: 0.89, incl: 88.4 },
      "HD 149026 b": { Rp: 0.73, a: 0.042, M: 1.30, incl: 85.4 },
      "OGLE-TR-132 b": { Rp: 1.18, a: 0.031, M: 1.26, incl: 85.0 }
    };

    function Rstar() { return Math.pow(P.M, 0.9); }                         // R☉ (main sequence)
    function Tstar() { return 5778 * Math.pow(P.M, 0.51); }                 // K
    function specType() { var T = Tstar(); return T >= 30000 ? "O" : T >= 10000 ? "B" : T >= 7500 ? "A" : T >= 6000 ? "F" : T >= 5200 ? "G" : T >= 3700 ? "K" : "M"; }
    function aOverR() { return P.a / (Rstar() * RSUN_AU); }                 // a in stellar radii
    function k() { return P.Rp * RJUP_RSUN / Rstar(); }                     // R_p / R_★
    function impact() { return aOverR() * Math.cos(P.incl * Math.PI / 180); }
    function periodDays() { return 365.25 * Math.sqrt(Math.pow(P.a, 3) / P.M); }
    function depth() { return k() * k(); }
    function halfPhase() { var v = (1 + k()) * (1 + k()) - impact() * impact(); return v <= 0 ? 0 : Math.asin(Math.min(1, Math.sqrt(v) / aOverR())) / (2 * Math.PI); }
    function durationHr() { return 2 * halfPhase() * periodDays() * 24; }

    function overlap(d, r1, r2) {
      if (d >= r1 + r2) return 0;
      if (d <= Math.abs(r1 - r2)) return Math.PI * Math.pow(Math.min(r1, r2), 2);
      var a = r1 * r1, b = r2 * r2, x = (d * d + a - b) / (2 * d * r1), y = (d * d + b - a) / (2 * d * r2);
      return a * Math.acos(cl(x, -1, 1)) + b * Math.acos(cl(y, -1, 1)) - 0.5 * Math.sqrt(Math.max(0, (-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2)));
    }
    function cl(v, a, b) { return v < a ? a : v > b ? b : v; }
    function fluxAt(ph) {                       // ph in phase units (0 = mid-transit)
      var th = 2 * Math.PI * ph;
      if (Math.cos(th) <= 0) return 1;          // planet behind the star
      var xR = aOverR() * Math.sin(th), dR = Math.hypot(xR, impact());
      if (dR >= 1 + k()) return 1;
      return 1 - overlap(dR, 1, k()) / Math.PI;
    }

    /* ---- controls ---- */
    S.group("tr.presets");
    var presetSel = S.select({ labelKey: "tr.preset", value: "",
      options: [{ v: "", labelKey: "tr.none" }].concat(Object.keys(PRESETS).map(function (n) { return { v: n, label: n }; })),
      on: function (v) { if (PRESETS[v]) { var p = PRESETS[v]; P.Rp = p.Rp; P.a = p.a; P.M = p.M; P.incl = p.incl; rpC.set(p.Rp); aC.set(p.a); mC.set(p.M); iC.set(p.incl); } } });

    S.group("tr.planet");
    var rpC = S.slider({ labelKey: "tr.radius", min: 0.2, max: 2.0, step: 0.01, value: P.Rp, unit: " R♃", on: function (v) { P.Rp = v; upd(); } });
    var aC = S.slider({ labelKey: "tr.a", min: 0.01, max: 0.5, step: 0.001, value: P.a, format: function (v) { return v.toFixed(3) + " AU"; }, on: function (v) { P.a = v; upd(); } });
    S.group("tr.star");
    var mC = S.slider({ labelKey: "tr.mass", min: 0.3, max: 3, step: 0.01, value: P.M, unit: " M☉", on: function (v) { P.M = v; upd(); } });
    S.group("tr.sys");
    var iC = S.slider({ labelKey: "tr.incl", min: 80, max: 90, step: 0.01, value: P.incl, format: function (v) { return v.toFixed(2) + "°"; }, on: function (v) { P.incl = v; upd(); } });

    S.group("tr.anim");
    var loop = S.loop(function (dt) { phase = wrapPh(phase + speed * dt); phC.set(phase); });
    function wrapPh(p) { p = (p + 0.5) % 1; if (p < 0) p += 1; return p - 0.5; }
    var playBtn = S.button({ labelKey: "tr.start", primary: true, on: function () { loop.toggle(); syncPlay(); } });
    function syncPlay() { var key = loop.playing ? "tr.pause" : "tr.start"; playBtn.setAttribute("data-i18n", key); playBtn.textContent = I18N.t(key); }
    S.refreshers.push(syncPlay);
    S.slider({ labelKey: "tr.speed", min: 0.005, max: 0.2, step: 0.005, value: speed, format: function (v) { return v.toFixed(3) + "/s"; }, on: function (v) { speed = v; } });
    var phC = S.slider({ labelKey: "tr.phase", min: -0.5, max: 0.5, step: 0.001, value: phase, format: function (v) { return v.toFixed(3); }, on: function (v) { phase = v; S.requestDraw(); } });

    S.group("tr.data");
    var optTheory = S.toggle({ labelKey: "tr.theory", value: true });
    var optSim = S.toggle({ labelKey: "tr.sim", value: false, on: function () { seed++; S.requestDraw(); } });
    S.slider({ labelKey: "tr.noise", min: 0, max: 0.01, step: 0.0005, value: noise, format: function (v) { return v.toFixed(4); }, on: function (v) { noise = v; seed++; S.requestDraw(); } });
    S.slider({ labelKey: "tr.number", min: 20, max: 200, step: 10, value: number, on: function (v) { number = v; seed++; S.requestDraw(); } });

    var oPer = S.readout({ labelKey: "tr.period" });
    var oDepth = S.readout({ labelKey: "tr.depth" });
    var oDur = S.readout({ labelKey: "tr.dur" });
    var oStar = S.readout({ labelKey: "tr.startype" });

    function upd() {
      oPer(periodDays().toFixed(2) + " d");
      oDepth(depth().toFixed(4));
      oDur(durationHr() > 0 ? durationHr().toFixed(2) + " hr" : "—");
      oStar(specType() + " · " + Math.round(Tstar()) + " K · " + Rstar().toFixed(2) + " R☉");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ===================================================================== */
    var VIEW = { x: 12, y: 28, w: 736, h: 222 };
    var LCR = { x: 12, y: 262, w: 736, h: 286 };

    S.onDraw(function () { var ctx = S.ctx; S.clear(); drawView(ctx); drawLC(ctx); });
    upd();

    function drawView(ctx) {
      panel(ctx, VIEW, I18N.t("tr.viewTitle"));
      ctx.save(); roundRect(ctx, VIEW.x + 1, VIEW.y + 1, VIEW.w - 2, VIEW.h - 2, 11); ctx.clip();
      ctx.fillStyle = "#04060d"; ctx.fillRect(VIEW.x, VIEW.y, VIEW.w, VIEW.h);
      var cx = VIEW.x + VIEW.w / 2, cy = VIEW.y + VIEW.h / 2 + 4, Rpx = 78;
      // star with limb darkening
      var rgb = tempToRGB(Tstar());
      var g = ctx.createRadialGradient(cx, cy, 1, cx, cy, Rpx);
      g.addColorStop(0, "rgb(" + rgb.map(function (v) { return Math.min(255, v + 40); }).map(Math.round).join(",") + ")");
      g.addColorStop(0.7, "rgb(" + rgb.map(Math.round).join(",") + ")");
      g.addColorStop(1, "rgb(" + rgb.map(function (v) { return Math.round(v * 0.45); }).join(",") + ")");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, Rpx, 0, 2 * Math.PI); ctx.fill();
      // orbit line + planet
      ctx.strokeStyle = "rgba(160,175,210,0.25)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(VIEW.x, cy + impact() * Rpx); ctx.lineTo(VIEW.x + VIEW.w, cy + impact() * Rpx); ctx.stroke();
      var th = 2 * Math.PI * phase, xR = aOverR() * Math.sin(th);
      var planetFront = Math.cos(th) > 0;
      var px = cx + xR * Rpx, py = cy + impact() * Rpx, pr = Math.max(2, k() * Rpx);
      if (planetFront) { ctx.fillStyle = "#0a0d16"; ctx.beginPath(); ctx.arc(px, py, pr, 0, 2 * Math.PI); ctx.fill(); ctx.strokeStyle = "#3a4a78"; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "right";
      ctx.fillText(I18N.t("tr.period") + ": " + periodDays().toFixed(2) + " d", VIEW.x + VIEW.w - 12, VIEW.y + VIEW.h - 10);
    }

    function drawLC(ctx) {
      panel(ctx, LCR, I18N.t("tr.flux"));
      var x0 = LCR.x + 58, x1 = LCR.x + LCR.w - 16, y0 = LCR.y + LCR.h - 40, y1 = LCR.y + 24;
      var win = Math.max(halfPhase() * 1.8, 0.02);    // phase window around transit
      var d = depth(), fLo = Math.min(0.97, 1 - d * 1.6), fHi = 1.004;
      function xf(ph) { return x0 + (ph + win) / (2 * win) * (x1 - x0); }
      function yf(f) { return y0 - (f - fLo) / (fHi - fLo) * (y0 - y1); }
      // axes
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
      ctx.fillStyle = "#9fabce"; ctx.font = "10px system-ui"; ctx.textAlign = "right";
      var ticks = 4; for (var i = 0; i <= ticks; i++) { var f = fLo + (fHi - fLo) * i / ticks; ctx.fillText(f.toFixed(3), x0 - 5, yf(f) + 3); ctx.strokeStyle = "#16213f"; ctx.beginPath(); ctx.moveTo(x0, yf(f)); ctx.lineTo(x1, yf(f)); ctx.stroke(); }
      ctx.textAlign = "center"; ctx.fillStyle = "#9fabce";
      ctx.save(); ctx.translate(LCR.x + 16, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(I18N.t("tr.flux"), 0, 0); ctx.restore();

      // simulated measurements
      if (optSim.value()) {
        var rnd = mulberry(seed * 9973 + number);
        ctx.fillStyle = "rgba(255,209,102,0.75)";
        for (var n = 0; n < number; n++) {
          var ph = -win + 2 * win * n / (number - 1);
          var fn = fluxAt(ph) + gauss(rnd) * noise;
          ctx.beginPath(); ctx.arc(xf(ph), yf(fn), 1.7, 0, 2 * Math.PI); ctx.fill();
        }
      }
      // theoretical curve
      if (optTheory.value()) {
        ctx.strokeStyle = "#6ea8fe"; ctx.lineWidth = 2; ctx.beginPath();
        for (var j = 0; j <= 300; j++) { var p = -win + 2 * win * j / 300, X = xf(p), Y = yf(fluxAt(p)); j === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); }
        ctx.stroke();
      }
      // phase cursor (only meaningful within the window)
      if (phase >= -win && phase <= win) {
        ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xf(phase), y1); ctx.lineTo(xf(phase), y0); ctx.stroke();
        ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(xf(phase), yf(fluxAt(phase)), 3.5, 0, 2 * Math.PI); ctx.fill();
      }
      // caption
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText("transit takes " + durationHr().toFixed(2) + " hr of a " + periodDays().toFixed(2) + "-day orbit   ·   " + I18N.t("tr.depth") + " " + depth().toFixed(4), (x0 + x1) / 2, y0 + 26);
    }

    /* deterministic noise */
    function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    function gauss(rnd) { return Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd()); }

    function panel(ctx, r, title) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(title.toUpperCase(), r.x + 14, r.y + 18);
    }
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
