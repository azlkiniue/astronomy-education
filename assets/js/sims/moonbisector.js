/* Moon Phases With Bisectors -----------------------------------------------------
   Faithful rebuild of "moonbisector.swf" / "moonBisectorDemo.swf" — one SWF, two
   catalogue entries. Everything here comes out of the original: the AS3 classes
   (Scene3D, Globe, BisectingPlanesForGlobe3D, PhaseDisc, OrbitalPlane) and its
   MainTimeline, disassembled with tools/swf-abc.py.

   The demo builds a Moon phase out of two cuts. One plane bisects each body
   perpendicular to the Sun — everything behind it is in shadow. A second plane
   bisects the Moon perpendicular to the Earth–Moon line — everything behind that
   one is the far side we never see. What is left, lit and facing us at once, is
   the phase, and the disc on the right draws it.

   The numbers are the SWF's own: scene 600 x 600 at scale 100, Earth radius 0.4
   at the origin, Moon radius 0.2 at 2.2 units, planes 1.4 radii across at
   sunAngle - 90 and moonAngle - 90, and the opening state sun 270 / moon 180,
   theta 0 / phi 90, which is a third quarter seen from straight overhead.      */
Sim.create({
  id: "moonbisector",
  width: 880, height: 616,
  strings: {
    en: {
      "mb.steps": "Phase determination steps",
      "mb.s1": "Step 1 — show Sun direction", "mb.s2": "Step 2 — show Sun bisectors",
      "mb.s3": "Step 3 — show shadows", "mb.s4": "Step 4 — show Earth–Moon line",
      "mb.s5": "Step 5 — show Earth–Moon bisectors", "mb.s6": "Step 6 — determine Moon's phase",
      "mb.hideAll": "hide all", "mb.showAll": "show all", "mb.contrast": "shadow contrast",
      "mb.pos": "Positions", "mb.sun": "Sun direction", "mb.moon": "Moon position",
      "mb.persp": "Perspective", "mb.earth": "from Earth", "mb.over": "overhead",
      "mb.lr": "left / right", "mb.ud": "up / down", "mb.reset": "Reset",
      "mb.rPhase": "phase", "mb.rElong": "elongation", "mb.rLit": "illuminated",
      "mb.title": "Moon's phase", "mb.sunL": "sun",
      "mb.legSun": "Sun bisector", "mb.legEM": "Earth–Moon bisector",
      "mb.hint": "Drag inside the black scene to swing the viewpoint around. Work through the steps in order, then switch to the view from Earth.",
      "mb.new": "New Moon", "mb.wxc": "Waxing Crescent", "mb.fq": "First Quarter",
      "mb.wxg": "Waxing Gibbous", "mb.full": "Full Moon", "mb.wng": "Waning Gibbous",
      "mb.tq": "Third Quarter", "mb.wnc": "Waning Crescent"
    },
    id: {
      "mb.steps": "Langkah penentuan fase",
      "mb.s1": "Langkah 1 — tampilkan arah Matahari", "mb.s2": "Langkah 2 — tampilkan bidang bagi Matahari",
      "mb.s3": "Langkah 3 — tampilkan bayangan", "mb.s4": "Langkah 4 — tampilkan garis Bumi–Bulan",
      "mb.s5": "Langkah 5 — tampilkan bidang bagi Bumi–Bulan", "mb.s6": "Langkah 6 — tentukan fase Bulan",
      "mb.hideAll": "sembunyikan semua", "mb.showAll": "tampilkan semua", "mb.contrast": "kontras bayangan",
      "mb.pos": "Kedudukan", "mb.sun": "Arah Matahari", "mb.moon": "Kedudukan Bulan",
      "mb.persp": "Sudut pandang", "mb.earth": "dari Bumi", "mb.over": "dari atas",
      "mb.lr": "kiri / kanan", "mb.ud": "atas / bawah", "mb.reset": "Atur ulang",
      "mb.rPhase": "fase", "mb.rElong": "elongasi", "mb.rLit": "tersinari",
      "mb.title": "Fase Bulan", "mb.sunL": "matahari",
      "mb.legSun": "bidang bagi Matahari", "mb.legEM": "bidang bagi Bumi–Bulan",
      "mb.hint": "Seret di dalam bidang hitam untuk memutar sudut pandang. Kerjakan langkahnya berurutan, lalu beralih ke pandangan dari Bumi.",
      "mb.new": "Bulan Baru", "mb.wxc": "Sabit Awal", "mb.fq": "Kuartal Pertama",
      "mb.wxg": "Cembung Awal", "mb.full": "Purnama", "mb.wng": "Cembung Akhir",
      "mb.tq": "Kuartal Ketiga", "mb.wnc": "Sabit Akhir"
    }
  },
  about: {
    en: "<p>Half of every sunlit body is in daylight and half is in night, and the surface between them is a flat plane cutting the body in two at right angles to the Sun. That is the first bisector. Anything behind it gets no sunlight at all.</p>" +
        "<p>The Moon has a second plane that matters: the one at right angles to the Earth–Moon line. It separates the near side, which we can see, from the far side, which we cannot. Neither plane moves with the Moon's own rotation — they are fixed by where the Sun and the Earth happen to be.</p>" +
        "<p>Put the two together and the Moon is cut into four wedges: lit and facing us, lit and facing away, dark and facing us, dark and facing away. Only the first is visible from Earth, and how big a slice of the near side it covers is exactly the phase. Swing the viewpoint round to Earth's and you see that wedge head-on.</p>",
    id: "<p>Separuh dari setiap benda yang disinari Matahari berada dalam siang dan separuh dalam malam, dan batas di antara keduanya adalah bidang datar yang membelah benda itu tegak lurus terhadap Matahari. Itulah bidang bagi yang pertama. Apa pun yang berada di belakangnya sama sekali tidak menerima sinar.</p>" +
        "<p>Bulan punya bidang kedua yang penting: bidang tegak lurus garis Bumi–Bulan. Bidang itu memisahkan sisi dekat, yang dapat kita lihat, dari sisi jauh, yang tidak. Kedua bidang tidak ikut berputar bersama rotasi Bulan — keduanya ditentukan oleh letak Matahari dan Bumi.</p>" +
        "<p>Gabungkan keduanya dan Bulan terbelah menjadi empat baji: terang menghadap kita, terang membelakangi kita, gelap menghadap kita, dan gelap membelakangi kita. Hanya yang pertama tampak dari Bumi, dan seberapa besar bagian sisi dekat yang ditutupinya persis merupakan fasenya. Putarlah sudut pandang ke Bumi dan baji itu terlihat tepat dari depan.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2, RAD = Math.PI / 180, DEG = 180 / Math.PI;
    var FONT = "Verdana, Geneva, sans-serif";

    /* the SWF's stage geometry: a 600 x 600 Scene3D at scale 100 */
    var BOX = { x: 6, y: 8, w: 600, h: 600 };
    var C = { x: BOX.x + BOX.w / 2, y: BOX.y + BOX.h / 2 };
    var SCALE = 100;
    var R_EARTH = 0.4, R_MOON = 0.2, MOON_DIST = 2.2;
    var PLANE_SIZE = 1.4;                       // size1 / size2
    var COL_SUN = "#ffa000", COL_EM = "#00a0ff";      // color1 / color2
    var WATER = "#b7c2f6", LAND = "#b89763", MOON_BASE = "#a0a0a0";
    var STRIP = { x: 618, y: 8, w: 254, h: 600 };
    var DISC = { x: STRIP.x + STRIP.w / 2, y: 124, r: 52 };

    /* alpha ramps from the MainTimeline: the Earth fades out of the way when the
       Moon passes behind it, and its coastlines come up as white wireframe   */
    var A = { earth: [0.08, 1], earthLine: [0.9, 0], p1: [0.05, 0.5], p2: [0.05, 0.5],
      l1: [0.15, 0.8], l2: [0.15, 0.8] };

    /* the Moon's two mare layers, out of the SWF's own moonLayersData */
    var MARIA = [
      { color: "#535454", alpha: 0.1, fills: [
        [-0.6473,0.7069,-0.285,-0.6267,0.7385,-0.2487,-0.5572,0.8089,-0.1874,-0.4018,0.9126,0.0753,-0.3862,0.908,0.1626,-0.2812,0.9458,0.1626,-0.2509,0.9287,0.273,-0.1866,0.9155,0.3564,-0.1239,0.8908,0.4371,-0.1478,0.8313,0.5358,-0.1523,0.7471,0.6471,-0.1762,0.652,0.7375,-0.1632,0.5752,0.8016,-0.1985,0.5203,0.8306,-0.2525,0.5195,0.8163,-0.3694,0.4953,0.7863,-0.462,0.5174,0.7203,-0.5454,0.5664,0.6179,-0.606,0.4886,0.6277,-0.6157,0.4356,0.6566,-0.5388,0.3915,0.7459,-0.5855,0.2755,0.7624,-0.5629,0.1295,0.8163,-0.6845,0.0086,0.729,-0.7569,-0.1444,0.6374,-0.7592,-0.2573,0.5979,-0.7404,-0.326,0.5878,-0.6725,-0.3921,0.6277,-0.6364,-0.4873,0.5979,-0.7236,-0.472,0.5036,-0.7748,-0.5055,0.3798,-0.7199,-0.5956,0.3564,-0.702,-0.676,0.2243,-0.6139,-0.7813,0.1129,-0.5666,-0.8225,0.0502,-0.4371,-0.8994,0,-0.4433,-0.8837,-0.1502,-0.519,-0.8178,-0.2487,-0.606,-0.7515,-0.2608,-0.6478,-0.7442,-0.1626,-0.8233,-0.5671,0.0251,-0.8879,-0.4594,-0.0251,-0.9459,-0.3205,0.0502,-0.9572,-0.2716,0.1004,-0.9837,-0.1495,0.1004,-0.9946,0.025,0.1004,-0.9999,0,-0.0126,-0.9876,0.1374,-0.0753,-0.9667,0.0975,-0.2365,-0.9382,0.0946,-0.3328,-0.8923,0.1127,-0.4371,-0.8548,0.1631,-0.4927,-0.8086,0.2854,-0.5144,-0.7449,0.3974,-0.5358,-0.7129,0.4524,-0.5358,-0.6673,0.6111,-0.4258],
        [-0.4708,-0.7848,0.4029,-0.5586,-0.7489,0.3564,-0.5919,-0.7341,0.3328,-0.6174,-0.7463,0.2487,-0.5276,-0.8313,0.175,-0.4514,-0.8724,0.1874,-0.3566,-0.9006,0.2487,-0.3621,-0.8513,0.3798],
        [0.7748,-0.5055,0.3798,0.7276,-0.5287,0.4371,0.7294,-0.4629,0.5036,0.7836,-0.4055,0.4707,0.8036,-0.4158,0.4258],
        [0.5531,-0.7415,-0.3798,0.5994,-0.7433,-0.297,0.6074,-0.6977,-0.3798],
        [0.0861,0.9112,-0.4029,0.1523,0.9241,-0.3505,0.1263,0.9519,-0.279,0.0605,0.9618,-0.2669,0.006,0.9567,-0.291,0.0116,0.925,-0.3798],
        [0.0062,-0.9877,0.1564,-0.093,-0.9843,0.1502,-0.128,-0.9646,0.2304,-0.1553,-0.9422,0.297,-0.0771,-0.9419,0.3269,-0.0121,-0.9653,0.2608,0.0796,-0.9727,0.2181],
        [-0.1502,-0.9886,-0.0063,-0.1063,-0.9915,0.0753,-0.0376,-0.9969,0.0691,0.0314,-0.9992,0.0251,0.0188,-0.9986,-0.0502,-0.0312,-0.9938,-0.1066,-0.1119,-0.985,-0.1316,-0.1561,-0.9853,-0.0691]] },
      { color: "#686763", alpha: 0.1, fills: [
        [-0.6715,-0.0913,0.7354,-0.614,-0.0406,0.7882,-0.5743,0.0289,0.8181,-0.5433,0.0583,0.8375,-0.5441,0.1056,0.8323,-0.5282,0.1996,0.8253,-0.4938,0.24,0.8358,-0.439,0.2237,0.8702,-0.4297,0.178,0.8852,-0.4128,0.1256,0.9021,-0.4651,0.0887,0.8808,-0.4624,0.0029,0.8867,-0.5017,-0.0682,0.8623,-0.5066,-0.1386,0.851,-0.4758,-0.2577,0.8409,-0.4546,-0.3216,0.8306,-0.4843,-0.3757,0.7902,-0.5441,-0.3501,0.7624,-0.676,-0.3104,0.6684],
        [-0.1134,-0.5845,0.8034,-0.1469,-0.5371,0.8306,-0.0733,-0.4928,0.8671,-0.0429,-0.5447,0.8375],
        [0.0057,-0.9035,0.4286,0.0557,-0.8849,0.4624,0.0861,-0.9112,0.4029],
        [-0.2153,-0.051,0.9752,-0.1724,-0.0448,0.984,-0.216,-0.0709,0.9738],
        [-0.441,0.4466,0.7785,-0.355,0.5294,0.7705,-0.355,0.4291,0.8306,-0.4129,0.3415,0.8443,-0.4901,0.2857,0.8235],
        [-0.8148,0.4479,0.3681,-0.8419,0.3833,0.3798,-0.9072,0.2574,0.3328,-0.9367,0.2032,0.285,-0.9643,0.2092,0.1626,-0.9653,0.2608,0.0126,-0.9466,0.2053,-0.2487,-0.9396,0.3184,-0.1253,-0.9098,0.4142,0.0251,-0.8371,0.474,0.273]] }
    ];

    /* ------------------------------------------------------------ model state */
    var sunAngle = 270, moonAngle = 180, theta = 0, phi = 90, contrast = 0.65;
    var step = [false, false, false, false, false, false];       // steps 1..6
    var T = null;                                                // the 3 x 3 camera
    var slew = null;                                             // {t0,th0,ph0,th1,ph1}
    var SLEW_MS = 900;

    /* ------------------------------------------------------------- projection */
    /* Scene3D.calculateConstants, verbatim. screenZ grows towards the viewer. */
    function camera(thetaDeg, phiDeg) {
      var vt = (thetaDeg + 180) * RAD;
      var vp = Math.max(-90, Math.min(90, phiDeg)) * RAD;
      var ct = Math.cos(vt), st = Math.sin(vt), cp = Math.cos(vp), sp = Math.sin(vp);
      return [SCALE * st, -SCALE * ct, 0,
        -SCALE * ct * sp, -SCALE * st * sp, -SCALE * cp,
        -SCALE * ct * cp, -SCALE * st * cp, SCALE * sp];
    }
    function pr(x, y, z) {
      return { x: T[0] * x + T[1] * y + T[2] * z,
        y: T[3] * x + T[4] * y + T[5] * z,
        z: T[6] * x + T[7] * y + T[8] * z };
    }

    /* ---------------------------------------------------------- the two globes */
    function bodies() {
      var m = moonAngle * RAD;
      var earth = { wx: 0, wy: 0, wz: 0, r: R_EARTH, base: WATER, land: LAND,
        spin: 0, layers: null };
      var moon = { wx: MOON_DIST * Math.cos(m), wy: MOON_DIST * Math.sin(m), wz: 0,
        r: R_MOON, base: MOON_BASE, land: null, spin: moonAngle, layers: MARIA };
      [earth, moon].forEach(function (g) {
        var p = pr(g.wx, g.wy, g.wz);
        g.sx = C.x + p.x; g.sy = C.y + p.y; g.sz = p.z;
        g.sr = g.r * SCALE;
      });
      return { earth: earth, moon: moon };
    }

    /* MainTimeline.updateTransparency: how far the Moon's disc has slid clear of
       the Earth's, 0 while it is dead behind it and 1 once they no longer touch */
    function clearness(b) {
      if (b.moon.sz >= 0) return 1;                    // the Moon is nearer than us
      var d = Math.sqrt((b.moon.sx - b.earth.sx) * (b.moon.sx - b.earth.sx) +
        (b.moon.sy - b.earth.sy) * (b.moon.sy - b.earth.sy));
      var lo = SCALE * (R_EARTH - R_MOON), hi = SCALE * (R_EARTH + R_MOON);
      return Math.max(0, Math.min(1, (d - lo) / (hi - lo)));
    }
    function lerp(pair, t) { return pair[0] + (pair[1] - pair[0]) * t; }

    /* --------------------------------------------------------- bisecting planes */
    /* BisectingPlanesForGlobe3D: a square 1.4 radii across, lying in the vertical
       plane at `angleDeg`, with the globe's great circle punched out of it. It is
       cut into fragments at the quadrant angles and at the two angles where the
       great circle crosses from the front of the globe to the back, so each piece
       can be z-sorted against the globe on its own.                            */
    function planeFragments(g, angleDeg, colour, fillA, lineA, out) {
      var al = -angleDeg * RAD, ca = Math.cos(al), sa = Math.sin(al);
      var a6 = T[6] * ca - T[7] * sa, a8 = T[8];
      var split = mod(-Math.atan2(a6, a8), TAU);
      var angles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
      if (phi !== 0) angles.push(split, mod(split + Math.PI, TAU));
      angles.sort(function (p, q) { return p - q; });

      /* in-plane (px, pz) -> screen, and the square's half-width */
      var a0 = T[0] * ca - T[1] * sa, a2 = T[2];
      var a3 = T[3] * ca - T[4] * sa, a5 = T[5];
      var outer = PLANE_SIZE * g.r;
      var corners = [[outer, -outer], [outer, outer], [-outer, outer], [-outer, -outer]];
      function toScreen(px, pz) { return [g.sx + a0 * px + a2 * pz, g.sy + a3 * px + a5 * pz]; }
      function edge(ang) {                        // where the ray leaves the square
        var k = Math.floor((ang + Math.PI / 4) / (Math.PI / 2)) % 4;
        if (k === 1) return [outer / Math.tan(ang), outer];
        if (k === 2) return [-outer, -outer * Math.tan(ang)];
        if (k === 3) return [-outer / Math.tan(ang), -outer];
        return [outer, outer * Math.tan(ang)];
      }

      for (var i = 0; i < angles.length; i++) {
        var u = angles[i], v = angles[(i + 1) % angles.length];
        var arc = v > u ? v - u : v - u + TAU;
        var mid = u + arc / 2;
        var path = [];
        var n = Math.max(2, Math.ceil(arc / 0.25));
        for (var j = 0; j <= n; j++) {
          var a = u + arc * j / n;
          path.push(toScreen(g.r * Math.cos(a), g.r * Math.sin(a)));
        }
        var pv = edge(v), pu = edge(u);
        path.push(toScreen(pv[0], pv[1]));
        var kv = Math.floor((v + Math.PI / 4) / (Math.PI / 2)) % 4;
        var ku = Math.floor((u + Math.PI / 4) / (Math.PI / 2)) % 4;
        var nc = mod2(kv - ku, 4);
        for (var q = 0; q < nc; q++) {
          var cpt = corners[mod2(kv - q, 4)];
          path.push(toScreen(cpt[0], cpt[1]));
        }
        path.push(toScreen(pu[0], pu[1]));
        out.push({ z: g.sz + g.r * (a6 * Math.cos(mid) + a8 * Math.sin(mid)),
          draw: fillPath(path, colour, fillA, lineA) });
      }
    }
    function fillPath(path, colour, fillA, lineA) {
      return function (ctx) {
        ctx.beginPath();
        ctx.moveTo(path[0][0], path[0][1]);
        for (var i = 1; i < path.length; i++) ctx.lineTo(path[i][0], path[i][1]);
        ctx.closePath();
        ctx.globalAlpha = fillA; ctx.fillStyle = colour; ctx.fill();
        ctx.globalAlpha = lineA; ctx.strokeStyle = colour; ctx.lineWidth = 1; ctx.stroke();
        ctx.globalAlpha = 1;
      };
    }
    function mod(v, m) { return ((v % m) + m) % m; }
    function mod2(v, m) { return ((v % m) + m) % m; }

    /* --------------------------------------------------------------- the globe */
    function drawGlobe(ctx, g, alpha, lineAlpha, mirror) {
      /* Globe.calculateBConstants is the scene's own matrix at the globe's radius,
         and earthBack re-renders the same globe from behind to show its far side */
      var th = mirror ? theta + 180 : theta, ph = mirror ? -phi : phi;
      var vt = (th + 180) * RAD, vp = Math.max(-90, Math.min(90, ph)) * RAD;
      var ct = Math.cos(vt), st = Math.sin(vt), cp = Math.cos(vp), sp = Math.sin(vp);
      var R = g.sr, mx = mirror ? -1 : 1;
      var cs = Math.cos(g.spin * RAD), ss = Math.sin(g.spin * RAD);
      function gp(x, y, z) {                     // globe frame -> screen, about (0,0)
        var rx = x * cs - y * ss, ry = x * ss + y * cs;   // Q, the rotationAngle spin
        return { x: mx * R * (rx * st - ry * ct),
          y: R * (-rx * ct * sp - ry * st * sp - z * cp),
          z: -rx * ct * cp - ry * st * cp + z * sp };
      }
      ctx.save();
      ctx.translate(g.sx, g.sy);
      ctx.globalAlpha = alpha;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.clip();
      ctx.fillStyle = g.base; ctx.fillRect(-R, -R, 2 * R, 2 * R);
      if (g.land) {
        ctx.beginPath();
        EARTH.landPath(ctx, gp, R);
        ctx.fillStyle = g.land; ctx.fill("evenodd");
        if (lineAlpha > 0.01) {                  // the SWF strokes the coastlines white
          ctx.globalAlpha = alpha * lineAlpha;
          ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1; ctx.stroke();
          ctx.globalAlpha = alpha;
        }
      }
      if (g.layers) {
        for (var i = 0; i < g.layers.length; i++) {
          var L = g.layers[i];
          ctx.globalAlpha = alpha * L.alpha;
          ctx.fillStyle = L.color;
          for (var k = 0; k < L.fills.length; k++) {
            var f = L.fills[k];
            ctx.beginPath();
            for (var j = 0, started = false; j < f.length; j += 3) {
              var q = gp(f[j], f[j + 1], f[j + 2]);
              if (q.z < 0) continue;
              if (!started) { ctx.moveTo(q.x, q.y); started = true; } else ctx.lineTo(q.x, q.y);
            }
            ctx.closePath(); ctx.fill();
          }
        }
        ctx.globalAlpha = alpha;
      }
      if (step[2]) nightCap(ctx, R);
      ctx.restore();
    }

    /* Globe.updateShading: the night side, bounded by the terminator ellipse the
       Sun-perpendicular great circle projects to.                              */
    function nightCap(ctx, R) {
      var su = pr(Math.cos(sunAngle * RAD), Math.sin(sunAngle * RAD), 0);
      var len = Math.sqrt(su.x * su.x + su.y * su.y + su.z * su.z);
      if (!len) return;
      var ux = su.x / len, uy = su.y / len, uz = su.z / len;
      var h = Math.sqrt(ux * ux + uy * uy);
      var prev = ctx.globalAlpha;
      ctx.globalAlpha = prev * contrast;
      ctx.fillStyle = "#000000";
      if (h < 1e-9) {                            // the Sun straight down the sight line
        if (uz < 0) { ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); }
        ctx.globalAlpha = prev;
        return;
      }
      var dx = ux / h, dy = uy / h;              // the Sun's heading across the screen
      var nx = -dy, ny = dx;                     // and square across it
      var N = 64, i, a, X, Y;
      ctx.beginPath();
      for (i = 0; i <= N; i++) {                 // the limb, on the side away from the Sun
        a = -Math.PI / 2 + Math.PI * i / N;
        X = -dx * Math.cos(a) + nx * Math.sin(a);
        Y = -dy * Math.cos(a) + ny * Math.sin(a);
        if (i === 0) ctx.moveTo(R * X, R * Y); else ctx.lineTo(R * X, R * Y);
      }
      for (i = 0; i <= N; i++) {                 // home along the terminator ellipse
        a = Math.PI * i / N;
        X = nx * Math.cos(a) + dx * uz * Math.sin(a);
        Y = ny * Math.cos(a) + dy * uz * Math.sin(a);
        ctx.lineTo(R * X, R * Y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = prev;
    }

    /* ------------------------------------------------- the flat orbital plane */
    /* MBDOrbitalPlane, drawn straight in world z = 0: the orbit, the Earth–Moon
       line at 0.41 .. 1.99 radii, and a "sun" arrow off each body.            */
    function drawOrbitPlane(ctx, b) {
      var m = moonAngle * RAD, s = sunAngle * RAD;
      var cm = Math.cos(m), sm = Math.sin(m), csu = Math.cos(s), ssu = Math.sin(s);
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath();
      for (var i = 0; i <= 180; i++) {
        var a = TAU * i / 180, p = pr(MOON_DIST * Math.cos(a), MOON_DIST * Math.sin(a), 0);
        if (i === 0) ctx.moveTo(C.x + p.x, C.y + p.y); else ctx.lineTo(C.x + p.x, C.y + p.y);
      }
      ctx.stroke();
      arrowhead(ctx, moonAngle - 40);            // the direction-of-travel tick
      if (step[3]) {
        ctx.strokeStyle = "rgba(0,160,255,0.6)"; ctx.lineWidth = 2;
        var p1 = pr(0.41 * cm, 0.41 * sm, 0), p2 = pr(1.99 * cm, 1.99 * sm, 0);
        ctx.beginPath();
        ctx.moveTo(C.x + p1.x, C.y + p1.y); ctx.lineTo(C.x + p2.x, C.y + p2.y);
        ctx.stroke();
      }
      if (step[0]) {
        sunArrow(ctx, 0.64 * csu, 0.64 * ssu, csu, ssu);
        sunArrow(ctx, MOON_DIST * cm + 0.32 * csu, MOON_DIST * sm + 0.32 * ssu, csu, ssu);
      }
      ctx.restore();
    }
    function arrowhead(ctx, deg) {
      var a = deg * RAD, back = a - 6 * RAD;
      var tip = pr(MOON_DIST * Math.cos(a), MOON_DIST * Math.sin(a), 0);
      var tl = pr(MOON_DIST * 1.05 * Math.cos(back), MOON_DIST * 1.05 * Math.sin(back), 0);
      var tr = pr(MOON_DIST * 0.95 * Math.cos(back), MOON_DIST * 0.95 * Math.sin(back), 0);
      ctx.beginPath();
      ctx.moveTo(C.x + tip.x, C.y + tip.y);
      ctx.lineTo(C.x + tl.x, C.y + tl.y);
      ctx.moveTo(C.x + tip.x, C.y + tip.y);
      ctx.lineTo(C.x + tr.x, C.y + tr.y);
      ctx.stroke();
    }
    /* a flat arrow lying in the orbital plane, so it squashes with the plane */
    function sunArrow(ctx, wx, wy, ux, uy) {
      var vx = -uy, vy = ux;                     // across the arrow
      var L = 0.42, W = 0.055, HL = 0.15, HW = 0.115;
      var pts = [[0, W], [L - HL, W], [L - HL, HW], [L, 0], [L - HL, -HW], [L - HL, -W], [0, -W]];
      ctx.beginPath();
      for (var i = 0; i < pts.length; i++) {
        var q = pr(wx + ux * pts[i][0] + vx * pts[i][1], wy + uy * pts[i][0] + vy * pts[i][1], 0);
        if (i === 0) ctx.moveTo(C.x + q.x, C.y + q.y); else ctx.lineTo(C.x + q.x, C.y + q.y);
      }
      ctx.closePath();
      ctx.fillStyle = COL_SUN; ctx.fill();
      /* the label rides the plane clip, so it turns with the view and flattens to
         nothing as the plane goes edge-on — PlaneRotator's rotation + scaleY */
      var lx = wx + ux * L * 0.55 + vx * 0.26, lyw = wy + uy * L * 0.55 + vy * 0.26;
      var cth = Math.cos(theta * RAD), sth = Math.sin(theta * RAD);
      var sph = Math.sin(Math.max(-90, Math.min(90, phi)) * RAD);
      ctx.save();
      ctx.transform(cth, sph * sth, -sth, sph * cth, C.x, C.y);
      ctx.fillStyle = COL_SUN;
      ctx.font = "bold 12px " + FONT;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(I18N.t("mb.sunL"), SCALE * lyw, SCALE * lx);
      ctx.restore();
    }

    /* ------------------------------------------------------------- phase disc */
    /* PhaseDisc.update, with phaseAngle = pi - elongation                      */
    function phaseAngle() { return mod(Math.PI - (moonAngle - sunAngle) * RAD, TAU); }
    function drawDisc(ctx, cx, cy, r) {
      var P = phaseAngle(), f = P < Math.PI ? -1 : 1, s = r * Math.cos(P);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
      ctx.fillStyle = "#404040"; ctx.fill();
      ctx.beginPath();
      var N = 72, i, a;
      for (i = 0; i <= N; i++) {                 // the lit semicircle, on the -f side
        a = Math.PI * i / N;
        var lx = cx - f * r * Math.sin(a), ly2 = cy - r * Math.cos(a);
        if (i === 0) ctx.moveTo(lx, ly2); else ctx.lineTo(lx, ly2);
      }
      for (i = N; i >= 0; i--) {                 // home along the terminator
        a = Math.PI * i / N;
        ctx.lineTo(cx + f * s * Math.sin(a), cy - r * Math.cos(a));
      }
      ctx.closePath();
      ctx.fillStyle = "#e0e0e0"; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU);
      ctx.strokeStyle = "rgba(32,32,32,0.3)"; ctx.lineWidth = 1; ctx.stroke();
    }
    function phaseKey() {
      var e = mod(moonAngle - sunAngle, 360), b = 5, g = 12;
      if (e <= g) return "mb.new";
      if (e <= 90 - b) return "mb.wxc";
      if (e <= 90 + b) return "mb.fq";
      if (e <= 180 - g) return "mb.wxg";
      if (e <= 180 + g) return "mb.full";
      if (e <= 270 - b) return "mb.wng";
      if (e <= 270 + b) return "mb.tq";
      if (e <= 360 - g) return "mb.wnc";
      return "mb.new";
    }

    /* ------------------------------------------------------------- the controls */
    S.group("mb.steps");
    var stepCtl = [];
    ["mb.s1", "mb.s2", "mb.s3", "mb.s4", "mb.s5", "mb.s6"].forEach(function (k, i) {
      stepCtl.push(S.toggle({ labelKey: k, value: false, on: function (v) {
        step[i] = v; syncStepButtons(); refresh();
      } }));
    });
    var btnHide = S.button({ labelKey: "mb.hideAll", on: function () { setAll(false); } });
    var btnShow = S.button({ labelKey: "mb.showAll", primary: true, on: function () { setAll(true); } });
    var contrastCtl = S.slider({ labelKey: "mb.contrast", min: 0.5, max: 0.85, value: 0.65,
      step: 0.01, format: function (v) { return Math.round(v * 100) + "%"; },
      on: function (v) { contrast = v; } });

    S.group("mb.pos");
    var sunCtl = S.slider({ labelKey: "mb.sun", min: 0, max: 360, value: 270, step: 1,
      unit: "°", on: function (v) { sunAngle = v; refresh(); } });
    var moonCtl = S.slider({ labelKey: "mb.moon", min: 0, max: 360, value: 180, step: 1,
      unit: "°", on: function (v) { moonAngle = v; refresh(); } });

    S.group("mb.persp");
    S.button({ labelKey: "mb.earth", on: function () { slewTo(180 + moonAngle, 0); } });
    S.button({ labelKey: "mb.over", on: function () { slewTo(90 + sunAngle, 90); } });
    var driving = false;                         // true while a slew moves the sliders
    var thetaCtl = S.slider({ labelKey: "mb.lr", min: 0, max: 360, value: 0, step: 1,
      unit: "°", on: function (v) { if (!driving) slew = null; theta = v; } });
    var phiCtl = S.slider({ labelKey: "mb.ud", min: -90, max: 90, value: 90, step: 1,
      unit: "°", on: function (v) { if (!driving) slew = null; phi = v; } });
    S.button({ labelKey: "mb.reset", on: reset });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "mb.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outPhase = S.readout({ labelKey: "mb.rPhase" });
    var outElong = S.readout({ labelKey: "mb.rElong" });
    var outLit = S.readout({ labelKey: "mb.rLit" });

    function setAll(v) {
      for (var i = 0; i < 6; i++) stepCtl[i].set(v);
    }
    function syncStepButtons() {
      var n = step.reduce(function (a, b) { return a + (b ? 1 : 0); }, 0);
      btnShow.disabled = n === 6;
      btnHide.disabled = n === 0;
      contrastCtl.input.disabled = !step[2];
    }
    function reset() {
      setAll(false);
      sunCtl.set(270); moonCtl.set(180);
      thetaCtl.set(0); phiCtl.set(90);
      contrastCtl.set(0.65);
      slew = null;
      refresh();
    }
    function slewTo(th, ph) {
      th = mod(th, 360); ph = Math.max(-90, Math.min(90, ph));
      var d = th - mod(theta, 360);
      if (d < -180) th += 360; else if (d > 180) th -= 360;
      slew = { t0: performance.now(), th0: mod(theta, 360), ph0: phi, th1: th, ph1: ph };
      spin.play();
    }
    var spin = S.loop(function () {
      if (!slew) { spin.pause(); return; }
      var u = Math.min(1, (performance.now() - slew.t0) / SLEW_MS);
      var e = u * u * (3 - 2 * u);               // CubicEaser(0).setTarget(0, 0, 1, 1)
      driving = true;
      thetaCtl.set(mod(slew.th0 + e * (slew.th1 - slew.th0), 360));
      phiCtl.set(slew.ph0 + e * (slew.ph1 - slew.ph0));
      driving = false;
      if (u >= 1) { slew = null; spin.pause(); }
    });

    function refresh() {
      var e = mod(moonAngle - sunAngle, 360);
      outPhase(I18N.t(phaseKey()));
      outElong(e.toFixed(0) + "°");
      outLit(Math.round(100 * (1 - Math.cos(e * RAD)) / 2) + "%");
    }

    /* ------------------------------------------------------- drag to swing round */
    var drag = null;
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (p.x < BOX.x || p.x > BOX.x + BOX.w || p.y < BOX.y || p.y > BOX.y + BOX.h) return;
      slew = null;
      drag = { x: p.x, y: p.y, th: theta, ph: phi };
      S.canvas.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var p = at(ev);
      thetaCtl.set(Math.round(mod(drag.th - (p.x - drag.x) / SCALE * DEG, 360)));
      phiCtl.set(Math.round(Math.max(-90, Math.min(90, drag.ph + (p.y - drag.y) / SCALE * DEG))));
    });
    ["pointerup", "pointercancel"].forEach(function (k) {
      S.canvas.addEventListener(k, function () { drag = null; });
    });
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }

    /* --------------------------------------------------------------- the paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      T = camera(theta, phi);
      S.clear();
      ctx.fillStyle = "#f2f2f2"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.fillStyle = "#000000"; ctx.fillRect(BOX.x, BOX.y, BOX.w, BOX.h);

      var b = bodies();
      var t = clearness(b);
      var eA = lerp(A.earth, t), eL = lerp(A.earthLine, t);

      ctx.save();
      ctx.beginPath(); ctx.rect(BOX.x, BOX.y, BOX.w, BOX.h); ctx.clip();

      /* the orbital plane lies in world z = 0, where depth rises with screen y,
         so the SWF masks it into bands split at each globe's centre            */
      var order = b.earth.sz <= b.moon.sz ? [b.earth, b.moon] : [b.moon, b.earth];
      var edges = phi >= 0 ? [BOX.y, order[0].sy, order[1].sy, BOX.y + BOX.h]
        : [BOX.y + BOX.h, order[0].sy, order[1].sy, BOX.y];

      var items = [];
      if (step[1]) {
        planeFragments(b.earth, sunAngle - 90, COL_SUN, lerp(A.p1, t), lerp(A.l1, t), items);
        planeFragments(b.moon, sunAngle - 90, COL_SUN, 0.5, 0.8, items);
      }
      if (step[4]) {
        planeFragments(b.earth, moonAngle - 90, COL_EM, lerp(A.p2, t), lerp(A.l2, t), items);
        planeFragments(b.moon, moonAngle - 90, COL_EM, 0.5, 0.8, items);
      }
      items.push({ z: b.earth.sz - 1e-4, draw: function (c) { drawGlobe(c, b.earth, eA, eL, true); } });
      items.push({ z: b.earth.sz, draw: function (c) { drawGlobe(c, b.earth, eA, eL, false); } });
      items.push({ z: b.moon.sz, draw: function (c) { drawGlobe(c, b.moon, 1, 0, false); } });
      for (var k = 0; k < 3; k++) {
        (function (k) {
          var y0 = edges[k], y1 = edges[k + 1];
          var z = k === 0 ? order[0].sz - 1e-3 : (k === 1 ? order[1].sz - 1e-3 : order[1].sz + 1e-3);
          items.push({ z: z, draw: function (c) {
            c.save();
            c.beginPath();
            c.rect(BOX.x, Math.min(y0, y1), BOX.w, Math.abs(y1 - y0));
            c.clip();
            drawOrbitPlane(c, b);
            c.restore();
          } });
        })(k);
      }
      items.sort(function (p, q) { return p.z - q.z; });
      for (var i = 0; i < items.length; i++) items[i].draw(ctx);
      ctx.restore();

      /* the right-hand strip: the phase the two cuts have just produced */
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(STRIP.x, STRIP.y, STRIP.w, STRIP.h);
      ctx.strokeStyle = "#d6d6d6"; ctx.lineWidth = 1;
      ctx.strokeRect(STRIP.x + 0.5, STRIP.y + 0.5, STRIP.w - 1, STRIP.h - 1);
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#333333"; ctx.font = "13px " + FONT;
      ctx.fillText(tr("mb.title"), DISC.x, STRIP.y + 32);
      if (step[5]) {
        drawDisc(ctx, DISC.x, DISC.y, DISC.r);
        ctx.fillStyle = "#111111"; ctx.font = "bold 14px " + FONT;
        ctx.fillText(tr(phaseKey()), DISC.x, DISC.y + DISC.r + 30);
        ctx.fillStyle = "#666666"; ctx.font = "12px " + FONT;
        ctx.fillText(Math.round(100 * (1 - Math.cos(mod(moonAngle - sunAngle, 360) * RAD)) / 2) +
          "% " + tr("mb.rLit"), DISC.x, DISC.y + DISC.r + 50);
      } else {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "#d0d0d0";
        ctx.beginPath(); ctx.arc(DISC.x, DISC.y, DISC.r, 0, TAU); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#a8a8a8"; ctx.font = "12px " + FONT;
        wrapCentre(ctx, tr("mb.s6"), DISC.x, DISC.y + DISC.r + 30, STRIP.w - 32, 15);
      }

      /* a key to the two cuts, dimmed until that step is showing */
      var ly = DISC.y + DISC.r + 86;
      ctx.textAlign = "left";
      [[COL_SUN, "mb.legSun", step[1]], [COL_EM, "mb.legEM", step[4]]].forEach(function (row) {
        ctx.globalAlpha = row[2] ? 1 : 0.35;
        ctx.fillStyle = row[0];
        ctx.fillRect(STRIP.x + 16, ly - 10, 14, 14);
        ctx.fillStyle = "#444444"; ctx.font = "12px " + FONT;
        ly = wrap(ctx, tr(row[1]), STRIP.x + 38, ly, STRIP.w - 54, 14) + 22;
        ctx.globalAlpha = 1;
      });
    });

    /* the same word wrap, but centred on x — for the strip's own captions */
    function wrapCentre(ctx, text, cx, y, w, lh) {
      var words = String(text).split(" "), lines = [], line = "";
      for (var i = 0; i < words.length; i++) {
        var probe = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(probe).width > w && line) { lines.push(line); line = words[i]; }
        else line = probe;
      }
      if (line) lines.push(line);
      for (var j = 0; j < lines.length; j++) ctx.fillText(lines[j], cx, y + j * lh);
      return y + (lines.length - 1) * lh;
    }

    function wrap(ctx, text, x, y, w, lh) {
      var words = String(text).split(" "), line = "";
      for (var i = 0; i < words.length; i++) {
        var probe = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(probe).width > w && line) {
          ctx.fillText(line, x, y); y += lh; line = words[i];
        } else line = probe;
      }
      if (line) ctx.fillText(line, x, y);
      return y;
    }

    syncStepButtons();
    refresh();
  }
});
