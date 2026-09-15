/* Three Views Spectrum Demonstrator --------------------------------------------
   Faithful rebuild of the ClassAction "threeviewsspectra.swf" (setTelescopePosition
   and TelescopeClass, decompiled; the three spectra are the SWF's own gradient
   fills, stop for stop). A telescope feeds a spectrometer. Drag the telescope
   along its track: a pale ghost follows your pointer, and whenever it comes
   within 40 px of one of three viewing spots the telescope snaps there —

     • looking straight at the hot lightbulb        → a continuous spectrum;
     • looking at the cold, thin gas cloud alone    → an emission spectrum;
     • looking at the bulb THROUGH the cloud        → an absorption spectrum.

   What the spectrometer shows follows the SWF's rule: how squarely the telescope
   points at each object, within the object's angular size, sets its contribution
   (Kirchhoff's three laws of spectroscopy).                                     */
Sim.create({
  id: "threeviewsspectra",
  width: 700, height: 500,
  strings: {
    en: {
      "tv.aim": "Telescope", "tv.view": "point the telescope at",
      "tv.through": "the bulb, through the cloud", "tv.cloud": "the gas cloud", "tv.bulb": "the lightbulb",
      "tv.title": "SPECTROMETER",
      "tv.text": "Drag the telescope around to see how the three main types of spectra (continuous, absorption, and emission) are obtained from a cold, thin gas cloud and an incandescent lightbulb in space.",
      "tv.rType": "spectrum", "tv.cont": "continuous", "tv.emis": "emission", "tv.abs": "absorption", "tv.none": "nothing in view",
      "tv.blue": "blue", "tv.red": "red"
    },
    id: {
      "tv.aim": "Teleskop", "tv.view": "arahkan teleskop ke",
      "tv.through": "bola lampu, menembus awan", "tv.cloud": "awan gas", "tv.bulb": "bola lampu",
      "tv.title": "SPEKTROMETER",
      "tv.text": "Seret teleskop untuk melihat bagaimana tiga jenis utama spektrum (kontinu, serapan, dan emisi) diperoleh dari awan gas dingin yang tipis dan bola lampu pijar di angkasa.",
      "tv.rType": "spektrum", "tv.cont": "kontinu", "tv.emis": "emisi", "tv.abs": "serapan", "tv.none": "tak ada yang terlihat",
      "tv.blue": "biru", "tv.red": "merah"
    }
  },
  about: {
    en: "<p>In the 1850s Gustav Kirchhoff summed up how spectra form in three rules, and this scene acts them out.</p>" +
        "<ul><li>A hot, dense glowing object — the filament of a lightbulb, or the deep interior of a star — gives a <strong>continuous spectrum</strong>: every colour, with no gaps.</li>" +
        "<li>A hot, thin gas seen against a dark background gives an <strong>emission spectrum</strong>: bright lines only, at wavelengths set by its atoms.</li>" +
        "<li>A cooler, thin gas seen <em>in front of</em> a continuous source gives an <strong>absorption spectrum</strong>: the rainbow with dark lines cut out — at exactly the same wavelengths where that gas would emit.</li></ul>" +
        "<p>Which spectrum you record depends as much on where you look from as on what is there. Stars show absorption spectra because their cooler outer layers sit in front of the hot interior; a glowing nebula viewed off to the side shows emission lines; and the same cloud seen against a star shows those lines dark.</p>",
    id: "<p>Pada 1850-an Gustav Kirchhoff merangkum pembentukan spektrum dalam tiga aturan, dan adegan ini memeragakannya.</p>" +
        "<ul><li>Benda panas dan rapat yang berpijar — filamen bola lampu, atau bagian dalam bintang — menghasilkan <strong>spektrum kontinu</strong>: semua warna, tanpa celah.</li>" +
        "<li>Gas tipis yang panas dilihat dengan latar gelap menghasilkan <strong>spektrum emisi</strong>: hanya garis-garis terang, pada panjang gelombang yang ditentukan atom-atomnya.</li>" +
        "<li>Gas tipis yang lebih dingin dilihat <em>di depan</em> sumber kontinu menghasilkan <strong>spektrum serapan</strong>: pelangi dengan garis-garis gelap — tepat pada panjang gelombang tempat gas itu akan memancar.</li></ul>" +
        "<p>Spektrum yang Anda rekam bergantung pada dari mana Anda melihat, sama besarnya dengan apa yang ada di sana. Bintang menunjukkan spektrum serapan karena lapisan luarnya yang lebih dingin berada di depan bagian dalam yang panas; nebula berpijar yang dilihat dari samping menunjukkan garis emisi; dan awan yang sama dilihat berlatar bintang menampilkan garis-garis itu gelap.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = Math.PI * 2;
    var G = { x: 135.7, y: 448.85 };                 // the scene sprite's placement on the stage
    /* ---- data from the SWF ---- */
    var START = { x: 69, y: 7 };
    var PATH = [{ cx: 47.2, cy: -38.6, ax: 54, ay: -79.4 }, { cx: 63.4, cy: -135.8, ax: 101.9, ay: -175.8 },
                { cx: 153, cy: -228.9, ax: 232, ay: -237.4 }, { cx: 279.4, cy: -242.5, ax: 334, ay: -214.2 },
                { cx: 358.6, cy: -201.3, ax: 377.9, ay: -213.3 }, { cx: 428.7, cy: -244.9, ax: 494, ay: -208 }];
    var SNAPS = [
      { key: "through", x: 53.136, y: -45.992, rot: -6.19884 },
      { key: "cloud", x: 225.725, y: -236.649, rot: 82.478 },
      { key: "bulb", x: 411.897, y: -226.51, rot: 80.0958 }
    ];
    var CLOUD = { x: 246, y: -60, r: 58 }, BULB = { x: 438, y: -90, r: 36 };
    // the spectrometer's three gradient fills (ratio 0–255 across the strip)
    var SPECTRA = {
      cont: [[1, "#000000"], [32, "#8700c7"], [66, "#0000ff"], [95, "#00fff0"], [116, "#00fc00"], [152, "#f1ff43"], [195, "#ff0000"], [255, "#000000"]],
      abs: [[1, "#000000"], [21, "#7500ad"], [24, "#000000"], [29, "#8700c7"], [34, "#8700c7"], [38, "#000000"], [42, "#7b00cc"],
            [62, "#0f00f9"], [64, "#000000"], [69, "#0000ff"], [89, "#00fff0"], [94, "#000000"], [98, "#00ffd8"], [116, "#00fc00"],
            [152, "#f1ff43"], [196, "#ff0000"], [200, "#000000"], [204, "#ee0000"], [255, "#000000"]],
      emis: [[19, "#000000"], [22, "#8700c7"], [27, "#000000"], [34, "#000000"], [37, "#8700c7"], [41, "#000000"], [59, "#000000"],
             [64, "#0000ff"], [69, "#000000"], [90, "#000000"], [95, "#00fff0"], [97, "#000000"], [195, "#000000"], [199, "#ff0000"], [202, "#000000"]]
    };
    var STRIP = { x: 45.85, y: 66.65, w: 542.1 * 0.6, h: 81.7 * 0.6 };

    /* ---- state: the SWF calls setTelescopePosition(226, −237) → the cloud view ---- */
    var tel = { x: 0, y: 0, rot: 0 }, ghost = null, drag = false;
    var inten = { c: 0, e: 0, a: 0 }, lock = false;

    S.group("tv.aim");
    var viewSel = S.select({
      labelKey: "tv.view", value: "cloud",
      options: SNAPS.map(function (s) { return { v: s.key, labelKey: "tv." + s.key }; }),
      on: function (v) { if (lock) return; var s = SNAPS.filter(function (q) { return q.key === v; })[0]; snapTo(s); }
    });
    var outType = S.readout({ labelKey: "tv.rType" });

    function bez(p0, seg, t) {
      var k0 = (1 - t) * (1 - t), k1 = 2 * t * (1 - t), k2 = t * t;
      return { x: k0 * p0.x + k1 * seg.cx + k2 * seg.ax, y: k0 * p0.y + k1 * seg.cy + k2 * seg.ay };
    }
    // the nearest point of the track to (tx, ty), with the telescope set perpendicular to it
    function nearestOnPath(tx, ty) {
      var n = 50, best = null, p0 = START;
      PATH.forEach(function (seg) {
        for (var j = 0; j <= n; j++) {
          var t = j / n, q = bez(p0, seg, t), d2 = (tx - q.x) * (tx - q.x) + (ty - q.y) * (ty - q.y);
          if (!best || d2 < best.d2) {
            var a = bez(p0, seg, t + 1 / n), b = bez(p0, seg, t - 1 / n);
            best = { x: q.x, y: q.y, d2: d2, rot: 90 + R2D * Math.atan2(a.y - b.y, a.x - b.x) };
          }
        }
        p0 = { x: seg.ax, y: seg.ay };
      });
      return best;
    }
    // how squarely the telescope looks at an object, within its angular radius (×3, clipped to 0–1)
    function seen(o, p) {
      var x = o.x - p.x, y = o.y - p.y, d = Math.hypot(x, y);
      var width = R2D * Math.asin(Math.min(1, o.r / d));
      var pointing = Math.abs(p.rot - R2D * Math.atan2(y, x));
      return Math.max(0, Math.min(1, 3 * (1 - pointing / width)));
    }
    function snapTo(s) {
      tel = { x: s.x, y: s.y, rot: s.rot };
      var mc = seen(CLOUD, tel), mb = seen(BULB, tel);
      if (mb > 0 && mc === 0) inten = { c: mb, e: 0, a: 0 };
      else if (mc > 0 && mb === 0) inten = { c: 0, e: mc, a: 0 };
      else if (mb > 0 && mc > 0) inten = mb === 1 ? { c: 0, e: 0, a: 1 } : { c: 0, e: 1 - mb, a: mb };
      else inten = { c: 0, e: 0, a: 0 };
      lock = true; viewSel.set(s.key); lock = false;
      upd();
    }
    function setTelescopePosition(tx, ty) {
      var best = nearestOnPath(tx, ty);
      ghost = best;
      for (var i = 0; i < SNAPS.length; i++) {
        var s = SNAPS[i];
        if ((best.x - s.x) * (best.x - s.x) + (best.y - s.y) * (best.y - s.y) < 40 * 40) { snapTo(s); return; }
      }
      S.requestDraw();
    }
    function upd() {
      var k = inten.a > 0 ? "tv.abs" : inten.e > 0 ? "tv.emis" : inten.c > 0 ? "tv.cont" : "tv.none";
      outType(I18N.t(k));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- dragging (TelescopeClass.onPress / onMouseMoveFunc) ---- */
    function sceneXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width - G.x, y: (ev.clientY - r.top) * S.H / r.height - G.y };
    }
    function onTelescope(p) {
      var dx = p.x - tel.x, dy = p.y - tel.y, c = Math.cos(-tel.rot * D2R), s = Math.sin(-tel.rot * D2R);
      var lx = dx * c - dy * s, ly = dx * s + dy * c;
      return lx > -56 && lx < 54 && ly > -30 && ly < 20;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = sceneXY(ev);
      if (!onTelescope(p)) return;
      drag = true; ghost = { x: tel.x, y: tel.y, rot: tel.rot };
      S.canvas.setPointerCapture(ev.pointerId); S.canvas.style.cursor = "grabbing";
      S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = sceneXY(ev);
      if (!drag) { S.canvas.style.cursor = onTelescope(p) ? "grab" : "default"; return; }
      setTelescopePosition(p.x, p.y);
    });
    function endDrag() { drag = false; ghost = null; S.canvas.style.cursor = "default"; S.requestDraw(); }
    S.canvas.addEventListener("pointerup", endDrag);
    S.canvas.addEventListener("pointercancel", endDrag);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);
      drawSpectrometer(ctx, t);
      ctx.fillStyle = "#ffffff"; ctx.font = "13px Verdana, system-ui, sans-serif";
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      wrap(ctx, t("tv.text"), 429.7, 29, 250, 19.5);

      ctx.save();
      ctx.translate(G.x, G.y);
      drawCloud(ctx);
      drawBulb(ctx);
      drawTelescope(ctx, tel, 1);
      if (ghost) drawTelescope(ctx, ghost, 0.3);
      ctx.restore();
    });

    function drawSpectrometer(ctx, t) {
      var g = ctx.createLinearGradient(0, 11, 0, 154);
      g.addColorStop(0, "#b9bcbd"); g.addColorStop(1, "#8e9192");
      ctx.fillStyle = g; roundRect(ctx, 10.5, 11.1, 390.2, 142.6, 9); ctx.fill();
      ctx.strokeStyle = "#dfe2e3"; ctx.lineWidth = 1.2; ctx.stroke();
      [[27, 28], [384, 28], [27, 137], [384, 137]].forEach(function (c) { screw(ctx, c[0], c[1], 10); });
      // the red name plate
      var rg = ctx.createLinearGradient(0, 18, 0, 53);
      rg.addColorStop(0, "#c9564f"); rg.addColorStop(1, "#8f2a25");
      ctx.fillStyle = rg; roundRect(ctx, 90, 18.5, 225, 34.5, 5); ctx.fill();
      ctx.strokeStyle = "#5f1612"; ctx.lineWidth = 1; ctx.stroke();
      [[96, 24], [309, 24], [96, 47.5], [309, 47.5]].forEach(function (c) { screw(ctx, c[0], c[1], 2.3); });
      ctx.fillStyle = "#f3c7c3"; ctx.font = "22px Verdana, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("tv.title"), 202.5, 36.5);
      // the spectrum window: the three spectra stacked with the SWF's alphas
      ctx.fillStyle = "#000000"; ctx.fillRect(STRIP.x - 2.4, STRIP.y - 2.4, STRIP.w + 4.8, STRIP.h + 4.8);
      [["abs", inten.a], ["cont", inten.c], ["emis", inten.e]].forEach(function (s) {
        if (s[1] <= 0) return;
        ctx.globalAlpha = s[1];
        ctx.fillStyle = spectrumGradient(ctx, SPECTRA[s[0]]);
        ctx.fillRect(STRIP.x, STRIP.y, STRIP.w, STRIP.h);
      });
      ctx.globalAlpha = 1;
    }
    function spectrumGradient(ctx, stops) {
      var g = ctx.createLinearGradient(STRIP.x, 0, STRIP.x + STRIP.w, 0);
      stops.forEach(function (s) { g.addColorStop(s[0] / 255, s[1]); });
      return g;
    }
    function screw(ctx, x, y, r) {
      var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      g.addColorStop(0, "#5c5f60"); g.addColorStop(1, "#1e2021");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      if (r > 4) {
        ctx.strokeStyle = "#0e0f10"; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(x - r * 0.6, y - r * 0.2); ctx.lineTo(x + r * 0.6, y + r * 0.2); ctx.stroke();
      }
    }

    // the cold, thin gas cloud: a lumpy blob in dusty teal and grey
    function drawCloud(ctx) {
      var cx = CLOUD.x - 4, cy = CLOUD.y + 3;
      var g = ctx.createLinearGradient(cx - 60, 0, cx + 60, 0);
      g.addColorStop(0, "#7f9894"); g.addColorStop(0.3, "#b8c9c2"); g.addColorStop(0.55, "#7d8a7f");
      g.addColorStop(0.78, "#a9bab4"); g.addColorStop(1, "#5f716e");
      ctx.fillStyle = g;
      // a smooth lumpy outline: quadratic curves through the midpoints of a wobbly ring
      var pts = [];
      for (var i = 0; i < 24; i++) {
        var a = i / 24 * TAU, rr = 55 + 7 * Math.sin(3 * a + 0.6) + 5 * Math.sin(7 * a + 1.3) + 3 * Math.cos(11 * a);
        pts.push({ x: cx + rr * Math.cos(a), y: cy + rr * 1.02 * Math.sin(a) });
      }
      ctx.beginPath();
      pts.forEach(function (q, i) {
        var nx = pts[(i + 1) % pts.length], mx = (q.x + nx.x) / 2, my = (q.y + nx.y) / 2;
        if (i === 0) ctx.moveTo((pts[pts.length - 1].x + q.x) / 2, (pts[pts.length - 1].y + q.y) / 2);
        ctx.quadraticCurveTo(q.x, q.y, mx, my);
      });
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(60,75,72,0.45)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.strokeStyle = "rgba(230,240,232,0.55)"; ctx.lineWidth = 6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx - 10, cy + 20); ctx.bezierCurveTo(cx + 20, cy + 26, cx + 30, cy + 8, cx + 24, cy - 10); ctx.stroke();
      ctx.strokeStyle = "rgba(90,105,100,0.5)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 30, cy - 34); ctx.bezierCurveTo(cx - 6, cy - 44, cx + 14, cy - 30, cx + 6, cy - 8); ctx.stroke();
    }

    // the incandescent lightbulb
    function drawBulb(ctx) {
      var bx = BULB.x, by = BULB.y;
      var g = ctx.createRadialGradient(bx - 8, by - 12, 3, bx, by, 38);
      g.addColorStop(0, "#fffdf0"); g.addColorStop(0.55, "#fff4b0"); g.addColorStop(1, "#f0d36a");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(bx - 15, by + 44);
      ctx.bezierCurveTo(bx - 17, by + 30, bx - 38, by + 20, bx - 38, by - 6);
      ctx.bezierCurveTo(bx - 38, by - 30, bx - 20, by - 44, bx, by - 44);
      ctx.bezierCurveTo(bx + 20, by - 44, bx + 38, by - 30, bx + 38, by - 6);
      ctx.bezierCurveTo(bx + 38, by + 20, bx + 17, by + 30, bx + 15, by + 44);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(160,130,40,0.6)"; ctx.lineWidth = 1; ctx.stroke();
      // filament and its supports
      ctx.strokeStyle = "#3a3320"; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.moveTo(bx - 6, by + 44); ctx.lineTo(bx - 13, by - 6); ctx.moveTo(bx + 6, by + 44); ctx.lineTo(bx + 13, by - 6); ctx.stroke();
      ctx.strokeStyle = "#e08a1c"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx - 13, by - 6);
      for (var i = 1; i <= 8; i++) ctx.lineTo(bx - 13 + i * 26 / 8, by - 6 + (i % 2 ? -3 : 1));
      ctx.stroke();
      // screw base
      for (var k = 0; k < 4; k++) {
        var yy = by + 45 + k * 7;
        var sg = ctx.createLinearGradient(bx - 15, 0, bx + 15, 0);
        sg.addColorStop(0, "#7d7f80"); sg.addColorStop(0.5, "#e6e8e9"); sg.addColorStop(1, "#6f7172");
        ctx.fillStyle = sg; roundRect(ctx, bx - 15 + k * 0.6, yy, 30 - k * 1.2, 6, 3); ctx.fill();
      }
      ctx.fillStyle = "#5a5c5d";
      ctx.beginPath(); ctx.moveTo(bx - 11, by + 73); ctx.lineTo(bx + 11, by + 73); ctx.lineTo(bx, by + 82); ctx.closePath(); ctx.fill();
    }

    // the telescope, drawn along its own +x axis (the objective end points where it looks)
    function drawTelescope(ctx, p, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y); ctx.rotate(p.rot * D2R);
      var tg = ctx.createLinearGradient(0, -13, 0, 13);
      tg.addColorStop(0, "#7a7d7f"); tg.addColorStop(0.35, "#f2f4f5"); tg.addColorStop(0.7, "#a9adaf"); tg.addColorStop(1, "#5f6264");
      // eyepiece
      ctx.fillStyle = tg; ctx.fillRect(-49, -7, 12, 14);
      // main tube + objective cap
      ctx.fillRect(-38, -12.5, 82, 25);
      ctx.fillStyle = "#2c2e30"; roundRect(ctx, 42, -13.5, 6, 27, 2.5); ctx.fill();
      // leather band
      var bg = ctx.createLinearGradient(0, -14.5, 0, 14.5);
      bg.addColorStop(0, "#5a3a22"); bg.addColorStop(0.4, "#9a6a44"); bg.addColorStop(1, "#4a2e1a");
      ctx.fillStyle = bg; ctx.fillRect(-12, -14.5, 11, 29);
      // finder knob
      ctx.fillStyle = "#6c6f71"; ctx.fillRect(-33, -21, 3, 8);
      ctx.fillStyle = "#3d3f41"; ctx.fillRect(-35.5, -26, 8, 5);
      ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 0.8; ctx.strokeRect(-38, -12.5, 82, 25);
      ctx.restore();
    }

    function wrap(ctx, text, x, y, maxw, lh) {
      var words = text.split(" "), line = "", n = 0;
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(test).width > maxw && line) { ctx.fillText(line, x, y + (n++) * lh); line = words[i]; }
        else line = test;
      }
      ctx.fillText(line, x, y + n * lh);
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    setTelescopePosition(226, -237);
    ghost = null;
  }
});
