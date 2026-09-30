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
    var NORTH = { x: 1, y: 0, z: 0 }, EAST = { x: 0, y: -1, z: 0 };
    var TILT = 23.4 * RAD, BAND = 5.1;

    var doy = 45, lat = 41, theta = 200, phi = 20, drag = null;   // reset(): (200, 20), day 45

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
    S.button({ labelKey: "fd.reset", on: function () { theta = 200; phi = 20; doyCtl.set(45); } });
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

    /* ---- the CelestialSphere projection, with the full moon on the meridian ---- */
    function mats() {
      var s = sun(doy), sT = (s.ra + 12) / 24 * TAU;       // siderealTime = sunRA + 12
      var ct = Math.cos(theta * RAD), st = Math.sin(theta * RAD);
      var cp = Math.cos(phi * RAD), sp = Math.sin(phi * RAD);
      var a = { a0: -R * st, a1: R * ct, a3: R * ct * sp, a4: R * st * sp, a5: -R * cp,
        a6: R * ct * cp, a7: R * st * cp, a8: R * sp };
      var m2 = Math.cos(lat * RAD), m3 = Math.sin(sT), m4 = -Math.cos(sT), m8 = Math.sin(lat * RAD);
      var m = { m0: m4 * m8, m1: -m3 * m8, m2: m2, m3: m3, m4: m4, m6: -m2 * m4, m7: m2 * m3, m8: m8 };
      var b = {
        b0: a.a0 * m.m0 + a.a1 * m.m3, b1: a.a0 * m.m1 + a.a1 * m.m4, b2: a.a0 * m.m2,
        b3: a.a3 * m.m0 + a.a4 * m.m3 + a.a5 * m.m6, b4: a.a3 * m.m1 + a.a4 * m.m4 + a.a5 * m.m7,
        b5: a.a3 * m.m2 + a.a5 * m.m8,
        b6: a.a6 * m.m0 + a.a7 * m.m3 + a.a8 * m.m6, b7: a.a6 * m.m1 + a.a7 * m.m4 + a.a8 * m.m7,
        b8: a.a6 * m.m2 + a.a8 * m.m8 };
      return { a: a, m: m, b: b };
    }
    var M = mats();
    function cart(ra, dec) {
      var d = dec * RAD, h = ra * 15 * RAD;
      return { x: Math.cos(d) * Math.cos(h), y: Math.cos(d) * Math.sin(h), z: Math.sin(d) };
    }
    function hCart(az, alt) {
      var A = -az * RAD, h = alt * RAD;
      return { x: Math.cos(h) * Math.cos(A), y: Math.cos(h) * Math.sin(A), z: Math.sin(h) };
    }
    function vecH(v) {
      var a = M.a;
      return { x: v.x * a.a0 + v.y * a.a1, y: v.x * a.a3 + v.y * a.a4 + v.z * a.a5,
        z: v.x * a.a6 + v.y * a.a7 + v.z * a.a8 };
    }
    function vecC(v) {
      var b = M.b;
      return { x: v.x * b.b0 + v.y * b.b1 + v.z * b.b2, y: v.x * b.b3 + v.y * b.b4 + v.z * b.b5,
        z: v.x * b.b6 + v.y * b.b7 + v.z * b.b8 };
    }
    function projH(p) { var q = vecH(p); return { x: C.x + q.x, y: C.y + q.y, z: q.z }; }
    function projC(p) { var q = vecC(p); return { x: C.x + q.x, y: C.y + q.y, z: q.z }; }
    function altOf(ra, dec) {
      var p = cart(ra, dec), m = M.m;
      return Math.asin(Math.max(-1, Math.min(1, p.x * m.m6 + p.y * m.m7 + p.z * m.m8))) * DEG;
    }
    // a point on the circle `dec` degrees off the great circle tilted by TILT about the x axis
    function tilted(g, dec) {
      var d = dec * RAD, c = Math.cos(d);
      var x = c * Math.cos(g), y0 = c * Math.sin(g), z0 = Math.sin(d);
      return { x: x, y: y0 * Math.cos(TILT) - z0 * Math.sin(TILT), z: y0 * Math.sin(TILT) + z0 * Math.cos(TILT) };
    }

    function upd() {
      M = mats();
      var s = sun(doy);
      outDate(dateString(doy));
      outMoon(fmt(-s.dec));
      outSun(fmt(s.dec));
      outAlt(altOf(s.ra + 12, -s.dec).toFixed(0) + "°");
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
      } else if (Math.hypot(p.x - C.x, p.y - C.y) < R + 20) {
        drag = { x: p.x, y: p.y, theta: theta, phi: phi };
      } else return;
      S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      if (drag.plot) { setDoyFromX(p.x + drag.offset); return; }
      var k = 57.2958 / R;
      theta = (((drag.theta + k * (p.x - drag.x)) % 360) + 360) % 360;
      phi = Math.max(7, Math.min(90, drag.phi - k * (p.y - drag.y)));
      upd();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; });
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
      drawSphere(ctx, t);
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

    /* ---- Moon Dec Demo: the sphere, layered as the CelestialSphere engine layers it ---- */
    function drawSphere(ctx, t) {
      var s = sun(doy);
      var objs = [
        { kind: "sun", p: cart(s.ra, s.dec) },
        { kind: "moon", p: cart(s.ra + 12, -s.dec) }
      ].map(function (o) { o.s = projC(o.p); return o; })
        .sort(function (a, b) { return a.s.z - b.s.z; });
      axis(ctx, false);
      ctx.save(); discClip(ctx); circles(ctx, false); ctx.restore();
      objs.forEach(function (o) { if (o.s.z < 0) glyph(ctx, o); });
      band(ctx, false);
      horizonPlane(ctx, t);
      ctx.save(); discClip(ctx);
      var bowl = ctx.createRadialGradient(C.x, C.y, 0, C.x, C.y, R);   // the "celestialBowl"
      bowl.addColorStop(0, "rgba(255,255,255,0)"); bowl.addColorStop(1, "rgba(0,0,0,0.2)");
      ctx.fillStyle = bowl; ctx.fillRect(C.x - R, C.y - R, 2 * R, 2 * R);
      ctx.restore();
      band(ctx, true);
      ctx.save(); discClip(ctx); circles(ctx, true); ctx.restore();
      objs.forEach(function (o) { if (o.s.z >= 0) glyph(ctx, o); });
      axis(ctx, true);
    }
    function discClip(ctx) { ctx.beginPath(); ctx.arc(C.x, C.y, R, 0, TAU); ctx.clip(); }
    function circles(ctx, front) {
      seg(ctx, function (u) { return projC(tilted(u * TAU, 0)); }, front, "#a04040", 1, 0.5);   // ecliptic
      seg(ctx, function (u) { return projH(hCart(0, u * 360)); }, front, "#ffe375", 1, 0.7);    // meridian
      seg(ctx, function (u) { return projC(cart(u * 24, 0)); }, front, "#ffe375", 1, 0.7);      // equator
    }
    function seg(ctx, fn, front, colour, w, alpha) {
      ctx.strokeStyle = colour; ctx.lineWidth = w; ctx.globalAlpha = alpha;
      ctx.beginPath();
      var started = false, prev = null;
      for (var i = 0; i <= 240; i++) {
        var p = fn(i / 240);
        if ((p.z >= 0) !== front) { started = false; prev = p; continue; }
        if (!started) {
          if (prev) {                                       // start on the limb, not a step inside it
            var k = prev.z / (prev.z - p.z);
            ctx.moveTo(prev.x + (p.x - prev.x) * k, prev.y + (p.y - prev.y) * k);
          } else ctx.moveTo(p.x, p.y);
          started = true;
        }
        ctx.lineTo(p.x, p.y);
        prev = p;
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    function axis(ctx, front) {                            // ncpAxis / scpAxis, 2 px #75a9ff
      ctx.strokeStyle = "#75a9ff"; ctx.lineWidth = 2;
      [1, -1].forEach(function (k) {
        var p1 = projC({ x: 0, y: 0, z: k }), p2 = projC({ x: 0, y: 0, z: 1.2 * k });
        if ((p1.z >= 0) !== front) return;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      });
    }
    // 'absolute' orientation with the outward normal: the disc lies in the sphere's tangent plane
    function glyph(ctx, o) {
      var n = o.p, u;
      if (n.x === 0 && n.y === 0) u = { x: 0, y: 1, z: 0 };
      else u = { x: -n.x * n.z, y: -n.z * n.y, z: n.x * n.x + n.y * n.y };
      var l = Math.hypot(u.x, u.y, u.z);
      u = { x: u.x / l, y: u.y / l, z: u.z / l };
      var w = { x: u.y * n.z - u.z * n.y, y: u.z * n.x - u.x * n.z, z: u.x * n.y - u.y * n.x };
      var W = vecC(w), U = vecC(u);
      ctx.save();
      ctx.transform(W.x / R, W.y / R, -U.x / R, -U.y / R, o.s.x, o.s.y);
      ctx.beginPath(); ctx.arc(0, 0, 9.5, 0, TAU);
      if (o.kind === "sun") {                              // Sun Disc, shape 31
        var g = ctx.createRadialGradient(0, 0.05, 0, 0, 0.05, 10.73);
        g.addColorStop(0, "#ffcc00"); g.addColorStop(1, "#edb101");
        ctx.fillStyle = g; ctx.fill();
      } else {                                             // Moon Disc, shape 29
        ctx.fillStyle = "#cccccc"; ctx.fill();
        ctx.strokeStyle = "#909090"; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.restore();
    }

    // the Moon's range, 5.1° either side of the ecliptic: Symbol 204's gradient masked to the
    // band, its far half beneath the horizon plane and its near half above, bordered #ff0000 @ 40 %
    var bandCache = {};
    function band(ctx, front) {
      var key = [theta, phi, lat, doy, front].join();
      if (!bandCache[key]) {
        if (Object.keys(bandCache).length > 8) bandCache = {};
        bandCache[key] = bandLayer(front);
      }
      ctx.drawImage(bandCache[key], C.x - R, C.y - R, 2 * R, 2 * R);
      ctx.save(); discClip(ctx);
      [BAND, -BAND].forEach(function (d) {
        seg(ctx, function (u) { return projC(tilted(u * TAU, d)); }, front, "#ff0000", 1, 0.4);
      });
      ctx.restore();
    }
    function bandLayer(front) {
      var q = 2, N = 2 * R * q, cv = document.createElement("canvas");
      cv.width = cv.height = N;
      var g = cv.getContext("2d"), img = g.createImageData(N, N), px = img.data, b = M.b;
      var c0 = [241, 141, 141], c1 = [108, 30, 30], A = 102;
      var gx = 0.31, gy = -0.34, gr = 1.469;               // gradient centre and radius, sphere units
      var sgn = front ? 1 : -1, lim = Math.sin(BAND * RAD), st = Math.sin(TILT), ct = Math.cos(TILT);
      for (var j = 0; j < N; j++) {
        var y = (j + 0.5) / (R * q) - 1;
        for (var i = 0; i < N; i++) {
          var x = (i + 0.5) / (R * q) - 1, s2 = 1 - x * x - y * y;
          if (s2 < 0) continue;
          var z = sgn * Math.sqrt(s2);
          var py = (b.b1 * x + b.b4 * y + b.b7 * z) / R, pz = (b.b2 * x + b.b5 * y + b.b8 * z) / R;
          if (Math.abs(ct * pz - st * py) > lim) continue;
          var tt = Math.min(1, Math.hypot(x - gx, y - gy) / gr), o = 4 * (j * N + i);
          px[o] = c0[0] + (c1[0] - c0[0]) * tt;
          px[o + 1] = c0[1] + (c1[1] - c0[1]) * tt;
          px[o + 2] = c0[2] + (c1[2] - c0[2]) * tt;
          px[o + 3] = A;
        }
      }
      g.putImageData(img, 0, 0);
      return cv;
    }

    function horizonPlane(ctx, t) {                        // CSAboveHorizonPlane + Symbol 169
      ctx.save();
      var e = vecH(EAST), n = vecH(NORTH);                 // plane units: radius 100, north = −y
      ctx.transform(e.x / 100, e.y / 100, -n.x / 100, -n.y / 100, C.x, C.y);
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 101.4);
      g.addColorStop(0, "#51c451"); g.addColorStop(1, "#3aa53a");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 16px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      FlashText.fillStatic(ctx, t("fd.N"), 0, -73.85);
      FlashText.fillStatic(ctx, t("fd.S"), 0, 86.15);
      FlashText.fillStatic(ctx, t("fd.E"), 81.93, 6.35);
      FlashText.fillStatic(ctx, t("fd.W"), -77.08, 6.35);
      ctx.restore();
    }

    upd();
  }
});
