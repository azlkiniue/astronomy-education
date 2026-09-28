/* Registration Simulator ---------------------------------------------------------
   Faithful rebuild of NAAP's "registrationSimulator.swf". Three exposures of the
   same field, each landing on the detector in a slightly different place, have to
   be slid on top of one another until the stars line up. Only then can the same
   pixel in each frame be trusted to be the same piece of sky.

   The SWF's own setup: a 500 × 400 work area, three 400 × 300 frames at noise mean
   2418 / sigma 432, saturation magnitude 3, an Airy disc of radius 4, and fifty
   stars scattered over the frame plus a 35-pixel margin with magnitudes from 3 to
   7. Frame 2's stars are laid down at (+35, −29) and frame 3's at (+15, +21), so
   the frames are registered when their offsets read (−35, +29) and (−15, −21).
   Frames start at (+25, −35) and (−27, +10), which is where the SWF opens.    */
Sim.create({
  id: "registrationsimulator",
  width: 540, height: 502,
  strings: {
    en: {
      "rg.show": "Frames", "rg.f1": "show frame 1", "rg.f2": "show frame 2",
      "rg.f3": "show frame 3", "rg.top": "on top", "rg.alpha": "make the top frame translucent",
      "rg.invert": "invert the display",
      "rg.pos": "Frame positions", "rg.x2": "frame 2 — x offset",
      "rg.y2": "frame 2 — y offset", "rg.x3": "frame 3 — x offset",
      "rg.y3": "frame 3 — y offset", "rg.reset": "Reset", "rg.solve": "Register them for me",
      "rg.none": "none", "rg.one": "frame 1", "rg.two": "frame 2", "rg.three": "frame 3",
      "rg.r2": "frame 2 offset", "rg.r3": "frame 3 offset", "rg.rState": "registration",
      "rg.ok": "registered", "rg.off": "off by",
      "rg.hint": "Click a frame to bring it to the top, make it translucent, and slide it until its stars sit exactly on the frame underneath. Do frame 2 first, then frame 3.",
      "rg.px": "px"
    },
    id: {
      "rg.show": "Bingkai", "rg.f1": "tampilkan bingkai 1", "rg.f2": "tampilkan bingkai 2",
      "rg.f3": "tampilkan bingkai 3", "rg.top": "di atas",
      "rg.alpha": "buat bingkai teratas tembus pandang", "rg.invert": "balikkan tampilan",
      "rg.pos": "Kedudukan bingkai", "rg.x2": "bingkai 2 — geser x",
      "rg.y2": "bingkai 2 — geser y", "rg.x3": "bingkai 3 — geser x",
      "rg.y3": "bingkai 3 — geser y", "rg.reset": "Atur ulang",
      "rg.solve": "Tumpangtindihkan untuk saya",
      "rg.none": "tidak ada", "rg.one": "bingkai 1", "rg.two": "bingkai 2", "rg.three": "bingkai 3",
      "rg.r2": "geseran bingkai 2", "rg.r3": "geseran bingkai 3", "rg.rState": "penumpangtindihan",
      "rg.ok": "sudah bertumpang tindih", "rg.off": "meleset",
      "rg.hint": "Klik sebuah bingkai untuk membawanya ke atas, buat tembus pandang, lalu geser sampai bintang-bintangnya tepat menimpa bingkai di bawahnya. Kerjakan bingkai 2 dulu, baru bingkai 3.",
      "rg.px": "px"
    }
  },
  about: {
    en: "<p>A telescope does not point in exactly the same place twice. Between one exposure and the next the mount drifts, the guiding nudges, the whole field slides a few pixels across the detector. Each frame is a true picture of the sky, but pixel (100, 100) is not the same star in all of them.</p>" +
        "<p>Registration fixes that. Find the shift that makes the stars in one frame land on the stars in another, apply it, and afterwards every frame shares one coordinate system. Only then can you measure the same star through a whole night's worth of images and trust that the numbers belong together.</p>" +
        "<p>In practice a computer does this by cross-correlating the frames, but the idea is exactly what you are doing here by eye: slide until the star patterns coincide. The noise does not line up — it is different in every exposure — which is a useful reminder that what the frames share is the sky, not the grain.</p>",
    id: "<p>Sebuah teleskop tidak pernah mengarah ke tempat yang persis sama dua kali. Di antara satu pemotretan dan berikutnya, dudukannya melayang, penuntunnya menyenggol, dan seluruh medan bergeser beberapa piksel melintasi detektor. Setiap bingkai adalah gambaran langit yang benar, tetapi piksel (100, 100) bukanlah bintang yang sama pada semuanya.</p>" +
        "<p>Penumpangtindihan memperbaikinya. Carilah geseran yang membuat bintang pada satu bingkai jatuh tepat pada bintang di bingkai lain, terapkan, dan setelah itu semua bingkai berbagi satu sistem koordinat. Baru setelah itu Anda dapat mengukur bintang yang sama sepanjang citra semalam penuh dan percaya bahwa angka-angkanya memang sepadan.</p>" +
        "<p>Dalam praktiknya komputer melakukannya dengan korelasi silang, tetapi gagasannya persis seperti yang Anda lakukan dengan mata di sini: geser sampai pola bintangnya berimpit. Derau tidak akan berimpit — ia berbeda pada setiap pemotretan — dan itu pengingat berguna bahwa yang dibagi bersama oleh bingkai-bingkai itu adalah langit, bukan bintiknya.</p>"
  },
  build: function (S) {
    var FONT = "Verdana, Geneva, sans-serif";
    var MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

    /* the SWF's own frame1 constants */
    var FW = 400, FH = 300, MARGIN = 35, WORK_MARGIN = 50;
    var NOISE_MEAN = 2418, NOISE_SIGMA = 432, SAT_MAG = 3, MAG_RANGE = 4, N_STARS = 50;
    var WORK = { x: 14, y: 44, w: FW + 2 * WORK_MARGIN, h: FH + 2 * WORK_MARGIN };
    var SEEDS = [7, 5007, 10071];
    var SHIFT = [{ x: 0, y: 0 }, { x: 35, y: -29 }, { x: 15, y: 21 }];
    var START = [{ x: WORK_MARGIN, y: WORK_MARGIN }, { x: 75, y: 15 }, { x: 23, y: 60 }];

    /* generateStarList, with our own deterministic draw so the field is stable */
    var seed = 20090317;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var STARS = [];
    for (var i = 0; i < N_STARS; i++) {
      STARS.push({ x: -MARGIN + (FW + 2 * MARGIN) * rnd(),
        y: -MARGIN + (FH + 2 * MARGIN) * rnd(),
        magnitude: SAT_MAG + MAG_RANGE * rnd() });
    }

    var pos = START.map(function (p) { return { x: p.x, y: p.y }; });
    var visible = [true, false, false];
    var onTop = "1", useAlpha = false, invert = false, drag = null;

    var frames = [null, null, null];
    function buildFrame(i) {
      var counts = STARFIELD.render({ width: FW, height: FH, noiseMean: NOISE_MEAN,
        noiseSigma: NOISE_SIGMA, saturationMagnitude: SAT_MAG, seed: SEEDS[i],
        psf: STARFIELD.airyDisc(4),
        stars: STARS.map(function (s) {
          return { x: s.x + SHIFT[i].x, y: s.y + SHIFT[i].y, magnitude: s.magnitude };
        }) });
      var c = document.createElement("canvas");
      c.width = FW; c.height = FH;
      var cx = c.getContext("2d");
      var img = cx.createImageData(FW, FH);
      STARFIELD.paint(img, counts, invert);
      cx.putImageData(img, 0, 0);
      frames[i] = c;
    }
    function buildAll() { for (var i = 0; i < 3; i++) buildFrame(i); }
    buildAll();

    /* ------------------------------------------------------------- controls */
    S.group("rg.show");
    var vis = ["rg.f1", "rg.f2", "rg.f3"].map(function (k, i) {
      return S.toggle({ labelKey: k, value: i === 0, on: function (v) {
        visible[i] = v; sync();
      } });
    });
    var topCtl = S.select({ labelKey: "rg.top", value: "1",
      options: [{ v: "1", labelKey: "rg.one" }, { v: "2", labelKey: "rg.two" },
        { v: "3", labelKey: "rg.three" }, { v: "none", labelKey: "rg.none" }],
      on: function (v) { onTop = v; } });
    var alphaCtl = S.toggle({ labelKey: "rg.alpha", value: false,
      on: function (v) { useAlpha = v; } });
    var invCtl = S.toggle({ labelKey: "rg.invert", value: false,
      on: function (v) { invert = v; buildAll(); } });

    S.group("rg.pos");
    var off = [];
    [["rg.x2", 1, "x"], ["rg.y2", 1, "y"], ["rg.x3", 2, "x"], ["rg.y3", 2, "y"]]
      .forEach(function (row) {
        off.push(S.slider({ labelKey: row[0], min: -60, max: 60,
          value: START[row[1]][row[2]] - WORK_MARGIN, step: 1,
          format: function (v) { return v + " px"; },
          on: function (v) { pos[row[1]][row[2]] = WORK_MARGIN + v; sync(); } }));
      });
    S.button({ labelKey: "rg.solve", on: function () {
      off[0].set(-SHIFT[1].x); off[1].set(-SHIFT[1].y);
      off[2].set(-SHIFT[2].x); off[3].set(-SHIFT[2].y);
      vis[1].set(true); vis[2].set(true);
    } });
    S.button({ labelKey: "rg.reset", on: function () {
      off[0].set(START[1].x - WORK_MARGIN); off[1].set(START[1].y - WORK_MARGIN);
      off[2].set(START[2].x - WORK_MARGIN); off[3].set(START[2].y - WORK_MARGIN);
      vis[0].set(true); vis[1].set(false); vis[2].set(false);
      topCtl.set("1"); alphaCtl.set(false); invCtl.set(false);
    } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "rg.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var out2 = S.readout({ labelKey: "rg.r2" });
    var out3 = S.readout({ labelKey: "rg.r3" });
    var outState = S.readout({ labelKey: "rg.rState" });

    function offsetOf(i) {
      return { x: Math.round(pos[i].x - pos[0].x), y: Math.round(pos[i].y - pos[0].y) };
    }
    function errorOf(i) {
      var o = offsetOf(i);
      return { x: o.x + SHIFT[i].x, y: o.y + SHIFT[i].y };
    }
    function sync() {
      var o2 = offsetOf(1), o3 = offsetOf(2);
      out2("(" + o2.x + ", " + o2.y + ")");
      out3("(" + o3.x + ", " + o3.y + ")");
      var e2 = errorOf(1), e3 = errorOf(2);
      var bad = [];
      if (visible[1] && (e2.x || e2.y)) bad.push("2: " + e2.x + ", " + e2.y);
      if (visible[2] && (e3.x || e3.y)) bad.push("3: " + e3.x + ", " + e3.y);
      outState(bad.length ? I18N.t("rg.off") + " " + bad.join(" · ") : I18N.t("rg.ok"));
      S.requestDraw();
    }

    /* ---------------------------------------------------------- interaction */
    /* onStarFieldPressed: the frame you press is the topmost visible one under
       the cursor, which is the order the SWF stacks them in — and pressing it
       brings it to the top, like clicking a window                            */
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      var order = stack();
      for (var k = order.length - 1; k >= 0; k--) {
        var i = order[k];
        if (p.x >= WORK.x + pos[i].x && p.x < WORK.x + pos[i].x + FW &&
            p.y >= WORK.y + pos[i].y && p.y < WORK.y + pos[i].y + FH) {
          if (onTop !== String(i + 1)) topCtl.set(String(i + 1));
          ev.preventDefault();
          if (i === 0) return;                    // frame 1 is the reference
          drag = { i: i, x: p.x, y: p.y, ox: pos[i].x, oy: pos[i].y };
          try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* no live pointer */ }
          return;
        }
      }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      var nx = Math.round(drag.ox + p.x - drag.x) - WORK_MARGIN;
      var ny = Math.round(drag.oy + p.y - drag.y) - WORK_MARGIN;
      var b = drag.i === 1 ? 0 : 2;
      off[b].set(Math.max(-60, Math.min(60, nx)));
      off[b + 1].set(Math.max(-60, Math.min(60, ny)));
    });
    ["pointerup", "pointercancel"].forEach(function (k) {
      S.canvas.addEventListener(k, function () { drag = null; });
    });
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    /* the visible frames, bottom to top, with the chosen one raised */
    function stack() {
      var order = [];
      for (var i = 0; i < 3; i++) if (visible[i] && String(i + 1) !== onTop) order.push(i);
      if (onTop !== "none") {
        var t = parseInt(onTop, 10) - 1;
        if (visible[t]) order.push(t);
      }
      return order;
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#eef0f4"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(WORK.x, WORK.y, WORK.w, WORK.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(WORK.x + 0.5, WORK.y + 0.5, WORK.w - 1, WORK.h - 1);
      ctx.fillStyle = "#333333"; ctx.font = "12px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText(tr("rg.show"), WORK.x, WORK.y - 10);

      ctx.save();
      ctx.beginPath(); ctx.rect(WORK.x, WORK.y, WORK.w, WORK.h); ctx.clip();
      var order = stack();
      var COLS = ["#5aa9e6", "#e8a33d", "#7ac74f"];
      order.forEach(function (i, k) {
        var top = k === order.length - 1;
        ctx.globalAlpha = (top && useAlpha && onTop !== "none") ? 0.4 : 1;
        ctx.drawImage(frames[i], WORK.x + pos[i].x, WORK.y + pos[i].y);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = COLS[i]; ctx.lineWidth = top ? 2 : 1;
        ctx.strokeRect(WORK.x + pos[i].x + 0.5, WORK.y + pos[i].y + 0.5, FW - 1, FH - 1);
        ctx.fillStyle = COLS[i]; ctx.font = "bold 11px " + FONT;
        ctx.textBaseline = "top";
        ctx.fillText(String(i + 1), WORK.x + pos[i].x + 5, WORK.y + pos[i].y + 4);
      });
      ctx.restore();

      /* the offsets, and how far each frame still has to go */
      var y = WORK.y + WORK.h + 22;
      ctx.textBaseline = "alphabetic";
      [1, 2].forEach(function (i, k) {
        var o = offsetOf(i), e = errorOf(i), ok = !e.x && !e.y;
        ctx.textAlign = "left";
        ctx.fillStyle = COLS[i]; ctx.font = "bold 12px " + FONT;
        ctx.fillText(tr(i === 1 ? "rg.r2" : "rg.r3"), WORK.x, y + k * 20);
        ctx.fillStyle = "#111111"; ctx.font = "12px " + MONO;
        ctx.fillText("(" + o.x + ", " + o.y + ")", WORK.x + 132, y + k * 20);
        ctx.fillStyle = ok ? "#1f8a44" : "#999999"; ctx.font = "11px " + FONT;
        ctx.fillText(ok ? "✓ " + tr("rg.ok") : "", WORK.x + 216, y + k * 20);
      });
    });

    sync();
  }
});
