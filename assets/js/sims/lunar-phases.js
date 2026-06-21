/* Lunar Phase Simulator -------------------------------------------------------
   A faithful re-creation of the NAAP "Lunar Phase Simulator" (lps.swf), rebuilt
   on the modern canvas framework. Mirrors the original's content & controls:
     • Orbit visualization (top-down, looking from above the North Pole):
       sunlight from the right, Earth with a draggable observer (time of day),
       the Moon draggable around its orbit, optional elongation angle, lunar
       landmark (synchronous rotation) and time tickmarks.
     • Moon Phase panel  — how the Moon looks from Earth, phase name, % illuminated,
       and the time since new moon (days + hours).
     • Horizon Diagram   — the observer's local sky (E–S–W), with the Sun and Moon
       placed by their hour angle, plus the observer's local time.
     • Animation and Time Controls — start/pause, animation rate, increment unit.
     • Diagram Options — show angle / lunar landmark / time tickmarks.
   Labels & structure follow the original astroUNL/flash-animations source
   (flashdev2/lunar_applet/english.as + lunarsim.txt).                          */
Sim.create({
  id: "lunar-phases",
  width: 860, height: 720,
  strings: {
    en: {
      "lp.anim": "Animation and Time Controls", "lp.start": "start animation", "lp.pause": "pause animation",
      "lp.step": "step", "lp.rate": "animation rate", "lp.increment": "increment animation",
      "lp.day": "day", "lp.hour": "hour", "lp.minute": "minute",
      "lp.options": "Diagram Options", "lp.angle": "show angle",
      "lp.landmark": "show lunar landmark", "lp.ticks": "show time tickmarks",
      "lp.moonPhase": "Moon Phase", "lp.horizon": "Horizon Diagram",
      "lp.obsTime": "observer's local time", "lp.since": "time since new moon",
      "lp.am": "am", "lp.pm": "pm",
      "lp.illum": "illuminated", "lp.phase": "Phase",
      "lp.sunlight": "sunlight", "lp.noon": "noon", "lp.sunset": "sunset",
      "lp.midnight": "midnight", "lp.sunrise": "sunrise",
      "lp.caption": "Looking down on Earth's North Pole",
      "lp.hint": "Drag the Moon around its orbit, or drag the observer to change the time of day.",
      "lp.facing": "facing south",
      "lp.days": "days", "lp.hours": "hours",
      "dir.N": "N", "dir.S": "S", "dir.E": "E", "dir.W": "W",
      "ph.new": "New Moon", "ph.wc": "Waxing Crescent", "ph.fq": "First Quarter",
      "ph.wg": "Waxing Gibbous", "ph.full": "Full Moon", "ph.ng": "Waning Gibbous",
      "ph.tq": "Third Quarter", "ph.wn": "Waning Crescent"
    },
    id: {
      "lp.anim": "Kontrol Animasi & Waktu", "lp.start": "mulai animasi", "lp.pause": "jeda animasi",
      "lp.step": "langkah", "lp.rate": "laju animasi", "lp.increment": "satuan langkah",
      "lp.day": "hari", "lp.hour": "jam", "lp.minute": "menit",
      "lp.options": "Opsi Diagram", "lp.angle": "tampilkan sudut",
      "lp.landmark": "tampilkan tengara Bulan", "lp.ticks": "tampilkan penanda waktu",
      "lp.moonPhase": "Fase Bulan", "lp.horizon": "Diagram Horizon",
      "lp.obsTime": "waktu lokal pengamat", "lp.since": "waktu sejak bulan baru",
      "lp.am": "pagi", "lp.pm": "malam",
      "lp.illum": "tersinari", "lp.phase": "Fase",
      "lp.sunlight": "sinar Matahari", "lp.noon": "tengah hari", "lp.sunset": "terbenam",
      "lp.midnight": "tengah malam", "lp.sunrise": "terbit",
      "lp.caption": "Dilihat dari atas Kutub Utara Bumi",
      "lp.hint": "Seret Bulan mengelilingi orbitnya, atau seret pengamat untuk mengubah waktu.",
      "lp.facing": "menghadap selatan",
      "lp.days": "hari", "lp.hours": "jam",
      "dir.N": "U", "dir.S": "S", "dir.E": "T", "dir.W": "B",
      "ph.new": "Bulan Baru", "ph.wc": "Sabit Awal", "ph.fq": "Kuartal Pertama",
      "ph.wg": "Cembung Awal", "ph.full": "Purnama", "ph.ng": "Cembung Akhir",
      "ph.tq": "Kuartal Akhir", "ph.wn": "Sabit Akhir"
    }
  },
  about: {
    en: "<p>Half of the Moon is always lit by the Sun. The <strong>phases</strong> happen because, as the Moon orbits Earth, " +
        "we view that lit half from a changing angle — it is the geometry of the orbit, <em>not</em> Earth's shadow, that makes the phases.</p>" +
        "<h3>The three views</h3>" +
        "<p>The <strong>orbit panel</strong> looks down on Earth's North Pole with sunlight streaming in from the right, so every body's right hemisphere is in daylight. " +
        "The <strong>Moon Phase</strong> panel shows the Moon as it would appear from Earth, and the <strong>Horizon Diagram</strong> shows where the Sun and Moon sit in the sky of the stick-figure observer (assumed to be at mid-northern latitudes).</p>" +
        "<h3>Try it</h3>" +
        "<p>Drag the <strong>Moon</strong> around its orbit to step through the phases, and drag the <strong>observer</strong> around the globe to change the time of day and watch the Sun and Moon rise and set. " +
        "Turn on <strong>show lunar landmark</strong> to see how the same face of the Moon always points toward Earth (synchronous rotation).</p>" +
        "<p>The cycle from one new moon to the next — the <strong>synodic month</strong> — takes about 29.5 days.</p>",
    id: "<p>Separuh Bulan selalu disinari Matahari. <strong>Fase</strong> terjadi karena, saat Bulan mengorbit Bumi, " +
        "kita melihat separuh yang tersinari itu dari sudut yang berubah — geometri orbit inilah, <em>bukan</em> bayangan Bumi, yang menciptakan fase.</p>" +
        "<h3>Tiga tampilan</h3>" +
        "<p>Panel <strong>orbit</strong> dilihat dari atas Kutub Utara Bumi dengan sinar Matahari datang dari kanan, sehingga belahan kanan setiap benda berada di siang hari. " +
        "Panel <strong>Fase Bulan</strong> menampilkan Bulan seperti terlihat dari Bumi, dan <strong>Diagram Horizon</strong> menunjukkan posisi Matahari dan Bulan di langit pengamat (diasumsikan di lintang menengah utara).</p>" +
        "<h3>Cobalah</h3>" +
        "<p>Seret <strong>Bulan</strong> mengelilingi orbitnya untuk menelusuri fase, dan seret <strong>pengamat</strong> mengelilingi Bumi untuk mengubah waktu serta melihat Matahari dan Bulan terbit dan terbenam. " +
        "Aktifkan <strong>tampilkan tengara Bulan</strong> untuk melihat bagaimana sisi Bulan yang sama selalu menghadap Bumi (rotasi sinkron).</p>" +
        "<p>Siklus dari satu bulan baru ke berikutnya — <strong>bulan sinodis</strong> — memakan waktu sekitar 29,5 hari.</p>"
  },
  build: function (S) {
    /* ---- palette (matches the site's dark theme) ---- */
    var C = {
      panel: "#0e1530", panelHi: "#121b39", border: "#2c3a66", grid: "#22305a",
      text: "#e8ecf8", dim: "#9fabce", accent: "#6ea8fe", accent2: "#b692ff",
      warm: "#ffd166", moonLit: "#e9eefb", moonDark: "#1b2236",
      earthLit: "#3b6fd6", earthDark: "#16315f", sun: "#ffd166",
      day: "#1a2b52", twilight: "#3a2a55", night: "#070b1a", ground: "#14213f"
    };

    /* ---- panel rectangles (logical canvas units) ----
       Layout mirrors the original: big orbit panel on the left, with the Moon
       Phase panel (top) and Horizon Diagram (bottom) stacked on the right.     */
    var VIS  = { x: 14,  y: 30,  w: 470, h: 676 };
    var PH   = { x: 498, y: 30,  w: 348, h: 320 };
    var HOR  = { x: 498, y: 364, w: 348, h: 342 };

    var EC = { x: VIS.x + VIS.w * 0.5, y: VIS.y + VIS.h * 0.5 };  // Earth centre
    var RORB = 200, REARTH = 34, RMOON = 14;
    var D2R = Math.PI / 180;

    /* ---- state ----
       moonHours : time since new moon (0..SYN_H)   -> orbital angle, phase
       obsTime   : observer's local solar time (0..24) -> Earth's rotation     */
    var SYN = 29.53, SYN_H = SYN * 24;
    var moonHours = 4 * 24;     // ~day 4: a waxing crescent
    var obsTime = 18;          // 6 pm — crescent visible in the western sky at sunset
    var unitHours = { day: 24, hour: 1, minute: 1 / 60 };
    var unit = "hour", rate = 5;

    function wrap(v, m) { return ((v % m) + m) % m; }
    function moonAngle() { return wrap(moonHours / SYN_H * 360, 360); }   // deg, CCW from Sun
    function obsPhi() { return (obsTime - 12) * 15; }                     // deg, CCW from Sun
    function illumFrac() { return (1 - Math.cos(moonAngle() * Math.PI / 180)) / 2; }

    function phaseKey() {
      var p = moonAngle() / 360, e = 0.012;
      if (p < e || p > 1 - e) return "ph.new";
      if (Math.abs(p - 0.25) < e) return "ph.fq";
      if (Math.abs(p - 0.5) < e) return "ph.full";
      if (Math.abs(p - 0.75) < e) return "ph.tq";
      if (p < 0.25) return "ph.wc"; if (p < 0.5) return "ph.wg";
      if (p < 0.75) return "ph.ng"; return "ph.wn";
    }
    function fmtSince() {
      var d = Math.floor(moonHours / 24), h = Math.floor(moonHours % 24);
      return d + " " + I18N.t(d === 1 ? "lp.day" : "lp.days") + ", " +
             h + " " + I18N.t(h === 1 ? "lp.hour" : "lp.hours");
    }
    function fmtClock() {
      var h = Math.floor(obsTime), m = Math.round((obsTime - h) * 60);
      if (m === 60) { m = 0; h = (h + 1) % 24; }
      var mm = (m < 10 ? "0" : "") + m;
      if (I18N.getLang() === "id") return ((h < 10 ? "0" : "") + h) + ":" + mm;  // 24-hour
      var ap = h < 12 ? I18N.t("lp.am") : I18N.t("lp.pm");
      var h12 = h % 12; if (h12 === 0) h12 = 12;
      return h12 + ":" + mm + " " + ap;
    }

    /* ---- controls : Animation and Time Controls ---- */
    S.group("lp.anim");
    var acc = 0;
    var loop = S.loop(function (dt) {
      acc += dt; var sd = 1 / Math.max(rate, 0.01), n = 0;
      while (acc >= sd && n < 600) { acc -= sd; stepOnce(1); n++; }
    });
    function stepOnce(dir) {
      var dh = dir * unitHours[unit];
      moonHours = wrap(moonHours + dh, SYN_H);
      obsTime = wrap(obsTime + dh, 24);
      upd();
    }
    var playBtn = S.button({ labelKey: "lp.start", primary: true, on: function () { loop.toggle(); syncPlay(); } });
    S.button({ labelKey: "lp.step", on: function () { loop.pause(); syncPlay(); stepOnce(1); } });
    function syncPlay() {
      var k = loop.playing ? "lp.pause" : "lp.start";
      playBtn.setAttribute("data-i18n", k); playBtn.textContent = I18N.t(k);
    }
    S.refreshers.push(syncPlay);

    S.slider({ labelKey: "lp.rate", min: 1, max: 12, value: rate, step: 1,
      format: function (v) { return v + "/s"; }, on: function (v) { rate = v; } });
    S.select({ labelKey: "lp.increment", value: unit, on: function (v) { unit = v; },
      options: [{ v: "day", labelKey: "lp.day" }, { v: "hour", labelKey: "lp.hour" }, { v: "minute", labelKey: "lp.minute" }] });

    /* ---- controls : Diagram Options ---- */
    S.group("lp.options");
    var optAngle = S.toggle({ labelKey: "lp.angle", value: false });
    var optLandmark = S.toggle({ labelKey: "lp.landmark", value: false });
    var optTicks = S.toggle({ labelKey: "lp.ticks", value: false });

    /* ---- readouts ---- */
    var outPhase = S.readout({ labelKey: "lp.phase" });
    var outIllum = S.readout({ labelKey: "lp.illum" });
    var outSince = S.readout({ labelKey: "lp.since" });
    var outClock = S.readout({ labelKey: "lp.obsTime" });
    function upd() {
      outPhase(I18N.t(phaseKey()));
      outIllum(Math.round(illumFrac() * 100) + "%");
      var d = Math.floor(moonHours / 24), h = Math.floor(moonHours % 24);
      outSince(d + "d " + h + "h");
      outClock(fmtClock());
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- direct manipulation : drag the Moon / drag the observer ---- */
    var drag = null;  // "moon" | "obs" | null
    function evtPos(e) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (S.W / r.width), y: (e.clientY - r.top) * (S.H / r.height) };
    }
    function angleAt(p) { return wrap(Math.atan2(-(p.y - EC.y), p.x - EC.x) * 180 / Math.PI, 360); }
    function moonScreen() {
      var a = moonAngle() * Math.PI / 180;
      return { x: EC.x + RORB * Math.cos(a), y: EC.y - RORB * Math.sin(a) };
    }
    function obsScreen() {
      var a = obsPhi() * Math.PI / 180;
      return { x: EC.x + REARTH * Math.cos(a), y: EC.y - REARTH * Math.sin(a) };
    }
    function hit(p) {
      var m = moonScreen(); if (Math.hypot(p.x - m.x, p.y - m.y) < 26) return "moon";
      if (Math.hypot(p.x - EC.x, p.y - EC.y) < REARTH + 24 &&
          Math.hypot(p.x - EC.x, p.y - EC.y) > 6) return "obs";
      return null;
    }
    S.canvas.style.touchAction = "none";
    S.canvas.addEventListener("pointerdown", function (e) {
      var p = evtPos(e), h = hit(p);
      if (!h) return;
      drag = h; loop.pause(); syncPlay();
      S.canvas.setPointerCapture(e.pointerId); applyDrag(p); e.preventDefault();
    });
    S.canvas.addEventListener("pointermove", function (e) {
      var p = evtPos(e);
      if (drag) { applyDrag(p); return; }
      S.canvas.style.cursor = hit(p) ? "grab" : "default";
    });
    function endDrag() { drag = null; }
    S.canvas.addEventListener("pointerup", endDrag);
    S.canvas.addEventListener("pointercancel", endDrag);
    function applyDrag(p) {
      var a = angleAt(p);
      if (drag === "moon") moonHours = wrap(a / 360 * SYN_H, SYN_H);
      else if (drag === "obs") obsTime = wrap(12 + a / 15, 24);
      upd();
    }

    /* ===================================================================== */
    S.onDraw(function () {
      var ctx = S.ctx;
      S.clear();
      drawVis(ctx);
      drawMoonPhasePanel(ctx);
      drawHorizon(ctx);
    });

    /* ---------- panel chrome ---------- */
    function panel(ctx, r) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12);
      ctx.fillStyle = C.panel; ctx.fill();
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.stroke();
    }
    function panelTitle(ctx, r, key) {
      ctx.fillStyle = C.accent; ctx.font = "700 12px system-ui"; ctx.textAlign = "left";
      ctx.fillText(I18N.t(key).toUpperCase(), r.x + 14, r.y + 20);
    }

    /* ---------- orbit visualization ---------- */
    function drawVis(ctx) {
      panel(ctx, VIS);
      var lang = I18N.getLang();

      // sunlight streaming from the right
      ctx.save();
      roundRect(ctx, VIS.x, VIS.y, VIS.w, VIS.h, 12); ctx.clip();
      var gx = ctx.createLinearGradient(VIS.x + VIS.w, 0, VIS.x + VIS.w - 150, 0);
      gx.addColorStop(0, "rgba(255,209,102,0.18)"); gx.addColorStop(1, "rgba(255,209,102,0)");
      ctx.fillStyle = gx; ctx.fillRect(VIS.x, VIS.y, VIS.w, VIS.h);
      ctx.strokeStyle = "rgba(255,209,102,0.40)"; ctx.lineWidth = 1.5;
      for (var y = VIS.y + 60; y < VIS.y + VIS.h - 30; y += 46) {
        var x0 = VIS.x + VIS.w - 16, x1 = VIS.x + 26;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y);
        ctx.lineTo(x1 + 9, y - 5); ctx.moveTo(x1, y); ctx.lineTo(x1 + 9, y + 5); ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle = C.warm; ctx.font = "12px system-ui"; ctx.textAlign = "right";
      ctx.fillText("☀ " + I18N.t("lp.sunlight"), VIS.x + VIS.w - 14, VIS.y + 40);

      panelTitle(ctx, VIS, "lp.caption");

      // moon orbit
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.arc(EC.x, EC.y, RORB, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);

      // time-of-day tickmarks + named labels around Earth (only when requested)
      if (optTicks.value()) {
        for (var hh = 0; hh < 24; hh++) {
          var aa = (hh - 12) * 15 * Math.PI / 180, major = hh % 3 === 0;
          var r0 = REARTH + 4, r1 = REARTH + (major ? 14 : 8);
          ctx.strokeStyle = major ? C.dim : C.grid; ctx.lineWidth = major ? 1.5 : 1;
          ctx.beginPath();
          ctx.moveTo(EC.x + r0 * Math.cos(aa), EC.y - r0 * Math.sin(aa));
          ctx.lineTo(EC.x + r1 * Math.cos(aa), EC.y - r1 * Math.sin(aa)); ctx.stroke();
        }
        ctx.font = "11px system-ui"; ctx.fillStyle = C.dim;
        label("lp.noon", 0); label("lp.sunset", 90); label("lp.midnight", 180); label("lp.sunrise", 270);
        function label(key, deg) {
          var a = deg * Math.PI / 180, rr = REARTH + 28;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(I18N.t(key), EC.x + rr * Math.cos(a), EC.y - rr * Math.sin(a));
        }
        ctx.textBaseline = "alphabetic";
      }

      // Earth (right hemisphere = day)
      halfLit(ctx, EC.x, EC.y, REARTH, C.earthLit, C.earthDark);

      // elongation angle
      if (optAngle.value()) {
        var th = moonAngle(), elong = th <= 180 ? th : 360 - th, ar = REARTH + 40;
        ctx.strokeStyle = C.accent2; ctx.lineWidth = 2;
        ctx.beginPath();
        if (th <= 180) ctx.arc(EC.x, EC.y, ar, 0, -th * Math.PI / 180, true);
        else ctx.arc(EC.x, EC.y, ar, 0, (360 - th) * Math.PI / 180, false);
        ctx.stroke();
        var mid = (th <= 180 ? th / 2 : -(360 - th) / 2) * Math.PI / 180;
        ctx.fillStyle = C.accent2; ctx.font = "bold 12px system-ui";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(Math.round(elong) + "°", EC.x + (ar + 14) * Math.cos(mid), EC.y - (ar + 14) * Math.sin(mid));
        ctx.textBaseline = "alphabetic";
      }

      // observer (the draggable stick figure / handle on Earth)
      var o = obsScreen(), oa = obsPhi() * Math.PI / 180;
      ctx.strokeStyle = "#dfe8ff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(o.x, o.y);
      ctx.lineTo(o.x + 9 * Math.cos(oa), o.y - 9 * Math.sin(oa)); ctx.stroke();
      ctx.fillStyle = C.accent; ctx.beginPath();
      ctx.arc(o.x + 12 * Math.cos(oa), o.y - 12 * Math.sin(oa), 3.4, 0, 2 * Math.PI); ctx.fill();

      // sight line Earth -> Moon
      var m = moonScreen();
      ctx.strokeStyle = "rgba(110,168,254,0.45)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(EC.x, EC.y); ctx.lineTo(m.x, m.y); ctx.stroke(); ctx.setLineDash([]);

      // Moon (right hemisphere = lit)
      halfLit(ctx, m.x, m.y, RMOON, C.moonLit, C.moonDark);

      // lunar landmark on the near (Earth-facing) side
      if (optLandmark.value()) {
        var ux = (EC.x - m.x), uy = (EC.y - m.y), d = Math.hypot(ux, uy); ux /= d; uy /= d;
        ctx.strokeStyle = C.accent2; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + ux * RMOON, m.y + uy * RMOON); ctx.stroke();
        marker(ctx, m.x + ux * (RMOON - 2), m.y + uy * (RMOON - 2));
      }

      // interaction hint
      ctx.fillStyle = C.dim; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      wrapText(ctx, I18N.t("lp.hint"), EC.x, VIS.y + VIS.h - 30, VIS.w - 40, 14);
    }

    /* ---------- Moon Phase panel ---------- */
    function drawMoonPhasePanel(ctx) {
      panel(ctx, PH); panelTitle(ctx, PH, "lp.moonPhase");
      var cx = PH.x + PH.w / 2, cy = PH.y + 172, r = 74;

      ctx.fillStyle = C.text; ctx.font = "bold 16px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.t(phaseKey()), cx, PH.y + 78);

      moonDisk(ctx, cx, cy, r, moonAngle());

      // landmark on the near side (always visible from Earth)
      if (optLandmark.value()) marker(ctx, cx, cy - r * 0.34);

      ctx.fillStyle = C.warm; ctx.font = "14px system-ui";
      ctx.fillText(Math.round(illumFrac() * 100) + "% " + I18N.t("lp.illum"), cx, cy + r + 24);
      ctx.fillStyle = C.dim; ctx.font = "11px system-ui";
      ctx.fillText(I18N.t("lp.since"), cx, cy + r + 44);
      ctx.fillStyle = C.text; ctx.font = "13px system-ui";
      ctx.fillText(fmtSince(), cx, cy + r + 62);
    }

    /* ---------- Horizon Diagram (3-D celestial sphere) ----------
       The observer's local sky as a tilted globe: a green horizon plane with the
       stick-figure observer at its centre, the sky dome above and the ground
       below, and the Sun & Moon riding their diurnal path. Mid-northern latitude;
       the Sun/Moon are placed by hour angle (the LPS ignores seasonal declination). */
    function drawHorizon(ctx) {
      panel(ctx, HOR); panelTitle(ctx, HOR, "lp.horizon");
      var SCx = HOR.x + HOR.w / 2, SCy = HOR.y + HOR.h / 2 + 8, R = 120;
      var LAT = 40 * D2R, TILT = 26 * D2R;
      var sinB = Math.sin(TILT), cosB = Math.cos(TILT), sinL = Math.sin(LAT), cosL = Math.cos(LAT);
      var rx = R, ry = R * sinB;

      // (East, North, Up) unit direction -> screen point. We look toward the south
      // and tilt down by TILT, so the southern sky (where the Sun & Moon transit)
      // arcs high overhead and they visibly rise in the east and set in the west.
      function projVec(E, N, U) {
        return { x: SCx - R * E, y: SCy - R * (U * cosB - N * sinB), depth: N * cosB + U * sinB };
      }
      function project(alt, az) { var c = Math.cos(alt); return projVec(c * Math.sin(az), c * Math.cos(az), Math.sin(alt)); }
      function unit3(alt, az) { var c = Math.cos(alt); return { E: c * Math.sin(az), N: c * Math.cos(az), U: Math.sin(alt) }; }
      // equatorial (hour angle, declination) -> horizon (alt, az from N, +E)
      function eq2hor(HA, dec) {
        var sinAlt = clamp(sinL * Math.sin(dec) + cosL * Math.cos(dec) * Math.cos(HA), -1, 1);
        var alt = Math.asin(sinAlt), cA = Math.cos(alt) || 1e-6;
        var az = Math.atan2(-Math.cos(dec) * Math.sin(HA) / cA, (Math.sin(dec) - sinL * sinAlt) / (cosL * cA));
        return { alt: alt, az: az };
      }

      var haSun = obsPhi() * D2R, haMoon = (obsPhi() - moonAngle()) * D2R;
      var hSun = eq2hor(haSun, 0), hMoon = eq2hor(haMoon, 0);
      var night = hSun.alt < -0.10, twilight = !night && hSun.alt < 0.12;

      ctx.save();
      roundRect(ctx, HOR.x + 1, HOR.y + 1, HOR.w - 2, HOR.h - 2, 11); ctx.clip();

      // sky dome (above horizon): top of sphere closed by the back rim of the horizon
      var skyTop = night ? "#0b1733" : twilight ? "#3a2f63" : "#5b9bd8";
      var skyHor = night ? "#16244a" : twilight ? "#c8794a" : "#c2dcf3";
      ctx.beginPath();
      ctx.arc(SCx, SCy, R, Math.PI, 2 * Math.PI, false);
      ctx.ellipse(SCx, SCy, rx, ry, 0, 2 * Math.PI, Math.PI, true);
      ctx.closePath();
      var sg = ctx.createLinearGradient(0, SCy - R, 0, SCy + ry);
      sg.addColorStop(0, skyTop); sg.addColorStop(1, skyHor);
      ctx.fillStyle = sg; ctx.fill();

      // below the horizon plane (the underside) -> dark
      ctx.beginPath();
      ctx.arc(SCx, SCy, R, 0, Math.PI, false);
      ctx.ellipse(SCx, SCy, rx, ry, 0, Math.PI, 0, true);
      ctx.closePath();
      ctx.fillStyle = "#070d09"; ctx.fill();

      // diurnal path of the Sun & Moon (the celestial equator at this latitude)
      drawDiurnal(0, "rgba(255,255,255,0.55)");
      function drawDiurnal(dec, col) {
        for (var seg = 0; seg < 2; seg++) {           // seg 0 = above horizon, 1 = below
          ctx.beginPath(); var pen = false;
          for (var a = 0; a <= 360; a += 4) {
            var h = eq2hor(a * D2R, dec);
            if ((h.alt >= 0) !== (seg === 0)) { pen = false; continue; }
            var p = project(h.alt, h.az);
            pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
          }
          ctx.strokeStyle = col; ctx.lineWidth = seg === 0 ? 1.4 : 1;
          ctx.globalAlpha = seg === 0 ? 1 : 0.25; ctx.stroke(); ctx.globalAlpha = 1;
        }
      }

      // horizon plane (the ground the observer stands on)
      var gTop = night ? "#1c3528" : "#4f9b50", gBot = night ? "#102017" : "#2f6b35";
      ctx.beginPath(); ctx.ellipse(SCx, SCy, rx, ry, 0, 0, 2 * Math.PI);
      var gg = ctx.createLinearGradient(0, SCy - ry, 0, SCy + ry);
      gg.addColorStop(0, gBot); gg.addColorStop(1, gTop);
      ctx.fillStyle = gg; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();

      // sphere outline
      ctx.strokeStyle = C.border; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(SCx, SCy, R, 0, 2 * Math.PI); ctx.stroke();

      // show angle: great-circle arc between Sun and Moon, labelled with the elongation
      if (optAngle.value()) {
        var v0 = unit3(hSun.alt, hSun.az), v1 = unit3(hMoon.alt, hMoon.az);
        var om = Math.acos(clamp(v0.E * v1.E + v0.N * v1.N + v0.U * v1.U, -1, 1)), s = Math.sin(om);
        var p0 = project(hSun.alt, hSun.az), p1 = project(hMoon.alt, hMoon.az);
        ctx.strokeStyle = C.accent2; ctx.lineWidth = 1.6; ctx.setLineDash([4, 3]); ctx.beginPath();
        if (s < 0.02) { ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); }   // (anti)parallel: slerp degenerates
        else {
          for (var t = 0; t <= 1.0001; t += 0.05) {
            var k0 = Math.sin((1 - t) * om) / s, k1 = Math.sin(t * om) / s;
            var p = projVec(k0 * v0.E + k1 * v1.E, k0 * v0.N + k1 * v1.N, k0 * v0.U + k1 * v1.U);
            t === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          }
        }
        ctx.stroke(); ctx.setLineDash([]);
        var th = moonAngle(), elong = th <= 180 ? th : 360 - th;
        ctx.fillStyle = C.accent2; ctx.font = "bold 11px system-ui"; ctx.textAlign = "center";
        ctx.fillText(Math.round(elong) + "°", (p0.x + p1.x) / 2, (p0.y + p1.y) / 2 - 6);
      }

      // Sun & Moon (faded when below the horizon)
      body(hSun, function (x, y) {
        var g = ctx.createRadialGradient(x, y, 1, x, y, 12);
        g.addColorStop(0, "#fff6cf"); g.addColorStop(1, C.sun);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 8, 0, 2 * Math.PI); ctx.fill();
      });
      body(hMoon, function (x, y) { moonDisk(ctx, x, y, 8, moonAngle()); });
      function body(h, paint) {
        var p = project(h.alt, h.az);
        if (h.alt >= 0) { paint(p.x, p.y); }
        else { ctx.save(); ctx.globalAlpha = 0.3; paint(p.x, p.y); ctx.restore(); }
      }

      // observer at the centre of the horizon plane
      stick(ctx, SCx, SCy);

      // cardinal points around the horizon (N back, S front, E left, W right)
      ctx.fillStyle = "#eaf2ff"; ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(I18N.t("dir.S"), SCx, SCy - ry - 9);
      ctx.fillText(I18N.t("dir.N"), SCx, SCy + ry + 10);
      ctx.fillText(I18N.t("dir.E"), SCx - R - 10, SCy);
      ctx.fillText(I18N.t("dir.W"), SCx + R + 10, SCy);
      ctx.textBaseline = "alphabetic";

      // observer's local time
      ctx.textAlign = "center"; ctx.font = "12px system-ui"; ctx.fillStyle = C.dim;
      ctx.fillText(I18N.t("lp.obsTime"), SCx, HOR.y + HOR.h - 26);
      ctx.fillStyle = C.warm; ctx.font = "bold 14px system-ui";
      ctx.fillText(fmtClock(), SCx, HOR.y + HOR.h - 8);
    }

    /* ---------- small drawing helpers ---------- */
    // disk whose right hemisphere faces the Sun (used in the top-down orbit view)
    function halfLit(ctx, x, y, r, lit, dark) {
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.clip();
      ctx.fillStyle = dark; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
      ctx.fillStyle = lit; ctx.fillRect(x, y - r, r, 2 * r); ctx.restore();
      ctx.strokeStyle = "#0b1020"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.stroke();
    }
    // Moon as seen from Earth. angle: 0=new .25→first quarter .5=full .75=third.
    function moonDisk(ctx, cx, cy, r, deg) {
      ctx.save(); ctx.translate(cx, cy);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 2 * Math.PI); ctx.fillStyle = C.moonDark; ctx.fill();
      var p = wrap(deg, 360) / 360;
      if (p > 0.5) { ctx.scale(-1, 1); p = 1 - p; }       // mirror waning → waxing
      var s = Math.cos(2 * Math.PI * p);                  // +1 new, 0 quarter, −1 full
      ctx.beginPath();
      ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false); // bright right limb
      ctx.save(); ctx.scale(s === 0 ? 1e-4 : s, 1);
      ctx.arc(0, 0, r, Math.PI / 2, -Math.PI / 2, true);  // terminator
      ctx.restore(); ctx.closePath();
      ctx.fillStyle = C.moonLit; ctx.fill();
      ctx.restore();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = C.border; ctx.lineWidth = 1.5; ctx.stroke();
    }
    function marker(ctx, x, y) {
      ctx.beginPath(); ctx.arc(x, y, 3.6, 0, 2 * Math.PI);
      ctx.fillStyle = C.accent2; ctx.fill();
      ctx.lineWidth = 1.2; ctx.strokeStyle = "#0b1020"; ctx.stroke();
    }
    // little stick-figure observer, feet at (x, baseY)
    function stick(ctx, x, baseY) {
      var top = baseY - 17;
      ctx.fillStyle = "#0d1430";
      ctx.beginPath(); ctx.arc(x, top, 3, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "#0d1430"; ctx.lineWidth = 1.7; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, top + 3); ctx.lineTo(x, baseY - 6);          // body
      ctx.moveTo(x - 5, top + 7); ctx.lineTo(x + 5, top + 7);     // arms
      ctx.moveTo(x, baseY - 6); ctx.lineTo(x - 4, baseY);         // legs
      ctx.moveTo(x, baseY - 6); ctx.lineTo(x + 4, baseY);
      ctx.stroke(); ctx.lineCap = "butt";
    }
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    function wrapText(ctx, text, cx, y, maxw, lh) {
      var words = text.split(" "), line = "", lines = [];
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(test).width > maxw && line) { lines.push(line); line = words[i]; }
        else line = test;
      }
      if (line) lines.push(line);
      for (var j = 0; j < lines.length; j++) ctx.fillText(lines[j], cx, y + j * lh);
    }

    upd();
  }
});
