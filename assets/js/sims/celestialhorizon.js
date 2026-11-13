/* Celestial and Horizon Systems Comparison -------------------------------------
   Faithful rebuild of the ClassAction "celestialhorizon.swf" (decompiled: the
   sprite99 timeline plus the shared UNL CelestialSphere engine).

   One sphere, two ways of reading it. Press "switch" and the applet morphs
   between them over four seconds: the celestial view, where Earth is a small
   globe at the centre and the sky's grid is the celestial equator, and the
   horizon view, where you stand at the centre on a green horizon plane and the
   same sky has tilted by 90° − latitude.                                       */
Sim.create({
  id: "celestialhorizon",
  width: 600, height: 660,
  strings: {
    en: {
      "ch.ctl": "Controls", "ch.lat": "latitude", "ch.switch": "switch",
      "ch.celestial": "celestial sphere", "ch.horizon": "horizon diagram",
      "ch.view": "showing", "ch.ncp": "north celestial pole",
      "ch.tilt": "equator tilted from horizon",
      "ch.hint": "Drag the sphere to swing the viewpoint. Press switch to move between the two systems.",
      "ch.N": "N", "ch.E": "E", "ch.S": "S", "ch.W": "W"
    },
    id: {
      "ch.ctl": "Kendali", "ch.lat": "lintang", "ch.switch": "ganti",
      "ch.celestial": "bola langit", "ch.horizon": "diagram horizon",
      "ch.view": "menampilkan", "ch.ncp": "kutub langit utara",
      "ch.tilt": "ekuator condong dari horizon",
      "ch.hint": "Seret bolanya untuk mengubah arah pandang. Tekan ganti untuk berpindah antara kedua sistem.",
      "ch.N": "U", "ch.E": "T", "ch.S": "S", "ch.W": "B"
    }
  },
  about: {
    en: "<p>Astronomers describe the sky with two different grids and it takes a while to see that they are drawn on the same sphere. The <em>celestial</em> system is fixed to the stars: the celestial equator is Earth's equator projected outwards, and declination and right ascension behave like latitude and longitude on a globe that does not turn with you.</p>" +
        "<p>The <em>horizon</em> system is fixed to you: its equator is your horizon, its pole is your zenith, and it is different for every observer on Earth. Switching between the two is really a single rotation. Your zenith sits at declination equal to your latitude, so the celestial equator meets your horizon at an angle of 90° minus your latitude.</p>" +
        "<p>Watch what the extremes do. At the north pole the two grids coincide — the celestial pole is straight overhead and stars circle parallel to the horizon, never rising or setting. At the equator the grids are perpendicular, the celestial poles sit on the horizon, and every star rises straight up, is visible for twelve hours, and sets.</p>",
    id: "<p>Astronom memerikan langit dengan dua kisi yang berbeda, dan perlu waktu untuk menyadari bahwa keduanya tergambar pada bola yang sama. Sistem <em>langit</em> terpancang pada bintang: ekuator langit adalah ekuator Bumi yang diproyeksikan ke luar, dan deklinasi serta asensiorekta berperilaku seperti lintang dan bujur pada bola yang tidak ikut berputar bersama Anda.</p>" +
        "<p>Sistem <em>horizon</em> terpancang pada Anda: ekuatornya adalah ufuk Anda, kutubnya adalah zenit Anda, dan sistem ini berbeda bagi setiap pengamat di Bumi. Berpindah di antara keduanya sesungguhnya hanyalah satu rotasi. Zenit Anda berada pada deklinasi yang sama dengan lintang Anda, sehingga ekuator langit memotong ufuk Anda pada sudut 90° dikurangi lintang.</p>" +
        "<p>Perhatikan kedua ujungnya. Di kutub utara kedua kisi berimpit — kutub langit tepat di atas kepala dan bintang beredar sejajar ufuk, tak pernah terbit atau terbenam. Di ekuator kedua kisi saling tegak lurus, kutub langit berada di ufuk, dan setiap bintang terbit tegak lurus, tampak selama dua belas jam, lalu terbenam.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    /* The 400 × 440 stage is drawn at 1.5 ×, which puts the backing store at
       1200 × 1320 — about what a 2 × display needs at this layout's stage width.
       Going higher costs more than a 60 fps frame can pay for: at 1.75 × a
       quarter of the frames during the morph miss their deadline.              */
    var K = 1.5;
    var BOX = { x: 12, y: 12, w: 376, h: 376 };  // the black sky rectangle
    var C = { x: 201.3, y: 200 }, R = 150;       // celestialSphere: _c.r = 150
    var GLOBE_R = 40;                            // GlobeComponent._radius
    var MAX_GLOBE = 80, SIZE = 300;              // maxGlobeSize, celestialSphere.size
    var TRANSITION = 4000, FRAC = 0.75;          // sprite99's own constants

    /* updateCelestialDiagram() puts the tangent plane and the stick figure at
       r = t·maxGlobeSize / size, and the engine measures r in SPHERE RADII — so
       in pixels that is t·80/300·150 = t·40, exactly the globe's own radius.
       They ride on the globe's surface, which is what makes the plane appear to
       peel off it as the morph runs. Passing t·80 px puts them twice as far out
       and the plane floats away from the globe.                               */
    function standRadius() { return t * MAX_GLOBE / SIZE * R; }

    /* the engine's own viewpoint defaults: setThetaAndPhi(90, 30), siderealTime 0 */
    var theta = 90, phi = 30, lat = 41;
    var t = 1, s = 0;                 // transitionParameter, transitionParameter2
    var ticToc = 1, direction = 1, startTime = 0, running = false;
    var drag = null;

    S.group("ch.ctl");
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ch.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    var latCtl = S.slider({
      labelKey: "ch.lat", min: -90, max: 90, value: lat, step: 1,
      format: function (v) {
        return Math.abs(v) + "° " + (v < 0 ? I18N.t("ch.S") : I18N.t("ch.N"));
      },
      on: function (v) { lat = v; upd(); }
    });
    S.button({ labelKey: "ch.switch", primary: true, on: doTransition });
    var outView = S.readout({ labelKey: "ch.view" });
    var outNCP = S.readout({ labelKey: "ch.ncp" });
    var outTilt = S.readout({ labelKey: "ch.tilt" });

    /* ---- the four-second morph, exactly as onEnterFrameFunc ran it ------------
       going to the horizon diagram the globe shrinks first (75 % of the time),
       then the sphere swings from latitude 90 down to the observer's latitude;
       coming back it is the same two stages in the other order.               */
    function doTransition() {
      if (running) return;
      direction = -direction;
      startTime = performance.now() - TRANSITION * (1 - ticToc);
      running = true; drag = null;
      anim.play();
    }
    var anim = S.loop(function () {
      if (!running) return;
      ticToc = (performance.now() - startTime) / TRANSITION;
      if (ticToc > 1) { ticToc = 1; running = false; anim.pause(); }
      if (direction === -1) {                    // celestial → horizon
        if (ticToc < FRAC) { t = 1 - ticToc / FRAC; s = 0; }
        else { t = 0.001; s = (ticToc - FRAC) / (1 - FRAC); }
      } else {                                   // horizon → celestial
        if (ticToc < 1 - FRAC) { t = 0.001; s = 1 - ticToc / (1 - FRAC); }
        else { s = 0; t = (ticToc - (1 - FRAC)) / FRAC; }
      }
      if (!running) { t = direction === -1 ? 0.001 : 1; s = direction === -1 ? 1 : 0; }
      upd(true);                                 // S.loop draws for us

    });

    /* the latitude the SPHERE is drawn at, and the latitude the circles use */
    function sphereLat() { return 90 - (90 - lat) * s; }
    function circleLat() { return lat + (90 - lat) * s; }

    /* ================= the CelestialSphere projection (doA / doM / doB) ======= */
    var M;
    function mats() {
      var ct = Math.cos(theta * RAD), st = Math.sin(theta * RAD);
      var cp = Math.cos(phi * RAD), sp = Math.sin(phi * RAD);
      var a = { a0: -R * st, a1: R * ct, a3: R * ct * sp, a4: R * st * sp, a5: -R * cp,
        a6: R * ct * cp, a7: R * st * cp, a8: R * sp };
      var L = sphereLat() * RAD, sT = 0;         // siderealTime = 0 throughout
      var m2 = Math.cos(L), m3 = Math.sin(sT), m4 = -Math.cos(sT), m8 = Math.sin(L);
      var m = { m0: m4 * m8, m1: -m3 * m8, m2: m2, m3: m3, m4: m4,
        m6: -m2 * m4, m7: m2 * m3, m8: m8 };
      var b = {
        b0: a.a0 * m.m0 + a.a1 * m.m3, b1: a.a0 * m.m1 + a.a1 * m.m4, b2: a.a0 * m.m2,
        b3: a.a3 * m.m0 + a.a4 * m.m3 + a.a5 * m.m6, b4: a.a3 * m.m1 + a.a4 * m.m4 + a.a5 * m.m7,
        b5: a.a3 * m.m2 + a.a5 * m.m8,
        b6: a.a6 * m.m0 + a.a7 * m.m3 + a.a8 * m.m6, b7: a.a6 * m.m1 + a.a7 * m.m4 + a.a8 * m.m7,
        b8: a.a6 * m.m2 + a.a8 * m.m8 };
      return { a: a, m: m, b: b };
    }
    function vecH(v, r) {        // horizon-system vector → screen; r in px, default R
      var a = M.a, k = (r === undefined ? R : r) / R;
      return { x: (v.x * a.a0 + v.y * a.a1) * k,
        y: (v.x * a.a3 + v.y * a.a4 + v.z * a.a5) * k,
        z: (v.x * a.a6 + v.y * a.a7 + v.z * a.a8) * k };
    }
    function vecC(v) {
      var b = M.b;
      return { x: v.x * b.b0 + v.y * b.b1 + v.z * b.b2,
        y: v.x * b.b3 + v.y * b.b4 + v.z * b.b5,
        z: v.x * b.b6 + v.y * b.b7 + v.z * b.b8 };
    }
    function projH(v, r) { var q = vecH(v, r); return { x: C.x + q.x, y: C.y + q.y, z: q.z }; }
    function projC(v) { var q = vecC(v); return { x: C.x + q.x, y: C.y + q.y, z: q.z }; }
    function hCart(az, alt) {                    // _sys 0: beta = −az, lambda = alt
      var A = -az * RAD, h = alt * RAD;
      return { x: Math.cos(h) * Math.cos(A), y: Math.cos(h) * Math.sin(A), z: Math.sin(h) };
    }

    /* addCircle's doW: P(gamma) = A·cos g + B·sin g + C, gamma running gS → gE.
       The nine w terms depend only on the circle, so build them once per circle. */
    function doW(p) {
      var st = Math.sin(p.tilt * RAD), ct = Math.cos(p.tilt * RAD);
      var beta = p.sys ? p.ra * 15 * RAD : -p.az * RAD;
      var lam = (p.sys ? p.dec : p.alt) * RAD;
      var sb = Math.sin(beta), cb = Math.cos(beta);
      var cl = Math.cos(lam), sl = Math.sin(lam);
      return { w0: cl * cb, w1: -cl * sb * ct, w2: sl * sb * st,
        w3: cl * sb, w4: cl * cb * ct, w5: -sl * cb * st,
        w7: cl * st, w8: sl * ct };
    }
    function drawCircle(ctx, p, front, colour, alpha, width) {
      var gS = mod(p.gS === undefined ? 0 : p.gS, 360) * RAD;
      var gE = mod(p.gE === undefined ? 360 : p.gE, 360) * RAD;
      var span = p.gS === undefined ? TAU : mod((gE - gS) * DEG, 360) * RAD || TAU;
      var n = Math.max(24, Math.round(span / TAU * 160));
      var w = doW(p), cel = !!p.sys;
      ctx.strokeStyle = colour; ctx.globalAlpha = alpha; ctx.lineWidth = width;
      ctx.beginPath();
      var started = false, prev = null;
      for (var i = 0; i <= n; i++) {
        var g = gS + span * i / n, cg = Math.cos(g), sg = Math.sin(g);
        var v = { x: w.w0 * cg + w.w1 * sg + w.w2,
          y: w.w3 * cg + w.w4 * sg + w.w5,
          z: w.w7 * sg + w.w8 };
        var q = cel ? projC(v) : projH(v);
        if ((q.z >= 0) !== front) { started = false; prev = q; continue; }
        if (!started) {
          if (prev) {                            // meet the limb, not a step inside it
            var k = prev.z / (prev.z - q.z);
            ctx.moveTo(prev.x + (q.x - prev.x) * k, prev.y + (q.y - prev.y) * k);
          } else ctx.moveTo(q.x, q.y);
          started = true;
        }
        ctx.lineTo(q.x, q.y);
        prev = q;
      }
      ctx.stroke(); ctx.globalAlpha = 1;
    }
    function mod(n, m) { return ((n % m) + m) % m; }

    /* changeLatitude()'s five circles, in the engine's own parameter form */
    function circles() {
      var L = circleLat();
      return [
        { sys: 0, tilt: 90 - L, az: 90, alt: 0, c: "#ffffff", a: 0.30, w: 1 },              // horizon
        { sys: 0, tilt: 90, az: 180, alt: 0, gS: L - 90, gE: L + 90, c: "#ffffff", a: 0.30, w: 1 },
        { sys: 0, tilt: L < 0 ? -L : 180 - L, az: 90, alt: 0,
          gS: L < 0 ? 180 : 0, gE: L < 0 ? 0 : 180, c: "#ffffff", a: 0.30, w: 1 },
        { sys: 1, tilt: 90, dec: 0, ra: 0, gS: -90, gE: 90, c: "#ffe375", a: 0.70, w: 1 },  // 0 h
        { sys: 1, tilt: 0, dec: 0, ra: 0, c: "#ffe375", a: 0.70, w: 1 }                     // equator
      ];
    }

    /* ---------------------------- readouts + drag --------------------------- */
    var shown = {};
    function say(key, out, text) {               // a DOM write per frame costs a layout
      if (shown[key] === text) return;
      shown[key] = text; out(text);
    }
    function upd(skipDraw) {
      M = mats();
      say("view", outView, I18N.t(s > 0.5 ? "ch.horizon" : "ch.celestial"));
      say("ncp", outNCP, Math.abs(lat).toFixed(0) + "° " + (lat >= 0 ? I18N.t("ch.N") : I18N.t("ch.S")));
      say("tilt", outTilt, (90 - Math.abs(lat)).toFixed(0) + "°");
      if (!skipDraw) S.requestDraw();
    }
    S.refreshers.push(function () { shown = {}; upd(); });

    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width / K,
        y: (ev.clientY - r.top) * S.H / r.height / K };
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      if (running) return;
      var p = at(ev);
      if (Math.hypot(p.x - C.x, p.y - C.y) > R) return;
      drag = { x: p.x, y: p.y, theta: theta, phi: phi };
      S.canvas.setPointerCapture(ev.pointerId);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev), k = DEG / R;               // the engine's own 57.2958 / _c.r
      theta = mod(drag.theta - k * (p.x - drag.x), 360);
      phi = Math.max(-90, Math.min(90, drag.phi + k * (p.y - drag.y)));
      upd();
    });
    ["pointerup", "pointercancel"].forEach(function (e) {
      S.canvas.addEventListener(e, function () { drag = null; });
    });

    /* ================================= drawing ============================== */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      S.clear();
      ctx.save();
      ctx.scale(K, K);      // sim.js already applied the device-pixel transform
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 400, 440);
      ctx.fillStyle = "#000000"; ctx.fillRect(BOX.x, BOX.y, BOX.w, BOX.h);

      /* the engine's layer stack, back to front: back lines · back circle halves ·
         back inner shading · the inner objects, sorted by depth · front inner
         shading · front circle halves · front lines                            */
      var cs = circles(), sh = shading();
      ctx.save();
      ctx.beginPath(); ctx.rect(BOX.x, BOX.y, BOX.w, BOX.h); ctx.clip();

      axis(ctx, false);
      ctx.save(); disc(ctx);
      cs.forEach(function (p) { drawCircle(ctx, p, false, p.c, p.a, p.w); });
      ctx.drawImage(sh.back, C.x - R, C.y - R, 2 * R, 2 * R);
      ctx.restore();
      innerObjects(ctx, tr);
      ctx.save(); disc(ctx);
      ctx.drawImage(sh.front, C.x - R, C.y - R, 2 * R, 2 * R);
      cs.forEach(function (p) { drawCircle(ctx, p, true, p.c, p.a, p.w); });
      ctx.restore();
      axis(ctx, true);
      ctx.restore();

      arrowBar(ctx, tr);
      ctx.restore();
    });
    function disc(ctx) { ctx.beginPath(); ctx.arc(C.x, C.y, R, 0, TAU); ctx.clip(); }

    /* The sphere's shading, stacked as the SWF stacks it. initSphere puts a
       'Sphere Shading' clip (#e1e1e1 at alpha 18 → 31 → 44 of 255) in both the
       back and the front inner layer, and the engine gives every sphere a
       celestialBowl (white at alpha 0 in the middle → black at 20 % on the rim)
       in the front one, under that clip. So the back halves of the circles lie
       under one thin wash, the globe, plane and figure under the bowl and the
       other wash, and only the front halves and the near axis sit on top. The
       layers never change, so each is baked once — painting the gradients live
       costs about 4 ms a frame, which is most of a 60 fps budget.              */
    var shadeTiles = null;
    function shading() {
      if (shadeTiles) return shadeTiles;
      function tile(paint) {
        var c = document.createElement("canvas");
        c.width = c.height = 4 * R;               // 2 px per stage px
        var g = c.getContext("2d");
        g.scale(2, 2); g.translate(R, R);
        g.scale(R / 100, R / 100);               // shading clips are drawn at radius 100
        paint(g);
        return c;
      }
      function sphereShading(g) {                // 'Sphere Shading', shape 37
        var gr = g.createRadialGradient(0, 0, 0, 0, 0, 100.875);
        gr.addColorStop(0, "rgba(225,225,225," + 18 / 255 + ")");
        gr.addColorStop(176 / 255, "rgba(225,225,225," + 31 / 255 + ")");
        gr.addColorStop(1, "rgba(225,225,225," + 44 / 255 + ")");
        g.fillStyle = gr;
        g.beginPath(); g.arc(0, 0, 100, 0, TAU); g.fill();
      }
      function bowl(g) {                         // CSGradientDisk, as the engine sets it up
        var gr = g.createRadialGradient(0, 0, 0, 0, 0, 100);
        gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(0,0,0,0.2)");
        g.fillStyle = gr;
        g.beginPath(); g.arc(0, 0, 100, 0, TAU); g.fill();
      }
      shadeTiles = { back: tile(sphereShading),
        front: tile(function (g) { bowl(g); sphereShading(g); }) };
      return shadeTiles;
    }

    /* The three inner objects — tangent plane, stick figure and globe sphere —
       share one band (the horizon plane is hidden, so the engine folds 'above'
       into 'below'), and updateObjectsSort redraws that band back to front by
       screen depth on every update. The figure stands 0.001 further out than the
       plane, and changeLatitude parks the globe at z = ±0.001 on the observer's
       side of the equator: so the plane covers the globe while the observer
       faces you and slips behind it once they turn away.                     */
    function innerObjects(ctx, tr) {
      var L = circleLat(), n = hCart(180, L), r = t * MAX_GLOBE / SIZE;
      var planeZ = vecH(n).z * r;                // WtoSz's z of each position
      var list = [
        { z: planeZ, draw: function () { tangentPlane(ctx, tr, planeZ < 0); } },
        { z: vecH(n).z * (r + 0.001), draw: function () { stickfigure(ctx); } },
        { z: vecH({ x: 0, y: 0, z: L < 0 ? -0.001 : 0.001 }).z, draw: function () { globe(ctx); } }
      ];
      list.sort(function (a, b) { return a.z - b.z; });
      list.forEach(function (o) { o.draw(); });
    }
    function axis(ctx, front) {                  // ncpAxis / scpAxis, 2 px #75a9ff
      ctx.strokeStyle = "#75a9ff"; ctx.lineWidth = 2;
      [1, -1].forEach(function (k) {
        var p1 = projC({ x: 0, y: 0, z: k }), p2 = projC({ x: 0, y: 0, z: 1.2 * k });
        if ((p1.z >= 0) !== front) return;
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      });
    }

    /* The stick figure is a billboard: it stands along the projected local
       vertical and keeps its width across the screen, so it never collapses
       edge-on.                                                                */
    function standMatrix(n) {
      var N3 = vecH(n), vx = N3.x, vy = N3.y, vl = Math.hypot(vx, vy) || 1;
      vx /= vl; vy /= vl;
      return [vy, -vx, -vx, -vy];
    }

    /* setOrientationType('absolute'), as CSObjects.update builds it: the shell
       turns its y axis onto the projected normal and is squashed by the normal's
       depth — negative from below, which mirrors the art just as Flash does — and
       the instance turns inside it so the art's up points along u, the way to the
       zenith (here the celestial pole: local north at every latitude).         */
    function absoluteMatrix(n) {
      var u = n.x === 0 && n.y === 0 ? { x: 0, y: 1, z: 0 }
        : { x: -n.x * n.z, y: -n.y * n.z, z: n.x * n.x + n.y * n.y };
      var N = vecH(n), U = vecH(u), npz = N.z / R;
      var A = Math.atan2(N.y, N.x) + Math.PI / 2, cA = Math.cos(A), sA = Math.sin(A);
      var x1 = cA * U.x + sA * U.y, y1 = -sA * U.x + cA * U.y;
      var I = Math.atan2(y1 / npz, x1) + Math.PI / 2, cI = Math.cos(I), sI = Math.sin(I);
      return [cA * cI - npz * sA * sI, sA * cI + npz * cA * sI,     // rot(A)·scale(1, npz)·rot(I)
        -cA * sI - npz * sA * cI, -sA * sI + npz * cA * cI];
    }

    /* Tangent Plane: _xscale = size · (1 − t) / 2 %, so it is invisible in the
       celestial view and a full-radius horizon plane once the morph finishes,
       and _alpha = 40 + 0.6 · _xscale for the whole clip. Frame 1, seen from
       above, is the green CSAboveHorizonPlane with white labels; frame 2, seen
       from below, the dark CSBelowHorizonPlane with grey ones. The labels are
       the SWF's static text, 12 px bold Verdana, and scale with the plane.     */
    var PLANE_LABELS = [["ch.N", -0.075, -79.7], ["ch.S", -0.075, 89.3],   // run centres
      ["ch.E", 83.25, 5.35], ["ch.W", -83.025, 5.35]];
    function tangentPlane(ctx, tr, below) {
      var scale = SIZE * (1 - t) / 200;          // size 300 → 150 % at t = 0
      if (scale <= 0.01) return;
      var n = hCart(180, circleLat());
      var pos = projH(n, standRadius()), m = absoluteMatrix(n);
      ctx.save();
      ctx.transform(m[0], m[1], m[2], m[3], pos.x, pos.y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = Math.min(1, (40 + 60 * scale) / 100);
      var cx = below ? 0 : -0.05;                // where each frame places its disc
      if (below) ctx.fillStyle = "#006600";
      else {
        var g = ctx.createRadialGradient(cx, 0, 0, cx, 0, 101.4);
        g.addColorStop(0, "#51c451"); g.addColorStop(1, "#3aa53a");
        ctx.fillStyle = g;
      }
      ctx.beginPath(); ctx.arc(cx, 0, 100, 0, TAU); ctx.fill();
      var dx = below ? 1.15 : 1.1;               // Direction Labels Dark / Light
      ctx.fillStyle = below ? "#999999" : "#ffffff";
      ctx.font = "bold 12px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      PLANE_LABELS.forEach(function (l) { ctx.fillText(tr(l[0]), l[1] + dx, l[2]); });
      ctx.restore();
    }
    /* Stickfigure: _xscale = 100 − t·100, so it grows in as the globe shrinks. */
    function stickfigure(ctx) {
      var k = 1 - t;
      if (k <= 0.02) return;
      var n = hCart(180, lat + (90 - lat) * s);
      var pos = projH(n, standRadius() + 0.001), m = standMatrix(n);
      ctx.save();
      ctx.transform(m[0], m[1], m[2], m[3], pos.x, pos.y);
      ctx.scale(k, k);
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, -7); ctx.lineTo(0, -21);          // body
      ctx.moveTo(-7, -11); ctx.lineTo(7, -15);        // arms
      ctx.moveTo(0, -7); ctx.lineTo(-5, 0);           // legs
      ctx.moveTo(0, -7); ctx.lineTo(5, 0);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -24.5, 3.5, 0, TAU);
      ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    /* globeSphere: a nested CelestialSphere of size 80 carrying the Earth art.
       The globe's own art radius is the SWF's `_radius = 40`, and because the
       nested sphere sits at latitude 90 with siderealTime 0 its celestial→horizon
       matrix is just (x, y, z) → (−x, −y, z) — which is what puts the Americas
       towards the viewer at the default theta 90 / phi 30, as in the original.  */
    var waterFill = null, landFill = null, bowlFill = null;
    function globeFills(ctx) {                   // built once, in globe units
      if (waterFill) return;
      function rad(inner, outer) {               // shapes 55 / 58: the highlight up and right
        var g = ctx.createRadialGradient(12.8, -12.75, 0, 12.8, -12.75, 58.36);
        g.addColorStop(0, inner); g.addColorStop(1, outer);
        return g;
      }
      waterFill = rad("#e2eafc", "#8493f0");     // GlobeComponentWater
      landFill = rad("#c8a977", "#98753d");      // GlobeComponentLand
      // the nested sphere's own celestialBowl, which lies over the globe art
      bowlFill = ctx.createRadialGradient(0, 0, 0, 0, 0, GLOBE_R);
      bowlFill.addColorStop(0, "rgba(255,255,255,0)");
      bowlFill.addColorStop(1, "rgba(0,0,0,0.2)");
    }
    function globe(ctx) {
      if (t <= 0.02) return;                     // under a pixel across
      globeFills(ctx);
      var ct = Math.cos(theta * RAD), st = Math.sin(theta * RAD);
      var cp = Math.cos(phi * RAD), sp = Math.sin(phi * RAD);
      function gp(v) {                           // globe units, about its own centre
        return { x: (v.x * -st + v.y * ct) * GLOBE_R,
          y: (v.x * ct * sp + v.y * st * sp + v.z * -cp) * GLOBE_R,
          z: v.x * ct * cp + v.y * st * cp + v.z * sp };
      }
      function shorePt(x, y, z) {                // celestial → horizon → globe units
        return gp({ x: -x, y: -y, z: z });
      }
      var D = 2 * GLOBE_R;
      ctx.save();
      ctx.translate(C.x, C.y);                   // the whole globe scales with t, so its
      ctx.scale(t, t);                           // gradients can be built once and reused
      ctx.save();
      ctx.beginPath(); ctx.arc(0, 0, GLOBE_R, 0, TAU); ctx.clip();
      ctx.fillStyle = waterFill;
      ctx.fillRect(-GLOBE_R, -GLOBE_R, D, D);
      ctx.beginPath();
      EARTH.landPath(ctx, shorePt, GLOBE_R);
      ctx.fillStyle = landFill;
      ctx.fill("evenodd");
      ctx.fillStyle = bowlFill;
      ctx.fillRect(-GLOBE_R, -GLOBE_R, D, D);
      ctx.restore();
      ctx.strokeStyle = "#707070"; ctx.lineWidth = 1 / t;
      ring(ctx, gp, function (u) { return hCart(u * 360, lat); });          // latitudeCircle
      ring(ctx, gp, function (u) {                                         // longitudeCircle
        var a2 = u * TAU; return { x: Math.cos(a2), y: 0, z: Math.sin(a2) };
      });
      var d = gp(hCart(180, lat));               // Observer Dot, { alt: latitude, az: 180 }
      if (d.z >= 0) {
        ctx.beginPath(); ctx.arc(d.x, d.y, 2 / t, 0, TAU);
        ctx.fillStyle = "#ffffff"; ctx.fill();
        ctx.strokeStyle = "rgba(50,50,50,0.8)"; ctx.stroke();
      }
      ctx.restore();
    }
    function ring(ctx, gp, fn) {
      ctx.beginPath();
      var started = false;
      for (var i = 0; i <= 96; i++) {
        var q = gp(fn(i / 96));
        if (q.z < 0) { started = false; continue; }
        if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
    }

    /* arrowMC: a 2 px bar whose gradient and arrowheads swing with t, between
       the two system names — the left one black in the celestial view.         */
    function arrowBar(ctx, tr) {
      var y = 418.25, hw = 88, cx = 200.25;
      var u = 2 * t - 1;                          // halfPoint 0.5, halfRange 0.5
      var lv = Math.round(96 - 96 * u), rv = Math.round(96 + 96 * u);
      var left = "rgb(" + lv + "," + lv + "," + lv + ")";
      var right = "rgb(" + rv + "," + rv + "," + rv + ")";
      var g = ctx.createLinearGradient(cx - hw, 0, cx + hw, 0);
      g.addColorStop(0, left); g.addColorStop(1, right);
      ctx.fillStyle = g; ctx.fillRect(cx - hw, y - 1, 2 * hw, 2);
      ctx.fillStyle = left;
      ctx.beginPath();
      ctx.moveTo(cx - hw - 10, y); ctx.lineTo(cx - hw + 2, y - 5.5);
      ctx.lineTo(cx - hw + 2, y + 5.5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = right;
      ctx.beginPath();
      ctx.moveTo(cx + hw + 10, y); ctx.lineTo(cx + hw - 2, y - 5.5);
      ctx.lineTo(cx + hw - 2, y + 5.5); ctx.closePath(); ctx.fill();
      ctx.font = "11px " + FONT; ctx.textBaseline = "middle";
      ctx.textAlign = "right"; ctx.fillStyle = left;
      ctx.fillText(tr("ch.celestial"), cx - hw - 14, y);
      ctx.textAlign = "left"; ctx.fillStyle = right;
      ctx.fillText(tr("ch.horizon"), cx + hw + 14, y);
    }

    void latCtl;
    upd();
  }
});
