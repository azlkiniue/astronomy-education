/* Moon Phases and the Sun ---------------------------------------------------------
   Faithful rebuild of the ClassAction "moonphases.swf" (animClass / MoonRotator,
   decompiled). The Earth carries the Moon round the Sun while the Moon circles the
   Earth, and the panel shows the Moon as it would look from three places: from the
   Earth, from the Sun, and from a fixed point out in space.

   From the Earth the panel is the original's moonPhaseSymbol: its own near-side
   photograph, which never turns, under the terminator mask it draws at 70 % dark.
   From the Sun or from space it is the original's MoonRotator instead — the
   59-frame rotation sequence, extracted to JPEGs.

   The Moon's angle accumulates without resetting, exactly as the SWF's moon clip
   does, and the Earth's orbital angle follows from it as earth._time/365 − 27.6,
   so 28 days of Moon carry the Earth 27.6° and it comes full circle in a year. */
Sim.create({
  id: "moonphases",
  width: 780, height: 600,
  strings: {
    en: {
      "mp.view": "View", "mp.persp": "Perspective", "mp.earth": "From Earth", "mp.sun": "From Sun",
      "mp.space": "From Space", "mp.speed": "Animation speed", "mp.restart": "Restart",
      "mp.moon": "show the Moon's view", "mp.title": "View of Moon",
      "mp.rPhase": "phase", "mp.rDay": "day of the cycle", "mp.rYear": "day of the year",
      "mp.rAngle": "Sun–Moon angle",
      "mp.hint": "Run the animation and watch the same Moon look different from each vantage point.",
      "mp.new": "New Moon", "mp.wxc": "Waxing Crescent", "mp.fq": "First Quarter",
      "mp.wxg": "Waxing Gibbous", "mp.full": "Full Moon", "mp.wng": "Waning Gibbous",
      "mp.tq": "Third Quarter", "mp.wnc": "Waning Crescent",
      "mp.sunL": "Sun", "mp.earthL": "Earth", "mp.moonL": "Moon", "mp.obs": "observer in space"
    },
    id: {
      "mp.view": "Tampilan", "mp.persp": "Sudut pandang", "mp.earth": "Dari Bumi", "mp.sun": "Dari Matahari",
      "mp.space": "Dari Antariksa", "mp.speed": "Kecepatan animasi", "mp.restart": "Ulang",
      "mp.moon": "tampilkan pemandangan Bulan", "mp.title": "Pemandangan Bulan",
      "mp.rPhase": "fase", "mp.rDay": "hari dalam siklus", "mp.rYear": "hari dalam setahun",
      "mp.rAngle": "sudut Matahari–Bulan",
      "mp.hint": "Jalankan animasi dan amati Bulan yang sama tampak berbeda dari tiap titik pandang.",
      "mp.new": "Bulan Baru", "mp.wxc": "Sabit Awal", "mp.fq": "Kuartal Pertama",
      "mp.wxg": "Cembung Awal", "mp.full": "Purnama", "mp.wng": "Cembung Akhir",
      "mp.tq": "Kuartal Ketiga", "mp.wnc": "Sabit Akhir",
      "mp.sunL": "Matahari", "mp.earthL": "Bumi", "mp.moonL": "Bulan", "mp.obs": "pengamat di antariksa"
    }
  },
  about: {
    en: "<p>Half the Moon is always lit — the half facing the Sun. Phases are simply how much of that lit half happens to point our way, and that depends on where the Moon sits in its month-long circuit of the Earth. New moon is the Moon between us and the Sun, full moon is the Moon opposite the Sun.</p>" +
        "<p>Switch the viewpoint and the same instant looks completely different. From the Sun the Moon is <em>always</em> full: the Sun only ever sees the face it lights. From a fixed point out in space you see a phase somewhere between the two, changing as the whole system swings past you through the year.</p>" +
        "<p>Watch the Moon's surface as well as its phase. From the Earth the same features stay put — the Moon keeps one face towards us, because it turns once on its axis in exactly the time it takes to orbit. From the Sun or from space that face rotates slowly out of view, which is how you can tell the Moon really is spinning.</p>",
    id: "<p>Separuh Bulan selalu terang — separuh yang menghadap Matahari. Fase hanyalah soal seberapa banyak bagian terang itu kebetulan menghadap kita, dan itu bergantung pada kedudukan Bulan dalam peredarannya sebulan mengelilingi Bumi. Bulan baru terjadi saat Bulan berada di antara kita dan Matahari, purnama saat Bulan berseberangan dengan Matahari.</p>" +
        "<p>Ganti titik pandang dan saat yang sama tampak sama sekali berbeda. Dari Matahari, Bulan <em>selalu</em> purnama: Matahari hanya pernah melihat sisi yang disinarinya. Dari titik tetap di antariksa Anda melihat fase di antara keduanya, yang berubah saat seluruh sistem berayun melewati Anda sepanjang tahun.</p>" +
        "<p>Perhatikan pula permukaannya, bukan hanya fasenya. Dari Bumi, kenampakannya tetap — Bulan selalu menghadapkan satu wajah kepada kita karena ia berputar sekali pada porosnya persis selama satu kali mengorbit. Dari Matahari atau dari antariksa, wajah itu perlahan berputar keluar pandangan, dan dari situlah terlihat bahwa Bulan memang berotasi.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var BOX = { x: 8, y: 8, w: 592, h: 584 };              // the SWF's 600 × 600 scene box
    var SUN = { x: BOX.x + BOX.w / 2, y: BOX.y + BOX.h / 2 };   // the Sun sits at its centre
    var R_EARTH_ORBIT = 203, R_MOON_ORBIT = 61;
    var SPACE = { x: SUN.x + 260, y: SUN.y - 260 };        // the SWF's fixed observer at (260, −260)
    var PANEL = { x: 612, y: 40, w: 160, h: 214 };
    var DISC = { x: 692, y: 154, r: 71 };                  // MoonRotator radius 71
    var FRAMES = 59, DARK = 0.7;                           // the sequence, and its 70 % dark mask
    var DAYS_PER_CYCLE = 28, DAYS_PER_YEAR = 365;          // earth._time = moonTime × 28

    var moonAngle = 0, perspective = "earth", speed = 1, showMoon = true, playing = false;
    var nearSide = new Image();                            // moonPhaseImage: the face we always see
    nearSide.onload = function () { S.requestDraw(); };
    nearSide.src = "../assets/img/sims/moon-near.jpg";
    var frames = [], loaded = 0;
    for (var i = 0; i < FRAMES; i++) {
      var im = new Image();
      im.onload = function () { loaded++; S.requestDraw(); };
      im.src = "../assets/img/sims/moon-seq/" + (i < 10 ? "0" : "") + i + ".jpg";
      frames.push(im);
    }

    S.group("mp.view");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "mp.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.select({
      labelKey: "mp.persp", value: "earth",
      options: [{ v: "earth", labelKey: "mp.earth" }, { v: "sun", labelKey: "mp.sun" }, { v: "space", labelKey: "mp.space" }],
      on: function (v) { perspective = v; upd(); }     // the readouts follow the vantage point
    });
    S.toggle({ labelKey: "mp.moon", value: true, on: function (v) { showMoon = v; S.requestDraw(); } });
    // the SWF's moon clip just keeps adding to its angle, so the Earth carries on round
    var loop = S.loop(function (dt) { moonAngle += speed * 36 * dt; upd(); });
    var pp = S.playPause(loop);
    S.slider({
      labelKey: "mp.speed", min: 0.2, max: 4, value: 1, step: 0.1,
      format: function (v) { return v.toFixed(1) + "×"; },
      on: function (v) { speed = v; }
    });
    S.button({ labelKey: "mp.restart", on: function () { moonAngle = 0; upd(); } });
    var outPhase = S.readout({ labelKey: "mp.rPhase" });
    var outDay = S.readout({ labelKey: "mp.rDay" });
    var outYear = S.readout({ labelKey: "mp.rYear" });
    var outAngle = S.readout({ labelKey: "mp.rAngle" });

    /* ---- the geometry the SWF computes each frame ---- */
    function state() {
      var m = moonAngle;                                   // the Moon's angle round the Earth
      // earth._time = (360 − frame) × 28 and angle = earth._time/365 − 27.6, so the Earth loses
      // 27.6° a cycle and closes its orbit after a year; both bodies run anticlockwise on
      // screen, starting with the Moon at full
      var earthDeg = m === 0 ? 0 : (360 - m) * DAYS_PER_CYCLE / DAYS_PER_YEAR - 27.6;
      var eA = earthDeg * RAD;
      var earth = { x: SUN.x + R_EARTH_ORBIT * Math.cos(eA), y: SUN.y + R_EARTH_ORBIT * Math.sin(eA) };
      var mA = (earthDeg - m) * RAD;                       // the Moon's direction, in the same frame
      var moon = { x: earth.x + R_MOON_ORBIT * Math.cos(mA), y: earth.y + R_MOON_ORBIT * Math.sin(mA) };
      return { m: m, earthDeg: earthDeg, earth: earth, moon: moon, mA: mA, eA: eA };
    }
    // the phase angle at the Moon between the Sun and whoever is looking
    function phaseAngleFrom(st, obs) {
      var sx = SUN.x - st.moon.x, sy = SUN.y - st.moon.y;
      var ox = obs.x - st.moon.x, oy = obs.y - st.moon.y;
      var a = Math.atan2(sy, sx) - Math.atan2(oy, ox);
      return ((a % TAU) + TAU) % TAU;
    }
    function view() {
      var st = state();
      if (perspective === "earth")                          // tidally locked: always the same face
        return { phase: phaseAngleFrom(st, st.earth), lon: 0, st: st };
      if (perspective === "sun")                            // the Sun only ever sees the face it lights
        return { phase: 0, lon: 45 + st.m, st: st };
      var ang = phaseAngleFrom(st, SPACE);                  // a fixed observer out in space
      var lon = Math.atan2(st.moon.y - SPACE.y, st.moon.x - SPACE.x) * DEG + st.m + 45;
      return { phase: ang, lon: lon, st: st };
    }
    // moonPhaseSymbol.getNameFromAngle, on its own phase scale (0 new, 180 full) with the
    // original's 12-hour tolerance: tol = 12 × 360 / (29.5 × 24) degrees
    var PHASE_TOL = 12 * 360 / (29.5 * 24);
    function phaseName(a) {
      var p = (((a * DEG + 180) % 360) + 360) % 360, tol = PHASE_TOL;
      if (p <= tol) return I18N.t("mp.new");
      if (p < 90 - tol) return I18N.t("mp.wxc");
      if (p <= 90 + tol) return I18N.t("mp.fq");
      if (p < 180 - tol) return I18N.t("mp.wxg");
      if (p <= 180 + tol) return I18N.t("mp.full");
      if (p < 270 - tol) return I18N.t("mp.wng");
      if (p <= 270 + tol) return I18N.t("mp.tq");
      if (p < 360 - tol) return I18N.t("mp.wnc");
      return I18N.t("mp.new");
    }
    function upd() {
      var v = view(), f = (1 + Math.cos(v.phase)) / 2;
      outPhase(phaseName(v.phase) + " · " + Math.round(f * 100) + "%");
      var days = moonAngle / 360 * DAYS_PER_CYCLE;
      outDay((days % DAYS_PER_CYCLE).toFixed(1) + " / " + DAYS_PER_CYCLE);
      outYear((days % DAYS_PER_YEAR).toFixed(0) + " / " + DAYS_PER_YEAR);
      outAngle(Math.round(v.phase * DEG) + "°");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N), v = view(), st = v.st;
      S.clear();
      ctx.fillStyle = "#f2f2f2"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(BOX.x, BOX.y, BOX.w, BOX.h);
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 1;
      ctx.strokeRect(BOX.x + 0.5, BOX.y + 0.5, BOX.w - 1, BOX.h - 1);

      ctx.save();
      ctx.beginPath(); ctx.rect(BOX.x, BOX.y, BOX.w, BOX.h); ctx.clip();
      var g = ctx.createRadialGradient(SUN.x, SUN.y, 2, SUN.x, SUN.y, 34);   // the Sun
      g.addColorStop(0, "#fff8d0"); g.addColorStop(0.45, "#ffd23c");
      g.addColorStop(0.75, "rgba(255,190,40,0.5)"); g.addColorStop(1, "rgba(255,180,30,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(SUN.x, SUN.y, 34, 0, TAU); ctx.fill();
      ctx.fillStyle = "#f5c53a"; ctx.beginPath(); ctx.arc(SUN.x, SUN.y, 19, 0, TAU); ctx.fill();
      label(ctx, t("mp.sunL"), SUN.x, SUN.y + 34);

      body(ctx, st.earth, 11, "#7ba7dd", "#123a6b", SUN);                    // the Earth, half in night
      body(ctx, st.moon, 5.5, "#d8d8d8", "#4a4a4a", SUN);                    // the Moon, half in night
      label(ctx, t("mp.earthL"), st.earth.x, st.earth.y + 22);
      label(ctx, t("mp.moonL"), st.moon.x, st.moon.y + 16);

      if (perspective === "space") {                                          // the fixed observer
        ctx.fillStyle = "#cc3333";
        ctx.beginPath(); ctx.arc(SPACE.x, SPACE.y, 4, 0, TAU); ctx.fill();
        label(ctx, t("mp.obs"), SPACE.x, SPACE.y + 16);
      }
      arrow(ctx, st, v);
      ctx.restore();

      ctx.fillStyle = "#fafafa"; ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);
      ctx.strokeStyle = "#999999"; ctx.strokeRect(PANEL.x + 0.5, PANEL.y + 0.5, PANEL.w - 1, PANEL.h - 1);
      ctx.fillStyle = "#333333"; ctx.font = "13px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(t("mp.title"), PANEL.x + PANEL.w / 2, PANEL.y + 8);
      if (showMoon) moonDisc(ctx, v);
    });

    // the viewing direction: from the Earth, the Sun, or the fixed observer
    function arrow(ctx, st, v) {
      var from = perspective === "earth" ? st.earth : perspective === "sun" ? SUN : SPACE;
      var a = Math.atan2(st.moon.y - from.y, st.moon.x - from.x);
      var d = Math.hypot(st.moon.x - from.x, st.moon.y - from.y);
      var r0 = perspective === "earth" ? 14 : perspective === "sun" ? 22 : 8;
      ctx.strokeStyle = "#333333"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(from.x + r0 * Math.cos(a), from.y + r0 * Math.sin(a));
      ctx.lineTo(from.x + (d - 9) * Math.cos(a), from.y + (d - 9) * Math.sin(a));
      ctx.stroke();
      ctx.save();
      ctx.translate(from.x + (d - 8) * Math.cos(a), from.y + (d - 8) * Math.sin(a));
      ctx.rotate(a);
      ctx.fillStyle = "#333333";
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-7, -3.2); ctx.lineTo(-7, 3.2);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    function body(ctx, p, r, lit, dark, sun) {             // a disc with its night side away from the Sun
      var a = Math.atan2(p.y - sun.y, p.x - sun.x);
      ctx.fillStyle = lit;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, TAU); ctx.fill();
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, a - Math.PI / 2, a + Math.PI / 2); ctx.fill();
      ctx.strokeStyle = "#333333"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, TAU); ctx.stroke();
    }
    function label(ctx, text, x, y) {                      // kept clear of the scene box's edges
      ctx.fillStyle = "#555555"; ctx.font = "11px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      var half = ctx.measureText(text).width / 2 + 4;
      ctx.fillText(text,
        Math.max(BOX.x + half, Math.min(BOX.x + BOX.w - half, x)),
        Math.min(y, BOX.y + BOX.h - 15));
    }
    // from the Earth, moonPhaseSymbol's fixed near-side photograph; from the Sun or from
    // space, the MoonRotator frame for this longitude — then the terminator mask over it
    function moonDisc(ctx, v) {
      var im;
      if (perspective === "earth") im = nearSide;
      else {
        var idx = ((Math.round(v.lon / 360 * FRAMES) % FRAMES) + FRAMES) % FRAMES;
        im = frames[idx];
      }
      ctx.fillStyle = "#000000";
      ctx.fillRect(DISC.x - DISC.r - 4, DISC.y - DISC.r - 4, 2 * DISC.r + 8, 2 * DISC.r + 8);
      ctx.save();
      ctx.beginPath(); ctx.arc(DISC.x, DISC.y, DISC.r, 0, TAU); ctx.clip();
      if (im && im.complete && im.naturalWidth)
        ctx.drawImage(im, DISC.x - DISC.r, DISC.y - DISC.r, 2 * DISC.r, 2 * DISC.r);
      // the SWF's mask runs on its own phase scale (0 new, 180 full), which is 180 + our
      // Sun–Moon–observer angle, so the terminator is drawn from the negative of ours
      var angle = ((-v.phase % TAU) + TAU) % TAU;
      var sign = angle < Math.PI ? -1 : 1;
      var s = DISC.r * Math.cos(angle);
      ctx.fillStyle = "rgba(0,0,0," + DARK + ")";
      ctx.beginPath();
      ctx.arc(DISC.x, DISC.y, DISC.r, -Math.PI / 2, Math.PI / 2, sign < 0);
      ctx.ellipse(DISC.x, DISC.y, Math.abs(s), DISC.r, 0, Math.PI / 2, -Math.PI / 2, sign * s > 0);
      ctx.fill();
      ctx.restore();
    }

    upd();
  }
});
