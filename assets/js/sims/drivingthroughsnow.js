/* Driving Through Snow -----------------------------------------------------------
   Faithful rebuild of ClassAction's "drivingthroughsnow.swf". Snow falls straight
   down, but drive into it and it appears to stream outward from a point dead
   ahead. That point is the direction you are travelling — and it is exactly why
   a meteor shower has a radiant: the Earth is ploughing into a stream of debris,
   and the debris only *seems* to come from one spot in the sky.

   The SWF's SnowField class, decompiled: ten thousand flakes in a box
   x, z in ±visibility·sin(FOV/2) and y in 0..visibility, a focal length of
   sqrt(w² + h²) / tan(FOV/2), and each flake plotted as an additive grey pixel of
   brightness 240 − 240·|r| / visibility, so the far ones fade out. Its opening
   settings are 10000 flakes, a 110° field of view, visibility 100, car speed 20
   and snow speed 1 (both divided by 1000 before use).

   The picture is the SWF's own: its 600 x 240 stage, the 590 x 160 snow bitmap
   at (5, 5), shape 3 masking it so the snow shows only through the glass, and
   the car interior drawn from the SWF's shape records (_drivingthroughsnow-
   art.js) in its depth order. The dashboard's "58 mph" is live here, since the
   speed can be changed: 58 mph is what the SWF prints at its car speed of 20.  */
Sim.create({
  id: "drivingthroughsnow",
  width: 760, height: 304,
  strings: {
    en: {
      "ds.ctl": "Driving conditions", "ds.car": "Car speed", "ds.snow": "Snowfall speed",
      "ds.vis": "Visibility", "ds.flakes": "Number of flakes", "ds.fov": "Field of view",
      "ds.opt": "Options", "ds.radiant": "mark the radiant", "ds.reset": "Reset",
      "ds.rSpeed": "speed", "ds.rSeen": "flakes on screen", "ds.rRad": "radiant",
      "ds.ahead": "straight ahead",
      "ds.hint": "Slow the car right down and the snow just falls. Speed up and it fans out from the point you are driving towards — the same illusion that gives a meteor shower its radiant.",
      "ds.unit": "mph"
    },
    id: {
      "ds.ctl": "Kondisi berkendara", "ds.car": "Laju mobil", "ds.snow": "Laju jatuh salju",
      "ds.vis": "Jarak pandang", "ds.flakes": "Jumlah serpih", "ds.fov": "Medan pandang",
      "ds.opt": "Pilihan", "ds.radiant": "tandai radian", "ds.reset": "Atur ulang",
      "ds.rSpeed": "laju", "ds.rSeen": "serpih di layar", "ds.rRad": "radian",
      "ds.ahead": "tepat di depan",
      "ds.hint": "Perlambat mobil sampai hampir berhenti dan salju hanya jatuh. Percepat dan salju memancar dari titik yang Anda tuju — ilusi yang sama yang memberi hujan meteor sebuah radian.",
      "ds.unit": "km/j"
    }
  },
  about: {
    en: "<p>Snow falls straight down. Sit still and that is all you see. Drive into it and the picture changes completely: the flakes race outward from a point on the windscreen and streak past on either side, as though they were being fired at you from one place in the distance.</p>" +
        "<p>Nothing has changed about the snow. What you are seeing is the addition of your own motion to theirs. Relative to the car, every flake is moving backwards at the car's speed, and parallel lines of motion, seen in perspective, converge on a vanishing point — which sits exactly in the direction you are heading.</p>" +
        "<p>A meteor shower is the same geometry at a larger scale. The Earth ploughs into a stream of dust left along a comet's orbit, all of it moving on near-parallel paths, and the trails appear to radiate from one point in the sky. The shower is named for whatever constellation the point happens to fall in — the Perseids, the Leonids — which says nothing about where the dust really is.</p>",
    id: "<p>Salju jatuh lurus ke bawah. Diamlah dan hanya itu yang Anda lihat. Berkendaralah ke dalamnya dan gambarnya berubah sama sekali: serpih-serpih itu memancar dari satu titik di kaca depan lalu melesat melewati kedua sisi, seolah ditembakkan kepada Anda dari satu tempat di kejauhan.</p>" +
        "<p>Tidak ada yang berubah pada saljunya. Yang Anda lihat adalah penjumlahan gerak Anda sendiri dengan gerak mereka. Relatif terhadap mobil, setiap serpih bergerak mundur dengan laju mobil, dan garis-garis gerak yang sejajar, dilihat dalam perspektif, bertemu pada satu titik lenyap — yang terletak tepat pada arah tujuan Anda.</p>" +
        "<p>Hujan meteor adalah geometri yang sama pada skala yang jauh lebih besar. Bumi menerjang aliran debu yang ditinggalkan di sepanjang orbit sebuah komet, semuanya bergerak pada lintasan yang hampir sejajar, dan jejaknya tampak memancar dari satu titik di langit. Hujan meteor dinamai menurut rasi tempat titik itu kebetulan jatuh — Perseid, Leonid — yang sama sekali tidak menunjukkan di mana debunya sebenarnya berada.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180;
    var K = S.W / 600;                            // canvas px per SWF stage px
    var FIELD = { x: 5, y: 5, w: 590, h: 160 };   // the snow bitmap, in stage px
    var VP = { x: FIELD.x + FIELD.w / 2, y: FIELD.y + FIELD.h / 2 };

    /* the SWF's opening settings */
    var nFlakes = 10000, fovDeg = 110, visibility = 100, carSpeed = 20, snowSpeed = 1;
    var markRadiant = false;
    var flakes = null, onScreen = 0;

    function halfFov() { return fovDeg / 2 * RAD; }
    function focal() {
      return Math.sqrt(FIELD.w * FIELD.w + FIELD.h * FIELD.h) / Math.tan(halfFov());
    }
    function half() { return visibility * Math.sin(halfFov()); }

    function seedField() {
      var L = half(), i;
      flakes = new Float32Array(nFlakes * 3);
      for (i = 0; i < nFlakes; i++) {
        flakes[i * 3] = L * (2 * Math.random() - 1);
        flakes[i * 3 + 1] = visibility * Math.random();
        flakes[i * 3 + 2] = L * (2 * Math.random() - 1);
      }
    }
    /* advanceFlakes: everything drifts back by the car and down by the snow, and
       whatever leaves the box re-enters through the far face or the top, split by
       the same area-weighted probability the original uses                     */
    function advance(dtMs) {
      var L = half(), span = 2 * L;
      var dy = dtMs * carSpeed / 1000, dz = dtMs * snowSpeed / 1000;
      var topFlux = (visibility + dy) * dz * span;
      var farFlux = span * span * dy;
      var pTop = topFlux / (topFlux + farFlux || 1);
      for (var i = 0; i < nFlakes; i++) {
        var b = i * 3;
        flakes[b + 1] -= dy;
        flakes[b + 2] -= dz;
        if (flakes[b + 1] > 0 && flakes[b + 2] > -L) continue;
        if (Math.random() < pTop) {                 // snow falling in over the top
          flakes[b] = L * (2 * Math.random() - 1);
          flakes[b + 1] = visibility * Math.random();
          flakes[b + 2] = L;
        } else {                                    // driven into from ahead
          flakes[b] = L * (2 * Math.random() - 1);
          flakes[b + 1] = visibility;
          flakes[b + 2] = L * (2 * Math.random() - 1);
        }
      }
    }

    /* the field is painted pixel by pixel, additively, exactly as the SWF's
       BitmapData is — 10000 fillRects would be far slower                     */
    var buf = document.createElement("canvas");
    buf.width = FIELD.w; buf.height = FIELD.h;
    var bctx = buf.getContext("2d");
    var img = bctx.createImageData(FIELD.w, FIELD.h);
    var data = img.data;
    function paintField() {
      var n = data.length, i;
      for (i = 0; i < n; i += 4) { data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 255; }
      var f = focal(), W = FIELD.w, H = FIELD.h, cx = W / 2, cy = H / 2;
      onScreen = 0;
      for (i = 0; i < nFlakes; i++) {
        var b = i * 3, x = flakes[b], y = flakes[b + 1], z = flakes[b + 2];
        if (y <= 0.001) continue;
        var k = f / y;
        var sx = (cx + k * x) | 0, sy = (cy - k * z) | 0;
        if (sx < 0 || sx >= W || sy < 0 || sy >= H) continue;
        var lum = 240 - 240 * Math.sqrt(x * x + y * y + z * z) / visibility;
        if (lum < 0) continue;
        onScreen++;
        var p = (sy * W + sx) * 4;
        var v = data[p] + lum;
        if (v > 255) v = 255;
        data[p] = v; data[p + 1] = v; data[p + 2] = v;
      }
      bctx.putImageData(img, 0, 0);
    }

    /* ------------------------------------------------------------- controls */
    S.group("ds.ctl");
    /* the dashboard's speed: the SWF prints 58 mph at its car speed of 20 */
    function shownSpeed(v) {
      var mph = v * 58 / 20;
      return Math.round(I18N.getLang() === "id" ? mph * 1.609344 : mph);
    }
    var carCtl = S.slider({ labelKey: "ds.car", min: 0, max: 80, value: 20, step: 1,
      format: function (v) { return shownSpeed(v) + " " + I18N.t("ds.unit"); },
      on: function (v) { carSpeed = v; } });
    var snowCtl = S.slider({ labelKey: "ds.snow", min: 0, max: 10, value: 1, step: 0.1,
      format: function (v) { return v.toFixed(1); }, on: function (v) { snowSpeed = v; } });
    var visCtl = S.slider({ labelKey: "ds.vis", min: 20, max: 200, value: 100, step: 5,
      on: function (v) { visibility = v; seedField(); } });
    var flakeCtl = S.slider({ labelKey: "ds.flakes", min: 500, max: 16000, value: 10000, step: 500,
      on: function (v) { nFlakes = v; seedField(); } });
    var fovCtl = S.slider({ labelKey: "ds.fov", min: 40, max: 135, value: 110, step: 1,
      unit: "°", on: function (v) { fovDeg = v; seedField(); } });
    S.group("ds.opt");
    var radCtl = S.toggle({ labelKey: "ds.radiant", value: false,
      on: function (v) { markRadiant = v; } });
    var loop = S.loop(function (dt) { advance(dt * 1000); });
    var playBtn = S.playPause(loop);
    S.button({ labelKey: "ds.reset", on: function () {
      carCtl.set(20); snowCtl.set(1); visCtl.set(100); flakeCtl.set(10000);
      fovCtl.set(110); radCtl.set(false); seedField();
    } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ds.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outSpeed = S.readout({ labelKey: "ds.rSpeed" });
    var outSeen = S.readout({ labelKey: "ds.rSeen" });
    var outRad = S.readout({ labelKey: "ds.rRad" });

    /* ------------------------------------------------------------ the car */
    /* Shapes from the SWF, turned into Path2D once. A gradient is built in the
       shape's own space: a linear one runs along its matrix's x axis between
       the gradient square's edges, x = ±819.2 — worked out from the inverse
       matrix so a skewed one comes out right — and the radial ones here are
       all plain circles, radius 819.2 times the matrix's scale.               */
    var ART = window.DRIVING_SNOW_ART, PATHS = {};
    Object.keys(ART).forEach(function (id) {
      PATHS[id] = ART[id].layers.map(function (L) {
        return {
          fills: L[0].map(function (f) { return { style: f[0], path: new Path2D(f[1]) }; }),
          strokes: L[1].map(function (s) { return { w: s[0], style: s[1], path: new Path2D(s[2]) }; })
        };
      });
    });
    function paintOf(g, st) {
      if (typeof st === "string") return st;
      var m = st.m, grad;                          // m = [sx, r0, r1, sy, tx, ty]
      if (st.t === "l") {
        var det = m[0] * m[3] - m[1] * m[2];
        if (!det) return st.s[0][1];
        var ix = m[3] / det, iy = -m[2] / det, q = ix * ix + iy * iy;
        var ax = m[4] - 819.2 * ix / q, ay = m[5] - 819.2 * iy / q;
        grad = g.createLinearGradient(ax, ay, ax + 1638.4 * ix / q, ay + 1638.4 * iy / q);
      } else {
        grad = g.createRadialGradient(m[4], m[5], 0, m[4], m[5], 819.2 * Math.hypot(m[0], m[1]));
      }
      st.s.forEach(function (s) { grad.addColorStop(s[0], s[1]); });
      return grad;
    }
    function drawShape(g, id) {
      PATHS[id].forEach(function (L) {
        L.fills.forEach(function (f) { g.fillStyle = paintOf(g, f.style); g.fill(f.path, "evenodd"); });
        L.strokes.forEach(function (s) {
          g.lineWidth = s.w; g.strokeStyle = paintOf(g, s.style); g.stroke(s.path);
        });
      });
    }

    /* The SWF's display list above the snow, every piece at scale 0.663208:
       [shape, x, y], or text. Its "58 mph" (DefineText 18, depth 123) sits
       between the two halves and is drawn live; "107.5  FM" (text 6, in
       sprite 7) is fixed. Both are Arial in #00b0f0.                           */
    var PLACED = 0.663208, AT = [5.3, 6.05];
    var BELOW = [[4].concat(AT), "radio", [8].concat(AT), [9, 164.65, 147.5], [11].concat(AT),
      [12, 117.3, 144.75], [14].concat(AT), [15, 135.9, 142.05], [17].concat(AT)];
    var ABOVE = [[19].concat(AT), [20, 147.6, 163.05], [20, 152.85, 163.05], [20, 158.15, 163.05],
      [24].concat(AT)];
    var ARIAL = "px Arial, Helvetica, sans-serif", LCD = "#00b0f0";
    var DPR = Math.min(window.devicePixelRatio || 1, 2);   // as sim.js sizes the canvas
    /* the dashboard is still, so each half is painted once at full resolution */
    function layer(pieces) {
      var c = document.createElement("canvas");
      c.width = Math.round(S.W * DPR); c.height = Math.round(S.H * DPR);
      var g = c.getContext("2d");
      g.lineCap = "round"; g.lineJoin = "round";
      pieces.forEach(function (p) {
        if (p === "radio") {
          place(g, 267.15, 139.75); g.translate(36.3, 34.35);
          g.font = "8.05" + ARIAL; g.fillStyle = LCD; g.textBaseline = "alphabetic";
          g.fillText("107.5  FM", 0, 7);
        } else {
          place(g, p[1], p[2]); drawShape(g, p[0]);
        }
      });
      return c;
    }
    function place(g, x, y) {
      var k = DPR * K;
      g.setTransform(k * PLACED, 0, 0, k * PLACED, k * x, k * y);
    }
    var below = layer(BELOW), above = layer(ABOVE);
    var MASK = PATHS[3][0].fills[0].path;          // shape 3, at the stage origin

    /* text 18: the number at 15 px and its unit at 8 px on one baseline, kept
       centred where the SWF's "58mph" sits                                    */
    function speedo(ctx, tr) {
      ctx.save();
      ctx.translate(143.3, 146.65); ctx.scale(PLACED, PLACED);
      ctx.fillStyle = LCD; ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      var num = String(shownSpeed(carSpeed)), unit = tr("ds.unit");
      ctx.font = "15" + ARIAL; var wn = ctx.measureText(num).width;
      ctx.font = "8" + ARIAL; var wu = ctx.measureText(unit).width;
      var x = 15.75 - (wn + wu) / 2;
      ctx.fillText(unit, x + wn, 14);
      ctx.font = "15" + ARIAL; ctx.fillText(num, x, 14);
      ctx.restore();
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      paintField();
      ctx.save();
      ctx.scale(K, K);                             // SWF stage px from here on
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, 600, 240);
      ctx.save();
      ctx.clip(MASK, "evenodd");                   // depth 1 masks depth 2: the glass
      ctx.imageSmoothingEnabled = false;           // a Flash Bitmap is unsmoothed
      ctx.drawImage(buf, FIELD.x, FIELD.y);
      ctx.imageSmoothingEnabled = true;
      if (markRadiant) {
        ctx.strokeStyle = "rgba(255,190,80,0.9)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(VP.x, VP.y, 8.5, 0, TAU); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(VP.x - 15, VP.y); ctx.lineTo(VP.x - 4.5, VP.y);
        ctx.moveTo(VP.x + 4.5, VP.y); ctx.lineTo(VP.x + 15, VP.y);
        ctx.moveTo(VP.x, VP.y - 15); ctx.lineTo(VP.x, VP.y - 4.5);
        ctx.moveTo(VP.x, VP.y + 4.5); ctx.lineTo(VP.x, VP.y + 15);
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();

      ctx.drawImage(below, 0, 0, S.W, S.H);
      ctx.save(); ctx.scale(K, K); speedo(ctx, tr); ctx.restore();
      ctx.drawImage(above, 0, 0, S.W, S.H);

      outSpeed(shownSpeed(carSpeed) + " " + tr("ds.unit"));
      outSeen(String(onScreen));
      outRad(tr("ds.ahead"));
    });

    seedField();
    loop.play();                                 // animationState = true in the SWF
    playBtn.sync();
  }
});
