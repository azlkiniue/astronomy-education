/* Aliasing in Wagon Wheels -----------------------------------------------------
   Faithful rebuild of the ClassAction "wagonwheel.swf" (root timeline script,
   decompiled). A wagon wheel turns steadily in the desert. Above it, a grey
   "camera" box shows the same wheel only at the instants a frame is taken —
   exactly as the SWF does, flashing the wheel once every 1/(frame rate) seconds.

   Because the wheel has eight identical spokes, a frame can't tell a turn of θ
   from a turn of θ ± 45°. When the true turn between frames is a little less than
   45° the spokes seem to creep backward; at exactly 45° they freeze. That is
   aliasing — the same thing that makes wagon wheels spin backward in films, and
   the reason a sparsely sampled variable-star light curve can suggest the wrong
   period.                                                                       */
Sim.create({
  id: "wagonwheel",
  width: 700, height: 566,
  strings: {
    en: {
      "ww.cam": "Camera", "ww.fps": "Frame Rate (#/second)", "ww.period": "Rotation Period (s)",
      "ww.hold": "hold each frame until the next (like a film)",
      "ww.title1": "Aliasing in Wagon", "ww.title2": "Wheels",
      "ww.dragHint": "You can also drag the sliders drawn in the scene.",
      "ww.rTrue": "true turn per frame", "ww.rSeen": "apparent turn per frame",
      "ww.rLook": "the wheel seems to", "ww.rApp": "apparent period",
      "ww.fwd": "turn forward", "ww.back": "turn backward", "ww.still": "stand still", "ww.inf": "∞"
    },
    id: {
      "ww.cam": "Kamera", "ww.fps": "Laju Bingkai (#/detik)", "ww.period": "Periode Rotasi (s)",
      "ww.hold": "tahan tiap bingkai sampai berikutnya (seperti film)",
      "ww.title1": "Aliasing pada Roda", "ww.title2": "Gerobak",
      "ww.dragHint": "Anda juga dapat menyeret penggeser yang tergambar di adegan.",
      "ww.rTrue": "putaran nyata per bingkai", "ww.rSeen": "putaran tampak per bingkai",
      "ww.rLook": "roda tampak", "ww.rApp": "periode tampak",
      "ww.fwd": "berputar maju", "ww.back": "berputar mundur", "ww.still": "diam", "ww.inf": "∞"
    }
  },
  about: {
    en: "<p>A camera doesn't record motion continuously — it takes snapshots at a fixed <strong>frame rate</strong>, and your eye joins the dots. If something repeats faster than the frames can follow, the dots join up the wrong way. A wagon wheel with eight spokes looks the same every 45° of turning, so each frame can only pin down its angle to within 45°.</p>" +
        "<p>Between two frames the wheel turns 360° × (1/frame rate) ÷ period. Subtract whole multiples of 45° and what's left is what you <em>see</em>: a small positive remainder looks like slow forward motion, a remainder just short of 45° looks like slow <strong>backward</strong> motion, and exactly 45° makes the wheel appear frozen. This false, slower motion is called <strong>aliasing</strong>.</p>" +
        "<p>Astronomers meet the same trap when a variable star is observed only once a night: a star that really pulses every 0.9 days can masquerade as one with a period of ten days. The cure is the same as for the camera — sample faster than twice the frequency you are trying to catch.</p>",
    id: "<p>Kamera tidak merekam gerak secara terus-menerus — ia mengambil potret pada <strong>laju bingkai</strong> tetap, lalu mata Anda menyambung titik-titiknya. Jika sesuatu berulang lebih cepat daripada yang dapat diikuti bingkai, titik-titik itu tersambung dengan cara yang salah. Roda gerobak berjari-jari delapan tampak sama setiap berputar 45°, sehingga tiap bingkai hanya dapat memastikan sudutnya dalam rentang 45°.</p>" +
        "<p>Di antara dua bingkai roda berputar 360° × (1/laju bingkai) ÷ periode. Kurangi kelipatan utuh 45° dan sisanya adalah yang Anda <em>lihat</em>: sisa positif kecil tampak seperti gerak maju lambat, sisa sedikit di bawah 45° tampak seperti gerak <strong>mundur</strong> lambat, dan tepat 45° membuat roda tampak membeku. Gerak palsu yang lebih lambat ini disebut <strong>aliasing</strong>.</p>" +
        "<p>Astronom menghadapi jebakan yang sama saat bintang variabel hanya diamati sekali semalam: bintang yang sebenarnya berdenyut tiap 0,9 hari dapat menyamar sebagai bintang berperiode sepuluh hari. Obatnya sama seperti pada kamera — ambil sampel lebih cepat dari dua kali frekuensi yang ingin ditangkap.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180, TAU = Math.PI * 2;
    var K = 1.25, OX = -10, OY = -8;                 // SWF scene (10,8)–(569.5,460.5) → canvas
    var W1 = { x: 148.6, y: 365.7 }, W2 = { x: 148.6, y: 123.7 };   // wheel1 / wheel2 placements
    var BOX = { x: 35.4, y: 35.3, w: 232.6, h: 233.4 };
    var FLASH = 1 / 30;                               // one frame of the 30 fps SWF

    /* ---- state: the SWF opens at 3 frames/s and a 5 s rotation period ---- */
    var fps = 3, period = 5, hold = false;
    var theta = 0, sinceFrame = 0, frameTheta = 0, flash = 0;

    /* ================================ controls ================================ */
    S.group("ww.cam");
    var fpsCtl = S.slider({
      labelKey: "ww.fps", min: 0.1, max: 10, value: fps, step: 0.1,
      format: function (v) { return v.toFixed(1); },
      on: function (v) { fps = v; upd(); }
    });
    var perCtl = S.slider({
      labelKey: "ww.period", min: 1, max: 10, value: period, step: 0.1,
      format: function (v) { return v.toFixed(1); },
      on: function (v) { period = v; upd(); }
    });
    S.toggle({ labelKey: "ww.hold", value: hold, on: function (b) { hold = b; } });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ww.dragHint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outTrue = S.readout({ labelKey: "ww.rTrue" });
    var outSeen = S.readout({ labelKey: "ww.rSeen" });
    var outLook = S.readout({ labelKey: "ww.rLook" });
    var outApp = S.readout({ labelKey: "ww.rApp" });

    // onEnterFrame: the wheel turns 360°/period per second; a frame is taken every 1/fps s
    var loop = S.loop(function (dt) {
      theta += dt * 360 / period;
      sinceFrame += dt;
      flash = Math.max(0, flash - dt);
      if (sinceFrame > 1 / fps) {
        sinceFrame = 0;
        frameTheta = theta;
        flash = FLASH;
      }
    });

    function upd() {
      var d = 360 / (fps * period);                 // true turn between frames
      var a = ((d % 45) + 45) % 45;
      if (a > 22.5) a -= 45;                        // what the eye picks: the nearest spoke
      outTrue(d.toFixed(1) + "°");
      outSeen((a > 0 ? "+" : a < 0 ? "−" : "") + Math.abs(a).toFixed(1) + "°");
      var still = Math.abs(a) < 0.05;
      outLook(I18N.t(still ? "ww.still" : a > 0 ? "ww.fwd" : "ww.back"));
      outApp(still ? I18N.t("ww.inf") : (45 / Math.abs(a) / fps * 8).toFixed(1) + " s");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- the two sliders drawn in the scene can be dragged too ---- */
    var TRACKS = [
      { key: "ww.fps", x: 149.95, y: 231.05, min: 0.1, max: 10, ctl: fpsCtl, get: function () { return fps; } },
      { key: "ww.period", x: 341.15, y: 404.85, min: 1, max: 10, ctl: perCtl, get: function () { return period; } }
    ];
    var HALF = 99, dragTrack = null;
    function stageXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      var cx = (ev.clientX - r.left) * S.W / r.width, cy = (ev.clientY - r.top) * S.H / r.height;
      return { x: cx / K - OX, y: cy / K - OY };
    }
    function trackAt(p) {
      return TRACKS.find(function (tr) { return Math.abs(p.x - tr.x) <= HALF + 8 && Math.abs(p.y - tr.y) < 14; }) || null;
    }
    function setFromX(tr, x) {
      var f = Math.max(0, Math.min(1, (x - (tr.x - HALF)) / (2 * HALF)));
      var v = Math.round((tr.min + f * (tr.max - tr.min)) * 10) / 10;
      tr.ctl.set(v);
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var tr = trackAt(stageXY(ev));
      if (!tr) return;
      dragTrack = tr; S.canvas.setPointerCapture(ev.pointerId); setFromX(tr, stageXY(ev).x);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stageXY(ev);
      if (dragTrack) { setFromX(dragTrack, p.x); return; }
      S.canvas.style.cursor = trackAt(p) ? "pointer" : "default";
    });
    function endDrag() { dragTrack = null; }
    S.canvas.addEventListener("pointerup", endDrag);
    S.canvas.addEventListener("pointercancel", endDrag);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.save();
      ctx.scale(K, K); ctx.translate(OX, OY);
      ctx.beginPath(); ctx.rect(10, 8, 559.5, 452.5); ctx.clip();

      drawScene(ctx, t);
      drawWheel(ctx, W1.x, W1.y, theta);

      // the camera box: the wheel appears only when a frame is taken
      ctx.fillStyle = "#cccccc"; ctx.fillRect(BOX.x, BOX.y, BOX.w, BOX.h);
      if (hold || flash > 0) {
        ctx.save();
        ctx.beginPath(); ctx.rect(BOX.x, BOX.y, BOX.w, BOX.h); ctx.clip();
        drawWheel(ctx, W2.x, W2.y, frameTheta);
        ctx.restore();
      }
      ctx.lineWidth = 3.4; ctx.strokeStyle = "#000000";
      ctx.strokeRect(BOX.x, BOX.y, BOX.w, BOX.h);

      TRACKS.forEach(function (tr) { drawSlider(ctx, t(tr.key), tr); });
      ctx.restore();
    });

    function drawScene(ctx, t) {
      var sky = ctx.createLinearGradient(0, 12, 0, 250);
      sky.addColorStop(0, "#b0d5dd"); sky.addColorStop(1, "#eea338");
      ctx.fillStyle = sky; ctx.fillRect(10, 8, 560, 453);

      // the setting sun, behind the right-hand dune
      var sg = ctx.createRadialGradient(491, 356, 8, 491, 356, 62);
      sg.addColorStop(0, "#fff06a"); sg.addColorStop(0.75, "#f9d63e"); sg.addColorStop(1, "#f3c236");
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(491, 356, 62, 0, TAU); ctx.fill();

      ctx.lineWidth = 0.9; ctx.strokeStyle = "#6d5027"; ctx.fillStyle = "#c49634";
      // back dune, running down from behind the camera box to the cactus
      ctx.beginPath();
      ctx.moveTo(8, 300);
      ctx.bezierCurveTo(24, 290, 30, 262, 60, 262);
      ctx.lineTo(214, 271.7);
      ctx.bezierCurveTo(260, 274, 290, 276, 300, 281);
      ctx.bezierCurveTo(318, 292, 330, 320, 346, 343);
      ctx.bezierCurveTo(356, 356, 372, 360, 385, 362);
      ctx.lineTo(580, 380); ctx.lineTo(580, 470); ctx.lineTo(8, 470); ctx.closePath();
      ctx.fill(); ctx.stroke();

      drawCactus(ctx);

      // front dune: a low ridge in front of the cactus, cresting near the skull, over the sun
      ctx.fillStyle = "#c49634";
      ctx.beginPath();
      ctx.moveTo(300, 344);
      ctx.bezierCurveTo(318, 338, 330, 331, 345, 332);
      ctx.bezierCurveTo(372, 330, 392, 318, 408, 319);
      ctx.bezierCurveTo(440, 322, 468, 338, 500, 353.5);
      ctx.bezierCurveTo(530, 356, 555, 352, 580, 349);
      ctx.lineTo(580, 470); ctx.lineTo(300, 470); ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(300, 344);
      ctx.bezierCurveTo(318, 338, 330, 331, 345, 332);
      ctx.bezierCurveTo(372, 330, 392, 318, 408, 319);
      ctx.bezierCurveTo(440, 322, 468, 338, 500, 353.5);
      ctx.bezierCurveTo(530, 356, 555, 352, 580, 349);
      ctx.stroke();

      drawSkull(ctx, 375, 338);

      ctx.fillStyle = "#000000"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "bold 16px Arial, Helvetica, sans-serif";
      ctx.fillText(t("ww.title1"), 470, 26.6);
      ctx.fillText(t("ww.title2"), 470, 50.1);
    }

    function drawCactus(ctx) {
      var g = ctx.createLinearGradient(282, 0, 430, 0);
      g.addColorStop(0, "#15361c"); g.addColorStop(0.45, "#2f6d2b"); g.addColorStop(1, "#6a9a3a");
      ctx.fillStyle = g; ctx.strokeStyle = "#1e2a12"; ctx.lineWidth = 0.9;
      ctx.beginPath();
      // trunk, rounded top
      ctx.moveTo(333, 350);
      ctx.lineTo(333, 157);
      // left arm: elbow out to the left and up
      ctx.bezierCurveTo(333, 150, 322, 147, 306, 147);
      ctx.bezierCurveTo(290, 147, 282, 138, 282, 120);
      ctx.lineTo(282, 40);
      ctx.bezierCurveTo(282, 24, 305, 24, 305, 40);
      ctx.lineTo(305, 108);
      ctx.bezierCurveTo(305, 122, 318, 124, 333, 120);
      ctx.lineTo(333, 38);
      ctx.bezierCurveTo(333, 14, 368, 14, 368, 38);
      // right arm
      ctx.lineTo(368, 164);
      ctx.bezierCurveTo(382, 168, 393, 160, 393, 146);
      ctx.lineTo(393, 88);
      ctx.bezierCurveTo(393, 70, 429, 70, 429, 88);
      ctx.lineTo(429, 162);
      ctx.bezierCurveTo(429, 188, 400, 196, 376, 197);
      ctx.bezierCurveTo(369, 198, 368, 204, 368, 212);
      ctx.lineTo(368, 350);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // spines
      ctx.strokeStyle = "#1b1b12"; ctx.lineWidth = 0.7;
      [[355, 14, 358, 30], [360, 16, 356, 32], [282, 145, 296, 137], [285, 155, 293, 142],
       [306, 98, 318, 101], [306, 105, 316, 99], [410, 70, 414, 80], [420, 78, 430, 72], [428, 88, 420, 84],
       [355, 250, 363, 258], [352, 258, 353, 272], [357, 258, 366, 272]].forEach(function (s) {
        ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); ctx.stroke();
      });
    }

    function drawSkull(ctx, x, y) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = "#f2eed8"; ctx.strokeStyle = "#8a8266"; ctx.lineWidth = 0.7;
      // horns
      ctx.beginPath();
      ctx.moveTo(-8, -6); ctx.bezierCurveTo(-22, -6, -30, -12, -32, -22);
      ctx.bezierCurveTo(-26, -12, -16, -12, -6, -12); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(8, -10); ctx.bezierCurveTo(20, -14, 24, -26, 20, -40);
      ctx.bezierCurveTo(28, -28, 26, -12, 12, -4); ctx.closePath(); ctx.fill(); ctx.stroke();
      // head
      var g = ctx.createLinearGradient(-12, 0, 14, 0);
      g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#e3dfc6");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-12, -8); ctx.lineTo(10, -10); ctx.lineTo(16, 4); ctx.lineTo(9, 24);
      ctx.lineTo(4, 22); ctx.lineTo(1, 18); ctx.lineTo(-6, 12); ctx.lineTo(-14, 2); ctx.closePath();
      ctx.fill(); ctx.stroke();
      // eye sockets
      ctx.fillStyle = "#202020";
      [[-5, -1, 3.2, 4.4], [6, -2, 3.2, 4.4]].forEach(function (e) {
        var eg = ctx.createRadialGradient(e[0], e[1], 0.5, e[0], e[1], e[3]);
        eg.addColorStop(0, "#000000"); eg.addColorStop(1, "rgba(60,60,60,0.35)");
        ctx.fillStyle = eg; ctx.beginPath(); ctx.ellipse(e[0], e[1], e[2], e[3], -0.3, 0, TAU); ctx.fill();
      });
      ctx.restore();
    }

    // the wagon wheel: wooden rim with joints and bolts, eight tapered spokes, iron hub
    function drawWheel(ctx, x, y, rotDeg) {
      var R = 76, Ri = 63.6;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotDeg * D2R);                     // Flash _rotation: clockwise
      // spokes
      for (var i = 0; i < 8; i++) {
        ctx.save();
        ctx.rotate(i * Math.PI / 4);
        var sg = ctx.createLinearGradient(-3, 0, 3, 0);
        sg.addColorStop(0, "#4a2b1f"); sg.addColorStop(0.5, "#7a5040"); sg.addColorStop(1, "#4a2b1f");
        ctx.fillStyle = sg; ctx.strokeStyle = "#2e1a12"; ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-3.2, -12); ctx.quadraticCurveTo(-2.2, -40, -2.6, -Ri - 1);
        ctx.lineTo(2.6, -Ri - 1); ctx.quadraticCurveTo(2.2, -40, 3.2, -12); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      // rim
      var rg = ctx.createRadialGradient(0, 0, Ri, 0, 0, R);
      rg.addColorStop(0, "#4b2c20"); rg.addColorStop(0.45, "#7b5040"); rg.addColorStop(1, "#4a2a1e");
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.arc(0, 0, Ri, 0, TAU, true); ctx.fill();
      ctx.strokeStyle = "#2d1911"; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, Ri, 0, TAU); ctx.stroke();
      // felloe joints + bolts
      ctx.lineWidth = 0.8;
      for (var j = 0; j < 4; j++) {
        var a = j * Math.PI / 2 + Math.PI / 8;
        ctx.beginPath();
        ctx.moveTo(Ri * Math.cos(a), Ri * Math.sin(a)); ctx.lineTo(R * Math.cos(a + 0.03), R * Math.sin(a + 0.03));
        ctx.stroke();
        var b = j * Math.PI / 2 + Math.PI * 0.39, rb = (R + Ri) / 2;
        ctx.fillStyle = "#3a2218";
        ctx.beginPath(); ctx.arc(rb * Math.cos(b), rb * Math.sin(b), 2.2, 0, TAU); ctx.fill();
      }
      // hub
      var hg = ctx.createRadialGradient(0, 0, 3, 0, 0, 15.7);
      hg.addColorStop(0, "#2a1810"); hg.addColorStop(0.6, "#5c3a2c"); hg.addColorStop(1, "#3a2218");
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(0, 0, 15.7, 0, TAU); ctx.fill();
      ctx.strokeStyle = "#1f120c"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(0, 0, 9.3, 0, TAU); ctx.stroke();
      ctx.fillStyle = "#000000"; ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, TAU); ctx.fill();
      ctx.restore();
    }

    // SliderV3 look: bold title + value, a pale track, a grey pentagon thumb, min/max below
    function drawSlider(ctx, title, tr) {
      var v = tr.get(), f = (v - tr.min) / (tr.max - tr.min), kx = tr.x - HALF + f * 2 * HALF;
      ctx.fillStyle = "#000000"; ctx.textBaseline = "middle";
      ctx.font = "bold 12px Verdana, system-ui, sans-serif";
      ctx.textAlign = "left"; ctx.fillText(title, tr.x - 106, tr.y - 25);
      ctx.textAlign = "right"; ctx.fillText(v.toFixed(1), tr.x + 105, tr.y - 25);
      ctx.fillStyle = "#efefef"; ctx.strokeStyle = "#a8a8a8"; ctx.lineWidth = 0.8;
      ctx.fillRect(tr.x - HALF, tr.y - 2.5, 2 * HALF, 5); ctx.strokeRect(tr.x - HALF, tr.y - 2.5, 2 * HALF, 5);
      ctx.fillStyle = "#d6d6d6"; ctx.strokeStyle = "#8c8c8c";
      ctx.beginPath();
      ctx.moveTo(kx - 6, tr.y - 11); ctx.lineTo(kx + 6, tr.y - 11); ctx.lineTo(kx + 6, tr.y + 4);
      ctx.lineTo(kx, tr.y + 10); ctx.lineTo(kx - 6, tr.y + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#9a9a9a";
      [-5, -2, 1].forEach(function (dy) { ctx.beginPath(); ctx.moveTo(kx - 3, tr.y + dy); ctx.lineTo(kx + 3, tr.y + dy); ctx.stroke(); });
      ctx.fillStyle = "#000000"; ctx.font = "bold 9px Verdana, system-ui, sans-serif";
      ctx.textAlign = "left"; ctx.fillText(String(tr.min), tr.x - HALF - 1, tr.y + 22);
      ctx.textAlign = "right"; ctx.fillText(String(tr.max), tr.x + HALF + 1, tr.y + 22);
    }

    upd();
    loop.play();
  }
});
