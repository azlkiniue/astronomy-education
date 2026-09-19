/* The Big Dipper in Three Dimensions --------------------------------------------
   Faithful rebuild of the ClassAction "bigdipper.swf", which drives UNL's
   CelestialSphere engine. The seven stars of the Dipper are placed at their real
   distances (78 to 124 light years) and the patch of sky they fall on is drawn at
   unit distance. Lines run from Earth's position out through each star to the
   point on the sky where we see it.

   Drag the diagram to swing the viewpoint: from Earth the stars line up into the
   familiar saucepan, but from any other angle the pattern falls apart. The
   projection maths, the drag limits (theta 122–247, phi ±36) and the RA/Dec grid
   are the SWF's own.                                                           */
Sim.create({
  id: "bigdipper",
  width: 650, height: 480,
  strings: {
    en: {
      "bd.view": "View", "bd.drag": "click and drag on the diagram to change the orientation",
      "bd.earth": "Earth's Position", "bd.names": "star names and distances", "bd.reset": "Reset the view",
      "bd.rTheta": "viewing angle", "bd.rPhi": "elevation", "bd.ly": " ly",
      "bd.turn": "turn", "bd.tilt": "tilt",
      "st.dubhe": "Dubhe", "st.merak": "Merak", "st.phecda": "Phecda", "st.megrez": "Megrez",
      "st.alioth": "Alioth", "st.mizar": "Mizar", "st.alkaid": "Alkaid"
    },
    id: {
      "bd.view": "Tampilan", "bd.drag": "klik dan seret diagram untuk mengubah arah pandang",
      "bd.earth": "Posisi Bumi", "bd.names": "nama dan jarak bintang", "bd.reset": "Atur ulang tampilan",
      "bd.rTheta": "sudut pandang", "bd.rPhi": "ketinggian", "bd.ly": " thn cahaya",
      "bd.turn": "putar", "bd.tilt": "miring",
      "st.dubhe": "Dubhe", "st.merak": "Merak", "st.phecda": "Phecda", "st.megrez": "Megrez",
      "st.alioth": "Alioth", "st.mizar": "Mizar", "st.alkaid": "Alkaid"
    }
  },
  about: {
    en: "<p>A constellation is a line of sight, not a place. The Big Dipper looks like a single object because we only ever see it flattened onto the sky — but Alkaid at the end of the handle is 104 light years away while Merak in the bowl is 79, and the stars sit in between at every distance.</p>" +
        "<p>Swing the viewpoint away from Earth and the saucepan dissolves into a scatter. Any observer more than a few tens of light years from here would see seven unremarkable stars in seven unrelated directions, and would draw entirely different pictures in their sky.</p>" +
        "<p>There is a real group hidden in there, though. Five of the seven — all but Dubhe and Alkaid — belong to the <strong>Ursa Major moving group</strong>, a loose cluster of stars born together about 300 million years ago and still drifting through the galaxy on parallel paths. The other two are passing strangers, so over the next hundred thousand years the bowl and handle will visibly bend out of shape.</p>",
    id: "<p>Rasi bintang adalah garis pandang, bukan tempat. Biduk tampak seperti satu objek karena kita hanya pernah melihatnya terpipihkan pada bidang langit — padahal Alkaid di ujung gagang berjarak 104 tahun cahaya sedangkan Merak di bagian mangkuk 79 tahun cahaya, dan bintang-bintang lain tersebar di antaranya.</p>" +
        "<p>Geser sudut pandang menjauh dari Bumi dan bentuk panci itu luruh menjadi taburan acak. Pengamat yang berjarak lebih dari beberapa puluh tahun cahaya dari sini akan melihat tujuh bintang biasa di tujuh arah yang tak berkaitan, dan menggambar pola yang sama sekali berbeda di langitnya.</p>" +
        "<p>Meski begitu, ada kelompok sejati yang tersembunyi di sana. Lima dari tujuh bintang — semua kecuali Dubhe dan Alkaid — termasuk <strong>gugus bergerak Ursa Major</strong>, kelompok longgar yang lahir bersama sekitar 300 juta tahun lalu dan masih melayang sejajar menembus galaksi. Dua sisanya hanya kebetulan lewat, sehingga dalam seratus ribu tahun mendatang mangkuk dan gagangnya akan tampak berubah bentuk.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180;
    var R = 500;                                      // sphere.size 1000 → _c.r
    var LAT = 35 * RAD, STIME = 0;                    // sphere.latitude / siderealTime
    var CX = 325, CY = 240, UNIT = 250;               // sphereUnitRadius: r is given in light years / 250
    var THETA0 = 221.2, PHI0 = -8.6, T_MIN = 122, T_MAX = 247, P_LIM = 36;
    var FONT = "Verdana, Geneva, sans-serif";
    var MIN_STEP = 0.785398;                          // CSCirclesClass._minStep

    var STARS = [
      { key: "st.dubhe", ly: 123.6, ra: 11.0622, dec: 61.7509 },
      { key: "st.merak", ly: 79.4, ra: 11.0307, dec: 56.3824 },
      { key: "st.phecda", ly: 83.7, ra: 11.8972, dec: 53.6947 },
      { key: "st.megrez", ly: 81.4, ra: 12.2571, dec: 57.0326 },
      { key: "st.alioth", ly: 80.9, ra: 12.9005, dec: 55.9599 },
      { key: "st.mizar", ly: 78.2, ra: 13.3987, dec: 54.9254 },
      { key: "st.alkaid", ly: 100.7, ra: 13.7924, dec: 49.3134 }
    ];
    // the sky patch and the grid, exactly as the SWF adds them
    var PATCH = [
      { dec: -64, ra: 0, tilt: 180, g0: 147, g1: 198 }, { dec: 0, ra: 22.8, tilt: 90, g0: 116, g1: 133 },
      { dec: 47, ra: 0, tilt: 0, g0: 162, g1: 213 }, { dec: 0, ra: 14.2, tilt: 90, g0: 47, g1: 64 }
    ];
    var GRID = [
      { dec: 50, ra: 0, tilt: 0, g0: 162, g1: 213 }, { dec: 55, ra: 0, tilt: 0, g0: 162, g1: 213 },
      { dec: 60, ra: 0, tilt: 0, g0: 162, g1: 213 }, { dec: 0, ra: 14, tilt: 90, g0: 47, g1: 64 },
      { dec: 0, ra: 13, tilt: 90, g0: 47, g1: 64 }, { dec: 0, ra: 12, tilt: 90, g0: 47, g1: 64 },
      { dec: 0, ra: 11, tilt: 90, g0: 47, g1: 64 }
    ];
    var LABELS = [
      { text: "50°", dec: 50, ra: 10.55 }, { text: "55°", dec: 55, ra: 10.55 }, { text: "60°", dec: 60, ra: 10.55 },
      { text: "11h", dec: 65.3, ra: 11 }, { text: "12h", dec: 65.3, ra: 12 },
      { text: "13h", dec: 65.3, ra: 13 }, { text: "14h", dec: 65.3, ra: 14 }
    ];

    var theta = THETA0, phi = PHI0, showNames = false, b = null, drag = null;

    S.group("bd.view");
    S.toggle({ labelKey: "bd.names", value: showNames, on: function (v) { showNames = v; S.requestDraw(); } });
    S.button({ labelKey: "bd.reset", on: function () { theta = THETA0; phi = PHI0; upd(); } });
    var outTheta = S.readout({ labelKey: "bd.rTheta" });
    var outPhi = S.readout({ labelKey: "bd.rPhi" });

    /* ---- the engine: celestial → screen is one 3×3 matrix (doA · doM = doB) ---- */
    function matrix() {
      var ct = Math.cos(theta * RAD), st = Math.sin(theta * RAD);
      var cp = Math.cos(phi * RAD), sp = Math.sin(phi * RAD);
      var a0 = -R * st, a1 = R * ct;
      var a3 = R * ct * sp, a4 = R * st * sp, a5 = -R * cp;
      var a6 = R * ct * cp, a7 = R * st * cp, a8 = R * sp;
      var m2 = Math.cos(LAT), m3 = Math.sin(STIME), m4 = -Math.cos(STIME), m8 = Math.sin(LAT);
      var m0 = m4 * m8, m1 = -m3 * m8, m6 = -m2 * m4, m7 = m2 * m3;
      return {
        b0: a0 * m0 + a1 * m3, b1: a0 * m1 + a1 * m4, b2: a0 * m2,
        b3: a3 * m0 + a4 * m3 + a5 * m6, b4: a3 * m1 + a4 * m4 + a5 * m7, b5: a3 * m2 + a5 * m8,
        b6: a6 * m0 + a7 * m3 + a8 * m6, b7: a6 * m1 + a7 * m4 + a8 * m7, b8: a6 * m2 + a8 * m8
      };
    }
    function cart(ra, dec, r) {                        // celestial polar → cartesian
      var d = dec * RAD, h = ra * 15 * RAD;
      return { x: r * Math.cos(d) * Math.cos(h), y: r * Math.cos(d) * Math.sin(h), z: r * Math.sin(d) };
    }
    function proj(p) {                                 // CtoS
      return { x: p.x * b.b0 + p.y * b.b1 + p.z * b.b2, y: p.x * b.b3 + p.y * b.b4 + p.z * b.b5 };
    }
    var origin = { x: 0, y: 0 };                       // the screen offset that centres the view
    function scr(p) { var s = proj(p); return { x: origin.x + s.x, y: origin.y + s.y }; }
    // a circle on the sphere: P(g) = W·(cos g, sin g, 1), with W built from dec/ra/tilt (doW)
    function basis(c) {
      var t = c.tilt * RAD, l = c.dec * RAD, be = c.ra * 15 * RAD;
      var st = Math.sin(t), ct = Math.cos(t), sb = Math.sin(be), cb = Math.cos(be);
      var cl = Math.cos(l), sl = Math.sin(l);
      return {
        A: { x: cl * cb, y: cl * sb, z: 0 },
        B: { x: -cl * sb * ct, y: cl * cb * ct, z: cl * st },
        C: { x: sl * sb * st, y: -sl * cb * st, z: sl * ct }
      };
    }
    function arcPath(ctx, c, move) {                   // the SWF's curveTo sampling, in screen space
      var w = basis(c), g1 = c.g0 * RAD, g2 = c.g1 * RAD;
      if (g2 < g1) g2 += TAU;
      var arc = g2 - g1 || TAU, n = Math.ceil(arc / MIN_STEP), step = arc / n, half = step / 2;
      var cRad = 1 / Math.cos(half);
      function at(g, rad) {
        var cg = (rad || 1) * Math.cos(g), sg = (rad || 1) * Math.sin(g);
        return scr({ x: w.A.x * cg + w.B.x * sg + w.C.x, y: w.A.y * cg + w.B.y * sg + w.C.y, z: w.A.z * cg + w.B.z * sg + w.C.z });
      }
      var p0 = at(g1);
      if (move) ctx.moveTo(p0.x, p0.y);
      for (var i = 0, g = g1 + step, gm = g1 + half; i < n; i++, g += step, gm += step) {
        var cp = at(gm, cRad), ap = at(g);
        ctx.quadraticCurveTo(cp.x, cp.y, ap.x, ap.y);
      }
    }

    function upd() {
      outTheta(theta.toFixed(1) + "°");
      outPhi(phi.toFixed(1) + "°");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- dragArea: 1 px of drag turns the view by 57.2958 / (size/2) degrees ---- */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (Math.abs(p.x - CX) > 325 || Math.abs(p.y - 225) > 225) return;
      drag = { x: p.x, y: p.y, theta: theta, phi: phi };
      S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev), k = 57.2958 / R;
      theta = Math.min(T_MAX, Math.max(T_MIN, (((drag.theta + k * (p.x - drag.x)) % 360) + 360) % 360));
      phi = Math.max(-P_LIM, Math.min(P_LIM, drag.phi - k * (p.y - drag.y)));
      upd();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; });
    });

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      b = matrix();
      var c = proj(cart(12.5, 55, 0.5));               // centerPoint holds still at (325, 240)
      origin = { x: CX - c.x, y: CY - c.y };
      S.clear();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, S.W, S.H);

      ctx.beginPath();                                  // drawPatch()
      PATCH.forEach(function (arc, i) { arcPath(ctx, arc, i === 0); });
      ctx.closePath();
      ctx.fillStyle = "rgba(109,139,188,0.6)"; ctx.fill();

      ctx.strokeStyle = "#e0e0e0"; ctx.lineWidth = 1;
      GRID.forEach(function (g) { ctx.beginPath(); arcPath(ctx, g, true); ctx.stroke(); });

      var earth = scr({ x: 0, y: 0, z: 0 });
      ctx.strokeStyle = "rgba(0,0,0,0.15)"; ctx.lineWidth = 1;   // the sight lines, alpha 15
      STARS.forEach(function (s) {
        var sky = scr(cart(s.ra, s.dec, 1));
        ctx.beginPath(); ctx.moveTo(earth.x, earth.y); ctx.lineTo(sky.x, sky.y); ctx.stroke();
      });

      STARS.forEach(function (s) {                      // "star point": a 4 px black square
        var p = scr(cart(s.ra, s.dec, s.ly / UNIT));
        ctx.fillStyle = "#000000"; ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        if (showNames) {
          ctx.font = "10px " + FONT; ctx.fillStyle = "#444444";
          ctx.textAlign = "left"; ctx.textBaseline = "bottom";
          ctx.fillText(t(s.key) + " · " + s.ly + t("bd.ly"), p.x + 5, p.y - 3);
        }
      });

      STARS.forEach(function (s) { star(ctx, scr(cart(s.ra, s.dec, 1))); });

      ctx.fillStyle = "#666666"; ctx.font = "12px " + FONT;      // the grid labels lie on the sphere
      LABELS.forEach(function (l) { flat(ctx, l); });

      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1;            // "earth label": an arrow and a caption
      ctx.beginPath();
      ctx.moveTo(earth.x, earth.y + 26.2); ctx.lineTo(earth.x, earth.y + 2.2);
      ctx.moveTo(earth.x - 4.5, earth.y + 8); ctx.lineTo(earth.x, earth.y + 2.2);
      ctx.lineTo(earth.x + 4.5, earth.y + 8);
      ctx.stroke();
      ctx.fillStyle = "#000000"; ctx.font = "10px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(t("bd.earth"), earth.x + 5, earth.y + 30);

      ctx.font = "italic 12px " + FONT; ctx.fillStyle = "#000000";
      ctx.textAlign = "right"; ctx.textBaseline = "alphabetic";
      ctx.fillText(t("bd.drag"), 648, 470);
    });

    // "CS Star": a 21 px star, white-to-#e4e466 radial fill, 1 px grey outline
    function star(ctx, p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.beginPath();
      for (var i = 0; i < 16; i++) {
        var a = i * Math.PI / 8 - Math.PI / 2, r = i % 2 ? 4.2 : 10.5;
        ctx[i ? "lineTo" : "moveTo"](r * Math.cos(a), r * Math.sin(a));
      }
      ctx.closePath();
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 10.5);
      g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#e4e466");
      ctx.fillStyle = g; ctx.fill();
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }

    // a label pinned flat to the sphere: its screen frame is the projection of the
    // tangent vectors east/north at that point ("absolute" orientation in the SWF)
    function flat(ctx, l) {
      var p = cart(l.ra, l.dec, 1), o = scr(p);
      var d = l.dec * RAD, h = l.ra * 15 * RAD;
      var north = { x: -Math.sin(d) * Math.cos(h), y: -Math.sin(d) * Math.sin(h), z: Math.cos(d) };
      var east = { x: -Math.sin(h), y: Math.cos(h), z: 0 };
      var pe = proj(east), pn = proj(north);
      var k = 1 / R;                                   // the tangent vectors are unit length
      var a = pe.x * k, bb = pe.y * k, c = -pn.x * k, d = -pn.y * k;
      if (a * d - bb * c < 0) { a = -a; bb = -bb; }    // we see the sphere's inside: mirror to keep it legible
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      var dpr = S.canvas.width / S.W;
      ctx.scale(dpr, dpr);
      ctx.transform(a, bb, c, d, o.x, o.y);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = "#666666"; ctx.font = "12px " + FONT;
      ctx.fillText(l.text, 0, 0);
      ctx.restore();
    }

    upd();
  }
});
