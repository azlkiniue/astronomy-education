/* Lightcurve Simulator --------------------------------------------------------
   Faithful rebuild of the ClassAction "Lightcurve Simulator"
   (lightcurve.swf).  Four-panel view of an eclipsing binary system:

     Top-left:   Brightness vs time (scrolling strip chart)
     Top-right:  Animated binary star pair with orbital motion
     Bottom-left: Phase-folded light curve (magnitude vs phase 0–1)
     Bottom-right: Elapsed time / period readouts + controls

   The two stars orbit their common center of mass. When the smaller
   (hotter) star passes behind or in front of the larger (cooler) star
   the total brightness dips — producing the characteristic double-dip
   light curve of an eclipsing binary. */
Sim.create({
  id: "lightcurve",
  width: 760, height: 520,
  strings: {
    en: {
      "lc.bright": "Periodic Variation in Brightness",
      "lc.binary": "Eclipsing Binary System",
      "lc.lcurve": "Light Curve", "lc.mag": "Magnitude",
      "lc.time": "Time", "lc.phase": "Phase",
      "lc.now": "Now", "lc.period": "Period",
      "lc.elapsed": "Elapsed Time", "lc.cycles": "Cycles",
      "lc.phaseR": "Phase",
      "lc.plot": "plot data point", "lc.clear": "clear graph",
      "lc.reset": "reset"
    },
    id: {
      "lc.bright": "Variasi Periodik Kecerahan",
      "lc.binary": "Sistem Bintang Gerhana",
      "lc.lcurve": "Kurva Cahaya", "lc.mag": "Magnitudo",
      "lc.time": "Waktu", "lc.phase": "Fase",
      "lc.now": "Skrg", "lc.period": "Periode",
      "lc.elapsed": "Waktu Berlalu", "lc.cycles": "Siklus",
      "lc.phaseR": "Fase",
      "lc.plot": "plot titik data", "lc.clear": "bersihkan grafik",
      "lc.reset": "atur ulang"
    }
  },
  about: {
    en: "<p>An <strong>eclipsing binary</strong> is a pair of stars whose orbits are oriented so that one star periodically passes in front of the other as seen from Earth. Each eclipse blocks some light, causing the total brightness to dip.</p>" +
        "<p>The <strong>primary eclipse</strong> (deeper dip) occurs when the hotter, brighter star is hidden behind the cooler companion. The <strong>secondary eclipse</strong> (shallower dip) occurs when the cooler star passes in front. The light curve's shape encodes the stars' sizes, temperatures, and orbital inclination.</p>",
    id: "<p><strong>Bintang gerhana</strong> adalah pasangan bintang yang orbitnya berorientasi sehingga satu bintang secara periodik melewati depan yang lain dilihat dari Bumi. Tiap gerhana menghalangi sebagian cahaya, menyebabkan kecerahan total menurun.</p>" +
        "<p><strong>Gerhana primer</strong> (penurunan lebih dalam) terjadi saat bintang lebih panas tersembunyi di balik pendamping lebih dingin. <strong>Gerhana sekunder</strong> (penurunan dangkal) terjadi saat bintang dingin melewati depan. Bentuk kurva cahaya menyandikan ukuran, suhu, dan inklinasi orbit bintang.</p>"
  },
  build: function (S) {
    var ctx = S.ctx, W = S.W, H = S.H;

    var PERIOD = 3.65;
    var P = { time: 0, points: [], running: false };

    // star properties
    var STAR_A = { r: 26, color: "#ffbb44", lum: 0.6 };  // cooler, larger
    var STAR_B = { r: 20, color: "#aaccff", lum: 0.4 };   // hotter, smaller
    var ORBIT_R = 55;

    // panel rects
    var TL = { x: 20,  y: 15,  w: 350, h: 225 };  // brightness vs time
    var TR = { x: 390, y: 15,  w: 350, h: 225 };  // binary animation
    var BL = { x: 20,  y: 260, w: 350, h: 245 };  // phase-folded LC
    var BR = { x: 390, y: 260, w: 350, h: 245 };  // readouts + controls

    var loop = S.loop(function (dt) {
      P.time += dt * 0.5;
    });
    var ppBtn = S.playPause(loop);

    S.button({ labelKey: "lc.plot", on: function () {
      var phase = (P.time / PERIOD) % 1;
      if (phase < 0) phase += 1;
      P.points.push({ phase: phase, mag: getMag(phase), t: P.time });
      S.requestDraw();
    }});
    S.button({ labelKey: "lc.clear", on: function () { P.points = []; S.requestDraw(); } });
    S.button({ labelKey: "lc.reset", on: function () {
      P.time = 0; P.points = [];
      loop.pause(); ppBtn.sync();
      S.requestDraw();
    }});

    function getMag(phase) {
      var mag = 0;
      // primary eclipse at phase 0 (hot star behind cool star)
      var d1 = Math.abs(phase < 0.5 ? phase : phase - 1);
      if (d1 < 0.06) mag += 0.8 * Math.exp(-Math.pow(d1 / 0.025, 2));
      // secondary eclipse at phase 0.5 (cool star in front)
      var d2 = Math.abs(phase - 0.5);
      if (d2 < 0.06) mag += 0.35 * Math.exp(-Math.pow(d2 / 0.025, 2));
      return mag;
    }

    S.onDraw(function () {
      S.clear();
      var phase = ((P.time / PERIOD) % 1 + 1) % 1;
      var mag = getMag(phase);

      // --- panel backgrounds ---
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(TL.x, TL.y, TL.w, TL.h);
      ctx.fillRect(TR.x, TR.y, TR.w, TR.h);
      ctx.fillRect(BL.x, BL.y, BL.w, BL.h);
      ctx.fillRect(BR.x, BR.y, BR.w, BR.h);

      ctx.strokeStyle = "rgba(100,100,100,0.4)";
      ctx.lineWidth = 1;
      ctx.strokeRect(TL.x, TL.y, TL.w, TL.h);
      ctx.strokeRect(TR.x, TR.y, TR.w, TR.h);
      ctx.strokeRect(BL.x, BL.y, BL.w, BL.h);
      ctx.strokeRect(BR.x, BR.y, BR.w, BR.h);

      // --- TL: brightness vs time ---
      drawBrightnessStrip(TL, phase);

      // --- TR: binary stars ---
      drawBinary(TR, phase);

      // --- BL: phase-folded light curve ---
      drawPhaseCurve(BL);

      // --- BR: readouts ---
      drawReadouts(BR, phase);
    });

    function drawBrightnessStrip(r, curPhase) {
      ctx.save();

      // title
      ctx.fillStyle = "#ee6644"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lc.bright"), r.x + r.w / 2, r.y + 16);

      var plotX = r.x + 50, plotY = r.y + 35;
      var plotW = r.w - 65, plotH = r.h - 55;

      // axes
      ctx.strokeStyle = "#888"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(plotX, plotY); ctx.lineTo(plotX, plotY + plotH);
      ctx.lineTo(plotX + plotW, plotY + plotH);
      ctx.stroke();

      // y label
      ctx.save(); ctx.translate(r.x + 16, plotY + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#ee6644"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lc.mag"), 0, 0);
      ctx.restore();

      // x label
      ctx.fillStyle = "#ee6644"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lc.time"), plotX + plotW / 2, plotY + plotH + 16);

      // "Now" marker fixed at center
      var nowX = plotX + plotW / 2;
      ctx.strokeStyle = "#ee4444"; ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(nowX, plotY); ctx.lineTo(nowX, plotY + plotH); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ee4444"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lc.now"), nowX, plotY - 3);

      // draw light curve scrolling past the fixed "Now" line
      ctx.save();
      ctx.beginPath();
      ctx.rect(plotX, plotY, plotW, plotH);
      ctx.clip();

      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      var totalPhases = 2.5;
      var curPhase = P.time / PERIOD;
      for (var i = 0; i <= plotW; i++) {
        var ph_cont = curPhase - totalPhases / 2 + (i / plotW) * totalPhases;
        var ph = ((ph_cont % 1) + 1) % 1;
        var m = getMag(ph);
        var px = plotX + i;
        var py = plotY + plotH * 0.15 + m * plotH * 0.7;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.restore();
      ctx.restore();
    }

    function drawBinary(r, phase) {
      ctx.save();

      // title
      ctx.fillStyle = "#6699cc"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lc.binary"), r.x + r.w / 2, r.y + 16);
      ctx.fillStyle = "#6699cc"; ctx.font = "11px sans-serif";
      ctx.fillText("(" + I18N.t("lc.period") + " = " + PERIOD + " days)", r.x + r.w / 2, r.y + 30);

      var cx = r.x + r.w / 2, cy = r.y + 40 + (r.h - 50) / 2;
      var angle = phase * Math.PI * 2 + Math.PI / 2;

      // star positions (projected: x = cos, y ∝ sin for inclination)
      var inclination = 0.15;
      var axX = Math.cos(angle) * ORBIT_R;
      var axY = Math.sin(angle) * ORBIT_R * inclination;
      var bxX = -axX, bxY = -axY;

      // determine z-order: which star is in front
      var aZ = Math.sin(angle);
      var bZ = -aZ;

      var stars = [
        { x: cx + axX, y: cy + axY, z: aZ, r: STAR_A.r, color: STAR_A.color },
        { x: cx + bxX, y: cy + bxY, z: bZ, r: STAR_B.r, color: STAR_B.color }
      ];
      stars.sort(function (a, b) { return a.z - b.z; });

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        var g = ctx.createRadialGradient(s.x - s.r * 0.2, s.y - s.r * 0.2, s.r * 0.1, s.x, s.y, s.r);
        g.addColorStop(0, lightenColor(s.color, 0.3));
        g.addColorStop(1, s.color);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // elapsed time label + value
      var etY = cy + ORBIT_R * inclination + STAR_A.r + 25;
      ctx.fillStyle = "#aaa"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lc.elapsed") + ":  " + P.time.toFixed(2) + " days", cx, etY);

      ctx.restore();
    }

    function drawPhaseCurve(r) {
      ctx.save();

      // title
      ctx.fillStyle = "#ee6644"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lc.lcurve"), r.x + r.w / 2, r.y + 16);

      var plotX = r.x + 50, plotY = r.y + 30;
      var plotW = r.w - 65, plotH = r.h - 70;

      // axes
      ctx.strokeStyle = "#888"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(plotX, plotY); ctx.lineTo(plotX, plotY + plotH);
      ctx.lineTo(plotX + plotW, plotY + plotH);
      ctx.stroke();

      // y label
      ctx.save(); ctx.translate(r.x + 16, plotY + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#ee6644"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lc.mag"), 0, 0);
      ctx.restore();

      // x label + ticks
      ctx.fillStyle = "#aaa"; ctx.font = "11px sans-serif";
      for (var t = 0; t <= 4; t++) {
        var tx = plotX + (t / 4) * plotW;
        ctx.beginPath(); ctx.moveTo(tx, plotY + plotH); ctx.lineTo(tx, plotY + plotH + 4); ctx.stroke();
        ctx.fillText((t * 0.25).toFixed(2), tx, plotY + plotH + 15);
      }
      ctx.fillStyle = "#ee6644"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lc.phase"), plotX + plotW / 2, plotY + plotH + 30);

      // reference curve (faint)
      ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = 0; i <= plotW; i++) {
        var ph = i / plotW;
        var m = getMag(ph);
        var px = plotX + i;
        var py = plotY + plotH * 0.15 + m * plotH * 0.7;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // plotted data points: red when new, fading to white over time
      var FADE_TIME = PERIOD * 0.25;
      for (var j = 0; j < P.points.length; j++) {
        var pt = P.points[j];
        var age = P.time - (pt.t || 0);
        var frac = Math.min(age / FADE_TIME, 1);
        var cr = 255, cg = Math.round(frac * 255), cb = Math.round(frac * 255);
        ctx.fillStyle = "rgb(" + cr + "," + cg + "," + cb + ")";
        var dx = plotX + pt.phase * plotW;
        var dy = plotY + plotH * 0.15 + pt.mag * plotH * 0.7;
        ctx.beginPath();
        ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function drawReadouts(r, phase) {
      ctx.save();
      var cx = r.x + r.w / 2;
      var elapsed = P.time;
      var cycles = elapsed / PERIOD;
      var cyclesInt = Math.floor(cycles);
      var phaseFrac = cycles - cyclesInt;

      var fracX = cx - 40;
      var y0 = r.y + 30;

      // Elapsed Time / Period label
      ctx.fillStyle = "#ccc"; ctx.font = "14px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("lc.elapsed"), fracX, y0);
      ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(fracX - 60, y0 + 8); ctx.lineTo(fracX + 60, y0 + 8); ctx.stroke();
      ctx.fillText(I18N.t("lc.period"), fracX, y0 + 22);
      ctx.fillText("=", fracX + 80, y0 + 12);

      // numeric values
      ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif";
      var y1 = y0 + 50;
      ctx.fillText(elapsed.toFixed(2) + " days", fracX, y1);
      ctx.strokeStyle = "#aaa"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(fracX - 60, y1 + 6); ctx.lineTo(fracX + 60, y1 + 6); ctx.stroke();
      ctx.fillText(PERIOD.toFixed(2) + " days", fracX, y1 + 20);
      ctx.fillText("=", fracX + 80, y1 + 10);

      // cycles and phase boxes aligned with fraction display
      var boxW = 55, boxH = 24;
      var boxGap = 20;
      var totalBoxW = boxW * 2 + boxGap;
      var bx1 = fracX - totalBoxW / 2;
      var bx2 = bx1 + boxW + boxGap;
      var by = y1 + 40;

      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(bx1, by, boxW, boxH);
      ctx.fillRect(bx2, by, boxW, boxH);
      ctx.strokeStyle = "#666"; ctx.lineWidth = 1;
      ctx.strokeRect(bx1, by, boxW, boxH);
      ctx.strokeRect(bx2, by, boxW, boxH);

      // dot separator
      ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(".", bx1 + boxW + boxGap / 2, by + 16);

      ctx.fillStyle = "#fff"; ctx.font = "bold 13px sans-serif";
      ctx.fillText(cyclesInt.toString(), bx1 + boxW / 2, by + 16);
      ctx.fillText(Math.round(phaseFrac * 100).toString(), bx2 + boxW / 2, by + 16);

      ctx.fillStyle = "#ee6644"; ctx.font = "11px sans-serif";
      ctx.fillText("(" + I18N.t("lc.cycles") + ")", bx1 + boxW / 2, by + boxH + 13);
      ctx.fillText("(" + I18N.t("lc.phaseR") + ")", bx2 + boxW / 2, by + boxH + 13);

      ctx.restore();
    }

    function lightenColor(hex, amt) {
      var r = parseInt(hex.slice(1, 3), 16);
      var g = parseInt(hex.slice(3, 5), 16);
      var b = parseInt(hex.slice(5, 7), 16);
      r = Math.min(255, Math.round(r + (255 - r) * amt));
      g = Math.min(255, Math.round(g + (255 - g) * amt));
      b = Math.min(255, Math.round(b + (255 - b) * amt));
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    S.requestDraw();
  }
});
