/* Sidereal Time and Hour Angle Demonstrator ---------------------------------------
   Faithful rebuild of ClassAction's "siderealTimeAndHourAngleDemo.swf" — one SWF,
   two catalogue entries (Coordinates and Motions, and the 200 Level module).

   A celestial sphere sitting inside the observer's horizon. The sphere's tilt is
   the observer's latitude and its rotation is the local sidereal time, which is
   defined as the right ascension currently on the meridian. The hour angle of a
   star is then simply how far west of the meridian it has got:

       H = sidereal time - right ascension

   Everything visible is the SWF's own. Its HourAngleDemoClass builds a 320-unit
   sphere seen from azimuth 160 / altitude 35 (never below 7), and resets to
   latitude 41, sidereal time 2h and a star at RA 4h, dec 30. Its circles: the
   celestial equator and a half 0h circle in 0xFFE735 at 70 %, the polar axis and
   the observer's meridian — only the half from the NCP over the zenith to the SCP
   — in 0x75A9FF, two faint pole-to-pole meridians at 10 %, and the star's own
   hour circle and declination circle at 30 %. The measured arcs are the RA arc in
   white, the declination arc in 0xFF3800 and the hour-angle arc in 0xFFC425. The
   art is the SWF's too: an opaque horizon disc filled #51c451 -> #3aa53a, and a
   grey sphere with the light rim its shape 83 draws.

   Rendering, so that it stays light: every point is one 3 x 3 matrix product (the
   camera and the latitude/sidereal-time rotation are folded together once per
   frame), samples come from a precomputed sine table, nothing is allocated per
   point, and the sphere's gradient and rim are painted once to an offscreen
   canvas. Anything below the horizon is drawn first and the opaque plane then
   covers whatever of it lies behind — which is exactly how the SWF layers it.  */
Sim.create({
  id: "siderealtimeandhourangledemo",
  width: 600, height: 560,
  strings: {
    en: {
      "ha.obs": "Observer properties", "ha.lat": "latitude", "ha.st": "sidereal time",
      "ha.star": "Star properties", "ha.ra": "right ascension", "ha.dec": "declination",
      "ha.opt": "Options", "ha.arc": "show hour angle arc", "ha.reset": "Reset",
      "ha.rHA": "hour angle", "ha.rAlt": "altitude", "ha.rAz": "azimuth",
      "ha.rWhen": "position",
      "ha.up": "above the horizon", "ha.down": "below the horizon",
      "ha.east": "east of the meridian", "ha.west": "west of the meridian",
      "ha.onMer": "on the meridian",
      "ha.hint": "You can also change the star's position by dragging it. Drag anywhere else on the sphere to swing the viewpoint round.",
      "ha.N": "N", "ha.E": "E", "ha.S": "S", "ha.W": "W",
      "ha.haLabel": "hour angle", "ha.formula": "Hour Angle  =  Sidereal Time  −  Right Ascension"
    },
    id: {
      "ha.obs": "Sifat pengamat", "ha.lat": "lintang", "ha.st": "waktu sideris",
      "ha.star": "Sifat bintang", "ha.ra": "asensiorekta", "ha.dec": "deklinasi",
      "ha.opt": "Pilihan", "ha.arc": "tampilkan busur sudut jam", "ha.reset": "Atur ulang",
      "ha.rHA": "sudut jam", "ha.rAlt": "altitud", "ha.rAz": "azimut",
      "ha.rWhen": "kedudukan",
      "ha.up": "di atas cakrawala", "ha.down": "di bawah cakrawala",
      "ha.east": "timur meridian", "ha.west": "barat meridian",
      "ha.onMer": "di meridian",
      "ha.hint": "Kedudukan bintang juga dapat diubah dengan menyeretnya. Seret di bagian lain bola untuk memutar sudut pandang.",
      "ha.N": "U", "ha.E": "T", "ha.S": "S", "ha.W": "B",
      "ha.haLabel": "sudut jam", "ha.formula": "Sudut Jam  =  Waktu Sideris  −  Asensiorekta"
    }
  },
  about: {
    en: "<p>Sidereal time is a clock set by the stars rather than the Sun, and it has a neat definition: the local sidereal time is the right ascension that is crossing your meridian right now. At sidereal 2h, the stars at RA 2h are due south of you (or due north, from the southern hemisphere).</p>" +
        "<p>That makes the hour angle easy. Subtract a star's right ascension from the sidereal time and you get how long ago it crossed the meridian — a positive hour angle means it is west of the meridian and setting, a negative one means it is still rising in the east, and zero means it is transiting, at its highest for the day.</p>" +
        "<p>Latitude tilts the whole sphere. At the pole the celestial equator lies along the horizon and nothing ever rises or sets; at the equator the poles sit on the horizon and every star is up for exactly twelve hours. In between, a star is above the horizon for longer the closer its declination is to your own latitude's sign.</p>",
    id: "<p>Waktu sideris adalah jam yang diatur oleh bintang, bukan oleh Matahari, dan definisinya rapi: waktu sideris setempat adalah asensiorekta yang sedang melintasi meridian Anda saat itu. Pada sideris 2j, bintang-bintang dengan AR 2j berada tepat di selatan Anda (atau tepat di utara, dari belahan selatan).</p>" +
        "<p>Itu membuat sudut jam menjadi mudah. Kurangkan asensiorekta sebuah bintang dari waktu sideris dan Anda memperoleh berapa lama sejak ia melintasi meridian — sudut jam positif berarti ia di barat meridian dan sedang terbenam, negatif berarti ia masih terbit di timur, dan nol berarti ia sedang transit, pada titik tertingginya hari itu.</p>" +
        "<p>Lintang memiringkan seluruh bola. Di kutub, ekuator langit berimpit dengan cakrawala dan tidak ada yang pernah terbit atau terbenam; di khatulistiwa, kutub-kutub berada di cakrawala dan setiap bintang berada di atas tepat dua belas jam. Di antaranya, sebuah bintang lebih lama berada di atas cakrawala bila deklinasinya makin sesuai tanda lintang Anda.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";
    var SCENE = { x: 0, y: 0, w: 600, h: 480 };
    var INFO = { x: 0, y: 480, w: 600, h: 80 };
    var C = { x: 300, y: 238 }, R = 190;          // sphere size 320 in a 400 box
    var COL = { ra: "#ffffff", dec: "#ff3800", ha: "#ffc425", eq: "rgba(255,231,53,0.7)",
      axis: "#75a9ff", faint: "rgba(255,255,255,0.10)", guide: "rgba(255,255,255,0.30)" };

    /* HourAngleDemoClass.reset() */
    var lat = 41, st = 2, ra = 4, dec = 30, showArc = false;
    var camAz = 160, camAlt = 35;

    /* ---------------------------------------------------------- the maths */
    /* one sine table serves every circle; 240 steps is smooth at this size */
    var N = 240, SIN = new Float64Array(N + 1), COS = new Float64Array(N + 1);
    for (var k = 0; k <= N; k++) { SIN[k] = Math.sin(TAU * k / N); COS[k] = Math.cos(TAU * k / N); }

    /* the camera, a right-handed basis: right x up = toward the eye */
    var cam = { rx: 0, ry: 0, ux: 0, uy: 0, uz: 0, dx: 0, dy: 0, dz: 0 };
    /* celestial (x to 0h, y to 6h, z to the NCP) -> horizon (east, north, up) */
    var M = new Float64Array(9);
    /* and the two folded together: celestial -> (screen x, screen up, depth) */
    var P = new Float64Array(9);
    function setup() {
      var A = camAz * RAD, T = camAlt * RAD;
      var sA = Math.sin(A), cA = Math.cos(A), sT = Math.sin(T), cT = Math.cos(T);
      cam.rx = -cA; cam.ry = sA;
      cam.ux = -sT * sA; cam.uy = -sT * cA; cam.uz = cT;
      cam.dx = cT * sA; cam.dy = cT * cA; cam.dz = sT;
      var L = lat * RAD, Sd = st * 15 * RAD;
      var sL = Math.sin(L), cL = Math.cos(L), sS = Math.sin(Sd), cS = Math.cos(Sd);
      M[0] = -sS;       M[1] = cS;        M[2] = 0;       // east
      M[3] = -sL * cS;  M[4] = -sL * sS;  M[5] = cL;      // north
      M[6] = cL * cS;   M[7] = cL * sS;   M[8] = sL;      // up
      for (var c = 0; c < 3; c++) {
        var e = M[c], n = M[3 + c], u = M[6 + c];
        P[c] = e * cam.rx + n * cam.ry;
        P[3 + c] = e * cam.ux + n * cam.uy + u * cam.uz;
        P[6 + c] = e * cam.dx + n * cam.dy + u * cam.dz;
      }
    }

    /* a curve is kept as screen x, screen y and height above the horizon, in
       buffers reused every frame, so drawing allocates nothing               */
    function Buf(n) { return { x: new Float32Array(n), y: new Float32Array(n),
      u: new Float32Array(n), n: 0 }; }
    function celPoint(b, cx, cy, cz) {
      var i = b.n++;
      b.x[i] = C.x + R * (P[0] * cx + P[1] * cy + P[2] * cz);
      b.y[i] = C.y - R * (P[3] * cx + P[4] * cy + P[5] * cz);
      b.u[i] = M[6] * cx + M[7] * cy + M[8] * cz;
    }
    function horPoint(b, e, n, u) {
      var i = b.n++;
      b.x[i] = C.x + R * (e * cam.rx + n * cam.ry);
      b.y[i] = C.y - R * (e * cam.ux + n * cam.uy + u * cam.uz);
      b.u[i] = u;
    }
    /* a circle of constant declination, from RA h0 to h1 (hours) */
    function decCircle(b, d, h0, h1) {
      b.n = 0;
      var cd = Math.cos(d * RAD), sd = Math.sin(d * RAD);
      var steps = Math.max(2, Math.ceil(Math.abs(h1 - h0) / 24 * N));
      for (var i = 0; i <= steps; i++) {
        var a = (h0 + (h1 - h0) * i / steps) * 15 * RAD;
        celPoint(b, cd * Math.cos(a), cd * Math.sin(a), sd);
      }
      return b;
    }
    /* an hour circle at RA h, from dec d0 to d1 (degrees) */
    function hourCircle(b, h, d0, d1) {
      b.n = 0;
      var a = h * 15 * RAD, ca = Math.cos(a), sa = Math.sin(a);
      var steps = Math.max(2, Math.ceil(Math.abs(d1 - d0) / 360 * N));
      for (var i = 0; i <= steps; i++) {
        var d = (d0 + (d1 - d0) * i / steps) * RAD, cd = Math.cos(d);
        celPoint(b, cd * ca, cd * sa, Math.sin(d));
      }
      return b;
    }
    /* a full great circle through both poles at RA h (and h + 12) */
    function poleCircle(b, h) {
      b.n = 0;
      var a = h * 15 * RAD, ca = Math.cos(a), sa = Math.sin(a);
      for (var k = 0; k <= N; k++) celPoint(b, COS[k] * ca, COS[k] * sa, SIN[k]);
      return b;
    }

    var B = {};
    ["eq", "zero", "m1", "m2", "mer", "raC", "decC", "raArc", "decArc", "haArc", "hz"]
      .forEach(function (k2) { B[k2] = Buf(N + 2); });

    /* stroke the part of a curve on one side of the horizon */
    function strokeSide(ctx, b, below, colour, width) {
      ctx.beginPath();
      var pen = false;
      for (var i = 0; i < b.n; i++) {
        if ((b.u[i] < 0) !== below) { pen = false; continue; }
        if (pen) ctx.lineTo(b.x[i], b.y[i]);
        else { ctx.moveTo(b.x[i], b.y[i]); pen = true; }
      }
      ctx.strokeStyle = colour; ctx.lineWidth = width;
      ctx.stroke();
    }

    function buildCurves() {
      setup();
      decCircle(B.eq, 0, 0, 24);                   // celestialEquator
      hourCircle(B.zero, 0, -90, 90);              // zeroHoursCircle: pole to pole only
      poleCircle(B.m1, 0);                         // meridian1: RA 0h / 12h
      poleCircle(B.m2, 6);                         // meridian2: RA 6h / 18h
      hourCircle(B.raC, ra, -90, 90);              // raCircle
      decCircle(B.decC, dec, 0, 24);               // decCircle
      if (ra !== 0) decCircle(B.raArc, 0, 0, ra); else B.raArc.n = 0;
      if (dec !== 0) hourCircle(B.decArc, ra, 0, dec); else B.decArc.n = 0;
      var H = hourAngle();
      if (showArc && Math.abs(H) > 0.005) decCircle(B.haArc, dec, st, st - H);
      else B.haArc.n = 0;
      /* observerMeridian: from the NCP (altitude = latitude, due north) up over
         the zenith and down to the SCP, gammaStart = lat, gammaEnd = lat + 180 */
      var mb = B.mer; mb.n = 0;
      for (var s2 = 0; s2 <= N / 2; s2++) {
        var g = (lat + 180 * s2 / (N / 2)) * RAD;
        horPoint(mb, 0, Math.cos(g), Math.sin(g));
      }
      var hz = B.hz; hz.n = 0;
      for (var q = 0; q <= N; q++) horPoint(hz, SIN[q], COS[q], 0);
    }

    function hourAngle() {
      var h = ((st - ra) % 24 + 24) % 24;
      return h > 12 ? h - 24 : h;
    }
    function starHor() {                           // the star in (east, north, up)
      var a = ra * 15 * RAD, d = dec * RAD, cd = Math.cos(d);
      var cx = cd * Math.cos(a), cy = cd * Math.sin(a), cz = Math.sin(d);
      return { e: M[0] * cx + M[1] * cy + M[2] * cz,
        n: M[3] * cx + M[4] * cy + M[5] * cz, u: M[6] * cx + M[7] * cy + M[8] * cz };
    }
    function screenOf(e, n, u) {
      return { x: C.x + R * (e * cam.rx + n * cam.ry),
        y: C.y - R * (e * cam.ux + n * cam.uy + u * cam.uz),
        z: e * cam.dx + n * cam.dy + u * cam.dz };
    }
    function celScreen(h, d, rr) {
      var a = h * 15 * RAD, dd = d * RAD, cd = Math.cos(dd), k2 = rr || 1;
      var cx = cd * Math.cos(a), cy = cd * Math.sin(a), cz = Math.sin(dd);
      return { x: C.x + k2 * R * (P[0] * cx + P[1] * cy + P[2] * cz),
        y: C.y - k2 * R * (P[3] * cx + P[4] * cy + P[5] * cz),
        z: P[6] * cx + P[7] * cy + P[8] * cz,
        u: M[6] * cx + M[7] * cy + M[8] * cz };
    }
    /* screen point on the near hemisphere -> celestial RA/dec, for dragging */
    function unproject(sx, sy) {
      var a = (sx - C.x) / R, b = -(sy - C.y) / R, q = a * a + b * b;
      if (q > 1) { var s3 = 1 / Math.sqrt(q); a *= s3; b *= s3; q = 1; }
      var c = Math.sqrt(Math.max(0, 1 - q));
      var e = a * cam.rx + b * cam.ux + c * cam.dx;
      var n = a * cam.ry + b * cam.uy + c * cam.dy;
      var u = b * cam.uz + c * cam.dz;
      var cx = M[0] * e + M[3] * n + M[6] * u;    // M is orthonormal: invert by
      var cy = M[1] * e + M[4] * n + M[7] * u;    // transposing
      var cz = M[2] * e + M[5] * n + M[8] * u;
      return { ra: ((Math.atan2(cy, cx) * DEG / 15) % 24 + 24) % 24,
        dec: Math.asin(Math.max(-1, Math.min(1, cz))) * DEG };
    }

    /* ------------------------------------------------ the sphere, painted once */
    var ball = document.createElement("canvas");
    var ballDpr = 0;
    function paintBall() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (ballDpr === dpr) return;
      ballDpr = dpr;
      var size = Math.ceil((2 * R + 4) * dpr);
      ball.width = size; ball.height = size;
      var g = ball.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      var o = R + 2;
      /* the grey glass: lit from the upper right, like shapes 78 and 80 */
      var fill = g.createRadialGradient(o + 0.35 * R, o - 0.25 * R, R * 0.05, o, o, R * 1.08);
      fill.addColorStop(0, "#6b6b6b");
      fill.addColorStop(0.55, "#474747");
      fill.addColorStop(1, "#262626");
      g.beginPath(); g.arc(o, o, R, 0, TAU);
      g.fillStyle = fill; g.fill();
      /* shape 83: clear to 58 % of the radius, then a light rim */
      var rim = g.createRadialGradient(o, o, 0, o, o, R);
      rim.addColorStop(0, "rgba(255,255,255,0)");
      rim.addColorStop(0.58, "rgba(255,255,255,0)");
      rim.addColorStop(1, "rgba(215,215,215,0.35)");
      g.fillStyle = rim; g.fill();
    }

    /* ------------------------------------------------------------- controls */
    S.group("ha.obs");
    var stCtl = S.slider({ labelKey: "ha.st", min: 0, max: 23.99, value: 2, step: 0.01,
      format: function (v) { return v.toFixed(2) + " h"; },
      on: function (v) { st = v; S.requestDraw(); } });
    var latCtl = S.slider({ labelKey: "ha.lat", min: -90, max: 90, value: 41, step: 0.1,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { lat = v; S.requestDraw(); } });
    S.group("ha.star");
    var raCtl = S.slider({ labelKey: "ha.ra", min: 0, max: 23.99, value: 4, step: 0.01,
      format: function (v) { return v.toFixed(2) + " h"; },
      on: function (v) { ra = v; S.requestDraw(); } });
    var decCtl = S.slider({ labelKey: "ha.dec", min: -90, max: 90, value: 30, step: 0.1,
      format: function (v) { return v.toFixed(1) + "°"; },
      on: function (v) { dec = v; S.requestDraw(); } });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "ha.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);
    S.group("ha.opt");
    var arcCtl = S.toggle({ labelKey: "ha.arc", value: false,
      on: function (v) { showArc = v; } });
    S.button({ labelKey: "ha.reset", on: function () {
      camAz = 160; camAlt = 35;
      arcCtl.set(false); stCtl.set(2); latCtl.set(41); raCtl.set(4); decCtl.set(30);
    } });

    var outHA = S.readout({ labelKey: "ha.rHA" });
    var outAlt = S.readout({ labelKey: "ha.rAlt" });
    var outAz = S.readout({ labelKey: "ha.rAz" });
    var outWhen = S.readout({ labelKey: "ha.rWhen" });
    /* readouts change at most once a frame, and only when their text does, so
       a drag never makes the page re-lay itself out between pointer events   */
    var last = {};
    function put(key, fn, text) { if (last[key] !== text) { last[key] = text; fn(text); } }
    function readouts() {
      var H = hourAngle(), v = starHor();
      var alt = Math.asin(Math.max(-1, Math.min(1, v.u))) * DEG;
      var az = ((Math.atan2(v.e, v.n) * DEG) % 360 + 360) % 360;
      put("ha", outHA, H.toFixed(2) + " h");
      put("alt", outAlt, alt.toFixed(1) + "°");
      put("az", outAz, az.toFixed(1) + "°");
      put("when", outWhen, I18N.t(alt >= 0 ? "ha.up" : "ha.down") + ", " +
        I18N.t(Math.abs(H) < 0.005 ? "ha.onMer" : H > 0 ? "ha.west" : "ha.east"));
    }
    window.addEventListener("langchange", function () { last = {}; });

    /* ---------------------------------------------------------- interaction */
    /* the canvas rectangle is read once per gesture, not on every move, so
       dragging never forces a layout                                          */
    var drag = null, box = null;
    S.canvas.addEventListener("pointerdown", function (ev) {
      box = S.canvas.getBoundingClientRect();
      var p = at(ev);
      if (p.y > SCENE.h || Math.hypot(p.x - C.x, p.y - C.y) > R + 12) return;
      setup();
      var s = celScreen(ra, dec);
      if (s.z > 0 && Math.hypot(p.x - s.x, p.y - s.y) < 16) {
        drag = { kind: "star", ox: s.x - p.x, oy: s.y - p.y };
      } else {
        drag = { kind: "view", x: p.x, y: p.y, az: camAz, alt: camAlt };
      }
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) { /* no live pointer */ }
      ev.preventDefault();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      if (drag.kind === "star") {
        var q = unproject(p.x + drag.ox, p.y + drag.oy);
        raCtl.set(Math.round(q.ra * 100) / 100 % 24);
        decCtl.set(Math.round(q.dec * 10) / 10);
      } else {
        /* the SWF's "simple drag": a radian of turn per sphere radius the
           pointer travels — azimuth with its x, altitude with its y (7 to 90) */
        camAz = ((drag.az + (p.x - drag.x) / R * DEG) % 360 + 360) % 360;
        camAlt = Math.max(7, Math.min(90, drag.alt + (p.y - drag.y) / R * DEG));
      }
      S.requestDraw();
    });
    ["pointerup", "pointercancel"].forEach(function (k2) {
      S.canvas.addEventListener(k2, function () { drag = null; });
    });
    function at(ev) {
      var r = box || S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }

    /* --------------------------------------------------------------- paint */

    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      buildCurves();
      paintBall();

      ctx.fillStyle = "#000000"; ctx.fillRect(SCENE.x, SCENE.y, SCENE.w, SCENE.h);
      ctx.drawImage(ball, C.x - R - 2, C.y - R - 2, 2 * R + 4, 2 * R + 4);
      ctx.lineCap = "butt"; ctx.lineJoin = "round";

      /* 1. everything below the horizon, which the plane will partly cover */
      layer(ctx, true);
      /* 2. the opaque horizon disc, the SWF's shape 120 */
      plane(ctx, tr);
      /* 3. everything above it */
      layer(ctx, false);
      labels(ctx);
      star(ctx);

      info(ctx, tr);
      readouts();
    });

    function layer(ctx, below) {
      strokeSide(ctx, B.m1, below, COL.faint, 1);
      strokeSide(ctx, B.m2, below, COL.faint, 1);
      strokeSide(ctx, B.eq, below, COL.eq, 1.2);
      strokeSide(ctx, B.zero, below, COL.eq, 1.2);
      strokeSide(ctx, B.raC, below, COL.guide, 1);
      strokeSide(ctx, B.decC, below, COL.guide, 1);
      strokeSide(ctx, B.mer, below, COL.axis, 2);
      axis(ctx, below);
      strokeSide(ctx, B.raArc, below, COL.ra, 3);
      strokeSide(ctx, B.decArc, below, COL.dec, 3);
      strokeSide(ctx, B.haArc, below, COL.ha, 3);
    }
    /* the polar axis pokes out past the sphere at both poles */
    function axis(ctx, below) {
      [[90, 1], [-90, -1]].forEach(function (pole) {
        var a = celScreen(0, pole[0], 1), b = celScreen(0, pole[0], 1.2);
        if ((a.u < 0) !== below) return;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = COL.axis; ctx.lineWidth = 2; ctx.stroke();
      });
    }

    /* shape 120: a circular #51c451 -> #3aa53a gradient on the plane itself,
       so it is filled in plane coordinates and squashes with the disc        */
    var planeFill = null;
    function plane(ctx, tr) {
      ctx.save();
      ctx.transform(R * cam.rx, -R * cam.ux, R * cam.ry, -R * cam.uy, C.x, C.y);
      if (!planeFill) {
        planeFill = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        planeFill.addColorStop(0, "#51c451");
        planeFill.addColorStop(1, "#3aa53a");
      }
      ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU);
      ctx.fillStyle = planeFill; ctx.fill();
      ctx.restore();

      /* the SWF's "Direction Labels Light": letters printed flat on the disc,
         north-up, so they skew with it — text x runs east, text up runs north */
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.fillStyle = "rgba(235,235,235,0.9)";
      ctx.font = "italic bold 15px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      [[0, 1, "ha.N"], [1, 0, "ha.E"], [0, -1, "ha.S"], [-1, 0, "ha.W"]].forEach(function (c) {
        var p = screenOf(0.8 * c[0], 0.8 * c[1], 0);
        ctx.setTransform(dpr * cam.rx, dpr * -cam.ux, dpr * -cam.ry, dpr * cam.uy,
          dpr * p.x, dpr * p.y);
        ctx.fillText(tr(c[2]), 0, 0);
      });
      ctx.restore();

      stick(ctx);
    }

    /* the observer: the SWF's "Stickfigure" (shape 1, placed at 95 %), standing
       at the centre of the plane. It is a flat cut-out fixed to the horizon —
       setOrientationType('absolute', normal (-1, 0, 0), up the zenith) — so it
       lies in the east-west vertical plane, facing south, and turns and
       foreshortens with the view like the plane does; seen from due east or
       west it is edge-on. Drawn in the shape's own units: x runs east, y runs
       down from the zenith, the feet at 0, and 160 units to the SWF's radius.  */
    function stick(ctx) {
      var s = 0.95 * R / 160;
      ctx.save();
      ctx.transform(s * cam.rx, -s * cam.ux, 0, s * cam.uz, C.x, C.y);
      ctx.beginPath(); ctx.arc(-0.15, -30.8, 3.5, 0, TAU);
      ctx.fillStyle = "#ffffff"; ctx.fill();
      ctx.moveTo(0.8, -23.05); ctx.lineTo(6.3, -20.4);                   // arms
      ctx.moveTo(-0.15, -23.05); ctx.lineTo(-6.3, -20.4);
      ctx.moveTo(-0.15, -25.75); ctx.lineTo(-0.15, -15.35);              // body
      ctx.moveTo(-5.5, 0); ctx.lineTo(-0.15, -15.35); ctx.lineTo(5.35, 0);  // legs
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 2;
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.stroke();
      ctx.restore();
    }

    /* the two labels the SWF parks just off their arcs */
    function labels(ctx) {
      ctx.save();
      ctx.font = "italic bold 14px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      var rl = celScreen(ra - 0.9, 5, 1.001);
      if (ra !== 0 && rl.u >= 0) { ctx.fillStyle = COL.ra; ctx.fillText(ra.toFixed(1) + "h", rl.x, rl.y); }
      var dl = celScreen(ra + 0.9, dec / 2, 1.001);
      if (dec !== 0 && dl.u >= 0) {
        ctx.fillStyle = COL.dec; ctx.fillText(dec.toFixed(1) + "°", dl.x, dl.y);
      }
      var H = hourAngle();
      if (showArc && Math.abs(H) > 0.005) {
        var hl = celScreen(st - H / 2, dec + 5, 1.001);
        if (hl.u >= 0) { ctx.fillStyle = COL.ha; ctx.fillText(H.toFixed(1) + "h", hl.x, hl.y); }
      }
      ctx.restore();
    }

    /* the draggable star: shape 91's white-to-yellow disc with a few rays */
    var starFill = null;
    function star(ctx) {
      var s = celScreen(ra, dec);
      ctx.save();
      ctx.globalAlpha = s.u >= 0 ? 1 : 0.45;
      ctx.translate(s.x, s.y);
      ctx.strokeStyle = "rgba(255,250,210,0.9)"; ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (var i = 0; i < 8; i++) {
        var a = i * TAU / 8, r0 = 6, r1 = i % 2 ? 10 : 13;
        ctx.moveTo(r0 * Math.cos(a), r0 * Math.sin(a));
        ctx.lineTo(r1 * Math.cos(a), r1 * Math.sin(a));
      }
      ctx.stroke();
      if (!starFill) {
        starFill = ctx.createRadialGradient(0, 0, 0, 0, 0, 6.5);
        starFill.addColorStop(0, "#ffffff");
        starFill.addColorStop(1, "#e4e466");
      }
      ctx.beginPath(); ctx.arc(0, 0, 6.2, 0, TAU);
      ctx.fillStyle = starFill; ctx.fill();
      ctx.strokeStyle = "#999999"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }

    /* the SWF's own readout line and its formula */
    function info(ctx, tr) {
      ctx.fillStyle = "#f2f2f2"; ctx.fillRect(INFO.x, INFO.y, INFO.w, INFO.h);
      ctx.strokeStyle = "#cccccc"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(INFO.x, INFO.y + 0.5); ctx.lineTo(INFO.x + INFO.w, INFO.y + 0.5);
      ctx.stroke();
      ctx.textBaseline = "middle"; ctx.textAlign = "center";
      ctx.fillStyle = "#222222"; ctx.font = "14px " + FONT;
      ctx.fillText(tr("ha.haLabel") + ":  " + hourAngle().toFixed(2) + " h",
        INFO.x + INFO.w / 2, INFO.y + 26);
      ctx.fillStyle = "#333333"; ctx.font = "italic 13px " + FONT;
      ctx.fillText(tr("ha.formula"), INFO.x + INFO.w / 2, INFO.y + 54);
    }
  }
});
