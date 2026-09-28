/* Photometry Simulator -----------------------------------------------------------
   Faithful rebuild of NAAP's "photometrySimulator.swf". Two apertures are dragged
   over a CCD frame; each measures the counts inside a small disc, subtracts the
   sky level read off the surrounding ring, and the ratio of the two answers is a
   magnitude difference.

   Everything is the SWF's own: the 25-star list with its magnitudes and pixel
   positions, a 400 × 300 frame at noise mean 2318 / sigma 426, saturation
   magnitude 3, an Airy-disc PSF of radius 4, apertures of radius 5 and 10, and
   23 × 23 zoom windows at 8x. Its discs cover 81 pixels and its rings 236, which
   is the check that the pixel masks are right.

   f = counts(disc) − numPixels(disc) × average(ring),  Δm = −2.5 log₁₀(f₁ / f₂) */
Sim.create({
  id: "photometrysimulator",
  width: 884, height: 624,
  strings: {
    en: {
      "ph.ap": "Apertures", "ph.a1x": "aperture 1 — x", "ph.a1y": "aperture 1 — y",
      "ph.a2x": "aperture 2 — x", "ph.a2y": "aperture 2 — y",
      "ph.opt": "Options", "ph.labels": "label the apertures", "ph.invert": "invert the display",
      "ph.reset": "Reset",
      "ph.field": "Star field", "ph.info1": "Aperture 1 info", "ph.info2": "Aperture 2 info",
      "ph.inner": "Inner disc", "ph.outer": "Outer ring",
      "ph.numPixels": "numPixels", "ph.counts": "counts", "ph.average": "average",
      "ph.disc": "disc", "ph.ring": "ring",
      "ph.cx": "center x", "ph.cy": "center y",
      "ph.calc": "Magnitude difference calculation",
      "ph.rF1": "flux 1", "ph.rF2": "flux 2", "ph.rDm": "magnitude difference",
      "ph.rPix": "pixel under cursor",
      "ph.hint": "Drag either aperture over a star. The inner disc collects the star plus sky; the ring measures the sky alone, so subtracting it leaves the star. Put both on real stars before reading the magnitude difference.",
      "ph.none": "—"
    },
    id: {
      "ph.ap": "Apertur", "ph.a1x": "apertur 1 — x", "ph.a1y": "apertur 1 — y",
      "ph.a2x": "apertur 2 — x", "ph.a2y": "apertur 2 — y",
      "ph.opt": "Pilihan", "ph.labels": "beri label apertur", "ph.invert": "balikkan tampilan",
      "ph.reset": "Atur ulang",
      "ph.field": "Medan bintang", "ph.info1": "Info apertur 1", "ph.info2": "Info apertur 2",
      "ph.inner": "Cakram dalam", "ph.outer": "Cincin luar",
      "ph.numPixels": "jumlah piksel", "ph.counts": "cacahan", "ph.average": "rerata",
      "ph.disc": "cakram", "ph.ring": "cincin",
      "ph.cx": "pusat x", "ph.cy": "pusat y",
      "ph.calc": "Perhitungan selisih magnitudo",
      "ph.rF1": "fluks 1", "ph.rF2": "fluks 2", "ph.rDm": "selisih magnitudo",
      "ph.rPix": "piksel di bawah kursor",
      "ph.hint": "Seret salah satu apertur ke atas sebuah bintang. Cakram dalam mengumpulkan bintang beserta langit; cincinnya mengukur langit saja, sehingga menguranginya menyisakan bintang. Tempatkan keduanya pada bintang sungguhan sebelum membaca selisih magnitudonya.",
      "ph.none": "—"
    }
  },
  about: {
    en: "<p>A CCD frame is just a grid of numbers: how many electrons each pixel collected. A star is a small pile of extra counts sitting on top of a background that comes from the sky itself, from the electronics, and from the detector's own dark current.</p>" +
        "<p>Aperture photometry separates the two. Add up every count inside a disc centred on the star, then use a ring drawn around that disc — far enough out to contain no starlight — to measure what one pixel of plain background is worth. Multiply that by the number of pixels in the disc and subtract, and what is left is the star's own flux.</p>" +
        "<p>Flux on its own is in arbitrary units, so it only becomes useful as a ratio. Two stars measured the same way on the same frame give a magnitude difference, −2.5 log₁₀(f₁/f₂), and if one of them is a star of known brightness then the other's magnitude follows. That is how a variable star's light curve is built, one frame at a time.</p>",
    id: "<p>Sebuah bingkai CCD hanyalah kisi angka: berapa banyak elektron yang dikumpulkan setiap piksel. Sebuah bintang adalah tumpukan kecil cacahan tambahan yang duduk di atas latar belakang yang berasal dari langit itu sendiri, dari elektronik, dan dari arus gelap detektor.</p>" +
        "<p>Fotometri apertur memisahkan keduanya. Jumlahkan setiap cacahan di dalam cakram yang berpusat pada bintang, lalu gunakan cincin yang digambar mengelilingi cakram itu — cukup jauh sehingga tidak mengandung cahaya bintang — untuk mengukur berapa nilai satu piksel latar belakang murni. Kalikan dengan jumlah piksel dalam cakram lalu kurangkan, dan yang tersisa adalah fluks bintang itu sendiri.</p>" +
        "<p>Fluks sendiri bersatuan sembarang, sehingga baru berguna sebagai perbandingan. Dua bintang yang diukur dengan cara sama pada bingkai yang sama memberi selisih magnitudo, −2,5 log₁₀(f₁/f₂), dan bila salah satunya bintang dengan kecerlangan yang diketahui maka magnitudo yang lain menyusul. Begitulah kurva cahaya bintang variabel dibangun, satu bingkai setiap kali.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var FONT = "Verdana, Geneva, sans-serif";
    var MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

    /* the SWF's own frame1 constants */
    var FW = 400, FH = 300, FX = 14, FY = 62;
    var NOISE_MEAN = 2318, NOISE_SIGMA = 426, SAT_MAG = 3, PSF_R = 4;
    var R_IN = 5, R_OUT = 10;
    var ZOOM_DIM = 23, ZOOM_SCALE = 8, ZOOM = ZOOM_DIM * ZOOM_SCALE;
    var COL1 = "#60c060", COL2 = "#f0a200";          // the SWF's outline colours
    var Z1 = { x: 450, y: 74 }, Z2 = { x: 450, y: 355 };
    var PANEL_F = { x: 6, y: 40, w: 416, h: 332 };
    var PANEL_C = { x: 6, y: 380, w: 416, h: 238 };
    var PANEL_1 = { x: 430, y: 40, w: 448, h: 270 };
    var PANEL_2 = { x: 430, y: 321, w: 448, h: 270 };

    /* starsList, verbatim */
    var STARS = [
      [2.5, 132, 265], [3.42, 113, 186], [3.77, 279, 262], [3.89, 170, 52], [3.89, 359, 129],
      [3.97, 41, 72], [4.02, 121, 26], [4.15, 169, 204], [4.2, 348, 33], [4.23, 29, 157],
      [4.26, 195, 210], [4.3, 82, 66], [4.46, 43, 26], [4.57, 287, 41], [4.73, 129, 105],
      [4.78, 239, 225], [4.85, 301, 185], [4.89, 62, 255], [4.89, 57, 192], [5.02, 47, 126],
      [5.02, 342, 272], [5.24, 278, 135], [5.78, 217, 22], [5.87, 259, 147], [6.2, 341, 215]
    ].map(function (s) { return { magnitude: s[0], x: s[1], y: s[2] }; });

    var counts = STARFIELD.render({ width: FW, height: FH, noiseMean: NOISE_MEAN,
      noiseSigma: NOISE_SIGMA, saturationMagnitude: SAT_MAG, seed: 1,
      psf: STARFIELD.airyDisc(PSF_R), stars: STARS });
    var MASK_IN = STARFIELD.pixelMask(R_IN), MASK_OUT = STARFIELD.pixelMask(R_OUT);

    /* the apertures open where the SWF puts them: stage (210, 250) and (100, 100)
       minus the field origin                                                    */
    var ap = [{ x: 210 - FX, y: 250 - FY }, { x: 100 - FX, y: 100 - FY }];
    var showLabels = false, invert = false, hover = null, drag = null;

    var fieldImg = null, fieldCanvas = null;
    function buildField() {
      fieldCanvas = document.createElement("canvas");
      fieldCanvas.width = FW; fieldCanvas.height = FH;
      var c = fieldCanvas.getContext("2d");
      fieldImg = c.createImageData(FW, FH);
      STARFIELD.paint(fieldImg, counts, invert);
      c.putImageData(fieldImg, 0, 0);
    }
    buildField();

    /* ------------------------------------------------------------- controls */
    S.group("ph.ap");
    var ctl = [];
    [["ph.a1x", 0, "x"], ["ph.a1y", 0, "y"], ["ph.a2x", 1, "x"], ["ph.a2y", 1, "y"]]
      .forEach(function (row) {
        ctl.push(S.slider({ labelKey: row[0], min: 0, max: row[2] === "x" ? FW - 1 : FH - 1,
          value: ap[row[1]][row[2]], step: 1,
          on: function (v) { ap[row[1]][row[2]] = v; refresh(); } }));
      });
    S.group("ph.opt");
    var labCtl = S.toggle({ labelKey: "ph.labels", value: false,
      on: function (v) { showLabels = v; } });
    var invCtl = S.toggle({ labelKey: "ph.invert", value: false,
      on: function (v) { invert = v; buildField(); } });
    S.button({ labelKey: "ph.reset", on: function () {
      ctl[0].set(196); ctl[1].set(188); ctl[2].set(86); ctl[3].set(38);
      labCtl.set(false); invCtl.set(false);
    } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ph.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outF1 = S.readout({ labelKey: "ph.rF1" });
    var outF2 = S.readout({ labelKey: "ph.rF2" });
    var outDm = S.readout({ labelKey: "ph.rDm" });
    var outPix = S.readout({ labelKey: "ph.rPix" });

    /* updateAperture: inner disc, then the ring as outer-minus-inner */
    function measure(i) {
      var a = ap[i];
      var inner = STARFIELD.stats(counts, FW, FH, a.x, a.y, MASK_IN);
      var outer = STARFIELD.stats(counts, FW, FH, a.x, a.y, MASK_OUT);
      var ring = { totalPixels: outer.totalPixels - inner.totalPixels,
        totalCounts: outer.totalCounts - inner.totalCounts };
      ring.average = ring.totalPixels ? ring.totalCounts / ring.totalPixels : 0;
      return { inner: inner, ring: ring,
        flux: inner.totalCounts - inner.totalPixels * ring.average };
    }
    function refresh() {
      var m1 = measure(0), m2 = measure(1);
      outF1(m1.flux.toFixed(2));
      outF2(m2.flux.toFixed(2));
      var dm = -2.5 * Math.log(m1.flux / m2.flux) / Math.LN10;
      outDm(isFinite(dm) ? dm.toFixed(2) : I18N.t("ph.none"));
      outPix(hover ? hover.x + ", " + hover.y + "  →  " +
        Math.round(clampCount(counts[hover.x + hover.y * FW])) : I18N.t("ph.none"));
      S.requestDraw();
    }
    function clampCount(v) {
      return v < 0 ? 0 : v > STARFIELD.PEAK ? STARFIELD.PEAK : v;
    }

    /* ---------------------------------------------------------- interaction */
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (p.x < FX || p.x > FX + FW || p.y < FY || p.y > FY + FH) return;
      var fx = Math.round(p.x - FX), fy = Math.round(p.y - FY);
      var d0 = Math.hypot(fx - ap[0].x, fy - ap[0].y);
      var d1 = Math.hypot(fx - ap[1].x, fy - ap[1].y);
      drag = (d1 < d0 ? 1 : 0);
      if (Math.min(d0, d1) > R_OUT + 6) drag = null; else move(p);
      if (drag !== null) S.canvas.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (drag !== null) { move(p); return; }
      var h = zoomPixel(p);
      if ((h === null) !== (hover === null) ||
          (h && hover && (h.x !== hover.x || h.y !== hover.y))) { hover = h; refresh(); }
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (k) {
      S.canvas.addEventListener(k, function () { drag = null; });
    });
    function move(p) {
      var i = drag;
      var fx = Math.max(0, Math.min(FW - 1, Math.round(p.x - FX)));
      var fy = Math.max(0, Math.min(FH - 1, Math.round(p.y - FY)));
      ctl[i * 2].set(fx); ctl[i * 2 + 1].set(fy);
    }
    /* which frame pixel the cursor is over inside either zoom window */
    function zoomPixel(p) {
      for (var i = 0; i < 2; i++) {
        var z = i === 0 ? Z1 : Z2;
        if (p.x < z.x || p.x >= z.x + ZOOM || p.y < z.y || p.y >= z.y + ZOOM) continue;
        var off = (ZOOM_DIM - (2 * R_OUT + 1)) / 2;
        var gx = Math.floor((p.x - z.x) / ZOOM_SCALE) + ap[i].x - R_OUT - off;
        var gy = Math.floor((p.y - z.y) / ZOOM_SCALE) + ap[i].y - R_OUT - off;
        if (gx < 0 || gx >= FW || gy < 0 || gy >= FH) return null;
        return { x: gx, y: gy };
      }
      return null;
    }
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      var m = [measure(0), measure(1)];
      S.clear();
      ctx.fillStyle = "#eef0f4"; ctx.fillRect(0, 0, S.W, S.H);
      [[PANEL_F, "ph.field"], [PANEL_C, "ph.calc"], [PANEL_1, "ph.info1"], [PANEL_2, "ph.info2"]]
        .forEach(function (p) {
          ctx.fillStyle = "#ffffff"; ctx.fillRect(p[0].x, p[0].y, p[0].w, p[0].h);
          ctx.strokeStyle = "#c8ccd4"; ctx.lineWidth = 1;
          ctx.strokeRect(p[0].x + 0.5, p[0].y + 0.5, p[0].w - 1, p[0].h - 1);
          ctx.fillStyle = "#333333"; ctx.font = "12px " + FONT;
          ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
          ctx.fillText(tr(p[1]), p[0].x + 10, p[0].y + 18);
        });

      ctx.drawImage(fieldCanvas, FX, FY);
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 1;
      ctx.strokeRect(FX - 0.5, FY - 0.5, FW + 1, FH + 1);
      for (var i = 0; i < 2; i++) {
        var col = i === 0 ? COL1 : COL2;
        ctx.strokeStyle = col; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(FX + ap[i].x + 0.5, FY + ap[i].y + 0.5, R_IN + 0.5, 0, TAU);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(FX + ap[i].x + 0.5, FY + ap[i].y + 0.5, R_OUT + 0.5, 0, TAU);
        ctx.stroke();
        if (showLabels) {
          ctx.fillStyle = col; ctx.font = "bold 12px " + FONT;
          ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillText(String(i + 1), FX + ap[i].x, FY + ap[i].y - R_OUT - 3);
        }
      }

      zoomWindow(ctx, Z1, 0);
      zoomWindow(ctx, Z2, 1);
      info(ctx, tr, PANEL_1, 0, m[0]);
      info(ctx, tr, PANEL_2, 1, m[1]);
      calculation(ctx, tr, m);
    });

    /* the 23 × 23 crop around the aperture, at 8x, with the masks outlined */
    function zoomWindow(ctx, z, i) {
      var off = (ZOOM_DIM - (2 * R_OUT + 1)) / 2;
      var gx = ap[i].x - R_OUT - off, gy = ap[i].y - R_OUT - off;
      for (var px = 0; px < ZOOM_DIM; px++) {
        for (var py = 0; py < ZOOM_DIM; py++) {
          var sx = gx + px, sy = gy + py;
          var g;
          if (sx < 0 || sx >= FW || sy < 0 || sy >= FH) g = invert ? 200 : 60;
          else g = STARFIELD.grey(counts[sx + sy * FW], invert);
          ctx.fillStyle = "rgb(" + g + "," + g + "," + g + ")";
          ctx.fillRect(z.x + px * ZOOM_SCALE, z.y + py * ZOOM_SCALE, ZOOM_SCALE, ZOOM_SCALE);
        }
      }
      ctx.strokeStyle = i === 0 ? COL1 : COL2; ctx.lineWidth = 1.5;
      maskOutline(ctx, z, off + R_OUT - R_IN, MASK_IN, R_IN);
      maskOutline(ctx, z, off, MASK_OUT, R_OUT);
      if (hover) {
        var hx = hover.x - gx, hy = hover.y - gy;
        if (hx >= 0 && hx < ZOOM_DIM && hy >= 0 && hy < ZOOM_DIM) {
          ctx.strokeStyle = "#39c0ff"; ctx.lineWidth = 1.5;
          ctx.strokeRect(z.x + hx * ZOOM_SCALE - 0.5, z.y + hy * ZOOM_SCALE - 0.5,
            ZOOM_SCALE + 1, ZOOM_SCALE + 1);
        }
      }
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 1;
      ctx.strokeRect(z.x - 0.5, z.y - 0.5, ZOOM + 1, ZOOM + 1);
    }
    /* trace the boundary of a pixel mask by drawing the edges with no neighbour */
    function maskOutline(ctx, z, corner, mask, r) {
      var has = {};
      mask.forEach(function (d) { has[(d[0] + r) + "," + (d[1] + r)] = true; });
      ctx.beginPath();
      mask.forEach(function (d) {
        var cx = d[0] + r + corner, cy = d[1] + r + corner;
        var x = z.x + cx * ZOOM_SCALE, y = z.y + cy * ZOOM_SCALE;
        if (!has[(d[0] + r - 1) + "," + (d[1] + r)]) { ctx.moveTo(x, y); ctx.lineTo(x, y + ZOOM_SCALE); }
        if (!has[(d[0] + r + 1) + "," + (d[1] + r)]) { ctx.moveTo(x + ZOOM_SCALE, y); ctx.lineTo(x + ZOOM_SCALE, y + ZOOM_SCALE); }
        if (!has[(d[0] + r) + "," + (d[1] + r - 1)]) { ctx.moveTo(x, y); ctx.lineTo(x + ZOOM_SCALE, y); }
        if (!has[(d[0] + r) + "," + (d[1] + r + 1)]) { ctx.moveTo(x, y + ZOOM_SCALE); ctx.lineTo(x + ZOOM_SCALE, y + ZOOM_SCALE); }
      });
      ctx.stroke();
    }

    function info(ctx, tr, p, i, m) {
      var x = p.x + 240, y = p.y + 48;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#111111"; ctx.font = "bold 13px " + FONT;
      ctx.fillText(tr("ph.inner"), x, y);
      row(ctx, tr, x, y + 22, "ph.numPixels", String(m.inner.totalPixels));
      row(ctx, tr, x, y + 40, "ph.counts", String(m.inner.totalCounts));
      row(ctx, tr, x, y + 58, "ph.average", m.inner.average.toFixed(2));
      ctx.fillStyle = "#111111"; ctx.font = "bold 13px " + FONT;
      ctx.fillText(tr("ph.outer"), x, y + 94);
      row(ctx, tr, x, y + 116, "ph.numPixels", String(m.ring.totalPixels));
      row(ctx, tr, x, y + 134, "ph.counts", String(m.ring.totalCounts));
      row(ctx, tr, x, y + 152, "ph.average", m.ring.average.toFixed(2));
      ctx.textAlign = "center";
      ctx.fillStyle = "#444444"; ctx.font = "12px " + FONT;
      ctx.fillText(tr("ph.cx") + ": " + ap[i].x, p.x + 20 + ZOOM / 2, p.y + ZOOM + 46);
      ctx.fillText(tr("ph.cy") + ": " + ap[i].y, p.x + 20 + ZOOM / 2, p.y + ZOOM + 64);
    }
    function row(ctx, tr, x, y, key, value) {
      ctx.font = "12px " + FONT; ctx.textAlign = "right";
      ctx.fillStyle = "#555555";
      ctx.fillText(tr(key) + ":", x + 92, y);
      ctx.textAlign = "left"; ctx.fillStyle = "#111111"; ctx.font = "12px " + MONO;
      ctx.fillText(value, x + 100, y);
      ctx.textAlign = "left";
    }

    /* The SWF's calculation panel, set as maths: f₁ = counts_disc₁ − … with the
       aperture's number nested under "disc" and "ring", and the magnitude
       difference over a stacked f₁/f₂ in tall brackets.                       */
    function calculation(ctx, tr, m) {
      var x = PANEL_C.x + 16, y = PANEL_C.y + 46, maxW = PANEL_C.w - 32;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      for (var i = 0; i < 2; i++) {
        var yi = y + 62 * i;
        ctx.fillStyle = "#333333";
        mathLine(ctx, x, yi, fluxRuns(tr, i), 13, maxW);
        ctx.fillStyle = i === 0 ? COL1 : COL2; ctx.font = "bold 15px " + MONO;
        ctx.fillText("= " + m[i].flux.toFixed(2), x + 22, yi + 26);
      }
      ctx.fillStyle = "#333333";
      var xm = mathLine(ctx, x, y + 128, [["m", 0], ["1", 1], [" − m", 0], ["2", 1],
        [" = −2.5 × log", 0], ["10", 1]], 13);
      fraction(ctx, xm + 2, y + 128, 13);
      var dm = -2.5 * Math.log(m[0].flux / m[1].flux) / Math.LN10;
      ctx.fillStyle = "#1668c4"; ctx.font = "bold 17px " + MONO;
      ctx.fillText("= " + (isFinite(dm) ? dm.toFixed(2) : tr("ph.none")), x + 22, y + 162);
    }
    function fluxRuns(tr, i) {
      var n = String(i + 1), disc = tr("ph.disc"), ring = tr("ph.ring");
      return [["f", 0], [n, 1], [" = " + tr("ph.counts"), 0], [disc, 1], [n, 2],
        [" − " + tr("ph.numPixels"), 0], [disc, 1], [n, 2],
        [" × " + tr("ph.average"), 0], [ring, 1], [n, 2]];
    }
    /* a line of maths as [text, level] runs — level 0 the line itself, 1 a
       subscript, 2 a subscript's own subscript — each smaller and lower. It
       shrinks to fit maxW when a translation runs long.                        */
    var LEVEL = [[1, 0], [0.72, 0.3], [0.56, 0.52]];   // size, drop: × the font size
    function mathWidth(ctx, runs, size) {
      var w = 0;
      runs.forEach(function (r) {
        ctx.font = size * LEVEL[r[1]][0] + "px " + FONT; w += ctx.measureText(r[0]).width;
      });
      return w;
    }
    function mathLine(ctx, x, y, runs, size, maxW) {
      if (maxW) size = Math.min(size, size * maxW / mathWidth(ctx, runs, size));
      runs.forEach(function (r) {
        var lv = LEVEL[r[1]];
        ctx.font = size * lv[0] + "px " + FONT;
        ctx.fillText(r[0], x, y + size * lv[1]);
        x += ctx.measureText(r[0]).width;
      });
      return x;
    }
    /* f₁ over f₂ with a rule between, in brackets as tall as the fraction */
    function fraction(ctx, x, y, size) {
      var axis = y - size * 0.34, top = [["f", 0], ["1", 1]], bot = [["f", 0], ["2", 1]];
      var wt = mathWidth(ctx, top, size), wb = mathWidth(ctx, bot, size), w = Math.max(wt, wb);
      ctx.font = size * 2 + "px " + FONT; ctx.textBaseline = "middle";
      ctx.fillText("(", x, axis);
      x += ctx.measureText("(").width + 1;
      ctx.textBaseline = "alphabetic";
      mathLine(ctx, x + (w - wt) / 2, axis - size * 0.5, top, size);
      mathLine(ctx, x + (w - wb) / 2, axis + size * 0.85, bot, size);
      ctx.fillRect(x - 1, axis - 0.5, w + 2, 1);
      x += w + 1;
      ctx.font = size * 2 + "px " + FONT; ctx.textBaseline = "middle";
      ctx.fillText(")", x, axis);
      ctx.textBaseline = "alphabetic";
      return x + ctx.measureText(")").width;
    }

    refresh();
  }
});
