/* Telescope Simulator ----------------------------------------------------------
   Faithful rebuild of the ClassAction "telescope10.swf". Every number below was
   decoded from the SWF's own ActionScript (drawTelescope, changeAperture,
   changeEyepiece, changeFocus, changeObject, updateReadouts), and the art is
   the SWF's own: the hatched "rect" lens symbol, the focus knob, the panels,
   the field-of-view disc and its mask (_telescope-art.js), and the three
   photographs it shows through the eyepiece (assets/img/sims/telescope-*.jpg).

     • the refractor is built in a local frame — objective ('lens1') at x = 750,
       eyepiece ('lens2') at x = 50 + focus, the step down to the drawtube at
       x = 150 — then the whole telescope is rotated −25° and placed at (0, 320)
       on the 1000×750 stage;
     • both lenses are the same "rect" symbol stretched to size with _width /
       _height (its 53 × 103 bounds include the stroke), so the eyepiece gets
       thicker as its focal length gets shorter (15 / 20 / 25 px for 40 / 20 /
       10 mm) and its hatching is squeezed accordingly;
     • rays enter parallel at ±H/3 (plus ±H/8 on the 8-inch, and a centre ray on
       the 6-inch), bend at the objective, cross, reach the eyepiece and leave
       parallel, stopping 30 px beyond it. The crossing is steered by each
       aperture's `beamCross` — including the original's quirk of aiming the
       ±H/3 rays with an H/4 slope, which is why they cross a little further out;
     • the focus knob turns 30° per focus unit, and racking focus slides the
       drawtube 1 px per unit;
     • the target is attached at (755, 511) — a few pixels off the field's
       centre (761, 508), as in the SWF — scaled by a 3×3 table (36 … 66 %),
       dimmed by the aperture (100 / 80 / 60 %) and masked to the field;
     • the view is sharp at focus = −focusOffset (+3.6 / +0.6 / −3.2 for the
       40 / 20 / 10 mm eyepieces); away from it the SWF fakes defocus with eight
       15%-alpha copies of the image pushed outwards, reproduced here;
     • readouts come from the SWF's tables: Fo = 1400 / 1220 / 1020 mm,
       LGP 840 / 475 / 210, magnification ⌊Fo/Fe⌋, resolution ⌊450/D⌋/100, and a
       3×3 field-of-view table.
   The Observing radio buttons and the Focus Adjustments slider work on the
   canvas as in the SWF; the sidebar mirrors them.                            */
Sim.create({
  id: "telescope10",
  width: 1000, height: 750,
  strings: {
    en: {
      "ts.obs": "Observing", "ts.ap": "Aperture", "ts.eye": "Eyepiece", "ts.target": "Target",
      "ts.focusG": "Focus Adjustments", "ts.focus": "focus",
      "ts.in8": "8-inch", "ts.in6": "6-inch", "ts.in4": "4-inch",
      "ts.mm40": "40 mm", "ts.mm20": "20 mm", "ts.mm10": "10 mm",
      "ts.moon": "Moon", "ts.saturn": "Saturn", "ts.cluster": "Cluster",
      "ts.readouts": "Readouts", "ts.lgp": "LGP", "ts.lgpNote1": "(times that of the ", "ts.lgpNote2": "human eye)",
      "ts.res": "Resolution", "ts.mag": "Magnification", "ts.fov": "Field of View",
      "ts.title1": "Refracting", "ts.title2": "Telescope", "ts.fovLabel": "Field of View",
      "ts.arcsec": "arc-secs",
      "ts.hint": "turn the focus until the image is sharp — each eyepiece focuses at a different setting"
    },
    id: {
      "ts.obs": "Pengamatan", "ts.ap": "Apertur", "ts.eye": "Okuler", "ts.target": "Sasaran",
      "ts.focusG": "Penyetelan Fokus", "ts.focus": "fokus",
      "ts.in8": "8 inci", "ts.in6": "6 inci", "ts.in4": "4 inci",
      "ts.mm40": "40 mm", "ts.mm20": "20 mm", "ts.mm10": "10 mm",
      "ts.moon": "Bulan", "ts.saturn": "Saturnus", "ts.cluster": "Gugus",
      "ts.readouts": "Pembacaan", "ts.lgp": "DKC", "ts.lgpNote1": "(kali daya kumpul", "ts.lgpNote2": "mata manusia)",
      "ts.res": "Resolusi", "ts.mag": "Perbesaran", "ts.fov": "Medan Pandang",
      "ts.title1": "Teleskop", "ts.title2": "Refraktor", "ts.fovLabel": "Medan Pandang",
      "ts.arcsec": "detik busur",
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
    var D2R = Math.PI / 180, TAU = Math.PI * 2, ASC = 1.0059;
    var ART = window.TELESCOPE_ART, draw = SwfShape.draw;
    var ARIAL = "Arial, Helvetica, sans-serif", VERDANA = "Verdana, Geneva, sans-serif";
    var DEVICE = "'Noto Sans', Arial, Helvetica, sans-serif";     // Ruffle's stand-in for device fonts

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
    var GHOST_X = [0, 2, 1.4, 0, -1.4, -2, -1.4, 0, 1.4];               // objectXOffset / objectYOffset —
    var GHOST_Y = [0, 0, 1.4, 2, 1, 0, -1.4, -2, -1.4];                 // including the original's odd "1"
    var LENS1_X = 750, LENS_Y = 150, ILENS2_X = 50, XTUBE = 150, LENS2_H = 40;
    var TEL_X = 0, TEL_Y = 320, TEL_ROT = -25;                          // telescope clip placement
    var OBJ_X = 755, OBJ_Y = 511;                                       // mainObject's position
    var MASK = { x: 761, y: 508, r: 236 * 0.995773 };                   // viewmask: shape 26 at 99.58 %

    /* the targets: each a bitmap-filled rectangle the size of its photograph,
       centred on the clip (bitmap fill matrix 20 twips a pixel, −w/2, −h/2) */
    var TARGETS = {
      moon: { src: "telescope-moon.jpg", w: 980, h: 999 },
      saturn: { src: "telescope-saturn.jpg", w: 1000, h: 1000 },
      cluster: { src: "telescope-cluster.jpg", w: 1500, h: 1500 }
    };
    Object.keys(TARGETS).forEach(function (k) {
      var t = TARGETS[k], img = new Image();
      img.onload = function () { t.ready = true; S.requestDraw(); };
      img.src = "../assets/img/sims/" + t.src;
      t.img = img;
    });

    /* ---- state: the SWF opens on 8-inch, 40 mm, Moon, focus 8.0 ---- */
    var apKey = "8", epKey = "40", target = "moon", focus = 8.0;
    function ap() { return APERTURE[apKey]; }
    function ep() { return EYEPIECE[epKey]; }
    function lgp() { return LGP[ap().i]; }
    function resolution() { return Math.floor(4.5 / ap().diameter * 100) / 100; }
    function mag() { return Math.floor(ap().focal / ep().focal); }
    function fov() { return FOV[ep().i * 3 + ap().i]; }

    /* ---- the Observing panel's radio groups and the focus SliderV3 ---- */
    var RADIOS = [
      { group: "ap", v: "8", key: "ts.in8", x: 33, y: 75 }, { group: "ap", v: "6", key: "ts.in6", x: 122, y: 75 },
      { group: "ap", v: "4", key: "ts.in4", x: 214, y: 75 },
      { group: "ep", v: "40", key: "ts.mm40", x: 33, y: 122 }, { group: "ep", v: "20", key: "ts.mm20", x: 122, y: 123 },
      { group: "ep", v: "10", key: "ts.mm10", x: 214, y: 122 },
      { group: "tg", v: "moon", key: "ts.moon", x: 33, y: 168.1 }, { group: "tg", v: "saturn", key: "ts.saturn", x: 122, y: 168.1 },
      { group: "tg", v: "cluster", key: "ts.cluster", x: 214, y: 168 }
    ];
    function groupValue(g) { return g === "ap" ? apKey : g === "ep" ? epKey : target; }
    function setGroup(g, v) {
      if (g === "ap") apKey = v; else if (g === "ep") epKey = v; else target = v;
      syncSidebar(); S.requestDraw();
    }
    var SL = { x: 457.85, y: 50.95, min: -10, max: 10, hw: 100, prec: 1 };   // offsetSlider
    SL.scale = (SL.max - SL.min) / (2 * SL.hw);
    function grabberX() { return (focus - SL.min) / SL.scale - SL.hw; }
    function setFocus(v, fromSidebar) {             // SliderV3.setValue, then changeFocus()
      if (!isFinite(v)) return;
      v = Math.round(10 * v) / 10;
      focus = Math.min(SL.max, Math.max(SL.min, v));
      if (!fromSidebar) syncSidebar();
      S.requestDraw();
    }

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      FlashText.begin(ctx);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, 1000, 750);
      draw(ctx, ART[70]);                          // the field of view's disc
      draw(ctx, ART[71]);                          // the panels
      slider(ctx, t);
      RADIOS.forEach(function (r) { radio(ctx, r, t); });
      labels(ctx, t);
      readouts(ctx, t);
      drawTelescope(ctx);
      drawTarget(ctx);
    });

    // the static text, glyph-drawn Arial Bold in the SWF (positions: placement + run)
    function labels(ctx, t) {
      ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      function st(size, str, x, y) {
        ctx.font = "bold " + size + "px " + ARIAL;
        FlashText.fillStatic(ctx, str, x, y);
        return FlashText.widthStatic(ctx, str);
      }
      st(28, t("ts.obs"), 94.25, 38.05);
      st(18, " " + t("ts.ap"), 24.96, 64.25);
      st(18, t("ts.eye") + " ", 28, 110.25);
      st(18, t("ts.target"), 29.5, 157.25);
      st(28, t("ts.readouts"), 32.75, 521.65);
      // the stage titles, nudged left only if a translation would run off the stage
      ctx.font = "bold 28px " + ARIAL;
      function title(str, x, y) { st(28, str, Math.min(x, 990 - FlashText.widthStatic(ctx, str)), y); }
      title(t("ts.title1"), 822.25, 66.65);
      title(t("ts.title2"), 823, 99.95);
      title(t("ts.fovLabel"), 816.45, 263.95);
      lgpEnd = st(17, t("ts.lgp") + "  =", 27.85, 559.95) + 27.85;
      ctx.font = "bold 17px " + ARIAL;
      FlashText.fillStatic(ctx, t("ts.lgpNote1"), 175.1 + FlashText.widthStatic(ctx, "(times that of the ") / 2, 548.95, "center");
      FlashText.fillStatic(ctx, t("ts.lgpNote2"), 196.25 + FlashText.widthStatic(ctx, "human eye)") / 2, 569.95, "center");
      resEnd = st(17, t("ts.res") + "  = ", 25.85, 602.65) + 25.85;
      st(17, t("ts.mag") + "  =", 24.2, 654.95);
      ctx.font = "bold 17px " + ARIAL;
      FlashText.fillStatic(ctx, "=", 24.2 + FlashText.widthStatic(ctx, "Magnification  =              "), 654.95);
      fovEnd = st(17, t("ts.fov") + "  = ", 27.15, 711.75) + 27.15;
    }
    var lgpEnd = 0, resEnd = 0, fovEnd = 0;
    // the readout fields: centred EditTexts in the device font "Arial" Bold, which Ruffle
    // draws in its own sans (Noto Sans, regular) — so a regular sans, baseline as measured
    function field(ctx, str, x, y, w, minX, suffix) {
      ctx.font = "17px " + DEVICE; ctx.fillStyle = "#000000";
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var left = Math.max(x - 2, (minX || -1e9) - 2), inner = w - 4, tw = ctx.measureText(str).width;
      var tx = left + 2 + Math.max(0, (inner - tw) / 2);
      ctx.save();
      ctx.beginPath(); ctx.rect(left, y - 2, w, 40); ctx.clip();
      ctx.fillText(str, tx, y + 17.4);
      if (suffix) ctx.fillText(suffix, tx + tw, y + 17.4);
      ctx.restore();
    }
    function readouts(ctx, t) {
      var a = ap(), e = ep();
      field(ctx, String(lgp()), 69, 544.55, 104, lgpEnd + 6);
      field(ctx, resolution() + " " + t("ts.arcsec"), 133.95, 588.25, 134, resEnd + 6);
      field(ctx, "Fo", 161.05, 621.55, 55.95);
      field(ctx, "Fe", 160.6, 655.9, 55.95);
      field(ctx, a.focal + " mm", 230, 621.5, 77);
      field(ctx, e.focal + " mm", 235, 655.45, 68);
      field(ctx, "= " + mag(), 295.45, 638.45, 61);
      // FOV + unescape('%ba'): Ruffle shows no sign at all; the degree sign is added after the number
      field(ctx, String(fov()), 155.75, 697.35, 69.25, fovEnd + 6, "°");
    }
    function radio(ctx, r, t) {                    // FRadioButton: the ring, the well, the dot, its label
      var on = groupValue(r.group) === r.v, down = press && press.kind === "radio" && press.r === r && press.inside;
      ctx.save();
      ctx.translate(r.x, r.y);
      draw(ctx, ART[6]);
      ctx.save(); ctx.translate(1, 1); draw(ctx, ART[8]); ctx.restore();
      ctx.save(); ctx.translate(2.2, 2.2); draw(ctx, ART[10]); ctx.restore();
      ctx.save(); ctx.translate(1.5, 1.5); draw(ctx, ART[12]); ctx.restore();
      ctx.save(); ctx.translate(2, 2); draw(ctx, down ? ART[18] : ART[15]); ctx.restore();
      if (on) { ctx.beginPath(); ctx.arc(5, 5, 2, 0, TAU); ctx.fillStyle = "#000000"; ctx.fill(); }
      // the label is " 8-inch" etc. in the device font _sans: its leading space does advance
      ctx.font = "12px " + DEVICE; ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText(" " + t(r.key), 12, 9.5);
      r.w = 12 + ctx.measureText(" " + t(r.key)).width;
      ctx.restore();
    }
    function slider(ctx, t) {                      // SliderV3 "Focus Adjustments"
      ctx.save();
      ctx.translate(SL.x, SL.y);
      draw(ctx, ART[40]);
      ctx.save(); ctx.translate(grabberX(), -2.2); draw(ctx, ART[42]); ctx.restore();
      ctx.fillStyle = "#000000"; ctx.font = "bold 12px " + VERDANA;
      FlashText.fill(ctx, t("ts.focusG"), -12 - SL.hw + 2, -35 + 2 + ASC * 12, "left");
      FlashText.fill(ctx, focus.toFixed(SL.prec), 12 + SL.hw - 2, -35 + 2 + ASC * 12, "right");
      ctx.font = "bold 10px " + VERDANA;
      FlashText.fill(ctx, String(SL.min), -SL.hw, 14 + 2 + ASC * 10, "center");
      FlashText.fill(ctx, String(SL.max), SL.hw, 14 + 2 + ASC * 10, "center");
      ctx.restore();
    }

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

      // the two lenses — the one "rect" symbol, its 53 × 103 bounds stretched to size
      lens(ctx, LENS1_X, LENS_Y, W1, H1);
      lens(ctx, lens2X, LENS_Y, W2, LENS2_H);

      // the focus knob, turned 30° per unit of focus
      ctx.save();
      ctx.translate(XTUBE + 30, LENS_Y + H1 / 4); ctx.rotate(30 * focus * D2R);
      draw(ctx, ART[53]);
      ctx.restore();

      // rays (lineStyle 4, 0xFFFF00)
      ctx.strokeStyle = "#ffff00"; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath();
      var rayStartX = LENS1_X + W1 / 2 + 40;
      var rayEndX = lens2X - W2 / 2 - 30;
      rayPair(ctx, H1 / 3, H1 / 4, a.beamCross, lens2X, rayStartX, rayEndX);
      if (apKey === "6") seg(ctx, rayStartX, LENS_Y, rayEndX, LENS_Y);             // 6-inch centre ray
      if (apKey === "8") rayPair(ctx, H1 / 8, H1 / 8, a.beamCross, lens2X, rayStartX, rayEndX);
      ctx.stroke();

      ctx.restore();
    }
    function lens(ctx, x, y, w, h) {
      ctx.save();
      ctx.translate(x, y); ctx.scale(w / 53, h / 103);
      draw(ctx, ART[51]);
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

    /* -------- the target: mainObject, its eight 15% copies, masked to the field -------- */
    function drawTarget(ctx) {
      var T = TARGETS[target];
      if (!T.ready) return;
      var a = ap(), e = ep(), k = SCALE[e.i][a.i] / 100;
      var blur = focus + e.focusOffset;             // 0 ⇒ every copy lands on the original
      ctx.save();
      ctx.beginPath(); ctx.arc(MASK.x, MASK.y, MASK.r, 0, TAU); ctx.clip();
      ctx.translate(OBJ_X, OBJ_Y); ctx.scale(k, k);
      ctx.imageSmoothingQuality = "high";
      for (var i = 0; i < 9; i++) {
        ctx.globalAlpha = a.alpha * (i === 0 ? 1 : 0.15);
        ctx.drawImage(T.img, GHOST_X[i] * blur - T.w / 2, GHOST_Y[i] * blur - T.h / 2);
      }
      ctx.restore();
    }

    /* ============== the pointer: FRadioButton and the SliderV3 grabber / bar ============== */
    var press = null;
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function hit(p) {
      for (var i = 0; i < RADIOS.length; i++) {
        var r = RADIOS[i];
        if (p.x >= r.x && p.x <= r.x + (r.w || 10) && p.y >= r.y - 2 && p.y <= r.y + 12) return { kind: "radio", r: r };
      }
      var lx = p.x - SL.x, ly = p.y - SL.y, gx = grabberX();
      if (lx >= gx - 7 && lx <= gx + 7 && ly >= -2.2 - 9.3 && ly <= -2.2 + 13.75) return { kind: "grab" };
      if (lx >= -SL.hw && lx <= SL.hw && ly >= -2.75 && ly <= 2.75) return { kind: "bar" };
      return null;
    }
    function barStep(lx) { setFocus(focus + (lx < grabberX() ? -0.1 : 0.1)); }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p);
      if (!h) return;
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      press = { kind: h.kind, r: h.r, inside: true };
      if (h.kind === "grab") press.off = p.x - SL.x - grabberX();
      else if (h.kind === "bar") {                 // a step now, then one a frame (12 fps) after 500 ms
        press.lx = p.x - SL.x; press.start = performance.now() + 500; press.last = 0;
        barStep(press.lx);
        requestAnimationFrame(barRepeat);
      }
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!press) { S.canvas.style.cursor = hit(p) ? "pointer" : "default"; return; }
      if (press.kind === "grab") setFocus(SL.min + SL.scale * ((p.x - SL.x - press.off) + SL.hw));
      else if (press.kind === "bar") press.lx = p.x - SL.x;
      else {
        var h = hit(p), inside = !!h && h.kind === "radio" && h.r === press.r;
        if (inside !== press.inside) { press.inside = inside; S.requestDraw(); }
      }
    });
    function release(ev, cancelled) {
      var pr = press; press = null;
      if (pr && !cancelled && pr.kind === "radio" && pr.inside) setGroup(pr.r.group, pr.r.v);
      S.requestDraw();
    }
    S.canvas.addEventListener("pointerup", function (ev) { release(ev, false); });
    S.canvas.addEventListener("pointercancel", function (ev) { release(ev, true); });
    function barRepeat(now) {
      if (!press || press.kind !== "bar") return;
      if (now > press.start && now - press.last >= 1000 / 12) { press.last = now; barStep(press.lx); }
      requestAnimationFrame(barRepeat);
    }

    /* ================================ the sidebar ================================ */
    var syncing = false;
    S.group("ts.obs");
    var apC = S.select({ labelKey: "ts.ap", value: apKey,
      options: [{ v: "8", labelKey: "ts.in8" }, { v: "6", labelKey: "ts.in6" }, { v: "4", labelKey: "ts.in4" }],
      on: function (v) { if (!syncing) setGroup("ap", v); } });
    var epC = S.select({ labelKey: "ts.eye", value: epKey,
      options: [{ v: "40", labelKey: "ts.mm40" }, { v: "20", labelKey: "ts.mm20" }, { v: "10", labelKey: "ts.mm10" }],
      on: function (v) { if (!syncing) setGroup("ep", v); } });
    var tgC = S.select({ labelKey: "ts.target", value: target,
      options: [{ v: "moon", labelKey: "ts.moon" }, { v: "saturn", labelKey: "ts.saturn" }, { v: "cluster", labelKey: "ts.cluster" }],
      on: function (v) { if (!syncing) setGroup("tg", v); } });
    S.group("ts.focusG");
    var focusCtl = S.slider({ labelKey: "ts.focus", min: -10, max: 10, value: focus, step: 0.1,
      format: function (v) { return v.toFixed(1); },
      on: function (v) { if (!syncing) setFocus(v, true); } });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ts.hint");
    focusCtl.input.parentNode.parentNode.appendChild(hint);
    function syncSidebar() {
      syncing = true;
      apC.set(apKey); epC.set(epKey); tgC.set(target); focusCtl.set(focus);
      syncing = false;
    }
    S.requestDraw();
  }
});
