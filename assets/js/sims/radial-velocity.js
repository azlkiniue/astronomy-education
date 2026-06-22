/* Exoplanet Radial Velocity Simulator ----------------------------------------
   Faithful rebuild of the NAAP "Radial Velocity Simulator" (radialVelocitySimulator.swf):
     • a 3-D grid platter showing the star + planet orbiting their common centre of
       mass, with an "earth view" arrow marking the line of sight (the tilt is the
       inclination),
     • the radial-velocity curve (m/s vs phase) over one period, with a theoretical
       curve, optional noisy simulated measurements, and a phase cursor at ~70 %,
     • System Orientation (inclination, longitude of periastron), Star Properties
       (mass → spectral type / T / R), Planet Properties (mass, semimajor axis,
       eccentricity), animation and real-system presets.
   K = 28.4329 m/s · (M_p sin i / M_J) · ((M_★+M_p)/M_☉)^(−2/3) · (P/yr)^(−1/3) / √(1−e²),
   P from Kepler III, RV(φ) = K[cos(ν+ω) + e cos ω].                               */
Sim.create({
  id: "radial-velocity",
  width: 760, height: 366,
  strings: {
    en: {
      "rv.presets": "Presets", "rv.preset": "set parameters for", "rv.none": "— select a preset —",
      "rv.orient": "System Orientation", "rv.incl": "inclination", "rv.long": "longitude",
      "rv.star": "Star Properties", "rv.mass": "mass",
      "rv.planet": "Planet Properties", "rv.pmass": "planet mass", "rv.a": "semimajor axis", "rv.ecc": "eccentricity",
      "rv.anim": "Animation", "rv.start": "start animation", "rv.pause": "pause animation", "rv.speed": "speed", "rv.phase": "phase",
      "rv.data": "Measurements", "rv.theory": "show theoretical curve", "rv.sim": "show simulated measurements",
      "rv.noise": "noise", "rv.number": "number",
      "rv.period": "system period", "rv.amp": "RV semi-amplitude", "rv.startype": "spectral type", "rv.msini": "M·sin i",
      "rv.temp": "temperature", "rv.rad": "radius",
      "rv.earth": "earth view"
    },
    id: {
      "rv.presets": "Preset", "rv.preset": "atur parameter untuk", "rv.none": "— pilih preset —",
      "rv.orient": "Orientasi Sistem", "rv.incl": "inklinasi", "rv.long": "bujur periastron",
      "rv.star": "Sifat Bintang", "rv.mass": "massa",
      "rv.planet": "Sifat Planet", "rv.pmass": "massa planet", "rv.a": "sumbu semimayor", "rv.ecc": "eksentrisitas",
      "rv.anim": "Animasi", "rv.start": "mulai animasi", "rv.pause": "jeda animasi", "rv.speed": "kecepatan", "rv.phase": "fase",
      "rv.data": "Pengukuran", "rv.theory": "tampilkan kurva teoretis", "rv.sim": "tampilkan pengukuran simulasi",
      "rv.noise": "derau", "rv.number": "jumlah",
      "rv.period": "periode sistem", "rv.amp": "amplitudo RV", "rv.startype": "tipe spektral", "rv.msini": "M·sin i",
      "rv.temp": "suhu", "rv.rad": "radius",
      "rv.earth": "pandangan Bumi"
    }
  },
  about: {
    en: "<p>A planet doesn't just orbit its star — both bodies circle their shared <strong>centre of mass</strong>, so the star traces a small mirror-image orbit. As the star swings toward and away from us, its light blueshifts and redshifts, and we read off its <strong>radial velocity</strong>.</p>" +
        "<p>The wobble's size is the semi-amplitude <em>K</em> — bigger for heavier, closer planets and edge-on orbits. Only the line-of-sight component shows up, so we actually measure <strong>M·sin i</strong>: a face-on orbit (inclination 0°) gives a flat line and no detection.</p>" +
        "<p>Turn on <strong>simulated measurements</strong> to see the noisy data astronomers fit, and load a real system — this is how 51 Pegasi b, the first exoplanet around a Sun-like star, was found.</p>",
    id: "<p>Planet tidak hanya mengorbit bintangnya — kedua benda mengelilingi <strong>pusat massa</strong> bersama, sehingga bintang menjejaki orbit kecil yang berlawanan. Saat bintang berayun mendekat dan menjauh, cahayanya bergeser biru dan merah, dan kita membaca <strong>kecepatan radialnya</strong>.</p>" +
        "<p>Besar ayunan adalah amplitudo <em>K</em> — lebih besar untuk planet berat, dekat, dan orbit tepi-pandang. Hanya komponen garis pandang yang muncul, jadi kita sebenarnya mengukur <strong>M·sin i</strong>: orbit hadap-muka (inklinasi 0°) memberi garis datar tanpa deteksi.</p>" +
        "<p>Nyalakan <strong>pengukuran simulasi</strong> untuk melihat data berderau yang dicocokkan astronom, dan muat sistem nyata — beginilah 51 Pegasi b, eksoplanet pertama di sekitar bintang mirip-Matahari, ditemukan.</p>"
  },
  build: function (S) {
    var MJUP_MSUN = 9.543e-4;
    var P = { M: 1.0, Mp: 1.0, a: 1.0, e: 0.20, incl: 90, lon: 45 };
    var phase = 0, speed = 0.06, noise = 15, number = 150, seed = 1;
    var PRESETS = {
      "Option A": { M: 1.0, Mp: 1.0, a: 1.0, e: 0.20, incl: 90, lon: 45 },
      "51 Pegasi b": { M: 1.11, Mp: 0.47, a: 0.052, e: 0.01, incl: 90, lon: 90 },
      "Our Jupiter": { M: 1.0, Mp: 1.0, a: 5.2, e: 0.048, incl: 90, lon: 14 },
      "HD 80606 b (e=0.93)": { M: 1.01, Mp: 4.0, a: 0.45, e: 0.93, incl: 89, lon: 300 },
      "Hot Neptune": { M: 0.8, Mp: 0.06, a: 0.05, e: 0.0, incl: 87, lon: 0 },
      "Face-on (no signal)": { M: 1.0, Mp: 2.0, a: 1.0, e: 0.0, incl: 8, lon: 45 }
    };

    /* ---- physics ---- */
    function MpMsun() { return P.Mp * MJUP_MSUN; }
    function Mtot() { return P.M + MpMsun(); }                          // M☉
    function periodYr() { return Math.sqrt(Math.pow(P.a, 3) / Mtot()); }
    function periodDays() { return periodYr() * 365.25; }
    function Kstar() {                                                  // star reflex semi-amplitude, m/s
      return 28.4329 / Math.sqrt(1 - P.e * P.e) * (P.Mp * Math.sin(rad(P.incl))) *
        Math.pow(Mtot(), -2 / 3) * Math.pow(periodYr(), -1 / 3);
    }
    function Rstar() { return Math.pow(P.M, 0.9); }                     // R☉ (main sequence)
    function Tstar() { return 5810 * Math.pow(P.M, 0.51); }             // K (G2V = 5810 K at 1 M☉, matches SWF)
    function specType() {
      var T = Tstar(), b = [["O", 30000, 55000], ["B", 10000, 30000], ["A", 7500, 10000], ["F", 6000, 7500], ["G", 5200, 6000], ["K", 3700, 5200], ["M", 2200, 3700]];
      for (var i = 0; i < b.length; i++) if (T >= b[i][1] || i === b.length - 1) { var s = Math.max(0, Math.min(9, Math.round(10 * (b[i][2] - T) / (b[i][2] - b[i][1])))); return b[i][0] + s + "V"; }
      return "G2V";
    }
    function rad(d) { return d * Math.PI / 180; }

    function trueAnom(ph) {                                             // ph in [0,1) → true anomaly ν
      var M = 2 * Math.PI * ph, E = M, i;
      for (i = 0; i < 60; i++) { var dE = (E - P.e * Math.sin(E) - M) / (1 - P.e * Math.cos(E)); E -= dE; if (Math.abs(dE) < 1e-9) break; }
      return 2 * Math.atan2(Math.sqrt(1 + P.e) * Math.sin(E / 2), Math.sqrt(1 - P.e) * Math.cos(E / 2));
    }
    function rvAt(ph) {                                                 // m/s, star's radial velocity
      var nu = trueAnom(ph), w = rad(P.lon);
      return Kstar() * (Math.cos(nu + w) + P.e * Math.cos(w));
    }

    /* ---- controls ---- */
    S.group("rv.presets");
    var presetSel = S.select({ labelKey: "rv.preset", value: "",
      options: [{ v: "", labelKey: "rv.none" }].concat(Object.keys(PRESETS).map(function (n) { return { v: n, label: n }; })),
      on: function (v) { if (PRESETS[v]) { var p = PRESETS[v]; P.M = p.M; P.Mp = p.Mp; P.a = p.a; P.e = p.e; P.incl = p.incl; P.lon = p.lon;
        mC.set(p.M); pmC.set(p.Mp); aC.set(p.a); eC.set(p.e); iC.set(p.incl); lC.set(p.lon); seed++; } } });

    S.group("rv.orient");
    var iC = S.slider({ labelKey: "rv.incl", min: 0, max: 90, step: 1, value: P.incl, unit: "°", on: function (v) { P.incl = v; upd(); } });
    var lC = S.slider({ labelKey: "rv.long", min: 0, max: 360, step: 1, value: P.lon, unit: "°", on: function (v) { P.lon = v; upd(); } });

    S.group("rv.star");
    var mC = S.slider({ labelKey: "rv.mass", min: 0.3, max: 3, step: 0.01, value: P.M, unit: " M☉", on: function (v) { P.M = v; upd(); } });

    S.group("rv.planet");
    var pmC = S.slider({ labelKey: "rv.pmass", min: 0.05, max: 10, step: 0.05, value: P.Mp, unit: " M♃", on: function (v) { P.Mp = v; upd(); } });
    var aC = S.slider({ labelKey: "rv.a", min: 0.02, max: 6, step: 0.01, value: P.a, format: function (v) { return v.toFixed(2) + " AU"; }, on: function (v) { P.a = v; upd(); } });
    var eC = S.slider({ labelKey: "rv.ecc", min: 0, max: 0.95, step: 0.01, value: P.e, format: function (v) { return v.toFixed(2); }, on: function (v) { P.e = v; upd(); } });

    S.group("rv.anim");
    var loop = S.loop(function (dt) { phase = (phase + speed * dt) % 1; phC.set(phase); });
    var playBtn = S.button({ labelKey: "rv.start", primary: true, on: function () { loop.toggle(); syncPlay(); } });
    function syncPlay() { var key = loop.playing ? "rv.pause" : "rv.start"; playBtn.setAttribute("data-i18n", key); playBtn.textContent = I18N.t(key); }
    S.refreshers.push(syncPlay);
    S.slider({ labelKey: "rv.speed", min: 0.01, max: 0.4, step: 0.01, value: speed, format: function (v) { return v.toFixed(2) + "/s"; }, on: function (v) { speed = v; } });
    var phC = S.slider({ labelKey: "rv.phase", min: 0, max: 1, step: 0.001, value: phase, format: function (v) { return v.toFixed(3); }, on: function (v) { phase = v; S.requestDraw(); } });

    S.group("rv.data");
    var optTheory = S.toggle({ labelKey: "rv.theory", value: true });
    var optSim = S.toggle({ labelKey: "rv.sim", value: false, on: function () { seed++; S.requestDraw(); } });
    S.slider({ labelKey: "rv.noise", min: 0, max: 30, step: 0.5, value: noise, format: function (v) { return v.toFixed(1) + " m/s"; }, on: function (v) { noise = v; seed++; S.requestDraw(); } });
    S.slider({ labelKey: "rv.number", min: 20, max: 300, step: 10, value: number, on: function (v) { number = v; seed++; S.requestDraw(); } });

    var oPer = S.readout({ labelKey: "rv.period" });
    var oAmp = S.readout({ labelKey: "rv.amp" });
    var oMsini = S.readout({ labelKey: "rv.msini" });
    var oStar = S.readout({ labelKey: "rv.startype" });
    var oTemp = S.readout({ labelKey: "rv.temp" });
    var oRad = S.readout({ labelKey: "rv.rad" });

    function upd() {
      var P_d = periodDays();
      oPer(P_d < 900 ? P_d.toFixed(0) + " days" : periodYr().toFixed(2) + " yr");
      oAmp(Kstar().toFixed(2) + " m/s");
      oMsini((P.Mp * Math.sin(rad(P.incl))).toFixed(3) + " M♃");
      oStar(specType());
      oTemp(Math.round(Tstar()) + " K");
      oRad(Rstar().toFixed(2) + " R☉");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ===================================================================== */
    var VIEW = { x: 12, y: 28, w: 304, h: 326 };
    var GR = { x: 328, y: 28, w: 420, h: 326 };
    S.onDraw(function () { var ctx = S.ctx; S.clear(); drawView(ctx); drawCurve(ctx); });

    /* 3-D grid platter: sky frame (x right, y up/north, z toward Earth) tilted by camera
       φ, then the whole image rolled by β so the line of sight reads down-left. */
    var CAM = rad(62), BETA = rad(17), cB = Math.cos(BETA), sB = Math.sin(BETA);
    function project(xs, ys, zs, cx, cy, sc) {
      var ox = xs * sc, oy = -(ys * Math.cos(CAM) - zs * Math.sin(CAM)) * sc;
      return { x: cx + ox * cB - oy * sB, y: cy + ox * sB + oy * cB, depth: ys * Math.sin(CAM) + zs * Math.cos(CAM) };
    }
    function gridPoint(u, v) {                            // plane coords (AU) → sky coords; v tilts with inclination
      var ci = Math.cos(rad(P.incl)), si = Math.sin(rad(P.incl));
      return { x: u, y: v * ci, z: v * si };
    }
    function orbitPoint(nu) {                              // sky-frame position (AU) for true anomaly nu, focus at origin
      var r = P.a * (1 - P.e * P.e) / (1 + P.e * Math.cos(nu));
      var w = rad(P.lon), xp = r * Math.cos(nu + w), yp = r * Math.sin(nu + w);
      var ci = Math.cos(rad(P.incl)), si = Math.sin(rad(P.incl));
      return { x: xp, y: yp * ci, z: yp * si };
    }

    function drawView(ctx) {
      panel(ctx, VIEW, "");
      ctx.save(); roundRect(ctx, VIEW.x + 1, VIEW.y + 1, VIEW.w - 2, VIEW.h - 2, 11); ctx.clip();
      ctx.fillStyle = "#05070e"; ctx.fillRect(VIEW.x, VIEW.y, VIEW.w, VIEW.h);
      var cx = VIEW.x + VIEW.w / 2, cy = VIEW.y + VIEW.h * 0.46;
      var G = P.a * (1 + P.e) * 1.12;                     // grid half-extent (encloses the orbit)
      var sc = Math.min(VIEW.w * 0.33, VIEW.h * 0.34) / G;
      var pr = function (u, v) { var g = gridPoint(u, v); return project(g.x, g.y, g.z, cx, cy, sc); };

      // grid plane fill
      var c1 = pr(-G, -G), c2 = pr(G, -G), c3 = pr(G, G), c4 = pr(-G, G);
      ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(c3.x, c3.y); ctx.lineTo(c4.x, c4.y); ctx.closePath();
      ctx.fillStyle = "rgba(46,52,68,0.55)"; ctx.fill();
      // grid lines
      ctx.strokeStyle = "rgba(120,132,156,0.45)"; ctx.lineWidth = 1;
      var n = 6, step = (2 * G) / n;
      for (var k = 0; k <= n; k++) { var g = -G + k * step;
        var a1 = pr(g, -G), a2 = pr(g, G); ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.stroke();
        var b1 = pr(-G, g), b2 = pr(G, g); ctx.beginPath(); ctx.moveTo(b1.x, b1.y); ctx.lineTo(b2.x, b2.y); ctx.stroke(); }
      // green coordinate axes through the centre
      ctx.strokeStyle = "rgba(86,200,96,0.55)"; ctx.lineWidth = 1.2;
      var ax1 = pr(-G, 0), ax2 = pr(G, 0); ctx.beginPath(); ctx.moveTo(ax1.x, ax1.y); ctx.lineTo(ax2.x, ax2.y); ctx.stroke();
      var ay1 = pr(0, -G), ay2 = pr(0, G); ctx.beginPath(); ctx.moveTo(ay1.x, ay1.y); ctx.lineTo(ay2.x, ay2.y); ctx.stroke();

      // planet orbit (white)
      ctx.strokeStyle = "rgba(236,239,246,0.9)"; ctx.lineWidth = 1.4; ctx.beginPath();
      for (var j = 0; j <= 160; j++) { var op = orbitPoint(j / 160 * 2 * Math.PI), s = project(op.x, op.y, op.z, cx, cy, sc); j === 0 ? ctx.moveTo(s.x, s.y) : ctx.lineTo(s.x, s.y); }
      ctx.closePath(); ctx.stroke();

      // planet + star (draw far one first)
      var pp = orbitPoint(trueAnom(phase)), pS = project(pp.x, pp.y, pp.z, cx, cy, sc);
      var sS = project(0, 0, 0, cx, cy, sc);
      function drawPlanet() { ctx.fillStyle = "#b9bec8"; ctx.beginPath(); ctx.arc(pS.x, pS.y, Math.max(4, Math.cbrt(P.Mp) * 3.2), 0, 2 * Math.PI); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 1; ctx.stroke(); }
      function drawStar() {
        var rgb = tempToRGB(Tstar()), rr = 15;
        var gg = ctx.createRadialGradient(sS.x - 4, sS.y - 4, 2, sS.x, sS.y, rr);
        gg.addColorStop(0, "#ffffff"); gg.addColorStop(0.6, "rgb(" + rgb.map(Math.round).join(",") + ")"); gg.addColorStop(1, "rgb(" + rgb.map(function (v) { return Math.round(v * 0.7); }).join(",") + ")");
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(sS.x, sS.y, rr, 0, 2 * Math.PI); ctx.fill();
      }
      if (pS.depth >= sS.depth) { drawStar(); drawPlanet(); } else { drawPlanet(); drawStar(); }
      ctx.restore();

      // "earth view" arrow (bottom-left, pointing down-left along the rolled line of sight)
      var ax = VIEW.x + 70, ay = VIEW.y + VIEW.h - 34;
      arrow(ctx, ax, ay, ax - 30, ay + 22, "#f5a623");
      ctx.fillStyle = "#f5a623"; ctx.font = "italic 700 12px Georgia, serif"; ctx.textAlign = "left";
      ctx.fillText(I18N.t("rv.earth"), VIEW.x + 14, ay + 2);
    }

    function drawCurve(ctx) {
      panel(ctx, GR, "");
      var x0 = GR.x + 54, x1 = GR.x + GR.w - 16, y0 = GR.y + GR.h - 34, y1 = GR.y + 20;
      var W0 = -0.7, W1 = 0.3;                            // fixed one-period window; cursor (phase 0) sits at 70 %
      function xf(ph) { return x0 + (ph - W0) / (W1 - W0) * (x1 - x0); }
      function wrapWin(ph) { var p = ((ph % 1) + 1) % 1; return p > W1 ? p - 1 : p; }
      var vmin = 1e9, vmax = -1e9;
      for (var s = 0; s <= 240; s++) { var v = rvAt(s / 240); if (v < vmin) vmin = v; if (v > vmax) vmax = v; }
      var pad = (vmax - vmin) * 0.14 + 1; vmin -= pad; vmax += pad;
      function yf(v) { return y0 - (v - vmin) / (vmax - vmin) * (y0 - y1); }

      // y grid + ticks (nice round step)
      var span = vmax - vmin, st = niceStep(span);
      ctx.font = "10px system-ui"; ctx.textAlign = "right";
      for (var ty = Math.ceil(vmin / st) * st; ty <= vmax; ty += st) { var yy = yf(ty); ctx.strokeStyle = Math.abs(ty) < 1e-6 ? "#3a4a78" : "#16213f"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x1, yy); ctx.stroke(); ctx.fillStyle = "#9fabce"; ctx.fillText(Math.round(ty), x0 - 6, yy + 3); }
      // axes
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
      // x ticks (labels shown mod 1)
      ctx.textAlign = "center"; ctx.fillStyle = "#9fabce";
      for (var tx = Math.ceil(W0 / 0.2) * 0.2; tx <= W1 + 1e-9; tx += 0.2) { var X = xf(tx); ctx.strokeStyle = "#16213f"; ctx.beginPath(); ctx.moveTo(X, y0); ctx.lineTo(X, y0 + 4); ctx.stroke(); ctx.fillStyle = "#9fabce"; ctx.fillText((((tx % 1) + 1) % 1).toFixed(1), X, y0 + 16); }
      ctx.fillText("Phase", (x0 + x1) / 2, y0 + 30);
      ctx.save(); ctx.translate(GR.x + 14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText("Radial Velocity (m/s)", 0, 0); ctx.restore();

      // simulated measurements
      if (optSim.value() && Kstar() > 0.01) {
        var rnd = mulberry(seed * 7919 + number);
        ctx.fillStyle = "rgba(120,180,255,0.85)";
        for (var m = 0; m < number; m++) { var ph = W0 + (W1 - W0) * rnd(); var vn = rvAt(((ph % 1) + 1) % 1) + gauss(rnd) * noise; ctx.beginPath(); ctx.arc(xf(ph), yf(vn), 1.8, 0, 2 * Math.PI); ctx.fill(); }
      }
      // theoretical curve
      if (optTheory.value()) {
        ctx.strokeStyle = "#6ea8fe"; ctx.lineWidth = 2; ctx.beginPath();
        for (var j = 0; j <= 300; j++) { var p = W0 + (W1 - W0) * j / 300, Xc = xf(p), Yc = yf(rvAt(((p % 1) + 1) % 1)); j === 0 ? ctx.moveTo(Xc, Yc) : ctx.lineTo(Xc, Yc); }
        ctx.stroke();
      }
      // phase cursor at ~70 %
      var cph = wrapWin(phase);
      ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(xf(cph), y1); ctx.lineTo(xf(cph), y0); ctx.stroke();
      ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(xf(cph), yf(rvAt(phase)), 3.5, 0, 2 * Math.PI); ctx.fill();

      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "right";
      ctx.fillText("K = " + Kstar().toFixed(2) + " m/s   ·   " + I18N.t("rv.period") + ": " + (periodDays() < 900 ? periodDays().toFixed(0) + " days" : periodYr().toFixed(2) + " yr"), x1, y1 - 6);
    }

    upd();

    /* ---- helpers ---- */
    function niceStep(span) { var raw = span / 6, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
    function arrow(ctx, x0, y0, x1, y1, col) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      var a = Math.atan2(y1 - y0, x1 - x0);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 10 * Math.cos(a - 0.45), y1 - 10 * Math.sin(a - 0.45)); ctx.lineTo(x1 - 10 * Math.cos(a + 0.45), y1 - 10 * Math.sin(a + 0.45)); ctx.closePath(); ctx.fill();
    }
    function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    function gauss(rnd) { return Math.sqrt(-2 * Math.log(rnd() + 1e-9)) * Math.cos(2 * Math.PI * rnd()); }
    function panel(ctx, r, title) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      if (title) { ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(title.toUpperCase(), r.x + 14, r.y + 18); }
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
