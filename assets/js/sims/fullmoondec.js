/* Full Moon Declination Demonstrator ----------------------------------------------
   Faithful rebuild of the ClassAction "fullmoondec.swf" (MoonDecDemoClass and
   MoonDecPlotClass, decompiled). A full moon sits exactly opposite the Sun, so its
   declination is the Sun's with the sign flipped: highest in the sky in midwinter,
   lowest in midsummer.

   The plot draws that mirrored curve with the ±7° band the Moon's tilted orbit
   allows, and the horizon diagram puts the same instant on the sphere, with the
   sidereal time set so the full moon sits on the meridian — local midnight.    */
Sim.create({
  id: "fullmoondec",
  width: 875, height: 395,
  strings: {
    en: {
      "fd.ctl": "Date", "fd.doy": "day of year", "fd.plot": "Declination Range Plot",
      "fd.diagram": "Horizon Diagram", "fd.reset": "Reset the view",
      "fd.rDate": "date", "fd.rMoon": "full moon's declination", "fd.rSun": "sun's declination",
      "fd.rAlt": "moon's altitude at midnight",
      "fd.hint": "Drag the blue marker along the plot, or drag the sphere to swing the viewpoint.", "fd.lat": "latitude",
      "fd.N": "N", "fd.E": "E", "fd.S": "S", "fd.W": "W",
      "m1": "Jan", "m2": "Feb", "m3": "Mar", "m4": "Apr", "m5": "May", "m6": "Jun",
      "m7": "Jul", "m8": "Aug", "m9": "Sep", "m10": "Oct", "m11": "Nov", "m12": "Dec"
    },
    id: {
      "fd.ctl": "Tanggal", "fd.doy": "hari ke-", "fd.plot": "Grafik Rentang Deklinasi",
      "fd.diagram": "Diagram Horizon", "fd.reset": "Atur ulang tampilan",
      "fd.rDate": "tanggal", "fd.rMoon": "deklinasi purnama", "fd.rSun": "deklinasi matahari",
      "fd.rAlt": "ketinggian bulan saat tengah malam",
      "fd.hint": "Seret penanda biru pada grafik, atau seret bolanya untuk mengubah arah pandang.", "fd.lat": "lintang",
      "fd.N": "U", "fd.E": "T", "fd.S": "S", "fd.W": "B",
      "m1": "Jan", "m2": "Feb", "m3": "Mar", "m4": "Apr", "m5": "Mei", "m6": "Jun",
      "m7": "Jul", "m8": "Agu", "m9": "Sep", "m10": "Okt", "m11": "Nov", "m12": "Des"
    }
  },
  about: {
    en: "<p>A full moon is by definition opposite the Sun in the sky, so wherever the Sun is high the full moon is low, and vice versa. Its declination is the Sun's with the sign reversed — which is why the winter full moon rides high overhead on long nights, and the summer full moon skims the southern horizon.</p>" +
        "<p>The shaded band is the extra freedom the Moon has. Its orbit is tilted about 5° to the ecliptic, so a full moon can be up to 5° above or below the exact mirror of the Sun, and the band widens the range to roughly ±7° once the monthly wobble is included.</p>" +
        "<p>This is the reason for the harvest moon's reputation and for the seasonal feel of moonlight. It also explains eclipses: a lunar eclipse needs the full moon to be not merely opposite the Sun but within a few tenths of a degree of the ecliptic, which is why we do not get one every month.</p>",
    id: "<p>Purnama menurut definisinya berseberangan dengan Matahari di langit, sehingga di saat Matahari tinggi purnama rendah, dan sebaliknya. Deklinasinya adalah deklinasi Matahari dengan tanda terbalik — sebabnya purnama musim dingin melintas tinggi di atas kepala pada malam yang panjang, sedangkan purnama musim panas menyusur rendah di ufuk selatan.</p>" +
        "<p>Pita berarsir adalah kelonggaran tambahan yang dimiliki Bulan. Orbitnya miring sekitar 5° terhadap ekliptika, sehingga purnama dapat berada hingga 5° di atas atau di bawah cerminan tepat kedudukan Matahari, dan pita itu melebar menjadi kira-kira ±7° bila goyangan bulanan ikut diperhitungkan.</p>" +
        "<p>Inilah sebabnya purnama panen begitu termasyhur dan cahaya bulan terasa berbeda menurut musim. Ini pula yang menjelaskan gerhana: gerhana bulan menuntut purnama bukan sekadar berseberangan dengan Matahari, melainkan berada dalam beberapa persepuluh derajat dari ekliptika — sebabnya gerhana tidak terjadi setiap bulan.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var OY = -35;
    var PLOT = { x: 68.9, y: 236.8 + OY, w: 400, h: 275, maxDec: 40 };   // plotMC, origin mid-left
    var C = { x: 688.5, y: 237.95 + OY }, R = 150;                         // demoMC, size 300
    var SIN_E = 0.39714789063478056, COS_E = 0.9177546256839811;          // sin/cos of 23.4°
    var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var MONTH_TICKS = [0, 34, 65, 99, 132, 165, 198, 232, 266, 299, 333, 366, 400];
    var DEG_BASE = [141.45, 106.95, 72.45, 38, 3.5, -30, -64.5, -98, -133.95];       // baselines of −40°…40° (top y + 12.05)
    var MONTH_C = [17.125, 49.675, 82.3, 116.55, 148.8, 181.975, 215.125, 250.6, 283.325, 316.625, 350.2, 383.875];

    var doy = 45, lat = 41, drag = null;               // reset(): day 45, view (200, 20)

    S.group("fd.ctl");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "fd.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var doyCtl = S.slider({
      labelKey: "fd.doy", min: 0, max: 364, value: doy, step: 1,
      format: function (v) { return dateString(v); },
      on: function (v) { doy = v; upd(); }
    });
    S.slider({                                             // the sphere's own default, 41°
      labelKey: "fd.lat", min: -90, max: 90, value: lat, step: 1,
      format: function (v) { return v + "°"; },
      on: function (v) { lat = v; upd(); }
    });
    S.button({ labelKey: "fd.reset", on: function () { sph.setThetaAndPhi(200, 20); doyCtl.set(45); } });
    var outDate = S.readout({ labelKey: "fd.rDate" });
    var outMoon = S.readout({ labelKey: "fd.rMoon" });
    var outSun = S.readout({ labelKey: "fd.rSun" });
    var outAlt = S.readout({ labelKey: "fd.rAlt" });

    function dateString(d) {
      var n = Math.floor(((d % 365) + 365) % 365) + 1;
      for (var i = 0; i < 12; i++) {
        if (n <= MONTH_DAYS[i]) return I18N.t("m" + (i + 1)) + " " + n;
        n -= MONTH_DAYS[i];
      }
      return I18N.t("m12") + " 31";
    }
    /* ---- the SWF's own solar position, and the full moon opposite it ---- */
    function sun(d) {
      var L = (d - 78) / 365 * TAU;
      var dec = Math.asin(SIN_E * Math.sin(L)) * DEG;
      var ra = ((3.819718634205488 * Math.atan2(Math.sin(L) * COS_E, Math.cos(L))) % 24 + 24) % 24;
      return { dec: dec, ra: ra };
    }
    function plotDec(d) {                                  // the plot uses 78.5, the sphere 78
      var L = (d - 78.5) / 365 * TAU;
      return -Math.asin(SIN_E * Math.sin(L)) * DEG;
    }

    /* ---- the CelestialSphere, set up as MoonDecDemoClass.init does ---- */
    var CS = window.CelestialSphere, sph = new CS({ x: C.x, y: C.y });
    sph.minViewerAltitude = 7;
    // Symbol 204: a radial #f18d8d → #6c1e1e (both 40 %), centred (31, −34), radius 146.85
    var BAND_ART = CS.shapeDrawer({ nz: false, layers: [[[[{ t: "r", m: [0.17926, 0, 0, 0.17926, 31, -34],
      s: [[0, "rgba(241,141,141,0.4)"], [1, "rgba(108,30,30,0.4)"]] }, "M100 0Q100 41.4 70.7 70.7Q41.4 100 0 100Q-41.45 100 -70.75 70.7Q-100.05 41.4 -100 0Q-100.05 -41.45 -70.75 -70.7Q-41.45 -100 0 -100Q41.4 -100 70.7 -70.7Q100 -41.45 100 0Z"]], []]] });
    sph.addShadedBand(BAND_ART, BAND_ART, "testBand", { tilt: 23.4, dec2: 5.1, dec1: -5.1 }, "inner", "full");
    sph.testBand.setBorderStyle(1, 0xff0000, 40);      // (set, but the SWF never shows the border)
    sph.size = 300;
    sph.addHorizonPlaneClip(CS.directionLabels(function () {
      return { N: I18N.t("fd.N"), S: I18N.t("fd.S"), E: I18N.t("fd.E"), W: I18N.t("fd.W") };
    }, { size: 16, pos: { N: [-0.025, -73.85], S: [-0.025, 86.15], E: [81.975, 6.35], W: [-77.025, 6.35] } }), "directionLabels", "above");
    // Sun Disc (shape 31) and Moon Disc (shape 29), radius 9.5
    sph.addObject("sun", CS.shapeDrawer({ nz: false, layers: [[[[{ t: "r", m: [0.013138, 0, 0, 0.013138, 0, 0.05], s: [[0, "#ffcc00"], [1, "#edb101"]] },
      "M6.7 -6.7L8.1 -5Q9.5 -2.8 9.5 0Q9.5 3.9 6.7 6.75Q3.9 9.5 0 9.5Q-3.9 9.5 -6.7 6.75Q-9.5 3.9 -9.5 0Q-9.5 -2.8 -8.05 -5L-6.7 -6.7Q-3.9 -9.5 0 -9.5Q3.9 -9.5 6.7 -6.7Z"]], []]] }), { dec: 0, ra: 0 });
    sph.addObject("moon", CS.shapeDrawer({ nz: false, layers: [[[["#cccccc", "M8.1 -5Q9.5 -2.8 9.5 0Q9.5 3.9 6.7 6.75Q3.9 9.5 0 9.5Q-3.9 9.5 -6.7 6.75Q-9.5 3.9 -9.5 0Q-9.5 -2.8 -8.05 -5L-6.7 -6.7Q-3.9 -9.5 0 -9.5Q3.9 -9.5 6.7 -6.7L8.1 -5Z"]],
      [[1, "#909090", "M8.1 -5Q9.5 -2.8 9.5 0Q9.5 3.9 6.7 6.75Q3.9 9.5 0 9.5Q-3.9 9.5 -6.7 6.75Q-9.5 3.9 -9.5 0Q-9.5 -2.8 -8.05 -5L-6.7 -6.7Q-3.9 -9.5 0 -9.5Q3.9 -9.5 6.7 -6.7L8.1 -5"]]]] }), { dec: 0, ra: 12 });
    sph.addCircle("ecliptic", { alpha: 50, color: 0xa04040, thickness: 1 }, { tilt: 23.4, dec: 0, ra: 0 });
    sph.addCircle("meridian", { alpha: 70, color: 0xffe375, thickness: 1 }, { tilt: 90, alt: 0, az: 0 });
    sph.addCircle("celestialEquator", { alpha: 70, color: 0xffe375, thickness: 1 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addLine("ncpAxis", { alpha: 100, color: 0x75a9ff, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: 1 }, { system: "celestial", x: 0, y: 0, z: 1.2 });
    sph.addLine("scpAxis", { alpha: 100, color: 0x75a9ff, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: -1 }, { system: "celestial", x: 0, y: 0, z: -1.2 });
    sph.setThetaAndPhi(200, 20);
    sph.latitude = lat;

    function upd() {                                       // MoonDecDemoClass.update
      var s = sun(doy);
      sph.latitude = lat;
      sph.sun.setPosition({ dec: s.dec, ra: s.ra });
      sph.sun.setOrientationType("absolute");
      sph.moon.setPosition({ dec: -s.dec, ra: s.ra + 12 });
      sph.moon.setOrientationType("absolute");
      sph.siderealTime = s.ra + 12;
      outDate(dateString(doy));
      outMoon(fmt(-s.dec));
      outSun(fmt(s.dec));
      outAlt(sph.moon.getPositionHorizon().alt.toFixed(0) + "°");
      S.requestDraw();
    }
    function fmt(v) { return (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(1) + "°"; }
    S.refreshers.push(upd);

    /* ---- drag the day-of-year cursor (it wraps round the year), or swing the sphere ---- */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function cursorX() { return PLOT.x + doy * PLOT.w / 365; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), cx = cursorX();
      var onCursor = Math.abs(p.x - cx) <= 10 && p.y >= PLOT.y - 161.5 && p.y <= PLOT.y + 137.5;
      if (onCursor) drag = { plot: true, offset: cx - p.x };           // doyCursor.onPress
      else if (p.x >= PLOT.x && p.x <= PLOT.x + PLOT.w && Math.abs(p.y - PLOT.y) <= 137.5) {
        drag = { plot: true, offset: 0 }; setDoyFromX(p.x);
      } else if (sph.startDrag(p.x, p.y)) drag = { sphere: true };
      else return;
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      if (drag.plot) { setDoyFromX(p.x + drag.offset); return; }
      sph.dragTo(p.x, p.y);                                // updateSimpleDragging
      S.requestDraw();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; sph.endDrag(); });
    });
    function setDoyFromX(x) {                              // setDayOfYear: arg mod 365
      var d = 365 * (x - PLOT.x) / PLOT.w;
      doyCtl.set(((d % 365) + 365) % 365);
    }

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      FlashText.begin(ctx);
      S.clear();
      ctx.fillStyle = "#fafafa"; ctx.fillRect(0, 0, S.W, S.H);
      panel(ctx, 7, 37 + OY, 495, 386, t("fd.plot"));
      panel(ctx, 509, 37 + OY, 359, 386, t("fd.diagram"));
      drawPlot(ctx, t);
      ctx.save();
      ctx.beginPath(); ctx.rect(510, 38 + OY, 357, 384); ctx.clip();
      sph.draw(ctx);
      ctx.restore();
    });

    function panel(ctx, x, y, w, h, title) {               // Panel Background, 14 px #333333
      ctx.fillStyle = "#fafafa"; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      ctx.fillStyle = "#333333"; ctx.font = "14px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, title, x + 5, y + 4 + 1.0059 * 14);           // a field at (xMargin, 4): baseline = top + 2 + ascent
      ctx.strokeStyle = "#cccccc"; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x + 10 + FlashText.textWidth(ctx, title), y + 14.44); ctx.lineTo(x + w - 5, y + 14.44);   // 2·xMargin + textWidth
      ctx.stroke();
      ctx.lineCap = "butt";
    }

    /* ---- Moon Dec Plot: static art (shapes 59 and 81, texts 60–80) plus the curve and band ---- */
    function drawPlot(ctx, t) {
      ctx.save();
      ctx.translate(PLOT.x, PLOT.y);
      var ys = -(PLOT.h / 2) / PLOT.maxDec, dy = 7 * ys;
      ctx.fillStyle = "rgba(208,128,128,0.3)";             // bandMC: the curve ± 7°
      ctx.beginPath();
      var i, d, upper = [];
      for (i = 0; i <= PLOT.w; i++) {
        d = i * 365 / PLOT.w;
        var y = plotDec(d) * ys;
        if (i === 0) ctx.moveTo(i, y + dy); else ctx.lineTo(i, y + dy);
        upper.push(y - dy);
      }
      for (i = PLOT.w; i >= 0; i--) ctx.lineTo(i, upper[i]);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1;      // the dashed 0° line
      ctx.setLineDash([6, 6]); ctx.lineDashOffset = 2;
      ctx.beginPath(); ctx.moveTo(0, 0.5); ctx.lineTo(PLOT.w, 0.5); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "#a04040"; ctx.lineWidth = 1;      // curveMC, a hairline
      ctx.beginPath();
      for (i = 0; i <= PLOT.w; i++) {
        d = i * 365 / PLOT.w;
        if (i === 0) ctx.moveTo(i, plotDec(d) * ys); else ctx.lineTo(i, plotDec(d) * ys);
      }
      ctx.stroke();
      ctx.strokeStyle = "#666666";
      ctx.strokeRect(0, -137.5, PLOT.w, 275);
      ctx.beginPath();
      MONTH_TICKS.forEach(function (x) { ctx.moveTo(x + 0.5, 137.5); ctx.lineTo(x + 0.5, 143.4); });
      [-40, -30, -20, -10, 0, 10, 20, 30, 40].forEach(function (v) {
        var y = Math.round(-v * 3.4375 * 10) / 10 + 0.5;
        ctx.moveTo(v % 20 === 0 ? -8 : -6, y); ctx.lineTo(0, y);
      });
      ctx.stroke();
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT;
      ctx.textAlign = "right"; ctx.textBaseline = "alphabetic";
      // static texts, each placed by hand in sprite 82 (baseline = y + 12.05): the degree labels end at
      // −10.2 on rows that are not quite the 3.4375 px a degree of the ticks; the months are centred by hand
      [-40, -30, -20, -10, 0, 10, 20, 30, 40].forEach(function (v, k) {
        FlashText.fillStatic(ctx, v + "°", -10.2, DEG_BASE[k]);
      });
      ctx.textAlign = "center";
      for (i = 0; i < 12; i++) {
        FlashText.fillStatic(ctx, t("m" + (i + 1)), MONTH_C[i], 157.4);
      }
      var cx = doy * PLOT.w / 365;                         // doyCursor, shape 86
      ctx.fillStyle = "#9a9bfe"; ctx.strokeStyle = "#9a9bfe";
      ctx.beginPath();
      ctx.moveTo(cx - 10, -161.5); ctx.lineTo(cx + 10, -161.5); ctx.lineTo(cx, -145.5);
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx, -137.5); ctx.lineTo(cx, 137.5); ctx.stroke();
      ctx.restore();
    }

    upd();
  }
});
