/* Effect of Planets on the Sun (Star Wobble) ------------------------------------
   Faithful rebuild of the ClassAction "ca_extrasolarplanets_starwobble.swf"
   (activity_Setup / body_Update, decompiled). Switch planets on and the Sun is
   pulled off the centre of mass by each of them: its offset towards a planet is
   (m_planet / M_Sun) × a_planet, and the offsets add as vectors.

   The scale is the SWF's own: the Sun is drawn at its true radius, 695 500 km
   across 60 pixels, so the wobble you see is the wobble to scale. Jupiter alone
   swings the Sun by just over one solar radius — the signal astronomers look for
   in other stars. Earth manages 0.04 pixels.                                   */
Sim.create({
  id: "ca_extrasolarplanets_starwobble",
  width: 540, height: 390,
  strings: {
    en: {
      "sw.title": "Effect of Planets on the Sun", "sw.years": "Years Elapsed:",
      "sw.planets": "Planets", "sw.speed": "Animation speed", "sw.reset": "Reset",
      "sw.rOffset": "Sun's offset", "sw.rAmp": "largest pull", "sw.solarRadii": " solar radii",
      "sw.hint": "Switch on a planet and watch the Sun circle the system's centre of mass. The green cross marks it.",
      "sw.none": "none",
      "pl.mercury": "Mercury", "pl.venus": "Venus", "pl.earth": "Earth", "pl.mars": "Mars", "pl.jupiter": "Jupiter",
      "pl.saturn": "Saturn", "pl.uranus": "Uranus", "pl.neptune": "Neptune", "pl.pluto": "Pluto",
      "sw.mercury": "Mercury · 0.387 AU", "sw.venus": "Venus · 0.723 AU", "sw.earth": "Earth · 1 AU",
      "sw.mars": "Mars · 1.5 AU", "sw.jupiter": "Jupiter · 5.2 AU", "sw.saturn": "Saturn · 9.5 AU",
      "sw.uranus": "Uranus · 19.2 AU", "sw.neptune": "Neptune · 30.1 AU", "sw.pluto": "Pluto · 39.5 AU"
    },
    id: {
      "sw.title": "Pengaruh Planet terhadap Matahari", "sw.years": "Tahun Berlalu:",
      "sw.planets": "Planet", "sw.speed": "Kecepatan animasi", "sw.reset": "Atur ulang",
      "sw.rOffset": "Pergeseran Matahari", "sw.rAmp": "tarikan terbesar", "sw.solarRadii": " jari-jari Matahari",
      "sw.hint": "Nyalakan sebuah planet dan amati Matahari mengitari pusat massa sistem. Tanda silang hijau menandainya.",
      "sw.none": "tidak ada",
      "pl.mercury": "Merkurius", "pl.venus": "Venus", "pl.earth": "Bumi", "pl.mars": "Mars", "pl.jupiter": "Jupiter",
      "pl.saturn": "Saturnus", "pl.uranus": "Uranus", "pl.neptune": "Neptunus", "pl.pluto": "Pluto",
      "sw.mercury": "Merkurius · 0.387 SA", "sw.venus": "Venus · 0.723 SA", "sw.earth": "Bumi · 1 SA",
      "sw.mars": "Mars · 1.5 SA", "sw.jupiter": "Jupiter · 5.2 SA", "sw.saturn": "Saturnus · 9.5 SA",
      "sw.uranus": "Uranus · 19.2 SA", "sw.neptune": "Neptunus · 30.1 SA", "sw.pluto": "Pluto · 39.5 SA"
    }
  },
  about: {
    en: "<p>A planet does not orbit its star; the two orbit their shared <strong>centre of mass</strong>. Because the Sun is about a thousand times more massive than Jupiter, that point lies close to the Sun — but not inside it. Jupiter pulls the Sun about 743 000 km off centre, slightly more than one solar radius, on a 12-year circuit. Saturn adds another 400 000 km, and the rest of the planets barely register: Earth's share is 450 km, which at this scale is a twenty-fifth of a pixel.</p>" +
        "<p>That tiny motion is how planets around other stars were first found. Seen side-on it shows up as a <strong>radial-velocity</strong> wobble in the star's spectrum; seen face-on it is an <strong>astrometric</strong> wobble in the star's position, which Gaia measures for millions of stars. Both favour massive planets in wide orbits — the opposite bias to the transit method.</p>" +
        "<p>Switch on several planets at once and the path stops being a circle. Each planet contributes its own circle at its own period, and the sum is a looping, drifting curve that never quite repeats. Untangling such a curve back into individual planets is exactly the problem exoplanet astronomers solve.</p>",
    id: "<p>Sebuah planet tidak mengorbit bintangnya; keduanya mengorbit <strong>pusat massa</strong> bersama. Karena Matahari sekitar seribu kali lebih masif daripada Jupiter, titik itu berada dekat Matahari — tetapi tidak di dalamnya. Jupiter menarik Matahari sekitar 743.000 km dari pusat, sedikit lebih dari satu jari-jari Matahari, dalam putaran 12 tahun. Saturnus menambah 400.000 km lagi, sedangkan planet lain nyaris tak berpengaruh: bagian Bumi hanya 450 km, yang pada skala ini setara seperduapuluh lima piksel.</p>" +
        "<p>Gerak mungil itulah yang pertama kali mengungkap planet di sekitar bintang lain. Dilihat dari samping ia tampak sebagai goyangan <strong>kecepatan radial</strong> pada spektrum bintang; dilihat dari depan ia menjadi goyangan <strong>astrometri</strong> pada posisi bintang, yang diukur Gaia untuk jutaan bintang. Keduanya lebih peka pada planet masif berorbit lebar — kebalikan dari bias metode transit.</p>" +
        "<p>Nyalakan beberapa planet sekaligus dan lintasannya berhenti berupa lingkaran. Setiap planet menyumbang lingkarannya sendiri dengan periodenya sendiri, dan jumlahnya berupa kurva melingkar-melayang yang tak pernah berulang persis. Mengurai kurva semacam itu kembali menjadi planet-planet tersendiri justru merupakan persoalan yang dipecahkan para astronom eksoplanet.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var SUN = { x: 270, y: 210 }, SUN_SCALE = 1.5, GLOBE_R = 40 * SUN_SCALE, GLOW_R = 75 * SUN_SCALE;
    var SUN_RADIUS_KM = 695500, KM_PER_PIXEL = SUN_RADIUS_KM / GLOBE_R;
    var AU_KM = 1.49598e8, M_EARTH = 5.9737e24, M_SUN_E = 1.989e30 / M_EARTH;
    var FONT = '"Trebuchet MS", Candara, system-ui, sans-serif';
    var TRAIL_MAX = 100, TRAIL_MIN_STEP = 10;         // sunpathSize / sunpathSegmentMinimum

    // the SWF's own table: period in days, semi-major axis in km, mass in kg
    var PLANETS = [
      { key: "pl.mercury", period: 87.97, dist: 5.79092e7, mass: 3.3022e23 },
      { key: "pl.venus", period: 224.7, dist: 1.08209e8, mass: 4.8685e24 },
      { key: "pl.earth", period: 365.24, dist: 1.49598e8, mass: 5.9737e24 },
      { key: "pl.mars", period: 686.93, dist: 2.27937e8, mass: 6.4185e23 },
      { key: "pl.jupiter", period: 4330.6, dist: 7.78412e8, mass: 1.8987e27 },
      { key: "pl.saturn", period: 10755.7, dist: 1.42673e9, mass: 5.6851e26 },
      { key: "pl.uranus", period: 30687.2, dist: 2.87097e9, mass: 8.6849e25 },
      { key: "pl.neptune", period: 60190, dist: 4.49825e9, mass: 1.0244e26 },
      { key: "pl.pluto", period: 90553, dist: 5.90638e9, mass: 1.3e22 }
    ];
    PLANETS.forEach(function (p) {
      p.massE = p.mass / M_EARTH;
      p.au = p.dist / AU_KM;
      p.pull = p.massE * p.au / M_SUN_E * AU_KM / KM_PER_PIXEL;   // the Sun's offset, in pixels
      p.on = false;
      p.angle = Math.random() * 360;                              // anglestarting = random()*3600
    });

    var days = 0, daysPerSecond = 1000, trail = [], sunX = SUN.x, sunY = SUN.y;

    S.group("sw.planets");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "sw.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    PLANETS.forEach(function (p) {
      S.toggle({ labelKey: p.key.replace("pl.", "sw."), value: false, on: function (b) { p.on = b; upd(); } });
    });
    S.group("sw.speed");
    S.slider({
      labelKey: "sw.speed", min: 0, max: 5000, value: daysPerSecond, step: 10,
      format: function (v) { return Math.round(v) + " d/s"; },
      on: function (v) { daysPerSecond = v; }
    });
    var loop = S.loop(function (dt) { step(dt); });
    var pp = S.playPause(loop);
    S.button({ labelKey: "sw.reset", on: function () { days = 0; trail = []; upd(); } });
    var outOffset = S.readout({ labelKey: "sw.rOffset" });
    var outAmp = S.readout({ labelKey: "sw.rAmp" });

    /* ---- body_Update: every active planet drags the Sun off centre ---- */
    function step(dt) {
      var daysElapsed = daysPerSecond * dt;
      days += daysElapsed;
      var dx = 0, dy = 0;
      PLANETS.forEach(function (p) {
        if (!p.on) return;
        var portion = daysElapsed / p.period;
        portion -= Math.floor(portion);                    // the SWF drops whole orbits between frames
        p.angle -= portion * 360;
        if (p.angle < 0) p.angle += 360;
        dx -= Math.cos(p.angle * TAU / 360) * p.pull;
        dy -= Math.sin(p.angle * TAU / 360) * p.pull;
      });
      sunX = SUN.x + dx; sunY = SUN.y + dy;
      pushTrail(sunX, sunY);
      upd();
    }
    // a new point only once the star is a segment's length from the one before last,
    // otherwise the newest point simply follows the star (the SWF pops and re-adds it)
    function pushTrail(x, y) {
      var prev = trail[trail.length - 2];
      if (prev && Math.hypot(x - prev.x, y - prev.y) < TRAIL_MIN_STEP) trail.pop();
      else trail.forEach(function (pt) { pt.a = Math.max(0, pt.a - 0.01); });
      trail.push({ x: x, y: y, a: 1 });
      if (trail.length > TRAIL_MAX) trail.shift();
    }
    function upd() {
      var off = Math.hypot(sunX - SUN.x, sunY - SUN.y);
      outOffset((off / GLOBE_R).toFixed(2) + I18N.t("sw.solarRadii"));
      var on = PLANETS.filter(function (p) { return p.on; });
      if (!on.length) outAmp(I18N.t("sw.none"));
      else {
        var big = on.reduce(function (a, b) { return b.pull > a.pull ? b : a; });
        outAmp(I18N.t(big.key) + " · " + (big.pull / GLOBE_R).toFixed(2) + I18N.t("sw.solarRadii"));
      }
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);

      var glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, GLOW_R);
      glow.addColorStop(0, "rgba(255,255,128,1)");
      glow.addColorStop(112 / 255, "rgba(255,255,128,1)");
      glow.addColorStop(126 / 255, "rgba(255,255,139,0.5)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(sunX, sunY, GLOW_R, 0, TAU); ctx.fill();
      var globe = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, GLOBE_R);
      globe.addColorStop(0, "#fecb00"); globe.addColorStop(73 / 255, "#fecb00");
      globe.addColorStop(225 / 255, "#fea000"); globe.addColorStop(1, "#fe9100");
      ctx.fillStyle = globe;
      ctx.beginPath(); ctx.arc(sunX, sunY, GLOBE_R, 0, TAU); ctx.fill();

      ctx.strokeStyle = "#00ff00"; ctx.lineWidth = 3;      // gravityCenter, drawn over the star
      ctx.beginPath();
      ctx.moveTo(SUN.x - 14, SUN.y); ctx.lineTo(SUN.x + 14, SUN.y);
      ctx.moveTo(SUN.x, SUN.y - 14); ctx.lineTo(SUN.x, SUN.y + 14);
      ctx.stroke();

      if (trail.length > 1) {                              // the sunpath clips sit above the star
        ctx.lineWidth = 2; ctx.lineCap = "round";
        for (var i = 1; i < trail.length; i++) {
          var a = trail[i - 1], b = trail[i];
          ctx.strokeStyle = "rgba(255,255,255," + a.a.toFixed(3) + ")";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = "#ff9900"; ctx.font = "20px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("sw.title"), 265, 18);
      ctx.font = "16px " + FONT; ctx.textAlign = "right";
      ctx.fillText(t("sw.years"), 249, 48.4);
      ctx.fillStyle = "#ffffff"; ctx.textAlign = "left";
      ctx.fillText((days / 365).toFixed(1), 256, 48.4);
    });

    upd();
    loop.play(); pp.sync();
  }
});
