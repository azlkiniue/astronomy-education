/* Ptolemaic System Simulator --------------------------------------------------
   Faithful rebuild of the NAAP "Ptolemaic System Simulator" (ptolemaic.swf):
   the geocentric model in which a planet rides a small epicycle whose centre is
   carried around a large deferent, with an offset centre (eccentric) and an
   equant about which the deferent motion is uniform.
     • Orbit View — zodiac ring, Earth at centre, deferent + epicycle, the Sun and
       the planet, the deferent centre and equant marks, plus optional construction
       lines/vectors and a path trace,
     • Planetary Parameters — preset, epicycle size, eccentricity, motion ratio,
       apogee angle, superior/inferior type, and a store/recall memory,
     • Controls and Settings — pause, animation rate, the show-toggles, path duration,
     • a Zodiac Strip giving the planet's apparent (geocentric) longitude.          */
Sim.create({
  id: "ptolemaic",
  width: 760, height: 620,
  strings: {
    en: {
      "pt.params": "Planetary Parameters", "pt.preset": "preset", "pt.epi": "epicycle size", "pt.ecc": "eccentricity",
      "pt.ratio": "motion ratio", "pt.apogee": "apogee angle", "pt.type": "planet type", "pt.sup": "superior", "pt.inf": "inferior",
      "pt.mem": "Memory", "pt.store": "store", "pt.recall": "recall",
      "pt.ctrl": "Controls & Settings", "pt.start": "start animation", "pt.pause": "pause animation", "pt.rate": "animation rate",
      "pt.show": "Show", "pt.showPlanet": "show planet", "pt.showEpi": "show epicycle", "pt.esLine": "show earth–sun line",
      "pt.epLine": "show epicycle–planet line", "pt.pVec": "show planet vector", "pt.qVec": "show equant vector",
      "pt.pathDur": "path duration", "pt.lon": "apparent longitude", "pt.elong": "elongation from Sun",
      "pt.zod": "Zodiac Strip"
    },
    id: {
      "pt.params": "Parameter Planet", "pt.preset": "preset", "pt.epi": "ukuran episiklus", "pt.ecc": "eksentrisitas",
      "pt.ratio": "rasio gerak", "pt.apogee": "sudut apogee", "pt.type": "tipe planet", "pt.sup": "superior", "pt.inf": "inferior",
      "pt.mem": "Memori", "pt.store": "simpan", "pt.recall": "panggil",
      "pt.ctrl": "Kontrol & Pengaturan", "pt.start": "mulai animasi", "pt.pause": "jeda animasi", "pt.rate": "kecepatan animasi",
      "pt.show": "Tampilkan", "pt.showPlanet": "tampilkan planet", "pt.showEpi": "tampilkan episiklus", "pt.esLine": "tampilkan garis bumi–matahari",
      "pt.epLine": "tampilkan garis episiklus–planet", "pt.pVec": "tampilkan vektor planet", "pt.qVec": "tampilkan vektor equant",
      "pt.pathDur": "durasi jejak", "pt.lon": "bujur tampak", "pt.elong": "elongasi dari Matahari",
      "pt.zod": "Strip Zodiak"
    }
  },
  about: {
    en: "<p>Before Copernicus, the sky was explained with Earth at the centre. To reproduce the planets' loops and speed changes, <strong>Ptolemy</strong> had each planet ride a small circle — the <em>epicycle</em> — whose centre was carried around a big circle, the <em>deferent</em>. The deferent's centre was offset from Earth (an <em>eccentric</em>), and its motion was uniform not about that centre but about a third point, the <strong>equant</strong>.</p>" +
        "<p>It worked remarkably well. Watch the planet trace its path: the epicycle produces retrograde loops exactly when the planet is opposite the Sun, and the equant reproduces the way planets speed up and slow down. For a <em>superior</em> planet the epicycle arm stays parallel to the Earth–Sun line; for an <em>inferior</em> planet the epicycle's centre stays on that line.</p>" +
        "<p>Compare it with the heliocentric <a href=\"kepler.html\">Planetary Orbit Simulator</a>: the epicycle is really Earth's own orbit in disguise. Ptolemy's geometry is the Sun–Earth–planet triangle, drawn from Earth's point of view.</p>",
    id: "<p>Sebelum Copernicus, langit dijelaskan dengan Bumi di pusat. Untuk meniru loop dan perubahan laju planet, <strong>Ptolemy</strong> membuat tiap planet menaiki lingkaran kecil — <em>episiklus</em> — yang pusatnya dibawa mengelilingi lingkaran besar, <em>deferen</em>. Pusat deferen tergeser dari Bumi (<em>eksentrik</em>), dan geraknya seragam bukan terhadap pusat itu melainkan terhadap titik ketiga, <strong>equant</strong>.</p>" +
        "<p>Model ini bekerja sangat baik. Amati planet menelusuri lintasannya: episiklus menghasilkan loop retrograd tepat saat planet berseberangan dengan Matahari, dan equant meniru cara planet mempercepat dan memperlambat. Untuk planet <em>superior</em>, lengan episiklus tetap sejajar garis Bumi–Matahari; untuk planet <em>inferior</em>, pusat episiklus tetap di garis itu.</p>" +
        "<p>Bandingkan dengan model heliosentris <a href=\"kepler.html\">Simulator Orbit Planet</a>: episiklus sebenarnya adalah orbit Bumi yang menyamar. Geometri Ptolemy adalah segitiga Matahari–Bumi–planet, digambar dari sudut pandang Bumi.</p>"
  },
  build: function (S) {
    var C = { text: "#e8ecf8", dim: "#9fabce", border: "#2c3a66", panel: "#070b16",
              earth: "#6ea8fe", sun: "#ffd166", planet: "#5fe0c8", defer: "#5b6da0",
              epi: "#b692ff", equant: "#ff8b6b", path: "#e0c46b", zod: "#2c3a66" };
    var TAU = Math.PI * 2, D2R = Math.PI / 180, R2D = 180 / Math.PI;
    // standard NAAP-style presets: [epicycle size, eccentricity, motion ratio, apogee°, superior?]
    var PRESETS = {
      Mercury: [0.583, 0.10, 4.15, 30, false],
      Venus:   [0.723, 0.02, 1.63, 55, false],
      Mars:    [0.658, 0.10, 0.52, 106.7, true],
      Jupiter: [0.192, 0.05, 0.084, 159, true],
      Saturn:  [0.105, 0.06, 0.034, 227, true]
    };
    var epi = 0.658, ecc = 0.10, ratio = 0.52, apogee = 106.7, superior = true;
    var t = 0, rate = 0.15, pathDur = 4.0, memory = null;

    /* ---- Planetary Parameters ---- */
    S.group("pt.params");
    var presetSel = S.select({ labelKey: "pt.preset", value: "Mars",
      options: Object.keys(PRESETS).map(function (n) { return { v: n, label: n }; }),
      on: function (v) { var p = PRESETS[v]; epiCtl.set(p[0]); eccCtl.set(p[1]); ratioCtl.set(p[2]); apoCtl.set(p[3]);
        superior = p[4]; typeSel.set(superior ? "sup" : "inf"); resetPath(); } });
    var epiCtl = S.slider({ labelKey: "pt.epi", min: 0.05, max: 0.9, step: 0.001, value: epi,
      format: function (v) { return v.toFixed(2); }, on: function (v) { epi = v; resetPath(); } });
    var eccCtl = S.slider({ labelKey: "pt.ecc", min: 0, max: 0.2, step: 0.005, value: ecc,
      format: function (v) { return v.toFixed(2); }, on: function (v) { ecc = v; resetPath(); } });
    var ratioCtl = S.slider({ labelKey: "pt.ratio", min: 0.02, max: 5, step: 0.001, value: ratio,
      format: function (v) { return v.toFixed(3); }, on: function (v) { ratio = v; resetPath(); } });
    var apoCtl = S.slider({ labelKey: "pt.apogee", min: 0, max: 360, step: 0.1, value: apogee,
      format: function (v) { return v.toFixed(1) + "°"; }, on: function (v) { apogee = v; resetPath(); } });
    var typeSel = S.select({ labelKey: "pt.type", value: "sup",
      options: [{ v: "sup", labelKey: "pt.sup" }, { v: "inf", labelKey: "pt.inf" }],
      on: function (v) { superior = (v === "sup"); resetPath(); } });

    S.group("pt.mem");
    S.button({ labelKey: "pt.store", on: function () { memory = { epi: epi, ecc: ecc, ratio: ratio, apogee: apogee, superior: superior }; } });
    S.button({ labelKey: "pt.recall", on: function () {
      if (!memory) return; epiCtl.set(memory.epi); eccCtl.set(memory.ecc); ratioCtl.set(memory.ratio);
      apoCtl.set(memory.apogee); superior = memory.superior; typeSel.set(superior ? "sup" : "inf"); resetPath(); } });

    /* ---- Controls & Settings ---- */
    S.group("pt.ctrl");
    var loop = S.loop(function (dt) { t += rate * dt; pushPath(); upd(); });
    var playBtn = S.button({ labelKey: "pt.start", primary: true, on: function () { loop.toggle(); syncPlay(); } });
    function syncPlay() { var k = loop.playing ? "pt.pause" : "pt.start"; playBtn.setAttribute("data-i18n", k); playBtn.textContent = I18N.t(k); }
    S.refreshers.push(syncPlay);
    S.slider({ labelKey: "pt.rate", min: 0.02, max: 0.8, step: 0.01, value: rate,
      format: function (v) { return v.toFixed(2) + " yr/s"; }, on: function (v) { rate = v; } });

    S.group("pt.show");
    var optPlanet = S.toggle({ labelKey: "pt.showPlanet", value: true });
    var optEpi = S.toggle({ labelKey: "pt.showEpi", value: true });
    var optES = S.toggle({ labelKey: "pt.esLine", value: true });
    var optEP = S.toggle({ labelKey: "pt.epLine", value: true });
    var optPVec = S.toggle({ labelKey: "pt.pVec", value: false });
    var optQVec = S.toggle({ labelKey: "pt.qVec", value: false });
    S.slider({ labelKey: "pt.pathDur", min: 0, max: 12, step: 0.5, value: pathDur,
      format: function (v) { return v.toFixed(1) + " yr"; }, on: function (v) { pathDur = v; trimPath(); } });

    var oLon = S.readout({ labelKey: "pt.lon" });
    var oElong = S.readout({ labelKey: "pt.elong" });

    /* ===================== the Ptolemaic model ===================== */
    function equantPoint(Q, O, alpha) {       // M on deferent (centre O, radius 1) seen at uniform angle alpha from Q
      var dx = Math.cos(alpha), dy = Math.sin(alpha);
      var wx = Q.x - O.x, wy = Q.y - O.y, b = wx * dx + wy * dy;
      var disc = Math.max(0, b * b - (wx * wx + wy * wy - 1));
      var s = -b + Math.sqrt(disc);
      return { x: Q.x + s * dx, y: Q.y + s * dy };
    }
    function model(tt) {
      var A = apogee * D2R, u = { x: Math.cos(A), y: Math.sin(A) };
      var O = { x: ecc * u.x, y: ecc * u.y }, Q = { x: 2 * ecc * u.x, y: 2 * ecc * u.y };
      var sunAngle = TAU * tt + A;
      var M, planet, sun, epiAngle;
      if (superior) {
        M = equantPoint(Q, O, A + TAU * ratio * tt);
        epiAngle = sunAngle;
        planet = { x: M.x + epi * Math.cos(sunAngle), y: M.y + epi * Math.sin(sunAngle) };
        sun = { x: epi * Math.cos(sunAngle), y: epi * Math.sin(sunAngle) };
      } else {
        M = equantPoint(Q, O, sunAngle);
        epiAngle = A + TAU * ratio * tt;
        planet = { x: M.x + epi * Math.cos(epiAngle), y: M.y + epi * Math.sin(epiAngle) };
        sun = { x: M.x, y: M.y };
      }
      return { O: O, Q: Q, M: M, planet: planet, sun: sun, epiAngle: epiAngle, sunAngle: sunAngle };
    }

    var path = [];
    function pushPath() { var m = model(t); path.push({ t: t, x: m.planet.x, y: m.planet.y }); trimPath(); }
    function trimPath() { while (path.length && t - path[0].t > pathDur) path.shift(); }
    function resetPath() { path = []; upd(); }

    function upd() {
      var m = model(t);
      var lon = ((Math.atan2(m.planet.y, m.planet.x) * R2D) % 360 + 360) % 360;
      var slon = ((Math.atan2(m.sun.y, m.sun.x) * R2D) % 360 + 360) % 360;
      var el = Math.abs(((lon - slon) + 540) % 360 - 180);
      oLon(lon.toFixed(1) + "° — " + signName(lon));
      oElong(el.toFixed(1) + "°");
      S.requestDraw();
    }

    /* ===================== drawing ===================== */
    var SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    var SIGN3 = ["Ari", "Tau", "Gem", "Cnc", "Leo", "Vir", "Lib", "Sco", "Sgr", "Cap", "Aqr", "Psc"];
    function signName(lon) { return SIGNS[Math.floor(lon / 30) % 12]; }

    var ORB = { x: 12, y: 28, w: 736, h: 470 };
    var ZS = { x: 12, y: 512, w: 736, h: 92 };
    var cx = ORB.x + ORB.w / 2, cy = ORB.y + ORB.h / 2;
    var Rz = Math.min(ORB.w, ORB.h) / 2 - 16;       // zodiac ring radius

    // fill ~80% of the ring radius so the deferent + epicycle path never reach the clip circle (Rz−19)
    function scale() { return Rz * 0.8 / (1 + ecc + epi); }
    function toPx(p) { var s = scale(); return { x: cx + p.x * s, y: cy - p.y * s }; }

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      drawOrbit(ctx);
      drawStrip(ctx);
    });

    function drawOrbit(ctx) {
      panel(ctx, ORB);
      var m = model(t), s = scale();

      // zodiac ring
      ctx.strokeStyle = C.zod; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, Rz, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, Rz - 18, 0, TAU); ctx.stroke();
      for (var k = 0; k < 12; k++) {
        var a = k * 30 * D2R;                       // longitude 0 = +x (right), CCW
        var x0 = cx + Math.cos(a) * (Rz - 18), y0 = cy - Math.sin(a) * (Rz - 18);
        var x1 = cx + Math.cos(a) * Rz, y1 = cy - Math.sin(a) * Rz;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        var am = (k + 0.5) * 30 * D2R;
        var lx = cx + Math.cos(am) * (Rz - 9), ly = cy - Math.sin(am) * (Rz - 9);
        ctx.fillStyle = C.dim; ctx.font = "9px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(SIGN3[k], lx, ly);
      }
      ctx.textBaseline = "alphabetic";

      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, Rz - 19, 0, TAU); ctx.clip();

      var O = toPx(m.O), Q = toPx(m.Q), M = toPx(m.M), planet = toPx(m.planet), sun = toPx(m.sun);

      // deferent
      ctx.strokeStyle = C.defer; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(O.x, O.y, 1 * s, 0, TAU); ctx.stroke();

      // path trace
      if (path.length > 1) {
        ctx.strokeStyle = C.path; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.9;
        ctx.beginPath(); path.forEach(function (p, i) { var q = toPx(p); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // epicycle
      if (optEpi.value()) {
        ctx.strokeStyle = C.epi; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(M.x, M.y, epi * s, 0, TAU); ctx.stroke();
      }

      // construction lines
      if (optES.value()) line(ctx, toPx({ x: 0, y: 0 }), sun, "rgba(255,209,102,0.7)", 1.4);
      if (optEP.value()) line(ctx, M, planet, "rgba(182,146,255,0.9)", 1.4);
      if (optQVec.value()) { dot(ctx, Q.x, Q.y, C.equant, 3); line(ctx, Q, M, "rgba(255,139,107,0.8)", 1.2); }
      if (optPVec.value()) line(ctx, toPx({ x: 0, y: 0 }), planet, "rgba(95,224,200,0.8)", 1.2);

      // deferent centre + equant marks
      dot(ctx, O.x, O.y, C.defer, 2.5);
      // line earth -> M (radius)
      line(ctx, toPx({ x: 0, y: 0 }), M, "rgba(120,140,200,0.4)", 1);
      dot(ctx, M.x, M.y, C.epi, 3);

      ctx.restore();

      // Earth at centre
      var ec = toPx({ x: 0, y: 0 });
      ctx.fillStyle = C.earth; ctx.beginPath(); ctx.arc(ec.x, ec.y, 6, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#dce6ff"; ctx.lineWidth = 1; ctx.stroke();

      // Sun
      var sg = ctx.createRadialGradient(sun.x, sun.y, 1, sun.x, sun.y, 12);
      sg.addColorStop(0, "#fff6cf"); sg.addColorStop(1, C.sun);
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sun.x, sun.y, 7, 0, TAU); ctx.fill();

      // planet
      if (optPlanet.value()) {
        ctx.fillStyle = C.planet; ctx.beginPath(); ctx.arc(planet.x, planet.y, 5, 0, TAU); ctx.fill();
        ctx.strokeStyle = "#0b1020"; ctx.lineWidth = 1; ctx.stroke();
        // sight line from Earth to planet, projected to the zodiac ring
        var ang = Math.atan2(m.planet.y, m.planet.x);
        var rx = cx + Math.cos(ang) * Rz, ry = cy - Math.sin(ang) * Rz;
        ctx.strokeStyle = "rgba(95,224,200,0.35)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(ec.x, ec.y); ctx.lineTo(rx, ry); ctx.stroke(); ctx.setLineDash([]);
      }

      // title + key
      ctx.fillStyle = C.dim; ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText("Orbit View", ORB.x + 12, ORB.y + 8);
      key(ctx, ORB.x + 12, ORB.y + ORB.h - 22);
    }

    function key(ctx, x, y) {
      var items = [[C.earth, "Earth"], [C.sun, "Sun"], [C.planet, "planet"], [C.epi, "epicycle ctr"]];
      ctx.font = "10px system-ui"; ctx.textBaseline = "middle";
      items.forEach(function (it) {
        ctx.fillStyle = it[0]; ctx.beginPath(); ctx.arc(x + 4, y, 4, 0, TAU); ctx.fill();
        ctx.fillStyle = C.dim; ctx.textAlign = "left"; ctx.fillText(it[1], x + 12, y);
        x += 24 + ctx.measureText(it[1]).width;
      });
      ctx.textBaseline = "alphabetic";
    }

    function drawStrip(ctx) {
      panel(ctx, ZS);
      var m = model(t);
      var lon = ((Math.atan2(m.planet.y, m.planet.x) * R2D) % 360 + 360) % 360;
      var slon = ((Math.atan2(m.sun.y, m.sun.x) * R2D) % 360 + 360) % 360;
      var x0 = ZS.x + 12, w = ZS.w - 24, midY = ZS.y + 50;
      // 12 sign cells
      for (var k = 0; k < 12; k++) {
        var xa = x0 + w * k / 12, xb = x0 + w * (k + 1) / 12;
        ctx.fillStyle = k % 2 ? "#0c1326" : "#0a1020";
        ctx.fillRect(xa, midY - 16, xb - xa, 32);
        ctx.strokeStyle = C.zod; ctx.lineWidth = 1; ctx.strokeRect(xa, midY - 16, xb - xa, 32);
        ctx.fillStyle = C.dim; ctx.font = "9px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(SIGN3[k], (xa + xb) / 2, midY);
      }
      ctx.textBaseline = "alphabetic";
      // Sun marker
      var sx = x0 + w * (slon / 360);
      marker(ctx, sx, midY, C.sun, "△");
      // planet marker
      var px = x0 + w * (lon / 360);
      marker(ctx, px, midY, C.planet, "▼");

      ctx.fillStyle = C.dim; ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(I18N.t("pt.zod") + " — " + I18N.t("pt.lon") + " " + lon.toFixed(1) + "°", ZS.x + 12, ZS.y + 8);
      ctx.textBaseline = "alphabetic";
    }
    function marker(ctx, x, midY, col, glyph) {
      ctx.fillStyle = col; ctx.font = "12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(glyph, x, midY - 24);
      ctx.beginPath(); ctx.moveTo(x, midY - 16); ctx.lineTo(x, midY + 16); ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.textBaseline = "alphabetic";
    }

    function line(ctx, p0, p1, col, w) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); }
    function dot(ctx, x, y, col, r) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    function panel(ctx, A) { roundRectPath(ctx, A.x, A.y, A.w, A.h, 10); ctx.fillStyle = C.panel; ctx.fill();
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.stroke(); }
    function roundRectPath(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    upd();
  }
});
