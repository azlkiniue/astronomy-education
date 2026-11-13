/* Planetary Orbit Simulator ---------------------------------------------------
   Rebuild of the NAAP "Planetary Orbit Simulator" (kepler.swf, decompiled): the
   canvas is the SWF's stage below its title bar — the orbit window and the
   tabbed panel under it, drawn where the SWF draws them; the Orbit Settings,
   Animation Controls and Visualization Options panels (controls only) are the
   sidebar, as are each tab's check boxes, buttons and sliders.
     • KeplerianSystemClass: the window is 600 × 460 with a 30 px margin, the Sun
       230 px from its left edge; an orbit of semimajor axis a is drawn at
       200 / a px per AU (zooming there over 750 ms on a cubic ease of log
       scale); the planet's position comes from the mean anomaly by the SWF's
       fixed-point Kepler iteration (E = M + e sin E to 0.001), perihelion on
       the left, the planet moving down from it; P = √(a³/M) years.
     • the orbit (12 quadratic segments, #c0c0c0), grid, solar-system orbits
       (orange, labelled at 140°), empty focus / centre / curly braces / radial
       lines r₁ r₂, velocity and acceleration arrows and dashed lines, scale bar.
     • Kepler's 2nd Law: sweeps of 1/n of the period drawn from the Sun and
       clipped to the ellipse, up to 45, colours cycling; finished sweeps can be
       dragged around the orbit and snap to each other's edges; sweeping
       continuously lays n sweeps around the orbit.
     • Kepler's 3rd Law: P² = a³ with the values (the SWF's ² really does sit
       in front of the period — kept) and the period–semimajor-axis plot,
       linear (rescaling so the planet sits at 70 %) or logarithmic.
     • Newtonian Features: speed v = √(1774.53 M (1/r − 1/2a)) km/s and
       acceleration 0.005931 M / r² m/s² against orbital phase, the angle
       between the vectors.
   Drag the planet around its orbit, drag finished sweeps, click the tabs.      */
Sim.create({
  id: "kepler",
  width: 614, height: 680,
  strings: {
    en: {
      "k.tab1": "Kepler's 1st Law", "k.tab2": "Kepler's 2nd Law", "k.tab3": "Kepler's 3rd Law", "k.tabN": "Newtonian Features",
      "k.orbit": "Orbit Settings", "k.preset": "set parameters for", "k.ok": "OK", "k.a": "semimajor axis (AU)", "k.e": "eccentricity",
      "k.anim": "Animation Controls", "k.start": "start animation", "k.pause": "pause animation", "k.rate": "animation rate (yrs/s)",
      "k.vis": "Visualization Options", "k.ssOrbits": "show solar system orbits", "k.ssPlanets": "show solar system planets",
      "k.ssLabels": "label the solar system orbits", "k.grid": "show grid", "k.clear": "clear optional features", "k.reset": "reset",
      "k.focus": "show empty focus", "k.center": "show center", "k.smin": "show semiminor axis", "k.smaj": "show semimajor axis", "k.radial": "show radial lines",
      "k.sweepStart": "start sweeping", "k.sweepStop": "stop sweeping", "k.erase": "erase sweeps", "k.size": "adjust size",
      "k.cont": "sweep continuously", "k.sound": "use sound effect",
      "k.plotType": "plot type", "k.linear": "linear", "k.log": "logarithmic",
      "k.vVec": "velocity — vector", "k.vLine": "velocity — line", "k.aVec": "acceleration — vector", "k.aLine": "acceleration — line",
      "k.cEmpty": "empty", "k.cFocus": "focus", "k.cCenter": "center", "k.braceMaj": "semimajor axis", "k.braceMin": "semiminor axis",
      "k.frac": "a fractional sweep size of", "k.dur": "corresponds to sweep duration of", "k.area": "and a sweep area of", "k.or": "(or",
      "k.years": "years", "k.sqAU": "sq AU", "k.plotA": "semimajor axis (AU)", "k.plotP": "period (yr)",
      "k.vel": "Velocity (km/s)", "k.acc": "Acceleration (m/s", "k.angle": "angle between vectors:"
    },
    id: {
      "k.tab1": "Hukum 1 Kepler", "k.tab2": "Hukum 2 Kepler", "k.tab3": "Hukum 3 Kepler", "k.tabN": "Fitur Newton",
      "k.orbit": "Pengaturan Orbit", "k.preset": "atur parameter untuk", "k.ok": "OK", "k.a": "sumbu semimayor (AU)", "k.e": "eksentrisitas",
      "k.anim": "Kontrol Animasi", "k.start": "mulai animasi", "k.pause": "jeda animasi", "k.rate": "kecepatan animasi (thn/dtk)",
      "k.vis": "Opsi Visualisasi", "k.ssOrbits": "tampilkan orbit tata surya", "k.ssPlanets": "tampilkan planet tata surya",
      "k.ssLabels": "beri label orbit tata surya", "k.grid": "tampilkan kisi", "k.clear": "hapus fitur opsional", "k.reset": "atur ulang",
      "k.focus": "tampilkan fokus kosong", "k.center": "tampilkan pusat", "k.smin": "tampilkan sumbu semiminor", "k.smaj": "tampilkan sumbu semimayor", "k.radial": "tampilkan garis radial",
      "k.sweepStart": "mulai menyapu", "k.sweepStop": "hentikan sapuan", "k.erase": "hapus sapuan", "k.size": "atur ukuran",
      "k.cont": "sapu terus-menerus", "k.sound": "pakai efek suara",
      "k.plotType": "jenis plot", "k.linear": "linear", "k.log": "logaritmik",
      "k.vVec": "kecepatan — vektor", "k.vLine": "kecepatan — garis", "k.aVec": "percepatan — vektor", "k.aLine": "percepatan — garis",
      "k.cEmpty": "fokus", "k.cFocus": "kosong", "k.cCenter": "pusat", "k.braceMaj": "sumbu semimayor", "k.braceMin": "sumbu semiminor",
      "k.frac": "ukuran sapuan pecahan", "k.dur": "setara durasi sapuan", "k.area": "dan luas sapuan", "k.or": "(atau",
      "k.years": "tahun", "k.sqAU": "AU²", "k.plotA": "sumbu semimayor (AU)", "k.plotP": "periode (thn)",
      "k.vel": "Kecepatan (km/s)", "k.acc": "Percepatan (m/s", "k.angle": "sudut antar vektor:"
    }
  },
  about: {
    en: "<p>A planet orbits the Sun on an <strong>ellipse</strong> with the Sun at one focus (Kepler's 1st law). Set the orbit's size and shape, or load a real planet's orbit, then start the animation — or drag the planet around its orbit.</p>" +
        "<p><strong>1st law:</strong> show the empty focus, centre, axes and radial lines — the two distances to the foci always add up to r₁ + r₂ = 2a. " +
        "<strong>2nd law:</strong> sweep out wedges of equal time; each covers the same area, so the planet races through perihelion and dawdles at aphelion. Drag finished sweeps around to compare them. " +
        "<strong>3rd law:</strong> the period and size obey P² = a³ (years and AU) — compare with the solar-system planets on the plot.</p>" +
        "<p><strong>Newtonian features:</strong> the Sun's gravity pulls the planet straight towards the Sun; the velocity is always along the orbit. Watch how the speed and the acceleration change around the orbit, and the angle between the two vectors.</p>",
    id: "<p>Planet mengorbit Matahari pada <strong>elips</strong> dengan Matahari di salah satu fokus (hukum 1 Kepler). Atur ukuran dan bentuk orbit, atau muat orbit planet sungguhan, lalu jalankan animasi — atau seret planet di sepanjang orbitnya.</p>" +
        "<p><strong>Hukum 1:</strong> tampilkan fokus kosong, pusat, sumbu, dan garis radial — kedua jarak ke fokus selalu berjumlah r₁ + r₂ = 2a. " +
        "<strong>Hukum 2:</strong> sapu irisan dengan selang waktu sama; luasnya selalu sama, jadi planet melaju di perihelion dan melambat di aphelion. Seret sapuan yang sudah jadi untuk membandingkannya. " +
        "<strong>Hukum 3:</strong> periode dan ukuran mematuhi P² = a³ (tahun dan AU) — bandingkan dengan planet-planet tata surya pada plot.</p>" +
        "<p><strong>Fitur Newton:</strong> gravitasi Matahari menarik planet lurus ke arah Matahari; kecepatan selalu searah orbit. Perhatikan perubahan laju dan percepatan sepanjang orbit, serta sudut antara kedua vektor.</p>"
  },
  build: function (S) {
    var FONT = "Verdana, Geneva, sans-serif", COURIER = "'Courier New', Courier, monospace";
    var ASC = 1.0059, CASC = 0.8325, OY = -30, TAU = 2 * Math.PI, DEG = 180 / Math.PI;
    function t(k) { return I18N.t(k); }
    function font(ctx, size, style, fam) { ctx.font = (style ? style + " " : "") + size + "px " + (fam || FONT); }
    function mod(v, m) { return ((v % m) + m) % m; }
    function flashString(v) { return String(parseFloat(v.toPrecision(15))); }
    function flashToFixed(x, f) {                  // the SWF's Number.prototype.toFixed
      var s = x < 0 ? "-" : "";
      x = Math.abs(x);
      var n = String(Math.round(x * Math.pow(10, f)));
      if (f > 0) { while (n.length < f + 1) n = "0" + n; n = n.slice(0, n.length - f) + "." + n.slice(n.length - f); }
      return s + n;
    }
    function sigDigits(x, d) {                     // Math.toSigDigits
      if (x === 0) return 0;
      var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10), f = Math.pow(10, d - (1 + e));
      return Math.round(f * x) / f;
    }
    function three(x) {                            // toThreeSigDigs
      if (!(x < 1000)) return flashString(sigDigits(x, 3));
      if (!(x < 100)) return String(Math.round(x));
      if (x === 0) return "0.00";
      return flashToFixed(x, 2 - Math.floor(Math.log(Math.abs(x)) / Math.LN10));
    }

    /* ---------------- the SWF's art ---------------- */
    var ART = {
      sun: {nz:false, layers:[[[[{t:"r",m:[0.0289,0,0,0.0289,0,0],s:[[0,"rgba(255,255,204,0.463)"],[1,"rgba(255,255,204,0)"]]},"M15.9 -15.9Q22.5 -9.3 22.5 0Q22.5 9.3 15.9 15.9Q9.3 22.5 0 22.5Q-9.3 22.5 -15.9 15.9Q-22.5 9.3 -22.5 0Q-22.5 -9.3 -15.9 -15.9Q-9.3 -22.5 0 -22.5Q9.3 -22.5 15.9 -15.9Z"]],[]],[[["#ffffcc","M5.55 -5.6Q7.9 -3.3 7.9 0Q7.9 3.3 5.55 5.55Q3.3 7.9 0 7.9Q-3.3 7.9 -5.6 5.55Q-7.9 3.3 -7.9 0Q-7.9 -3.3 -5.6 -5.6Q-3.3 -7.9 0 -7.9Q3.3 -7.9 5.55 -5.6Z"]],[]]]},
      planet: {nz:false, layers:[[[["#cccccc","M5 0Q5 2.05 3.55 3.5Q2.05 4.95 0 5Q-2.1 4.95 -3.55 3.5Q-5 2.05 -5 0Q-5 -2.1 -3.55 -3.55Q-2.1 -5.05 0 -5Q2.05 -5.05 3.55 -3.55Q5 -2.1 5 0Z"]],[]]]},
      ring: {nz:false, layers:[[[],[[2.0,"#ffffff","M5 0Q5 2.05 3.55 3.5Q2.05 4.95 0 5Q-2.1 4.95 -3.55 3.5Q-5 2.05 -5 0Q-5 -2.1 -3.55 -3.55Q-2.1 -5.05 0 -5Q2.05 -5.05 3.55 -3.55Q5 -2.1 5 0"]]]]},
      center: {nz:false, layers:[[[],[[1.0,"#fcf398","M0 10.05L0 18.05"],[2.0,"#fcf398","M3.55 3.55L0 0L-3.5 3.55M0 0L-3.5 -3.5M3.55 -3.55L0 0"]]]]},
      focus: {nz:false, layers:[[[],[[2.0,"#ffffff","M3.55 3.55L0 0L-3.5 3.55M0 0L-3.5 -3.5M3.55 -3.55L0 0"],[1.0,"#ffffff","M0 10.7L0 29.75"]]]]},
      braceEnd: new Path2D("M0 5.3L0 0Q8.85 0.15 12.35 2.35Q16.25 4.7 16.65 11.25L16.2 11.25Q16 8.45 10.85 6.85Q6.7 5.55 0 5.3Z"),
      braceMid: new Path2D("M13 5.3L13 10.6Q6.55 10.25 3.7 8.65Q1.8 7.55 0 4.9Q-1.7 7.55 -3.75 8.65Q-6.55 10.3 -13 10.6L-13 5.3Q-7.15 5.1 -4.7 4.35Q-1.45 3.35 -0.05 0L0.05 0Q1.45 3.35 4.7 4.35Q7.1 5.1 13 5.3Z"),
      arrowHead: new Path2D("M12.6 0L-7.35 7.5L-2.65 0.05L-7.4 -7.5L12.6 0Z"),
      ssPlanet: {nz:false, layers:[[[["#fd7d31","M2.15 -2.1Q3 -1.25 3 0Q3 1.25 2.15 2.15Q1.25 3 0 3Q-1.25 3 -2.1 2.15Q-3 1.25 -3 0Q-3 -1.25 -2.1 -2.1Q-1.25 -3 0 -3Q1.25 -3 2.15 -2.1Z"]],[]]]},
      plotDot: {nz:false, layers:[[[["#ff6600","M1.75 -1.8Q2.5 -1.05 2.5 0Q2.5 1.05 1.75 1.75Q1.05 2.5 0 2.5Q-1.05 2.5 -1.8 1.75Q-2.5 1.05 -2.5 0Q-2.5 -1.05 -1.8 -1.8Q-1.05 -2.5 0 -2.5Q1.05 -2.5 1.75 -1.8Z"]],[[1.0,"#000000","M1.75 -1.8Q2.5 -1.05 2.5 0Q2.5 1.05 1.75 1.75Q1.05 2.5 0 2.5Q-1.05 2.5 -1.8 1.75Q-2.5 1.05 -2.5 0Q-2.5 -1.05 -1.8 -1.8Q-1.05 -2.5 0 -2.5Q1.05 -2.5 1.75 -1.8"]]]]},
      userDot: {nz:false, layers:[[[["#cccccc","M4 0Q4 1.6 2.85 2.8Q1.65 3.95 0.05 4L0 4Q-1.65 3.95 -2.8 2.8Q-4 1.6 -4 0Q-4 -1.7 -2.8 -2.85Q-1.65 -4.05 0 -4L0.05 -4Q1.65 -4.05 2.85 -2.85Q4 -1.7 4 0Z"]],[[0.05,"#000000","M4 0Q4 1.6 2.85 2.8Q1.65 3.95 0.05 4L0 4Q-1.65 3.95 -2.8 2.8Q-4 1.6 -4 0Q-4 -1.7 -2.8 -2.85Q-1.65 -4.05 0 -4L0.05 -4Q1.65 -4.05 2.85 -2.85Q4 -1.7 4 0"]]]]},
      tabFill: new Path2D("M3.6 -18.65Q5.5 -20 7.95 -20L147 -20L151.05 -20L151.05 20L147 20L7.95 20L3.6 18.6L2.35 17.55L1.3 16.3L0 11.75L0 -11.8L1.3 -16.35L2.35 -17.6L3.6 -18.65Z"),
      tabLine: new Path2D("M1.3 -16.35L2.35 -17.6L3.6 -18.65Q5.5 -20 7.95 -20L147 -20M147 20L7.95 20L3.6 18.6L2.35 17.55L1.3 16.3L0 11.75L0 -11.8L1.3 -16.35")
    };

    /* ---------------- KeplerianSystemClass ---------------- */
    var WIN = { x: 7, y: 37, w: 600, h: 460 }, MARGIN = 30, MAXE = 0.7;
    var SCREEN_A = (WIN.w - 2 * MARGIN) / (2 + MAXE);          // 200 px
    var SAFE = 1.5 * (1 + MAXE) * SCREEN_A, SUPERSAFE = 2 * WIN.w;
    var SX = WIN.x + MARGIN + SCREEN_A, SY = WIN.y + WIN.h / 2;  // the Sun, (237, 267) on the stage
    var MASS = 1;
    var a = 1, e = 0.4, rate = 0.2, k1 = Math.sqrt(1.4 / 0.6), period = 1;
    var timeRate = rate / 1000, maRate = 0;                       // years per ms, radians per ms
    var time = 0, ma = 0, animating = false, timeLast = 0;
    var scale = null, ease = null, zoomEnd = 0, zooming = false;

    function calcPeriod() { period = Math.sqrt(Math.pow(a, 3) / MASS); maRate = TAU * timeRate / period; }
    function setRate(r) { rate = r; timeRate = 1 / (1000 * (1 / r)); maRate = TAU * timeRate / period; }
    function setE(v) { e = v; k1 = Math.sqrt((1 + e) / (1 - e)); }
    function solveE(m, ecc) {                      // the SWF's fixed-point iteration
      var e1 = m + ecc * Math.sin(m), e0, c = 0;
      do { e0 = e1; e1 = m + ecc * Math.sin(e0); c++; } while (Math.abs(e1 - e0) > 0.001 && c < 100);
      return e1;
    }
    function trueAnom(m) { return 2 * Math.atan(k1 * Math.tan(solveE(m, e) / 2)); }
    function maFromTA(ta) { var ea = 2 * Math.atan(Math.tan(ta / 2) / k1); return ea - e * Math.sin(ea); }
    function position() {                          // updatePosition: screen px relative to the Sun
      var ta = trueAnom(ma), r = a * scale * (1 - e * e) / (1 + e * Math.cos(ta));
      var p = { ta: ta, r: r, tx: -r * Math.cos(ta), ty: r * Math.sin(ta) };
      if (r > SUPERSAFE) { p.x = -SUPERSAFE * Math.cos(ta); p.y = SUPERSAFE * Math.sin(ta); } else { p.x = p.tx; p.y = p.ty; }
      return p;
    }
    // CubicEasingClass with two knots: the clamped cubic spline is a Hermite cubic, start slope
    // carried over from an interrupted zoom, end slope 0
    function easeInit(v) { ease = { x0: 0, y0: v, m0: 0, x1: 1, y1: v }; }
    function easeAt(x, deriv) {
      if (!(x < ease.x1)) return deriv ? 0 : ease.y1;
      var h = ease.x1 - ease.x0, s = (x - ease.x0) / h, s2 = s * s, s3 = s2 * s;
      if (deriv) return ((6 * s2 - 6 * s) * ease.y0 + (3 * s2 - 4 * s + 1) * h * ease.m0 + (6 * s - 6 * s2) * ease.y1) / h;
      return (2 * s3 - 3 * s2 + 1) * ease.y0 + (s3 - 2 * s2 + s) * h * ease.m0 + (3 * s2 - 2 * s3) * ease.y1;
    }
    function rescale(skipZoom) {                   // calculateScaleAndUpdate
      var target = (WIN.w - 2 * MARGIN) / (a * (2 + MAXE));
      if (skipZoom || scale == null) { zooming = false; scale = target; easeInit(Math.log(target)); }
      else if (target !== scale) {
        var now = performance.now(), y0 = easeAt(now), m0 = easeAt(now, true);
        ease = { x0: now, y0: y0, m0: m0, x1: now + 750, y1: Math.log(target) };
        zoomEnd = now + 750; zooming = true; zoomStep(now); kick();
      }
      S.requestDraw();
    }
    function zoomStep(now) {
      var x = Math.min(now, zoomEnd), s = Math.exp(easeAt(x));
      scale = s;
      if (!(x < zoomEnd)) { easeInit(Math.log(s)); zooming = false; }
    }

    /* the solar-system orbits (initializeLandmarkOrbits) */
    var SS = [["Mercury", 0.5, 0.387, 0.206], ["Venus", 3.5, 0.723, 0.007], ["Earth", 5, 1, 0.017], ["Mars", 2, 1.524, 0.093],
      ["Jupiter", 1, 5.203, 0.048], ["Saturn", 3.5, 9.54, 0.056], ["Uranus", 6, 19.18, 0.047], ["Neptune", 0, 30.06, 0.009], ["Pluto", 2.5, 39.44, 0.249]]
      .map(function (p) {
        var A = p[2], E = p[3], b = A * Math.sqrt(1 - E * E), o = E * A, n = 12, step = TAU / n, c = 1 / Math.cos(step / 2), pts = [];
        for (var j = 0, ca = step / 2, aa = step; j < n; j++, ca += step, aa += step)
          pts.push({ cx: o + A * c * Math.cos(ca), cy: b * c * Math.sin(ca), ax: o + A * Math.cos(aa), ay: b * Math.sin(aa) });
        var LTA = 2.443460952792061;
        return { name: p[0], ma: p[1], a: A, e: E, pts: pts, period: Math.sqrt(Math.pow(A, 3) / MASS),
          optimal: SCREEN_A * (1 - E * E) / (1 + E * Math.cos(LTA)) };
      });

    /* ---------------- sweeps (Kepler's 2nd law) ---------------- */
    var SWEEP_COLORS = ["#0099ff", "#ffdd00", "#ff0099", "#00ff99"], SNAP = 6, SWEEPS_LIMIT = 45;
    var sweeps, sweepCount, topDepth, active, activeTill, contCount = 0, sortNeeded = false;
    var sweepDur = TAU / 16, contLimit = 16, sweepCont = false, useSound = false;
    function removeAllSweeps() { sweeps = []; active = null; sweepCount = 1; topDepth = 1; onSweepingStopped(); }
    function addSweep(def) {
      def.color = SWEEP_COLORS[sweepCount % SWEEP_COLORS.length]; def.depth = topDepth++; def.alpha = 0.5;
      sweepCount++; sweeps.push(def);
      if (sweeps.length - SWEEPS_LIMIT > 0) {
        if (sortNeeded) { sweeps.sort(function (p, q) { return p.depth - q.depth; }); sortNeeded = false; }
        removeSweep(sweeps[0]);
      }
      return def;
    }
    function removeSweep(sw) { var i = sweeps.indexOf(sw); if (i >= 0) sweeps.splice(i, 1); }
    function startSweeping(m) {
      var def = { drag: false };
      if (m === undefined) { cancelSweeping(); contCount = 0; def.start = ma; def.dur = 0; }
      else { def.start = m; def.dur = mod(ma - m, TAU); }
      activeTill = def.start + sweepDur;
      active = addSweep(def);
    }
    function cancelSweeping() { if (active) { removeSweep(active); active = null; onSweepingStopped(); } }
    function setSweepDuration(d) {                 // setSweepDuration(d, asDenominator)
      sweepDur = TAU / d; contLimit = d;
      cancelSweeping();
      sweeps.forEach(function (s) { s.dur = sweepDur; });
    }
    function updateActiveSweep() {
      if (!active) return;
      if (ma > activeTill) {
        active.dur = sweepDur; active.drag = true;
        if (useSound) click();
        contCount++;
        if (sweepCont) {
          var n = Math.floor((ma - activeTill) / sweepDur), m = activeTill;
          for (var i = 0; i < n; i++) {
            if (!(contCount < contLimit)) break;
            addSweep({ drag: true, start: m, dur: sweepDur }); m += sweepDur; contCount++;
          }
          if (contCount < contLimit) startSweeping(m); else { active = null; onSweepingStopped(); }
        } else { active = null; onSweepingStopped(); }
      } else active.dur = mod(ma - active.start, TAU);
    }
    function sweepGeom(start, dur) {                // updateSweep
      var sta = trueAnom(start), eta = trueAnom(start + dur), k2 = a * scale * (1 - e * e);
      return { sta: mod(sta, TAU), eta: mod(eta, TAU), r0: k2 / (1 + e * Math.cos(sta)), r1: k2 / (1 + e * Math.cos(eta)),
        arc: mod(eta - sta, TAU) };
    }
    var audio = null;
    function click() {
      try {
        audio = audio || new (window.AudioContext || window.webkitAudioContext)();
        var o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime;
        o.type = "square"; o.frequency.value = 1800;
        g.gain.setValueAtTime(0.15, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.03);
        o.connect(g); g.connect(audio.destination); o.start(t0); o.stop(t0 + 0.04);
      } catch (err) {}
    }

    /* ---------------- options ---------------- */
    var opt = { grid: false, ssOrbits: false, ssPlanets: false, ssLabels: false,
      focus: false, center: false, radial: false, smaj: false, smin: false,
      vArrow: false, aArrow: false, vLine: false, aLine: false, plotType: "linear" };
    var tab = "k1", hover = null;

    /* ---------------- animation ---------------- */
    var loop = S.loop(function () {
      var now = performance.now();
      if (zooming) zoomStep(now);
      if (animating) {
        var dt = now - timeLast;
        time += timeRate * dt; ma += maRate * dt;
        updateActiveSweep();
        timeLast = now;
      }
      if (!animating && !zooming) loop.pause();
    });
    function kick() { if (!loop.playing) loop.play(); }
    function setAnimating(on) {
      animating = on;
      if (on) { timeLast = performance.now(); kick(); }
    }

    /* ---------------- drawing: the orbit window ---------------- */
    function dashed(ctx, x0, y0, x1, y1) {          // drawDashedLine(…, 3, 4)
      var dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy), n = Math.round((L - 3) / 7), f = 3 / 7;
      var mx = dx / (n + f), my = dy / (n + f);
      for (var i = 0; !(i > n); i++) { ctx.moveTo(x0 + i * mx, y0 + i * my); ctx.lineTo(x0 + i * mx + f * mx, y0 + i * my + f * my); }
    }
    function orbitPath(ctx, A, B, ox) {             // updateOrbit: 12 quadratic segments
      var n = 12, step = TAU / n, c = 1 / Math.cos(step / 2);
      ctx.moveTo(ox + A, 0);
      for (var i = 0, ca = step / 2, aa = step; i < n; i++, ca += step, aa += step)
        ctx.quadraticCurveTo(ox + A * c * Math.cos(ca), B * c * Math.sin(ca), ox + A * Math.cos(aa), B * Math.sin(aa));
    }
    function brace(ctx, w, color, label) {          // Curly Brace Component, tinted with setRGB
      var minimal = 16.65 + 16.65 * 0.996994 + 26, sx = 1, sy = 1, r3 = 13;
      ctx.save();
      if (w < minimal) { sx = w / minimal; sy = Math.sqrt(w / minimal); ctx.scale(sx, sy); }
      else r3 = 13 + (w - minimal) / 2;
      ctx.fillStyle = color;
      ctx.fill(ART.braceMid);
      if (r3 > 13) { ctx.fillRect(13, 5.3, r3 - 13, 5.3); ctx.fillRect(-r3, 5.3, r3 - 13, 5.3); }
      ctx.save(); ctx.translate(r3 + 0.05, 5.3); ctx.fill(ART.braceEnd); ctx.restore();
      ctx.save(); ctx.translate(-r3 - 0.2, 5.3); ctx.scale(-0.996994, 1.00444); ctx.fill(ART.braceEnd); ctx.restore();
      font(ctx, 11, "bold"); FlashText.fill(ctx, label, -153.4 + (66.9 + 239.9) / 2, -19 + ASC * 11, "center");
      ctx.restore();
    }
    function arrow(ctx, len, rotDeg, color) {
      ctx.save(); ctx.rotate(rotDeg / DEG); ctx.fillStyle = color;
      ctx.fillRect(0, -1, len, 2);
      ctx.translate(len, -0.05); ctx.scale(0.799988, 0.799988); ctx.fill(ART.arrowHead);
      ctx.restore();
    }
    function drawWindow(ctx) {
      ctx.save();
      ctx.beginPath(); ctx.rect(WIN.x, WIN.y, WIN.w, WIN.h); ctx.clip();
      ctx.fillStyle = "#000000"; ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
      ctx.translate(SX, SY);
      var s = scale, A = Math.min(a * s, SUPERSAFE), B = Math.sqrt(A * A * (1 - e * e)), p = position();
      // grid (updateGrid) — and the scale bar it sets
      var leftX = -(SX - WIN.x), rightX = WIN.w + leftX, topY = WIN.h / 2, bottomY = -topY;
      var m = 15 / s, lg = Math.log(m) / Math.LN10, k = Math.ceil(lg), spacing, below, mult;
      if (k - lg > 0.30102999566398114) { below = Math.pow(10, k - 1); spacing = 5 * below; mult = 2; }
      else { spacing = Math.pow(10, k); below = 0.5 * spacing; mult = 5; }
      if (opt.grid) {
        var minorA = (5 + (20 * (spacing - m)) / (spacing - below)) / 100;
        ctx.lineWidth = 1;
        var lines = function (lo, hi, vertical) {
          for (var i = Math.ceil(lo / s / spacing); i < Math.ceil(hi / s / spacing); i++) {
            var v = i * spacing * s;
            ctx.strokeStyle = i === 0 ? "rgba(77,169,77,0.65)" : "rgba(255,255,255," + (i % mult === 0 ? 0.25 : minorA) + ")";
            ctx.beginPath();
            if (vertical) { ctx.moveTo(v, bottomY); ctx.lineTo(v, topY); } else { ctx.moveTo(leftX, v); ctx.lineTo(rightX, v); }
            ctx.stroke();
          }
        };
        lines(leftX, rightX, true); lines(bottomY, topY, false);
      }
      // the sweeps, inside the orbit (orbitalInteriorMC under orbitalInteriorMaskMC)
      if (sweeps.length) {
        ctx.save();
        ctx.beginPath(); orbitPath(ctx, A, B, e * A); ctx.clip();
        sweeps.slice().sort(function (p1, q1) { return p1.depth - q1.depth; }).forEach(function (sw) {
          var g = sweepGeom(sw.start, sw.dur), n = Math.ceil(g.arc * 2 / Math.PI), st = g.arc / n, ang = g.sta;
          ctx.globalAlpha = sw === hover && sw.drag ? 0.8 : 0.5;
          ctx.fillStyle = sw.color;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-SAFE * Math.cos(ang), SAFE * Math.sin(ang));
          for (var i = 0; i < n; i++) { ang += st; ctx.lineTo(-SAFE * Math.cos(ang), SAFE * Math.sin(ang)); }
          ctx.closePath(); ctx.fill();
        });
        ctx.restore();
      }
      // the solar-system orbits
      if (opt.ssOrbits) {
        SS.forEach(function (pl) {
          var LTA = 2.443460952792061, r = s * pl.a * (1 - pl.e * pl.e) / (1 + pl.e * Math.cos(LTA));
          if (!(s * pl.a * (1 - pl.e) > WIN.w)) {
            var n = pl.pts.length;
            ctx.strokeStyle = "rgba(255,102,0,0.8)"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(s * pl.pts[n - 1].ax, s * pl.pts[n - 1].ay);
            pl.pts.forEach(function (q) { ctx.quadraticCurveTo(s * q.cx, s * q.cy, s * q.ax, s * q.ay); });
            ctx.stroke();
          }
          if (opt.ssPlanets) {
            var pm = pl.ma + TAU * time / pl.period, pk1 = Math.sqrt((1 + pl.e) / (1 - pl.e));
            var pta = 2 * Math.atan(pk1 * Math.tan(solveE(pm, pl.e) / 2)), pr = s * pl.a * (1 - pl.e * pl.e) / (1 + pl.e * Math.cos(pta));
            if (!(pr > WIN.w)) { ctx.save(); ctx.translate(-pr * Math.cos(pta), pr * Math.sin(pta)); SwfShape.draw(ctx, ART.ssPlanet); ctx.restore(); }
          }
          if (opt.ssLabels && !(r > WIN.w)) {
            var ratio = Math.min(1, r / pl.optimal), ls = Math.sqrt(ratio), rr = r + 2 * ratio;
            ctx.save(); ctx.translate(-rr * Math.cos(LTA), rr * Math.sin(LTA)); ctx.scale(ls, ls);
            font(ctx, 12, "bold"); ctx.fillStyle = "#fd7d31";
            FlashText.fill(ctx, pl.name, -66.9 + 66.9 + 2, 2 - 2 + 2 + ASC * 12, "left");
            ctx.restore();
          }
        });
      }
      // the orbit
      ctx.strokeStyle = "#c0c0c0"; ctx.lineWidth = 1;
      ctx.beginPath(); orbitPath(ctx, A, B, e * A); ctx.stroke();
      // radial lines and their labels
      var fx = 2 * e * a * s;
      if (opt.radial) {
        ctx.strokeStyle = "#88ff88"; ctx.lineWidth = 2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(p.tx, p.ty); ctx.moveTo(Math.min(fx, SUPERSAFE), 0); ctx.lineTo(p.tx, p.ty); ctx.stroke();
        var ang1 = p.ta - Math.atan(20 / p.r), r2 = 2 * a * s - p.r, ang2 = Math.atan2(p.ty, p.tx - fx) - Math.atan(20 / r2);
        radialLabel(ctx, -0.5 * p.r * Math.cos(ang1), 0.5 * p.r * Math.sin(ang1), "1");
        radialLabel(ctx, fx + 0.5 * r2 * Math.cos(ang2), 0.5 * r2 * Math.sin(ang2), "2");
      }
      // the dashed lines
      var ar = arrowsFor(p);
      if (opt.aLine) { ctx.strokeStyle = "#a06060"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.beginPath(); dashed(ctx, 0, 0, p.x, p.y); ctx.stroke(); }
      if (opt.vLine) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(ar.vRot / DEG);
        ctx.strokeStyle = "#6060a0"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.beginPath(); dashed(ctx, -120, 0, 120, 0); ctx.stroke();
        ctx.restore();
      }
      // details: empty focus, centre, the braces
      var cx = Math.min(e * A, SUPERSAFE);
      if (opt.focus) {
        ctx.save(); ctx.translate(Math.min(2 * e * a * s, SUPERSAFE), 0); SwfShape.draw(ctx, ART.focus);
        font(ctx, 11, "bold"); ctx.fillStyle = "#ffffff";
        FlashText.fillStatic(ctx, t("k.cEmpty"), -72 + 52.5, 33 + 11); FlashText.fillStatic(ctx, t("k.cFocus"), -72 + 52.5 + 3, 33 + 26);
        ctx.restore();
      }
      if (opt.center) {
        ctx.save(); ctx.translate(cx, 0); SwfShape.draw(ctx, ART.center);
        font(ctx, 11, "bold"); ctx.fillStyle = "#fcf398"; FlashText.fillStatic(ctx, t("k.cCenter"), -72 + 52.25, 19 + 11);
        ctx.restore();
      }
      if (opt.smaj) { ctx.save(); ctx.translate(cx + A * 0.5, -18); brace(ctx, A, "#0099ff", t("k.braceMaj")); ctx.restore(); }
      if (opt.smin) {
        var bb = Math.min(B, SUPERSAFE);
        ctx.save(); ctx.translate(-18 + cx, -bb / 2); ctx.rotate(-Math.PI / 2); brace(ctx, bb, "#ff9999", t("k.braceMin")); ctx.restore();
      }
      // the planet and the Sun
      ctx.save(); ctx.translate(p.x, p.y);
      if (hover === "planet") SwfShape.draw(ctx, ART.ring);
      SwfShape.draw(ctx, ART.planet);
      ctx.restore();
      SwfShape.draw(ctx, ART.sun);
      // the arrows
      if (opt.aArrow || opt.vArrow) {
        ctx.save(); ctx.translate(p.x, p.y);
        if (opt.aArrow) arrow(ctx, ar.aLen, ar.aRot, "#d89898");
        if (opt.vArrow) arrow(ctx, ar.vLen, ar.vRot, "#9898d8");
        ctx.restore();
      }
      // the scale bar
      var bw = mult * spacing * s;
      ctx.save(); ctx.translate(520 - (SX - WIN.x), -205);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(-bw / 2, 0, bw, 5);
      font(ctx, 10, "bold"); FlashText.fill(ctx, flashString(mult * spacing) + " AU", 0, -15 - 2 + 2 + ASC * 10, "center");
      ctx.restore();
      ctx.restore();
    }
    function radialLabel(ctx, x, y, sub) {
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = "#88ff88";
      font(ctx, 12, "bold"); FlashText.fillStatic(ctx, "r", -72 + 66.15, -9.25 + 12);
      font(ctx, 7.8, "bold"); FlashText.fillStatic(ctx, sub, -72 + 66.15 + 5.95, -9.25 + 12.85);
      ctx.restore();
    }
    // initializeArrows / updateArrows
    var ARW = (function () {
      var rMin = SCREEN_A * (1 - MAXE), rMax = SCREEN_A * (1 + MAXE);
      var aMax = 1 / (rMin * rMin), aMin = 1 / (rMax * rMax), vMax = Math.sqrt(2 / rMin - 1 / SCREEN_A), vMin = Math.sqrt(2 / rMax - 1 / SCREEN_A);
      return { aScale: (100 - 20) / (aMax - aMin), aMin: aMin, vScale: (100 - 20) / (vMax - vMin), vMin: vMin };
    })();
    function arrowsFor(p) {
      var r = p.r, aLen = 20 + (1 / (r * r) - ARW.aMin) * ARW.aScale;
      var vLen = 20 + (Math.sqrt(2 / r - 1 / (a * scale)) - ARW.vMin) * ARW.vScale;
      aLen = Math.min(aLen, 200); vLen = Math.min(vLen, 200);
      var aRot = -DEG * p.ta, A = a * scale, b = Math.sqrt(A * A * (1 - e * e));
      var x = -p.r * Math.cos(p.ta) - A * e, Q = Math.max(0, 1 - x * x / (A * A));
      var angle = -DEG * Math.atan((b * x) / (A * A * Math.sqrt(Q)));
      var vRot = p.y < 0 ? 180 - angle : angle;
      var between = mod(aRot - vRot, 360); if (between > 180) between = 360 - between;
      return { aLen: aLen, vLen: vLen, aRot: aRot, vRot: vRot, between: between };
    }

    /* ---------------- drawing: the tabbed panel ---------------- */
    var TABS = [["k1", "k.tab1", 27.8], ["k2", "k.tab2", 75.6], ["k3", "k.tab3", 123.4], ["n", "k.tabN", 171.2]];
    var TABX = 7, TABY = 504;
    function drawTab(ctx, tb) {
      ctx.save(); ctx.translate(TABX, TABY + tb[2]);
      ctx.fillStyle = "#fafafa"; ctx.fill(ART.tabFill);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.stroke(ART.tabLine);
      font(ctx, 12); ctx.fillStyle = tb[0] === tab ? "#000000" : "#666666";
      FlashText.fill(ctx, t(tb[1]), 7.05 + (-2 + 136.9) / 2, -7.25 - 2 + 2 + ASC * 12, "center");
      ctx.restore();
    }
    function drawPanel(ctx) {
      TABS.forEach(function (tb) { if (tb[0] !== tab) drawTab(ctx, tb); });
      ctx.fillStyle = "#fafafa"; ctx.fillRect(TABX + 147.05, TABY, 453, 199);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(TABX + 147.05, TABY, 453, 199);
      TABS.forEach(function (tb) { if (tb[0] === tab) drawTab(ctx, tb); });
      ctx.fillStyle = "#000000";
      if (tab === "k1") drawK1(ctx); else if (tab === "k2") drawK2(ctx); else if (tab === "k3") drawK3(ctx); else drawNewton(ctx);
    }
    function field(ctx, str, px, py, xmin, xmax, size, align) {   // a TextField at (px, py), bounds x[xmin, xmax], y from −2
      var y = py - 2 + 2 + ASC * size;
      if (align === "center") return FlashText.fill(ctx, str, px + (xmin + xmax) / 2, y, "center");
      if (align === "right") return FlashText.fill(ctx, str, px + xmax - 2, y, "right");
      return FlashText.fill(ctx, str, px + xmin + 2, y, "left");
    }
    function symR(ctx, x, y, sub) {                 // r₁ / r₂ (italic)
      font(ctx, 14, "italic"); FlashText.fillStatic(ctx, "r", x, y + 14);
      font(ctx, 9.1, "italic"); FlashText.fillStatic(ctx, sub, x + 5.95, y + 15.05);
    }
    function drawK1(ctx) {
      var X = 380.65, Y = 497.05, p = position(), r1 = p.r / scale, c = 2 * a, r2 = c - r1;
      symR(ctx, X - 105.7, Y + 131.35, "1"); symR(ctx, X - 5.95, Y + 131.35, "2");
      font(ctx, 14, "italic");
      FlashText.fillStatic(ctx, "+", X - 55.45, Y + 131.35 + 14); FlashText.fillStatic(ctx, "+", X - 55.45, Y + 165.2 + 14);
      FlashText.fillStatic(ctx, "=", X + 43.9, Y + 131.35 + 14); FlashText.fillStatic(ctx, "=", X + 43.9, Y + 165.2 + 14);
      var x2 = X + 82.85, y2 = Y + 131.35 + 14;
      font(ctx, 14); FlashText.fillStatic(ctx, "2 ", x2, y2);
      font(ctx, 11); FlashText.fillStatic(ctx, "x", x2 + 13.8, y2);
      font(ctx, 14, "italic"); FlashText.fillStatic(ctx, "a", x2 + 25.2, y2);
      font(ctx, 12);
      field(ctx, three(r1) + " AU", X - 139.25, Y + 166.45, -2, 81, 12, "center");
      field(ctx, three(r2) + " AU", X - 39.5, Y + 166.45, -2, 81, 12, "center");
      field(ctx, three(c) + " AU", X + 60.25, Y + 166.45, -2, 81, 12, "center");
    }
    function drawK2(ctx) {
      var X = 8.95, Y = 486, d = sizeDenom, frac = 1 / d;
      font(ctx, 12);
      FlashText.fillStatic(ctx, t("k.frac"), X + 368.65 - 4.85 + 28, Y + 67.95 + 12);
      FlashText.fillStatic(ctx, "1", X + 354.05 + 68.1, Y + 85.75 + 12);
      ctx.fillRect(X + 413.55, Y + 101.5, 25, 1);
      field(ctx, String(d), X + 345.95, Y + 104.75, 62.25, 97.9, 12, "center");
      FlashText.fillStatic(ctx, t("k.or"), X + 407.95 + 49.85, Y + 95.25 + 12);
      field(ctx, flashToFixed(frac * 100, 1) + "%)", X + 471.8, Y + 95.25, -2, 56.95, 12, "right");
      FlashText.fillStatic(ctx, t("k.dur"), X + 392.75 - 26.9, Y + 122.55 + 12);
      field(ctx, three(frac * period) + " " + t("k.years"), X + 409.8, Y + 145, 5.75, 111.55, 12, "center");
      FlashText.fillStatic(ctx, t("k.area"), X + 396.45 + 10.75, Y + 167.45 + 12);
      field(ctx, three(frac * a * a * Math.PI * Math.sqrt(1 - e * e)) + " " + t("k.sqAU"), X + 438.25, Y + 189.9, -18.15, 78.6, 12, "center");
    }
    function drawK3(ctx) {
      var X = -48.6, Y = 503.65;
      font(ctx, 14, "italic"); FlashText.fillStatic(ctx, "P", X + 246.7, Y + 18.5 + 14);
      font(ctx, 9.1); FlashText.fillStatic(ctx, "2", X + 246.7 + 8.45, Y + 18.5 + 9.05);
      font(ctx, 14, "italic"); FlashText.fillStatic(ctx, "a", X + 307.45, Y + 18.5 + 14);
      font(ctx, 9.1); FlashText.fillStatic(ctx, "3", X + 307.45 + 8.4, Y + 18.5 + 9.05);
      font(ctx, 14, "italic");
      [18.5, 52.15, 79.15].forEach(function (yy) { FlashText.fillStatic(ctx, "=", X + 278.8, Y + yy + 14); });
      var pText = "(" + three(period) + ")", aText = "(" + three(a) + ")";
      font(ctx, 12);
      field(ctx, pText, X + 183.4, Y + 53.4, -2, 81, 12, "right");
      field(ctx, aText, X + 303.15, Y + 53.4, -2, 81, 12, "left");
      field(ctx, three(period * period), X + 303.15, Y + 80.4, -2, 81, 12, "left");
      var twP = FlashText.textWidth(ctx, pText), twA = FlashText.textWidth(ctx, aText);
      font(ctx, 9.1);
      // squaredMC._x = 3 + periodField._x + textWidth (Ruffle's _x is the field box's left, 2 px before tx)
      FlashText.fillStatic(ctx, "2", X + 3 + 183.4 - 2 + twP + 2, Y + 60.65 - 8.5 + 9.05);
      FlashText.fillStatic(ctx, "3", X + 3 + 303.15 - 2 + twA + 2, Y + 60.65 - 8.5 + 9.05);
      drawK3Plot(ctx, X + 413.8, Y + 158.85);
    }
    // Kepler3rdPlotClass
    var K3 = { h: 150, w: 230, tick: 5, minA: 0.095, maxA: 105, minP: 0.025, maxP: 1300, pref: 0.7, minMaxA: 0.75, yMargin: 15 };
    var K3_PLANETS = [["M", 0.387], ["V", 0.723], ["E", 1], ["M", 1.524], ["J", 5.203], ["S", 9.54], ["U", 19.18], ["N", 30.06], ["P", 39.44]];
    function k3Dot(ctx, x, y, label) {
      ctx.save(); ctx.translate(x, y); SwfShape.draw(ctx, ART.plotDot);
      font(ctx, 10, "bold"); ctx.fillStyle = "rgba(255,102,0,0.8)";
      FlashText.fill(ctx, label, -55.75 + (-2 + 113.5) / 2, -14.8 - 4.25 - 2 + 2 + ASC * 10, "center");
      ctx.restore();
    }
    function k3Label(ctx, txt, x, y, how) {          // createTextField + autoSize, Verdana 10
      font(ctx, 10); ctx.fillStyle = "#000000";
      var tw = FlashText.textWidth(ctx, txt);
      if (how === "x") FlashText.fill(ctx, txt, x - tw / 2 - 2 + 2, K3.tick + 2 + ASC * 10, "left");
      else FlashText.fill(ctx, txt, -(K3.tick + tw + 7) + 2, y - 12.16 / 2 - 2 + 2 + ASC * 10, "left");
    }
    function drawK3Plot(ctx, ox, oy) {
      ctx.save(); ctx.translate(ox, oy);
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.strokeRect(0, -150, 230, 150);
      font(ctx, 10, "bold"); ctx.fillStyle = "#000000";
      FlashText.fillStatic(ctx, t("k.plotA"), 56.5, 22 + 10);
      ctx.save(); ctx.translate(-46 + 1.003113 * 10, -25 - 19); ctx.rotate(-Math.PI / 2); FlashText.fillStatic(ctx, t("k.plotP"), 0, 0); ctx.restore();
      var hair = 1 / Math.max(1, (window.devicePixelRatio || 1));
      if (opt.plotType === "linear") {
        var maxA = Math.max(a / K3.pref, K3.minMaxA), maxP = Math.pow(maxA, 1.5);
        var yScale = -(K3.h - K3.yMargin) / maxP, xScale = K3.w / maxA;
        // the curve, drawn once in units of the axes' maxima (initializeLinearPlot)
        ctx.strokeStyle = "#000000"; ctx.lineWidth = hair; ctx.beginPath(); ctx.moveTo(0, 0);
        var yS = -(K3.h - K3.yMargin), xS = K3.w, a0 = 0, a0s = 0;
        for (var i = 0; i < 6; i++) {
          var a1 = a0 + 1 / 6, a1s = Math.sqrt(a1), ac = (a0 + a1 + a0s * a1s) / 3, pc = a0s * (1.5 * ac - 0.5 * a0);
          ctx.quadraticCurveTo(ac * xS, pc * yS, a1 * xS, a1 * a1s * yS); a0 = a1; a0s = a1s;
        }
        ctx.stroke();
        // axes
        ctx.lineWidth = hair;
        var maj = Math.pow(10, Math.floor(Math.log(maxA) / Math.LN10)), nM = 1 + Math.floor(maxA / maj);
        if (nM === 2) { maj /= 5; nM = 1 + Math.floor(maxA / maj); }
        for (i = 0; i < nM; i++) {
          var x = i * maj * xScale;
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, K3.tick); ctx.stroke();
          k3Label(ctx, flashString(i * maj), x, 0, "x");
        }
        var maxPl = -K3.h / yScale, majP = Math.pow(10, Math.floor(Math.log(maxPl) / Math.LN10)), nP = 1 + Math.floor(maxPl / majP);
        if (nP === 2) { majP /= 5; nP = 1 + Math.floor(maxPl / majP); }
        for (i = 0; i < nP; i++) {
          var y = i * majP * yScale;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(-K3.tick, y); ctx.stroke();
          k3Label(ctx, flashString(i * majP), 0, y, "y");
        }
        if (opt.ssOrbits) K3_PLANETS.forEach(function (pl) { var px = xScale * pl[1]; if (px < K3.w) k3Dot(ctx, px, yScale * Math.pow(pl[1], 1.5), pl[0]); });
        var ux = a * xScale, uy = Math.pow(a, 1.5) * yScale;
        ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ux, 0); ctx.lineTo(ux, uy); ctx.lineTo(0, uy); ctx.stroke();
        ctx.save(); ctx.translate(ux, uy); SwfShape.draw(ctx, ART.userDot); ctx.restore();
      } else {
        var L = Math.log, lMinA = L(K3.minA), lMaxA = L(K3.maxA), lMinP = L(K3.minP), lMaxP = L(K3.maxP);
        var ys = -K3.h / (lMaxP - lMinP), xs = K3.w / (lMaxA - lMinA);
        ctx.strokeStyle = "#000000"; ctx.lineWidth = hair;
        ctx.beginPath(); ctx.moveTo(0, ys * (1.5 * lMinA - lMinP)); ctx.lineTo(K3.w, ys * (1.5 * lMaxA - lMinP)); ctx.stroke();
        var decades = function (lo, hi, draw) {
          var pL = Math.floor(L(lo) / Math.LN10), nL = Math.pow(10, pL), mL = Math.ceil(lo / nL);
          var pU = Math.floor(L(hi) / Math.LN10), nU = Math.pow(10, pU), mU = Math.floor(hi / nU), m, q;
          for (m = mL; m < 10; m++) draw(m * nL, m === 1);
          for (q = pL + 1; q < pU; q++) for (m = 1; m < 10; m++) draw(m * Math.pow(10, q), m === 1);
          for (m = 1; !(m > mU); m++) draw(m * nU, m === 1);
        };
        decades(K3.minA, K3.maxA, function (v, lab) {
          var x = xs * (L(v) - lMinA); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, K3.tick); ctx.stroke();
          if (lab) k3Label(ctx, flashString(v), x, 0, "x");
        });
        decades(K3.minP, K3.maxP, function (v, lab) {
          var y = ys * (L(v) - lMinP); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(-K3.tick, y); ctx.stroke();
          if (lab) k3Label(ctx, flashString(v), 0, y, "y");
        });
        if (opt.ssOrbits) K3_PLANETS.forEach(function (pl) { var la = L(pl[1]); k3Dot(ctx, xs * (la - lMinA), ys * (1.5 * la - lMinP), pl[0]); });
        var lx = xs * (L(a) - lMinA), ly = ys * (L(Math.pow(a, 1.5)) - lMinP);
        ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, ly); ctx.lineTo(0, ly); ctx.stroke();
        ctx.save(); ctx.translate(lx, ly); SwfShape.draw(ctx, ART.userDot); ctx.restore();
      }
      ctx.restore();
    }
    // the Newtonian Features panel and its Plot Component
    function newtonTicks(min0, scaleV, h, m) {     // PlotClass.update's tick choice
      var lg = Math.log(20 / scaleV) / Math.LN10, f = Math.floor(lg), major, minor, place;
      if (f === lg) { major = Math.pow(10, f); minor = 5 * Math.pow(10, f - 1); place = f; }
      else if (lg > f + 0.698970004336019) { major = Math.pow(10, f + 1); minor = 5 * Math.pow(10, f); place = f + 1; }
      else { major = 5 * Math.pow(10, f); minor = Math.pow(10, f); place = f; }
      var min = min0 - m / scaleV, max = min + h / scaleV, out = [], i, n, start;
      if (minor > 7 / scaleV) {
        start = minor * Math.ceil(min / minor); n = 1 + Math.floor((max - start) / minor);
        for (i = 0; i < n; i++) {
          var v = start + minor * i, k = v / major, isMajor = Math.abs(k - Math.round(k)) < 1e-9;
          out.push({ v: v, y: m - (v - min) * scaleV, major: isMajor });
        }
      } else {
        start = major * Math.ceil(min / major); n = 1 + Math.floor((max - start) / major);
        for (i = 0; i < n; i++) out.push({ v: start + major * i, y: m - (start + major * i - min) * scaleV, major: true });
      }
      return { ticks: out.filter(function (q) { return q.major; }).slice(0, 9).concat(out.filter(function (q) { return !q.major; }).slice(0, 99)), place: place };
    }
    function formatNumber(x, place) {
      if (-place > 0) return flashToFixed(x, Math.min(14, -place));
      var p = Math.pow(10, place); return flashString(Math.round(p * x) / p);
    }
    function drawNewton(ctx) {
      var X = 10.05, Y = 484.1, p = position(), r = p.r / scale, ar = arrowsFor(p);
      var k3 = 1774.53 * MASS, k4 = -k3 / (2 * a), k5 = 0.005931 * MASS;
      // the two value rows of the table (shape 113 without its check-box header)
      ctx.fillStyle = "rgba(250,250,250,0.902)"; ctx.fillRect(X + 236.4, Y + 51.1, 244.85, 47.2);
      ctx.fillStyle = "rgba(145,145,205,0.153)"; ctx.fillRect(X + 236, Y + 51.1, 245, 23.55);
      ctx.fillStyle = "rgba(186,102,102,0.153)"; ctx.fillRect(X + 236, Y + 74.65, 245, 23.55);
      ctx.strokeStyle = "#dddddd"; ctx.lineWidth = 1; ctx.beginPath();
      [51.1, 74.65, 98.2].forEach(function (yy) { ctx.moveTo(X + 236, Y + yy); ctx.lineTo(X + 481, Y + yy); });
      ctx.stroke();
      font(ctx, 13, "bold", COURIER); ctx.fillStyle = "#404040";
      var vText = "v = " + three(Math.sqrt(k4 + k3 / r)) + " km/s", aText = "a = " + three(k5 / (r * r)) + " m/s";
      FlashText.fill(ctx, vText, X + 250.35, Y + 56.65 + CASC * 13);
      FlashText.fill(ctx, aText, X + 250.35, Y + 80.2 + CASC * 13);
      var twA = FlashText.textWidth(ctx, aText);
      FlashText.fillStatic(ctx, t("k.angle"), X + 242.5 + 8, Y + 102.85 + 11);
      FlashText.fill(ctx, flashToFixed(ar.between, 1) + "°", X + 426.6, Y + 103.25 + CASC * 13);
      font(ctx, 8.45, "bold", COURIER); FlashText.fillStatic(ctx, "2", X + 2 + 250.35 - 2 + twA + 2, Y + 87.95 - 6.45 + 7.2);
      drawNewtonPlot(ctx, X + 201, Y + 200);
    }
    function drawNewtonPlot(ctx, ox, oy) {
      var H = 180, W = 315, M = 10, T = 50;
      var k1n = Math.sqrt((1 + e) / (1 - e)), k2 = a * (1 - e * e), k3 = 1774.53 * MASS, k4 = -k3 / (2 * a), k5 = 0.005931 * MASS;
      var rMin = a * (1 - MAXE), rMax = a * (1 + MAXE);
      var vMin = Math.sqrt(k4 + k3 / rMax), vMax = Math.sqrt(k4 + k3 / rMin), aMin = k5 / (rMax * rMax), aMax = k5 / (rMin * rMin);
      var vS = (H - 2 * M) / (vMax - vMin), aS = (H - 2 * M) / (aMax - aMin), xS = W / (2 * (T - 1));
      ctx.save(); ctx.translate(ox, oy);
      // the curves: half an orbit from perihelion, mirrored
      var vPts = [], aPts = [], r0 = a * (1 - e);
      vPts.push(-vS * (Math.sqrt(k4 + k3 / r0) - vMin)); aPts.push(-aS * (k5 / (r0 * r0) - aMin));
      for (var i = 1, m0 = Math.PI / (T - 1); i < T; i++) {
        var ea = solveE(i * m0, e), rr = k2 / (1 + e * Math.cos(2 * Math.atan(k1n * Math.tan(ea / 2))));
        vPts.push(-vS * (Math.sqrt(k4 + k3 / rr) - vMin)); aPts.push(-aS * (k5 / (rr * rr) - aMin));
      }
      [[vPts, "#5050b0"], [aPts, "#b05050"]].forEach(function (c) {
        ctx.strokeStyle = c[1]; ctx.lineWidth = 1; ctx.beginPath();
        c[0].forEach(function (y, j) { if (j) ctx.lineTo(j * xS, y); else ctx.moveTo(0, y); });
        c[0].forEach(function (y, j) { if (j) ctx.lineTo(W - j * xS, y); else ctx.moveTo(W, y); });
        ctx.stroke();
      });
      // the frame and the phase cursor
      ctx.strokeStyle = "#000000"; ctx.strokeRect(0, -170, 315, 180);
      ctx.strokeStyle = "rgba(102,102,102,0.702)"; ctx.beginPath();
      var cxp = W * mod(ma / TAU, 1); ctx.moveTo(cxp, -170); ctx.lineTo(cxp, 10); ctx.stroke();
      // ticks and their labels
      var vt = newtonTicks(vMin, vS, H, M), at = newtonTicks(aMin, aS, H, M), tick1W = 0, nMaj = 0;
      vt.ticks.forEach(function (q) {
        var y = q.y;
        ctx.strokeStyle = q.major ? "#000000" : "#666666"; ctx.beginPath(); ctx.moveTo(-1, y); ctx.lineTo(q.major ? 4 : 2, y); ctx.stroke();
        if (q.major) { font(ctx, 10); ctx.fillStyle = "#5050b0"; FlashText.fill(ctx, formatNumber(q.v, vt.place), -120.55 + 118.3 - 2, y - 6.05 - 2 + 2 + ASC * 10, "right"); }
      });
      at.ticks.forEach(function (q) {
        var y = q.y;
        ctx.strokeStyle = q.major ? "#000000" : "#666666"; ctx.beginPath(); ctx.moveTo(W + (q.major ? -4 : -2), y); ctx.lineTo(W + 1, y); ctx.stroke();
        if (q.major) {
          font(ctx, 10); ctx.fillStyle = "#b05050";
          var lab = formatNumber(q.v, at.place);
          FlashText.fill(ctx, lab, W - 12.5 + 14.7 + 2, y - 6.05 * 1.003113 - 2 + 2 + ASC * 10, "left");
          if (nMaj === 1) tick1W = FlashText.textWidth(ctx, lab);
          nMaj++;
        }
      });
      // the axis titles
      font(ctx, 11); ctx.fillStyle = "#5050b0";
      ctx.save(); ctx.translate(-24.4 - 4.25, -132.75 + 87.3); ctx.rotate(-Math.PI / 2); FlashText.fillStatic(ctx, t("k.vel"), 0, 0); ctx.restore();
      ctx.fillStyle = "#b05050";
      // (Ruffle's TextField._x is the left of the field's box: −12.5 + 14.7)
      ctx.save(); ctx.translate(10 + W - 12.5 + 14.7 + tick1W + 4.25, -143.8 + 2); ctx.rotate(Math.PI / 2);
      var accW = FlashText.fillStatic(ctx, t("k.acc"), 0, 0);
      font(ctx, 7.15); FlashText.fillStatic(ctx, "2", accW, 7.15 - 11);
      font(ctx, 11); FlashText.fillStatic(ctx, ")", accW + 4.55, 0);
      ctx.restore();
      ctx.restore();
    }

    S.onDraw(function () {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      ctx.save();
      ctx.clearRect(0, 0, S.W, S.H);
      ctx.translate(0, OY);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 30, S.W, S.H);
      drawWindow(ctx);
      drawPanel(ctx);
      ctx.restore();
    });

    /* ---------------- pointer: the planet, the sweeps, the tabs ---------------- */
    var drag = null, keysDown = {};
    window.addEventListener("keydown", function (ev) { keysDown[ev.key] = true; });
    window.addEventListener("keyup", function (ev) { keysDown[ev.key] = false; });
    function stagePt(ev) {
      var rc = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - rc.left) * S.W / rc.width, y: (ev.clientY - rc.top) * S.H / rc.height - OY };
    }
    function maAtMouse(pt) { return maFromTA(Math.PI - Math.atan2(pt.y - SY, pt.x - SX)); }
    function inWindow(pt) { return pt.x >= WIN.x && pt.x <= WIN.x + WIN.w && pt.y >= WIN.y && pt.y <= WIN.y + WIN.h; }
    function hitTest(pt) {
      if (inWindow(pt)) {
        var p = position(), dx = pt.x - SX - p.x, dy = pt.y - SY - p.y;
        if (dx * dx + dy * dy <= 36) return "planet";
        var x = pt.x - SX, y = pt.y - SY, A = a * scale, B = A * Math.sqrt(1 - e * e);
        if (Math.pow((x - e * A) / A, 2) + Math.pow(y / B, 2) <= 1) {
          var th = mod(Math.PI - Math.atan2(y, x), TAU);
          var hit = sweeps.slice().sort(function (p1, q1) { return q1.depth - p1.depth; }).filter(function (sw) {
            var g = sweepGeom(sw.start, sw.dur); return mod(th - g.sta, TAU) <= g.arc;
          })[0];
          if (hit) return hit;
        }
        return null;
      }
      for (var i = 0; i < TABS.length; i++) {
        var ty = TABY + TABS[i][2];
        if (pt.x >= TABX && pt.x <= TABX + 151 && pt.y >= ty - 20 && pt.y <= ty + 20 && !(TABS[i][0] !== tab && pt.x > TABX + 147)) return TABS[i];
      }
      return null;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var pt = stagePt(ev), h = hitTest(pt);
      if (!h) return;
      if (Array.isArray(h)) { setTab(h[0]); return; }
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (err) {}
      if (h === "planet") {
        drag = { kind: "planet", off: maAtMouse(pt) - ma, was: animating };
        setAnimating(false);
      } else if (h.drag) {
        if (keysDown.Delete || keysDown.Backspace) { removeSweep(h); hover = null; S.requestDraw(); return; }
        var lower = [], upper = [];
        sweeps.forEach(function (sw) {
          if (sw === h) return;
          var g = sweepGeom(sw.start, sw.dur);
          lower.push({ ma: sw.start - sweepDur, m: Math.atan(SNAP / g.r0), ta: g.sta });
          upper.push({ ma: sw.start + sweepDur, m: Math.atan(SNAP / g.r1), ta: g.eta });
        });
        lower.sort(function (p1, q1) { return p1.ta - q1.ta; }); upper.sort(function (p1, q1) { return p1.ta - q1.ta; });
        h.depth = topDepth++; sortNeeded = true;
        drag = { kind: "sweep", sw: h, off: maAtMouse(pt) - h.start, lower: lower, upper: upper };
      }
      S.requestDraw();
    });
    function nearest(list, ta) {
      var best = 1000000, bi = -1, d;
      for (var i = 0; i < list.length; i++) { d = Math.abs(ta - list[i].ta); if (d < best) { bi = i; best = d; } }
      if (list.length) {
        d = Math.abs(list[list.length - 1].ta - (ta + TAU)); if (d < best) { bi = list.length - 1; best = d; }
        d = Math.abs(ta - (list[0].ta + TAU)); if (d < best) { bi = 0; best = d; }
      }
      return { i: bi, d: best };
    }
    S.canvas.addEventListener("pointermove", function (ev) {
      var pt = stagePt(ev);
      if (drag && drag.kind === "planet") {
        ma = maAtMouse(pt) - drag.off; cancelSweeping(); S.requestDraw(); return;
      }
      if (drag && drag.kind === "sweep") {
        var sma = maAtMouse(pt) - drag.off, g = sweepGeom(sma, sweepDur);
        var up = nearest(drag.upper, g.sta), lo = nearest(drag.lower, g.eta), m = sma;
        if (up.d < lo.d) { if (up.i >= 0 && up.d < drag.upper[up.i].m) m = drag.upper[up.i].ma; }
        else if (lo.i >= 0 && lo.d < drag.lower[lo.i].m) m = drag.lower[lo.i].ma;
        drag.sw.start = m; S.requestDraw(); return;
      }
      var h = hitTest(pt), hv = h === "planet" ? "planet" : (h && !Array.isArray(h) ? h : null);
      if (hv !== hover) { hover = hv; S.requestDraw(); }
      S.canvas.style.cursor = h === "planet" || (h && h.drag) ? "grab" : (Array.isArray(h) ? "pointer" : "default");
    });
    function release() {
      if (drag && drag.kind === "planet") setAnimating(drag.was);
      drag = null;
    }
    S.canvas.addEventListener("pointerup", release);
    S.canvas.addEventListener("pointercancel", release);
    S.canvas.addEventListener("pointerleave", function () { if (!drag && hover) { hover = null; S.requestDraw(); } });

    /* ---------------- the sidebar ---------------- */
    var aside = S.canvas.closest(".sim-layout").querySelector(".sim-controls"), syncing = false;
    function tagFrom(n0, key) { for (var i = n0; i < aside.children.length; i++) aside.children[i].setAttribute("data-ktab", key); }
    function lastInput() { var c = aside.lastElementChild; return c && c.querySelector("input"); }
    function sigRound(v, sigs) {                   // Slider v4, 'significant digits'
      var dec = 1 + Math.floor(Math.log(v) / Math.LN10), pow = Math.pow(10, dec), res = Math.pow(10, sigs);
      var tick = Math.round(v * res / pow);
      if (tick === res) { tick = res / 10; dec += 1; pow = Math.pow(10, dec); }
      var val = tick / res * pow, prec = sigs - dec;
      return { v: val, s: prec > 0 ? flashToFixed(val, prec) : flashString(val) };
    }
    var PRESETS = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

    S.group("k.orbit");
    var presetCtl = S.select({ labelKey: "k.preset", value: "0", options: PRESETS.map(function (n, i) { return { v: String(i), label: n }; }),
      on: function () { okBtn.disabled = false; } });
    var okBtn = S.button({ labelKey: "k.ok", on: function () {
      var pl = SS[+presetCtl.value()];
      a = pl.a; setE(pl.e); calcPeriod(); rescale();
      syncSliders(); okBtn.disabled = true; S.requestDraw();
    } });
    var aCtl = S.slider({ labelKey: "k.a", min: -1, max: Math.log(50) / Math.LN10, step: 0.001, value: 0,
      format: function (v) { return sigRound(Math.pow(10, v), 3).s; },
      on: function (v) { if (syncing) return; a = sigRound(Math.pow(10, v), 3).v; calcPeriod(); rescale(); okBtn.disabled = false; } });
    var eCtl = S.slider({ labelKey: "k.e", min: 0, max: 0.7, step: 0.001, value: 0.4,
      format: function (v) { return flashToFixed(v, 3); },
      on: function (v) { if (syncing) return; setE(0.001 * Math.round(v / 0.001)); okBtn.disabled = false; } });

    S.group("k.anim");
    var animBtn = S.button({ labelKey: "k.start", primary: true, on: function () { toggleAnimation(); } });
    var rateCtl = S.slider({ labelKey: "k.rate", min: Math.log(0.002) / Math.LN10, max: Math.log(2) / Math.LN10, step: 0.001, value: Math.log(0.2) / Math.LN10,
      format: function (v) { return sigRound(Math.pow(10, v), 2).s; },
      on: function (v) { if (syncing) return; setRate(sigRound(Math.pow(10, v), 2).v); } });

    S.group("k.vis");
    var ssOrbitsCtl = S.toggle({ labelKey: "k.ssOrbits", value: false, on: function (v) { opt.ssOrbits = v; ssPlanetsIn.disabled = !v; ssLabelsIn.disabled = !v; } });
    var ssPlanetsCtl = S.toggle({ labelKey: "k.ssPlanets", value: false, on: function (v) { opt.ssPlanets = v; } });
    var ssPlanetsIn = lastInput(); ssPlanetsIn.disabled = true;
    var ssLabelsCtl = S.toggle({ labelKey: "k.ssLabels", value: false, on: function (v) { opt.ssLabels = v; } });
    var ssLabelsIn = lastInput(); ssLabelsIn.disabled = true;
    var gridCtl = S.toggle({ labelKey: "k.grid", value: false, on: function (v) { opt.grid = v; } });
    S.button({ labelKey: "k.clear", on: function () { clearFeatures(); } });

    var n0 = aside.children.length;
    S.group("k.tab1");
    var k1Ctls = [["k.focus", "focus"], ["k.center", "center"], ["k.smin", "smin"], ["k.smaj", "smaj"], ["k.radial", "radial"]].map(function (c) {
      return S.toggle({ labelKey: c[0], value: false, on: function (v) { opt[c[1]] = v; } });
    });
    tagFrom(n0, "k1"); n0 = aside.children.length;
    S.group("k.tab2");
    var sweepBtn = S.button({ labelKey: "k.sweepStart", on: function () {
      if (active) cancelSweeping();
      else { startSweeping(); if (!animating) toggleAnimation(); sweepBtn.setAttribute("data-i18n", "k.sweepStop"); sweepBtn.textContent = t("k.sweepStop"); }
      S.requestDraw();
    } });
    S.button({ labelKey: "k.erase", on: function () { removeAllSweeps(); S.requestDraw(); } });
    var sizeDenom = 16;
    var sizeCtl = S.slider({ labelKey: "k.size", min: -40, max: -2, step: 1, value: -16,
      format: function (v) { return "1/" + Math.round(-v); },
      on: function (v) { if (syncing) return; sizeDenom = Math.round(-v); setSweepDuration(sizeDenom); } });
    var contCtl = S.toggle({ labelKey: "k.cont", value: false, on: function (v) { sweepCont = v; } });
    var soundCtl = S.toggle({ labelKey: "k.sound", value: false, on: function (v) { useSound = v; } });
    tagFrom(n0, "k2"); n0 = aside.children.length;
    S.group("k.tab3");
    var plotCtl = S.select({ labelKey: "k.plotType", value: "linear", options: [{ v: "linear", labelKey: "k.linear" }, { v: "log", labelKey: "k.log" }],
      on: function (v) { opt.plotType = v; } });
    tagFrom(n0, "k3"); n0 = aside.children.length;
    S.group("k.tabN");
    var nCtls = [["k.vVec", "vArrow"], ["k.vLine", "vLine"], ["k.aVec", "aArrow"], ["k.aLine", "aLine"]].map(function (c) {
      return S.toggle({ labelKey: c[0], value: false, on: function (v) { opt[c[1]] = v; } });
    });
    tagFrom(n0, "n");
    S.button({ labelKey: "k.reset", on: function () { onReset(); } });

    function onSweepingStopped() {
      if (typeof sweepBtn === "undefined" || !sweepBtn) return;
      sweepBtn.setAttribute("data-i18n", "k.sweepStart"); sweepBtn.textContent = t("k.sweepStart");
    }
    function toggleAnimation() {
      setAnimating(!animating);
      animBtn.setAttribute("data-i18n", animating ? "k.pause" : "k.start"); animBtn.textContent = t(animating ? "k.pause" : "k.start");
    }
    function setTab(key) {
      tab = key;
      Array.prototype.forEach.call(aside.querySelectorAll("[data-ktab]"), function (el) { el.style.display = el.getAttribute("data-ktab") === key ? "" : "none"; });
      S.requestDraw();
    }
    function syncSliders() {
      syncing = true;
      aCtl.set(Math.log(a) / Math.LN10); eCtl.set(e); rateCtl.set(Math.log(rate) / Math.LN10); sizeCtl.set(-sizeDenom);
      syncing = false;
    }
    function clearFeatures() {
      [gridCtl, ssOrbitsCtl, ssPlanetsCtl, ssLabelsCtl, contCtl, soundCtl].concat(k1Ctls, nCtls).forEach(function (c) { c.set(false); });
      removeAllSweeps();
      sizeDenom = 16; setSweepDuration(16);
      plotCtl.set("linear");
      syncSliders();
    }
    function onReset() {
      clearFeatures();
      if (animating) toggleAnimation();
      ma = 0; time = 0;
      a = 1; setE(0.4); setRate(0.2); calcPeriod(); rescale(true);
      syncSliders(); okBtn.disabled = false;
      S.requestDraw();
    }

    removeAllSweeps();
    calcPeriod(); setRate(0.2); rescale(true);
    setTab("k1");
    syncSliders();
  }
});
