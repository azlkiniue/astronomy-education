/* Seasons and Ecliptic Simulator ------------------------------------------------
   Faithful rebuild of the NAAP "seasons_ecliptic.swf" (sprite291, decompiled).

   Three views of one date. The orbit view puts the Sun at the centre with Earth
   at ecliptic longitude 360·daysSinceVE/365; the Earth view shows the globe with
   sunlight arriving at the Sun's declination; and the ground view shows how
   steeply that light lands where the observer stands. The SWF's own defaults:
   day 40 (10 February), latitude 10° N, sunlight angle, view from side.       */
Sim.create({
  id: "seasons_ecliptic",
  width: 960, height: 580,
  strings: {
    en: {
      "se.ctl": "Date and place", "se.day": "day of year", "se.lat": "observer's latitude",
      "se.anim": "start animation", "se.stop": "stop animation", "se.rate": "animation rate",
      "se.view": "Views", "se.centre": "left diagram",
      "se.sun": "orbit view", "se.earth": "celestial sphere",
      "se.feature": "ground view", "se.angle": "sunlight angle", "se.spread": "sunbeam spread",
      "se.vtype": "earth view", "se.fromSun": "view from sun", "se.fromSide": "view from side",
      "se.sub": "show subsolar point",
      "se.orbLabels": "orbit view labels", "se.earLabels": "earth view labels",
      "se.ncp": "north celestial pole", "se.scp": "south celestial pole",
      "se.ecliptic": "ecliptic", "se.celeq": "celestial equator",
      "se.orbitPath": "orbital path", "se.npole": "north pole", "se.spole": "south pole",
      "se.toVE": "to VE", "se.toSS": "to SS", "se.toAE": "to AE", "se.toWS": "to WS",
      "se.capPersp": "click and drag to change perspective",
      "se.capSun": "click and drag the sun to change its position on the ecliptic",
      "se.capEarth": "click and drag the earth to change its position on the orbital path",
      "se.capLat": "click and drag the stickfigure or the red latitude circle to change the observer's latitude",
      "se.capLat2": "click and drag the red latitude circle to change the observer's latitude",
      "se.pOrbit": "orbit view", "se.pEarth": "earth view", "se.pGround": "ground view",
      "se.rDec": "sun's declination", "se.rRA": "sun's right ascension",
      "se.rAlt": "sun's altitude at noon", "se.rAlt2": "sun's altitude",
      "se.rDate": "date",
      "se.hint": "Drag the red marker along the months, or drag the latitude on the globe. Watch the noon altitude and the spread of the light change together.",
      "se.equator": "equator", "se.cancer": "tropic of cancer",
      "se.capricorn": "tropic of capricorn", "se.arctic": "arctic circle",
      "se.antarctic": "antarctic circle", "se.subsolar": "subsolar point",
      "se.N": "N", "se.S": "S",
      "m1": "Jan", "m2": "Feb", "m3": "Mar", "m4": "Apr", "m5": "May", "m6": "Jun",
      "m7": "Jul", "m8": "Aug", "m9": "Sep", "m10": "Oct", "m11": "Nov", "m12": "Dec"
    },
    id: {
      "se.ctl": "Tanggal dan tempat", "se.day": "hari ke-", "se.lat": "lintang pengamat",
      "se.anim": "mulai animasi", "se.stop": "hentikan animasi", "se.rate": "laju animasi",
      "se.view": "Tampilan", "se.centre": "diagram kiri",
      "se.sun": "tampilan orbit", "se.earth": "bola langit",
      "se.feature": "tampilan permukaan", "se.angle": "sudut sinar matahari", "se.spread": "sebaran berkas",
      "se.vtype": "tampilan bumi", "se.fromSun": "dilihat dari matahari", "se.fromSide": "dilihat dari samping",
      "se.sub": "tampilkan titik subsolar",
      "se.orbLabels": "label tampilan kiri", "se.earLabels": "label tampilan bumi",
      "se.ncp": "kutub langit utara", "se.scp": "kutub langit selatan",
      "se.ecliptic": "ekliptika", "se.celeq": "ekuator langit",
      "se.orbitPath": "lintasan orbit", "se.npole": "kutub utara", "se.spole": "kutub selatan",
      "se.toVE": "ke EM", "se.toSS": "ke SU", "se.toAE": "ke EG", "se.toWS": "ke SD",
      "se.capPersp": "klik dan seret untuk mengubah sudut pandang",
      "se.capSun": "klik dan seret matahari untuk mengubah posisinya pada ekliptika",
      "se.capEarth": "klik dan seret bumi untuk mengubah posisinya pada lintasan orbit",
      "se.capLat": "klik dan seret orang-orangan atau lingkaran lintang merah untuk mengubah lintang pengamat",
      "se.capLat2": "klik dan seret lingkaran lintang merah untuk mengubah lintang pengamat",
      "se.pOrbit": "tampilan orbit", "se.pEarth": "tampilan bumi", "se.pGround": "tampilan permukaan",
      "se.rDec": "deklinasi matahari", "se.rRA": "asensiorekta matahari",
      "se.rAlt": "ketinggian matahari saat tengah hari",
      "se.rAlt2": "ketinggian matahari", "se.rDate": "tanggal",
      "se.hint": "Seret penanda merah sepanjang bulan, atau seret lintang pada bola bumi. Amati ketinggian tengah hari dan sebaran cahaya berubah bersamaan.",
      "se.equator": "ekuator", "se.cancer": "Garis Balik Utara",
      "se.capricorn": "Garis Balik Selatan", "se.arctic": "Lingkar Arktik",
      "se.antarctic": "Lingkar Antarktik", "se.subsolar": "titik subsolar",
      "se.N": "U", "se.S": "S",
      "m1": "Jan", "m2": "Feb", "m3": "Mar", "m4": "Apr", "m5": "Mei", "m6": "Jun",
      "m7": "Jul", "m8": "Agu", "m9": "Sep", "m10": "Okt", "m11": "Nov", "m12": "Des"
    }
  },
  about: {
    en: "<p>Seasons come from the tilt of Earth's axis, not from its distance to the Sun — Earth is actually closest to the Sun in early January. The axis keeps pointing the same way in space all year, so as Earth goes round, first one hemisphere and then the other leans towards the Sun.</p>" +
        "<p>The Sun's declination is the latitude where its light falls straight down at noon. It runs from +23.4° at the June solstice to −23.4° in December, and those two limits are what the tropics mark. At noon the Sun stands 90° − |latitude − declination| above the horizon.</p>" +
        "<p>The ground view shows why that angle matters so much. A beam of given width lands on a small patch when the Sun is high and smears over a much larger one when it is low, so each square metre receives correspondingly less energy. Combine that with the longer day, and summer follows.</p>",
    id: "<p>Musim lahir dari kemiringan sumbu Bumi, bukan dari jaraknya ke Matahari — Bumi justru paling dekat dengan Matahari pada awal Januari. Sumbu itu tetap menunjuk arah yang sama di ruang angkasa sepanjang tahun, sehingga saat Bumi mengelilingi Matahari, mula-mula satu belahan lalu belahan yang lain condong ke arah Matahari.</p>" +
        "<p>Deklinasi Matahari adalah lintang tempat cahayanya jatuh tegak lurus pada tengah hari. Nilainya berayun dari +23,4° pada titik balik Juni hingga −23,4° pada Desember, dan kedua batas itulah yang ditandai oleh garis balik. Pada tengah hari Matahari berada 90° − |lintang − deklinasi| di atas ufuk.</p>" +
        "<p>Tampilan permukaan memperlihatkan mengapa sudut itu begitu penting. Seberkas cahaya dengan lebar tertentu jatuh pada petak kecil ketika Matahari tinggi, dan melebar pada petak yang jauh lebih luas ketika Matahari rendah, sehingga tiap meter persegi menerima energi yang jauh lebih sedikit. Gabungkan dengan hari yang lebih panjang, maka musim panas pun tiba.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var EPS = 23.4 * RAD;
    var ORB = { x: 8, y: 26, w: 462, h: 468 };
    var EAR = { x: 478, y: 26, w: 474, h: 292 };
    var GRD = { x: 478, y: 326, w: 474, h: 168 };
    var TL = { x: 8, y: 502, w: 944, h: 68 };
    var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    /* onReset()'s own state */
    var day = 40, lat = 10, centre = "sun", feature = "angle", vtype = "side";
    var showSub = true, showOrbLabels = false, showEarLabels = false;
    var rate = 8, drag = null;

    S.group("se.ctl");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "se.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    /* The model runs on a fractional day, as the SWF's daysSinceVE does; the
       slider and the date readout show it rounded. Writing daySlider.value in
       Flash does not call changeDayOfYear, so the fraction survives — here
       slider.set() does call back, hence the guard.                          */
    var fromLoop = false;
    var dayCtl = S.slider({ labelKey: "se.day", min: 0, max: 364, value: day, step: 1,
      format: dateString, on: function (v) { if (!fromLoop) day = v; upd(); } });
    var latCtl = S.slider({ labelKey: "se.lat", min: -90, max: 90, value: lat, step: 0.5,
      format: latString, on: function (v) { lat = v; upd(); } });
    var loop = S.loop(function (dt) {                     // onEnterFrameFunc
      day = (((day + dt * rate) % 365) + 365) % 365;      // daysSinceVE += rate·Δt
      var shown = Math.round(day) % 365;                  // daySlider.value = round(…)
      if (shown === dayCtl.value()) { upd(); return; }
      fromLoop = true; dayCtl.set(shown); fromLoop = false;
    });
    var animBtn = S.button({ label: "", primary: true, on: function () {
      loop.toggle(); syncBtn();
    } });
    S.slider({ labelKey: "se.rate", min: 2, max: 60, value: rate, step: 1,
      format: function (v) { return v + " d/s"; }, on: function (v) { rate = v; } });

    S.group("se.view");
    S.select({ labelKey: "se.centre", value: "sun", options: [
      { v: "sun", labelKey: "se.sun" }, { v: "earth", labelKey: "se.earth" }
    ], on: function (v) { centre = v; S.requestDraw(); } });
    S.select({ labelKey: "se.vtype", value: "side", options: [
      { v: "side", labelKey: "se.fromSide" }, { v: "sun", labelKey: "se.fromSun" }
    ], on: function (v) { vtype = v; S.requestDraw(); } });
    S.select({ labelKey: "se.feature", value: "angle", options: [
      { v: "angle", labelKey: "se.angle" }, { v: "spread", labelKey: "se.spread" }
    ], on: function (v) { feature = v; S.requestDraw(); } });
    S.toggle({ labelKey: "se.sub", value: true, on: function (b) { showSub = b; S.requestDraw(); } });
    S.toggle({ labelKey: "se.orbLabels", value: false,
      on: function (b) { showOrbLabels = b; S.requestDraw(); } });
    S.toggle({ labelKey: "se.earLabels", value: false,
      on: function (b) { showEarLabels = b; S.requestDraw(); } });
    var outDate = S.readout({ labelKey: "se.rDate" });
    var outDec = S.readout({ labelKey: "se.rDec" });
    var outRA = S.readout({ labelKey: "se.rRA" });
    var outAlt = S.readout({ labelKey: "se.rAlt" });

    function syncBtn() { animBtn.textContent = I18N.t(loop.playing ? "se.stop" : "se.anim"); }
    function dateString(d) {
      var n = Math.floor(((d % 365) + 365) % 365) + 1;
      for (var i = 0; i < 12; i++) {
        if (n <= MONTH_DAYS[i]) return n + " " + I18N.t("m" + (i + 1));
        n -= MONTH_DAYS[i];
      }
      return "31 " + I18N.t("m12");
    }
    function latString(v) {
      return Math.abs(v).toFixed(1) + "° " + (v < 0 ? I18N.t("se.S") : I18N.t("se.N"));
    }
    /* changeDayOfYear(): daysSinceVE = day + 286, and the ecliptic longitude
       follows from 360·daysSinceVE/365                                        */
    function lambda() { return ((day + 286) * 360 / 365) * RAD; }
    function shownDay() { return Math.round(day) % 365; }   // getDayString(daySlider.value)
    function globeAngle() { return 270 + (day + 286) * 360 / 365; }   // the SWF's r1
    function sunDec() { return Math.asin(Math.sin(EPS) * Math.sin(lambda())) * DEG; }
    function sunRA() {
      var L = lambda();
      var a = Math.atan2(Math.sin(L) * Math.cos(EPS), Math.cos(L)) * DEG;
      return ((a % 360) + 360) % 360 / 15;
    }
    function noonAlt() {                                   // (90 − lat) + dec, folded at 90
      var r = (90 - lat) + sunDec();
      return { alt: r > 90 ? 180 - r : r, dir: r > 90 ? "se.N" : "se.S" };
    }
    function upd() {
      var d = sunDec(), n = noonAlt();
      outDate(dateString(shownDay()));
      outDec((d >= 0 ? "+" : "−") + Math.abs(d).toFixed(1) + "°");
      outRA(sunRA().toFixed(1) + "h");
      outAlt(n.alt.toFixed(1) + "° (" + I18N.t(n.dir) + ")");
      S.requestDraw();
    }
    S.refreshers.push(function () { syncBtn(); upd(); });

    /* ------------------------------ interaction ----------------------------- */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (p.y >= TL.y && p.y <= TL.y + TL.h) { drag = "day"; setDay(p.x); }
      else if (p.x >= EAR.x && p.x <= EAR.x + EAR.w && p.y >= EAR.y && p.y <= EAR.y + EAR.h) {
        drag = "lat"; setLat(p);
      } else if (p.x >= ORB.x && p.x <= ORB.x + ORB.w && p.y >= ORB.y && p.y <= ORB.y + ORB.h) {
        drag = { x: p.x, y: p.y, th: SPH.th, ph: SPH.ph };   // onMouseUpdate
      } else return;
      S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      if (drag === "day") { setDay(p.x); return; }
      if (drag === "lat") { setLat(p); return; }
      SPH.th = ((drag.th - (p.x - drag.x) * 0.4) % 360 + 360) % 360;
      SPH.ph = Math.max(2, Math.min(88, drag.ph + (p.y - drag.y) * 0.3));
      S.requestDraw();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; });
    });
    function setDay(x) {
      dayCtl.set(Math.max(0, Math.min(364, Math.round((x - TL.x - 26) / (TL.w - 52) * 364))));
    }
    function setLat(p) {
      var g = globeGeom(), dy = (g.cy - p.y) / g.r;
      latCtl.set(Math.max(-90, Math.min(90, Math.round(Math.asin(Math.max(-1, Math.min(1, dy))) * DEG * 2) / 2)));
    }
    function globeGeom() {
      return { cx: EAR.x + EAR.w * 0.60, cy: EAR.y + EAR.h / 2 + 2, r: 86 };
    }

    /* ================================= drawing ============================== */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#fafafa"; ctx.fillRect(0, 0, S.W, S.H);
      panel(ctx, ORB);
      panel(ctx, EAR);
      panel(ctx, GRD);
      ctx.save(); clipTo(ctx, ORB);
      if (centre === "sun") orbitView(ctx, tr); else sphereView(ctx, tr);
      ctx.restore();
      ctx.save(); clipTo(ctx, EAR); earthView(ctx, tr); ctx.restore();
      ctx.save(); clipTo(ctx, GRD); groundView(ctx, tr); ctx.restore();
      timeline(ctx, tr);
    });
    function clipTo(ctx, P) { ctx.beginPath(); ctx.rect(P.x, P.y, P.w, P.h); ctx.clip(); }
    function panel(ctx, P) {
      ctx.fillStyle = "#000000"; ctx.fillRect(P.x, P.y, P.w, P.h);
      ctx.strokeStyle = "#777777"; ctx.lineWidth = 1;
      ctx.strokeRect(P.x + 0.5, P.y + 0.5, P.w - 1, P.h - 1);
    }

    /* ======================= the UNL CelestialSphere ==========================
       Both left-hand diagrams are one sphere in the SWF: siderealTime 12 and
       latitude 66.6, so its "horizon" plane is tilted 23.4° off the celestial
       equator — that plane is the ecliptic. orbitalPath (the horizon circle) is
       drawn white, celestialEquator (dec 0) green. onReset sets viewerAzimuth
       270 and viewerAltitude 30.                                             */
    var SPH = { th: 90, ph: 30 };                         // 360 − viewerAzimuth, altitude
    var SPH_LAT = 66.6, SPH_ST = 12;
    function mats(r) {
      var ct = Math.cos(SPH.th * RAD), st = Math.sin(SPH.th * RAD);
      var cp = Math.cos(SPH.ph * RAD), sp = Math.sin(SPH.ph * RAD);
      var a = { a0: -r * st, a1: r * ct, a3: r * ct * sp, a4: r * st * sp, a5: -r * cp,
        a6: r * ct * cp, a7: r * st * cp, a8: r * sp };
      var L = SPH_LAT * RAD, sT = SPH_ST / 24 * TAU;
      var m2 = Math.cos(L), m3 = Math.sin(sT), m4 = -Math.cos(sT), m8 = Math.sin(L);
      var m = { m0: m4 * m8, m1: -m3 * m8, m2: m2, m3: m3, m4: m4,
        m6: -m2 * m4, m7: m2 * m3, m8: m8 };
      return { a: a, b: {
        b0: a.a0 * m.m0 + a.a1 * m.m3, b1: a.a0 * m.m1 + a.a1 * m.m4, b2: a.a0 * m.m2,
        b3: a.a3 * m.m0 + a.a4 * m.m3 + a.a5 * m.m6, b4: a.a3 * m.m1 + a.a4 * m.m4 + a.a5 * m.m7,
        b5: a.a3 * m.m2 + a.a5 * m.m8,
        b6: a.a6 * m.m0 + a.a7 * m.m3 + a.a8 * m.m6, b7: a.a6 * m.m1 + a.a7 * m.m4 + a.a8 * m.m7,
        b8: a.a6 * m.m2 + a.a8 * m.m8 } };
    }
    /* v is a unit vector in the ecliptic ("horizon") frame; k is a radius in
       SPHERE RADII, not pixels — mats() already carries the pixel radius, the
       same convention as ce_hc's Sphere.h/.cel                                */
    function proj(M, c, v, k) {
      var a = M.a; k = k === undefined ? 1 : k;
      return { x: c.x + (v.x * a.a0 + v.y * a.a1) * k,
        y: c.y + (v.x * a.a3 + v.y * a.a4 + v.z * a.a5) * k,
        z: (v.x * a.a6 + v.y * a.a7 + v.z * a.a8) * k };
    }
    function projC(M, c, v, k) {
      var b = M.b; k = k === undefined ? 1 : k;
      return { x: c.x + (v.x * b.b0 + v.y * b.b1 + v.z * b.b2) * k,
        y: c.y + (v.x * b.b3 + v.y * b.b4 + v.z * b.b5) * k,
        z: (v.x * b.b6 + v.y * b.b7 + v.z * b.b8) * k };
    }
    /* the Sun's direction from Earth, in the ecliptic frame: the SWF puts VE at
       horizon (0,−1,0), SS at (1,0,0), AE at (0,1,0), WS at (−1,0,0)          */
    function eclDir(L) { return { x: Math.sin(L), y: -Math.cos(L), z: 0 }; }
    /* In the celestial-sphere view the Sun sits at {ra: 12 + r1/15, dec: 0} in
       the sphere's CELESTIAL frame, and the readouts come from converting that
       to the horizon frame — so celestial is the ecliptic here and horizon is
       the equator, the opposite way round from the names.                     */
    function sunEcl() {
      var t = (180 + globeAngle()) * RAD;
      return { x: Math.cos(t), y: Math.sin(t), z: 0 };
    }
    var CARD = [["se.toVE", { x: 0, y: -1, z: 0 }], ["se.toSS", { x: 1, y: 0, z: 0 }],
      ["se.toAE", { x: 0, y: 1, z: 0 }], ["se.toWS", { x: -1, y: 0, z: 0 }]];
    var CARD_C = [["se.toVE", { x: 0, y: 1, z: 0 }], ["se.toSS", { x: -1, y: 0, z: 0 }],
      ["se.toAE", { x: 0, y: -1, z: 0 }], ["se.toWS", { x: 1, y: 0, z: 0 }]];

    /* The Sun icon is setOrientationType('absolute'): a flat disc in the sphere's
       tangent plane, so it foreshortens as it runs round the ecliptic. Measured
       off the SWF recording: 50px wide near the bottom of the ring, 24px at the
       limb, with the height holding near 46.                                  */
    function tangentDisc(ctx, M, c, project, u, rho) {
      var up = Math.abs(u.z) < 0.9 ? { x: 0, y: 0, z: 1 } : { x: 1, y: 0, z: 0 };
      var e1 = { x: up.y * u.z - up.z * u.y, y: up.z * u.x - up.x * u.z,
        z: up.x * u.y - up.y * u.x };
      var n1 = Math.hypot(e1.x, e1.y, e1.z);
      e1 = { x: e1.x / n1, y: e1.y / n1, z: e1.z / n1 };
      var e2 = { x: u.y * e1.z - u.z * e1.y, y: u.z * e1.x - u.x * e1.z,
        z: u.x * e1.y - u.y * e1.x };
      var o = project(M, c, u), a1 = project(M, c, e1), a2 = project(M, c, e2);
      var d1 = { x: a1.x - c.x, y: a1.y - c.y }, d2 = { x: a2.x - c.x, y: a2.y - c.y };
      ctx.beginPath();
      for (var i = 0; i <= 48; i++) {
        var t = i * TAU / 48, ct = Math.cos(t) * rho, st = Math.sin(t) * rho;
        var px = o.x + ct * d1.x + st * d2.x, py = o.y + ct * d1.y + st * d2.y;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath();
      return o;
    }

    /* a full circle of a plane in either frame, split at the horizon of the ball */
    function ring(ctx, M, c, project, normalTilt, colour, width, alpha) {
      ctx.strokeStyle = colour; ctx.lineWidth = width; ctx.globalAlpha = alpha;
      ctx.beginPath();
      var open = false;
      for (var i = 0; i <= 180; i++) {
        var g = i * TAU / 180;
        var v = normalTilt(Math.cos(g), Math.sin(g));
        var q = project(M, c, v);
        if (i === 0 || !open) { ctx.moveTo(q.x, q.y); open = true; } else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    }
    function label(ctx, text, tip, dx, dy, align) {
      var tx = tip.x + dx, ty = tip.y + dy;
      ctx.strokeStyle = "#e6e6e6"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tip.x + dx * 0.18, tip.y + dy * 0.18);
      ctx.lineTo(tx - dx * 0.16, ty - dy * 0.16);
      ctx.stroke();
      ctx.fillStyle = "#ffffff"; ctx.font = "11px " + FONT;
      ctx.textAlign = align; ctx.textBaseline = "middle";
      ctx.fillText(text, tx + (align === "right" ? -3 : align === "left" ? 3 : 0), ty);
    }
    function arrow(ctx, x0, y0, x1, y1, colour, width, head) {
      var a = Math.atan2(y1 - y0, x1 - x0);
      ctx.strokeStyle = colour; ctx.lineWidth = width; ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1 - Math.cos(a) * head * 0.9, y1 - Math.sin(a) * head * 0.9);
      ctx.stroke();
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - Math.cos(a - 0.38) * head, y1 - Math.sin(a - 0.38) * head);
      ctx.lineTo(x1 - Math.cos(a + 0.38) * head, y1 - Math.sin(a + 0.38) * head);
      ctx.closePath(); ctx.fill();
    }
    /* the lowest point of a ring on one side, so a label leader always lands on
       the curve it names however the sphere is turned                        */
    function ringAnchor(M, c, project, leftSide) {
      var best = null;
      for (var i = 0; i < 180; i++) {
        var g = i * TAU / 180;
        var q = project(M, c, { x: Math.cos(g), y: Math.sin(g), z: 0 });
        if (!best || (leftSide ? q.x < best.x : q.x > best.x)) best = q;
      }
      return best || { x: c.x, y: c.y };
    }
    function cardinals(ctx, M, c, project, table) {       // to VE / SS / AE / WS
      project = project || proj; table = table || CARD;
      ctx.fillStyle = "#e6e6e6"; ctx.font = "9px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      table.forEach(function (o) {
        var q = project(M, c, o[1], 0.62);
        ctx.fillText(I18N.t(o[0]), q.x, q.y);
        var t = project(M, c, o[1], 0.78);
        arrow(ctx, q.x, q.y, t.x, t.y, "#e6e6e6", 1, 5);
      });
    }

    /* ---- orbit view: the Sun at the centre, Earth on the orbital path ------ */
    function orbitView(ctx, tr) {
      var c = { x: ORB.x + ORB.w / 2, y: ORB.y + ORB.h / 2 + 6 }, R = 196;
      var M = mats(R), L = lambda();
      ctx.save(); clipTo(ctx, ORB);
      [0, 90].forEach(function (az) {                     // meridian1, meridian2
        var A = -az * RAD, ca = Math.cos(A), sa = Math.sin(A);
        ring(ctx, M, c, proj, function (cg, sg) {
          return { x: ca * cg, y: sa * cg, z: sg };
        }, "#909090", 1, 0.30);
      });
      ring(ctx, M, c, proj, function (cg, sg) {           // orbitalPath, white
        return { x: cg, y: sg, z: 0 };
      }, "#ffffff", 1, 1);
      var eDir = eclDir(L + Math.PI);                 // Earth, opposite the Sun
      var e = proj(M, c, eDir);
      sunDisc(ctx, c.x, c.y, 24);
      var a = Math.atan2(e.y - c.y, e.x - c.x), len = Math.hypot(e.x - c.x, e.y - c.y);
      arrow(ctx, c.x + Math.cos(a) * 30, c.y + Math.sin(a) * 30,
        c.x + Math.cos(a) * (len - 20), c.y + Math.sin(a) * (len - 20), "#ddd9a8", 5, 15);
      smallGlobe(ctx, e.x, e.y, 17,
        unitProj(M, c, R, { x: -eDir.x, y: -eDir.y, z: 0 }, proj),   // Earth → Sun
        unitProj(M, c, R, { x: 0, y: 0, z: 1 }, projC));             // the NCP
      if (showOrbLabels) {
        cardinals(ctx, M, c);
        label(ctx, tr("se.orbitPath"), ringAnchor(M, c, proj, false), -28, 28, "center");
      }
      ctx.restore();
      panelCaptions(ctx, tr, "se.capEarth");
      sunReadouts(ctx, tr);
    }
    /* ---- celestial sphere: Earth inside, the Sun running round the ecliptic - */
    function sphereView(ctx, tr) {
      var c = { x: ORB.x + ORB.w / 2, y: ORB.y + ORB.h / 2 + 6 }, R = 214;
      var M = mats(R), L = lambda();
      ctx.save(); clipTo(ctx, ORB);
      ctx.drawImage(ball(R), c.x - R, c.y - R);           // addShadingClip('sphere outside')
      [0, 90].forEach(function (az) {
        var A = -az * RAD, ca = Math.cos(A), sa = Math.sin(A);
        ring(ctx, M, c, proj, function (cg, sg) {
          return { x: ca * cg, y: sa * cg, z: sg };
        }, "#909090", 1, 0.30);
      });
      ring(ctx, M, c, proj, function (cg, sg) {           // the equator, restyled green
        return { x: cg, y: sg, z: 0 };
      }, "#478930", 1.5, 1);
      ring(ctx, M, c, projC, function (cg, sg) {          // the ecliptic, restyled grey
        return { x: cg, y: sg, z: 0 };
      }, "#a0a0a0", 1.5, 1);
      var ncp = proj(M, c, { x: 0, y: 0, z: 1 });      // the polar axis and its markers
      var scp = proj(M, c, { x: 0, y: 0, z: -1 });
      ctx.strokeStyle = "#8d8d8d"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ncp.x, ncp.y); ctx.lineTo(scp.x, scp.y); ctx.stroke();
      ctx.fillStyle = "#9a9a9a";
      [ncp, scp].forEach(function (q) {
        ctx.beginPath(); ctx.ellipse(q.x, q.y, 5, 3, 0, 0, TAU); ctx.fill();
      });
      var u = sunEcl(), s = projC(M, c, u);             // the Sun, on the ecliptic
      var a = Math.atan2(c.y - s.y, c.x - s.x);
      arrow(ctx, s.x + Math.cos(a) * 24, s.y + Math.sin(a) * 24,
        c.x - Math.cos(a) * 30, c.y - Math.sin(a) * 30, "#ddd9a8", 5, 15);
      smallGlobe(ctx, c.x, c.y, 26,
        unitProj(M, c, R, u, projC),                    // Earth → Sun
        unitProj(M, c, R, { x: 0, y: 0, z: 1 }, proj)); // the NCP
      tangentDisc(ctx, M, c, projC, u, 22 / R);
      var sg = ctx.createRadialGradient(s.x - 6, s.y - 6, 2, s.x, s.y, 22);
      sg.addColorStop(0, "#fffbe6"); sg.addColorStop(0.6, "#f6ec9e");
      sg.addColorStop(1, "#e9db72");
      ctx.fillStyle = sg; ctx.fill();
      if (showOrbLabels) {
        cardinals(ctx, M, c, projC, CARD_C);
        label(ctx, tr("se.ncp"), ncp, 0, -22, "center");
        label(ctx, tr("se.scp"), scp, 0, 24, "center");
        label(ctx, tr("se.ecliptic"), ringAnchor(M, c, projC, false), -30, 30, "center");
        label(ctx, tr("se.celeq"), ringAnchor(M, c, proj, true), 26, 34, "center");
      }
      ctx.restore();
      panelCaptions(ctx, tr, "se.capSun");
      sunReadouts(ctx, tr);
    }
    /* the sphere's own shading, baked: it never changes and a live radial fill
       of this size costs several milliseconds a frame                        */
    var ballTile = null, ballR = 0;
    function ball(R) {
      if (ballTile && ballR === R) return ballTile;
      ballR = R;
      ballTile = document.createElement("canvas");
      ballTile.width = ballTile.height = 2 * R;
      var g2 = ballTile.getContext("2d");
      var g = g2.createRadialGradient(R, R, R * 0.1, R, R, R);
      g.addColorStop(0, "#121212"); g.addColorStop(0.72, "#232323");
      g.addColorStop(1, "#3c3c3c");
      g2.fillStyle = g;
      g2.beginPath(); g2.arc(R, R, R, 0, TAU); g2.fill();
      return ballTile;
    }
    function panelCaptions(ctx, tr, rightKey) {
      ctx.fillStyle = "#cfcfcf"; ctx.font = "italic 10px " + FONT;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      ctx.fillText(tr("se.capPersp"), ORB.x + 8, ORB.y + 6);
      ctx.textAlign = "right";
      wrapRight(ctx, tr(rightKey), ORB.x + ORB.w - 8, ORB.y + 6, 190);
    }
    function wrapRight(ctx, text, x, y, max) {
      var words = text.split(" "), line = "", out = [];
      words.forEach(function (w) {
        var t = line ? line + " " + w : w;
        if (ctx.measureText(t).width > max && line) { out.push(line); line = w; } else line = t;
      });
      if (line) out.push(line);
      out.forEach(function (l, i) { ctx.fillText(l, x, y + i * 13); });
    }
    function sunReadouts(ctx, tr) {
      ctx.fillStyle = "#ffffff"; ctx.font = "12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      var d = sunDec();
      ctx.fillText(tr("se.rDec") + ": " + (d >= 0 ? "" : "−") + Math.abs(d).toFixed(1),
        ORB.x + 14, ORB.y + ORB.h - 26);
      ctx.fillText(tr("se.rRA") + ": " + sunRA().toFixed(1) + "h",
        ORB.x + 14, ORB.y + ORB.h - 10);
    }
    function sunDisc(ctx, x, y, r) {
      var g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.1, x, y, r);
      g.addColorStop(0, "#fffbe6"); g.addColorStop(0.6, "#ffe98a"); g.addColorStop(1, "#f0c64a");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    /* the orbit view's Earth: a real globe with its axis tilted by the obliquity,
       the night side turned away from the Sun, and the subsolar point marked   */
    /* ---------------------------------------------------------------------
       The little Earth. `sun` and `axis` are unit vectors already carried
       through the panel's own projection — screen x and y, plus z toward the
       viewer — so the lit half, the subsolar point and the parallels all come
       out of one geometry instead of being posed by hand. The subsolar point
       is simply the direction of the Sun: that is what "subsolar" means, and
       it puts the spot exactly where the arrow arrives.                     */
    function unitProj(M, c, R, v, project) {
      var q = project(M, c, v);
      return { x: (q.x - c.x) / R, y: (q.y - c.y) / R, z: q.z / R };
    }
    function smallGlobe(ctx, x, y, r, sun, axis) {
      var spin = EARTH.spin(globeAngle());
      var m = Math.hypot(axis.x, axis.y);                 // the axis on screen
      var tilt = m < 1e-6 ? 0 : Math.atan2(axis.y, axis.x) + Math.PI / 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.save();
      ctx.rotate(tilt);                                   // north pole up
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip();
      var g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
      g.addColorStop(0, "#d7e2f8"); g.addColorStop(0.6, "#9fb9de"); g.addColorStop(1, "#6a87b2");
      ctx.fillStyle = g;
      ctx.fillRect(-r, -r, 2 * r, 2 * r);
      ctx.beginPath();
      EARTH.landPath(ctx, function (px, py, pz) {
        var q = spin(px, py, pz);
        return { x: q.y * r, y: -q.z * r, z: q.x };
      }, r);
      ctx.fillStyle = "#c3a471";
      ctx.fill("evenodd");
      ctx.restore();
      ctx.strokeStyle = "#8d8d8d"; ctx.lineWidth = 1.2;   // the rotation axis
      ctx.beginPath();
      ctx.moveTo(axis.x * r * 1.3, axis.y * r * 1.3);
      ctx.lineTo(-axis.x * r * 1.3, -axis.y * r * 1.3);
      ctx.stroke();
      /* equator and the observer's own latitude circle, about that axis — the
         SWF gives the little globe a latitudeCircle like the earth view's   */
      var b = equatorBasis(axis);
      parallel(ctx, r, axis, b, 0, "rgba(120,190,120,0.8)", 1);
      parallel(ctx, r, axis, b, lat, "rgba(255,77,77,0.9)", 1.4);
      /* night: the terminator is the great circle square to the Sun, so on
         screen it is an ellipse ofwidth r·|sun.z| along the sun direction */
      var k = sun.z, ang = Math.atan2(sun.y, sun.x);
      ctx.save();
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip();
      ctx.rotate(ang);                                    // the Sun now lies along +x
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI / 2, 3 * Math.PI / 2, false);
      ctx.ellipse(0, 0, r * Math.abs(k), r, 0, -Math.PI / 2, Math.PI / 2, k > 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fill();
      ctx.restore();
      if (showSub && sun.z > -0.02) {                     // on the near face only
        ctx.fillStyle = "#f4ea9a"; ctx.strokeStyle = "#8a7f30"; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(sun.x * r, sun.y * r, Math.max(2.2, r * 0.13), 0, TAU);
        ctx.fill(); ctx.stroke();
      }
      ctx.restore();
    }
    /* two orthonormal vectors spanning the equator, the first one as close to
       the viewer as the axis allows, so the front of a parallel is easy to cut */
    function equatorBasis(a) {
      var m = Math.hypot(a.x, a.y);
      var e1 = m < 1e-6 ? { x: 1, y: 0, z: 0 }
        : { x: -a.z * a.x / m, y: -a.z * a.y / m, z: m };
      var e2 = { x: a.y * e1.z - a.z * e1.y, y: a.z * e1.x - a.x * e1.z,
        z: a.x * e1.y - a.y * e1.x };
      return { e1: e1, e2: e2 };
    }
    function parallel(ctx, r, a, b, la, colour, width) {
      var s = Math.sin(la * RAD), cph = Math.cos(la * RAD);
      ctx.strokeStyle = colour; ctx.lineWidth = width;
      for (var pass = 0; pass < 2; pass++) {               // front solid, back faint
        ctx.globalAlpha = pass ? 0.3 : 1;
        ctx.beginPath();
        var open = false;
        for (var i = 0; i <= 64; i++) {
          var t = i * TAU / 64, ct = Math.cos(t) * cph, st = Math.sin(t) * cph;
          var px = (s * a.x + ct * b.e1.x + st * b.e2.x) * r;
          var py = (s * a.y + ct * b.e1.y + st * b.e2.y) * r;
          var pz = s * a.z + ct * b.e1.z + st * b.e2.z;
          if ((pz >= 0) === !pass) {
            if (!open) { ctx.moveTo(px, py); open = true; } else ctx.lineTo(px, py);
          } else open = false;
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    /* ---- the earth view: the globe seen edge-on, light arriving at the Sun's
       declination, exactly as raysMC._rotation = −declination did ------------ */
    function earthView(ctx, tr) {
      if (vtype === "sun") { earthFromSun(ctx, tr); return; }
      var g = globeGeom(), dec = sunDec();
      var grad = ctx.createRadialGradient(g.cx - g.r * 0.3, g.cy - g.r * 0.35, g.r * 0.1,
        g.cx, g.cy, g.r);
      grad.addColorStop(0, "#dfeaf8"); grad.addColorStop(0.55, "#a8c4e2");
      grad.addColorStop(1, "#6d8cb5");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(g.cx, g.cy, g.r, 0, TAU); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(g.cx, g.cy, g.r, 0, TAU); ctx.clip();
      var th = (globeAngle() - 90) * RAD;                   // setThetaAndPhi(r1 − 90, 0)
      var cth = Math.cos(th), sth = Math.sin(th);
      ctx.beginPath();
      EARTH.landPath(ctx, function (px, py, pz) {
        return { x: g.cx + (-sth * px + cth * py) * g.r, y: g.cy - pz * g.r,
          z: cth * px + sth * py };
      }, g.r, g.cx, g.cy);
      ctx.fillStyle = "#c3a471";
      ctx.fill("evenodd");
      ctx.save();                                          // the terminator
      ctx.translate(g.cx, g.cy); ctx.rotate(-dec * RAD);
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(-g.r * 1.5, -g.r * 1.5, g.r * 1.5, g.r * 3);
      ctx.restore();
      LINES.forEach(function (o) {
        var y = g.cy - g.r * Math.sin(o[0] * RAD), half = g.r * Math.cos(o[0] * RAD);
        ctx.strokeStyle = o[2]; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(g.cx - half, y); ctx.lineTo(g.cx + half, y); ctx.stroke();
      });
      var ly = g.cy - g.r * Math.sin(lat * RAD), lh = g.r * Math.cos(lat * RAD);
      ctx.strokeStyle = "#ff4d4d"; ctx.lineWidth = 2;      // the observer's latitude
      ctx.beginPath(); ctx.moveTo(g.cx - lh, ly); ctx.lineTo(g.cx + lh, ly); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = "#8d8d8d"; ctx.lineWidth = 2;      // the axis
      ctx.beginPath();
      ctx.moveTo(g.cx, g.cy - g.r * 1.18); ctx.lineTo(g.cx, g.cy + g.r * 1.18);
      ctx.stroke();
      /* the figure stands on the surface, so its "up" is the outward normal at
         that latitude: flat with the head outward at the equator, upright at the
         pole. Checked against the SWF at 81.1 N, where it stands straight up. */
      figure(ctx, g.cx + lh, ly, -lat * RAD);
      if (showSub) {
        var sx = g.cx + g.r * Math.cos(dec * RAD), sy = g.cy - g.r * Math.sin(dec * RAD);
        ctx.fillStyle = "#f4ea9a"; ctx.strokeStyle = "#c9bd57"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(sx, sy, 5, 7, 0, 0, TAU); ctx.fill(); ctx.stroke();
      }
      sunRays(ctx, g, dec);
      if (showEarLabels) {
        LINES.forEach(function (o) {
          featureLabel(ctx, o[1], { x: g.cx - g.r * Math.cos(o[0] * RAD),
            y: g.cy - g.r * Math.sin(o[0] * RAD) });
        });
        featureLabel(ctx, "se.npole", { x: g.cx, y: g.cy - g.r });
        featureLabel(ctx, "se.spole", { x: g.cx, y: g.cy + g.r });
      }
      caption(ctx, tr, "se.capLat");
    }
    /* addCircle('lat_0' … 'lat_23S', {alpha:60, color:0x478930}) — one green for
       all five, and the observer's own circle in red on top                   */
    var LINES = [[0, "se.equator", "#478930"], [23.4, "se.cancer", "#478930"],
      [-23.4, "se.capricorn", "#478930"], [66.6, "se.arctic", "#478930"],
      [-66.6, "se.antarctic", "#478930"]];
    /* where each label sits relative to the point it names: dx, dy, alignment */
    var LABEL_AT = { "se.arctic": [-52, -34, "right"], "se.cancer": [-46, -8, "right"],
      "se.equator": [-52, 0, "right"], "se.capricorn": [-46, 10, "right"],
      "se.antarctic": [-58, 28, "right"], "se.npole": [32, -26, "left"],
      "se.spole": [34, 20, "left"] };
    function featureLabel(ctx, key, tip) {
      var o = LABEL_AT[key];
      label(ctx, I18N.t(key), tip, o[0], o[1], o[2]);
    }
    function sunRays(ctx, g, dec) {
      for (var k = -2; k <= 2; k++) {
        var off = k * 42;
        ctx.save();
        ctx.translate(g.cx, g.cy); ctx.rotate(-dec * RAD);
        arrow(ctx, g.r * 2.6, off, g.r * 1.06, off, "#ddd9a8", 6, 17);
        ctx.restore();
      }
    }
    function caption(ctx, tr, capKey) {
      ctx.fillStyle = "#ffffff"; ctx.font = "12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      ctx.fillText(tr("se.lat") + ": " + latString(lat), EAR.x + 10, EAR.y + EAR.h - 8);
      ctx.fillStyle = "#cfcfcf"; ctx.font = "italic 10px " + FONT;
      ctx.textBaseline = "top";
      var words = tr(capKey).split(" "), line = "", ln = 0;
      words.forEach(function (w) {
        var t = line ? line + " " + w : w;
        if (ctx.measureText(t).width > EAR.w - 20 && line) {
          ctx.fillText(line, EAR.x + 8, EAR.y + 6 + ln * 13); ln++; line = w;
        } else line = t;
      });
      if (line) ctx.fillText(line, EAR.x + 8, EAR.y + 6 + ln * 13);
    }
    /* "view from sun": look straight down the sunbeam, so the subsolar point is
       at the centre of a fully lit disc and the parallels curve away from it   */
    function earthFromSun(ctx, tr) {
      var g = globeGeom(), dec = sunDec() * RAD;
      var sd = Math.sin(dec), cd = Math.cos(dec);
      function pt(la, lo) {                                // lat/lon → screen + depth
        var cp = Math.cos(la * RAD), sp = Math.sin(la * RAD);
        var x = cp * Math.cos(lo * RAD), y = cp * Math.sin(lo * RAD), z = sp;
        return { x: g.cx + g.r * y,
          y: g.cy - g.r * (-sd * x + cd * z),
          d: cd * x + sd * z };
      }
      var grad = ctx.createRadialGradient(g.cx, g.cy, g.r * 0.05, g.cx, g.cy, g.r);
      grad.addColorStop(0, "#eef4fd"); grad.addColorStop(0.6, "#b7cde6");
      grad.addColorStop(1, "#7f9cc2");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(g.cx, g.cy, g.r, 0, TAU); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(g.cx, g.cy, g.r, 0, TAU); ctx.clip();
      var spin = EARTH.spin(globeAngle());
      ctx.beginPath();
      EARTH.landPath(ctx, function (px, py, pz) {
        var q = spin(px, py, pz);
        return { x: g.cx + g.r * q.y, y: g.cy - g.r * (-sd * q.x + cd * q.z),
          z: cd * q.x + sd * q.z };
      }, g.r, g.cx, g.cy);
      ctx.fillStyle = "#c3a471";
      ctx.fill("evenodd");
      LINES.concat([[lat, null, "#ff4d4d"]]).forEach(function (o) {
        ctx.strokeStyle = o[2]; ctx.lineWidth = o[1] === null ? 2 : 1;
        ctx.beginPath();
        var open = false;
        for (var i = 0; i <= 180; i++) {
          var q = pt(o[0], i * 2 - 180);
          if (q.d < 0) { open = false; continue; }
          if (!open) { ctx.moveTo(q.x, q.y); open = true; } else ctx.lineTo(q.x, q.y);
        }
        ctx.stroke();
      });
      ctx.restore();
      if (showSub) {
        ctx.fillStyle = "#f4ea9a"; ctx.strokeStyle = "#c9bd57"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(g.cx, g.cy, 7, 0, TAU); ctx.fill(); ctx.stroke();
      }
      if (showEarLabels) {
        LINES.forEach(function (o) {                      // the left end of each arc
          var best = null;
          for (var i = 0; i <= 180; i++) {
            var q = pt(o[0], i * 2 - 180);
            if (q.d >= 0 && (!best || q.x < best.x)) best = q;
          }
          if (best) featureLabel(ctx, o[1], best);
        });
        featureLabel(ctx, "se.npole", pt(90, 0));
        featureLabel(ctx, "se.spole", pt(-90, 0));
      }
      caption(ctx, tr, "se.capLat2");
    }
    /* The stickfigure stands on the globe at (x, y) with "up" pointing away
       from the centre, so its feet sit on the surface rather than straddling
       it. White, because the panel behind it is black.                       */
    function figure(ctx, x, y, upAngle) {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(upAngle + Math.PI / 2);
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
      ctx.beginPath();
      /* y = 0 is the SOLES, not the hips: the legs run down to it, so the whole
         figure sits above the surface instead of sinking into it             */
      ctx.moveTo(0, -4.5); ctx.lineTo(0, -13.5);            // body
      ctx.moveTo(-4.5, -10.5); ctx.lineTo(4.5, -10.5);      // arms
      ctx.moveTo(0, -4.5); ctx.lineTo(-3.5, 0);             // legs
      ctx.moveTo(0, -4.5); ctx.lineTo(3.5, 0);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -16.1, 2.6, 0, TAU);
      ctx.fillStyle = "#ffffff"; ctx.fill();
      ctx.restore();
    }

    /* ---- the ground view ---------------------------------------------------
       Two different pictures, as in the SWF. "sunlight angle" is the Side View
       Sunbeam Component: rays at the Sun's altitude over a horizon, spaced
       beamSpacing/sin(alt), dimmed by a pall of 40·((10−alt)/10)³. "sunbeam
       spread" is the Sunbeam Component: a white grid of beamDiameter squares
       with one circular beam at the centre, stretched to yscale/sin(alt) so a
       low Sun smears the same beam over far more ground.                     */
    function groundView(ctx, tr) {
      var n = noonAlt(), alt = n.alt, f = Math.max(0, Math.sin(alt * RAD));
      var pall = alt > 0 ? Math.max(0, 0.40 * Math.pow((10 - alt) / 10, 3)) : 0.40;
      ctx.save(); clipTo(ctx, GRD);
      if (feature === "angle") sunlightAngle(ctx, alt, f, pall, n.dir === "se.S");
      else sunbeamSpread(ctx, f, pall, tr);
      ctx.restore();
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(GRD.x + 0.5, GRD.y + 0.5, GRD.w - 1, GRD.h - 1);
      readoutBox(ctx, tr, alt);
    }
    function sunlightAngle(ctx, alt, f, pall, fromSouth) {
      var H = GRD.h - 50 * GRD.h / 220;                   // horizonHeight 50 of 220
      var gy = GRD.y + H;
      ctx.fillStyle = "#6f9fd8"; ctx.fillRect(GRD.x, GRD.y, GRD.w, H);
      ctx.fillStyle = "#3f8f3f"; ctx.fillRect(GRD.x, gy, GRD.w, GRD.h - H);
      if (f > 0) {
        ctx.save();
        ctx.beginPath(); ctx.rect(GRD.x, GRD.y, GRD.w, H); ctx.clip();
        ctx.globalAlpha = Math.pow(f, 0.5);
        var dir = fromSouth ? -1 : 1;
        var ar = alt * RAD, dx = 30 / Math.max(0.02, Math.sin(ar));
        var x0 = fromSouth ? GRD.x + GRD.w + 42 : GRD.x - 42;
        var len = Math.hypot(GRD.w, GRD.h) + 85;
        for (var k = 0; k < 40; k++) {
          var sx = x0 + dir * k * dx;
          if (dir > 0 ? sx > GRD.x + GRD.w + 42 : sx < GRD.x - 42) break;
          /* each beam is an arrow arriving at the horizon, as the SWF's Ray
             Component draws it — the arrowhead is what shows the light going
             into the ground rather than a bare stripe                        */
          arrow(ctx, sx - dir * Math.cos(ar) * len, gy - Math.sin(ar) * len,
            sx, gy, "#ede9c0", 6, 16);
        }
        ctx.restore();
      }
      ctx.fillStyle = "rgba(0,0,0," + pall + ")";
      ctx.fillRect(GRD.x, GRD.y, GRD.w, GRD.h);
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText("\u2190 " + I18N.t("se.N"), GRD.x + 10, GRD.y + GRD.h - 16);
      ctx.textAlign = "right";
      ctx.fillText(I18N.t("se.S") + " \u2192", GRD.x + GRD.w - 10, GRD.y + GRD.h - 16);
    }
    function sunbeamSpread(ctx, f, pall, tr) {
      var cx = GRD.x + GRD.w / 2, cy = GRD.y + GRD.h / 2;
      var s = 40 * GRD.h / 220;                           // beamDiameter, to scale
      ctx.fillStyle = "#ffffff"; ctx.fillRect(GRD.x, GRD.y, GRD.w, GRD.h);
      ctx.strokeStyle = "#c5dffe"; ctx.lineWidth = 1;     // gridColor 0xC5DFFE
      ctx.beginPath();
      for (var i = 0; i < Math.ceil(GRD.w / 2 / s); i++) {
        var d = s * (i + 0.5);
        ctx.moveTo(cx - d, GRD.y); ctx.lineTo(cx - d, GRD.y + GRD.h);
        ctx.moveTo(cx + d, GRD.y); ctx.lineTo(cx + d, GRD.y + GRD.h);
      }
      for (var j = 0; j < Math.ceil(GRD.h / 2 / s); j++) {
        var e = s * (j + 0.5);
        ctx.moveTo(GRD.x, cy - e); ctx.lineTo(GRD.x + GRD.w, cy - e);
        ctx.moveTo(GRD.x, cy + e); ctx.lineTo(GRD.x + GRD.w, cy + e);
      }
      ctx.stroke();
      if (f > 0) {                                        // beamMC: alpha √f, yscale 1/f
        ctx.save();
        ctx.globalAlpha = Math.pow(f, 0.5);
        ctx.fillStyle = "#f2e06a";
        ctx.beginPath();
        ctx.ellipse(cx, cy, s / 2, s / 2 / Math.max(0.05, f), 0, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = "rgba(0,0,0," + pall + ")";
      ctx.fillRect(GRD.x, GRD.y, GRD.w, GRD.h);
      ctx.strokeStyle = "#222222"; ctx.fillStyle = "#222222";   // the N/S direction labels
      ctx.lineWidth = 2; ctx.font = "bold 13px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      var lx = GRD.x + 20;
      arrow(ctx, lx, GRD.y + 34, lx, GRD.y + 12, "#222222", 2, 7);
      ctx.fillStyle = "#222222";
      ctx.fillText(tr("se.N"), lx, GRD.y + 46);
      arrow(ctx, lx, GRD.y + GRD.h - 34, lx, GRD.y + GRD.h - 12, "#222222", 2, 7);
      ctx.fillStyle = "#222222";
      ctx.fillText(tr("se.S"), lx, GRD.y + GRD.h - 46);
    }
    function readoutBox(ctx, tr, alt) {
      var lines = [tr("se.rAlt2") + ": " + alt.toFixed(1),
        tr("se.lat") + ": " + latString(lat)];
      ctx.font = "11px " + FONT;
      var w = Math.max(ctx.measureText(lines[0]).width, ctx.measureText(lines[1]).width) + 16;
      var x = GRD.x + GRD.w - w - 8, y = GRD.y + 8;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(x, y, w, 36);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, 35);
      ctx.fillStyle = "#222222"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(lines[0], x + 8, y + 11);
      ctx.fillText(lines[1], x + 8, y + 26);
    }

    /* ---- the month strip, with the SWF's draggable red marker -------------- */
    function timeline(ctx, tr) {
      ctx.fillStyle = "#ffffff"; ctx.fillRect(TL.x, TL.y, TL.w, TL.h);
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 1;
      ctx.strokeRect(TL.x + 0.5, TL.y + 0.5, TL.w - 1, TL.h - 1);
      var x0 = TL.x + 26, w = TL.w - 52, y = TL.y + 44;
      ctx.strokeStyle = "#333333";
      ctx.beginPath(); ctx.moveTo(x0, y + 0.5); ctx.lineTo(x0 + w, y + 0.5); ctx.stroke();
      var acc = 0;
      ctx.font = "11px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var i = 0; i < 12; i++) {
        var a = acc / 365 * w, b = (acc + MONTH_DAYS[i]) / 365 * w;
        ctx.strokeStyle = "#333333";
        ctx.beginPath(); ctx.moveTo(x0 + a + 0.5, y); ctx.lineTo(x0 + a + 0.5, y + 6); ctx.stroke();
        ctx.fillStyle = "#333333";
        ctx.fillText(tr("m" + (i + 1)), x0 + (a + b) / 2, y + 8);
        acc += MONTH_DAYS[i];
      }
      var mx = x0 + day / 364 * w;
      ctx.fillStyle = "#d11818";
      ctx.beginPath();
      ctx.moveTo(mx - 7, TL.y + 14); ctx.lineTo(mx + 7, TL.y + 14); ctx.lineTo(mx, TL.y + 32);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#d11818"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(mx, TL.y + 30); ctx.lineTo(mx, y); ctx.stroke();
      ctx.fillStyle = "#222222"; ctx.font = "bold 12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(dateString(shownDay()), TL.x + 10, TL.y + 8);
    }

    upd();
  }
});
