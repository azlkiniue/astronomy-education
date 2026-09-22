/* Sun Motions Overview -----------------------------------------------------------
   Faithful rebuild of the ClassAction "sunmotionsoverview.swf" (sprite105,
   decompiled). One horizon sphere and four steps, revealed by checkbox exactly
   as the SWF's stepOneChanged … stepFourChanged do: the celestial poles, the
   celestial equator, the equinox path, and the two solstice paths.

   The SWF's own numbers: viewerAzimuth 200 (so theta = −200 = 160°),
   viewerAltitude 40, size 250, latitude 41, meridians white at 20 %, the poles
   #75a9ff at 3 px, the equator #ffe375 at 3 px, and the Sun's paths red.      */
Sim.create({
  id: "sunmotionsoverview",
  width: 600, height: 600,
  strings: {
    en: {
      "so.ctl": "Latitude", "so.lat": "latitude",
      "so.steps": "Build up the sky",
      "so.s1": "Step 1: show the poles", "so.s2": "Step 2: show the celestial equator",
      "so.s3": "Step 3: show the equinox path", "so.s4": "Step 4: show the solstice paths",
      "so.rNCP": "north celestial pole", "so.rNoon": "sun's noon altitude at the equinox",
      "so.rSum": "at the summer solstice", "so.rWin": "at the winter solstice",
      "so.hint": "Drag the sphere to swing the view. The Sun's daily path is always parallel to the celestial equator — only its declination changes through the year.",
      "so.ncp": "NCP", "so.scp": "SCP", "so.ce": "Celestial Equator",
      "so.eq": "Equinox Path", "so.ss": "Summer Solstice Path", "so.ws": "Winter Solstice Path",
      "so.N": "N", "so.E": "E", "so.S": "S", "so.W": "W"
    },
    id: {
      "so.ctl": "Lintang", "so.lat": "lintang",
      "so.steps": "Bangun langitnya",
      "so.s1": "Tahap 1: tampilkan kutub", "so.s2": "Tahap 2: tampilkan ekuator langit",
      "so.s3": "Tahap 3: tampilkan jalur ekuinoks", "so.s4": "Tahap 4: tampilkan jalur soltis",
      "so.rNCP": "kutub langit utara", "so.rNoon": "ketinggian matahari tengah hari saat ekuinoks",
      "so.rSum": "saat soltis musim panas", "so.rWin": "saat soltis musim dingin",
      "so.hint": "Seret bolanya untuk mengubah arah pandang. Jalur harian Matahari selalu sejajar ekuator langit — hanya deklinasinya yang berubah sepanjang tahun.",
      "so.ncp": "KLU", "so.scp": "KLS", "so.ce": "Ekuator Langit",
      "so.eq": "Jalur Ekuinoks", "so.ss": "Jalur Soltis Musim Panas", "so.ws": "Jalur Soltis Musim Dingin",
      "so.N": "U", "so.E": "T", "so.S": "S", "so.W": "B"
    }
  },
  about: {
    en: "<p>Build the sky up one piece at a time and the Sun's motion stops being mysterious. First the celestial poles: the sky turns about the line through them, and the visible pole sits at an altitude equal to your latitude. Then the celestial equator, the circle exactly 90° from both poles, which meets your horizon due east and due west whatever your latitude.</p>" +
        "<p>On the equinoxes the Sun sits on the celestial equator, so it rises due east, sets due west, and is up for twelve hours. On the solstices it runs a parallel circle 23.4° above or below — rising and setting well north or well south of east and west, and spending correspondingly more or less of the circle above the horizon.</p>" +
        "<p>Every daily path is parallel to the celestial equator, tilted from vertical by your latitude. Slide the latitude and watch the whole structure tip: at the pole the paths lie flat and the Sun circles without setting, and at the equator they stand upright and every day is twelve hours long.</p>",
    id: "<p>Bangunlah langit sepotong demi sepotong, maka gerak Matahari tak lagi terasa membingungkan. Mula-mula kutub langit: langit berputar pada garis yang menembus keduanya, dan kutub yang tampak berada pada ketinggian yang sama dengan lintang Anda. Lalu ekuator langit, lingkaran yang tepat 90° dari kedua kutub, yang memotong ufuk Anda tepat di timur dan tepat di barat berapa pun lintangnya.</p>" +
        "<p>Pada ekuinoks Matahari berada di ekuator langit, sehingga ia terbit tepat di timur, terbenam tepat di barat, dan berada di atas ufuk selama dua belas jam. Pada soltis ia menempuh lingkaran sejajar 23,4° di atas atau di bawahnya — terbit dan terbenam jauh di utara atau jauh di selatan titik timur dan barat, dan menghabiskan bagian lingkaran yang lebih besar atau lebih kecil di atas ufuk.</p>" +
        "<p>Setiap jalur harian sejajar ekuator langit, condong dari tegak sebesar lintang Anda. Geser lintangnya dan amati seluruh susunan itu miring: di kutub jalur-jalur itu mendatar dan Matahari beredar tanpa terbenam, sedangkan di ekuator jalur-jalur itu tegak dan setiap hari berlangsung dua belas jam.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var C = { x: 300, y: 296 }, R = 250;          // the SWF's size 250 at twice the scale
    var theta = 160, phi = 40, lat = 41, drag = null;   // viewerAzimuth 200 → theta 160
    var step = { one: false, two: false, three: false, four: false };

    S.group("so.ctl");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "so.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.slider({ labelKey: "so.lat", min: -90, max: 90, value: 41, step: 1,
      format: function (v) { return Math.abs(v).toFixed(0) + "° " + (v < 0 ? "S" : "N"); },
      on: function (v) { lat = v; upd(); } });
    S.group("so.steps");
    [["one", "so.s1"], ["two", "so.s2"], ["three", "so.s3"], ["four", "so.s4"]]
      .forEach(function (p) {
        S.toggle({ labelKey: p[1], value: false,
          on: (function (k) { return function (b) { step[k] = b; S.requestDraw(); }; })(p[0]) });
      });
    var outNCP = S.readout({ labelKey: "so.rNCP" });
    var outNoon = S.readout({ labelKey: "so.rNoon" });
    var outSum = S.readout({ labelKey: "so.rSum" });
    var outWin = S.readout({ labelKey: "so.rWin" });

    function noon(dec) {
      var a = 90 - Math.abs(lat - dec);
      return (a > 90 ? 180 - a : a).toFixed(1) + "°";
    }
    function upd() {
      outNCP(Math.abs(lat).toFixed(0) + "° " + I18N.t(lat >= 0 ? "so.N" : "so.S"));
      outNoon(noon(0));
      outSum(noon(23.5));
      outWin(noon(-23.5));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---------------- the CelestialSphere projection (doA / doM / doB) ------- */
    var M;
    function mats() {
      var ct = Math.cos(theta * RAD), st = Math.sin(theta * RAD);
      var cp = Math.cos(phi * RAD), sp = Math.sin(phi * RAD);
      var a = { a0: -R * st, a1: R * ct, a3: R * ct * sp, a4: R * st * sp, a5: -R * cp,
        a6: R * ct * cp, a7: R * st * cp, a8: R * sp };
      var L = lat * RAD;
      var m2 = Math.cos(L), m3 = 0, m4 = -1, m8 = Math.sin(L);
      var m = { m0: m4 * m8, m1: 0, m2: m2, m3: m3, m4: m4, m6: -m2 * m4, m7: 0, m8: m8 };
      var b = {
        b0: a.a0 * m.m0 + a.a1 * m.m3, b1: a.a0 * m.m1 + a.a1 * m.m4, b2: a.a0 * m.m2,
        b3: a.a3 * m.m0 + a.a4 * m.m3 + a.a5 * m.m6, b4: a.a3 * m.m1 + a.a4 * m.m4 + a.a5 * m.m7,
        b5: a.a3 * m.m2 + a.a5 * m.m8,
        b6: a.a6 * m.m0 + a.a7 * m.m3 + a.a8 * m.m6, b7: a.a6 * m.m1 + a.a7 * m.m4 + a.a8 * m.m7,
        b8: a.a6 * m.m2 + a.a8 * m.m8 };
      return { a: a, m: m, b: b };
    }
    function vh(v, r) {
      var a = M.a, k = (r === undefined ? R : r) / R;
      return { x: C.x + (v.x * a.a0 + v.y * a.a1) * k,
        y: C.y + (v.x * a.a3 + v.y * a.a4 + v.z * a.a5) * k,
        z: (v.x * a.a6 + v.y * a.a7 + v.z * a.a8) * k };
    }
    function vc(v, r) {
      var b = M.b, k = (r === undefined ? R : r) / R;
      return { x: C.x + (v.x * b.b0 + v.y * b.b1 + v.z * b.b2) * k,
        y: C.y + (v.x * b.b3 + v.y * b.b4 + v.z * b.b5) * k,
        z: (v.x * b.b6 + v.y * b.b7 + v.z * b.b8) * k };
    }
    function cart(ra, dec) {
      var d = dec * RAD, h = ra * 15 * RAD;
      return { x: Math.cos(d) * Math.cos(h), y: Math.cos(d) * Math.sin(h), z: Math.sin(d) };
    }
    function hCart(az, alt) {
      var A = -az * RAD, h = alt * RAD;
      return { x: Math.cos(h) * Math.cos(A), y: Math.cos(h) * Math.sin(A), z: Math.sin(h) };
    }

    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (Math.hypot(p.x - C.x, p.y - C.y) > R * 1.25) return;
      drag = { x: p.x, y: p.y, th: theta, ph: phi };
      S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev), k = DEG / R;
      theta = (((drag.th - k * (p.x - drag.x)) % 360) + 360) % 360;
      phi = Math.max(5, Math.min(90, drag.ph + k * (p.y - drag.y)));
      upd();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; });
    });

    /* ================================= drawing ============================== */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      M = mats();
      S.clear();
      ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, S.W, S.H);
      axis(ctx, false);
      ctx.save(); disc(ctx);
      circles(ctx, false);
      ctx.restore();
      shading(ctx);
      ctx.save(); disc(ctx);
      circles(ctx, true, false);                    // the front face, below the horizon
      ctx.restore();
      plane(ctx, tr);
      figure(ctx);
      ctx.save(); disc(ctx);
      circles(ctx, true, true);                     // and above it, over the plane
      ctx.restore();
      axis(ctx, true);
      labels(ctx, tr);
    });
    function disc(ctx) { ctx.beginPath(); ctx.arc(C.x, C.y, R, 0, TAU); ctx.clip(); }
    function shading(ctx) {                         // 'sphere outside', front, inner
      var g = ctx.createRadialGradient(C.x, C.y, 0, C.x, C.y, R);
      g.addColorStop(0, "rgba(46,46,46,0.55)"); g.addColorStop(1, "rgba(70,70,70,0.75)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(C.x, C.y, R, 0, TAU); ctx.fill();
    }
    function altOf(p) {                             // the horizon z of a celestial point
      var m = M.m;
      return p.x * m.m6 + p.y * m.m7 + p.z * m.m8;
    }
    function ring(ctx, dec, front, colour, width, alpha, above) {
      ctx.strokeStyle = colour; ctx.lineWidth = width; ctx.globalAlpha = alpha;
      ctx.beginPath();
      var open = false, prev = null;
      for (var i = 0; i <= 240; i++) {
        var p = cart(i / 240 * 24, dec);
        var q = vc(p);
        if (above !== undefined && (altOf(p) >= 0) !== above) { open = false; prev = q; continue; }
        if ((q.z >= 0) !== front) { open = false; prev = q; continue; }
        if (!open) {
          if (prev) {
            var k = prev.z / (prev.z - q.z);
            ctx.moveTo(prev.x + (q.x - prev.x) * k, prev.y + (q.y - prev.y) * k);
          } else ctx.moveTo(q.x, q.y);
          open = true;
        } else ctx.lineTo(q.x, q.y);
        prev = q;
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    }
    function meridian(ctx, raH, front, above) {     // tilt 90 circles, white at 20 %
      ctx.strokeStyle = "#ffffff"; ctx.globalAlpha = 0.20; ctx.lineWidth = 1;
      ctx.beginPath();
      var open = false;
      for (var i = 0; i <= 240; i++) {
        var g = i / 240 * TAU;
        var v = { x: Math.cos(raH * 15 * RAD) * Math.cos(g),
          y: Math.sin(raH * 15 * RAD) * Math.cos(g), z: Math.sin(g) };
        var q = vc(v);
        if (above !== undefined && (altOf(v) >= 0) !== above) { open = false; continue; }
        if ((q.z >= 0) !== front) { open = false; continue; }
        if (!open) { ctx.moveTo(q.x, q.y); open = true; } else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    }
    /* `above` splits the front face at the horizon so the opaque plane hides the
       part of each path that is below it, as the SWF's own layering does      */
    function circles(ctx, front, above) {
      meridian(ctx, 0, front, above); meridian(ctx, 6, front, above);
      if (step.two) ring(ctx, 0, front, "#ffe375", 3, 1, above);
      if (step.three) ring(ctx, 0.0, front, "#ff0000", 3, step.two ? 0.85 : 1, above);
      if (step.four) {
        ring(ctx, 23.5, front, "#ff0000", 3, 1, above);
        ring(ctx, -23.5, front, "#ff0000", 3, 1, above);
      }
    }
    function axis(ctx, front) {                     // ncpAxis / scpAxis, 3 px #75a9ff
      if (!step.one) return;
      ctx.strokeStyle = "#75a9ff"; ctx.lineWidth = 3;
      [1, -1].forEach(function (k) {
        var p1 = vc({ x: 0, y: 0, z: 0 }), p2 = vc({ x: 0, y: 0, z: 1.2 * k });
        if ((p2.z >= 0) !== front) return;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      });
    }
    function plane(ctx, tr) {
      var e = vh(hCart(90, 0)), n = vh(hCart(0, 0));
      var ex = e.x - C.x, ey = e.y - C.y, nx = n.x - C.x, ny = n.y - C.y;
      ctx.save();
      ctx.transform(ex / 100, ey / 100, -nx / 100, -ny / 100, C.x, C.y);
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 101.4);
      g.addColorStop(0, "#83c483"); g.addColorStop(1, "#6aa86a");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fill();
      ctx.fillStyle = "#e8e8e8"; ctx.font = "bold 15px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(tr("so.N"), 0, -73.85);
      ctx.fillText(tr("so.S"), 0, 86.15);
      ctx.fillText(tr("so.E"), 81.93, 6.35);
      ctx.fillText(tr("so.W"), -77.08, 6.35);
      ctx.restore();
    }
    /* Stickman: addObject('Stickman', {system:'horizon', x:0, y:0, z:0}) with
       setOrientationType('skewed', {az:0, alt:90}). The engine's oType 1 does
       two things with that zenith vector, not one:

         shell._rotation = atan2(sp_o.y - sp.y, sp_o.x - sp.x) + 90
         shell._yscale   = sqrt(1 - opz² / r²)        // opz = o · (a6,a7,a8)

       The second is the whole point — the figure foreshortens as the viewpoint
       rises, so it flattens onto the horizon plane instead of standing at a
       fixed height while the plane tilts underneath it. Normalising the
       projected zenith to a unit vector discarded exactly that term.        */
    function figure(ctx) {
      var zen = vh(hCart(0, 90));                   // the zenith, projected
      var opz = zen.z / R;
      var squash = Math.sqrt(Math.max(0, 1 - opz * opz));
      var dx = zen.x - C.x, dy = zen.y - C.y;
      /* straight overhead the zenith projects onto the centre, where atan2(0,0)
         would swing the angle by 90°; squash is 0 there anyway, so hold it flat */
      var A = Math.hypot(dx, dy) < 1e-6 ? 0 : Math.atan2(dy, dx) + Math.PI / 2;
      ctx.save();
      ctx.translate(C.x, C.y);
      ctx.rotate(A);
      ctx.scale(1, squash);
      ctx.scale(1.3, 1.3);
      ctx.strokeStyle = "#5a3f7a"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, -7); ctx.lineTo(0, -21);
      ctx.moveTo(-7, -12); ctx.lineTo(7, -12);
      ctx.moveTo(0, -7); ctx.lineTo(-5, 0);
      ctx.moveTo(0, -7); ctx.lineTo(5, 0);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -24.5, 3.5, 0, TAU);
      ctx.fillStyle = "#c9b4e0"; ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    /* addDeclinationText(): the caption is set letter by letter along its own
       declination circle, each glyph lying in the sphere's tangent plane, and
       running the other way round once the observer crosses the equator.      */
    function arcText(ctx, text, dec, raCentre, colour, size) {
      ctx.font = "bold " + size + "px " + FONT;
      var widths = [], total = 0, i;
      for (i = 0; i < text.length; i++) {
        widths.push(ctx.measureText(text[i]).width);
        total += widths[i];
      }
      var gap = 0.5 * ctx.measureText(" ").width;
      total += gap * (text.length - 1);
      var r = Math.cos(dec * RAD) * R;
      var sign = lat > 0 ? 1 : -1;
      var cursor = -total / 2;
      for (i = 0; i < text.length; i++) {
        var mid = cursor + widths[i] / 2;
        var raOff = sign * (mid / r) * DEG / 15;
        var p = cart(raCentre + raOff, dec);
        var q = vc(p);
        if (q.z < 0) { cursor += widths[i] + gap; continue; }
        var frame = tangent(p, sign);
        ctx.save();
        ctx.transform(frame[0], frame[1], frame[2], frame[3], q.x, q.y);
        ctx.fillStyle = colour;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
        cursor += widths[i] + gap;
      }
    }
    function tangent(n, sign) {
      var up = { x: 0, y: 0, z: sign };              // 'absolute' with the pole as up
      var d = up.z * n.z;
      var u = { x: -d * n.x, y: -d * n.y, z: up.z - d * n.z };
      var l = Math.hypot(u.x, u.y, u.z) || 1;
      u = { x: u.x / l, y: u.y / l, z: u.z / l };
      var w = { x: u.y * n.z - u.z * n.y, y: u.z * n.x - u.x * n.z, z: u.x * n.y - u.y * n.x };
      var W = vc(w), U = vc(u);
      var m = [(W.x - C.x) / R, (W.y - C.y) / R, -(U.x - C.x) / R, -(U.y - C.y) / R];
      if (m[0] * m[3] - m[1] * m[2] < 0) { m[0] = -m[0]; m[1] = -m[1]; }
      return m;
    }
    function labels(ctx, tr) {
      if (step.one) {
        [[85, "so.ncp"], [-85, "so.scp"]].forEach(function (o) {
          arcText(ctx, tr(o[1]), o[0], 0, "#a8c8ff", 15);
          arcText(ctx, tr(o[1]), o[0], 12, "#a8c8ff", 15);
        });
      }
      if (step.three) arcText(ctx, tr("so.eq"), 0.7, 0, "#ff6666", 14);
      else if (step.two) arcText(ctx, tr("so.ce"), 0.7, 0, "#ffe375", 14);
      if (step.four) {
        arcText(ctx, tr("so.ss"), 23.5, 0, "#ff6666", 14);
        arcText(ctx, tr("so.ws"), -23.5, 0, "#ff6666", 14);
      }
    }

    upd();
  }
});
