/* Blink Comparator Simulator -----------------------------------------------------
   Faithful rebuild of NAAP's "blinkComparatorSimulator.swf". Pick some of the
   night's exposures, queue them up, and flip between them: everything that stays
   put is a constant star, and whatever winks is the variable you are hunting.

   The data is the SWF's own settings.xml — a 400 x 300 frame at noise mean 2300 /
   sigma 330, saturation magnitude 3, an Airy disc of radius 5, twenty-six stars
   (twenty-one constant, four pulsating, one eclipsing binary) and 113 observations
   spanning epochs 1.72 to 22.00 days, each with the noise seed that makes its
   grain reproducible.

   The variable stars follow the SWF's own prototypes, shared with the Variable
   Star Photometry Analyzer in _vspdata.js: a PulsatingStar is a Fourier sum,
   m = centre + sum A_k cos((k+1) theta + phi_k) with theta = 2 pi epoch / period;
   the eclipsing binary TW Cas is two uniform discs on an orbit inclined 74.7
   degrees, weighted by visual surface brightness, whose period (1.42503 d)
   follows from Kepler's third law at a separation of 8.17 solar radii.        */
Sim.create({
  id: "blinkcomparatorsimulator",
  width: 784, height: 408,
  strings: {
    en: {
      "bl.q": "Queue", "bl.all": "Queue all", "bl.addAll": "Queue every tenth", "bl.clear": "Empty the queue",
      "bl.play": "Blink", "bl.rate": "Blink rate", "bl.back": "◀ Back",
      "bl.fwd": "Forward ▶", "bl.opt": "Options", "bl.cross": "show crosshairs",
      "bl.invert": "invert the display", "bl.reset": "Reset",
      "bl.obsTitle": "Observations", "bl.queueTitle": "Queue", "bl.epoch": "epoch",
      "bl.rEpoch": "showing epoch", "bl.rQueue": "in the queue", "bl.rPos": "cursor",
      "bl.rOf": "of",
      "bl.none": "—", "bl.empty": "double-click an observation to queue it",
      "bl.hint": "Queue several exposures, then blink between them and watch for a star that changes brightness. Click an observation on the left to add it; click one in the queue to take it out.",
      "bl.days": "d"
    },
    id: {
      "bl.q": "Antrean", "bl.all": "Antrekan semua", "bl.addAll": "Antrekan tiap kesepuluh", "bl.clear": "Kosongkan antrean",
      "bl.play": "Kedip", "bl.rate": "Laju kedip", "bl.back": "◀ Mundur",
      "bl.fwd": "Maju ▶", "bl.opt": "Pilihan", "bl.cross": "tampilkan garis bidik",
      "bl.invert": "balikkan tampilan", "bl.reset": "Atur ulang",
      "bl.obsTitle": "Pengamatan", "bl.queueTitle": "Antrean", "bl.epoch": "epok",
      "bl.rEpoch": "menampilkan epok", "bl.rQueue": "dalam antrean", "bl.rPos": "kursor",
      "bl.rOf": "dari",
      "bl.none": "—", "bl.empty": "klik sebuah pengamatan untuk mengantrekannya",
      "bl.hint": "Antrekan beberapa pemotretan, lalu kedipkan di antaranya dan perhatikan bintang yang berubah terang. Klik pengamatan di kiri untuk menambahkannya; klik yang di antrean untuk mengeluarkannya.",
      "bl.days": "h"
    }
  },
  about: {
    en: "<p>Before computers, this is how variable stars and moving objects were found. Two photographic plates of the same field, taken on different nights and carefully registered, were flipped back and forth under a viewer. Anything that had not changed stayed rock steady; anything that had jumped out at the eye.</p>" +
        "<p>The method works because human vision is far better at detecting change than at comparing absolute brightness. Asked whether one star is a tenth of a magnitude brighter than another, most people cannot say. Asked whether a star is winking as the images alternate, almost anyone can.</p>" +
        "<p>It is a genuinely historic instrument. Clyde Tombaugh found Pluto in 1930 by blinking plates of the same star field for the better part of a year, looking for the one dot that had shifted. Here the constant stars sit still and four pulsating stars and one eclipsing binary do the winking.</p>",
    id: "<p>Sebelum ada komputer, beginilah bintang variabel dan benda yang bergerak ditemukan. Dua pelat fotografi medan yang sama, diambil pada malam berbeda dan ditumpangtindihkan dengan cermat, dibolak-balik di bawah alat pengamat. Apa pun yang tidak berubah tampak diam tak bergeming; apa pun yang berubah langsung menyita perhatian.</p>" +
        "<p>Cara ini berhasil karena penglihatan manusia jauh lebih baik dalam mendeteksi perubahan daripada membandingkan kecerlangan mutlak. Ditanya apakah satu bintang sepersepuluh magnitudo lebih terang daripada bintang lain, kebanyakan orang tak bisa menjawab. Ditanya apakah sebuah bintang berkedip saat citranya berganti-ganti, hampir siapa pun bisa.</p>" +
        "<p>Ini instrumen yang sungguh bersejarah. Clyde Tombaugh menemukan Pluto pada 1930 dengan mengedipkan pelat medan bintang yang sama hampir sepanjang setahun, mencari satu titik yang telah berpindah. Di sini bintang-bintang tetap diam sementara empat bintang berdenyut dan satu binari gerhana yang berkedip.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var FONT = "Verdana, Geneva, sans-serif";
    var MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

    /* fieldParameters, the stars, the 113 observations and the variable-star
       models are the lab's shared settings.xml, in _vspdata.js              */
    var F = VSP.FIELD, STARS = VSP.STARS, OBS = VSP.OBS, magnitudeAt = VSP.magnitudeAt;
    var FW = F.width, FH = F.height, FX = 12, FY = 40;
    var NOISE_MEAN = F.noiseMean, NOISE_SIGMA = F.noiseSigma, SAT_MAG = F.saturationMagnitude, PSF_R = F.psfRadius;
    var LIST_A = { x: 426, y: 40, w: 166, h: 300 };
    var LIST_B = { x: 604, y: 40, w: 166, h: 300 };
    var ROW = 20;
    var queue = [], shown = -1, scrollA = 0, scrollB = 0;
    var crosshairs = true, invert = false, cursor = null, rate = 2;
    var cache = {}, cacheOrder = [];

    function frameFor(idx) {
      var key = idx + (invert ? "i" : "n");
      if (cache[key]) return cache[key];
      var ob = OBS[idx];
      var counts = STARFIELD.render({ width: FW, height: FH, noiseMean: NOISE_MEAN,
        noiseSigma: NOISE_SIGMA, saturationMagnitude: SAT_MAG, seed: ob[1],
        psf: STARFIELD.airyDisc(PSF_R),
        stars: STARS.map(function (st) {
          return { x: st.x, y: st.y, magnitude: magnitudeAt(st, ob[0]) };
        }) });
      var c = document.createElement("canvas");
      c.width = FW; c.height = FH;
      var cx = c.getContext("2d");
      var img = cx.createImageData(FW, FH);
      STARFIELD.paint(img, counts, invert);
      cx.putImageData(img, 0, 0);
      cache[key] = c;
      cacheOrder.push(key);
      while (cacheOrder.length > 24) delete cache[cacheOrder.shift()];
      return c;
    }

    /* ------------------------------------------------------------- controls */
    S.group("bl.q");
    /* fill the queue with every observation, or with every tenth one */
    function fillQueue(every) {
      queue = [];
      for (var i = 0; i < OBS.length; i += every) queue.push(i);
      shown = queue.length ? 0 : -1; scrollB = 0;
      sync();
    }
    S.button({ labelKey: "bl.all", on: function () { fillQueue(1); } });
    S.button({ labelKey: "bl.addAll", on: function () { fillQueue(10); } });
    S.button({ labelKey: "bl.clear", on: function () {
      queue = []; shown = -1; loop.pause(); sync();
    } });
    S.button({ labelKey: "bl.back", on: function () { step(-1); } });
    S.button({ labelKey: "bl.fwd", on: function () { step(1); } });
    var loop = S.loop(function (dt) {
      acc += dt;
      if (acc >= 1 / rate) { acc = 0; step(1); }
    });
    var acc = 0;
    S.playPause(loop);
    var rateCtl = S.slider({ labelKey: "bl.rate", min: 0.5, max: 8, value: 2, step: 0.5,
      format: function (v) { return v.toFixed(1) + " Hz"; }, on: function (v) { rate = v; } });

    S.group("bl.opt");
    var crossCtl = S.toggle({ labelKey: "bl.cross", value: true,
      on: function (v) { crosshairs = v; } });
    var invCtl = S.toggle({ labelKey: "bl.invert", value: false,
      on: function (v) { invert = v; } });
    S.button({ labelKey: "bl.reset", on: function () {
      loop.pause(); queue = []; shown = -1; scrollA = 0; scrollB = 0;
      crossCtl.set(true); invCtl.set(false); rateCtl.set(2); sync();
    } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "bl.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outEpoch = S.readout({ labelKey: "bl.rEpoch" });
    var outQueue = S.readout({ labelKey: "bl.rQueue" });
    var outPos = S.readout({ labelKey: "bl.rPos" });

    function step(d) {
      if (!queue.length) { shown = -1; sync(); return; }
      shown = ((shown + d) % queue.length + queue.length) % queue.length;
      sync();
    }
    function sync() {
      outEpoch(shown >= 0 ? OBS[queue[shown]][0].toFixed(4) + " " + I18N.t("bl.days")
        : I18N.t("bl.none"));
      outQueue(queue.length + " " + I18N.t("bl.rOf") + " " + OBS.length);
      outPos(cursor ? cursor.x + ", " + cursor.y : I18N.t("bl.none"));
      S.requestDraw();
    }

    /* ---------------------------------------------------------- interaction */
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      var a = rowAt(p, LIST_A, scrollA, OBS.length);
      if (a >= 0) {
        if (queue.indexOf(a) < 0) { queue.push(a); if (shown < 0) shown = 0; }
        sync(); return;
      }
      var b = rowAt(p, LIST_B, scrollB, queue.length);
      if (b >= 0) {
        queue.splice(b, 1);
        if (shown >= queue.length) shown = queue.length - 1;
        sync();
      }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      var c = null;
      if (p.x >= FX && p.x < FX + FW && p.y >= FY && p.y < FY + FH) {
        c = { x: Math.floor(p.x - FX), y: Math.floor(p.y - FY) };
      }
      if ((c === null) !== (cursor === null) ||
          (c && cursor && (c.x !== cursor.x || c.y !== cursor.y))) { cursor = c; sync(); }
    });
    S.canvas.addEventListener("pointerleave", function () {
      if (cursor) { cursor = null; sync(); }
    });
    S.canvas.addEventListener("wheel", function (ev) {
      var p = at(ev), d = ev.deltaY > 0 ? 1 : -1;
      if (inRect(p, LIST_A)) {
        scrollA = clampScroll(scrollA + d * 3, OBS.length);
        ev.preventDefault(); S.requestDraw();
      } else if (inRect(p, LIST_B)) {
        scrollB = clampScroll(scrollB + d * 3, queue.length);
        ev.preventDefault(); S.requestDraw();
      }
    }, { passive: false });
    function clampScroll(v, n) {
      var vis = Math.floor((LIST_A.h - 26) / ROW);
      return Math.max(0, Math.min(Math.max(0, n - vis), v));
    }
    function inRect(p, r) {
      return p.x >= r.x && p.x < r.x + r.w && p.y >= r.y && p.y < r.y + r.h;
    }
    function rowAt(p, r, scroll, n) {
      if (!inRect(p, r) || p.y < r.y + 26) return -1;
      var i = Math.floor((p.y - r.y - 26) / ROW) + scroll;
      return i >= 0 && i < n ? i : -1;
    }
    function at(ev) {
      var rr = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - rr.left) * S.W / rr.width,
        y: (ev.clientY - rr.top) * S.H / rr.height };
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#eef0f4"; ctx.fillRect(0, 0, S.W, S.H);

      ctx.fillStyle = invert ? "#ffffff" : "#000000";
      ctx.fillRect(FX, FY, FW, FH);
      if (shown >= 0) ctx.drawImage(frameFor(queue[shown]), FX, FY);
      else {
        ctx.fillStyle = "#8a8f98"; ctx.font = "12px " + FONT;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(tr("bl.empty"), FX + FW / 2, FY + FH / 2);
      }
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 1;
      ctx.strokeRect(FX - 0.5, FY - 0.5, FW + 1, FH + 1);

      if (crosshairs && cursor) {
        ctx.strokeStyle = "rgba(255,90,90,0.8)"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(FX, FY + cursor.y + 0.5); ctx.lineTo(FX + FW, FY + cursor.y + 0.5);
        ctx.moveTo(FX + cursor.x + 0.5, FY); ctx.lineTo(FX + cursor.x + 0.5, FY + FH);
        ctx.stroke();
      }

      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#333333"; ctx.font = "12px " + FONT;
      ctx.fillText(tr("bl.obsTitle"), LIST_A.x, LIST_A.y - 10);
      ctx.fillText(tr("bl.queueTitle"), LIST_B.x, LIST_B.y - 10);
      ctx.fillText(tr("bl.epoch") + (shown >= 0
        ? ":  " + OBS[queue[shown]][0].toFixed(4) + " " + tr("bl.days") : ""), FX, FY - 10);

      list(ctx, tr, LIST_A, scrollA, OBS.length, function (i) {
        return { text: OBS[i][0].toFixed(4), on: queue.indexOf(i) >= 0, cur: false };
      });
      list(ctx, tr, LIST_B, scrollB, queue.length, function (i) {
        return { text: OBS[queue[i]][0].toFixed(4), on: false, cur: i === shown };
      });
    });

    function list(ctx, tr, r, scroll, n, get) {
      ctx.fillStyle = "#ffffff"; ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeStyle = "#c8ccd4"; ctx.lineWidth = 1;
      ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
      ctx.fillStyle = "#f2f4f8"; ctx.fillRect(r.x + 1, r.y + 1, r.w - 2, 24);
      ctx.fillStyle = "#555555"; ctx.font = "11px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(tr("bl.epoch"), r.x + 10, r.y + 13);
      ctx.save();
      ctx.beginPath(); ctx.rect(r.x + 1, r.y + 26, r.w - 2, r.h - 27); ctx.clip();
      var vis = Math.floor((r.h - 26) / ROW);
      for (var k = 0; k < vis && scroll + k < n; k++) {
        var i = scroll + k, row = get(i), y = r.y + 26 + k * ROW;
        if (row.cur) { ctx.fillStyle = "#1668c4"; ctx.fillRect(r.x + 1, y, r.w - 2, ROW); }
        else if (row.on) { ctx.fillStyle = "#dceaf8"; ctx.fillRect(r.x + 1, y, r.w - 2, ROW); }
        ctx.fillStyle = row.cur ? "#ffffff" : "#222222";
        ctx.font = "11px " + MONO;
        ctx.fillText(row.text, r.x + 10, y + ROW / 2);
      }
      ctx.restore();
      if (n > vis) {
        var frac = vis / n, top = scroll / n;
        ctx.fillStyle = "#c8ccd4";
        ctx.fillRect(r.x + r.w - 6, r.y + 26 + (r.h - 27) * top, 4, (r.h - 27) * frac);
      }
    }

    sync();
  }
});
