/* Daylight Hours Explorer ------------------------------------------------------
   Faithful rebuild of the ClassAction "Daylight Hours Explorer"
   (daylighthoursexplorer.swf — DaylightHoursExplorerClass, DaylightHoursPlotClass,
   DoyCursorClass, Standard Slider v6 and the UNL CelestialSphere with its
   "Globe Component v2", all decompiled). The whole stage below its title bar:
     • the plot — hours of daylight on each day of the year at one latitude,
       starting at the vernal equinox: grey night above the curve, pale yellow
       day below it, the four season labels (click one to jump there), month
       and hour tick marks, the dashed "yearly average", and the draggable point
       with its date and hours tabs,
     • Settings — the latitude slider (with its field) and the day-of-year
       slider, which wraps round the year as the SWF's does,
     • Globe — the Earth on its own CelestialSphere: the SWF's water and land
       art, the land masked by the coastlines in _earth.js, the night side
       shaded from the Sun's declination, the equator, and the observer's
       latitude circle split into its day (yellow) and night (grey) arcs; drag
       it to turn it.
   The sidebar mirrors the controls.                                            */
Sim.create({
  id: "daylighthoursexplorer",
  width: 930, height: 480,
  strings: {
    en: {
      "dh.set": "Settings", "dh.lat": "latitude", "dh.day": "day of year",
      "dh.opt": "Options", "dh.avg": "show yearly average", "dh.pt": "show draggable point on curve",
      "dh.reset": "Reset", "dh.globe": "Globe",
      "dh.latLabel": "latitude:", "dh.dayLabel": "day of year:",
      "dh.title": "Hours of Daylight per Day at {lat}",
      "dh.out1": "an observer at a latitude of {lat}", "dh.out2": "will receive {h} hours of",
      "dh.out3": "daylight on {date}",
      "dh.xAxis": "Day of Year", "dh.yAxis": "Number of Daylight Hours", "dh.average": "yearly average",
      "dh.ve": "vernal\nequinox", "dh.ss": "summer\nsolstice", "dh.ae": "autumnal\nequinox", "dh.ws": "winter\nsolstice",
      "dh.N": "N", "dh.S": "S",
      "dh.months": "January,February,March,April,May,June,July,August,September,October,November,December",
      "dh.monthsShort": "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec"
    },
    id: {
      "dh.set": "Pengaturan", "dh.lat": "lintang", "dh.day": "hari dalam setahun",
      "dh.opt": "Opsi", "dh.avg": "tampilkan rata-rata tahunan", "dh.pt": "tampilkan titik seret pada kurva",
      "dh.reset": "Atur ulang", "dh.globe": "Bola Bumi",
      "dh.latLabel": "lintang:", "dh.dayLabel": "hari ke:",
      "dh.title": "Jumlah Jam Siang per Hari pada {lat}",
      "dh.out1": "pengamat pada lintang {lat}", "dh.out2": "akan mendapat {h} jam",
      "dh.out3": "siang hari pada {date}",
      "dh.xAxis": "Hari dalam Setahun", "dh.yAxis": "Jumlah Jam Siang", "dh.average": "rata-rata tahunan",
      "dh.ve": "ekuinoks\nMaret", "dh.ss": "solstis\nJuni", "dh.ae": "ekuinoks\nSeptember", "dh.ws": "solstis\nDesember",
      "dh.N": "LU", "dh.S": "LS",
      "dh.months": "Januari,Februari,Maret,April,Mei,Juni,Juli,Agustus,September,Oktober,November,Desember",
      "dh.monthsShort": "Jan,Feb,Mar,Apr,Mei,Jun,Jul,Agu,Sep,Okt,Nov,Des"
    }
  },
  about: {
    en: "<p>The number of daylight hours changes through the year because the Earth's axis is tilted 23.4°. As the Sun's declination swings from +23.4° (June solstice) to −23.4° (December solstice), an observer's days lengthen and shorten — and the effect grows with latitude.</p>" +
        "<p>At the equator every day is about 12 hours long. At 41° N midsummer days run past 15 hours; above the Arctic Circle the curve reaches 24 (the midnight Sun) or 0 (polar night). The plot starts at the vernal equinox, when day and night are equal everywhere.</p>" +
        "<p>Drag the point along the curve, click a season label, or change the latitude, and watch the globe: the yellow arc is the part of the observer's latitude circle in daylight, the grey arc the part in night.</p>",
    id: "<p>Jumlah jam siang berubah sepanjang tahun karena sumbu Bumi miring 23,4°. Saat deklinasi Matahari berayun dari +23,4° (solstis Juni) ke −23,4° (solstis Desember), hari seorang pengamat memanjang dan memendek — dan efeknya membesar dengan lintang.</p>" +
        "<p>Di khatulistiwa setiap hari sekitar 12 jam. Pada 41° LU hari pertengahan musim panas lebih dari 15 jam; di atas Lingkar Arktik kurva mencapai 24 (Matahari tengah malam) atau 0 (malam kutub). Grafik dimulai pada ekuinoks Maret, ketika siang dan malam sama panjang di mana pun.</p>" +
        "<p>Seret titik di sepanjang kurva, klik label musim, atau ubah lintang, lalu amati globe: busur kuning adalah bagian lingkaran lintang pengamat yang sedang siang, busur abu-abu bagian yang sedang malam.</p>"
  },
  build: function (S) {
    var FONT = "Verdana, Geneva, sans-serif";
    var OY = -30;                                  // the SWF's title bar is the page header here
    var ASC = 1.0059, EM_H = 1.2159, LEAD = 0.2158; // Verdana ascent, ascent + descent, leading (em)
    var TAU = Math.PI * 2, RAD = Math.PI / 180;
    var CS = window.CelestialSphere, EARTH = window.EARTH;
    function t(k) { return I18N.t(k); }
    function fmt(k, o) { return t(k).replace(/\{(\w+)\}/g, function (m, n) { return o[n]; }); }

    /* ---------------- DaylightHoursPlotClass: its model and its constants ---------------- */
    var PLOT = { x: 86, y: 416, w: 500, h: 300 };   // plotMC: origin at the bottom left, y up
    var DOY_OFFSET = -0.3;
    var VE = 78.2440148725013 + DOY_OFFSET, SS = 170.941194534302 + DOY_OFFSET,
      AE = 264.516526602426 + DOY_OFFSET, WS = 354.318929672241 + DOY_OFFSET;
    var EVENTS = [{ doy: VE, key: "dh.ve" }, { doy: SS, key: "dh.ss" }, { doy: AE, key: "dh.ae" }, { doy: WS, key: "dh.ws" }];
    var MONTH_DOY = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    function sunDeclination(doy) {                 // getSunDeclination (radians)
      var d = doy - DOY_OFFSET, s = Math.sin, c = Math.cos;
      var e = -4.3796019e-06 + 0.001830724 * c(0.017214206 * d) - 0.032070267 * s(0.017214206 * d) -
        0.015952904 * c(0.034428413 * d) - 0.04026479 * s(0.034428413 * d) -
        0.00044373354 * c(0.051642619 * d) - 0.0013114725 * s(0.051642619 * d) -
        0.00064591583 * c(0.068856825 * d) - 0.00070547099 * s(0.068856825 * d);
      return Math.atan2(s(0.01721421 * d - 1.3793799796 - e), 2.30644456403329);
    }
    function daylightHours(lat, dec) {              // getDaylightHours (radians in, hours out)
      var a = Math.asin(-Math.tan(lat) * Math.tan(dec));
      if (isNaN(a)) {
        if (Math.abs(dec) < 1e-06) return 12;
        return (dec > 0 && lat > 0) || (dec < 0 && lat < 0) ? 24 : 0;
      }
      return 24 * (Math.PI - 2 * a) / TAU;
    }
    function plotX(doy) { return PLOT.w * (doy - VE) / 365; }
    function wrapX(doy) { return ((PLOT.w / 365 * (doy - VE)) % PLOT.w + PLOT.w) % PLOT.w; }

    /* ---------------- Standard Slider v6 + Slider Logic v6 ("fixed digits") ---------------- */
    function Slider(o) {
      var s = { x: o.x, y: o.y, min: o.min, max: o.max, inc: Math.pow(10, -o.digits), digits: o.digits,
        field: o.field, fieldW: o.fieldW || 0, label: o.label, units: o.units };
      var width = 201.05 * o.scale;                // the placeholder's _width, then _xscale = 100
      s.range = o.field ? width - s.fieldW - o.spacing - 14 : width - o.spacing - 14;
      s.barX = o.field ? s.fieldW + o.spacing : o.spacing;
      s.minP = s.barX + 7; s.maxP = s.minP + s.range;
      s.scale = (s.max - s.min) / (s.maxP - s.minP);
      s.snap = function (v) {                      // getValueObjectFromValue
        v = Math.min(s.max, Math.max(s.min, v));
        return s.inc * Math.round(v / s.inc);
      };
      s.step = function (v, ticks) {               // getIncrementedValueObject
        var n = s.inc * Math.round(Math.round(ticks) + v / s.inc);
        return n < s.min ? s.snap(s.min) : n > s.max ? s.snap(s.max) : n;
      };
      s.fromParam = function (p) { return (p - s.minP) * s.scale + s.min; };
      s.toParam = function (v) { return s.minP + (v - s.min) / s.scale; };
      s.text = function (v) { return s.digits > 0 ? v.toFixed(s.digits) : String(v); };
      s.value = s.snap(o.value);
      return s;
    }
    var LAT = Slider({ x: 700.75, y: 87.85, scale: 1.044907, field: true, fieldW: 45, spacing: 28,
      min: -90, max: 90, digits: 1, value: 41, label: "dh.latLabel", units: "°" });
    var DOY = Slider({ x: 628, y: 155.1, scale: 1.374756, field: false, spacing: 20,
      min: 0, max: 364, digits: 0, value: 0 });

    /* ---------------- state (DaylightHoursExplorerClass) ---------------- */
    var doy = 121, showAverage = false, showCursor = true;
    var hours = 0, sunDec = 0;
    function latitude() { return LAT.value; }
    function latString() {
      var v = LAT.value;
      if (v > 0) return v.toFixed(1) + "° " + t("dh.N");
      if (v < 0) return (-v).toFixed(1) + "° " + t("dh.S");
      return "0.0°";
    }
    function dateParts() {                         // onDoyChanged: the month and the day in it
      var d = Math.round(doy) % 365, m = 1;
      while (m < 12 && d >= MONTH_DOY[m]) m++;
      m--;
      return { m: m, day: 1 + d - MONTH_DOY[m] };
    }
    function longDate() {
      var p = dateParts(), name = t("dh.months").split(",")[p.m];
      return I18N.getLang() === "id" ? p.day + " " + name : name + " " + p.day;
    }
    function shortDate() {
      var p = dateParts(), name = t("dh.monthsShort").split(",")[p.m];
      return I18N.getLang() === "id" ? p.day + " " + name : name + " " + p.day;
    }
    function update() {                            // update(): the Sun, the hours, the globe
      sunDec = sunDeclination(doy);
      hours = daylightHours(latitude() * RAD, sunDec);
      updateGlobe();
      syncSidebar();
      S.requestDraw();
    }
    function setDoy(d) { doy = d; DOY.value = DOY.snap(doy - VE); update(); }
    function setLatitude(v) { LAT.value = LAT.snap(v); curve = null; update(); }

    /* ---------------- the globe: a CelestialSphere holding Globe Component v2 ---------------- */
    var sph = new CS({ x: 776.5, y: 325 });
    sph.size = 170;
    sph.sortObjects = true;
    sph.removeClip("celestialBowl");
    sph.addCircle("equator", { alpha: 70, color: 0x309030, thickness: 1 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("dayArc", { alpha: 100, color: 0xfafa80, thickness: 2 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("nightArc", { alpha: 100, color: 0x989898, thickness: 1 }, { tilt: 0, dec: 0, ra: 0 });
    sph.maxViewerAltitude = 89.9;
    sph.minViewerAltitude = -89.9;
    // Globe Component v2, not standalone: it turns the sphere's horizon plane off and puts
    // its axis on the sphere as two CSLines — setAxisStyle(2), axisLength 1.15
    sph.showHorizonPlane = false;
    sph.addLine("__PrecessingGlobeV2SouthPoleAxis", { alpha: 100, color: 0x000000, thickness: 2 },
      { system: "horizon", x: 0, y: 0, z: -1 }, { system: "horizon", x: 0, y: 0, z: -1.15 });
    sph.addLine("__PrecessingGlobeV2NorthPoleAxis", { alpha: 100, color: 0x000000, thickness: 2 },
      { system: "horizon", x: 0, y: 0, z: 1 }, { system: "horizon", x: 0, y: 0, z: 1.15 });
    // (the SWF adds it with no position; Ruffle draws it at the centre, under the circles)
    sph.addObject("globe", globeArt, { system: "celestial", x: 0, y: 0, z: 0 });
    sph.latitude = 90;

    var CIRCLE50 = "M35.35 -35.35Q50 -20.7 50 0Q50 20.7 35.35 35.35Q20.7 50 0 50Q-20.7 50 -35.35 35.35" +
      "Q-50 20.7 -50 0Q-50 -20.7 -35.35 -35.35Q-20.7 -50 0 -50Q20.7 -50 35.35 -35.35Z";
    var ART = {
      // "Globe Component v2 Water" (shape 6) and "Globe Component v2 Land" (shape 8), this SWF's colours
      water: { nz: false, layers: [[[[{ t: "r", m: [0.08905, 0, 0, 0.08905, 16, -15.95], s: [[0, "#bcc8f5"], [1, "#728aeb"]] }, CIRCLE50]], []]] },
      land: { nz: false, layers: [[[[{ t: "r", m: [0.089066, 0, 0, 0.08905, 16, -15.95], s: [[0.0078, "#b79562"], [1, "#86683e"]] },
        "M35.35 -35.35Q43.35 -27.35 47 -17.5Q50 -9.35 50 0Q50 20.7 35.35 35.35Q20.7 50 0 50Q-20.7 50 -35.35 35.35" +
        "Q-50 20.7 -50 0Q-50 -20.7 -35.35 -35.35Q-21.5 -49.2 -2.25 -49.95L0 -50Q20.7 -50 35.35 -35.35Z"]], []]] },
      // "Doy Cursor Dot": frame 1 (shape 98) and the roll-over frame 2 (shape 99)
      dot: { nz: false, layers: [[[["#ffffff", "M2.65 -1.45L3 0L2.65 1.45L2.15 2.1Q1.25 3 0 3Q-1.25 3 -2.15 2.1Q-3 1.25 -3 0" +
        "Q-3 -1.25 -2.15 -2.15Q-1.25 -3 0 -3Q1.25 -3 2.15 -2.15L2.65 -1.45Z"]], [[1, "#ff5050", "M2.65 -1.45L3 0L2.65 1.45L2.15 2.1" +
        "Q1.25 3 0 3Q-1.25 3 -2.15 2.1Q-3 1.25 -3 0Q-3 -1.25 -2.15 -2.15Q-1.25 -3 0 -3Q1.25 -3 2.15 -2.15L2.65 -1.45"]]]] },
      dotHot: { nz: false, layers: [[[["#ffffff", "M3.55 -3.55Q5 -2.05 5 0Q5 2.05 3.55 3.5Q2.15 5 0 5Q-2.05 5 -3.55 3.5Q-5 2.05 -5 0" +
        "Q-5 -2.05 -3.55 -3.55Q-2.05 -5 0 -5Q2.15 -5 3.55 -3.55Z"]], [[1, "#ff5050", "M3.55 -3.55Q5 -2.05 5 0Q5 2.05 3.55 3.5" +
        "Q2.15 5 0 5Q-2.05 5 -3.55 3.5Q-5 2.05 -5 0Q-5 -2.05 -3.55 -3.55Q-2.05 -5 0 -5Q2.15 -5 3.55 -3.55"]]]] },
      // "Doy Cursor Day Tab" (shape 95) and the hours tab (shape 101)
      dayTab: { nz: false, layers: [[[["#ffffff", "M28.25 10.9L28.25 15.5Q28.25 17.95 26.5 19.7Q24.75 21.45 22.2 21.45L-21.75 21.45" +
        "Q-24.25 21.45 -26.05 19.7Q-27.85 17.95 -27.85 15.5L-27.85 10.9Q-27.85 8.4 -26.05 6.65Q-24.25 4.95 -21.75 4.95L-6.3 4.95" +
        "L-6 4.9L0.2 1.2L6.4 4.9L6.7 4.95L22.2 4.95Q24.75 4.95 26.5 6.65Q28.25 8.4 28.25 10.9Z"],
        ["#ff5050", "M28.25 15.5L28.25 10.9Q28.25 8.4 26.5 6.65Q24.75 4.95 22.2 4.95L6.7 4.95L6.4 4.9L0.2 1.2L-6 4.9L-6.3 4.95" +
        "L-21.75 4.95Q-24.25 4.95 -26.05 6.65Q-27.85 8.4 -27.85 10.9L-27.85 15.5Q-27.85 17.95 -26.05 19.7Q-24.25 21.45 -21.75 21.45" +
        "L22.2 21.45Q24.75 21.45 26.5 19.7Q28.25 17.95 28.25 15.5ZM6.85 3.85L22.2 3.85Q25.15 3.85 27.25 5.85Q29.35 7.95 29.35 10.9" +
        "L29.35 15.5Q29.35 18.4 27.25 20.45Q25.15 22.55 22.2 22.55L-21.75 22.55Q-24.7 22.55 -26.8 20.45L-26.8 20.5Q-28.95 18.4 -28.95 15.5" +
        "L-28.95 10.9Q-28.95 7.95 -26.8 5.85Q-24.7 3.85 -21.75 3.85L-6.4 3.85L-0.05 0.1L0.2 0L0.45 0.1L6.85 3.85Z"]], []]] },
      hoursTab: { nz: false, layers: [[[["#ffffff", "M-43.85 -6.65Q-42.2 -8.25 -39.8 -8.25L-10.35 -8.25Q-8.05 -8.25 -6.4 -6.65" +
        "L-5.35 -5.3Q-4.75 -4.1 -4.75 -2.75L-4.75 -2.7L-4.65 -2.4L-4.5 -2.25L-1.45 0L-4.5 2.3L-4.65 2.55L-4.75 2.75Q-4.75 4.1 -5.35 5.3" +
        "L-6.4 6.65Q-8.05 8.25 -10.35 8.25L-39.8 8.25Q-42.2 8.25 -43.85 6.65Q-45.45 5.05 -45.45 2.75L-45.45 -2.75Q-45.45 -5.05 -43.85 -6.65Z"],
        ["#ff5050", "M-39.8 -8.25Q-42.2 -8.25 -43.85 -6.65Q-45.45 -5.05 -45.45 -2.75L-45.45 2.75Q-45.45 5.05 -43.85 6.65" +
        "Q-42.2 8.25 -39.8 8.25L-10.35 8.25Q-8.05 8.25 -6.4 6.65L-5.35 5.3Q-4.75 4.1 -4.75 2.75L-4.65 2.55L-4.5 2.3L-1.45 0" +
        "L-4.5 -2.25L-4.65 -2.4L-4.75 -2.7L-4.75 -2.75Q-4.75 -4.1 -5.35 -5.3L-6.4 -6.65Q-8.05 -8.25 -10.35 -8.25L-39.8 -8.25Z" +
        "M-46.55 2.75L-46.55 -2.75Q-46.55 -5.5 -44.6 -7.4Q-42.6 -9.35 -39.8 -9.35L-10.35 -9.35Q-7.6 -9.35 -5.6 -7.4L-5.35 -7.15" +
        "Q-3.7 -5.4 -3.65 -2.95L-0.2 -0.45L0 -0.15L0 0.15L-0.2 0.45L-3.65 3Q-3.75 5.4 -5.35 7.15L-5.6 7.4Q-7.6 9.35 -10.35 9.35" +
        "L-39.8 9.35Q-42.6 9.35 -44.6 7.4Q-46.55 5.5 -46.55 2.75Z"]], []]] }
    };
    var CHECK = new Path2D("M7.1 0.6Q7.1 0 6.5 0Q6.35 0 6.05 0.25L2.6 3.95L1 2.15L0.6 1.95Q0.05 1.95 0.05 2.5" +
      "L0 4.4L0.15 4.75L2.25 6.9L2.3 6.9L2.5 6.95L2.9 6.75L6.9 2.75L7.1 2.35Z");

    /* GlobeComponentV2.updateGlobe / updateShading inside the size-170 sphere: globeMC is
       scaled to 2·r·size = 170 %, so the 50-unit water and land discs are 85 px across;
       the land is masked ring by ring by the coastlines, turned by the globe's rotation
       (40°) about the pole — its q matrix with no precession — and projected through the
       sphere; the night side is a half disc plus a half ellipse, 40 % black.          */
    var GLOBE_ROT = 40 * RAD, GLOBE_K = 1.7;
    function shore(x, y, z) {
      var c = Math.cos(GLOBE_ROT), s = Math.sin(GLOBE_ROT);
      return sph.CtoSz({ x: x * c - y * s, y: x * s + y * c, z: z });
    }
    function globeArt(ctx) {
      ctx.save();
      ctx.scale(GLOBE_K, GLOBE_K);
      CS.drawShape(ctx, ART.water);
      ctx.restore();
      var rings = EARTH.ringPaths(shore, sph.r);
      for (var i = 0; i < rings.length; i++) {
        ctx.save();
        ctx.clip(rings[i], "evenodd");
        ctx.scale(GLOBE_K, GLOBE_K);
        CS.drawShape(ctx, ART.land);
        ctx.restore();
      }
      // shadingMC: rotated so its "up" points at the Sun, squashed by the Sun's depth
      var sp = sph.CtoSz({ x: Math.cos(sunDec), y: 0, z: Math.sin(sunDec) });
      var n = Math.sqrt(sp.x * sp.x + sp.y * sp.y + sp.z * sp.z), s = -sp.z / n;
      var hnp = 4, step = Math.PI / hnp, half = step / 2, r = 50, cr = r / Math.cos(half);
      ctx.save();
      ctx.scale(GLOBE_K, GLOBE_K);
      ctx.rotate(Math.atan2(sp.x, -sp.y));
      ctx.beginPath();
      ctx.moveTo(r, 0);
      var a = step, c = step - half, k;
      for (k = 0; k < hnp; k++, a += step, c += step)
        ctx.quadraticCurveTo(cr * Math.cos(c), cr * Math.sin(c), r * Math.cos(a), r * Math.sin(a));
      for (k = 0; k < hnp; k++, a += step, c += step)
        ctx.quadraticCurveTo(cr * Math.cos(c), s * cr * Math.sin(c), r * Math.cos(a), s * r * Math.sin(a));
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fill();
      ctx.restore();
    }
    function updateGlobe() {                       // DaylightHoursExplorerClass.updateGlobe
      var lat = Math.max(-89, Math.min(89, latitude()));
      var g = hours / 2 * 15;
      sph.dayArc.setParameters({ gammaEnd: g, gammaStart: -g, tilt: 0, dec: lat, ra: 0 });
      sph.nightArc.setParameters({ gammaEnd: -g, gammaStart: g, tilt: 0, dec: lat, ra: 0 });
      if (!(hours < 24)) { sph.nightArc.visible = false; sph.dayArc.visible = true; }
      else if (!(hours > 0)) { sph.nightArc.visible = true; sph.dayArc.visible = false; }
      else { sph.nightArc.visible = true; sph.dayArc.visible = true; }
    }

    /* ---------------- the canvas text: displayText / TextFields, laid out as Ruffle does ---------------- */
    function font(ctx, size, style) { ctx.font = (style || "") + " " + size + "px " + FONT; }
    function lineH(size) { return EM_H * size + 4; }   // an autosized one-line TextField's height
    // displayText(str, {x, y, hAlign, vAlign}): a wrapper clip of autosized fields at (x, y)
    function displayText(ctx, str, x, y, hAlign, vAlign, size) {
      var lines = String(str).split("\n"), w = 0;
      lines.forEach(function (l) { w = Math.max(w, FlashText.width(ctx, l)); });
      var tw = Math.floor(w);                      // textWidth, floored
      var left = hAlign === "left" ? x : hAlign === "right" ? x - tw : x - tw / 2;
      var top = vAlign === "top" ? y : vAlign === "bottom" ? y - lineH(size) + 4 : y - lineH(size) / 2 + 2;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      lines.forEach(function (l, i) {
        var lx = lines.length > 1 ? left + (w - FlashText.width(ctx, l)) / 2 : left;
        FlashText.fill(ctx, l, lx, top + ASC * size + i * (EM_H + LEAD) * size, "left");
      });
      return { x: left - 2, y: top - 2, w: tw + 4, h: lines.length * (EM_H + LEAD) * size - LEAD * size + 4 };
    }

    /* ---------------- drawing ---------------- */
    var curve = null;                              // the plot's curve, rebuilt when the latitude changes
    function buildCurve() {                        // DaylightHoursPlotClass.update()
      var lat = latitude(), pts = [], i;
      if (lat === -90 || lat === 90) {
        var xe = wrapX(AE);
        return { pole: lat, xe: xe };
      }
      var latR = lat * RAD, yk = -PLOT.h / 24, d = VE - DOY_OFFSET, dd = 365 / PLOT.w;
      var h0 = daylightHours(latR, sunDeclination(d + DOY_OFFSET));
      pts.push({ x: 0, y: yk * h0, h: h0 });
      for (i = 0; i < PLOT.w; i++) {
        d += dd;
        var h = daylightHours(latR, sunDeclination(d + DOY_OFFSET));
        pts.push({ x: i + 1, y: yk * h, h: h });
      }
      return { pts: pts };
    }
    function drawPlot(ctx) {
      if (!curve) curve = buildCurve();
      ctx.save();
      ctx.translate(PLOT.x, PLOT.y);
      ctx.fillStyle = "#b0b0b0"; ctx.fillRect(0, -PLOT.h, PLOT.w, PLOT.h);   // backgroundMC
      ctx.save();
      ctx.beginPath(); ctx.rect(0, -PLOT.h, PLOT.w, PLOT.h); ctx.clip();    // plotAreaMaskMC
      ctx.lineWidth = 1; ctx.strokeStyle = "#404040"; ctx.fillStyle = "#f0f0c0";
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (curve.pole === 90) {
        ctx.fillRect(0, -PLOT.h, curve.xe, PLOT.h);
        ctx.beginPath(); ctx.moveTo(curve.xe, -PLOT.h); ctx.lineTo(curve.xe, 0); ctx.stroke();
      } else if (curve.pole === -90) {
        ctx.fillRect(curve.xe, -PLOT.h, PLOT.w - curve.xe, PLOT.h);
        ctx.beginPath(); ctx.moveTo(curve.xe, 0); ctx.lineTo(curve.xe, -PLOT.h); ctx.stroke();
      } else {
        var p = curve.pts, i;
        ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y);
        for (i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
        ctx.lineTo(PLOT.w, 0); ctx.lineTo(0, 0); ctx.closePath();
        ctx.fill();
        // the curve's line: off along the 0 h and 24 h edges, on for the step into them
        ctx.beginPath();
        for (i = 1; i < p.length; i++) {
          var flat = p[i].h === 0 || p[i].h === 24;
          if (!flat || p[i].h !== p[i - 1].h) { ctx.moveTo(p[i - 1].x, p[i - 1].y); ctx.lineTo(p[i].x, p[i].y); }
        }
        ctx.stroke();
      }
      ctx.restore();
      if (showAverage) {                           // averageMC: a dashed 12-hour line and its label
        ctx.strokeStyle = "#6060ff"; ctx.lineWidth = 2; ctx.lineCap = "round";
        dashed(ctx, 0, -PLOT.h / 2, PLOT.w, -PLOT.h / 2, 5, 5);
        font(ctx, 11, "italic"); ctx.fillStyle = "#3030f0";
        displayText(ctx, t("dh.average"), 8, -PLOT.h / 2 + 4, "left", "top", 11);
      }
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.lineCap = "round";
      ctx.strokeRect(0, -PLOT.h, PLOT.w, PLOT.h);  // borderMC
      // labelsMC: season ticks and labels, month ticks and labels, hour ticks and labels
      ctx.beginPath();
      EVENTS.forEach(function (e) { var x = wrapX(e.doy); ctx.moveTo(x, -PLOT.h); ctx.lineTo(x, -PLOT.h - 6); });
      var last = wrapX(MONTH_DOY[0]), mid = [];
      for (var m = 11; m >= 0; m--) {
        var x = wrapX(MONTH_DOY[m]);
        ctx.moveTo(x, 0); ctx.lineTo(x, 7);
        mid[m] = x > last ? x + (PLOT.w + last - x) / 2 : x + (last - x) / 2;
        last = x;
      }
      for (var hh = 0; hh <= 24; hh++) { var y = -PLOT.h / 24 * hh; ctx.moveTo(0, y); ctx.lineTo(-6, y); }
      ctx.stroke();
      ctx.fillStyle = "#000000";
      font(ctx, 11, "italic");
      eventRects = EVENTS.map(function (e) {
        var r = displayText(ctx, t(e.key), wrapX(e.doy), -PLOT.h - 23, "center", "bottom", 11);
        return { x: PLOT.x + r.x, y: PLOT.y + r.y, w: r.w, h: r.h, doy: e.doy };
      });
      font(ctx, 12);
      var shortNames = t("dh.monthsShort").split(",");
      for (m = 0; m < 12; m++) displayText(ctx, shortNames[m], mid[m], 4, "center", "top", 12);
      [0, 6, 12, 18, 24].forEach(function (v) { displayText(ctx, String(v), -10, -PLOT.h / 24 * v, "right", "center", 12); });
      font(ctx, 13, "bold");
      displayText(ctx, t("dh.xAxis"), PLOT.w / 2, 27, "center", "top", 13);
      ctx.save();
      ctx.translate(-37, -PLOT.h / 2); ctx.rotate(-Math.PI / 2);
      displayText(ctx, t("dh.yAxis"), 0, 0, "center", "bottom", 13);
      ctx.restore();
      ctx.restore();
    }
    var eventRects = [];
    function dashed(ctx, x0, y0, x1, y1, dash, gap) {   // drawDashedLine
      var dx = x1 - x0, dy = y1 - y0, len = Math.sqrt(dx * dx + dy * dy);
      var n = Math.round((len - dash) / (dash + gap)), f = dash / (dash + gap);
      var sx = dx / (n + f), sy = dy / (n + f);
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var x = x0 + i * sx, y = y0 + i * sy;
        ctx.moveTo(x, y); ctx.lineTo(x + f * sx, y + f * sy);
      }
      ctx.stroke();
    }
    function cursorXY() { return { x: plotX(doy), y: -PLOT.h * hours / 24 }; }
    function drawCursor(ctx) {                     // DoyCursorClass.update, at the plot's origin
      if (!showCursor) return;
      var c = cursorXY();
      ctx.save();
      ctx.translate(PLOT.x, PLOT.y);
      ctx.strokeStyle = "#ff5050"; ctx.lineWidth = 2; ctx.lineCap = "round";
      dashed(ctx, 0, c.y, c.x, c.y, 2, 4);
      dashed(ctx, c.x, 0, c.x, c.y, 2, 4);
      ctx.save();                                  // the day tab, at (x, 1), 115 %
      ctx.translate(c.x, 1); ctx.scale(1.15, 1.15);
      CS.drawShape(ctx, ART.dayTab);
      font(ctx, 11, "bold"); ctx.fillStyle = "#333333";
      FlashText.fill(ctx, shortDate(), 0, 6.15 + ASC * 11, "center");
      ctx.restore();
      ctx.save();                                  // the hours tab, at (−1, y)
      ctx.translate(-1, c.y); ctx.scale(1.15, 1.15);
      CS.drawShape(ctx, ART.hoursTab);
      font(ctx, 11, "bold"); ctx.fillStyle = "#333333";
      FlashText.fill(ctx, hours.toFixed(1), -41.2 + 18.125, -6.9 + ASC * 11, "center");
      ctx.restore();
      ctx.translate(c.x, c.y);
      CS.drawShape(ctx, ART.dot);
      if (dotHot) CS.drawShape(ctx, ART.dotHot);
      ctx.restore();
    }
    function panel(ctx, x, y, w, h, title) {       // Panel Background
      ctx.fillStyle = "#fafafa"; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      if (!title) return;
      font(ctx, 14); ctx.fillStyle = "#333333"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, title, x + 5, y + 4 + ASC * 14);
      ctx.strokeStyle = "#cccccc"; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x + 10 + FlashText.textWidth(ctx, title), y + 14.44); ctx.lineTo(x + w - 5, y + 14.44);
      ctx.stroke(); ctx.lineCap = "butt";
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }
    function slider(ctx, sl) {                     // Standard Slider v6: label, field, units, bar, grabber
      ctx.save(); ctx.translate(sl.x, sl.y);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      if (sl.field) {
        var base = -lineH(12) / 2 + 2 + ASC * 12, label = t(sl.label);
        FlashText.fill(ctx, label, -9.8 - FlashText.textWidth(ctx, label), base);
        FlashText.fill(ctx, sl.units, 5 + sl.fieldW + 4.8, base);
        roundRect(ctx, -4.8, -10.5, sl.fieldW + 9.6, 21, 4.8); ctx.fillStyle = "#c0c0c0"; ctx.fill();
        roundRect(ctx, -3.8, -9.5, sl.fieldW + 7.6, 19, 3.8); ctx.fillStyle = "#ffffff"; ctx.fill();
        ctx.fillStyle = "#000000";
        FlashText.fill(ctx, sl.text(sl.value), sl.fieldW / 2, -9.5 + 2 + ASC * 12, "center");
      }
      var L = sl.range + 14;
      roundRect(ctx, sl.barX - 3.1, -4, L + 6.2, 8, 3.1); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      var g = ctx.createLinearGradient(0, -3, 0, 3);
      g.addColorStop(0, "#fafafa"); g.addColorStop(1, "#d0d0d0");
      roundRect(ctx, sl.barX - 2.1, -3, L + 4.2, 6, 2.1); ctx.fillStyle = g; ctx.fill();
      var gx = sl.toParam(sl.value);
      roundRect(ctx, gx - 5.5, -13.1, 11, 26.2, 4.6); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      var gg = ctx.createLinearGradient(gx - 4.5, 0, gx + 4.5, 0);
      gg.addColorStop(0, "#e0e0e0"); gg.addColorStop(128 / 255, "#f4f4f4"); gg.addColorStop(1, "#e0e0e0");
      roundRect(ctx, gx - 4.5, -12.1, 9, 24.2, 3.6); ctx.fillStyle = gg; ctx.fill();
      ctx.restore();
    }
    var CHECKS = [
      { x: 137.3, y: 477.65, key: "dh.avg", get: function () { return showAverage; }, set: function (b) { showAverage = b; } },
      { x: 341.3, y: 477.65, key: "dh.pt", get: function () { return showCursor; }, set: function (b) { showCursor = b; } }
    ];
    function checkBox(ctx, c) {                    // FCheckBox with its own ' label'
      var down = press && press.kind === "check" && press.c === c && press.inside;
      ctx.fillStyle = "#808080"; ctx.fillRect(c.x, c.y, 13, 13);
      ctx.fillStyle = "#d4d0d8"; ctx.fillRect(c.x + 1, c.y + 1, 11, 11);
      ctx.fillStyle = down ? "#cccccc" : "#ffffff"; ctx.fillRect(c.x + 2, c.y + 2, 9, 9);
      if (c.get()) { ctx.save(); ctx.translate(c.x + 2.9, c.y + 3.15); ctx.fillStyle = "#000000"; ctx.fill(CHECK); ctx.restore(); }
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      c.w = 19.2 + FlashText.fill(ctx, t(c.key), c.x + 19.2, c.y + 11.7);
    }

    S.onDraw(function () {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.save();
      ctx.translate(0, OY);
      panel(ctx, 7, 37, 616, 466, "");
      panel(ctx, 630, 37, 293, 147, t("dh.set"));
      panel(ctx, 630, 191, 293, 312, t("dh.globe"));
      // titleField: 13 px bold, centred over the plot
      font(ctx, 13, "bold"); ctx.fillStyle = "#000000";
      FlashText.fill(ctx, fmt("dh.title", { lat: latString() }), 335.475, 50.95 + ASC * 13, "center");
      drawPlot(ctx);
      CHECKS.forEach(function (c) { checkBox(ctx, c); });
      // Settings: the latitude slider, "day of year:" with the date, the day-of-year slider
      slider(ctx, LAT);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "left";
      var dl = t("dh.dayLabel");
      FlashText.fillStatic(ctx, dl, 640.95, 120.45 + 12);
      FlashText.fill(ctx, longDate(), Math.max(719.95, 640.95 + FlashText.widthStatic(ctx, dl) + 6), 120.45 + ASC * 12);
      slider(ctx, DOY);
      // Globe: the sphere, then the outputField under it (an EditText with 2 px leading)
      sph.draw(ctx);
      font(ctx, 12); ctx.fillStyle = "#000000";
      var lines = [fmt("dh.out1", { lat: latString() }), fmt("dh.out2", { h: hours.toFixed(1) }), fmt("dh.out3", { date: longDate() })];
      lines.forEach(function (l, i) { FlashText.fill(ctx, l, 776.5, 441.95 + ASC * 12 + i * (EM_H * 12 + 2), "center"); });
      drawCursor(ctx);
      ctx.restore();
    });

    /* ---------------- the pointer: the dot, the season labels, the check boxes, the sliders, the globe ---------------- */
    var press = null, dotHot = false;
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY };
    }
    function inRect(p, x, y, w, h) { return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h; }
    function hit(p, touch) {
      if (showCursor) {
        var c = cursorXY(), dx = p.x - (PLOT.x + c.x), dy = p.y - (PLOT.y + c.y);
        if (dx * dx + dy * dy <= Math.pow(touch ? 8 : dotHot ? 5.5 : 3.5, 2)) return { kind: "dot" };
      }
      for (var i = 0; i < eventRects.length; i++) {
        var e = eventRects[i];
        if (inRect(p, e.x, e.y, e.w, e.h)) return { kind: "event", doy: e.doy };
      }
      for (i = 0; i < CHECKS.length; i++) {
        var k = CHECKS[i];
        if (inRect(p, k.x, k.y, k.w || 13, 13)) return { kind: "check", c: k };
      }
      var sls = [LAT, DOY];
      for (i = 0; i < 2; i++) {
        var sl = sls[i], gx = sl.x + sl.toParam(sl.value);
        if (Math.abs(p.x - gx) <= 5.5 && Math.abs(p.y - sl.y) <= 13.1) return { kind: "grab", s: sl };
        if (inRect(p, sl.x + sl.barX - 3.1, sl.y - 4, sl.range + 20.2, 8)) return { kind: "bar", s: sl };
      }
      if (sph.inMouseArea(p.x, p.y)) return { kind: "sphere" };
      return null;
    }
    var CURSORS = { dot: "ew-resize", event: "pointer", check: "pointer", grab: "ew-resize", bar: "pointer", sphere: "move" };
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p, ev.pointerType === "touch");
      if (!h) return;
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      press = { kind: h.kind, c: h.c, s: h.s, inside: true };
      if (h.kind === "dot") {
        dotHot = true;
        press.off = PLOT.x + cursorXY().x - p.x;     // onPress: xOffset = _x − _parent._xmouse
      } else if (h.kind === "event") setDoy(h.doy);
      else if (h.kind === "grab") press.off = p.x - (h.s.x + h.s.toParam(h.s.value));
      else if (h.kind === "bar") {
        barPress(h.s, p.x);
        press.mx = p.x; press.tLast = performance.now(); press.wait = press.tLast + 500;
        requestAnimationFrame(barRepeat);
      } else if (h.kind === "sphere") sph.startDrag(p.x, p.y);
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!press) {
        var h = hit(p, ev.pointerType === "touch");
        S.canvas.style.cursor = (h && CURSORS[h.kind]) || "default";
        var hot = !!h && h.kind === "dot";
        if (hot !== dotHot) { dotHot = hot; S.requestDraw(); }
        return;
      }
      if (press.kind === "dot") {                  // DoyCursorDot.onMouseMoveFunc: wraps round the year
        var x = ((p.x - PLOT.x + press.off) % PLOT.w + PLOT.w) % PLOT.w;
        setDoy(365 * x / PLOT.w + VE);
      } else if (press.kind === "grab") grabTo(press.s, p.x - press.off);
      else if (press.kind === "bar") press.mx = p.x;
      else if (press.kind === "sphere") { sph.dragTo(p.x, p.y); S.requestDraw(); }
      else if (press.kind === "check") {
        var h2 = hit(p), inside = !!h2 && h2.kind === "check" && h2.c === press.c;
        if (inside !== press.inside) { press.inside = inside; S.requestDraw(); }
      }
    });
    function release(ev, cancelled) {
      if (!press) return;
      var pr = press;
      press = null;
      if (pr.kind === "sphere") sph.endDrag();
      if (!cancelled && pr.kind === "check" && pr.inside) { pr.c.set(!pr.c.get()); syncSidebar(); }
      if (pr.kind === "dot") dotHot = !!hit(at(ev)) && hit(at(ev)).kind === "dot";
      S.requestDraw();
    }
    S.canvas.addEventListener("pointerup", function (ev) { release(ev, false); });
    S.canvas.addEventListener("pointercancel", function (ev) { release(ev, true); });
    S.canvas.addEventListener("pointerleave", function () {
      if (!press && dotHot) { dotHot = false; S.requestDraw(); }
    });
    function setSlider(sl, v) { if (sl === LAT) setLatitude(v); else setDoy(v + VE); }
    function grabTo(sl, x) {                       // grabberMC.onMouseMoveFunc (the day slider wraps)
      var p = x - sl.x;
      if (sl === DOY) { var range = sl.maxP - sl.minP; p = sl.minP + ((p - sl.minP) % range + range) % range; }
      var v = sl.snap(sl.fromParam(p));
      if (v !== sl.value) setSlider(sl, v);
    }
    function barPress(sl, x) {                     // barMC.onPress: one tick toward the mouse
      var m = sl.snap(sl.fromParam(x - sl.x));
      if (sl === DOY && m === 0 && sl.value === 0) setSlider(sl, 364);
      else if (sl === DOY && m === 364 && sl.value === 364) setSlider(sl, 0);
      else if (m < sl.value) setSlider(sl, sl.step(sl.value, -1));
      else if (m > sl.value) setSlider(sl, sl.step(sl.value, 1));
    }
    function barRepeat(now) {                      // barMC.onEnterFrameFunc: 0.05 ticks/ms after 500 ms
      if (!press || press.kind !== "bar") return;
      if (now > press.wait) {
        var sl = press.s, ticks = 0.05 * (now - press.tLast), m = sl.snap(sl.fromParam(press.mx - sl.x));
        if (sl === DOY && m === 0 && sl.value === 0) setSlider(sl, 364);
        else if (sl === DOY && m === 364 && sl.value === 364) setSlider(sl, 0);
        else if (m < sl.value) { var dn = sl.step(sl.value, -ticks); setSlider(sl, dn > m ? dn : m); }
        else if (m > sl.value) { var up = sl.step(sl.value, ticks); setSlider(sl, up < m ? up : m); }
        press.tLast = now;
      }
      requestAnimationFrame(barRepeat);
    }

    /* ---------------- the sidebar, mirroring the SWF's controls ---------------- */
    var syncing = false;
    S.group("dh.set");
    var latC = S.slider({ labelKey: "dh.lat", min: -90, max: 90, step: 0.1, value: 41,
      format: function () { return latString(); },
      on: function (v) { if (!syncing) setLatitude(v); } });
    var dayC = S.slider({ labelKey: "dh.day", min: 0, max: 364, step: 1, value: 43,
      format: function () { return longDate(); },
      on: function (v) { if (!syncing) setDoy(v + VE); } });
    S.group("dh.opt");
    var avgC = S.toggle({ labelKey: "dh.avg", value: false, on: function (b) { if (!syncing) { showAverage = b; S.requestDraw(); } } });
    var ptC = S.toggle({ labelKey: "dh.pt", value: true, on: function (b) { if (!syncing) { showCursor = b; S.requestDraw(); } } });
    S.button({ labelKey: "dh.reset", on: reset });
    function syncSidebar() {
      syncing = true;
      latC.set(LAT.value); dayC.set(DOY.value); avgC.set(showAverage); ptC.set(showCursor);
      syncing = false;
    }

    function reset() {                             // DaylightHoursExplorerClass.reset
      showAverage = false; showCursor = true;
      sph.setThetaAndPhi(140, 0);
      LAT.value = LAT.snap(41); curve = null;
      setDoy(121);
    }
    reset();
  }
});
