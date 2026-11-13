/* Hertzsprung-Russell Diagram Explorer ----------------------------------------
   Rebuild of the NAAP "Hertzsprung-Russell Diagram Explorer" (hrExplorer.swf =
   hrexplorer.swf; HRDiagramExplorerClass, HR Diagram Component 043,
   StarSizeComparatorClass and HR Diagram Dot decompiled). The canvas is the
   SWF's stage below its title bar:
     • HR Diagram — the 330 × 370 plot, log T 3.3617–4.6021 (hot on the left)
       against log L −4…6, with the component's own curves: the isoradius lines
       (0.001 … 1000 R☉, green, each labelled where it meets the plot's left or
       top edge), the main sequence (its luminosity-class V fit, red), the
       nearest / brightest stars (placed from spectral type and absolute visual
       magnitude through the SWF's piecewise colour and bolometric-correction
       fits), the luminosity-class and instability-strip overlays, the scales
       (temperature, B−V or spectral type; luminosity or magnitude), and the red
       × cursor — press or drag in the plot to move it,
     • Size Comparison — the star (coloured by its temperature) beside the Sun
       at R = √L / (T/5800)², clipped by the black box when it outgrows it,
     • Cursor Properties — the temperature and luminosity, and the equation
       radius = √L / (T/T☉)² filled in.
   The sliders, check boxes, axis-scale menus and the plotted-stars choice are
   in the sidebar.                                                          */
Sim.create({
  id: "hr-diagram",
  width: 805, height: 635,
  strings: {
    en: {
      "hr.size": "Size Comparison", "hr.diagram": "HR Diagram", "hr.cursor": "Cursor Properties",
      "hr.temp": "temperature", "hr.lum": "luminosity", "hr.tempLabel": "temperature:", "hr.lumLabel": "luminosity:",
      "hr.options": "Options", "hr.plotted": "Plotted Stars", "hr.xScale": "x-axis scale", "hr.yScale": "y-axis scale",
      "hr.xTemp": "temperature", "hr.xBV": "B-V color index", "hr.xType": "spectral type",
      "hr.yLum": "luminosity", "hr.yMag": "magnitude",
      "hr.ms": "show main sequence", "hr.iso": "show isoradius lines", "hr.lc": "show luminosity classes", "hr.is": "show instability strip",
      "hr.none": "no stars", "hr.nearest": "the nearest stars", "hr.brightest": "the brightest stars",
      "hr.both": "both the nearest and brightest stars", "hr.overlap": "the overlap", "hr.reset": "reset",
      "hr.star": "star", "hr.sun": "sun", "hr.radius": "radius",
      "hr.note1": "• these values are for a star at the position of the red |x| |\ncursor shown in the HR Diagram",
      "hr.note2": "• the Size Comparison panel above shows the relative \nsize and color of such a star compared with our sun",
      "hr.tAxis": "Temperature (K)", "hr.lAxis": "Luminosity (L<sol>)", "hr.bvAxis": "B-V Color Index",
      "hr.typeAxis": "Spectral Type", "hr.magAxis": "Absolute Magnitude (M)",
      "hr.supergiants": "Supergiants (I)", "hr.giants": "Giants (III)", "hr.dwarfs": "Dwarfs (V)", "hr.wd": "White Dwarfs",
      "hr.blueGiants": "blue giants", "hr.redGiants": "red giants", "hr.redDwarfs": "red dwarfs", "hr.strip": "Instability Strip"
    },
    id: {
      "hr.size": "Perbandingan Ukuran", "hr.diagram": "Diagram HR", "hr.cursor": "Sifat Kursor",
      "hr.temp": "suhu", "hr.lum": "luminositas", "hr.tempLabel": "suhu:", "hr.lumLabel": "luminositas:",
      "hr.options": "Opsi", "hr.plotted": "Bintang yang Diplot", "hr.xScale": "skala sumbu x", "hr.yScale": "skala sumbu y",
      "hr.xTemp": "suhu", "hr.xBV": "indeks warna B-V", "hr.xType": "kelas spektrum",
      "hr.yLum": "luminositas", "hr.yMag": "magnitudo",
      "hr.ms": "tampilkan deret utama", "hr.iso": "tampilkan garis isoradius", "hr.lc": "tampilkan kelas luminositas", "hr.is": "tampilkan pita ketidakstabilan",
      "hr.none": "tanpa bintang", "hr.nearest": "bintang terdekat", "hr.brightest": "bintang tercerah",
      "hr.both": "bintang terdekat dan tercerah", "hr.overlap": "irisannya", "hr.reset": "atur ulang",
      "hr.star": "bintang", "hr.sun": "matahari", "hr.radius": "radius",
      "hr.note1": "• nilai ini untuk bintang pada posisi kursor |x| merah |\ndi Diagram HR",
      "hr.note2": "• panel Perbandingan Ukuran di atas menunjukkan ukuran \ndan warna relatif bintang itu dibanding Matahari",
      "hr.tAxis": "Suhu (K)", "hr.lAxis": "Luminositas (L<sol>)", "hr.bvAxis": "Indeks Warna B-V",
      "hr.typeAxis": "Kelas Spektrum", "hr.magAxis": "Magnitudo Mutlak (M)",
      "hr.supergiants": "Maharaksasa (I)", "hr.giants": "Raksasa (III)", "hr.dwarfs": "Katai (V)", "hr.wd": "Katai Putih",
      "hr.blueGiants": "raksasa biru", "hr.redGiants": "raksasa merah", "hr.redDwarfs": "katai merah", "hr.strip": "Pita Ketidakstabilan"
    }
  },
  about: {
    en: "<p>The <strong>H-R diagram</strong> plots stars by luminosity against temperature (hot on the left). Most stars fall on the diagonal <strong>main sequence</strong>; cool dim red dwarfs sit lower-right, hot luminous stars upper-left, with red giants above the sequence and white dwarfs below it.</p>" +
        "<p>Because L = 4πR²σT⁴, every diagonal <strong>isoradius line</strong> marks one stellar size. Press or drag in the diagram to move the red ×, or use the sliders, and read the temperature, luminosity and the resulting radius, with a Sun-sized comparison.</p>" +
        "<p>Plot <strong>the nearest stars</strong> and then <strong>the brightest stars</strong>: they barely overlap. Nearby stars are mostly faint red dwarfs; the brightest are rare, hugely luminous giants seen across great distances — a striking selection effect.</p>",
    id: "<p><strong>Diagram H-R</strong> memplot bintang berdasar luminositas terhadap suhu (panas di kiri). Sebagian besar bintang berada di diagonal <strong>deret utama</strong>; katai merah redup di kanan-bawah, bintang panas terang di kiri-atas, raksasa merah di atas deret dan katai putih di bawahnya.</p>" +
        "<p>Karena L = 4πR²σT⁴, setiap diagonal <strong>garis isoradius</strong> menandai satu ukuran bintang. Tekan atau seret di diagram untuk memindahkan tanda × merah, atau pakai penggeser, lalu baca suhu, luminositas, serta radiusnya, dengan perbandingan seukuran Matahari.</p>" +
        "<p>Plot <strong>bintang terdekat</strong> lalu <strong>bintang tercerah</strong>: hampir tak beririsan. Bintang dekat umumnya katai merah redup; yang tercerah adalah raksasa langka nan terang yang terlihat dari jarak jauh — efek seleksi yang mencolok.</p>"
  },
  build: function (S) {
    var OY = -30;                                  // the SWF's title bar is the page header here
    var FONT = "Verdana, Geneva, sans-serif", ASC = 1.0059, EM_H = 1.2159;
    function t(k) { return I18N.t(k); }
    function font(ctx, size, style) { ctx.font = (style ? style + " " : "") + size + "px " + FONT; }
    var ART = {
      211: {nz:false, layers:[[[["#000000","M160 -160L160 160L-160 160L-160 -160L160 -160Z"]],[]]]},
      212: {nz:false, layers:[[[],[[1.0,"#000000","M160 -160L160 160L-160 160L-160 -160L160 -160"]]],[[["#000000","M-119.05 147.05Q-119.05 150.75 -124.05 153.45Q-129 156.05 -136.05 156.05Q-143.1 156.05 -148.05 153.45L-148.15 153.4Q-153.05 150.75 -153.05 147.05Q-153.05 143.35 -148.05 140.7Q-143.2 138.1 -136.35 138.05L-136.05 138.05Q-129 138.05 -124.05 140.7Q-119.05 143.35 -119.05 147.05Z"]],[]]]},
      160: {nz:false, layers:[[[["#000000","M2 4Q1.2 4 0.6 3.4Q0 2.85 0 2Q0 1.2 0.6 0.6Q1.2 0 2 0Q2.85 0 3.4 0.6Q4 1.2 4 2Q4 2.85 3.4 3.4Q2.85 4 2 4Z"]],[]]]},
      249: {nz:false, layers:[[[],[[2.0,"#ff0000","M3.2 -3.15L0 0L3.2 3.2M-3.15 3.2L0 0L-3.15 -3.15"]]]]},
      22: {nz:false, layers:[[[["rgba(255,0,0,0.502)","M234.65 135.25L232.35 143.5L227.2 161.65Q224.1 172.4 216.55 175.05L214.65 175.4Q199.45 175.4 184.55 174.85Q182.95 174.8 181.9 173.2Q179.15 169.1 181.2 161.65L182.25 157.75L182.15 157.75L194 115.95Q196.55 106.9 202.9 103.4Q204.75 102.5 206.45 102.45Q220.85 102 235.1 102Q243 103.1 239.6 115.95L234.45 135.25L234.65 135.25Z"]],[]]]},
      24: {nz:false, layers:[[[["rgba(255,193,149,0.502)","M246.65 101.5L265.1 80.55Q272.25 73.55 281.75 71.35Q304.2 66 312.35 86.9Q315.3 94.6 314.1 101.5Q312.9 108.4 307.55 114.55Q289.95 134.85 275.6 157.6Q258.9 183.95 226.7 183.5Q219.7 183.4 214.65 179.25Q194.15 162.75 211.2 143.35L228.4 123.2Q237.4 112.2 246.65 101.5Z"]],[]],[[["rgba(153,188,244,0.502)","M218.9 12.3L260.3 23.2L264.55 24.3Q292.25 29.95 289.95 56.55Q289.75 58.8 287.95 59.95Q276.8 67.2 263.9 72.05Q240.45 81.05 215.75 83.05Q192 84.25 168.2 82.05Q146.3 79.7 125.15 73.6Q121.5 72.45 117.8 71.9Q97.7 69.1 77.95 64.6Q53.5 59.25 34.1 44Q22.7 35.1 21.3 21.95Q20.95 18.9 23.3 17.45Q32.35 11.65 43.6 10.5L88.35 5.9L133.25 3.4L176.5 5.05Q198 6.8 218.9 12.3Z"]],[]],[[["rgba(154,154,154,0.502)","M57.55 282.1Q61.8 281.4 66.7 282.3Q81.6 285.1 95.4 293.1Q115.85 304.25 137.65 312.95Q157.65 320.95 177 330.65L178.85 331.6Q197.1 340.3 216.25 346.9Q232 352.3 231.6 364.25Q231.5 365.45 230 365.4Q217.85 364.75 204.95 360.9Q191.45 357 178.75 350.65L177.15 349.9L146.7 336.55Q126.5 327.5 106.4 318.55Q84.25 308.75 61.5 300.4Q46.55 293.9 53.75 284Q54.95 282.35 57.55 282.1Z"],["rgba(111,219,83,0.502)","M300.2 287.05Q312.45 306 326.3 323.65Q332.15 331.15 339.1 337.5Q353.25 350.35 344.85 365L343.75 365.05Q328.25 359.55 315.3 347.6Q303.35 336.65 293.65 323.55Q284.65 311.5 277.55 298.35Q265.6 276.15 249.05 257L224.3 228.65Q213.05 215.9 201.05 204.15Q189.1 192.4 174.9 183.2Q155.65 170.55 136.8 157Q118.2 143.55 100.15 129.05Q79.25 112.4 59.35 94.55Q42.3 79.25 26 63.15Q17.85 55 9.1 47.7Q-8.5 33 -16.5 14.9Q-23.65 5.2 -10.85 4.15Q-8.75 4.4 -7.65 5.6Q7.35 21.95 24.9 36.45L61.9 66.85L97.4 95.75Q115.8 110.8 134.4 125.25Q151.95 138.9 170.2 151.4Q189.9 164.75 209.15 178.4Q229.5 192.8 245.6 212.15Q259.75 229.1 272.65 246.95Q286.95 266.6 300.2 287.05Z"]],[]]]},
      226: {nz:false, layers:[[[],[[1.5,"#000000","M119.2 1L209.35 1"]]],[[],[[1.5,"#000000","M127.8 -8.05L130.7 -4.35L134.6 -19.45L199.8 -19.45"]]]]},
      228: {nz:false, layers:[[[["#000000","M200.15 9.8Q200.95 12.15 200.95 15.15Q200.95 18.15 200.15 20.6Q199.4 22.95 198 25L196.25 25L196.25 24.95L197.45 23.2L198.5 20.95L199.25 18.3L199.55 15.15L199.25 12.05L198.5 9.35L197.45 7.1L196.25 5.45L196.25 5.4L198 5.4Q199.4 7.35 200.15 9.8ZM121.85 7.15L120.8 9.4Q120.35 10.6 120.05 12.1Q119.75 13.55 119.75 15.2Q119.75 16.85 120.05 18.35Q120.3 19.75 120.8 21Q121.25 22.2 121.85 23.25L123.05 24.9L123.05 25L121.3 25Q119.9 23 119.15 20.55Q118.35 18.2 118.35 15.2Q118.35 12.2 119.15 9.75Q119.9 7.4 121.3 5.4L123.05 5.4L123.05 5.45L121.85 7.15Z"]],[]],[[],[[1.5,"#000000","M156.25 21.25L170 8.25"]]]]},
      232: {nz:false, layers:[[[],[[1.5,"#000000","M35.9 1L93.8 1"]]],[[],[[1.5,"#000000","M46.55 -8.05L49.45 -4.35L53.35 -19.45L73.2 -19.45"]]]]},
      234: {nz:false, layers:[[[["#000000","M81.35 9.35L80.3 7.1L79.1 5.45L79.1 5.4L80.85 5.4Q82.25 7.35 83 9.8Q83.8 12.15 83.8 15.15Q83.8 18.15 83 20.6Q82.25 22.95 80.85 25L79.1 25L79.1 24.95L80.3 23.2L81.35 20.95L82.1 18.3L82.4 15.15L82.1 12.05L81.35 9.35ZM40.65 9.4Q40.2 10.6 39.9 12.1Q39.6 13.55 39.6 15.2Q39.6 16.85 39.9 18.35Q40.15 19.75 40.65 21Q41.1 22.2 41.7 23.25L42.9 24.9L42.9 25L41.15 25Q39.75 23 39 20.55Q38.2 18.2 38.2 15.2Q38.2 12.2 39 9.75Q39.75 7.4 41.15 5.4L42.9 5.4L42.9 5.45L41.7 7.15L40.65 9.4Z"]],[]],[[],[[1.5,"#000000","M50.6 21.25L64.35 8.25"]]]]},
      237: {nz:false, layers:[[[],[[0.05,"#000000","M75.7 22.3Q76.55 23.15 76.55 24.4Q76.55 25.65 75.7 26.55Q74.8 27.4 73.55 27.4Q72.3 27.4 71.45 26.55Q70.55 25.65 70.55 24.4Q70.55 23.15 71.45 22.3Q72.3 21.4 73.55 21.4Q74.8 21.4 75.7 22.3"]]],[[["#000000","M73.6 25.4Q73.2 25.4 72.9 25.1Q72.65 24.8 72.7 24.45Q72.65 24.05 72.9 23.75Q73.2 23.5 73.6 23.5L74.3 23.75L74.55 24.45L74.3 25.1L73.6 25.4Z"]],[]]]},
      240: {nz:false, layers:[[[["#000000","M14.3 5.7Q13.9 5.7 13.65 5.4Q13.35 5.15 13.4 4.75Q13.35 4.35 13.65 4.05Q13.9 3.8 14.3 3.8Q14.65 3.8 14.95 4.05L15.25 4.75L14.95 5.4L14.3 5.7Z"]],[[0.05,"#000000","M17.3 4.75Q17.3 6 16.45 6.9Q15.55 7.75 14.3 7.75Q13.05 7.75 12.2 6.9Q11.3 6 11.35 4.75Q11.3 3.5 12.2 2.65Q13.05 1.75 14.3 1.75Q15.55 1.75 16.45 2.65Q17.3 3.5 17.3 4.75"]]]]},
    };
    function shape(ctx, id, x, y, o) { ctx.save(); ctx.translate(x || 0, y || 0); SwfShape.draw(ctx, ART[id], o); ctx.restore(); }
    var LOG10 = Math.LN10;
    function log10(v) { return Math.log(v) / LOG10; }

    /* ---------------- the component's fits (HR Diagram Component 043) ---------------- */
    function cubic(c, x) { return c[0] + x * (c[1] + x * (c[2] + x * c[3])); }
    function piecewise(T, P) { return function (x) { for (var i = 0; i < T.length; i++) if (x < T[i]) return cubic(P[i], x); return cubic(P[T.length], x); }; }
    var logTempFromType = piecewise([8.5167, 16.1, 23.2167, 34.1833, 50.5108, 57.9775, 64.3942], [
      [4.7009, -0.01, 3.92e-05, -0.00014247], [4.4348, 0.08374, -0.010967, 0.000288299], [6.0516, -0.21754, 0.007746, -9.9133e-05],
      [5.0538, -0.08861, 0.0021924, -1.9396e-05], [4.7553, -0.06241, 0.0014259, -1.1922e-05], [1.1584, 0.15122, -0.0028034, 1.5988e-05],
      [26.4612, -1.15805, 0.019779, -0.000113846], [-115.7858, 5.46896, -0.0831343, 0.000418879]]);
    var BVFromLogTemp = piecewise([3.4457, 3.539, 3.5903, 3.6813, 3.7537, 3.882, 3.9637, 4.1317], [
      [5537.8004, -4932.0424, 1465.05066, -145.092852], [-11910.576, 10259.54, -2943.84429, 281.423057],
      [24799.8561, -20859.7864, 5849.40984, -546.800936], [-9106.3822, 7471.4869, -2041.57705, 185.813204],
      [218.0365, -127.1883, 22.53246, -1.085521], [1859.7977, -1439.3143, 372.09094, -32.127034],
      [-2864.907, 2211.9259, -568.46551, 48.635154], [1342.6245, -972.6493, 234.97622, -18.932059], [11.874, -6.3924, 1.11008, -0.064278]]);
    var typeFromBV = piecewise([-0.3021, -0.2623, -0.1723, -0.0825, 0.0264, 0.2766, 0.439, 0.6642, 0.8501, 1.0695, 1.3622, 1.4815, 1.5305, 1.6464, 1.9479, 2.1121], [
      [7009.7558, 69770.6118, 232162.4881, 258039.06485], [217.5991, 2326.7725, 8930.9142, 11748.54064], [29.9994, 181.1411, 750.8478, 1353.23439],
      [19.8398, 4.2475, -275.8126, -632.95316], [20.3718, 23.5866, -41.4702, 313.59799], [20.3763, 23.0727, -21.9861, 67.35311],
      [20.0065, 27.0848, -36.4924, 84.83639], [45.9759, -150.373, 367.7165, -222.06249], [-41.1478, 243.1104, -224.6559, 75.20128],
      [-19.9166, 168.1854, -136.5193, 40.64197], [6.6348, 93.7057, -66.8779, 18.93618], [-567.6877, 1358.5475, -995.4066, 246.1492],
      [5740.3207, -11415.4409, 7627.2188, -1693.98275], [-1788.0326, 3341.2138, -2014.5026, 405.92391], [-36.4698, 149.542, -75.8971, 13.42411],
      [-1255.211, 2026.574, -1039.5277, 178.32699], [-66110.1638, 94144.6344, -44653.4522, 7061.43043]]);
    var BCFromLogTemp = piecewise([3.588, 3.6978, 3.7957, 3.903, 4.1317], [
      [-1873.0763, 1364.8081, -328.11949, 25.958485], [-4208.8678, 3317.811, -872.43468, 76.5266], [-2920.8124, 2272.8215, -589.83737, 51.052264],
      [1749.5431, -1418.5107, 382.67484, -34.353217], [-2011.2742, 1472.2021, -357.96384, 28.900577], [123.5421, -77.8864, 17.20884, -1.367489]]);
    var LUM_CLASS = {
      1: piecewise([4.1476], [[44.8387, -30.1309, 7.59468, -0.636977], [-459.5864, 334.7205, -80.37116, 6.432557]]),
      2: piecewise([4.0358], [[-36.2843, 39.6781, -12.545, 1.280459], [-37.0612, 40.2556, -12.68811, 1.292279]]),
      3: piecewise([3.9092], [[-53.8721, 59.2071, -19.71611, 2.108195], [161.9073, -106.3856, 22.64341, -1.503738]]),
      4: piecewise([4.1372], [[-167.256, 125.271, -31.96691, 2.804002], [54.567, -35.5787, 6.91186, -0.328444]]),
      5: piecewise([3.5081, 3.5799, 3.728, 3.8287, 3.9156, 4.2129, 4.6015], [
        [-4686.707, 4157.5332, -1232.05177, 121.875554], [22801.9307, -19349.4898, 5468.65774, -514.806626], [-9950.2659, 8097.5483, -2198.40972, 199.100683],
        [10594.1896, -8435.0942, 2236.33537, -197.427256], [-7990.8168, 6127.2576, -1567.12652, 133.707956], [277.0365, -207.2491, 50.62412, -4.009536],
        [-280.446, 189.7309, -43.6049, 3.446011], [-9724.5727, 6346.9359, -1381.69136, 100.377185]])
    };
    function logTempFromBV(bv) { return logTempFromType(typeFromBV(bv)); }
    function logLumFromMag(M) { return (4.75 - M) / 2.51189; }
    function magFromLogLum(L) { return 4.75 - 2.51189 * L; }

    /* ---------------- the plot (diagramMC at 436.8, 441.8; 330 × 370) ---------------- */
    var PLOT = { x: 436.8, y: 441.8, w: 330, h: 370, xMin: 3.3617, xMax: 4.6021, yMin: -4, yMax: 6 };
    var XS = PLOT.w / (PLOT.xMax - PLOT.xMin), YS = -PLOT.h / (PLOT.yMax - PLOT.yMin);
    function sx(logT) { return PLOT.w - (logT - PLOT.xMin) * XS; }
    function sy(logL) { return (logL - PLOT.yMin) * YS; }
    var STARS = {
      brightAndNearbyStars: [27,2.22,21,1.47,35,2.66,42,4.38,50,5.71],
      nearbyStars: [65.5,15.53,64,13.22,66,16.55,62,10.44,65.5,15.4,66,15.85,63.5,13.07,65.5,14.79,52,6.19,61.5,9.75,64,13.51,65,15.64,65,15.58,55,7.49,57,8.31,63,11.16,63.5,11.95,61.5,10.32,63.5,13.3,55,6.89,66.5,16.98,48,5.68,65.5,15.26,64.5,14.17,63.5,11.97,67,17.22,68.5,19.42,61.5,10.87,60,8.69,63,11.76,64,13.38,68.5,19.37,64.5,13.09,68,16.17,63,11.93,63,10.35,65.5,14.97,67,14.96,64.5,14.03,63,10.89,66.5,17.32,63,11.09,65.5,15.17,66,15.72,65.5,18.46,65.5,15.4,63.5,11.81,65.5,15.51,61,10.34,65.5,16.05,57,8.16,63,10.87,63,10.2,69,20.02,64.5,12.45,51,5.92,64.5,12.68,63.5,11.7,50,5.66,55,7.51,65.5,15.47,65.5,16.33,63.5,12.71,64.5,13.59,63.5,12.14,61.5,9.79,65,12.71,64,12.32,63,11.29,68.5,19.5,61.5,9.17,50,5.88,61,9.31,64,11.92,63,10.28,68,18.67,64,12.67,55,6.9,61,9.43,63,11.2,64.5,13.37,61,10.12,43,4.58,57,8.64,63,10.44,64,12.93,64,12.31,51,6.19,51,6.2,55,7.45,53,6.41,64,12.59,45,5.35,48,4.63,64.5,13.11,66,13.51,63.5,12.37,60,8.67,57,8.76,60,9,62.5,11.57,63.5,11.25,64.5,13.39,66,17.07,64,13.73,63,10.9,63,11.32,67,18.02,65,15.76,62.5,10.67,64,11.49,67,17.75,66.5,11.58,63.5,12.69,53,6.49,64.5,13.66,65,14.72,61.5,11.01,62.5,10.9],
      brightStars: [30,-5.65,51.5,-0.3,20,0.58,45,-0.48,18,-6.78,13,-2.77,61.5,-5.11,11,-5.45,55,-0.66,61.5,-5.4,11,-3.56,50,1.07,23,1.73,22,-8.77,10.5,-3.94,10.5,-4.19,17,-0.54,12,-4.13,12,-5.06,63.5,-0.53,12,-2.74,17,-1.38,22,-0.99,10,-6.4,11,-3.79,17,-0.73,20,-0.21,9,-5.3,35,-4.53,50,-1.12,38,-6.89,19.5,-1.4,13,-0.6,53,-4.6,31,-2.75,22,-0.11,52,-3.63,20,-0.61,12,-1.82,21,0.01,21,1.07,11,-3.97,53,-1.71,52,0.47,12.5,-2.18,37,-3.61,49.5,-0.31,9.7,-1.25,10.5,-4.69,18,-0.32,50,0.7,60,-1.89,25,1.3,54,-0.87,65,-1.5,18,-0.16,23,1.91,21,-0.85,38,-6.18,54.5,-4.04,20,0.42,50,-2.01,55,-1.06,9.5,-5.04,28,-4.41,5,-5.95,53,-2.94,21,0.36,32,1.15,52.5,0.77,11.5,-3.85,11,-3.03,11.5,-2.59,10.3,-3.15,21,0.43,50,0.51,52,-4.21,11.5,-3.38,62.5,-1.53,22,0.36,20,0.39,27,1.56,15,-7.55,50,0.73,10,-3.93,19,-0.68,12,-3.62,61.5,-1.63,12.5,-2.83,24,1.32,9.5,-3.2,30,-5.43,18,-0.94,22,0.41,12,-2.84,18,-0.86,51,-0.33,20,-1.02,11,-3.46,25,1.33,17,-1.95,45,-0.52,52,0.89,25,0.25,12,-3.37,40,2.41,12,-3.34,12,-2.19,45,-0.07,53,-3.31,50,-1.75,53,-4.96,53,-2.18,53,-3.05,48,0.58,60.5,-0.86,22,1.47,23,0.87,10,-2.91,47,-0.52,52,0.76,9,-5.31,12,-3.45,23,0.61,42,-2.45,12,-2.46,42,3.43,36,1.38,40,2.64,51,0.93,10,-2.8,12,-2.24,48,0.34,45,-0.62,11,-4.57,32,2.4,53,-3.51,30,1.15,53,-1.08,27,2.5,17,-2.41,19.5,-0.74,22,1.97,63,-1.4]
    };
    function starXY(type, absVis) {               // updateObjectsByList: x from the type, y via the BC
      var logT = logTempFromType(type), BC = BCFromLogTemp(logT);
      return { x: sx(logT), y: sy(logLumFromMag(absVis + BC)) };
    }

    /* ---------------- state (HRDiagramExplorerClass) ---------------- */
    var temp = 5800, lum = 1;
    var showMS = true, showIso = true, showLC = false, showIS = false;
    var xScaleType = "logTemp", yScaleType = "logLum", group = "none";
    function snap2(v, lo, hi) {                    // Slider Logic v6: 'significant digits', 2
      v = Math.min(hi, Math.max(lo, v));
      var mag = Math.floor(log10(v)), sig = Math.round(v * 10 / Math.pow(10, mag));
      if (!(sig < 100)) { sig = 10; mag += 1; }
      return sig / 10 * Math.pow(10, mag);
    }
    function sigString(v) {                        // the slider's valueString: 2 significant digits
      var mag = Math.floor(log10(v)), d = 2 - mag - 1;
      return d > 0 ? v.toFixed(d) : String(parseFloat(v.toPrecision(15)));
    }
    function setTemp(v) { temp = snap2(v, 2300, 40000); changed(); }
    function setLum(v) { lum = snap2(v, 0.0001, 1000000); changed(); }
    function colorFromTemp(T) {                   // getColorFromTemp
      T = Math.min(40000, Math.max(1000, T));
      var l = log10(T), l2 = l * l, l3 = l * l2;
      var r = Math.min(255, Math.max(0, 22686.34111 - l * 15082.52755 + l2 * 3375.333832 - l3 * 252.4073853));
      var g = T > 6500 ? 13836.23586 - l * 9069.078214 + l2 * 2015.254756 - l3 * 149.7766966
        : -811.6499145 + l * 36.97365953 + l2 * 160.7861677 - l3 * 25.57573664;
      g = Math.min(255, Math.max(0, g));
      var b = Math.min(255, Math.max(0, -11545.34298 + l * 8529.658165 - l2 * 2150.198586 + l3 * 190.0306573));
      return "rgb(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ")";
    }
    function radius() { return Math.sqrt(lum / Math.pow(temp / 5800, 4)); }
    function radiusText(R) {                      // updateComparatorAndEquation
      var lr = log10(R);
      if (lr < 2) return R.toFixed(Math.abs(Math.ceil(lr) - 2));
      var e = Math.floor(lr), f = Math.pow(10, 2 - (1 + e));
      return String(parseFloat((Math.round(f * R) / f).toPrecision(15)));
    }

    /* ---------------- text: displayText (sub/sup runs) with the solar symbol ---------------- */
    function runs(str) {
      var out = [], re = /<(sup|sub)>(.*?)<\/\1>/g, last = 0, m;
      while ((m = re.exec(str))) { if (m.index > last) out.push([str.slice(last, m.index), 0]); out.push([m[2], m[1] === "sup" ? 1 : -1]); last = re.lastIndex; }
      if (last < str.length) out.push([str.slice(last), 0]);
      return out;
    }
    // displayText at (x, y) with hAlign/vAlign, sizeRatio for scripts, extraSpacing between runs
    function displayText(ctx, str, x, y, o) {
      var size = o.size, style = o.style || "", ratio = o.ratio || 1.5, sp = o.extra === undefined ? 0.5 : o.extra;
      var rs = runs(str), total = 0, lh = EM_H * size + 4, sh = EM_H * size / ratio + 4;
      rs.forEach(function (r) { font(ctx, r[1] ? size / ratio : size, style); r.w = FlashText.textWidth(ctx, r[0]); total += r.w; });
      total += sp * (rs.length - 1);
      var x0 = o.h === "left" ? -2 : o.h === "right" ? -2 - total : -2 - total / 2;
      var y0 = o.v === "top" ? -2 : o.v === "bottom" ? -lh + 2 : -lh / 2;
      rs.forEach(function (r) {
        var sz = r[1] ? size / ratio : size, dy = r[1] === -1 ? lh - sh : 0;
        font(ctx, sz, style);
        FlashText.fill(ctx, r[0], x + x0 + 2, y + y0 + dy + 2 + ASC * sz);
        x0 += r.w + sp;
      });
      return total;
    }
    // addTextToWrapperMC: "…<sol>…" with a ☉ drawn in; its height comes from getTextExtent('8'),
    // which Ruffle answers with the text field's height (ascent + descent + 4)
    function solText(ctx, str, x, y, size, style, symY) {
      var parts = str.split("<sol>"), cx = 0, col = ctx.fillStyle;
      var oR = Math.max(3, Math.round(size / 4)), iR = oR < 5 ? 1 : 0.3 * oR, sp = oR + 2 * iR;
      var yPos = symY === undefined ? EM_H * size + 4 - oR : symY;
      parts.forEach(function (p, i) {
        if (i > 0) {
          cx += sp;
          ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x + cx, y + yPos, oR, 0, 2 * Math.PI); ctx.stroke();
          ctx.beginPath(); ctx.arc(x + cx, y + yPos, iR, 0, 2 * Math.PI); ctx.fill();
          cx += sp;
        }
        if (p.length) cx += displayText(ctx, p, x + cx, y, { size: size, style: style, h: "left", v: "top" });
      });
      return cx;
    }

    /* ---------------- the plot's layers ---------------- */
    var SCALE_Y = { logLum: { label: "hr.lAxis", spacing: 10, multiple: 1, axisSpacing: 47 },
      absBolMag: { label: "hr.magAxis", spacing: 10, multiple: 2, axisSpacing: 40 } };
    function isoradius(ctx) {                      // updateIsoradiusLines
      var n = 100, pL = [], Tsun = 3.7634279935629364, step = (PLOT.xMax - PLOT.xMin) / n, sxStep = PLOT.w / n;
      var xP = PLOT.xMin;
      for (var i = 0; i <= n; i++, xP += step) pL[n - i] = { x: sx(xP), y: sy(4 * (xP - Tsun)) };
      var yZero = pL[0].y, yExtent = pL[n].y - yZero, yOffset = sy(0) - sy(2);
      var startLogR = Math.ceil((PLOT.yMin - 4 * (PLOT.xMax - Tsun)) / 2);
      var count = 1 + Math.floor((yExtent + PLOT.h + yZero) / yOffset - startLogR), list = [];
      for (i = 0; i < count; i++) { var r = Math.pow(10, i + startLogR); if (!(r < 0.0001) && !(r > 1000)) list.push(r); }
      ctx.strokeStyle = "#669933"; ctx.lineWidth = 1; ctx.lineCap = "round"; ctx.lineJoin = "round";
      var labels = [];
      list.forEach(function (R) {
        var yMC = -yOffset * log10(R);
        ctx.beginPath(); ctx.moveTo(pL[0].x, yMC + pL[0].y);
        for (var k = 1; k <= n; k++) ctx.lineTo(pL[k].x, yMC + pL[k].y);
        ctx.stroke();
        // the label: "1000 R☉" on an 80 % white box, at the plot's left edge or slid along the top
        var text = String(parseFloat(R.toPrecision(15))) + " R";
        font(ctx, 10); var tw = FlashText.textWidth(ctx, text), W = tw + 10.5, Hh = EM_H * 10 + 4;
        var yTop = yMC + yZero;
        if (!(yTop < 0)) return;
        var csx = 5 + W / 2, f = csx / sxStep, p = pL[Math.floor(f)], q = pL[Math.ceil(f)];
        var csy = yMC + p.y + (f * sxStep - p.x) * (q.y - p.y) / sxStep, L = null;
        if (csy > -5 - Hh / 2) L = { x: 2 + 5, y: 4 - Hh - 5 };
        else if (csy < -PLOT.h + 5 + Hh / 2) {
          csy = -PLOT.h + 5 + Hh / 2;
          for (var j = 0; j <= n; j++) if (yMC + pL[j].y > csy) {
            var a = pL[j - 1], b = pL[j], cx = a.x + (csy - yMC - a.y) * (b.x - a.x) / (b.y - a.y);
            L = cx > PLOT.w - 5 - W / 2 ? { x: 2 + PLOT.w - 5 - W, y: 2 + csy - Hh / 2 } : { x: 2 + cx - W / 2, y: 2 + csy - Hh / 2 };
            break;
          }
        } else L = { x: 2 + 5, y: 2 + csy - Hh / 2 };
        if (L) labels.push({ x: L.x, y: L.y, text: text, W: W, H: Hh });
      });
      labels.forEach(function (L) {
        ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.fillRect(L.x, L.y, L.W, L.H - 4);
        ctx.strokeStyle = "#000000"; ctx.lineWidth = 1 / ctx.getTransform().a;    // Ruffle outlines lineStyle(undefined)
        ctx.strokeRect(L.x, L.y, L.W, L.H - 4);
        ctx.fillStyle = "#669933";
        solText(ctx, L.text + "<sol>", L.x, L.y, 10);
      });
    }
    function mainSequence(ctx) {                   // updateLuminosityClassLines, class V only
      var n = 100, step = (PLOT.xMax - PLOT.xMin) / n, xP = PLOT.xMin;
      ctx.strokeStyle = "#ff6666"; ctx.lineWidth = 1; ctx.beginPath();
      ctx.moveTo(sx(xP), sy(LUM_CLASS[5](xP)));
      for (var i = 0; i < n; i++) {
        xP += step;
        var X = sx(xP), Y = sy(LUM_CLASS[5](xP));
        if (xP < 3.359) ctx.moveTo(X, Y); else if (xP < 4.701) ctx.lineTo(X, Y);
      }
      ctx.stroke();
    }
    function dots(ctx) {                           // the three star layers, per the plotted-stars choice
      var show = { none: [], brightest: ["bright", "both"], nearest: ["near", "both"], overlap: ["both"], all: ["bright", "near", "both"] }[group === "both" ? "all" : group];
      var bothStyle = group === "brightest" ? ["#6060ff", 3] : group === "nearest" ? ["#409040", 3] : ["#ff0000", 4];
      var styles = { bright: ["#6060ff", 3], near: ["#409040", 3], both: bothStyle };
      var lists = { bright: STARS.brightStars, near: STARS.nearbyStars, both: STARS.brightAndNearbyStars };
      show.forEach(function (k) {
        var L = lists[k], st = styles[k];
        ctx.fillStyle = st[0];
        for (var i = 0; i < L.length; i += 2) {
          var p = starXY(L[i], L[i + 1]);
          ctx.beginPath(); ctx.arc(p.x, p.y, st[1] / 2, 0, 2 * Math.PI); ctx.fill();
        }
      });
    }
    function overlays(ctx) {                       // the art sits at the plot's top-left corner (log T 4.6021, log L 6)
      ctx.save(); ctx.translate(0, -PLOT.h);
      if (showLC) {
        shape(ctx, 24);
        [["hr.supergiants", 117.5, 55, "#164ea9", 12, "bold"], ["hr.giants", 240, 123.45, "#b44401", 12, "bold"],
          ["hr.dwarfs", 51.5, 92.95, "#3a8c1e", 12, "bold"], ["hr.wd", 53, 337.45, "#666666", 12, "bold"],
          ["hr.blueGiants", 60, 19.5, "#000000", 10, "italic"], ["hr.redGiants", 259, 93.5, "#000000", 10, "italic"],
          ["hr.redDwarfs", 266.5, 290, "#000000", 10, "italic"]].forEach(function (L) {
          font(ctx, L[4], L[5]); ctx.fillStyle = L[3]; FlashText.fillStatic(ctx, t(L[0]), L[1], L[2] + L[4]);
        });
      }
      if (showIS) {
        shape(ctx, 22);
        font(ctx, 10, "bold"); ctx.fillStyle = "#c20101"; FlashText.fillStatic(ctx, t("hr.strip"), 167, 98);
      }
      ctx.restore();
    }
    function scales(ctx) {
      ctx.strokeStyle = "#000000"; ctx.fillStyle = "#000000"; ctx.lineWidth = 1; ctx.lineCap = "round";
      // left: drawYScale
      var Y = SCALE_Y[yScaleType], getY, zMin, zMax, minor;
      if (yScaleType === "logLum") { getY = function (z) { return sy(z); }; zMin = PLOT.yMin; zMax = PLOT.yMax; minor = [2, 3, 4, 5, 6, 7, 8, 9].map(log10); }
      else { getY = function (z) { return sy(logLumFromMag(z)); }; zMin = magFromLogLum(PLOT.yMax); zMax = magFromLogLum(PLOT.yMin); minor = [0.5]; }
      ctx.beginPath();
      var labelsY = [];
      for (var z = Math.floor(zMin); z <= Math.ceil(zMax); z++) {
        var y = getY(z);
        if (!(y > 0) && !(y < -PLOT.h)) { ctx.moveTo(0, y); ctx.lineTo(-7, y); if (z % Y.multiple === 0) labelsY.push([z, y]); }
        minor.forEach(function (m) { var my = getY(z + m); if (!(my > 0) && !(my < -PLOT.h)) { ctx.moveTo(0, my); ctx.lineTo(-3, my); } });
      }
      ctx.stroke();
      labelsY.forEach(function (L) {
        displayText(ctx, yScaleType === "logLum" ? "10<sup>" + L[0] + "</sup>" : String(L[0]), -Y.spacing, L[1], { size: 12, h: "right", v: "center", ratio: 1.2, extra: 2 });
      });
      // the rotated axis label
      ctx.save();
      font(ctx, 12, "bold");
      var label = t(Y.label), lw = 0, parts = label.split("<sol>");
      parts.forEach(function (p, i) { lw += FlashText.textWidth(ctx, p) + (i ? 10 : 0); });
      var W = lw + 4, Hh = EM_H * 12 + 4;
      ctx.translate(-Y.axisSpacing - Hh / 2, (-PLOT.h + W) / 2); ctx.rotate(-Math.PI / 2);
      solText(ctx, label, 0, 0, 12, "bold");
      ctx.restore();
      // bottom: the temperature, B−V or spectral-type scale (the axis itself stays log T)
      ctx.beginPath();
      font(ctx, 12);
      if (xScaleType === "logTemp") {
        ["2300", "5000", "10000", "20000", "40000"].forEach(function (s) {
          var x = sx(log10(parseFloat(s)));
          if (x < 0 || x > PLOT.w) return;
          ctx.moveTo(x, 0); ctx.lineTo(x, 6);
          FlashText.fill(ctx, s, FlashText.int(x), 5 + 2 + ASC * 12, "center");
        });
      } else if (xScaleType === "BV") {
        var bvX = function (bv) { return PLOT.w - (logTempFromBV(bv) - PLOT.xMin) * XS; };
        var nS = Math.ceil(BVFromLogTemp(PLOT.xMax) / 0.1), nE = Math.floor(BVFromLogTemp(PLOT.xMin) / 0.1);
        for (var k = nS; k <= nE; k++) {
          var bx = bvX(k * 0.1);
          if (bx < 0 || bx > PLOT.w) continue;
          ctx.moveTo(bx, 0); ctx.lineTo(bx, k % 5 === 0 ? 6 : 4);
        }
        ["-0.3", "-0.2", "0.0", "0.5", "1.0", "1.5", "2.0"].forEach(function (s) {
          var x = bvX(parseFloat(s)); if (x < 0 || x > PLOT.w) return;
          FlashText.fill(ctx, s, FlashText.int(x), 5 + 2 + ASC * 12, "center");
        });
      } else {
        var tX = function (s) { return PLOT.w - (logTempFromType(s) - PLOT.xMin) * XS; }, prev = null, mids = [];
        for (var s = 0; s <= 70; s += 10) {
          var tx = tX(s);
          if (!(tx < 0) && !(tx > PLOT.w)) { ctx.moveTo(tx, 0); ctx.lineTo(tx, 5); }
          if (s > 0) mids.push(prev + (tx - prev) / 2);
          prev = tx;
        }
        ["O", "B", "A", "F", "G", "K", "M"].forEach(function (L, i) {
          var x = mids[i]; if (x == null || x < 0 || x > PLOT.w) return;
          FlashText.fill(ctx, L, FlashText.int(x), 2 + 2 + ASC * 12, "center");
        });
      }
      ctx.stroke();
      font(ctx, 12, "bold");
      var xl = xScaleType === "logTemp" ? [t("hr.tAxis"), 23] : xScaleType === "BV" ? [t("hr.bvAxis"), 23] : [t("hr.typeAxis"), 20];
      if (xScaleType === "BV") {                    // "B" and "V" in italic bold
        var str = xl[0], wsum = 0, segs = [[str.slice(0, 1), "italic bold"], [str.slice(1, 2), "bold"], [str.slice(2, 3), "italic bold"], [str.slice(3), "bold"]];
        segs.forEach(function (sg) { font(ctx, 12, sg[1]); wsum += FlashText.width(ctx, sg[0]); });
        var x0 = PLOT.w / 2 - wsum / 2;
        segs.forEach(function (sg) { font(ctx, 12, sg[1]); x0 += FlashText.fill(ctx, sg[0], x0, xl[1] + 2 + ASC * 12); });
      } else FlashText.fill(ctx, xl[0], PLOT.w / 2, xl[1] + 2 + ASC * 12, "center");
    }

    /* ---------------- panels, the comparator and the equation ---------------- */
    function panel(ctx, x, y, w, h, title) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(x, y, w, h);
      font(ctx, 14); ctx.fillStyle = "#333333";
      FlashText.fill(ctx, title, x + 5, y + 4 + ASC * 14);
      ctx.strokeStyle = "#cccccc"; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x + 10 + FlashText.textWidth(ctx, title), y + 14.44); ctx.lineTo(x + w - 5, y + 14.44); ctx.stroke();
      ctx.lineCap = "butt";
    }
    function starShape(ctx, r, color, margin) {    // drawStarShape: a circle from x 0 to 2r, or the arc of a giant
      ctx.fillStyle = color; ctx.beginPath();
      if (!(r > margin)) {
        var n = 10, st = 2 * Math.PI / n, h = st / 2, cr = r / Math.cos(h), a = st, c = h;
        ctx.moveTo(2 * r, 0);
        for (var i = 0; i < n; i++, a += st, c += st) ctx.quadraticCurveTo(r + cr * Math.cos(c), cr * Math.sin(c), r + r * Math.cos(a), r * Math.sin(a));
      } else {
        var m = margin, th = Math.atan(m / (r - m)), n2 = 5, s2 = 2 * th / n2, h2 = s2 / 2, cr2 = r / Math.cos(h2);
        var aa = Math.PI - th + s2, cc = Math.PI - th + h2;
        ctx.moveTo(m, m); ctx.lineTo(m, -m); ctx.lineTo(r - r * Math.cos(th), -r * Math.sin(th));
        for (var j = 0; j < n2; j++, aa += s2, cc += s2) ctx.quadraticCurveTo(r + cr2 * Math.cos(cc), -cr2 * Math.sin(cc), r + r * Math.cos(aa), -r * Math.sin(aa));
        ctx.lineTo(m, m);
      }
      ctx.fill();
    }
    function comparator(ctx) {                     // Star Size Comparator at (179, 227)
      ctx.save(); ctx.translate(179, 227);
      shape(ctx, 211);
      var W = 321, margin = 1.1 * W / 2, rmax = (W - 30) / 4;
      ctx.save(); ctx.beginPath(); ctx.rect(-160.5, -160.5, 321, 321); ctx.clip();
      ctx.save(); ctx.translate(5, 0); starShape(ctx, rmax, "#fff0e5", margin); ctx.restore();
      ctx.save(); ctx.translate(-5, 0); ctx.rotate(Math.PI); starShape(ctx, Math.max(1.2, rmax * radius()), colorFromTemp(temp), margin); ctx.restore();
      ctx.restore();
      shape(ctx, 212);
      ctx.font = "14px Arial, Helvetica, sans-serif"; ctx.fillStyle = "#ffffff";
      FlashText.fillStatic(ctx, t("hr.star"), -268.55 + 120.45, 138.3 + 13);
      FlashText.fillStatic(ctx, t("hr.sun"), 4.2 + 121.2, 138.35 + 13);
      ctx.restore();
    }
    function sliderField(ctx, x, y, label, value, units) {   // a Standard Slider v6's label, field and units
      font(ctx, 12); ctx.fillStyle = "#000000";
      var base = y - (EM_H * 12 + 4) / 2 + 2 + ASC * 12;
      FlashText.fill(ctx, label, x - 9.8 - FlashText.textWidth(ctx, label), base);
      ctx.beginPath(); ctx.roundRect(x - 4.8, y - 10.5, 69.6, 21, 4.8); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - 3.8, y - 9.5, 67.6, 19, 3.8); ctx.fillStyle = "#ffffff"; ctx.fill();
      ctx.fillStyle = "#000000";
      FlashText.fill(ctx, value, x + 30, y - 9.5 + 2 + ASC * 12, "center");
      solText(ctx, units, x + 5 + 60 + 4.8, y - (EM_H * 12 + 4) / 2 + 2, 12, "", EM_H * 12 + 4 - 5);
    }
    function equation(ctx) {                       // equationMC at (42, 541.95)
      ctx.save(); ctx.translate(42, 541.95);
      font(ctx, 12); ctx.fillStyle = "#000000";
      FlashText.fillStatic(ctx, t("hr.radius"), -61.65 + 39.1, -7.25 + 12);
      [-47.75, 34.45, 151.2].forEach(function (x) { FlashText.fillStatic(ctx, "=", x + 67, -7.25 + 12); });
      shape(ctx, 232); shape(ctx, 234); shape(ctx, 237); shape(ctx, 226); shape(ctx, 228);
      FlashText.fillStatic(ctx, "L", 6.2 + 52.8, -17.3 + 12);
      FlashText.fillStatic(ctx, "T", 41.6 + 5, 2.2 + 12);
      FlashText.fillStatic(ctx, "T", -5.05 + 68.2, 12.7 + 12);
      font(ctx, 9); FlashText.fillStatic(ctx, "2", 15.95 + 68.9, 1.2 + 9); FlashText.fillStatic(ctx, "2", 133.1 + 68.9, 1.2 + 9);
      font(ctx, 12);
      FlashText.fillStatic(ctx, "5800", 107.85 + 56.6, 12.7 + 12);
      FlashText.fill(ctx, sigString(lum), 87.45 + 79.6, -17.3 + ASC * 12, "center");
      FlashText.fill(ctx, sigString(temp), 124 + 19.375, 2.2 + ASC * 12, "center");
      var rt = radiusText(radius()), rw = FlashText.fill(ctx, rt, 233.5, -6.55 + ASC * 12);
      var rx = 233.5 + Math.floor(rw) + 5;          // RsunMC._x = radiusField._x + textWidth + 5
      FlashText.fillStatic(ctx, "R", rx - 65.75 + 67.75, -7.25 + 12);
      shape(ctx, 240, rx, 0);
      ctx.restore();
      // the two notes
      font(ctx, 11, "italic"); ctx.fillStyle = "#000000";
      var n1 = t("hr.note1").split("\n"), n2 = t("hr.note2").split("\n");
      var p1 = n1[0].split("|");                    // "…the red " + upright "x" + " "
      var x1 = 22 + FlashText.fillStatic(ctx, p1[0], 22, 583.9 + 11);
      if (p1.length > 1) { font(ctx, 11); x1 += FlashText.fillStatic(ctx, p1[1], x1, 583.9 + 11); font(ctx, 11, "italic"); FlashText.fillStatic(ctx, p1[2], x1, 583.9 + 11); }
      FlashText.fillStatic(ctx, n1[1], 22, 583.9 + 26);
      FlashText.fillStatic(ctx, n2[0], 22, 619.95 + 11);
      FlashText.fillStatic(ctx, n2[1], 22, 619.95 + 26);
    }

    S.onDraw(function () {
      var ctx = S.ctx;
      FlashText.begin(ctx);
      ctx.save();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.translate(0, OY);
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      panel(ctx, 7, 37, 344, 362, t("hr.size"));
      panel(ctx, 358, 37, 440, 621, t("hr.diagram"));
      panel(ctx, 7, 406, 344, 252, t("hr.cursor"));
      comparator(ctx);
      sliderField(ctx, 108.8, 451.8, t("hr.tempLabel"), sigString(temp), "K");
      sliderField(ctx, 108.8, 490.8, t("hr.lumLabel"), sigString(lum), "L<sol>");
      equation(ctx);
      // the HR diagram component
      ctx.save(); ctx.translate(PLOT.x, PLOT.y);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, -PLOT.h, PLOT.w, PLOT.h);
      ctx.save(); ctx.beginPath(); ctx.rect(0, -PLOT.h, PLOT.w, PLOT.h); ctx.clip();
      overlays(ctx);
      if (showIso) isoradius(ctx);
      if (showMS) mainSequence(ctx);
      dots(ctx);
      ctx.restore();
      scales(ctx);
      ctx.strokeStyle = "#000000"; ctx.lineWidth = 1; ctx.strokeRect(0, -PLOT.h, PLOT.w, PLOT.h);
      // the red × cursor (crossMC)
      var cx = sx(log10(temp)), cy = sy(log10(lum));
      shape(ctx, 249, cx, cy);
      ctx.restore();
      ctx.restore();
    });

    /* ---------------- pressing / dragging in the plot (diagramMC.onPress → onMouseMoveFunc) ---------------- */
    var drag = false;
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY };
    }
    function inPlot(p) { return p.x >= PLOT.x && p.x <= PLOT.x + PLOT.w && p.y <= PLOT.y && p.y >= PLOT.y - PLOT.h; }
    function moveTo(p) {
      var x = Math.min(PLOT.w, Math.max(0, p.x - PLOT.x)), y = Math.min(0, Math.max(-PLOT.h, p.y - PLOT.y));
      var logT = PLOT.xMin + (PLOT.w - x) / XS, logL = PLOT.yMin + y / YS;
      temp = snap2(Math.pow(10, logT), 2300, 40000); lum = snap2(Math.pow(10, logL), 0.0001, 1000000);
      changed();
    }
    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev);
      if (!inPlot(p)) return;
      ev.preventDefault();
      try { S.canvas.setPointerCapture(ev.pointerId); } catch (e) {}
      drag = true; moveTo(p);
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (drag) moveTo(p); else S.canvas.style.cursor = inPlot(p) ? "crosshair" : "default";
    });
    function release() { drag = false; }
    S.canvas.addEventListener("pointerup", release);
    S.canvas.addEventListener("pointercancel", release);

    /* ---------------- the sidebar ---------------- */
    var syncing = false;
    S.group("hr.cursor");
    var LT0 = log10(2300), LT1 = log10(40000);
    var tempCtl = S.slider({ labelKey: "hr.temp", min: LT0, max: LT1, step: 0.0005, value: log10(temp),
      format: function () { return sigString(temp) + " K"; }, on: function (v) { if (!syncing) setTemp(Math.pow(10, v)); } });
    var lumCtl = S.slider({ labelKey: "hr.lum", min: -4, max: 6, step: 0.002, value: 0,
      format: function () { return sigString(lum) + " L☉"; }, on: function (v) { if (!syncing) setLum(Math.pow(10, v)); } });
    S.group("hr.options");
    var xCtl = S.select({ labelKey: "hr.xScale", value: "logTemp", options: [{ v: "logTemp", labelKey: "hr.xTemp" }, { v: "BV", labelKey: "hr.xBV" }, { v: "type", labelKey: "hr.xType" }],
      on: function (v) { if (!syncing) { xScaleType = v; changed(); } } });
    var yCtl = S.select({ labelKey: "hr.yScale", value: "logLum", options: [{ v: "logLum", labelKey: "hr.yLum" }, { v: "absBolMag", labelKey: "hr.yMag" }],
      on: function (v) { if (!syncing) { yScaleType = v; changed(); } } });
    var msCtl = S.toggle({ labelKey: "hr.ms", value: true, on: function (b) { if (!syncing) { showMS = b; changed(); } } });
    var isoCtl = S.toggle({ labelKey: "hr.iso", value: true, on: function (b) { if (!syncing) { showIso = b; changed(); } } });
    var lcCtl = S.toggle({ labelKey: "hr.lc", value: false, on: function (b) { if (!syncing) { showLC = b; changed(); } } });
    var isCtl = S.toggle({ labelKey: "hr.is", value: false, on: function (b) { if (!syncing) { showIS = b; changed(); } } });
    var groupCtl = S.select({ labelKey: "hr.plotted", value: "none",
      options: [{ v: "none", labelKey: "hr.none" }, { v: "nearest", labelKey: "hr.nearest" }, { v: "brightest", labelKey: "hr.brightest" },
        { v: "both", labelKey: "hr.both" }, { v: "overlap", labelKey: "hr.overlap" }],
      on: function (v) { if (!syncing) { group = v; changed(); } } });
    S.button({ labelKey: "hr.reset", on: reset });
    function syncSidebar() {
      syncing = true;
      tempCtl.set(log10(temp)); lumCtl.set(log10(lum));
      xCtl.set(xScaleType); yCtl.set(yScaleType);
      msCtl.set(showMS); isoCtl.set(showIso); lcCtl.set(showLC); isCtl.set(showIS); groupCtl.set(group);
      syncing = false;
    }
    function changed() { syncSidebar(); S.requestDraw(); }
    function reset() {                             // HRDiagramExplorerClass.onReset
      xScaleType = "logTemp"; yScaleType = "logLum";
      showMS = true; showLC = false; showIso = true; showIS = false; group = "none";
      temp = 5800; lum = 1;
      changed();
    }
    reset();
  }
});
