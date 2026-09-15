/* Paths of the Sun -------------------------------------------------------------
   Faithful rebuild of the ClassAction "sunpaths.swf": a horizon diagram showing
   how the Sun's daily path across the sky changes with the observer's latitude
   and with the season. The original draws four curves on a grassy celestial
   sphere and names them in a legend — celestial equator, ecliptic, the Sun's
   path on the given day, and the north-south meridian — with a latitude slider,
   an "animate" checkbox that walks the date through the year, and a big date
   readout. The sphere can be spun by dragging it, exactly as in the SWF.        */
Sim.create({
  id: "sunpaths",
  width: 640, height: 540,
  strings: {
    en: {
      "sp.obs": "Observer", "sp.lat": "latitude", "sp.day": "day of year", "sp.time": "time of day",
      "sp.anim": "Animation", "sp.speed": "days per second", "sp.animate": "animate through the year",
      "sp.show": "Show", "sp.ce": "celestial equator", "sp.ecl": "ecliptic",
      "sp.path": "Sun's path on the given day", "sp.mer": "north-south meridian", "sp.stick": "observer",
      "sp.dec": "Sun's declination", "sp.alt": "Sun's altitude", "sp.az": "Sun's azimuth",
      "sp.rise": "sunrise", "sp.set": "sunset", "sp.len": "hours of daylight",
      "sp.drag": "drag the sphere to spin it around",
      "sp.up": "up all day", "sp.down": "down all day",
      "dir.N": "N", "dir.S": "S", "dir.E": "E", "dir.W": "W"
    },
    id: {
      "sp.obs": "Pengamat", "sp.lat": "lintang", "sp.day": "hari ke-", "sp.time": "waktu hari",
      "sp.anim": "Animasi", "sp.speed": "hari per detik", "sp.animate": "animasikan sepanjang tahun",
      "sp.show": "Tampilkan", "sp.ce": "ekuator langit", "sp.ecl": "ekliptika",
      "sp.path": "lintasan Matahari pada hari itu", "sp.mer": "meridian utara–selatan", "sp.stick": "pengamat",
      "sp.dec": "deklinasi Matahari", "sp.alt": "altitudo Matahari", "sp.az": "azimut Matahari",
      "sp.rise": "matahari terbit", "sp.set": "matahari terbenam", "sp.len": "lama siang",
      "sp.drag": "seret bola langit untuk memutarnya",
      "sp.up": "di atas horizon sepanjang hari", "sp.down": "di bawah horizon sepanjang hari",
      "dir.N": "U", "dir.S": "S", "dir.E": "T", "dir.W": "B"
    }
  },
  about: {
    en: "<p>The Sun rises, arcs across the sky and sets along a circle called its <strong>diurnal path</strong>. That circle is fixed by just one number — the Sun's <strong>declination</strong> — and its tilt relative to your horizon is fixed by your <strong>latitude</strong>. Everything else about sunrise, sunset and noon height follows from those two.</p>" +
        "<p>Because Earth's axis is tilted 23.4°, the Sun's declination swings from +23.4° at the June solstice to −23.4° in December, riding the <strong>ecliptic</strong>. So the whole daily path slides north and south through the year: high and long in summer, low and short in winter. On the equinoxes the Sun sits on the <strong>celestial equator</strong>, rises due east and sets due west everywhere on Earth.</p>" +
        "<p>Try latitude 0° — the paths stand straight up, every day is 12 hours. Try 90° — they lie flat, and the Sun simply circles at constant altitude for six months before vanishing for six more. At 66.6° and beyond, midsummer paths never touch the horizon at all.</p>",
    id: "<p>Matahari terbit, melengkung melintasi langit, lalu terbenam sepanjang sebuah lingkaran yang disebut <strong>lintasan hariannya</strong>. Lingkaran itu ditentukan oleh satu angka saja — <strong>deklinasi</strong> Matahari — dan kemiringannya terhadap horizon Anda ditentukan oleh <strong>lintang</strong>. Semua hal lain tentang terbit, terbenam, dan tinggi tengah hari mengikuti keduanya.</p>" +
        "<p>Karena sumbu Bumi miring 23,4°, deklinasi Matahari berayun dari +23,4° pada solstis Juni hingga −23,4° pada Desember, menyusuri <strong>ekliptika</strong>. Maka seluruh lintasan harian bergeser ke utara dan selatan sepanjang tahun: tinggi dan panjang saat musim panas, rendah dan pendek saat musim dingin. Pada ekuinoks Matahari berada di <strong>ekuator langit</strong>, terbit tepat di timur dan terbenam tepat di barat di seluruh Bumi.</p>" +
        "<p>Coba lintang 0° — lintasannya tegak lurus, setiap hari 12 jam. Coba 90° — lintasannya mendatar, dan Matahari hanya berputar pada ketinggian tetap selama enam bulan lalu menghilang enam bulan berikutnya. Pada 66,6° ke atas, lintasan pertengahan musim panas tak pernah menyentuh horizon.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = Math.PI * 2, EPS = 23.44 * D2R;
    var C = {
      panel: "#0e1530", border: "#2c3a66", text: "#e8ecf8", dim: "#9fabce",
      ce: "#dbe6ff", ecl: "#ff6b6b", path: "#ffd166", mer: "#9aa7c4", sun: "#ffd166"
    };
    var MONTHS = { en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                   id: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"] };
    var CUM = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

    /* ---- state (defaults match the SWF's opening screen: 41.0 N, March 21) ---- */
    var lat = 41.0, day = 80, time = 9.0, speed = 20;
    var AC = 225 * D2R;                        // camera azimuth — the sphere spins on drag

    function decOf(d) { return EPS * Math.sin(TAU * (d - 80) / 365.2422); }
    function monthDay(d) {
      var i = 11; while (i > 0 && d <= CUM[i]) i--;
      return { m: i, dd: Math.round(d - CUM[i]) };
    }
    // pole-robust equatorial → horizontal (works at ±90° latitude)
    function eq2hor(HA, dec, latR) {
      var sd = Math.sin(dec), cd = Math.cos(dec), sl = Math.sin(latR), cl = Math.cos(latR);
      var alt = Math.asin(sd * sl + cd * cl * Math.cos(HA));
      var xS = cd * Math.cos(HA) * sl - sd * cl, yW = cd * Math.sin(HA);
      return { alt: alt, az: Math.atan2(-yW, -xS) };
    }

    /* ---- camera: orthographic, 32° above the horizon, azimuth AC (draggable) ---- */
    var SCx = 300, SCy = 262, R = 208, EC = 32 * D2R;
    var rx = R, ry = R * Math.sin(EC);         // the horizon ellipse stays axis-aligned
    var camv, rightv, upv;
    function setCam() {
      camv = { e: Math.sin(AC) * Math.cos(EC), n: Math.cos(AC) * Math.cos(EC), u: Math.sin(EC) };
      var m = Math.hypot(camv.n, camv.e) || 1;
      rightv = { e: -camv.n / m, n: camv.e / m, u: 0 };
      upv = { e: -rightv.n * camv.u, n: rightv.e * camv.u, u: rightv.n * camv.e - rightv.e * camv.n };
    }
    setCam();
    function projDir(E, N, U) {
      return { x: SCx + R * (E * rightv.e + N * rightv.n + U * rightv.u),
               y: SCy - R * (E * upv.e + N * upv.n + U * upv.u),
               z: E * camv.e + N * camv.n + U * camv.u };
    }
    function project(alt, az) { var c = Math.cos(alt); return projDir(c * Math.sin(az), c * Math.cos(az), Math.sin(alt)); }
    /* Stroke one half of a curve: `above` picks the part in the sky, otherwise the
       part under the ground. They are drawn in separate passes so the opaque
       horizon plane can be painted between them — in this orthographic view the
       front of the sky dome projects inside the horizon ellipse, so anything
       above the horizon must be drawn *over* the grass, not under it. */
    function curve(pts, col, w, dash, above) {
      var ctx = S.ctx;
      ctx.beginPath(); var pen = false;
      for (var i = 0; i < pts.length; i++) {
        if ((pts[i].alt >= 0) !== above) { pen = false; continue; }
        var p = project(pts[i].alt, pts[i].az);
        pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
      }
      ctx.setLineDash(dash || []);
      ctx.strokeStyle = col; ctx.lineWidth = above ? w : 1;
      ctx.globalAlpha = above ? 1 : 0.24; ctx.stroke();
      ctx.globalAlpha = 1; ctx.setLineDash([]);
    }

    /* ---- controls ---- */
    S.group("sp.obs");
    var latCtl = S.slider({
      labelKey: "sp.lat", min: -90, max: 90, value: lat, step: 0.5,
      format: fmtLat, on: function (v) { lat = v; upd(); }
    });
    var dayCtl = S.slider({
      labelKey: "sp.day", min: 1, max: 365, value: day, step: 1,
      format: function (v) { var md = monthDay(v); return MONTHS[I18N.getLang()][md.m] + " " + md.dd; },
      on: function (v) { day = v; upd(); }
    });
    var timeCtl = S.slider({
      labelKey: "sp.time", min: 0, max: 24, value: time, step: 0.25,
      format: fmtClock, on: function (v) { time = v; upd(); }
    });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "sp.drag");
    timeCtl.input.parentNode.parentNode.appendChild(hint);

    S.group("sp.anim");
    S.slider({ labelKey: "sp.speed", min: 2, max: 90, value: speed, step: 1,
      format: function (v) { return v + " d/s"; }, on: function (v) { speed = v; } });
    var loop = S.loop(function (dt) {
      day += speed * dt; if (day > 365) day -= 365;
      dayCtl.input.value = day; S.refreshers.forEach(function (f) { f(); });
    });
    S.playPause(loop);

    S.group("sp.show");
    var optCE = S.toggle({ labelKey: "sp.ce", value: true });
    var optEcl = S.toggle({ labelKey: "sp.ecl", value: true });
    var optPath = S.toggle({ labelKey: "sp.path", value: true });
    var optMer = S.toggle({ labelKey: "sp.mer", value: true });
    var optStick = S.toggle({ labelKey: "sp.stick", value: true });

    var outDec = S.readout({ labelKey: "sp.dec" });
    var outAlt = S.readout({ labelKey: "sp.alt" });
    var outAz = S.readout({ labelKey: "sp.az" });
    var outLen = S.readout({ labelKey: "sp.len" });
    var outRise = S.readout({ labelKey: "sp.rise" });
    var outSet = S.readout({ labelKey: "sp.set" });

    function fmtLat(v) {
      var a = Math.abs(v).toFixed(1);
      return v === 0 ? a + "°" : a + "° " + I18N.t(v > 0 ? "dir.N" : "dir.S");
    }
    function fmtClock(v) {
      var t = ((v % 24) + 24) % 24, h = Math.floor(t), m = Math.round((t - h) * 60);
      if (m === 60) { m = 0; h = (h + 1) % 24; }
      if (I18N.getLang() === "id") return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
      var ap = h < 12 ? "AM" : "PM", hh = h % 12 || 12;
      return hh + ":" + (m < 10 ? "0" : "") + m + " " + ap;
    }
    // half-day arc: the hour angle at which the Sun crosses the horizon
    function halfDay(decR, latR) {
      var c = -Math.tan(latR) * Math.tan(decR);
      if (c <= -1) return null;                 // circumpolar: up all day
      if (c >= 1) return NaN;                   // never rises
      return Math.acos(c) * R2D / 15;           // hours
    }
    function upd() {
      var decR = decOf(day), latR = lat * D2R;
      var ha = (time - 12) * 15 * D2R;
      var h = eq2hor(ha, decR, latR);
      outDec((decR * R2D >= 0 ? "+" : "−") + Math.abs(decR * R2D).toFixed(1) + "°");
      outAlt((h.alt * R2D).toFixed(1) + "°");
      outAz((((h.az * R2D) % 360 + 360) % 360).toFixed(1) + "°");
      var H = halfDay(decR, latR);
      if (H === null) { outLen("24.0 h"); outRise(I18N.t("sp.up")); outSet("—"); }
      else if (isNaN(H)) { outLen("0.0 h"); outRise(I18N.t("sp.down")); outSet("—"); }
      else { outLen((2 * H).toFixed(1) + " h"); outRise(fmtClock(12 - H)); outSet(fmtClock(12 + H)); }
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- drag to spin the sphere, as in the original ---- */
    var spin = null;
    S.canvas.addEventListener("pointerdown", function (ev) {
      var r = S.canvas.getBoundingClientRect(), x = (ev.clientX - r.left) * S.W / r.width, y = (ev.clientY - r.top) * S.H / r.height;
      if (Math.hypot(x - SCx, y - SCy) < R + 16) { spin = { x: x, ac: AC }; S.canvas.setPointerCapture(ev.pointerId); }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!spin) return;
      var r = S.canvas.getBoundingClientRect(), x = (ev.clientX - r.left) * S.W / r.width;
      AC = spin.ac + (x - spin.x) * 0.006; setCam(); S.requestDraw();
    });
    S.canvas.addEventListener("pointerup", function () { spin = null; });

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      var t = I18N.t.bind(I18N), lang = I18N.getLang();
      var decR = decOf(day), latR = lat * D2R;
      var ha = (time - 12) * 15 * D2R, sun = eq2hor(ha, decR, latR);
      var night = sun.alt < -0.105, twilight = !night && sun.alt < 0.105;
      var i;

      ctx.save(); ctx.beginPath(); ctx.arc(SCx, SCy, R + 2, 0, TAU); ctx.clip();

      // sky dome above the horizon
      var skyTop = night ? "#0b1733" : twilight ? "#3a2f63" : "#4f90d4";
      var skyHor = night ? "#16244a" : twilight ? "#c8794a" : "#bcd8f2";
      ctx.beginPath(); ctx.arc(SCx, SCy, R, Math.PI, TAU, false);
      ctx.ellipse(SCx, SCy, rx, ry, 0, TAU, Math.PI, true); ctx.closePath();
      var sg = ctx.createLinearGradient(0, SCy - R, 0, SCy + ry);
      sg.addColorStop(0, skyTop); sg.addColorStop(1, skyHor); ctx.fillStyle = sg; ctx.fill();
      // dark underside
      ctx.beginPath(); ctx.arc(SCx, SCy, R, 0, Math.PI, false);
      ctx.ellipse(SCx, SCy, rx, ry, 0, Math.PI, 0, true); ctx.closePath();
      ctx.fillStyle = "#070c1a"; ctx.fill();

      // the four named curves, gathered once and stroked in two passes
      var lam, dc, ra;
      var cePts = [], eclPts = [], pathPts = [], merPts = [];
      var raSun = Math.atan2(Math.cos(EPS) * Math.sin(TAU * (day - 80) / 365.2422),
                             Math.cos(TAU * (day - 80) / 365.2422)) * R2D / 15;
      for (i = 0; i <= 360; i += 2) {
        cePts.push(eq2hor(i * D2R, 0, latR));
        pathPts.push(eq2hor(i * D2R, decR, latR));
        lam = i * D2R;
        dc = Math.asin(Math.sin(EPS) * Math.sin(lam));
        ra = Math.atan2(Math.cos(EPS) * Math.sin(lam), Math.cos(lam)) * R2D / 15;
        eclPts.push(eq2hor(((time - 12) + raSun - ra) * 15 * D2R, dc, latR));
        var a = i * D2R;                        // the great circle through N, the zenith and S
        merPts.push({ alt: a <= Math.PI ? Math.PI / 2 - a : a - 3 * Math.PI / 2, az: a <= Math.PI ? 0 : Math.PI });
      }
      function strokeAll(above) {
        if (optCE.value()) curve(cePts, C.ce, 1.6, null, above);
        if (optEcl.value()) curve(eclPts, C.ecl, 2, null, above);
        if (optPath.value()) curve(pathPts, C.path, 2.4, null, above);
        if (optMer.value()) curve(merPts, C.mer, 1.6, [5, 5], above);
      }
      strokeAll(false);                         // the parts under the ground, faint

      // grassy horizon plane
      ctx.beginPath(); ctx.ellipse(SCx, SCy, rx, ry, 0, 0, TAU);
      var gg = ctx.createLinearGradient(0, SCy - ry, 0, SCy + ry);
      gg.addColorStop(0, night ? "#16301f" : "#3f8a45"); gg.addColorStop(1, night ? "#0e2014" : "#255f2e");
      ctx.fillStyle = gg; ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.28)"; ctx.lineWidth = 1; ctx.stroke();

      // The observer stands on the grass, before the sky half and the Sun are
      // painted: any sky point that lands on the figure on screen lies on the
      // camera's side of it, so the lines and the Sun should pass in front.
      if (optStick.value()) stick(ctx, SCx, SCy);

      strokeAll(true);                          // and the sky half, over the grass
      ctx.restore();

      ctx.strokeStyle = C.border; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(SCx, SCy, R, 0, TAU); ctx.stroke();

      // the Sun on its path
      var sp = project(sun.alt, sun.az);
      ctx.save(); if (sun.alt < 0) ctx.globalAlpha = 0.32;
      var g = ctx.createRadialGradient(sp.x, sp.y, 1, sp.x, sp.y, 17);
      g.addColorStop(0, "#fff8d8"); g.addColorStop(1, C.sun);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sp.x, sp.y, 10, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(120,90,0,.7)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();

      // cardinal points, just outside the horizon ellipse
      ctx.fillStyle = "#eaf2ff"; ctx.font = "bold 13px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      [["dir.N", 0], ["dir.E", 90], ["dir.S", 180], ["dir.W", 270]].forEach(function (c) {
        var p = project(0, c[1] * D2R), dx = p.x - SCx, dy = p.y - SCy, m = Math.hypot(dx, dy) || 1;
        ctx.strokeStyle = "rgba(7,11,26,.8)"; ctx.lineWidth = 3;
        ctx.strokeText(t(c[0]), p.x + dx / m * 15, p.y + dy / m * 15);
        ctx.fillText(t(c[0]), p.x + dx / m * 15, p.y + dy / m * 15);
      });
      ctx.textBaseline = "alphabetic";

      // the big date readout, as in the original
      var md = monthDay(day);
      ctx.fillStyle = C.text; ctx.font = "600 22px system-ui"; ctx.textAlign = "center";
      ctx.fillText(MONTHS[lang][md.m] + " " + md.dd, SCx, S.H - 96);
      ctx.fillStyle = C.dim; ctx.font = "12px system-ui";
      ctx.fillText(fmtLat(lat) + " · " + fmtClock(time), SCx, S.H - 76);

      // colour legend, matching the SWF's four lines
      var lx = 92, ly = S.H - 52, n = 0;
      if (optCE.value()) legend(ctx, lx, ly + (n++) * 17, C.ce, t("sp.ce"));
      if (optEcl.value()) legend(ctx, lx, ly + (n++) * 17, C.ecl, t("sp.ecl"));
      n = 0;
      if (optPath.value()) legend(ctx, lx + 250, ly + (n++) * 17, C.path, t("sp.path"));
      if (optMer.value()) legend(ctx, lx + 250, ly + (n++) * 17, C.mer, t("sp.mer"));
    });

    function legend(ctx, x, y, col, label) {
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + 20, y); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(label, x + 26, y); ctx.textBaseline = "alphabetic"; ctx.textAlign = "center";
    }
    function stick(ctx, x, baseY) {
      var top = baseY - 19;
      ctx.fillStyle = "#0d1430"; ctx.beginPath(); ctx.arc(x, top, 3.4, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#0d1430"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, top + 3); ctx.lineTo(x, baseY - 6);
      ctx.moveTo(x - 5, top + 7); ctx.lineTo(x + 5, top + 7);
      ctx.moveTo(x, baseY - 6); ctx.lineTo(x - 4, baseY);
      ctx.moveTo(x, baseY - 6); ctx.lineTo(x + 4, baseY);
      ctx.stroke(); ctx.lineCap = "butt";
    }
  }
});
