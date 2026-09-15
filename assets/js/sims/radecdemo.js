/* Celestial-Equatorial (RA/Dec) Demonstrator ----------------------------------
   Faithful rebuild of the ClassAction "radecdemo.swf": a translucent celestial
   sphere with the Earth at its centre, the celestial equator, the 0h (vernal
   equinox) hour circle and the ecliptic drawn on it, and a draggable star whose
   position is given by right ascension (measured eastward along the celestial
   equator, blue arc) and declination (measured up the star's hour circle, red
   arc). Controls mirror the original — RA and dec sliders plus a "Labels" panel
   with show all / hide all and individual label visibilities.
   Camera matches the SWF: polar axis vertical on screen, viewed from 24° above
   the equatorial plane at a longitude of ≈1.3h.                                 */
Sim.create({
  id: "radecdemo",
  width: 700, height: 560,
  strings: {
    en: {
      "rd.pos": "Star Position", "rd.ra": "right ascension (RA)", "rd.dec": "declination (dec)",
      "rd.hint": "you can also change the star's position by dragging it",
      "rd.labels": "Labels", "rd.showAll": "show all", "rd.hideAll": "hide all",
      "rd.lPoles": "North and South Poles", "rd.lEquator": "Equator",
      "rd.lCelPoles": "North and South Celestial Poles", "rd.lCelEq": "Celestial Equator",
      "rd.lZero": "0h Circle", "rd.lEast": "East Arrow", "rd.lEcliptic": "Ecliptic",
      "rd.sphere": "The Celestial Sphere",
      "rd.rRA": "RA", "rd.rDec": "dec", "rd.rRAdeg": "RA in degrees",
      "rd.np": "North Pole", "rd.sp": "South Pole", "rd.ncp": "NCP", "rd.scp": "SCP",
      "rd.eq": "Equator", "rd.ce": "Celestial Equator", "rd.zero": "0h", "rd.east": "east",
      "rd.ecl": "Ecliptic", "rd.star": "star"
    },
    id: {
      "rd.pos": "Posisi Bintang", "rd.ra": "asensiorekta (AR)", "rd.dec": "deklinasi (dek)",
      "rd.hint": "posisi bintang juga bisa diubah dengan menyeretnya",
      "rd.labels": "Label", "rd.showAll": "tampilkan semua", "rd.hideAll": "sembunyikan semua",
      "rd.lPoles": "Kutub Utara dan Selatan", "rd.lEquator": "Ekuator",
      "rd.lCelPoles": "Kutub Langit Utara dan Selatan", "rd.lCelEq": "Ekuator Langit",
      "rd.lZero": "Lingkaran 0j", "rd.lEast": "Panah Timur", "rd.lEcliptic": "Ekliptika",
      "rd.sphere": "Bola Langit",
      "rd.rRA": "AR", "rd.rDec": "dek", "rd.rRAdeg": "AR dalam derajat",
      "rd.np": "Kutub Utara", "rd.sp": "Kutub Selatan", "rd.ncp": "KLU", "rd.scp": "KLS",
      "rd.eq": "Ekuator", "rd.ce": "Ekuator Langit", "rd.zero": "0j", "rd.east": "timur",
      "rd.ecl": "Ekliptika", "rd.star": "bintang"
    }
  },
  about: {
    en: "<p>The <strong>celestial-equatorial</strong> system is the sky's version of latitude and longitude. Project Earth's equator outward and you get the <strong>celestial equator</strong>; project its poles and you get the <strong>north and south celestial poles</strong>. Because the grid is pinned to Earth's rotation axis rather than to your horizon, a star keeps the same coordinates no matter where or when you observe it.</p>" +
        "<p><strong>Declination (dec)</strong> is the angle north (+) or south (−) of the celestial equator, from −90° to +90° — the red arc. <strong>Right ascension (RA)</strong> is the angle measured <em>eastward</em> along the celestial equator from the <strong>0h circle</strong>, the hour circle through the vernal equinox — the blue arc. RA is quoted in hours rather than degrees because the sky turns 15° per hour: 1<sup>h</sup> = 15°, and a full circle is 24<sup>h</sup>.</p>" +
        "<p>Drag the star, or use the sliders. Notice that the star's declination circle stays the same size as RA changes, and shrinks toward the pole as dec grows — which is why an hour of RA covers less sky at high declination.</p>",
    id: "<p>Sistem <strong>ekuatorial langit</strong> adalah versi lintang–bujur untuk langit. Proyeksikan ekuator Bumi ke luar dan diperoleh <strong>ekuator langit</strong>; proyeksikan kutubnya dan diperoleh <strong>kutub langit utara dan selatan</strong>. Karena kisi ini terpaku pada sumbu rotasi Bumi, bukan pada horizon Anda, koordinat sebuah bintang tetap sama di mana pun dan kapan pun diamati.</p>" +
        "<p><strong>Deklinasi (dek)</strong> adalah sudut ke utara (+) atau selatan (−) dari ekuator langit, −90° hingga +90° — busur merah. <strong>Asensiorekta (AR)</strong> adalah sudut yang diukur <em>ke timur</em> sepanjang ekuator langit dari <strong>lingkaran 0j</strong>, yaitu lingkaran jam yang melewati titik musim semi — busur biru. AR dinyatakan dalam jam karena langit berputar 15° per jam: 1<sup>j</sup> = 15°, dan satu lingkaran penuh 24<sup>j</sup>.</p>" +
        "<p>Seret bintangnya, atau gunakan penggeser. Perhatikan bahwa lingkaran deklinasi bintang mengecil ke arah kutub saat dek membesar — itulah sebabnya satu jam AR mencakup langit yang lebih sempit pada deklinasi tinggi.</p>"
  },
  build: function (S) {
    var D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = Math.PI * 2;
    var C = {
      panel: "#0e1530", border: "#2c3a66", text: "#e8ecf8", dim: "#9fabce",
      sphere: "#8ea3d6", ce: "#5fd68a", zero: "#8ef0b4", ecl: "#ffb35c",
      raArc: "#4d9dff", decArc: "#ff5f5f", star: "#ffe066", axis: "#c8d3ef"
    };

    /* ---- state (defaults match the SWF's opening screen) ---- */
    var ra = 4.0, dec = 60.0;                        // hours, degrees
    var lbl = { poles: false, equator: false, celPoles: false, celEq: false, zero: false, east: false, ecl: false };

    /* ---- camera: polar axis vertical, 24° above the equatorial plane ---- */
    var SCx = 300, SCy = 300, R = 210;
    var EC = 24 * D2R;                               // camera elevation above the equator
    var LC = 20 * D2R;                               // camera longitude (≈ RA 1.3h)
    var sinE = Math.sin(EC), cosE = Math.cos(EC);

    // p(φ,δ) on the unit sphere → screen. φ measured eastward from the 0h circle.
    function proj(phi, delta, rad) {
      var k = rad == null ? 1 : rad;
      var cd = Math.cos(delta), sd = Math.sin(delta), dl = phi - LC;
      return {
        x: SCx + R * k * cd * Math.sin(dl),
        y: SCy - R * k * (cosE * sd - sinE * cd * Math.cos(dl)),
        z: cosE * cd * Math.cos(dl) + sinE * sd       // >0 ⇒ near side (toward the viewer)
      };
    }
    function raPhi(h) { return h * 15 * D2R; }

    /* draw a circle of constant declination (or any parametric curve) with the
       far side drawn faint, so the sphere reads as transparent glass */
    function ring(delta, col, w, dash) {
      var ctx = S.ctx;
      for (var side = 0; side < 2; side++) {
        ctx.beginPath(); var pen = false;
        for (var a = 0; a <= 360; a += 2) {
          var p = proj(a * D2R, delta);
          if ((p.z >= 0) !== (side === 0)) { pen = false; continue; }
          pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
        }
        ctx.setLineDash(dash || []);
        ctx.strokeStyle = col; ctx.lineWidth = side === 0 ? w : Math.max(1, w - 1);
        ctx.globalAlpha = side === 0 ? 1 : 0.28; ctx.stroke();
        ctx.globalAlpha = 1; ctx.setLineDash([]);
      }
    }
    // great circle through the poles at longitude phi (an "hour circle")
    function hourCircle(phi, col, w, dash) {
      var ctx = S.ctx;
      for (var side = 0; side < 2; side++) {
        ctx.beginPath(); var pen = false;
        for (var a = 0; a <= 360; a += 2) {
          var t = a * D2R, d = t, ph = phi;
          if (t > Math.PI / 2 && t < 3 * Math.PI / 2) { d = Math.PI - t; ph = phi + Math.PI; }
          else if (t >= 3 * Math.PI / 2) { d = t - TAU; }
          var p = proj(ph, d);
          if ((p.z >= 0) !== (side === 0)) { pen = false; continue; }
          pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
        }
        ctx.setLineDash(dash || []);
        ctx.strokeStyle = col; ctx.lineWidth = side === 0 ? w : Math.max(1, w - 1);
        ctx.globalAlpha = side === 0 ? 1 : 0.28; ctx.stroke();
        ctx.globalAlpha = 1; ctx.setLineDash([]);
      }
    }
    // the ecliptic: a great circle inclined 23.44° to the equator, crossing it at 0h
    function ecliptic(col, w) {
      var ctx = S.ctx, eps = 23.44 * D2R;
      for (var side = 0; side < 2; side++) {
        ctx.beginPath(); var pen = false;
        for (var a = 0; a <= 360; a += 2) {
          var l = a * D2R;
          var d = Math.asin(Math.sin(eps) * Math.sin(l));
          var ph = Math.atan2(Math.cos(eps) * Math.sin(l), Math.cos(l));
          var p = proj(ph, d);
          if ((p.z >= 0) !== (side === 0)) { pen = false; continue; }
          pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
        }
        ctx.strokeStyle = col; ctx.lineWidth = side === 0 ? w : 1;
        ctx.globalAlpha = side === 0 ? 0.9 : 0.25; ctx.stroke(); ctx.globalAlpha = 1;
      }
    }

    /* ---- controls ---- */
    S.group("rd.pos");
    var raCtl = S.slider({
      labelKey: "rd.ra", min: 0, max: 24, value: ra, step: 0.1,
      format: function (v) { return v.toFixed(1) + " h"; },
      on: function (v) { ra = v; upd(); }
    });
    var decCtl = S.slider({
      labelKey: "rd.dec", min: -90, max: 90, value: dec, step: 0.5,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { dec = v; upd(); }
    });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "rd.hint");
    decCtl.input.parentNode.parentNode.appendChild(hint);

    S.group("rd.labels");
    S.button({ labelKey: "rd.showAll", on: function () { setAll(true); } });
    S.button({ labelKey: "rd.hideAll", on: function () { setAll(false); } });
    var toggles = {
      poles: S.toggle({ labelKey: "rd.lPoles", value: false, on: function (b) { lbl.poles = b; } }),
      equator: S.toggle({ labelKey: "rd.lEquator", value: false, on: function (b) { lbl.equator = b; } }),
      celPoles: S.toggle({ labelKey: "rd.lCelPoles", value: false, on: function (b) { lbl.celPoles = b; } }),
      celEq: S.toggle({ labelKey: "rd.lCelEq", value: false, on: function (b) { lbl.celEq = b; } }),
      zero: S.toggle({ labelKey: "rd.lZero", value: false, on: function (b) { lbl.zero = b; } }),
      east: S.toggle({ labelKey: "rd.lEast", value: false, on: function (b) { lbl.east = b; } }),
      ecl: S.toggle({ labelKey: "rd.lEcliptic", value: false, on: function (b) { lbl.ecl = b; } })
    };
    function setAll(b) { Object.keys(toggles).forEach(function (k) { toggles[k].set(b); }); S.requestDraw(); }

    var outRA = S.readout({ labelKey: "rd.rRA" });
    var outDec = S.readout({ labelKey: "rd.rDec" });
    var outDeg = S.readout({ labelKey: "rd.rRAdeg" });

    function hms(h) {
      var t = ((h % 24) + 24) % 24, hh = Math.floor(t), m = (t - hh) * 60, mm = Math.floor(m);
      return hh + "h " + (mm < 10 ? "0" : "") + mm + "m " + (Math.round((m - mm) * 60) < 10 ? "0" : "") + Math.round((m - mm) * 60) + "s";
    }
    function dms(d) {
      var s = d < 0 ? "−" : "+", a = Math.abs(d), dd = Math.floor(a), m = (a - dd) * 60, mm = Math.floor(m);
      return s + dd + "° " + (mm < 10 ? "0" : "") + mm + "′ " + (Math.round((m - mm) * 60) < 10 ? "0" : "") + Math.round((m - mm) * 60) + "″";
    }
    function upd() {
      outRA(hms(ra)); outDec(dms(dec)); outDeg((ra * 15).toFixed(1) + "°");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- drag the star ---- */
    var dragging = false;
    function localXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var m = localXY(ev), p = proj(raPhi(ra), dec * D2R);
      if (Math.hypot(m.x - p.x, m.y - p.y) < 34) { dragging = true; S.canvas.setPointerCapture(ev.pointerId); }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!dragging) return;
      var m = localXY(ev), best = 1e9, bra = ra, bdec = dec;
      for (var h = 0; h < 24; h += 0.1) for (var d = -90; d <= 90; d += 1.5) {
        var p = proj(raPhi(h), d * D2R);
        if (p.z < -0.1) continue;                  // keep the star on the visible face
        var q = (p.x - m.x) * (p.x - m.x) + (p.y - m.y) * (p.y - m.y);
        if (q < best) { best = q; bra = h; bdec = d; }
      }
      ra = Math.round(bra * 10) / 10; dec = Math.round(bdec * 2) / 2;
      raCtl.input.value = ra; decCtl.input.value = dec;
      S.refreshers.forEach(function (f) { f(); });
    });
    S.canvas.addEventListener("pointerup", function () { dragging = false; });

    /* ---- Earth, drawn as a small globe at the centre of the sphere ---- */
    var LAND = [   // crude continent blobs in (lon°, lat°) — enough to read as Earth
      [[-10, 35], [30, 35], [50, 12], [42, -5], [25, -34], [12, -6], [-16, 12]],
      [[-8, 44], [30, 45], [60, 40], [100, 55], [140, 50], [120, 25], [75, 8], [40, 38], [0, 52]],
      [[-100, 55], [-60, 50], [-70, 25], [-100, 20], [-125, 40]],
      [[-70, 5], [-38, -8], [-52, -35], [-72, -20], [-78, -2]],
      [[113, -22], [150, -22], [145, -38], [118, -34]]
    ];
    function drawEarth(ctx, cx, cy, er) {
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, er, 0, TAU); ctx.clip();
      var g = ctx.createRadialGradient(cx - er * 0.35, cy - er * 0.4, er * 0.15, cx, cy, er);
      g.addColorStop(0, "#4a86d8"); g.addColorStop(1, "#153a70");
      ctx.fillStyle = g; ctx.fillRect(cx - er, cy - er, er * 2, er * 2);
      // continents, projected with the same camera at the globe's scale
      ctx.fillStyle = "#3f7a4a";
      LAND.forEach(function (poly) {
        ctx.beginPath(); var pen = false;
        poly.forEach(function (v) {
          var p = proj(v[0] * D2R, v[1] * D2R);
          var sx = cx + (p.x - SCx) * er / R, sy = cy + (p.y - SCy) * er / R;
          if (p.z < 0) { return; }
          pen ? ctx.lineTo(sx, sy) : (ctx.moveTo(sx, sy), pen = true);
        });
        if (pen) { ctx.closePath(); ctx.fill(); }
      });
      // Earth's equator on the globe
      ctx.beginPath(); var pen2 = false;
      for (var a = 0; a <= 360; a += 3) {
        var p = proj(a * D2R, 0);
        if (p.z < 0) { pen2 = false; continue; }
        var sx = cx + (p.x - SCx) * er / R, sy = cy + (p.y - SCy) * er / R;
        pen2 ? ctx.lineTo(sx, sy) : (ctx.moveTo(sx, sy), pen2 = true);
      }
      ctx.strokeStyle = "rgba(255,255,255,.75)"; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.restore();
      ctx.beginPath(); ctx.arc(cx, cy, er, 0, TAU);
      ctx.strokeStyle = "rgba(200,215,255,.5)"; ctx.lineWidth = 1; ctx.stroke();
    }

    function tag(ctx, x, y, text, col, align, dy) {
      ctx.font = "600 11px system-ui"; ctx.textAlign = align || "center";
      ctx.lineWidth = 3; ctx.strokeStyle = "rgba(7,11,26,.85)";
      ctx.strokeText(text, x, y + (dy || 0)); ctx.fillStyle = col; ctx.fillText(text, x, y + (dy || 0));
      ctx.textAlign = "left";
    }

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      var t = I18N.t.bind(I18N);
      var phi = raPhi(ra), dR = dec * D2R;

      // ---- panel frame ----
      ctx.fillStyle = C.panel; ctx.strokeStyle = C.border; ctx.lineWidth = 1;
      roundRect(ctx, 8, 8, 584, S.H - 16, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = "12px system-ui"; ctx.textAlign = "left";
      ctx.fillText(t("rd.sphere"), 20, 28);

      // ---- glass sphere ----
      var sg = ctx.createRadialGradient(SCx - R * 0.4, SCy - R * 0.45, R * 0.1, SCx, SCy, R);
      sg.addColorStop(0, "rgba(150,175,235,.13)"); sg.addColorStop(0.75, "rgba(110,135,200,.07)");
      sg.addColorStop(1, "rgba(90,115,180,.16)");
      ctx.beginPath(); ctx.arc(SCx, SCy, R, 0, TAU); ctx.fillStyle = sg; ctx.fill();
      ctx.strokeStyle = "rgba(160,180,230,.4)"; ctx.lineWidth = 1.2; ctx.stroke();

      // faint wireframe: declination parallels + hour circles
      [-60, -30, 30, 60].forEach(function (d) { ring(d * D2R, "rgba(150,170,220,.20)", 1); });
      for (var hh = 0; hh < 12; hh++) if (hh !== 0) hourCircle(hh * 30 * D2R, "rgba(150,170,220,.16)", 1);

      // ---- polar axis, poking out of the sphere ----
      var pn = proj(0, Math.PI / 2, 1.16), ps = proj(0, -Math.PI / 2, 1.16);
      ctx.beginPath(); ctx.moveTo(pn.x, pn.y); ctx.lineTo(ps.x, ps.y);
      ctx.strokeStyle = C.axis; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.75; ctx.stroke(); ctx.globalAlpha = 1;

      // ---- the reference circles ----
      ecliptic(C.ecl, 1.6);
      ring(0, C.ce, 2.2);                       // celestial equator
      hourCircle(0, C.zero, 2);                 // 0h circle (through the vernal equinox)

      // ---- the star's declination circle ----
      ring(dR, "rgba(255,224,102,.35)", 1.2, [4, 4]);

      // ---- RA arc: eastward along the celestial equator, 0h → the star's hour circle ----
      ctx.lineCap = "round";
      arc(function (u) { return proj(u * ra * 15 * D2R, 0, 1.012); }, C.raArc);
      // ---- dec arc: up the star's hour circle from the equator to the star ----
      arc(function (u) { return proj(phi, u * dR, 1.012); }, C.decArc);
      ctx.lineCap = "butt";

      // arc value labels, pushed a little outside the sphere (faint when behind it)
      var mRA = proj(raPhi(ra / 2), 0, 1.14);
      ctx.globalAlpha = mRA.z >= 0 ? 1 : 0.42;
      tag(ctx, mRA.x, mRA.y, ra.toFixed(1) + "h", C.raArc);
      var mDec = proj(phi, dR / 2, 1.15);
      ctx.globalAlpha = mDec.z >= 0 ? 1 : 0.42;
      tag(ctx, mDec.x, mDec.y, dec.toFixed(1) + "°", C.decArc);
      ctx.globalAlpha = 1;

      // ---- Earth at the centre ----
      drawEarth(ctx, SCx, SCy, 42);

      // ---- east arrow: the direction RA is measured in, just outside the equator ----
      var e0 = raPhi(5.2), e1 = raPhi(7.0);
      ctx.beginPath(); pen = false;
      for (var ea = e0; ea <= e1; ea += 0.02) {
        var pe = proj(ea, 0, 1.09);
        if (pe.z < 0) { pen = false; continue; }
        pen ? ctx.lineTo(pe.x, pe.y) : (ctx.moveTo(pe.x, pe.y), pen = true);
      }
      ctx.strokeStyle = "rgba(232,236,248,.75)"; ctx.lineWidth = 1.8; ctx.stroke();
      var tip = proj(e1, 0, 1.09), pre = proj(e1 - 0.05, 0, 1.09);
      if (tip.z > 0) arrowHead(ctx, pre.x, pre.y, tip.x, tip.y, "rgba(232,236,248,.85)");

      // ---- the star ----
      var sp = proj(phi, dR);
      ctx.globalAlpha = sp.z < 0 ? 0.4 : 1;
      ctx.beginPath(); ctx.arc(sp.x, sp.y, 9, 0, TAU);
      ctx.fillStyle = "rgba(255,224,102,.22)"; ctx.fill();
      starPath(ctx, sp.x, sp.y, 7.5, 3.2);
      ctx.fillStyle = C.star; ctx.fill();
      ctx.strokeStyle = "#8a6d00"; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.globalAlpha = 1;

      // ---- labels (individually toggled, as in the original) ----
      if (lbl.celPoles) {
        tag(ctx, pn.x, pn.y - 8, t("rd.ncp"), C.text);
        tag(ctx, ps.x, ps.y + 16, t("rd.scp"), C.text);
      }
      if (lbl.poles) {                                 // Earth's own poles, on the globe
        var eNP = SCy - 42 * cosE, eSP = SCy + 42 * cosE;
        leader(ctx, SCx - 56, SCy - 66, SCx - 3, eNP + 3, t("rd.np"), "#cfe0ff");
        leader(ctx, SCx - 56, SCy + 82, SCx - 3, eSP - 3, t("rd.sp"), "#cfe0ff");
      }
      if (lbl.equator) {                               // Earth's equator, on the globe
        leader(ctx, SCx - 74, SCy + 28, SCx - 32, SCy + 7, t("rd.eq"), "#dce6ff");
      }
      if (lbl.celEq) {
        var pce = proj(raPhi(19.5), 0, 1.1);
        tag(ctx, pce.x, pce.y, t("rd.ce"), C.ce);
      }
      if (lbl.zero) {
        var pz = proj(0, 55 * D2R, 1.1);
        tag(ctx, pz.x, pz.y, t("rd.zero"), C.zero);
      }
      if (lbl.east) {
        var pea = proj(raPhi(6.1), 0, 1.22);
        tag(ctx, pea.x, pea.y, t("rd.east"), "#e8ecf8");
      }
      if (lbl.ecl) {
        var pel = proj(raPhi(7.2), 23.44 * D2R, 1.12);
        tag(ctx, pel.x, pel.y, t("rd.ecl"), C.ecl);
      }

      // ---- readout strip inside the panel ----
      ctx.fillStyle = C.dim; ctx.font = "12px system-ui"; ctx.textAlign = "left";
      ctx.fillText(t("rd.rRA") + ":", 20, S.H - 44);
      ctx.fillText(t("rd.rDec") + ":", 20, S.H - 24);
      ctx.fillStyle = C.raArc; ctx.font = "600 13px ui-monospace, monospace";
      ctx.fillText(hms(ra), 70, S.H - 44);
      ctx.fillStyle = C.decArc; ctx.fillText(dms(dec), 70, S.H - 24);

      // legend
      var lx = 330, ly = S.H - 48;
      legend(ctx, lx, ly, C.ce, t("rd.ce"));
      legend(ctx, lx, ly + 18, C.zero, t("rd.lZero"));
      legend(ctx, lx + 150, ly, C.ecl, t("rd.ecl"));
      legend(ctx, lx + 150, ly + 18, C.star, t("rd.star"));
    });

    /* stroke a parametric arc p(u), u ∈ [0,1] — solid on the near face of the
       sphere, faint where it passes round the back */
    function arc(p, col) {
      var ctx = S.ctx;
      for (var side = 0; side < 2; side++) {
        ctx.beginPath(); var pen = false;
        for (var i = 0; i <= 180; i++) {
          var q = p(i / 180);
          if ((q.z >= 0) !== (side === 0)) { pen = false; continue; }
          pen ? ctx.lineTo(q.x, q.y) : (ctx.moveTo(q.x, q.y), pen = true);
        }
        ctx.strokeStyle = col; ctx.lineWidth = side === 0 ? 3.4 : 2.2;
        ctx.globalAlpha = side === 0 ? 1 : 0.3; ctx.stroke(); ctx.globalAlpha = 1;
      }
    }
    // right-aligned caption at (tx,ty) with a hairline leader to the feature at (px,py)
    function leader(ctx, tx, ty, px, py, text, col) {
      ctx.beginPath(); ctx.moveTo(tx + 4, ty - 3); ctx.lineTo(px, py);
      ctx.strokeStyle = "rgba(200,215,255,.45)"; ctx.lineWidth = 1; ctx.stroke();
      tag(ctx, tx, ty, text, col, "right");
    }
    function legend(ctx, x, y, col, label) {
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + 18, y); ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = "11px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(label, x + 24, y); ctx.textBaseline = "alphabetic";
    }
    function arrowHead(ctx, x0, y0, x1, y1, col) {
      var a = Math.atan2(y1 - y0, x1 - x0);
      ctx.beginPath(); ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - 8 * Math.cos(a - 0.4), y1 - 8 * Math.sin(a - 0.4));
      ctx.lineTo(x1 - 8 * Math.cos(a + 0.4), y1 - 8 * Math.sin(a + 0.4));
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    }
    function starPath(ctx, cx, cy, ro, ri) {
      ctx.beginPath();
      for (var i = 0; i < 10; i++) {
        var r = i % 2 ? ri : ro, a = -Math.PI / 2 + i * Math.PI / 5;
        var x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath();
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});
