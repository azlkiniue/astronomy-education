/* Blackbody Curves and Filters Explorer ---------------------------------------
   Rebuild of the NAAP "Blackbody Curves and Filters Explorer" (blackbody.swf =
   bbexplorer.swf; BlackbodyExplorerClass, SimpleBlackbodyClass, FiltererClass,
   FilterDetailsPanelClass, CurvesListClass, Tab Group and the number/label
   symbols decompiled). The canvas is the SWF's stage below its title bar:
     • the plot — flux against wavelength, 515 × 420 px, drawn the SWF's way:
       each curve is a chain of quadratic segments built from the Planck
       function and its slope, clipped 100 px above the plot; the y axis
       autoscales so the tallest curve peaks at 90 % (to all curves, to the
       selected one, or locked), with "3.5 × 10¹³" style labels; the x axis
       runs from 25 nm to the rightmost limit (1–5 µm) with SI-prefixed labels
       over the visible-spectrum strip; the selected curve is drawn 3 px wide,
       optionally filled (30 %) and labelled "peak at … nm",
     • the curves / filters panel — its tabs (click them), the temperature, and
       either the list of curves (temperature, Wien peak, σT⁴ area; click one
       to select it) or the U, B, V, R magnitudes of a 1 R☉ star at 10 pc, the
       colour index and the bar graph of the filters' relative strengths; with
       the filters tab the plot shows only the selected curve and the four
       filter transmission profiles multiplied by it (20 % alpha).
   The controls — temperature (log 3000–25 000 K, 3 significant digits), the
   two check boxes, add/remove curve (1–5 curves), the colour-index filters,
   the vertical-scale mode and the rightmost limit — are in the sidebar.     */
Sim.create({
  id: "blackbody",
  width: 950, height: 513,
  strings: {
    en: {
      "bb.curvesTab": "curves", "bb.filtersTab": "filters", "bb.vTab": "vertical scale", "bb.hTab": "horizontal scale",
      "bb.temp": "temperature", "bb.tempLabel": "temperature:",
      "bb.highlight": "highlight area under curve", "bb.indicate": "indicate peak wavelength",
      "bb.add": "add curve", "bb.remove": "remove curve", "bb.select": "selected curve",
      "bb.lock": "lock scale", "bb.all": "autoscale to all curves", "bb.sel": "autoscale to selected curve",
      "bb.limit": "rightmost limit", "bb.ciA": "color index: first filter", "bb.ciB": "color index: second filter", "bb.view": "panel", "bb.reset": "reset", "bb.gCurves": "Curves", "bb.gFilters": "Filters", "bb.gScale": "Scale", "bb.sp": "",
      "bb.hPeak": "peak", "bb.hWave": "wavelength", "bb.hArea": "area under curve", "bb.hTemp": "temperature",
      "bb.peakAt": "peak at {nm} nm",
      "bb.mags": "theoretical magnitudes for 1 R☉ star at 10 pc:",
      "bb.note": "(note: brighter stars have smaller magnitudes)",
      "bb.ci": "color index:",
      "bb.rel": "relative \nstrengths of \nthe filters at \nthe given \ntemperature:",
      "bb.flux": "Flux", "bb.wave": "Wavelength"
    },
    id: {
      "bb.curvesTab": "kurva", "bb.filtersTab": "filter", "bb.vTab": "skala vertikal", "bb.hTab": "skala horizontal",
      "bb.temp": "suhu", "bb.tempLabel": "suhu:",
      "bb.highlight": "arsir luas di bawah kurva", "bb.indicate": "tandai panjang gelombang puncak",
      "bb.add": "tambah kurva", "bb.remove": "hapus kurva", "bb.select": "kurva terpilih",
      "bb.lock": "kunci skala", "bb.all": "autoskala ke semua kurva", "bb.sel": "autoskala ke kurva terpilih",
      "bb.limit": "batas paling kanan", "bb.ciA": "indeks warna: filter pertama", "bb.ciB": "indeks warna: filter kedua", "bb.view": "panel", "bb.reset": "atur ulang", "bb.gCurves": "Kurva", "bb.gFilters": "Filter", "bb.gScale": "Skala", "bb.sp": "",
      "bb.hPeak": "panjang", "bb.hWave": "gel. puncak", "bb.hArea": "luas di bawah kurva", "bb.hTemp": "suhu",
      "bb.peakAt": "puncak di {nm} nm",
      "bb.mags": "magnitudo teoretis bintang 1 R☉ pada 10 pc:",
      "bb.note": "(catatan: bintang lebih terang bermagnitudo lebih kecil)",
      "bb.ci": "indeks warna:",
      "bb.rel": "kekuatan \nrelatif filter \npada suhu \nyang \ndiberikan:",
      "bb.flux": "Fluks", "bb.wave": "Panjang Gelombang"
    }
  },
  about: {
    en: "<p>Every warm object glows with a <strong>blackbody spectrum</strong> whose shape depends only on temperature. Add several curves to compare them; click a curve in the list to select it.</p>" +
        "<h3>Wien's law</h3><p>The peak slides to shorter (bluer) wavelengths as the star gets hotter: λ<sub>peak</sub> = 2.9 × 10<sup>6</sup> K·nm ÷ T.</p>" +
        "<h3>Stefan–Boltzmann law</h3><p>The area under the curve — energy radiated per unit area — grows as T<sup>4</sup>, so the hottest curve towers over the rest (use <em>autoscale to selected curve</em> to inspect a cool one).</p>" +
        "<h3>Filters &amp; colour</h3><p>The <em>filters</em> tab shows how much of the selected curve passes the U, B, V and R filters, the magnitudes a star of one solar radius at 10 parsecs would have in each, and a <strong>colour index</strong> such as B − V — which astronomers read back as a temperature (hot stars are blue, B − V &lt; 0; cool stars are red, B − V &gt; 0).</p>",
    id: "<p>Setiap benda hangat berpijar dengan <strong>spektrum benda hitam</strong> yang bentuknya hanya bergantung pada suhu. Tambahkan beberapa kurva untuk membandingkan; klik kurva di daftar untuk memilihnya.</p>" +
        "<h3>Hukum Wien</h3><p>Puncak bergeser ke panjang gelombang lebih pendek (lebih biru) saat lebih panas: λ<sub>puncak</sub> = 2,9 × 10<sup>6</sup> K·nm ÷ T.</p>" +
        "<h3>Hukum Stefan–Boltzmann</h3><p>Luas di bawah kurva — energi per satuan luas — tumbuh sebagai T<sup>4</sup>, jadi kurva terpanas menjulang (pakai <em>autoskala ke kurva terpilih</em> untuk melihat yang dingin).</p>" +
        "<h3>Filter &amp; warna</h3><p>Tab <em>filter</em> menunjukkan seberapa banyak kurva terpilih yang lolos filter U, B, V dan R, magnitudo bintang berjari-jari satu Matahari pada 10 parsek di tiap filter, dan <strong>indeks warna</strong> seperti B − V — yang dibaca astronom sebagai suhu (bintang panas biru, B − V &lt; 0; dingin merah, B − V &gt; 0).</p>"
  },
  build: function (S) {
    var OY = -30;                                  // the SWF's title bar is the page header here
    var FONT = "Verdana, Geneva, sans-serif", ASC = 1.0059;
    function t(k) { return I18N.t(k); }
    function fmt(k, o) { return t(k).replace(/\{(\w+)\}/g, function (m, n) { return o[n]; }); }

    /* ---------------- the physics (SimpleBlackbodyClass, FiltererClass) ---------------- */
    var A = 1.1910425859324616e-16, B = 0.014387750559248378, WIEN = 0.0028977682864295084, SIGMA = 5.669e-08;
    function planck(w, T) { return A / (Math.pow(w, 5) * (Math.exp(B / (w * T)) - 1)); }
    function flashToFixed(x, f) {                  // the SWF's Number.prototype.toFixed
      var s = x < 0 ? "-" : "";
      x = Math.abs(x);
      var n = String(Math.round(x * Math.pow(10, f)));
      if (f > 0) { while (n.length < f + 1) n = "0" + n; n = n.slice(0, n.length - f) + "." + n.slice(n.length - f); }
      return s + n;
    }
    function flashString(v) { return String(parseFloat(v.toPrecision(15))); }
    function sigDigits(x, d) {                     // Math.toSigDigits
      if (x === 0) return 0;
      var e = Math.floor(Math.log(Math.abs(x)) / Math.LN10), f = Math.pow(10, d - (1 + e));
      return Math.round(f * x) / f;
    }
    function sciParts(num, digs) {                 // getCoefficientAndExponent
      if (num === 0) { var z = "0"; if (digs > 1) { z += "."; for (var i = 1; i < digs; i++) z += "0"; } return { c: z, e: "0" }; }
      var sign = num < 0 ? "-" : ""; num = Math.abs(num);
      var expo = Math.floor(Math.log(num) / Math.LN10), fact = Math.pow(10, digs - 1);
      var num2 = Math.round(fact * Math.pow(10, -expo) * num) / fact;
      if (!(num2 < 10)) { num2 /= 10; expo += 1; }
      var s = flashString(num2), sf = s.replace(/[^0-9]/g, "").length, zeros = digs - sf;
      if (zeros > 0) { if (s.indexOf(".") < 0) s += "."; while (zeros-- > 0) s += "0"; }
      return { c: sign + s, e: String(expo) };
    }

    /* ---------------- state (BlackbodyExplorerClass) ---------------- */
    var PLOT = { x: 101.85, y: 480, w: 515, h: 420, minW: 2.5e-08, maxW: 1e-06 };
    var COLORS = ["#f06060", "#60d060", "#a0a0f0", "#edbd32", "#a0a0a0"];
    var curves = [], selected = null, freeID = 0;
    var showArea = false, showPeak = false, tab = "curves", scaleMode = "all";
    var maxBrightness = 1e12, vScale = 0;
    var minuend = "U", subtrahend = "U", temperature = 6000;

    var FILTERS = {
      U: {w0: 275, offset: 18.7781722700872, t: [0,0.013327,0.028915,0.047953,0.071514,0.10019,0.134341,0.173608,0.217277,0.264636,0.314136,0.364826,0.415516,0.465374,0.513684,0.559852,0.603284,0.643622,0.680509,0.714184,0.744645,0.772013,0.796644,0.818301,0.83722,0.853522,0.867563,0.879819,0.890528,0.900405,0.909448,0.917896,0.92575,0.932889,0.939196,0.944669,0.949429,0.953475,0.957044,0.960376,0.963589,0.96704,0.970609,0.974298,0.977987,0.981437,0.984293,0.986435,0.987982,0.988815,0.989529,0.990243,0.991314,0.992504,0.993812,0.995121,0.996192,0.996906,0.997263,0.997263,0.997263,0.997263,0.99762,0.998215,0.99881,0.999405,0.999881,1,1,0.999524,0.99881,0.997739,0.996549,0.995478,0.994526,0.993693,0.992861,0.992028,0.990719,0.989172,0.987149,0.984769,0.981913,0.978701,0.975012,0.971085,0.966683,0.961804,0.95633,0.950143,0.943598,0.936697,0.929438,0.921704,0.913018,0.903379,0.89267,0.88089,0.868039,0.854117,0.839124,0.82306,0.805807,0.787125,0.767135,0.745478,0.722275,0.697287,0.670633,0.642432,0.612922,0.582223,0.550571,0.518087,0.485007,0.45169,0.418491,0.38565,0.353641,0.322703,0.292837,0.264398,0.237387,0.212042,0.188363,0.166587,0.146597,0.12851,0.112089,0.097573,0.084603,0.073179,0.063184,0.054498,0.047001,0.040457,0.034983,0.030105,0.026059,0.022608,0.019634,0.017135,0.014993,0.013208,0.011661,0.010352,0.009162,0.00821,0.007258,0.006545,0.005831,0.005236,0.004641,0.003332,0.001904,0.000119,0]},
      B: {w0: 361, offset: 18.3809597325381, t: [0,0.005648,0.019601,0.028904,0.039535,0.057475,0.075415,0.093688,0.112292,0.131561,0.151163,0.171761,0.192691,0.214286,0.236213,0.258804,0.281395,0.304319,0.327243,0.350166,0.373422,0.396346,0.419269,0.44186,0.46412,0.486047,0.507641,0.528904,0.550166,0.570764,0.590698,0.610631,0.6299,0.648505,0.666777,0.684385,0.701329,0.717608,0.733223,0.748173,0.762458,0.775748,0.788704,0.800997,0.812957,0.824252,0.835548,0.846179,0.856478,0.866777,0.876744,0.886379,0.896013,0.905648,0.914618,0.923588,0.931894,0.939867,0.947176,0.954153,0.960133,0.965781,0.971096,0.975415,0.979734,0.983721,0.987375,0.990365,0.993023,0.995349,0.99701,0.998339,0.999336,1,1,1,0.999668,0.999003,0.998007,0.996678,0.994684,0.992359,0.989369,0.985382,0.980731,0.975083,0.968439,0.96113,0.953488,0.945183,0.936877,0.927907,0.918937,0.909635,0.899668,0.888704,0.876744,0.863455,0.848837,0.832558,0.81495,0.796013,0.775083,0.752824,0.728904,0.703654,0.677741,0.650498,0.622924,0.594684,0.565781,0.536877,0.507641,0.478738,0.450498,0.422591,0.395017,0.368771,0.342857,0.318272,0.294352,0.271429,0.249834,0.228904,0.20897,0.190365,0.17309,0.156811,0.142193,0.128571,0.116279,0.105316,0.095349,0.086379,0.078405,0.071096,0.064452,0.058472,0.052824,0.047508,0.042857,0.038206,0.033887,0.0299,0.026246,0.022924,0.019934,0.017276,0.01495,0.012957,0.007973,0.004983,0.000664,0.000332,0]},
      V: {w0: 477, offset: 17.9576848442658, t: [0,0.00016,0.000642,0.010906,0.016359,0.024218,0.034804,0.048757,0.06656,0.088532,0.114996,0.14579,0.180754,0.219246,0.260465,0.303609,0.347715,0.391981,0.436247,0.480032,0.522855,0.564395,0.60417,0.64186,0.677306,0.710184,0.740337,0.768083,0.793103,0.816038,0.837209,0.856616,0.874419,0.890938,0.905854,0.919166,0.930874,0.941139,0.94996,0.957819,0.964715,0.971131,0.977065,0.982358,0.987009,0.991018,0.994226,0.996632,0.998236,0.999358,0.99984,1,0.99984,0.999519,0.998877,0.997915,0.996311,0.994226,0.9915,0.988292,0.984443,0.980112,0.975621,0.97097,0.965998,0.960866,0.955253,0.949318,0.942582,0.935204,0.927346,0.919166,0.910986,0.902486,0.893825,0.885164,0.876022,0.866881,0.857257,0.847474,0.837209,0.826624,0.815397,0.803689,0.79182,0.779631,0.767121,0.754611,0.741941,0.72927,0.716439,0.703609,0.690617,0.677466,0.663833,0.65004,0.635926,0.621652,0.607378,0.592943,0.578829,0.564715,0.550762,0.536648,0.522534,0.508099,0.493825,0.479551,0.465437,0.451484,0.437851,0.424379,0.410906,0.397594,0.384282,0.371131,0.35814,0.345469,0.332959,0.320449,0.308099,0.29591,0.284042,0.272334,0.260946,0.25004,0.239455,0.22903,0.219086,0.209302,0.199679,0.190537,0.181556,0.172895,0.164395,0.156215,0.148356,0.140818,0.13344,0.126544,0.119808,0.113553,0.107458,0.101684,0.096071,0.090457,0.085004,0.079551,0.074258,0.069286,0.064635,0.060144,0.056295,0.052767,0.049559,0.046512,0.043945,0.041379,0.039134,0.036728,0.034162,0.031596,0.02903,0.026303,0.023416,0.020529,0.017642,0.015397,0.010746,0.006095,0.002727,0.001283,0]},
      R: {w0: 537, offset: 18.2183567502167, t: [0,0.001215,0.003645,0.00675,0.011071,0.017281,0.026056,0.037937,0.053463,0.073174,0.09734,0.126097,0.159579,0.197381,0.239098,0.284056,0.331443,0.380316,0.429729,0.479006,0.526934,0.573107,0.616579,0.657081,0.694478,0.72877,0.760092,0.788443,0.814365,0.837721,0.858782,0.877683,0.894424,0.90941,0.922371,0.933846,0.943837,0.952477,0.959903,0.966383,0.972188,0.977184,0.981639,0.985419,0.988659,0.99136,0.993655,0.995545,0.99703,0.998245,0.999055,0.99973,1,1,0.999595,0.999055,0.998245,0.997165,0.99595,0.9946,0.993115,0.99163,0.990144,0.988659,0.987039,0.985554,0.983934,0.982179,0.980424,0.978399,0.976239,0.973944,0.971378,0.968678,0.965843,0.962738,0.959498,0.956258,0.952747,0.949237,0.945862,0.942487,0.939247,0.936141,0.933171,0.930336,0.927366,0.924531,0.921561,0.918321,0.914945,0.9113,0.90752,0.903605,0.899554,0.895504,0.891589,0.887539,0.883354,0.879303,0.875118,0.871068,0.867153,0.865938,0.862562,0.858782,0.855002,0.850952,0.846767,0.842716,0.838666,0.834616,0.830566,0.826515,0.82233,0.81801,0.813555,0.808964,0.804374,0.799649,0.795059,0.790333,0.785743,0.781153,0.776563,0.771972,0.767382,0.762792,0.757932,0.753071,0.747941,0.742676,0.737276,0.731875,0.726475,0.721075,0.715674,0.710274,0.704874,0.699473,0.693938,0.688403,0.682733,0.677197,0.671527,0.665857,0.660321,0.654651,0.649251,0.643715,0.63845,0.633185,0.628055,0.622924,0.617794,0.612529,0.607128,0.601458,0.595923,0.590252,0.584582,0.579047,0.573512,0.568111,0.562711,0.557311,0.551775,0.546375,0.54084,0.535439,0.529904,0.524504,0.519104,0.513838,0.508573,0.503443,0.498312,0.493182,0.487917,0.482652,0.477251,0.471851,0.466316,0.460915,0.455515,0.450115,0.444849,0.439584,0.434454,0.429189,0.423923,0.418793,0.413528,0.408397,0.403267,0.398137,0.393142,0.388281,0.383421,0.378831,0.374376,0.370055,0.365735,0.361415,0.357095,0.352774,0.348184,0.343594,0.339004,0.334278,0.329688,0.325098,0.320508,0.315917,0.311462,0.307007,0.302687,0.298366,0.293911,0.289726,0.285406,0.28122,0.27717,0.27312,0.26907,0.265155,0.261239,0.257324,0.253409,0.249494,0.245443,0.241393,0.237478,0.233563,0.229648,0.225867,0.222222,0.218577,0.215067,0.211557,0.208046,0.204536,0.201026,0.197651,0.194141,0.190901,0.187525,0.184285,0.18118,0.178075,0.17524,0.172404,0.169704,0.167004,0.164439,0.161739,0.158904,0.156204,0.153368,0.150668,0.147968,0.145268,0.142568,0.140003,0.137438,0.134872,0.132307,0.129742,0.127312,0.124882,0.122587,0.120292,0.118131,0.115971,0.113946,0.111921,0.109896,0.108006,0.105981,0.104091,0.102201,0.100311,0.09842,0.096395,0.094505,0.092615,0.09086,0.08897,0.087215,0.08546,0.083705,0.08195,0.080329,0.078574,0.077089,0.075604,0.074119,0.072634,0.071284,0.069934,0.068719,0.067369,0.066154,0.065074,0.063859,0.062643,0.061428,0.060213,0.059133,0.057918,0.056838,0.055623,0.054543,0.053463,0.052383,0.051303,0.050358,0.049278,0.048198,0.047253,0.046308,0.045362,0.044417,0.043472,0.042662,0.041717,0.040772,0.039962,0.039152,0.038342,0.037397,0.036722,0.035912,0.035102,0.034427,0.033752,0.033212,0.032537,0.031997,0.031457,0.030917,0.030242,0.029702,0.029162,0.028487,0.027947,0.027407,0.026866,0.026326,0.025786,0.025381,0.024976,0.024436,0.024031,0.023626,0.023086,0.022681,0.022141,0.021736,0.021331,0.020926,0.020521,0.020116,0.019711,0.019441,0.019036,0.018766,0.018361,0.018091,0.017821,0.017416,0.017281,0.017011,0.016741,0.016471,0.016201,0.015931,0.015661,0.015391,0.015121,0.014986,0.014716,0.014446,0.014311,0.014041,0.013771,0.013636,0.013366,0.013096,0.012961,0.012691,0.012556,0.012421,0.012286,0.012151,0.012016,0.011881,0.011746,0.010801,0.010261,0.010531,0.00891,0.006075,0.00513,0.00378,0.002025,0.00108,0.000135,0]}
    };
    var FNAMES = ["U", "B", "V", "R"];
    var FCOLORS = { U: "#b43ffa", B: "#200074", V: "#24aa00", R: "#e36d00" };
    var BAR_K = { U: 101.6, B: 70.45, V: 47.7, R: 60.65 };

    function updateScale() {                       // SimpleBlackbodyClass.updateScale
      if (scaleMode !== "locked") {
        var list = scaleMode === "selected" ? [selected] : curves, maxT = 0;
        list.forEach(function (c) { if (c.temp > maxT) maxT = c.temp; });
        var wPeak = Math.min(PLOT.maxW, Math.max(PLOT.minW, WIEN / maxT));
        maxBrightness = planck(wPeak, maxT) / 0.9;
      }
      vScale = -PLOT.h / maxBrightness;
    }
    function filterData() {                        // FiltererClass.update + FilterDetailsPanelClass
      var T = selected.temp, A_ = A / Math.pow(1e-09, 5), B_ = B / (1e-09 * T), mags = {}, sums = {};
      FNAMES.forEach(function (n) {
        var f = FILTERS[n], sum = 0, lb = 0;
        for (var j = 1; j < f.t.length; j++) {
          var w = f.w0 + j, b = f.t[j] * A_ / (Math.pow(w, 5) * (Math.exp(B_ / w) - 1));
          sum += 1e-09 * (lb + (b - lb) / 2); lb = b;
        }
        mags[n] = f.offset - 2.5 * Math.log(sum) / Math.LN10;
        sums[n] = sum;
      });
      return { mags: mags, sums: sums };
    }

    /* ---------------- drawing helpers ---------------- */
    function font(ctx, size, style) { ctx.font = (style ? style + " " : "") + size + "px " + FONT; }
    var ART = {
      203: {nz:false, layers:[[[["rgba(255,255,255,0.502)","M260 -0.3L260 19.7L0 19.7L0 -0.3L260 -0.3Z"]],[]]]},
      204: {nz:false, layers:[[[],[[1.0,"#666666","M260 10L0 10L0 -10L260 -10L260 10"]]]]},
      206: {nz:false, layers:[[[["#9966ff","M5 17L5 3L30 3L30 17L5 17Z"]],[]]]},
      208: {nz:false, layers:[[[["#ff0000","M-3.55 -3.55Q-2.05 -5 0 -5Q2.1 -5 3.55 -3.55Q5 -2.1 5 0Q5 2.05 3.55 3.5Q2.1 5 0 5Q-2.05 5 -3.55 3.5Q-5 2.05 -5 0Q-5 -2.1 -3.55 -3.55Z"]],[]]]},
      210: {nz:false, layers:[[[["#e0e0e0","M260 -0.3L260 19.7L0 19.7L0 -0.3L260 -0.3Z"]],[]]]},
      213: {nz:false, layers:[[[],[[1.0,"#000000","M0 -3L0 3"]]]]},
      225: {nz:false, layers:[[[["#ffffff","M267 112L-7 112L-7 -7L267 -7L267 112Z"]],[[1.0,"#666666","M267 112L-7 112L-7 -7L267 -7L267 112"]]]]},
      244: {nz:false, layers:[[[],[[1.0,"#999999","M-82 0L82 0"]]]]},
      245: {nz:false, layers:[[[["#000000","M12.5 -100L12.5 0L-12.5 0L-12.5 -100L12.5 -100Z"]],[]]]},
      263: {nz:false, layers:[[[],[[1.0,"#000000","M154.15 218.35L160.15 218.35"]]]]},
      267: {nz:false, layers:[[[["#000000","M206.5 115.9L206.2 116.6Q205.9 116.9 205.5 116.9L204.8 116.6L204.5 115.9Q204.5 115.5 204.8 115.2Q205.1 114.9 205.5 114.9Q205.9 114.9 206.2 115.2L206.5 115.9Z"]],[[1.0,"#000000","M208.5 115.9Q208.5 117.15 207.65 118.05Q206.75 118.9 205.5 118.9Q204.25 118.9 203.35 118.05Q202.5 117.15 202.5 115.9Q202.5 114.65 203.35 113.75Q204.25 112.9 205.5 112.9Q206.75 112.9 207.65 113.75Q208.5 114.65 208.5 115.9"]]]]},
    };
    function shape(ctx, id, x, y) { ctx.save(); ctx.translate(x || 0, y || 0); SwfShape.draw(ctx, ART[id]); ctx.restore(); }
    function panel(ctx, x, y, w, h) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
    }
    function fieldText(ctx, str, x, y, size, align) {   // a TextField: baseline = top + 2 + ascent
      FlashText.fill(ctx, str, x, y + ASC * size, align || "left");
    }

    /* the plot's axes (updateHorizontalAxis / updateVerticalAxis) */
    var SI = [{ p: "", e: 0 }, { p: "m", e: -3 }, { p: "µ", e: -6 }, { p: "n", e: -9 }];
    function spacing(minimum) {
      var major = Math.pow(10, Math.ceil(Math.log(minimum) / Math.LN10)), multiple = 2;
      if (major / 2 > minimum) { major /= 2; multiple = 5; }
      return { major: major, multiple: multiple, minor: major / multiple };
    }
    function axes(ctx) {
      var xScale = PLOT.w / (PLOT.maxW - PLOT.minW), k, i, x, y;
      // _visSpectrumMC: the box gradient from 380 nm, 340 nm wide, under the axis
      var x0 = xScale * (3.8e-07 - PLOT.minW), gw = xScale * 3.4e-07;
      var g = ctx.createLinearGradient(x0, 0, x0 + gw, 0);
      [[0, "rgba(138,0,255,0)"], [62, "#5a1bff"], [73, "#1097df"], [107, "#00ffc0"], [129, "#24ff00"],
        [141, "#e9ec00"], [174, "#ff1700"], [255, "rgba(255,0,58,0)"]].forEach(function (s) { g.addColorStop(s[0] / 255, s[1]); });
      ctx.fillStyle = g; ctx.fillRect(0, 0, PLOT.w, 7);
      // x ticks and labels
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.lineCap = "round";
      var sp = spacing(45 / xScale), start = Math.ceil(PLOT.minW / sp.minor), lim = 1 + Math.floor(PLOT.maxW / sp.minor);
      ctx.beginPath();
      font(ctx, 10); ctx.fillStyle = "#000000";
      x = xScale * (sp.minor * start - PLOT.minW);
      var labels = [];
      for (i = start; i < lim; i++, x += sp.minor * xScale) {
        if (i % sp.multiple === 0) {
          ctx.moveTo(x, 0); ctx.lineTo(x, 10);
          var v = sp.minor * i, lv = Math.log(v) / Math.LN10, e = 0;
          for (k = 0; k < SI.length; k++) if (!(SI[k].e > lv)) { e = k; break; }
          if (k === SI.length) e = SI.length - 1;
          labels.push([x, v > 0 ? flashString(v / Math.pow(10, SI[e].e)) + " " + SI[e].p + "m" : "0"]);
        } else { ctx.moveTo(x, 0); ctx.lineTo(x, 7); }
      }
      ctx.moveTo(0, 0); ctx.lineTo(PLOT.w, 0);
      // y ticks
      var yScale = PLOT.h / maxBrightness, ys = spacing(30 / yScale), n = 1 + Math.floor(maxBrightness / ys.minor), ylabels = [];
      for (i = 0; i < n; i++) {
        y = -i * ys.minor * yScale;
        if (i % ys.multiple === 0) { ctx.moveTo(-10, y); ctx.lineTo(0, y); ylabels.push([y, ys.minor * i]); }
        else { ctx.moveTo(-7, y); ctx.lineTo(0, y); }
      }
      ctx.moveTo(0, 0); ctx.lineTo(0, -PLOT.h);
      ctx.stroke();
      labels.forEach(function (L) { FlashText.fill(ctx, L[1], L[0], 10 + 2.75 + ASC * 10, "center"); });
      ylabels.forEach(function (L) { yLabel(ctx, L[0], L[1]); });
    }
    var YLX = 2;                                   // measured against Ruffle
    function yLabel(ctx, y, value) {               // Default Y Tickmark Label → Simple BB Sci Not Number
      ctx.fillStyle = "#000000";
      if (value === 0) { font(ctx, 10); FlashText.fill(ctx, "0", -16.4, y + 3.81, "right"); return; }
      var p = sciParts(value, 2);
      font(ctx, 8); var twE = FlashText.textWidth(ctx, p.e);
      var x0 = -17 - (19.8 + twE) + YLX;           // the number's clip: its exponent ends 17 px left of the axis
      font(ctx, 10); var twC = FlashText.textWidth(ctx, p.c);
      FlashText.fill(ctx, p.c, x0 - 10 - twC, y + 3.21);
      FlashText.fillStatic(ctx, "× 10", x0 - 5.2, y + 3.15);
      font(ctx, 8); FlashText.fill(ctx, p.e, x0 + 19.8, y - 3.80);
    }

    /* SimpleBlackbodyCurveClass.redraw: quadratic segments from the curve's slope */
    function curvePath(T, fill) {
      var wMin = PLOT.minW, wMax = PLOT.maxW, yMin = -PLOT.h - 100, wTarget = (wMax - wMin) / 10;
      var wPeak = WIEN / T, i1 = wPeak - 1000 / T * 1.1939748395787048e-06, i2 = wPeak + 1000 / T * 1.1848609132537307e-06;
      var xScale = PLOT.w / (wMax - wMin), yScale = vScale;
      var p = new Path2D(), w = wMin, x = 0;
      function F(wv) { var e = Math.exp(B / (wv * T)) - 1, pw = Math.pow(wv, 5); return { f: A / (pw * e), d: A / (e * wv * pw) * (-5 + B * (e + 1) / (wv * T * e)) }; }
      var q = F(w), lw = w, lf = q.f, ld = q.d, initY = q.f * yScale, bt = true;
      if (initY < yMin) { initY = yMin; bt = false; }
      p.moveTo(x, initY);
      var lx = x, ly = initY, stops = [];
      [0.4 * i1, 0.7 * i1, i1, wPeak, i2, 1.5 * i2, 3.2 * i2].forEach(function (s) { if (s > wMin && s < wMax) stops.push(s); });
      stops.push(wMax);
      for (var j = 0; j < stops.length; j++) {
        var steps = Math.max(3, Math.ceil((stops[j] - w) / wTarget)), wStep = (stops[j] - w) / steps, xStep = wStep * xScale;
        for (var i = 0; i < steps; i++) {
          w += wStep; x += xStep;
          q = F(w);
          var y = q.f * yScale, cw = (q.f - lf + ld * lw - q.d * w) / (ld - q.d), cf = q.d * (cw - w) + q.f;
          var cx = xScale * (cw - wMin), cy = yScale * cf, a, b, c, ts, k0, nx;
          if (bt) {
            if (y < yMin) {
              a = ly - 2 * cy + y; b = 2 * cy - 2 * ly; c = ly - yMin;
              ts = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
              if (ts < 0 || ts > 1) ts = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
              k0 = 1 - ts; nx = k0 * k0 * lx + 2 * ts * k0 * cx + ts * ts * x;
              p.quadraticCurveTo(k0 * lx + ts * cx, k0 * ly + ts * cy, nx, yMin);
              bt = false;
            } else p.quadraticCurveTo(cx, cy, x, y);
          } else if (y > yMin) {
            a = ly - 2 * cy + y; b = 2 * cy - 2 * ly; c = ly - yMin;
            ts = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
            if (ts < 0 || ts > 1) ts = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
            k0 = 1 - ts; nx = k0 * k0 * lx + 2 * ts * k0 * cx + ts * ts * x;
            p.lineTo(nx, yMin);
            p.quadraticCurveTo(ts * x + k0 * cx, ts * y + k0 * cy, x, y);
            bt = true;
          } else p.lineTo(x, yMin);
          lx = x; ly = y; lw = w; lf = q.f; ld = q.d;
        }
      }
      if (fill) { p.lineTo(x, 0); p.lineTo(0, 0); p.lineTo(0, initY); p.closePath(); }
      return p;
    }
    function drawCurves(ctx) {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, -PLOT.h, PLOT.w, PLOT.h); ctx.clip();     // _curvesMaskMC
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      curves.forEach(function (c) {
        if (tab === "filters" && c !== selected) return;
        var sel = c === selected;
        if (sel && showArea) {
          ctx.fillStyle = c.color; ctx.globalAlpha = 0.3; ctx.fill(curvePath(c.temp, true)); ctx.globalAlpha = 1;
        }
        ctx.strokeStyle = c.color; ctx.lineWidth = sel ? 3 : 1;
        ctx.stroke(curvePath(c.temp, false));
      });
      ctx.restore();
      // the peak label rides above the mask (it lives in the curve's own clip)
      if (showPeak && selected) {
        var wPeak = WIEN / selected.temp, yl = Math.max(vScale * planck(wPeak, selected.temp), -PLOT.h - 100);
        var x = PLOT.w / (PLOT.maxW - PLOT.minW) * (wPeak - PLOT.minW);
        ctx.save(); ctx.translate(x, yl);
        shape(ctx, 213);
        font(ctx, 10); ctx.fillStyle = "#000000";
        var label = fmt("bb.peakAt", { nm: flashToFixed(1e9 * wPeak, 1) }), tw = FlashText.textWidth(ctx, label), lx;
        if (x < 3 + tw / 2) lx = 3 - x; else if (x > PLOT.w - 3 - tw / 2) lx = PLOT.w - 3 - x - tw; else lx = -tw / 2;
        FlashText.fill(ctx, label, lx, -17.5 + ASC * 10);
        ctx.restore();
      }
    }
    function drawFilters(ctx) {                    // the Filterer: each profile × the curve, 20 % alpha
      var T = selected.temp, A_ = A / Math.pow(1e-09, 5), B_ = B / (1e-09 * T);
      var xStep = PLOT.w / (PLOT.maxW * 1e9 - 25), yMin = -PLOT.h;
      FNAMES.forEach(function (n) {
        var f = FILTERS[n], x = xStep * (f.w0 - 25), sx = x, bt = true;
        ctx.beginPath(); ctx.moveTo(sx, 0);
        for (var j = 1; j < f.t.length; j++) {
          var w = f.w0 + j, y = vScale * f.t[j] * A_ / (Math.pow(w, 5) * (Math.exp(B_ / w) - 1));
          x += xStep;
          if (bt) { if (y < yMin) { ctx.lineTo(x, yMin); bt = false; } else ctx.lineTo(x, y); }
          else if (y > yMin) { ctx.lineTo(x, yMin); ctx.lineTo(x, y); bt = true; }
        }
        ctx.lineTo(sx, 0); ctx.closePath();
        ctx.globalAlpha = 0.2; ctx.fillStyle = FCOLORS[n]; ctx.fill(); ctx.globalAlpha = 1;
      });
    }

    /* the tabs (Tab Group): trapezoids 20 px tall, gap 7, margin 2, Verdana 12 */
    function tabsGeom(ctx, names, x0, y0) {
      font(ctx, 12);
      var x = x0, out = [];
      names.forEach(function (key) {
        var label = t(key), w = FlashText.width(ctx, label) + 4;   // autosized _width = text + 4
        out.push({ key: key, x: x, y: y0, w: 2 * (7 + 2) + w, lw: w, label: label });
        x += 2 * 2 + w + 7;
      });
      return out;
    }
    function drawTabs(ctx, geoms, sel) {
      // unselected first, the selected one on top
      geoms.slice().sort(function (a, b) { return (a.key === sel) - (b.key === sel); }).forEach(function (g) {
        var on = g.key === sel;
        ctx.save(); ctx.translate(g.x, g.y);
        ctx.fillStyle = "#fafafa";
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(7, -20); ctx.lineTo(7 + 4 + g.lw, -20); ctx.lineTo(g.w, 0);
        if (on) { ctx.lineTo(g.w, 3); ctx.lineTo(0, 3); }
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(7, -20); ctx.lineTo(7 + 4 + g.lw, -20); ctx.lineTo(g.w, 0);
        if (!on) ctx.closePath();
        ctx.stroke();
        font(ctx, 12); ctx.fillStyle = on ? "#000000" : "#666666";
        FlashText.fill(ctx, g.label, 11, -19 + 2 + ASC * 12, "left");
        ctx.restore();
      });
    }

    /* the curve list (Curves List / Curve List Entry) */
    var LIST = { x: 663.55, y: 267.4 };
    var hoverID = null;
    function listEntry(ctx, c, i) {
      var sel = c === selected, y = LIST.y + i * 21;
      ctx.save(); ctx.translate(LIST.x, y);
      if (sel) shape(ctx, 210);                    // frame 2: a grey band under the text
      // swatchMC (shape 208 recoloured) under its mask (shape 206)
      ctx.save(); ctx.beginPath(); ctx.rect(5, 3, 25, 14); ctx.clip();
      ctx.fillStyle = c.color; ctx.beginPath(); ctx.arc(10, 10, 5, 0, 2 * Math.PI); ctx.fill();
      ctx.restore();
      font(ctx, 12); ctx.fillStyle = "#000000";
      FlashText.fill(ctx, flashString(sigDigits(c.temp, 3)) + " K", -28.9 + 79.6, 2.75 + ASC * 12, "center");
      FlashText.fill(ctx, flashToFixed(2897768.2864295086 / c.temp, 1) + " nm", 27.6 + 85.375, 2.75 + ASC * 12, "center");
      // areaNumber (Scientific Notation Number, centred on 184.5, 3 sig figs), then "W/m²"
      var p = sciParts(SIGMA * Math.pow(c.temp, 4), 3), grey = sel ? "#000000" : "#808080";
      font(ctx, 12); var twC = FlashText.textWidth(ctx, p.c);
      font(ctx, 10); var twE = FlashText.textWidth(ctx, p.e);
      var cx = -6 - twC, width = 24.8 + twE - cx, x0 = 184.5 - width / 2 - cx + 2;   // + 2: measured against Ruffle
      ctx.fillStyle = grey;
      font(ctx, 12); FlashText.fill(ctx, p.c, x0 + cx, 21.8 - 19.05 + ASC * 12);
      FlashText.fill(ctx, "×10", x0 - 4.2, 21.8 - 19.05 + ASC * 12);
      font(ctx, 10); FlashText.fill(ctx, p.e, x0 + 24.8, 21.8 - 22.05 + ASC * 10);
      ctx.fillStyle = "#000000";
      font(ctx, 12); var ww = FlashText.fillStatic(ctx, "W/m", 223.45, 14.45);
      font(ctx, 7.8); FlashText.fillStatic(ctx, "2", 223.45 + 28.95, 10.25);
      if (!sel) shape(ctx, 203);                   // frame 1: the entry faded under a 50 % white sheet
      if (hoverID === c.id) shape(ctx, 204, 0, 9.7);
      ctx.restore();
    }

    S.onDraw(function () {
      var ctx = S.ctx;
      updateScale();
      FlashText.begin(ctx);
      ctx.save();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.translate(0, OY);
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      panel(ctx, 7.05, 37, 629, 506);
      panel(ctx, 643.05, 57, 300, 486);            // curves / filters (the scale panel's controls are in the sidebar)
      // the plot
      ctx.save(); ctx.translate(PLOT.x, PLOT.y);
      drawCurves(ctx);
      if (tab === "filters") drawFilters(ctx);
      axes(ctx);
      ctx.restore();
      // axis titles: "Flux (J/s·m²·∆λ·sr)" turned upright, "Wavelength"
      ctx.save(); ctx.transform(7.6e-05, -0.999985, 0.999985, 7.6e-05, 10.9, 327.1);
      ctx.fillStyle = "#000000";
      font(ctx, 12, "bold"); FlashText.fillStatic(ctx, t("bb.flux"), 17.15, 12);
      font(ctx, 12); FlashText.fillStatic(ctx, "  (", 17.15 + 28.5, 12);
      font(ctx, 10); FlashText.fillStatic(ctx, "J/s·m", 17.15 + 42.35, 12);
      font(ctx, 6.5); FlashText.fillStatic(ctx, "2", 17.15 + 70.05, 8.5);
      font(ctx, 10); FlashText.fillStatic(ctx, "·∆λ·sr", 17.15 + 74.2, 12);
      font(ctx, 12); FlashText.fillStatic(ctx, ")", 17.15 + 104.1, 12);
      ctx.restore();
      font(ctx, 12, "bold"); ctx.fillStyle = "#000000";
      FlashText.fillStatic(ctx, t("bb.wave"), 290 + 31.75 + 40.15, 527, "center");
      // the right-hand panel: tabs, temperature, then the list or the filter details
      tabGeom = tabsGeom(ctx, ["bb.curvesTab", "bb.filtersTab"], 653.05, 57);
      drawTabs(ctx, tabGeom, tab === "curves" ? "bb.curvesTab" : "bb.filtersTab");
      font(ctx, 12); ctx.fillStyle = "#000000";
      FlashText.fillStatic(ctx, t("bb.tempLabel"), 682.05 + 31.65 + 80.55, 52.6 + 30 + 12, "right");
      ctx.fillStyle = "#ffffff"; ctx.fillRect(803, 80.6, 51.9, 18.5);           // temperatureField (border: true)
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1 / ctx.getTransform().a; ctx.strokeRect(803, 80.6, 51.9, 18.5);
      ctx.fillStyle = "#000000";
      FlashText.fill(ctx, flashString(temperature), 828.95, 82.6 + ASC * 12, "center");
      FlashText.fillStatic(ctx, "K", 860.75, 94.6);
      if (tab === "curves") {
        shape(ctx, 225, LIST.x, LIST.y);
        font(ctx, 10); ctx.fillStyle = "#000000";
        FlashText.fillStatic(ctx, t("bb.hPeak"), LIST.x + 115.75, LIST.y - 39 + 10, "center");
        FlashText.fillStatic(ctx, t("bb.hWave"), LIST.x + 115.525, LIST.y - 39 + 24, "center");
        FlashText.fillStatic(ctx, t("bb.hArea"), LIST.x + 197.5, LIST.y - 24.95 + 10, "center");
        FlashText.fillStatic(ctx, t("bb.hTemp"), LIST.x + 47.5, LIST.y - 24.95 + 10, "center");
        curves.forEach(function (c, i) { listEntry(ctx, c, i); });
      } else filterPanel(ctx);
      ctx.restore();
    });
    var tabGeom = [];

    function filterPanel(ctx) {                    // Filter Details Panel at (638.1, 55)
      var fd = filterData(), k = 2.5 * Math.log(Math.pow(1.288659793814433, 2) / Math.pow(0.37037037037037035, 2)) / Math.LN10;
      ctx.save(); ctx.translate(638.1, 55);
      ctx.fillStyle = "#000000";
      font(ctx, 12);
      var mp = t("bb.mags").split("☉"), mx = FlashText.fillStatic(ctx, mp[0], 16.9, 116);
      FlashText.fillStatic(ctx, "   " + mp[1], 16.9 + mx, 116);
      shape(ctx, 267, 16.9 + mx + FlashText.widthStatic(ctx, "   ") / 2 - 205.5, 0);
      [["U:", 71.9, 141.45], ["B:", 72.4, 164.45], ["V:", 168.5, 141.45], ["R:", 168.3, 164.45]].forEach(function (L) {
        FlashText.fillStatic(ctx, L[0], L[1], L[2]);
      });
      [["U", 93, 129.45], ["B", 93, 152.45], ["V", 189, 129.45], ["R", 189, 152.45]].forEach(function (L) {
        FlashText.fill(ctx, flashToFixed(k + fd.mags[L[0]], 2), L[1], L[2] + ASC * 12);
      });
      font(ctx, 10); FlashText.fillStatic(ctx, t("bb.note"), -3.95 + 7.75 + 34, 186.95);
      font(ctx, 12);
      FlashText.fillStatic(ctx, t("bb.ci"), 21, 223.1);
      FlashText.fill(ctx, minuend, 106.5, 223.9);
      shape(ctx, 263);
      FlashText.fill(ctx, subtrahend, 174.55, 223.9);
      FlashText.fillStatic(ctx, "=", 87.25 + 134, 223.1);
      FlashText.fill(ctx, flashToFixed(fd.mags[minuend] - fd.mags[subtrahend], 2), 104.25 + 135.8 + 2, 211.1 + ASC * 12);
      // the bar graph (50 % alpha) and its letters
      var lines = t("bb.rel").split("\n"), lx = [39, 12, 11, 28, 4];
      lines.forEach(function (l, i) { FlashText.fillStatic(ctx, l, 18.45 + (I18N.getLang() === "en" ? lx[i] : 86 - FlashText.widthStatic(ctx, l)), 266.35 + 12 + [0, 17, 33, 50, 66][i]); });
      ctx.save(); ctx.translate(200.95, 352.7); ctx.globalAlpha = 0.5;
      shape(ctx, 244);
      var s4 = SIGMA * Math.pow(selected.temp, 4);
      [["U", -54.9, "rgb(180,63,250)"], ["B", -18.3, "rgb(32,0,116)"], ["V", 18.3, "rgb(36,170,0)"], ["R", 54.9, "rgb(227,109,0)"]].forEach(function (b) {
        var h = 32500 * (Math.PI * fd.sums[b[0]] / s4) / BAR_K[b[0]];
        ctx.fillStyle = b[2]; ctx.fillRect(b[1] - 12.5, -h, 25, h);
      });
      ctx.restore();
      [["U", 140.95], ["B", 178.3], ["V", 215.1], ["R", 251.85]].forEach(function (L) { FlashText.fillStatic(ctx, L[0], L[1], 366.6); });
      ctx.restore();
    }

    /* ---------------- the explorer's actions ---------------- */
    function addCurve() {
      if (curves.length >= 5) return;
      var c = { id: ++freeID, temp: temperature, color: COLORS[(freeID - 1) % COLORS.length] };
      curves.push(c);
      selectCurve(c);
    }
    function removeCurve() {
      if (curves.length <= 1) return;
      var i = curves.indexOf(selected);
      curves.splice(i, 1);
      selectCurve(curves[i < curves.length ? i : curves.length - 1]);
    }
    function selectCurve(c) {
      selected = c;
      temperature = c.temp;
      changed();
    }
    function setTemperature(v) { temperature = v; selected.temp = v; changed(); }

    /* ---------------- pointer: the tabs and the list ---------------- */
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY };
    }
    function hit(p) {
      for (var i = 0; i < tabGeom.length; i++) {
        var g = tabGeom[i];
        if (p.x >= g.x && p.x <= g.x + g.w && p.y >= g.y - 20 && p.y <= g.y) return { tab: g.key === "bb.curvesTab" ? "curves" : "filters" };
      }
      if (tab === "curves") for (i = 0; i < curves.length; i++) {
        var y = LIST.y + i * 21 - 0.3;
        if (p.x >= LIST.x && p.x <= LIST.x + 260 && p.y >= y && p.y <= y + 20) return { curve: curves[i] };
      }
      return null;
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var h = hit(at(ev));
      if (!h) return;
      if (h.tab) { tab = h.tab; changed(); }
      else if (h.curve) selectCurve(h.curve);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var h = hit(at(ev)), id = h && h.curve ? h.curve.id : null;
      S.canvas.style.cursor = h ? "pointer" : "default";
      if (id !== hoverID) { hoverID = id; S.requestDraw(); }
    });
    S.canvas.addEventListener("pointerleave", function () { if (hoverID !== null) { hoverID = null; S.requestDraw(); } });

    /* ---------------- the sidebar: the SWF's controls ---------------- */
    var syncing = false;
    var LOG_MIN = Math.log(3000), LOG_MAX = Math.log(25000);
    function snapTemp(v) {                         // Slider Logic, 'significant digits', 3
      v = Math.min(25000, Math.max(3000, v));
      var mag = Math.floor(Math.log(v) / Math.LN10), sig = Math.round(v * 100 / Math.pow(10, mag));
      if (!(sig < 1000)) { sig = 100; mag += 1; }
      return sig / 100 * Math.pow(10, mag);
    }
    var tabCtl = S.select({ labelKey: "bb.view", value: "curves",
      options: [{ v: "curves", labelKey: "bb.curvesTab" }, { v: "filters", labelKey: "bb.filtersTab" }],
      on: function (v) { if (!syncing) { tab = v; changed(); } } });
    S.group("bb.gCurves");
    var tempCtl = S.slider({ labelKey: "bb.temp", min: 0, max: 1, step: 0.001, value: 0,
      format: function () { return flashString(temperature) + " K"; },
      on: function (v) { if (!syncing) setTemperature(snapTemp(Math.exp(LOG_MIN + v * (LOG_MAX - LOG_MIN)))); } });
    var areaCtl = S.toggle({ labelKey: "bb.highlight", value: false, on: function (b) { if (!syncing) { showArea = b; changed(); } } });
    var peakCtl = S.toggle({ labelKey: "bb.indicate", value: false, on: function (b) { if (!syncing) { showPeak = b; changed(); } } });
    var addBtn = S.button({ labelKey: "bb.add", on: addCurve });
    var removeBtn = S.button({ labelKey: "bb.remove", on: removeCurve });
    S.group("bb.gFilters");
    var ciA = S.select({ labelKey: "bb.ciA", value: "U", options: FNAMES.map(function (n) { return { v: n, label: n }; }),
      on: function (v) { if (!syncing) { minuend = v; changed(); } } });
    var ciB = S.select({ labelKey: "bb.ciB", value: "U", options: FNAMES.map(function (n) { return { v: n, label: n }; }),
      on: function (v) { if (!syncing) { subtrahend = v; changed(); } } });
    S.group("bb.gScale");
    var scaleCtl = S.select({ labelKey: "bb.vTab", value: "all",
      options: [{ v: "locked", labelKey: "bb.lock" }, { v: "all", labelKey: "bb.all" }, { v: "selected", labelKey: "bb.sel" }],
      on: function (v) { if (!syncing) { scaleMode = v; changed(); } } });
    var limitCtl = S.slider({ labelKey: "bb.limit", min: 1000, max: 5000, step: 1, value: 1000,
      format: function () { return flashString(PLOT.maxW * 1e9) + " nm"; },
      on: function (v) {                           // hScaleSlider: linear, 2 significant digits
        if (syncing) return;
        var mag = Math.floor(Math.log(v) / Math.LN10), sig = Math.round(v * 10 / Math.pow(10, mag));
        if (!(sig < 100)) { sig = 10; mag += 1; }
        PLOT.maxW = 1e-09 * Math.min(5000, Math.max(1000, sig / 10 * Math.pow(10, mag)));
        changed();
      } });
    S.group("bb.sp");
    S.button({ labelKey: "bb.reset", on: reset });
    function syncSidebar() {
      syncing = true;
      tabCtl.set(tab);
      tempCtl.set((Math.log(temperature) - LOG_MIN) / (LOG_MAX - LOG_MIN));
      areaCtl.set(showArea); peakCtl.set(showPeak);
      addBtn.disabled = curves.length >= 5; removeBtn.disabled = curves.length <= 1;
      ciA.set(minuend); ciB.set(subtrahend); scaleCtl.set(scaleMode);
      limitCtl.set(PLOT.maxW * 1e9);
      syncing = false;
    }
    function changed() { syncSidebar(); S.requestDraw(); }

    function reset() {                             // BlackbodyExplorerClass.reset
      curves = []; freeID = 0; selected = null;
      tab = "curves"; showArea = false; showPeak = false;
      temperature = 6000; minuend = subtrahend = "U";
      PLOT.maxW = 1e-06; scaleMode = "all";
      addCurve();
    }
    reset();
  }
});
