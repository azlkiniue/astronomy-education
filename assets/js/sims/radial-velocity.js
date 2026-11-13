/* Exoplanet Radial Velocity Simulator ----------------------------------------------------
   Rebuild of the NAAP "Exoplanet Radial Velocity Simulator" (radialVelocitySimulator.swf,
   decompiled): the canvas is the SWF's stage below its title bar — the visualization and
   the radial-velocity panel; the Visualization / Animation Controls, System Orientation,
   Star / Planet Properties and Presets panels (controls only) are the sidebar, as are the
   plot's check boxes and noise / number sliders.
     • Visualization: the "free space" view is a CelestialSphere (the shared port of the
       SWF's component) holding the Binary System Component at its centre — the star and
       planet orbiting their centre of mass on the grey orbital plane, the star 0.15 and
       the planet 0.07 of the separation across, cut by the plane — and the orange
       "earth view" arrow pointing along our line of sight; drag the view to turn it.
       "show multiple views" adds the side, earth and orbit views and shrinks the free
       view into the fourth quarter.
     • Radial Velocity Component: P = √(4π²a³ / G(M★ + Mp)), K = (2π/P)·a★·sin i / √(1 − e²),
       v = K cos(ω + ν) about K e cos ω, plotted against orbital phase with the SWF's 32
       quadratic segments; the axis keeps the curve 25 px (or 2 × the noise) from the
       edges; simulated measurements add Gaussian noise. Drag the phase cursor, or the
       plot itself to shift the phase; hovering shows crosshairs with the velocity.      */
Sim.create({
  id: "radial-velocity",
  width: 920, height: 414,
  strings: {
    en: {
      "rv.vis": "Visualization Controls", "rv.multi": "show multiple views",
      "rv.anim": "Animation Controls", "rv.start": "start animation", "rv.pause": "pause animation", "rv.speed": "animation speed", "rv.phase": "phase",
      "rv.orient": "System Orientation", "rv.incl": "inclination (°)", "rv.long": "longitude (°)",
      "rv.star": "Star Properties", "rv.smass": "mass (Msun)",
      "rv.presets": "Presets", "rv.set": "set",
      "rv.planet": "Planet Properties", "rv.pmass": "mass (Mjup)", "rv.sma": "semimajor axis (AU)", "rv.ecc": "eccentricity",
      "rv.plot": "Radial velocity plot", "rv.showCurve": "show theoretical curve", "rv.showMeas": "show simulated measurements",
      "rv.noise": "noise (m/s)", "rv.number": "number", "rv.reset": "reset",
      "rv.axisY": "Radial Velocity (m/s)", "rv.axisX": "Phase", "rv.period": "system period:", "rv.days": "days",
      "rv.side": "side view", "rv.earth": "earth view", "rv.orbit": "orbit view",
      "rv.info": "(a main sequence star of this mass would have spectral type {type}V, temperature {t} K, and radius {r} Rsun)"
    },
    id: {
      "rv.vis": "Kontrol Visualisasi", "rv.multi": "tampilkan beberapa pandangan",
      "rv.anim": "Kontrol Animasi", "rv.start": "mulai animasi", "rv.pause": "jeda animasi", "rv.speed": "kecepatan animasi", "rv.phase": "fase",
      "rv.orient": "Orientasi Sistem", "rv.incl": "inklinasi (°)", "rv.long": "bujur (°)",
      "rv.star": "Sifat Bintang", "rv.smass": "massa (Mmatahari)",
      "rv.presets": "Preset", "rv.set": "terapkan",
      "rv.planet": "Sifat Planet", "rv.pmass": "massa (Mjup)", "rv.sma": "sumbu semimayor (SA)", "rv.ecc": "eksentrisitas",
      "rv.plot": "Plot kecepatan radial", "rv.showCurve": "tampilkan kurva teoretis", "rv.showMeas": "tampilkan pengukuran simulasi",
      "rv.noise": "derau (m/s)", "rv.number": "jumlah", "rv.reset": "atur ulang",
      "rv.axisY": "Kecepatan Radial (m/s)", "rv.axisX": "Fase", "rv.period": "periode sistem:", "rv.days": "hari",
      "rv.side": "pandangan samping", "rv.earth": "pandangan Bumi", "rv.orbit": "pandangan orbit",
      "rv.info": "(bintang deret utama bermassa ini akan bertipe spektrum {type}V, bersuhu {t} K, dan beradius {r} Rmatahari)"
    }
  },
  about: {
    en: "<p>A planet doesn't just orbit its star — both bodies circle their shared <strong>centre of mass</strong>, so the star traces a small mirror-image orbit. As the star swings toward and away from us, its light blueshifts and redshifts, and we read off its <strong>radial velocity</strong>.</p>" +
        "<p>The wobble's size is the semi-amplitude <em>K</em> — bigger for heavier, closer planets and edge-on orbits. Only the line-of-sight component shows up, so we actually measure <strong>M·sin i</strong>: a face-on orbit (inclination 0°) gives a flat line and no detection.</p>" +
        "<p>Turn on <strong>simulated measurements</strong> to see the noisy data astronomers fit, and load a real system — this is how 51 Pegasi b, the first exoplanet around a Sun-like star, was found. Drag the view to see the orbit from any side, or show the side, Earth and orbit views together.</p>",
    id: "<p>Planet tidak hanya mengorbit bintangnya — kedua benda mengelilingi <strong>pusat massa</strong> bersama, sehingga bintang menjejaki orbit kecil yang berlawanan. Saat bintang berayun mendekat dan menjauh, cahayanya bergeser biru dan merah, dan kita membaca <strong>kecepatan radialnya</strong>.</p>" +
        "<p>Besar ayunan adalah amplitudo <em>K</em> — lebih besar untuk planet berat, dekat, dan orbit tepi-pandang. Hanya komponen garis pandang yang muncul, jadi kita sebenarnya mengukur <strong>M·sin i</strong>: orbit hadap-muka (inklinasi 0°) memberi garis datar tanpa deteksi.</p>" +
        "<p>Nyalakan <strong>pengukuran simulasi</strong> untuk melihat data berderau yang dicocokkan astronom, dan muat sistem nyata — beginilah 51 Pegasi b, eksoplanet pertama di sekitar bintang mirip-Matahari, ditemukan. Seret tampilan untuk melihat orbit dari sisi mana pun, atau tampilkan pandangan samping, Bumi, dan orbit bersamaan.</p>"
  },
  build: function (S) {
    var FONT = "Verdana, Geneva, sans-serif", ASC = 1.0059, OY = -30, TAU = 2 * Math.PI, PI = Math.PI, D2R = PI / 180;
    function t(k) { return I18N.t(k); }
    function fmt(k, o) { return t(k).replace(/\{(\w+)\}/g, function (m, n) { return o[n]; }); }
    function font(ctx, size, style) { ctx.font = (style ? style + " " : "") + size + "px " + FONT; }
    function mod(v, m) { return ((v % m) + m) % m; }
    function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
    function flashString(v) { return String(parseFloat(v.toPrecision(15))); }
    function flashToFixed(x, f) {
      var s = x < 0 ? "-" : "";
      x = Math.abs(x);
      var n = String(Math.round(x * Math.pow(10, f)));
      if (f > 0) { while (n.length < f + 1) n = "0" + n; n = n.slice(0, n.length - f) + "." + n.slice(n.length - f); }
      return s + n;
    }
    function compToFixed(x, f) { if (!(f > 0)) { var k = Math.pow(10, -f); return flashString(k * Math.round(x / k)); } return flashToFixed(x, Math.min(f, 20)); }
    function sigDigits(x, d) { if (x === 0) return 0; var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10), f = Math.pow(10, d - (1 + e)); return Math.round(f * x) / f; }
    function sigRound(v, sigs) {
      var dec = 1 + Math.floor(Math.log(v) / Math.LN10), pow = Math.pow(10, dec), res = Math.pow(10, sigs);
      var tick = Math.round(v * res / pow);
      if (tick === res) { tick = res / 10; dec += 1; pow = Math.pow(10, dec); }
      var val = tick / res * pow, prec = sigs - dec;
      return { v: val, s: prec > 0 ? flashToFixed(val, prec) : flashString(val) };
    }
    function fixRound(v, d) { var k = Math.pow(10, -d); return { v: k * Math.round(v / k), s: flashToFixed(k * Math.round(v / k), d) }; }
    function formatted(x, digits, kLimit) {        // getFormattedNumber
      var m = Math.floor(Math.log(x) / Math.LN10), k = digits - 1 - m;
      if (!(k > 0)) return flashString(sigDigits(x, digits));
      return x.toFixed(Math.min(k, kLimit));
    }
    function hex(c, a) { return "rgba(" + (c >> 16 & 255) + "," + (c >> 8 & 255) + "," + (c & 255) + "," + (a === undefined ? 1 : a) + ")"; }

    /* ---------------- the star (the SWF's main-sequence fits) ---------------- */
    function lumFromMass(m) { return m < 0.43 ? 0.232220431737728 * Math.pow(m, 2.26) : Math.pow(m, 3.99); }
    function tempFromLum(L) {
      var l = Math.log(L) / Math.LN10, c;
      if (l < -1.61) c = [3.76424847491303, 0.140316436337353, 0.0139709648834783, 0.00146257952166353, 0.000114203991057792, 5.34009520193973e-06, 1.00897501873505e-07];
      else if (l < 0.22) c = [3.76404749064937, 0.139720836051662, 0.0131949471107482, 0.000878016217920958, -0.00016087678534046, -7.18923778642037e-05, -9.8430921759891e-06];
      else if (l < 1.48) c = [3.76404935999916, 0.139700505514371, 0.0132834512392025, 0.000681148684168764, 5.15647954029831e-05, -0.000230931527900807, 1.34429776870977e-05];
      else if (l < 2.61) c = [3.76208682178285, 0.14541668375348, 0.00684584757963743, 0.00396076543835346, -0.000464655201610208, -0.000381007438333072, 6.23586254118745e-05];
      else if (l < 3.62) c = [3.7785507438146, 0.129897095940252, 0.00142810707728862, 0.0167045399494531, -0.00693250229182094, 0.00103845665508301, -5.5992055857869e-05];
      else if (l < 5.43) c = [3.94943146036608, -0.154281251321452, 0.1979230342627, -0.055596100619304, 0.00799539610207913, -0.000600846748510063, 1.87770530697032e-05];
      else c = [4.36797099518548, -0.314871178456464, 0.143399968097621, -0.0130740129137381, -0.00159255369850374, 0.000357973227398207, -1.7804556980593e-05];
      return Math.pow(10, c[0] + l * (c[1] + l * (c[2] + l * (c[3] + l * (c[4] + l * (c[5] + l * c[6]))))));
    }
    var TYPES_V = [[38000, 7], [33200, 9], [31450, 9.5], [29700, 10], [25600, 11], [22300, 12], [19000, 13], [17200, 14], [15400, 15], [14100, 16], [13000, 17], [11800, 18], [10700, 19], [9480, 20], [8810, 22], [8160, 25], [7930, 27], [7020, 30], [6750, 32], [6530, 35], [6240, 37], [5930, 40], [5830, 42], [5740, 44], [5620, 46], [5240, 50], [5010, 52], [4560, 54], [4340, 55], [4040, 57], [3800, 60], [3680, 61], [3530, 62], [3380, 63], [3180, 64], [3030, 65], [2850, 66]];
    function spectralType(T) {
      var n = TYPES_V.length, i = 0;
      while (i < n && !(T > TYPES_V[i][0])) i++;
      var i1 = i === 0 ? 0 : i === n ? n - 2 : i - 1, i2 = i === 0 ? 1 : i === n ? n - 1 : i;
      var m = (TYPES_V[i2][1] - TYPES_V[i1][1]) / (TYPES_V[i2][0] - TYPES_V[i1][0]), num = m * T + (TYPES_V[i1][1] - m * TYPES_V[i1][0]);
      if (!isFinite(num) || num < 0 || !(num < 70)) return null;
      var base = Math.floor(num / 10);
      return { type: "OBAFGKM".charAt(base), number: num - 10 * base };
    }
    function colorFromTemp(T) {
      T = clamp(T, 1000, 40000);
      var l = Math.log(T) / Math.LN10, l2 = l * l, l3 = l * l2;
      var r = clamp(22686.34111 - l * 15082.52755 + l2 * 3375.333832 - l3 * 252.4073853, 0, 255);
      var g = T > 6500 ? 13836.23586 - l * 9069.078214 + l2 * 2015.254756 - l3 * 149.7766966 : -811.6499145 + l * 36.97365953 + l2 * 160.7861677 - l3 * 25.57573664;
      var b = clamp(-11545.34298 + l * 8529.658165 - l2 * 2150.198586 + l3 * 190.0306573, 0, 255);
      return ((r | 0) << 16) | ((g | 0) << 8) | (b | 0);
    }

    /* ---------------- state ---------------- */
    var P = { pMass: 1, sma: 1, ecc: 0.2, sMass: 1, incl: 90, lon: 45 };
    var phase = 0, rate = 0.0005, animating = false, timeLast = 0, multi = false;
    var showCurve = true, showMeas = false, noise = 15, number = 150, NO_NOISE = 0.1;
    var star = {}, rv = {}, phaseOffset = 0.75, meas = [];
    var view = { theta: 80, phi: 45 };

    /* ---------------- Radial Velocity Component ---------------- */
    var PLOT = { x: 500, y: 55.9, w: 321 * 1.214432, h: 221 * 0.950409 };
    PLOT.hh = PLOT.h / 2;
    function updatePlot() {                        // update()
      var m1 = P.sMass * 1.98892e30, m2 = P.pMass * 1.899e27, a2 = P.sma * 149598000000, a1 = m2 / m1 * a2;
      var per = Math.sqrt(39.47841760435743 * a2 * a2 * a2 / (6.673e-11 * (m1 + m2)));
      var K = TAU / per * a1 * Math.sin(P.incl * D2R) / Math.sqrt(1 - P.ecc * P.ecc);
      var nz = showMeas ? noise : NO_NOISE, mg = 2 * nz, b = PLOT.hh * (mg / (K + mg));
      var margin = b < 25 ? 25 * K / (PLOT.hh - 25) : mg, h = K + margin;
      rv = { K: K, w: P.lon * D2R, e: P.ecc, center: K * P.ecc * Math.cos(P.lon * D2R), period: per / 86400,
        yScale: -PLOT.hh / h, yMin: K * P.ecc * Math.cos(P.lon * D2R) - h, yMax: K * P.ecc * Math.cos(P.lon * D2R) + h };
      // the curve: 32 steps in true anomaly, each a quadratic matching the slopes (updateCurve)
      var A = K, w = rv.w, e = rv.e, k = Math.sqrt((1 + e) / (1 - e)), xs = PLOT.w / TAU, ys = rv.yScale, n = 32, st = TAU / n;
      var ta = 0, lv = A * Math.cos(w), lma = 0, lm = A * k * Math.sin(w) / (e - 1), segs = [[0, ys * lv]];
      for (var i = 0; i < n; i++) {
        ta += st;
        var j = Math.tan(0.5 * ta), ea = 2 * Math.atan(j / k), ma = ea - e * Math.sin(ea);
        if (ma < lma) ma += TAU;
        var v = A * Math.cos(w + ta), m = A * Math.sin(w + ta) * (k + j * j / k) / ((e * Math.cos(ea) - 1) * (1 + j * j));
        var cma = (lv - v - lm * lma + m * ma) / (m - lm);
        if (cma > ma || cma < lma) segs.push([xs * ma, ys * v]);
        else segs.push([xs * cma, ys * (m * (cma - ma) + v), xs * ma, ys * v]);
        lm = m; lma = ma; lv = v;
      }
      rv.curve = segs;
      // simulated measurements
      meas = [];
      if (showMeas) {
        for (var q = 0; q < Math.ceil(number / 2) * 2; q += 2) {
          var x1, x2, o;
          do { x1 = 2 * Math.random() - 1; x2 = 2 * Math.random() - 1; o = x1 * x1 + x2 * x2; } while (!(o < 1));
          o = Math.sqrt(-2 * Math.log(o) / o);
          [x1, x2].forEach(function (g) {
            var mma = Math.random() * TAU, e0, e1 = mma;
            do { e0 = e1; e1 = e0 + (mma + e * Math.sin(e0) - e0) / (1 - e * Math.cos(e0)); } while (Math.abs(e1 - e0) > 0.001);
            var tta = 2 * Math.atan(k * Math.tan(e1 / 2));
            meas.push([mma * xs, ys * (A * Math.cos(w + tta) + noise * g * o)]);
          });
        }
      }
    }
    function updateStar() {
      star.lum = lumFromMass(P.sMass); star.temp = tempFromLum(star.lum); star.radius = 33736108.2311059 * Math.sqrt(star.lum) / (star.temp * star.temp);
      var st = spectralType(star.temp), num = st ? Math.round(st.number) : 0;
      if (num === 10) num = 9;
      infoEl.textContent = fmt("rv.info", { type: st ? st.type + num : "?", t: formatted(star.temp, 3, 12), r: star.radius.toFixed(1) });
    }
    function updateAll() { updateStar(); updatePlot(); S.requestDraw(); }

    /* ---------------- Binary System Component ---------------- */
    function solveKepler(ma, e) { var e0, e1 = ma, c = 0; do { e0 = e1; e1 = e0 + (ma + e * Math.sin(e0) - e0) / (1 - e * Math.cos(e0)); c++; } while (Math.abs(e1 - e0) > 0.001 && c < 100); return e1; }
    function system() {
      var sep = P.sma, m1 = P.sMass, m2 = P.pMass / 1047.52, mt = m1 + m2;
      return { sep: sep, e: P.ecc, a1: sep * m2 / mt, a2: sep * m1 / mt, r1: 0.15 * sep, r2: 0.07 * sep };
    }
    function bodyDisc(ctx, r, color) {             // a disc of the body's colour and the white radial shading
      ctx.fillStyle = hex(color); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, "rgba(255,255,255,0.55)"); g.addColorStop(170 / 255, "rgba(255,255,255,0.45)"); g.addColorStop(1, "rgba(255,255,255,0.1)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    }
    function drawSystem(ctx, o) {                  // the Binary System Component, centred on (0, 0)
      var y = system(), s = o.size / (2 * Math.max(y.a1 * (1 + y.e) + y.r1, y.a2 * (1 + y.e) + y.r2));
      var th = o.theta * D2R, ph = o.phi * D2R, ct = Math.cos(th), st = Math.sin(th), cp = Math.cos(ph), sp = Math.sin(ph);
      var A = { a0: -s * st, a1: s * ct, a3: s * ct * sp, a4: s * st * sp, a6: s * ct * cp, a7: s * st * cp };
      var E = solveKepler(phase * TAU, y.e), nu = 2 * Math.atan(Math.sqrt((1 + y.e) / (1 - y.e)) * Math.tan(E / 2)), kq = (1 - y.e * y.e) / (1 + y.e * Math.cos(nu));
      function proj(x, z) { return { x: x[0] * A.a0 + x[1] * A.a1, y: x[0] * A.a3 + x[1] * A.a4, z: x[0] * A.a6 + x[1] * A.a7 }; }
      var p1 = proj([-y.a1 * kq * Math.cos(nu), -y.a1 * kq * Math.sin(nu)]), p2 = proj([y.a2 * kq * Math.cos(nu), y.a2 * kq * Math.sin(nu)]);
      var R = [0, s * y.r1, s * y.r2], pos = [null, p1, p2], col = [0, o.c1, o.c2], order = p1.z > p2.z ? [2, 1] : [1, 2];
      // back halves
      order.forEach(function (i) { ctx.save(); ctx.translate(pos[i].x, pos[i].y); bodyDisc(ctx, R[i], col[i]); ctx.restore(); });
      // the orbital plane
      ctx.save(); ctx.scale(1, Math.sin(ph)); ctx.rotate((90 + o.theta) * D2R);
      if (o.plane) {
        var e = y.e, sq = Math.sqrt(1 - e * e), b1 = y.a1 * sq, b2 = y.a2 * sq;
        var x0 = -Math.max(y.a2 * (1 + e) + 1.75 * y.r2, y.a1 * (1 - e) + 1.75 * y.r1), x1 = Math.max(y.a1 * (1 + e) + 1.75 * y.r1, y.a2 * (1 - e) + 1.75 * y.r2);
        var yy1 = Math.max(b1 + 1.75 * y.r1, b2 + 1.75 * y.r2), yy0 = -yy1;
        ctx.fillStyle = hex(o.planeColor, o.planeAlpha / 100); ctx.fillRect(s * x0, s * yy0, s * (x1 - x0), s * (yy1 - yy0));
        var m = 20 / s, lg = Math.log(m) / Math.LN10, kk = Math.ceil(lg), sp2, below, mult;
        if (kk - lg > 0.30102999566398114) { below = Math.pow(10, kk - 1); sp2 = 5 * below; mult = 2; } else { sp2 = Math.pow(10, kk); below = 0.5 * sp2; mult = 5; }
        var minorA = (5 + 45 * (sp2 - m) / (sp2 - below)) / 100, i2;
        ctx.lineWidth = 1;
        var gs = function (i) { return i === 0 ? "rgba(77,169,77,0.65)" : "rgba(144,144,144," + (i % mult === 0 ? 0.5 : minorA) + ")"; };
        for (i2 = Math.ceil(x0 / sp2); i2 < Math.ceil(x1 / sp2); i2++) { ctx.strokeStyle = gs(i2); ctx.beginPath(); ctx.moveTo(i2 * sp2 * s, s * yy0); ctx.lineTo(i2 * sp2 * s, s * yy1); ctx.stroke(); }
        for (i2 = Math.ceil(yy0 / sp2); i2 < Math.ceil(yy1 / sp2); i2++) { ctx.strokeStyle = gs(i2); ctx.beginPath(); ctx.moveTo(s * x0, i2 * sp2 * s); ctx.lineTo(s * x1, i2 * sp2 * s); ctx.stroke(); }
      }
      var n = 12, stp = TAU / n, sq2 = Math.sqrt(1 - y.e * y.e), cc = 1 / Math.cos(stp / 2);
      [[s * y.a1, s * y.a1 * sq2, s * y.a1 * y.e], [s * y.a2, s * y.a2 * sq2, -s * y.a2 * y.e]].forEach(function (q) {
        ctx.strokeStyle = hex(o.pathColor); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(q[0] + q[2], 0);
        for (var i = 0, a = 0, c = -stp / 2; i < n; i++) { a += stp; c += stp; ctx.quadraticCurveTo(q[0] * cc * Math.cos(c) + q[2], q[1] * cc * Math.sin(c), q[0] * Math.cos(a) + q[2], q[1] * Math.sin(a)); }
        ctx.stroke();
      });
      ctx.restore();
      // front halves, cut at the equator
      order.forEach(function (i) {
        var r = R[i], n2 = 12, step = TAU / n2, r2 = r / Math.cos(step / 2), a = 0, c = -step / 2, sgn = ph > 0 ? -1 : 1, k2, eq = [];
        ctx.save(); ctx.translate(pos[i].x, pos[i].y);
        ctx.beginPath(); ctx.moveTo(r, 0);
        for (k2 = 0; k2 < n2 / 2; k2++) { a += step; c += step; ctx.quadraticCurveTo(r2 * Math.cos(c), sgn * r2 * Math.sin(c), r * Math.cos(a), sgn * r * Math.sin(a)); }
        for (k2 = n2 / 2; k2 < n2; k2++) {
          a += step; c += step;
          var q = [r2 * Math.cos(c), -r2 * Math.sin(ph) * Math.sin(c), r * Math.cos(a), -r * Math.sin(ph) * Math.sin(a)];
          ctx.quadraticCurveTo(q[0], q[1], q[2], q[3]); eq.push(q);
        }
        ctx.closePath(); ctx.save(); ctx.clip(); bodyDisc(ctx, r, col[i]);
        if (o.plane) {
          ctx.strokeStyle = hex(o.planeColor, Math.min(1, 2 * o.planeAlpha / 100)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-r, 0);
          eq.forEach(function (q2) { ctx.quadraticCurveTo(q2[0], q2[1], q2[2], q2[3]); }); ctx.stroke();
        }
        ctx.restore(); ctx.restore();
      });
    }

    /* ---------------- the free-space view: a CelestialSphere ---------------- */
    var VIS = { x: 7, y: 37 };
    var sph = new CelestialSphere({ x: 0, y: 0, size: 400, showHorizonPlane: false, theta: view.theta, phi: view.phi, mouseBehavior: "none" });
    sph.removeClip("celestialBowl");
    sph.addObject("freeSpaceViewObject", function (ctx) {
      drawSystem(ctx, { theta: view.theta, phi: view.phi, size: 400 - 2 * 40, plane: true, planeColor: 0x808080, planeAlpha: 45, pathColor: 0xffffff,
        c1: colorFromTemp(star.temp), c2: 0xa0a0a0 });
    }, { system: "horizon", x: 0, y: 0, z: 0 });
    var ARROW = new Path2D("M-17.5 -18.25L17.5 -18.25L17.5 -6.15L35 -6.15L0 18.25L-35 -6.15L-17.5 -6.15L-17.5 -18.25Z");
    sph.addObject("earthViewArrow2", function (ctx) {             // Direction Arrow 2, tinted with setRGB
      ctx.save(); ctx.translate(0, 21.9); ctx.scale(1.199997, 1.199982);
      ctx.fillStyle = "#ffb335"; ctx.fill(ARROW); ctx.strokeStyle = "#ffb335"; ctx.lineWidth = 1; ctx.stroke(ARROW);
      ctx.restore();
      ctx.save(); ctx.translate(94.75, -3.55); ctx.rotate(PI);
      font(ctx, 16, "bold"); ctx.fillStyle = "#ffffff"; FlashText.fill(ctx, t("rv.earth"), (-2.45 + 191.9) / 2, -2 + 2 + ASC * 16, "center");
      ctx.restore();
    }, { alt: 0, az: -45 }, { _xscale: 65, _yscale: 65 });
    function reconcile() {                         // Visualization.reconcile: the arrow along our line of sight
      var lt = 90 - P.lon, lp = 90 - P.incl;
      function hz(alt, az) { return { x: Math.cos(alt * D2R) * Math.cos(az * D2R), y: -Math.cos(alt * D2R) * Math.sin(az * D2R), z: Math.sin(alt * D2R) }; }
      var u = hz(0, 90 - lt), v = hz(lp, -lt);
      var nV = { system: "horizon", x: u.y * v.z - u.z * v.y, y: u.z * v.x - u.x * v.z, z: u.x * v.y - u.y * v.x };
      var pos = { alt: lp, az: -lt };
      sph.earthViewArrow2.setPosition(pos);
      sph.earthViewArrow2.setOrientationType("absolute", nV, pos);
      sph.setThetaAndPhi(view.theta, view.phi);
    }
    function drawVisualization(ctx) {
      ctx.save(); ctx.translate(VIS.x, VIS.y);
      ctx.beginPath(); ctx.rect(0, 0, 400, 400); ctx.clip();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 400, 400);
      var lt = 90 - P.lon, lp = 90 - P.incl;
      if (multi) {
        var panel = function (x0, y0, o, rot) {
          ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, 200, 200); ctx.clip();
          ctx.translate(x0 + 100, y0 + 100); if (rot) ctx.rotate(rot * D2R);
          drawSystem(ctx, { theta: o.theta, phi: o.phi, size: 200 - 2 * 15, plane: false, pathColor: 0x707070, c1: 0xffe070, c2: 0x909090 });
          ctx.restore();
        };
        panel(0, 0, { theta: lt - 90, phi: 0 }, lp);
        panel(200, 0, { theta: lt, phi: lp });
        panel(0, 200, { theta: 0, phi: 90 });
      }
      // the free-space view (full size, or a quarter)
      ctx.save();
      if (multi) { ctx.translate(300, 300); ctx.scale(0.5, 0.5); } else ctx.translate(200, 200);
      ctx.fillStyle = "#000000"; ctx.fillRect(-200, -200, 400, 400);
      ctx.beginPath(); ctx.rect(-200, -200, 400, 400); ctx.clip();
      sph.earthViewArrow2.visible = !multi;
      sph.draw(ctx);
      ctx.restore();
      if (multi) {
        ctx.strokeStyle = "#a0a0a0"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(200, 0); ctx.lineTo(200, 400); ctx.moveTo(0, 200); ctx.lineTo(400, 200); ctx.stroke();
        [["rv.side", 0x2ad050, "1", 1, 1], ["rv.earth", 0xffb335, "2", 201, 1], ["rv.orbit", 0x4b9be9, "3", 1, 201]].forEach(function (L) {
          ctx.save(); ctx.translate(L[3], L[4]);
          ctx.fillStyle = hex(L[1]); ctx.strokeStyle = hex(L[1]); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(15, 14.05, 10, 0, TAU); ctx.fill(); ctx.stroke();
          font(ctx, 12, "bold"); ctx.fillStyle = "#ffffff"; FlashText.fill(ctx, L[2], 5 + 10, 6.8 + ASC * 12, "center");
          font(ctx, 12); ctx.fillStyle = "#000000"; FlashText.fill(ctx, t(L[0]), 32, 4.95 + ASC * 12, "left");
          ctx.restore();
        });
      }
      ctx.restore();
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(VIS.x, VIS.y, 400, 400);
    }

    /* ---------------- the radial-velocity panel ---------------- */
    function drawPlotPanel(ctx) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(414, 37, 499, 400);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(414, 37, 499, 400);
      ctx.save(); ctx.translate(PLOT.x, PLOT.y);
      var W = PLOT.w, H = PLOT.h;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
      ctx.translate(phaseOffset * W, PLOT.hh);
      [0, -W].forEach(function (dx) {
        if (showMeas) { ctx.fillStyle = "#999999"; meas.forEach(function (m) { ctx.beginPath(); ctx.arc(m[0] + dx, m[1], 2, 0, TAU); ctx.fill(); }); }
        if (showCurve && rv.curve) {
          ctx.strokeStyle = "#6699ff"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(rv.curve[0][0] + dx, rv.curve[0][1]);
          rv.curve.slice(1).forEach(function (q) { if (q.length === 2) ctx.lineTo(q[0] + dx, q[1]); else ctx.quadraticCurveTo(q[0] + dx, q[1], q[2] + dx, q[3]); });
          ctx.stroke();
        }
      });
      var on = cursorHover || (drag && drag.kind === "cursor");
      ctx.strokeStyle = on ? "#ff5050" : "#ee9090"; ctx.lineWidth = on ? 4 : 3;
      ctx.beginPath(); [0, -W].forEach(function (dx) { ctx.moveTo(phase * W + dx, PLOT.hh); ctx.lineTo(phase * W + dx, -PLOT.hh); }); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.strokeRect(0, 0, W, H);
      // y ticks (updateVerticalScale)
      var ysP = -rv.yScale, minSp = 20 / ysP, major = Math.pow(10, Math.ceil(Math.log(minSp) / Math.LN10)), mult;
      if (major / 2 > minSp) { major /= 2; mult = 5; } else mult = 2;
      var minor = major / mult, step = minor * ysP, start = Math.ceil(rv.yMin / minor), lim = 1 + Math.floor(rv.yMax / minor), y = H - ysP * (minor * start - rv.yMin);
      var f = -Math.floor(Math.log(major) / Math.LN10);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.beginPath();
      for (var i = start; i < lim; i++) {
        if (i % mult === 0) { ctx.moveTo(-7, y); ctx.lineTo(0, y); FlashText.fill(ctx, compToFixed(minor * i, f), -7 - 164.9 + 162.9 - 2, y - 7.25 + ASC * 12, "right"); }
        else { ctx.moveTo(-4, y); ctx.lineTo(0, y); }
        y -= step;
      }
      // x ticks and labels
      for (var k = 0; k < 10; k++) {
        var x = W * mod(phaseOffset + k / 10, 1), major2 = k % 2 === 0;
        ctx.moveTo(x, H); ctx.lineTo(x, H + (major2 ? 7 : 4));
        if (major2) FlashText.fill(ctx, "0." + k, x, H + 6.75 + ASC * 12, "center");
      }
      ctx.stroke();
      font(ctx, 12, "bold");
      FlashText.fill(ctx, t("rv.axisX"), W / 2, H + 26.95 + ASC * 12, "center");
      ctx.save(); ctx.translate(-63.5 + 12.05, PLOT.hh + 85.5 - 12.95); ctx.rotate(-PI / 2);
      var aw = FlashText.widthStatic(ctx, t("rv.axisY"));
      FlashText.fillStatic(ctx, t("rv.axisY"), (145.1 - aw) / 2, 0); ctx.restore();
      // crosshairs
      if (cross && !drag) {
        ctx.save(); ctx.translate(cross.x, cross.y);
        ctx.strokeStyle = "#333333"; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.beginPath();
        ctx.moveTo(0, -10); ctx.lineTo(0, -5); ctx.moveTo(5, 0); ctx.lineTo(10, 0); ctx.moveTo(0, 5); ctx.lineTo(0, 10); ctx.moveTo(-10, 0); ctx.lineTo(-5, 0); ctx.stroke();
        var vel = rv.yMax + cross.y / rv.yScale, kk = -Math.floor(Math.log((rv.yMax - rv.yMin) / W) / Math.LN10);
        var vs = !(kk > 0) ? flashString(Math.pow(10, -kk) * Math.round(vel / Math.pow(10, -kk))) : vel.toFixed(kk);
        font(ctx, 10); var tw = FlashText.width(ctx, vs + " m/s");
        ctx.fillStyle = "#ffffff"; ctx.fillRect(-tw / 2 - 2, -32, tw + 4, 16.2);
        ctx.strokeStyle = "#909090"; ctx.lineWidth = 1; ctx.strokeRect(-tw / 2 - 2, -32, tw + 4, 16.2);
        ctx.fillStyle = "#000000"; FlashText.fill(ctx, vs + " m/s", 0, -32 + 2 + ASC * 10, "center");
        ctx.restore();
      }
      ctx.restore();
      // period
      font(ctx, 12); ctx.fillStyle = "#000000";
      FlashText.fillStatic(ctx, t("rv.period"), 761.95, 335.7 + 12.05);
      FlashText.fill(ctx, formatted(rv.period, 3, 12) + " " + t("rv.days"), 636.15 + 259.8 - 2, 356.45 + ASC * 12, "right");
      ctx.strokeStyle = "#999999"; ctx.beginPath(); ctx.moveTo(739.95, 312.05); ctx.lineTo(739.95, 423.9); ctx.stroke();
    }

    S.onDraw(function () {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      ctx.save(); ctx.clearRect(0, 0, S.W, S.H); ctx.translate(0, OY);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 30, S.W, S.H);
      drawVisualization(ctx);
      drawPlotPanel(ctx);
      ctx.restore();
    });

    /* ---------------- pointer ---------------- */
    var drag = null, cursorHover = false, cross = null;
    function stagePt(ev) { var r = S.canvas.getBoundingClientRect(); return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY }; }
    function inPlot(p) { return p.x >= PLOT.x && p.x <= PLOT.x + PLOT.w && p.y >= PLOT.y && p.y <= PLOT.y + PLOT.h; }
    function onCursor(p) { if (!inPlot(p)) return false; var lx = p.x - PLOT.x - phaseOffset * PLOT.w; return Math.abs(mod(lx - phase * PLOT.w + PLOT.w / 2, PLOT.w) - PLOT.w / 2) <= 3; }
    function inFree(p) {
      var lx = p.x - VIS.x, ly = p.y - VIS.y;
      return multi ? lx >= 200 && lx <= 400 && ly >= 200 && ly <= 400 : lx >= 0 && lx <= 400 && ly >= 0 && ly <= 400;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = stagePt(ev), kind = onCursor(p) ? "cursor" : inPlot(p) ? "plot" : inFree(p) ? "view" : null;
      if (!kind) return;
      ev.preventDefault(); try { S.canvas.setPointerCapture(ev.pointerId); } catch (err) {}
      drag = { kind: kind, x0: p.x, y0: p.y, phase0: phase, off0: phaseOffset, th0: view.theta, ph0: view.phi };
      cross = null; S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stagePt(ev);
      if (drag) {
        if (drag.kind === "cursor") setPhase(drag.phase0 + (p.x - drag.x0) / PLOT.w);
        else if (drag.kind === "plot") { phaseOffset = mod(drag.off0 + (p.x - drag.x0) / PLOT.w, 1); S.requestDraw(); }
        else {
          var k = multi ? 2 : 1;
          view.theta = drag.th0 - 57.29577951308232 * k * (p.x - drag.x0) / 200;
          view.phi = clamp(drag.ph0 + 57.29577951308232 * k * (p.y - drag.y0) / 200, -90, 90);
          reconcile(); S.requestDraw();
        }
        return;
      }
      var h = onCursor(p);
      if (h !== cursorHover) { cursorHover = h; S.requestDraw(); }
      var c = !h && inPlot(p) ? { x: clamp(p.x - PLOT.x, 0, PLOT.w), y: clamp(p.y - PLOT.y, 0, PLOT.h) } : null;
      if (c || cross) { cross = c; S.requestDraw(); }
      S.canvas.style.cursor = h ? "ew-resize" : inPlot(p) ? "crosshair" : inFree(p) ? "move" : "default";
    });
    function release() { if (drag) { drag = null; S.requestDraw(); } }
    S.canvas.addEventListener("pointerup", release);
    S.canvas.addEventListener("pointercancel", release);
    S.canvas.addEventListener("pointerleave", function () { if (cross || cursorHover) { cross = null; cursorHover = false; S.requestDraw(); } });

    /* ---------------- animation ---------------- */
    var loop = S.loop(function () { var now = performance.now(); setPhase(phase + rate * (now - timeLast)); timeLast = now; });
    function setPhase(v) { phase = mod(v, 1); syncing = true; phaseCtl.set(phase); syncing = false; S.requestDraw(); }

    /* ---------------- the sidebar ---------------- */
    var PRESETS = [
      { name: "1. Option A", lon: 0, inc: 90, sep: 1, ecc: 0, pMass: 1, sMass: 1 },
      { name: "2. Option B", lon: 0, inc: 90, sep: 1, ecc: 0.4, pMass: 1, sMass: 1 },
      { name: "3. Option C", lon: 0, inc: 90, sep: 1, ecc: 0, pMass: 0.05, sMass: 1 },
      { name: "4. Option D", lon: 0, inc: 90, sep: 1, ecc: 0, pMass: 0.00315, sMass: 1 },
      { name: "5. HD 68988 b", lon: 40, inc: 90, sep: 0.071, ecc: 0.14, pMass: 1.9, sMass: 1.2 },
      { name: "6. HD 33564 b", lon: 205, inc: 90, sep: 1.1, ecc: 0.34, pMass: 9.1, sMass: 1.25 },
      { name: "7. HD 39091 b", lon: 331, inc: 90, sep: 3.29, ecc: 0.62, pMass: 10.35, sMass: 1.1 }
    ];
    var syncing = false, aside = S.canvas.closest(".sim-layout").querySelector(".sim-controls"), ctl = {};
    function changed() { setBtn.disabled = false; reconcile(); updateAll(); }
    function logSlider(key, lo, hi, prop, sigs) {
      return S.slider({ labelKey: key, min: Math.log(lo) / Math.LN10, max: Math.log(hi) / Math.LN10, step: 0.0005, value: Math.log(P[prop]) / Math.LN10,
        format: function (v) { return sigRound(Math.pow(10, v), sigs).s; },
        on: function (v) { if (syncing) return; P[prop] = sigRound(Math.pow(10, v), sigs).v; changed(); } });
    }
    function linSlider(key, lo, hi, d, prop) {
      return S.slider({ labelKey: key, min: lo, max: hi, step: Math.pow(10, -d), value: P[prop], format: function (v) { return flashToFixed(v, d); },
        on: function (v) { if (syncing) return; P[prop] = fixRound(v, d).v; changed(); } });
    }
    S.group("rv.vis");
    var multiCtl = S.toggle({ labelKey: "rv.multi", value: false, on: function (v) { multi = v; } });
    S.group("rv.anim");
    var animBtn = S.button({ labelKey: "rv.start", primary: true, on: function () { toggleAnimation(); } });
    var rateCtl = S.slider({ labelKey: "rv.speed", min: 1e-5, max: 0.001, step: 1e-5, value: 0.0005, format: function (v) { return sigRound(v, 2).s; },
      on: function (v) { rate = sigRound(v, 2).v; } });
    var phaseCtl = S.slider({ labelKey: "rv.phase", min: 0, max: 1, step: 0.001, value: 0, format: function (v) { return flashToFixed(v, 3); },
      on: function (v) { if (!syncing) { phase = v; S.requestDraw(); } } });
    S.group("rv.orient");
    ctl.incl = linSlider("rv.incl", 0, 180, 1, "incl");
    ctl.lon = linSlider("rv.long", 0, 360, 1, "lon");
    S.group("rv.star");
    ctl.sMass = linSlider("rv.smass", 0.2, 2, 2, "sMass");
    var infoEl = document.createElement("div"); infoEl.className = "ctl"; infoEl.style.cssText = "font-size:12px;opacity:.8;line-height:1.4";
    aside.appendChild(infoEl);
    S.group("rv.presets");
    var presetCtl = S.select({ labelKey: "rv.presets", value: "0", options: PRESETS.map(function (p, i) { return { v: String(i), label: p.name }; }),
      on: function () { setBtn.disabled = false; } });
    var setBtn = S.button({ labelKey: "rv.set", on: function () { applyPreset(PRESETS[+presetCtl.value()]); } });
    S.group("rv.planet");
    ctl.pMass = logSlider("rv.pmass", 0.001, 100, "pMass", 3);
    ctl.sma = logSlider("rv.sma", 0.01, 10, "sma", 3);
    ctl.ecc = linSlider("rv.ecc", 0, 0.8, 2, "ecc");
    S.group("rv.plot");
    var curveCtl = S.toggle({ labelKey: "rv.showCurve", value: true, on: function (v) { showCurve = v; } });
    var measCtl = S.toggle({ labelKey: "rv.showMeas", value: false, on: function (v) { showMeas = v; noiseCtl.input.disabled = numberCtl.input.disabled = !v; updatePlot(); } });
    var noiseCtl = S.slider({ labelKey: "rv.noise", min: 0, max: 2, step: 0.001, value: Math.log(15) / Math.LN10, format: function (v) { return sigRound(Math.pow(10, v), 2).s; },
      on: function (v) { if (syncing) return; noise = sigRound(Math.pow(10, v), 2).v; updatePlot(); } });
    var numberCtl = S.slider({ labelKey: "rv.number", min: 1, max: Math.log(300) / Math.LN10, step: 0.001, value: Math.log(150) / Math.LN10, format: function (v) { return String(Math.round(Math.pow(10, v))); },
      on: function (v) { if (syncing) return; number = Math.round(Math.pow(10, v)); updatePlot(); } });
    S.button({ labelKey: "rv.reset", on: function () { onReset(); } });

    function toggleAnimation() {
      animating = !animating;
      if (animating) { timeLast = performance.now(); loop.play(); } else loop.pause();
      animBtn.setAttribute("data-i18n", animating ? "rv.pause" : "rv.start"); animBtn.textContent = t(animating ? "rv.pause" : "rv.start");
    }
    function syncAll() {
      syncing = true;
      ["pMass", "sma"].forEach(function (k) { ctl[k].set(Math.log(P[k]) / Math.LN10); });
      ["ecc", "sMass", "incl", "lon"].forEach(function (k) { ctl[k].set(P[k]); });
      syncing = false;
    }
    function applyPreset(pr) {
      P.pMass = pr.pMass; P.sma = pr.sep; P.ecc = pr.ecc; P.sMass = pr.sMass; P.incl = pr.inc; P.lon = pr.lon;
      syncAll(); reconcile(); updateAll(); setBtn.disabled = true;
    }
    function onReset() {
      if (animating) toggleAnimation();
      P = { pMass: 1, sma: 1, ecc: 0.2, sMass: 1, incl: 90, lon: 45 };
      view = { theta: 80, phi: 45 };
      syncing = true; noiseCtl.set(Math.log(15) / Math.LN10); numberCtl.set(Math.log(150) / Math.LN10); rateCtl.set(0.0005); syncing = false;
      noise = 15; number = 150; rate = 0.0005;
      curveCtl.set(true); measCtl.set(false); multiCtl.set(false);
      presetCtl.set("0"); phaseOffset = 0.75;
      syncAll(); reconcile(); updateAll(); setPhase(0);
      setBtn.disabled = false;
    }
    onReset();
  }
});
