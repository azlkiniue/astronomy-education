/* Tidal Bulge Simulation ------------------------------------------------------
   Faithful rebuild of the ClassAction "Tidal Bulge Simulation" (tidesim.swf —
   tideAnimClass, earthClass, moonClass and tidalClass, decompiled). Seen from
   above the North Pole: the Earth (the SWF's own art) inside its blue ocean
   bulge, and the Moon going round once every 51 seconds.
     • the bulge points at the Moon. With the Sun included it is the SWF's own
       360-frame tween of four morph shapes, picked by the Moon's angle: long
       and narrow at new and full Moon (spring tides), short and fat at the
       quarters (neap tides); without the Sun it is the Moon's bulge alone,
     • "Include Effects of Earth's Rotation" drags the bulge 20° ahead of the
       Moon, as the spinning Earth carries it round (the Earth turns 28 times
       for each trip of the Moon in the animation),
     • with the Sun the night sides darken and a "To Sun" arrow appears.
   The art, the morphs and the frame table come from _tidesim-art.js, generated
   from the SWF. Beyond the SWF: the Moon moves at the display's frame rate (at
   the SWF's angular speed) and resumes where it stopped; the animated
   ClassAction logo in the corner is left out — the page carries the credits.  */
Sim.create({
  id: "tidesim",
  width: 600, height: 550,
  strings: {
    en: {
      "td.run": "Run", "td.sun": "Include Sun",
      "td.rot": "Include Effects of Earth's Rotation",
      "td.reset": "Reset", "td.toSun": "To Sun"
    },
    id: {
      "td.run": "Jalankan", "td.sun": "Sertakan Matahari",
      "td.rot": "Sertakan Efek Rotasi Bumi",
      "td.reset": "Atur ulang", "td.toSun": "Ke Matahari"
    }
  },
  about: {
    en: "<p>Tides are caused by the <strong>differential gravitational force</strong> (tidal force) of the Moon and Sun across Earth's diameter. The side of Earth nearest the Moon feels a stronger pull than the centre, creating a bulge toward the Moon. The far side feels a weaker pull, so water there is \"left behind\", creating a second bulge.</p>" +
        "<p>Check <em>Include Sun</em> to see how the Sun's tidal effect (about 46% of the Moon's) lengthens the bulge at new and full Moon (spring tides) and shortens it at the quarter phases (neap tides). <em>Include Effects of Earth's Rotation</em> shows the spinning Earth dragging the bulge ahead of the Moon.</p>",
    id: "<p>Pasang surut disebabkan oleh <strong>gaya gravitasi diferensial</strong> (gaya pasang) Bulan dan Matahari pada diameter Bumi. Sisi Bumi terdekat Bulan merasakan tarikan lebih kuat daripada pusatnya, menciptakan tonjolan ke arah Bulan. Sisi jauh merasakan tarikan lebih lemah, sehingga air di sana \"tertinggal\" dan membentuk tonjolan kedua.</p>" +
        "<p>Centang <em>Sertakan Matahari</em> untuk melihat efek pasang Matahari (≈46% Bulan) yang memanjangkan tonjolan saat bulan baru dan purnama (pasang purnama) dan memendekkannya saat kuarter (pasang perbani). <em>Sertakan Efek Rotasi Bumi</em> memperlihatkan Bumi yang berputar menyeret tonjolan mendahului Bulan.</p>"
  },
  build: function (S) {
    var ART = window.TIDESIM_ART, SH = ART.SHAPES, draw = SwfShape.draw;
    var RAD = Math.PI / 180, TAU = Math.PI * 2;
    var SPEED = 510000 / 10;                       // moon._speed / tideAnim._speed: ms per orbit
    var OFFSET = 20;                               // tideAnim._offset: the rotation's lead (°)

    /* ---- state: the hidden "moon" clip's angle drives everything ---- */
    var angle = 0, tideTime = 0;                   // moon._angle (rad), earth._tideTime (°)
    var running = false, withSun = false, earthEffects = false;
    function frameNow() {                          // tidalClass: the bulge's frame
      if (!withSun) return 1;
      var f = Math.round(angle / RAD);
      return f <= 1 ? (f === 1 ? 2 : 360) : Math.min(360, f);
    }
    function tideRotation() { return earthEffects ? tideTime - OFFSET : tideTime; }
    var loop = S.loop(function (dt) {              // moonClass + tideAnimClass.onEnterFrame
      angle += dt * 1000 * TAU / SPEED;
      if (!(angle < TAU)) angle = 0;
      tideTime = 360 - angle / RAD;
    });

    /* ---- drawing ---- */
    function morph(ctx, id, ratio) {               // a DefineMorphShape at ratio / 65535
      var m = ART.MORPHS[id], t = ratio / 65535;
      m.fills.forEach(function (f) {
        ctx.fillStyle = mixColour(f[0].c[0], f[0].c[1], t);
        ctx.fill(morphPath(f[1], t), "evenodd");
      });
    }
    function morphPath(c, t) {
      var p = new Path2D(), i = 0, u = 1 - t;
      function X(k) { return c[k] * u + c[k + 2] * t; }
      function Y(k) { return c[k + 1] * u + c[k + 3] * t; }
      while (i < c.length) {
        var op = c[i++];
        if (op === 0) { p.moveTo(X(i), Y(i)); i += 4; }
        else if (op === 1) { p.lineTo(X(i), Y(i)); i += 4; }
        else if (op === 2) { p.quadraticCurveTo(X(i), Y(i), X(i + 4), Y(i + 4)); i += 8; }
        else p.closePath();
      }
      return p;
    }
    function mixColour(a, b, t) {
      if (a === b) return a;
      var A = rgba(a), B = rgba(b);
      return "rgba(" + [0, 1, 2].map(function (k) { return Math.round(A[k] + (B[k] - A[k]) * t); }).join(",") +
        "," + (A[3] + (B[3] - A[3]) * t) + ")";
    }
    function rgba(c) {
      if (c[0] === "#") return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16), 1];
      return c.replace(/[^\d.,]/g, "").split(",").map(Number);
    }
    function bulge(ctx) {                          // tidalBulge (sprite 79) on the frame in hand
      var f = frameNow(), e = ART.FRAMES[f - 1];
      if (f === 1) { ctx.save(); ctx.scale(0.888885 * 1.0625, 1); draw(ctx, SH[73]); ctx.restore(); }
      else if (e[1] < 0) draw(ctx, SH[e[0]]);
      else morph(ctx, e[0], e[1]);
    }

    S.onDraw(function () {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      // the stage's vignette (shape 93 under its two square masks)
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, 600, 550); ctx.clip();
      ctx.translate(300, 275); ctx.scale(1.000015, 0.916687);
      draw(ctx, SH[93]);
      ctx.restore();
      // mySim (tideAnim)
      ctx.save();
      ctx.transform(0.460556, 0, 0, 0.460907, 276.95, 275.5);
      ctx.save();                                  // earth
      ctx.transform(1.011032, 0, 0, 1.004257, 0.6, -1.05);
      ctx.save();                                  // myTide: turned with the Moon, then 131 % × 150 %
      ctx.translate(0, -0.1); ctx.rotate(tideRotation() * RAD); ctx.scale(1.3125, 1.5);
      bulge(ctx);
      ctx.restore();
      ctx.save();                                  // myEarth: turns 28 times as fast
      ctx.rotate(tideTime * 28 * RAD); ctx.scale(1.000305, 1.000305);
      draw(ctx, SH[80]);
      ctx.restore();
      if (withSun) {                               // myShadow, placed at 115/256 alpha
        ctx.save(); ctx.globalAlpha = 115 / 256;
        ctx.transform(0.995285, 0, 0, 0.995285, 0.5, 0.5); draw(ctx, SH[82]); ctx.restore();
      }
      ctx.restore();
      if (withSun) {                               // toSunArrow: the yellow arrow and "To Sun"
        ctx.save();
        ctx.transform(1.396225, 0, 0, 1.396225, 625.95, 20.55);
        ctx.save(); ctx.translate(-49.55 + 50, -16.05); draw(ctx, SH[65], { fill: "#ffcc00", stroke: "#ffcc00" }); ctx.restore();
        ctx.fillStyle = "#000000"; ctx.font = "bold 17px 'Trebuchet MS', Verdana, sans-serif";
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
        FlashText.fillStatic(ctx, I18N.t("td.toSun"), -51, -1.5 + 15.95);
        ctx.restore();
      }
      ctx.save();                                  // moonVectors, turned by tideTime; visMoon kept upright
      ctx.translate(-0.2, 0); ctx.rotate(tideTime * RAD);
      ctx.translate(507.55, -0.9); ctx.rotate(-tideTime * RAD); ctx.scale(0.964005, 0.972763);
      ctx.save(); ctx.translate(0.5, 0.5); draw(ctx, SH[68]); ctx.restore();
      if (withSun) {                               // its sunlit side, placed at 151/256 alpha
        ctx.save(); ctx.globalAlpha = 151 / 256;
        ctx.transform(-0.999664, -0.022659, 0.022659, -0.999664, 1.05, 0.55); draw(ctx, SH[70]); ctx.restore();
      }
      ctx.restore();
      ctx.restore();
      CHECKS.forEach(function (c) { checkBox(ctx, c); });
    });

    /* ---- the Flash MX check boxes (their labels are a device font in the SWF) ---- */
    var CHECK = new Path2D("M7.1 0.6Q7.1 0 6.5 0Q6.35 0 6.05 0.25L2.6 3.95L1 2.15L0.6 1.95Q0.05 1.95 0.05 2.5" +
      "L0 4.4L0.15 4.75L2.25 6.9L2.3 6.9L2.5 6.95L2.9 6.75L6.9 2.75L7.1 2.35Z");
    var CHECKS = [
      { x: 390, y: 437.6, key: "td.run", get: function () { return running; }, set: function (b) { setRunning(b); } },
      { x: 390, y: 462.6, key: "td.sun", get: function () { return withSun; }, set: function (b) { withSun = b; } },
      { x: 390, y: 487.6, key: "td.rot", get: function () { return earthEffects; }, set: function (b) { earthEffects = b; } }
    ];
    var press = null;
    function checkBox(ctx, c) {
      var down = press && press.c === c && press.inside;
      ctx.fillStyle = "#808080"; ctx.fillRect(c.x, c.y, 13, 13);
      ctx.fillStyle = "#d4d0d8"; ctx.fillRect(c.x + 1, c.y + 1, 11, 11);
      ctx.fillStyle = down ? "#cccccc" : "#ffffff"; ctx.fillRect(c.x + 2, c.y + 2, 9, 9);
      if (c.get()) { ctx.save(); ctx.translate(c.x + 2.9, c.y + 3.15); ctx.fillStyle = "#000000"; ctx.fill(CHECK); ctx.restore(); }
      ctx.font = "12px 'Noto Sans', Arial, Helvetica, sans-serif"; ctx.fillStyle = "#000000";
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      c.w = 16 + ctx.measureText(I18N.t(c.key)).width;
      ctx.fillText(I18N.t(c.key), c.x + 16, c.y + 11.5);
    }
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function hit(p) {
      for (var i = 0; i < CHECKS.length; i++) {
        var c = CHECKS[i];
        if (p.x >= c.x && p.x <= c.x + (c.w || 13) && p.y >= c.y - 1 && p.y <= c.y + 14) return c;
      }
      return null;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var c = hit(at(ev));
      if (!c) return;
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      press = { c: c, inside: true };
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var c = hit(at(ev));
      S.canvas.style.cursor = c ? "pointer" : "default";
      if (press && (c === press.c) !== press.inside) { press.inside = c === press.c; S.requestDraw(); }
    });
    S.canvas.addEventListener("pointerup", function () {
      var pr = press; press = null;
      if (pr && pr.inside) { pr.c.set(!pr.c.get()); syncSidebar(); }
      S.requestDraw();
    });
    S.canvas.addEventListener("pointercancel", function () { press = null; S.requestDraw(); });

    function setRunning(b) { running = b; if (b) loop.play(); else loop.pause(); S.requestDraw(); }

    /* ---- the sidebar, mirroring the check boxes ---- */
    var syncing = false;
    var runT = S.toggle({ labelKey: "td.run", value: false, on: function (b) { if (!syncing) setRunning(b); } });
    var sunT = S.toggle({ labelKey: "td.sun", value: false, on: function (b) { if (!syncing) { withSun = b; S.requestDraw(); } } });
    var rotT = S.toggle({ labelKey: "td.rot", value: false, on: function (b) { if (!syncing) { earthEffects = b; S.requestDraw(); } } });
    S.button({ labelKey: "td.reset", on: function () {
      setRunning(false); withSun = false; earthEffects = false; angle = 0; tideTime = 0;
      syncSidebar(); S.requestDraw();
    } });
    function syncSidebar() {
      syncing = true; runT.set(running); sunT.set(withSun); rotT.set(earthEffects); syncing = false;
    }
    S.requestDraw();
  }
});
