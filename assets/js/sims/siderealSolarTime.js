/* Sidereal and Solar Time Simulator ----------------------------------------------
   Faithful rebuild of NAAP's "siderealSolarTime.swf" — one SWF, two catalogue
   entries (ClassAction's Coordinates and Motions module lists the same file).
   Model straight out of the original's TimeMaster, OrbitView, AnalogClock and
   DayOfYearSlider classes.

   One clock keeps solar time — noon is the Sun on your meridian. The other keeps
   sidereal time — 0h is the vernal equinox on your meridian. Because the Earth
   has to turn a little further each day to catch the Sun up again, a sidereal
   day is shorter, and the two clocks drift apart by exactly one whole turn over
   a year: 365 solar days are 366 sidereal days.

   The original's numbers: the epoch is solar time 0.5 — noon on 20 March, the
   vernal equinox itself — a tropical year of 365 solar days, and sidereal per
   solar = (365 + 1) / 365. Every button animates with a cubic ease, 1 s for a
   single step and 2 s for ten days or a season.                              */
Sim.create({
  id: "siderealSolarTime",
  width: 940, height: 500,
  strings: {
    en: {
      "ss.solar": "Solar time", "ss.sid": "Sidereal time",
      "ss.solarSub": "ordinary clock time, based on the position of the Sun in the sky",
      "ss.sidSub": "“astronomer's time”, based on the right ascension of a star on the observer's meridian",
      "ss.advSolar": "Advance by solar day", "ss.advSid": "Advance by sidereal day",
      "ss.goSolar": "Go to (solar)", "ss.goSid": "Go to (sidereal)", "ss.year": "Go to (year)",
      "ss.p1": "+1 day", "ss.p10": "+10 days",
      "ss.midnight": "midnight", "ss.sunrise": "sunrise", "ss.noon": "noon", "ss.sunset": "sunset",
      "ss.h0": "0h", "ss.h6": "6h", "ss.h12": "12h", "ss.h18": "18h",
      "ss.ve": "vernal equinox", "ss.ss": "summer solstice",
      "ss.ae": "autumnal equinox", "ss.ws": "winter solstice",
      "ss.reset": "Reset", "ss.doy": "Day of year",
      "ss.solarDays": "solar days since equinox ♈︎", "ss.sidDays": "sidereal days since equinox ♈︎",
      "ss.rSolar": "solar clock", "ss.rSid": "sidereal clock", "ss.rDiff": "clocks differ by",
      "ss.veLabel": "vernal equinox (♈︎)",
      "ss.hint": "Drag the Earth round its orbit, drag the little observer to spin it, or drag either clock's hands. Watch how far apart the two clocks have drifted.",
      "ss.am": "am", "ss.pm": "pm",
      "m3": "M", "m4": "A", "m5": "M", "m6": "J", "m7": "J", "m8": "A", "m9": "S",
      "m10": "O", "m11": "N", "m12": "D", "m1": "J", "m2": "F"
    },
    id: {
      "ss.solar": "Waktu surya", "ss.sid": "Waktu sideris",
      "ss.solarSub": "waktu jam biasa, berdasarkan kedudukan Matahari di langit",
      "ss.sidSub": "“waktu astronom”, berdasarkan asensiorekta bintang di meridian pengamat",
      "ss.advSolar": "Majukan satu hari surya", "ss.advSid": "Majukan satu hari sideris",
      "ss.goSolar": "Menuju (surya)", "ss.goSid": "Menuju (sideris)", "ss.year": "Menuju (tahun)",
      "ss.p1": "+1 hari", "ss.p10": "+10 hari",
      "ss.midnight": "tengah malam", "ss.sunrise": "terbit", "ss.noon": "tengah hari", "ss.sunset": "terbenam",
      "ss.h0": "0j", "ss.h6": "6j", "ss.h12": "12j", "ss.h18": "18j",
      "ss.ve": "ekuinoks Maret", "ss.ss": "solstis Juni",
      "ss.ae": "ekuinoks September", "ss.ws": "solstis Desember",
      "ss.reset": "Atur ulang", "ss.doy": "Hari dalam setahun",
      "ss.solarDays": "hari surya sejak ekuinoks ♈︎", "ss.sidDays": "hari sideris sejak ekuinoks ♈︎",
      "ss.rSolar": "jam surya", "ss.rSid": "jam sideris", "ss.rDiff": "selisih kedua jam",
      "ss.veLabel": "ekuinoks Maret (♈︎)",
      "ss.hint": "Seret Bumi mengelilingi orbitnya, seret pengamat kecil untuk memutarnya, atau seret jarum salah satu jam. Perhatikan seberapa jauh kedua jam telah menyimpang.",
      "ss.am": "pagi", "ss.pm": "sore",
      "m3": "M", "m4": "A", "m5": "M", "m6": "J", "m7": "J", "m8": "A", "m9": "S",
      "m10": "O", "m11": "N", "m12": "D", "m1": "J", "m2": "F"
    }
  },
  about: {
    en: "<p>A day is how long the Earth takes to turn once — but once with respect to what? Measure it against a star and you get the sidereal day, the Earth's true rotation period. Measure it against the Sun and you get the solar day, which is what our clocks keep.</p>" +
        "<p>They differ because the Earth also moves along its orbit. In the time it takes to spin once, it has travelled about a degree further round the Sun, so it must turn that extra degree before the Sun is back on the meridian. That extra degree costs about four minutes: the solar day is 24 hours, the sidereal day is 23 h 56 m 4 s.</p>" +
        "<p>Over a year the shortfall adds up to one whole extra rotation. The Earth turns 366 times against the stars while the Sun comes back to the meridian only 365 times — which is why this simulator's year is 365 solar days and exactly 366 sidereal days, and why the two clocks here start together at the vernal equinox and come back together a year later.</p>",
    id: "<p>Satu hari adalah lamanya Bumi berputar sekali — tetapi sekali terhadap apa? Ukurlah terhadap sebuah bintang dan Anda memperoleh hari sideris, periode rotasi sejati Bumi. Ukurlah terhadap Matahari dan Anda memperoleh hari surya, yang dipakai jam kita.</p>" +
        "<p>Keduanya berbeda karena Bumi juga bergerak sepanjang orbitnya. Selama sekali berputar, Bumi telah menempuh kira-kira satu derajat lebih jauh mengelilingi Matahari, sehingga ia harus berputar satu derajat tambahan itu sebelum Matahari kembali ke meridian. Satu derajat tambahan itu berharga sekitar empat menit: hari surya 24 jam, hari sideris 23 j 56 m 4 d.</p>" +
        "<p>Sepanjang setahun, selisih itu menumpuk menjadi satu putaran penuh. Bumi berputar 366 kali terhadap bintang-bintang sementara Matahari kembali ke meridian hanya 365 kali — itulah sebabnya setahun dalam simulator ini adalah 365 hari surya dan tepat 366 hari sideris, dan mengapa kedua jam di sini berangkat bersama pada ekuinoks Maret dan bertemu lagi setahun kemudian.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180;
    var FONT = "Verdana, Geneva, sans-serif";

    /* TimeMaster, SIMPLE mode */
    var EPOCH = 0.5;                             // SOLAR_TIME_AT_EPOCH
    var YEAR = 365;                              // tropicalYear
    var SPS = (YEAR + 1) / YEAR;                 // siderealPerSolar
    var solarTime = EPOCH;                       // the animation target
    var shownTime = EPOCH;                       // latestSolarTime
    var anim = null;                             // {t0, dur, from, to}

    var CLOCK_R = 84;
    /* the sidereal caption is the wider of the two ("sidereal days since
       equinox: 353.000"), so it gets the extra room                          */
    var SOLAR = { x: 10, y: 10, w: 202, h: 360, cx: 111, cy: 200 };
    var SID = { x: 220, y: 10, w: 220, h: 360, cx: 329, cy: 200 };
    var DOY = { x: 10, y: 380, w: 430, h: 110, bx: 26, bw: 400, by: 432 };
    var ORB = { x: 450, y: 10, w: 480, h: 480 };
    var OC = { x: ORB.x + ORB.w / 2, y: ORB.y + ORB.h / 2 };
    var ORBIT_R = 168, SUN_R = 23, EARTH_R = 18;

    function mod1(v) { return ((v % 1) + 1) % 1; }
    function siderealFor(solar) { return (solar - EPOCH) * SPS; }
    function solarFor(sid) { return sid / SPS + EPOCH; }
    function solarDaysSinceVE(solar) { return (((solar - EPOCH) % YEAR) + YEAR) % YEAR; }
    function near(a, b) { return Math.abs(a - b) < 1e-6; }

    /* ---------------------------------------------------------- time changes */
    function setSolar(v, dur) {
      if (!dur) { anim = null; solarTime = shownTime = v; sync(); return; }
      anim = { t0: performance.now(), dur: dur, from: shownTime, to: v };
      solarTime = v;
      clock.play();
    }
    function bumpLatest(d) {                     // incrementLatestSolarTime
      setSolar(shownTime + d, 0);
    }
    /* Main.getNextTimeWithFraction: always forward to the next such moment */
    function nextWithFraction(now, frac) {
      frac = mod1(frac);
      var i = Math.floor(now), f = now - i;
      if (frac - f < 1e-8) i += 1;
      return i + frac;
    }
    function goToSolarTimeOfDay(f) {
      var t = nextWithFraction(shownTime, f);
      if (!near(solarTime, t)) setSolar(t, 1000);
    }
    function goToSiderealTimeOfDay(f) {
      var t = nextWithFraction(siderealFor(shownTime), f);
      if (!near(siderealFor(solarTime), t)) setSolar(solarFor(t), 1000);
    }
    function goToFractionOfYear(f) {
      var t = nextWithFraction((shownTime - EPOCH) / YEAR, f);
      t = EPOCH + t * YEAR;
      if (!near(solarTime, t)) setSolar(t, 2000);
    }

    /* ------------------------------------------------------------- controls */
    S.group("ss.advSolar");
    S.button({ labelKey: "ss.p1", on: function () { setSolar(solarTime + 1, 1000); } });
    S.button({ labelKey: "ss.p10", on: function () { setSolar(solarTime + 10, 2000); } });
    S.group("ss.goSolar");
    var bMid = S.button({ labelKey: "ss.midnight", on: function () { goToSolarTimeOfDay(0); } });
    var bRise = S.button({ labelKey: "ss.sunrise", on: function () { goToSolarTimeOfDay(0.25); } });
    var bNoon = S.button({ labelKey: "ss.noon", on: function () { goToSolarTimeOfDay(0.5); } });
    var bSet = S.button({ labelKey: "ss.sunset", on: function () { goToSolarTimeOfDay(0.75); } });

    S.group("ss.advSid");
    S.button({ labelKey: "ss.p1", on: function () { setSolar(solarTime + 1 / SPS, 1000); } });
    S.button({ labelKey: "ss.p10", on: function () { setSolar(solarTime + 10 / SPS, 2000); } });
    S.group("ss.goSid");
    var b0 = S.button({ labelKey: "ss.h0", on: function () { goToSiderealTimeOfDay(0); } });
    var b6 = S.button({ labelKey: "ss.h6", on: function () { goToSiderealTimeOfDay(0.25); } });
    var b12 = S.button({ labelKey: "ss.h12", on: function () { goToSiderealTimeOfDay(0.5); } });
    var b18 = S.button({ labelKey: "ss.h18", on: function () { goToSiderealTimeOfDay(0.75); } });

    S.group("ss.year");
    var bVE = S.button({ labelKey: "ss.ve", on: function () { goToFractionOfYear(0); } });
    var bSS = S.button({ labelKey: "ss.ss", on: function () { goToFractionOfYear(0.25); } });
    var bAE = S.button({ labelKey: "ss.ae", on: function () { goToFractionOfYear(0.5); } });
    var bWS = S.button({ labelKey: "ss.ws", on: function () { goToFractionOfYear(0.75); } });
    S.button({ labelKey: "ss.reset", on: function () { setSolar(EPOCH, 0); } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ss.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outSolar = S.readout({ labelKey: "ss.rSolar" });
    var outSid = S.readout({ labelKey: "ss.rSid" });
    var outDiff = S.readout({ labelKey: "ss.rDiff" });

    var clock = S.loop(function () {
      if (!anim) { clock.pause(); return; }
      var u = Math.min(1, (performance.now() - anim.t0) / anim.dur);
      var e = u * u * (3 - 2 * u);               // CubicEaser with zero end slopes
      shownTime = anim.from + e * (anim.to - anim.from);
      if (u >= 1) { shownTime = anim.to; anim = null; clock.pause(); }
      sync();
    });

    function hhmm(frac) {
      var h = mod1(frac) * 24, hh = Math.floor(h), mm = Math.round((h - hh) * 60);
      if (mm === 60) { mm = 0; hh = (hh + 1) % 24; }
      return (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm;
    }
    function sync() {
      var sid = siderealFor(shownTime);
      outSolar(hhmm(shownTime));
      outSid(hhmm(sid));
      var d = mod1(sid - shownTime) * 24;
      outDiff(d.toFixed(2) + " h");
      mark(bMid, near(mod1(shownTime), 0) || near(mod1(shownTime) - 1, 0));
      mark(bRise, near(mod1(shownTime), 0.25));
      mark(bNoon, near(mod1(shownTime), 0.5));
      mark(bSet, near(mod1(shownTime), 0.75));
      mark(b0, near(mod1(sid), 0) || near(mod1(sid) - 1, 0));
      mark(b6, near(mod1(sid), 0.25));
      mark(b12, near(mod1(sid), 0.5));
      mark(b18, near(mod1(sid), 0.75));
      var dv = solarDaysSinceVE(shownTime);
      mark(bVE, near(dv, 0) || near(dv - YEAR, 0));
      mark(bSS, near(dv, 0.25 * YEAR));
      mark(bAE, near(dv, 0.5 * YEAR));
      mark(bWS, near(dv, 0.75 * YEAR));
      S.requestDraw();
    }
    function mark(b, on) { b.classList.toggle("primary", !!on); }

    /* ------------------------------------------------------------ dragging */
    /* OrbitView and AnalogClock both hand their deltas to incrementLatestSolarTime */
    var drag = null;
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      var ea = earthAngle(), ex = OC.x + ORBIT_R * Math.cos(ea), ey = OC.y + ORBIT_R * Math.sin(ea);
      var sp = figurePos(ex, ey);
      anim = null; solarTime = shownTime;
      if (Math.hypot(p.x - sp.x, p.y - sp.y) < 15) {
        drag = { kind: "figure", a0: Math.atan2(p.y - ey, p.x - ex), t0: shownTime };
      } else if (Math.hypot(p.x - ex, p.y - ey) <= EARTH_R + 4) {
        drag = { kind: "orbit", a0: Math.atan2(p.y - OC.y, p.x - OC.x), t0: shownTime };
      } else if (inCircle(p, SOLAR.cx, SOLAR.cy, CLOCK_R + 6)) {
        drag = { kind: "solar", a0: Math.atan2(p.y - SOLAR.cy, p.x - SOLAR.cx), t0: shownTime };
      } else if (inCircle(p, SID.cx, SID.cy, CLOCK_R + 6)) {
        drag = { kind: "sid", a0: Math.atan2(p.y - SID.cy, p.x - SID.cx), t0: siderealFor(shownTime) };
      } else if (p.y > DOY.by - 18 && p.y < DOY.by + 18 &&
                 p.x > DOY.bx - 10 && p.x < DOY.bx + DOY.bw + 10) {
        drag = { kind: "doy", x0: p.x, t0: shownTime };
      } else return;
      S.canvas.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev), d;
      if (drag.kind === "orbit") {
        d = wrapPi(Math.atan2(p.y - OC.y, p.x - OC.x) - drag.a0) / TAU * YEAR;
        d = ev.shiftKey ? Math.round(d * SPS) / SPS : Math.round(d);
        bumpLatest(drag.t0 + d - shownTime);
      } else if (drag.kind === "figure") {
        var ea = earthAngle();
        var ex = OC.x + ORBIT_R * Math.cos(ea), ey = OC.y + ORBIT_R * Math.sin(ea);
        d = wrapPi(Math.atan2(p.y - ey, p.x - ex) - drag.a0) / TAU;
        bumpLatest(drag.t0 - d - shownTime);
      } else if (drag.kind === "solar") {
        d = wrapPi(Math.atan2(p.y - SOLAR.cy, p.x - SOLAR.cx) - drag.a0) / TAU;
        bumpLatest(drag.t0 + d - shownTime);
      } else if (drag.kind === "sid") {
        d = wrapPi(Math.atan2(p.y - SID.cy, p.x - SID.cx) - drag.a0) / TAU;
        bumpLatest(solarFor(drag.t0 + d) - shownTime);
      } else {
        d = (p.x - drag.x0) / DOY.bw * YEAR;
        bumpLatest(drag.t0 + d - shownTime);
      }
    });
    ["pointerup", "pointercancel"].forEach(function (k) {
      S.canvas.addEventListener(k, function () {
        if (drag && drag.kind === "orbit") { drag = null; return; }
        drag = null;
      });
    });
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function inCircle(p, cx, cy, r) { return Math.hypot(p.x - cx, p.y - cy) <= r; }
    function wrapPi(a) { a = ((a % TAU) + TAU) % TAU; return a > Math.PI ? a - TAU : a; }

    /* the observer's screen position, a body-length out along the spin direction */
    function spinAngle() {
      return (180 - mod1(shownTime) * 360 -
        solarDaysSinceVE(shownTime) / YEAR * 360) * RAD - Math.PI / 2;
    }
    function figurePos(ex, ey) {
      var a = spinAngle(), d = EARTH_R + 11;
      return { x: ex + d * Math.cos(a), y: ey + d * Math.sin(a) };
    }

    /* OrbitView: angle 0 at the vernal equinox, minus a quarter turn. The
       original plots it as (cos g, -sin g) — the negated y is what sends the
       Earth round anticlockwise, from the bottom at the equinox to the right a
       quarter of a year later — so the screen angle is -g.                   */
    function earthAngle() {
      return -(solarDaysSinceVE(shownTime) / YEAR * TAU - Math.PI / 2);
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#f2f2f2"; ctx.fillRect(0, 0, S.W, S.H);
      panel(ctx, SOLAR); panel(ctx, SID); panel(ctx, DOY);

      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#222222"; ctx.font = "bold 13px " + FONT;
      ctx.textAlign = "left";
      ctx.fillText(tr("ss.solar"), SOLAR.x + 12, SOLAR.y + 22);
      ctx.fillText(tr("ss.sid"), SID.x + 12, SID.y + 22);
      ctx.fillStyle = "#555555"; ctx.font = "10px " + FONT;
      wrap(ctx, tr("ss.solarSub"), SOLAR.x + 12, SOLAR.y + 40, SOLAR.w - 24, 13);
      wrap(ctx, tr("ss.sidSub"), SID.x + 12, SID.y + 40, SID.w - 24, 13);

      dial(ctx, SOLAR.cx, SOLAR.cy, mod1(shownTime), true);
      dial(ctx, SID.cx, SID.cy, mod1(siderealFor(shownTime)), false);

      ctx.textAlign = "center";
      ctx.fillStyle = "#222222"; ctx.font = "10px " + FONT;
      ctx.fillText(tr("ss.solarDays") + ": " + solarDaysSinceVE(shownTime).toFixed(3),
        SOLAR.cx, SOLAR.y + SOLAR.h - 18);
      ctx.fillText(tr("ss.sidDays") + ": " + (solarDaysSinceVE(shownTime) * SPS).toFixed(3),
        SID.cx, SID.y + SID.h - 18);

      dayOfYear(ctx, tr);
      orbit(ctx, tr);
    });

    function panel(ctx, r) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#d3d3d3"; ctx.lineWidth = 1;
      ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
    }

    /* AnalogClock: one turn of the hour hand per day, so the face runs 0..23 */
    function dial(ctx, cx, cy, frac, amPm) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath(); ctx.arc(0, 0, CLOCK_R, 0, TAU);
      ctx.fillStyle = "#ffffff"; ctx.fill();
      ctx.strokeStyle = "#333333"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (var h = 0; h < 24; h++) {
        var a = h / 24 * TAU - Math.PI / 2;
        var major = h % 3 === 0;
        ctx.beginPath();
        ctx.moveTo((CLOCK_R - (major ? 8 : 4)) * Math.cos(a), (CLOCK_R - (major ? 8 : 4)) * Math.sin(a));
        ctx.lineTo(CLOCK_R * Math.cos(a), CLOCK_R * Math.sin(a));
        ctx.strokeStyle = "#555555"; ctx.lineWidth = major ? 1.4 : 0.8; ctx.stroke();
        ctx.fillStyle = major ? "#111111" : "#666666";
        ctx.font = (major ? "bold 11px " : "9px ") + FONT;
        ctx.fillText(String(h), (CLOCK_R - 17) * Math.cos(a), (CLOCK_R - 17) * Math.sin(a));
      }
      if (amPm) {                                // showAmPmLabels, on the solar dial only
        ctx.fillStyle = "#222222"; ctx.font = "9px " + FONT;
        ctx.fillText("12 " + I18N.t("ss.am"), 0, -CLOCK_R * 0.55);
        ctx.fillText("12 " + I18N.t("ss.pm"), 0, CLOCK_R * 0.55);
        ctx.fillText("6 " + I18N.t("ss.am"), CLOCK_R * 0.46, 0);
        ctx.fillText("6 " + I18N.t("ss.pm"), -CLOCK_R * 0.46, 0);
      }
      hand(ctx, frac, CLOCK_R * 0.58, 5, "#111111");            // hours
      hand(ctx, mod1(frac * 24), CLOCK_R * 0.86, 2, "#555555");  // minutes
      ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, TAU);
      ctx.fillStyle = "#111111"; ctx.fill();
      ctx.restore();
    }
    function hand(ctx, frac, len, w, colour) {
      var a = frac * TAU - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(-4 * Math.cos(a), -4 * Math.sin(a));
      ctx.lineTo(len * Math.cos(a), len * Math.sin(a));
      ctx.strokeStyle = colour; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.stroke();
    }

    /* DayOfYearSlider: a 390 px bar, one turn of the tropical year */
    function dayOfYear(ctx, tr) {
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#222222"; ctx.font = "bold 12px " + FONT;
      ctx.fillText(tr("ss.doy"), DOY.x + 12, DOY.y + 20);
      ctx.beginPath();
      ctx.moveTo(DOY.bx, DOY.by); ctx.lineTo(DOY.bx + DOY.bw, DOY.by);
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 2; ctx.stroke();
      ctx.textAlign = "center";
      ctx.font = "10px " + FONT; ctx.fillStyle = "#666666";
      var months = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
      for (var i = 0; i < months.length; i++) {
        var x = DOY.bx + DOY.bw * i / 12;
        ctx.beginPath(); ctx.moveTo(x, DOY.by); ctx.lineTo(x, DOY.by + 5);
        ctx.strokeStyle = "#bbbbbb"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillText(tr("m" + months[i]), x, DOY.by + 18);
      }
      var tx = DOY.bx + DOY.bw * (solarDaysSinceVE(shownTime) / YEAR);
      ctx.beginPath();
      ctx.moveTo(tx, DOY.by - 11); ctx.lineTo(tx + 5, DOY.by - 3);
      ctx.lineTo(tx - 5, DOY.by - 3); ctx.closePath();
      ctx.fillStyle = "#c8781e"; ctx.fill();
    }

    /* OrbitView: the Sun at the centre, the sky's right ascension round the rim */
    function orbit(ctx, tr) {
      ctx.fillStyle = "#000000"; ctx.fillRect(ORB.x, ORB.y, ORB.w, ORB.h);
      ctx.save();
      ctx.beginPath(); ctx.rect(ORB.x, ORB.y, ORB.w, ORB.h); ctx.clip();

      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff"; ctx.font = "12px " + FONT;
      ctx.fillText("0h", OC.x, ORB.y + 18);
      ctx.fillText(tr("ss.veLabel"), OC.x, ORB.y + 34);
      ctx.fillText("12h", OC.x, ORB.y + ORB.h - 18);
      ctx.textAlign = "left";
      ctx.fillText("6h", ORB.x + 10, OC.y);
      ctx.textAlign = "right";
      ctx.fillText("18h", ORB.x + ORB.w - 10, OC.y);

      ctx.beginPath(); ctx.arc(OC.x, OC.y, ORBIT_R, 0, TAU);
      ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 1; ctx.stroke();

      var glow = ctx.createRadialGradient(OC.x, OC.y, SUN_R * 0.3, OC.x, OC.y, SUN_R * 3);
      glow.addColorStop(0, "rgba(255,244,190,0.95)");
      glow.addColorStop(0.32, "rgba(255,230,140,0.30)");
      glow.addColorStop(1, "rgba(255,210,90,0)");
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(OC.x, OC.y, SUN_R * 3, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(OC.x, OC.y, SUN_R, 0, TAU);
      ctx.fillStyle = "#fff6d0"; ctx.fill();

      var ea = earthAngle();
      var ex = OC.x + ORBIT_R * Math.cos(ea), ey = OC.y + ORBIT_R * Math.sin(ea);
      /* globeAndFigure.rotation = 180 - (solarTime%1)*360 - angle, in Flash degrees
         (clockwise from up); the observer stands where that points.            */
      var spin = spinAngle();

      var g = ctx.createRadialGradient(ex - EARTH_R * 0.3, ey - EARTH_R * 0.35, EARTH_R * 0.1,
        ex, ey, EARTH_R * 1.25);
      g.addColorStop(0, "#9fd0f5"); g.addColorStop(1, "#2a5c95");
      ctx.beginPath(); ctx.arc(ex, ey, EARTH_R, 0, TAU);
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      /* the night side, away from the Sun */
      ctx.save();
      ctx.beginPath(); ctx.arc(ex, ey, EARTH_R, ea - Math.PI / 2, ea + Math.PI / 2);
      ctx.closePath();
      ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fill();
      ctx.restore();

      stick(ctx, ex, ey, spin);

      ctx.restore();
    }
    /* the little observer, standing on the globe and turning with it */
    /* the observer is anchored at the feet, so they sit on the globe rather
       than sinking a leg's length into it                                    */
    function stick(ctx, ex, ey, a) {
      var bx = ex + EARTH_R * Math.cos(a), by = ey + EARTH_R * Math.sin(a);
      var LEG = 5, HIP = -LEG;
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(a + Math.PI / 2);
      ctx.strokeStyle = "#ffe9a8"; ctx.fillStyle = "#ffe9a8";
      ctx.lineWidth = 1.4; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, HIP); ctx.lineTo(0, HIP - 9);          // torso
      ctx.moveTo(-4, HIP - 4); ctx.lineTo(4, HIP - 4);     // arms
      ctx.moveTo(0, HIP); ctx.lineTo(-3, 0);               // legs, down to the ground
      ctx.moveTo(0, HIP); ctx.lineTo(3, 0);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, HIP - 11.5, 2.6, 0, TAU); ctx.fill();
      ctx.restore();
    }

    function wrap(ctx, text, x, y, w, lh) {
      var words = String(text).split(" "), line = "";
      for (var i = 0; i < words.length; i++) {
        var probe = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(probe).width > w && line) {
          ctx.fillText(line, x, y); y += lh; line = words[i];
        } else line = probe;
      }
      if (line) ctx.fillText(line, x, y);
      return y;
    }

    sync();
  }
});
