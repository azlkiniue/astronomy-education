/* Declination Ranges Simulator -------------------------------------------------
   Faithful rebuild of the ClassAction "latsim.swf" (logic from the SWF's own
   ActionScript, latClass.calcRanges). The celestial sphere is drawn edge-on,
   cut along the meridian: declination is marked round the rim (0° at the
   celestial equator on either side, +90° at the NCP, −90° at the SCP), and a
   coloured band shows which declinations are

       circumpolar (orange) · rise and set (blue) · never rise (green)

   for an observer at the chosen latitude. The observer stands on a tiny Earth at
   the centre with their horizon drawn as a line across the sphere — drag it (or
   the latitude slider) to tilt it. "Enlarge Earth" swells the globe so you can
   see the horizon really is tangent to Earth's surface, and fades the scale, as
   in the original. The panel on the right spells out the three ranges.         */
Sim.create({
  id: "latsim",
  width: 760, height: 518,
  strings: {
    en: {
      "ls.obs": "Observer", "ls.lat": "Latitude", "ls.enlarge": "Enlarge Earth",
      "ls.drag": "Drag the observer's horizon line to tilt it — the ranges follow.",
      "ls.title": "Declination Ranges", "ls.cir": "Circumpolar:", "ls.rise": "Rise and Set:", "ls.nev": "Never Rise",
      "ls.to": " to ", "ls.none": "None",
      "lb.NCP": "NCP", "lb.SCP": "SCP", "lb.CE": "CE", "lb.NP": "NP", "lb.SP": "SP", "lb.N": " N", "lb.S": " S"
    },
    id: {
      "ls.obs": "Pengamat", "ls.lat": "Lintang", "ls.enlarge": "Perbesar Bumi",
      "ls.drag": "Seret garis horizon pengamat untuk memiringkannya — rentangnya ikut berubah.",
      "ls.title": "Rentang Deklinasi", "ls.cir": "Sirkumpolar:", "ls.rise": "Terbit dan Terbenam:", "ls.nev": "Tak Pernah Terbit",
      "ls.to": " hingga ", "ls.none": "Tidak ada",
      "lb.NCP": "KLU", "lb.SCP": "KLS", "lb.CE": "EL", "lb.NP": "KU", "lb.SP": "KS", "lb.N": " LU", "lb.S": " LS"
    }
  },
  about: {
    en: "<p>Your horizon cuts the celestial sphere in half, and as the sky turns every star is carried round a circle of constant <strong>declination</strong>. Whether that circle crosses your horizon decides the star's fate — and the only thing that tilts the horizon against those circles is your <strong>latitude</strong>.</p>" +
        "<p>At latitude φ the celestial pole stands φ above your horizon, so every star within φ of the pole never dips below it: those with declination above <strong>90° − φ</strong> are <strong>circumpolar</strong>. By the same token stars within φ of the <em>other</em> pole — declination below −(90° − φ) — <strong>never rise</strong>. Everything in between rises and sets.</p>" +
        "<p>Slide to the equator and the horizon passes through both poles: nothing is circumpolar, and every star rises and sets. Slide to a pole and the horizon lies along the celestial equator: half the sky is always up, the other half never is. Switch on <em>Enlarge Earth</em> to see why the observer's horizon, tangent to Earth's surface, can be drawn straight through the centre — the celestial sphere is so vast that Earth's size doesn't matter.</p>",
    id: "<p>Horizon Anda membelah bola langit menjadi dua, dan saat langit berputar setiap bintang terbawa mengelilingi lingkaran berdeklinasi tetap. Apakah lingkaran itu memotong horizon menentukan nasib bintang — dan satu-satunya yang memiringkan horizon terhadap lingkaran-lingkaran itu adalah <strong>lintang</strong> Anda.</p>" +
        "<p>Di lintang φ, kutub langit berada φ di atas horizon, sehingga setiap bintang dalam jarak φ dari kutub tak pernah turun di bawahnya: bintang berdeklinasi di atas <strong>90° − φ</strong> bersifat <strong>sirkumpolar</strong>. Dengan cara yang sama, bintang dalam jarak φ dari kutub <em>lainnya</em> — deklinasi di bawah −(90° − φ) — <strong>tak pernah terbit</strong>. Semua di antaranya terbit dan terbenam.</p>" +
        "<p>Geser ke ekuator dan horizon melewati kedua kutub: tak ada yang sirkumpolar, dan setiap bintang terbit serta terbenam. Geser ke kutub dan horizon berimpit dengan ekuator langit: separuh langit selalu di atas, separuh lainnya tak pernah muncul. Nyalakan <em>Perbesar Bumi</em> untuk melihat mengapa horizon pengamat, yang menyinggung permukaan Bumi, boleh digambar lurus melewati pusat — bola langit begitu luas sehingga ukuran Bumi tak berarti.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180, TAU = Math.PI * 2;
    var K = S.W / 660;                               // SWF stage (660×450) → canvas
    var C = {
      bg: "#262626", panel: "#333333",
      cir: "#ff9800", rise: "#33cbff", nev: "#33cb66", title: "#ffffcb", horizon: "#4e78cf"
    };
    var CX = 225, CY = 225, RS = 165;                // the sphere
    var BAND0 = 165.5, BAND1 = 178;                  // the coloured declination band

    /* ---- state: the SWF opens at 41° N with a small Earth ---- */
    var lat = 41, enlarge = false;

    S.group("ls.obs");
    var latCtl = S.slider({
      labelKey: "ls.lat", min: -90, max: 90, value: lat, step: 0.1,
      format: function (v) { return latStr(v); },
      on: function (v) { lat = Math.round(v * 10) / 10; S.requestDraw(); }
    });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ls.drag");
    latCtl.input.parentNode.parentNode.insertBefore(hint, latCtl.input.parentNode.nextSibling);
    S.toggle({ labelKey: "ls.enlarge", value: enlarge, on: function (b) { enlarge = b; } });

    function latStr(v) {
      var r = Math.round(v * 10) / 10;
      return Math.abs(r) + "°" + (r > 0 ? I18N.t("lb.N") : r < 0 ? I18N.t("lb.S") : "");
    }

    /* ---- latClass.calcRanges(), ported line for line (numbers → strings) ---- */
    function ranges() {
      var L = Math.round(lat * 10) / 10, a = Math.round(10 * (90 - Math.abs(L))) / 10;
      var r3 = a, cirEndN = 90, r2 = a, nevStartN = Math.round(10 * -(90 - Math.abs(L))) / 10;
      var riseEndN = nevStartN, nevEndN = -90, tmp;
      if (L < 0) { tmp = r3; r3 = nevStartN; nevStartN = tmp; tmp = cirEndN; cirEndN = nevEndN; nevEndN = tmp; }
      var cirStart = r3 !== 0 ? "+" + a + "°" : "0°";
      var cirEnd = "+90°";
      var riseStart = cirStart;
      var nevStart = nevStartN !== 0 ? "−" + a + "°" : "0°";
      var riseEnd = nevStart, nevEnd = "−90°";
      if (L < 0) { tmp = cirStart; cirStart = nevStart; nevStart = tmp; tmp = cirEnd; cirEnd = nevEnd; nevEnd = tmp; }
      var to = I18N.t("ls.to"), none = I18N.t("ls.none");
      return {
        cir: r3 === cirEndN ? none : cirStart + to + cirEnd,
        rise: r2 === riseEndN ? none : riseStart + to + riseEnd,
        nev: nevStartN === nevEndN ? none : nevStart + to + nevEnd
      };
    }

    /* ---- where the observer stands (pers_tan), and which way is up ---- */
    function feet() {
      if (!enlarge) return { x: CX, y: CY };
      return { x: CX + 25 * Math.cos(lat * D2R), y: CY - 25 * Math.sin(lat * D2R) };
    }

    /* ---- drag the horizon line: the mouse direction becomes the line's direction ---- */
    var dragging = false;
    function stageXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width / K, y: (ev.clientY - r.top) * S.H / r.height / K };
    }
    function onHandle(p) {
      var f = feet(), h = [Math.sin(lat * D2R), Math.cos(lat * D2R)], z = [Math.cos(lat * D2R), -Math.sin(lat * D2R)];
      var dx = p.x - f.x, dy = p.y - f.y;
      var along = dx * h[0] + dy * h[1], across = dx * z[0] + dy * z[1];
      if (Math.abs(along) <= 196 && Math.abs(across) < 9) return true;        // the horizon line
      return across > -4 && across < 56 && Math.abs(along) < 12;              // the observer
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      if (!onHandle(stageXY(ev))) return;
      dragging = true; S.canvas.setPointerCapture(ev.pointerId); S.canvas.style.cursor = "grabbing";
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stageXY(ev);
      if (!dragging) { S.canvas.style.cursor = onHandle(p) ? "grab" : "default"; return; }
      var f = feet(), x = p.x - f.x, y = p.y - f.y;
      if (Math.hypot(x, y) < 6) return;
      var r1 = -Math.atan2(y, x) / D2R - 90;          // exactly the SWF's onMouseMove
      if (r1 < -90) r1 += 180;
      lat = Math.round(r1 * 10) / 10;
      latCtl.input.value = lat;
      S.refreshers.forEach(function (fn) { fn(); });
    });
    function endDrag() { dragging = false; S.canvas.style.cursor = "default"; }
    S.canvas.addEventListener("pointerup", endDrag);
    S.canvas.addEventListener("pointercancel", endDrag);

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, S.W, S.H);
      ctx.save();
      ctx.scale(K, K);
      bevelPanel(ctx, 4, 2, 442, 446, 8);
      bevelPanel(ctx, 452, 2, 204, 446, 8);

      drawSphere(ctx);
      drawGrid(ctx);
      drawBands(ctx);

      ctx.font = "bold 11px Verdana, system-ui, sans-serif"; ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("lb.CE"), CX - 150, CY); ctx.fillText(t("lb.CE"), CX + 150, CY);
      ctx.fillText(t("lb.NCP"), CX, CY - 150); ctx.fillText(t("lb.SCP"), CX, CY + 152);

      drawEarthAndObserver(ctx, t);
      drawPanel(ctx, t);
      ctx.restore();
    });

    function drawSphere(ctx) {
      // lavender sphere, lit from the lower right (sampled from the SWF's gradient)
      var g = ctx.createRadialGradient(CX + 44, CY + 18, 0, CX + 10, CY + 4, RS + 12);
      g.addColorStop(0, "#e4e4e6"); g.addColorStop(0.45, "#cfcfdb"); g.addColorStop(0.8, "#b0b0d2");
      g.addColorStop(1, "#9090c6");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(CX, CY, RS, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(190,190,236,0.9)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(CX, CY, RS - 0.8, 0, TAU); ctx.stroke();
    }

    // the scale ("myGrid"): long ticks every 10°, short every 5°, labels every 20° and at the poles
    function drawGrid(ctx) {
      ctx.save();
      ctx.globalAlpha = enlarge ? 0.5 : 1;
      ctx.strokeStyle = "#ffffff"; ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 1.3;
      for (var d = -90; d <= 90; d += 5) {
        var long = d % 10 === 0, r1 = long ? 187 : 180.5;
        [Math.PI + d * D2R, -d * D2R].forEach(function (phi, side) {
          if (side === 1 && Math.abs(d) === 90) return;          // the poles are shared
          ctx.beginPath();
          ctx.moveTo(CX + 166 * Math.cos(phi), CY + 166 * Math.sin(phi));
          ctx.lineTo(CX + r1 * Math.cos(phi), CY + r1 * Math.sin(phi));
          ctx.stroke();
        });
      }
      ctx.font = "bold 10px Verdana, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      [-90, -80, -60, -40, -20, 0, 20, 40, 60, 80, 90].forEach(function (d) {
        var txt = (d > 0 ? "+" : d < 0 ? "−" : "") + Math.abs(d) + "°";
        [Math.PI + d * D2R, -d * D2R].forEach(function (phi, side) {
          if (side === 1 && Math.abs(d) === 90) return;
          ctx.fillText(txt, CX + 201 * Math.cos(phi), CY + 201 * Math.sin(phi));
        });
      });
      ctx.restore();
    }

    // the coloured band: which declinations are circumpolar / rise & set / never rise
    function drawBands(ctx) {
      var a = 90 - Math.abs(lat);
      var top = lat >= 0 ? C.cir : C.nev, bottom = lat >= 0 ? C.nev : C.cir;
      band(ctx, a, 90, top);
      band(ctx, -a, a, C.rise);
      band(ctx, -90, -a, bottom);
    }
    function band(ctx, d0, d1, col) {
      if (d1 - d0 < 0.05) return;
      ctx.save();
      ctx.globalAlpha = 0.9; ctx.fillStyle = col;
      [[Math.PI + d0 * D2R, Math.PI + d1 * D2R], [-d1 * D2R, -d0 * D2R]].forEach(function (s) {
        ctx.beginPath();
        ctx.arc(CX, CY, BAND1, s[0], s[1]);
        ctx.arc(CX, CY, BAND0, s[1], s[0], true);
        ctx.closePath(); ctx.fill();
      });
      // the SWF's band has a slightly lighter outer rim
      ctx.globalAlpha = 0.14; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2.5;
      [[Math.PI + d0 * D2R, Math.PI + d1 * D2R], [-d1 * D2R, -d0 * D2R]].forEach(function (s) {
        ctx.beginPath(); ctx.arc(CX, CY, BAND1 - 1.25, s[0], s[1]); ctx.stroke();
      });
      ctx.restore();
    }

    function drawEarthAndObserver(ctx, t) {
      var er = enlarge ? 25 : 5;
      ctx.save();
      ctx.globalAlpha = enlarge ? 0.5 : 1;
      drawEarth(ctx, CX, CY, er);
      ctx.restore();

      ctx.font = "13px Verdana, system-ui, sans-serif"; ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("lb.NP"), CX, enlarge ? 191 : 201);
      ctx.fillText(t("lb.SP"), CX, enlarge ? 257 : 247);

      var f = feet(), la = lat * D2R;
      var h = [Math.sin(la), Math.cos(la)];
      ctx.strokeStyle = C.horizon; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(f.x - 195 * h[0], f.y - 195 * h[1]);
      ctx.lineTo(f.x + 195 * h[0], f.y + 195 * h[1]);
      ctx.stroke();
      ctx.lineCap = "butt";

      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate((90 - lat) * D2R);                  // pers_tan._rotation = 90 − lat
      drawPerson(ctx);
      ctx.restore();
    }

    // the little man in a white shirt and jeans, feet at the origin, standing along −y
    function drawPerson(ctx) {
      ctx.save();
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      // legs
      ctx.strokeStyle = "#3d5a9c"; ctx.lineWidth = 5.2;
      ctx.beginPath(); ctx.moveTo(-1.6, -2); ctx.lineTo(-2.2, -24); ctx.stroke();
      ctx.strokeStyle = "#34508e";
      ctx.beginPath(); ctx.moveTo(2.2, -2); ctx.lineTo(1.6, -24); ctx.stroke();
      // shoes
      ctx.fillStyle = "#4a3222";
      ctx.beginPath(); ctx.ellipse(-3, -1.2, 3.6, 1.8, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(3.2, -1.2, 3.6, 1.8, 0, 0, TAU); ctx.fill();
      // torso (white shirt)
      ctx.fillStyle = "#f4f4f4"; ctx.strokeStyle = "#b9b9b9"; ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-5, -23); ctx.lineTo(-5.6, -40); ctx.quadraticCurveTo(0, -43.5, 5.6, -40);
      ctx.lineTo(5, -23); ctx.closePath(); ctx.fill(); ctx.stroke();
      // arm
      ctx.strokeStyle = "#e6e6e6"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-5.2, -38.5); ctx.lineTo(-6.6, -28); ctx.stroke();
      ctx.strokeStyle = "#c79a7a"; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(-6.6, -28); ctx.lineTo(-6.4, -23.5); ctx.stroke();
      // head + hair
      ctx.fillStyle = "#d4a585";
      ctx.beginPath(); ctx.arc(0, -47.5, 4.6, 0, TAU); ctx.fill();
      ctx.fillStyle = "#4a4038";
      ctx.beginPath(); ctx.arc(0, -48.6, 4.7, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
      ctx.restore();
    }

    var LAND = [   // simplified coastlines in (lon°, lat°) — the SWF's globe shows the Americas
      [[-168, 66], [-162, 70], [-140, 70], [-120, 72], [-95, 72], [-80, 68], [-62, 58], [-55, 50], [-66, 45],
       [-75, 38], [-81, 31], [-80, 25], [-83, 29], [-90, 29], [-97, 26], [-97, 20], [-92, 18], [-87, 21],
       [-84, 15], [-78, 8], [-80, 7], [-86, 11], [-92, 14], [-105, 20], [-112, 29], [-117, 33], [-124, 40],
       [-124, 48], [-133, 56], [-150, 60], [-165, 62]],
      [[-72, 78], [-55, 82], [-30, 83], [-20, 75], [-40, 65], [-50, 62], [-58, 70]],
      [[-78, 8], [-72, 12], [-62, 11], [-51, 4], [-35, -6], [-39, -14], [-48, -26], [-58, -35], [-65, -42],
       [-68, -52], [-72, -50], [-74, -40], [-71, -30], [-70, -18], [-76, -13], [-81, -5], [-80, 0]],
      [[-17, 15], [-10, 5], [8, 4], [10, -2], [13, -12], [18, -35], [27, -33], [40, -15], [51, 11], [43, 12],
       [33, 31], [10, 37], [-6, 36], [-10, 30], [-17, 21]],
      [[-10, 36], [-9, 43], [-2, 48], [0, 51], [8, 54], [10, 58], [5, 62], [15, 69], [28, 71], [30, 60],
       [40, 45], [26, 40], [20, 40], [12, 44], [3, 43]]
    ];
    function drawEarth(ctx, cx, cy, er) {
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, er, 0, TAU); ctx.clip();
      var g = ctx.createRadialGradient(cx + er * 0.2, cy + er * 0.3, er * 0.1, cx, cy, er);
      g.addColorStop(0, "#b8d3e8"); g.addColorStop(1, "#4f7fb4");
      ctx.fillStyle = g; ctx.fillRect(cx - er, cy - er, er * 2, er * 2);
      ctx.fillStyle = "#6f9a7c";
      var L0 = -70 * D2R;                             // Americas facing us, as in the SWF
      LAND.forEach(function (poly) {
        ctx.beginPath();
        poly.forEach(function (v, i) {
          var lo = v[0] * D2R - L0, la = v[1] * D2R;
          var x = Math.cos(la) * Math.sin(lo), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo);
          if (z < 0) { var m = Math.hypot(x, y) || 1; x /= m; y /= m; }   // pin far-side points to the limb
          i ? ctx.lineTo(cx + er * x, cy - er * y) : ctx.moveTo(cx + er * x, cy - er * y);
        });
        ctx.closePath(); ctx.fill();
      });
      ctx.restore();
      ctx.strokeStyle = "rgba(60,90,130,0.6)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(cx, cy, er, 0, TAU); ctx.stroke();
    }

    // right-hand panel: latitude + the SWF's "Declination Ranges" box
    function drawPanel(ctx, t) {
      var x0 = 554, R = ranges();
      ctx.textBaseline = "middle";
      ctx.font = "bold 15px Verdana, system-ui, sans-serif"; ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left"; ctx.fillText(t("ls.lat"), 472, 47);
      ctx.textAlign = "right"; ctx.fillText(latStr(lat), 638, 47);
      // a read-only version of the SWF's slider track, showing where the latitude sits
      var tx0 = 475, tx1 = 634, ty = 67, kx = tx0 + (lat + 90) / 180 * (tx1 - tx0);
      ctx.fillStyle = "#efefef"; ctx.fillRect(tx0, ty - 2, tx1 - tx0, 4);
      ctx.fillStyle = "#bdbdbd"; ctx.strokeStyle = "#7a7a7a"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(kx - 6, ty - 8); ctx.lineTo(kx + 6, ty - 8); ctx.lineTo(kx + 6, ty + 4);
      ctx.lineTo(kx, ty + 9); ctx.lineTo(kx - 6, ty + 4); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.font = "bold 8.5px Verdana, system-ui, sans-serif"; ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left"; ctx.fillText("90°" + t("lb.S"), 468, 86);
      ctx.textAlign = "right"; ctx.fillText("90°" + t("lb.N"), 641, 86);

      rule(ctx, 468, 637, 127, 2.5, "#777777");
      ctx.textAlign = "center";
      ctx.font = "bold 16px Verdana, system-ui, sans-serif"; ctx.fillStyle = C.title;
      ctx.fillText(t("ls.title"), x0, 162);
      rule(ctx, 468, 641, 177, 1.5, C.title);

      var rows = [[t("ls.cir"), R.cir, C.cir, 212], [t("ls.rise"), R.rise, C.rise, 294], [t("ls.nev"), R.nev, C.nev, 377]];
      rows.forEach(function (row, i) {
        ctx.font = "16px Verdana, system-ui, sans-serif"; ctx.fillStyle = row[2];
        ctx.fillText(row[0], x0, row[3]);
        ctx.fillStyle = "#ffffff"; ctx.font = "16px Verdana, system-ui, sans-serif";
        ctx.fillText(row[1], x0, row[3] + 36);
        if (i < 2) rule(ctx, 535, 573, row[3] + 58, 1.5, "#8a8a8a");
      });
    }
    function rule(ctx, x0, x1, y, w, col) {
      ctx.fillStyle = col; ctx.fillRect(x0, y - w / 2, x1 - x0, w);
    }
    function bevelPanel(ctx, x, y, w, h, r) {
      ctx.save();
      roundRect(ctx, x, y, w, h, r);
      ctx.fillStyle = C.panel; ctx.fill();
      ctx.clip();
      ctx.lineWidth = 12; ctx.strokeStyle = "rgba(0,0,0,0.28)";
      roundRect(ctx, x - 3, y - 3, w + 6, h + 6, r + 3); ctx.stroke();
      ctx.lineWidth = 5; ctx.strokeStyle = "rgba(0,0,0,0.30)";
      roundRect(ctx, x, y, w, h, r); ctx.stroke();
      ctx.restore();
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});
