/* Lunar Phase Vocabulary -------------------------------------------------------
   Faithful rebuild of the ClassAction "lunar_phaser.swf" (moonPhaseClass and the
   root script, decompiled; the Moon photograph is the SWF's own bitmap). Eight
   buttons name the phases; each sets the phase angle — new 0°, waxing crescent
   45°, first quarter 90°, waxing gibbous 135°, full 180°, waning gibbous 225°,
   last quarter 270°, waning crescent 315°. "Run Animation" sweeps the Moon through
   its 29.5-day synodic cycle at one day per second and counts the days.

   The shading is updateMask(): a 60 % black box over one half of the disc plus the
   region between the centre line and a terminator ellipse of half-width
   R·cos(phase mod 180°) — so the lit part is always a half-disc ± a half-ellipse.
   The SWF's portrait layout is laid on its side here to fit the page.          */
Sim.create({
  id: "lunar_phaser",
  width: 760, height: 400,
  strings: {
    en: {
      "lpv.phases": "Phases", "lpv.anim": "Animation",
      "lpv.new": "New Moon", "lpv.waxc": "Waxing Crescent", "lpv.fq": "First Quarter", "lpv.waxg": "Waxing Gibbous",
      "lpv.full": "Full Moon", "lpv.wang": "Waning Gibbous", "lpv.lq": "Last Quarter", "lpv.wanc": "Waning Crescent",
      "lpv.run": "Run Animation", "lpv.stop": "Stop Animation", "lpv.days": "days",
      "lpv.rName": "phase", "lpv.rAngle": "phase angle", "lpv.rLit": "illuminated", "lpv.rAge": "days since new moon"
    },
    id: {
      "lpv.phases": "Fase", "lpv.anim": "Animasi",
      "lpv.new": "Bulan Baru", "lpv.waxc": "Sabit Muda", "lpv.fq": "Kuartal Pertama", "lpv.waxg": "Cembung Muda",
      "lpv.full": "Purnama", "lpv.wang": "Cembung Tua", "lpv.lq": "Kuartal Terakhir", "lpv.wanc": "Sabit Tua",
      "lpv.run": "Jalankan Animasi", "lpv.stop": "Hentikan Animasi", "lpv.days": "hari",
      "lpv.rName": "fase", "lpv.rAngle": "sudut fase", "lpv.rLit": "bagian terang", "lpv.rAge": "hari sejak bulan baru"
    }
  },
  about: {
    en: "<p>The Moon's phases have names, and they follow a fixed order every 29.5 days — the <strong>synodic month</strong>. After <strong>new moon</strong> (the Moon between us and the Sun, its lit side facing away) a thin <strong>waxing crescent</strong> appears in the evening sky, growing to a half-lit <strong>first quarter</strong> a week later, then a <strong>waxing gibbous</strong>, and a <strong>full moon</strong> about two weeks after new.</p>" +
        "<p>Then the sequence runs backward: <strong>waning gibbous</strong>, <strong>last (third) quarter</strong>, <strong>waning crescent</strong>, and new moon again. <em>Waxing</em> means the lit part is growing, <em>waning</em> that it is shrinking; <em>crescent</em> means less than half lit, <em>gibbous</em> more than half. Note that a \"quarter\" moon looks half lit — the name refers to a quarter of the way through the cycle.</p>" +
        "<p>From the northern hemisphere a waxing moon is lit on its right side and a waning moon on its left, exactly as shown here; from the southern hemisphere the picture is flipped.</p>",
    id: "<p>Fase-fase Bulan punya nama, dan urutannya tetap setiap 29,5 hari — <strong>bulan sinodis</strong>. Setelah <strong>bulan baru</strong> (Bulan di antara kita dan Matahari, sisi terangnya membelakangi kita) muncul <strong>sabit muda</strong> tipis di langit senja, membesar menjadi <strong>kuartal pertama</strong> yang separuh terang seminggu kemudian, lalu <strong>cembung muda</strong>, dan <strong>purnama</strong> sekitar dua pekan setelah bulan baru.</p>" +
        "<p>Kemudian urutannya berbalik: <strong>cembung tua</strong>, <strong>kuartal terakhir</strong>, <strong>sabit tua</strong>, dan kembali bulan baru. Fase <em>muda</em> berarti bagian terangnya bertambah, <em>tua</em> berarti berkurang; <em>sabit</em> berarti kurang dari separuh terang, <em>cembung</em> lebih dari separuh. Perhatikan bahwa Bulan \"kuartal\" tampak separuh terang — namanya merujuk pada seperempat perjalanan siklus.</p>" +
        "<p>Dari belahan Bumi utara, Bulan muda terang di sisi kanannya dan Bulan tua di sisi kirinya, persis seperti di sini; dari belahan selatan gambarnya terbalik.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, D2R = Math.PI / 180;
    var SYNODIC = 29.5, K = 1.6;                     // the SWF's 230-px moon square, enlarged 1.6×
    var MOON = { x: 200, y: 200, R: 101 * K, box: (101 + 10) * K };
    var DARK_ALPHA = 0.6, TOL = 12;
    var PHASES = [
      { key: "lpv.new", a: 0, col: 0, row: 0 }, { key: "lpv.waxc", a: 45, col: 0, row: 1 },
      { key: "lpv.fq", a: 90, col: 0, row: 2 }, { key: "lpv.waxg", a: 135, col: 0, row: 3 },
      { key: "lpv.full", a: 180, col: 1, row: 0 }, { key: "lpv.wang", a: 225, col: 1, row: 1 },
      { key: "lpv.lq", a: 270, col: 1, row: 2 }, { key: "lpv.wanc", a: 315, col: 1, row: 3 }
    ];
    var COLX = [412, 584], ROW0 = 36, ROWH = 50, BW = 156, BH = 38;
    var RUN = { x: 412, y: 300, w: BW, h: BH }, TIMEBOX = { x: 584, y: 300, w: BW, h: BH };

    /* ---- state: init_phase 'Full Moon', not animating ---- */
    var phase = 180, animating = false, startTime = 0, runText = "", hover = null;
    var img = new Image(), imgReady = false;
    img.onload = function () { imgReady = true; S.requestDraw(); };
    img.src = "../assets/img/sims/full-moon.jpg";

    /* ================================ controls ================================ */
    S.group("lpv.phases");
    PHASES.forEach(function (p) { S.button({ labelKey: p.key, on: function () { setPhase(p.a); } }); });
    S.group("lpv.anim");
    var bRun = S.button({ labelKey: "lpv.run", primary: true, on: toggleRun });
    bRun.removeAttribute("data-i18n");
    var outName = S.readout({ labelKey: "lpv.rName" });
    var outAngle = S.readout({ labelKey: "lpv.rAngle" });
    var outLit = S.readout({ labelKey: "lpv.rLit" });
    var outAge = S.readout({ labelKey: "lpv.rAge" });

    var loop = S.loop(function (dt) {
      phase = (phase + dt * 360 / SYNODIC) % 360;    // one day per second
      var elapsed = (performance.now() - startTime) / 1000;
      var days = Math.round(elapsed * 10) / 10;
      runText = days.toFixed(1) + " " + I18N.t("lpv.days");
      upd();
    });
    function setPhase(a) {
      phase = a; startTime = performance.now(); runText = "";   // the buttons restart the day counter
      upd();
    }
    function toggleRun() {
      animating = !animating;
      if (animating) { startTime = performance.now(); loop.play(); } else loop.pause();
      syncRun(); upd();
    }
    function syncRun() { bRun.textContent = I18N.t(animating ? "lpv.stop" : "lpv.run"); }

    // getNameFromAngle() with the SWF's 12° tolerance around the quarters
    function nameFromAngle(a) {
      a = ((a % 360) + 360) % 360;
      if (a <= TOL) return "lpv.new";
      if (a < 90 - TOL) return "lpv.waxc";
      if (a <= 90 + TOL) return "lpv.fq";
      if (a < 180 - TOL) return "lpv.waxg";
      if (a <= 180 + TOL) return "lpv.full";
      if (a < 270 - TOL) return "lpv.wang";
      if (a <= 270 + TOL) return "lpv.lq";
      if (a < 360 - TOL) return "lpv.wanc";
      return "lpv.new";
    }
    function upd() {
      outName(I18N.t(nameFromAngle(phase)));
      outAngle(phase.toFixed(0) + "°");
      outLit(((1 - Math.cos(phase * D2R)) / 2 * 100).toFixed(0) + "%");
      outAge((phase / 360 * SYNODIC).toFixed(1));
      S.requestDraw();
    }
    S.refreshers.push(function () { syncRun(); upd(); });

    /* ---- the SWF's own buttons, drawn on the canvas, work too ---- */
    function btnRect(p) { return { x: COLX[p.col], y: ROW0 + p.row * ROWH, w: BW, h: BH }; }
    function inside(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }
    function pick(ev) {
      var r = S.canvas.getBoundingClientRect(), x = (ev.clientX - r.left) * S.W / r.width, y = (ev.clientY - r.top) * S.H / r.height;
      for (var i = 0; i < PHASES.length; i++) if (inside(btnRect(PHASES[i]), x, y)) return PHASES[i];
      return inside(RUN, x, y) ? "run" : null;
    }
    S.canvas.addEventListener("pointermove", function (ev) {
      var h = pick(ev);
      if (h !== hover) { hover = h; S.canvas.style.cursor = h ? "pointer" : "default"; S.requestDraw(); }
    });
    S.canvas.addEventListener("pointerleave", function () { hover = null; S.requestDraw(); });
    S.canvas.addEventListener("pointerup", function (ev) {
      var h = pick(ev);
      if (h === "run") toggleRun(); else if (h) setPhase(h.a);
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, S.W, S.H);
      // the black square, the Moon photograph, the phase mask
      ctx.fillStyle = "#000000"; ctx.fillRect(MOON.x - 115 * K, MOON.y - 115 * K, 230 * K, 230 * K);
      if (imgReady) ctx.drawImage(img, MOON.x - 109.7 * K, MOON.y - 110 * K, 220 * K, 220 * K);
      drawMask(ctx);

      PHASES.forEach(function (p) { button(ctx, btnRect(p), t(p.key), hover === p); });
      ctx.fillStyle = "#000000"; ctx.fillRect(COLX[0] - 8, 268, COLX[1] + BW - COLX[0] + 16, 5);
      button(ctx, RUN, t(animating ? "lpv.stop" : "lpv.run"), hover === "run");
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 3;
      ctx.strokeRect(TIMEBOX.x + 1.5, TIMEBOX.y + 1.5, TIMEBOX.w - 3, TIMEBOX.h - 3);
      ctx.fillStyle = "#000000"; ctx.font = "15px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(runText, TIMEBOX.x + TIMEBOX.w / 2, TIMEBOX.y + TIMEBOX.h / 2 + 1);
    });

    // updateMask(), scaled: the dark half-box on the unlit side + the band out to the terminator
    function drawMask(ctx) {
      var ph = ((phase % 360) + 360) % 360 * D2R;
      var dir = ph < Math.PI ? -1 : 1;
      var R = MOON.R, B = MOON.box, c = Math.cos(ph % Math.PI);
      ctx.save();
      ctx.translate(MOON.x, MOON.y);
      ctx.fillStyle = "rgba(0,0,0," + DARK_ALPHA + ")";
      ctx.beginPath();
      ctx.moveTo(0, R); ctx.lineTo(0, B); ctx.lineTo(dir * B, B); ctx.lineTo(dir * B, -B); ctx.lineTo(0, -B); ctx.lineTo(0, -R);
      // terminator from top to bottom through x = R·cos(phase mod 180°)
      for (var i = 1; i <= 32; i++) {
        var th = i / 32 * Math.PI;
        ctx.lineTo(R * Math.sin(th) * c, -R * Math.cos(th));
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function button(ctx, r, label, hot) {
      var rad = 9;
      ctx.fillStyle = hot ? "#d9d9d9" : "#cccccc";
      roundRect(ctx, r.x, r.y, r.w, r.h, rad); ctx.fill();
      if (!hot) { ctx.strokeStyle = "#000000"; ctx.lineWidth = 3; roundRect(ctx, r.x + 1.5, r.y + 1.5, r.w - 3, r.h - 3, rad - 1); ctx.stroke(); }
      ctx.fillStyle = "#000000"; ctx.font = "600 15px Tahoma, Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2 + 1, r.w - 10);
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    syncRun();
    upd();
  }
});
