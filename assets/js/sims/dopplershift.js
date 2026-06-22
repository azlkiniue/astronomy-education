/* Doppler Shift Demonstrator ---------------------------------------------------
   Faithful rebuild of the ClassAction "Doppler Shift Demonstrator"
   (dopplershift.swf):
     • a top strip of the waves "as emitted from source" (fixed wavelength) and a
       strip "as detected by observer" — both are scrolling time-histories, so the
       detected strip records the wavelength changing as the geometry changes
       (compressed → blue approaching, stretched → red receding); a "time →" arrow,
     • the main field with a moving Source (S) emitting circular wavefronts that
       bunch ahead of it, and an Observer (O) — BOTH are draggable; fling the
       source to give it velocity,
     • controls — pause simulation, animation rate, start/stop emission, show paths. */
Sim.create({
  id: "dopplershift",
  width: 760, height: 560,
  strings: {
    en: {
      "ds.emit": "waves as emitted from source", "ds.detect": "waves as detected by observer", "ds.time": "time →",
      "ds.controls": "Controls", "ds.rate": "animation rate",
      "ds.stop": "stop emission", "ds.resume": "start emission", "ds.paths": "show paths",
      "ds.show": "Show", "ds.radial": "show line to observer",
      "ds.readings": "Readings", "ds.vr": "radial velocity", "ds.shift": "wavelength shift", "ds.state": "Doppler state",
      "ds.blue": "blueshift (approaching)", "ds.red": "redshift (receding)", "ds.none": "no shift (transverse)",
      "ds.dragHint": "drag the Source (S) to fling it, or the Observer (O) to move it"
    },
    id: {
      "ds.emit": "gelombang yang dipancarkan sumber", "ds.detect": "gelombang yang diterima pengamat", "ds.time": "waktu →",
      "ds.controls": "Kontrol", "ds.rate": "kecepatan animasi",
      "ds.stop": "hentikan pancaran", "ds.resume": "mulai pancaran", "ds.paths": "tampilkan jejak",
      "ds.show": "Tampilkan", "ds.radial": "tampilkan garis ke pengamat",
      "ds.readings": "Bacaan", "ds.vr": "kecepatan radial", "ds.shift": "pergeseran panjang gelombang", "ds.state": "keadaan Doppler",
      "ds.blue": "pergeseran biru (mendekat)", "ds.red": "pergeseran merah (menjauh)", "ds.none": "tanpa pergeseran (transversal)",
      "ds.dragHint": "seret Sumber (S) untuk melontarkannya, atau Pengamat (O) untuk memindahkannya"
    }
  },
  about: {
    en: "<p>A wave's measured frequency depends on how the source and observer move <em>relative to each other</em>. When a source approaches, each successive crest is launched a little nearer than the last, so the crests bunch up — a shorter wavelength, a higher pitch, a <strong>blueshift</strong>. When it recedes, the crests spread out — a longer wavelength, a <strong>redshift</strong>.</p>" +
        "<p>Fling the Source and watch the circular wavefronts: each expands at the wave speed from the point where it was emitted, but the source has moved on, so the circles crowd together ahead of it and stretch out behind. Only the <em>radial</em> part of the motion matters — at closest approach the motion is transverse and there is no shift.</p>" +
        "<p>The detected strip is a running history: as the source swings past the observer you can read the wavelength compress and then stretch. This is how astronomers measure speeds across the cosmos — the redshift of a galaxy's spectral lines, or the back-and-forth wobble of a star betraying an unseen planet.</p>",
    id: "<p>Frekuensi gelombang yang terukur bergantung pada gerak sumber dan pengamat <em>relatif satu sama lain</em>. Saat sumber mendekat, tiap puncak berikutnya dipancarkan sedikit lebih dekat, sehingga puncak merapat — panjang gelombang lebih pendek, nada lebih tinggi, <strong>pergeseran biru</strong>. Saat menjauh, puncak merenggang — <strong>pergeseran merah</strong>.</p>" +
        "<p>Lontarkan Sumber dan amati muka gelombang melingkar: tiap lingkaran membesar dengan laju gelombang dari titik pancarnya, tetapi sumber telah berpindah, sehingga lingkaran merapat di depannya dan merenggang di belakang. Hanya komponen gerak <em>radial</em> yang berpengaruh — pada jarak terdekat geraknya transversal dan tak ada pergeseran.</p>" +
        "<p>Strip terdeteksi adalah riwayat berjalan: saat sumber melintas dekat pengamat, kamu bisa membaca panjang gelombang merapat lalu merenggang. Beginilah astronom mengukur kecepatan di alam semesta.</p>"
  },
  build: function (S) {
    var C = { text: "#e8ecf8", dim: "#9fabce", border: "#2c3a66", panel: "#070b16",
              src: "#ffd166", obs: "#7fd1ff", wave: "#9fb4e8" };
    var TAU = Math.PI * 2;
    var c = 116;                       // wave speed, px/s
    var emitInterval = 0.3;            // s between wavefronts
    var rate = 1, simT = 0, lastEmit = 0;
    var fronts = [], path = [];
    var emitting = true;
    var src = { x: 0, y: 0, vx: 0, vy: 0 }, obs = { x: 0, y: 0 };

    // scrolling wave-history strips
    var MAXS = 260, dPhase = TAU * 9 / MAXS;
    var emitSamples = [], detSamples = [], phaseE = 0, phaseD = 0;

    var MAIN = { x: 12, y: 196, w: 736, h: 350 };
    function resetField() {
      src.x = MAIN.x + 70; src.y = MAIN.y + MAIN.h * 0.42; src.vx = 0.42 * c; src.vy = 0;
      obs.x = MAIN.x + MAIN.w * 0.80; obs.y = MAIN.y + MAIN.h * 0.78;
      fronts = []; path = []; simT = 0; lastEmit = 0;
      emitSamples = []; detSamples = []; phaseE = 0; phaseD = 0;
      var r0 = lamRatio();
      for (var i = 0; i < MAXS; i++) { phaseE += dPhase; phaseD += dPhase / r0; emitSamples.push(Math.sin(phaseE)); detSamples.push(Math.sin(phaseD)); }
    }

    /* ---- controls ---- */
    S.group("ds.controls");
    var loop = S.loop(function (dt) { step(dt * rate); });
    S.playPause(loop);
    S.slider({ labelKey: "ds.rate", min: 0.25, max: 2.5, step: 0.05, value: rate,
      format: function (v) { return v.toFixed(2) + "×"; }, on: function (v) { rate = v; } });
    var stopBtn = S.button({ labelKey: "ds.stop", on: function () { emitting = !emitting; syncStop(); } });
    function syncStop() { var k = emitting ? "ds.stop" : "ds.resume"; stopBtn.setAttribute("data-i18n", k); stopBtn.textContent = I18N.t(k); }
    S.refreshers.push(syncStop);

    S.group("ds.show");
    var optPaths = S.toggle({ labelKey: "ds.paths", value: false });
    var optRadial = S.toggle({ labelKey: "ds.radial", value: true });

    var oVr = S.readout({ labelKey: "ds.vr" });
    var oShift = S.readout({ labelKey: "ds.shift" });
    var oState = S.readout({ labelKey: "ds.state" });

    function radialVel() {           // px/s, + = receding
      var dx = src.x - obs.x, dy = src.y - obs.y, d = Math.hypot(dx, dy) || 1;
      return (src.vx * dx + src.vy * dy) / d;
    }
    function lamRatio() { return Math.max(0.2, 1 + radialVel() / c); }   // λ_obs / λ0

    function step(dt) {
      simT += dt;
      if (!dragging || dragTarget !== "src") {
        src.x += src.vx * dt; src.y += src.vy * dt;
        if (src.x < MAIN.x + 14) { src.x = MAIN.x + 14; src.vx = Math.abs(src.vx); }
        if (src.x > MAIN.x + MAIN.w - 14) { src.x = MAIN.x + MAIN.w - 14; src.vx = -Math.abs(src.vx); }
        if (src.y < MAIN.y + 14) { src.y = MAIN.y + 14; src.vy = Math.abs(src.vy); }
        if (src.y > MAIN.y + MAIN.h - 14) { src.y = MAIN.y + MAIN.h - 14; src.vy = -Math.abs(src.vy); }
      }
      if (simT - lastEmit > emitInterval * 2) lastEmit = simT - emitInterval;
      if (emitting && simT - lastEmit >= emitInterval) {
        lastEmit += emitInterval; fronts.push({ x: src.x, y: src.y, t: simT });
        if (fronts.length > 90) fronts.shift();
      }
      path.push({ x: src.x, y: src.y }); if (path.length > 400) path.shift();
      var diag = Math.hypot(MAIN.w, MAIN.h);
      fronts = fronts.filter(function (f) { return c * (simT - f.t) < diag; });
      // push one sample to each scrolling strip
      var r = lamRatio();
      phaseE += dPhase; phaseD += dPhase / r;
      emitSamples.push(Math.sin(phaseE)); if (emitSamples.length > MAXS) emitSamples.shift();
      detSamples.push(Math.sin(phaseD)); if (detSamples.length > MAXS) detSamples.shift();
      upd();
    }
    function upd() {
      var vr = radialVel(), ratio = lamRatio();
      oVr((vr / c).toFixed(2) + " c");
      oShift(((ratio - 1) * 100).toFixed(1) + " %");
      oState(I18N.t(Math.abs(vr / c) < 0.02 ? "ds.none" : vr < 0 ? "ds.blue" : "ds.red"));
      S.requestDraw();
    }

    /* ---- drag the Source (fling) or the Observer ---- */
    var dragging = false, dragTarget = null, lastDrag = null;
    function localXY(ev) { var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * (S.W / r.width), y: (ev.clientY - r.top) * (S.H / r.height) }; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var m = localXY(ev);
      if (Math.hypot(m.x - src.x, m.y - src.y) < 22) { dragging = true; dragTarget = "src"; src.vx = src.vy = 0; }
      else if (Math.hypot(m.x - obs.x, m.y - obs.y) < 24) { dragging = true; dragTarget = "obs"; }
      if (dragging) { lastDrag = { x: m.x, y: m.y, t: performance.now() }; S.canvas.setPointerCapture(ev.pointerId); }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!dragging) return; var m = localXY(ev);
      var tgt = dragTarget === "src" ? src : obs;
      tgt.x = Math.max(MAIN.x + 14, Math.min(MAIN.x + MAIN.w - 14, m.x));
      tgt.y = Math.max(MAIN.y + 14, Math.min(MAIN.y + MAIN.h - 14, m.y));
      if (dragTarget === "src" && lastDrag) {
        var dtm = Math.max(0.016, (performance.now() - lastDrag.t) / 1000);
        var vx = (m.x - lastDrag.x) / dtm, vy = (m.y - lastDrag.y) / dtm;
        var sp = Math.hypot(vx, vy), max = 0.85 * c;
        if (sp > max) { vx *= max / sp; vy *= max / sp; }
        src.vx = vx; src.vy = vy;                       // live velocity → readouts update while flinging
      }
      lastDrag = { x: m.x, y: m.y, t: performance.now() };
      upd();
    });
    S.canvas.addEventListener("pointerup", function () { dragging = false; dragTarget = null; });

    /* ===================== drawing ===================== */
    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      var ratio = lamRatio();
      drawStrip(ctx, 28, I18N.t("ds.emit"), emitSamples, "#9fb4e8");
      drawStrip(ctx, 112, I18N.t("ds.detect"), detSamples, shiftColor(ratio));
      drawMain(ctx);
    });

    function drawStrip(ctx, y, title, samples, col) {
      var A = { x: 12, y: y, w: 736, h: 64 };
      panel(ctx, A);
      var midY = A.y + A.h / 2 + 6, x0 = A.x + 14, x1 = A.x + A.w - 14, w = x1 - x0, amp = 15;
      ctx.save(); roundRectPath(ctx, A.x, A.y, A.w, A.h, 10); ctx.clip();
      ctx.beginPath();
      for (var i = 0; i < samples.length; i++) {
        var xx = x0 + (i / (MAXS - 1)) * w, yy = midY - amp * samples[i];
        i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
      ctx.fillStyle = C.dim; ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "top";
      ctx.fillText(title, A.x + 12, A.y + 6);
      ctx.textAlign = "right"; ctx.fillText(I18N.t("ds.time"), A.x + A.w - 12, A.y + A.h - 18);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }

    function drawMain(ctx) {
      panel(ctx, MAIN);
      ctx.save(); roundRectPath(ctx, MAIN.x, MAIN.y, MAIN.w, MAIN.h, 10); ctx.clip();

      if (optPaths.value() && path.length > 1) {
        ctx.strokeStyle = "rgba(255,209,102,0.35)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); path.forEach(function (p, i) { i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.lineWidth = 1.4;
      fronts.forEach(function (f) {
        var rad = c * (simT - f.t); if (rad < 1) return;
        ctx.globalAlpha = Math.max(0.12, 1 - rad / Math.hypot(MAIN.w, MAIN.h));
        ctx.strokeStyle = C.wave; ctx.beginPath(); ctx.arc(f.x, f.y, rad, 0, TAU); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      if (optRadial.value()) {
        ctx.strokeStyle = "rgba(127,209,255,0.5)"; ctx.lineWidth = 1; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(src.x, src.y); ctx.lineTo(obs.x, obs.y); ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.restore();

      // velocity arrow
      if (Math.hypot(src.vx, src.vy) > 4) arrow(ctx, src.x, src.y, src.x + src.vx * 0.18, src.y + src.vy * 0.18, C.src);
      // Source (S)
      marker(ctx, src.x, src.y, C.src, "S", "#3a2c00");
      // Observer (O)
      marker(ctx, obs.x, obs.y, C.obs, "O", "#053040");

      ctx.fillStyle = C.dim; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.t("ds.dragHint"), MAIN.x + MAIN.w / 2, MAIN.y + MAIN.h - 8);
    }

    function marker(ctx, x, y, col, letter, textCol) {
      var g = ctx.createRadialGradient(x - 3, y - 3, 1, x, y, 12);
      g.addColorStop(0, "#ffffff"); g.addColorStop(1, col);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = textCol; ctx.font = "bold 12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(letter, x, y + 0.5); ctx.textBaseline = "alphabetic";
    }
    function shiftColor(ratio) { return ratio < 0.98 ? "#6ea8fe" : ratio > 1.02 ? "#ff6b6b" : "#9fb4e8"; }
    function arrow(ctx, x0, y0, x1, y1, col) {
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      var a = Math.atan2(y1 - y0, x1 - x0);
      ctx.beginPath(); ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - 7 * Math.cos(a - 0.4), y1 - 7 * Math.sin(a - 0.4));
      ctx.lineTo(x1 - 7 * Math.cos(a + 0.4), y1 - 7 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
    }
    function panel(ctx, A) { roundRectPath(ctx, A.x, A.y, A.w, A.h, 10); ctx.fillStyle = C.panel; ctx.fill();
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.stroke(); }
    function roundRectPath(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    resetField();
    upd();
  }
});
