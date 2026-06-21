/* Planetary Orbit Simulator ---------------------------------------------------
   Faithful rebuild of the NAAP "Planetary Orbit Simulator" (kepler.swf):
     • an orbit view with the Sun at one focus and a planet moving by Kepler's
       equation (fast at perihelion, slow at aphelion), with a scale bar,
     • Orbit Settings — planet presets, semimajor axis, eccentricity,
     • Animation Controls — start/pause, animation rate (yrs/s),
     • the three Kepler's-law panels:
         1st — foci / centre / axes / radial lines and r₁ + r₂ = 2a,
         2nd — equal-area sweeps in equal times,
         3rd — P² = a³,
     • visualization options (grid, solar-system orbits).                         */
Sim.create({
  id: "kepler",
  width: 760, height: 560,
  strings: {
    en: {
      "k.orbit": "Orbit Settings", "k.preset": "set parameters for", "k.a": "semimajor axis", "k.e": "eccentricity",
      "k.anim": "Animation Controls", "k.start": "start animation", "k.pause": "pause animation", "k.rate": "animation rate",
      "k.law": "Kepler's law", "k.law1": "1st law — the ellipse", "k.law2": "2nd law — equal areas", "k.law3": "3rd law — P² = a³",
      "k.show": "Show", "k.focus": "show empty focus", "k.center": "show center",
      "k.smaj": "show semimajor axis", "k.smin": "show semiminor axis", "k.radial": "show radial lines", "k.grid": "show grid",
      "k.ssorbits": "show solar-system orbits",
      "k.sweepGrp": "2nd law — sweeps", "k.sweepOn": "sweep continuously", "k.sweepSize": "sweep size (of period)", "k.clear": "clear sweeps",
      "k.period": "period", "k.r1": "r₁ (to Sun)", "k.r2": "r₂ (empty focus)",
      "k.none": "— none —"
    },
    id: {
      "k.orbit": "Pengaturan Orbit", "k.preset": "atur parameter untuk", "k.a": "sumbu semimayor", "k.e": "eksentrisitas",
      "k.anim": "Kontrol Animasi", "k.start": "mulai animasi", "k.pause": "jeda animasi", "k.rate": "kecepatan animasi",
      "k.law": "hukum Kepler", "k.law1": "hukum 1 — elips", "k.law2": "hukum 2 — luas sama", "k.law3": "hukum 3 — P² = a³",
      "k.show": "Tampilkan", "k.focus": "tampilkan fokus kosong", "k.center": "tampilkan pusat",
      "k.smaj": "tampilkan sumbu semimayor", "k.smin": "tampilkan sumbu semiminor", "k.radial": "tampilkan garis radial", "k.grid": "tampilkan kisi",
      "k.ssorbits": "tampilkan orbit tata surya",
      "k.sweepGrp": "hukum 2 — sapuan", "k.sweepOn": "sapu terus-menerus", "k.sweepSize": "ukuran sapuan (dari periode)", "k.clear": "hapus sapuan",
      "k.period": "periode", "k.r1": "r₁ (ke Matahari)", "k.r2": "r₂ (fokus kosong)",
      "k.none": "— tidak ada —"
    }
  },
  about: {
    en: "<p>A planet orbits the Sun on an <strong>ellipse</strong> with the Sun at one focus (Kepler's 1st law). Set the orbit's size and shape, then press play.</p>" +
        "<p><strong>1st law:</strong> turn on the foci, centre and axes — the two focal distances always satisfy r₁ + r₂ = 2a. " +
        "<strong>2nd law:</strong> the planet sweeps out equal areas in equal times, so it races through perihelion and dawdles at aphelion. " +
        "<strong>3rd law:</strong> the period and size obey P² = a³ (years and AU).</p>" +
        "<p>Use the planet presets to drop in real solar-system orbits, and overlay the solar-system orbits for scale.</p>",
    id: "<p>Planet mengorbit Matahari pada <strong>elips</strong> dengan Matahari di salah satu fokus (hukum 1 Kepler). Atur ukuran dan bentuk orbit, lalu putar.</p>" +
        "<p><strong>Hukum 1:</strong> nyalakan fokus, pusat, dan sumbu — kedua jarak fokus selalu memenuhi r₁ + r₂ = 2a. " +
        "<strong>Hukum 2:</strong> planet menyapu luas yang sama dalam waktu yang sama, jadi melaju di perihelion dan melambat di aphelion. " +
        "<strong>Hukum 3:</strong> periode dan ukuran mematuhi P² = a³ (tahun dan AU).</p>" +
        "<p>Gunakan preset planet untuk memuat orbit nyata, dan tampilkan orbit tata surya sebagai pembanding.</p>"
  },
  build: function (S) {
    var PLANETS = { Mercury: [0.387, 0.206], Venus: [0.723, 0.007], Earth: [1.0, 0.017], Mars: [1.524, 0.093], Jupiter: [5.203, 0.048] };
    var SS = [["Mercury", 0.387], ["Venus", 0.723], ["Earth", 1.0], ["Mars", 1.524], ["Jupiter", 5.203]];
    var a = 1.0, e = 0.4, t = 0, rate = 0.2, law = "1", sweepFrac = 0.125, sweeps = [], swStartE = 0, swStartT = 0;

    function wrap(v, m) { return ((v % m) + m) % m; }
    function period() { return Math.pow(a, 1.5); }                 // years
    function solveE(M) { var E = M; for (var i = 0; i < 7; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); return E; }
    function curE() { return solveE(2 * Math.PI * wrap(t / period(), 1)); }
    function bAxis() { return a * Math.sqrt(1 - e * e); }

    /* ---- controls ---- */
    S.group("k.orbit");
    var planetSel = S.select({ labelKey: "k.preset", value: "",
      options: [{ v: "", labelKey: "k.none" }].concat(Object.keys(PLANETS).map(function (n) { return { v: n, label: n }; })),
      on: function (v) { if (PLANETS[v]) { aCtl.set(PLANETS[v][0]); eCtl.set(PLANETS[v][1]); } } });
    var aCtl = S.slider({ labelKey: "k.a", min: 0.2, max: 5, step: 0.01, value: a, unit: " AU",
      format: function (v) { return v.toFixed(2) + " AU"; }, on: function (v) { a = v; sweeps = []; upd(); } });
    var eCtl = S.slider({ labelKey: "k.e", min: 0, max: 0.7, step: 0.005, value: e,
      format: function (v) { return v.toFixed(3); }, on: function (v) { e = v; sweeps = []; upd(); } });

    S.group("k.anim");
    var loop = S.loop(function (dt) {
      t += rate * dt;
      if (sweepOn.value()) {
        var P = period(), dT = sweepFrac * P;
        if (sweeps.length < Math.round(1 / sweepFrac) && (t - swStartT) >= dT) { sweeps.push({ E0: swStartE, E1: curE() }); swStartT = t; swStartE = curE(); }
      }
      upd();
    });
    var playBtn = S.button({ labelKey: "k.start", primary: true, on: function () { loop.toggle(); syncPlay(); } });
    function syncPlay() { var k = loop.playing ? "k.pause" : "k.start"; playBtn.setAttribute("data-i18n", k); playBtn.textContent = I18N.t(k); }
    S.refreshers.push(syncPlay);
    S.slider({ labelKey: "k.rate", min: 0.02, max: 2, step: 0.02, value: rate,
      format: function (v) { return v.toFixed(2) + " yr/s"; }, on: function (v) { rate = v; } });

    S.group("k.law");
    S.select({ labelKey: "k.law", value: law,
      options: [{ v: "1", labelKey: "k.law1" }, { v: "2", labelKey: "k.law2" }, { v: "3", labelKey: "k.law3" }],
      on: function (v) { law = v; S.requestDraw(); } });

    S.group("k.show");
    var optFocus = S.toggle({ labelKey: "k.focus", value: false });
    var optCenter = S.toggle({ labelKey: "k.center", value: false });
    var optSmaj = S.toggle({ labelKey: "k.smaj", value: false });
    var optSmin = S.toggle({ labelKey: "k.smin", value: false });
    var optRadial = S.toggle({ labelKey: "k.radial", value: true });
    var optGrid = S.toggle({ labelKey: "k.grid", value: false });
    var optSS = S.toggle({ labelKey: "k.ssorbits", value: false });

    S.group("k.sweepGrp");
    var sweepOn = S.toggle({ labelKey: "k.sweepOn", value: false, on: function (b) { if (b) { swStartT = t; swStartE = curE(); } } });
    S.slider({ labelKey: "k.sweepSize", min: 0.0625, max: 0.5, step: 0.0625, value: sweepFrac,
      format: function (v) { return "1/" + Math.round(1 / v); }, on: function (v) { sweepFrac = v; sweeps = []; } });
    S.button({ labelKey: "k.clear", on: function () { sweeps = []; swStartT = t; swStartE = curE(); S.requestDraw(); } });

    var oP = S.readout({ labelKey: "k.period" });
    var oR1 = S.readout({ labelKey: "k.r1" });
    var oR2 = S.readout({ labelKey: "k.r2" });

    function radii() { var E = curE(), r1 = a * (1 - e * Math.cos(E)); return { r1: r1, r2: 2 * a - r1 }; }
    function upd() {
      oP(period().toFixed(2) + " yr");
      var r = radii(); oR1(r.r1.toFixed(2) + " AU"); oR2(r.r2.toFixed(2) + " AU");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ===================================================================== */
    var AREA = { x: 12, y: 28, w: 540, h: 466 };
    var ACx = AREA.x + AREA.w / 2, ACy = AREA.y + AREA.h / 2;

    function scalePxPerAU() {
      var aMax = optSS.value() ? Math.max(a, 5.203) : a;
      var b = aMax * Math.sqrt(1 - 0);  // use circle bound for SS overlay
      return Math.min((AREA.w * 0.46) / aMax, (AREA.h * 0.46) / aMax);
    }

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      var sc = scalePxPerAU();
      var b = bAxis(), c = a * e;
      // ellipse centre is centred in the view; Sun is at focus (+c, 0)
      function pt(xAU, yAU) { return { x: ACx + xAU * sc, y: ACy - yAU * sc }; }
      var sun = pt(c, 0);

      // frame
      roundRect(ctx, AREA.x, AREA.y, AREA.w, AREA.h, 10); ctx.fillStyle = "#05070f"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      ctx.save(); roundRect(ctx, AREA.x, AREA.y, AREA.w, AREA.h, 10); ctx.clip();

      if (optGrid.value()) {
        ctx.strokeStyle = "#13203f"; ctx.lineWidth = 1;
        for (var g = -5; g <= 5; g++) { var gx = pt(g, 0).x, gy = pt(0, g).y;
          ctx.beginPath(); ctx.moveTo(gx, AREA.y); ctx.lineTo(gx, AREA.y + AREA.h); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(AREA.x, gy); ctx.lineTo(AREA.x + AREA.w, gy); ctx.stroke(); }
      }

      // solar-system orbits overlay
      if (optSS.value()) {
        SS.forEach(function (p) { ctx.strokeStyle = "rgba(120,140,200,0.30)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(ACx, ACy, p[1] * sc, p[1] * sc, 0, 0, 2 * Math.PI); ctx.stroke(); });
      }

      var E = curE();
      var planet = pt(a * Math.cos(E), b * Math.sin(E));

      // 2nd-law sweeps
      if (law === "2" || sweeps.length) {
        sweeps.concat(sweepOn.value() ? [{ E0: swStartE, E1: E, live: true }] : []).forEach(function (sw, i) {
          fillSweep(ctx, sun, sw.E0, sw.E1, i % 2 ? "rgba(182,146,255,0.30)" : "rgba(110,168,254,0.30)", pt);
        });
      }

      // the ellipse
      ctx.strokeStyle = "#cdd7f5"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.ellipse(ACx, ACy, a * sc, b * sc, 0, 0, 2 * Math.PI); ctx.stroke();

      // 1st-law helpers
      if (optCenter.value()) { dot(ctx, ACx, ACy, "#9fabce"); }
      if (optFocus.value()) { var ef = pt(-c, 0); dot(ctx, ef.x, ef.y, "#b692ff"); }
      if (optSmaj.value()) { line(ctx, pt(-a, 0), pt(a, 0), "#6ea8fe"); }
      if (optSmin.value()) { line(ctx, pt(0, -b), pt(0, b), "#4cd4a0"); }
      if (optRadial.value()) {
        line(ctx, sun, planet, "rgba(255,209,102,0.8)");
        if (optFocus.value()) line(ctx, pt(-c, 0), planet, "rgba(182,146,255,0.7)");
      }

      // Sun + planet
      var sg = ctx.createRadialGradient(sun.x, sun.y, 1, sun.x, sun.y, 12);
      sg.addColorStop(0, "#fff6cf"); sg.addColorStop(1, "#ffd166");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sun.x, sun.y, 8, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#9ec5ff"; ctx.beginPath(); ctx.arc(planet.x, planet.y, 5, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "#dce6ff"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();

      // scale bar
      drawScaleBar(ctx, sc);
      // law info band
      drawBand(ctx);
    });
    upd();

    function fillSweep(ctx, sun, E0, E1, col, pt) {
      var b = bAxis(); ctx.beginPath(); ctx.moveTo(sun.x, sun.y);
      var n = 24; for (var i = 0; i <= n; i++) { var E = E0 + (E1 - E0) * i / n; var p = pt(a * Math.cos(E), b * Math.sin(E)); ctx.lineTo(p.x, p.y); }
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    }

    function drawScaleBar(ctx, sc) {
      var nice = [0.1, 0.2, 0.5, 1, 2, 5], target = 90 / sc, val = nice[0];
      for (var i = 0; i < nice.length; i++) if (nice[i] <= target) val = nice[i];
      var px = val * sc, x = AREA.x + AREA.w - px - 16, y = AREA.y + 16;
      ctx.strokeStyle = "#e8ecf8"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + px, y); ctx.stroke();
      ctx.fillStyle = "#e8ecf8"; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.fillText(val + " AU", x + px / 2, y - 5);
    }

    function drawBand(ctx) {
      var y = AREA.y + AREA.h + 12, cx = AREA.x + AREA.w / 2;
      ctx.textAlign = "center"; ctx.fillStyle = "#e8ecf8"; ctx.font = "14px system-ui";
      if (law === "1") {
        var r = radii();
        ctx.fillText("r₁ + r₂ = 2a", cx, y + 16);
        ctx.fillStyle = "#ffd166"; ctx.font = "13px var(--mono, monospace)";
        ctx.fillText(r.r1.toFixed(2) + " + " + r.r2.toFixed(2) + " = " + (2 * a).toFixed(2) + " AU", cx, y + 38);
      } else if (law === "2") {
        ctx.fillText("equal areas are swept in equal times", cx, y + 16);
        ctx.fillStyle = "#9fabce"; ctx.font = "12px system-ui";
        ctx.fillText("turn on “sweep continuously” — each shaded sector spans 1/" + Math.round(1 / sweepFrac) + " of the period", cx, y + 36);
      } else {
        var P = period();
        ctx.fillText("P² = a³", cx, y + 16);
        ctx.fillStyle = "#ffd166"; ctx.font = "13px var(--mono, monospace)";
        ctx.fillText("P² = " + (P * P).toFixed(2) + " yr²   a³ = " + Math.pow(a, 3).toFixed(2) + " AU³", cx, y + 38);
      }
    }

    function dot(ctx, x, y, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 2 * Math.PI); ctx.fill(); }
    function line(ctx, p0, p1, col) { ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke(); }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});
