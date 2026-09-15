/* Moon Inclination -------------------------------------------------------------
   Faithful rebuild of the ClassAction "mooninc.swf" (SimpOrbSysClass /
   TimeStripClass, decompiled). We watch the Earth–Moon system from the Sun's
   direction. The Moon's orbit is tilted 5° to the ecliptic, and because the
   orbit's nodes drift relative to the Sun, the view swings round once per
   eclipse year (346.62 days):

     • most of the time the orbit looks like an open ellipse, and the Moon passes
       above or below Earth at new and full moon — no eclipse;
     • twice an eclipse year the line of nodes points at the Sun, the orbit is
       seen edge-on, and the Moon crosses straight over Earth — eclipse season.

   The enlargement window zooms in 5.786× on Earth so you can see the Moon pass in
   front of it (solar eclipse) or behind it (lunar eclipse). The time strip marks
   the eclipse seasons; drag it to scrub through the calendar.                  */
Sim.create({
  id: "mooninc",
  width: 750, height: 480,
  strings: {
    en: {
      "mi.anim": "Animation", "mi.speed": "speed (days/sec)", "mi.animate": "animate",
      "mi.show": "Show", "mi.path": "show orbital path", "mi.sizes": "exaggerate body sizes",
      "mi.ecl": "show ecliptic plane",
      "mi.enlarge": "enlargement", "mi.eclPlane": "ecliptic plane", "mi.notScale": "not to scale",
      "mi.now": "now", "mi.season1": "eclipse", "mi.season2": "season",
      "mi.dragHint": "Drag the time strip to scrub through the calendar.",
      "mi.rDate": "date", "mi.rLat": "Moon vs ecliptic", "mi.rSeason": "eclipse season",
      "mi.rNext": "next season", "mi.above": "above", "mi.below": "below", "mi.on": "on it",
      "mi.yes": "yes — now", "mi.inDays": "in {n} days",
      "mi.months": "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec"
    },
    id: {
      "mi.anim": "Animasi", "mi.speed": "kecepatan (hari/detik)", "mi.animate": "animasikan",
      "mi.show": "Tampilkan", "mi.path": "tampilkan lintasan orbit", "mi.sizes": "perbesar ukuran benda",
      "mi.ecl": "tampilkan bidang ekliptika",
      "mi.enlarge": "pembesaran", "mi.eclPlane": "bidang ekliptika", "mi.notScale": "tidak berskala",
      "mi.now": "kini", "mi.season1": "musim", "mi.season2": "gerhana",
      "mi.dragHint": "Seret pita waktu untuk menjelajahi kalender.",
      "mi.rDate": "tanggal", "mi.rLat": "Bulan thd ekliptika", "mi.rSeason": "musim gerhana",
      "mi.rNext": "musim berikutnya", "mi.above": "di atas", "mi.below": "di bawah", "mi.on": "tepat di",
      "mi.yes": "ya — sekarang", "mi.inDays": "dalam {n} hari",
      "mi.months": "Jan,Feb,Mar,Apr,Mei,Jun,Jul,Agu,Sep,Okt,Nov,Des"
    }
  },
  about: {
    en: "<p>If the Moon orbited in the same plane as Earth circles the Sun, we would see a solar eclipse at every new moon and a lunar eclipse at every full moon. We don't, because the Moon's orbit is tilted about <strong>5°</strong> to the <strong>ecliptic</strong>. Usually the new or full Moon slips above or below the Sun–Earth line and no shadow falls.</p>" +
        "<p>The Moon's orbit crosses the ecliptic at two points, the <strong>nodes</strong>. An eclipse needs a new or full Moon to happen near a node, and that only works when the line of nodes points toward the Sun — seen from the Sun, the orbit is then edge-on. That alignment comes round twice per <strong>eclipse year</strong> of 346.6 days (shorter than a calendar year because the nodes slowly regress), so eclipses cluster into two <strong>eclipse seasons</strong> about 173 days apart, each roughly 34 days long.</p>" +
        "<p>Watch the enlargement window: in an eclipse season the Moon crosses right over Earth's disc, in front of it at new moon and behind it at full moon; outside one it misses high or low. Notice too how the seasons creep earlier through the calendar each year.</p>",
    id: "<p>Jika Bulan mengorbit pada bidang yang sama dengan orbit Bumi mengelilingi Matahari, kita akan melihat gerhana Matahari setiap bulan baru dan gerhana Bulan setiap purnama. Kenyataannya tidak, karena orbit Bulan miring sekitar <strong>5°</strong> terhadap <strong>ekliptika</strong>. Biasanya Bulan baru atau purnama lewat di atas atau di bawah garis Matahari–Bumi sehingga tak ada bayangan yang jatuh.</p>" +
        "<p>Orbit Bulan memotong ekliptika di dua titik, yaitu <strong>simpul</strong>. Gerhana memerlukan bulan baru atau purnama di dekat simpul, dan itu hanya terjadi saat garis simpul mengarah ke Matahari — dilihat dari Matahari, orbitnya tampak dari tepi. Kesejajaran itu datang dua kali setiap <strong>tahun gerhana</strong> sepanjang 346,6 hari (lebih pendek dari tahun kalender karena simpul perlahan mundur), sehingga gerhana berkelompok dalam dua <strong>musim gerhana</strong> berselang sekitar 173 hari, masing-masing kira-kira 34 hari.</p>" +
        "<p>Perhatikan jendela pembesaran: di musim gerhana Bulan melintas tepat di depan cakram Bumi saat bulan baru dan di belakangnya saat purnama; di luar musim itu ia lewat terlalu tinggi atau terlalu rendah. Perhatikan pula bagaimana musim gerhana bergeser makin awal dalam kalender setiap tahun.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180, TAU = Math.PI * 2;
    /* ---- the SWF's constants ---- */
    var ECLIPSE_YEAR = 346.62, SIDEREAL = 27.3, INCL = 5 * D2R, SCALE = 250, ZF = 5.786;
    var SEASON_SPACING = ECLIPSE_YEAR / 2, SEASON_HALF = 17;          // highlight ≈ 34 days wide
    var SYS = { x: 375, y: 272 };                                    // the orbit system's centre
    var BOX = { x: 20.5, y: 32.5, w: 274, h: 144.5 };                // the enlargement window
    var STRIP = { cx: 375, half: 240, y: 422 };                      // the time strip
    var CUM = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    var C = {
      paper: "#ffffff", ink: "#000000", ecl: "#009900", now: "#ff0000", season: "#ffe57f",
      pathFront: "#b3b3b3", pathBack: "#e6e6e6", caveat: "#666666"
    };

    /* ---- state: the SWF starts at date 0, animating at 2.5 days/sec ---- */
    var date = 0, speed = 2.5, animate = true, showPath = true, bigBodies = false, showEcl = true;
    var dragging = null;

    /* ================================ controls ================================ */
    S.group("mi.anim");
    S.slider({
      labelKey: "mi.speed", min: 0, max: 30, value: speed, step: 0.1,
      format: function (v) { return String(Math.round(v * 100) / 100); },
      on: function (v) { speed = v; }
    });
    S.toggle({ labelKey: "mi.animate", value: animate, on: function (b) { animate = b; syncLoop(); } });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "mi.dragHint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.group("mi.show");
    S.toggle({ labelKey: "mi.path", value: showPath, on: function (b) { showPath = b; } });
    S.toggle({ labelKey: "mi.sizes", value: bigBodies, on: function (b) { bigBodies = b; } });
    S.toggle({ labelKey: "mi.ecl", value: showEcl, on: function (b) { showEcl = b; } });

    var outDate = S.readout({ labelKey: "mi.rDate" });
    var outLat = S.readout({ labelKey: "mi.rLat" });
    var outSeason = S.readout({ labelKey: "mi.rSeason" });
    var outNext = S.readout({ labelKey: "mi.rNext" });

    var loop = S.loop(function (dt) {
      if (!dragging) date += speed * dt;
      upd();
    });
    function syncLoop() { if (animate) loop.play(); else loop.pause(); }

    function mod(n, m) { return ((n % m) + m) % m; }
    function months() { return I18N.t("mi.months").split(","); }
    function dateStr(d) {
      var day = mod(d, 365), m = 11;
      while (m > 0 && day < CUM[m]) m--;
      return months()[m] + " " + (Math.floor(day - CUM[m]) + 1);
    }

    /* ---- SimpOrbSysClass: the Moon's position, projected (φ = 0, so y is just −z) ---- */
    function moonPos() {
      var th = TAU * mod(date, ECLIPSE_YEAR) / ECLIPSE_YEAR;
      var sa = TAU * mod(date, SIDEREAL) / SIDEREAL;
      var st = Math.sin(th), ct = Math.cos(th), ci = Math.cos(INCL), si = Math.sin(INCL);
      var x = Math.cos(sa), y = Math.sin(sa);
      return {
        th: th, sa: sa,
        sx: SCALE * (-st * x + ct * ci * y),
        sy: SCALE * (-si * y),
        sz: SCALE * (ct * x + st * ci * y)
      };
    }

    function upd() {
      var p = moonPos();
      outDate(dateStr(date));
      var b = Math.asin(Math.sin(p.sa) * Math.sin(INCL)) / D2R;
      outLat(Math.abs(b) < 0.05 ? I18N.t("mi.on") : (Math.abs(b).toFixed(1) + "° " + I18N.t(b > 0 ? "mi.above" : "mi.below")));
      var off = mod(date + SEASON_SPACING / 2, SEASON_SPACING) - SEASON_SPACING / 2;   // days from season centre
      var inSeason = Math.abs(off) <= SEASON_HALF;
      outSeason(inSeason ? I18N.t("mi.yes") : "–");
      var toNext = inSeason ? SEASON_SPACING - off - SEASON_HALF : -off - SEASON_HALF;
      if (toNext < 0) toNext += SEASON_SPACING;
      outNext(I18N.t("mi.inDays").replace("{n}", Math.ceil(toNext)));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- drag the time strip (TimeStripClass.onPress / onMouseMoveFunc) ---- */
    function stageXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function onStrip(p) { return Math.abs(p.x - STRIP.cx) <= STRIP.half && p.y > STRIP.y - 26 && p.y < STRIP.y + 50; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = stageXY(ev);
      if (!onStrip(p)) return;
      dragging = { dragDate: date + p.x };
      S.canvas.setPointerCapture(ev.pointerId); S.canvas.style.cursor = "grabbing";
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stageXY(ev);
      if (!dragging) { S.canvas.style.cursor = onStrip(p) ? "grab" : "default"; return; }
      date = dragging.dragDate - p.x;
      upd();
    });
    function endDrag() { dragging = null; S.canvas.style.cursor = "default"; }
    S.canvas.addEventListener("pointerup", endDrag);
    S.canvas.addEventListener("pointercancel", endDrag);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N), p = moonPos();
      S.clear();
      ctx.fillStyle = C.paper; roundRect(ctx, 0, 0, S.W, S.H, 10); ctx.fill();

      drawEnlargement(ctx, t, p);
      drawSystem(ctx, t, p);
      drawStrip(ctx, t);
    });

    function drawSystem(ctx, t, p) {
      var f = bigBodies ? 3 : 1, eR = 4.2 * f, mR = 1.15 * f;
      if (showEcl) {
        ctx.fillStyle = C.ecl; ctx.fillRect(20.5, SYS.y - 0.5, 706, 1);
        ctx.font = "13px Verdana, system-ui, sans-serif"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(t("mi.eclPlane"), 726, SYS.y + 13);
      }
      if (bigBodies) {
        ctx.font = "italic 13px Verdana, system-ui, sans-serif"; ctx.fillStyle = C.caveat;
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(t("mi.notScale"), 726, 324);
      }
      // orbit: the far half faint (10 % black), the near half 30 %, as pathBackBack / pathFrontFront
      var th = p.th, st = Math.sin(th), ct = Math.cos(th), ci = Math.cos(INCL), si = Math.sin(INCL);
      function orbitPt(a) {
        var x = Math.cos(a), y = Math.sin(a);
        return { x: SYS.x + SCALE * (-st * x + ct * ci * y), y: SYS.y - SCALE * si * y, z: ct * x + st * ci * y };
      }
      if (showPath) strokeOrbit(ctx, orbitPt, false);
      if (p.sz <= 0) drawBody(ctx, SYS.x + p.sx, SYS.y + p.sy, mR, "moon");
      drawBody(ctx, SYS.x, SYS.y, eR, "earth");
      if (showPath) strokeOrbit(ctx, orbitPt, true);
      if (p.sz > 0) drawBody(ctx, SYS.x + p.sx, SYS.y + p.sy, mR, "moon");
    }
    function strokeOrbit(ctx, pt, front) {
      ctx.strokeStyle = front ? C.pathFront : C.pathBack; ctx.lineWidth = 1;
      ctx.beginPath();
      var pen = false, N = 240;
      for (var i = 0; i <= N; i++) {
        var q = pt(i / N * TAU);
        if ((q.z > 0) !== front) { pen = false; continue; }
        pen ? ctx.lineTo(q.x, q.y) : (ctx.moveTo(q.x, q.y), pen = true);
      }
      ctx.stroke();
    }

    function drawEnlargement(ctx, t, p) {
      ctx.font = "12px Verdana, system-ui, sans-serif"; ctx.fillStyle = C.ink;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText(t("mi.enlarge"), BOX.x + 2, BOX.y - 8);
      var cx = BOX.x + BOX.w / 2, cy = BOX.y + BOX.h / 2;
      ctx.save();
      ctx.beginPath(); ctx.rect(BOX.x, BOX.y, BOX.w, BOX.h); ctx.clip();
      var mx = cx + ZF * p.sx, my = cy + ZF * p.sy;
      if (p.sz <= 0) drawBody(ctx, mx, my, 6.5, "moon");
      drawBody(ctx, cx, cy, 24, "earth");
      if (p.sz > 0) drawBody(ctx, mx, my, 6.5, "moon");
      ctx.restore();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
      ctx.strokeRect(BOX.x, BOX.y, BOX.w, BOX.h);
    }

    function drawBody(ctx, x, y, r, kind) {
      var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      if (kind === "earth") { g.addColorStop(0, "#cfe6f5"); g.addColorStop(0.55, "#85c0e3"); g.addColorStop(1, "#4f93c6"); }
      else { g.addColorStop(0, "#d6d6d6"); g.addColorStop(0.6, "#9a9a9a"); g.addColorStop(1, "#5e5e5e"); }
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, Math.max(r, 0.8), 0, TAU); ctx.fill();
    }

    // TimeStripClass: 1 px per day, calendars repeating every 365 px, a season every 173.31 px
    function drawStrip(ctx, t) {
      var x0 = STRIP.cx - STRIP.half, x1 = STRIP.cx + STRIP.half, y = STRIP.y;
      ctx.save();
      ctx.beginPath(); ctx.rect(x0, y - 30, x1 - x0, 90); ctx.clip();
      // eclipse seasons: soft-edged yellow bars + a two-line caption
      var m = -mod(date, SEASON_SPACING);
      for (var k = -2; k <= 3; k++) {
        var sx = STRIP.cx + m + k * SEASON_SPACING;
        if (sx < x0 - 60 || sx > x1 + 60) continue;
        var grad = ctx.createLinearGradient(sx - SEASON_HALF, 0, sx + SEASON_HALF, 0);
        grad.addColorStop(0, "rgba(255,229,127,0)"); grad.addColorStop(0.18, C.season);
        grad.addColorStop(0.82, C.season); grad.addColorStop(1, "rgba(255,229,127,0)");
        ctx.fillStyle = grad; ctx.fillRect(sx - SEASON_HALF, y - 20, SEASON_HALF * 2, 40);
        ctx.fillStyle = C.ink; ctx.font = "12px Verdana, system-ui, sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(t("mi.season1"), sx, y + 28); ctx.fillText(t("mi.season2"), sx, y + 42);
      }
      // calendar: month names with a tick at every month boundary
      var kc = -mod(date, 365), names = months();
      ctx.font = "11px Verdana, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (var c = -1; c <= 1; c++) {
        var base = STRIP.cx + kc + c * 365;
        for (var i = 0; i < 12; i++) {
          var bx = base + CUM[i], mid = base + (CUM[i] + CUM[i + 1]) / 2;
          if (mid < x0 - 30 || bx > x1 + 30) continue;
          ctx.fillStyle = C.ink; ctx.fillRect(bx - 0.5, y - 7, 1, 14);
          ctx.fillText(names[i], mid + 1, y + 0.5);
        }
      }
      ctx.restore();

      // the "now" marker
      ctx.fillStyle = C.now; ctx.font = "12px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("mi.now"), STRIP.cx, y - 43);
      ctx.beginPath(); ctx.moveTo(STRIP.cx - 6, y - 36); ctx.lineTo(STRIP.cx + 6, y - 36); ctx.lineTo(STRIP.cx, y - 26);
      ctx.closePath(); ctx.fill();
      ctx.fillRect(STRIP.cx - 1, y - 27, 2, 47);
    }

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    upd();
    syncLoop();
  }
});
