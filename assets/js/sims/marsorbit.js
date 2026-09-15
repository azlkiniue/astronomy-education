/* Ptolemaic Orbit of Mars ------------------------------------------------------
   Faithful rebuild of the ClassAction "marsorbit.swf" (MarsOrbitClass and
   SunsOrbitClass, decompiled), using the orbital parameters the SWF passes in:
   P = 1.881 yr, apogee 106.67°, deferent radius 60, epicycle radius 39.5,
   eccentricity 6 (all × 2.5), κ₀ = 3.53°, α₀ = 327.22°.

   Earth sits still at the centre. Mars rides an epicycle whose centre travels
   round an off-centre deferent — uniformly not about Earth, nor about the
   deferent's centre, but about the equant, the point as far beyond the centre as
   Earth is before it. The epicycle arm turns once a year, always parallel to the
   Earth–Sun line, which is what produces the retrograde loops in Mars's fading
   trail. The Sun has its own small eccentric circle, drawn in grey.            */
Sim.create({
  id: "marsorbit",
  width: 560, height: 550,
  strings: {
    en: {
      "mo.anim": "Animation", "mo.speed": "animation speed", "mo.slow": "slow", "mo.fast": "fast",
      "mo.show": "Show", "mo.labels": "labels", "mo.equant": "equant and deferent centre",
      "mo.trail": "Mars's path",
      "mo.rTime": "time elapsed", "mo.rMotion": "Mars appears to move", "mo.yr": " yr",
      "mo.pro": "eastward (prograde)", "mo.retro": "westward (retrograde)",
      "lb.earth": "Earth", "lb.sun": "Sun", "lb.mars": "Mars", "lb.equant": "equant", "lb.center": "centre",
      "lb.deferent": "deferent", "lb.epicycle": "epicycle"
    },
    id: {
      "mo.anim": "Animasi", "mo.speed": "kecepatan animasi", "mo.slow": "lambat", "mo.fast": "cepat",
      "mo.show": "Tampilkan", "mo.labels": "label", "mo.equant": "ekuan dan pusat deferen",
      "mo.trail": "lintasan Mars",
      "mo.rTime": "waktu berlalu", "mo.rMotion": "Mars tampak bergerak", "mo.yr": " th",
      "mo.pro": "ke timur (prograd)", "mo.retro": "ke barat (retrograd)",
      "lb.earth": "Bumi", "lb.sun": "Matahari", "lb.mars": "Mars", "lb.equant": "ekuan", "lb.center": "pusat",
      "lb.deferent": "deferen", "lb.epicycle": "episiklus"
    }
  },
  about: {
    en: "<p>Claudius Ptolemy's <em>Almagest</em> (c. 150 CE) explained the wandering planets with circles on circles while keeping Earth fixed at the centre. Each planet moves on a small circle, the <strong>epicycle</strong>, whose centre moves on a large circle, the <strong>deferent</strong>.</p>" +
        "<p>For the superior planets the epicycle does a remarkable job: its arm turns once a year and stays parallel to the line from Earth to the Sun, so it quietly reproduces Earth's own orbit. When Mars is on the inner side of its epicycle the two motions oppose each other and Mars seems to back up against the stars — a <strong>retrograde loop</strong>, exactly at opposition, as observed.</p>" +
        "<p>To match the uneven speed of the planets Ptolemy added two refinements: the deferent is off-centre from Earth, and the epicycle's centre moves at a steady rate not as seen from Earth or from the deferent's centre but from a third point, the <strong>equant</strong>. The model predicted planetary positions to within a degree or so for fourteen centuries, until Kepler replaced all these circles with a single ellipse.</p>",
    id: "<p><em>Almagest</em> karya Claudius Ptolemaeus (sekitar 150 M) menjelaskan planet-planet yang mengembara dengan lingkaran di atas lingkaran sambil tetap menaruh Bumi diam di pusat. Setiap planet bergerak pada lingkaran kecil, <strong>episiklus</strong>, yang pusatnya bergerak pada lingkaran besar, <strong>deferen</strong>.</p>" +
        "<p>Untuk planet superior episiklus bekerja luar biasa: lengannya berputar sekali setahun dan tetap sejajar dengan garis dari Bumi ke Matahari, sehingga diam-diam meniru orbit Bumi sendiri. Saat Mars berada di sisi dalam episiklusnya kedua gerak saling berlawanan dan Mars tampak mundur terhadap bintang — sebuah <strong>simpul retrograd</strong>, tepat saat oposisi, sesuai pengamatan.</p>" +
        "<p>Untuk mencocokkan kecepatan planet yang tidak rata, Ptolemaeus menambahkan dua penyempurnaan: deferen digeser dari Bumi, dan pusat episiklus bergerak dengan laju tetap bukan dilihat dari Bumi atau dari pusat deferen melainkan dari titik ketiga, <strong>ekuan</strong>. Model ini meramalkan posisi planet dengan ketelitian sekitar satu derajat selama empat belas abad, hingga Kepler menggantikan semua lingkaran itu dengan satu elips.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180, TAU = Math.PI * 2;
    var O = { x: 282, y: 282 };                      // both orbit clips sit here; Earth at their origin
    /* ---- MarsOrbitClass, with setOrbitalParameters' values ---- */
    var MARS = { sf: 2.5, P: 1.881, apogee: 106.67, kappaAtEpoch: 3.53, alphaAtEpoch: 327.22 };
    var e = 6 * MARS.sf, dR = 60 * MARS.sf, eR = 39.5 * MARS.sf;
    var kappa0 = D2R * (MARS.kappaAtEpoch - MARS.apogee);
    var gamma0 = D2R * (MARS.alphaAtEpoch + MARS.kappaAtEpoch - MARS.apogee);
    /* ---- SunsOrbitClass ---- */
    var SUN = { sf: 1.64, apogee: 65.5, kappaAtEpoch: 265.25 };
    var eS = 2.5 * SUN.sf, dRS = 60 * SUN.sf;
    var C = { earth: "#3399ff", sun: "#ffcc00", mars: "#ff0000", sunOrbit: "#a0a0a0", ink: "#000000" };

    var LINE_SEGMENTS = 175, MAX_STEP = 0.02, MIN_STEP = 0.002;
    var time = 0, timeLast = -0.002, trail = [], speed = 0.01;
    var showLabels = false, showEquant = false, showTrail = true, prevLon = null, motion = "";

    /* ================================ controls ================================ */
    S.group("mo.anim");
    var loop = S.loop(function (dt) {
      time += speed * 20 * dt;                      // the SWF adds `speed` every frame at 20 fps
      setTime(time);
      upd();
    });
    var pp = S.playPause(loop);
    S.slider({
      labelKey: "mo.speed", min: 0, max: 0.08, value: speed, step: 0.0005,
      format: function (v) { return (v * 20).toFixed(2) + " yr/s"; },
      on: function (v) { speed = v; }
    });
    S.group("mo.show");
    S.toggle({ labelKey: "mo.trail", value: showTrail, on: function (b) { showTrail = b; } });
    S.toggle({ labelKey: "mo.labels", value: showLabels, on: function (b) { showLabels = b; } });
    S.toggle({ labelKey: "mo.equant", value: showEquant, on: function (b) { showEquant = b; } });
    var outTime = S.readout({ labelKey: "mo.rTime" });
    var outMotion = S.readout({ labelKey: "mo.rMotion" });

    // MarsOrbitClass.setTime(): positions in the clip's frame (x toward apogee, y up)
    function marsAt(t) {
      var kappa = kappa0 + t * TAU / MARS.P, sk = Math.sin(kappa), ck = Math.cos(kappa);
      var m = -e * ck + Math.sqrt(dR * dR - e * e * sk * sk);   // equant → deferent, along κ
      var cx = 2 * e + m * ck, cy = m * sk;
      var gamma = gamma0 + TAU * t;
      return { cx: cx, cy: cy, px: cx + eR * Math.cos(gamma), py: -(cy + eR * Math.sin(gamma)) };
    }
    function setTime(arg) {
      var dT = arg - timeLast;
      if (Math.abs(dT) < MIN_STEP) return;
      var n = Math.ceil(Math.abs(dT / MAX_STEP)), step = dT / n;
      for (var i = 0; i < n; i++) {
        var p = marsAt(timeLast + i * step);
        trail.push({ x: p.px, y: p.py });
        if (trail.length > LINE_SEGMENTS + 1) trail.shift();
      }
      timeLast = arg;
      // apparent direction from Earth, for the readout (clip rotation doesn't change the sense)
      var q = marsAt(arg), lon = Math.atan2(-q.py, q.px);
      if (prevLon !== null) {
        var dl = ((lon - prevLon + 3 * Math.PI) % TAU) - Math.PI;
        if (Math.abs(dl) > 1e-6) motion = dl > 0 ? "mo.pro" : "mo.retro";
      }
      prevLon = lon;
    }
    function upd() {
      outTime(time.toFixed(2) + I18N.t("mo.yr"));
      outMotion(motion ? I18N.t(motion) : "–");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, S.W, S.H);

      var p = marsAt(timeLast);
      // ---- Mars's clip (rotated by −apogee) ----
      ctx.save();
      ctx.translate(O.x, O.y); ctx.rotate(-MARS.apogee * D2R);
      if (showTrail && trail.length > 1) {
        ctx.lineWidth = 1;
        for (var i = 1; i < trail.length; i++) {
          var age = trail.length - 1 - i;             // newest segment at 100 %, fading by 100/175 each
          ctx.strokeStyle = "rgba(255,0,0," + Math.max(0, 1 - age / LINE_SEGMENTS).toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(trail[i - 1].x, trail[i - 1].y); ctx.lineTo(trail[i].x, trail[i].y); ctx.stroke();
        }
      }
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(e, 0, dR, 0, TAU); ctx.stroke();                 // deferent
      ctx.beginPath(); ctx.arc(p.cx, -p.cy, eR, 0, TAU); ctx.stroke();         // epicycle
      if (showEquant) {
        ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(2 * e, 0); ctx.lineTo(p.cx, -p.cy); ctx.lineTo(p.px, p.py); ctx.stroke();
        ctx.setLineDash([]);
        dot(ctx, 2 * e, 0, 2.6, "#555555");
        cross(ctx, e, 0);
      }
      dot(ctx, p.px, p.py, 7, C.mars);
      var mars = toStage(p.px, p.py, MARS.apogee), epi = toStage(p.cx, -p.cy, MARS.apogee);
      var equant = toStage(2 * e, 0, MARS.apogee), center = toStage(e, 0, MARS.apogee);
      ctx.restore();

      // ---- the Sun's clip (rotated by −65.5°) ----
      var ks = D2R * SUN.kappaAtEpoch + timeLast * TAU;
      ctx.save();
      ctx.translate(O.x, O.y); ctx.rotate(-SUN.apogee * D2R);
      ctx.strokeStyle = C.sunOrbit; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(eS, 0, dRS, 0, TAU); ctx.stroke();
      var sx = eS + dRS * Math.cos(ks), sy = -dRS * Math.sin(ks);
      dot(ctx, sx, sy, 7, C.sun);
      var sun = toStage(sx, sy, SUN.apogee);
      ctx.restore();

      dot(ctx, O.x, O.y, 6.6, C.earth);

      if (showLabels) {
        // the equant, the deferent's centre and Earth lie on one line: fan their labels out along it
        var ux = (equant.x - O.x) / (2 * e), uy = (equant.y - O.y) / (2 * e);
        label(ctx, t("lb.earth"), O.x - ux * 18, O.y - uy * 18 + 4);
        label(ctx, t("lb.sun"), sun.x, sun.y - 14);
        label(ctx, t("lb.mars"), mars.x, mars.y - 14);
        label(ctx, t("lb.epicycle"), epi.x - eR - 34, epi.y);
        label(ctx, t("lb.deferent"), center.x, center.y + dR + 12);
        if (showEquant) {
          label(ctx, t("lb.equant"), equant.x + ux * 26, equant.y + uy * 26);
          label(ctx, t("lb.center"), center.x - uy * 30, center.y + ux * 30);
        }
      }
    });

    function toStage(x, y, rotDeg) {
      var a = -rotDeg * D2R, c = Math.cos(a), s = Math.sin(a);
      return { x: O.x + x * c - y * s, y: O.y + x * s + y * c };
    }
    function dot(ctx, x, y, r, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    function cross(ctx, x, y) {
      ctx.strokeStyle = "#555555"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4); ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4); ctx.stroke();
    }
    function label(ctx, s, x, y) {
      ctx.font = "12px Verdana, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.strokeText(s, x, y);
      ctx.fillStyle = "#222222"; ctx.fillText(s, x, y);
    }

    setTime(0);
    upd();
    loop.play(); pp.sync();
  }
});
