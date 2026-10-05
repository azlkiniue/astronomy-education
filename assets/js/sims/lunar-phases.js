/* Lunar Phase Simulator -------------------------------------------------------
   Faithful rebuild of the NAAP / ClassAction "Lunar Phase Simulator"
   (lunarapplet.swf, the same file as NAAP's lps.swf), read from its decompiled
   ActionScript (python3 tools/swf-actions.py) and drawn with the SWF's own art
   (_lunarphases-art.js, from tools/swf-inspect.py canvas).

   • The orbit view (GeometryDiagram): sunlight from the left, the Earth turning
     with the time of day (drag it), the Moon on its orbit (drag it), the night
     sides shaded, and optionally the elongation angle, the lunar landmark and
     the time tickmarks.
   • Moon Phase: the phase name (a drop-down that also sets the phase), the
     SWF's photograph of the Moon under a terminator mask, the percentage lit
     and the time since new moon.
   • Horizon Diagram: the shared CelestialSphere (_celestialsphere.js) set up as
     the SWF's init() does — a 200 px sphere at a mid-northern latitude whose
     sidereal time stays 0 while the Sun's and Moon's right ascensions move
     (Sun RA = 12h − time, Moon RA = Sun RA + phase/15). Drag the Sun (time and
     phase, the Moon staying put) or the Moon (phase), or the sphere to turn it.
   • Animation and Time Controls, Diagram Options — the SWF's own controls on
     the canvas, mirrored in the sidebar.
   Model (the SWF's root script): time in hours and phase in degrees; animation
   adds speed·Δt days (speed 7e−5 … 0.002 day/ms, 0.0003 at the start), i.e.
   24 h and 360°/29.5 per day.                                                   */
Sim.create({
  id: "lunar-phases",
  width: 840, height: 650,
  strings: {
    en: {
      "lp.sunlight": "sunlight", "lp.sunrise": "sunrise", "lp.noon": "noon", "lp.sunset": "sunset", "lp.midnight": "midnight",
      "lp.animTitle": "Animation and Time Controls", "lp.start": "start animation", "lp.pause": "pause animation",
      "lp.rate": "animation rate", "lp.increment": "increment animation",
      "lp.animDay": "day", "lp.animHour": "hour", "lp.animMinute": "minute",
      "lp.optTitle": "Diagram Options", "lp.showAngle": "show angle", "lp.showLandmark": "show lunar landmark",
      "lp.showTicks": "show time tickmarks",
      "lp.horTitle": "Horizon Diagram", "lp.localTime": "observer's local time", "lp.am": "am", "lp.pm": "pm",
      "lp.show": "show", "lp.hide": "hide",
      "lp.phaseTitle": "Moon Phase", "lp.since": "time since new moon", "lp.illuminated": "illuminated",
      "lp.daySing": "day", "lp.days": "days", "lp.hourSing": "hour", "lp.hours": "hours",
      "lp.ph0": "New Moon", "lp.ph1": "Waxing Crescent", "lp.ph2": "First Quarter", "lp.ph3": "Waxing Gibbous",
      "lp.ph4": "Full Moon", "lp.ph5": "Waning Gibbous", "lp.ph6": "Third Quarter", "lp.ph7": "Waning Crescent",
      "lp.reset": "reset", "lp.phase": "phase", "lp.showPhase": "show the Moon Phase panel",
      "lp.showHorizon": "show the Horizon Diagram panel", "lp.perSec": "days/sec",
      "lp.dayBack": "− 1 day", "lp.dayFwd": "+ 1 day", "lp.hourBack": "− 1 hour", "lp.hourFwd": "+ 1 hour",
      "lp.minBack": "− 1 minute", "lp.minFwd": "+ 1 minute",
      "dir.N": "N", "dir.S": "S", "dir.E": "E", "dir.W": "W"
    },
    id: {
      "lp.sunlight": "sinar Matahari", "lp.sunrise": "terbit", "lp.noon": "tengah hari", "lp.sunset": "terbenam", "lp.midnight": "tengah malam",
      "lp.animTitle": "Kendali Animasi dan Waktu", "lp.start": "mulai animasi", "lp.pause": "jeda animasi",
      "lp.rate": "laju animasi", "lp.increment": "langkah animasi",
      "lp.animDay": "hari", "lp.animHour": "jam", "lp.animMinute": "menit",
      "lp.optTitle": "Opsi Diagram", "lp.showAngle": "tampilkan sudut", "lp.showLandmark": "tampilkan penanda Bulan",
      "lp.showTicks": "tampilkan penanda waktu",
      "lp.horTitle": "Diagram Horizon", "lp.localTime": "waktu lokal pengamat", "lp.am": "pagi", "lp.pm": "sore",
      "lp.show": "tampilkan", "lp.hide": "sembunyikan",
      "lp.phaseTitle": "Fase Bulan", "lp.since": "waktu sejak bulan baru", "lp.illuminated": "tersinari",
      "lp.daySing": "hari", "lp.days": "hari", "lp.hourSing": "jam", "lp.hours": "jam",
      "lp.ph0": "Bulan Baru", "lp.ph1": "Sabit Awal", "lp.ph2": "Kuartal Pertama", "lp.ph3": "Cembung Awal",
      "lp.ph4": "Purnama", "lp.ph5": "Cembung Akhir", "lp.ph6": "Kuartal Akhir", "lp.ph7": "Sabit Akhir",
      "lp.reset": "atur ulang", "lp.phase": "fase", "lp.showPhase": "tampilkan panel Fase Bulan",
      "lp.showHorizon": "tampilkan panel Diagram Horizon", "lp.perSec": "hari/detik",
      "lp.dayBack": "− 1 hari", "lp.dayFwd": "+ 1 hari", "lp.hourBack": "− 1 jam", "lp.hourFwd": "+ 1 jam",
      "lp.minBack": "− 1 menit", "lp.minFwd": "+ 1 menit",
      "dir.N": "U", "dir.S": "S", "dir.E": "T", "dir.W": "B"
    }
  },
  about: {
    en: "<p>This simulator shows how the Moon's place in its orbit, its phase, and its position in the sky of an observer at different times of day go together. Half of the Moon is always lit by the Sun; the <strong>phase</strong> is how much of that lit half faces Earth.</p>" +
        "<p>The large panel looks down on Earth's North Pole with sunlight coming from the left. Drag the <strong>Moon</strong> around its orbit to change its position, or drag the <strong>Earth</strong> to turn it and change the time of day for the stick figure standing on it. The <strong>Animation and Time Controls</strong> run the clock, or step it by a day, an hour or a minute.</p>" +
        "<p>The <strong>Moon Phase</strong> panel shows how the Moon looks from Earth for that geometry. The <strong>Horizon Diagram</strong> shows the sky of the stick figure, an observer at mid-northern latitudes: you can drag the Sun or the Moon there too. <strong>show angle</strong> marks the Moon's elongation from the Sun in both diagrams, the lunar landmark marks a point on the Moon's near side, and the time tickmarks label the times of day around the globe. The show/hide buttons hide a panel's contents, for classroom questions.</p>",
    id: "<p>Simulator ini menunjukkan hubungan antara posisi Bulan di orbitnya, fasenya, dan posisinya di langit pengamat pada berbagai waktu dalam sehari. Separuh Bulan selalu disinari Matahari; <strong>fase</strong> adalah seberapa banyak separuh yang tersinari itu menghadap Bumi.</p>" +
        "<p>Panel besar memperlihatkan Kutub Utara Bumi dari atas, dengan sinar Matahari datang dari kiri. Seret <strong>Bulan</strong> mengelilingi orbitnya untuk mengubah posisinya, atau seret <strong>Bumi</strong> untuk memutarnya dan mengubah waktu bagi tokoh yang berdiri di atasnya. <strong>Kendali Animasi dan Waktu</strong> menjalankan jam, atau memajukannya sehari, sejam, atau semenit.</p>" +
        "<p>Panel <strong>Fase Bulan</strong> menampilkan rupa Bulan dari Bumi untuk susunan itu. <strong>Diagram Horizon</strong> menampilkan langit tokoh tersebut, pengamat di lintang menengah utara: Matahari dan Bulan juga dapat diseret di sana. <strong>tampilkan sudut</strong> menandai elongasi Bulan dari Matahari di kedua diagram, penanda Bulan menandai satu titik di sisi dekat Bulan, dan penanda waktu menamai waktu-waktu di sekeliling Bumi. Tombol tampilkan/sembunyikan menyembunyikan isi panel, untuk pertanyaan di kelas.</p>"
  },
  build: function (S) {
    var CS = window.CelestialSphere, ART = window.LUNAR_PHASES_ART;
    var RAD = Math.PI / 180, DEG = 180 / Math.PI, TAU = Math.PI * 2, HALF_PI = Math.PI / 2;
    var FONT = "Verdana, Geneva, sans-serif", ASC = 1.0059;
    var OY = -30;                                   // the SWF's title bar is the page header here
    var SYNODIC = 29.5;
    function mod(n, m) { return ((n % m) + m) % m; }
    function t(k) { return I18N.t(k); }
    function isEN() { return I18N.getLang() !== "id"; }
    function font(ctx, size, bold) { ctx.font = (bold ? "bold " : "") + size + "px " + FONT; }
    function shape(ctx, id) { CS.drawShape(ctx, ART[id]); }
    function inRect(p, x, y, w, h) { return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h; }

    /* ---- the stage (stage coordinates; the canvas is the stage below its title bar) ---- */
    var GD = { x: 360, y: 274 };                    // geometryDiagram (and the orbitPath under it)
    var R_ORBIT = 200;
    var MPD = { x: 717.5, y: 188, k: 0.8 };         // moonPhaseDiagram
    var PANELS = [                                   // Panel Background: 300×150 placeholders, scaled
      { x: 604, y: 37, w: 229, h: 334, key: "lp.phaseTitle" },
      { x: 604, y: 378, w: 229, h: 295, key: "lp.horTitle" },
      { x: 7, y: 518, w: 370, h: 155, key: "lp.animTitle" },
      { x: 384, y: 518, w: 213, h: 155, key: "lp.optTitle" }
    ];
    var BTN_ANIM = { x: 58.5, y: 559.5, w: 125, h: 27 };
    var STEPS = [                                    // the −/+ FPushButtons (20 × 20)
      { x: 291.75, y: 578.95, label: "-", go: function () { stepBy(-24, -360 / SYNODIC); } },
      { x: 316.7, y: 578.95, label: "+", go: function () { stepBy(24, 360 / SYNODIC); } },
      { x: 291.75, y: 606.55, label: "-", go: function () { stepBy(-1, -360 / (24 * SYNODIC)); } },
      { x: 316.7, y: 606.55, label: "+", go: function () { stepBy(1, 360 / (24 * SYNODIC)); } },
      { x: 291.75, y: 634.15, label: "-", go: function () { stepBy(-1 / 60, -360 / (1440 * SYNODIC)); } },
      { x: 316.7, y: 634.15, label: "+", go: function () { stepBy(1 / 60, 360 / (1440 * SYNODIC)); } }
    ];
    STEPS.forEach(function (b) { b.w = 20; b.h = 20; });
    var BTN_PHASE = { y: 343, h: 20 }, BTN_HOR = { y: 645, h: 20 };     // the show/hide buttons
    var CHECKS = [
      { y: 572, key: "lp.showAngle", get: function () { return showAngle; }, set: function (b) { setShowAngle(b); } },
      { y: 599, key: "lp.showLandmark", get: function () { return showLandmark; }, set: function (b) { showLandmark = b; } },
      { y: 626, key: "lp.showTicks", get: function () { return showTicks; }, set: function (b) { showTicks = b; } }
    ];
    var COMBO = { x: 644.5, y: 67.5, w: 148 }, COMBO_H = 18, ROW_H = 16;
    var BLOCKER = { x: 628.5, y: 59.5, w: 173, h: 36 };   // comboBlocker, shown while animating

    /* ---- Slider Logic v6: animationSpeedSlider, log 7e−5 … 0.002, 2 significant digits.
       Standard Slider v6 without a field: _width 201.05 × 0.657333, barSpacing 0, barMargin 7 ---- */
    function SliderLogic(o) {
      var s = { min: o.min, max: o.max, digs: o.digits, minP: o.minP, maxP: o.minP + o.range };
      s.lower = Math.pow(10, s.digs - 1); s.upper = Math.pow(10, s.digs); s.perMag = 9 * s.lower;
      s.scale = (Math.log(s.max) - Math.log(s.min)) / (s.maxP - s.minP);
      s.fromParam = function (p) { return Math.exp((p - s.minP) * s.scale + Math.log(s.min)); };
      s.toParam = function (v) { return s.minP + (Math.log(v) - Math.log(s.min)) / s.scale; };
      function valueOf(sig, mag) {
        var e = mag - (s.digs - 1);
        return e >= 0 ? sig * Math.pow(10, e) : sig / Math.pow(10, -e);
      }
      s.snap = function (x) {
        x = Math.min(s.max, Math.max(s.min, x));
        var mag = Math.floor(Math.log(x) / Math.LN10), sig = Math.round(x * s.lower / Math.pow(10, mag));
        if (sig >= s.upper) { sig = s.lower; mag += 1; }
        return { value: valueOf(sig, mag), mag: mag, sig: sig };
      };
      s.step = function (obj, ticks) {
        ticks = Math.round(ticks);
        var f = ticks / s.perMag, dMag, dSig;
        if (f >= 1) { dMag = Math.floor(f); dSig = ticks - dMag * s.perMag; }
        else if (f <= -1) { dMag = Math.ceil(f); dSig = ticks - dMag * s.perMag; }
        else { dMag = 0; dSig = ticks; }
        var sig = obj.sig + dSig, mag = obj.mag + dMag;
        if (sig >= s.upper) { sig -= s.perMag; mag += 1; } else if (sig < s.lower) { sig += s.perMag; mag -= 1; }
        var v = valueOf(sig, mag);
        if (v < s.min) return s.snap(s.min);
        if (v > s.max) return s.snap(s.max);
        return { value: v, mag: mag, sig: sig };
      };
      s.obj = s.snap(o.value);
      return s;
    }
    var RATE = SliderLogic({ min: 7e-5, max: 0.002, digits: 2, minP: 7, range: 201.05 * 0.657333 - 14, value: 0.0003 });
    RATE.x = 55.25; RATE.y = 646.55;

    /* ---- state: geometryDiagram.time / .phase and the options ---- */
    var M = { time: 12, phase: 0 };
    var showAngle = false, showLandmark = false, showTicks = false;
    var phaseShown = true, horizonShown = true;
    var animating = false;
    function sunRA() { return 12 - M.time; }
    function earthRot() { return 360 - 15 * M.time; }           // _detailedEarth._rotation
    function twips(v) { return Math.trunc(v * 20) / 20; }      // a clip's _x / _y is held in whole twips
    function moonXY() {                                          // GDMoon.rawMoonAngle = 180° − phase
      var a = (180 - M.phase) * RAD;
      return { x: twips(R_ORBIT * Math.cos(a)), y: twips(R_ORBIT * Math.sin(a)), a: a };
    }

    /* ---- the CelestialSphere, as init() sets it up ---- */
    var sph = new CS({ x: 718.5, y: 510 });
    sph.siderealTime = 0;
    sph.showUnder = true;
    sph.minViewerAltitude = 10;
    sph.size = 200;
    var planeMask = { upper: null, lower: null };
    function planeGlyph(ctx, o) {                    // Equatorial Plane Disc, its fullDiscMC under maskMC
      var pie = o === sph.upperPlane ? planeMask.upper : planeMask.lower;
      if (!pie) return;
      ctx.save(); ctx.clip(pie); shape(ctx, 97); ctx.restore();
    }
    sph.addObject("upperPlane", planeGlyph, { system: "horizon", x: 0, y: 0, z: 0.001 });
    sph.upperPlane.setOrientationType("absolute", { dec: 90, ra: 0 }, { dec: 0, ra: 6 });
    sph.addObject("lowerPlane", planeGlyph, { system: "horizon", x: 0, y: 0, z: -0.001 });
    sph.lowerPlane.setOrientationType("absolute", { dec: 90, ra: 0 }, { dec: 0, ra: 6 });
    sph.addObject("stickman", CS.art.stickmanSmall, { r: 0, az: 0, alt: 0 });
    sph.stickman.setOrientationType("skewed", { az: 0, alt: 90 });
    sph.removeClip("celestialBowl");
    // 'direction labels light': four bold 15 px fields, centred (the SWF's field rectangles)
    sph.addHorizonPlaneClip(function (ctx) {
      font(ctx, 15, true); ctx.fillStyle = "#ffffff"; ctx.textBaseline = "alphabetic";
      var y0 = 2 + ASC * 15;
      FlashText.fill(ctx, t("dir.N"), -14.7 + 14.725, -92.3 - 2 + y0, "center");
      FlashText.fill(ctx, t("dir.S"), -14.35 + 14.35, 76.7 - 2 + y0, "center");
      FlashText.fill(ctx, t("dir.E"), 69.15 + 12.925, -9.1 - 2 + y0, "center");
      FlashText.fill(ctx, t("dir.W"), -96.8 + 14.4, -9.1 - 2 + y0, "center");
    }, "directionLabels");
    var hotSym = null;                               // the SunSymbol / MoonSymbol on its frame 2
    sph.addObject("moon", function (ctx, o) { shape(ctx, 93); shape(ctx, hotSym === o ? 95 : 94); }, { dec: 0, ra: 0 });
    sph.addObject("sun", function (ctx, o) { shape(ctx, 80); shape(ctx, hotSym === o ? 82 : 81); }, { dec: 0, ra: 0 });
    var GDisk = CS.GradientDisk;
    sph.addShadingClip(GDisk, "blackBackgroundAbove", "back", "outer", "above", { outerAlpha: 100, innerAlpha: 100, outerColor: 0, innerColor: 0 });
    sph.addShadingClip(GDisk, "blackBackgroundBelow", "back", "outer", "below", { outerAlpha: 100, innerAlpha: 100, outerColor: 0, innerColor: 0 });
    sph.addShadingClip(GDisk, "belowSky1", "back", "outer", "below", { outerAlpha: 35, innerAlpha: 35, outerColor: 0xffffff, innerColor: 0xffffff });
    sph.addShadingClip(GDisk, "belowSky2", "front", "outer", "below", { outerAlpha: 35, innerAlpha: 55, outerColor: 0, innerColor: 0 });
    sph.addShadingClip(GDisk, "frontSky", "front", "inner", "above", { outerColor: 0x84cbff, innerColor: 0x84cbff });
    sph.addShadingClip(GDisk, "backSky", "back", "outer", "above", { outerColor: 0x84cbff, innerColor: 0x84cbff });
    sph.addLine("sunLine", { alpha: 100, color: 0xffde64, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: 1 }, { system: "celestial", x: 0, y: 0, z: 0 });
    sph.addLine("moonLine", { alpha: 100, color: 0xffde64, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: 1 }, { system: "celestial", x: 0, y: 0, z: 0 });
    sph.addCircle("elongationArc", { alpha: 100, color: 0xffde64, thickness: 2 }, { tilt: 0, dec: 0, ra: 0 }, 50);
    sph.addCircle("meridian1", { alpha: 50, color: 0xeeeeee, thickness: 1 }, { tilt: 90, alt: 0, az: 0 });
    sph.addCircle("meridian2", { alpha: 50, color: 0xeeeeee, thickness: 1 }, { tilt: 90, alt: 0, az: 90 });
    sph.addCircle("celestialEquator", { alpha: 100, color: 0xffffff, thickness: 0 }, { tilt: 0, dec: 0, ra: 0 });

    /* the arc helper the SWF adds to MovieClip (drawArc: steps of ≤ 0.5 rad, y up) */
    function drawArc(g, x, y, r, a0, a1, move) {
      a0 = mod(a0, TAU); a1 = mod(a1, TAU);
      var arc = a1 - a0;
      if (arc < 0) arc += TAU;
      var n = Math.ceil(arc / 0.5), step = arc / n, half = step / 2, cr = r / Math.cos(half), a = a0, c = a0 - half;
      if (move !== false) g.moveTo(x + r * Math.cos(a0), y - r * Math.sin(a0));
      for (var i = 0; i < n; i++) {
        a += step; c += step;
        g.quadraticCurveTo(x + cr * Math.cos(c), y - cr * Math.sin(c), x + r * Math.cos(a), y - r * Math.sin(a));
      }
    }

    /* ---- updateElongationAngle (the horizon diagram's half; the orbit view draws its own) ---- */
    function updateElongationAngle() {
      if (!showAngle) return;
      var m = sph.moon._p, s = sph.sun._p;
      if (m.x === s.x && m.y === s.y) sph.elongationArc.visible = false;
      else {
        sph.elongationArc.setArcPoints("moon", "sun");
        var tl = sph.elongationArc.tilt;                 // (only an arc off the equator is turned over)
        if (tl !== 0 && tl !== 180) sph.elongationArc.tilt = 180;
        sph.elongationArc.visible = true;
      }
      sph.moonLine.setHeadPoint(sph.moon.getPosition());
      sph.sunLine.setHeadPoint(sph.sun.getPosition());
      // the two planes' masks: the pie between the Sun's and the Moon's RA (going east), split at the horizon
      var a = sunRA(), b = a + M.phase / 15, lo, hi;
      if (mod(a - b, 24) < 12) { lo = b; hi = a; } else { lo = a; hi = b; }
      lo = mod(lo, 24) * Math.PI / 12; hi = mod(hi, 24) * Math.PI / 12;
      var loUp = lo < HALF_PI || lo > 3 * HALF_PI, R = 100;
      var upper = null, lower = null;
      function pie(a0, a1) {
        var p = new Path2D();
        p.moveTo(0, 0); p.lineTo(R * Math.cos(a0), -R * Math.sin(a0));
        drawArc(p, 0, 0, R, a0, a1); p.lineTo(0, 0);
        return p;
      }
      if (hi < HALF_PI || hi > 3 * HALF_PI) {
        if (loUp) upper = pie(lo, hi);
        else { lower = pie(lo, 3 * HALF_PI); upper = pie(3 * HALF_PI, hi); }
      } else if (loUp) { upper = pie(lo, HALF_PI); lower = pie(HALF_PI, hi); }
      else lower = pie(lo, hi);
      planeMask = { upper: upper, lower: lower };
    }
    function setSkyColor() {
      var f = sph.sun.alt / 10 + 0.5;
      f = f > 1 ? 1 : f < 0 ? 0 : f;
      sph.backSky.innerAlpha = 70 * f + 30; sph.backSky.outerAlpha = 60 * f + 20;
      sph.frontSky.innerAlpha = 10 * f; sph.frontSky.outerAlpha = 25 * f + 15;
    }
    // timeAndPhaseChanged / phaseChanged / timeChanged: the sky follows the model
    function changed() {
      var ra = sunRA();
      sph.sun.ra = ra; sph.sun.setOrientationType("absolute");
      sph.moon.ra = ra + M.phase / 15; sph.moon.setOrientationType("absolute");
      updateElongationAngle();
      setSkyColor();
      syncSidebar();
      S.requestDraw();
    }
    function setTime(v) { M.time = mod(v, 24); }
    function setPhase(v) { M.phase = mod(v, 360); }
    function stepBy(dt, dp) { setTime(M.time + dt); setPhase(M.phase + dp); changed(); }
    function setShowAngle(b) {                       // changeShowAngle
      showAngle = b;
      sph.stickman.visible = !b;
      sph.moonLine.visible = b; sph.sunLine.visible = b;
      if (b) updateElongationAngle();
      else { sph.elongationArc.visible = false; planeMask = { upper: null, lower: null }; }
    }

    /* ---- the readouts (updatePercentIlluminated, updateTimeSinceNew, updateLocalTime) ---- */
    function phaseIndex(p) {                         // the combo's selection: fTol 12°, qTol 5°
      if (!(p > 12)) return 0; if (!(p > 85)) return 1; if (!(p > 95)) return 2; if (!(p > 168)) return 3;
      if (!(p > 192)) return 4; if (!(p > 265)) return 5; if (!(p > 275)) return 6; if (!(p > 348)) return 7;
      return 0;
    }
    function percentText() {
      var n = Math.round(500 * (1 - Math.cos(M.phase * RAD)));
      return n / 10 + (n % 10 === 0 ? ".0% " : "% ") + t("lp.illuminated");
    }
    function sinceText() {
      var d = SYNODIC * (mod(M.phase, 360) / 360), h = (d - Math.floor(d)) * 24, s = "";
      if (!(d < 1) && d < 2) s = "1 " + t("lp.daySing") + ", ";
      else if (!(d < 2)) s = Math.floor(d) + " " + t("lp.days") + ", ";
      if (!(h < 1) && h < 2) s += "1 " + t("lp.hourSing");
      else s += Math.floor(h) + " " + t("lp.hours");
      return s;
    }
    function timeText() {
      var h = mod(M.time, 24), m = Math.floor(60 * (h % 1));
      if (!isEN()) return Math.floor(h) + ":" + (m < 10 ? "0" : "") + m;     // a 24-hour clock, as the SWF's nl/sl
      var h12 = Math.floor(h) % 12;
      return (h12 === 0 ? 12 : h12) + ":" + (m < 10 ? "0" : "") + m + " " + t(h < 12 ? "lp.am" : "lp.pm");
    }
    function toFixed1(v) {                           // the SWF's own Number.toFixed (Math.round based)
      var n = Math.round(v * 10), s = String(Math.abs(n));
      if (s.length < 2) s = "0" + s;
      return (n < 0 ? "-" : "") + s.slice(0, -1) + "." + s.slice(-1);
    }

    /* ---- the animation (onEnterFrameFunc) ---- */
    var loop = S.loop(function (dt) {
      var days = RATE.obj.value * dt * 1000;
      setTime(M.time + 24 * days);
      setPhase(M.phase + days / SYNODIC * 360);
      changed();
    });
    function startAnimation() { animating = true; openCombo = null; loop.play(); syncPlay(); S.requestDraw(); }
    function stopAnimation() { animating = false; loop.pause(); syncPlay(); S.requestDraw(); }
    function toggleAnimation() { if (animating) stopAnimation(); else startAnimation(); }
    function onReset() {
      stopAnimation();
      M.time = 12; M.phase = 0;
      RATE.obj = RATE.snap(0.0003);
      phaseShown = true; horizonShown = true;
      showLandmark = false; showTicks = false; setShowAngle(false);
      openCombo = null; comboFocus = false;
      changed();
      sph.setThetaAndPhi(90, 17);
      S.requestDraw();
    }

    /* ================================ the sidebar ================================ */
    var syncing = false;
    var controlsEl = S.canvas.parentNode.parentNode.querySelector(".sim-controls");
    S.group("lp.animTitle");
    var playBtn = S.button({ label: "", primary: true, on: function () { toggleAnimation(); } });
    S.button({ labelKey: "lp.reset", on: function () { onReset(); } });
    function syncPlay() { playBtn.textContent = t(animating ? "lp.pause" : "lp.start"); }
    S.refreshers.push(syncPlay);
    var rateCtl = S.slider({ labelKey: "lp.rate", min: Math.log10(7e-5), max: Math.log10(0.002), step: 0.001,
      value: Math.log10(0.0003),
      format: function (v) { return String(+(1000 * RATE.snap(Math.pow(10, v)).value).toPrecision(2)) + " " + t("lp.perSec"); },
      on: function (v) { if (!syncing) { RATE.obj = RATE.snap(Math.pow(10, v)); S.requestDraw(); } } });
    [["lp.dayBack", 0, "lp.dayFwd", 1], ["lp.hourBack", 2, "lp.hourFwd", 3], ["lp.minBack", 4, "lp.minFwd", 5]].forEach(function (r) {
      S.button({ labelKey: r[0], on: function () { STEPS[r[1]].go(); } });
      S.button({ labelKey: r[2], on: function () { STEPS[r[3]].go(); } });
      controlsEl.appendChild(document.createElement("div"));     // (each pair its own row)
    });
    S.group("lp.optTitle");
    var optCtls = CHECKS.map(function (c) {
      return S.toggle({ labelKey: c.key, value: false, on: function (b) { if (!syncing) { c.set(b); changed(); } } });
    });
    S.group("lp.phaseTitle");
    var phaseCtl = S.select({ labelKey: "lp.phase", value: "0",
      options: [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return { v: String(i), labelKey: "lp.ph" + i }; }),
      on: function (v) { if (!syncing) pickPhase(+v); } });
    var showPhaseCtl = S.toggle({ labelKey: "lp.showPhase", value: true, on: function (b) { if (!syncing) { phaseShown = b; openCombo = null; S.requestDraw(); } } });
    var showHorCtl = S.toggle({ labelKey: "lp.showHorizon", value: true, on: function (b) { if (!syncing) { horizonShown = b; S.requestDraw(); } } });
    var oPhase = S.readout({ labelKey: "lp.phase" }), oIllum = S.readout({ labelKey: "lp.illuminated" });
    var oSince = S.readout({ labelKey: "lp.since" }), oTime = S.readout({ labelKey: "lp.localTime" });
    function syncSidebar() {
      syncing = true;
      rateCtl.set(Math.log10(RATE.obj.value));
      optCtls.forEach(function (o, i) { o.set(CHECKS[i].get()); });
      phaseCtl.set(String(phaseIndex(M.phase)));
      showPhaseCtl.set(phaseShown); showHorCtl.set(horizonShown);
      syncing = false;
      oPhase(t("lp.ph" + phaseIndex(M.phase)));
      oIllum(percentText().replace(" " + t("lp.illuminated"), ""));
      oSince(sinceText()); oTime(timeText());
    }
    S.refreshers.push(syncSidebar);
    function pickPhase(i) {                          // phaseComboBoxChanged: only while not animating
      if (animating) { syncSidebar(); return; }
      setPhase(45 * i);
      changed();
    }

    /* ======================= canvas interaction ======================= */
    var hover = null, press = null, openCombo = null, listHi = -1, comboFocus = false;
    var hotEarth = false, hotMoon = false;
    function at(ev) {                                // the stage mouse, in whole twips as Flash reports it
      var p = CS.canvasPoint(S.canvas, ev, S.W, S.H);
      return { x: Math.round(p.x * 20) / 20, y: Math.round((p.y - OY) * 20) / 20 };
    }
    function textW(str, size, bold) { font(S.ctx, size, bold); return FlashText.width(S.ctx, str); }
    function checkX() {                              // the SWF moves the checkboxes per language (en 417)
      if (isEN()) return 417;
      var w = 0;
      CHECKS.forEach(function (c) { w = Math.max(w, textW(t(c.key), 12)); });
      return Math.min(417, 590 - 19.2 - w);
    }
    function showBtn(b) {                            // the show/hide buttons: 67 wide at x 758 (wider if needed)
      var w = Math.max(67, Math.ceil(textW(t("lp.hide"), 12)) + 14);
      return { x: 825 - w, y: b.y, w: w, h: b.h };
    }
    function listGeom() { return { x: COMBO.x, y: COMBO.y + COMBO_H, w: COMBO.w, h: 8 * ROW_H + 2, n: 8 }; }
    function listRowAt(p) {
      var g = listGeom();
      if (!inRect(p, g.x, g.y, g.w, g.h)) return -1;
      return Math.max(0, Math.min(g.n - 1, Math.floor((p.y - g.y) / ROW_H)));
    }
    function overMoon(p) {                           // GDMoon: its masked surface, its landmark, the glow once hot
      var m = moonXY(), dx = p.x - GD.x - m.x, dy = p.y - GD.y - m.y, r = hotMoon ? 16 : 10;
      if (dx * dx + dy * dy <= r * r) return true;
      if (!showLandmark) return false;
      var c = Math.cos(m.a), s = Math.sin(m.a), lx = c * dx + s * dy, ly = -s * dx + c * dy;
      return lx >= -20.39 && lx <= 0 && Math.abs(ly) <= 1.9;
    }
    function overEarth(p) {                          // GDEarthDetailed: the globe, the observer's box, the glow
      var dx = p.x - GD.x, dy = p.y - GD.y, r = hotEarth ? 45.5 : 34.94;
      if (dx * dx + dy * dy <= r * r) return true;
      var a = earthRot() * RAD, c = Math.cos(a), s = Math.sin(a);
      var lx = (c * dx + s * dy) / 0.7, ly = (-s * dx + c * dy) / 0.7;
      return Math.abs(lx - 60.05) <= 18 && Math.abs(ly) <= 8.5;
    }
    function symbolAt(p) {                           // the topmost Sun/Moon symbol under the mouse
      if (!horizonShown) return null;
      var best = null;
      [sph.moon, sph.sun].forEach(function (o) {
        if (!o.shown) return;
        var q = o.toLocal(p.x, p.y);
        if (q.x * q.x + q.y * q.y <= 8.2 * 8.2 && (!best || o.screen.z >= best.screen.z)) best = o;
      });
      return best;
    }
    function hit(p) {
      if (openCombo) {
        var r = listRowAt(p);
        if (r >= 0) return { kind: "row", i: r };
        if (inRect(p, COMBO.x, COMBO.y, COMBO.w, COMBO_H)) return { kind: "combo" };
        return { kind: "away" };
      }
      if (overMoon(p)) return { kind: "moon" };
      if (overEarth(p)) return { kind: "earth" };
      if (phaseShown && animating && inRect(p, BLOCKER.x, BLOCKER.y, BLOCKER.w, BLOCKER.h)) return { kind: "blocker" };
      if (phaseShown && inRect(p, COMBO.x, COMBO.y, COMBO.w, COMBO_H)) return { kind: "combo" };
      var bp = showBtn(BTN_PHASE), bh = showBtn(BTN_HOR);
      if (inRect(p, bp.x, bp.y, bp.w, bp.h)) return { kind: "button", b: "phase" };
      if (inRect(p, bh.x, bh.y, bh.w, bh.h)) return { kind: "button", b: "horizon" };
      if (inRect(p, BTN_ANIM.x, BTN_ANIM.y, BTN_ANIM.w, BTN_ANIM.h)) return { kind: "button", b: "anim" };
      for (var i = 0; i < STEPS.length; i++) {
        var s = STEPS[i];
        if (inRect(p, s.x, s.y, s.w, s.h)) return { kind: "button", b: s };
      }
      var cx = checkX();
      for (var j = 0; j < CHECKS.length; j++) {
        var c = CHECKS[j];
        if (inRect(p, cx, c.y - 2, 21 + textW(t(c.key), 12), 17)) return { kind: "check", c: c };
      }
      var gx = RATE.x + RATE.toParam(RATE.obj.value);
      if (Math.abs(p.x - gx) <= 5.5 && Math.abs(p.y - RATE.y) <= 13.1) return { kind: "grab" };
      if (inRect(p, RATE.x - 3.1, RATE.y - 4, RATE.maxP - RATE.minP + 20.2, 8)) return { kind: "bar" };
      var sym = symbolAt(p);
      if (sym) return { kind: "symbol", o: sym };
      if (horizonShown && sph.inMouseArea(p.x, p.y)) return { kind: "sphere" };
      return null;
    }
    var CURSORS = { moon: "grab", earth: "grab", combo: "pointer", row: "pointer", button: "pointer", check: "pointer",
      grab: "ew-resize", bar: "pointer", symbol: "grab", sphere: "grab" };
    function sameHit(a, b) {
      return !!a && !!b && a.kind === b.kind && a.b === b.b && a.c === b.c && a.o === b.o && a.i === b.i;
    }
    function setHover(h) {                           // roll-over / roll-out, as Flash sends them
      var was = hover;
      hover = h;
      var he = !!h && h.kind === "earth", hm = !!h && h.kind === "moon";
      var hs = h && h.kind === "symbol" && h.o.screen.z > 0 ? h.o : null;
      if (h && h.kind === "row") listHi = h.i;
      if (he !== hotEarth || hm !== hotMoon || hs !== hotSym || !sameHit(was, h)) {
        hotEarth = he; hotMoon = hm; hotSym = hs;
        S.requestDraw();
      }
      if (!press) S.canvas.style.cursor = (h && CURSORS[h.kind]) || "default";
    }
    function gdMouse(p) { return { x: p.x - GD.x, y: p.y - GD.y }; }

    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p);
      if (openCombo) {                               // an open list: pick a row, or close it
        if (h.kind === "row") { var i = h.i; openCombo = null; pickPhase(i); }
        else { openCombo = null; S.requestDraw(); }
        if (h.kind !== "combo") return;
        return;
      }
      if (!h) { comboFocus = false; S.requestDraw(); return; }
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      press = { kind: h.kind, b: h.b, c: h.c, o: h.o, x0: p.x, y0: p.y, inside: true };
      if (h.kind !== "combo") comboFocus = false;
      if (h.kind === "moon") {                       // GDMoon.onPress
        var gm = gdMouse(p), raw = (180 - M.phase) * RAD;
        press.off = raw - Math.atan2(gm.y, gm.x);
        if (animating) stopAnimation();
      } else if (h.kind === "earth") {               // GDEarthDetailed.onPress
        var ge = gdMouse(p);
        press.off = Math.atan2(ge.y, ge.x) * DEG - earthRot();
        if (animating) stopAnimation();
      } else if (h.kind === "combo") {               // FComboBox: focus, then open the list
        comboFocus = true; openCombo = true; listHi = phaseIndex(M.phase);
      } else if (h.kind === "grab") {
        press.off = p.x - (RATE.x + RATE.toParam(RATE.obj.value));
      } else if (h.kind === "bar") {                 // barMC.onPress: a step toward the mouse, then repeats
        var m = RATE.snap(RATE.fromParam(p.x - RATE.x));
        if (m.value !== RATE.obj.value) setRate(RATE.step(RATE.obj, m.value < RATE.obj.value ? -1 : 1));
        press.tLast = performance.now(); press.wait = press.tLast + 500; press.mx = p.x;
        wake();
      } else if (h.kind === "symbol") {              // SunSymbol / MoonSymbol.onPress — only from the near side
        if (h.o.screen.z > 0) {
          press.off = sph.screenToCelestial(p.x, p.y).ra - h.o.ra;
          press.moonRA = sunRA() + M.phase / 15;
        } else press.kind = "none";
      } else if (h.kind === "sphere") {
        sph.startDrag(p.x, p.y);
        S.canvas.style.cursor = "grabbing";
      }
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!press) { setHover(hit(p)); return; }
      if (press.kind === "moon") {                   // onMouseMoveFunc: rawMoonAngle follows the mouse
        var gm = gdMouse(p);
        setPhase(180 - (Math.atan2(gm.y, gm.x) + press.off) * DEG);
        changed();
      } else if (press.kind === "earth") {
        var ge = gdMouse(p), rot = Math.atan2(ge.y, ge.x) * DEG - press.off;
        setTime(mod(360 - rot, 360) / 15);
        changed();
      } else if (press.kind === "symbol") {
        var ra = sph.screenToCelestial(p.x, p.y).ra - press.off;
        if (press.o === sph.sun) { setTime(12 - ra); setPhase((press.moonRA - ra) * 15); }
        else setPhase((ra - sunRA()) * 15);
        changed();
      } else if (press.kind === "sphere") {
        sph.dragTo(p.x, p.y); S.requestDraw();
      } else if (press.kind === "grab") {
        var v = RATE.snap(RATE.fromParam(p.x - press.off - RATE.x));
        if (v.value !== RATE.obj.value) setRate(v);
      } else if (press.kind === "bar") {
        press.mx = p.x;
      } else if (press.kind === "combo") {
        var r = listRowAt(p);
        if (r >= 0 && r !== listHi) { listHi = r; S.requestDraw(); }
      } else if (press.kind === "button" || press.kind === "check") {
        var h = hit(p), inside = sameHit(h, { kind: press.kind, b: press.b, c: press.c });
        if (inside !== press.inside) { press.inside = inside; S.requestDraw(); }
      }
    });
    function release(ev, cancelled) {
      if (!press) return;
      var pr = press, p = at(ev);
      press = null;
      sph.endDrag();
      if (!cancelled) {
        if (pr.kind === "button" && pr.inside) {
          if (pr.b === "anim") toggleAnimation();
          else if (pr.b === "phase") { phaseShown = !phaseShown; openCombo = null; syncSidebar(); }
          else if (pr.b === "horizon") { horizonShown = !horizonShown; syncSidebar(); }
          else pr.b.go();
        } else if (pr.kind === "check" && pr.inside) {
          pr.c.set(!pr.c.get()); changed();
        } else if (pr.kind === "combo" && openCombo) {
          var r = listRowAt(p);                      // pressed on the box, released on an item
          if (r >= 0 && Math.abs(p.y - pr.y0) > 4) { openCombo = null; pickPhase(r); }
        }
      }
      setHover(hit(p));
      S.requestDraw();
    }
    S.canvas.addEventListener("pointerup", function (ev) { release(ev, false); });
    S.canvas.addEventListener("pointercancel", function (ev) { release(ev, true); });
    S.canvas.addEventListener("pointerleave", function () { if (!press) setHover(null); });
    S.canvas.style.touchAction = "none";
    function setRate(obj) { RATE.obj = obj; syncSidebar(); S.requestDraw(); }
    /* a held slider bar keeps stepping (continuousChangeDelay 500 ms, then 0.05 ticks a ms) */
    var rafId = 0;
    function wake() { if (!rafId && press && press.kind === "bar") rafId = requestAnimationFrame(tick); }
    function tick(now) {
      rafId = 0;
      if (!press || press.kind !== "bar") return;
      if (now > press.wait) {
        var ticks = 0.05 * (now - press.tLast), m = RATE.snap(RATE.fromParam(press.mx - RATE.x));
        if (m.value < RATE.obj.value) { var a = RATE.step(RATE.obj, -ticks); setRate(a.value < m.value ? m : a); }
        else if (m.value > RATE.obj.value) { var b = RATE.step(RATE.obj, ticks); setRate(b.value > m.value ? m : b); }
        press.tLast = now;
      }
      wake();
    }

    /* ============================ drawing ============================ */
    var moonImg = new Image();
    moonImg.onload = function () { S.requestDraw(); };
    moonImg.src = "../assets/img/sims/lunar-phases-moon.jpg";
    var ORBIT = { nz: false, layers: [[[], [[0.05, "#cccccc", "M141.45 -141.4Q200 -82.85 200 0Q200 82.85 141.45 141.45" +
      "Q82.85 200 0 200Q-82.85 200 -141.4 141.45Q-200 82.85 -200 0Q-200 -82.85 -141.4 -141.4Q-82.85 -200 0 -200" +
      "Q82.85 -200 141.45 -141.4"]]]] };              // shape 299: a 1-twip line, one device pixel wide
    var LAND = ART[61].layers[0][0].map(function (f) { return new Path2D(f[1]); });
    var MOON_EDGE = new Path2D(ART[70].layers[0][0][0][1]);
    var CHECK = new Path2D("M7.1 0.6Q7.1 0 6.5 0Q6.35 0 6.05 0.25L2.6 3.95L1 2.15L0.6 1.95Q0.05 1.95 0.05 2.5" +
      "L0 4.4L0.15 4.75L2.25 6.9L2.3 6.9L2.5 6.95L2.9 6.75L6.9 2.75L7.1 2.35Z");
    // the terminator of moonPhaseSymbol.updateMask: five points round the limb and their control points
    var TERM_A = [], TERM_C = [null], KC = 100 / Math.cos(Math.PI / 8);
    for (var ti = 0; ti < 5; ti++) {
      TERM_A.push({ x: 100 * Math.sin(ti * Math.PI / 4), y: 100 * Math.cos(ti * Math.PI / 4) });
      if (ti) TERM_C.push({ x: KC * Math.sin(Math.PI / 8 + (ti - 1) * Math.PI / 4), y: KC * Math.cos(Math.PI / 8 + (ti - 1) * Math.PI / 4) });
    }

    S.onDraw(function () {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      ctx.save();
      ctx.translate(0, OY);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, -OY, 840, 650);
      PANELS.forEach(function (b) { panel(ctx, b); });
      optionsPanel(ctx);
      animPanel(ctx);
      if (horizonShown) horizonPanel(ctx);
      pushButton(ctx, showBtn(BTN_HOR), t(horizonShown ? "lp.hide" : "lp.show"), "horizon");
      if (phaseShown) phasePanel(ctx);
      pushButton(ctx, showBtn(BTN_PHASE), t(phaseShown ? "lp.hide" : "lp.show"), "phase");
      if (phaseShown) moonPhaseDiagram(ctx);
      geometryDiagram(ctx);
      if (openCombo && phaseShown) comboList(ctx);
      ctx.restore();
    });

    /* ---- Panel Background: #fafafa, a 1 px #666666 border, a 14 px #333333 title and its rule ---- */
    function panel(ctx, b) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(b.x, b.y, b.w, b.h);
      font(ctx, 14); ctx.fillStyle = "#333333"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var title = t(b.key), tw = FlashText.textWidth(ctx, title);
      FlashText.fill(ctx, title, b.x + 5, b.y + 4 + ASC * 14);
      ctx.strokeStyle = "#cccccc"; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(b.x + 10 + tw, b.y + 14.5); ctx.lineTo(b.x + b.w - 5, b.y + 14.5); ctx.stroke();
      ctx.lineCap = "butt";
    }
    function pushButton(ctx, b, label, id) {         // FPushButton: #999 / #ccc (#999 down) / #e8e8e8
      var down = press && press.kind === "button" && press.b === id && press.inside;
      ctx.fillStyle = "#999999"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = down ? "#999999" : "#cccccc"; ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
      ctx.fillStyle = "#e8e8e8"; ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, label, b.x + b.w / 2 + (down ? 1 : 0), b.y + b.h / 2 + 5.05 + (down ? 1 : 0));
    }
    function checkBox(ctx, x, c) {                   // FCheckBox with its own ' label'
      var down = press && press.kind === "check" && press.c === c && press.inside;
      ctx.fillStyle = "#808080"; ctx.fillRect(x, c.y, 13, 13);
      ctx.fillStyle = "#d4d0d8"; ctx.fillRect(x + 1, c.y + 1, 11, 11);
      ctx.fillStyle = down ? "#cccccc" : "#ffffff"; ctx.fillRect(x + 2, c.y + 2, 9, 9);
      if (c.get()) { ctx.save(); ctx.translate(x + 2.9, c.y + 3.15); ctx.fillStyle = "#000000"; ctx.fill(CHECK); ctx.restore(); }
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t(c.key), x + 19.2, c.y + 11.7);
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }
    function rateSlider(ctx) {                       // Standard Slider v6 without its field
      ctx.save(); ctx.translate(RATE.x, RATE.y);
      var L = RATE.maxP - RATE.minP + 14;
      roundRect(ctx, -3.1, -4, L + 6.2, 8, 3.1); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      var g = ctx.createLinearGradient(0, -3, 0, 3);
      g.addColorStop(0, "#fafafa"); g.addColorStop(1, "#d0d0d0");
      roundRect(ctx, -2.1, -3, L + 4.2, 6, 2.1); ctx.fillStyle = g; ctx.fill();
      var gx = RATE.toParam(RATE.obj.value);
      roundRect(ctx, gx - 5.5, -13.1, 11, 26.2, 4.6); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      var gg = ctx.createLinearGradient(gx - 4.5, 0, gx + 4.5, 0);
      gg.addColorStop(0, "#e0e0e0"); gg.addColorStop(128 / 255, "#f4f4f4"); gg.addColorStop(1, "#e0e0e0");
      roundRect(ctx, gx - 4.5, -12.1, 9, 24.2, 3.6); ctx.fillStyle = gg; ctx.fill();
      ctx.restore();
    }
    function field(ctx, str, x, base, align) {       // a 12 px TextField
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, str, x, base, align);
    }

    function animPanel(ctx) {
      pushButton(ctx, BTN_ANIM, t(animating ? "lp.pause" : "lp.start"), "anim");
      var y0 = 2 + ASC * 12;                         // a field's baseline below its top
      field(ctx, t("lp.increment") + ":", 197.2 + 95.725, 556.35 - 2 + y0, "center");
      field(ctx, t("lp.animDay") + ":", 95.25 + 192.35 - 2, 581.7 - 2 + y0, "right");
      field(ctx, t("lp.animHour") + ":", 100.25 + 187.35 - 2, 609.3 - 2 + y0, "right");
      field(ctx, t("lp.animMinute") + ":", 105.25 + 182.35 - 2, 636.9 - 2 + y0, "right");
      STEPS.forEach(function (s) { pushButton(ctx, s, s.label, s); });
      field(ctx, t("lp.rate") + ":", -12 + 48.05 + 2, 608.75 - 2 + y0, "left");
      rateSlider(ctx);
    }
    function optionsPanel(ctx) {
      var x = checkX();
      CHECKS.forEach(function (c) { checkBox(ctx, x, c); });
    }
    function horizonPanel(ctx) {
      ctx.save(); sph.draw(ctx); ctx.restore();
      var y0 = 2.25 + ASC * 12, label = t("lp.localTime") + ": ";   // (measured: 0.25 px under the field's top + 2)
      field(ctx, label, 618, 621 + y0, "left");
      var tx = isEN() ? 756 : 618 + textW(label, 12) + 2;
      field(ctx, timeText(), tx, 621 + y0, "left");
    }
    function phasePanel(ctx) {
      combo(ctx);
      var y0 = 2 + ASC * 12;
      field(ctx, percentText(), 718.5, 282.2 - 2 + y0, "center");
      field(ctx, t("lp.since") + ":", 718.5, 305.75 - 2 + y0, "center");
      field(ctx, sinceText(), 718.5, 320.5 - 2 + y0, "center");
    }
    /* FComboBox: a white label box and the 16-px DownArrow skin scaled to the row */
    function arrowButton(ctx, x, y, s) {
      var k = s / 16;
      ctx.fillStyle = "#808080"; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = "#e8e8e8"; ctx.fillRect(x + k, y + k, s - 2 * k, s - 2 * k);
      ctx.fillStyle = "#000000";
      ctx.beginPath(); ctx.moveTo(x + 4.8 * k, y + 6.05 * k); ctx.lineTo(x + 11.2 * k, y + 6.05 * k);
      ctx.lineTo(x + 8 * k, y + 9.95 * k); ctx.closePath(); ctx.fill();
    }
    function combo(ctx) {
      var c = COMBO, h = COMBO_H, px = 1 / ctx.getTransform().a;
      var hi = comboFocus && !openCombo;             // focused and closed: the top item drawn selected
      ctx.fillStyle = hi ? "#999999" : "#ffffff";
      ctx.fillRect(c.x, c.y, c.w - h, h);
      ctx.fillStyle = "#666666"; ctx.fillRect(c.x - px / 2, c.y, px, h);
      ctx.fillStyle = "rgba(102,102,102,0.5)"; ctx.fillRect(c.x, c.y - px / 2, c.w - h, px);
      font(ctx, 12); ctx.fillStyle = hi ? "#ffffff" : "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.save(); ctx.beginPath(); ctx.rect(c.x, c.y, c.w - h, h); ctx.clip();
      FlashText.fill(ctx, t("lp.ph" + phaseIndex(M.phase)), c.x + 4.15, c.y + 14.35, "left");
      ctx.restore();
      arrowButton(ctx, c.x + c.w - h, c.y, h);
    }
    function comboList(ctx) {
      var g = listGeom(), px = 1 / ctx.getTransform().a;
      ctx.save(); ctx.beginPath(); ctx.rect(g.x, g.y, g.w, g.h); ctx.clip();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(g.x, g.y, g.w, g.h);
      font(ctx, 12); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      for (var i = 0; i < g.n; i++) {
        var y = g.y + i * ROW_H;
        if (i === listHi) { ctx.fillStyle = "#999999"; ctx.fillRect(g.x, y, g.w, COMBO_H); }
        ctx.fillStyle = i === listHi ? "#ffffff" : "#000000";   // the skins' selection #999999, textSelected white
        FlashText.fill(ctx, t("lp.ph" + i), g.x + 4.15, y + 14.35, "left");
      }
      ctx.restore();
      ctx.fillStyle = "#666666"; ctx.fillRect(g.x - px / 2, g.y, px, g.h); ctx.fillRect(g.x + g.w - px / 2, g.y, px, g.h);
      ctx.fillStyle = "rgba(102,102,102,0.5)"; ctx.fillRect(g.x, g.y - px / 2, g.w, px); ctx.fillRect(g.x, g.y + g.h - px / 2, g.w, px);
    }

    /* ---- moonPhaseSymbol: the photograph under the night side's 70 % black (updateMask) ---- */
    function moonPhaseDiagram(ctx) {
      ctx.save(); ctx.translate(MPD.x, MPD.y); ctx.scale(MPD.k, MPD.k);
      ctx.fillStyle = "#000000";                     // the timeline's black square (shape 120, scaled)
      ctx.fillRect(7 * 0.389832 - 117.75, 37 * 0.485229 - 132.95, 590 * 0.389832, 474 * 0.485229);
      if (moonImg.complete && moonImg.naturalWidth) {
        ctx.save(); ctx.beginPath(); ctx.rect(-113.5, -107, 227, 214); ctx.clip();
        ctx.drawImage(moonImg, -113.5, -107);
        ctx.restore();
      }
      var ph = mod(M.phase * RAD, TAU), sgn = ph < Math.PI ? -1 : 1, E = 110, k = Math.cos(mod(ph, Math.PI));
      var p = new Path2D();
      p.moveTo(0, 100); p.lineTo(0, E); p.lineTo(sgn * E, E); p.lineTo(sgn * E, -E); p.lineTo(0, -E); p.lineTo(0, -100);
      p.quadraticCurveTo(0, 0, 0, -100);             // (its first control point is undefined: 0 in a SWF6 player)
      for (var i = 1; i < 5; i++) p.quadraticCurveTo(TERM_C[i].x * k, -TERM_C[i].y, TERM_A[i].x * k, -TERM_A[i].y);
      p.closePath();
      ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fill(p, "evenodd");
      if (showLandmark) shape(ctx, 106);            // Moon Diagram Landmark
      ctx.restore();
    }

    /* ---- the GeometryDiagram ---- */
    function geometryDiagram(ctx) {
      ctx.fillStyle = "#000000"; ctx.fillRect(7, 37, 590, 474);    // shape 120
      ctx.save(); ctx.translate(GD.x, GD.y);
      CS.drawShape(ctx, ORBIT);                     // orbitPath
      sunRays(ctx);
      var m = moonXY();
      if (showAngle) angleWedge(ctx, m);
      ctx.save(); ctx.scale(0.7, 0.7); shape(ctx, 56); ctx.restore();      // _simpleEarth
      ctx.save(); ctx.rotate(earthRot() * RAD); ctx.scale(0.7, 0.7); detailedEarth(ctx); ctx.restore();
      ctx.save(); ctx.scale(0.7, 0.7); shape(ctx, 78); if (showTicks) timeTicks(ctx); ctx.restore();   // _earthShadow
      ctx.save(); ctx.translate(m.x, m.y);
      ctx.save(); ctx.rotate(m.a); ctx.scale(0.2, 0.2); moonArt(ctx); ctx.restore();
      ctx.scale(0.2, 0.2); shape(ctx, 78);          // _moonShadow
      ctx.restore();
      if (showAngle) angleLabel(ctx, m);
      ctx.restore();
    }
    function sunRays(ctx) {                          // GDSunRays: seven arrows and the turned 'sunlight'
      [154.5, -154.5, 103, 51.5, 0, -51.5, -103].forEach(function (y) {
        ctx.save(); ctx.translate(-250.95, y); shape(ctx, 74); ctx.restore();
      });
      ctx.save(); ctx.transform(0, -1.009659, 0.84259, 0, -342.8, 121.75);
      font(ctx, 24, true); ctx.fillStyle = "#fff8a4"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t("lp.sunlight"), 120.575, 2 - 2 + ASC * 24, "center");
      ctx.restore();
    }
    function detailedEarth(ctx) {                    // GDEarthDetailed (frame 2 adds the glow)
      if (hotEarth) shape(ctx, 64);
      ctx.save(); ctx.translate(60.05, 0); shape(ctx, 58); ctx.restore();   // observerMC
      ctx.save(); ctx.transform(-0.106842, 0.134964, -0.134964, -0.106842, 0, 0);
      shape(ctx, 60);                                // the ocean, then the land's colours inside the land
      LAND.forEach(function (l) { ctx.save(); ctx.clip(l, "evenodd"); shape(ctx, 62); ctx.restore(); });
      ctx.restore();
    }
    function moonArt(ctx) {                          // GDMoon (frame 2 adds the glow)
      if (showLandmark) { ctx.fillStyle = "#ff99ff"; ctx.fillRect(-101.95, -9.5, 101.95, 19); }
      if (hotMoon) { ctx.save(); ctx.scale(1.230774, 1.230774); shape(ctx, 64); ctx.restore(); }
      ctx.save(); ctx.clip(MOON_EDGE); shape(ctx, 71); ctx.restore();
    }
    function timeTicks(ctx) {                        // GDTimeTicks, in the shadow's frame
      shape(ctx, 84); shape(ctx, 89);
      font(ctx, 16, true); ctx.fillStyle = "#ffffff"; ctx.textBaseline = "alphabetic";
      var y0 = ASC * 16;
      FlashText.fill(ctx, t("lp.sunrise"), -76.55 + 76.55, -130.15 + y0, "center");
      FlashText.fill(ctx, t("lp.sunset"), -83.45 + 83.475, 112.15 + y0, "center");
      FlashText.fill(ctx, t("lp.noon"), -264 + 153 - 2, -9.9 + y0, "right");
      FlashText.fill(ctx, t("lp.midnight"), 113.55, -9.95 + y0, "left");
    }
    function angleWedge(ctx, m) {                    // discMC under maskMC, and linesMC
      var r = R_ORBIT, a5 = -Math.atan2(m.y, m.x), pie = new Path2D();
      pie.moveTo(0, 0);
      if (a5 > 0) { pie.lineTo(m.x, m.y); drawArc(pie, 0, 0, r, a5, Math.PI); }
      else { pie.lineTo(-r, 0); drawArc(pie, 0, 0, r, Math.PI, a5); }
      pie.lineTo(0, 0);
      ctx.save(); ctx.clip(pie); ctx.scale(2, 2); shape(ctx, 97); ctx.restore();
      ctx.strokeStyle = "#ffde64"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(0, 0); ctx.lineTo(m.x, m.y);
      if (a5 > 0) drawArc(ctx, 0, 0, r, a5, Math.PI); else drawArc(ctx, 0, 0, r, Math.PI, a5);
      ctx.stroke();
    }
    function angleLabel(ctx, m) {                    // GDAngleLabel: bold 14 #ffdf64, outside the orbit
      var r = R_ORBIT, a5 = -Math.atan2(m.y, m.x), deg = mod(180 - a5 * DEG, 360), k = 23 - 7 * Math.cos(a5), x, y;
      if (deg > 180) deg = 360 - deg;
      if (a5 > 0) { x = (k + r) * Math.cos(HALF_PI + a5 / 2); y = -(k + r) * Math.sin(HALF_PI + a5 / 2); }
      else { x = (k + r) * Math.cos(HALF_PI - a5 / 2); y = (k + r) * Math.sin(HALF_PI - a5 / 2); }
      x = twips(x); y = twips(y);
      font(ctx, 14, true); ctx.fillStyle = "#ffdf64"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, toFixed1(deg) + "°", x - 48.5 + 48.5, y - 7.8 + ASC * 14, "center");
    }

    S.refreshers.push(function () { S.requestDraw(); });
    syncPlay();
    onReset();
  }
});
