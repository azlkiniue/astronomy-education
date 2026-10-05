/* Motions of the Sun Simulator ------------------------------------------------
   Faithful rebuild of the NAAP / ClassAction "Motions of the Sun Simulator"
   (sunmotions.swf: its Simulation Master and the UNL CelestialSphere engine,
   both decompiled). The horizon diagram is the SWF's own, drawn with the shared
   engine in _celestialsphere.js exactly as initializeSphere sets it up: a 350 px
   sphere seen from azimuth 215° and altitude 35°, the green horizon plane with
   its direction labels and a night shade, the stick figure and its shadow, the
   Sun's disk, the celestial equator and the 0h hour circle in blue, the ecliptic
   in white, the Sun's declination circle in yellow, the polar axis, month labels
   along the ecliptic, and the analemma. The sky brightens and the plane darkens
   with the Sun's altitude; hovering a circle names it, as the SWF's balloons do.

   The Sun is the SWF's too: getPositionAndEqnOfTime(day) (an equation-of-time
   series) and getSiderealTime(day), with `day` the day of the year plus the
   fraction of a day (146.5 = 27 May at noon, the opening screen). Dragging the
   Sun changes the time of day or, if chosen in the settings, the day of the year
   (along the analemma); dragging elsewhere on the sphere turns it.            */
Sim.create({
  id: "sun-motions",
  width: 440, height: 450,
  strings: {
    en: {
      "sm.timeLoc": "Time and Location", "sm.day": "day of year", "sm.time": "time of day", "sm.lat": "observer's latitude",
      "sm.anim": "Animation Controls", "sm.start": "start animation", "sm.pause": "pause animation", "sm.speed": "animation speed",
      "sm.mode": "animation mode", "sm.modeCont": "continuous", "sm.modeStep": "step by day", "sm.loopday": "loop day",
      "sm.settings": "General Settings", "sm.decl": "show the sun's declination circle", "sm.ecl": "show the ecliptic",
      "sm.month": "show month labels", "sm.under": "show underside of celestial sphere",
      "sm.shadow": "show stickfigure and its shadow", "sm.analemma": "show analemma",
      "sm.drag": "dragging the sun's disk changes the …", "sm.dragTime": "time of day", "sm.dragDay": "day of year",
      "sm.alt": "sun's altitude", "sm.az": "sun's azimuth", "sm.dec": "sun's declination", "sm.ra": "sun's right ascension",
      "sm.ha": "sun's hour angle", "sm.lst": "sidereal time", "sm.eot": "equation of time", "sm.info": "Information",
      "sm.hrs": "hrs/sec", "sm.days": "days/sec",
      "b.ce1": "celestial", "b.ce2": "equator", "b.zh1": "prime hour circle", "b.zh2": "(0h right ascension)",
      "b.dec1": "sun's declination", "b.dec2": "(its daily path)", "b.ecl1": "the ecliptic", "b.ecl2": "(sun's annual path)",
      "b.ana": "the analemma",
      "dir.N": "N", "dir.S": "S", "dir.E": "E", "dir.W": "W",
      "m0": "Jan", "m1": "Feb", "m2": "Mar", "m3": "Apr", "m4": "May", "m5": "Jun",
      "m6": "Jul", "m7": "Aug", "m8": "Sep", "m9": "Oct", "m10": "Nov", "m11": "Dec"
    },
    id: {
      "sm.timeLoc": "Waktu dan Lokasi", "sm.day": "hari ke-", "sm.time": "waktu hari", "sm.lat": "lintang pengamat",
      "sm.anim": "Kendali Animasi", "sm.start": "mulai animasi", "sm.pause": "jeda animasi", "sm.speed": "kecepatan animasi",
      "sm.mode": "mode animasi", "sm.modeCont": "kontinu", "sm.modeStep": "langkah per hari", "sm.loopday": "ulang satu hari",
      "sm.settings": "Pengaturan Umum", "sm.decl": "tampilkan lingkaran deklinasi Matahari", "sm.ecl": "tampilkan ekliptika",
      "sm.month": "tampilkan label bulan", "sm.under": "tampilkan bagian bawah bola langit",
      "sm.shadow": "tampilkan tokoh dan bayangannya", "sm.analemma": "tampilkan analema",
      "sm.drag": "menyeret cakram Matahari mengubah …", "sm.dragTime": "waktu hari", "sm.dragDay": "hari dalam tahun",
      "sm.alt": "ketinggian Matahari", "sm.az": "azimut Matahari", "sm.dec": "deklinasi Matahari", "sm.ra": "asensiorekta Matahari",
      "sm.ha": "sudut jam Matahari", "sm.lst": "waktu sideris", "sm.eot": "perata waktu", "sm.info": "Informasi",
      "sm.hrs": "jam/detik", "sm.days": "hari/detik",
      "b.ce1": "ekuator", "b.ce2": "langit", "b.zh1": "lingkaran jam utama", "b.zh2": "(asensiorekta 0j)",
      "b.dec1": "deklinasi Matahari", "b.dec2": "(lintasan hariannya)", "b.ecl1": "ekliptika", "b.ecl2": "(lintasan tahunan Matahari)",
      "b.ana": "analema",
      "dir.N": "U", "dir.S": "S", "dir.E": "T", "dir.W": "B",
      "m0": "Jan", "m1": "Feb", "m2": "Mar", "m3": "Apr", "m4": "Mei", "m5": "Jun",
      "m6": "Jul", "m7": "Agu", "m8": "Sep", "m9": "Okt", "m10": "Nov", "m11": "Des"
    }
  },
  about: {
    en: "<p>The Sun's place in your sky changes through the day (it rises, climbs to the meridian, and sets) and through the year (its noon height and rising point drift with the seasons). This <strong>horizon diagram</strong> shows both at once for an observer at the centre of the green horizon plane.</p>" +
        "<p>Set the day of year, time of day and latitude, or start the animation — continuously through the day, or a day at a time at a fixed clock time. The <strong>celestial equator</strong> and the 0h hour circle are fixed to the sky; the <strong>ecliptic</strong> is the Sun's yearly path; the Sun's <strong>declination circle</strong> is the path it follows on the chosen day. Drag the Sun along it to change the time, or drag the sphere to turn it.</p>" +
        "<p>Turn on the <strong>analemma</strong> to see the figure-8 the Sun makes if photographed at the same clock time all year — it comes from Earth's axial tilt and its elliptical orbit (the <em>equation of time</em>). At the equator the noon Sun can pass overhead; beyond the polar circles it can stay up or down for 24 hours.</p>",
    id: "<p>Posisi Matahari di langit berubah sepanjang hari (terbit, naik ke meridian, lalu terbenam) dan sepanjang tahun (tinggi tengah harinya dan titik terbitnya bergeser dengan musim). <strong>Diagram horizon</strong> ini menampilkan keduanya sekaligus untuk pengamat di pusat bidang horizon hijau.</p>" +
        "<p>Atur hari, waktu, dan lintang, atau jalankan animasi — terus-menerus sepanjang hari, atau sehari demi sehari pada jam yang tetap. <strong>Ekuator langit</strong> dan lingkaran jam 0j melekat pada langit; <strong>ekliptika</strong> adalah lintasan tahunan Matahari; <strong>lingkaran deklinasi</strong> Matahari adalah lintasannya pada hari itu. Seret Matahari di sepanjangnya untuk mengubah waktu, atau seret bola untuk memutarnya.</p>" +
        "<p>Aktifkan <strong>analema</strong> untuk melihat angka-8 yang dibentuk Matahari bila difoto pada jam yang sama sepanjang tahun — berasal dari kemiringan sumbu Bumi dan orbit elipsnya (<em>perata waktu</em>). Di ekuator Matahari tengah hari bisa melewati zenit; di luar lingkaran kutub ia bisa tetap di atas atau di bawah horizon selama 24 jam.</p>"
  },
  build: function (S) {
    var RAD = Math.PI / 180, TAU = Math.PI * 2, FONT = "Verdana, Geneva, sans-serif";
    var OY = -30;                                   // the SWF's title bar is the page header here
    var PANEL = { x: 7, y: 37.05 + OY, w: 426, h: 436 };   // the black panel behind the sphere (shape 393)
    var MONTH_PTS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

    /* ---- the SWF's Sun (getPositionAndEqnOfTime, getPosition, getSiderealTime) ---- */
    function eqnSeries(d) {
      var s = Math.sin, c = Math.cos;
      return -4.3796019e-06 + 0.001830724 * c(0.017214206 * d) - 0.032070267 * s(0.017214206 * d)
        - 0.015952904 * c(0.034428413 * d) - 0.04026479 * s(0.034428413 * d)
        - 0.00044373354 * c(0.051642619 * d) - 0.0013114725 * s(0.051642619 * d)
        - 0.00064591583 * c(0.068856825 * d) - 0.00070547099 * s(0.068856825 * d);
    }
    function getPositionAndEqnOfTime(d) {
      var e = eqnSeries(d), L = 0.01721421 * d - 1.3793799796 - e;
      return { ra: (((3.819718634205488 * L) % 24) + 24) % 24,
        dec: 57.29577951308232 * Math.atan2(Math.sin(L), 2.30644456403329), eqn: 229.1831180523293 * e };
    }
    function getPosition(d) {                       // the analemma's own: the same, built from the other end
      var L = 0.01721421 * d - 1.3793756 - (eqnSeries(d) + 4.3796019e-06);
      return { ra: (((3.819718634205488 * L) % 24) + 24) % 24, dec: 57.29577951308232 * Math.atan2(Math.sin(L), 2.30644456403329) };
    }
    function getSiderealTime(d) { return 24 * ((((0.280464857844662 + 1.0027397260274 * d) % 1) + 1) % 1); }

    /* ---- state (Simulation Master) ---- */
    var M = { day: 146.5, doy: 146, tod: 0.5, latitude: 40.8, ra: 0, dec: 0, eqn: 0, sid: 0, ha: 0, alt: 0, az: 0 };
    var stepByDay = false, loopDay = false, oldLoopDay = false, continuousSpeed = 0.000125, discreteSpeed = 0.015;
    var animationState = false, animateDay = 0, held = false, sunDragMode = "timeOfDay";

    /* ---- the CelestialSphere, as initializeSphere sets it up ---- */
    var CS = window.CelestialSphere, sph = new CS({ x: 220, y: 255 + OY });
    sph.size = 350;
    sph.viewerAzimuth = 215;
    sph.viewerAltitude = 35;
    sph.minViewerAltitude = 5;
    sph.showUnder = true;
    sph.addObject("stickfigure", CS.art.stickfigureSunmotions, { system: "horizon", x: 0, y: 0, z: 0.001 });
    sph.stickfigure.setOrientationType("absolute", { system: "horizon", x: -1, y: 0, z: 0 }, { system: "horizon", x: 0, y: 0, z: 1 });
    sph.addObject("shadow", shadowGlyph, { system: "horizon", x: 0, y: 0, z: 0 });
    sph.shadow.setOrientationType("absolute", { system: "horizon", x: 0, y: 0, z: 1 }, { system: "horizon", x: 1, y: 0, z: 0 });
    sph.addObject("sunDisk", sunGlyph, { dec: 0, ra: 0 });
    var MONTH_POS = [[-20.8, 19.92], [-12.59, 21.93], [-1.43, 23.79], [10.23, 1.64], [19.29, 3.59], [23.36, 5.66],
      [21.22, 7.76], [13.45, 9.77], [2.49, 11.61], [-9.22, 13.46], [-18.85, 15.47], [-23.34, 17.66]];
    var monthObjs = MONTH_POS.map(function (p, i) {
      var pos = { r: 1.1, dec: p[0], ra: p[1] };
      var o = sph.addObject("month" + i, monthGlyph, pos, { monthIndex: i });
      o.setOrientationType("absolute", pos, { dec: 66.56, ra: 18 });
      o.visible = false;
      return o;
    });
    sph.addCircle("meridianCircle1", { alpha: 20, color: 0xffffff, thickness: 1 }, { tilt: 90, alt: 0, az: 0 });
    sph.addCircle("meridianCircle2", { alpha: 20, color: 0xffffff, thickness: 1 }, { tilt: 90, alt: 0, az: 90 });
    sph.addCircle("zeroHoursCircle", { alpha: 70, color: 0x2c7bfe, thickness: 2 }, { gammaEnd: 90, gammaStart: -90, tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("celestialEquator", { alpha: 70, color: 0x2c7bfe, thickness: 2 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("eclipticCircle", { alpha: 70, color: 0xffffff, thickness: 2 }, { tilt: 23.44, dec: 0, ra: 0 });
    sph.addCircle("decCircle", { alpha: 70, color: 0xfff260, thickness: 2 }, { tilt: 0, dec: 16, ra: 0 });
    // the circles' balloons (addCircleBalloon): roll over a near half and it thickens to 4 and is named.
    // A balloon is the SWF's white box (its bottom-right corner at the origin) with static lines
    // [key, x, baseline]; wh is the clip's _width/_height (border and text bounds included).
    var BALLOONS = [
      { c: sph.zeroHoursCircle, box: [125, 36], wh: [129, 37], lines: [["b.zh1", -109.85, -21.05], ["b.zh2", -119.85, -7.05]] },
      { c: sph.celestialEquator, box: [60, 36], wh: [62.55, 37], lines: [["b.ce1", -53.4, -21.05], ["b.ce2", -51.4, -7.05]] },
      { c: sph.eclipticCircle, box: [120, 36], wh: [124.5, 37], lines: [["b.ecl1", -91.35, -21.05], ["b.ecl2", -115.35, -7.05]] },
      { c: sph.decCircle, box: [105, 36], wh: [109.15, 37], lines: [["b.dec1", -100, -21.05], ["b.dec2", -94, -7.05]] }
    ];
    BALLOONS.forEach(function (b) { b.c.setUseMouseFunctions(true, "front only"); });
    sph.addLine("ncpAxis", { alpha: 100, color: 0x2c7bfe, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: 1 }, { system: "celestial", x: 0, y: 0, z: 1.2 });
    sph.addLine("scpAxis", { alpha: 100, color: 0x2c7bfe, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: -1 }, { system: "celestial", x: 0, y: 0, z: -1.2 });
    sph.addShadingClip(CS.GradientDisk, "skyFront", "front", "inner", "both", { outerColor: 0xbfe4ff, innerColor: 0xbfe4ff, outerAlpha: 20, innerAlpha: 10 });
    sph.addShadingClip(CS.GradientDisk, "skyBack", "back", "inner", "above", { outerColor: 0xbfe4ff, innerColor: 0xbfe4ff, outerAlpha: 70, innerAlpha: 70 });
    sph.removeClip("aboveHorizonPlane");
    sph.addHorizonPlaneClip(CS.GradientDisk, "newHorizonPlane", "above", 1, { outerColor: 0x3aa53a, outerAlpha: 100, innerColor: 0x51c451, innerAlpha: 100 });
    // Direction Labels Light: four centred bold 12 fields; at the poles every one reads S (or N)
    sph.addHorizonPlaneClip(CS.directionLabels(function () {
      var la = M.latitude, t = function (k) { return I18N.t(k); };
      if (la === 90) return { N: t("dir.S"), S: t("dir.S"), E: t("dir.S"), W: t("dir.S") };
      if (la === -90) return { N: t("dir.N"), S: t("dir.N"), E: t("dir.N"), W: t("dir.N") };
      return { N: t("dir.N"), S: t("dir.S"), E: t("dir.E"), W: t("dir.W") };
    }, { pos: { N: [-0.225, -80.23], S: [-0.225, 88.77], E: [83.525, 4.82], W: [-83.1, 4.82] } }), "aboveLabels", "above", 2);
    sph.addHorizonPlaneClip(CS.GradientDisk, "horizonShade", "above", 5, { outerColor: 0, outerAlpha: 0, innerColor: 0, innerAlpha: 0 });
    // the Analemma Curve: 60 points drawn into the circle layers, #ff2424 at 70 %, 2 px (4 on hover)
    var ANA = (function () {
      var pts = [];
      for (var i = 0; i < 60; i++) {
        var d = i * 365 / 60, p = getPosition(d), e = -eqnSeries(d), dec = RAD * p.dec, cd = Math.cos(dec);
        pts.push({ x: cd * Math.cos(e), y: cd * Math.sin(e), z: Math.sin(dec),
          interval: !(p.dec < 22) ? 1 : !(p.dec > -22) ? 3 : (d > 354.318929563686 || d < 170.941195869382) ? 0 : 2 });
      }
      return pts;
    })();
    var analemma = sph.addCircle("analemma", { alpha: 70, color: 0xff2424, thickness: 2 }, null, 12345);
    analemma.visible = false;
    analemma.setUseMouseFunctions(true, "front only");
    var ANA_BALLOON = { c: analemma, box: [90, 19], wh: [94.3, 20], lines: [["b.ana", -85.15, -5.55]] };
    function anaMatrix() {                          // the curve's frame: latitude and the time of day
      var cl = RAD * (90 - sph.latitude), it = -TAU * (M.day % 1), c = sph._c;
      var k = [Math.cos(cl) * Math.cos(it), -Math.cos(cl) * Math.sin(it), Math.sin(cl), Math.sin(it), Math.cos(it), 0,
        -Math.sin(cl) * Math.cos(it), Math.sin(cl) * Math.sin(it), Math.cos(cl)];
      return [c.a0 * k[0] + c.a1 * k[3], c.a0 * k[1] + c.a1 * k[4], c.a0 * k[2],
        c.a3 * k[0] + c.a4 * k[3] + c.a5 * k[6], c.a3 * k[1] + c.a4 * k[4] + c.a5 * k[7], c.a3 * k[2] + c.a5 * k[8],
        c.a6 * k[0] + c.a7 * k[3] + c.a8 * k[6], c.a6 * k[1] + c.a7 * k[4] + c.a8 * k[7], c.a6 * k[2] + c.a8 * k[8]];
    }
    analemma.paths = function () {                  // AnalemmaCurveClass.update
      var v = anaMatrix(), front = new Path2D(), back = new Path2D(), n = ANA.length;
      function P(p) { return [v[0] * p.x + v[1] * p.y + v[2] * p.z, v[3] * p.x + v[4] * p.y + v[5] * p.z, v[6] * p.x + v[7] * p.y + v[8] * p.z]; }
      var q = P(ANA[n - 1]), inFront = q[2] > 0;
      (inFront ? front : back).moveTo(q[0], q[1]);
      for (var i = 0; i < n; i++) {
        q = P(ANA[i]);
        if (q[2] > 0) {
          if (inFront) front.lineTo(q[0], q[1]); else { back.lineTo(q[0], q[1]); front.moveTo(q[0], q[1]); }
          inFront = true;
        } else {
          if (inFront) { front.lineTo(q[0], q[1]); back.moveTo(q[0], q[1]); } else back.lineTo(q[0], q[1]);
          inFront = false;
        }
      }
      return { front: front, back: back };
    };
    // the analemma under the mouse sets the day (setClosestDay), when the Sun is dragged in "day of year" mode
    function setClosestDay(p) {
      var r = sph.r, x = p.x - sph.x, y = p.y - sph.y, d = Math.sqrt(x * x + y * y);
      if (d > r) r = d;
      var a = Math.atan2(y, x), X = d * Math.cos(a), Y = d * Math.sin(a), Z = Math.sqrt(Math.max(0, r * r - d * d));
      var v = anaMatrix(), k = 1 / (r * r);
      var mx = k * (v[0] * X + v[3] * Y + v[6] * Z), my = k * (v[1] * X + v[4] * Y + v[7] * Z), mz = k * (v[2] * X + v[5] * Y + v[8] * Z);
      // the search skips the stretch opposite the Sun's own, so a drag can't jump across the figure 8
      var dec = M.dec, excl = !(dec < 22) ? 3 : !(dec > -22) ? 1 : (M.day > 354.318929563686 || M.day < 170.941195869382) ? 2 : 0;
      var best = 4, bi = 0, n = ANA.length;
      for (var i = 0; i < n; i++) {
        var q = ANA[i];
        if (q.interval === excl) continue;
        var dd = (mx - q.x) * (mx - q.x) + (my - q.y) * (my - q.y) + (mz - q.z) * (mz - q.z);
        if (dd < best) { best = dd; bi = i; }
      }
      function dist(j) { var q = ANA[((j % n) + n) % n]; return (mx - q.x) * (mx - q.x) + (my - q.y) * (my - q.y) + (mz - q.z) * (mz - q.z); }
      var d1 = dist(bi - 1), d2 = dist(bi + 1), frac = ((M.day % 1) + 1) % 1, nd;
      if (!(d1 > best)) nd = Math.floor(365 * ((bi - 1) / n)) + frac;
      else if (!(d2 > best)) nd = Math.floor(365 * ((bi + 1) / n)) + frac;
      else nd = Math.floor(365 * ((bi + (d1 - d2) / (2 * (d1 > d2 ? d1 - best : d2 - best))) / n)) + frac;
      setDay(nd);
    }

    /* ---- the objects' art ---- */
    var sunHot = false;
    function sunGlyph(ctx) {                        // Sun Disk: shape 337, over the outline 338 on roll-over (frame 2)
      if (sunHot) CS.drawShape(ctx, SUN_EDGE);
      CS.drawShape(ctx, SUN_DISK);
    }
    var SUN_PATH = "M9 0Q8.95 3.7 6.35 6.35Q3.7 8.95 0 9Q-3.75 8.95 -6.4 6.35Q-9.05 3.7 -9 0Q-9.05 -3.75 -6.4 -6.4Q-3.75 -9.05 0 -9Q3.7 -9.05 6.35 -6.4Q8.95 -3.75 9 0";
    var SUN_DISK = { nz: false, layers: [[[[{ t: "r", m: [0.012482, 0, 0, 0.012482, 0, 0], s: [[0, "#fcf0c2"], [1, "#f2d277"]] }, SUN_PATH + "Z"]], []]] };
    var SUN_EDGE = { nz: false, layers: [[[], [[1, "#000000", SUN_PATH]]]] };
    function monthGlyph(ctx, o) {                   // MonthLabel: a centred bold 14 field
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 14px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, I18N.t("m" + o.monthIndex), 0, -8.5 + 1.0059 * 14, "center");
    }
    var shadowSource = { az: 180, alt: 45 };
    var SHADOW_MASK = new Path2D("M175 0Q175 72.45 123.75 123.7Q72.45 174.95 0 175Q-72.5 174.95 -123.75 123.7Q-175.05 72.45 -175 0" +
      "Q-175.05 -72.5 -123.75 -123.75Q-72.5 -175.05 0 -175Q72.45 -175.05 123.75 -123.75Q175 -72.5 175 0Z");
    function shadowGlyph(ctx) {                     // ShadowMaker + Stickfigure Shadow, masked by the Shadow Mask (shape 159)
      var sm = CS.shadowMatrix(shadowSource);
      if (!sm) return;
      var spec = CS.art.shapes.stickfigureShadowSunmotions;
      CS.groupAlpha(ctx, sm.alpha, function (g) {
        g.clip(SHADOW_MASK);
        g.transform(sm.m[0], sm.m[1], sm.m[2], sm.m[3], 0, 0);
        CS.drawShape(g, spec);
      }, CS.shadowBounds(sm, spec, 175));
    }

    /* ---- the Simulation Master: updateSphere, updateSky, setDay / setTimeOfDay / … ---- */
    function updateSphere() {
      var p = getPositionAndEqnOfTime(M.day);
      sph.sunDisk.setPosition(p);
      sph.sunDisk.setOrientationType("absolute");
      sph.decCircle.setCircleParameters({ tilt: 0, ra: 0, dec: p.dec });
      M.sid = getSiderealTime(M.day);
      sph.siderealTime = M.sid;
      M.ha = (((M.sid - p.ra) % 24) + 24) % 24;
      M.eqn = p.eqn; M.dec = p.dec; M.ra = p.ra;
    }
    function updateSky() {
      var h = sph.pointToHorizon(sph.sunDisk._p);
      M.alt = h.alt; M.az = h.az;
      if (sph.shadow.visible) shadowSource = h;
      var shade = Math.min(40, 40 * Math.pow(1 - h.alt / 90, 4));
      sph.horizonShade.outerAlpha = sph.horizonShade.innerAlpha = shade;
      sph.skyBack.outerAlpha = sph.skyBack.innerAlpha = 80 * Math.pow(h.alt / 90, 0.15);   // NaN at night: no sky
    }
    function changed() {
      updateSphere(); updateSky();
      // while animating, the sidebar follows at ~10 Hz (the canvas every frame); otherwise at once
      if (!(loop && loop.playing) || performance.now() - lastSync >= 100) syncSidebar();
      S.requestDraw();
    }
    function setDay(arg) {
      if (!isFinite(arg)) return;
      arg = ((arg % 365) + 365) % 365;
      if (arg === M.day) return;
      M.day = arg; M.tod = ((arg % 1) + 1) % 1; M.doy = Math.floor(arg);
      changed();
    }
    function setTimeOfDay(arg) {
      if (!isFinite(arg)) return;
      arg = ((arg % 1) + 1) % 1;
      if (arg === M.tod) return;
      M.tod = arg; M.day = M.doy + arg;
      changed();
    }
    function setDayOfYear(arg) {
      if (!isFinite(arg)) return;
      arg = ((Math.floor(arg) % 365) + 365) % 365;
      if (arg === M.doy) return;
      M.doy = arg; M.day = arg + M.tod;
      changed();
    }
    function setLatitude(arg) {
      arg = Math.max(-90, Math.min(90, arg));
      M.latitude = arg; sph.latitude = arg;
      updateSky(); syncSidebar(); S.requestDraw();
    }

    /* ---- the animation (onEnterFrameFunc, pause/resume, setAnimationMode) ---- */
    var loop = S.loop(function (dt) {
      animateDay += (stepByDay ? discreteSpeed : continuousSpeed) * dt * 1000;
      if (stepByDay) setDayOfYear(animateDay);
      else if (loopDay) { animateDay = M.doy + (animateDay % 1); setTimeOfDay(animateDay); }
      else setDay(animateDay);
    });
    function setAnimationState(b) {
      animationState = b;
      if (b) { animateDay = M.day; loop.play(); } else { loop.pause(); syncSidebar(); }
      syncPlay();
    }
    function pauseAnimation() { if (loop.playing) { loop.pause(); syncSidebar(); } }
    function resumeAnimation() { if (animationState && !loop.playing) { animateDay = M.day; loop.play(); } }
    function setAnimationMode(mode) {
      if (mode === "continuous") {
        if (stepByDay) { loopDay = oldLoopDay; animateDay = Math.floor(animateDay) + M.tod; stepByDay = false; }
      } else if (!stepByDay) { oldLoopDay = loopDay; loopDay = false; stepByDay = true; }
      syncSidebar();
    }

    /* ---- the sidebar (the SWF's Time and Location, Animation, Settings and Information panels) ---- */
    var syncing = false;
    S.group("sm.timeLoc");
    var dayCtl = S.slider({ labelKey: "sm.day", min: 0, max: 364, step: 1, value: 146,
      format: function (v) { var m = 0; while (m < 11 && !(v < MONTH_PTS[m + 1])) m++; return (v - MONTH_PTS[m] + 1) + " " + I18N.t("m" + m); },
      on: function (v) { if (!syncing) setDayOfYear(v); } });
    var timeCtl = S.slider({ labelKey: "sm.time", min: 0, max: 0.999, step: 1 / 1440, value: 0.5,
      format: function (v) { return clock(v); }, on: function (v) { if (!syncing) setTimeOfDay(v); } });
    var latCtl = S.slider({ labelKey: "sm.lat", min: -90, max: 90, step: 0.1, value: 40.8,
      format: function (v) { return Math.abs(v).toFixed(1) + " ° " + I18N.t(v < 0 ? "dir.S" : "dir.N"); },
      on: function (v) { if (!syncing) setLatitude(v); } });
    S.group("sm.anim");
    var playBtn = S.button({ label: "", primary: true, on: function () { setAnimationState(!animationState); } });
    function syncPlay() { playBtn.textContent = I18N.t(animationState ? "sm.pause" : "sm.start"); }
    S.refreshers.push(syncPlay);
    var modeCtl = S.select({ labelKey: "sm.mode", value: "continuous",
      options: [{ v: "continuous", labelKey: "sm.modeCont" }, { v: "stepday", labelKey: "sm.modeStep" }],
      on: function (v) { if (!syncing) setAnimationMode(v); } });
    var loopCtl = S.toggle({ labelKey: "sm.loopday", value: false, on: function (b) { if (!syncing) { loopDay = b; } } });
    var loopInput = document.querySelector('[data-i18n="sm.loopday"]').parentNode.querySelector("input");
    // the AnimationSpeedSlider is logarithmic: continuous 1/96000 … 0.00075 day/ms, by day 0.005 … 0.122 day/ms
    var speedCtl = S.slider({ labelKey: "sm.speed", min: 0, max: 1, step: 0.001, value: 0,
      format: function () { var s = (stepByDay ? discreteSpeed : continuousSpeed) * 1000; return stepByDay ? s.toFixed(1) + " " + I18N.t("sm.days") : (24 * s).toFixed(1) + " " + I18N.t("sm.hrs"); },
      on: function (v) {
        if (syncing) return;
        var lo = stepByDay ? 0.005 : 1.0416666666666666e-05, hi = stepByDay ? 0.122 : 0.00075, s = lo * Math.pow(hi / lo, v);
        if (stepByDay) discreteSpeed = s; else continuousSpeed = s;
      } });
    S.group("sm.settings");
    var optDec = S.toggle({ labelKey: "sm.decl", value: true, on: function (b) { sph.decCircle.visible = b; S.requestDraw(); } });
    var optEcl = S.toggle({ labelKey: "sm.ecl", value: true, on: function (b) { sph.eclipticCircle.visible = b; S.requestDraw(); } });
    var optMonth = S.toggle({ labelKey: "sm.month", value: false, on: function (b) { monthObjs.forEach(function (o) { o.visible = b; }); S.requestDraw(); } });
    var optUnder = S.toggle({ labelKey: "sm.under", value: true, on: function (b) { sph.showUnder = b; S.requestDraw(); } });
    var optStick = S.toggle({ labelKey: "sm.shadow", value: true, on: function (b) {
      sph.stickfigure.visible = b; sph.shadow.visible = b; updateSky(); S.requestDraw(); } });
    var dragCtl = S.select({ labelKey: "sm.drag", value: "timeOfDay",
      options: [{ v: "timeOfDay", labelKey: "sm.dragTime" }, { v: "dayOfYear", labelKey: "sm.dragDay" }],
      on: function (v) { sunDragMode = v; } });
    S.group("sm.info");
    var optAna = S.toggle({ labelKey: "sm.analemma", value: false, on: function (b) { analemma.visible = b; S.requestDraw(); } });
    var oHA = S.readout({ labelKey: "sm.ha" }), oLST = S.readout({ labelKey: "sm.lst" });
    var oEoT = S.readout({ labelKey: "sm.eot" }), oAlt = S.readout({ labelKey: "sm.alt" });
    var oAz = S.readout({ labelKey: "sm.az" }), oRA = S.readout({ labelKey: "sm.ra" });
    var oDec = S.readout({ labelKey: "sm.dec" });
    function clock(t) {
      var mins = Math.round(t * 1440) % 1440, h = Math.floor(mins / 60), m = mins % 60;
      return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    }
    function hm(x) { var h = Math.floor(x); return h + "h " + Math.floor(60 * (x - h)) + "m"; }
    var shownCtl = {}, lastSync = 0;
    function setCtl(key, ctl, v, tag) {             // only what changed (tag: what else the label shows)
      var k = tag === undefined ? v : tag + ":" + v;
      if (shownCtl[key] !== k) { shownCtl[key] = k; ctl.set(v); }
    }
    function syncSidebar() {                        // the Info Panel's own strings
      lastSync = performance.now();
      syncing = true;
      setCtl("day", dayCtl, M.doy); setCtl("tod", timeCtl, M.tod); setCtl("lat", latCtl, M.latitude);
      setCtl("mode", modeCtl, stepByDay ? "stepday" : "continuous"); setCtl("loop", loopCtl, loopDay);
      loopInput.disabled = stepByDay;               // (the SWF greys "loop day" out while stepping by day)
      var lo = stepByDay ? 0.005 : 1.0416666666666666e-05, hi = stepByDay ? 0.122 : 0.00075;
      setCtl("speed", speedCtl, Math.log((stepByDay ? discreteSpeed : continuousSpeed) / lo) / Math.log(hi / lo), stepByDay);
      syncing = false;
      var ha = M.ha > 12 ? "-" + hm(Math.abs(M.ha - 24)) : hm(M.ha);
      var e = Math.abs(M.eqn), em = Math.floor(e), es = Math.floor(60 * (e - em));
      oHA(ha); oLST(hm(M.sid)); oEoT((M.eqn < 0 ? "-" : "") + em + ":" + (es < 10 ? "0" : "") + es);
      oAlt(M.alt.toFixed(1) + "°"); oAz(M.az.toFixed(1) + "°"); oRA(hm(M.ra)); oDec(M.dec.toFixed(1) + "°");
    }
    S.refreshers.push(syncSidebar);

    /* ---- pointer: the Sun Disk, the circles' balloons, the sphere ---- */
    var drag = null, balloon = null;
    function at(ev) { return CS.canvasPoint(S.canvas, ev, S.W, S.H); }
    function overSun(p) {                           // the disk's own shape (with its outline, once that shows)
      var o = sph.sunDisk;
      if (!o.shown) return false;
      var q = o.toLocal(p.x, p.y), r = sunHot ? 9.5 : 9;
      return q.x * q.x + q.y * q.y <= r * r;
    }
    function circleAt(p) {                          // the topmost near half that takes the mouse
      var list = analemma.visible ? BALLOONS.concat([ANA_BALLOON]) : BALLOONS;
      for (var i = list.length - 1; i >= 0; i--)
        if (list[i].c.hitTest(S.ctx, p.x, p.y) === "front") return list[i];
      return null;
    }
    function balloonBox(ctx, b) {                   // the SWF's box, or a wider one for a longer translation
      if (I18N.getLang() === "en") return { w: b.box[0], h: b.box[1], wh: b.wh, en: true };
      ctx.font = "bold 10px " + FONT;
      var tw = 0;
      b.lines.forEach(function (l) { tw = Math.max(tw, FlashText.widthStatic(ctx, I18N.t(l[0]))); });
      var w = Math.max(b.box[0], Math.ceil(tw) + 12);
      return { w: w, h: b.box[1], wh: [w + 1, b.box[1] + 1], en: false };
    }
    function hover(p) {                             // roll-over / roll-out, as Flash sends them
      var hot = !!p && overSun(p), b = p && !hot ? circleAt(p) : null;
      if (hot !== sunHot) { sunHot = hot; S.requestDraw(); }
      if (b === balloon) return;
      if (balloon) balloon.c.setStyle(2);
      balloon = b;
      if (b) {                                      // placed once, at the mouse − 5, kept at least its own size in
        b.c.setStyle(4);
        var wh = balloonBox(S.ctx, b).wh;
        b.x = Math.max(p.x - 5, wh[0]); b.y = Math.max(p.y - 5, wh[1]);
      }
      S.requestDraw();
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), dx = p.x - sph.x, dy = p.y - sph.y;
      if (Math.sqrt(dx * dx + dy * dy) < sph.r) { pauseAnimation(); held = true; }   // the master's onMouseDown
      if (overSun(p)) {                             // Sun Disk.onPress — from the near side only
        if (sph.sunDisk.screen.z > 0)
          drag = sunDragMode === "timeOfDay" ? { kind: "sun", off: sph.screenToCelestial(p.x, p.y).ra - M.ra } : { kind: "sunDay" };
        else drag = { kind: "none" };
      } else if (circleAt(p)) drag = { kind: "none" };   // a balloon circle takes the press and does nothing with it
      else if (sph.startDrag(p.x, p.y)) drag = { kind: "sphere" };
      if (drag) try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!drag) { hover(p); return; }
      if (drag.kind === "sun") {                    // decCircleOnMouseMoveFunc
        var r = sph.screenToCelestial(p.x, p.y).ra;
        setTimeOfDay((sph.siderealTime - r + drag.off + 12) / 24 - 0.0006944444444444445 * M.eqn);
      } else if (drag.kind === "sunDay") setClosestDay(p);   // analemmaOnMouseMoveFunc
      else if (drag.kind === "sphere") { sph.dragTo(p.x, p.y); updateSky(); S.requestDraw(); }
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function (ev) {
        var was = drag;
        drag = null; sph.endDrag();
        if (held) { held = false; resumeAnimation(); }
        if (was) hover(at(ev));                     // onRelease / onReleaseOutside
      });
    });
    S.canvas.addEventListener("pointerleave", function () { if (!drag) hover(null); });

    /* ================================= drawing ============================== */
    S.onDraw(function () {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.fillStyle = "#000000"; ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
      sph.draw(ctx);
      if (balloon) drawBalloon(ctx, balloon);
    });
    function drawBalloon(ctx, b) {
      var bx = balloonBox(ctx, b);
      ctx.save(); ctx.translate(b.x, b.y);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(-bx.w, -bx.h, bx.w, bx.h);
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.lineJoin = "round"; ctx.strokeRect(-bx.w, -bx.h, bx.w, bx.h);
      ctx.fillStyle = "#000000"; ctx.font = "bold 10px " + FONT; ctx.textBaseline = "alphabetic";
      b.lines.forEach(function (l) {
        if (bx.en) FlashText.fillStatic(ctx, I18N.t(l[0]), l[1], l[2], "left");
        else FlashText.fillStatic(ctx, I18N.t(l[0]), -bx.w / 2, l[2], "center");
      });
      ctx.restore();
    }

    void optDec; void optEcl; void optMonth; void optUnder; void optStick; void dragCtl; void optAna;
    setLatitude(40.8);
    M.day = -1; setDay(146.5);
    syncPlay();
  }
});
