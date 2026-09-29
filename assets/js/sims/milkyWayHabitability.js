/* Milky Way Habitability Explorer ------------------------------------------------
   Faithful rebuild of NAAP's "milkyWayHabitability.swf" (Habitable Zones lab).
   The whole model is three lines of its root timeline:

       minRadius = 1.2,  maxRadius = 22,  onReset() = setRadius(18)

   and setRadius() hands the one number, a distance from the Galaxy's centre in
   kiloparsecs, to three views: a ring on the galaxy picture at 19 px per kpc
   (MilkyWayComponent, drawn as the SWF's own twelve quadratic arcs, 3 px #ff8080,
   masked to the 846 x 300 window) and a red cursor in each of the two graphs at
   14.7 px per kpc (RiskPlot / MetalsPlot). The graphs are fixed artwork — their
   curves are the SWF's shapes 57 and 51, copied edge for edge — and neither has a
   scale on its vertical axis: they show trends, not values, so no numbers are
   invented for them here either.

   The picture is the SWF's bitmap 33 (NASA/JPL-Caltech), cropped to the part the
   window ever shows. The SWF's own About box is a leftover from the hydrogen-atom
   simulator, so the explainer below is new.

   Beyond the SWF: dragging the ring on the picture, or pressing anywhere inside
   either graph, also sets the radius (the SWF only drags the two cursors).     */
Sim.create({
  id: "milkyWayHabitability",
  width: 860, height: 670,
  strings: {
    en: {
      "mh.group": "Distance from the centre", "mh.radius": "distance from center",
      "mh.sunBtn": "The Sun's distance", "mh.reset": "Reset",
      "mh.hint": "Drag the red line in either graph, or the ring on the galaxy — they move together.",
      "mh.rKpc": "distance", "mh.rLy": "in light-years", "mh.rSun": "compared with the Sun",
      "mh.riskTitle": "Catastrophic Event Probability Graph",
      "mh.metalsTitle": "Heavy Elements Abundance Graph",
      "mh.riskDesc": "the graph below estimates the likelihood of a planet experiencing a sterilization event, such as from a nearby supernova explosion",
      "mh.metalsDesc": "the graph below shows the distribution of elements heavier than hydrogen and helium, from which planets are made",
      "mh.riskAxis": "extinction risk", "mh.metalsAxis": "heavy elements abundance",
      "mh.xAxis": "distance from center (kpc)", "mh.sun": "Sun", "mh.credit": "NASA/JPL-Caltech",
      "mh.ly": " ly", "mh.times": "×"
    },
    id: {
      "mh.group": "Jarak dari pusat", "mh.radius": "jarak dari pusat",
      "mh.sunBtn": "Jarak Matahari", "mh.reset": "Atur ulang",
      "mh.hint": "Seret garis merah pada salah satu grafik, atau cincin pada galaksi — keduanya bergerak bersama.",
      "mh.rKpc": "jarak", "mh.rLy": "dalam tahun cahaya", "mh.rSun": "dibanding Matahari",
      "mh.riskTitle": "Grafik Peluang Peristiwa Katastrofik",
      "mh.metalsTitle": "Grafik Kelimpahan Unsur Berat",
      "mh.riskDesc": "grafik di bawah memperkirakan peluang planet mengalami peristiwa sterilisasi, misalnya dari supernova di dekatnya",
      "mh.metalsDesc": "grafik di bawah menunjukkan sebaran unsur yang lebih berat daripada hidrogen dan helium, bahan pembentuk planet",
      "mh.riskAxis": "risiko kepunahan", "mh.metalsAxis": "kelimpahan unsur berat",
      "mh.xAxis": "jarak dari pusat (kpc)", "mh.sun": "Matahari", "mh.credit": "NASA/JPL-Caltech",
      "mh.ly": " tc", "mh.times": "×"
    }
  },
  about: {
    en: "<p>Is there a best neighbourhood in the Galaxy for life? The idea of a <b>galactic habitable zone</b> says the answer depends on distance from the centre, because two things that matter for complex life change in opposite directions as you move outward.</p>" +
        "<p><b>Heavy elements.</b> To an astronomer every element heavier than hydrogen and helium is a “metal”, and metals are what rocky planets are made of — and the cores of the giant planets too. They are forged inside massive stars and scattered by supernovae, so they pile up fastest where star formation is busiest: near the centre. Out in the thin outer disc there may simply not be enough raw material to build an Earth.</p>" +
        "<p><b>Catastrophes.</b> The crowded inner Galaxy is also the dangerous part. A supernova within about 10 parsecs would strip away a planet's ozone and expose land life to the Sun's ultraviolet light; close passes by other stars stir up comet clouds and send swarms of comets inward; and the black hole at the very centre flares whenever it swallows gas. All of these grow rarer with distance.</p>" +
        "<p>Put the two graphs together and the habitable zone is the stretch in between: far enough out that sterilizing events are rare, close enough in that planets can still be built. The Sun, about 8 kpc (26 000 light-years) from the centre, sits in that middle ground. Keep in mind that the curves here show trends, not measured values — their vertical axes deliberately carry no numbers — and that the whole idea is young and still argued over by researchers.</p>",
    id: "<p>Adakah lingkungan terbaik di Galaksi bagi kehidupan? Gagasan <b>zona laik huni galaksi</b> menyatakan jawabannya bergantung pada jarak dari pusat, karena dua hal yang penting bagi kehidupan kompleks berubah ke arah yang berlawanan saat kita bergerak ke luar.</p>" +
        "<p><b>Unsur berat.</b> Bagi astronom, setiap unsur yang lebih berat daripada hidrogen dan helium adalah “logam”, dan logam adalah bahan pembentuk planet berbatu — juga inti planet raksasa. Unsur-unsur ini ditempa di dalam bintang masif dan disebarkan oleh supernova, sehingga menumpuk paling cepat di tempat pembentukan bintang paling sibuk: dekat pusat. Di piringan luar yang renggang, bahan bakunya mungkin tidak cukup untuk membangun sebuah Bumi.</p>" +
        "<p><b>Bencana.</b> Galaksi bagian dalam yang padat juga merupakan bagian yang berbahaya. Supernova dalam jarak sekitar 10 parsek akan melucuti lapisan ozon sebuah planet dan membiarkan kehidupan darat terpapar ultraungu Matahari; lintasan dekat bintang lain mengusik awan komet dan mengirim kawanan komet ke bagian dalam; dan lubang hitam di pusat menyala setiap kali menelan gas. Semua ini makin jarang seiring bertambahnya jarak.</p>" +
        "<p>Satukan kedua grafik dan zona laik huni adalah bentangan di antaranya: cukup jauh sehingga peristiwa yang mensterilkan jarang terjadi, cukup dekat sehingga planet masih dapat terbentuk. Matahari, sekitar 8 kpc (26.000 tahun cahaya) dari pusat, berada di wilayah tengah itu. Ingatlah bahwa kurva di sini menunjukkan kecenderungan, bukan nilai terukur — sumbu tegaknya sengaja tidak diberi angka — dan bahwa gagasan ini masih muda serta masih diperdebatkan para peneliti.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var OY = -30;                                   // the SWF's title bar is the page header here
    var FONT = "Verdana, Geneva, sans-serif";

    /* ---- the SWF's numbers ---- */
    var MIN_R = 1.2, MAX_R = 22, RESET_R = 18;
    var GAL = { x: 430, y: 187 + OY, scale: 19, hw: 423, hh: 150 };   // galaxyMC + discMaskMC
    var SUN_R = 159.05 / 19;                        // shape 36's centre, 8.37 kpc
    var PLOT_SCALE = 14.7;                          // px per kpc in both graphs
    var RISK = { x: 49, y: 431 + OY, panel: { x: 7, y: 344 + OY, w: 419, h: 349 },
      title: "mh.riskTitle", desc: "mh.riskDesc", descX: 31.95, descW: 368, axis: "mh.riskAxis",
      axisY: 156.85 };
    var METALS = { x: 475, y: 431 + OY, panel: { x: 433, y: 344 + OY, w: 420, h: 349 },
      title: "mh.metalsTitle", desc: "mh.metalsDesc", descX: 457.95, descW: 354, axis: "mh.metalsAxis",
      axisY: 203.85 };
    var PLOTS = [RISK, METALS];
    var LY_PER_KPC = 3261.56;

    var r = RESET_R;
    var hover = null;                               // the plot whose cursor is under the pointer
    var drag = null;                                // { kind: "plot"|"ring", plot, off }

    var img = new Image();
    img.onload = function () { S.requestDraw(); };
    img.src = "../assets/img/sims/milkyway-disc.jpg";

    /* the SWF's twelve-arc circle (precomputePoints(12)) */
    var ARC = (function () {
      var n = 12, step = TAU / n, half = step / 2, k = 1 / Math.cos(half), a = [], c = [];
      for (var i = 0; i < n; i++) {
        var t = (i + 1) * step;
        a.push({ x: Math.cos(t), y: -Math.sin(t) });
        c.push({ x: k * Math.cos(t - half), y: -k * Math.sin(t - half) });
      }
      return { a: a, c: c };
    })();

    /* ------------------------------------------------------------- controls */
    S.group("mh.group");
    var radiusCtl = S.slider({ labelKey: "mh.radius", min: MIN_R, max: MAX_R, step: 0.1, value: RESET_R,
      format: function (v) { return v.toFixed(1) + " kpc"; },
      on: function (v) { if (!syncing) setRadius(v, true); } });
    S.button({ labelKey: "mh.sunBtn", on: function () { setRadius(SUN_R); } });
    S.button({ labelKey: "mh.reset", on: function () { setRadius(RESET_R); } });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "mh.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var outKpc = S.readout({ labelKey: "mh.rKpc" });
    var outLy = S.readout({ labelKey: "mh.rLy" });
    var outSun = S.readout({ labelKey: "mh.rSun" });

    var syncing = false;
    function setRadius(v, fromSlider) {
      r = Math.max(MIN_R, Math.min(MAX_R, v));
      if (!fromSlider) { syncing = true; radiusCtl.set(Math.round(r * 10) / 10); syncing = false; }
      sync();
      S.requestDraw();
    }
    var shown = {};
    function put(key, fn, text) { if (shown[key] !== text) { shown[key] = text; fn(text); } }
    function sync() {
      put("k", outKpc, r.toFixed(1) + " kpc");
      put("l", outLy, Math.round(r * LY_PER_KPC / 100) * 100 + I18N.t("mh.ly"));
      put("s", outSun, (r / SUN_R).toFixed(2) + " " + I18N.t("mh.times"));
    }
    S.refreshers.push(function () { shown = {}; sync(); });

    /* ---------------------------------------------------------- interaction */
    function at(ev) {
      var b = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - b.left) * S.W / b.width, y: (ev.clientY - b.top) * S.H / b.height };
    }
    function inWindow(p) {
      return Math.abs(p.x - GAL.x) <= GAL.hw && Math.abs(p.y - GAL.y) <= GAL.hh;
    }
    function plotAt(p) {                            // the plot whose 360 x 210 mask holds p
      for (var i = 0; i < PLOTS.length; i++) {
        var P = PLOTS[i], lx = p.x - P.x, ly = p.y - P.y;
        if (lx >= -6 && lx <= 360 && ly >= 0 && ly <= 210) return P;
      }
      return null;
    }
    function nearCursor(P, p) { return Math.abs(p.x - P.x - r * PLOT_SCALE) <= 6; }

    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), P = plotAt(p);
      if (P) {
        /* the SWF keeps the grab offset (xOffset); a press away from the line
           moves the line there first                                          */
        var off = nearCursor(P, p) ? p.x - P.x - r * PLOT_SCALE : 0;
        if (!off && !nearCursor(P, p)) setRadius((p.x - P.x) / PLOT_SCALE);
        drag = { kind: "plot", plot: P, off: off };
      } else if (inWindow(p)) {
        var d = Math.hypot(p.x - GAL.x, p.y - GAL.y) / GAL.scale;
        var ringOff = Math.abs(d - r) * GAL.scale <= 10 ? d - r : 0;
        if (!ringOff) setRadius(d);
        drag = { kind: "ring", off: ringOff };
      } else return;
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* synthetic events */ }
      ev.preventDefault();
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (drag) {
        if (drag.kind === "plot") setRadius((p.x - drag.plot.x - drag.off) / PLOT_SCALE);
        else setRadius(Math.hypot(p.x - GAL.x, p.y - GAL.y) / GAL.scale - drag.off);
        return;
      }
      var P = plotAt(p), h = P && nearCursor(P, p) ? P : null;
      if (h !== hover) { hover = h; S.requestDraw(); }
      S.canvas.style.cursor = h ? "ew-resize" : P ? "pointer" : inWindow(p) ? "crosshair" : "";
    });
    ["pointerup", "pointercancel"].forEach(function (name) {
      S.canvas.addEventListener(name, function () { if (drag) { drag = null; S.requestDraw(); } });
    });
    S.canvas.addEventListener("pointerleave", function () {
      if (hover && !drag) { hover = null; S.requestDraw(); }
    });

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      galaxy(ctx, t);
      PLOTS.forEach(function (P) { panel(ctx, t, P); });
      riskPlot(ctx, t);
      metalsPlot(ctx, t);
    });

    function galaxy(ctx, t) {
      ctx.save();
      ctx.beginPath(); ctx.rect(GAL.x - GAL.hw, GAL.y - GAL.hh, 2 * GAL.hw, 2 * GAL.hh); ctx.clip();
      ctx.fillStyle = "#000000"; ctx.fillRect(GAL.x - GAL.hw, GAL.y - GAL.hh, 2 * GAL.hw, 2 * GAL.hh);
      if (img.complete && img.naturalWidth) ctx.drawImage(img, GAL.x - 423.6, GAL.y - 150.1);
      var R = r * GAL.scale;
      ctx.beginPath();
      ctx.moveTo(GAL.x + R, GAL.y);
      for (var i = 0; i < 12; i++) {
        ctx.quadraticCurveTo(GAL.x + R * ARC.c[i].x, GAL.y + R * ARC.c[i].y,
          GAL.x + R * ARC.a[i].x, GAL.y + R * ARC.a[i].y);
      }
      ctx.strokeStyle = "#ff8080"; ctx.lineWidth = drag && drag.kind === "ring" ? 4 : 3; ctx.stroke();
      ctx.restore();

      /* the Sun (shape 36) and its label (text 37, bold 11 px white) */
      ctx.beginPath(); ctx.arc(GAL.x + 159.05, GAL.y + 1.65, 2.5, 0, TAU);
      ctx.fillStyle = "#ffffff"; ctx.fill();
      ctx.font = "bold 11px " + FONT; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText(t("mh.sun"), GAL.x + 165.35, GAL.y + 5);
      ctx.font = "italic 10px " + FONT; ctx.textAlign = "right";
      ctx.fillText(t("mh.credit"), GAL.x + 417, GAL.y + 145.4);
    }

    /* the "Panel Background" component: #fafafa, 1 px #666666, a 14 px #333333
       title and a #cccccc bar running from its end to the right margin         */
    function panel(ctx, t, P) {
      var b = P.panel;
      ctx.fillStyle = "#fafafa"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      ctx.font = "14px " + FONT; ctx.fillStyle = "#333333";
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var title = t(P.title), tw = ctx.measureText(title).width;
      ctx.fillText(title, b.x + 5, b.y + 18);
      ctx.strokeStyle = "#cccccc";
      ctx.beginPath(); ctx.moveTo(b.x + 10 + tw, b.y + 12.5); ctx.lineTo(b.x + b.w - 5, b.y + 12.5); ctx.stroke();
      ctx.font = "italic 11px " + FONT; ctx.fillStyle = "#000000";
      wrap(ctx, t(P.desc), P.descX, 378 + OY + 11.5, P.descW, 15.4);
    }
    function wrap(ctx, text, x, y, w, lh) {
      var words = text.split(" "), line = "";
      words.forEach(function (word) {
        var test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > w && line) { ctx.fillText(line, x, y); y += lh; line = word; }
        else line = test;
      });
      if (line) ctx.fillText(line, x, y);
    }

    /* the axes, ticks and labels both plots share (shapes 41, 47, 48; texts 40, 42–46) */
    function axes(ctx, t, P) {
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(355, 210.5); ctx.lineTo(0.5, 210.5); ctx.lineTo(0.5, 0);
      [0, 73.5, 147, 220.5, 294].forEach(function (x) { ctx.moveTo(x + 0.5, 210); ctx.lineTo(x + 0.5, 216); });
      ctx.stroke();
      ctx.fillStyle = "#000000";
      [[0, -1, 0], [355.75, 210, Math.PI / 2]].forEach(function (a) {
        ctx.save(); ctx.translate(a[0], a[1]); ctx.rotate(a[2]);
        ctx.beginPath();
        ctx.moveTo(4.45, 7.1); ctx.lineTo(0.05, -7.1); ctx.lineTo(-4.4, 7.1); ctx.lineTo(0, 3.7);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      });
      ctx.font = "12px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      [0, 5, 10, 15, 20].forEach(function (d) { ctx.fillText(String(d), d * PLOT_SCALE, 228.45); });
      ctx.font = fit(ctx, t("mh.xAxis"), 14, 330);
      ctx.fillText(t("mh.xAxis"), 177.4, 249.9);
      ctx.save();
      ctx.translate(-24.05, P.axisY); ctx.rotate(-Math.PI / 2);
      ctx.font = fit(ctx, t(P.axis), 14, P.axisY - 4);
      ctx.textAlign = "left";
      ctx.fillText(t(P.axis), 0, 14);
      ctx.restore();
    }
    function fit(ctx, text, size, max) {
      ctx.font = size + "px " + FONT;
      var w = ctx.measureText(text).width;
      return (w > max ? Math.floor(size * max / w * 10) / 10 : size) + "px " + FONT;
    }

    /* the cursor (sprite 55): a 2 px #fe5f5f line, 4 px #ff0000 when rolled over,
       clipped by the plot's 360 x 210 mask                                     */
    function cursor(ctx, P) {
      var x = r * PLOT_SCALE, hot = hover === P || (drag && drag.plot === P);
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, 360, 210); ctx.clip();
      ctx.fillStyle = hot ? "#ff0000" : "#fe5f5f";
      ctx.fillRect(x - (hot ? 2 : 1), 0, hot ? 4 : 2, 210);
      ctx.restore();
    }

    function riskPlot(ctx, t) {
      ctx.save();
      ctx.translate(RISK.x, RISK.y);
      ctx.beginPath();                               // shape 57
      ctx.moveTo(15, 6);
      ctx.quadraticCurveTo(17.25, 26.45, 24.35, 51.2);
      ctx.quadraticCurveTo(38.45, 100.8, 62.5, 122.5);
      ctx.quadraticCurveTo(75.8, 134.5, 96.45, 142.55);
      ctx.quadraticCurveTo(117.1, 150.6, 149.7, 156.45);
      ctx.quadraticCurveTo(180.2, 161.9, 229.05, 166.85);
      ctx.lineTo(341.5, 176.5);
      ctx.strokeStyle = "#3399ff"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();
      axes(ctx, t, RISK);
      cursor(ctx, RISK);
      ctx.restore();
    }

    function metalsPlot(ctx, t) {
      ctx.save();
      ctx.translate(METALS.x, METALS.y);
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, 360, 210); ctx.clip();
      ctx.beginPath();                               // shape 51
      ctx.moveTo(-1, 13.65); ctx.lineTo(345, 196.9);
      ctx.strokeStyle = "#3399ff"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();
      ctx.restore();
      axes(ctx, t, METALS);
      cursor(ctx, METALS);
      ctx.restore();
    }

    sync();
  }
});
