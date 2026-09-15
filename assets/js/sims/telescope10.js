/* Telescope Simulator ----------------------------------------------------------
   Faithful rebuild of the ClassAction "telescope10.swf". Every number below was
   decoded from the SWF's own ActionScript (drawTelescope, changeAperture,
   changeEyepiece, changeFocus, updateReadouts), so the drawing is the original
   construction rather than a look-alike:

     • the refractor is built in a local frame — objective ('lens1') at x = 750,
       eyepiece ('lens2') at x = 50 + focus, the step down to the drawtube at
       x = 150 — then the whole telescope is rotated −25° and placed at (0, 320)
       on the 1000×750 stage;
     • both lenses are the same hatched 'rect' symbol stretched to size, so the
       eyepiece gets thicker as its focal length gets shorter (15 / 20 / 25 px for
       40 / 20 / 10 mm) and its hatching is squeezed accordingly;
     • rays enter parallel at ±H/3 (plus ±H/8 on the 8-inch, and a centre ray on
       the 6-inch), bend at the objective, cross, reach the eyepiece and leave
       parallel, stopping 30 px beyond it. The crossing is steered by each
       aperture's `beamCross` — including the original's quirk of aiming the
       ±H/3 rays with an H/4 slope, which is why they cross a little further out;
     • the focus knob turns 30° per focus unit, and racking focus slides the
       drawtube 1 px per unit;
     • readouts come from the SWF's tables: Fo = 1400 / 1220 / 1020 mm,
       LGP 840 / 475 / 210, magnification ⌊Fo/Fe⌋, resolution ⌊450/D⌋/100, and a
       3×3 field-of-view table;
     • the view is sharp at focus = −focusOffset (+3.6 / +0.6 / −3.2 for the
       40 / 20 / 10 mm eyepieces); away from it the SWF fakes defocus with eight
       15%-alpha copies of the image pushed outwards, reproduced here.          */
Sim.create({
  id: "telescope10",
  width: 780, height: 586,
  strings: {
    en: {
      "ts.obs": "Observing", "ts.ap": "aperture", "ts.eye": "eyepiece", "ts.target": "target",
      "ts.focusG": "Focus Adjustments", "ts.focus": "focus",
      "ts.moon": "Moon", "ts.saturn": "Saturn", "ts.cluster": "Cluster",
      "ts.readouts": "Readouts", "ts.lgp": "LGP", "ts.lgpNote1": "(times that of the", "ts.lgpNote2": "human eye)",
      "ts.res": "Resolution", "ts.mag": "Magnification", "ts.fov": "Field of View",
      "ts.title1": "Refracting", "ts.title2": "Telescope", "ts.fovLabel": "Field of View",
      "ts.arcsec": "arc-secs",
      "ts.rLgp": "light-gathering power", "ts.rRes": "resolution", "ts.rMag": "magnification",
      "ts.rFo": "objective focal length", "ts.rFov": "field of view", "ts.rSize": "target's angular size",
      "ts.hint": "turn the focus until the image is sharp — each eyepiece focuses at a different setting"
    },
    id: {
      "ts.obs": "Pengamatan", "ts.ap": "apertur", "ts.eye": "okuler", "ts.target": "sasaran",
      "ts.focusG": "Penyetelan Fokus", "ts.focus": "fokus",
      "ts.moon": "Bulan", "ts.saturn": "Saturnus", "ts.cluster": "Gugus Bintang",
      "ts.readouts": "Pembacaan", "ts.lgp": "DKC", "ts.lgpNote1": "(kali daya kumpul", "ts.lgpNote2": "mata manusia)",
      "ts.res": "Resolusi", "ts.mag": "Perbesaran", "ts.fov": "Medan Pandang",
      "ts.title1": "Teleskop", "ts.title2": "Refraktor", "ts.fovLabel": "Medan Pandang",
      "ts.arcsec": "detik busur",
      "ts.rLgp": "daya kumpul cahaya", "ts.rRes": "resolusi", "ts.rMag": "perbesaran",
      "ts.rFo": "fokus lensa objektif", "ts.rFov": "medan pandang", "ts.rSize": "ukuran sudut sasaran",
      "ts.hint": "putar fokus hingga gambar tajam — tiap okuler fokus pada setelan berbeda"
    }
  },
  about: {
    en: "<p>A telescope does three separate jobs, and they trade off against each other. <strong>Light-gathering power</strong> and <strong>resolution</strong> depend only on the <strong>aperture</strong> — the width of the objective — while <strong>magnification</strong> depends on the eyepiece you put behind it.</p>" +
        "<p>Light grasp scales with the objective's area: an 8-inch lens collects about 840 times what your dark-adapted pupil does, a 4-inch only about 210. Resolution — the finest detail the optics can separate — improves with aperture too, roughly 4.5″ divided by the diameter in inches. Magnification is simply Fo/Fe, the objective's focal length over the eyepiece's, so a shorter eyepiece magnifies more.</p>" +
        "<p>Watch the drawing as you change eyepieces: a short-focus eyepiece is a thicker, more strongly curved lens, and each one comes to focus at a different position of the drawtube. And notice what magnification costs — a narrower <strong>field of view</strong> (at 10 mm the Moon overflows the larger telescopes' field) and, past what the aperture can resolve, only a bigger, dimmer image with no new detail.</p>",
    id: "<p>Teleskop melakukan tiga tugas terpisah, dan ketiganya saling menukar. <strong>Daya kumpul cahaya</strong> dan <strong>resolusi</strong> hanya bergantung pada <strong>apertur</strong> — lebar lensa objektif — sedangkan <strong>perbesaran</strong> bergantung pada okuler yang dipasang di belakangnya.</p>" +
        "<p>Daya kumpul sebanding dengan luas objektif: lensa 8 inci mengumpulkan sekitar 840 kali lipat pupil mata yang telah beradaptasi gelap, lensa 4 inci hanya sekitar 210. Resolusi — detail terhalus yang dapat dipisahkan optik — juga membaik dengan apertur, kira-kira 4,5″ dibagi diameter dalam inci. Perbesaran hanyalah Fo/Fe, panjang fokus objektif dibagi panjang fokus okuler, sehingga okuler yang lebih pendek memperbesar lebih kuat.</p>" +
        "<p>Perhatikan gambarnya saat mengganti okuler: okuler berfokus pendek adalah lensa yang lebih tebal dan lebih melengkung, dan masing-masing mencapai fokus pada posisi tabung geser yang berbeda. Perhatikan pula harga perbesaran — <strong>medan pandang</strong> menyempit (pada 10 mm Bulan meluber dari medan teleskop yang lebih besar) dan, melampaui batas urai apertur, gambar hanya makin besar dan redup tanpa detail baru.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180, TAU = Math.PI * 2;
    var K = S.W / 1000;                                  // SWF stage px → canvas px

    /* ================ the SWF's own tables (from its ActionScript) ================ */
    // radio order in the SWF: aperture 1 = 8-inch, 2 = 6-inch, 3 = 4-inch
    var APERTURE = {
      "8": { i: 0, lens1Height: 200, lens1Width: 75, focal: 1400, diameter: 8, beamCross: 140, alpha: 1.0 },
      "6": { i: 1, lens1Height: 160, lens1Width: 65, focal: 1220, diameter: 6, beamCross: 170, alpha: 0.8 },
      "4": { i: 2, lens1Height: 120, lens1Width: 55, focal: 1020, diameter: 4, beamCross: 200, alpha: 0.6 }
    };
    var EYEPIECE = {
      "40": { i: 0, focal: 40, lens2Width: 15, focusOffset: -3.6 },
      "20": { i: 1, focal: 20, lens2Width: 20, focusOffset: -0.6 },
      "10": { i: 2, focal: 10, lens2Width: 25, focusOffset: 3.2 }
    };
    var LGP = [840, 475, 210];
    var FOV = [1.22, 1.42, 1.76, 0.72, 0.85, 1.02, 0.42, 0.49, 0.58];   // [(eyepiece)·3 + aperture]
    var SCALE = [[36, 32, 28], [48, 44, 40], [66, 58, 48]];             // image scale %, [eyepiece][aperture]
    var GHOST_X = [0, 2, 1.4, 0, -1.4, -2, -1.4, 0, 1.4];               // defocus copies — including the
    var GHOST_Y = [0, 0, 1.4, 2, 1, 0, -1.4, -2, -1.4];                 // original's odd "1" in slot 4
    var LENS1_X = 750, LENS_Y = 150, ILENS2_X = 50, XTUBE = 150, LENS2_H = 40;
    var TEL_X = 0, TEL_Y = 320, TEL_ROT = -25;                          // telescope clip placement
    var FOV_X = 755, FOV_Y = 511, FOV_R = 240;                          // eyepiece view on the stage

    // true angular sizes, for the readout only (degrees)
    var TARGET_SIZE = { moon: 0.518, saturn: 0.0117, cluster: 0.40 };

    /* ---- state: the SWF opens on 8-inch, 40 mm, Moon, focus 8.0 ---- */
    var apKey = "8", epKey = "40", target = "moon", focus = 8.0;

    /* ================================ controls ================================ */
    S.group("ts.obs");
    S.select({
      labelKey: "ts.ap", value: apKey,
      options: [{ v: "8", label: "8-inch" }, { v: "6", label: "6-inch" }, { v: "4", label: "4-inch" }],
      on: function (v) { apKey = v; upd(); }
    });
    S.select({
      labelKey: "ts.eye", value: epKey,
      options: [{ v: "40", label: "40 mm" }, { v: "20", label: "20 mm" }, { v: "10", label: "10 mm" }],
      on: function (v) { epKey = v; upd(); }
    });
    S.select({
      labelKey: "ts.target", value: target,
      options: [{ v: "moon", labelKey: "ts.moon" }, { v: "saturn", labelKey: "ts.saturn" }, { v: "cluster", labelKey: "ts.cluster" }],
      on: function (v) { target = v; upd(); }
    });

    S.group("ts.focusG");
    var focusCtl = S.slider({
      labelKey: "ts.focus", min: -10, max: 10, value: focus, step: 0.1,
      format: function (v) { return v.toFixed(1); },
      on: function (v) { focus = v; upd(); }
    });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ts.hint");
    focusCtl.input.parentNode.parentNode.appendChild(hint);

    var outLgp = S.readout({ labelKey: "ts.rLgp" });
    var outRes = S.readout({ labelKey: "ts.rRes" });
    var outMag = S.readout({ labelKey: "ts.rMag" });
    var outFo = S.readout({ labelKey: "ts.rFo" });
    var outFov = S.readout({ labelKey: "ts.rFov" });
    var outSize = S.readout({ labelKey: "ts.rSize" });

    /* ---- readout values, computed exactly as updateReadouts() does ---- */
    function ap() { return APERTURE[apKey]; }
    function ep() { return EYEPIECE[epKey]; }
    function lgp() { return LGP[ap().i]; }
    function resolution() { return Math.floor(4.5 / ap().diameter * 100) / 100; }
    function mag() { return Math.floor(ap().focal / ep().focal); }
    function fov() { return FOV[ep().i * 3 + ap().i]; }

    function upd() {
      outLgp(lgp() + "×");
      outRes(resolution().toFixed(2) + "″");
      outMag(mag() + "×");
      outFo(ap().focal + " mm");
      outFov(fov().toFixed(2) + "°");
      var a = TARGET_SIZE[target];
      outSize(a >= 0.1 ? a.toFixed(2) + "°" : Math.round(a * 3600) + "″");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.save();
      ctx.scale(K, K);

      // the SWF's grey stage
      ctx.fillStyle = "#c0c0c0";
      roundRect(ctx, 0, 0, 1000, 750, 12); ctx.fill();

      drawTelescope(ctx);
      drawField(ctx);
      drawReadouts(ctx, t);

      // titles, in the SWF's bold sans
      ctx.fillStyle = "#000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = "bold 26px Arial, Helvetica, sans-serif";
      // at the SWF's positions, nudged left only if a translated title would run off the stage
      function title(text, x, y) { ctx.fillText(text, Math.min(x, 990 - ctx.measureText(text).width), y); }
      title(t("ts.title1"), 822, 72);
      title(t("ts.title2"), 822, 104);
      title(t("ts.fovLabel"), 816, 266);

      ctx.restore();
    });

    // drawTelescope(): built in the telescope's local frame, then rotated −25°
    function drawTelescope(ctx) {
      var a = ap(), e = ep();
      var H1 = a.lens1Height, W1 = a.lens1Width, W2 = e.lens2Width;
      var lens2X = ILENS2_X + focus;

      ctx.save();
      ctx.translate(TEL_X, TEL_Y);
      ctx.rotate(TEL_ROT * D2R);
      ctx.lineCap = "round"; ctx.lineJoin = "round";

      // tube outline (lineStyle 4, black). Flash paints a clip's own drawing below its
      // children, so this goes first and the lenses, knob and rays sit on top of it.
      ctx.strokeStyle = "#000"; ctx.lineWidth = 4;
      ctx.beginPath();
      seg(ctx, LENS1_X + W1 / 2, LENS_Y + H1 / 2, XTUBE, LENS_Y + H1 / 2);        // main tube walls
      seg(ctx, LENS1_X + W1 / 2, LENS_Y - H1 / 2, XTUBE, LENS_Y - H1 / 2);
      seg(ctx, XTUBE, LENS_Y + H1 / 2, XTUBE, LENS_Y + LENS2_H / 2);               // the step down
      seg(ctx, XTUBE, LENS_Y - H1 / 2, XTUBE, LENS_Y - LENS2_H / 2);
      seg(ctx, XTUBE, LENS_Y + LENS2_H / 2, lens2X - W2 / 2, LENS_Y + LENS2_H / 2); // drawtube walls
      seg(ctx, XTUBE, LENS_Y - LENS2_H / 2, lens2X - W2 / 2, LENS_Y - LENS2_H / 2);
      ctx.stroke();

      // the two lenses — one symbol, stretched
      hatchRect(ctx, LENS1_X, LENS_Y, W1, H1);
      hatchRect(ctx, lens2X, LENS_Y, W2, LENS2_H);

      // the focus knob, turned 30° per unit of focus
      focusKnob(ctx, XTUBE + 30, LENS_Y + H1 / 4, 30 * focus);

      // rays (lineStyle 4, 0xFFFF00)
      ctx.strokeStyle = "#ffff00"; ctx.lineWidth = 4;
      ctx.beginPath();
      var rayStartX = LENS1_X + W1 / 2 + 40;
      var rayEndX = lens2X - W2 / 2 - 30;
      rayPair(ctx, H1 / 3, H1 / 4, a.beamCross, lens2X, rayStartX, rayEndX);
      if (apKey === "6") seg(ctx, rayStartX, LENS_Y, rayEndX, LENS_Y);             // 6-inch centre ray
      if (apKey === "8") rayPair(ctx, H1 / 8, H1 / 8, a.beamCross, lens2X, rayStartX, rayEndX);
      ctx.stroke();

      ctx.restore();
    }
    // One symmetric pair of rays: parallel in at ±hit, refracted at the objective's
    // centre toward the eyepiece, then parallel out. The eyepiece height comes from a
    // slope set by `aimHeight` and the aperture's beam-crossing point.
    function rayPair(ctx, hit, aimHeight, beamCross, lens2X, startX, endX) {
      var tan = aimHeight / (LENS1_X - beamCross);
      var y1 = tan * (beamCross - lens2X);
      seg(ctx, startX, LENS_Y + hit, LENS1_X, LENS_Y + hit);
      seg(ctx, startX, LENS_Y - hit, LENS1_X, LENS_Y - hit);
      seg(ctx, LENS1_X, LENS_Y + hit, lens2X, LENS_Y - y1);
      seg(ctx, LENS1_X, LENS_Y - hit, lens2X, LENS_Y + y1);
      seg(ctx, lens2X, LENS_Y + y1, endX, LENS_Y + y1);
      seg(ctx, lens2X, LENS_Y - y1, endX, LENS_Y - y1);
    }
    function seg(ctx, x0, y0, x1, y1) { ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); }

    // The SWF's 'rect' symbol, authored here at the 8-inch objective's 75×200 size:
    // cream fill, black border, diagonal hatching. Scaling the whole symbol to w×h
    // (as Flash's _width/_height do) stretches the stripes' angle, spacing and
    // stroke weight along with it — which is exactly why the eyepiece hatching looks
    // finer and the 4-inch objective's stripes lean differently from the 8-inch's.
    function hatchRect(ctx, cx, cy, w, h) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(w / 75, h / 200);
      ctx.fillStyle = "#ece9d8";
      ctx.fillRect(-37.5, -100, 75, 200);
      ctx.save();
      ctx.beginPath(); ctx.rect(-37.5, -100, 75, 200); ctx.clip();
      ctx.beginPath();
      // stripes are the lines 0.0636·x + 0.04405·y = m − 0.07 (measured from the SWF)
      for (var m = -8; m <= 8; m++) {
        var c = m - 0.07;
        ctx.moveTo((c + 0.04405 * 110) / 0.0636, -110);
        ctx.lineTo((c - 0.04405 * 110) / 0.0636, 110);
      }
      ctx.strokeStyle = "#000"; ctx.lineWidth = 4.6; ctx.lineCap = "butt";
      ctx.stroke();
      ctx.restore();
      ctx.lineWidth = 6; ctx.strokeStyle = "#000"; ctx.lineJoin = "miter";
      ctx.strokeRect(-34.5, -97, 69, 194);
      ctx.restore();
    }
    function focusKnob(ctx, x, y, deg) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(deg * D2R);
      ctx.beginPath(); ctx.arc(0, 0, 19.4, 0, TAU);
      ctx.fillStyle = "#fff"; ctx.fill();
      ctx.lineWidth = 4.8; ctx.strokeStyle = "#000"; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(17, 0);
      ctx.lineWidth = 3.2; ctx.lineCap = "round"; ctx.stroke();
      ctx.restore();
    }

    /* -------- the Field of View: the target, scaled per the SWF's table -------- */
    function drawField(ctx) {
      var a = ap(), e = ep();
      var scale = SCALE[e.i][a.i] / 100;
      var blur = focus + e.focusOffset;               // 0 ⇒ every copy lands on the original

      ctx.save();
      ctx.beginPath(); ctx.arc(FOV_X, FOV_Y, FOV_R, 0, TAU);
      ctx.fillStyle = "#000"; ctx.fill();
      ctx.clip();
      // the image, then the SWF's eight defocus copies at 15% of its alpha
      for (var k = 0; k < 9; k++) {
        ctx.globalAlpha = a.alpha * (k === 0 ? 1 : 0.15);
        var dx = GHOST_X[k] * blur * scale, dy = GHOST_Y[k] * blur * scale;
        if (target === "moon") drawMoon(ctx, FOV_X + dx, FOV_Y + dy, 420 * scale);
        else if (target === "saturn") drawSaturn(ctx, FOV_X + dx, FOV_Y + dy, 150 * scale);
        else drawCluster(ctx, FOV_X + dx, FOV_Y + dy, 400 * scale);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      ctx.beginPath(); ctx.arc(FOV_X, FOV_Y, FOV_R, 0, TAU);
      ctx.strokeStyle = "#000066"; ctx.lineWidth = 3; ctx.stroke();
    }

    /* ------------------------- the Readouts panel ------------------------- */
    function drawReadouts(ctx, t) {
      var a = ap(), e = ep();
      ctx.fillStyle = "#fff"; ctx.fillRect(8, 488, 362, 256);
      ctx.strokeStyle = "#000"; ctx.lineWidth = 3; ctx.strokeRect(8, 488, 362, 256);

      ctx.fillStyle = "#000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = "bold 26px Arial, Helvetica, sans-serif";
      ctx.fillText(t("ts.readouts"), 34, 524);

      var bold = "bold 17px Arial, Helvetica, sans-serif", plain = "17px Verdana, Geneva, sans-serif";
      // "label  =" then its value, at the SWF's column or just past a longer (translated) label
      function row(label, value, x, y, valueX) {
        ctx.font = bold; ctx.fillText(label + "  =", x, y);
        var end = x + ctx.measureText(label + "  =").width;
        ctx.font = plain; ctx.fillText(value, Math.max(valueX, end + 10), y + 2);
      }
      row(t("ts.lgp"), String(lgp()), 26, 566, 104);
      ctx.font = "bold 15px Arial, Helvetica, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(t("ts.lgpNote1"), 243, 553);
      ctx.fillText(t("ts.lgpNote2"), 243, 573);
      ctx.textAlign = "left";

      row(t("ts.res"), resolution().toFixed(2) + " " + t("ts.arcsec"), 25, 609, 146);

      // column positions follow the SWF's panel: Fo/Fe at 186, the mm fraction at 266
      ctx.font = bold; ctx.fillText(t("ts.mag"), 22, 662);
      ctx.fillText("=", 142, 662);
      fraction(ctx, 186, 655, "Fo", "Fe", 40, bold);
      ctx.font = bold; ctx.fillText("=", 209, 662);
      fraction(ctx, 265, 655, a.focal + " mm", e.focal + " mm", 76, "15px Verdana, Geneva, sans-serif");
      ctx.font = plain; ctx.fillText("= " + mag(), 307, 662);

      row(t("ts.fov"), fov().toFixed(2) + "°", 26, 718, 170);
    }
    function fraction(ctx, cx, y, top, bottom, barW, font) {
      ctx.font = font; ctx.textAlign = "center";
      ctx.fillText(top, cx, y - 8);
      ctx.fillText(bottom, cx, y + 22);
      ctx.fillRect(cx - barW / 2, y - 1, barW, 2);
      ctx.textAlign = "left";
    }

    /* ---------------------------- target painters ---------------------------- */
    var CRATERS = (function () {                     // fixed, seeded crater field
      var s = 7717, out = [];
      function rnd() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }
      for (var i = 0; i < 46; i++) out.push({ r: Math.sqrt(rnd()) * 0.94, th: rnd() * TAU, size: 0.015 + rnd() * 0.06 });
      return out;
    })();
    function drawMoon(ctx, cx, cy, r) {
      var g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      g.addColorStop(0, "#f0f0f2"); g.addColorStop(0.75, "#cfd0d4"); g.addColorStop(1, "#96979c");
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = g; ctx.fill();
      var maria = [[-.30, -.28, .30], [.10, -.42, .20], [.30, -.10, .24], [-.12, .05, .18], [-.44, .10, .14]];
      ctx.fillStyle = "rgba(90,92,104,.55)";
      maria.forEach(function (m) {
        ctx.beginPath(); ctx.ellipse(cx + m[0] * r, cy + m[1] * r, m[2] * r, m[2] * r * 0.86, 0.4, 0, TAU); ctx.fill();
      });
      ctx.strokeStyle = "rgba(255,255,255,.30)"; ctx.lineWidth = 1;
      CRATERS.forEach(function (c) {
        var cr = c.size * r; if (cr < 0.7) return;
        ctx.beginPath(); ctx.arc(cx + c.r * r * Math.cos(c.th), cy + c.r * r * Math.sin(c.th), cr, 0, TAU);
        ctx.fillStyle = "rgba(120,122,134,.35)"; ctx.fill(); ctx.stroke();
      });
    }
    function drawSaturn(ctx, cx, cy, rRing) {
      var rp = rRing * 0.44;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.32);
      ctx.beginPath(); ctx.ellipse(0, 0, rRing, rRing * 0.30, 0, Math.PI, TAU);
      ctx.strokeStyle = "rgb(226,206,158)"; ctx.lineWidth = Math.max(1, rRing * 0.13); ctx.stroke();
      var g = ctx.createLinearGradient(0, -rp, 0, rp);
      g.addColorStop(0, "#ececec"); g.addColorStop(0.5, "#d6d0c0"); g.addColorStop(1, "#a8a08a");
      ctx.beginPath(); ctx.ellipse(0, 0, rp, rp * 0.90, 0, 0, TAU); ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = "rgba(150,128,86,.55)"; ctx.lineWidth = Math.max(0.8, rp * 0.10);
      [-0.35, 0, 0.34].forEach(function (b) {
        ctx.beginPath(); ctx.ellipse(0, b * rp, rp * Math.sqrt(1 - b * b) * 0.98, rp * 0.06, 0, 0, TAU); ctx.stroke();
      });
      ctx.beginPath(); ctx.ellipse(0, 0, rRing, rRing * 0.30, 0, 0, Math.PI);
      ctx.strokeStyle = "rgb(240,222,176)"; ctx.lineWidth = Math.max(1, rRing * 0.13); ctx.stroke();
      ctx.restore();
    }
    var CLUSTER = (function () {
      var s = 20240624, out = [];
      function rnd() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }
      for (var i = 0; i < 90; i++) {
        var r = Math.sqrt(rnd()), th = rnd() * TAU;
        out.push({ x: r * Math.cos(th), y: r * Math.sin(th), m: 2 + rnd() * 8 });
      }
      return out;
    })();
    function drawCluster(ctx, cx, cy, spread) {
      CLUSTER.forEach(function (st) {
        var x = cx + st.x * spread, y = cy + st.y * spread;
        var r = Math.max(0.8, (10.5 - st.m) * 0.9);
        var g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
        g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.4, "rgba(205,222,255,.55)"); g.addColorStop(1, "rgba(160,190,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3, 0, TAU); ctx.fill();
      });
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});
