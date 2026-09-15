/* CCD Simulator ----------------------------------------------------------------
   Faithful rebuild of the ClassAction "buckets.swf" (bucketClass, guageClass,
   arrayClass.empty(), decompiled). The classic rain-and-buckets analogy for a CCD:

     • rain falls on a 4 × 5 array of buckets (pixels); each collects a different
       amount, as each pixel collects a different number of photo-electrons;
     • the "readout": the right-hand column of buckets is a serial register —
       each bucket is siphoned down the column, one at a time, into the measuring
       beaker (the amplifier), whose meter records the amount in the table;
     • when that column is empty, every row shifts one bucket to the right
       (the parallel transfer) and the process repeats until all 20 are read.

   Amounts, rates and the exact transfer order come from the SWF: buckets fill to
   a random 80–150 units at 100 units/s, and the meter maps a beaker level L to
   0.625·L (L < 80) or 50 + 3.57143·(L − 80), so readings run 50–300 mm.        */
Sim.create({
  id: "buckets",
  width: 715, height: 598,
  strings: {
    en: {
      "bk.run": "Run", "bk.play": "Play", "bk.pause": "Pause", "bk.restart": "Restart",
      "bk.speed": "speed", "bk.title": "Rain Amount in Millimeters",
      "bk.rPhase": "stage", "bk.rDone": "buckets read", "bk.rNow": "reading bucket",
      "bk.idle": "press Play", "bk.rain": "raining", "bk.shift": "shifting rows right",
      "bk.serial": "moving down the column", "bk.measure": "measuring", "bk.finished": "all buckets read",
      "bk.row": "row", "bk.col": "column"
    },
    id: {
      "bk.run": "Jalankan", "bk.play": "Mulai", "bk.pause": "Jeda", "bk.restart": "Ulangi",
      "bk.speed": "kecepatan", "bk.title": "Jumlah Hujan dalam Milimeter",
      "bk.rPhase": "tahap", "bk.rDone": "ember terbaca", "bk.rNow": "membaca ember",
      "bk.idle": "tekan Mulai", "bk.rain": "hujan", "bk.shift": "menggeser baris ke kanan",
      "bk.serial": "turun sepanjang kolom", "bk.measure": "mengukur", "bk.finished": "semua ember terbaca",
      "bk.row": "baris", "bk.col": "kolom"
    }
  },
  about: {
    en: "<p>A <strong>CCD</strong> (charge-coupled device) — the detector in almost every astronomical camera — is a grid of tiny <strong>pixels</strong>. During an exposure each pixel turns the light that lands on it into electrons and stores them, just as each bucket collects rain. Brighter parts of the image fill their pixels faster.</p>" +
        "<p>The clever part is the <strong>readout</strong>. There is only one amplifier, in a corner, so the charge must be moved there without mixing up the pixels. The last column acts as a <em>serial register</em>: its charges are passed down one step at a time and measured as each one reaches the amplifier. Then every row is shifted one column over (a <em>parallel transfer</em>) to refill the register, and the process repeats until every pixel has been counted.</p>" +
        "<p>Because each measurement is written into the table at the bucket's original position, the numbers rebuild the picture the rain made. A real CCD does exactly this for millions of pixels — and it must transfer the charge almost perfectly, since every pixel's electrons pass through many others on the way out.</p>",
    id: "<p><strong>CCD</strong> (charge-coupled device) — detektor di hampir setiap kamera astronomi — adalah kisi <strong>piksel</strong> kecil. Selama pencahayaan setiap piksel mengubah cahaya yang jatuh padanya menjadi elektron dan menyimpannya, sama seperti setiap ember menampung hujan. Bagian citra yang lebih terang mengisi pikselnya lebih cepat.</p>" +
        "<p>Bagian cerdiknya ada pada <strong>pembacaan</strong>. Hanya ada satu penguat, di sudut, sehingga muatan harus dipindahkan ke sana tanpa tertukar antarpiksel. Kolom terakhir berfungsi sebagai <em>register serial</em>: muatannya dioper turun selangkah demi selangkah dan diukur saat masing-masing mencapai penguat. Kemudian setiap baris digeser satu kolom (<em>transfer paralel</em>) untuk mengisi register lagi, dan proses berulang sampai setiap piksel terhitung.</p>" +
        "<p>Karena setiap hasil ukur dicatat di tabel pada posisi asli embernya, angka-angka itu menyusun kembali gambar yang dibuat hujan. CCD sungguhan melakukan hal ini untuk jutaan piksel — dan harus memindahkan muatan hampir sempurna, karena elektron setiap piksel melewati banyak piksel lain dalam perjalanan keluar.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, K = S.W / 550;
    var RATE = 100;                                  // units per second (SWF _speed 0.1 per ms)

    /* ---- the SWF's placements: b_array at (187.65, 209.05) ×0.571 on the stage ---- */
    var BX = [[-164.15, -53.6, 60.75, 176.2, 290.2], [-190.8, -66.05, 60.75, 187.45, 314.15],
              [-213.1, -76.2, 62.0, 197.6, 334.5], [-242.7, -87.0, 60.7, 210.9, 361.1]];
    var BY = [-160.6, -70.8, 31.05, 142.15], RS = [0.7, 0.8, 0.9, 1.0];
    function bucketAt(r, c) {                        // r, c are 0-based
      return { x: 187.65 + 0.571 * BX[r][c], y: 209.05 + 0.571 * BY[r], s: 0.571 * RS[r] };
    }
    var GUAGE = { x: 485.6, y: 351.1, s: 0.714 };

    /* ---- state ---- */
    var level, amount, table, rainAmt, beaker, meter, phase, steps, stepIdx, cur, rain, played, running, done;
    var speedMul = 1;
    function reset() {
      level = []; amount = []; table = [];
      rainAmt = [];
      for (var i = 0; i < 20; i++) { level.push(0); amount.push(0); table.push(null); rainAmt.push(Math.round(80 + Math.random() * 70)); }
      beaker = { level: 0, fillTo: 0, mode: "idle" };
      meter = "";
      phase = "idle"; steps = buildSteps(); stepIdx = 0; cur = null;
      rain = { y: 0, on: false }; played = false; running = false; done = 0;
    }

    // the exact order arrayClass.empty() produces: ripple the next column right, then
    // pass the right-hand column down into the beaker one bucket at a time
    function buildSteps() {
      var out = [];
      for (var p = 0; p < 5; p++) {
        var c = 4 - p;                               // original column now being read (0-based)
        for (var k = c; k < 4; k++) out.push({ kind: "shift", from: k });
        for (var r = 3; r >= 0; r--) {
          for (var j = r; j < 3; j++) out.push({ kind: "down", from: j });
          out.push({ kind: "out", index: r * 5 + c, row: r, col: c });
        }
      }
      return out;
    }

    /* ================================ controls ================================ */
    S.group("bk.run");
    var bPlay = S.button({ labelKey: "bk.play", primary: true, on: function () { togglePlay(); } });
    var bRestart = S.button({ labelKey: "bk.restart", on: function () { restart(); } });
    bPlay.removeAttribute("data-i18n");              // its label is Play or Pause — set by syncButtons()
    S.select({
      labelKey: "bk.speed", value: "1",
      options: [{ v: "1", label: "1×" }, { v: "2", label: "2×" }, { v: "5", label: "5×" }],
      on: function (v) { speedMul = +v; }
    });
    var outPhase = S.readout({ labelKey: "bk.rPhase" });
    var outDone = S.readout({ labelKey: "bk.rDone" });
    var outNow = S.readout({ labelKey: "bk.rNow" });

    var loop = S.loop(function (dt) { tick(dt * speedMul); upd(); });
    function togglePlay() {
      if (phase === "done") reset();                 // Play after a finished run starts a new shower
      played = true;
      running = !running;
      if (running) loop.play(); else loop.pause();
      syncButtons(); S.requestDraw();
    }
    function restart() {
      loop.pause(); reset(); syncButtons(); upd();
    }
    function syncButtons() {
      bPlay.textContent = I18N.t(running ? "bk.pause" : "bk.play");
      bRestart.style.visibility = played ? "" : "hidden";
    }

    /* ---- the animation engine ---- */
    function approach(v, target, d) { return v < target ? Math.min(target, v + d) : Math.max(target, v - d); }
    function tick(dt) {
      var d = RATE * dt;
      if (phase === "idle") { phase = "rain"; rain.on = true; rain.y = 0; }
      if (phase === "rain") {
        rain.y += 200 * dt;                          // rain falls 0.2 px/ms
        if (rain.y > 178.2) {                        // once it reaches the buckets they fill together
          var all = true;
          for (var i = 0; i < 20; i++) {
            level[i] = approach(level[i], rainAmt[i], d);
            amount[i] = rainAmt[i];
            if (level[i] < rainAmt[i]) all = false;
          }
          if (all) { rain.on = false; phase = "read"; }
        }
        return;
      }
      if (phase !== "read") return;
      if (!cur) {
        if (stepIdx >= steps.length) { phase = "done"; running = false; loop.pause(); syncButtons(); return; }
        cur = startStep(steps[stepIdx]);
      }
      advance(cur, d);
    }
    function idx(r, c) { return r * 5 + c; }
    function startStep(st) {
      var s = { st: st, stage: 0 };
      if (st.kind === "shift") {
        s.pairs = [0, 1, 2, 3].map(function (r) { return [idx(r, st.from), idx(r, st.from + 1)]; });
      } else if (st.kind === "down") {
        s.pairs = [[idx(st.from, 4), idx(st.from + 1, 4)]];
      } else {
        s.src = idx(3, 4);
        beaker.fillTo = amount[s.src]; beaker.mode = "fill"; meter = "0";
      }
      if (s.pairs) s.pairs.forEach(function (p) { amount[p[1]] = amount[p[0]]; s.amt = s.amt || {}; s.amt[p[1]] = amount[p[0]]; });
      return s;
    }
    function advance(s, d) {
      if (s.pairs) {
        var busy = false;
        s.pairs.forEach(function (p) {
          var a = s.amt[p[1]];
          level[p[0]] = approach(level[p[0]], 0, d);
          level[p[1]] = approach(level[p[1]], a, d);
          if (level[p[0]] > 0 || level[p[1]] < a) busy = true;
        });
        if (!busy) { s.pairs.forEach(function (p) { amount[p[0]] = 0; }); finish(); }
        return;
      }
      // "out": the front bucket drains into the beaker, then the beaker drains through the meter
      if (s.stage === 0) {
        level[s.src] = approach(level[s.src], 0, d);
        beaker.level = approach(beaker.level, beaker.fillTo, d);
        if (level[s.src] <= 0 && beaker.level >= beaker.fillTo) { amount[s.src] = 0; s.stage = 1; beaker.mode = "empty"; }
      } else {
        beaker.level = approach(beaker.level, 0, d);
        meter = String(Math.round(meterValue(beaker.fillTo) - meterValue(beaker.level)));
        if (beaker.level <= 0) {
          table[s.st.index] = meter; done++;
          beaker.mode = "idle";
          finish();
        }
      }
    }
    function finish() { cur = null; stepIdx++; }
    // guageClass.setAmt(): the meter's calibration
    function meterValue(a) { return a < 80 ? 0.625 * a : 3.57143 * (a - 80) + 50; }

    function upd() {
      var t = I18N.t.bind(I18N), ph = "bk.idle";
      if (phase === "rain" && played) ph = "bk.rain";
      else if (phase === "read" && cur) ph = cur.st.kind === "shift" ? "bk.shift" : cur.st.kind === "down" ? "bk.serial" : "bk.measure";
      else if (phase === "read") ph = "bk.serial";
      else if (phase === "done") ph = "bk.finished";
      outPhase(t(ph));
      outDone(done + " / 20");
      var nextOut = null;
      for (var i = stepIdx; i < steps.length; i++) if (steps[i].kind === "out") { nextOut = steps[i]; break; }
      outNow(nextOut && phase === "read" ? t("bk.row") + " " + (nextOut.row + 1) + ", " + t("bk.col") + " " + (nextOut.col + 1) : "–");
      S.requestDraw();
    }
    S.refreshers.push(function () { syncButtons(); upd(); });

    /* ---- the canvas Play/Pause and Restart buttons, where the SWF has them ---- */
    var BTN_PLAY = { x: 420.6, y: 34, w: 109, h: 33 }, BTN_RESTART = { x: 420.6, y: 74, w: 109, h: 33 };
    function stageXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width / K, y: (ev.clientY - r.top) * S.H / r.height / K };
    }
    function inBtn(p, b) { return p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = stageXY(ev);
      if (inBtn(p, BTN_PLAY)) togglePlay();
      else if (played && inBtn(p, BTN_RESTART)) restart();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stageXY(ev);
      S.canvas.style.cursor = inBtn(p, BTN_PLAY) || (played && inBtn(p, BTN_RESTART)) ? "pointer" : "default";
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.save(); ctx.scale(K, K);
      ctx.fillStyle = "#339966"; ctx.fillRect(0, 0, 550, 460);

      // buckets back-to-front, each with the tube that feeds it
      for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 5; c++) {
          var b = bucketAt(r, c), i = idx(r, c);
          drawBucket(ctx, b, level[i]);
        }
        for (var c2 = 0; c2 < 4; c2++) drawRowTube(ctx, bucketAt(r, c2), bucketAt(r, c2 + 1), tubeActive("shift", c2));
        if (r > 0) drawColumnTube(ctx, bucketAt(r - 1, 4), bucketAt(r, 4), tubeActive("down", r - 1));
      }
      drawGuage(ctx);
      drawTable(ctx, t);
      if (rain.on && played) drawRain(ctx);
      drawButton(ctx, BTN_PLAY, t(running ? "bk.pause" : "bk.play"), true);
      if (played) drawButton(ctx, BTN_RESTART, t("bk.restart"), true);
      ctx.restore();
    });
    function tubeActive(kind, from) {
      return !!(cur && cur.st.kind === kind && cur.st.from === from);
    }

    // bucket art in the symbol's own units (origin at the bottom centre, rim at y = −100)
    function drawBucket(ctx, b, lv) {
      ctx.save();
      ctx.translate(b.x, b.y); ctx.scale(b.s, b.s);
      // inside of the bucket (seen over the rim)
      ctx.fillStyle = "#2d3230";
      ctx.beginPath(); ctx.ellipse(0, -100, 70, 13, 0, 0, TAU); ctx.fill();
      // water: yscale L % of a 70.3-unit shape based at y = 10.3, clipped to the bucket
      var body = new Path2D();
      body.moveTo(-70, -100); body.lineTo(-52, 0); body.ellipse(0, 0, 52, 10, 0, Math.PI, 0, true);
      body.lineTo(70, -100); body.ellipse(0, -100, 70, 13, 0, 0, Math.PI, false); body.closePath();
      // metal body
      var g = ctx.createLinearGradient(-70, 0, 70, 0);
      g.addColorStop(0, "#1f2321"); g.addColorStop(0.22, "#4f5552"); g.addColorStop(0.45, "#a4aaa7");
      g.addColorStop(0.62, "#5c625f"); g.addColorStop(1, "#1d201f");
      ctx.fillStyle = g; ctx.fill(body);
      if (lv > 0.5) {
        var top = 10.3 - 0.703 * lv, hw = 60 * (0.8 + 0.2 * Math.min(1, lv / 150));
        hw = Math.min(hw, 52 + 18 * (-top / 100));
        ctx.save(); ctx.clip(body);
        var wg = ctx.createLinearGradient(-60, 0, 60, 0);
        wg.addColorStop(0, "rgba(38,50,150,0.85)"); wg.addColorStop(0.5, "rgba(62,82,196,0.85)"); wg.addColorStop(1, "rgba(34,44,140,0.85)");
        ctx.fillStyle = wg; ctx.fillRect(-hw, top, hw * 2, 20 - top);
        ctx.fillStyle = "rgba(78,110,230,0.9)";
        ctx.beginPath(); ctx.ellipse(0, top, hw, 9, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
      // rim + handle
      ctx.strokeStyle = "#9da3a0"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(0, -100, 70, 13, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = "#262a28"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-66, -80); ctx.quadraticCurveTo(0, -18, 66, -80); ctx.stroke();
      ctx.fillStyle = "#3d423f";
      ctx.beginPath(); ctx.arc(-64, -80, 4, 0, TAU); ctx.arc(64, -80, 4, 0, TAU); ctx.fill();
      ctx.restore();
    }

    function tubeStyle(ctx, active, s) {
      return function (path) {
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(60,70,66,0.55)"; ctx.lineWidth = 11 * s; ctx.stroke(path);
        ctx.strokeStyle = active ? "#4a67dc" : "#d9dcdd"; ctx.lineWidth = 7 * s; ctx.stroke(path);
      };
    }
    function drawRowTube(ctx, A, B, active) {
      var p = new Path2D(), top = Math.min(A.y, B.y) - 112 * A.s;
      p.moveTo(A.x + 38 * A.s, A.y - 6 * A.s);
      p.lineTo(A.x + 58 * A.s, A.y - 96 * A.s);
      p.quadraticCurveTo(A.x + 64 * A.s, top, A.x + 80 * A.s, top);
      p.lineTo(B.x - 80 * B.s, top);
      p.quadraticCurveTo(B.x - 64 * B.s, top, B.x - 58 * B.s, B.y - 96 * B.s);
      p.lineTo(B.x - 38 * B.s, B.y - 6 * B.s);
      tubeStyle(ctx, active, A.s)(p);
    }
    function drawColumnTube(ctx, U, D, active) {
      var p = new Path2D(), top = U.y - 112 * U.s, xr = Math.max(U.x + 84 * U.s, D.x + 84 * D.s);
      p.moveTo(U.x + 40 * U.s, U.y - 8 * U.s);
      p.lineTo(U.x + 60 * U.s, U.y - 96 * U.s);
      p.quadraticCurveTo(U.x + 66 * U.s, top, xr, top + 6 * U.s);
      p.quadraticCurveTo(xr + 10 * D.s, D.y - 120 * D.s, D.x + 62 * D.s, D.y - 98 * D.s);
      p.lineTo(D.x + 40 * D.s, D.y - 8 * D.s);
      tubeStyle(ctx, active, D.s)(p);
    }

    function drawGuage(ctx) {
      var cx = GUAGE.x - 1, bottom = 358, topY = 262, hw = 38.5;
      var draining = beaker.mode === "empty", filling = cur && cur.st.kind === "out" && cur.stage === 0;
      // tube from the front bucket into the beaker
      var fb = bucketAt(3, 4), p = new Path2D();
      p.moveTo(fb.x + 40 * fb.s, fb.y - 8 * fb.s);
      p.lineTo(fb.x + 58 * fb.s, fb.y - 96 * fb.s);
      p.quadraticCurveTo(fb.x + 66 * fb.s, 222, 452, 226);
      p.quadraticCurveTo(470, 232, 470, 262);
      p.lineTo(470, 336);
      tubeStyle(ctx, filling, 0.6)(p);
      // outlet tube: beaker → meter → drain
      var q = new Path2D();
      q.moveTo(509, 350); q.bezierCurveTo(548, 352, 552, 390, 500, 398); q.lineTo(482, 398);
      q.moveTo(446, 415); q.bezierCurveTo(446, 430, 430, 440, 432, 470);
      tubeStyle(ctx, draining, 0.55)(q);
      // wire from the meter to the table
      ctx.strokeStyle = "#3a3f3c"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(410, 400); ctx.bezierCurveTo(360, 402, 380, 446, 317, 441); ctx.stroke();

      // the glass beaker
      ctx.fillStyle = "rgba(226,240,234,0.55)";
      ctx.beginPath(); ctx.moveTo(cx - hw, topY); ctx.lineTo(cx - hw, bottom);
      ctx.ellipse(cx, bottom, hw, 7, 0, Math.PI, 0, true); ctx.lineTo(cx + hw, topY); ctx.closePath(); ctx.fill();
      if (beaker.level > 0.5) {
        var wt = bottom - 0.511 * beaker.level;
        ctx.fillStyle = "rgba(60,82,200,0.82)";
        ctx.beginPath(); ctx.moveTo(cx - hw + 2, wt); ctx.lineTo(cx - hw + 2, bottom);
        ctx.ellipse(cx, bottom, hw - 2, 6, 0, Math.PI, 0, true); ctx.lineTo(cx + hw - 2, wt); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(90,120,235,0.95)";
        ctx.beginPath(); ctx.ellipse(cx, wt, hw - 2, 6, 0, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(cx, topY, hw, 7, 0, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - hw, topY); ctx.lineTo(cx - hw, bottom); ctx.moveTo(cx + hw, topY); ctx.lineTo(cx + hw, bottom); ctx.stroke();
      ctx.strokeStyle = "#5b605e"; ctx.lineWidth = 1.4;
      for (var k = 0; k < 7; k++) {
        var gy = bottom - 12 - k * 12.5;
        ctx.beginPath(); ctx.moveTo(cx - hw + 5, gy); ctx.lineTo(cx - hw + (k % 2 ? 14 : 22), gy); ctx.stroke();
      }
      ctx.fillStyle = "#8d9290"; ctx.beginPath(); ctx.arc(509, 350, 3, 0, TAU); ctx.fill();

      // the meter
      var mg = ctx.createLinearGradient(0, 377, 0, 415);
      mg.addColorStop(0, "#d6dcd9"); mg.addColorStop(1, "#9ea4a1");
      ctx.fillStyle = mg; roundRect(ctx, 409.7, 377, 71.8, 38.2, 4); ctx.fill();
      ctx.strokeStyle = "#5f6461"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#c9d6cf"; roundRect(ctx, 414.5, 384, 44, 25, 2); ctx.fill();
      ctx.strokeStyle = "#4a4f4c"; ctx.stroke();
      ctx.fillStyle = "#1b1f1d"; ctx.font = "15px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(meter, 436.5, 397);
      ctx.fillStyle = beaker.mode === "fill" ? "#e0321f" : "#6b2a22";
      ctx.beginPath(); ctx.arc(467.5, 389, 3.2, 0, TAU); ctx.fill();
      var blink = draining && (Math.floor(performance.now() / 160) % 2 === 0);
      ctx.fillStyle = draining ? "#2fd05a" : "#2d5a38";
      ctx.beginPath(); ctx.arc(467.5, 402, 3.2, 0, TAU); ctx.fill();
      ctx.fillStyle = blink ? "#ff4b3a" : "#6b2a22";
      ctx.beginPath(); ctx.arc(475.7, 402, 2.4, 0, TAU); ctx.fill();
    }

    function drawTable(ctx, t) {
      ctx.fillStyle = "#000000"; ctx.font = "16px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("bk.title"), 172.7, 322);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(28.5, 332.7, 288.4, 117);
      ctx.strokeStyle = "#333333"; ctx.lineWidth = 2;
      ctx.strokeRect(28.5, 332.7, 288.4, 117);
      ctx.lineWidth = 1;
      for (var c = 1; c < 5; c++) { ctx.beginPath(); ctx.moveTo(28.5 + c * 57.1, 332.7); ctx.lineTo(28.5 + c * 57.1, 449.7); ctx.stroke(); }
      for (var r = 1; r < 4; r++) { ctx.beginPath(); ctx.moveTo(28.5, 332.7 + r * 29.25); ctx.lineTo(316.9, 332.7 + r * 29.25); ctx.stroke(); }
      ctx.fillStyle = "#000000"; ctx.font = "12px Verdana, system-ui, sans-serif";
      for (var i = 0; i < 20; i++) {
        ctx.fillText(table[i] == null ? "--" : table[i], 28.5 + (i % 5 + 0.5) * 57.1, 332.7 + (Math.floor(i / 5) + 0.5) * 29.25);
      }
    }

    function drawRain(ctx) {
      ctx.save();
      ctx.beginPath(); ctx.rect(17, 0, 469, 300); ctx.clip();
      ctx.strokeStyle = "rgba(210,228,255,0.55)"; ctx.lineWidth = 1;
      var off = rain.y % 60;
      for (var i = 0; i < 90; i++) {
        var x = 17 + ((i * 97) % 469), y = ((i * 53) % 360) - 60 + off + Math.min(rain.y, 178) * 0.3;
        if (y > 300) y -= 360;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 14); ctx.stroke();
      }
      ctx.restore();
    }

    function drawButton(ctx, b, label, enabled) {
      var g = ctx.createLinearGradient(0, b.y, 0, b.y + b.h);
      g.addColorStop(0, "#fff38a"); g.addColorStop(1, "#f3cf32");
      ctx.fillStyle = g; roundRect(ctx, b.x, b.y, b.w, b.h, 4); ctx.fill();
      ctx.strokeStyle = "#c9a200"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = enabled ? "#000000" : "#777777"; ctx.font = "13px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, b.x + b.w / 2, b.y + b.h / 2 + 1);
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    reset();
    syncButtons();
    upd();
  }
});
