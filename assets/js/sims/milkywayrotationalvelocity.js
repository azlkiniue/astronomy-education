/* Milky Way Rotational Velocity Explorer ----------------------------------------
   Faithful rebuild of the ClassAction "milkywayrotationalvelocity.swf"
   (MilkyWayRotationalVelocityClass, decompiled). The measured rotation curve of
   the Galaxy — the SWF's own 17 Bézier segments — runs from the centre out to
   nearly 40 kpc. Drag the marker along it and the enclosed mass follows from
   M = V²R / G, with G = 4.29868 × 10⁻⁶ kpc (km/s)² / M☉.

   The red disc on the galaxy picture (NASA/JPL-Caltech, the SWF's own bitmap)
   grows with the chosen radius at 8.36 pixels per kiloparsec, with the Sun
   marked at 8 kpc.                                                             */
Sim.create({
  id: "milkywayrotationalvelocity",
  width: 921, height: 364,
  strings: {
    en: {
      "mw.view": "Rotation curve", "mw.title": "Rotational Velocity Plot",
      "mw.xaxis": "distance from galactic center (kpc)", "mw.yaxis": "rotational speed (km/s)",
      "mw.sun": "Sun", "mw.credit": "NASA/JPL-Caltech",
      "mw.dist": "distance", "mw.vel": "rotational speed", "mw.mass": "mass inside that radius",
      "mw.set": "Jump to", "mw.sunR": "the Sun (8 kpc)", "mw.edge": "the visible edge (15 kpc)",
      "mw.far": "the outer gas (39 kpc)", "mw.msun": " M☉",
      "mw.hint": "Drag the circle along the curve, or jump to a landmark radius."
    },
    id: {
      "mw.view": "Kurva rotasi", "mw.title": "Grafik Kecepatan Rotasi",
      "mw.xaxis": "jarak dari pusat galaksi (kpc)", "mw.yaxis": "laju rotasi (km/d)",
      "mw.sun": "Matahari", "mw.credit": "NASA/JPL-Caltech",
      "mw.dist": "jarak", "mw.vel": "laju rotasi", "mw.mass": "massa di dalam jari-jari itu",
      "mw.set": "Lompat ke", "mw.sunR": "Matahari (8 kpc)", "mw.edge": "tepi tampak (15 kpc)",
      "mw.far": "gas terluar (39 kpc)", "mw.msun": " M☉",
      "mw.hint": "Seret lingkaran sepanjang kurva, atau lompat ke jarak penting."
    }
  },
  about: {
    en: "<p>Everything in the Galaxy orbits its centre, and how fast something orbits at a given radius tells you how much mass lies inside that radius: M = V²R / G. Apply that to the Sun, 8 kpc out and moving at about 230 km/s, and you enclose roughly 10¹¹ solar masses.</p>" +
        "<p>Now drag the marker outward. Past the bright disc the curve should fall away like the planets in the Solar System — Neptune crawls round far slower than Mercury — because there is almost no visible matter out there to add. Instead the curve stays flat, and the enclosed mass keeps climbing in step with the radius.</p>" +
        "<p>That refusal to fall is the single most direct piece of evidence for <strong>dark matter</strong>. The Galaxy sits in a roughly spherical halo of something that emits no light but keeps the outer gas clouds moving fast, adding up to several times the mass of everything we can see. The same flat curves turn up in essentially every spiral galaxy measured since Vera Rubin's work in the 1970s.</p>",
    id: "<p>Segala sesuatu di Galaksi mengorbit pusatnya, dan seberapa cepat sesuatu mengorbit pada jarak tertentu menyatakan berapa massa yang berada di dalam jari-jari itu: M = V²R / G. Terapkan pada Matahari, 8 kpc dari pusat dan bergerak sekitar 230 km/d, dan Anda memperoleh kira-kira 10¹¹ massa matahari.</p>" +
        "<p>Sekarang seret penanda ke luar. Melewati cakram terang, kurvanya semestinya menurun seperti planet di Tata Surya — Neptunus merayap jauh lebih lambat daripada Merkurius — karena nyaris tak ada materi tampak di sana yang menambah massa. Nyatanya kurva itu tetap mendatar, dan massa yang dilingkupi terus bertambah seiring jari-jari.</p>" +
        "<p>Penolakan untuk menurun itulah bukti paling langsung bagi <strong>materi gelap</strong>. Galaksi berada dalam halo yang hampir bulat berisi sesuatu yang tidak memancarkan cahaya tetapi menjaga awan gas terluar tetap bergerak cepat, jumlahnya beberapa kali massa segala sesuatu yang dapat kita lihat. Kurva mendatar serupa dijumpai pada hampir semua galaksi spiral yang diukur sejak karya Vera Rubin pada 1970-an.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var OY = -30;
    var FONT = "Verdana, Geneva, sans-serif";
    var G = 4.29868e-6;                                // kpc (km/s)² / M☉
    var PLOT = { x: 462.95, y: 324.5 + OY, s: 0.85 };  // plotMC, origin bottom-left, scaled 0.85
    var PW = 500, PH = 250, MAX_D = 40, MAX_V = 300;
    var X_SCALE = MAX_D / PW, Y_SCALE = -MAX_V / PH;
    var PXS = 0.0550314 / X_SCALE, PYS = -1.10701 / Y_SCALE;
    var GAL = { x: 182, y: 212 + OY, r: 175, scale: 8.36 };

    // the SWF's rotation curve: quadratic Béziers, in "points" units
    var START = { x: 7.75, y: 0 };
    var PTS = [
      { cx: 15.9, cy: -134.3, ax: 20.7, ay: -219.8 }, { cx: 21.5, cy: -233.1, ax: 34.7, ay: -222.9 },
      { cx: 49.1, cy: -211.7, ax: 59, ay: -196.2 }, { cx: 69.2, cy: -180, ax: 86.8, ay: -183.2 },
      { cx: 95.9, cy: -184.8, ax: 110, ay: -201.5 }, { cx: 121.5, cy: -215.3, ax: 133, ay: -214 },
      { cx: 147.2, cy: -212.4, ax: 158.3, ay: -200.8 }, { cx: 167.6, cy: -191, ax: 182, ay: -192.1 },
      { cx: 192.4, cy: -192.8, ax: 204.5, ay: -206.1 }, { cx: 212.4, cy: -214.7, ax: 222.8, ay: -218.8 },
      { cx: 232.6, cy: -222.6, ax: 250, ay: -221.9 }, { cx: 260.6, cy: -221.5, ax: 269.3, ay: -220.6 },
      { cx: 278.7, cy: -219.6, ax: 287.5, ay: -219.7 }, { cx: 296.2, cy: -219.8, ax: 308, ay: -222.9 },
      { cx: 316.4, cy: -225.1, ax: 328.3, ay: -225 }, { cx: 394.2, cy: -224, ax: 513, ay: -236.2 },
      { cx: 582.3, cy: -243.2, ax: 710.3, ay: -263.7 }
    ];
    var LEFT_X = START.x * PXS, RIGHT_X = PTS[PTS.length - 1].ax * PXS, RIGHT_Y = PTS[PTS.length - 1].ay * PYS;

    var px = 0, py = 0, drag = false;                  // the marker, in plot-local pixels
    var img = new Image();
    img.onload = function () { S.requestDraw(); };
    img.src = "../assets/img/sims/milkyway.jpg";

    S.group("mw.view");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "mw.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    [["mw.sunR", 8], ["mw.edge", 15], ["mw.far", 39]].forEach(function (b) {
      S.button({ labelKey: b[0], on: function () { px = b[1] / X_SCALE; py = -100; snap(); } });
    });
    var outDist = S.readout({ labelKey: "mw.dist" });
    var outVel = S.readout({ labelKey: "mw.vel" });
    var outMass = S.readout({ labelKey: "mw.mass" });

    function bez(p0, p1, p2, u) { var a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; return a * p0 + b * p1 + c * p2; }
    function solve(p0, p1, p2, target) {               // the SWF's quadratic inversion
      var a = p0 - 2 * p1 + p2, b = 2 * p1 - 2 * p0, c = p0 - target;
      if (a === 0) return b === 0 ? 0.5 : -c / b;
      var d = b * b - 4 * a * c;
      if (d < 0) return 0.5;
      var u1 = (-b + Math.sqrt(d)) / (2 * a), u2 = (-b - Math.sqrt(d)) / (2 * a);
      if (u1 >= 0 && u1 <= 1) return u1;
      if (u2 >= 0 && u2 <= 1) return u2;
      var d1 = u1 < 0 ? -u1 : u1 - 1, d2 = u2 < 0 ? -u2 : u2 - 1;
      return Math.max(0, Math.min(1, d1 < d2 ? u1 : u2));
    }
    function snap() {
      if (py > -100) py = -100;                        // keep the marker off the steep inner rise
      if (px < 10) px = 10;
      if (px <= LEFT_X) { px = LEFT_X; py = 0; return upd(); }
      if (px >= RIGHT_X) { px = RIGHT_X; py = RIGHT_Y; return upd(); }
      var x_ = px / PXS, u, p;
      if (x_ < PTS[0].ax) {                            // the first segment is solved in y
        p = PTS[0];
        u = solve(START.y, p.cy, p.ay, py / PYS);
        px = PXS * bez(START.x, p.cx, p.ax, u);
        py = PYS * bez(START.y, p.cy, p.ay, u);
        return upd();
      }
      for (var i = 1; i < PTS.length; i++) {
        if (x_ >= PTS[i].ax) continue;
        p = PTS[i];
        var x0 = PTS[i - 1].ax, y0 = PTS[i - 1].ay;
        u = solve(x0, p.cx, p.ax, x_);
        px = PXS * bez(x0, p.cx, p.ax, u);
        py = PYS * bez(y0, p.cy, p.ay, u);
        return upd();
      }
      upd();
    }
    function distance() { return X_SCALE * px; }
    function velocity() { return Y_SCALE * py; }
    function sig(x, n) {                               // Math.toSigDigits
      if (x <= 0) return "0";
      var e = Math.floor(Math.log10(x)), f = Math.pow(10, n - 1 - e);
      return (Math.round(x * f) / f).toFixed(Math.max(0, n - 1 - e));
    }
    function upd() {
      var d = distance(), v = velocity(), m = v * v * d / G;
      outDist(d.toFixed(1) + " kpc");
      outVel(sig(v, 3) + " km/s");
      var e = Math.floor(Math.log10(m));
      outMass((m / Math.pow(10, e)).toFixed(2) + " × 10" + supr(e) + I18N.t("mw.msun"));
      S.requestDraw();
    }
    S.refreshers.push(upd);
    function supr(n) {
      var map = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
      return String(n).split("").map(function (c) { return map[c] || c; }).join("");
    }

    /* ---- dragging the marker along the curve ---- */
    function local(ev) {
      var r = S.canvas.getBoundingClientRect();
      return {
        x: ((ev.clientX - r.left) * S.W / r.width - PLOT.x) / PLOT.s,
        y: ((ev.clientY - r.top) * S.H / r.height - PLOT.y) / PLOT.s
      };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = local(ev);
      if (Math.hypot(p.x - px, p.y - py) > 12) return;
      drag = true; S.canvas.setPointerCapture(ev.pointerId); S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = local(ev);
      px = p.x; py = p.y; snap();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = false; S.requestDraw(); });
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);

      ctx.fillStyle = "#000000"; ctx.fillRect(GAL.x - GAL.r, GAL.y - GAL.r, 2 * GAL.r, 2 * GAL.r);
      if (img.complete && img.naturalWidth) ctx.drawImage(img, GAL.x - GAL.r, GAL.y - GAL.r, 2 * GAL.r, 2 * GAL.r);
      ctx.save();
      ctx.beginPath(); ctx.rect(GAL.x - GAL.r, GAL.y - GAL.r, 2 * GAL.r, 2 * GAL.r); ctx.clip();
      var rr = distance() * GAL.scale;                  // the red disc, 1 px outline over a 20 % fill
      ctx.beginPath(); ctx.arc(GAL.x, GAL.y, rr, 0, TAU);
      ctx.fillStyle = "rgba(255,0,0,0.2)"; ctx.fill();
      ctx.strokeStyle = "#ff0000"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(GAL.x + 1.6 - 2, GAL.y + 66.7 - 2, 4, 4);
      ctx.font = "10px " + FONT; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(t("mw.sun"), GAL.x + 6.1, GAL.y + 66.7);
      ctx.font = "9px " + FONT; ctx.textAlign = "right"; ctx.fillStyle = "#cccccc";
      ctx.fillText(t("mw.credit"), GAL.x + GAL.r - 6, GAL.y + GAL.r - 10);

      ctx.fillStyle = "#fafafa"; ctx.fillRect(364, 37 + OY, 550, 350);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(364.5, 37.5 + OY, 549, 349);
      ctx.fillStyle = "#333333"; ctx.font = "14px " + FONT;
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(t("mw.title"), 374, 50 + OY);
      ctx.strokeStyle = "#cccccc"; ctx.beginPath();
      ctx.moveTo(374 + ctx.measureText(t("mw.title")).width + 8, 50 + OY);
      ctx.lineTo(904, 50 + OY); ctx.stroke();

      ctx.save();
      ctx.translate(PLOT.x, PLOT.y); ctx.scale(PLOT.s, PLOT.s);
      axes(ctx, t);
      ctx.strokeStyle = "#ff7070"; ctx.lineWidth = 2 / PLOT.s;   // drawCurve: 2 px #ff7070
      ctx.beginPath();
      ctx.moveTo(PXS * START.x, PYS * START.y);
      PTS.forEach(function (p) { ctx.quadraticCurveTo(PXS * p.cx, PYS * p.cy, PXS * p.ax, PYS * p.ay); });
      ctx.stroke();
      guides(ctx);
      equation(ctx);
      ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#000000"; ctx.lineWidth = 1.5 / PLOT.s;
      ctx.beginPath(); ctx.arc(px, py, drag ? 6 : 5, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.restore();
    });

    function axes(ctx, t) {
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1 / PLOT.s;
      ctx.beginPath();
      ctx.moveTo(0, -290); ctx.lineTo(0, 0); ctx.lineTo(500, 0); ctx.stroke();
      ctx.fillStyle = "#000000";
      [[0, -293.75, 0], [501.35, 0, 90]].forEach(function (a) {   // the two arrowheads
        ctx.save(); ctx.translate(a[0], a[1]); ctx.rotate(a[2] * Math.PI / 180);
        ctx.beginPath(); ctx.moveTo(0, -7.1); ctx.lineTo(4.45, 7.1); ctx.lineTo(-4.4, 7.1);
        ctx.closePath(); ctx.fill(); ctx.restore();
      });
      ctx.font = (12 / PLOT.s * PLOT.s) + "px " + FONT;
      ctx.font = "13px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var d = 0; d <= 35; d += 5) {
        var x = d / X_SCALE;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 6); ctx.stroke();
        ctx.fillText(String(d), x, 10);
      }
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var v = 0; v <= 300; v += 100) {
        var y = v / Y_SCALE;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(-6, y); ctx.stroke();
        ctx.fillText(String(v), -11, y);
      }
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(t("mw.xaxis"), 250, 53);
      ctx.save(); ctx.translate(-88, -145); ctx.rotate(-Math.PI / 2);
      ctx.fillText(t("mw.yaxis"), 0, 0); ctx.restore();
    }

    function guides(ctx) {                             // dashed lines back to the two axes
      ctx.save();
      ctx.setLineDash([2.5, 2.5]); ctx.lineWidth = 1 / PLOT.s; ctx.strokeStyle = "#009900";
      ctx.beginPath();
      ctx.moveTo(px, 0); ctx.lineTo(px, py);
      ctx.moveTo(0, py); ctx.lineTo(px, py);
      ctx.stroke();
      ctx.restore();
    }

    // the equation clip: M = V²R / G = (v km/s)² (r kpc) / G = m × 10^e M☉
    function equation(ctx) {
      var x = 125.8, y = -62.15, s = 0.8;
      ctx.save();
      ctx.translate(x, y); ctx.scale(s, s);
      ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#000000"; ctx.lineWidth = 1 / (PLOT.s * s);
      ctx.fillRect(12.15, -92, 401, 111.5); ctx.strokeRect(12.15, -92, 401, 111.5);
      ctx.fillStyle = "#000000"; ctx.textBaseline = "middle";
      ctx.font = "italic 20px " + FONT; ctx.textAlign = "left";
      ctx.fillText("M", 32, -55);
      ctx.font = "20px " + FONT;
      ctx.fillText("=", 64, -55);
      ctx.textAlign = "center";
      ctx.font = "italic 20px " + FONT;
      ctx.fillText("V ²R", 120, -72);
      ctx.fillText("G", 120, -36);
      ctx.beginPath(); ctx.moveTo(95, -53.5); ctx.lineTo(145, -53.5); ctx.stroke();
      ctx.font = "20px " + FONT; ctx.textAlign = "left";
      ctx.fillText("=", 160, -55);
      ctx.font = "15px " + FONT; ctx.textAlign = "center";
      ctx.fillText("(" + sig(velocity(), 3) + " km/s)² (" + distance().toFixed(1) + " kpc)", 292, -72);
      ctx.font = "italic 20px " + FONT;
      ctx.fillText("G", 292, -36);
      ctx.beginPath(); ctx.moveTo(196, -53.5); ctx.lineTo(388, -53.5); ctx.stroke();
      var m = velocity() * velocity() * distance() / G, e = Math.floor(Math.log10(m));
      ctx.font = "20px " + FONT; ctx.textAlign = "left";
      ctx.fillText("=", 64, 8);
      ctx.fillText((m / Math.pow(10, e)).toFixed(2), 100, 8);
      ctx.font = "15px " + FONT;
      ctx.fillText("× 10", 150, 8);
      ctx.font = "11px " + FONT;
      ctx.fillText(String(e), 183, 1);
      ctx.font = "15px " + FONT;
      ctx.fillText("M", 196, 8);
      ctx.font = "11px " + FONT;
      ctx.fillText("☉", 209, 12);
      ctx.restore();
    }

    px = 8 / X_SCALE; py = -100; snap();
  }
});
