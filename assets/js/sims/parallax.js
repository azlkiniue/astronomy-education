/* Parallax Explorer -----------------------------------------------------------
   Faithful rebuild of the NAAP "Parallax Explorer" (parallaxExplorer.swf), which
   teaches stellar parallax with a boat-on-a-lake analogy:
     • a top-down Map — a lake with a boat, and a road (baseline) along which the
       observer moves; sight lines from each measurement triangulate the boat,
     • an Observer's View — the boat seen against distant hills, shifting as the
       observer moves (the parallax),
     • Controls — presets, a measurement-error slider, take/clear measurement,
       show ruler — and readouts of the estimated vs. true distance.
   Map scale: 20 m per ruler unit.                                               */
Sim.create({
  id: "parallax",
  width: 760, height: 560,
  strings: {
    en: {
      "px.controls": "Controls", "px.preset": "set parameters for", "px.obs": "observer position", "px.error": "measurement error",
      "px.take": "take measurement", "px.clear": "clear measurements", "px.ruler": "show ruler",
      "px.map": "Map", "px.view": "Observer's View", "px.lake": "lake", "px.road": "road",
      "px.meas": "measurements", "px.baseline": "baseline", "px.est": "estimated distance", "px.true": "true distance", "px.errpct": "distance error",
      "px.scale": "map scale: 20 m per ruler unit", "px.results": "Triangulation"
    },
    id: {
      "px.controls": "Kontrol", "px.preset": "atur parameter untuk", "px.obs": "posisi pengamat", "px.error": "galat pengukuran",
      "px.take": "ambil pengukuran", "px.clear": "hapus pengukuran", "px.ruler": "tampilkan penggaris",
      "px.map": "Peta", "px.view": "Tampilan Pengamat", "px.lake": "danau", "px.road": "jalan",
      "px.meas": "pengukuran", "px.baseline": "garis dasar", "px.est": "jarak perkiraan", "px.true": "jarak sebenarnya", "px.errpct": "galat jarak",
      "px.scale": "skala peta: 20 m per satuan penggaris", "px.results": "Triangulasi"
    }
  },
  about: {
    en: "<p><strong>Parallax</strong> is how we measure distance by triangulation: a nearby object shifts against a far background when viewed from two ends of a known <strong>baseline</strong>. Here the baseline is a road, the object is a boat, and the background is the distant hills.</p>" +
        "<p>Move the observer along the road and <strong>take a measurement</strong> from at least two spots. The sight lines cross at the boat — and where they cross tells you its distance. A longer baseline (or a closer boat) gives a sharper crossing and a better distance.</p>" +
        "<p>Add some <strong>measurement error</strong> and watch the crossing smear out: this is exactly why measuring a star's distance is hard. Astronomers use Earth's orbit (a baseline of 2 AU) as the road and the faraway stars as the hills.</p>",
    id: "<p><strong>Paralaks</strong> adalah cara mengukur jarak dengan triangulasi: objek dekat bergeser terhadap latar jauh bila dilihat dari dua ujung <strong>garis dasar</strong> yang diketahui. Di sini garis dasarnya jalan, objeknya perahu, latarnya bukit jauh.</p>" +
        "<p>Gerakkan pengamat sepanjang jalan dan <strong>ambil pengukuran</strong> dari sedikitnya dua titik. Garis pandang berpotongan di perahu — dan letak perpotongannya menunjukkan jaraknya. Garis dasar lebih panjang (atau perahu lebih dekat) memberi perpotongan lebih tajam dan jarak lebih baik.</p>" +
        "<p>Tambahkan <strong>galat pengukuran</strong> dan lihat perpotongannya mengabur: inilah sebabnya mengukur jarak bintang itu sulit. Astronom memakai orbit Bumi (garis dasar 2 SA) sebagai jalan dan bintang jauh sebagai bukit.</p>"
  },
  build: function (S) {
    var ROADLEN = 240, LAKEDEPTH = 480;        // metres
    var PRESETS = { "Preset A": { bx: 130, by: 130 }, "Preset B": { bx: 120, by: 270 }, "Preset C": { bx: 140, by: 430 } };
    var boat = { bx: 130, by: 130 }, obs = 60, errDeg = 0, meas = [];

    function bearing(ox) { return Math.atan2(boat.by, boat.bx - ox); }   // rad, from +x road axis
    function intersect(m1, m2) {
      var c1 = Math.cos(m1.ang), s1 = Math.sin(m1.ang), c2 = Math.cos(m2.ang), s2 = Math.sin(m2.ang);
      if (Math.abs(s2) < 1e-6 || Math.abs(s1 * c2 / s2 - c1) < 1e-6) return null;
      var t1 = (m2.ox - m1.ox) / (c1 - s1 * c2 / s2);
      return { x: m1.ox + t1 * c1, y: t1 * s1 };
    }
    function estimate() {                        // average of pairwise intersections
      if (meas.length < 2) return null;
      var sx = 0, sy = 0, n = 0;
      for (var i = 0; i < meas.length; i++) for (var j = i + 1; j < meas.length; j++) {
        var p = intersect(meas[i], meas[j]); if (p && p.y > 0 && p.y < 5000) { sx += p.x; sy += p.y; n++; }
      }
      return n ? { x: sx / n, y: sy / n } : null;
    }

    /* ---- controls ---- */
    S.group("px.controls");
    S.select({ labelKey: "px.preset", value: "Preset A",
      options: Object.keys(PRESETS).map(function (n) { return { v: n, label: n }; }),
      on: function (v) { boat = { bx: PRESETS[v].bx, by: PRESETS[v].by }; meas = []; upd(); } });
    var obsCtl = S.slider({ labelKey: "px.obs", min: 0, max: ROADLEN, step: 1, value: obs, unit: " m", on: function (v) { obs = v; S.requestDraw(); } });
    S.slider({ labelKey: "px.error", min: 0, max: 3, step: 0.1, value: errDeg, format: function (v) { return v.toFixed(1) + "°"; }, on: function (v) { errDeg = v; } });
    S.button({ labelKey: "px.take", primary: true, on: function () {
      var err = (Math.random() * 2 - 1) * errDeg * Math.PI / 180;
      meas.push({ ox: obs, ang: bearing(obs) + err }); upd();
    } });
    S.button({ labelKey: "px.clear", on: function () { meas = []; upd(); } });
    var optRuler = S.toggle({ labelKey: "px.ruler", value: false });

    var oMeas = S.readout({ labelKey: "px.meas" });
    var oBase = S.readout({ labelKey: "px.baseline" });
    var oEst = S.readout({ labelKey: "px.est" });
    var oTrue = S.readout({ labelKey: "px.true" });
    var oErr = S.readout({ labelKey: "px.errpct" });

    function upd() {
      oMeas(String(meas.length));
      var base = meas.length >= 2 ? (Math.max.apply(null, meas.map(function (m) { return m.ox; })) - Math.min.apply(null, meas.map(function (m) { return m.ox; }))) : 0;
      oBase(base.toFixed(0) + " m");
      var est = estimate();
      oEst(est ? est.y.toFixed(1) + " m" : "—");
      oTrue(boat.by.toFixed(1) + " m");
      oErr(est ? (100 * Math.abs(est.y - boat.by) / boat.by).toFixed(1) + "%" : "—");
      S.requestDraw();
    }

    /* ---- drag the observer on the map ---- */
    var MAP = { x: 12, y: 28, w: 416, h: 512 };
    var VIEW = { x: 440, y: 28, w: 308, h: 184 };
    var RES = { x: 440, y: 224, w: 308, h: 316 };
    function mapX(mx) { return MAP.x + 18 + (mx / ROADLEN) * (MAP.w - 36); }
    function mapY(my) { return (MAP.y + MAP.h - 40) - (my / LAKEDEPTH) * (MAP.h - 80); }
    var roadScreenY = MAP.y + MAP.h - 40;
    function evtPos(e) { var r = S.canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * (S.W / r.width), y: (e.clientY - r.top) * (S.H / r.height) }; }
    var drag = false;
    S.canvas.addEventListener("pointerdown", function (e) {
      var p = evtPos(e);
      if (Math.abs(p.y - roadScreenY) < 28 && p.x > MAP.x && p.x < MAP.x + MAP.w) { drag = true; S.canvas.setPointerCapture(e.pointerId); applyDrag(p); }
    });
    S.canvas.addEventListener("pointermove", function (e) { if (drag) applyDrag(evtPos(e)); else { var p = evtPos(e); S.canvas.style.cursor = (Math.abs(p.y - roadScreenY) < 28 && p.x > MAP.x && p.x < MAP.x + MAP.w) ? "ew-resize" : "default"; } });
    S.canvas.addEventListener("pointerup", function () { drag = false; });
    function applyDrag(p) { var mx = (p.x - MAP.x - 18) / (MAP.w - 36) * ROADLEN; obs = Math.max(0, Math.min(ROADLEN, mx)); obsCtl.set(obs); }

    /* ===================================================================== */
    S.onDraw(function () { var ctx = S.ctx; S.clear(); drawMap(ctx); drawView(ctx); drawResults(ctx); });
    upd();

    function drawMap(ctx) {
      panel(ctx, MAP, I18N.t("px.map"));
      ctx.save(); roundRect(ctx, MAP.x + 1, MAP.y + 1, MAP.w - 2, MAP.h - 2, 11); ctx.clip();
      // lake
      ctx.fillStyle = "#16384a"; ctx.fillRect(MAP.x, MAP.y + 24, MAP.w, roadScreenY - (MAP.y + 24));
      ctx.fillStyle = "#9fd0d8"; ctx.font = "12px system-ui"; ctx.textAlign = "center"; ctx.fillText(I18N.t("px.lake"), MAP.x + MAP.w / 2, MAP.y + 44);
      // ruler grid (every 20 m)
      if (optRuler.value()) {
        ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1; ctx.fillStyle = "rgba(220,235,240,0.5)"; ctx.font = "9px system-ui";
        for (var gx = 0; gx <= ROADLEN; gx += 20) { ctx.beginPath(); ctx.moveTo(mapX(gx), MAP.y + 24); ctx.lineTo(mapX(gx), roadScreenY); ctx.stroke(); }
        for (var gy = 0; gy <= LAKEDEPTH; gy += 20) { ctx.beginPath(); ctx.moveTo(MAP.x + 18, mapY(gy)); ctx.lineTo(MAP.x + MAP.w - 18, mapY(gy)); ctx.stroke(); }
      }
      // stored sight lines
      meas.forEach(function (m) {
        ctx.strokeStyle = "rgba(255,209,102,0.55)"; ctx.lineWidth = 1;
        var x0 = mapX(m.ox), y0 = roadScreenY;
        var far = 4000; var x1 = mapX(m.ox + far * Math.cos(m.ang) / 1), y1 = mapY(far * Math.sin(m.ang));
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.arc(x0, y0, 2.5, 0, 2 * Math.PI); ctx.fill();
      });
      // estimate marker
      var est = estimate();
      if (est) { var ex = mapX(est.x), ey = mapY(est.y); ctx.strokeStyle = "#6ea8fe"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ex, ey, 7, 0, 2 * Math.PI); ctx.stroke(); }
      // current sight line
      ctx.strokeStyle = "rgba(110,168,254,0.5)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(mapX(obs), roadScreenY); ctx.lineTo(mapX(boat.bx), mapY(boat.by)); ctx.stroke(); ctx.setLineDash([]);
      // boat
      boatIcon(ctx, mapX(boat.bx), mapY(boat.by));
      // road
      ctx.fillStyle = "#2a2f3e"; ctx.fillRect(MAP.x, roadScreenY, MAP.w, MAP.y + MAP.h - roadScreenY);
      ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.setLineDash([8, 8]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(MAP.x + 8, roadScreenY + (MAP.y + MAP.h - roadScreenY) / 2); ctx.lineTo(MAP.x + MAP.w - 8, roadScreenY + (MAP.y + MAP.h - roadScreenY) / 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.fillText(I18N.t("px.road"), MAP.x + MAP.w / 2, MAP.y + MAP.h - 8);
      // observer marker (X)
      ctx.strokeStyle = "#ff5b5b"; ctx.lineWidth = 2.5; var ox = mapX(obs);
      ctx.beginPath(); ctx.moveTo(ox - 6, roadScreenY - 6); ctx.lineTo(ox + 6, roadScreenY + 6); ctx.moveTo(ox + 6, roadScreenY - 6); ctx.lineTo(ox - 6, roadScreenY + 6); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#9fabce"; ctx.font = "10px system-ui"; ctx.textAlign = "left"; ctx.fillText(I18N.t("px.scale"), MAP.x + 12, MAP.y + MAP.h + 14);
    }

    function drawView(ctx) {
      panel(ctx, VIEW, I18N.t("px.view"));
      ctx.save(); roundRect(ctx, VIEW.x + 1, VIEW.y + 1, VIEW.w - 2, VIEW.h - 2, 11); ctx.clip();
      var hY = VIEW.y + 30, gY = VIEW.y + VIEW.h * 0.62;
      // sky
      var sg = ctx.createLinearGradient(0, VIEW.y, 0, gY); sg.addColorStop(0, "#3a5a86"); sg.addColorStop(1, "#9fb6cf");
      ctx.fillStyle = sg; ctx.fillRect(VIEW.x, hY, VIEW.w, gY - hY);
      // distant hills (static background)
      ctx.fillStyle = "#3f6b46"; ctx.beginPath(); ctx.moveTo(VIEW.x, gY);
      for (var x = 0; x <= VIEW.w; x += 12) ctx.lineTo(VIEW.x + x, gY - 18 - 14 * Math.sin(x * 0.05) - 8 * Math.cos(x * 0.11));
      ctx.lineTo(VIEW.x + VIEW.w, gY); ctx.closePath(); ctx.fill();
      // water
      var wg = ctx.createLinearGradient(0, gY, 0, VIEW.y + VIEW.h); wg.addColorStop(0, "#27506a"); wg.addColorStop(1, "#16384a");
      ctx.fillStyle = wg; ctx.fillRect(VIEW.x, gY, VIEW.w, VIEW.y + VIEW.h - gY);
      // boat position from bearing (shifts against the hills as the observer moves)
      var off = (Math.PI / 2 - bearing(obs));      // rad relative to straight-ahead
      var bxv = VIEW.x + VIEW.w / 2 + off * (VIEW.w * 1.4);
      bxv = Math.max(VIEW.x + 14, Math.min(VIEW.x + VIEW.w - 14, bxv));
      boatIcon(ctx, bxv, gY + 14, 1.3);
      ctx.restore();
    }

    function drawResults(ctx) {
      panel(ctx, RES, I18N.t("px.results"));
      var est = estimate();
      ctx.textAlign = "left"; ctx.font = "12px system-ui";
      var rows = [
        [I18N.t("px.meas"), String(meas.length)],
        [I18N.t("px.baseline"), oBaseVal()],
        [I18N.t("px.true"), boat.by.toFixed(1) + " m"],
        [I18N.t("px.est"), est ? est.y.toFixed(1) + " m" : "—"],
        [I18N.t("px.errpct"), est ? (100 * Math.abs(est.y - boat.by) / boat.by).toFixed(1) + "%" : "—"]
      ];
      rows.forEach(function (r, i) {
        var y = RES.y + 44 + i * 26;
        ctx.fillStyle = "#9fabce"; ctx.fillText(r[0], RES.x + 16, y);
        ctx.fillStyle = "#ffd166"; ctx.font = "13px var(--mono, monospace)"; ctx.textAlign = "right"; ctx.fillText(r[1], RES.x + RES.w - 16, y);
        ctx.textAlign = "left"; ctx.font = "12px system-ui";
      });
      ctx.fillStyle = "#6b7aa0"; ctx.font = "10px system-ui";
      wrapText(ctx, I18N.t("px.take") + " ≥ 2 ×", RES.x + 16, RES.y + 44 + rows.length * 26 + 8, RES.w - 32, 13);
    }
    function oBaseVal() { return meas.length >= 2 ? (Math.max.apply(null, meas.map(function (m) { return m.ox; })) - Math.min.apply(null, meas.map(function (m) { return m.ox; }))).toFixed(0) + " m" : "0 m"; }

    function boatIcon(ctx, x, y, s) {
      s = s || 1;
      ctx.fillStyle = "#f0f4ff"; ctx.beginPath(); ctx.moveTo(x, y - 14 * s); ctx.lineTo(x, y); ctx.lineTo(x + 9 * s, y); ctx.closePath(); ctx.fill();   // sail
      ctx.strokeStyle = "#cdd7f5"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y - 14 * s); ctx.lineTo(x, y + 2 * s); ctx.stroke();
      ctx.fillStyle = "#caa64a"; ctx.beginPath(); ctx.moveTo(x - 8 * s, y + 1 * s); ctx.lineTo(x + 8 * s, y + 1 * s); ctx.lineTo(x + 5 * s, y + 6 * s); ctx.lineTo(x - 5 * s, y + 6 * s); ctx.closePath(); ctx.fill();   // hull
    }
    function panel(ctx, r, title) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(title.toUpperCase(), r.x + 14, r.y + 18);
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    function wrapText(ctx, text, x, y, maxw, lh) {
      var words = text.split(" "), line = "", yy = y;
      for (var i = 0; i < words.length; i++) { var t = line ? line + " " + words[i] : words[i]; if (ctx.measureText(t).width > maxw && line) { ctx.fillText(line, x, yy); line = words[i]; yy += lh; } else line = t; }
      if (line) ctx.fillText(line, x, yy);
    }
  }
});
