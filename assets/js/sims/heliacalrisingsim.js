/* Heliacal Rising Simulator ----------------------------------------------------------
   Faithful rebuild of ClassAction's "heliacalrisingsim.swf" (heliacalRisingSimulator015,
   17 July 2008), from its decompiled ActionScript: the main timeline's updateSphere /
   updateStarDeclinationArc, the Heliacal Rising Timeline (daylight strip, hour ticks and
   the star-visibility bars), the Day Of Year Selector and Slider, the Latitude Panel
   and Latitude Selector map, and the UNL CelestialSphere engine (showUnder on, the two
   shading layers, the horizon plane with its direction labels, circles, objects and
   axis lines, all in the engine's depth order) — laid out on the SWF's Panel
   Backgrounds, NAAP Standard Slider v6 value fields (bars hidden, as in the SWF) and
   Flash MX combo boxes and radio buttons, redrawn here from their skins.

   The model is the SWF's: the Sun on a circular ecliptic (λ = 2π(day − 78)/365,
   sin δ = sin 23.4° sin λ), twilight while the Sun is less than 7° below the horizon,
   the star's visibility from its hour angle at rising, and a sidereal time that
   gains 1.0027397 h per solar hour. With "(don't lock)" the red cursor sets the time
   of day and the sky follows with the SWF's equation-of-time correction (the Sun's
   true minus mean right ascension), so the Sun always crosses the meridian at the
   timeline's noon; the lock options put the cursor at twilight's start, sunrise,
   noon, sunset, twilight's end, or at the star's rising or setting, every day anew.
   Text is set as Ruffle sets the SWF's: unkerned, each advance floored to a twip.

   The SWF's title bar is left out: its reset and about live in the page. The four
   value boxes are real inputs laid over the canvas, as editable as the SWF's. Beyond
   the SWF: with "(don't lock)" chosen, pressing anywhere on the timeline strip moves
   the time cursor there; a circumpolar star's daily path is drawn as its whole
   circle (the SWF reused the previous arc's end angles, leaving a stray arc about
   0 h); and the Indonesian labels of the lock buttons are spaced to fit.          */
Sim.create({
  id: "heliacalrisingsim",
  width: 825, height: 550,
  strings: {
    en: {
      "hr.pDay": "Day of Year", "hr.pLat": "Observer's Latitude", "hr.pStar": "Star Position",
      "hr.pTime": "Daylight Hours and Star Visibility Timeline",
      "hr.dayLabel": "day of year:", "hr.latLabel": "latitude:", "hr.decLabel": "declination:",
      "hr.raLabel": "rightAscension:", "hr.deg": "°", "hr.h": "h",
      "hr.N": "° N", "hr.S": "° S", "hr.selLoc": "select location...", "hr.lincoln": "Lincoln, NE",
      "hr.cairo": "Cairo, Egypt", "hr.selStar": "select a star...", "hr.sirius": "Sirius", "hr.vega": "Vega",
      "hr.m0": "January", "hr.m1": "February", "hr.m2": "March", "hr.m3": "April", "hr.m4": "May",
      "hr.m5": "June", "hr.m6": "July", "hr.m7": "August", "hr.m8": "September", "hr.m9": "October",
      "hr.m10": "November", "hr.m11": "December",
      "hr.s0": "Jan", "hr.s1": "Feb", "hr.s2": "Mar", "hr.s3": "Apr", "hr.s4": "May", "hr.s5": "Jun",
      "hr.s6": "Jul", "hr.s7": "Aug", "hr.s8": "Sep", "hr.s9": "Oct", "hr.s10": "Nov", "hr.s11": "Dec",
      "hr.dN": "N", "hr.dS": "S", "hr.dE": "E", "hr.dW": "W",
      "hr.t0": "midnight", "hr.t3": "3|AM", "hr.t6": "6|AM", "hr.t9": "9|AM", "hr.t12": "noon",
      "hr.t15": "3|PM", "hr.t18": "6|PM", "hr.t21": "9|PM", "hr.t24": "midnight",
      "hr.above": "star above horizon", "hr.neverSets": "star never sets", "hr.neverRises": "star never rises",
      "hr.lockTo": "lock the time of day to:", "hr.lSunrise": "sunrise", "hr.lNoon": "noon",
      "hr.lSunset": "sunset", "hr.lTwStart": "the start of twilight", "hr.lTwEnd": "the end of twilight",
      "hr.lNone": "(don't lock)", "hr.lStarRise": "star rise", "hr.lStarSet": "star set",
      "hr.date": "date", "hr.lat": "latitude", "hr.location": "location", "hr.star": "star",
      "hr.dec": "declination", "hr.ra": "right ascension", "hr.lock": "lock the time of day to",
      "hr.time": "time of day", "hr.am": "AM", "hr.pm": "PM", "hr.reset": "Reset",
      "hr.hint": "Drag the sphere to turn it. Drag the red cursor over the month strip, or press the strip to step a day at a time; on the map, drag the red line or press above or below it. With (don't lock) chosen, drag the red time cursor, or press anywhere on the timeline strip. The value boxes take typed numbers too."
    },
    id: {
      "hr.pDay": "Hari dalam Setahun", "hr.pLat": "Lintang Pengamat", "hr.pStar": "Posisi Bintang",
      "hr.pTime": "Garis Waktu Siang Hari dan Keterlihatan Bintang",
      "hr.dayLabel": "tanggal:", "hr.latLabel": "lintang:", "hr.decLabel": "deklinasi:",
      "hr.raLabel": "asensio rekta:", "hr.deg": "°", "hr.h": "j",
      "hr.N": "° LU", "hr.S": "° LS", "hr.selLoc": "pilih lokasi...", "hr.lincoln": "Lincoln, NE",
      "hr.cairo": "Kairo, Mesir", "hr.selStar": "pilih bintang...", "hr.sirius": "Sirius", "hr.vega": "Vega",
      "hr.m0": "Januari", "hr.m1": "Februari", "hr.m2": "Maret", "hr.m3": "April", "hr.m4": "Mei",
      "hr.m5": "Juni", "hr.m6": "Juli", "hr.m7": "Agustus", "hr.m8": "September", "hr.m9": "Oktober",
      "hr.m10": "November", "hr.m11": "Desember",
      "hr.s0": "Jan", "hr.s1": "Feb", "hr.s2": "Mar", "hr.s3": "Apr", "hr.s4": "Mei", "hr.s5": "Jun",
      "hr.s6": "Jul", "hr.s7": "Agu", "hr.s8": "Sep", "hr.s9": "Okt", "hr.s10": "Nov", "hr.s11": "Des",
      "hr.dN": "U", "hr.dS": "S", "hr.dE": "T", "hr.dW": "B",
      "hr.t0": "tengah malam", "hr.t3": "3| pagi", "hr.t6": "6| pagi", "hr.t9": "9| pagi",
      "hr.t12": "tengah hari", "hr.t15": "3| sore", "hr.t18": "6| sore", "hr.t21": "9| malam",
      "hr.t24": "tengah malam",
      "hr.above": "bintang di atas horizon", "hr.neverSets": "bintang tak pernah terbenam",
      "hr.neverRises": "bintang tak pernah terbit",
      "hr.lockTo": "kunci waktu pada:", "hr.lSunrise": "matahari terbit", "hr.lNoon": "tengah hari",
      "hr.lSunset": "matahari terbenam", "hr.lTwStart": "awal fajar", "hr.lTwEnd": "akhir senja",
      "hr.lNone": "(tanpa kunci)", "hr.lStarRise": "bintang terbit", "hr.lStarSet": "bintang terbenam",
      "hr.date": "tanggal", "hr.lat": "lintang", "hr.location": "lokasi", "hr.star": "bintang",
      "hr.dec": "deklinasi", "hr.ra": "asensio rekta", "hr.lock": "kunci waktu pada",
      "hr.time": "waktu", "hr.am": "", "hr.pm": "", "hr.reset": "Atur ulang",
      "hr.hint": "Seret bola langit untuk memutarnya. Seret kursor merah di atas pita bulan, atau tekan pita itu untuk melangkah sehari demi sehari; pada peta, seret garis merah atau tekan di atas atau di bawahnya. Dengan pilihan (tanpa kunci), seret kursor waktu merah, atau tekan di mana saja pada pita garis waktu. Kotak nilai juga dapat diketik."
    }
  },
  about: {
    en: "<p>A star's <b>heliacal rising</b> is the first morning of the year on which it can be glimpsed low in the east just before dawn washes it out. For weeks before that date the star is lost in the Sun's glare, rising and setting in daylight. Many ancient cultures kept their calendars by such events: the Egyptians tied the start of their year to the heliacal rising of Sirius, which in their era came just before the Nile's yearly flood.</p>" +
        "<p>Why does it happen? The Sun drifts eastward along the ecliptic by about a degree a day, so compared with the Sun every star rises about <b>four minutes earlier</b> each day (a sidereal day lasts 23 h 56 min). In the timeline the blue bar shows when the star is above the horizon. Sweep the day of the year and the bar slides to the left, a little each day, until its left end, the star's rising, moves out of the yellow daylight and into the morning twilight.</p>" +
        "<p>To find the date, choose a star and an observer, lock the time of day to <b>the start of twilight</b> (the Sun 7° below the horizon, as this simulator defines twilight) and step through the days: the heliacal rising comes around the first day on which the star is already up at that moment. The date depends on the observer's latitude as well as on the star: a southern star such as Sirius rises heliacally later in the year the farther north you are.</p>" +
        "<p>The horizon diagram shows the sky at the moment under the red time cursor: the Sun, the star and its daily path (blue where it is above the horizon), the celestial equator and the 0 h hour circle in yellow, and the ecliptic in grey. The simulator is purely geometric. It ignores atmospheric refraction and dimming, and a real star has to climb a few degrees before it shows in the twilight, so actual heliacal risings come some days after the geometric date.</p>",
    id: "<p><b>Terbit heliakal</b> sebuah bintang adalah pagi pertama dalam setahun ketika bintang itu dapat terlihat rendah di timur, sesaat sebelum cahaya fajar menenggelamkannya. Selama beberapa minggu sebelum tanggal itu, bintang tersebut hilang dalam silau Matahari, terbit dan terbenam pada siang hari. Banyak kebudayaan kuno menyusun kalendernya berdasarkan peristiwa semacam ini: bangsa Mesir mengaitkan awal tahun mereka dengan terbit heliakal Sirius, yang pada zaman mereka terjadi tak lama sebelum banjir tahunan Sungai Nil.</p>" +
        "<p>Mengapa hal ini terjadi? Matahari bergeser ke timur di sepanjang ekliptika sekitar satu derajat per hari, sehingga dibandingkan dengan Matahari setiap bintang terbit sekitar <b>empat menit lebih awal</b> setiap hari (satu hari sideris lamanya 23 jam 56 menit). Pada garis waktu, batang biru menunjukkan kapan bintang berada di atas horizon. Geser hari dalam setahun dan batang itu bergeser ke kiri sedikit demi sedikit setiap hari, sampai ujung kirinya, yaitu saat bintang terbit, keluar dari siang hari yang kuning dan masuk ke fajar.</p>" +
        "<p>Untuk menemukan tanggalnya, pilih sebuah bintang dan lokasi pengamat, kunci waktu pada <b>awal fajar</b> (Matahari 7° di bawah horizon, sesuai definisi fajar dalam simulator ini), lalu telusuri hari demi hari: terbit heliakal jatuh sekitar hari pertama ketika bintang sudah berada di atas horizon pada saat itu. Tanggalnya bergantung pada lintang pengamat maupun pada bintangnya: bintang langit selatan seperti Sirius terbit heliakal makin lambat dalam setahun makin jauh ke utara pengamat berada.</p>" +
        "<p>Diagram horizon menampilkan langit pada saat yang ditunjuk kursor waktu merah: Matahari, bintang beserta lintasan hariannya (biru bila berada di atas horizon), ekuator langit dan lingkaran jam 0 h berwarna kuning, serta ekliptika berwarna abu-abu. Simulator ini murni geometris. Ia mengabaikan pembiasan dan peredupan oleh atmosfer, padahal bintang sungguhan harus naik beberapa derajat dulu sebelum tampak di langit fajar, sehingga terbit heliakal yang sebenarnya jatuh beberapa hari setelah tanggal geometrisnya.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var OY = -30;                                   // the SWF's title bar is the page header here
    var FONT = "Verdana, Geneva, sans-serif";
    var ASC = 1.0059, EM_H = 1.2159, TB = -0.2;    // Verdana ascent, ascent + descent; Ruffle baseline

    /* ---- the SWF's numbers ---- */
    var SIN_OBL = 0.39714789063478056, COS_OBL = 0.9177546256839811;     // 23.4°
    var H12 = 3.819718634205488;                    // 12 / π
    var SID = 1.0027397260273974, SOL = 0.9972677595628415;
    var TWI = 7 * RAD;                              // twilightAngle
    var MONTH_PTS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    var STARS = [{ key: "hr.vega", dec: 38.8, ra: 18.6 }, { key: "hr.sirius", dec: -16.7, ra: 6.8 }];
    var STAR_ITEMS = ["hr.selStar", "hr.sirius", "hr.vega"];
    var LOC_ITEMS = ["hr.selLoc", "hr.lincoln", "hr.cairo"], LOC_LAT = [null, 40.8, 30];
    var DAY_COLOR = [253, 239, 145], NIGHT_COLOR = [128, 128, 128];       // #fdef91, #808080

    /* ---- layout, in SWF stage coordinates (drawn shifted up by OY) ---- */
    var PANELS = [                                   // Panel Background: 300 × 150, scaled
      { x: 404, y: 37, w: 414, h: 114, key: "hr.pDay" },
      { x: 404, y: 158, w: 414, h: 158, key: "hr.pLat" },
      { x: 404, y: 323, w: 414, h: 104, key: "hr.pStar" },
      { x: 7, y: 434, w: 811, h: 139, key: "hr.pTime" }
    ];
    var VIEW = { x: 7, y: 36.95, w: 390, h: 390 };  // the black panel behind the sphere
    var C = { x: 202, y: 231.95 }, R = 150;         // sphereMC, size 300
    var TL = { x: 68, y: 487.1, w: 690, h: 16 };    // timelineMC.setDimensions(690, 16)
    var TCUR_Y = 486.55;                            // timeOfDayCursor._y
    var STRIP = { x: 428.45, y: 123.6, tw: 466 * 0.784943 };   // Day Of Year Slider; barMC._width
    STRIP.k = STRIP.tw / 365;
    var MAP = { x: 680.8, y: 189.65, k: 0.9 };      // Latitude Selector at 90 %
    var F_DAY = { x: 570.9, y: 79.4, w: 27, label: "hr.dayLabel", max: 2 };
    var F_LAT = { x: 481.2, y: 256.7, w: 45, label: "hr.latLabel", max: 5 };
    var F_DEC = { x: 711.1, y: 365.4, w: 45, label: "hr.decLabel", units: "hr.deg", max: 5 };
    var F_RA = { x: 711.1, y: 400.6, w: 45, label: "hr.raLabel", units: "hr.h", max: 4 };
    var FIELDS = [F_DAY, F_LAT, F_DEC, F_RA];
    var COMBO_H = 18, ROW_H = 16;                   // itmHgt, list rows itmHgt − 2
    var CB_MONTH = { id: "month", x: 613.9, y: 70.4, w: 100 };
    var CB_LOC = { id: "loc", x: 420.1, y: 196.15, w: 123 };
    var CB_HEMI = { id: "hemi", x: 478.15, y: 279.15, w: 52 };
    var CB_STAR = { id: "star", x: 444.8, y: 373.4, w: 123 };
    var SEL_BG = "#dddddd", SEL_TEXT = "#000000";  // all four set 'selection' #dddddd, 'textSelected' black
    var COMBOS = [CB_MONTH, CB_LOC, CB_HEMI, CB_STAR];
    var LOCK_TEXT = { x: 24, y: 551.95 };           // static text 252
    var RADIOS = [                                   // FRadioButtons; x per language (see header)
      { mode: "sunrise", key: "hr.lSunrise", y: 533.7, x: { en: 331, id: 236 } },
      { mode: "noon", key: "hr.lNoon", y: 533.7, x: { en: 418.6, id: 357 } },
      { mode: "sunset", key: "hr.lSunset", y: 533.7, x: { en: 494.2, id: 457 } },
      { mode: "twilightStart", key: "hr.lTwStart", y: 543.7, x: { en: 179.4, id: 145 } },
      { mode: "twilightEnd", key: "hr.lTwEnd", y: 543.7, x: { en: 576.8, id: 604 } },
      { mode: "noLock", key: "hr.lNone", y: 543.7, x: { en: 722.4, id: 700 } },
      { mode: "starRise", key: "hr.lStarRise", y: 552.7, x: { en: 362, id: 300 } },
      { mode: "starSet", key: "hr.lStarSet", y: 552.7, x: { en: 461.6, id: 414 } }
    ];

    /* the SWF's own art (tools/swf-inspect.py canvas): Star (shape 182), Sun (209),
       Stickfigure (37), and the three red cursors (143, 221, 253) */
    var STAR_OUT = new Path2D("M3.7 -2.55L10.45 -2.8L5.1 1.4L7.6 3.2L4.55 3.2L6.85 9.65L1.05 5.7L0.05 8.7L-0.85 6.05" +
      "L-6.05 10.1L-4.1 3.2L-7.55 3.2L-5.15 1.5L-10.45 -2.05L-3.5 -2.3L-4.6 -5.7L-2.1 -3.85L-0.25 -10.05L2 -3.7" +
      "L4.7 -5.7L3.7 -2.55");
    var STAR_BIG = new Path2D("M10.45 -2.8L4.15 2.15L6.85 9.65L0.25 5.15L-6.05 10.1L-3.85 2.4L-10.45 -2.05" +
      "L-2.5 -2.35L-0.25 -10.05L2.45 -2.5L10.45 -2.8Z");
    var STAR_IN = new Path2D("M4.7 -5.7L2.95 -0.15L7.6 3.2L1.85 3.2L0.05 8.7L-1.75 3.2L-7.55 3.2L-2.8 -0.15" +
      "L-4.6 -5.7L0.05 -2.25L4.7 -5.7Z");
    var SUN = new Path2D("M8 0Q8 3.3 5.65 5.65Q3.3 8 0 8Q-3.3 8 -5.65 5.65Q-8 3.3 -8 0Q-8 -3.3 -5.65 -5.65" +
      "Q-3.3 -8 0 -8Q3.3 -8 5.65 -5.65Q8 -3.3 8 0Z");

    /* ------------------------------------------------ state */
    var doy = 78;                                   // dayOfYearZB (0 = 1 January)
    var lat = 40.8;                                 // latitudeSelector.latitude
    var dec = -16.7, ra = 6.8;                      // the star
    var lock = "noLock";
    var cursorX = TL.x + TL.w / 2, cursorShown = true;
    var sidereal = 0, vis = null, sun = { dec: 0, ra: 0 };

    /* ------------------------------------------------ the SWF's arithmetic */
    function mod(n, m) { return ((n % m) + m) % m; }
    function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
    function snap(x, digs, lo, hi) {                // Slider Logic v6, 'fixed digits'
      var inc = Math.pow(10, -digs);
      return inc * Math.round(clamp(x, lo, hi) / inc);
    }
    function fixed(x, digs) {                        // SliderLogicClassV6.toFixed
      if (!isFinite(x)) return "...";
      var s = x < 0 ? "-" : "", n = Math.round(Math.abs(x) * Math.pow(10, digs)), r = n === 0 ? "0" : String(n);
      if (digs > 0) {
        while (r.length <= digs) r = "0" + r;
        r = r.substr(0, r.length - digs) + "." + r.substr(r.length - digs);
      }
      return s + r;
    }
    function sunOf(d) {                              // updateDaylightStrip's Sun
      var L = (d - 78) / 365 * TAU;
      var sd = Math.asin(SIN_OBL * Math.sin(L));
      return { dec: sd, ra: mod(H12 * Math.atan2(Math.sin(L) * COS_OBL, Math.cos(L)), 24) };
    }
    function latR() { return clamp(lat, -90, 90) * RAD; }
    function raTL() { return ra < 0 || !(ra < 24) ? 0 : ra; }     // timeline.setRightAscension
    function daylight() {                            // the Sun's hour angles at −7° and 0°
      var s = sunOf(doy), la = latR();
      var sp = Math.sin(s.dec) * Math.sin(la), cp = Math.cos(s.dec) * Math.cos(la);
      return { sun: s, sp: sp, cp: cp, tw: (Math.sin(-TWI) - sp) / cp, hz: -sp / cp };
    }

    /* HeliacalRisingTimeline.updateStarVisibility */
    function starVisibility() {
      var w = TL.w, xNoon = w / 2, d = clamp(dec, -90, 90) * RAD, la = latR(), raR = raTL() * Math.PI / 12;
      var cosA = -Math.sin(d) * Math.sin(la) / (Math.cos(d) * Math.cos(la));
      var sday = (doy - 78) * SID;
      var v = { st: 24 * (sday - Math.floor(sday)), bars: [], texts: [], rs: false };
      if (!(cosA > -1)) { v.texts.push({ x: xNoon, key: "hr.neverSets", y: -14.4 }); return v; }
      if (!(cosA < 1)) { v.texts.push({ x: xNoon, key: "hr.neverRises", y: -14.4 }); return v; }
      var half = Math.acos(cosA) * (w / TAU);
      var t0 = Math.floor(sday) + raR / TAU, e, l;
      if (t0 < sday) { e = t0; l = e + 1; } else { l = t0; e = l - 1; }
      var xE = xNoon - (sday - e) * SOL * w, xL = xNoon + (l - sday) * SOL * w;
      function cl(x) { return x < 0 ? 0 : x > w ? w : x; }
      var eS = cl(xE - half), eE = cl(xE + half), lS = cl(xL - half), lE = cl(xL + half);
      if (eS !== eE) v.bars.push([eS, eE]);
      if (lS !== lE) v.bars.push([lS, lE]);
      function hrs(x) { return SID * (24 * (x / w) - 12) - 12; }
      if (xE > 0 && xE < w) {
        v.texts.push({ x: eS + (eE - eS) / 2, key: "hr.above", y: -16 });
        v.rise = eS > 0 ? hrs(eS) : hrs(lS);
        v.set = eE > 0 ? hrs(eE) : hrs(lE);
      } else if (xL > 0 && xL < w) {
        v.texts.push({ x: lS + (lE - lS) / 2, key: "hr.above", y: -16 });
        v.rise = lS < w ? hrs(lS) : hrs(eS);
        v.set = lE < w ? hrs(lE) : hrs(eE);
      }
      v.rs = true;
      return v;
    }

    /* the main timeline's updateSphere */
    function updateSphere() {
      var dl = daylight();
      var nAT = !(dl.tw < 1), nBT = !(dl.tw > -1), nAH = !(dl.hz < 1), nBH = !(dl.hz > -1);
      var r1 = 0;
      vis = starVisibility();
      function event(never1, never2, c, sign) {
        if (never1) { r1 = 0; cursorShown = false; }
        else if (never2) { r1 = -12; cursorShown = false; }
        else { cursorShown = true; r1 = sign * H12 * Math.acos(c); }
      }
      switch (lock) {
        case "twilightStart": event(nAT, nBT, dl.tw, -1); break;
        case "sunrise": event(nAH, nBH, dl.hz, -1); break;
        case "noon": r1 = 0; cursorShown = true; break;
        case "sunset": event(nAH, nBH, dl.hz, 1); break;
        case "twilightEnd": event(nAT, nBT, dl.tw, 1); break;
        case "noLock": cursorShown = true; r1 = SID * (24 * (cursorX - TL.x) / TL.w - 12); break;
        case "starRise": if (vis.rs) { cursorShown = true; r1 = 12 + vis.rise; } else { cursorShown = false; r1 = 0; } break;
        case "starSet": if (vis.rs) { cursorShown = true; r1 = 12 + vis.set; } else { cursorShown = false; r1 = 0; } break;
      }
      if (lock !== "noLock") cursorX = TL.x + TL.w * mod(((r1 * SOL + 12) / 24) % 1, 1);
      var eot = dl.sun.ra - 0.06575342465753424 * mod(doy - 78, 365);
      if (lock === "starRise" || lock === "starSet") eot = 0;
      sidereal = mod(vis.st + r1 + eot, 24);
      sun = { dec: dl.sun.dec * DEG, ra: dl.sun.ra };
      syncSphere();
    }
    /* updateStarDeclinationArc: the part of the star's circle above the horizon */
    function decArc() {
      var d = clamp(dec, -90, 90) * RAD, la = latR();
      var c = -Math.sin(d) * Math.sin(la) / (Math.cos(d) * Math.cos(la));
      if (!(c > -1)) return { full: true };
      if (!(c < 1)) return null;
      var g = Math.acos(c) * DEG;
      return { gS: -g, gE: g };
    }

    /* ------------------------------------------------ the SWF's handlers */
    function monthOf(d) { var m = 0; while (m < 12 && !(d < MONTH_PTS[m + 1])) m++; return m; }
    function domOf(d) { return d - MONTH_PTS[monthOf(d)] + 1; }
    function setDayZB(arg) {                         // DayOfYearSelector.setDayOfYearZB(…, true)
      doy = mod(Math.floor(arg), 365);
      onDayChanged();
    }
    function onDayUI(day, month) {                   // onChangeViaUserInterface
      var len = MONTH_PTS[month + 1] - MONTH_PTS[month];
      if (day > len) day = len;
      doy = day + MONTH_PTS[month] - 1;
      onDayChanged();
    }
    function onDayChanged() { updateSphere(); changed(); }             // onDayOfYearZBChanged
    function setLat(v) { lat = v; updateSphere(); changed(); }         // → onLatitudeChanged
    function latViaMap(arg) { setLat(snap(arg, 1, -90, 90)); }         // onLatitudeChangedViaMap
    function latViaField(v) {                         // onLatitudeSliderChanged
      v = snap(v, 1, -90, 90);
      setLat(lat < 0 ? -Math.abs(v) : v);
    }
    function onHemisphere(i) { setLat(i === 0 ? Math.abs(lat) : -Math.abs(lat)); }
    function onLocation(i) { if (i > 0) setLat(LOC_LAT[i]); else changed(); }
    function setDec(v) { dec = snap(v, 1, -90, 90); updateSphere(); changed(); }      // onDeclinationChanged
    function setRA(v) { ra = snap(v, 1, 0, 24); updateSphere(); changed(); }          // onRightAscensionChanged
    function onStar(i) {                             // onStarSelected
      if (i > 0) {
        STARS.forEach(function (s) {
          if (s.key === STAR_ITEMS[i]) { dec = snap(s.dec, 1, -90, 90); ra = snap(s.ra, 1, 0, 24); }
        });
        updateSphere();
      }
      changed();
    }
    function setLock(m) { lock = m; updateSphere(); changed(); }      // onLockTimeChanged
    function moveTimeCursor(x) {                     // onTimeOfDayCursorMoved
      cursorX = TL.x + mod(x - TL.x, TL.w);
      updateSphere(); changed();
    }
    function reset() {                               // onReset
      doy = 78; lat = snap(40.8, 1, -90, 90); dec = -16.7; ra = 6.8;
      sph.setThetaAndPhi(150, 35);
      cursorX = TL.x + TL.w / 2; lock = "noLock";
      openCombo = null; focusCombo = null;
      FIELDS.forEach(function (f) { f.active = false; if (f.input) f.input.blur(); });
      updateSphere(); changed();
    }

    /* the combo boxes' selected items, as the SWF's update functions set them */
    function comboSel(c) {
      if (c === CB_MONTH) return monthOf(doy);
      if (c === CB_HEMI) return lat < 0 ? 1 : 0;
      if (c === CB_LOC) {
        for (var i = 1; i < LOC_LAT.length; i++) if (Math.abs(lat - LOC_LAT[i]) < 1e-12) return i;
        return 0;
      }
      var tlDec = clamp(dec, -90, 90), tlRa = raTL();
      for (var s = 0; s < STARS.length; s++) {
        if (Math.abs(STARS[s].ra - tlRa) < 1e-12 && Math.abs(STARS[s].dec - tlDec) < 1e-12) return STAR_ITEMS.indexOf(STARS[s].key);
      }
      return 0;
    }
    function comboItems(c) {
      if (c === CB_MONTH) return ["hr.m0", "hr.m1", "hr.m2", "hr.m3", "hr.m4", "hr.m5", "hr.m6", "hr.m7", "hr.m8", "hr.m9", "hr.m10", "hr.m11"];
      if (c === CB_HEMI) return ["hr.N", "hr.S"];
      if (c === CB_LOC) return LOC_ITEMS;
      return STAR_ITEMS;
    }
    function pickCombo(c, i) {
      openCombo = null;
      if (c === CB_MONTH) onDayUI(domOf(doy), i);
      else if (c === CB_HEMI) onHemisphere(i);
      else if (c === CB_LOC) onLocation(i);
      else onStar(i);
    }

    /* ------------------------------------------------ sidebar */
    var controlsEl = S.canvas.parentNode.parentNode.querySelector(".sim-controls");
    function last(sel) { var all = controlsEl.querySelectorAll(sel); return all[all.length - 1]; }
    var syncing = false;
    function t(key) { return I18N.t(key); }
    function isID() { return I18N.getLang() === "id"; }
    function dateText(d) { return domOf(d) + " " + t("hr.m" + monthOf(d)); }
    function latText(v) { return fixed(Math.abs(v), 1) + t(v < 0 ? "hr.S" : "hr.N"); }
    function clockText(h) {
      var mins = Math.round(mod(h, 24) * 60) % 1440, hh = Math.floor(mins / 60), mm = mins % 60;
      if (isID()) return (hh < 10 ? "0" : "") + hh + "." + (mm < 10 ? "0" : "") + mm;
      return (hh % 12 === 0 ? 12 : hh % 12) + ":" + (mm < 10 ? "0" : "") + mm + " " + t(hh < 12 ? "hr.am" : "hr.pm");
    }
    function cursorHours() { return 24 * (cursorX - TL.x) / TL.w; }

    S.group("hr.pDay");
    var daySl = S.slider({ labelKey: "hr.date", min: 0, max: 364, step: 1, value: doy,
      format: function (v) { return dateText(v | 0); },
      on: function (v) { if (!syncing) setDayZB(v); } });
    S.group("hr.pLat");
    var latSl = S.slider({ labelKey: "hr.lat", min: -90, max: 90, step: 0.1, value: lat,
      format: function (v) { return latText(v); },
      on: function (v) { if (!syncing) latViaMap(v); } });
    S.select({ labelKey: "hr.location", value: "0", options: LOC_ITEMS.map(function (k, i) { return { v: String(i), labelKey: k }; }),
      on: function (v) { if (!syncing) onLocation(+v); } });
    var locEl = last("select");
    S.group("hr.pStar");
    S.select({ labelKey: "hr.star", value: "1", options: STAR_ITEMS.map(function (k, i) { return { v: String(i), labelKey: k }; }),
      on: function (v) { if (!syncing) onStar(+v); } });
    var starEl = last("select");
    var decSl = S.slider({ labelKey: "hr.dec", min: -90, max: 90, step: 0.1, value: dec,
      format: function (v) { return fixed(v, 1) + "°"; },
      on: function (v) { if (!syncing) setDec(v); } });
    var raSl = S.slider({ labelKey: "hr.ra", min: 0, max: 24, step: 0.1, value: ra,
      format: function (v) { return fixed(v, 1) + " " + t("hr.h"); },
      on: function (v) { if (!syncing) setRA(v); } });
    S.group("hr.pTime");
    var LOCK_OPTS = ["twilightStart", "sunrise", "noon", "sunset", "twilightEnd", "starRise", "starSet", "noLock"];
    S.select({ labelKey: "hr.lock", value: lock,
      options: LOCK_OPTS.map(function (m) {
        var r = RADIOS.filter(function (q) { return q.mode === m; })[0];
        return { v: m, labelKey: r.key };
      }),
      on: function (v) { if (!syncing) setLock(v); } });
    var lockEl = last("select");
    var timeSl = S.slider({ labelKey: "hr.time", min: 0, max: 24, step: 0.01, value: 12,
      format: function (v) { return clockText(v); },
      on: function (v) { if (!syncing && lock === "noLock") moveTimeCursor(TL.x + TL.w * v / 24); } });
    S.button({ labelKey: "hr.reset", on: reset });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "hr.hint");
    controlsEl.appendChild(hint);

    function syncSidebar() {
      syncing = true;
      daySl.set(doy); latSl.set(lat); decSl.set(dec); raSl.set(ra);
      locEl.value = String(comboSel(CB_LOC)); starEl.value = String(comboSel(CB_STAR));
      lockEl.value = lock;
      timeSl.set(cursorHours()); timeSl.input.disabled = lock !== "noLock";
      syncing = false;
    }

    /* the four value boxes: real inputs over the canvas, like the SWF's fields */
    var wrap = document.createElement("div");
    wrap.style.position = "relative";
    S.canvas.parentNode.insertBefore(wrap, S.canvas);
    wrap.appendChild(S.canvas);
    function fieldText(f) {
      if (f === F_DAY) return fixed(domOf(doy), 0);
      if (f === F_LAT) return fixed(Math.abs(lat), 1);
      if (f === F_DEC) return fixed(dec, 1);
      return fixed(ra, 1);
    }
    function commitField(f, v) {
      if (!isFinite(v)) { changed(); return; }
      if (f === F_DAY) onDayUI(snap(v, 0, 1, 31), monthOf(doy));
      else if (f === F_LAT) latViaField(v);
      else if (f === F_DEC) setDec(v);
      else setRA(v);
    }
    FIELDS.forEach(function (f) {
      var input = document.createElement("input");
      input.type = "text"; input.inputMode = "decimal"; input.maxLength = f.max;
      input.setAttribute("aria-label", f.label);
      input.style.cssText = "position:absolute;border:0;background:transparent;padding:0;margin:0;" +
        "text-align:center;outline:none;box-shadow:none;color:#000000;-webkit-text-fill-color:#000000;font-family:" + FONT + ";";
      input.style.left = ((f.x - 3.8) / S.W * 100) + "%";
      input.style.top = ((f.y - 9.5 + OY) / S.H * 100) + "%";
      input.style.width = ((f.w + 7.6) / S.W * 100) + "%";
      input.style.height = (19 / S.H * 100) + "%";
      wrap.appendChild(input);
      f.input = input; f.active = false;
      function commit() {                         // setValue(parseFloat(text), true)
        f.active = false; input.style.fontStyle = "normal";
        commitField(f, parseFloat(input.value));
      }
      input.addEventListener("focus", function () { focusCombo = null; S.requestDraw(); });
      input.addEventListener("input", function () {
        input.value = input.value.replace(/[^0-9.Ee+\-]/g, "");
        f.active = true; input.style.fontStyle = "italic"; S.requestDraw();
      });
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { commit(); input.blur(); }
        else if (ev.key === "Escape") { f.active = false; input.style.fontStyle = "normal"; changed(); input.blur(); }
      });
      input.addEventListener("blur", function () { if (f.active) commit(); });
    });
    function fitFields() {
      var px = 12 * S.canvas.clientWidth / S.W + "px";
      FIELDS.forEach(function (f) { f.input.style.fontSize = px; });
    }
    if (window.ResizeObserver) new ResizeObserver(fitFields).observe(S.canvas);
    else window.addEventListener("resize", fitFields);
    fitFields();
    function syncFields() {
      FIELDS.forEach(function (f) { f.input.setAttribute("aria-label", t(f.label).replace(/:$/, "")); if (!f.active) f.input.value = fieldText(f); });
    }
    function changed() { syncSidebar(); syncFields(); S.requestDraw(); }

    var mapImg = new Image();
    mapImg.onload = function () { S.requestDraw(); };
    mapImg.src = "../assets/img/sims/heliacal-map.png";

    /* ------------------------------------------------ the CelestialSphere, as the main timeline sets it up */
    var CS = window.CelestialSphere, sph = new CS({ x: C.x, y: C.y });
    sph.setThetaAndPhi(150, 35);
    sph.size = 300;
    sph.minViewerAltitude = 7;
    sph.removeClip("celestialBowl");
    sph.addShadingClip(CS.art.shadingLayerB, "shading1", "back", "inner", "both");
    sph.addShadingClip(CS.art.shadingLayerA, "shading2", "front", "outer", "both");
    sph.addShadingClip(CS.art.shadingLayerA, "shading3", "back", "outer", "both");
    sph.addHorizonPlaneClip(CS.directionLabels(function () {
      return { N: t("hr.dN"), S: t("hr.dS"), E: t("hr.dE"), W: t("hr.dW") };
    }, { size: 16, pos: CS.DIR_LABELS_16 }), "directionLabels", "above");
    sph.addCircle("meridian1", { alpha: 20, color: 0xe0e0e0, thickness: 1 }, { tilt: 90, az: 0, alt: 0 });
    sph.addCircle("meridian2", { alpha: 20, color: 0xe0e0e0, thickness: 1 }, { tilt: 90, az: 90, alt: 0 });
    sph.addCircle("eclipticCircle", { alpha: 60, color: 0xe0e0e0, thickness: 1 }, { tilt: 23.4, dec: 0, ra: 0 });
    sph.addCircle("zeroHoursCircle", { alpha: 100, color: 0xffe375, thickness: 1 }, { gammaEnd: 90, gammaStart: -90, tilt: 90, dec: 0, ra: 0 });
    sph.addCircle("celestialEquator", { alpha: 100, color: 0xffe375, thickness: 1 }, { tilt: 0, dec: 0, ra: 0 });
    sph.addCircle("declinationCircle", { alpha: 30, color: 0xe0e0e0, thickness: 1 }, { dec: 45, ra: 0, tilt: 0 });
    sph.addCircle("declinationArc", { alpha: 100, color: 0x3090e0, thickness: 2 }, { dec: 45, ra: 0, tilt: 0 });
    sph.addObject("star", drawStar, { dec: 0, ra: 0 });
    sph.addObject("sun", drawSun, { dec: 0, ra: 0 });
    sph.addObject("stickfigure", CS.art.stickfigure, { system: "horizon", x: 0, y: 0, z: 0 }, { _xscale: 120, _yscale: 120 });
    sph.stickfigure.setOrientationType("absolute", { system: "horizon", x: -1, y: 0, z: 0 }, { system: "horizon", x: 0, y: 0, z: 1 });
    sph.addLine("ncpAxis", { alpha: 100, color: 0x75a9ff, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: 1 }, { system: "celestial", x: 0, y: 0, z: 1.2 });
    sph.addLine("scpAxis", { alpha: 100, color: 0x75a9ff, thickness: 2 }, { system: "celestial", x: 0, y: 0, z: -1 }, { system: "celestial", x: 0, y: 0, z: -1.2 });

    /* onDayOfYearZBChanged / onLatitudeChanged / onDeclinationChanged / onRightAscensionChanged,
       then the tail of updateSphere and updateStarDeclinationArc */
    function syncSphere() {
      var d = clamp(dec, -90, 90);
      sph.latitude = lat;
      sph.siderealTime = sidereal;
      sph.sun.setPosition({ dec: sun.dec, ra: sun.ra });
      sph.sun.setOrientationType("absolute");
      sph.star.setPosition({ dec: d, ra: raTL() });
      sph.star.setOrientationType("absolute");
      sph.declinationCircle.dec = d;
      var arc = decArc();
      if (!arc) sph.declinationArc.visible = false;
      else {
        // a circumpolar star's whole circle (the SWF kept the previous arc's end angles here)
        if (arc.full) sph.declinationArc.setParameters({ gammaEnd: 0, gammaStart: 0, tilt: 0, dec: d, ra: 0 });
        else sph.declinationArc.setParameters({ gammaEnd: arc.gE, gammaStart: arc.gS, tilt: 0, dec: d, ra: sph.siderealTime });
        sph.declinationArc.visible = true;
      }
    }
    // the SWF's own art (tools/swf-inspect.py canvas): Star (shape 182), Sun (209)
    function drawStar(ctx) {
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 1; ctx.lineJoin = "round"; ctx.stroke(STAR_OUT);
      var g = ctx.createRadialGradient(0.05, 0.2, 0, 0.05, 0.2, 11.65);
      g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#e4e466");
      ctx.fillStyle = g; ctx.fill(STAR_BIG);
      var g2 = ctx.createRadialGradient(0.05, 1.55, 0, 0.05, 1.55, 8.57);
      g2.addColorStop(0, "#ffffff"); g2.addColorStop(1, "#f5f5c2");
      ctx.fillStyle = g2; ctx.fill(STAR_IN);
    }
    function drawSun(ctx) {
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 8.925);
      g.addColorStop(0, "#fbe4a4"); g.addColorStop(1, "#f2c43c");
      ctx.fillStyle = g; ctx.fill(SUN);
      ctx.strokeStyle = "#c0c0c0"; ctx.lineWidth = 1; ctx.stroke(SUN);
    }

    /* ------------------------------------------------ canvas interaction */
    var hover = null, press = null, openCombo = null, listHi = -1;
    var focusCombo = null;                           // the component with focus, if it is a combo box
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY };
    }
    function inRect(p, x, y, w, h) { return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h; }
    function textW(str, size) { S.ctx.font = size + "px " + FONT; return FlashText.width(S.ctx, str); }
    function radioX(r) { return r.x[isID() ? "id" : "en"]; }
    function listGeom(c) {
      var n = comboItems(c).length, shown = Math.min(c === CB_MONTH ? 12 : 8, n);
      if (shown < 3) shown = Math.min(3, n);
      return { x: c.x, y: c.y + COMBO_H, w: c.w, h: shown * ROW_H + 2, n: shown };
    }
    function listRowAt(c, p) {
      var g = listGeom(c);
      if (!inRect(p, g.x, g.y, g.w, g.h)) return -1;
      return clamp(Math.floor((p.y - g.y) / ROW_H), 0, g.n - 1);
    }
    function dayCursorX() { return STRIP.x + STRIP.k * (doy + 0.5); }
    function latCursorY() { return MAP.y + MAP.k * (62.5 - lat / 1.44); }
    function hit(p) {
      if (openCombo) {
        var r = listRowAt(openCombo, p);
        if (r >= 0) return { kind: "row", c: openCombo, i: r };
        if (inRect(p, openCombo.x, openCombo.y, openCombo.w, COMBO_H)) return { kind: "combo", c: openCombo };
        return { kind: "away" };
      }
      for (var i = COMBOS.length - 1; i >= 0; i--) {
        var c = COMBOS[i];
        if (inRect(p, c.x, c.y, c.w, COMBO_H)) return { kind: "combo", c: c };
      }
      for (var j = 0; j < RADIOS.length; j++) {
        var q = RADIOS[j], x = radioX(q);
        if (inRect(p, x, q.y - 3, 16 + textW(t(q.key), 12), 16)) return { kind: "radio", r: q };
      }
      if (cursorShown && lock === "noLock") {        // timeOfDayCursor (only draggable unlocked)
        var dx = p.x - cursorX, dy = p.y - TCUR_Y;
        if ((Math.abs(dx) <= 7.75 && dy >= -1.45 && dy <= 9.35) || (Math.abs(dx) <= 3 && dy >= -7.85 && dy <= 26.7) ||
          (Math.abs(dx) <= 5.85 && dy >= 26.7 && dy <= 35.15)) return { kind: "tcursor" };
        if (inRect(p, TL.x, TL.y - 8, TL.w, 16)) return { kind: "tstrip" };
      }
      var cx = dayCursorX(), sy = STRIP.y;           // Day Of Year Slider: cursor, then strip
      if ((Math.abs(p.x - cx) <= 7.75 && p.y >= sy - 23.45 && p.y <= sy - 12.7) ||
        (Math.abs(p.x - cx) <= 3 && p.y >= sy - 13.7 && p.y <= sy + 14.4)) return { kind: "dcursor" };
      if (inRect(p, STRIP.x - 11, sy - 16, STRIP.tw + 22, 32)) return { kind: "dstrip" };
      var ly = latCursorY(), lx = (p.x - MAP.x) / MAP.k, ldy = (p.y - ly) / MAP.k;   // Latitude Selector
      if ((Math.abs(ldy) <= 4 && Math.abs(lx) <= 125) || (Math.abs(ldy) <= 10 && Math.abs(lx) >= 125 && Math.abs(lx) <= 145)) {
        return { kind: "lcursor" };
      }
      if (inRect(p, MAP.x - 125 * MAP.k, MAP.y, 250 * MAP.k, 125 * MAP.k)) return { kind: "map" };
      if (sph.inMouseArea(p.x, p.y)) return { kind: "sphere" };
      return null;
    }
    var CURSORS = { sphere: "grab", tcursor: "ew-resize", tstrip: "ew-resize", dcursor: "ew-resize",
      dstrip: "pointer", lcursor: "ns-resize", map: "pointer", combo: "pointer", row: "pointer", radio: "pointer" };
    function setHover(h) {
      var key = h ? h.kind + (h.r ? h.r.mode : "") + (h.c ? h.c.id + (h.i !== undefined ? h.i : "") : "") : "";
      var was = hover ? hover.kind + (hover.r ? hover.r.mode : "") + (hover.c ? hover.c.id + (hover.i !== undefined ? hover.i : "") : "") : "";
      hover = h;
      if (h && h.kind === "row") listHi = h.i;
      if (!press) S.canvas.style.cursor = (h && CURSORS[h.kind]) || "default";
      if (key !== was) S.requestDraw();
    }

    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p);
      FIELDS.forEach(function (f) { if (document.activeElement === f.input) f.input.blur(); });
      if (openCombo) {
        if (h.kind === "row") pickCombo(h.c, h.i);
        else { openCombo = null; changed(); }
        return;
      }
      if (!h) return;
      ev.preventDefault();
      if (h.kind === "radio") focusCombo = null;      // FRadioButton.pressFocus takes the focus
      S.canvas.setPointerCapture(ev.pointerId);
      press = { kind: h.kind, r: h.r, c: h.c, x0: p.x, y0: p.y, inside: true };
      if (h.kind === "sphere") {                     // startSimpleDragging
        sph.startDrag(p.x, p.y);
        S.canvas.style.cursor = "grabbing";
      } else if (h.kind === "combo") {                // pressHandler: pressFocus, then open
        focusCombo = h.c; openCombo = h.c; listHi = comboSel(h.c);
      } else if (h.kind === "tcursor") press.off = p.x - cursorX;
      else if (h.kind === "tstrip") { press.kind = "tcursor"; press.off = 0; moveTimeCursor(p.x); }
      else if (h.kind === "dcursor") press.off = p.x - dayCursorX();
      else if (h.kind === "dstrip") {                // backgroundMC.onPress: a day toward the mouse
        setDayZB(doy + (p.x > dayCursorX() ? 1 : -1));
        press.tLast = performance.now(); press.wait = press.tLast + 750; press.mx = p.x;
      } else if (h.kind === "lcursor") press.off = p.y - latCursorY();
      else if (h.kind === "map") {                   // mapMC.onPress: 0.1° toward the mouse
        var ly = latCursorY();
        if (p.y < ly) latViaMap(lat + 0.1); else if (p.y > ly) latViaMap(lat - 0.1);
        press.tLast = performance.now(); press.wait = press.tLast + 750; press.my = p.y;
      }
      setHover(h);
      S.requestDraw(); wake();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!press) { setHover(hit(p)); return; }
      if (press.kind === "sphere") {                 // updateSimpleDragging
        sph.dragTo(p.x, p.y); S.requestDraw();
      } else if (press.kind === "tcursor") moveTimeCursor(p.x - press.off);
      else if (press.kind === "dcursor") setDayZB((p.x - press.off - STRIP.x) / STRIP.k - 0.5);
      else if (press.kind === "dstrip") press.mx = p.x;
      else if (press.kind === "lcursor") latViaMap(1.44 * (62.5 - (p.y - press.off - MAP.y) / MAP.k));
      else if (press.kind === "map") press.my = p.y;
      else if (press.kind === "combo") {
        var r = listRowAt(openCombo, p);
        if (r >= 0 && r !== listHi) { listHi = r; S.requestDraw(); }
      } else if (press.kind === "radio") {
        var h = hit(p), inside = !!h && h.kind === "radio" && h.r === press.r;
        if (inside !== press.inside) { press.inside = inside; S.requestDraw(); }
      }
    });
    function release(ev, cancelled) {
      if (!press) return;
      var pr = press, p = at(ev);
      press = null;
      sph.endDrag();
      if (!cancelled) {
        if (pr.kind === "radio" && pr.inside) setLock(pr.r.mode);
        else if (pr.kind === "combo" && openCombo) {
          var r = listRowAt(openCombo, p);           // pressed on the box, released on an item
          if (r >= 0 && Math.abs(p.y - pr.y0) > 4) pickCombo(openCombo, r);
        }
      }
      setHover(hit(p));
      changed();
    }
    S.canvas.addEventListener("pointerup", function (ev) { release(ev, false); });
    S.canvas.addEventListener("pointercancel", function (ev) { release(ev, true); });
    S.canvas.addEventListener("pointerleave", function () {
      if (!press && hover) { hover = null; S.canvas.style.cursor = "default"; S.requestDraw(); }
    });
    S.canvas.tabIndex = 0;
    S.canvas.setAttribute("aria-label", "horizon diagram, day of year, latitude map and timeline");
    S.canvas.addEventListener("keydown", function (ev) {
      if (ev.key === "ArrowRight" || ev.key === "ArrowUp") { setDayZB(doy + 1); ev.preventDefault(); }
      else if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") { setDayZB(doy - 1); ev.preventDefault(); }
      else if (ev.key === "Escape" && openCombo) { openCombo = null; changed(); }
    });

    /* a held month strip or map repeats (after 750 ms) */
    var rafId = 0;
    function wake() {
      if (!rafId && press && (press.kind === "dstrip" || press.kind === "map")) rafId = requestAnimationFrame(tick);
    }
    function tick(now) {
      rafId = 0;
      if (!press) return;
      if (press.kind === "dstrip" && now > press.wait) {     // ceil(0.015 · Δt) at the SWF's 25 fps
        var n = Math.floor((now - press.tLast) / 40);
        if (n > 0) {
          press.tLast += n * 40;
          setDayZB(doy + (press.mx > dayCursorX() ? n : -n));
        }
      } else if (press.kind === "map" && now > press.wait) { // 0.01° per ms
        var d = 0.01 * (now - press.tLast), ly = latCursorY();
        if (press.my < ly) latViaMap(lat + d); else if (press.my > ly) latViaMap(lat - d);
        press.tLast = now;
      }
      wake();
    }

    /* ------------------------------------------------ drawing helpers */
    function font(ctx, size, bold) { ctx.font = (bold ? "bold " : "") + size + "px " + FONT; }
    function lineH(size) { return EM_H * size + 4; }            // an autosized TextField's height
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }
    /* Panel Background: #fafafa, 1 px #666666 (centred on the edge), 14 px #333333 title and
       a #cccccc rule at yMargin + barYOffset + ½ the title clip's height (14.44 px in Ruffle) */
    function panel(ctx, b) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      font(ctx, 14); ctx.fillStyle = "#333333"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t(b.key), b.x + 5, b.y + 18, "left");
      ctx.strokeStyle = "#cccccc";
      var tw = FlashText.textWidth(ctx, t(b.key));    // Ruffle's textWidth is whole pixels
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(b.x + 10 + tw, b.y + 14.44); ctx.lineTo(b.x + b.w - 5, b.y + 14.44); ctx.stroke();
      ctx.lineCap = "butt";
    }
    /* Standard Slider v6 with its bar and grabber hidden: label, rounded field, units */
    function field(ctx, f) {
      ctx.save(); ctx.translate(f.x, f.y);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
      var base = -lineH(12) / 2 + 2 + ASC * 12 + TB + 0.25;      // + 0.25: measured in Ruffle
      FlashText.fill(ctx, t(f.label), -9.8 - FlashText.textWidth(ctx, t(f.label)), base, "left");   // textWidth is whole px
      if (f.units) FlashText.fill(ctx, t(f.units), f.w + 9.8, base, "left");
      roundRect(ctx, -4.8, -10.5, f.w + 9.6, 21, 4.8); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      roundRect(ctx, -3.8, -9.5, f.w + 7.6, 19, 3.8); ctx.fillStyle = f.active ? "#ffffee" : "#ffffff"; ctx.fill();
      ctx.restore();
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
    function combo(ctx, c) {                         // FBoundingBox: white, a 1-twip #666 outline that
      var h = COMBO_H, px = 1 / ctx.getTransform().a;  // Ruffle draws as device-pixel hairlines, the top
      var hi = focusCombo === c && openCombo !== c;  // one at about half strength. With the focus and
      ctx.fillStyle = hi ? SEL_BG : "#ffffff";        // closed, the top item is drawn selected
      ctx.fillRect(c.x, c.y, c.w - h, h);
      ctx.fillStyle = "#666666"; ctx.fillRect(c.x - px / 2, c.y, px, h);
      ctx.fillStyle = "rgba(102,102,102,0.5)"; ctx.fillRect(c.x, c.y - px / 2, c.w - h, px);
      font(ctx, 12); ctx.fillStyle = hi ? SEL_TEXT : "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.save(); ctx.beginPath(); ctx.rect(c.x, c.y, c.w - h, h); ctx.clip();
      FlashText.fill(ctx, t(comboItems(c)[comboSel(c)]), c.x + 3.9, c.y + 14.1, "left");
      ctx.restore();
      arrowButton(ctx, c.x + c.w - h, c.y, h);
    }
    /* the drop-down list: items every itmHgt − 2 px, each (and its highlight) itmHgt tall, in a
       white FBoundingBox whose outline Ruffle draws as hairlines */
    function comboList(ctx, c) {
      var g = listGeom(c), items = comboItems(c), px = 1 / ctx.getTransform().a;
      ctx.save(); ctx.beginPath(); ctx.rect(g.x, g.y, g.w, g.h); ctx.clip();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(g.x, g.y, g.w, g.h);
      font(ctx, 12); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      for (var i = 0; i < g.n; i++) {
        var y = g.y + i * ROW_H;
        if (i === listHi) { ctx.fillStyle = SEL_BG; ctx.fillRect(g.x, y, g.w, COMBO_H); }
        ctx.fillStyle = i === listHi ? SEL_TEXT : "#000000";
        FlashText.fill(ctx, t(items[i]), g.x + 3.9, y + 14.1, "left");
      }
      ctx.restore();
      ctx.fillStyle = "#666666"; ctx.fillRect(g.x - px / 2, g.y, px, g.h); ctx.fillRect(g.x + g.w - px / 2, g.y, px, g.h);
      ctx.fillStyle = "rgba(102,102,102,0.5)"; ctx.fillRect(g.x, g.y - px / 2, g.w, px); ctx.fillRect(g.x, g.y + g.h - px / 2, g.w, px);
    }
    /* FRadioButton (frb_states), 10 px, with its own ' label' */
    function radio(ctx, r) {
      var x = radioX(r), on = lock === r.mode;
      var down = press && press.kind === "radio" && press.r === r && press.inside;
      ctx.save(); ctx.translate(x, r.y);
      ctx.fillStyle = "#808080"; ctx.beginPath(); ctx.arc(5, 5, 5, 0, TAU); ctx.fill();
      ctx.fillStyle = "#d4d0d8"; ctx.beginPath(); ctx.arc(5, 5, 4, 0, TAU); ctx.fill();
      ctx.fillStyle = down ? "#cccccc" : "#ffffff"; ctx.beginPath(); ctx.arc(5, 5, 3, 0, TAU); ctx.fill();
      if (on) { ctx.fillStyle = "#000000"; ctx.beginPath(); ctx.arc(5, 5, 2, 0, TAU); ctx.fill(); }
      ctx.restore();
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      FlashText.fill(ctx, t(r.key), x + 16.2, r.y + 10.1, "left");    // the SWF's ' label': its space takes no room
    }

    /* ------------------------------------------------ the panels */
    function dayPanel(ctx) {
      field(ctx, F_DAY);
      ctx.save(); ctx.translate(STRIP.x, STRIP.y);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(-7.45, -10, 380, 20);            // shape 243
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.strokeRect(-7.45, -10, 380, 20);
      ctx.fillStyle = "#000000";                     // lineStyle(0) hairlines: Ruffle draws them a stage
      MONTH_PTS.forEach(function (m) {               // pixel wide, with square ends
        ctx.fillRect(STRIP.k * m - 0.5, -6, 1, 12);
      });
      font(ctx, 11); ctx.fillStyle = "#000000"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      for (var i = 0; i < 12; i++) {                 // Day Of Year Labels
        var mx = STRIP.k * (MONTH_PTS[i] + (MONTH_PTS[i + 1] - MONTH_PTS[i]) / 2);
        FlashText.fill(ctx, t("hr.s" + i), mx + 0.025, -8.65 + 2 + ASC * 11 + TB, "center");
      }
      ctx.translate(STRIP.k * (doy + 0.5), -22);     // Day Of Year Cursor
      ctx.fillStyle = "#f02000"; ctx.strokeStyle = "#f02000";
      ctx.beginPath(); ctx.moveTo(0.05, 8.35); ctx.lineTo(0, 8.4); ctx.lineTo(-5.85, 0); ctx.lineTo(5.85, 0); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0.05, 8.35); ctx.lineTo(0.1, 36.4); ctx.stroke();
      ctx.restore();
    }
    function latPanel(ctx) {
      ctx.save(); ctx.translate(MAP.x, MAP.y); ctx.scale(MAP.k, MAP.k);
      ctx.fillStyle = "#333333"; ctx.fillRect(-127, -2, 254, 129);               // shape 217
      if (mapImg.complete && mapImg.naturalWidth) ctx.drawImage(mapImg, -125, 0, 250, 125);
      else { ctx.fillStyle = "#808080"; ctx.fillRect(-125, 0, 250, 125); }
      ctx.translate(0, 62.5 - lat / 1.44);           // setCursorLatitude
      ctx.fillStyle = "#f02000"; ctx.strokeStyle = "#f02000"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-129.25, 0); ctx.lineTo(-137.65, 5.85); ctx.lineTo(-137.65, -5.85); ctx.closePath();
      ctx.moveTo(137.7, -5.85); ctx.lineTo(137.7, 5.85); ctx.lineTo(129.25, 0); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-129.25, 0); ctx.lineTo(129.25, 0); ctx.stroke();
      ctx.restore();
      field(ctx, F_LAT);
    }
    function mixColor(x) {                           // getInterpolatedColor(day, night, x)
      x = x > 1 ? 1 : x < 0 ? 0 : x;
      var c = DAY_COLOR.map(function (v, i) { return (v + x * (NIGHT_COLOR[i] - v)) | 0; });
      return "rgb(" + c.join(",") + ")";
    }
    function timeline(ctx) {
      var w = TL.w, h = 0.6 * TL.h / 2, xNoon = w / 2, dl = daylight();
      ctx.save(); ctx.translate(TL.x, TL.y);
      // daylightStripMC
      var day = mixColor(0), night = mixColor(1);
      if (!(dl.hz > -1)) { ctx.fillStyle = day; ctx.fillRect(0, -h, w, 2 * h); }
      else if (!(dl.tw < 1)) { ctx.fillStyle = night; ctx.fillRect(0, -h, w, 2 * h); }
      else {
        var tsa = !(dl.tw > -1) ? Math.PI : Math.acos(dl.tw);
        var xNE = xNoon * (1 - tsa / Math.PI), xNS = xNoon * (1 + tsa / Math.PI);
        ctx.fillStyle = night; ctx.fillRect(0, -h, xNE, 2 * h); ctx.fillRect(xNS, -h, w - xNS, 2 * h);
        var tea = !(dl.hz < 1) ? 0 : Math.acos(dl.hz);
        var xDS = xNoon * (1 - tea / Math.PI), xDE = xNoon * (1 + tea / Math.PI);
        ctx.fillStyle = day; ctx.fillRect(xDS, -h, xDE - xDS, 2 * h);
        var xTS = xNE, xTE = xDS, n = Math.ceil((xTE - xTS) / 4);
        if (n > 1) {                                 // twilight: ≤ 4 px gradient steps, mirrored
          var gm = ctx.createLinearGradient(xTS, 0, xTE, 0), ge = ctx.createLinearGradient(2 * xNoon - xTS, 0, 2 * xNoon - xTE, 0);
          for (var i = 0; i < n; i++) {
            var alpha = tsa - i * (tsa - tea) / (n - 1);
            var alt = Math.asin(Math.cos(alpha) * dl.cp + dl.sp), col = mixColor(-alt / TWI);
            gm.addColorStop(i / (n - 1), col); ge.addColorStop(i / (n - 1), col);
          }
          ctx.fillStyle = gm; ctx.fillRect(xTS, -h, xTE - xTS, 2 * h);
          ctx.fillStyle = ge; ctx.fillRect(2 * xNoon - xTE, -h, xTE - xTS, 2 * h);
        }
      }
      // timelineLabelsMC: ticks every hour, labels every three (round-capped, as Flash strokes are)
      ctx.lineWidth = 1; ctx.lineCap = "round";
      for (var hr = 0; hr <= 24; hr++) {
        var x = w * hr / 24, major = hr % 3 === 0, a = TL.h / 2 * (major ? 1 : 0.5);
        ctx.strokeStyle = major ? "#000000" : "#606060";
        ctx.beginPath(); ctx.moveTo(x, a); ctx.lineTo(x, -a); ctx.stroke();
        if (major) hourLabel(ctx, t("hr.t" + hr), x, TL.h / 2 + 2 + ASC * 12 + TB + 0.2);
      }
      ctx.lineCap = "butt";
      // visibiltyMC
      var y2 = -1.2 * TL.h / 2, y1 = y2 - 0.6 * TL.h / 2;
      ctx.fillStyle = "#3090e0";
      vis.bars.forEach(function (b) { ctx.fillRect(b[0], y1, b[1] - b[0], y2 - y1); });
      font(ctx, 12); ctx.textAlign = "center";
      vis.texts.forEach(function (tx) {             // createTextField(…, x, …) takes an integer x;
        FlashText.fill(ctx, t(tx.key), FlashText.int(tx.x), tx.y - EM_H * 12 + 2 + ASC * 12 + TB - 1.125, "center");
      });                                            // _y = y − textHeight (as measured in Ruffle)
      ctx.restore();
    }
    function hourLabel(ctx, s, x, base) {           // '3<font size="-3">AM</font>', centred
      var parts = s.split("|"), w0, w1 = 0;
      font(ctx, 12); w0 = FlashText.width(ctx, parts[0]);
      if (parts[1]) { font(ctx, 9); w1 = FlashText.width(ctx, parts[1]); }
      var left = FlashText.int(x) - (w0 + w1) / 2;  // createTextField takes an integer x
      ctx.fillStyle = "#000000";
      font(ctx, 12); FlashText.fill(ctx, parts[0], left, base, "left");
      if (parts[1]) { font(ctx, 9); FlashText.fill(ctx, parts[1], left + w0, base, "left"); }
    }
    function timeCursor(ctx) {                       // timeOfDayCursor, #f02000 or #505050 when locked
      if (!cursorShown) return;
      var col = lock === "noLock" ? "#f02000" : "#505050";
      ctx.save(); ctx.translate(cursorX, TCUR_Y);
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(0, 26.7); ctx.lineTo(-0.1, -7.85); ctx.moveTo(0, 29.05); ctx.lineTo(0, 26.75); ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 26.7); ctx.lineTo(5.85, 35.15); ctx.lineTo(-5.85, 35.15); ctx.lineTo(-0.05, 26.75); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    function draw() {
      var ctx = S.ctx;
      ctx.save();
      FlashText.begin(ctx);                          // Flash lays text out without kerning
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.translate(0, OY);
      ctx.fillStyle = "#000000"; ctx.fillRect(VIEW.x, VIEW.y, VIEW.w, VIEW.h);
      PANELS.forEach(function (b) { panel(ctx, b); });
      ctx.save(); sph.draw(ctx); ctx.restore();
      dayPanel(ctx);
      combo(ctx, CB_MONTH);
      timeline(ctx);
      field(ctx, F_DEC); field(ctx, F_RA);
      latPanel(ctx);
      combo(ctx, CB_HEMI); combo(ctx, CB_LOC);
      RADIOS.forEach(function (r) { radio(ctx, r); });
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText(t("hr.lockTo"), LOCK_TEXT.x, LOCK_TEXT.y);
      timeCursor(ctx);
      combo(ctx, CB_STAR);
      if (openCombo) comboList(ctx, openCombo);
      ctx.restore();
      clipFields();
    }
    /* The open list lies over everything, the value boxes too, as in the SWF. The
       inputs sit above the canvas, so each one is clipped out where the list covers
       it. It then neither shows through the list nor takes the list's clicks.    */
    function clipFields() {
      var g = openCombo ? listGeom(openCombo) : null;
      FIELDS.forEach(function (f) {
        var x = f.x - 3.8, y = f.y - 9.5, w = f.w + 7.6, h = 19, clip = "";
        var x0 = g ? Math.max(x, g.x) : 0, x1 = g ? Math.min(x + w, g.x + g.w) : 0;
        var y0 = g ? Math.max(y, g.y) : 0, y1 = g ? Math.min(y + h, g.y + g.h) : 0;
        if (x0 < x1 && y0 < y1) {
          var X0 = ((x0 - x) / w * 100).toFixed(2) + "%", X1 = ((x1 - x) / w * 100).toFixed(2) + "%";
          var Y0 = ((y0 - y) / h * 100).toFixed(2) + "%", Y1 = ((y1 - y) / h * 100).toFixed(2) + "%";
          clip = "polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, " + X0 + " " + Y0 + ", " + X1 + " " + Y0 +
            ", " + X1 + " " + Y1 + ", " + X0 + " " + Y1 + ", " + X0 + " " + Y0 + ")";
        }
        if (f.clip !== clip) { f.clip = clip; f.input.style.clipPath = clip; f.input.style.webkitClipPath = clip; }
      });
    }
    S.onDraw(draw);
    S.refreshers.push(function () { syncSidebar(); syncFields(); });
    reset();
  }
});
