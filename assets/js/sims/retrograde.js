/* Retrograde Motion -----------------------------------------------------------
   Faithful rebuild of the ClassAction "Retrograde Motion" animation
   (retrograde.swf): the apparent westward motion of a superior planet, shown as
   ONE unified scene.
     • a sky of background constellations with EAST / WEST, the planet drawn among
       them at its apparent position, leaving a trail that hooks westward then east
       again (the retrograde loop),
     • a small orbital diagram at the bottom (Sun, Earth, Mars) with the Earth→Mars
       line of sight extended all the way up to the planet among the stars,
     • a TIMELINE scrubber (drag it, or press play) that runs through the months
       around opposition.                                                          */
Sim.create({
  id: "retrograde",
  width: 760, height: 600,
  strings: {
    en: {
      "rg.title": "RETROGRADE MOTION", "rg.sub": "the apparent westward motion of a superior planet",
      "rg.timeline": "timeline", "rg.play": "play", "rg.pause": "pause", "rg.rate": "speed",
      "rg.show": "Show", "rg.sight": "show line of sight", "rg.lines": "show constellation lines", "rg.trail": "show trail",
      "rg.motion": "apparent motion", "rg.elong": "elongation", "rg.day": "days from opposition",
      "rg.prograde": "prograde (eastward)", "rg.retro": "retrograde (westward)",
      "rg.east": "EAST", "rg.west": "WEST"
    },
    id: {
      "rg.title": "GERAK RETROGRAD", "rg.sub": "gerak tampak ke barat dari planet superior",
      "rg.timeline": "garis waktu", "rg.play": "putar", "rg.pause": "jeda", "rg.rate": "kecepatan",
      "rg.show": "Tampilkan", "rg.sight": "tampilkan garis pandang", "rg.lines": "tampilkan garis rasi", "rg.trail": "tampilkan jejak",
      "rg.motion": "gerak tampak", "rg.elong": "elongasi", "rg.day": "hari dari oposisi",
      "rg.prograde": "prograd (ke timur)", "rg.retro": "retrograd (ke barat)",
      "rg.east": "TIMUR", "rg.west": "BARAT"
    }
  },
  about: {
    en: "<p>Mars normally drifts <strong>eastward</strong> against the background stars night after night. But around <em>opposition</em> it slows, halts, and loops <strong>westward</strong> for a few weeks before resuming — its <strong>retrograde motion</strong>. Ancient astronomers built elaborate epicycle machinery to explain it.</p>" +
        "<p>The cause is simple, and you can scrub through it here: Earth orbits faster on a smaller, inner track. Near opposition, Earth catches up to and overtakes the slower outer planet, like a fast car passing a slow one — and during the overtaking the planet appears to slide backward against the distant stars.</p>" +
        "<p>The line of sight runs from Earth, through Mars, all the way out to the planet's apparent position among the constellations. Drag the timeline and watch the trail: it advances eastward, hooks back westward as Earth passes, then moves on.</p>",
    id: "<p>Mars biasanya bergeser <strong>ke timur</strong> terhadap latar bintang dari malam ke malam. Namun di sekitar <em>oposisi</em> ia melambat, berhenti, lalu berputar <strong>ke barat</strong> selama beberapa minggu sebelum lanjut — inilah <strong>gerak retrograd</strong>. Astronom kuno membangun mekanisme episiklus rumit untuk menjelaskannya.</p>" +
        "<p>Penyebabnya sederhana: Bumi mengorbit lebih cepat di lintasan dalam yang lebih kecil. Dekat oposisi, Bumi menyusul dan melewati planet luar yang lebih lambat, seperti mobil cepat menyalip mobil lambat — dan saat menyalip, planet tampak meluncur mundur terhadap bintang jauh.</p>" +
        "<p>Garis pandang membentang dari Bumi, melalui Mars, hingga ke posisi tampak planet di antara rasi bintang. Seret garis waktu dan amati jejaknya: maju ke timur, berbelok ke barat saat Bumi menyalip, lalu lanjut.</p>"
  },
  build: function (S) {
    var C = { sun: "#ffd166", earth: "#6ea8fe", earthOrbit: "#3b6fd6", mars: "#e8794f",
              marsOrbit: "#4cd4a0", sight: "#d089ff", text: "#e8ecf8", dim: "#9fabce",
              border: "#2c3a66", star: "#cdd7f5", trail: "#ff7a59", con: "#5a6a9a" };
    var TAU = Math.PI * 2, D2R = Math.PI / 180, R2D = 180 / Math.PI;
    var PMARS = 1.881;                 // Mars sidereal period (yr)
    var tYr = 0, rate = 0.06;          // t in years from opposition
    var tMin = -0.30, tMax = 0.30;

    // scene geometry
    var sunX = 380, sunY = 556, rE = 34, rM = 52;
    var eclY = 150;                    // apparent-ecliptic line in the sky
    var SKY = { x: 12, y: 36, w: 736, h: 408 };

    function model(tt) {
      var aE = (90 + 360 * tt) * D2R, aM = (90 + 360 / PMARS * tt) * D2R;
      var E = { x: sunX + rE * Math.cos(aE), y: sunY - rE * Math.sin(aE) };
      var M = { x: sunX + rM * Math.cos(aM), y: sunY - rM * Math.sin(aM) };
      var dx = M.x - E.x, dy = M.y - E.y;
      var appX = (dy < -0.5) ? E.x + (eclY - E.y) * (dx / dy) : E.x;
      appX = Math.max(SKY.x + 16, Math.min(SKY.x + SKY.w - 16, appX));
      // physical apparent longitude (y up) for prograde/retrograde + elongation
      var Ep = { x: rE * Math.cos(aE), y: rE * Math.sin(aE) }, Mp = { x: rM * Math.cos(aM), y: rM * Math.sin(aM) };
      var lam = Math.atan2(Mp.y - Ep.y, Mp.x - Ep.x);
      var elong = Math.acos(Math.max(-1, Math.min(1, (((-Ep.x) * (Mp.x - Ep.x) + (-Ep.y) * (Mp.y - Ep.y)) /
        (Math.hypot(Ep.x, Ep.y) * Math.hypot(Mp.x - Ep.x, Mp.y - Ep.y) || 1)))));
      return { E: E, M: M, appX: appX, lam: lam, elong: elong * R2D };
    }

    /* ---- controls ---- */
    S.group("rg.timeline");
    var syncing = false;   // true while the loop nudges the slider, so its handler doesn't snap tYr back to whole days
    var tlCtl = S.slider({ labelKey: "rg.timeline", min: Math.round(tMin * 365), max: Math.round(tMax * 365), step: 1, value: 0,
      format: function (v) { return (v > 0 ? "+" : "") + v + " d"; }, on: function (v) { if (syncing) return; tYr = v / 365; upd(); } });
    function showTime() { syncing = true; tlCtl.set(Math.round(tYr * 365)); syncing = false; }  // tYr stays a float
    var loop = S.loop(function (dt) {
      tYr += rate * dt;
      if (tYr >= tMax) { tYr = tMax; loop.pause(); syncPlay(); }
      showTime(); upd();
    });
    var playBtn = S.button({ labelKey: "rg.play", primary: true, on: function () {
      if (!loop.playing && tYr >= tMax - 1e-6) { tYr = tMin; showTime(); }
      loop.toggle(); syncPlay();
    } });
    function syncPlay() { var k = loop.playing ? "rg.pause" : "rg.play"; playBtn.setAttribute("data-i18n", k); playBtn.textContent = I18N.t(k); }
    S.refreshers.push(syncPlay);
    S.slider({ labelKey: "rg.rate", min: 0.01, max: 0.2, step: 0.01, value: rate,
      format: function (v) { return v.toFixed(2) + " yr/s"; }, on: function (v) { rate = v; } });

    S.group("rg.show");
    var optSight = S.toggle({ labelKey: "rg.sight", value: true });
    var optLines = S.toggle({ labelKey: "rg.lines", value: true });
    var optTrail = S.toggle({ labelKey: "rg.trail", value: true });

    var oMotion = S.readout({ labelKey: "rg.motion" });
    var oElong = S.readout({ labelKey: "rg.elong" });
    var oDay = S.readout({ labelKey: "rg.day" });

    function upd() {
      var m = model(tYr), m2 = model(tYr + 0.002);
      var dlam = m2.lam - m.lam; if (dlam > Math.PI) dlam -= TAU; if (dlam < -Math.PI) dlam += TAU;
      oMotion(I18N.t(dlam >= 0 ? "rg.prograde" : "rg.retro"));
      oElong(m.elong.toFixed(1) + "°");
      oDay((tYr > 0 ? "+" : "") + Math.round(tYr * 365));
      S.requestDraw();
    }

    /* ---- fixed background sky ---- */
    var bgStars = [], cons = [];
    (function () {
      var s = 9281; function rnd() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }
      for (var i = 0; i < 120; i++) bgStars.push({ x: SKY.x + rnd() * SKY.w, y: SKY.y + 8 + rnd() * (SKY.h - 30), m: rnd() });
      // a handful of simple constellation figures spread across the sky
      var centers = [[90, 120], [220, 230], [350, 95], [500, 200], [640, 130], [300, 300], [560, 320]];
      centers.forEach(function (ce) {
        var n = 4 + Math.floor(rnd() * 3), pts = [];
        for (var j = 0; j < n; j++) pts.push([ce[0] + (rnd() - 0.5) * 70, ce[1] + (rnd() - 0.5) * 60]);
        var edges = []; for (var k = 1; k < n; k++) edges.push([k - 1, k]);
        cons.push({ pts: pts, edges: edges });
      });
    })();

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      var m = model(tYr);
      drawSky(ctx, m);
      drawOrbit(ctx, m);
      if (optSight.value()) {           // line of sight: Earth → Mars → apparent position
        ctx.strokeStyle = C.sight; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(m.E.x, m.E.y); ctx.lineTo(m.appX, eclY); ctx.stroke();
      }
      // the planet among the stars
      drawMars(ctx, m.appX, eclY, 7);
      // orbital Earth + Mars on top of the sight line
      drawOrbitBodies(ctx, m);
    });

    function drawSky(ctx, m) {
      panel(ctx, SKY);
      ctx.save(); roundRectPath(ctx, SKY.x, SKY.y, SKY.w, SKY.h, 10); ctx.clip();
      // background stars
      bgStars.forEach(function (st) {
        ctx.globalAlpha = 0.3 + st.m * 0.6; ctx.fillStyle = C.star;
        ctx.beginPath(); ctx.arc(st.x, st.y, 0.6 + st.m * 1.3, 0, TAU); ctx.fill();
      });
      ctx.globalAlpha = 1;
      // constellation figures
      cons.forEach(function (con) {
        if (optLines.value()) {
          ctx.strokeStyle = C.con; ctx.lineWidth = 1;
          con.edges.forEach(function (e) { ctx.beginPath(); ctx.moveTo(con.pts[e[0]][0], con.pts[e[0]][1]); ctx.lineTo(con.pts[e[1]][0], con.pts[e[1]][1]); ctx.stroke(); });
        }
        con.pts.forEach(function (p) { ctx.fillStyle = "#dfe7ff"; ctx.beginPath(); ctx.arc(p[0], p[1], 1.8, 0, TAU); ctx.fill(); });
      });
      // ecliptic guide line
      ctx.strokeStyle = "rgba(255,209,102,0.4)"; ctx.lineWidth = 1; ctx.setLineDash([6, 5]);
      ctx.beginPath(); ctx.moveTo(SKY.x + 8, eclY); ctx.lineTo(SKY.x + SKY.w - 8, eclY); ctx.stroke(); ctx.setLineDash([]);

      // trail = apparent path sampled from opposition-start up to now, descending with age (so the hook shows)
      if (optTrail.value()) {
        ctx.lineWidth = 2; ctx.beginPath(); var started = false;
        for (var tt = tMin; tt <= tYr + 1e-9; tt += (tMax - tMin) / 160) {
          var ax = model(tt).appX, ay = eclY + (tYr - tt) / (tMax - tMin) * 150;
          started ? ctx.lineTo(ax, ay) : (ctx.moveTo(ax, ay), started = true);
        }
        ctx.strokeStyle = C.trail; ctx.globalAlpha = 0.85; ctx.stroke(); ctx.globalAlpha = 1;
      }
      ctx.restore();

      // title + cardinals
      ctx.fillStyle = C.text; ctx.font = "bold 16px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("rg.title"), SKY.x + SKY.w / 2, SKY.y + 22);
      ctx.fillStyle = C.dim; ctx.font = "11px system-ui";
      ctx.fillText(I18N.t("rg.sub"), SKY.x + SKY.w / 2, SKY.y + 38);
      ctx.fillStyle = "#cfe0ff"; ctx.font = "bold 12px system-ui"; ctx.textAlign = "left";
      ctx.fillText(I18N.t("rg.east"), SKY.x + 14, eclY - 8);
      ctx.textAlign = "right"; ctx.fillText(I18N.t("rg.west"), SKY.x + SKY.w - 14, eclY - 8);
      ctx.textAlign = "left";
    }

    function drawOrbit(ctx, m) {
      // orbit circles + Sun (bodies drawn later, above the sight line)
      ctx.strokeStyle = C.earthOrbit; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(sunX, sunY, rE, 0, TAU); ctx.stroke();
      ctx.strokeStyle = C.marsOrbit; ctx.beginPath(); ctx.arc(sunX, sunY, rM, 0, TAU); ctx.stroke();
      var sg = ctx.createRadialGradient(sunX, sunY, 1, sunX, sunY, 12);
      sg.addColorStop(0, "#fff6cf"); sg.addColorStop(1, C.sun);
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sunX, sunY, 8, 0, TAU); ctx.fill();
    }
    function drawOrbitBodies(ctx, m) {
      ctx.fillStyle = C.earth; ctx.beginPath(); ctx.arc(m.E.x, m.E.y, 4.5, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#dce6ff"; ctx.lineWidth = 1; ctx.stroke();
      drawMars(ctx, m.M.x, m.M.y, 4.5);
      ctx.fillStyle = C.dim; ctx.font = "10px system-ui"; ctx.textAlign = "center";
      ctx.fillText("Earth", m.E.x, m.E.y + 15); ctx.fillText("Mars", m.M.x, m.M.y - 9);
    }
    function drawMars(ctx, x, y, r) {
      var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
      g.addColorStop(0, "#ffd2ad"); g.addColorStop(1, C.mars);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#2a0f08"; ctx.lineWidth = 0.8; ctx.stroke();
    }

    function panel(ctx, A) { roundRectPath(ctx, A.x, A.y, A.w, A.h, 10); ctx.fillStyle = "#05070f"; ctx.fill();
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.stroke(); }
    function roundRectPath(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    upd();
  }
});
