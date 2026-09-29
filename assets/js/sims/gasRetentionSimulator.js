/* Gas Retention Simulator ----------------------------------------------------------
   Faithful rebuild of NAAP's "gasRetentionSimulator.swf" (Atmospheric Retention
   module), from its decompiled ActionScript: GasRetentionSimulatorClass, the Thermal
   Gas Component (ThermalGasComponentClass + TGCGasClass), the Maxwell Plot Component
   and its cursor overlay, the Proportions Adjuster and the Gas List — laid out on the
   SWF's Flash MX push buttons, check boxes and combo box and NAAP's Standard Slider
   v6, all redrawn here from their skins and drawing code.

   Up to three gases share the chamber at one temperature, 160 tracer particles each
   at full strength. A particle's speed is u·a with a = √(kT/m) and u drawn from the
   SWF's own rational-function fit to the inverse Maxwell–Boltzmann distribution;
   the walls reflect, and every particle fades in, holds and fades out over a 15 s
   life before it is dealt a new place and speed. While the simulation runs, each
   frame re-deals a random 0.1 · (Σ amounts / 3) · √(T / 1000) of the particles —
   pseudo-collisions that keep every gas thermal (scaled here from the SWF's 20 fps
   to the display's frame rate).

   With escape allowed, a particle faster than the escape speed that reaches a wall
   flies on and fades out over 65 px, and every gas drains as
   amount₀ · exp(−f_esc · t[s]), where f_esc is the share of its distribution above
   v_esc: 1 − erf(v/√2a) + √(2/π)(v/a)e^(−v²/2a²) (erf from the SWF's Numerical-
   Recipes incomplete gamma). The plot draws each curve the SWF's way — quadratic
   Béziers through the inflection points and the mode — on a y scale fixed by the
   peaks the chosen gases would reach at 100 K, so warming the chamber visibly
   flattens every curve.

   The SWF's title bar is left out: its reset and about live in the page. The value
   boxes of the two sliders are real inputs laid over the canvas, as editable as the
   SWF's. Beyond the SWF: with the cursor shown, pressing anywhere in the plot moves
   it there; "remove selected gas" is disabled when nothing is selected (the SWF
   leaves it enabled after the last gas goes, doing nothing).                     */
Sim.create({
  id: "gasRetentionSimulator",
  width: 900, height: 620,
  strings: {
    en: {
      "gr.chamber": "Chamber", "gr.props": "Chamber Properties", "gr.plot": "Distribution Plot",
      "gr.gases": "Gases",
      "gr.temp": "temperature", "gr.tempLabel": "temperature:", "gr.escape": "escape speed",
      "gr.escLabel": "escape speed:", "gr.escLine": "escape speed", "gr.K": "K", "gr.ms": "m/s",
      "gr.allowEscape": "allow escape from chamber", "gr.start": "start simulation",
      "gr.stop": "stop simulation", "gr.addGas": "add a gas", "gr.select": "select gas to add",
      "gr.limit": "(limit reached)", "gr.remove": "remove selected gas",
      "gr.resetProps": "reset proportions", "gr.cursor": "show draggable cursor",
      "gr.info": "show distribution info for selected gas", "gr.reset": "Reset",
      "gr.yAxis": "Relative Number Of Particles", "gr.xAxis": "Molecular Speed (m/s)",
      "gr.of": "of", "gr.moves": "moves", "gr.slower": "slower", "gr.faster": "faster",
      "gr.hint": "Drag a bar in the Gases panel to change how much of that gas the chamber holds, and click a gas in the list to select it. The boxes beside the sliders take typed values too.",
      "gr.g.hydrogen": "hydrogen", "gr.g.helium": "helium", "gr.g.methane": "methane",
      "gr.g.ammonia": "ammonia", "gr.g.water": "water", "gr.g.nitrogen": "nitrogen",
      "gr.g.oxygen": "oxygen", "gr.g.carbonDioxide": "carbon dioxide", "gr.g.xenon": "xenon"
    },
    id: {
      "gr.chamber": "Wadah", "gr.props": "Sifat Wadah", "gr.plot": "Grafik Sebaran",
      "gr.gases": "Gas",
      "gr.temp": "suhu", "gr.tempLabel": "suhu:", "gr.escape": "kelajuan lepas",
      "gr.escLabel": "kelajuan lepas:", "gr.escLine": "kelajuan lepas", "gr.K": "K", "gr.ms": "m/d",
      "gr.allowEscape": "izinkan lolos dari wadah", "gr.start": "mulai simulasi",
      "gr.stop": "hentikan simulasi", "gr.addGas": "tambah gas", "gr.select": "tambahkan gas",
      "gr.limit": "(batas tercapai)", "gr.remove": "hapus gas terpilih",
      "gr.resetProps": "atur ulang proporsi", "gr.cursor": "tampilkan kursor seret",
      "gr.info": "tampilkan info sebaran gas terpilih", "gr.reset": "Atur ulang",
      "gr.yAxis": "Jumlah Relatif Partikel", "gr.xAxis": "Kelajuan Molekul (m/d)",
      "gr.of": "dari", "gr.moves": "bergerak", "gr.slower": "lebih lambat", "gr.faster": "lebih cepat",
      "gr.hint": "Seret batang di panel Gas untuk mengubah banyaknya gas itu di dalam wadah, dan klik sebuah gas pada daftar untuk memilihnya. Kotak di samping penggeser juga dapat diketik.",
      "gr.g.hydrogen": "hidrogen", "gr.g.helium": "helium", "gr.g.methane": "metana",
      "gr.g.ammonia": "amonia", "gr.g.water": "air", "gr.g.nitrogen": "nitrogen",
      "gr.g.oxygen": "oksigen", "gr.g.carbonDioxide": "karbon dioksida", "gr.g.xenon": "xenon"
    }
  },
  about: {
    en: "<p>Why do some worlds keep their air while others lose it? This chamber is a small model of the answer. It holds up to three gases at one temperature, each drawn as tracer particles — every dot stands for a great many molecules. At a given temperature all the gases share the same average kinetic energy, so the light molecules must move faster: at 300 K hydrogen averages about 1.8 km/s, xenon only 0.2 km/s.</p>" +
        "<p>The plot shows each gas's <b>Maxwell–Boltzmann distribution</b> of speeds, f(v) ∝ v² e<sup>−v²/2a²</sup> with a = √(kT/m). It peaks at √2·a and trails off in a long tail of unusually fast molecules. Heat the chamber and every curve flattens and stretches to the right; heavy gases stay bunched at low speeds. Turn on the draggable cursor to read what share of the selected gas moves slower or faster than any speed you choose.</p>" +
        "<p>Tick <b>allow escape from chamber</b> and start the simulation, and the walls behave like the top of an atmosphere: a molecule faster than the escape speed (the dashed line) that reaches a wall is gone for good. Each gas drains at a rate set by the share of its distribution beyond that line, so a light gas can vanish in seconds while a heavy one is barely touched. Planets play the same game over billions of years, which is why small, warm worlds lose their hydrogen and helium first, and why a planet holds on to a gas only if its escape speed is several times the gas's typical molecular speed.</p>" +
        "<p>The simulator ignores phase changes: its particles stay gaseous whatever the temperature or pressure.</p>",
    id: "<p>Mengapa sebagian dunia mampu mempertahankan udaranya sementara yang lain kehilangannya? Wadah ini adalah model kecil jawabannya. Wadah menampung hingga tiga gas pada satu suhu, masing-masing digambarkan sebagai partikel pelacak — setiap titik mewakili sangat banyak molekul. Pada suhu tertentu semua gas memiliki energi kinetik rata-rata yang sama, sehingga molekul yang ringan harus bergerak lebih cepat: pada 300 K hidrogen rata-rata bergerak sekitar 1,8 km/d, xenon hanya 0,2 km/d.</p>" +
        "<p>Grafik menunjukkan <b>sebaran Maxwell–Boltzmann</b> kelajuan setiap gas, f(v) ∝ v² e<sup>−v²/2a²</sup> dengan a = √(kT/m). Puncaknya berada di √2·a dan ekornya memanjang berisi molekul yang luar biasa cepat. Panaskan wadah dan setiap kurva menjadi lebih landai serta melebar ke kanan; gas berat tetap berkumpul pada kelajuan rendah. Nyalakan kursor seret untuk membaca berapa bagian gas terpilih yang bergerak lebih lambat atau lebih cepat daripada kelajuan yang Anda pilih.</p>" +
        "<p>Centang <b>izinkan lolos dari wadah</b> lalu mulai simulasi, dan dinding wadah berperilaku seperti puncak atmosfer: molekul yang lebih cepat daripada kelajuan lepas (garis putus-putus) dan mencapai dinding akan hilang selamanya. Setiap gas terkuras dengan laju yang ditentukan oleh bagian sebarannya di luar garis itu, sehingga gas ringan dapat lenyap dalam hitungan detik sementara gas berat nyaris tak tersentuh. Planet menjalani hal yang sama selama miliaran tahun; itulah sebabnya dunia yang kecil dan hangat lebih dulu kehilangan hidrogen dan heliumnya, dan sebuah planet hanya dapat mempertahankan suatu gas bila kelajuan lepasnya beberapa kali lipat kelajuan khas molekul gas tersebut.</p>" +
        "<p>Simulator ini mengabaikan perubahan wujud: partikelnya tetap berupa gas pada suhu dan tekanan berapa pun.</p>"
  },
  build: function (S) {
    var TAU = Math.PI * 2;
    var OY = -30;                                   // the SWF's title bar is the page header here
    var FONT = "Verdana, Geneva, sans-serif";
    var ASC = 1.0059, EM_H = 1.2159;               // Verdana ascent, ascent + descent (em)
    var TB = -0.2;                                  // where Ruffle puts a TextField's baseline vs Flash

    /* ---- the SWF's numbers ---- */
    var K_B = 1.3806503e-23, AMU = 1.66053886e-27, R_KMOL = 8314.47147;
    var GAS_LIMIT = 3, N_PER_GAS = 160;             // gasLimit, numParticlesMultiplier
    var SCALE = 0.001, RATE = 0.00015;              // chamberMC._scale (m/s per px/s), animationRate
    var RUN_OUT = 65;                               // initEscapeeTravelDistance
    var MIN_ALPHA = 10, MAX_ALPHA = 100, FADE = 2500, HOLD = 10000, LIFE = 2 * FADE + HOLD;

    var GASES = [                                    // gassesList
      { id: "hydrogen", mass: 2.01588, sym: "H<sub>2</sub>", rgb: [255, 0, 0], size: 2.5 },
      { id: "helium", mass: 4.002602, sym: "He", rgb: [0, 170, 0], size: 2.5 },
      { id: "methane", mass: 16.04246, sym: "CH<sub>4</sub>", rgb: [255, 102, 0], size: 3 },
      { id: "ammonia", mass: 17.03052, sym: "NH<sub>3</sub>", rgb: [160, 80, 255], size: 3 },
      { id: "water", mass: 18.01528, sym: "H<sub>2</sub>O", rgb: [0, 80, 255], size: 3 },
      { id: "nitrogen", mass: 28.0134, sym: "N<sub>2</sub>", rgb: [184, 123, 65], size: 3.5 },
      { id: "oxygen", mass: 31.9988, sym: "O<sub>2</sub>", rgb: [0, 208, 240], size: 4 },
      { id: "carbonDioxide", mass: 44.0095, sym: "CO<sub>2</sub>", rgb: [176, 176, 0], size: 4.5 },
      { id: "xenon", mass: 131.293, sym: "Xe", rgb: [102, 102, 160], size: 6 }
    ];
    GASES.forEach(function (g) { g.css = "rgb(" + g.rgb.join(",") + ")"; g.key = "gr.g." + g.id; });
    var MENU = GASES.slice().reverse();              // AS2's for…in walks the object backwards

    /* ---- layout, in SWF stage coordinates (drawn shifted up by OY) ---- */
    var PANELS = [                                   // Panel Background: 300 × 150 placeholder, scaled
      { x: 7, y: 37, w: 380, h: 400, key: "gr.chamber" },
      { x: 7, y: 444, w: 380, h: 199, key: "gr.props" },
      { x: 394, y: 37, w: 499, h: 377, key: "gr.plot" },
      { x: 394, y: 421, w: 499, h: 222, key: "gr.gases" }
    ];
    var CHAMBER = { x: 72, y: 122, w: 250.84, h: 250.83 };      // 301 px placeholder × 0.8333
    var PLOT = { x: 459.8, y: 336.85, w: 381, h: 251, xMin: 0, xMax: 2000 };
    PLOT.xScale = PLOT.w / (PLOT.xMax - PLOT.xMin);
    var BTN_START = { x: 134.5, y: 606.3, w: 125, h: 25 };
    var BTN_REMOVE = { x: 728.3, y: 454.9, w: 140, h: 25 };
    var BTN_RESETP = { x: 654.5, y: 604.8, w: 140, h: 25 };
    var CHK_ESC = { x: 32.35, y: 525.7, tx: 51, ty: 537, key: "gr.allowEscape" };
    var CHK_CUR = { x: 424.8, y: 390.55, tx: 443.95, ty: 401.85, key: "gr.cursor" };
    var CHK_INFO = { x: 620.15, y: 390.55, tx: 639.3, ty: 401.85, key: "gr.info" };
    var LIST = { x: 577, y: 512, w: 290, row: 21 };
    var BARS = { x: 481.85, y: 617.8, w: 20, gap: 13, h: 150 };
    var COMBO = { x: 573.3, y: 457.9, w: 135, h: 18, row: 16 };
    var CHECK = new Path2D("M7.1 0.6Q7.1 0 6.5 0Q6.35 0 6.05 0.25L2.6 3.95L1 2.15L0.6 1.95Q0.05 1.95 0.05 2.5" +
      "L0 4.4L0.15 4.75L2.25 6.9L2.3 6.9L2.5 6.95L2.9 6.75L6.9 2.75L7.1 2.35Z");

    /* ------------------------------------------------ Slider Logic v6 */
    /* values snap to significant digits; the grabber runs linear or log  */
    function SliderLogic(o) {
      var s = { min: o.min, max: o.max, log: o.log, digs: o.digits, minP: o.minP, maxP: o.minP + o.range };
      s.lower = Math.pow(10, s.digs - 1); s.upper = Math.pow(10, s.digs); s.perMag = 9 * s.lower;
      s.scale = s.log ? (Math.log(s.max) - Math.log(s.min)) / (s.maxP - s.minP) : (s.max - s.min) / (s.maxP - s.minP);
      s.fromParam = function (p) {
        return s.log ? Math.exp((p - s.minP) * s.scale + Math.log(s.min)) : (p - s.minP) * s.scale + s.min;
      };
      s.toParam = function (v) {
        return s.log ? s.minP + (Math.log(v) - Math.log(s.min)) / s.scale : s.minP + (v - s.min) / s.scale;
      };
      function valueOf(sig, mag) {                 // sig / lower · 10^mag, kept exact
        var e = mag - (s.digs - 1);
        return e >= 0 ? sig * Math.pow(10, e) : sig / Math.pow(10, -e);
      }
      s.snap = function (x) {                      // getValueObjectFromValue
        x = Math.min(s.max, Math.max(s.min, x));
        var mag = Math.floor(Math.log(x) / Math.LN10);
        var sig = Math.round(x * s.lower / Math.pow(10, mag));
        if (sig >= s.upper) { sig = s.lower; mag += 1; }
        return { value: valueOf(sig, mag), mag: mag, sig: sig };
      };
      s.step = function (obj, ticks) {             // getIncrementedValueObject
        ticks = Math.round(ticks);
        var f = ticks / s.perMag, dMag, dSig;
        if (f >= 1) { dMag = Math.floor(f); dSig = ticks - dMag * s.perMag; }
        else if (f <= -1) { dMag = Math.ceil(f); dSig = ticks - dMag * s.perMag; }
        else { dMag = 0; dSig = ticks; }
        var sig = obj.sig + dSig, mag = obj.mag + dMag;
        if (sig >= s.upper) { sig -= s.perMag; mag += 1; }
        else if (sig < s.lower) { sig += s.perMag; mag -= 1; }
        var v = valueOf(sig, mag);
        if (v < s.min) return s.snap(s.min);
        if (v > s.max) return s.snap(s.max);
        return { value: v, mag: mag, sig: sig };
      };
      s.text = function (obj) {                    // getValueStringFromValueObject
        var f = s.digs - obj.mag - 1;
        return f > 0 ? obj.value.toFixed(f) : String(obj.value);
      };
      s.obj = s.snap(o.value);
      return s;
    }
    // temperatureSlider: _width 201.05 × 1.215; fieldWidth 60, barSpacing 35, barMargin 7
    var SL_T = SliderLogic({ min: 100, max: 1000, log: true, digits: 2, minP: 102, range: 135.28, value: 300 });
    SL_T.x = 121.85; SL_T.y = 494.8; SL_T.barX = 95; SL_T.label = "gr.tempLabel"; SL_T.units = "gr.K";
    SL_T.maxChars = 5;
    // escapeSpeedSlider: _width 201.05 × 1.060; barSpacing 50
    var SL_V = SliderLogic({ min: 100, max: 1900, log: false, digits: 3, minP: 117, range: 89.15, value: 1500 });
    SL_V.x = 152.8; SL_V.y = 567.8; SL_V.barX = 110; SL_V.label = "gr.escLabel"; SL_V.units = "gr.ms";
    SL_V.maxChars = 4;

    /* ------------------------------------------------ state */
    var running = false, allowEscape = false, showCursor = false, showInfo = true;
    var used = [];                                   // gases in the chamber, in the order added
    var selected = null;
    var offsets = [];                                // the chamber's depthOffsetsList
    for (var d0 = 99; d0 >= 0; d0--) offsets.push(d0);
    var yScale = -50000;                             // plotMC.__yScale, locked once gases exist
    var cursorX = PLOT.x + PLOT.w / 2;
    var simStart = 0, timeLast = 0;
    function T() { return SL_T.obj.value; }
    function vEsc() { return SL_V.obj.value; }

    /* ------------------------------------------------ Math.erf (Numerical Recipes, as the SWF) */
    function gammln(xx) {
      var cof = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155,
        0.001208650973866179, -5.395239384953e-6];
      var x = xx, y = xx, tmp = x + 5.5, ser = 1.000000000190015;
      tmp -= (x + 0.5) * Math.log(tmp);
      for (var j = 0; j <= 5; j++) ser += cof[j] / ++y;
      return -tmp + Math.log(2.5066282746310007 * ser / x);
    }
    function gser(a, x) {
      var gln = gammln(a);
      if (x <= 0) return 0;
      var ap = a, sum = 1 / a, del = sum;
      for (var n = 1; n <= 100; n++) {
        ap += 1; del *= x / ap; sum += del;
        if (Math.abs(del) < Math.abs(sum) * 3e-7) return sum * Math.exp(-x + a * Math.log(x) - gln);
      }
      return 0;
    }
    function gcf(a, x) {
      var gln = gammln(a), b = x + 1 - a, c = 1e30, dd = 1 / b, h = dd;
      for (var i = 1; i <= 100; i++) {
        var an = -i * (i - a);
        b += 2; dd = an * dd + b; if (Math.abs(dd) < 1e-30) dd = 1e-30;
        c = b + an / c; if (Math.abs(c) < 1e-30) c = 1e-30;
        dd = 1 / dd; var del = dd * c; h *= del;
        if (Math.abs(del - 1) < 3e-7) break;
      }
      return Math.exp(-x + a * Math.log(x) - gln) * h;
    }
    function gammp(a, x) { if (x < 0 || a <= 0) return 0; return x < a + 1 ? gser(a, x) : 1 - gcf(a, x); }
    function erf(x) { return x < 0 ? -gammp(0.5, x * x) : gammp(0.5, x * x); }
    function cdf(a, v) {                              // MaxwellPlotCursorOverlay.getCDF
      return erf(v / (a * Math.SQRT2)) - 0.7978845608028654 * v * Math.exp(-v * v / (2 * a * a)) / a;
    }

    /* ------------------------------------------------ Thermal Gas Component */
    function unscaledSpeed(u) {                      // the SWF's fit to the inverse M–B distribution
      return (0.0335009738566387 + u * (324.499855174808 + u * (67952.3527878137 + u * (1649609.82033456 +
        u * (2184252.22113819 + u * (-21058874.6332882 + u * (26738095.9605488 + u * (769197.569308745 +
        u * (-21394748.7073447 + u * (13624855.3507324 + u * -2580664.4615644)))))))))) /
        (1 + u * (1632.61962771862 + u * (155759.053592243 + u * (1790252.45942473 + u * (-3060237.16137971 +
        u * (-9765674.6273682 + u * (28452708.8769605 + u * (-25616300.7710808 + u * (7698980.62184725 +
        u * (1037426.91742616 + u * -694548.98898973))))))))));
    }
    function deal(p) {                               // a new speed and direction
      var u = unscaledSpeed(Math.random()), ang = TAU * Math.random();
      p.u = u; p.ux = u * Math.cos(ang); p.uy = u * Math.sin(ang);
    }
    function calculateSpeeds(g, list) {             // px per simulated second
      var a = Math.sqrt(K_B * T() / (AMU * g.def.mass)) / SCALE;
      (list || g.particles).forEach(function (p) { p.v = a * p.u; p.vx = a * p.ux; p.vy = a * p.uy; });
    }
    function alphaAt(age) {
      if (age < FADE) return MIN_ALPHA + (MAX_ALPHA - MIN_ALPHA) * age / FADE;
      if (age < FADE + HOLD) return MAX_ALPHA;
      return MAX_ALPHA - (MAX_ALPHA - MIN_ALPHA) * (age - FADE - HOLD) / FADE;
    }
    function initializeParticles(g, list, fadeIn) {
      list.forEach(function (p) {
        if (fadeIn) { p.age = 0; p.alpha = MIN_ALPHA; } else { p.age = LIFE * Math.random(); p.alpha = alphaAt(p.age); }
      });
      list.forEach(function (p) {
        p.x = CHAMBER.w * Math.random(); p.y = CHAMBER.h * Math.random(); deal(p);
      });
      calculateSpeeds(g, list);
    }
    /* setNumberOfParticles: movie clips come off a free list, newest depth last, so a
       clip keeps its stacking slot k (depth 1e6 + gas offset − 100·k) for good    */
    function setCount(g, n) {
      var pL = g.particles, change = n - pL.length, i;
      if (change > 0) {
        var shortage = change - g.free.length;
        if (shortage > 0) {
          var fresh = [];
          for (i = 0; i < shortage; i++) { g.total += 1; fresh.push({ k: g.total }); }
          g.free = fresh.reverse().concat(g.free);
        }
        var add = [];
        for (i = 0; i < change; i++) { var p = g.free.pop(); pL.push(p); add.push(p); }
        initializeParticles(g, add, false);
      } else if (change < 0) {
        for (i = 0; i < -change; i++) g.free.push(pL[pL.length - 1 - i]);
        pL.splice(pL.length + change, -change);
      }
    }
    function bounce(p, dt) {
      var w = CHAMBER.w, h = CHAMBER.h, nx = p.x + dt * p.vx, ny = p.y + dt * p.vy;
      var mx = ((nx / w) % 2 + 2) % 2, my = ((ny / h) % 2 + 2) % 2;
      if (mx < 1) p.x = mx * w; else { p.vx = -p.vx; p.ux = -p.ux; p.x = 2 * w - mx * w; }
      if (my < 1) p.y = my * h; else { p.vy = -p.vy; p.uy = -p.uy; p.y = 2 * h - my * h; }
    }
    function advanceParticles(g, dt, dAge) {
      var pL = g.particles, n = pL.length, i, p, expired = [];
      for (i = 0; i < n; i++) {
        p = pL[i]; p.age += dAge;
        if (p.age > LIFE) expired.push(p); else p.alpha = alphaAt(p.age);
      }
      if (expired.length) initializeParticles(g, expired, true);
      var w = CHAMBER.w, h = CHAMBER.h;
      if (allowEscape) {
        var ev = vEsc() / SCALE, respawned = [];
        for (i = 0; i < n; i++) {
          p = pL[i];
          if (p.v > ev) {
            var nx = p.x + dt * p.vx, ny = p.y + dt * p.vy;
            if (nx > w || nx < 0 || ny < 0 || ny > h) {
              g.escapees.push({ x: p.x, y: p.y, vx: p.vx, vy: p.vy, alpha: p.alpha, a: p.alpha });
              p.x = w * Math.random(); p.y = h * Math.random();
              var ang = TAU * Math.random();
              p.ux = p.u * Math.cos(ang); p.uy = p.u * Math.sin(ang);
              respawned.push(p);
            } else { p.x = nx; p.y = ny; }
          } else bounce(p, dt);
        }
        if (respawned.length) calculateSpeeds(g, respawned);
      } else {
        for (i = 0; i < n; i++) bounce(pL[i], dt);
      }
      var eL = g.escapees;                           // advanceEscapees
      for (i = eL.length - 1; i >= 0; i--) {
        var e = eL[i], ex = e.x + dt * e.vx, ey = e.y + dt * e.vy;
        var dx = ex > w ? ex - w : -ex, dy = ey > h ? ey - h : -ey;
        var u = Math.max(dx, dy) / RUN_OUT;
        if (u < 1) { e.x = ex; e.y = ey; e.a = (1 - u) * e.alpha; } else eL.splice(i, 1);
      }
    }

    /* ------------------------------------------------ Gas Retention Simulator */
    function recalculatePlotScale() {                // peaks the curves would reach at T_min
      var maxPeak = -Infinity;
      used.forEach(function (g) {
        var peak = 0.5870506526949597 / Math.sqrt(R_KMOL * SL_T.min / g.def.mass);
        if (peak > maxPeak) maxPeak = peak;
      });
      if (used.length) yScale = -0.95 * PLOT.h / maxPeak;
    }
    function addGas(def) {
      if (running || used.length >= GAS_LIMIT || find(def.id)) return;
      var g = { def: def, fraction: 1, initialFraction: 1, decay: 0, offset: offsets.pop(),
        particles: [], free: [], total: 0, escapees: [] };
      used.push(g);
      recalculatePlotScale();
      setCount(g, N_PER_GAS);
      select(g);
      changed();
    }
    function removeSelected() {
      if (running || !selected) return;
      var i = used.indexOf(selected);
      offsets.push(selected.offset);
      used.splice(i, 1);
      recalculatePlotScale();
      select(used.length ? used[Math.min(i, used.length - 1)] : null);
      changed();
    }
    function resetProportions() {
      if (running) return;
      used.forEach(function (g) { g.fraction = 1; setCount(g, N_PER_GAS); });
      changed();
    }
    function setFraction(g, f) {                     // onProportionsChanged
      g.fraction = f;
      setCount(g, Math.round(N_PER_GAS * f));
      changed();
    }
    function select(g) { selected = g; changed(); }
    function find(id) { for (var i = 0; i < used.length; i++) if (used[i].def.id === id) return used[i]; return null; }

    function setTemperature(obj) {                   // onTemperatureChanged
      if (obj.value === SL_T.obj.value) return;
      SL_T.obj = obj;
      used.forEach(function (g) { calculateSpeeds(g); });
      changed();
    }
    function setEscapeSpeed(obj) {                   // onEscapeSpeedSliderChanged
      if (obj.value === SL_V.obj.value) return;
      SL_V.obj = obj;
      changed();
    }
    function setAllowEscape(b) {                     // onAllowEscapeChanged (+ chamber.clearEscapees)
      if (running) return;
      allowEscape = b;
      used.forEach(function (g) { g.escapees = []; });
      changed();
    }
    function setShowCursor(b) { showCursor = b; changed(); }
    function setShowInfo(b) { if (showCursor) { showInfo = b; changed(); } }

    function toggleRun() {                           // onStartSimulationButtonPressed
      field(SL_T).blur(); field(SL_V).blur();
      if (!running) {
        if (allowEscape) {
          var kT = T() * K_B, v = vEsc(), C1 = v / Math.SQRT2, C2 = 0.7978845608028654 * v, C3 = -v * v / 2;
          used.forEach(function (g) {
            var a = Math.sqrt(kT / (AMU * g.def.mass));
            var fesc = 1 - (erf(C1 / a) - C2 * Math.exp(C3 / (a * a)) / a);
            g.decay = 0.001 * fesc;                  // per millisecond
            g.initialFraction = g.fraction;
          });
        }
        running = true;
        simStart = timeLast = performance.now();
      } else running = false;
      changed();
    }
    function resetAll() {                            // onReset
      running = false;
      field(SL_T).blur(); field(SL_V).blur();
      SL_T.active = SL_V.active = false;
      MENU.forEach(function (d) { var g = find(d.id); if (g) offsets.push(g.offset); });   // for (id in gassesList)
      used = []; selected = null; comboOpen = false;
      SL_T.obj = SL_T.snap(300); SL_V.obj = SL_V.snap(1500);
      allowEscape = false; showCursor = false; showInfo = true;
      changed();
    }

    /* one frame of both onEnterFrame handlers */
    function doPseudoCollisions(dAge) {
      var sum = 0;
      used.forEach(function (g) { sum += g.fraction; });
      var F = 0.1 * (sum / GAS_LIMIT) * Math.sqrt(T() / SL_T.max);
      F = 1 - Math.pow(1 - F, dAge / 50);            // per 20 fps frame in the SWF
      used.forEach(function (g) {
        var hit = [];
        g.particles.forEach(function (p) { if (Math.random() < F) { deal(p); hit.push(p); } });
        if (hit.length) calculateSpeeds(g, hit);
      });
    }
    function step(now) {
      var dAge = Math.min(now - timeLast, 100);
      doPseudoCollisions(dAge);
      if (allowEscape) {
        var t = now - simStart;
        used.forEach(function (g) {
          g.fraction = g.initialFraction * Math.exp(-g.decay * t);
          setCount(g, Math.round(N_PER_GAS * g.fraction));
        });
      }
      var dt = RATE * dAge / 1000;
      used.forEach(function (g) { advanceParticles(g, dt, dAge); });
      timeLast = now;
    }

    /* ------------------------------------------------ sidebar */
    var controlsEl = S.canvas.parentNode.parentNode.querySelector(".sim-controls");
    function last(sel) { var all = controlsEl.querySelectorAll(sel); return all[all.length - 1]; }
    var syncing = false;

    S.group("gr.props");
    var tCtl = S.slider({ labelKey: "gr.temp", min: 2, max: 3, step: 0.0005, value: Math.log10(300),
      format: function (v) { return SL_T.text(SL_T.snap(Math.pow(10, v))) + " K"; },
      on: function (v) { if (!syncing) setTemperature(SL_T.snap(Math.pow(10, v))); } });
    var escToggle = S.toggle({ labelKey: "gr.allowEscape", value: false,
      on: function (b) { if (!syncing) setAllowEscape(b); } });
    var escInput = last("input[type=checkbox]");
    var vCtl = S.slider({ labelKey: "gr.escape", min: 100, max: 1900, step: 1, value: 1500,
      format: function (v) { return SL_V.text(SL_V.snap(v)) + " " + I18N.t("gr.ms"); },
      on: function (v) { if (!syncing) setEscapeSpeed(SL_V.snap(v)); } });
    var runBtn = S.button({ labelKey: "gr.start", primary: true, on: toggleRun });

    S.group("gr.gases");
    var addSel = S.select({ labelKey: "gr.addGas", value: "", options: [{ v: "", labelKey: "gr.select" }],
      on: function (v) {
        if (syncing || !v) return;
        GASES.forEach(function (g) { if (g.id === v) addGas(g); });
      } });
    var addEl = last("select");
    var removeBtn = S.button({ labelKey: "gr.remove", on: removeSelected });
    var resetPBtn = S.button({ labelKey: "gr.resetProps", on: resetProportions });

    S.group("gr.plot");
    var curToggle = S.toggle({ labelKey: "gr.cursor", value: false,
      on: function (b) { if (!syncing) setShowCursor(b); } });
    var infoToggle = S.toggle({ labelKey: "gr.info", value: true,
      on: function (b) { if (!syncing) setShowInfo(b); } });
    var infoInput = last("input[type=checkbox]");
    S.button({ labelKey: "gr.reset", on: resetAll });
    var hint = document.createElement("p");
    hint.className = "sim-note"; hint.setAttribute("data-i18n", "gr.hint");
    controlsEl.appendChild(hint);

    function comboEnabled() { return !running && used.length < GAS_LIMIT; }
    function menuItems() {                           // refreshGassesComboBox
      if (used.length >= GAS_LIMIT) return [{ key: "gr.limit", id: "" }];
      var items = [{ key: "gr.select", id: "" }];
      MENU.forEach(function (g) { if (!find(g.id)) items.push({ key: g.key, id: g.id, def: g }); });
      return items;
    }
    var menuSig = "";
    function syncSidebar() {
      syncing = true;
      tCtl.set(Math.log10(T())); vCtl.set(vEsc());
      tCtl.input.disabled = running;
      vCtl.input.disabled = running || !allowEscape;
      escToggle.set(allowEscape); escInput.disabled = running;
      curToggle.set(showCursor);
      infoToggle.set(showInfo); infoInput.disabled = !showCursor;
      var key = running ? "gr.stop" : "gr.start";
      if (runBtn.getAttribute("data-i18n") !== key) { runBtn.setAttribute("data-i18n", key); runBtn.textContent = I18N.t(key); }
      removeBtn.disabled = running || !selected;
      resetPBtn.disabled = running;
      var items = menuItems(), sig = items.map(function (it) { return it.key; }).join();
      if (sig !== menuSig) {
        menuSig = sig;
        addEl.innerHTML = "";
        items.forEach(function (it) {
          var o = document.createElement("option");
          o.value = it.id; o.setAttribute("data-i18n", it.key); o.textContent = I18N.t(it.key);
          addEl.appendChild(o);
        });
      }
      addEl.value = "";
      addEl.disabled = !comboEnabled();
      syncing = false;
    }

    /* the two slider value boxes: real inputs over the canvas, like the SWF's fields */
    var wrap = document.createElement("div");
    wrap.style.position = "relative";
    S.canvas.parentNode.insertBefore(wrap, S.canvas);
    wrap.appendChild(S.canvas);
    function makeField(sl, label) {
      var input = document.createElement("input");
      input.type = "text"; input.inputMode = "decimal"; input.maxLength = sl.maxChars;
      input.setAttribute("aria-label", label);
      input.style.cssText = "position:absolute;border:0;background:transparent;padding:0;margin:0;" +
        "text-align:center;outline:none;opacity:1;box-shadow:none;font-family:" + FONT + ";";
      input.style.left = ((sl.x - 3.8) / S.W * 100) + "%";
      input.style.top = ((sl.y - 9.5 + OY) / S.H * 100) + "%";
      input.style.width = (67.6 / S.W * 100) + "%"; input.style.height = (19 / S.H * 100) + "%";
      wrap.appendChild(input);
      sl.active = false;
      function commit() {                         // setValue(parseFloat(text), true)
        var v = parseFloat(input.value);
        sl.active = false; input.style.fontStyle = "normal";
        if (isFinite(v)) { if (sl === SL_T) setTemperature(SL_T.snap(v)); else setEscapeSpeed(SL_V.snap(v)); }
        changed();
      }
      input.addEventListener("input", function () {
        input.value = input.value.replace(/[^0-9.Ee+\-]/g, "");
        sl.active = true; input.style.fontStyle = "italic"; S.requestDraw();
      });
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { commit(); input.blur(); }
        else if (ev.key === "Escape") { sl.active = false; input.style.fontStyle = "normal"; changed(); input.blur(); }
      });
      input.addEventListener("blur", function () { if (sl.active) commit(); });
      sl.input = input;
      return input;
    }
    makeField(SL_T, "temperature (K)"); makeField(SL_V, "escape speed (m/s)");
    function field(sl) { return sl.input; }
    function fitFields() {
      var px = 12 * S.canvas.clientWidth / S.W + "px";
      SL_T.input.style.fontSize = px; SL_V.input.style.fontSize = px;
    }
    if (window.ResizeObserver) new ResizeObserver(fitFields).observe(S.canvas);
    else window.addEventListener("resize", fitFields);
    fitFields();
    function syncFields() {
      [SL_T, SL_V].forEach(function (sl) {
        var en = sl === SL_T ? !running : !running && allowEscape;
        sl.input.disabled = !en;
        sl.input.style.color = en ? "#000000" : "#404040";
        sl.input.style.webkitTextFillColor = sl.input.style.color;
        if (!sl.active) sl.input.value = sl.text(sl.obj);
      });
    }

    function changed() { syncSidebar(); syncFields(); S.requestDraw(); wake(); }

    /* ------------------------------------------------ canvas interaction */
    var hover = null, press = null, comboOpen = false, comboHover = -1;
    function at(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height - OY };
    }
    function inRect(p, x, y, w, h) { return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h; }
    function barGeom(g, i) {
      var xOff = (used.length * (BARS.w + BARS.gap) - BARS.gap) / 2;
      var x1 = BARS.x + i * (BARS.w + BARS.gap) - xOff;
      return { x1: x1, x2: x1 + BARS.w, y: BARS.y - g.fraction * BARS.h };
    }
    function checkWidth(c) { S.ctx.font = "12px " + FONT; return c.tx - c.x + S.ctx.measureText(I18N.t(c.key)).width; }
    function comboItems() { return menuItems(); }
    function comboRowAt(p) {
      var items = comboItems(), top = COMBO.y + COMBO.h;
      if (!inRect(p, COMBO.x, top, COMBO.w, items.length * COMBO.row + 2)) return -2;
      return Math.max(0, Math.min(items.length - 1, Math.floor((p.y - top - 1) / COMBO.row)));
    }
    function hit(p) {
      if (comboOpen) { var r = comboRowAt(p); return r >= 0 ? { kind: "comboRow", i: r } : { kind: "away" }; }
      var top = PLOT.y - PLOT.h;
      if (showCursor && Math.abs(p.x - cursorX) <= 4 && p.y >= top && p.y <= top + PLOT.h + 15) return { kind: "cursor" };
      if (showCursor && inRect(p, PLOT.x, top, PLOT.w, PLOT.h)) return { kind: "plot" };
      if (inRect(p, CHK_INFO.x, CHK_INFO.y, checkWidth(CHK_INFO), 13)) return showCursor ? { kind: "check", c: CHK_INFO } : null;
      if (inRect(p, CHK_CUR.x, CHK_CUR.y, checkWidth(CHK_CUR), 13)) return { kind: "check", c: CHK_CUR };
      if (inRect(p, CHK_ESC.x, CHK_ESC.y, checkWidth(CHK_ESC), 13)) return running ? null : { kind: "check", c: CHK_ESC };
      var btns = [[BTN_START, true], [BTN_REMOVE, !running && !!selected], [BTN_RESETP, !running]];
      for (var b = 0; b < btns.length; b++) {
        var B = btns[b][0];
        if (inRect(p, B.x, B.y, B.w, B.h)) return btns[b][1] ? { kind: "button", b: B } : null;
      }
      var sls = [[SL_T, !running], [SL_V, !running && allowEscape]];
      for (var s = 0; s < sls.length; s++) {
        var sl = sls[s][0], gx = sl.x + sl.toParam(sl.obj.value);
        if (!sls[s][1]) continue;
        if (Math.abs(p.x - gx) <= 5.5 && Math.abs(p.y - sl.y) <= 13) return { kind: "grab", s: sl };
        if (inRect(p, sl.x + sl.barX - 3, sl.y - 4, sl.maxP - sl.minP + 20, 8)) return { kind: "bar", s: sl };
      }
      if (inRect(p, COMBO.x, COMBO.y, COMBO.w, COMBO.h)) return comboEnabled() ? { kind: "combo" } : null;
      for (var i = 0; i < used.length; i++) {
        if (inRect(p, LIST.x, LIST.y + i * LIST.row, LIST.w, LIST.row)) return { kind: "row", g: used[i] };
      }
      if (!running) {
        for (var j = used.length - 1; j >= 0; j--) {
          var G = barGeom(used[j], j);
          if (inRect(p, G.x1 - 2, G.y - 2, BARS.w + 4, BARS.y - G.y + 2)) return { kind: "pbar", g: used[j] };
        }
      }
      return null;
    }
    var CURSORS = { cursor: "ew-resize", grab: "ew-resize", pbar: "ns-resize", plot: "crosshair",
      button: "pointer", check: "pointer", combo: "pointer", comboRow: "pointer", row: "pointer", bar: "pointer" };
    function setHover(h) {
      hover = h;
      S.canvas.style.cursor = press ? S.canvas.style.cursor : (h && CURSORS[h.kind]) || "default";
    }
    function sliderMouseValue(sl, x) { return sl.snap(sl.fromParam(x - sl.x)); }
    function pickCombo(i) {
      var it = comboItems()[i];
      comboOpen = false; comboHover = -1;
      if (it && it.def) addGas(it.def); else changed();
    }

    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = at(ev), h = hit(p);
      if (comboOpen) {
        if (h.kind === "comboRow") pickCombo(h.i); else { comboOpen = false; changed(); }
        return;
      }
      if (!h) return;
      ev.preventDefault();
      if (document.activeElement === SL_T.input || document.activeElement === SL_V.input) document.activeElement.blur();
      S.canvas.setPointerCapture(ev.pointerId);
      press = { kind: h.kind, b: h.b, c: h.c, s: h.s, g: h.g, inside: true, x0: p.x, y0: p.y };
      if (h.kind === "grab") press.off = p.x - (h.s.x + h.s.toParam(h.s.obj.value));
      else if (h.kind === "bar") {                   // one tick toward the mouse, then repeat
        var sl = h.s, m = sliderMouseValue(sl, p.x);
        if (m.value !== sl.obj.value) applySlider(sl, sl.step(sl.obj, m.value < sl.obj.value ? -1 : 1));
        press.tLast = performance.now(); press.wait = press.tLast + 500; press.mx = p.x;
      } else if (h.kind === "combo") { comboOpen = true; comboHover = -1; }
      else if (h.kind === "row") select(h.g);
      else if (h.kind === "pbar") { press.f0 = h.g.fraction; select(h.g); }
      else if (h.kind === "cursor") press.off = p.x - cursorX;
      else if (h.kind === "plot") { press.kind = "cursor"; press.off = 0; moveCursor(p.x); }
      setHover(h);
      S.requestDraw(); wake();
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = at(ev);
      if (!press) {
        var h = hit(p);
        if (comboOpen) comboHover = h.kind === "comboRow" ? h.i : -1;
        var was = hover && hover.kind + (hover.g ? hover.g.def.id : "");
        setHover(h);
        var now = h && h.kind + (h.g ? h.g.def.id : "");
        if (was !== now || comboOpen) S.requestDraw();
        return;
      }
      if (press.kind === "grab") {
        var sl = press.s, v = sliderMouseValue(sl, p.x - press.off);
        if (v.value !== sl.obj.value) applySlider(sl, v);
      } else if (press.kind === "bar") press.mx = p.x;
      else if (press.kind === "pbar") {
        var f = Math.min(1, Math.max(0, press.f0 - (p.y - press.y0) / BARS.h));
        if (f !== press.g.fraction) setFraction(press.g, f);
      } else if (press.kind === "cursor") moveCursor(p.x - press.off);
      else if (press.kind === "combo") {
        var r = comboRowAt(p); comboHover = r >= 0 ? r : -1; S.requestDraw();
      } else {
        var h2 = hit(p), inside = !!h2 && h2.kind === press.kind && h2.b === press.b && h2.c === press.c;
        if (inside !== press.inside) { press.inside = inside; S.requestDraw(); }
      }
    });
    function release(ev, cancelled) {
      if (!press) return;
      var pr = press, p = at(ev);
      press = null;
      if (!cancelled) {
        if (pr.kind === "button" && pr.inside) {
          if (pr.b === BTN_START) toggleRun(); else if (pr.b === BTN_REMOVE) removeSelected(); else resetProportions();
        } else if (pr.kind === "check" && pr.inside) {
          if (pr.c === CHK_ESC) setAllowEscape(!allowEscape);
          else if (pr.c === CHK_CUR) setShowCursor(!showCursor);
          else setShowInfo(!showInfo);
        } else if (pr.kind === "combo") {
          var r = comboRowAt(p);                    // pressed on the box, released on an item
          if (r >= 0 && Math.abs(p.y - pr.y0) > 4) pickCombo(r);
        }
      }
      setHover(hit(p));
      changed();
    }
    S.canvas.addEventListener("pointerup", function (ev) { release(ev, false); });
    S.canvas.addEventListener("pointercancel", function (ev) { release(ev, true); });
    S.canvas.addEventListener("pointerleave", function () {
      if (!press && hover) { hover = null; comboHover = -1; S.canvas.style.cursor = "default"; S.requestDraw(); }
    });
    function applySlider(sl, obj) { if (sl === SL_T) setTemperature(obj); else setEscapeSpeed(obj); }
    function barRepeat(now) {                        // barMC.onEnterFrameFunc
      if (!press || press.kind !== "bar" || now <= press.wait) return;
      var sl = press.s, ticks = 0.05 * (now - press.tLast), m = sliderMouseValue(sl, press.mx);
      if (m.value < sl.obj.value) {
        var down = sl.step(sl.obj, -ticks);
        applySlider(sl, down.value > m.value ? down : m);
      } else if (m.value > sl.obj.value) {
        var up = sl.step(sl.obj, ticks);
        applySlider(sl, up.value < m.value ? up : m);
      }
      press.tLast = now;
    }
    function moveCursor(x) {
      cursorX = Math.min(PLOT.x + PLOT.w, Math.max(PLOT.x, x));
      S.requestDraw();
    }

    /* one rAF loop drives the chamber and a held slider bar */
    var rafId = 0;
    function wake() { if (!rafId && (running || (press && press.kind === "bar"))) rafId = requestAnimationFrame(frame); }
    function frame(now) {
      rafId = 0;
      if (running) step(now);
      barRepeat(now);
      draw();
      wake();
    }

    /* ------------------------------------------------ drawing helpers */
    function t(key) { return I18N.t(key); }
    function font(ctx, size, bold) { ctx.font = (bold ? "bold " : "") + size + "px " + FONT; }
    function rgba(g, a) { return "rgba(" + g.def.rgb.join(",") + "," + a + ")"; }
    function lineH(size) { return EM_H * size + 4; }            // an autosized TextField's height
    function runs(str) {                                       // "H<sub>2</sub>O" → runs
      var out = [], re = /<sub>(.*?)<\/sub>/g, last0 = 0, m;
      while ((m = re.exec(str))) {
        if (m.index > last0) out.push({ s: str.slice(last0, m.index), sub: false });
        out.push({ s: m[1], sub: true });
        last0 = re.lastIndex;
      }
      if (last0 < str.length) out.push({ s: str.slice(last0), sub: false });
      return out;
    }
    /* _global.displayText: runs of normal and subscript text (size / ratio, sitting
       on the bottom of the line box), 0.5 px apart, aligned as a block          */
    function displayText(ctx, str, x, y, o) {
      var size = o.size || 12, ss = size / (o.ratio || 1.5), rs = runs(str);
      var lh = lineH(size), sh = lineH(ss), total = 0;
      rs.forEach(function (r) { font(ctx, r.sub ? ss : size, o.bold); r.w = ctx.measureText(r.s).width; total += r.w; });
      total += 0.5 * (rs.length - 1);
      var left = o.h === "left" ? x : o.h === "right" ? x - total : x - total / 2;
      var top = o.v === "top" ? y - 2 : o.v === "bottom" ? y - lh + 2 : y - lh / 2;
      ctx.fillStyle = o.color || "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      rs.forEach(function (r) {
        var sz = r.sub ? ss : size;
        font(ctx, sz, o.bold);
        ctx.fillText(r.s, left, top + (r.sub ? lh - sh : 0) + 2 + ASC * sz + TB);
        left += r.w + 0.5;
      });
      return total;
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }

    /* Panel Background: #fafafa, 1 px #666666, 14 px #333333 title and a #cccccc rule */
    function panel(ctx, b) {
      ctx.fillStyle = "#fafafa"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1;
      ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      font(ctx, 14); ctx.fillStyle = "#333333"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var title = t(b.key), tw = ctx.measureText(title).width;
      ctx.fillText(title, b.x + 5, b.y + 18);
      ctx.strokeStyle = "#cccccc";
      ctx.beginPath(); ctx.moveTo(b.x + 10 + tw, b.y + 12.5); ctx.lineTo(b.x + b.w - 5, b.y + 12.5); ctx.stroke();
    }
    /* FPushButton (fpb_states): #999 frame, #ccc inner frame (#999 when down), #e8e8e8 face */
    function pushButton(ctx, b, key, enabled) {
      var down = enabled && press && press.kind === "button" && press.b === b && press.inside;
      ctx.fillStyle = "#999999"; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = down ? "#999999" : "#cccccc"; ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
      ctx.fillStyle = "#e8e8e8"; ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
      font(ctx, 12); ctx.fillStyle = enabled ? "#000000" : "#888888";
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(t(key), b.x + b.w / 2 + (down ? 1 : 0), b.y + 17.2 + (down ? 1 : 0));
    }
    /* FCheckBox (fcb_states): #808080 frame, #d4d0d8 inner frame, white well (#ccc when
       pressed or disabled), black tick (#808080 disabled); its label is static text */
    function checkBox(ctx, c, checked, enabled) {
      var down = press && press.kind === "check" && press.c === c && press.inside;
      ctx.fillStyle = "#808080"; ctx.fillRect(c.x, c.y, 13, 13);
      ctx.fillStyle = "#d4d0d8"; ctx.fillRect(c.x + 1, c.y + 1, 11, 11);
      ctx.fillStyle = enabled && !down ? "#ffffff" : "#cccccc"; ctx.fillRect(c.x + 2, c.y + 2, 9, 9);
      if (checked) {
        ctx.save(); ctx.translate(c.x + 2.9, c.y + 3.15);
        ctx.fillStyle = enabled ? "#000000" : "#808080"; ctx.fill(CHECK);
        ctx.restore();
      }
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillText(t(c.key), c.tx, c.ty);
    }
    /* Standard Slider v6: label, rounded field, units, 6 px bar and a 9 × 17 grabber */
    function slider(ctx, sl, enabled) {
      ctx.save(); ctx.translate(sl.x, sl.y);
      font(ctx, 12); ctx.fillStyle = "#000000"; ctx.textBaseline = "alphabetic";
      var base = -lineH(12) / 2 + 2 + ASC * 12 + TB;           // displayText, vAlign centre
      ctx.textAlign = "right"; ctx.fillText(t(sl.label), -9.8, base);
      ctx.textAlign = "left"; ctx.fillText(t(sl.units), 69.8, base);
      roundRect(ctx, -4.8, -10.5, 69.6, 21, 4.8); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      roundRect(ctx, -3.8, -9.5, 67.6, 19, 3.8);
      ctx.fillStyle = !enabled ? "#f4f4f4" : sl.active ? "#ffffee" : "#ffffff"; ctx.fill();
      var L = sl.maxP - sl.minP + 14;
      roundRect(ctx, sl.barX - 3.1, -4, L + 6.2, 8, 3.1); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      var g = ctx.createLinearGradient(0, -3, 0, 3);
      g.addColorStop(0, "#fafafa"); g.addColorStop(1, "#d0d0d0");
      roundRect(ctx, sl.barX - 2.1, -3, L + 4.2, 6, 2.1); ctx.fillStyle = g; ctx.fill();
      var gx = sl.toParam(sl.obj.value);
      roundRect(ctx, gx - 5.5, -13.1, 11, 26.2, 4.6); ctx.fillStyle = "#c0c0c0"; ctx.fill();
      var gg = ctx.createLinearGradient(gx - 4.5, 0, gx + 4.5, 0);
      gg.addColorStop(0, "#e0e0e0"); gg.addColorStop(128 / 255, "#f4f4f4"); gg.addColorStop(1, "#e0e0e0");
      roundRect(ctx, gx - 4.5, -12.1, 9, 24.2, 3.6); ctx.fillStyle = gg; ctx.fill();
      ctx.restore();
    }

    /* ------------------------------------------------ the four panels */
    function chamber(ctx) {
      var C = CHAMBER;
      ctx.save(); ctx.translate(C.x, C.y);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, C.w, C.h); ctx.clip();
      // depth 1e6 + offset − 100·k: the oldest clips on top, gases interleaved by offset
      var byOffset = used.slice().sort(function (a, b) { return a.offset - b.offset; }), maxK = 0;
      byOffset.forEach(function (g) {
        g.byK = [];
        g.particles.forEach(function (p) { g.byK[p.k] = p; if (p.k > maxK) maxK = p.k; });
      });
      for (var k = maxK; k >= 1; k--) {
        for (var i = 0; i < byOffset.length; i++) {
          var g = byOffset[i], p = g.byK[k];
          if (!p) continue;
          ctx.globalAlpha = p.alpha / 100; ctx.fillStyle = g.def.css;
          ctx.beginPath(); ctx.arc(p.x, p.y, g.def.size / 2, 0, TAU); ctx.fill();
        }
      }
      ctx.restore();
      byOffset.forEach(function (g) {                 // escapees: unmasked, fading out
        ctx.fillStyle = g.def.css;
        g.escapees.forEach(function (e) {
          ctx.globalAlpha = Math.min(100, e.a) / 100;
          ctx.beginPath(); ctx.arc(e.x, e.y, g.def.size / 2, 0, TAU); ctx.fill();
        });
      });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#909090"; ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, C.w, C.h);
      ctx.restore();
    }

    /* MPCCurveClass.drawMaxwell: quadratic pieces whose control points are where the
       tangents at their ends cross, split at the inflections and the mode         */
    function maxwellPath(ctx, a, ys) {
      var xMin = PLOT.xMin, xMax = PLOT.xMax, xs = PLOT.xScale, exp = Math.exp;
      var K0 = 0.7978845608028654 / (a * a * a), K1 = 2 * a * a, K2 = 2 * (ys / xs);
      var lim = 5 * a;
      if (lim < xMin) { ctx.moveTo(0, 0); ctx.lineTo(xs * (xMax - xMin), 0); return { x: 0, y: 0 }; }
      var marks = [], inf1 = a * 0.6621534468619564, mode = a * Math.SQRT2, inf2 = a * 2.135779205069857;
      [inf1, mode, inf2].forEach(function (m) { if (m > xMin && m < xMax) marks.push(m); });
      var range, passed;
      if (lim < xMax) { marks.push(lim); range = lim - xMin; passed = true; }
      else { marks.push(xMax); range = xMax - xMin; passed = false; }
      var x = xMin, J0 = K0 * x * exp(-x * x / K1), m = J0 * K2 * (1 - x * x / K1);
      var ax = 0, ay = ys * x * J0, start = { x: ax, y: ay };
      ctx.moveTo(ax, ay);
      for (var i = 0; i < marks.length; i++) {
        var n = Math.ceil(8 * (marks[i] - x) / range), dx = (marks[i] - x) / n;
        for (var j = 0; j < n; j++) {
          var lax = ax, lay = ay, lm = m;
          x += dx;
          J0 = K0 * x * exp(-x * x / K1); m = J0 * K2 * (1 - x * x / K1);
          ax = xs * (x - xMin); ay = ys * x * J0;
          var cx = ((lay - ay) - lm * lax + m * ax) / (m - lm), cy = m * (cx - ax) + ay;
          ctx.quadraticCurveTo(cx, cy, ax, ay);
        }
      }
      if (passed) ctx.lineTo(xs * (xMax - xMin), 0);
      return start;
    }
    function plot(ctx) {
      var P = PLOT;
      ctx.save(); ctx.translate(P.x, P.y);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, -P.h, P.w, P.h);
      ctx.save(); ctx.beginPath(); ctx.rect(0, -P.h, P.w, P.h); ctx.clip();
      ctx.lineWidth = 1;
      used.forEach(function (g) {
        var a = Math.sqrt(R_KMOL * T() / g.def.mass), ys = g.fraction * yScale;
        if (g === selected) {
          ctx.beginPath();
          var st = maxwellPath(ctx, a, ys);
          ctx.lineTo(P.w, 0); ctx.lineTo(0, 0); ctx.lineTo(st.x, st.y);
          ctx.fillStyle = rgba(g, 0.2); ctx.fill();
        }
        ctx.beginPath(); maxwellPath(ctx, a, ys);
        ctx.strokeStyle = g.def.css; ctx.stroke();
      });
      ctx.restore();
      ctx.strokeStyle = "#505050"; ctx.lineWidth = 1;
      ctx.strokeRect(0, -P.h, P.w, P.h);
      // updateXAxis: 45 px minimum spacing → majors every 500 m/s, minors every 100
      var minorSpacing = 100, multiple = 5;
      ctx.beginPath();
      for (var i = 0; i <= 20; i++) {
        var x = P.xScale * minorSpacing * i;
        ctx.moveTo(x, 0); ctx.lineTo(x, i % multiple === 0 ? 6 : 3);
      }
      ctx.stroke();
      for (var j = 0; j <= 20; j += multiple) {
        displayText(ctx, String(minorSpacing * j), P.xScale * minorSpacing * j, 8, { h: "center", v: "top" });
      }
      if (allowEscape) {                             // drawDashedLine(x, 0, x, −h, 5, 5), #909090
        var ex = (vEsc() - P.xMin) * P.xScale, len = P.h;
        var n = Math.round((len - 5) / 10), f = 5 / 10, step = len / (n + f);
        ctx.strokeStyle = "#909090"; ctx.beginPath();
        for (var k = 0; k <= n; k++) { ctx.moveTo(ex, -k * step); ctx.lineTo(ex, -k * step - f * step); }
        ctx.stroke();
      }
      ctx.restore();
    }
    function axisLabels(ctx) {                       // static texts 219 (turned) and 220
      font(ctx, 12, true); ctx.fillStyle = "#000000"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.save(); ctx.translate(438.95, 211.85); ctx.rotate(-Math.PI / 2);
      ctx.fillText(t("gr.yAxis"), 0, 0);
      ctx.restore();
      ctx.fillText(t("gr.xAxis"), 649.8, 375.45);
    }
    function escapeLabel(ctx) {                      // escapeSpeedLabelMC, text 221
      if (!allowEscape) return;
      font(ctx, 10); ctx.fillStyle = "#606060"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(t("gr.escLine"), PLOT.x + (vEsc() - PLOT.xMin) * PLOT.xScale, 78.95);
    }
    /* Maxwell Plot Cursor Overlay */
    function cursorOverlay(ctx) {
      var top = PLOT.y - PLOT.h, active = (hover && hover.kind === "cursor") || (press && press.kind === "cursor");
      var hw = active ? 2 : 1.5;
      ctx.fillStyle = active ? "#ff5050" : "#ee9090";
      ctx.fillRect(cursorX - hw, top, 2 * hw, PLOT.h + 15);
      var v = PLOT.xMin + (cursorX - PLOT.x) / PLOT.xScale;
      var str = Math.round(v) + " " + t("gr.ms");
      font(ctx, 11); var bw = ctx.measureText(str).width + 4, bh = lineH(11);
      var bx = cursorX - bw / 2, by = top + PLOT.h + 8;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = "#ee9090"; ctx.lineWidth = 1; ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
      ctx.fillStyle = "#000000"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText(str, cursorX, by + 2 + ASC * 11 + TB);
      if (!showInfo || !selected) return;
      var a = Math.sqrt(T() * K_B / (AMU * selected.def.mass)), c = cdf(a, v), left, right;
      if (c === 0) { left = "0.0%"; right = "100.0%"; }
      else {
        var pc = (c * 100).toFixed(1), num = parseFloat(pc);
        if (num === 0) { left = "<0.1%"; right = ">99.9%"; }
        else if (num === 100) { left = ">99.9%"; right = "<0.1%"; }
        else { left = pc + "%"; right = (100 - num).toFixed(1) + "%"; }
      }
      var lines = [t("gr.of"), "", t("gr.moves")];
      [[-1, left, t("gr.slower")], [1, right, t("gr.faster")]].forEach(function (side) {
        var dir = side[0], text = lines.concat([side[2]]);
        font(ctx, 11); var vw = ctx.measureText(side[1]).width + 4;
        font(ctx, 10); var ew = 0;
        text.forEach(function (s) { ew = Math.max(ew, ctx.measureText(s).width); });
        ew += 4;                                     // the symbol clip is not measured in the SWF
        var w = Math.max(vw, ew), h = 15 + 4 * 10 * EM_H + 4;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillRect(dir < 0 ? cursorX - 5 - w : cursorX + 5, top + 1, w, h);
        ctx.fillStyle = "#000000"; ctx.textAlign = dir < 0 ? "right" : "left";
        font(ctx, 11); ctx.fillText(side[1], cursorX + dir * 7, top + 1 + 2 + ASC * 11 + TB);
        font(ctx, 10);
        text.forEach(function (s, i) { ctx.fillText(s, cursorX + dir * 7, top + 16 + 2 + ASC * 10 + TB + i * 10 * EM_H); });
        displayText(ctx, selected.def.sym, cursorX + dir * 7, top + 31,
          { size: 10, ratio: 1.3, h: dir < 0 ? "right" : "left", v: "top" });
      });
    }
    /* Proportions Adjuster: 20 px bars, 13 px apart, 150 px for a full amount */
    function proportions(ctx) {
      var ox = BARS.x, oy = BARS.y, W = BARS.gap + GAS_LIMIT * (BARS.w + BARS.gap), H = BARS.gap + BARS.h;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(ox - W / 2, oy - H, W, H);
      ctx.strokeStyle = "#c0c0c0"; ctx.lineWidth = 1; ctx.strokeRect(ox - W / 2, oy - H, W, H);
      used.forEach(function (g, i) {
        var G = barGeom(g, i), mid = (G.x1 + G.x2) / 2, sel = g === selected;
        var over = !running && ((hover && hover.kind === "pbar" && hover.g === g) || (press && press.kind === "pbar" && press.g === g));
        ctx.fillStyle = rgba(g, sel ? 0.7 : 0.4); ctx.fillRect(G.x1, G.y, BARS.w, oy - G.y);
        ctx.strokeStyle = rgba(g, over ? 1 : 0.5); ctx.strokeRect(G.x1, G.y, BARS.w, oy - G.y);
        if (over) {                                   // PA Arrows, tinted with the gas colour
          ctx.fillStyle = g.def.css;
          if (g.fraction < 1) { ctx.beginPath(); ctx.moveTo(mid, G.y - 10); ctx.lineTo(mid + 7, G.y - 4); ctx.lineTo(mid - 7, G.y - 4); ctx.fill(); }
          if (g.fraction > 0) { ctx.beginPath(); ctx.moveTo(mid, G.y + 10); ctx.lineTo(mid - 7, G.y + 4); ctx.lineTo(mid + 7, G.y + 4); ctx.fill(); }
        }
      });
      used.forEach(function (g, i) {
        var G = barGeom(g, i), sel = g === selected;
        displayText(ctx, g.def.sym, (G.x1 + G.x2) / 2, oy + 4,
          { h: "center", v: "top", bold: sel, color: sel ? "#404040" : "#000000" });
      });
    }
    /* Gas List: 290 × 21 entries in a white box; the selected one on 10 % black, bold */
    function gasList(ctx) {
      ctx.fillStyle = "#ffffff"; ctx.fillRect(LIST.x - 5, LIST.y - 5, LIST.w + 10, GAS_LIMIT * LIST.row + 10);
      ctx.strokeStyle = "#c0c0c0"; ctx.lineWidth = 1;
      ctx.strokeRect(LIST.x - 5, LIST.y - 5, LIST.w + 10, GAS_LIMIT * LIST.row + 10);
      var sum = 0;
      used.forEach(function (g) { sum += g.fraction; });
      used.forEach(function (g, i) {
        var y0 = LIST.y + i * LIST.row, cy = y0 + LIST.row / 2, sel = g === selected;
        if (sel) { ctx.fillStyle = "rgba(0,0,0,0.1)"; ctx.fillRect(LIST.x, y0, LIST.w, LIST.row); }
        if (hover && hover.kind === "row" && hover.g === g && !press) {
          ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.strokeRect(LIST.x, y0, LIST.w, LIST.row);
        }
        ctx.fillStyle = g.def.css; ctx.beginPath(); ctx.arc(LIST.x + 14, cy, 3, 0, TAU); ctx.fill();
        var o = { v: "center", bold: sel, color: sel ? "#404040" : "#000000" };
        var pct = 100 * g.fraction / sum;
        o.h = "left"; displayText(ctx, t(g.def.key) + " (" + g.def.sym + ")", LIST.x + 29, cy, o);
        o.h = "center"; displayText(ctx, Math.round(g.def.mass) + " u", LIST.x + 195, cy, o);
        o.h = "right"; displayText(ctx, isFinite(pct) && pct >= 0 && pct <= 100 ? pct.toFixed(1) + "%" : "--", LIST.x + 280, cy, o);
      });
    }
    /* FComboBox: a white label box and the 16-px DownArrow skin scaled to the row */
    function arrowButton(ctx, x, y, s, enabled) {
      var k = s / 16;
      ctx.fillStyle = "#808080"; ctx.fillRect(x, y, s, s);
      ctx.fillStyle = "#e8e8e8"; ctx.fillRect(x + k, y + k, s - 2 * k, s - 2 * k);
      ctx.fillStyle = enabled ? "#000000" : "#808080";
      ctx.beginPath(); ctx.moveTo(x + 4.8 * k, y + 6.05 * k); ctx.lineTo(x + 11.2 * k, y + 6.05 * k);
      ctx.lineTo(x + 8 * k, y + 9.95 * k); ctx.closePath(); ctx.fill();
    }
    function combo(ctx) {
      var c = COMBO, en = comboEnabled(), items = comboItems();
      ctx.fillStyle = en ? "#ffffff" : "#c2c2c2"; ctx.fillRect(c.x, c.y, c.w - c.h, c.h);
      if (en) { ctx.fillStyle = "#666666"; ctx.fillRect(c.x, c.y, 1, c.h); }
      font(ctx, 12); ctx.fillStyle = en ? "#000000" : "#888888";
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.save(); ctx.beginPath(); ctx.rect(c.x, c.y, c.w - c.h, c.h); ctx.clip();
      ctx.fillText(t(items[0].key), c.x + 3.7, c.y + 13.6);
      ctx.restore();
      arrowButton(ctx, c.x + c.w - c.h, c.y, c.h, en);
    }
    function comboList(ctx) {
      var c = COMBO, items = comboItems(), top = c.y + c.h, h = items.length * c.row + 2;
      ctx.fillStyle = "#ffffff"; ctx.fillRect(c.x, top, c.w, h);
      ctx.strokeStyle = "#666666"; ctx.lineWidth = 1; ctx.strokeRect(c.x + 0.5, top + 0.5, c.w - 1, h - 1);
      font(ctx, 12); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      items.forEach(function (it, i) {
        var y = top + 1 + i * c.row;
        if (i === comboHover) { ctx.fillStyle = "#999999"; ctx.fillRect(c.x + 1, y, c.w - 2, c.row); }
        ctx.fillStyle = i === comboHover ? "#ffffff" : "#000000";
        ctx.fillText(t(it.key), c.x + 4, y + 12.6);
      });
    }

    function draw() {
      var ctx = S.ctx;
      ctx.save();
      ctx.fillStyle = "#cccccc"; ctx.fillRect(0, 0, S.W, S.H);
      ctx.translate(0, OY);
      PANELS.forEach(function (b) { panel(ctx, b); });
      slider(ctx, SL_T, !running);
      checkBox(ctx, CHK_ESC, allowEscape, !running);
      slider(ctx, SL_V, !running && allowEscape);
      pushButton(ctx, BTN_START, running ? "gr.stop" : "gr.start", true);
      proportions(ctx);
      pushButton(ctx, BTN_REMOVE, "gr.remove", !running && !!selected);
      gasList(ctx);
      pushButton(ctx, BTN_RESETP, "gr.resetProps", !running);
      combo(ctx);
      chamber(ctx);
      axisLabels(ctx);
      plot(ctx);
      escapeLabel(ctx);
      checkBox(ctx, CHK_INFO, showInfo, showCursor);
      checkBox(ctx, CHK_CUR, showCursor, true);
      if (showCursor) cursorOverlay(ctx);
      if (comboOpen) comboList(ctx);
      ctx.restore();
    }
    S.onDraw(draw);
    S.refreshers.push(function () { menuSig = ""; syncSidebar(); });
    changed();
  }
});
