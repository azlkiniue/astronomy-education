/* Eclipsing Binary Simulator --------------------------------------------------
   Faithful rebuild of the NAAP "Eclipsing Binary Simulator" (ebs.swf):
     • a from-Earth view of two stars orbiting their centre of mass, inclined so
       they eclipse, with orbital paths and plane,
     • the resulting normalized-flux light curve (deep primary + shallow secondary
       eclipse), with a phase cursor,
     • Star 1 / Star 2 properties (mass, radius, temperature), system separation
       and inclination, animation and a few presets.
   Light curve = 1 − (overlap-area × T⁴_back) / Σ(πR²T⁴); period from Kepler III. */
Sim.create({
  id: "eclipsing-binary",
  width: 760, height: 600,
  strings: {
    en: {
      "eb.preset": "set parameters for", "eb.s1": "Star 1", "eb.s2": "Star 2", "eb.sys": "System",
      "eb.mass": "mass", "eb.radius": "radius", "eb.temp": "temperature",
      "eb.sep": "separation", "eb.incl": "inclination", "eb.phase": "phase",
      "eb.anim": "Animation", "eb.start": "start animation", "eb.pause": "pause animation", "eb.speed": "speed",
      "eb.show": "Show", "eb.paths": "show orbital paths", "eb.plane": "show orbital plane",
      "eb.period": "system period", "eb.flux": "normalized flux", "eb.depthP": "primary depth", "eb.depthS": "secondary depth",
      "eb.fromEarth": "perspective from Earth", "eb.lcTitle": "light curve", "eb.none": "— select a preset —"
    },
    id: {
      "eb.preset": "atur parameter untuk", "eb.s1": "Bintang 1", "eb.s2": "Bintang 2", "eb.sys": "Sistem",
      "eb.mass": "massa", "eb.radius": "radius", "eb.temp": "suhu",
      "eb.sep": "pemisahan", "eb.incl": "inklinasi", "eb.phase": "fase",
      "eb.anim": "Animasi", "eb.start": "mulai animasi", "eb.pause": "jeda animasi", "eb.speed": "kecepatan",
      "eb.show": "Tampilkan", "eb.paths": "tampilkan lintasan orbit", "eb.plane": "tampilkan bidang orbit",
      "eb.period": "periode sistem", "eb.flux": "fluks ternormalisasi", "eb.depthP": "kedalaman primer", "eb.depthS": "kedalaman sekunder",
      "eb.fromEarth": "perspektif dari Bumi", "eb.lcTitle": "kurva cahaya", "eb.none": "— pilih preset —"
    }
  },
  about: {
    en: "<p>Two stars orbit their common centre of mass. If our line of sight lies near their orbital plane (high <strong>inclination</strong>), each star periodically passes in front of the other and we see <strong>eclipses</strong> — dips in the combined brightness.</p>" +
        "<p>The <strong>light curve</strong> has two dips per orbit. The <strong>primary</strong> (deeper) eclipse happens when the hotter star is hidden, because more surface brightness is blocked. Their depths and widths encode the stars' sizes, temperatures and the inclination.</p>" +
        "<p>Change the radii, temperatures, separation and inclination and watch the curve respond. Lower the inclination toward face-on and the eclipses vanish; this is why eclipsing binaries are special — they let us measure stellar radii directly.</p>",
    id: "<p>Dua bintang mengorbit pusat massa bersama. Bila garis pandang kita dekat dengan bidang orbitnya (<strong>inklinasi</strong> tinggi), tiap bintang berkala lewat di depan yang lain dan kita melihat <strong>gerhana</strong> — penurunan kecerlangan total.</p>" +
        "<p><strong>Kurva cahaya</strong> punya dua lekukan per orbit. Gerhana <strong>primer</strong> (lebih dalam) terjadi saat bintang lebih panas tertutup, karena lebih banyak kecerlangan permukaan terhalang. Kedalaman dan lebarnya menyandikan ukuran, suhu, dan inklinasi bintang.</p>" +
        "<p>Ubah radius, suhu, pemisahan, dan inklinasi lalu amati kurvanya. Turunkan inklinasi mendekati tampak-muka, gerhana lenyap; inilah istimewanya biner gerhana — memungkinkan kita mengukur radius bintang langsung.</p>"
  },
  build: function (S) {
    var P = { M1: 1, R1: 1.5, T1: 8700, M2: 1, R2: 1.5, T2: 5000, sep: 10, incl: 80 };
    var phase = 0.0, speed = 0.15;
    var PRESETS = {
      "Default": { M1: 1, R1: 1.5, T1: 8700, M2: 1, R2: 1.5, T2: 5000, sep: 10, incl: 80 },
      "Equal twins": { M1: 1, R1: 1, T1: 5800, M2: 1, R2: 1, T2: 5800, sep: 8, incl: 88 },
      "Hot giant + cool dwarf": { M1: 5, R1: 5, T1: 13000, M2: 1, R2: 1, T2: 4500, sep: 22, incl: 86 },
      "Grazing (low incl.)": { M1: 1, R1: 1.2, T1: 7000, M2: 1, R2: 1.2, T2: 6000, sep: 10, incl: 62 },
      "Algol-type": { M1: 1.7, R1: 1.6, T1: 8600, M2: 0.9, R2: 2.0, T2: 4900, sep: 11, incl: 82 }
    };

    function period() { return 365.25 * Math.sqrt(Math.pow(P.sep * 0.0046524, 3) / (P.M1 + P.M2)); }  // days
    function overlap(d, r1, r2) {
      if (d >= r1 + r2) return 0;
      if (d <= Math.abs(r1 - r2)) return Math.PI * Math.pow(Math.min(r1, r2), 2);
      var a = r1 * r1, b = r2 * r2;
      var x = (d * d + a - b) / (2 * d * r1), y = (d * d + b - a) / (2 * d * r2);
      return a * Math.acos(clamp(x, -1, 1)) + b * Math.acos(clamp(y, -1, 1)) - 0.5 * Math.sqrt(Math.max(0, (-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2)));
    }
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
    function fluxAt(ph) {
      var th = 2 * Math.PI * ph, ci = Math.cos(P.incl * Math.PI / 180), si = Math.sin(P.incl * Math.PI / 180);
      var dx = P.sep * Math.cos(th), dy = P.sep * Math.sin(th) * ci, d = Math.hypot(dx, dy);
      var relDepth = Math.sin(th) * si;            // >0 ⇒ star 2 in front of star 1
      var t1 = P.T1 / 1000, t2 = P.T2 / 1000;
      var base = Math.PI * (P.R1 * P.R1 * Math.pow(t1, 4) + P.R2 * P.R2 * Math.pow(t2, 4));
      var blocked = 0;
      if (d < P.R1 + P.R2) { var ov = overlap(d, P.R1, P.R2); blocked = ov * Math.pow(relDepth > 0 ? t1 : t2, 4); }
      return 1 - blocked / base;
    }

    /* ---- controls ---- */
    S.group("eb.sys");
    var presetSel = S.select({ labelKey: "eb.preset", value: "Default",
      options: [{ v: "", labelKey: "eb.none" }].concat(Object.keys(PRESETS).map(function (n) { return { v: n, label: n }; })),
      on: function (v) { if (PRESETS[v]) { var p = PRESETS[v]; for (var k in p) P[k] = p[k]; syncSliders(); recompute(); } } });

    S.group("eb.s1");
    var m1 = mk("eb.mass", 0.3, 10, 0.1, "M1", " M☉"), r1 = mk("eb.radius", 0.3, 8, 0.1, "R1", " R☉"), t1 = mk("eb.temp", 3000, 15000, 100, "T1", " K");
    S.group("eb.s2");
    var m2 = mk("eb.mass", 0.3, 10, 0.1, "M2", " M☉"), r2 = mk("eb.radius", 0.3, 8, 0.1, "R2", " R☉"), t2 = mk("eb.temp", 3000, 15000, 100, "T2", " K");
    S.group("eb.sys");
    var sepC = mk("eb.sep", 5, 35, 0.5, "sep", " R☉"), inclC = mk("eb.incl", 40, 90, 0.5, "incl", "°");
    function mk(label, lo, hi, st, key, unit) {
      return S.slider({ labelKey: label, min: lo, max: hi, step: st, value: P[key], unit: unit, on: function (v) { P[key] = v; recompute(); } });
    }

    S.group("eb.anim");
    var loop = S.loop(function (dt) { phase = (phase + speed * dt) % 1; phC.set(phase); });
    var playBtn = S.button({ labelKey: "eb.start", primary: true, on: function () { loop.toggle(); syncPlay(); } });
    function syncPlay() { var k = loop.playing ? "eb.pause" : "eb.start"; playBtn.setAttribute("data-i18n", k); playBtn.textContent = I18N.t(k); }
    S.refreshers.push(syncPlay);
    S.slider({ labelKey: "eb.speed", min: 0.03, max: 0.6, step: 0.01, value: speed, format: function (v) { return v.toFixed(2) + "/s"; }, on: function (v) { speed = v; } });
    var phC = S.slider({ labelKey: "eb.phase", min: 0, max: 1, step: 0.001, value: phase, format: function (v) { return v.toFixed(3); }, on: function (v) { phase = v; S.requestDraw(); } });

    S.group("eb.show");
    var optPaths = S.toggle({ labelKey: "eb.paths", value: true });
    var optPlane = S.toggle({ labelKey: "eb.plane", value: true });

    var oPer = S.readout({ labelKey: "eb.period" });
    var oFlux = S.readout({ labelKey: "eb.flux" });
    var oDP = S.readout({ labelKey: "eb.depthP" });
    var oDS = S.readout({ labelKey: "eb.depthS" });

    function syncSliders() { m1.set(P.M1); r1.set(P.R1); t1.set(P.T1); m2.set(P.M2); r2.set(P.R2); t2.set(P.T2); sepC.set(P.sep); inclC.set(P.incl); }

    /* ---- light-curve sampling + eclipse depths ---- */
    var LC = [];
    function recompute() {
      LC = []; var minA = 1, minAph = 0, minB = 1;
      for (var i = 0; i <= 400; i++) { var ph = i / 400, f = fluxAt(ph); LC.push(f); }
      // primary = global min; secondary = min of the other dip (half a period away region)
      for (var j = 0; j <= 400; j++) { if (LC[j] < minA) { minA = LC[j]; minAph = j / 400; } }
      for (var k = 0; k <= 400; k++) { var ph2 = k / 400; if (Math.abs(((ph2 - minAph) % 1 + 1) % 1 - 0.5) < 0.2 && LC[k] < minB) minB = LC[k]; }
      oPer(period().toFixed(2) + " d");
      oDP((100 * (1 - minA)).toFixed(1) + "%");
      oDS((100 * (1 - minB)).toFixed(1) + "%");
      S.requestDraw();
    }
    S.refreshers.push(function () { oPer(period().toFixed(2) + " d"); });

    /* ===================================================================== */
    var VIEW = { x: 12, y: 28, w: 736, h: 248 };
    var LCR = { x: 12, y: 290, w: 736, h: 298 };

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      oFlux(fluxAt(phase).toFixed(3));
      drawView(ctx);
      drawLC(ctx);
    });
    recompute();

    function drawView(ctx) {
      panel(ctx, VIEW, I18N.t("eb.fromEarth"));
      var cx = VIEW.x + VIEW.w / 2, cy = VIEW.y + VIEW.h / 2 + 6;
      var ci = Math.cos(P.incl * Math.PI / 180), si = Math.sin(P.incl * Math.PI / 180);
      var a1 = P.sep * P.M2 / (P.M1 + P.M2), a2 = P.sep * P.M1 / (P.M1 + P.M2);
      var scale = Math.min((VIEW.w * 0.40) / (P.sep / 2 + Math.max(P.R1, P.R2)), (VIEW.h * 0.42) / (Math.max(a1, a2) * Math.max(ci, 0.12) + Math.max(P.R1, P.R2)));
      var th = 2 * Math.PI * phase;

      ctx.save(); roundRect(ctx, VIEW.x + 1, VIEW.y + 1, VIEW.w - 2, VIEW.h - 2, 11); ctx.clip();
      ctx.fillStyle = "#04060d"; ctx.fillRect(VIEW.x, VIEW.y, VIEW.w, VIEW.h);
      // orbital plane
      if (optPlane.value()) { ctx.fillStyle = "rgba(110,168,254,0.07)"; ctx.beginPath(); ctx.ellipse(cx, cy, (P.sep / 2 + Math.max(P.R1, P.R2)) * scale, (P.sep / 2 + 1) * scale * ci, 0, 0, 2 * Math.PI); ctx.fill(); }
      // orbital paths
      if (optPaths.value()) {
        ctx.strokeStyle = "rgba(160,175,210,0.45)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(cx, cy, a1 * scale, a1 * scale * ci, 0, 0, 2 * Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, cy, a2 * scale, a2 * scale * ci, 0, 0, 2 * Math.PI); ctx.stroke();
        ctx.fillStyle = "#4cd4a0"; ctx.beginPath(); ctx.arc(cx, cy, 2, 0, 2 * Math.PI); ctx.fill();   // COM
      }
      // star positions
      var s1 = { x: cx - a1 * Math.cos(th) * scale, y: cy + a1 * Math.sin(th) * ci * scale, z: -a1 * Math.sin(th) * si, R: P.R1, T: P.T1 };
      var s2 = { x: cx + a2 * Math.cos(th) * scale, y: cy - a2 * Math.sin(th) * ci * scale, z: a2 * Math.sin(th) * si, R: P.R2, T: P.T2 };
      var order = s1.z < s2.z ? [s1, s2] : [s2, s1];   // draw far star first
      order.forEach(function (s) { star(ctx, s.x, s.y, Math.max(3, s.R * scale), s.T); });
      ctx.restore();

      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "right";
      ctx.fillText(I18N.t("eb.period") + ": " + period().toFixed(2) + " d", VIEW.x + VIEW.w - 12, VIEW.y + VIEW.h - 10);
    }

    function drawLC(ctx) {
      panel(ctx, LCR, I18N.t("eb.lcTitle"));
      var x0 = LCR.x + 52, x1 = LCR.x + LCR.w - 16, y0 = LCR.y + LCR.h - 34, y1 = LCR.y + 26;
      function xf(ph) { return x0 + ph * (x1 - x0); }
      function yf(f) { return y0 - (f / 1.08) * (y0 - y1); }
      // axes
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
      ctx.fillStyle = "#9fabce"; ctx.font = "10px system-ui"; ctx.textAlign = "right";
      [0, 0.25, 0.5, 0.75, 1.0].forEach(function (f) { ctx.fillText(f.toFixed(2), x0 - 5, yf(f) + 3); ctx.strokeStyle = "#16213f"; ctx.beginPath(); ctx.moveTo(x0, yf(f)); ctx.lineTo(x1, yf(f)); ctx.stroke(); });
      ctx.textAlign = "center";
      for (var p = 0; p <= 1.0001; p += 0.25) ctx.fillText(p.toFixed(2), xf(p), y0 + 14);
      ctx.fillText(I18N.t("eb.phase"), (x0 + x1) / 2, y0 + 28);
      ctx.save(); ctx.translate(LCR.x + 14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(I18N.t("eb.flux"), 0, 0); ctx.restore();
      // curve
      ctx.strokeStyle = "#6ea8fe"; ctx.lineWidth = 2; ctx.beginPath();
      for (var i = 0; i < LC.length; i++) { var X = xf(i / (LC.length - 1)), Y = yf(LC[i]); i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y); }
      ctx.stroke();
      // phase cursor
      ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xf(phase), y1); ctx.lineTo(xf(phase), y0); ctx.stroke();
      ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(xf(phase), yf(fluxAt(phase)), 3.5, 0, 2 * Math.PI); ctx.fill();
    }

    function star(ctx, x, y, r, T) {
      var rgb = tempToRGB(T);
      var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
      g.addColorStop(0, "rgb(" + rgb.map(function (v) { return Math.min(255, v + 50); }).map(Math.round).join(",") + ")");
      g.addColorStop(1, "rgb(" + rgb.map(Math.round).join(",") + ")");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
    }
    function panel(ctx, r, title) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left";
      ctx.fillText(title.toUpperCase(), r.x + 14, r.y + 18);
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
