/* Blackbody Curves of Melting (Melted Nail Demonstration) -------------------------
   Faithful rebuild of ClassAction's "meltednail.swf" (meltedNail007). A nail held
   under tension is heated by a large current until it melts and snaps. The film is
   the SWF's own: an 848-frame On2 VP6 stream (240 x 180, 20 fps) inside the
   849-frame sprite `nailMovie`, which opens on a still photograph (bitmap 55) that
   fades out over frames 2–18 and closes on a second one (bitmap 59) fading in over
   838–849. Those fades are baked into assets/video/meltednail.mp4, so video frame
   k is exactly sprite frame k + 1. The video is decoded once into memory
   (_filmframes.js), so like the SWF's own stream any frame shows at once, and the
   film plays by stepping through them at the SWF's 20 frames a second.

   The temperature is the SWF's model, a straight line in time with the snap at
   frame 429 (iron melts at about 1811 K):

       frame 1: 300 K;  frames ≤ 429: 800 + (1000/429)·f;
       frames < 849: 1800 − (1000/420)·(f − 429);  frame 849: 300 K

   and both plots are its SimpleBlackbody component: Planck's law with
   c1 = 1.19104e-16, c2 = 0.0143878, drawn black over a 20 % #c0c0c0 fill. The main
   plot runs 300–800 nm with the brightness scale LOCKED at 1.83955504960e8 (so the
   red end climbs off the top past ~1240 K); the inset runs 0–10 µm and is scaled so
   its peak stands at (T − 800)/1000 of its height — flat at 800 K, full at 1800 K.

   The start/pause button and the frame slider are drawn where the SWF has them and
   work there too; the sidebar carries the same controls.                        */
Sim.create({
  id: "meltednail",
  width: 800, height: 310,
  strings: {
    en: {
      "mn.group": "Movie", "mn.frame": "movie frame", "mn.reset": "Reset",
      "mn.start": "start", "mn.pause": "pause", "mn.resume": "resume", "mn.restart": "restart",
      "mn.startB": "Start", "mn.pauseB": "Pause", "mn.resumeB": "Resume", "mn.restartB": "Restart",
      "mn.hint": "Drag the slider under the film to scrub through it; the curves follow the temperature.",
      "mn.temp": "temperature", "mn.peak": "peak wavelength", "mn.power": "power radiated vs 300 K",
      "mn.tempLabel": "temperature:", "mn.title": "Blackbody Curve",
      "mn.intensity": "intensity", "mn.wavelength": "wavelength", "mn.loading": "loading the film…"
    },
    id: {
      "mn.group": "Film", "mn.frame": "bingkai film", "mn.reset": "Atur ulang",
      "mn.start": "mulai", "mn.pause": "jeda", "mn.resume": "lanjut", "mn.restart": "ulangi",
      "mn.startB": "Mulai", "mn.pauseB": "Jeda", "mn.resumeB": "Lanjutkan", "mn.restartB": "Ulangi",
      "mn.hint": "Seret penggeser di bawah film untuk menelusurinya; kurva mengikuti suhunya.",
      "mn.temp": "suhu", "mn.peak": "panjang gelombang puncak", "mn.power": "daya pancar dibanding 300 K",
      "mn.tempLabel": "suhu:", "mn.title": "Kurva Benda Hitam",
      "mn.intensity": "intensitas", "mn.wavelength": "panjang gelombang", "mn.loading": "memuat film…"
    }
  },
  about: {
    en: "<p>The apparatus shown is a common demonstration piece in introductory science classes. A nail is placed under tension and a large electric current is allowed to flow through it. The nail's temperature rises until the iron melts and the tension pulls the nail apart, breaking the circuit. The way its colour and brightness change with temperature illustrates Wien's and the Stefan–Boltzmann laws.</p>" +
        "<p>Watch the right-hand plot as the film runs. At first the nail barely glows: at 800 K almost everything it radiates is infrared, far to the right of the visible band, and the small inset — which spans 0 to 10 µm — shows where the bulk of the curve really lies. As the current heats the nail the curve grows very quickly, because the total power radiated rises as the fourth power of the temperature (Stefan–Boltzmann: σT⁴). Doubling the temperature makes the nail radiate sixteen times as much.</p>" +
        "<p>At the same time the peak slides toward shorter wavelengths, λ<sub>peak</sub> = 2898 µm·K / T (Wien's law), so more of the emission falls inside the visible band, starting at its red end. That is why hot metal goes from a dull cherry red through orange to a yellow-white. Even at the melting point, about 1811 K, the peak is still at 1.6 µm in the infrared: iron melts long before it could glow blue.</p>" +
        "<p>The temperatures here are a model rather than a measurement — the original simply ramps them in step with the film, reaching iron's melting point at the moment the nail snaps and cooling back down afterwards.</p>",
    id: "<p>Peralatan yang tampak adalah alat peraga yang umum di kelas sains pengantar. Sebuah paku ditegangkan lalu dialiri arus listrik yang besar. Suhu paku naik sampai besinya meleleh dan tegangan itu menarik paku hingga putus, sehingga rangkaian terputus. Cara warna dan kecerahannya berubah seiring suhu menggambarkan hukum Wien dan hukum Stefan–Boltzmann.</p>" +
        "<p>Perhatikan grafik di kanan selagi film berjalan. Mula-mula paku hampir tidak berpijar: pada 800 K hampir seluruh pancarannya berupa inframerah, jauh di sebelah kanan pita cahaya tampak, dan grafik kecil di dalamnya — yang mencakup 0 hingga 10 µm — menunjukkan di mana sebagian besar kurva sebenarnya berada. Saat arus memanaskan paku, kurvanya tumbuh sangat cepat, karena daya total yang dipancarkan naik sebanding pangkat empat suhu (Stefan–Boltzmann: σT⁴). Menggandakan suhu membuat paku memancar enam belas kali lebih banyak.</p>" +
        "<p>Pada saat yang sama puncaknya bergeser ke panjang gelombang yang lebih pendek, λ<sub>puncak</sub> = 2898 µm·K / T (hukum Wien), sehingga makin banyak pancaran yang jatuh di dalam pita tampak, dimulai dari ujung merahnya. Itulah sebabnya logam panas berubah dari merah buram, lalu jingga, hingga putih kekuningan. Bahkan pada titik lelehnya, sekitar 1811 K, puncaknya masih di 1,6 µm dalam inframerah: besi sudah meleleh jauh sebelum dapat berpijar biru.</p>" +
        "<p>Suhu di sini adalah model, bukan hasil pengukuran — simulasi aslinya hanya menaikkan suhu seiring jalannya film, mencapai titik leleh besi tepat saat paku putus, lalu mendinginkannya kembali sesudahnya.</p>"
  },
  build: function (S) {
    var OY = -30;                                   // the SWF's title bar is the page header here
    var FONT = "Verdana, Geneva, sans-serif";
    var FPS = 20, FRAMES = 849, SNAP = 429;

    /* SimpleBlackbody's constants */
    var C1 = 1.1910425859324616e-16, C2 = 0.014387750559248378, WIEN = 0.0028977682864295084;
    var LOCKED_MAX = 183955504.96;

    /* layout, all from the SWF's display list */
    var LEFT = { x: 7, y: 37 + OY, w: 340, h: 296 };
    var RIGHT = { x: 354, y: 37 + OY, w: 439, h: 296 };
    var MOVIE = { x: 17, y: 47 + OY, w: 320, h: 240 };
    var PLOT = { x: 401.4, y: 283.4 + OY, w: 360, h: 217, min: 3e-7, max: 8e-7 };
    var INSET = { x: 412, y: 136 + OY, w: 110, h: 70, min: 0, max: 1e-5 };
    var BTN = { x: 40.9, y: 297.8 + OY, w: 70, h: 25 };
    var BAR = { x: 133.15, y: 310.4 + OY, w: 180.9, margin: 7, cap: 3.1 };   // w = _width, caps overhang

    var frame = 1, state = "atStart", ahead = 0;

    /* ------------------------------------------------------------- the film */
    var still = new Image();
    still.onload = function () { S.requestDraw(); };
    still.src = "../assets/img/sims/meltednail-start.jpg";
    var movie = FilmFrames.load("../assets/video/meltednail.mp4", {
      fps: FPS, count: FRAMES, fullRange: false,                  // video-range BT.601
      onframe: function (k) { if (k === frame - 1) S.requestDraw(); }
    });
    movie.want(0);

    /* -------------------------------------------------------------- the model */
    function temperature(f) {
      if (f === 1) return 300;
      if (f <= SNAP) return 800 + 1000 / SNAP * f;
      if (f < FRAMES) return 1800 - 1000 / (FRAMES - SNAP) * (f - SNAP);
      return 300;
    }
    function planck(lambda, T) {
      var e = Math.exp(C2 / (lambda * T)) - 1;
      return e === Infinity ? 0 : C1 / (Math.pow(lambda, 5) * e);
    }

    /* ------------------------------------------------ the SWF's state machine */
    var loopApi = S.loop(function (dt) {            // nailMovie plays at the SWF's 20 fps
      ahead += dt * FPS;
      var n = Math.floor(ahead);
      if (n < 1) return;
      ahead -= n;
      frame = Math.min(FRAMES, frame + n);
      movie.want(frame - 1);
      syncSlider();
      if (frame >= FRAMES) stopAnimation(); else sync();
    });
    function startAnimation() { state = "animating"; ahead = 0; loopApi.play(); update(); }
    function pauseAnimation() { state = "paused"; halt(); update(); }
    function stopAnimation() { frame = FRAMES; state = "atEnd"; halt(); syncSlider(); update(); }
    function restartAnimation() { frame = 1; startAnimation(); syncSlider(); }
    function resetAnimation() { frame = 1; state = "atStart"; halt(); syncSlider(); update(); }
    function halt() { loopApi.pause(); movie.want(frame - 1); }
    function onButton() {
      movie.unlock();
      if (state === "atStart" || state === "paused") startAnimation();
      else if (state === "animating") pauseAnimation();
      else restartAnimation();
    }
    function onFrameChanged(f) {                  // onFrameChangedViaSlider
      movie.unlock();
      frame = Math.max(1, Math.min(FRAMES, Math.round(f)));
      if (frame === 1) resetAnimation();
      else if (frame >= FRAMES) stopAnimation();
      else { state = "paused"; halt(); update(); }
    }
    function update() { syncButton(); sync(); S.requestDraw(); }

    /* ------------------------------------------------------------- controls */
    S.group("mn.group");
    var btn = S.button({ labelKey: "mn.startB", primary: true, on: onButton });
    var syncingSlider = false;
    var frameCtl = S.slider({ labelKey: "mn.frame", min: 1, max: FRAMES, step: 1, value: 1,
      format: function (v) { return Math.round(v) + " / " + FRAMES; },
      on: function (v) { if (!syncingSlider) onFrameChanged(v); } });
    S.button({ labelKey: "mn.reset", on: resetAnimation });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "mn.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var outT = S.readout({ labelKey: "mn.temp" });
    var outPeak = S.readout({ labelKey: "mn.peak" });
    var outPow = S.readout({ labelKey: "mn.power" });

    function label() {
      return { atStart: "mn.start", animating: "mn.pause", paused: "mn.resume", atEnd: "mn.restart" }[state];
    }
    function syncButton() {
      var k = label() + "B";
      btn.setAttribute("data-i18n", k); btn.textContent = I18N.t(k);
    }
    function syncSlider() {
      syncingSlider = true; frameCtl.set(frame); syncingSlider = false;
    }
    var shown = {};
    function put(key, fn, text) { if (shown[key] !== text) { shown[key] = text; fn(text); } }
    function sync() {
      var T = temperature(frame);
      put("t", outT, Math.floor(T) + " K");
      put("p", outPeak, (WIEN / T * 1e6).toFixed(2) + " µm");
      var r = Math.pow(T / 300, 4);
      put("w", outPow, (r < 10 ? r.toFixed(1) : String(Math.round(r))) + " ×");
    }
    S.refreshers.push(function () { shown = {}; syncButton(); sync(); });

    /* ------------------------------------ the in-canvas button and slider */
    function at(ev) {
      var b = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - b.left) * S.W / b.width, y: (ev.clientY - b.top) * S.H / b.height };
    }
    var range = BAR.w - 2 * BAR.margin;
    function grabX() { return BAR.x + BAR.margin + range * (frame - 1) / (FRAMES - 1); }
    function frameAt(x) { return 1 + (FRAMES - 1) * Math.max(0, Math.min(1, (x - BAR.x - BAR.margin) / range)); }
    var drag = null, pressed = false, hot = null;
    function hit(p) {
      if (p.x >= BTN.x && p.x <= BTN.x + BTN.w && p.y >= BTN.y && p.y <= BTN.y + BTN.h) return "btn";
      if (Math.abs(p.y - BAR.y) <= 11 && p.x >= BAR.x - 4 && p.x <= BAR.x + BAR.w + 4) return "bar";
      return null;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p);
      if (!h) return;
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* synthetic events */ }
      ev.preventDefault();
      if (h === "btn") { pressed = true; S.requestDraw(); return; }
      /* the SWF's slider: grab the thumb where it is pressed, or jump there first */
      var off = Math.abs(p.x - grabX()) <= 6 ? p.x - grabX() : 0;
      drag = { off: off };
      onFrameChanged(frameAt(p.x - off)); syncSlider();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (drag) { onFrameChanged(frameAt(p.x - drag.off)); syncSlider(); return; }
      var h = hit(p);
      if (h !== hot) { hot = h; S.canvas.style.cursor = h ? "pointer" : ""; S.requestDraw(); }
    });
    S.canvas.addEventListener("pointerup", function (ev) {
      if (pressed) {
        pressed = false;
        if (hit(at(ev)) === "btn") onButton();
        S.requestDraw();
      }
      drag = null;
    });
    S.canvas.addEventListener("pointercancel", function () { pressed = false; drag = null; S.requestDraw(); });

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      panel(ctx, LEFT, null, t);
      panel(ctx, RIGHT, t("mn.title"), t);
      film(ctx, t);
      button(ctx, t);
      slider(ctx);
      var T = temperature(frame);
      mainPlot(ctx, T, t);
      insetPlot(ctx, T);
    });

    function panel(ctx, b, title) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      if (!title) return;
      ctx.font = "14px " + FONT; ctx.fillStyle = "#333333";
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var tw = ctx.measureText(title).width;
      ctx.fillText(title, b.x + 5, b.y + 18);
      ctx.strokeStyle = "#cccccc";
      ctx.beginPath(); ctx.moveTo(b.x + 10 + tw, b.y + 12.5); ctx.lineTo(b.x + b.w - 5, b.y + 12.5); ctx.stroke();
    }

    function film(ctx, t) {
      ctx.fillStyle = "#000000"; ctx.fillRect(MOVIE.x, MOVIE.y, MOVIE.w, MOVIE.h);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      if (movie.has(frame - 1) || (movie.shown >= 0 && frame > 1)) {   // until it arrives, the last frame shown
        movie.draw(ctx, frame - 1, MOVIE.x, MOVIE.y, MOVIE.w, MOVIE.h);
      } else if (still.complete && still.naturalWidth && frame === 1) {
        ctx.drawImage(still, MOVIE.x, MOVIE.y, MOVIE.w, MOVIE.h);
      } else {
        ctx.fillStyle = "#888888"; ctx.font = "12px " + FONT; ctx.textAlign = "center";
        ctx.fillText(t("mn.loading"), MOVIE.x + MOVIE.w / 2, MOVIE.y + MOVIE.h / 2);
      }
      /* "temperature:" (static text 109) and temperatureField (EditText 110) */
      ctx.fillStyle = "#ffffff"; ctx.font = "bold 12px " + FONT;
      ctx.textBaseline = "alphabetic";
      var lab = t("mn.tempLabel"), right = 80.1 + 23.35 + 89.15;
      ctx.textAlign = "right"; ctx.fillText(lab, right, 65.5 + OY);
      ctx.textAlign = "left"; ctx.fillText(Math.floor(temperature(frame)) + " K", 198.6, 65.5 + OY);
    }

    /* the FUI push button: #e8e8e8 face, #999999 edge, white and #cccccc bevels */
    function button(ctx, t) {
      var b = BTN, down = pressed && hot === "btn";
      ctx.fillStyle = down ? "#d6d6d6" : hot === "btn" ? "#f2f2f2" : "#e8e8e8";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = down ? "#cccccc" : "#ffffff";
      ctx.beginPath(); ctx.moveTo(b.x + 1.5, b.y + b.h - 1.5); ctx.lineTo(b.x + 1.5, b.y + 1.5);
      ctx.lineTo(b.x + b.w - 1.5, b.y + 1.5); ctx.stroke();
      ctx.strokeStyle = down ? "#ffffff" : "#cccccc";
      ctx.beginPath(); ctx.moveTo(b.x + b.w - 1.5, b.y + 1.5); ctx.lineTo(b.x + b.w - 1.5, b.y + b.h - 1.5);
      ctx.lineTo(b.x + 1.5, b.y + b.h - 1.5); ctx.stroke();
      ctx.strokeStyle = "#999999"; ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      ctx.fillStyle = "#000000"; ctx.font = "12px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t(label()), b.x + b.w / 2 + (down ? 1 : 0), b.y + b.h / 2 + (down ? 1 : 0));
    }

    /* StandardSliderClassV6: a 6 px bar, 1 px #c0c0c0 border, #fafafa→#d0d0d0,
       rounded ends; a 9 x 17 grabber, #e0e0e0 / #f4f4f4 / #e0e0e0 across       */
    function slider(ctx) {
      var y = BAR.y, h = 3;
      ctx.save();
      roundRect(ctx, BAR.x - BAR.cap - 1, y - h - 1, BAR.w + 2 * BAR.cap + 2, 2 * h + 2, h + 1);
      ctx.fillStyle = "#c0c0c0"; ctx.fill();
      var g = ctx.createLinearGradient(0, y - h, 0, y + h);
      g.addColorStop(0, "#fafafa"); g.addColorStop(1, "#d0d0d0");
      roundRect(ctx, BAR.x - BAR.cap, y - h, BAR.w + 2 * BAR.cap, 2 * h, h);
      ctx.fillStyle = g; ctx.fill();
      var gx = grabX(), gw = 4.5, gh = 8.5;
      roundRect(ctx, gx - gw - 1, y - gh - 1, 2 * gw + 2, 2 * gh + 2, 4);
      ctx.fillStyle = drag || hot === "bar" ? "#b0b0b0" : "#c0c0c0"; ctx.fill();
      var gg = ctx.createLinearGradient(gx - gw, 0, gx + gw, 0);
      gg.addColorStop(0, "#e0e0e0"); gg.addColorStop(0.5, "#f4f4f4"); gg.addColorStop(1, "#e0e0e0");
      roundRect(ctx, gx - gw, y - gh, 2 * gw, 2 * gh, 3.5);
      ctx.fillStyle = gg; ctx.fill();
      ctx.restore();
    }
    function roundRect(ctx, x, y, w, h, r) {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }

    /* one blackbody curve: 20 % #c0c0c0 under a 1 px black line, masked to the plot */
    function curve(ctx, P, T, scale) {
      var n = Math.ceil(P.w), pts = [];
      for (var i = 0; i <= n; i++) {
        var lam = P.min + (P.max - P.min) * i / n;
        var y = lam > 0 ? -planck(lam, T) * scale : 0;
        pts.push(Math.max(y, -P.h - 100));
      }
      ctx.save();
      ctx.translate(P.x, P.y);
      ctx.beginPath(); ctx.rect(0, -P.h, P.w, P.h); ctx.clip();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      pts.forEach(function (y, i) { ctx.lineTo(P.w * i / n, y); });
      ctx.lineTo(P.w, 0); ctx.closePath();
      ctx.fillStyle = "rgba(192,192,192,0.2)"; ctx.fill();
      ctx.beginPath();
      pts.forEach(function (y, i) { if (i) ctx.lineTo(P.w * i / n, y); else ctx.moveTo(0, y); });
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }

    /* the visible band under the axis: Flash blends its stops unpremultiplied,
       so the fades at either end run through black — resampled here        */
    var SPECTRUM = (function () {
      var cols = [[0, 0, 0, 0], [0, 0, 255, 0.9], [0, 255, 255, 0.9], [0, 255, 0, 0.9],
        [255, 255, 0, 0.9], [255, 0, 0, 0.9], [0, 0, 0, 0]];
      var ratios = [0, 48, 96, 128, 160, 207, 255], stops = [];
      for (var k = 0; k < cols.length - 1; k++) {
        for (var s = 0; s < 8; s++) {
          var u = s / 8, c = cols[k].map(function (v, j) { return v + (cols[k + 1][j] - v) * u; });
          stops.push([(ratios[k] + (ratios[k + 1] - ratios[k]) * u) / 255,
            "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + c[3].toFixed(3) + ")"]);
        }
      }
      stops.push([1, "rgba(0,0,0,0)"]);
      return stops;
    })();

    function mainPlot(ctx, T, t) {
      var P = PLOT, hs = P.w / (P.max - P.min);
      /* the y axis is a root shape (105): x = 401, y 71…282 */
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(401, 71 + OY); ctx.lineTo(401, 282 + OY); ctx.stroke();
      curve(ctx, P, T, P.h / LOCKED_MAX);
      ctx.save();
      ctx.translate(P.x, P.y);
      var x0 = hs * (4e-7 - P.min), g = ctx.createLinearGradient(x0, 0, x0 + hs * 3e-7, 0);
      SPECTRUM.forEach(function (s) { g.addColorStop(s[0], s[1]); });
      ctx.fillStyle = g; ctx.fillRect(0, 0, P.w, 7);
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0.5); ctx.lineTo(P.w, 0.5);
      ctx.fillStyle = "#000000"; ctx.font = "10px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      for (var k = 6; k <= 16; k++) {
        var x = Math.round(hs * (k * 5e-8 - P.min)) + 0.5, major = k % 2 === 0;
        ctx.moveTo(x, 0); ctx.lineTo(x, major ? 10 : 7);
        if (major) ctx.fillText(k * 50 + " nm", x, 22.8);
      }
      ctx.stroke();
      ctx.restore();
      /* the two bold axis titles (static texts 103 and 104) */
      ctx.font = "bold 12px " + FONT; ctx.fillStyle = "#000000";
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(t("mn.wavelength"), 581.45, 325.65 + OY);
      ctx.save();
      ctx.translate(387.75, 170 + OY); ctx.rotate(-Math.PI / 2);
      ctx.fillText(t("mn.intensity"), 0, 0);
      ctx.restore();
    }

    function insetPlot(ctx, T) {
      var P = INSET, peak = T > 800 ? (T - 800) / 1000 : 0;
      if (peak > 0) curve(ctx, P, T, P.h * peak / planck(WIEN / T, T));
      ctx.save();
      ctx.translate(P.x, P.y);
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0.5); ctx.lineTo(P.w, 0.5);
      [0, 55, 110].forEach(function (x) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, 3); });
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#000000"; ctx.font = "8px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText("0 µm", 407.55, 149.95 + OY);
      ctx.fillText("5 µm", 454.55, 149.95 + OY);
      ctx.fillText("10 µm", 499, 149.95 + OY);
    }

    syncButton();
    sync();
  }
});
