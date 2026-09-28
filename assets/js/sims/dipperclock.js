/* Big Dipper Clock ---------------------------------------------------------------
   Faithful rebuild of ClassAction's "dipperclock.swf". Looking north from
   latitude 41°, the circumpolar stars wheel once round the pole every sidereal
   day — so the Big Dipper's angle is a clock face, and the date tells you what
   hour that angle means.

   The SWF's own model, out of its setSolarDaysSinceZero: the star field turns by
   360 · (days · 366 / 365) with day 78.5 (noon on 20 March) as the zero, and the
   sky's brightness comes from a proper twilight calculation at latitude 0.71558
   rad = 41°, obliquity sin 0.397148 and a twilight limit of 0.12217 rad = 7°
   below the horizon. It opens at day 78, time 0.05 — 01:12 on 20 March.

   Zero solar days is noon at the March equinox, where the Sun is at RA 0h, so the
   local sidereal time there is 0h; every star's angle follows from that.

   The daylight only fades the sky in behind the stars: the SWF's skyMC sits
   beneath its star layer, so the asterisms stay on show at noon. "show
   details" adds the labels and northStarLineMC, the dotted line from the
   pointer stars to Polaris. The clock hands and the month strip's cursor can
   be dragged on the canvas, by the SWF's own rules.                          */
Sim.create({
  id: "dipperclock",
  width: 770, height: 452,
  strings: {
    en: {
      "dc.ctl": "Time and date", "dc.time": "Time of day", "dc.doy": "Day of year",
      "dc.details": "show details", "dc.now": "Set to system clock", "dc.reset": "Reset",
      "dc.rTime": "clock time", "dc.rDate": "date", "dc.rLST": "sidereal time",
      "dc.rDipper": "Dipper angle",
      "dc.hint": "The Dipper swings round the pole once a sidereal day, so it gains about four minutes on your clock every night. Hold the time fixed and step through the year to see the same hour show a different sky. You can also drag the clock's hands, or the marker on the month strip.",
      "dc.bigDipper": "Big\nDipper", "dc.littleDipper": "Little\nDipper",
      "dc.north": "North\nStar", "dc.cas": "Cassiopeia", "dc.N": "N",
      "dc.sky": "Looking north", "dc.clock": "Time and date controls",
      "dc.am": "am", "dc.pm": "pm",
      "m0": "Jan", "m1": "Feb", "m2": "Mar", "m3": "Apr", "m4": "May", "m5": "Jun",
      "m6": "Jul", "m7": "Aug", "m8": "Sep", "m9": "Oct", "m10": "Nov", "m11": "Dec"
    },
    id: {
      "dc.ctl": "Waktu dan tanggal", "dc.time": "Waktu", "dc.doy": "Hari dalam setahun",
      "dc.details": "tampilkan keterangan", "dc.now": "Samakan dengan jam sistem",
      "dc.reset": "Atur ulang",
      "dc.rTime": "waktu jam", "dc.rDate": "tanggal", "dc.rLST": "waktu sideris",
      "dc.rDipper": "sudut Biduk",
      "dc.hint": "Biduk mengitari kutub sekali setiap hari sideris, sehingga ia mendahului jam Anda sekitar empat menit tiap malam. Tahan waktunya lalu telusuri setahun untuk melihat jam yang sama menampilkan langit yang berbeda. Jarum jam dan penanda pada pita bulan juga dapat diseret.",
      "dc.bigDipper": "Biduk\nBesar", "dc.littleDipper": "Biduk\nKecil",
      "dc.north": "Bintang\nUtara", "dc.cas": "Cassiopeia", "dc.N": "U",
      "dc.sky": "Menghadap utara", "dc.clock": "Kendali waktu dan tanggal",
      "dc.am": "pagi", "dc.pm": "sore",
      "m0": "Jan", "m1": "Feb", "m2": "Mar", "m3": "Apr", "m4": "Mei", "m5": "Jun",
      "m6": "Jul", "m7": "Agu", "m8": "Sep", "m9": "Okt", "m10": "Nov", "m11": "Des"
    }
  },
  about: {
    en: "<p>Before clocks were cheap, the sky was one. The Big Dipper never sets from mid-northern latitudes, so its angle round Polaris at any moment is a reading you can take with your eyes — and with a rule for the date, that reading is the time.</p>" +
        "<p>The catch is that the stars keep sidereal time, not solar time. They come back to the same angle every 23 h 56 m, so the Dipper is four minutes further round each night at the same clock time, two hours further round each month, and back where it started after a year. Any Dipper angle therefore means a different hour depending on the date.</p>" +
        "<p>Watch Cassiopeia as well. It sits on the opposite side of Polaris, so when the Dipper is high Cassiopeia is scraping the horizon and vice versa — the two of them together make the pointer unmistakable even when one is lost in haze.</p>",
    id: "<p>Sebelum jam menjadi murah, langit adalah salah satunya. Biduk tidak pernah terbenam dari lintang utara menengah, sehingga sudutnya terhadap Polaris pada suatu saat adalah bacaan yang dapat Anda ambil dengan mata — dan dengan aturan untuk tanggalnya, bacaan itu adalah waktu.</p>" +
        "<p>Masalahnya, bintang mengikuti waktu sideris, bukan waktu surya. Mereka kembali ke sudut yang sama setiap 23 j 56 m, sehingga Biduk maju empat menit setiap malam pada jam yang sama, dua jam setiap bulan, dan kembali ke tempat semula setelah setahun. Karena itu sudut Biduk yang sama berarti jam yang berbeda tergantung tanggalnya.</p>" +
        "<p>Perhatikan pula Cassiopeia. Ia berada di seberang Polaris, sehingga ketika Biduk tinggi, Cassiopeia menyerempet cakrawala, dan sebaliknya — keduanya bersama membuat penunjuk itu tak mungkin keliru bahkan ketika salah satunya tertutup kabut.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180;
    var FONT = "Verdana, Geneva, sans-serif";
    var LAT = 41;                                 // the SWF's 0.7155849933 rad
    var OBL_SIN = 0.39714789063478056;
    var TWILIGHT = 0.12217304763960307;           // 7° below the horizon
    var MONTHS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

    var SKY = { x: 10, y: 12, w: 432, h: 396 };
    var POLE = { x: SKY.x + SKY.w / 2, y: 200 }, KPD = 3.6;   // px per degree from the pole
    var CLK = { x: 452, y: 12, w: 306, h: 396, cx: 605, cy: 176, r: 128 };
    var STRIP = { x: CLK.x + 16, w: CLK.w - 32, y: CLK.y + CLK.h - 44 };   // the month strip

    /* The SWF's sky diagram maps into this canvas at K px per unit of its
       layout, with its star layer's origin — the pole — at POLE, so its own
       gradients and ground outline can be used as they stand.                 */
    var K = 0.4661;
    function sx(x) { return POLE.x + K * x; }
    function sy(y) { return POLE.y + K * (y + 0.5); }

    var doy = 78, tod = 0.05, details = true;     // the SWF's reset()

    /* the three asterisms, as (RA hours, dec degrees) */
    var BIG = [[11.0622, 61.751], [11.0307, 56.382], [11.8972, 53.695], [12.2571, 57.033],
      [12.9005, 55.960], [13.3987, 54.925], [13.7924, 49.313]];
    var BIG_PATH = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]];
    var LITTLE = [[2.5303, 89.264], [17.5369, 86.586], [16.766, 82.037], [15.7345, 77.794],
      [16.291, 75.755], [15.3455, 71.834], [14.8451, 74.155]];
    var LITTLE_PATH = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]];
    var CAS = [[0.1529, 59.150], [0.6751, 56.537], [0.9451, 60.717], [1.4303, 60.235],
      [1.9067, 63.670]];
    var CAS_PATH = [[0, 1], [1, 2], [2, 3], [3, 4]];

    function solarDays() { return doy + tod - 78.5; }
    function lst() { return ((solarDays() * 24 * 366 / 365) % 24 + 24) % 24; }
    /* looking north, a star sits at (90 - dec) from the pole, turned round it by
       its hour angle — counter-clockwise on screen, which is how the sky runs */
    function starXY(raH, dec) {
      var a = (lst() - raH) * 15 * RAD, r = (90 - dec) * KPD;
      return { x: POLE.x - r * Math.sin(a), y: POLE.y - r * Math.cos(a) };
    }
    /* setSolarDaysSinceZero's twilight model, verbatim: 0 at night, 1 in daylight */
    function daylight() {
      var s = solarDays();
      var sunLon = s / 365 * TAU;
      var dec = Math.asin(OBL_SIN * Math.sin(sunLon));
      var L = LAT * RAD;
      var sp = Math.sin(dec) * Math.sin(L), cp = Math.cos(dec) * Math.cos(L);
      var cosTw = (Math.sin(-TWILIGHT) - sp) / cp, cosHz = (-sp) / cp;
      if (!(cosTw < 1) || !(cosTw > -1) || !(cosHz < 1) || !(cosHz > -1)) return 0;
      var nightEnds = 0.5 * (1 - Math.acos(cosTw) / Math.PI);
      var dayStarts = 0.5 * (1 - Math.acos(cosHz) / Math.PI);
      var t = ((s - 0.5) % 1 + 1) % 1;
      if (t > 0.5) t = 1 - t;
      return Math.max(0, Math.min(1, (t - nightEnds) / (dayStarts - nightEnds)));
    }
    function dateOf(d) {
      var m = 0;
      while (m < 12 && d >= MONTHS[m + 1]) m++;
      return { m: m, d: Math.floor(d) - MONTHS[m] + 1 };
    }
    function hhmm(f) {
      var h = Math.floor(f * 24), mi = Math.round((f * 24 - h) * 60);
      if (mi === 60) { mi = 0; h = (h + 1) % 24; }
      return (h < 10 ? "0" : "") + h + ":" + (mi < 10 ? "0" : "") + mi;
    }

    /* ------------------------------------------------------------- controls */
    S.group("dc.ctl");
    var timeCtl = S.slider({ labelKey: "dc.time", min: 0, max: 1439 / 1440, value: 0.05, step: 1 / 1440,
      format: function (v) { return hhmm(v); },
      on: function (v) { tod = v; refresh(); } });
    var doyCtl = S.slider({ labelKey: "dc.doy", min: 0, max: 364, value: 78, step: 1,
      format: function (v) { var q = dateOf(v); return I18N.t("m" + q.m) + " " + q.d; },
      on: function (v) { doy = v; refresh(); } });
    var detCtl = S.toggle({ labelKey: "dc.details", value: true,
      on: function (v) { details = v; } });
    S.button({ labelKey: "dc.now", on: function () {
      var n = new Date();
      var m = n.getMonth(), d = n.getDate();
      if (m === 1 && d === 29) d = 28;
      doyCtl.set(MONTHS[m] + d - 1);
      timeCtl.set((n.getHours() + (n.getMinutes() + n.getSeconds() / 60) / 60) / 24);
    } });
    S.button({ labelKey: "dc.reset", on: function () {
      detCtl.set(true); timeCtl.set(0.05); doyCtl.set(78);
    } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "dc.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outTime = S.readout({ labelKey: "dc.rTime" });
    var outDate = S.readout({ labelKey: "dc.rDate" });
    var outLST = S.readout({ labelKey: "dc.rLST" });
    var outAng = S.readout({ labelKey: "dc.rDipper" });

    function refresh() {
      var q = dateOf(doy);
      outTime(hhmm(tod));
      outDate(I18N.t("m" + q.m) + " " + q.d);
      outLST(hhmm(lst() / 24));
      /* the Dipper's pointer angle: Dubhe/Merak, measured clockwise from up */
      var d0 = BIG[0], m0 = BIG[1];
      var mid = ((lst() - (d0[0] + m0[0]) / 2) * 15 % 360 + 360) % 360;
      outAng(mid.toFixed(0) + "°");
      S.requestDraw();
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#eef0f4"; ctx.fillRect(0, 0, S.W, S.H);
      [SKY, CLK].forEach(function (r) {
        ctx.fillStyle = "#ffffff"; ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = "#c8ccd4"; ctx.lineWidth = 1;
        ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
      });
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      ctx.fillStyle = "#333333"; ctx.font = "12px " + FONT;
      ctx.fillText(tr("dc.sky"), SKY.x + 10, SKY.y - 0 + 18);
      ctx.fillText(tr("dc.clock"), CLK.x + 10, CLK.y + 18);

      night(ctx, tr);
      dial(ctx, tr);
      monthStrip(ctx, tr);
    });

    /* a vertical gradient given the way the SWF stores one: the y its ratio
       255 and its ratio 0 fall at, then its stops as [ratio, colour]          */
    function swfGradient(ctx, y255, y0, stops) {
      var g = ctx.createLinearGradient(0, sy(y255), 0, sy(y0));
      stops.forEach(function (s) { g.addColorStop(1 - s[0] / 255, s[1]); });
      return g;
    }
    var FILL = null;
    function fills(ctx) {
      if (!FILL) FILL = {
        night: swfGradient(ctx, -406.1, 356,                             // shape 259
          [[104, "#000000"], [26, "#262626"], [0, "#444444"]]),
        day: swfGradient(ctx, -388.5, 373.6,                             // shape 260
          [[255, "#4f79b9"], [26, "#9cb4d8"], [0, "#d5dfee"]]),
        ground: swfGradient(ctx, 148.4, 496.4,                           // shape 277
          [[124, "#81c851"], [17, "#623726"]])
      };
      return FILL;
    }

    /* layered as the SWF stacks it: the night backdrop, the daylight sky at
       its twilight alpha, then the star layer on top — so the stars show by
       day too — and the ground over everything                                */
    function night(ctx, tr) {
      var box = { x: SKY.x + 8, y: SKY.y + 26, w: SKY.w - 16, h: SKY.h - 34 };
      var f = fills(ctx), dl = daylight();
      ctx.save();
      ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip();
      ctx.fillStyle = f.night; ctx.fillRect(box.x, box.y, box.w, box.h);
      if (dl > 0) {
        ctx.globalAlpha = dl;
        ctx.fillStyle = f.day; ctx.fillRect(box.x, box.y, box.w, box.h);
        ctx.globalAlpha = 1;
      }

      lines(ctx, BIG, BIG_PATH);
      lines(ctx, LITTLE, LITTLE_PATH);
      lines(ctx, CAS, CAS_PATH);
      if (details) {
        ctx.fillStyle = "#cfd8f5"; ctx.font = "10px " + FONT;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        label(ctx, tr("dc.bigDipper"), BIG, -26);
        label(ctx, tr("dc.littleDipper"), LITTLE, 26);
        label(ctx, tr("dc.cas"), CAS, 22);
        var p = starXY(LITTLE[0][0], LITTLE[0][1]);
        twoLine(ctx, tr("dc.north"), p.x - 34, p.y + 4);
        pointerLine(ctx);
      }
      dots(ctx, BIG, 2.6);
      dots(ctx, LITTLE, 1.9);
      dots(ctx, CAS, 2.2);

      /* shape 277: the ground, dipping in the middle, with the north point */
      ctx.beginPath();
      ctx.moveTo(box.x, sy(320)); ctx.lineTo(sx(-440), sy(320));
      ctx.quadraticCurveTo(sx(-245.2), sy(333.4), sx(-8.6), sy(333.4));
      ctx.quadraticCurveTo(sx(238.5), sy(333.4), sx(440), sy(318.75));
      ctx.lineTo(box.x + box.w, sy(318.75));
      ctx.lineTo(box.x + box.w, box.y + box.h); ctx.lineTo(box.x, box.y + box.h);
      ctx.closePath();
      ctx.fillStyle = f.ground; ctx.fill();
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 13px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(tr("dc.N"), POLE.x, sy(362));
      ctx.restore();
    }
    function lines(ctx, stars, path) {
      ctx.strokeStyle = "rgba(200,215,255,0.5)"; ctx.lineWidth = 1;
      ctx.beginPath();
      path.forEach(function (seg) {
        var a = starXY(stars[seg[0]][0], stars[seg[0]][1]);
        var b = starXY(stars[seg[1]][0], stars[seg[1]][1]);
        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      });
      ctx.stroke();
    }
    function dots(ctx, stars, size) {
      ctx.fillStyle = "#ffffff";
      stars.forEach(function (s) {
        var p = starXY(s[0], s[1]);
        ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, TAU); ctx.fill();
      });
    }
    /* northStarLineMC: 45 dots of #ffcc99, radius 2.5 in the SWF's units, in a
       straight run from 0.157 of the Merak-Polaris distance behind Merak,
       through Dubhe, to 0.174 of it beyond Polaris. Laid from Merak through
       Polaris here, it passes within a pixel of Dubhe.                        */
    function pointerLine(ctx) {
      var a = starXY(BIG[1][0], BIG[1][1]), b = starXY(LITTLE[0][0], LITTLE[0][1]);
      var r = 2.5 * K * 0.995;
      ctx.fillStyle = "#ffcc99";
      ctx.beginPath();
      for (var i = 0; i < 45; i++) {
        var t = -0.157 + 1.331 * i / 44;
        var x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
        ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU);
      }
      ctx.fill();
    }
    function label(ctx, text, stars, dy) {
      var sx = 0, sy = 0;
      stars.forEach(function (s) { var p = starXY(s[0], s[1]); sx += p.x; sy += p.y; });
      twoLine(ctx, text, sx / stars.length, sy / stars.length + dy);
    }
    function twoLine(ctx, text, x, y) {
      var parts = text.split("\n");
      for (var i = 0; i < parts.length; i++) ctx.fillText(parts[i], x, y + i * 12);
    }

    /* the SWF's 24-hour dial: 0 at the top, one turn of the hand per day */
    function dial(ctx, tr) {
      ctx.save();
      ctx.translate(CLK.cx, CLK.cy);
      ctx.beginPath(); ctx.arc(0, 0, CLK.r, 0, TAU);
      ctx.fillStyle = "#ffffff"; ctx.fill();
      ctx.strokeStyle = "#333333"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (var h = 0; h < 24; h++) {
        var a = h / 24 * TAU - Math.PI / 2, major = h % 3 === 0;
        ctx.beginPath();
        ctx.moveTo((CLK.r - (major ? 9 : 5)) * Math.cos(a), (CLK.r - (major ? 9 : 5)) * Math.sin(a));
        ctx.lineTo(CLK.r * Math.cos(a), CLK.r * Math.sin(a));
        ctx.strokeStyle = "#555555"; ctx.lineWidth = major ? 1.4 : 0.8; ctx.stroke();
        ctx.fillStyle = major ? "#111111" : "#666666";
        ctx.font = (major ? "bold 12px " : "10px ") + FONT;
        ctx.fillText(String(h), (CLK.r - 22) * Math.cos(a), (CLK.r - 22) * Math.sin(a));
      }
      ctx.fillStyle = "#222222"; ctx.font = "10px " + FONT;
      ctx.fillText("12 " + tr("dc.am"), 0, -CLK.r * 0.55);
      ctx.fillText("12 " + tr("dc.pm"), 0, CLK.r * 0.55);
      ctx.fillText("6 " + tr("dc.am"), CLK.r * 0.46, 0);
      ctx.fillText("6 " + tr("dc.pm"), -CLK.r * 0.46, 0);
      /* a hand under the pointer, or being dragged, thickens — the SWF's
         second frame puts a 4-px outline round it                            */
      hand(ctx, tod, CLK.r * 0.56, hot === "hour" ? 8 : 5, "#111111");
      hand(ctx, (tod * 24) % 1, CLK.r * 0.84, hot === "minute" ? 5 : 2, "#666666");
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU);
      ctx.fillStyle = "#111111"; ctx.fill();
      ctx.restore();

      var q = dateOf(doy);
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#111111"; ctx.font = "bold 16px " + FONT;
      ctx.fillText(hhmm(tod) + "   —   " + tr("m" + q.m) + " " + q.d,
        CLK.x + CLK.w / 2, CLK.cy + CLK.r + 40);
    }
    function hand(ctx, frac, len, w, colour) {
      var a = frac * TAU - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(-5 * Math.cos(a), -5 * Math.sin(a));
      ctx.lineTo(len * Math.cos(a), len * Math.sin(a));
      ctx.strokeStyle = colour; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.stroke();
    }

    /* the month strip the SWF puts under its clock; its cursor marks the
       middle of the day's slot, a pointer above and a line through the strip */
    function stripX(d) { return STRIP.x + STRIP.w * (d + 0.5) / 365; }
    function stripDay(x) { return (x - STRIP.x) / STRIP.w * 365 - 0.5; }
    function monthStrip(ctx, tr) {
      var x0 = STRIP.x, w = STRIP.w, y = STRIP.y;
      ctx.strokeStyle = "#aaaaaa"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + w, y); ctx.stroke();
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.font = "9px " + FONT;
      for (var m = 0; m < 12; m++) {
        var a = x0 + w * MONTHS[m] / 365, b = x0 + w * MONTHS[m + 1] / 365;
        ctx.beginPath(); ctx.moveTo(a, y - 4); ctx.lineTo(a, y + 4);
        ctx.strokeStyle = "#cccccc"; ctx.stroke();
        ctx.fillStyle = "#555555";
        ctx.fillText(tr("m" + m), (a + b) / 2, y + 6);
      }
      var tx = stripX(doy), k = hot === "cursor" ? 1.35 : 1;
      ctx.beginPath(); ctx.moveTo(tx, y - 5); ctx.lineTo(tx, y + 5);
      ctx.strokeStyle = "#c8781e"; ctx.lineWidth = 1.5 * k; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx, y - 4); ctx.lineTo(tx + 5 * k, y - 4 - 8 * k); ctx.lineTo(tx - 5 * k, y - 4 - 8 * k);
      ctx.closePath();
      ctx.fillStyle = "#c8781e"; ctx.fill();
    }

    /* ------------------------------------------------------ canvas handles */
    /* The SWF's own: either clock hand turns with the pointer from wherever it
       was caught — the hour hand turning the date over when it crosses
       midnight, the minute hand carrying the hour when it passes the top (and
       the date, at midnight) — and the strip's cursor slides along the year,
       while a press on the strip beside it steps one day that way and, held
       for 750 ms, keeps stepping toward the pointer at 0.01 day a millisecond. */
    var drag = null, hot = null, box = null;
    function wrap1(v) { return ((v % 1) + 1) % 1; }
    function turnOf(p) { return wrap1(Math.atan2(p.y - CLK.cy, p.x - CLK.cx) / TAU + 0.25); }
    function setTime(v) { timeCtl.set(wrap1(v)); }
    function setDay(v) { doyCtl.set(((Math.floor(v) % 365) + 365) % 365); }
    function setFrac(v) { setDay(v); setTime(v); }            // setFracDayOfYear
    function target(p) {
      var best = null, bd = 9;                     // nearest hand, pivot to tip
      [["minute", (tod * 24) % 1, CLK.r * 0.84], ["hour", tod, CLK.r * 0.56]].forEach(function (h) {
        var a = h[1] * TAU - Math.PI / 2, ux = Math.cos(a), uy = Math.sin(a);
        var qx = p.x - CLK.cx, qy = p.y - CLK.cy;
        var t = Math.max(0, Math.min(h[2], qx * ux + qy * uy));
        var d = Math.hypot(qx - t * ux, qy - t * uy);
        if (d < bd) { bd = d; best = h[0]; }
      });
      if (best) return best;
      if (Math.abs(p.y - STRIP.y) <= 16 && p.x >= STRIP.x - 6 && p.x <= STRIP.x + STRIP.w + 6)
        return Math.abs(p.x - stripX(doy)) <= 7 ? "cursor" : "strip";
      return null;
    }
    function pointerFor(t) { return !t ? "" : t === "strip" ? "pointer" : drag ? "grabbing" : "grab"; }
    function at(ev) {
      var r = box || S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }

    S.canvas.addEventListener("pointerdown", function (ev) {
      box = S.canvas.getBoundingClientRect();
      var p = at(ev), t = target(p);
      if (!t) { box = null; return; }
      if (t === "hour") drag = { kind: t, off: tod - turnOf(p) };
      else if (t === "minute") drag = { kind: t, off: (tod * 24) % 1 - turnOf(p) };
      else if (t === "cursor") drag = { kind: t, off: p.x - stripX(doy) };
      else {
        drag = { kind: t, x: p.x, wait: performance.now() + 750, last: 0, acc: 0 };
        setDay(Math.max(0, Math.min(364, doy + (p.x > stripX(doy) ? 1 : -1))));
        requestAnimationFrame(hold);
      }
      hot = t; S.canvas.style.cursor = pointerFor(t);
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* no live pointer */ }
      ev.preventDefault();
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!drag) {
        var t = target(p);
        if (t !== hot) { hot = t; S.requestDraw(); }
        S.canvas.style.cursor = pointerFor(t);
        return;
      }
      if (drag.kind === "hour") {
        var h0 = Math.floor(tod * 24), r2 = wrap1(drag.off + turnOf(p)), h = 24 * r2;
        if (h < 6 && h0 >= 18) setFrac(doy + r2 + 1);
        else if (h >= 18 && h0 < 6) setFrac(doy + r2 - 1);
        else setTime(r2);
      } else if (drag.kind === "minute") {
        var hr = Math.floor(tod * 24), mi = 60 * (tod * 24 - hr), m2 = wrap1(drag.off + turnOf(p));
        if (mi > 45 && m2 < 0.25) {
          if (hr === 23) setFrac(doy + 1 + m2 / 24); else setTime((hr + 1 + m2) / 24);
        } else if (mi < 15 && m2 > 0.75) {
          if (hr === 0) setFrac(doy - 1 + (23 + m2) / 24); else setTime((hr - 1 + m2) / 24);
        } else setTime((hr + m2) / 24);
      } else if (drag.kind === "cursor") {
        setDay(Math.max(0, Math.min(364, stripDay(p.x - drag.off) + 0.5)));
      } else drag.x = p.x;
    });
    ["pointerup", "pointercancel"].forEach(function (k) {
      S.canvas.addEventListener(k, function (ev) {
        if (!drag) return;
        drag = null;
        hot = target(at(ev)); box = null;
        S.canvas.style.cursor = pointerFor(hot);
        S.requestDraw();
      });
    });
    S.canvas.addEventListener("pointerleave", function () {
      if (drag || !hot) return;
      hot = null; S.canvas.style.cursor = ""; S.requestDraw();
    });
    /* a held press on the strip: step toward the pointer, and stop there */
    function hold(now) {
      if (!drag || drag.kind !== "strip") return;
      var goal = Math.max(0, Math.min(364, Math.floor(stripDay(drag.x) + 0.5)));
      if (now > drag.wait && goal !== doy) {
        drag.acc += (now - Math.max(drag.last, drag.wait)) * 0.01;
        var n = Math.min(Math.floor(drag.acc), Math.abs(goal - doy));
        if (n) { drag.acc -= n; setDay(doy + (goal > doy ? n : -n)); }
      } else drag.acc = 0;
      drag.last = now;
      requestAnimationFrame(hold);
    }

    refresh();
  }
});
