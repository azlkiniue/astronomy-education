/* Ecliptic (Zodiac) Simulator ---------------------------------------------------
   Faithful rebuild of the ClassAction "zodiac.swf" (its root calls
   zodiac.setDayOfYear and zodiac.setRotationAngle, decompiled).

   Earth sits inside a band of sky carrying the twelve zodiac constellations. The
   far wall is seen from inside and reads normally; the near wall is seen from
   behind, so its figures come out mirrored and washed out — exactly the look of
   the original. The Sun rides the ecliptic at the longitude for the date, which
   is why the constellation it sits in is the one you cannot see that month.   */
Sim.create({
  id: "zodiac",
  width: 800, height: 650,
  strings: {
    en: {
      "zd.ctl": "Date and view", "zd.day": "day of year", "zd.rot": "rotate the band",
      "zd.anim": "start animation", "zd.stop": "stop animation", "zd.rate": "animation rate",
      "zd.opt": "Options", "zd.names": "show constellation names",
      "zd.lines": "show star patterns", "zd.ecl": "show the ecliptic",
      "zd.rDate": "date", "zd.rLon": "sun's ecliptic longitude",
      "zd.rIn": "sun is in", "zd.rOpp": "highest at midnight",
      "zd.hint": "Drag the red marker along the months, or drag inside the band to spin it. The constellation behind the Sun is the one you cannot see.",
      "m1": "Jan", "m2": "Feb", "m3": "Mar", "m4": "Apr", "m5": "May", "m6": "Jun",
      "m7": "Jul", "m8": "Aug", "m9": "Sep", "m10": "Oct", "m11": "Nov", "m12": "Dec"
    },
    id: {
      "zd.ctl": "Tanggal dan tampilan", "zd.day": "hari ke-", "zd.rot": "putar pitanya",
      "zd.anim": "mulai animasi", "zd.stop": "hentikan animasi", "zd.rate": "laju animasi",
      "zd.opt": "Pilihan", "zd.names": "tampilkan nama rasi",
      "zd.lines": "tampilkan pola bintang", "zd.ecl": "tampilkan ekliptika",
      "zd.rDate": "tanggal", "zd.rLon": "bujur ekliptika matahari",
      "zd.rIn": "matahari berada di", "zd.rOpp": "tertinggi saat tengah malam",
      "zd.hint": "Seret penanda merah sepanjang bulan, atau seret di dalam pita untuk memutarnya. Rasi di balik Matahari adalah yang tak dapat Anda lihat.",
      "m1": "Jan", "m2": "Feb", "m3": "Mar", "m4": "Apr", "m5": "Mei", "m6": "Jun",
      "m7": "Jul", "m8": "Agu", "m9": "Sep", "m10": "Okt", "m11": "Nov", "m12": "Des"
    }
  },
  about: {
    en: "<p>The zodiac is simply the band of sky the Sun appears to travel through over a year. That apparent journey is Earth's own orbital motion reflected back at us: as Earth moves, the Sun is projected against a different part of the background sky each month.</p>" +
        "<p>Your birth sign is the constellation the Sun was in when you were born — which means it is precisely the constellation you could not see, because it was up in the daytime. The constellation you actually see high at midnight is the opposite one, six months away round the band.</p>" +
        "<p>Two more wrinkles. The signs were fixed about two thousand years ago, and precession has since slid the Sun roughly one whole constellation earlier, so the dates on a horoscope no longer match the sky. And the Sun really passes through thirteen constellations, not twelve — it spends about two and a half weeks in Ophiuchus, which never made the list.</p>",
    id: "<p>Zodiak hanyalah pita langit yang tampak dilalui Matahari sepanjang tahun. Perjalanan semu itu sesungguhnya gerak orbit Bumi sendiri yang terpantul kembali kepada kita: seiring Bumi bergerak, Matahari terproyeksikan pada bagian langit latar yang berbeda setiap bulan.</p>" +
        "<p>Zodiak kelahiran Anda adalah rasi tempat Matahari berada saat Anda lahir — yang berarti justru rasi yang tidak dapat Anda lihat, karena ia berada di langit pada siang hari. Rasi yang sungguh-sungguh tampak tinggi pada tengah malam adalah rasi yang berseberangan, enam bulan jauhnya mengelilingi pita itu.</p>" +
        "<p>Ada dua hal lagi. Tanda-tanda zodiak ditetapkan sekitar dua ribu tahun lalu, dan presesi sejak itu menggeser Matahari kira-kira satu rasi penuh lebih awal, sehingga tanggal pada horoskop tak lagi cocok dengan langit. Lagipula Matahari sesungguhnya melewati tiga belas rasi, bukan dua belas — ia menghabiskan sekitar dua setengah pekan di Ophiuchus, yang tak pernah masuk daftar.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var EPS = 23.4392911 * RAD;
    /* measured off the SWF's own canvas: the band spans x 130…669, its far wall
       runs y 57…268 at the centre and its near wall 330…542, which fixes
       R = 269.5, R·sin(elev) = 134 and HZ·cos(elev) = 105.5                    */
    var CX = 399.5, CY = 302, R = 269.5, HZ = 121.6, ELEV = 29.8 * RAD;
    var BETA_MAX = 24;                                    // zodiacBandHalfAngle
    var TL = { x: 10, y: 566, w: 780, h: 74 };
    var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var day = 0, rot = 0, rate = 10, drag = null;
    var showNames = true, showLines = true, showEcl = true;

    /* The twelve zodiac figures, lifted straight out of the SWF's own
       constellationsData: 166 stars as J2000 right ascension and declination,
       and its path segments, each {m, b, e} meaning stars[m] → stars[b] →
       … → stars[e-1]. `centre` is the label position the SWF gives each
       figure, which also decides which constellation the Sun is in.      */
    var Z = [
      { key: "Aries", centre: [2.5, 16.3],
        stars: [
        [2.833, 27.26], [2.799, 29.25], [2.724, 27.71], [2.119, 23.47], [1.966, 23.6],
        [1.911, 20.81], [1.892, 19.29], [2.213, 21.21], [2.987, 21.34], [3.194, 19.72]],
        lines: [[2, 0, 1, 2, 3, 4, 5], [5, 3], [3, 7], [6, 7, 8, 9], [8, 0]] },
      { key: "Taurus", centre: [4.1, 22.8],
        stars: [
        [5.438, 28.61], [4.704, 22.95], [4.477, 19.18], [4.425, 17.93], [4.382, 17.54],
        [4.33, 15.63], [4.011, 12.49], [3.453, 9.735], [3.414, 9.027], [4.478, 15.87],
        [4.599, 16.51], [5.628, 21.14]],
        lines: [[0, 1, 2, 3, 4, 5, 6, 7, 8], [5, 9, 10, 11]] },
      { key: "Gemini", centre: [6.7, 33.3],
        stars: [
        [6.069, 23.27], [6.248, 22.51], [6.383, 22.51], [6.732, 25.13], [7.186, 30.25],
        [7.429, 27.8], [7.599, 26.9], [7.335, 21.98], [7.069, 20.57], [6.629, 16.4],
        [7.302, 16.54], [6.755, 12.9], [6.483, 20.21], [6.88, 33.96], [7.485, 31.78],
        [7.577, 31.89], [7.755, 28.03], [7.741, 24.4]],
        lines: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [7, 10, 11], [3, 12], [4, 13], [4, 14, 15], [6, 16], [6, 17]] },
      { key: "Cancer", centre: [8.8, 8.6],
        stars: [
        [8.204, 17.65], [8.275, 9.184], [8.745, 18.16], [8.721, 21.47], [8.778, 28.76],
        [8.975, 11.86]],
        lines: [[3, 0, 1, 2, 3, 4], [2, 5]] },
      { key: "Leo", centre: [10.6, 7.6],
        stars: [
        [9.764, 23.77], [9.529, 22.97], [9.411, 26.18], [9.879, 26.01], [10.28, 23.42],
        [10.33, 19.34], [11.04, 20.18], [11.24, 20.52], [11.82, 14.57], [11.24, 15.43],
        [11.4, 10.53], [11.35, 6.027], [10.55, 9.306], [10.12, 16.76], [10.14, 11.96],
        [9.686, 9.892]],
        lines: [[3, 0, 1, 2, 3, 4, 5, 6, 7, 8], [7, 9, 10, 11], [9, 12], [9, 13, 14], [13, 0], [13, 5], [13, 15]] },
      { key: "Virgo", centre: [13.2, -14.7],
        stars: [
        [12.09, 8.731], [11.76, 6.529], [11.85, 1.765], [12.33, -0.6646], [12.69, -1.45],
        [13.17, -5.538], [13.42, -11.16], [14.21, -10.28], [14.27, -5.998], [14.03, 1.541],
        [13.58, -0.5959], [12.93, 3.4], [13.04, 10.96], [14.77, 1.891], [14.72, -5.659]],
        lines: [[4, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [8, 14], [9, 13], [10, 6], [11, 4]] },
      { key: "Libra", centre: [14.9, -29.6],
        stars: [
        [15.64, -29.78], [15.62, -28.14], [15.59, -14.79], [15.28, -9.381], [14.85, -16.04],
        [15.07, -25.28]],
        lines: [[0, 1, 2, 3, 4, 5], [2, 4]] },
      { key: "Scorpius", centre: [16.9, -22.0],
        stars: [
        [17.83, -37.05], [17.56, -37.11], [17.51, -37.29], [17.62, -38.35], [17.71, -39.03],
        [17.79, -40.13], [17.62, -43], [17.2, -43.24], [16.91, -42.36], [16.86, -38.05],
        [16.84, -34.29], [16.6, -28.22], [16.49, -26.43], [16.35, -25.59], [16.21, -27.92],
        [15.95, -29.22], [15.98, -26.12], [16.2, -19.46], [16.09, -19.8], [16.01, -22.62]],
        lines: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], [13, 17, 18, 19]] },
      { key: "Sagittarius", centre: [18.5, -16.1],
        stars: [
        [18.4, -34.39], [18.29, -36.76], [18.1, -30.42], [18.23, -21.06], [18.47, -25.42],
        [18.35, -29.83], [18.76, -26.99], [18.92, -26.3], [19.16, -21.03], [19.36, -17.85],
        [19.36, -15.96], [18.96, -21.11], [19.12, -27.67], [19.04, -29.88], [19.4, -40.62],
        [20, -35.27], [19.92, -41.87], [19.38, -44.46], [19.39, -44.8]],
        lines: [[5, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [2, 5], [11, 8], [11, 7], [15, 12, 13, 14, 15, 16], [14, 17, 18], [7, 12], [6, 13]] },
      { key: "Capricornus", centre: [21.3, -28.6],
        stars: [
        [21.48, -21.81], [21.44, -22.41], [21.1, -17.24], [21.37, -16.83], [21.67, -16.66],
        [21.78, -16.13], [21.07, -19.85], [20.48, -17.81], [20.35, -14.78], [20.3, -12.54],
        [21.12, -25.01], [20.77, -25.27], [20.86, -26.92]],
        lines: [[3, 0, 1, 2, 3, 4, 5], [2, 6, 7, 8, 9], [2, 8], [6, 10], [7, 11, 12]] },
      { key: "Aquarius", centre: [22.2, 3.2],
        stars: [
        [23.24, -6.05], [23.32, -9.613], [23.71, -14.54], [23.77, -18.68], [23.43, -20.64],
        [23.16, -21.17], [22.91, -15.82], [22.83, -13.59], [22.88, -7.579], [22.48, -0.01719],
        [22.36, -1.387], [22.06, -2.155], [21.53, -5.572], [20.8, -9.497], [22.42, 1.375]],
        lines: [[8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], [9, 14]] },
      { key: "Pisces", centre: [0.7, -0.6],
        stars: [
        [1.194, 30.09], [1.324, 27.26], [1.229, 24.58], [1.525, 15.34], [1.757, 9.16],
        [2.034, 2.763], [1.691, 5.486], [1.049, 7.892], [0.8111, 7.585], [23.99, 6.863],
        [23.67, 5.624], [23.47, 6.379], [23.29, 3.285], [23.45, 1.255], [23.7, 1.782],
        [23.06, 3.819]],
        lines: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], [14, 10], [12, 15]] }
    ];
    var NAMES_ID = { Aries: "Aries", Taurus: "Taurus", Gemini: "Gemini", Cancer: "Cancer",
      Leo: "Leo", Virgo: "Virgo", Libra: "Libra", Scorpius: "Scorpius",
      Sagittarius: "Sagittarius", Capricornus: "Capricornus", Aquarius: "Aquarius",
      Pisces: "Pisces" };

    S.group("zd.ctl");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "zd.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    /* `day` runs fractionally and only the slider sees it rounded. Rounding
       first froze the animation: at 10 d/s a 60 fps frame advances 0.17 of a
       day, and Math.round put it straight back on the same integer.          */
    var fromLoop = false;
    var dayCtl = S.slider({ labelKey: "zd.day", min: 0, max: 364, value: 0, step: 1,
      format: dateString, on: function (v) { if (!fromLoop) day = v; upd(); } });
    var rotCtl = S.slider({ labelKey: "zd.rot", min: 0, max: 360, value: 0, step: 1,
      format: function (v) { return v + "°"; }, on: function (v) { rot = v; S.requestDraw(); } });
    var loop = S.loop(function (dt) {
      day = mod(day + dt * rate, 365);
      var shown = Math.round(day) % 365;
      if (shown === dayCtl.value()) { upd(); return; }
      fromLoop = true; dayCtl.set(shown); fromLoop = false;
    });
    var animBtn = S.button({ label: "", primary: true,
      on: function () { loop.toggle(); syncBtn(); } });
    S.slider({ labelKey: "zd.rate", min: 2, max: 60, value: rate, step: 1,
      format: function (v) { return v + " d/s"; }, on: function (v) { rate = v; } });

    S.group("zd.opt");
    S.toggle({ labelKey: "zd.names", value: true,
      on: function (b) { showNames = b; S.requestDraw(); } });
    S.toggle({ labelKey: "zd.lines", value: true,
      on: function (b) { showLines = b; S.requestDraw(); } });
    S.toggle({ labelKey: "zd.ecl", value: true,
      on: function (b) { showEcl = b; S.requestDraw(); } });
    var outDate = S.readout({ labelKey: "zd.rDate" });
    var outLon = S.readout({ labelKey: "zd.rLon" });
    var outIn = S.readout({ labelKey: "zd.rIn" });
    var outOpp = S.readout({ labelKey: "zd.rOpp" });

    function syncBtn() { animBtn.textContent = I18N.t(loop.playing ? "zd.stop" : "zd.anim"); }
    function dateString(d) {
      var n = Math.floor(((d % 365) + 365) % 365) + 1;
      for (var i = 0; i < 12; i++) {
        if (n <= MONTH_DAYS[i]) return n + " " + I18N.t("m" + (i + 1));
        n -= MONTH_DAYS[i];
      }
      return "31 " + I18N.t("m12");
    }
    /* equatorial → ecliptic */
    function toEcliptic(raH, decDeg) {
      var a = raH * 15 * RAD, d = decDeg * RAD;
      var sb = Math.sin(d) * Math.cos(EPS) - Math.cos(d) * Math.sin(EPS) * Math.sin(a);
      var y = Math.sin(d) * Math.sin(EPS) + Math.cos(d) * Math.cos(EPS) * Math.sin(a);
      var x = Math.cos(d) * Math.cos(a);
      return { lon: ((Math.atan2(y, x) * DEG) % 360 + 360) % 360,
        lat: Math.asin(Math.max(-1, Math.min(1, sb))) * DEG };
    }
    function sunLon() { return (((day - 79) * 360 / 365.2422) % 360 + 360) % 360; }
    function centreLon(c) {                                // the SWF's label position
      if (c._lon === undefined) c._lon = toEcliptic(c.centre[0], c.centre[1]).lon;
      return c._lon;
    }
    function constellationAt(lon) {
      var best = null, bd = 1e9;
      Z.forEach(function (c) {
        var d = Math.abs(((lon - centreLon(c) + 540) % 360) - 180);
        if (d < bd) { bd = d; best = c; }
      });
      return best;
    }
    function upd() {
      var L = sunLon();
      outDate(dateString(day));
      outLon(L.toFixed(1) + "°");
      outIn(name(constellationAt(L)));
      outOpp(name(constellationAt((L + 180) % 360)));
      S.requestDraw();
    }
    S.refreshers.push(function () { syncBtn(); upd(); });
    function name(c) { return I18N.getLang() === "id" ? NAMES_ID[c.key] : c.key; }

    /* ---------------------------- the band's geometry ----------------------- */
    function place(lon, lat) {                             // → screen + which wall
      var th = (lon + rot) * RAD;
      var z = Math.max(-1, Math.min(1, lat / BETA_MAX)) * HZ;
      var sy = R * Math.sin(th);
      return { x: bandX(lon), y: CY + sy * Math.sin(ELEV) - z * Math.cos(ELEV), near: sy > 0 };
    }
    function rimY(lon, top) {
      var th = (lon + rot) * RAD;
      return CY + R * Math.sin(th) * Math.sin(ELEV) + (top ? -HZ : HZ) * Math.cos(ELEV);
    }

    /* ------------------------------- interaction ---------------------------- */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (p.y >= TL.y) { drag = { day: true }; setDay(p.x); }
      else drag = { x: p.x, rot: rot };
      S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      if (drag.day) { setDay(p.x); return; }
      rotCtl.set(mod(drag.rot + (p.x - drag.x) * 0.4, 360));   // x runs the other way now
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; });
    });
    function setDay(x) {
      dayCtl.set(Math.max(0, Math.min(364, Math.round((x - TL.x - 24) / (TL.w - 48) * 364))));
    }

    /* ================================= drawing ============================== */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);
      wall(ctx, false, "#59667a", "#222222");                  // the far wall, seen inside
      constellations(ctx, false);
      if (showEcl) ecliptic(ctx, false);
      earth(ctx);
      sun(ctx, false);
      wall(ctx, true, "#65748c", "#2b2b2b");                   // the near wall, from outside
      constellations(ctx, true);
      if (showEcl) ecliptic(ctx, true);
      sun(ctx, true);
      timeline(ctx, tr);
    });
    /* Half the band at a time. The visible half is the 180° of longitude where
       sin(lon + rot) has the right sign, which wraps past 0° for most rotations
       — walking lon from 0 to 360 and skipping the wrong side therefore left
       two disconnected runs, and the path closed straight across the band and
       filled it. Sweep the arc from where it actually starts instead.       */
    function wall(ctx, near, lit, dark) {
      var lon0 = mod(near ? -rot : 180 - rot, 360);
      ctx.fillStyle = wallShade(ctx, lon0, lit, dark);
      ctx.beginPath();
      var i, lon;
      for (i = 0; i <= 90; i++) {                          // the top rim of this half
        lon = lon0 + i * 2;
        if (i) ctx.lineTo(bandX(lon), rimY(lon, true));
        else ctx.moveTo(bandX(lon), rimY(lon, true));
      }
      for (i = 90; i >= 0; i--) {                          // and back along the bottom
        lon = lon0 + i * 2;
        ctx.lineTo(bandX(lon), rimY(lon, false));
      }
      ctx.closePath(); ctx.fill();
    }
    function mod(v, n) { return ((v % n) + n) % n; }
    /* Ecliptic longitude has to increase left→right along the near wall, the
       way it does in the SWF (Libra→Scorpius→Sagittarius→Capricornus→Aquarius).
       With +cos it ran the other way and the whole band read mirrored; negating
       it reverses the sweep while leaving sin(th), and so the near/far test,
       untouched.                                                             */
    function bandX(lon) { return CX - R * Math.cos((lon + rot) * RAD); }
    function sep(a, b) { return Math.abs(mod(a - b + 180, 360) - 180); }

    /* updateZodiacBand(): half the band, the half away from the Sun, is dark.
       The SWF lays a four-stop linear gradient across each surface with the
       change centred on the longitude 90° from the Sun ("globe.az − 90") and
       15° of blend either side. On one surface x runs the other way round the
       ring, which is the r = 0 / r = π pair of gradient matrices it uses; here
       that falls out of taking each wall's own arc from lon0 to lon0 + 180.  */
    var SHADE_HALF = 15;
    function wallShade(ctx, lon0, lit, dark) {
      var sl = sunLon();
      // of the two terminators, 90° either side of the Sun, take the one that
      // falls inside this wall's own 180° of longitude
      var b = mod(sl - 90 - lon0, 360) <= 180 ? sl - 90 : sl + 90;
      var xa = bandX(lon0), xb = bandX(lon0 + 180);
      var g = ctx.createLinearGradient(xa, 0, xb, 0);
      var f = function (lon) {
        var t = (bandX(lon) - xa) / (xb - xa);
        return Math.max(0, Math.min(1, t));
      };
      var f1 = f(b - SHADE_HALF), f2 = f(b + SHADE_HALF);
      var lo = Math.min(f1, f2), hi = Math.max(f1, f2);
      var startLit = sep(lon0, sl) < 90;
      g.addColorStop(0, startLit ? lit : dark);
      if (lo > 0) g.addColorStop(lo, startLit ? lit : dark);
      if (hi < 1) g.addColorStop(hi, startLit ? dark : lit);
      g.addColorStop(1, startLit ? dark : lit);
      return g;
    }
    function constellations(ctx, near) {
      Z.forEach(function (c) {
        if (!c._e) c._e = c.stars.map(function (s) { return toEcliptic(s[0], s[1]); });
        var pts = c._e.map(function (e) { return place(e.lon, e.lat); });
        var visible = pts.filter(function (p) { return p.near === near; });
        if (!visible.length) return;
        /* one path for the whole figure, one for its stars — with 166 stars a
           stroke() per segment was hundreds of canvas calls a frame          */
        if (showLines) {
          ctx.strokeStyle = near ? "rgba(255,255,255,0.78)" : "rgba(235,240,255,0.70)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          c.lines.forEach(function (path) {
            for (var i = 0; i + 1 < path.length; i++) {
              var a = pts[path[i]], b = pts[path[i + 1]];
              if (a.near !== near || b.near !== near) continue;
              ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            }
          });
          ctx.stroke();
        }
        ctx.fillStyle = near ? "rgba(255,255,255,0.85)" : "#ffffff";
        ctx.beginPath();
        pts.forEach(function (p) {
          if (p.near !== near) return;
          ctx.moveTo(p.x + 1.6, p.y);
          ctx.arc(p.x, p.y, 1.6, 0, TAU);
        });
        ctx.fill();
        if (showNames) {
          var mid = place(centreLon(c), 0);
          if (mid.near !== near) return;
          ctx.save();
          ctx.translate(mid.x, mid.y - HZ * 0.55 * Math.cos(ELEV));
          if (near) ctx.scale(-1, 1);                      // seen from behind
          ctx.fillStyle = near ? "rgba(236,240,250,0.92)" : "rgba(255,255,255,0.92)";
          ctx.font = "bold 12px " + FONT;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(name(c), 0, 0);
          ctx.restore();
        }
      });
    }
    function ecliptic(ctx, near) {
      ctx.strokeStyle = near ? "rgba(255,255,255,0.35)" : "rgba(255,227,117,0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      var open = false;
      for (var i = 0; i <= 360; i++) {
        var p = place(i, 0);
        if (p.near !== near) { open = false; continue; }
        if (!open) { ctx.moveTo(p.x, p.y); open = true; } else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
    /* ---- the Earth at the centre of the band -------------------------------
       An ecliptic-frame direction (a, b, c) reaches the screen the same way a
       point on the band does: turn it by `rot` about the ecliptic pole, then
       tilt by ELEV. z comes out as depth toward the viewer, so it also settles
       what is lit and what is in shadow.                                    */
    function dirToScreen(a, b, c) {
      var cr = Math.cos(rot * RAD), sr = Math.sin(rot * RAD);
      var P = a * cr - b * sr, Q = a * sr + b * cr;
      return { x: -P, y: Q * Math.sin(ELEV) - c * Math.cos(ELEV),
        z: Q * Math.cos(ELEV) + c * Math.sin(ELEV) };
    }
    /* the north celestial pole: ecliptic latitude 90 − obliquity, longitude 270 */
    function poleDir() {
      var b = Math.PI / 2 - EPS;
      return dirToScreen(Math.cos(b) * Math.cos(270 * RAD),
        Math.cos(b) * Math.sin(270 * RAD), Math.sin(b));
    }
    function sunDir() {
      var L = sunLon() * RAD;
      return dirToScreen(Math.cos(L), Math.sin(L), 0);
    }
    function earth(ctx) {
      var r = 16, ax = poleDir(), su = sunDir();
      /* an orthonormal frame for the globe: e3 along the axis, e1 the point of
         the equator nearest the viewer, so the near side is easy to cut       */
      var m = Math.hypot(ax.x, ax.y);
      var e1 = m < 1e-6 ? { x: 1, y: 0, z: 0 }
        : { x: -ax.z * ax.x / m, y: -ax.z * ax.y / m, z: m };
      var e2 = { x: ax.y * e1.z - ax.z * e1.y, y: ax.z * e1.x - ax.x * e1.z,
        z: ax.x * e1.y - ax.y * e1.x };
      /* The sim has no time-of-day, so the Earth's rotation phase is fixed;
         30° turns the most coastline toward the viewer (64% of shore vertices
         on the near face) rather than the empty Pacific.               */
      var spin = EARTH.spin(30);
      ctx.save();
      ctx.translate(CX, CY);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.clip();
      var g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
      g.addColorStop(0, "#e8f0fb"); g.addColorStop(0.6, "#a8c2e2"); g.addColorStop(1, "#6d8cb5");
      ctx.fillStyle = g;
      ctx.fillRect(-r, -r, 2 * r, 2 * r);
      ctx.beginPath();                                    // the real coastlines
      EARTH.landPath(ctx, function (px, py, pz) {
        var q = spin(px, py, pz);
        return { x: (q.x * e1.x + q.y * e2.x + q.z * ax.x) * r,
          y: (q.x * e1.y + q.y * e2.y + q.z * ax.y) * r,
          z: q.x * e1.z + q.y * e2.z + q.z * ax.z };
      }, r);
      ctx.fillStyle = "#c3a471";
      ctx.fill("evenodd");
      /* night: the terminator is the great circle square to the Sun, an ellipse
         r·|su.z| wide along the sun direction — updateShading()'s job          */
      ctx.rotate(Math.atan2(su.y, su.x));
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI / 2, 3 * Math.PI / 2, false);
      ctx.ellipse(0, 0, r * Math.abs(su.z), r, 0, -Math.PI / 2, Math.PI / 2, su.z > 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(6,10,20,0.72)";
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(CX, CY, r, 0, TAU); ctx.stroke();
    }
    function sun(ctx, near) {
      var p = place(sunLon(), 0);
      if (p.near !== near) return;
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 9);
      g.addColorStop(0, "#ffffff"); g.addColorStop(0.5, "#ffe98a"); g.addColorStop(1, "rgba(240,198,74,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, TAU); ctx.fill();
      ctx.fillStyle = near ? "#ffffff" : "#fff6cc";
      ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, TAU); ctx.fill();
    }
    function timeline(ctx, tr) {
      ctx.fillStyle = "#000000"; ctx.fillRect(TL.x, TL.y, TL.w, TL.h);
      var x0 = TL.x + 24, w = TL.w - 48, y = TL.y + 44;
      ctx.strokeStyle = "#aaaaaa"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y + 0.5); ctx.lineTo(x0 + w, y + 0.5); ctx.stroke();
      var acc = 0;
      ctx.font = "11px " + FONT; ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var i = 0; i < 12; i++) {
        var a = acc / 365 * w, b = (acc + MONTH_DAYS[i]) / 365 * w;
        ctx.strokeStyle = "#888888";
        ctx.beginPath(); ctx.moveTo(x0 + a + 0.5, y - 5); ctx.lineTo(x0 + a + 0.5, y + 5); ctx.stroke();
        ctx.fillStyle = "#dddddd";
        ctx.fillText(tr("m" + (i + 1)), x0 + (a + b) / 2, y + 8);
        acc += MONTH_DAYS[i];
      }
      var mx = x0 + day / 364 * w;
      ctx.fillStyle = "#d11818";
      ctx.beginPath();
      ctx.moveTo(mx - 6, TL.y + 8); ctx.lineTo(mx + 6, TL.y + 8); ctx.lineTo(mx, TL.y + 26);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#d11818"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(mx, TL.y + 24); ctx.lineTo(mx, y); ctx.stroke();
    }

    upd();
  }
});
