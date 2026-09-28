/* Spectroscopic Parallax Simulator ----------------------------------------------
   Faithful rebuild of NAAP's "spectroParallax.swf" — one SWF, two catalogue
   entries (ClassAction's Stellar Properties module lists the same file).

   You cannot triangulate a star that is too far away. But its spectrum still
   tells you what kind of star it is: the pattern of absorption lines gives the
   spectral type, the sharpness of those lines gives the luminosity class, and
   the two together place it on the H-R diagram, which hands you its absolute
   magnitude. Compare that with how bright it looks and the distance falls out
   of the distance modulus.

   Everything numeric here is the original's own: the six line-strength ramps
   from createLineArrays, the line wavelengths from createArrays, and the
   piecewise-cubic fits the NAAP HR component carries for spectral type -> log T,
   bolometric correction, and log L for each of the five luminosity classes.
   Checked against the SWF: G2 V reads 5840 K, M_v 4.8, d 1.70 pc.           */
Sim.create({
  id: "spectroparallax",
  width: 940, height: 560,
  strings: {
    en: {
      "sp.attr": "Star attributes", "sp.mag": "Apparent magnitude",
      "sp.class": "Luminosity class", "sp.type": "Spectral type",
      "sp.c1": "I — supergiant", "sp.c2": "II — bright giant",
      "sp.c3": "III — giant", "sp.c4": "IV — subgiant", "sp.c5": "V — main sequence",
      "sp.reset": "Reset",
      "sp.liTitle": "Absorption line intensities", "sp.specTitle": "Simulated spectrum",
      "sp.dmTitle": "Distance modulus calculation", "sp.hrTitle": "H–R diagram",
      "sp.strength": "Line strength", "sp.spectral": "Spectral type",
      "sp.temp": "Temperature", "sp.lum": "Luminosity (L☉)", "sp.tempK": "Temperature (K)",
      "sp.rType": "spectral type", "sp.rTemp": "temperature",
      "sp.rAbs": "absolute magnitude", "sp.rDist": "distance",
      "sp.iHe": "Ionized helium", "sp.He": "Neutral helium", "sp.H": "Hydrogen",
      "sp.iMet": "Ionized metals", "sp.met": "Neutral metals", "sp.mol": "Molecules",
      "sp.dwarfs": "Dwarfs (V)", "sp.super": "Supergiants (I)", "sp.giants": "Giants (III)",
      "sp.wd": "White dwarfs", "sp.blueG": "blue giants", "sp.redG": "red giants",
      "sp.redD": "red dwarfs",
      "sp.hint": "Drag the red marker across the spectral sequence, or drag inside the H–R diagram. The luminosity class sets which curve the star sits on — and that is what fixes its distance.",
      "sp.d0": "very strong ionized helium, moderate helium lines",
      "sp.d1": "strong ionized helium, moderate helium lines",
      "sp.d2": "strong ionized helium, strong helium lines",
      "sp.d3": "moderate ionized helium, very strong helium lines",
      "sp.d4": "weak ionized helium, very strong helium lines",
      "sp.d5": "very weak ionized helium, very strong helium, very weak hydrogen lines",
      "sp.d6": "very strong helium, very weak hydrogen lines",
      "sp.d7": "very strong helium, weak hydrogen lines",
      "sp.d8": "very strong helium, moderate hydrogen lines",
      "sp.d9": "strong helium, moderate hydrogen lines",
      "sp.d10": "moderate helium, moderate hydrogen lines",
      "sp.d11": "moderate helium, strong hydrogen, very weak ionized metal lines",
      "sp.d12": "weak helium, strong hydrogen, very weak ionized metal lines",
      "sp.d13": "very weak helium, very strong hydrogen, weak ionized metal lines",
      "sp.d14": "very strong hydrogen, weak ionized metal lines",
      "sp.d15": "strong hydrogen, moderate ionized metal lines",
      "sp.d16": "moderate hydrogen, moderate ionized metal lines",
      "sp.d17": "moderate hydrogen, strong ionized metal lines",
      "sp.d18": "moderate hydrogen, strong ionized metal, very weak neutral metal lines",
      "sp.d19": "moderate hydrogen, strong ionized metal, weak neutral metal lines",
      "sp.d20": "moderate hydrogen, very strong ionized metal, weak neutral metal lines",
      "sp.d21": "weak hydrogen, very strong ionized metal, weak neutral metal lines",
      "sp.d22": "weak hydrogen, very strong ionized metal, moderate neutral metal lines",
      "sp.d23": "weak hydrogen, strong ionized metal, moderate neutral metal lines",
      "sp.d24": "weak hydrogen, strong ionized metal, strong neutral metal lines",
      "sp.d25": "weak hydrogen, moderate ionized metal, very strong neutral metal lines",
      "sp.d26": "very weak hydrogen, moderate ionized metal, very strong neutral metal lines",
      "sp.d27": "very weak hydrogen, weak ionized metal, very strong neutral metal lines",
      "sp.d28": "very weak ionized metal, very strong neutral metal lines",
      "sp.d29": "very weak ionized metal, strong neutral metal lines",
      "sp.d30": "strong neutral metal lines",
      "sp.d31": "strong neutral metal, very weak molecular lines",
      "sp.d32": "moderate neutral metal, weak molecular lines",
      "sp.d33": "weak neutral metal, weak molecular lines",
      "sp.d34": "very weak neutral metal, moderate molecular lines",
      "sp.d35": "moderate molecular lines",
      "sp.d36": "strong molecular lines",
      "sp.d37": "very strong molecular lines"
    },
    id: {
      "sp.attr": "Sifat bintang", "sp.mag": "Magnitudo semu",
      "sp.class": "Kelas luminositas", "sp.type": "Tipe spektrum",
      "sp.c1": "I — maharaksasa", "sp.c2": "II — raksasa terang",
      "sp.c3": "III — raksasa", "sp.c4": "IV — subraksasa", "sp.c5": "V — deret utama",
      "sp.reset": "Atur ulang",
      "sp.liTitle": "Kekuatan garis serapan", "sp.specTitle": "Spektrum simulasi",
      "sp.dmTitle": "Perhitungan modulus jarak", "sp.hrTitle": "Diagram H–R",
      "sp.strength": "Kekuatan garis", "sp.spectral": "Tipe spektrum",
      "sp.temp": "Temperatur", "sp.lum": "Luminositas (L☉)", "sp.tempK": "Temperatur (K)",
      "sp.rType": "tipe spektrum", "sp.rTemp": "temperatur",
      "sp.rAbs": "magnitudo mutlak", "sp.rDist": "jarak",
      "sp.iHe": "Helium terion", "sp.He": "Helium netral", "sp.H": "Hidrogen",
      "sp.iMet": "Logam terion", "sp.met": "Logam netral", "sp.mol": "Molekul",
      "sp.dwarfs": "Katai (V)", "sp.super": "Maharaksasa (I)", "sp.giants": "Raksasa (III)",
      "sp.wd": "Katai putih", "sp.blueG": "raksasa biru", "sp.redG": "raksasa merah",
      "sp.redD": "katai merah",
      "sp.hint": "Seret penanda merah menyusuri deret spektrum, atau seret di dalam diagram H–R. Kelas luminositas menentukan kurva tempat bintang berada — dan itulah yang menetapkan jaraknya.",
      "sp.d0": "helium terion sangat kuat, garis helium sedang",
      "sp.d1": "helium terion kuat, garis helium sedang",
      "sp.d2": "helium terion kuat, garis helium kuat",
      "sp.d3": "helium terion sedang, garis helium sangat kuat",
      "sp.d4": "helium terion lemah, garis helium sangat kuat",
      "sp.d5": "helium terion sangat lemah, helium sangat kuat, garis hidrogen sangat lemah",
      "sp.d6": "helium sangat kuat, garis hidrogen sangat lemah",
      "sp.d7": "helium sangat kuat, garis hidrogen lemah",
      "sp.d8": "helium sangat kuat, garis hidrogen sedang",
      "sp.d9": "helium kuat, garis hidrogen sedang",
      "sp.d10": "helium sedang, garis hidrogen sedang",
      "sp.d11": "helium sedang, hidrogen kuat, garis logam terion sangat lemah",
      "sp.d12": "helium lemah, hidrogen kuat, garis logam terion sangat lemah",
      "sp.d13": "helium sangat lemah, hidrogen sangat kuat, garis logam terion lemah",
      "sp.d14": "hidrogen sangat kuat, garis logam terion lemah",
      "sp.d15": "hidrogen kuat, garis logam terion sedang",
      "sp.d16": "hidrogen sedang, garis logam terion sedang",
      "sp.d17": "hidrogen sedang, garis logam terion kuat",
      "sp.d18": "hidrogen sedang, logam terion kuat, garis logam netral sangat lemah",
      "sp.d19": "hidrogen sedang, logam terion kuat, garis logam netral lemah",
      "sp.d20": "hidrogen sedang, logam terion sangat kuat, garis logam netral lemah",
      "sp.d21": "hidrogen lemah, logam terion sangat kuat, garis logam netral lemah",
      "sp.d22": "hidrogen lemah, logam terion sangat kuat, garis logam netral sedang",
      "sp.d23": "hidrogen lemah, logam terion kuat, garis logam netral sedang",
      "sp.d24": "hidrogen lemah, logam terion kuat, garis logam netral kuat",
      "sp.d25": "hidrogen lemah, logam terion sedang, garis logam netral sangat kuat",
      "sp.d26": "hidrogen sangat lemah, logam terion sedang, garis logam netral sangat kuat",
      "sp.d27": "hidrogen sangat lemah, logam terion lemah, garis logam netral sangat kuat",
      "sp.d28": "logam terion sangat lemah, garis logam netral sangat kuat",
      "sp.d29": "logam terion sangat lemah, garis logam netral kuat",
      "sp.d30": "garis logam netral kuat",
      "sp.d31": "logam netral kuat, garis molekul sangat lemah",
      "sp.d32": "logam netral sedang, garis molekul lemah",
      "sp.d33": "logam netral lemah, garis molekul lemah",
      "sp.d34": "logam netral sangat lemah, garis molekul sedang",
      "sp.d35": "garis molekul sedang",
      "sp.d36": "garis molekul kuat",
      "sp.d37": "garis molekul sangat kuat"
    }
  },
  about: {
    en: "<p>Trigonometric parallax runs out of reach after a few hundred parsecs — the wobble gets smaller than you can measure. Spectroscopic parallax picks up where it stops, and despite the name it involves no triangulation at all.</p>" +
        "<p>The trick is that a star's spectrum encodes what kind of star it is. Which absorption lines are strong tells you the surface temperature, and so the spectral type: helium lines need a hot star to be excited at all, hydrogen peaks around A0, metals and then molecules take over as the star cools. How narrow the lines are tells you the surface gravity, and so whether you are looking at a compact dwarf or a bloated supergiant.</p>" +
        "<p>Type plus luminosity class is a point on the H–R diagram, and the vertical axis of that diagram is absolute magnitude — how bright the star really is. Compare that with how bright it looks and the difference, the distance modulus, is a distance. The catch is that the luminosity class matters enormously: the same G2 spectrum read as a supergiant rather than a dwarf moves the star from 1.7 parsecs away to nearly 600.</p>",
    id: "<p>Paralaks trigonometri kehabisan jangkauan setelah beberapa ratus parsek — goyangannya menjadi lebih kecil daripada yang dapat diukur. Paralaks spektroskopi meneruskan dari titik itu, dan meskipun namanya demikian, tidak ada triangulasi sama sekali di dalamnya.</p>" +
        "<p>Kuncinya, spektrum sebuah bintang menyandikan jenis bintang apa ia. Garis serapan mana yang kuat memberi tahu temperatur permukaan, dan dengan demikian tipe spektrumnya: garis helium baru tereksitasi pada bintang panas, hidrogen memuncak di sekitar A0, lalu logam dan kemudian molekul mengambil alih seiring bintang mendingin. Seberapa sempit garisnya memberi tahu gravitasi permukaan, dan dengan demikian apakah yang Anda amati katai padat atau maharaksasa yang menggembung.</p>" +
        "<p>Tipe ditambah kelas luminositas adalah satu titik pada diagram H–R, dan sumbu tegak diagram itu adalah magnitudo mutlak — seberapa terang bintang itu sebenarnya. Bandingkan dengan seberapa terang ia tampak, dan selisihnya, modulus jarak, adalah sebuah jarak. Masalahnya, kelas luminositas sangat menentukan: spektrum G2 yang sama, dibaca sebagai maharaksasa alih-alih katai, memindahkan bintang dari jarak 1,7 parsek menjadi hampir 600.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var FONT = "Verdana, Geneva, sans-serif";

    /* ------------------------------------- the NAAP HR component's own fits */
    function fit(segs) {
      return function (x) {
        for (var i = 0; i < segs.length; i++) {
          var s = segs[i];
          if (s[0] === null || x < s[0]) return s[1] + x * (s[2] + x * (s[3] + x * s[4]));
        }
        return NaN;
      };
    }
    var logTempFromType = fit([
      [8.5167, 4.7009, -0.01, 3.92e-05, -0.00014247],
      [16.1, 4.4348, 0.08374, -0.010967, 0.000288299],
      [23.2167, 6.0516, -0.21754, 0.007746, -9.9133e-05],
      [34.1833, 5.0538, -0.08861, 0.0021924, -1.9396e-05],
      [50.5108, 4.7553, -0.06241, 0.0014259, -1.1922e-05],
      [57.9775, 1.1584, 0.15122, -0.0028034, 1.5988e-05],
      [64.3942, 26.4612, -1.15805, 0.019779, -0.000113846],
      [null, -115.7858, 5.46896, -0.0831343, 0.000418879]
    ]);
    var bcFromLogTemp = fit([
      [3.588, -1873.0763, 1364.8081, -328.11949, 25.958485],
      [3.6978, -4208.8678, 3317.811, -872.43468, 76.5266],
      [3.7957, -2920.8124, 2272.8215, -589.83737, 51.052264],
      [3.903, 1749.5431, -1418.5107, 382.67484, -34.353217],
      [4.1317, -2011.2742, 1472.2021, -357.96384, 28.900577],
      [null, 123.5421, -77.8864, 17.20884, -1.367489]
    ]);
    var LOGLUM = {                               // getLogLumFromLogTempAndClass
      1: fit([[4.1476, 44.8387, -30.1309, 7.59468, -0.636977],
        [null, -459.5864, 334.7205, -80.37116, 6.432557]]),
      2: fit([[4.0358, -36.2843, 39.6781, -12.545, 1.280459],
        [null, -37.0612, 40.2556, -12.68811, 1.292279]]),
      3: fit([[3.9092, -53.8721, 59.2071, -19.71611, 2.108195],
        [null, 161.9073, -106.3856, 22.64341, -1.503738]]),
      4: fit([[4.1372, -167.256, 125.271, -31.96691, 2.804002],
        [null, 54.567, -35.5787, 6.91186, -0.328444]]),
      5: fit([[3.5081, -4686.707, 4157.5332, -1232.05177, 121.875554],
        [3.5799, 22801.9307, -19349.4898, 5468.65774, -514.806626],
        [3.728, -9950.2659, 8097.5483, -2198.40972, 199.100683],
        [3.8287, 10594.1896, -8435.0942, 2236.33537, -197.427256],
        [3.9156, -7990.8168, 6127.2576, -1567.12652, 133.707956],
        [4.2129, 277.0365, -207.2491, 50.62412, -4.009536],
        [4.6015, -280.446, 189.7309, -43.6049, 3.446011],
        [null, -9724.5727, 6346.9359, -1381.69136, 100.377185]])
    };
    function magFromLogLum(L) { return 4.75 - 2.51189 * L; }
    function absVisMag(logT, cls) {
      return magFromLogLum(LOGLUM[cls](logT)) - bcFromLogTemp(logT);
    }
    /* formatNumber(num, digits): the original's significant-figure formatter */
    function sig(v, d) {
      if (!isFinite(v) || v <= 0) return "—";
      var e = Math.floor(Math.log(v) / Math.LN10) - (d - 1);
      if (e < 0) return v.toFixed(-e);
      var p = Math.pow(10, e);
      return String(p * Math.round(v / p));
    }

    /* ------------------------------- createLineArrays: six ramps over 70 types */
    function ramp(i) {
      return {
        iHe: i < 8 ? Math.floor(-12.5 * i + 100) : 0,
        He: i < 8 ? Math.floor(3.75 * i + 70) : i < 21 ? Math.floor(-7.7 * i + 161.7) : 0,
        H: i < 7 ? 0 : i < 20 ? Math.floor(7.7 * i - 53.9)
          : i < 54 ? Math.floor(-2.94 * i + 158.7) : 0,
        iMet: i < 11 ? 0 : i < 38 ? Math.floor(3.7 * i - 40.7)
          : i < 52 ? Math.floor(-7.14 * i + 371.3) : 0,
        met: i < 30 ? 0 : i < 49 ? Math.floor(5.26 * i - 157.8)
          : i < 62 ? Math.floor(-7.7 * i + 477.4) : 0,
        mol: i < 50 ? 0 : Math.floor(5.26 * i - 263.16)
      };
    }
    /* createArrays: the wavelengths each family contributes, in nm */
    var FAMILIES = [
      { key: "iHe", colour: "#e89a20", lines: [433.9, 454.2, 468.6], lx: 0.075, ly: 0.14 },
      { key: "He", colour: "#2a7fd4", lines: [402.6, 438.8, 447.1, 706.5], lx: 0.135, ly: 0.35 },
      { key: "H", colour: "#d8332a", lines: [397, 410.1, 434, 486.1, 656.3], lx: 0.30, ly: 0.14 },
      { key: "iMet", colour: "#3f9e46", lines: [393.3, 396.8, 407.7, 417.5, 421.5, 423.3,
        424.6, 426.7, 430, 444.4, 448.1], lx: 0.52, ly: 0.12 },
      { key: "met", colour: "#d63fd6", lines: [403.2, 404.5, 432.5, 422.6, 589], lx: 0.70, ly: 0.12 },
      { key: "mol", colour: "#b8791f", lines: [421.5, 430, 458.4, 462.5, 467, 469.7, 467, 478],
        lx: 0.90, ly: 0.24 }
    ];
    var FAM_LABEL = { iHe: "sp.iHe", He: "sp.He", H: "sp.H", iMet: "sp.iMet",
      met: "sp.met", mol: "sp.mol" };
    /* spectralClassUpdate's description table, collapsed to its 38 distinct strings */
    var DESC = [0, 0, 0, 1, 2, 2, 3, 3, 4, 5, 6, 7, 7, 8, 9, 9, 10, 10, 11, 12, 13, 13, 14, 14,
      15, 15, 15, 15, 16, 17, 17, 17, 18, 18, 19, 20, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 24,
      25, 25, 26, 27, 27, 28, 28, 29, 30, 31, 32, 32, 33, 33, 34, 34, 35, 35, 36, 36, 37, 37, 37];
    var LETTERS = ["O", "B", "A", "F", "G", "K", "M"];
    function typeName(n) { return LETTERS[Math.floor(n / 10)] + (n % 10); }

    /* the ramps are piecewise linear, but the SWF's plot rounds their corners;
       a short binomial blur over neighbouring types reproduces that, and it is
       used only for the picture - the spectrum still uses the raw strengths */
    var SMOOTH = {};
    function smooth(key, i) {
      var row = SMOOTH[key];
      if (!row) {
        var raw = [], j;
        for (j = 0; j <= 69; j++) raw.push(ramp(j)[key]);
        for (var pass = 0; pass < 2; pass++) {
          var out = [];
          for (j = 0; j <= 69; j++) {
            var a = raw[Math.max(0, j - 1)], b = raw[j], c = raw[Math.min(69, j + 1)];
            out.push((a + 2 * b + c) / 4);
          }
          raw = out;
        }
        row = SMOOTH[key] = raw;
      }
      return row[i];
    }

    function visibleRGB(nm) {
      var r = 0, g = 0, b = 0;
      if (nm < 440) { r = -(nm - 440) / 60; b = 1; }
      else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
      else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
      else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
      else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
      else { r = 1; }
      var f = nm > 700 ? 0.3 + 0.7 * (780 - nm) / 80 : nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : 1;
      return [Math.round(255 * r * f), Math.round(255 * g * f), Math.round(255 * b * f)];
    }

    /* ------------------------------------------------------------ the layout */
    var LI = { x: 8, y: 8, w: 452, h: 272 };
    var PLOT = { x: 70, y: 74, w: 372, h: 172 };
    var SPEC = { x: 8, y: 288, w: 452, h: 86, sx: 24, sy: 312, sw: 420, sh: 46 };
    var DM = { x: 8, y: 382, w: 452, h: 170 };
    var HR = { x: 468, y: 8, w: 464, h: 544 };
    var HP = { x: 536, y: 50, w: 372, h: 430 };
    var LAM0 = 380, LAM1 = 720;
    var TMIN = logTempFromType(70), TMAX = logTempFromType(0);
    var LMIN = -5, LMAX = 6;

    var numST = 42, lumClass = 5, appMag = 1;

    function hx(logT) { return HP.x + HP.w * (TMAX - logT) / (TMAX - TMIN); }
    function hy(logL) { return HP.y + HP.h * (LMAX - logL) / (LMAX - LMIN); }
    function hInvT(x) { return TMAX - (x - HP.x) / HP.w * (TMAX - TMIN); }
    function px(i) { return PLOT.x + PLOT.w * i / 69; }
    function py(v) { return PLOT.y + PLOT.h * (1 - v / 110); }

    /* ------------------------------------------------------------- controls */
    S.group("sp.attr");
    var typeCtl = S.slider({ labelKey: "sp.type", min: 0, max: 69, value: 42, step: 1,
      format: function (v) { return typeName(v); },
      on: function (v) { numST = v; refresh(); } });
    var magCtl = S.slider({ labelKey: "sp.mag", min: -10, max: 20, value: 1, step: 0.1,
      format: function (v) { return v.toFixed(1); },
      on: function (v) { appMag = v; refresh(); } });
    var classCtl = S.select({ labelKey: "sp.class", value: "5",
      options: [{ v: "1", labelKey: "sp.c1" }, { v: "2", labelKey: "sp.c2" },
        { v: "3", labelKey: "sp.c3" }, { v: "4", labelKey: "sp.c4" },
        { v: "5", labelKey: "sp.c5" }],
      on: function (v) { lumClass = parseInt(v, 10); refresh(); } });
    S.button({ labelKey: "sp.reset", on: function () {
      typeCtl.set(42); magCtl.set(1); classCtl.set("5");
    } });

    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "sp.hint");
    S.canvas.parentNode.parentNode.querySelector(".sim-controls").appendChild(hint);

    var outType = S.readout({ labelKey: "sp.rType" });
    var outTemp = S.readout({ labelKey: "sp.rTemp" });
    var outAbs = S.readout({ labelKey: "sp.rAbs" });
    var outDist = S.readout({ labelKey: "sp.rDist" });

    function state() {
      var logT = logTempFromType(numST);
      var logL = LOGLUM[lumClass](logT);
      var M = absVisMag(logT, lumClass);
      return { logT: logT, T: Math.pow(10, logT), logL: logL, M: M,
        d: Math.pow(10, (appMag - M + 5) / 5) };
    }
    function refresh() {
      var s = state();
      outType(typeName(numST));
      outTemp(sig(s.T, 3) + " K");
      outAbs(s.M.toFixed(1));
      outDist(sig(s.d, 3) + " pc");
      S.requestDraw();
    }

    /* ---------------------------------------------------------- interaction */
    var drag = null;
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (p.x >= PLOT.x - 12 && p.x <= PLOT.x + PLOT.w + 12 &&
          p.y >= PLOT.y && p.y <= PLOT.y + PLOT.h + 20) drag = "li";
      else if (p.x >= HP.x && p.x <= HP.x + HP.w && p.y >= HP.y && p.y <= HP.y + HP.h) drag = "hr";
      else return;
      move(p);
      S.canvas.setPointerCapture(ev.pointerId);
      ev.preventDefault();
    });
    S.canvas.addEventListener("pointermove", function (ev) { if (drag) move(at(ev)); });
    ["pointerup", "pointercancel"].forEach(function (k) {
      S.canvas.addEventListener(k, function () { drag = null; });
    });
    function move(p) {
      var n;
      if (drag === "li") n = Math.round((p.x - PLOT.x) / PLOT.w * 69);
      else {
        /* invert the type -> log T fit by scanning, the way a lookup would */
        var want = hInvT(p.x), best = 0, bd = 1e9;
        for (var i = 0; i <= 69; i++) {
          var e = Math.abs(logTempFromType(i) - want);
          if (e < bd) { bd = e; best = i; }
        }
        n = best;
        /* and snap to the nearest luminosity class curve at that type */
        var lt = logTempFromType(n), bc2 = 1e9, bcl = lumClass;
        for (var c = 1; c <= 5; c++) {
          var e2 = Math.abs(hy(LOGLUM[c](lt)) - p.y);
          if (e2 < bc2) { bc2 = e2; bcl = c; }
        }
        if (bcl !== lumClass) classCtl.set(String(bcl));
      }
      n = Math.max(0, Math.min(69, n));
      if (n !== numST) typeCtl.set(n);
    }
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }

    /* --------------------------------------------------------------- paint */
    S.onDraw(function () {
      var ctx = S.ctx, tr = I18N.t.bind(I18N);
      var s = state();
      S.clear();
      ctx.fillStyle = "#eef0f4"; ctx.fillRect(0, 0, S.W, S.H);
      [LI, SPEC, DM, HR].forEach(function (r) {
        ctx.fillStyle = "#ffffff"; ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = "#c8ccd4"; ctx.lineWidth = 1;
        ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
      });
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#333333"; ctx.font = "12px " + FONT; ctx.textAlign = "left";
      ctx.fillText(tr("sp.liTitle"), LI.x + 10, LI.y + 18);
      ctx.fillText(tr("sp.specTitle"), SPEC.x + 10, SPEC.y + 18);
      ctx.fillText(tr("sp.dmTitle"), DM.x + 10, DM.y + 18);
      ctx.fillText(tr("sp.hrTitle"), HR.x + 10, HR.y + 18);

      lineIntensities(ctx, tr, s);
      spectrum(ctx, s);
      distanceModulus(ctx, tr, s);
      hrDiagram(ctx, tr, s);
    });

    function lineIntensities(ctx, tr, s) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#111111"; ctx.font = "bold 12px " + FONT;
      ctx.fillText(tr("sp.spectral") + " : " + typeName(numST) + "      " +
        tr("sp.temp") + " : " + sig(s.T, 3) + " K", LI.x + LI.w / 2, LI.y + 40);
      ctx.fillStyle = "#333333"; ctx.font = "10px " + FONT;
      ctx.fillText("(" + tr("sp.d" + DESC[numST]) + ")", LI.x + LI.w / 2, LI.y + 58);

      ctx.strokeStyle = "#333333"; ctx.lineWidth = 1;
      ctx.strokeRect(PLOT.x + 0.5, PLOT.y + 0.5, PLOT.w, PLOT.h);
      for (var i = 0; i <= 69; i++) {          // one tick per spectral type
        var x = px(i), big = i % 10 === 0;
        ctx.beginPath();
        ctx.moveTo(x, PLOT.y + PLOT.h);
        ctx.lineTo(x, PLOT.y + PLOT.h - (big ? 7 : 4));
        ctx.strokeStyle = "#555555"; ctx.stroke();
      }
      ctx.fillStyle = "#111111"; ctx.font = "bold 12px " + FONT;
      for (var k = 0; k < 7; k++) ctx.fillText(LETTERS[k], px(k * 10 + 5), PLOT.y + PLOT.h + 20);
      ctx.fillText(tr("sp.spectral"), PLOT.x + PLOT.w / 2, PLOT.y + PLOT.h + 40);
      ctx.save();
      ctx.translate(LI.x + 24, PLOT.y + PLOT.h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(tr("sp.strength"), 0, 0);
      ctx.restore();

      FAMILIES.forEach(function (f) {
        ctx.beginPath();
        var pts = [], i;
        for (i = 0; i <= 69; i++) pts.push([px(i), py(smooth(f.key, i))]);
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (i = 1; i < pts.length - 1; i++) {   // quadratics through the midpoints,
          var mx = (pts[i][0] + pts[i + 1][0]) / 2;   // which is what curveTo gives
          var my = (pts[i][1] + pts[i + 1][1]) / 2;
          ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
        }
        ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
        ctx.strokeStyle = f.colour; ctx.lineWidth = 2; ctx.stroke();
      });
      ctx.font = "9px " + FONT;
      FAMILIES.forEach(function (f) {
        ctx.fillStyle = f.colour;
        wrapCentred(ctx, tr(FAM_LABEL[f.key]),
          PLOT.x + PLOT.w * f.lx, PLOT.y + PLOT.h * f.ly, 54, 10);
      });

      var cx = px(numST);
      ctx.beginPath();
      ctx.moveTo(cx, PLOT.y); ctx.lineTo(cx, PLOT.y + PLOT.h);
      ctx.strokeStyle = "#cc2222"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, PLOT.y + PLOT.h + 1);
      ctx.lineTo(cx - 5, PLOT.y + PLOT.h + 9);
      ctx.lineTo(cx + 5, PLOT.y + PLOT.h + 9);
      ctx.closePath();
      ctx.fillStyle = "#cc2222"; ctx.fill();
    }

    /* mySpectra: a continuum with the family lines punched out of it, each at the
       strength the ramps give and the thickness the luminosity class gives */
    function spectrum(ctx, s) {
      var g = ctx.createLinearGradient(SPEC.sx, 0, SPEC.sx + SPEC.sw, 0);
      for (var t = 0; t <= 40; t++) {
        var c = visibleRGB(LAM0 + (LAM1 - LAM0) * t / 40);
        g.addColorStop(t / 40, "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")");
      }
      ctx.fillStyle = g;
      ctx.fillRect(SPEC.sx, SPEC.sy, SPEC.sw, SPEC.sh);
      var r = ramp(numST);
      var w = [1, 1.5, 2, 2.5, 3][lumClass - 1];
      FAMILIES.forEach(function (f) {
        var a = r[f.key] / 100;
        if (a <= 0) return;
        ctx.globalAlpha = Math.min(1, a);
        ctx.fillStyle = "#000000";
        f.lines.forEach(function (nm) {
          if (nm < LAM0 || nm > LAM1) return;
          var x = SPEC.sx + SPEC.sw * (nm - LAM0) / (LAM1 - LAM0);
          ctx.fillRect(x - w / 2, SPEC.sy, w, SPEC.sh);
        });
      });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#888888"; ctx.lineWidth = 1;
      ctx.strokeRect(SPEC.sx + 0.5, SPEC.sy + 0.5, SPEC.sw - 1, SPEC.sh - 1);
    }

    function distanceModulus(ctx, tr, s) {
      ctx.textAlign = "center";
      var cx = DM.x + DM.w / 2;
      ctx.font = "bold 17px " + FONT;
      var y1 = DM.y + 62;
      var parts = [["m", "#cc2222"], ["ᵥ − ", "#333333"], ["M", "#666666"],
        ["ᵥ = −5 + 5 log", "#333333"], ["₁₀ ", "#333333"], ["d", "#2299cc"]];
      runs(ctx, parts, cx, y1);
      ctx.font = "bold 19px " + FONT;
      runs(ctx, [[appMag.toFixed(1), "#cc2222"], ["  −  ", "#333333"],
        [s.M.toFixed(1), "#666666"], ["  = −5 + 5 log₁₀ ", "#333333"],
        [sig(s.d, 3), "#2299cc"]], cx, y1 + 42);
      ctx.font = "12px " + FONT; ctx.fillStyle = "#555555";
      ctx.fillText(tr("sp.rDist") + " = " + sig(s.d, 3) + " pc  =  " +
        sig(s.d * 3.26156, 3) + " ly", cx, y1 + 82);
    }
    function runs(ctx, parts, cx, y) {
      var total = 0, i;
      for (i = 0; i < parts.length; i++) total += ctx.measureText(parts[i][0]).width;
      var x = cx - total / 2;
      ctx.textAlign = "left";
      for (i = 0; i < parts.length; i++) {
        ctx.fillStyle = parts[i][1];
        ctx.fillText(parts[i][0], x, y);
        x += ctx.measureText(parts[i][0]).width;
      }
      ctx.textAlign = "center";
    }

    function hrDiagram(ctx, tr, s) {
      ctx.save();
      ctx.beginPath(); ctx.rect(HP.x, HP.y, HP.w, HP.h); ctx.clip();
      ctx.fillStyle = "#ffffff"; ctx.fillRect(HP.x, HP.y, HP.w, HP.h);

      blob(ctx, 4.02, 4.9, 118, 27, 0.20, "rgba(120,160,225,0.45)");        // supergiants
      blob(ctx, 3.635, 2.3, 26, 42, 0.0, "rgba(240,170,120,0.45)");         // giants
      blob(ctx, 4.04, -2.55, 108, 18, 0.28, "rgba(150,150,150,0.55)");      // white dwarfs

      /* the main sequence, drawn as a band round the class V fit */
      ctx.beginPath();
      var i;
      for (i = 0; i <= 69; i++) {
        var lt = logTempFromType(i);
        if (i === 0) ctx.moveTo(hx(lt), hy(LOGLUM[5](lt) + 0.45));
        else ctx.lineTo(hx(lt), hy(LOGLUM[5](lt) + 0.45));
      }
      for (i = 69; i >= 0; i--) {
        var lt2 = logTempFromType(i);
        ctx.lineTo(hx(lt2), hy(LOGLUM[5](lt2) - 0.45));
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(120,200,120,0.42)"; ctx.fill();

      /* the five luminosity-class curves the model actually uses */
      for (var c = 1; c <= 5; c++) {
        ctx.beginPath();
        for (i = 0; i <= 69; i++) {
          var lt3 = logTempFromType(i);
          if (i === 0) ctx.moveTo(hx(lt3), hy(LOGLUM[c](lt3)));
          else ctx.lineTo(hx(lt3), hy(LOGLUM[c](lt3)));
        }
        ctx.strokeStyle = c === lumClass ? "#cc2222" : "rgba(200,90,80,0.55)";
        ctx.lineWidth = c === lumClass ? 1.8 : 1;
        ctx.stroke();
      }

      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "italic 10px " + FONT; ctx.fillStyle = "#4a4a6a";
      ctx.fillText(tr("sp.blueG"), hx(4.2), hy(5.35));
      ctx.fillText(tr("sp.redG"), hx(3.63), hy(3.35));
      ctx.fillText(tr("sp.redD"), hx(3.52), hy(-1.6));
      ctx.font = "bold 11px " + FONT;
      ctx.fillStyle = "#2a4f92"; ctx.fillText(tr("sp.super"), hx(4.02), hy(4.55));
      ctx.fillStyle = "#a2561b"; ctx.fillText(tr("sp.giants"), hx(3.60), hy(2.0));
      ctx.fillStyle = "#2d7a2d"; ctx.fillText(tr("sp.dwarfs"), hx(4.22), hy(3.1));
      ctx.fillStyle = "#555555"; ctx.fillText(tr("sp.wd"), hx(4.02), hy(-2.85));

      var dx = hx(s.logT), dy = hy(s.logL);
      ctx.beginPath(); ctx.arc(dx, dy, 5, 0, TAU);
      ctx.fillStyle = "#111111"; ctx.fill();
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = "#333333"; ctx.lineWidth = 1;
      ctx.strokeRect(HP.x + 0.5, HP.y + 0.5, HP.w, HP.h);
      ctx.fillStyle = "#333333"; ctx.font = "10px " + FONT;
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (var e = LMIN; e <= LMAX; e++) {
        var y = hy(e);
        ctx.beginPath(); ctx.moveTo(HP.x, y); ctx.lineTo(HP.x - 4, y); ctx.stroke();
        ctx.fillText("10" + sup(e), HP.x - 7, y);
      }
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      [50000, 25000, 10000, 5000, 2500].forEach(function (T) {
        var x = hx(Math.log(T) / Math.LN10);
        if (x < HP.x - 1 || x > HP.x + HP.w + 1) return;
        ctx.beginPath(); ctx.moveTo(x, HP.y + HP.h); ctx.lineTo(x, HP.y + HP.h + 4); ctx.stroke();
        ctx.fillText(String(T), x, HP.y + HP.h + 7);
      });
      ctx.font = "bold 12px " + FONT;
      ctx.fillText(tr("sp.tempK"), HP.x + HP.w / 2, HP.y + HP.h + 26);
      ctx.save();
      ctx.translate(HR.x + 22, HP.y + HP.h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textBaseline = "alphabetic";
      ctx.fillText(tr("sp.lum"), 0, 0);
      ctx.restore();
    }
    function blob(ctx, logT, logL, a, b, rot, fill) {
      ctx.save();
      ctx.translate(hx(logT), hy(logL));
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, a, b, 0, 0, TAU);
      ctx.fillStyle = fill; ctx.fill();
      ctx.restore();
    }
    var SUP = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶"];
    function sup(e) {
      return (e < 0 ? "⁻" : "") + SUP[Math.abs(e)];
    }
    function wrapCentred(ctx, text, x, y, w, lh) {
      var words = String(text).split(" "), lines = [], line = "";
      for (var i = 0; i < words.length; i++) {
        var probe = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(probe).width > w && line) { lines.push(line); line = words[i]; }
        else line = probe;
      }
      if (line) lines.push(line);
      for (var j = 0; j < lines.length; j++) {
        ctx.fillText(lines[j], x, y - (lines.length - 1 - j) * lh);
      }
    }

    refresh();
  }
});
