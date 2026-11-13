/* Exoplanet Transit Simulator ---------------------------------------------------------
   Rebuild of the NAAP "Exoplanet Transit Simulator" (transitSimulator.swf, decompiled):
   the canvas is the SWF's stage below its title bar — the view of the star and the
   light-curve panel; the Presets, Planet / Star Properties and System Orientation and
   Phase panels (controls only) are the sidebar, as are the light-curve check boxes and
   the noise / number sliders.
     • the star: a main-sequence star of the chosen mass — L = M^3.99 (M^2.26·0.232 below
       0.43 M☉), the SWF's T(L) fit, R from L and T — its spectral type read off the
       SWF's table; drawn at 9×10⁻⁸ px per metre, coloured by temperature, with the
       planet (grey) and the arc of its orbit over the plotted stretch.
     • Lightcurve Component II, "eclipse of body 1": the transit's start, end and
       deepest point are solved analytically (the SWF's root finder on the projected
       separation), the plot spans the transit plus 15 % either side, the flux of
       two uniform discs (σT⁴·10^(BC/2.5)) is computed every 2 px, the flux axis is
       scaled so the dip fills the plot less 30 px margins (or the noise band).
     • simulated measurements: random phases with Gaussian noise (σ = the noise slider,
       relative to the out-of-transit flux), drawn as grey dots under the curve.
   Drag the phase cursor on the plot.                                                    */
Sim.create({
  id: "exoplanet-transit",
  width: 920, height: 444,
  strings: {
    en: {
      "tr.presets": "Presets", "tr.set": "set", "tr.planet": "Planet Properties", "tr.star": "Star Properties",
      "tr.orient": "System Orientation and Phase", "tr.curve": "Light curve",
      "tr.pmass": "mass (Mjup)", "tr.pradius": "radius (Rjup)", "tr.sma": "semimajor axis (AU)", "tr.ecc": "eccentricity",
      "tr.smass": "mass (Msun)", "tr.incl": "inclination (°)", "tr.long": "longitude (°)", "tr.phase": "phase",
      "tr.showCurve": "show theoretical curve", "tr.showMeas": "show simulated measurements", "tr.noise": "noise", "tr.number": "number",
      "tr.reset": "reset", "tr.flux": "Normalized Flux", "tr.depth": "eclipse depth:", "tr.noEclipse": "(no eclipse)",
      "tr.takes": "eclipse takes {d}s of {p} orbit", "tr.year": "year", "tr.day": "day", "tr.hour": "hour", "tr.minute": "minute", "tr.second": "second",
      "tr.info": "a main sequence star of this mass would have spectral type {type}V, temperature {t} K, and radius {r} Rsun"
    },
    id: {
      "tr.presets": "Preset", "tr.set": "terapkan", "tr.planet": "Sifat Planet", "tr.star": "Sifat Bintang",
      "tr.orient": "Orientasi Sistem dan Fase", "tr.curve": "Kurva cahaya",
      "tr.pmass": "massa (Mjup)", "tr.pradius": "radius (Rjup)", "tr.sma": "sumbu semimayor (SA)", "tr.ecc": "eksentrisitas",
      "tr.smass": "massa (Mmatahari)", "tr.incl": "inklinasi (°)", "tr.long": "bujur (°)", "tr.phase": "fase",
      "tr.showCurve": "tampilkan kurva teoretis", "tr.showMeas": "tampilkan pengukuran simulasi", "tr.noise": "derau", "tr.number": "jumlah",
      "tr.reset": "atur ulang", "tr.flux": "Fluks Ternormalisasi", "tr.depth": "kedalaman gerhana:", "tr.noEclipse": "(tak ada gerhana)",
      "tr.takes": "gerhana berlangsung {d} dari orbit {p}", "tr.year": "tahun", "tr.day": "hari", "tr.hour": "jam", "tr.minute": "menit", "tr.second": "detik",
      "tr.info": "bintang deret utama bermassa ini akan bertipe spektrum {type}V, bersuhu {t} K, dan beradius {r} Rmatahari"
    }
  },
  about: {
    en: "<p>When a planet crosses in front of its star, it blocks a sliver of light and the star dims slightly — a <strong>transit</strong>. The dip's depth is just the area ratio, (R<sub>planet</sub> / R<sub>star</sub>)², so a Jupiter across a Sun-like star dims it about 1%.</p>" +
        "<p>Set the planet's radius and orbit, the star's mass (which fixes its size and temperature), and the <strong>inclination</strong>. Edge-on orbits give a flat-bottomed transit; tilt it and the planet clips the star's edge (a grazing, V-shaped, shallower dip) until the transit disappears.</p>" +
        "<p>Turn on <strong>simulated measurements</strong> with realistic noise to see how astronomers actually detect planets — and load a real-exoplanet preset to compare.</p>",
    id: "<p>Ketika planet melintas di depan bintangnya, ia menghalangi sedikit cahaya dan bintang sedikit meredup — sebuah <strong>transit</strong>. Kedalaman lekukannya hanyalah rasio luas, (R<sub>planet</sub> / R<sub>bintang</sub>)², jadi Jupiter di depan bintang mirip-Matahari meredupkannya sekitar 1%.</p>" +
        "<p>Atur radius dan orbit planet, massa bintang (yang menetapkan ukuran dan suhunya), dan <strong>inklinasi</strong>. Orbit tepi-pandang memberi transit beralas datar; miringkan dan planet menyerempet tepi bintang (lekukan dangkal berbentuk V) hingga transit lenyap.</p>" +
        "<p>Nyalakan <strong>pengukuran simulasi</strong> dengan derau realistis untuk melihat bagaimana astronom benar-benar mendeteksi planet — dan muat preset eksoplanet nyata untuk membandingkan.</p>"
  },
  build: function (S) {
    var FONT = "Verdana, Geneva, sans-serif", ASC = 1.0059, OY = -30, TAU = 2 * Math.PI, PI = Math.PI;
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
    function lcToFixed(x, f) { if (!(f > 0)) { var k = Math.pow(10, -f); return flashString(k * Math.round(x / k)); } return flashToFixed(x, Math.min(f, 20)); }
    function sigDigits(x, d) { if (x === 0) return 0; var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10), f = Math.pow(10, d - (1 + e)); return Math.round(f * x) / f; }
    function sigRound(v, sigs) {
      var dec = 1 + Math.floor(Math.log(v) / Math.LN10), pow = Math.pow(10, dec), res = Math.pow(10, sigs);
      var tick = Math.round(v * res / pow);
      if (tick === res) { tick = res / 10; dec += 1; pow = Math.pow(10, dec); }
      var val = tick / res * pow, prec = sigs - dec;
      return { v: val, s: prec > 0 ? flashToFixed(val, prec) : flashString(val) };
    }
    function fixRound(v, d) { var k = Math.pow(10, -d); return { v: k * Math.round(v / k), s: flashToFixed(k * Math.round(v / k), d) }; }

    /* ---------------- the star (getLuminosityFromMass, getTempFromLuminosity, …) ---------------- */
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
    function radiusFromTL(T, L) { return 33736108.2311059 * Math.sqrt(L) / (T * T); }
    var TYPES_V = [[38000, 7], [33200, 9], [31450, 9.5], [29700, 10], [25600, 11], [22300, 12], [19000, 13], [17200, 14], [15400, 15], [14100, 16], [13000, 17], [11800, 18], [10700, 19], [9480, 20], [8810, 22], [8160, 25], [7930, 27], [7020, 30], [6750, 32], [6530, 35], [6240, 37], [5930, 40], [5830, 42], [5740, 44], [5620, 46], [5240, 50], [5010, 52], [4560, 54], [4340, 55], [4040, 57], [3800, 60], [3680, 61], [3530, 62], [3380, 63], [3180, 64], [3030, 65], [2850, 66]];
    function spectralType(T) {                     // getSpectralTypeFromTemp, class V
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
      return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
    }

    /* ---------------- state ---------------- */
    var P = { pMass: 0.657, pRadius: 1.32, sma: 0.047, ecc: 0, sMass: 1.09, incl: 86.929, lon: 0 };
    var showCurve = true, showMeas = false, noise = 0.1, number = 50, NO_NOISE = 1e-5;
    var cPhase = 0.5, star = {}, sys = {}, events = null, curve = null, meas = [], hover = false, drag = null;
    var PLOT = { x: 469, y: 57.8, w: 401.25, h: 221 };   // the placeholder (321 × 221 with its stroke) scaled 1.25 × 1

    /* ---------------- Lightcurve Component II ---------------- */
    function root(fn, a, b) {                      // the SWF's safeguarded inverse-quadratic / secant search
      var c = a, counter = 0, fa, fb, fc, d, fd;
      do {
        fa = fn(a); fb = fn(b); fc = fn(c);
        if (fa !== fc && fb !== fc) d = a * fb * fc / ((fa - fb) * (fa - fc)) + b * fa * fc / ((fb - fa) * (fb - fc)) + c * fa * fb / ((fc - fa) * (fc - fb));
        else d = b - fb * ((b - a) / (fb - fa));
        var m = (a + b) / 2;
        if ((m < b && (d > b || d < m)) || (m > b && (d < b || d > m))) d = m;
        fd = fn(d);
        if (fb * fd < 0) a = b;
        c = b; b = d; counter++;
      } while ((fd < -5e-15 || fd > 5e-15) && counter < 200);
      return d;
    }
    function curveEvents(p) {                      // getCurveEventsObject
      var ev = { 1: { occurs: false }, 2: { occurs: false } };
      var a = p.sep, e = p.e, inc = p.inc, w = p.arg, R = (p.r1 + p.r2) / a, C1 = Math.sqrt((1 + e) / (1 - e));
      var S2 = Math.cos(inc) * Math.cos(inc), S1 = 1 - S2, q = (1 - e * e) * (1 - e * e);
      var K1 = q * S1, K2 = -e * e * R * R, K3 = -2 * e * R * R, K4 = q * S2 - R * R, L1 = -K1, L2 = 2 * K2, L3 = K3;
      function der(v) { return L1 * Math.sin(2 * (v + w)) - Math.sin(v) * (L2 * Math.cos(v) + L3); }
      function sep(v) { return K1 * Math.cos(v + w) * Math.cos(v + w) + K2 * Math.cos(v) * Math.cos(v) + K3 * Math.cos(v) + K4; }
      var mins = [], n = 100, step = TAU / n, vLast = -step, negLast = der(vLast) < 0, j;
      for (j = 0; j < n; j++) {
        var v = j * step, neg = der(v) < 0;
        if (neg !== negLast) { var d = root(der, vLast, v); if (sep(d) < 0) mins.push({ min: mod(d + w, TAU) - w }); }
        negLast = neg; vLast = v;
      }
      if (mins.length > 2) return ev;
      mins.forEach(function (mn) {
        var ends = mn.min + w < PI ? [-w, PI - w] : [PI - w, TAU - w];
        mn.ends = ends.map(function (end) { return mod(root(sep, mn.min, end) + w, TAU) - w; });
      });
      function phaseOfTA(ta) { var E = 2 * Math.atan(Math.tan(0.5 * ta) / C1); return mod((E - e * Math.sin(E)) / TAU, 1); }
      function dsep(v) {
        var S3 = Math.cos(v + w), S4 = 1 + e * Math.cos(v);
        return ((S1 * S3 * S3 + S2) * e * Math.sin(v) / S4 - S1 * S3 * Math.sin(v + w)) / (S4 * S4);
      }
      mins.forEach(function (mn) {
        var E = ev[mn.min + w < PI ? 1 : 2];
        E.occurs = true;
        E.start = { ta: mn.ends[0], phase: phaseOfTA(mn.ends[0]) };
        E.end = { ta: mn.ends[1], phase: phaseOfTA(mn.ends[1]) };
        E.duration = { phase: mod(E.end.phase - E.start.phase, 1), ta: mod(E.end.ta - E.start.ta, TAU) };
        var vMid = E.start.ta + E.duration.ta / 2, vs = PI / 100, c, v;
        for (c = 0, v = vMid; ; ) { v -= vs; c++; if (!(dsep(v) < 0) || c > 50) break; }
        var vLeft = v;
        for (c = 0, v = vMid; ; ) { v += vs; c++; if (!(dsep(v) > 0) || c > 50) break; }
        var dd = root(dsep, vLeft, v);
        E.maxDepth = { phase: phaseOfTA(mod(dd + w, TAU) - w) };
      });
      return ev;
    }
    function bc(T) {
      var l = Math.log(T) / Math.LN10, k;
      if (l > 3.9) k = [-100139.4991, 116264.1842, -53931.97541, 12495.04227, -1445.868048, 66.84924471];
      else if (l < 3.7) k = [-13884.14899, 8595.127427, -488.3425525, -627.0092238, 137.4608131, -7.549572042];
      else k = [1439.981506, -151.9002581, -995.1089203, 582.5176671, -123.3293641, 9.160761128];
      return k[0] + l * (k[1] + l * (k[2] + l * (k[3] + l * (k[4] + k[5] * l))));
    }
    function addFlux(pts, p, ev) {                 // addVisFluxAndVisMagProperties (flux only)
      var a = p.sep, e = p.e, inc = p.inc, w = p.arg, r1 = p.r1, r2 = p.r2, C1 = Math.sqrt((1 + e) / (1 - e));
      var J0 = a * (1 - e * e), J1 = J0 * J0 * (1 - Math.cos(inc) * Math.cos(inc)), J2 = J0 * J0 * Math.cos(inc) * Math.cos(inc), J3 = 2 * e, J4 = e * e;
      var R12 = r1 * r1, R22 = r2 * r2, Z0 = 1 / (2 * r2), Z1 = (R22 - R12) * Z0, Z2 = 1 / (2 * r1), Z3 = (R12 - R22) * Z2;
      var H1 = 1.89553328524593e-43 * Math.pow(p.t1, 4) * Math.pow(10, bc(p.t1) / 2.5), H2 = 1.89553328524593e-43 * Math.pow(p.t2, 4) * Math.pow(10, bc(p.t2) / 2.5);
      var maxFlux = (R12 * H1 + R22 * H2) * PI;
      function inEclipse(E, ph) {                  // getRegion: an eclipse may wrap past phase 1
        if (!E.occurs) return false;
        var st = E.start.phase, en = E.end.phase;
        return en < st ? ph < en || ph > st : ph > st && ph < en;
      }
      pts.forEach(function (pt) {
        var region = inEclipse(ev[1], pt.phase) ? 1 : inEclipse(ev[2], pt.phase) ? 2 : 0;
        if (region === 0) { pt.flux = maxFlux; return; }
        var ma = pt.phase * TAU, e0, e1 = ma, c = 0;
        do { e0 = e1; e1 = e0 + (ma + e * Math.sin(e0) - e0) / (1 - e * Math.cos(e0)); c++; } while (Math.abs(e1 - e0) > 0.001 && c < 100);
        var v = 2 * Math.atan(C1 * Math.tan(e1 / 2));
        var d = Math.sqrt((J1 * Math.cos(w + v) * Math.cos(w + v) + J2) / (1 + J3 * Math.cos(v) + J4 * Math.cos(v) * Math.cos(v))) || 1e-8;
        var ca = clamp(Z0 * d + Z1 / d, -1, 1), cb = clamp(Z2 * d + Z3 / d, -1, 1), al = Math.acos(ca), be = Math.acos(cb);
        var overlap = R22 * (al - ca * Math.sin(al)) + R12 * (be - cb * Math.sin(be));
        pt.flux = maxFlux - (region === 1 ? H1 : H2) * overlap;
      });
      return maxFlux;
    }
    function updateLightcurve() {                  // setParameters + update
      var p = { sep: P.sma * 149598000000, e: P.ecc, arg: P.lon * PI / 180, inc: P.incl * PI / 180,
        m1: P.sMass * 1.98892e30, m2: P.pMass * 1.8987e27, r1: star.radius * 695500000, r2: P.pRadius * 71492000, t1: star.temp, t2: 500 };
      sys = p;
      sys.period = Math.sqrt(39.47841760435743 * p.sep * p.sep * p.sep / (6.673e-11 * (p.m1 + p.m2)));
      events = curveEvents(p);
      var E = events[1];
      if (E.occurs) {
        sys.duration = sys.period * E.duration.phase;
        sys.xScale = PLOT.w * (1 - 2 * 0.15) / E.duration.phase;
        sys.minPhase = mod(E.start.phase - 0.15 * PLOT.w / sys.xScale, 1);
        sys.maxPhase = (sys.minPhase + PLOT.w / sys.xScale) % 1;
      } else {
        sys.duration = 0;
        var TA = PI / 2 - p.arg, EA = 2 * Math.atan(Math.tan(0.5 * TA) / Math.sqrt((1 + p.e) / (1 - p.e))), center = mod((EA - p.e * Math.sin(EA)) / TAU, 1);
        sys.maxPhase = (center + 0.001) % 1; sys.minPhase = mod(center - 0.001, 1); sys.xScale = PLOT.w / 0.002;
      }
      // the curve's points: the plot's ends plus every 2 px through the eclipse
      var pts = [{ phase: sys.minPhase }], res = sys.xScale / 2;
      if (E.occurs) {
        var st = E.start.phase, mid = E.maxDepth.phase, en = E.end.phase, h1 = mod(mid - st, 1), h2 = mod(en - mid, 1);
        var n1 = 1 + Math.ceil(h1 * res), s1 = h1 / (n1 - 1), n2 = 1 + Math.ceil(h2 * res), s2 = h2 / (n2 - 1), i;
        for (i = 0; i < n1; i++) pts.push({ phase: (st + i * s1) % 1 });
        for (i = 1; i < n2; i++) pts.push({ phase: (mid + i * s2) % 1 });
      }
      pts.push({ phase: sys.maxPhase });
      var maxFlux = addFlux(pts, p, events), start = pts[0].phase, minFlux = Infinity;
      pts.forEach(function (q) { if (q.flux < minFlux) minFlux = q.flux; if (q.phase < start) q.phase += 1; });
      sys.depth = (maxFlux - minFlux) / maxFlux;
      // the flux axis
      var fluxNoise = showMeas ? noise : NO_NOISE, nm = maxFlux * fluxNoise * 2.5, half = (maxFlux - minFlux) / 2, center2 = minFlux + half, ys;
      if (half === 0 && nm === 0) ys = -PLOT.h / (maxFlux * 1e-6); else ys = -(PLOT.h / 2) / (half + nm);
      if (-ys * nm < 30) ys = -(PLOT.h / 2 - 30) / half;
      if (-PLOT.h / ys < maxFlux * 1e-6) ys = -PLOT.h / (maxFlux * 1e-6);
      var top = center2 - 0.5 * PLOT.h / ys, bot = center2 + 0.5 * PLOT.h / ys;
      sys.yScale = ys; sys.yOffset = -ys * top; sys.maxN = top / maxFlux; sys.minN = bot / maxFlux; sys.yScaleN = PLOT.h * maxFlux / (top - bot);
      curve = pts.map(function (q) { return [sys.xScale * (q.phase - sys.minPhase), sys.yOffset + ys * q.flux]; });
      // simulated measurements
      var range = PLOT.w / sys.xScale, mp = [];
      for (var k = 0; k < number; k++) mp.push({ phase: (sys.minPhase + range * Math.random()) % 1 });
      addFlux(mp, p, events);
      for (k = 0; k < number; k += 2) {
        var x1, x2, o;
        do { x1 = 2 * Math.random() - 1; x2 = 2 * Math.random() - 1; o = x1 * x1 + x2 * x2; } while (!(o < 1));
        o = Math.sqrt(-2 * Math.log(o) / o);
        mp[k].flux = maxFlux * (mp[k].flux / maxFlux + fluxNoise * x1 * o);
        if (mp[k + 1]) mp[k + 1].flux = maxFlux * (mp[k + 1].flux / maxFlux + fluxNoise * x2 * o);
      }
      meas = mp.map(function (q) { var u = q.phase - sys.minPhase; if (u < 0) u += 1; return [sys.xScale * u, sys.yOffset + ys * q.flux]; });
    }
    function cursorPhase() { var range = sys.maxPhase - sys.minPhase; if (range < 0) range += 1; return (sys.minPhase + cPhase * range) % 1; }
    function updateStar() {
      star.lum = lumFromMass(P.sMass); star.temp = tempFromLum(star.lum); star.radius = radiusFromTL(star.temp, star.lum);
      var st = spectralType(star.temp), num = st ? Math.round(st.number) : 0;
      if (num === 10) num = 9;
      var m = Math.floor(Math.log(star.temp) / Math.LN10), k = 2 - m;
      var tStr = !(k > 0) ? flashString(sigDigits(star.temp, 3)) : star.temp.toFixed(Math.min(k, 12));
      infoEl.textContent = fmt("tr.info", { type: st ? st.type + num : "?", t: tStr, r: star.radius.toFixed(1) });
    }
    function updateAll() { updateStar(); updateLightcurve(); S.requestDraw(); }

    /* ---------------- drawing ---------------- */
    function timeString(sec) {                     // getTimeString
      var str;
      if (sec > 47335104) { sec /= 31556736; str = "tr.year"; }
      else if (sec > 86400) { sec /= 86400; str = "tr.day"; }
      else if (sec > 5400) { sec /= 3600; str = "tr.hour"; }
      else if (sec > 60) { sec /= 60; str = "tr.minute"; }
      else str = "tr.second";
      return formatNumber(sec, 3) + " " + t(str);
    }
    function formatNumber(num, digits) {
      var L = Math.floor(Math.log(num) / Math.LN10) - (digits - 1);
      if (!(L < 0)) { var M = Math.pow(10, L); return flashString(M * Math.round(num / M)); }
      return num.toFixed(-L);
    }
    function drawView(ctx) {
      var size = 350, cx = 7 + size / 2, cy = 37 + size / 2, s = 9e-08;
      ctx.save(); ctx.beginPath(); ctx.rect(7, 37, size, size); ctx.clip();
      ctx.fillStyle = "#000000"; ctx.fillRect(7, 37, size, size);
      // doA with θ = 90° − longitude, φ = 90° − inclination
      var th = (90 - P.lon) * PI / 180, ph = (90 - P.incl) * PI / 180;
      var A = { a0: -s * Math.sin(th), a1: s * Math.cos(th), a3: s * Math.cos(th) * Math.sin(ph), a4: s * Math.sin(th) * Math.sin(ph) };
      var mt = sys.m1 + sys.m2, a1 = sys.sep * sys.m2 / mt, a2 = sys.sep * sys.m1 / mt, e = sys.e;
      function solveE(ma) { var e0, e1 = ma, c = 0; do { e0 = e1; e1 = e0 + (ma + e * Math.sin(e0) - e0) / (1 - e * Math.cos(e0)); c++; } while (Math.abs(e1 - e0) > 0.001 && c < 100); return e1; }
      // the star
      var R1 = s * sys.r1, R2 = s * sys.r2;
      function body(x, y, r, col) {
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
        var g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, "rgba(255,255,255,0.55)"); g.addColorStop(170 / 255, "rgba(255,255,255,0.45)"); g.addColorStop(1, "rgba(255,255,255,0.1)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      }
      body(cx, cy, R1, colorFromTemp(star.temp));
      // the orbit over the plotted stretch (updateOrbitalPath)
      var minEA = solveE(sys.minPhase * TAU), maxEA = solveE(sys.maxPhase * TAU), diff = maxEA - minEA;
      if (diff < 0) diff += TAU;
      var B = Math.sqrt(1 - e * e), maxD2 = 5 * size * size, n = 40, ang = minEA;
      function pt(ang) {
        var wx = Math.cos(ang) - e, wy = B * Math.sin(ang);
        return [cx + (a2 * wx * A.a0 + a2 * wy * A.a1) - (-a1 * wx * A.a0 - a1 * wy * A.a1), cy + (a2 * wx * A.a3 + a2 * wy * A.a4) - (-a1 * wx * A.a3 - a1 * wy * A.a4)];
      }
      ctx.strokeStyle = "rgba(153,153,153,0.5)"; ctx.lineWidth = 1; ctx.beginPath();
      var p0 = pt(ang); ctx.moveTo(p0[0], p0[1]);
      for (var i = 0; i < n; i++) { ang += diff / n; var q = pt(ang); if (!(q[0] * q[0] + q[1] * q[1] > maxD2)) ctx.lineTo(q[0], q[1]); }
      ctx.stroke();
      // the planet (updatePositions)
      var ma = cursorPhase() * TAU, E = solveE(ma), ta = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2)), k = (1 - e * e) / (1 + e * Math.cos(ta));
      var w1x = -a1 * k * Math.cos(ta), w1y = -a1 * k * Math.sin(ta), w2x = a2 * k * Math.cos(ta), w2y = a2 * k * Math.sin(ta);
      var px = cx + (w2x * A.a0 + w2y * A.a1) - (w1x * A.a0 + w1y * A.a1), py = cy + (w2x * A.a3 + w2y * A.a4) - (w1x * A.a3 + w1y * A.a4);
      body(px, py, R2, "#999999");
      if (R2 < 3) {                                 // the arrow under a planet too small to see (_yscale < 3)
        ctx.save(); ctx.translate(px, py + 5 + R2);
        ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#000000"; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(2.3, 25); ctx.lineTo(-2.3, 25); ctx.lineTo(-2.3, 11.7); ctx.lineTo(-8, 15.05); ctx.lineTo(0, 0); ctx.lineTo(8, 15.05); ctx.lineTo(2.3, 11.7); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(7, 37, size, size);
    }
    function drawPlotPanel(ctx) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(364, 37, 549, 430);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(364, 37, 549, 430);
      ctx.save(); ctx.translate(PLOT.x, PLOT.y);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, PLOT.w, PLOT.h);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, PLOT.w, PLOT.h); ctx.clip();
      if (showMeas) { ctx.fillStyle = "#999999"; meas.forEach(function (m) { ctx.beginPath(); ctx.arc(m[0], m[1], 2, 0, TAU); ctx.fill(); }); }
      if (showCurve && curve) {
        ctx.strokeStyle = "#6699ff"; ctx.lineWidth = 1; ctx.lineJoin = "round"; ctx.beginPath();
        curve.forEach(function (q, i) { if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke();
      }
      var on = hover || (drag && drag.kind === "cursor");
      ctx.strokeStyle = on ? "#ff5050" : "#ee9090"; ctx.lineWidth = on ? 4 : 3; ctx.lineCap = "butt";
      ctx.beginPath(); var cx = cPhase * PLOT.w; ctx.moveTo(cx, 0); ctx.lineTo(cx, PLOT.h); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.strokeRect(0, 0, PLOT.w, PLOT.h);
      // y ticks and labels (updateVerticalScale)
      var min = sys.minN, max = sys.maxN, ysN = sys.yScaleN, minSp = 25 / ysN, major = Math.pow(10, Math.ceil(Math.log(minSp) / Math.LN10)), mult;
      if (major / 2 > minSp) { major /= 2; mult = 5; } else mult = 2;
      var minor = major / mult, step = -minor * ysN, start = Math.ceil(min / minor), lim = 1 + Math.floor(max / minor), y = PLOT.h - ysN * (minor * start - min);
      var f = -Math.floor(Math.log(major) / Math.LN10);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.beginPath();
      for (var i = start; i < lim; i++) {
        if (i % mult === 0) { ctx.moveTo(-7, y); ctx.lineTo(0, y); FlashText.fill(ctx, lcToFixed(minor * i, f), -7 - 164.9 + 162.9 - 2, y - 7.25 - 2 + 2 + ASC * 12, "right"); }
        else { ctx.moveTo(-4, y); ctx.lineTo(0, y); }
        y += step;
      }
      ctx.stroke();
      font(ctx, 12, "bold");
      ctx.save(); ctx.translate(-78.5 + ASC * 12, PLOT.h / 2); ctx.rotate(-PI / 2); FlashText.fill(ctx, t("tr.flux"), 0, 0, "center"); ctx.restore();
      ctx.restore();
      // the eclipse arrow and the texts under the plot
      font(ctx, 12); ctx.fillStyle = "#000000";
      if (events && events[1].occurs) {
        ctx.save(); ctx.translate(529, 295);
        ctx.strokeStyle = "#000000"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(276, 0); ctx.stroke();
        ctx.fill(new Path2D("M9.45 4.05L0 0L9.45 -4L6.75 0L9.45 4.05ZM280 0L270.55 4L273.25 0L270.5 -4L280 0Z"));
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, 4); ctx.moveTo(280, -4); ctx.lineTo(280, 4); ctx.stroke();
        ctx.restore();
        FlashText.fill(ctx, fmt("tr.takes", { d: timeString(sys.duration), p: timeString(sys.period) }), 431.5 + (66.9 + 406.9) / 2, 307.95 + ASC * 12, "center");
        FlashText.fill(ctx, formatNumber(sys.depth, 3), 779.95 + 105.95 - 2, 391.95 + ASC * 12, "right");
      } else {
        FlashText.fill(ctx, t("tr.noEclipse"), 431.5 + (66.9 + 406.9) / 2, 307.95 + ASC * 12, "center");
        FlashText.fill(ctx, t("tr.noEclipse"), 779.95 + 105.95 - 2, 391.95 + ASC * 12, "right");
      }
      FlashText.fillStatic(ctx, t("tr.depth"), 760.95, 367.95 + 12.05);
      ctx.strokeStyle = "#cccccc"; ctx.beginPath(); ctx.moveTo(745.95, 341); ctx.lineTo(745.95, 451); ctx.stroke();
    }

    S.onDraw(function () {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      ctx.save(); ctx.clearRect(0, 0, S.W, S.H); ctx.translate(0, OY);
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 30, S.W, S.H);
      drawView(ctx);
      drawPlotPanel(ctx);
      ctx.restore();
    });

    /* ---------------- dragging the phase cursor ---------------- */
    function stagePt(ev) { var r = S.canvas.getBoundingClientRect(); return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY }; }
    function onCursor(p) { var lx = p.x - PLOT.x, ly = p.y - PLOT.y; return ly >= 0 && ly <= PLOT.h && Math.abs(lx - cPhase * PLOT.w) <= 3; }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = stagePt(ev);
      if (!onCursor(p)) return;
      ev.preventDefault(); try { S.canvas.setPointerCapture(ev.pointerId); } catch (err) {}
      drag = { kind: "cursor", off: p.x - PLOT.x - cPhase * PLOT.w }; S.requestDraw();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = stagePt(ev);
      if (drag) { setCPhase((p.x - PLOT.x - drag.off) / PLOT.w); return; }
      var h = onCursor(p);
      if (h !== hover) { hover = h; S.requestDraw(); }
      S.canvas.style.cursor = h ? "ew-resize" : "default";
    });
    function release() { if (drag) { drag = null; S.requestDraw(); } }
    S.canvas.addEventListener("pointerup", release);
    S.canvas.addEventListener("pointercancel", release);
    function setCPhase(v) { cPhase = mod(v, 1); syncing = true; phaseCtl.set(cPhase); syncing = false; S.requestDraw(); }

    /* ---------------- the sidebar ---------------- */
    var PRESETS = [
      { name: "1. Option A", lon: 0, inc: 90, ecc: 0, sep: 1, sMass: 1, pRadius: 1, pMass: 1 },
      { name: "2. Option B", lon: 0, inc: 90, ecc: 0, sep: 1, sMass: 1, pRadius: 0.09, pMass: 0.0032 },
      { name: "3. OGLE-TR-113 b", lon: 0, inc: 89.4, ecc: 0, sep: 0.0229, sMass: 0.78, pRadius: 1.09, pMass: 1.32 },
      { name: "4. TrES-1", lon: 0, inc: 88.2, ecc: 0.135, sep: 0.0393, sMass: 0.87, pRadius: 1.08, pMass: 0.61 },
      { name: "5. XO-1 b", lon: 0, inc: 87.7, ecc: 0, sep: 0.0488, sMass: 1, pRadius: 1.3, pMass: 0.9 },
      { name: "6. HD 209458 b", lon: 83, inc: 86.929, ecc: 0.07, sep: 0.045, sMass: 1.01, pRadius: 1.32, pMass: 0.69 },
      { name: "7. OGLE-TR-111 b", lon: 0, inc: 86.5, ecc: 0, sep: 0.047, sMass: 0.82, pRadius: 1, pMass: 0.53 },
      { name: "8. OGLE-TR-10 b", lon: 0, inc: 86.46, ecc: 0, sep: 0.04162, sMass: 1.22, pRadius: 1.16, pMass: 0.54 },
      { name: "9. HD 189733 b", lon: 0, inc: 85.79, ecc: 0, sep: 0.0313, sMass: 0.82, pRadius: 1.154, pMass: 1.15 },
      { name: "10. HD 149026 b", lon: 0, inc: 85.3, ecc: 0, sep: 0.042, sMass: 1.3, pRadius: 0.725, pMass: 0.36 },
      { name: "11. OGLE-TR-132 b", lon: 0, inc: 85, ecc: 0, sep: 0.0306, sMass: 1.35, pRadius: 1.13, pMass: 1.19 }
    ];
    var syncing = false, aside = S.canvas.closest(".sim-layout").querySelector(".sim-controls");
    function logSlider(key, lo, hi, prop) {
      return S.slider({ labelKey: key, min: Math.log(lo) / Math.LN10, max: Math.log(hi) / Math.LN10, step: 0.0005, value: Math.log(P[prop]) / Math.LN10,
        format: function (v) { return sigRound(Math.pow(10, v), 3).s; },
        on: function (v) { if (syncing) return; P[prop] = sigRound(Math.pow(10, v), 3).v; setBtn.disabled = false; updateAll(); } });
    }
    function linSlider(key, lo, hi, d, prop) {
      return S.slider({ labelKey: key, min: lo, max: hi, step: Math.pow(10, -d), value: P[prop],
        format: function (v) { return flashToFixed(v, d); },
        on: function (v) { if (syncing) return; P[prop] = fixRound(v, d).v; setBtn.disabled = false; updateAll(); } });
    }
    S.group("tr.presets");
    var presetCtl = S.select({ labelKey: "tr.presets", value: "0", options: PRESETS.map(function (p, i) { return { v: String(i), label: p.name }; }),
      on: function () { setBtn.disabled = false; } });
    var setBtn = S.button({ labelKey: "tr.set", on: function () { applyPreset(PRESETS[+presetCtl.value()]); } });
    S.group("tr.planet");
    var ctl = {};
    ctl.pMass = logSlider("tr.pmass", 0.001, 100, "pMass");
    ctl.pRadius = logSlider("tr.pradius", 0.01, 2, "pRadius");
    ctl.sma = logSlider("tr.sma", 0.015, 2, "sma");
    ctl.ecc = linSlider("tr.ecc", 0, 0.4, 2, "ecc");
    S.group("tr.star");
    ctl.sMass = linSlider("tr.smass", 0.5, 2, 2, "sMass");
    var infoEl = document.createElement("div"); infoEl.className = "ctl"; infoEl.style.cssText = "font-size:12px;opacity:.8;line-height:1.4";
    aside.appendChild(infoEl);
    S.group("tr.orient");
    ctl.incl = linSlider("tr.incl", 0, 180, 3, "incl");
    ctl.lon = linSlider("tr.long", 0, 360, 1, "lon");
    var phaseCtl = S.slider({ labelKey: "tr.phase", min: 0, max: 1, step: 0.01, value: 0.5, format: function (v) { return flashToFixed(v, 2); },
      on: function (v) { if (!syncing) { cPhase = v; S.requestDraw(); } } });
    S.group("tr.curve");
    var curveCtl = S.toggle({ labelKey: "tr.showCurve", value: true, on: function (v) { showCurve = v; } });
    var measCtl = S.toggle({ labelKey: "tr.showMeas", value: false, on: function (v) { showMeas = v; noiseIn.disabled = numberIn.disabled = !v; updateLightcurve(); } });
    var noiseCtl = S.slider({ labelKey: "tr.noise", min: Math.log(1e-5) / Math.LN10, max: Math.log(0.2) / Math.LN10, step: 0.001, value: -1,
      format: function (v) { return sigRound(Math.pow(10, v), 2).s; },
      on: function (v) { if (syncing) return; noise = sigRound(Math.pow(10, v), 2).v; updateLightcurve(); } });
    var noiseIn = noiseCtl.input;
    var numberCtl = S.slider({ labelKey: "tr.number", min: 5, max: 250, step: 1, value: 50, format: function (v) { return String(Math.round(v)); },
      on: function (v) { if (syncing) return; number = Math.round(v); updateLightcurve(); } });
    var numberIn = numberCtl.input;
    S.button({ labelKey: "tr.reset", on: function () { onReset(); } });

    function syncAll() {
      syncing = true;
      ["pMass", "pRadius", "sma"].forEach(function (k) { ctl[k].set(Math.log(P[k]) / Math.LN10); });
      ["ecc", "sMass", "incl", "lon"].forEach(function (k) { ctl[k].set(P[k]); });
      syncing = false;
    }
    function applyPreset(pr) {
      P.pMass = pr.pMass; P.pRadius = pr.pRadius; P.sMass = pr.sMass; P.sma = pr.sep; P.ecc = pr.ecc; P.incl = pr.inc; P.lon = pr.lon;
      syncAll(); updateAll(); setBtn.disabled = true;
    }
    function onReset() {
      P = { pMass: 0.657, pRadius: 1.32, sma: 0.047, ecc: 0, sMass: 1.09, incl: 86.929, lon: 0 };
      syncing = true; noiseCtl.set(-1); numberCtl.set(50); syncing = false;
      noise = 0.1; number = 50;
      curveCtl.set(true); measCtl.set(false);
      presetCtl.set("0");
      syncAll(); updateAll(); setCPhase(0.5);
      setBtn.disabled = false;
    }
    onReset();
  }
});
