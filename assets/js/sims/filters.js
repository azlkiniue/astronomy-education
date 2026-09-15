/* Light and Filters Simulator ---------------------------------------------------
   Faithful rebuild of the NAAP "filters.swf". A light source at one end of an
   optical bench, a rack that holds up to four filters, and a detector at the
   other end. The bench spells out the whole calculation:

       emitted distribution  ×  combined filter transmittance  =  detected

   with a large colour swatch at each end showing what the eye would actually
   see. Both swatches are computed properly — each spectrum is integrated
   against the CIE 1931 colour-matching functions and converted to sRGB on the
   original's absolute brightness scale — so the detected colour shifts hue
   *and* dims as filters are stacked, and both colours darken to black as the
   source's peak height goes to 0%, exactly as the original does.

   Source distributions: blackbody (temperature + peak height), gaussian (peak
   wavelength + width + peak height), a piecewise curve you draw by dragging
   across the plot, and the sun's spectrum as measured from space (the
   original's own solar data). Every distribution is plotted on a fixed
   intensity axis, so lowering the peak height flattens the curves.

   Predefined filters are the Johnson U, B, V and R bands plus an atmospheric
   transmission curve; custom filters can be added, either gaussian or, like
   the original's piecewise filters, a curve you draw on the filter plot.
   Drag a filter from the list into a rack slot, or click a slot to empty it.    */
Sim.create({
  id: "filters",
  width: 900, height: 646,
  strings: {
    en: {
      "fl.source": "Light Source", "fl.dist": "distribution type",
      "fl.bb": "blackbody", "fl.gauss": "gaussian", "fl.piece": "piecewise (draw it)", "fl.sun": "sun",
      "fl.sunNote": "this is the spectrum of the sun as observed from space",
      "fl.temp": "temperature", "fl.peakH": "peak height", "fl.peakL": "peak wavelength", "fl.width": "width",
      "fl.filters": "Filters", "fl.selected": "selected filter", "fl.addRack": "add to rack",
      "fl.clearRack": "empty the rack", "fl.addCustom": "add a custom filter", "fl.removeCustom": "remove custom filter",
      "fl.cType": "custom distribution type",
      "fl.cPeak": "custom peak wavelength", "fl.cWidth": "custom width", "fl.cMax": "custom max transmittance",
      "fl.cDrawHint": "drag across the filter plot to draw the custom filter's curve",
      "fl.emittedC": "emitted color", "fl.emittedD": "emitted distribution",
      "fl.combined": "combined filter transmittance", "fl.detectedD": "detected distribution",
      "fl.detectedC": "detected color", "fl.rack": "filter rack",
      "fl.srcPanel": "Light Source Details", "fl.filPanel": "Filter Details",
      "fl.intensity": "Intensity", "fl.trans": "Transmittance", "fl.wl": "Wavelength",
      "fl.list": "Filter List", "fl.note": "The U, B, V and R filters are standard filters commonly used in astronomical research.",
      "fl.drawHint": "drag across the source plot to draw the curve",
      "fl.dragHint": "drag a filter into a rack slot; click a slot to empty it",
      "fl.rPeak": "source peak", "fl.rThru": "flux transmitted", "fl.rRack": "filters in rack",
      "fl.atm": "atmosphere", "fl.custom": "custom"
    },
    id: {
      "fl.source": "Sumber Cahaya", "fl.dist": "jenis distribusi",
      "fl.bb": "benda hitam", "fl.gauss": "gaussian", "fl.piece": "sembarang (gambar sendiri)", "fl.sun": "Matahari",
      "fl.sunNote": "ini adalah spektrum Matahari sebagaimana teramati dari luar angkasa",
      "fl.temp": "suhu", "fl.peakH": "tinggi puncak", "fl.peakL": "panjang gelombang puncak", "fl.width": "lebar",
      "fl.filters": "Filter", "fl.selected": "filter terpilih", "fl.addRack": "pasang ke rak",
      "fl.clearRack": "kosongkan rak", "fl.addCustom": "tambah filter khusus", "fl.removeCustom": "hapus filter khusus",
      "fl.cType": "jenis distribusi khusus",
      "fl.cPeak": "puncak filter khusus", "fl.cWidth": "lebar filter khusus", "fl.cMax": "transmitansi maks khusus",
      "fl.cDrawHint": "seret pada grafik filter untuk menggambar kurva filter khusus",
      "fl.emittedC": "warna terpancar", "fl.emittedD": "distribusi terpancar",
      "fl.combined": "transmitansi filter gabungan", "fl.detectedD": "distribusi terdeteksi",
      "fl.detectedC": "warna terdeteksi", "fl.rack": "rak filter",
      "fl.srcPanel": "Rincian Sumber Cahaya", "fl.filPanel": "Rincian Filter",
      "fl.intensity": "Intensitas", "fl.trans": "Transmitansi", "fl.wl": "Panjang gelombang",
      "fl.list": "Daftar Filter", "fl.note": "Filter U, B, V, dan R adalah filter baku yang lazim dipakai dalam riset astronomi.",
      "fl.drawHint": "seret pada grafik sumber untuk menggambar kurvanya",
      "fl.dragHint": "seret filter ke slot rak; klik slot untuk mengosongkannya",
      "fl.rPeak": "puncak sumber", "fl.rThru": "fluks diteruskan", "fl.rRack": "filter di rak",
      "fl.atm": "atmosfer", "fl.custom": "khusus"
    }
  },
  about: {
    en: "<p>Everything an astronomer measures is a product of three curves: what the source emits, what the filters let through, and what the detector responds to. This bench shows the first two multiplying together — <strong>emitted × transmittance = detected</strong> — and then renders both ends as the colour a human eye would actually perceive.</p>" +
        "<p>The <strong>U, B, V and R</strong> bands are the standard Johnson–Cousins filters. Measuring a star through two of them and taking the difference gives a <strong>colour index</strong> such as B−V, which is a thermometer: hot stars are bright in B relative to V, cool stars the reverse. That is why filters matter so much — a single brightness tells you very little, but a brightness *through a known band* tells you temperature, reddening and composition.</p>" +
        "<p>Stack filters and watch the detected curve collapse. Transmittances multiply, so two filters whose bands barely overlap pass almost nothing. Add the <strong>atmosphere</strong> filter to see why the ultraviolet is invisible from the ground and why space telescopes exist at all.</p>",
    id: "<p>Semua yang diukur astronom adalah hasil kali tiga kurva: apa yang dipancarkan sumber, apa yang diteruskan filter, dan apa yang direspons detektor. Bangku optik ini memperlihatkan dua yang pertama saling dikalikan — <strong>terpancar × transmitansi = terdeteksi</strong> — lalu menampilkan kedua ujungnya sebagai warna yang benar-benar dilihat mata manusia.</p>" +
        "<p>Pita <strong>U, B, V, dan R</strong> adalah filter baku Johnson–Cousins. Mengukur sebuah bintang melalui dua di antaranya lalu mengambil selisihnya menghasilkan <strong>indeks warna</strong> seperti B−V, yang berfungsi sebagai termometer: bintang panas lebih terang di B dibanding V, bintang dingin sebaliknya. Itulah sebabnya filter begitu penting — satu nilai kecerahan hampir tak bermakna, tetapi kecerahan *melalui pita yang diketahui* memberi tahu suhu, pemerahan, dan komposisi.</p>" +
        "<p>Tumpuk beberapa filter dan lihat kurva terdeteksi runtuh. Transmitansi saling dikalikan, sehingga dua filter yang pitanya nyaris tak bertumpang tindih meneruskan hampir nol. Pasang filter <strong>atmosfer</strong> untuk memahami mengapa ultraungu tak terlihat dari permukaan Bumi, dan mengapa teleskop antariksa perlu ada.</p>"
  },
  build: function (S) {
    var C = {
      panel: "#0e1530", border: "#2c3a66", text: "#e8ecf8", dim: "#9fabce",
      plotBg: "#070c1a", grid: "rgba(140,160,210,.14)", curve: "#dfe7ff", accent: "#6ea8fe"
    };
    var LO = 300, HI = 900, NB = 120;            // wavelength window (nm) and piecewise bin count

    /* ===================== colour science: spectrum → sRGB ===================== */
    // CIE 1931 colour-matching functions, multi-lobe Gaussian fits (Wyman et al. 2013)
    function g(x, mu, s1, s2) { var t = (x - mu) / (x < mu ? s1 : s2); return Math.exp(-0.5 * t * t); }
    function xbar(l) { return 1.056 * g(l, 599.8, 37.9, 31.0) + 0.362 * g(l, 442.0, 16.0, 26.7) - 0.065 * g(l, 501.1, 20.4, 26.2); }
    function ybar(l) { return 0.821 * g(l, 568.8, 46.9, 40.5) + 0.286 * g(l, 530.9, 16.3, 31.1); }
    function zbar(l) { return 1.217 * g(l, 437.0, 11.8, 36.0) + 0.681 * g(l, 459.0, 26.0, 13.8); }

    function xyzOf(fn) {
      var X = 0, Y = 0, Z = 0;
      for (var l = 360; l <= 830; l += 3) { var s = Math.max(0, fn(l)); X += s * xbar(l); Y += s * ybar(l); Z += s * zbar(l); }
      return { X: X * 3, Y: Y * 3, Z: Z * 3 };
    }
    function xyzToRGB(X, Y, Z) {
      var r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
      var gg = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
      var b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
      var m = Math.min(r, gg, b);
      if (m < 0) { r -= m; gg -= m; b -= m; }        // desaturate out-of-gamut hues toward white
      return [r, gg, b];
    }
    function gam(v) { v = Math.max(0, Math.min(1, v)); return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; }
    // hue only, at full brightness — for the rainbow strips under the plots
    function colorOf(fn) {
      var c = xyzOf(fn);
      var sum = c.X + c.Y + c.Z;
      if (sum <= 1e-12) return "rgb(6,8,16)";
      var rgb = xyzToRGB(c.X / sum, c.Y / sum, c.Z / sum);
      var mx = Math.max(rgb[0], rgb[1], rgb[2]) || 1;
      return "rgb(" + [0, 1, 2].map(function (i) { return Math.round(255 * gam(rgb[i] / mx)); }).join(",") + ")";
    }
    var monoCache = {};
    function monoColor(l) {                        // the colour of a single wavelength
      var k = Math.round(l);
      if (monoCache[k]) return monoCache[k];
      return (monoCache[k] = colorOf(function (x) { return Math.exp(-0.5 * Math.pow((x - k) / 5, 2)); }));
    }
    // The swatch colour, ported from the original's getColorFromXYZ: nothing is
    // normalised, so brightness follows the spectrum's actual intensity. The
    // tristimulus values (∫ s·x̄ dλ with λ in nm) go to linear RGB, out-of-gamut
    // colours are desaturated by adding white, then a fixed white level of 125
    // (a flat 100% spectrum is just about full white), Rec. 709 gamma, clip at 255.
    // A dimmer source is therefore a darker colour, and a source at 0% is black.
    function swatchColor(fn) {
      var c = xyzOf(fn);
      var rgb = xyzToRGB(c.X, c.Y, c.Z);
      return "rgb(" + rgb.map(function (v) {
        v /= 125;
        v = v > 0.018 ? 1.099 * Math.pow(v, 0.45) - 0.099 : 4.5 * v;
        return Math.max(0, Math.min(255, Math.floor(255 * v)));
      }).join(",") + ")";
    }

    /* ============================ the light source ============================ */
    var src = { type: "blackbody", temp: 6000, peakH: 1.0, peakL: 550, width: 60 };
    var piece = new Array(NB);
    for (var i0 = 0; i0 < NB; i0++) piece[i0] = 0.55 + 0.4 * Math.exp(-0.5 * Math.pow((i0 - NB * 0.42) / (NB * 0.18), 2));

    function planck(l, T) {                        // relative Planck function, λ in nm
      var lm = l * 1e-9;
      return 1 / (Math.pow(lm, 5) * (Math.exp(0.0143877696 / (lm * T)) - 1));
    }
    var bbNorm = 0;
    // The sun as observed from space: the original's solarData table (1 nm steps,
    // normalised to 1 at its 451 nm peak), sampled every 5 nm across the window
    // exactly as the original samples it, which is what gives the curve its
    // jagged absorption dips (the deep one at 430 nm is the Fraunhofer G band).
    var SUN = [
      .209, .297, .239, .316, .362, .383, .534, .48, .504, .442, .477, .543, .487, .537, .597, .48, .547, .484, .575, .536,
      .813, .817, .77, .824, .802, .809, .636, .776, .853, .909, .977, .966, .96, .944, .928, .981, .979, .905, .947, .95,
      .904, .915, .887, .864, .847, .886, .884, .879, .844, .878, .878, .88, .826, .838, .834, .842, .84, .837, .791, .821,
      .814, .817, .788, .78, .783, .759, .768, .762, .748, .743, .734, .706, .72, .718, .708, .695, .69, .677, .689, .675,
      .674, .673, .655, .637, .632, .628, .618, .615, .595, .601, .592, .593, .59, .584, .573, .557, .542, .54, .54, .525,
      .522, .515, .513, .516, .495, .498, .493, .484, .485, .478, .428, .415, .457, .449, .453, .437, .446, .442, .436, .419,
      .416
    ];
    // a sampled curve: straight lines between evenly spaced samples spanning the window, 0 outside it
    function sampleBins(bins, l) {
      var n = bins.length - 1, f = (l - LO) / (HI - LO) * n;
      if (f < 0 || f > n) return 0;
      var i = Math.floor(f), t = f - i;
      return (1 - t) * bins[i] + t * bins[Math.min(n, i + 1)];
    }
    // the source's curve with its highest point at 1, before peak height applies
    function shape(l) {
      if (src.type === "blackbody") return planck(l, src.temp) / bbNorm;
      if (src.type === "gaussian") return Math.exp(-0.5 * Math.pow((l - src.peakL) / src.width, 2));
      if (src.type === "sun") return sampleBins(SUN, l);
      return sampleBins(piece, l);
    }
    // As in the original, peak height scales only the blackbody and gaussian
    // curves; a drawn curve is used as drawn and the sun's spectrum as measured.
    function hasPeakHeight() { return src.type === "blackbody" || src.type === "gaussian"; }
    function emitted(l) { return hasPeakHeight() ? src.peakH * shape(l) : shape(l); }
    function refreshNorm() {
      bbNorm = 0;
      for (var l = LO; l <= HI; l += 2) bbNorm = Math.max(bbNorm, planck(l, src.temp));
      // Wien's law puts the true peak outside the window for cool or hot sources;
      // normalising on the visible window keeps the plot readable either way
      var wien = 2.8977719e6 / src.temp;
      if (wien > LO && wien < HI) bbNorm = planck(wien, src.temp);
    }
    refreshNorm();

    /* ================================ filters ================================ */
    function gaussFilter(peak, fwhm, max) {
      var s = fwhm / 2.3548;
      return function (l) { return max * Math.exp(-0.5 * Math.pow((l - peak) / s, 2)); };
    }
    // A custom filter is either a gaussian set by its sliders or, like the
    // original's piecewise filters, a curve drawn on the filter plot.
    function customCurve(f) {
      if (f.type === "piecewise") return function (l) { return sampleBins(f.piece, l); };
      return gaussFilter(f.peak, f.width, f.max);
    }
    // a plausible ground-level atmospheric transmission: opaque in the UV, clear
    // through the optical, with water and CO₂ bands biting into the near infrared
    function atmosphere(l) {
      if (l < 310) return 0;
      var t = 0.92 * (1 - Math.exp(-(l - 305) / 22));
      t *= 1 - 0.55 * Math.exp(-0.5 * Math.pow((l - 725) / 9, 2));
      t *= 1 - 0.75 * Math.exp(-0.5 * Math.pow((l - 762) / 6, 2));
      t *= 1 - 0.85 * Math.exp(-0.5 * Math.pow((l - 822) / 16, 2));
      t *= 1 - 0.30 * Math.exp(-0.5 * Math.pow((l - 690) / 7, 2));
      return Math.max(0, Math.min(1, t));
    }
    var filters = [
      { id: "U", name: "U ('UV')", color: "#8f6fd8", f: gaussFilter(365, 66, 0.55) },
      { id: "B", name: "B ('blue')", color: "#5b8cff", f: gaussFilter(445, 94, 0.65) },
      { id: "V", name: "V ('visual')", color: "#7ad07a", f: gaussFilter(551, 88, 0.80) },
      { id: "R", name: "R ('red')", color: "#e0703f", f: gaussFilter(658, 138, 0.75) },
      { id: "atm", name: "atmosphere", color: "#9fabce", f: atmosphere }
    ];
    var custom = { peak: 500, width: 40, max: 0.9 };
    var selected = "V";
    var RACK = 4, rack = [null, null, null, null];

    function filterById(id) { for (var i = 0; i < filters.length; i++) if (filters[i].id === id) return filters[i]; return null; }
    function combined(l) {
      var t = 1;
      for (var i = 0; i < RACK; i++) if (rack[i]) t *= Math.max(0, Math.min(1, filterById(rack[i]).f(l)));
      return t;
    }
    function rackEmpty() { return rack.every(function (r) { return !r; }); }
    function detected(l) { return emitted(l) * combined(l); }
    // the light after it has passed through the first n rack slots
    function passedSlots(n) {
      return function (l) {
        var v = emitted(l);
        for (var i = 0; i < n; i++) if (rack[i]) v *= Math.max(0, Math.min(1, filterById(rack[i]).f(l)));
        return v;
      };
    }
    function integrate(fn) { var s = 0; for (var l = LO; l <= HI; l += 2) s += Math.max(0, fn(l)); return s * 2; }

    /* ================================ controls ================================ */
    var controlsEl = S.canvas.parentNode.parentNode.querySelector(".sim-controls");
    S.group("fl.source");
    var typeSel = S.select({
      labelKey: "fl.dist", value: "blackbody",
      options: [{ v: "blackbody", labelKey: "fl.bb" }, { v: "gaussian", labelKey: "fl.gauss" }, { v: "piecewise", labelKey: "fl.piece" },
                { v: "sun", labelKey: "fl.sun" }],
      on: function (v) { src.type = v; syncSourceCtls(); upd(); }
    });
    var tempCtl = S.slider({
      labelKey: "fl.temp", min: 2000, max: 25000, value: src.temp, step: 100,
      format: function (v) { return Math.round(v) + " K"; },
      on: function (v) { src.temp = v; refreshNorm(); upd(); }
    });
    var peakLCtl = S.slider({
      labelKey: "fl.peakL", min: 300, max: 900, value: src.peakL, step: 1,
      format: function (v) { return Math.round(v) + " nm"; },
      on: function (v) { src.peakL = v; upd(); }
    });
    var widthCtl = S.slider({
      labelKey: "fl.width", min: 5, max: 200, value: src.width, step: 1,
      format: function (v) { return Math.round(v) + " nm"; },
      on: function (v) { src.width = v; upd(); }
    });
    var peakHCtl = S.slider({
      labelKey: "fl.peakH", min: 0, max: 1, value: src.peakH, step: 0.01,
      format: function (v) { return Math.round(v * 100) + "%"; },
      on: function (v) { src.peakH = v; upd(); }
    });
    var drawHint = note("fl.drawHint");

    S.group("fl.filters");
    var selSel = S.select({
      labelKey: "fl.selected", value: "V",
      options: filters.map(function (f) { return { v: f.id, label: f.name }; }),
      on: function (v) { selected = v; syncCustomCtls(); upd(); }
    });
    var selSelEl = controlsEl.lastElementChild.querySelector("select");
    S.button({ labelKey: "fl.addRack", primary: true, on: function () { addToRack(selected); } });
    S.button({ labelKey: "fl.clearRack", on: function () { rack = [null, null, null, null]; upd(); } });
    S.button({ labelKey: "fl.addCustom", on: addCustom });
    S.button({ labelKey: "fl.removeCustom", on: removeCustom });
    var cType = S.select({
      labelKey: "fl.cType", value: "gaussian",
      options: [{ v: "gaussian", labelKey: "fl.gauss" }, { v: "piecewise", labelKey: "fl.piece" }],
      on: setCustomType
    });
    var cTypeEl = controlsEl.lastElementChild;
    var cPeak = S.slider({
      labelKey: "fl.cPeak", min: 300, max: 900, value: custom.peak, step: 1,
      format: function (v) { return Math.round(v) + " nm"; }, on: function (v) { editCustom("peak", v); }
    });
    var cWidth = S.slider({
      labelKey: "fl.cWidth", min: 5, max: 300, value: custom.width, step: 1,
      format: function (v) { return Math.round(v) + " nm"; }, on: function (v) { editCustom("width", v); }
    });
    var cMax = S.slider({
      labelKey: "fl.cMax", min: 0.05, max: 1, value: custom.max, step: 0.01,
      format: function (v) { return Math.round(v * 100) + "%"; }, on: function (v) { editCustom("max", v); }
    });
    var cDrawHint = note("fl.cDrawHint");
    var dragHint = note("fl.dragHint");

    var outPeak = S.readout({ labelKey: "fl.rPeak" });
    var outThru = S.readout({ labelKey: "fl.rThru" });
    var outRack = S.readout({ labelKey: "fl.rRack" });

    function note(key) {
      var p = document.createElement("p");
      p.className = "sim-note"; p.setAttribute("data-i18n", key);
      controlsEl.appendChild(p);
      return p;
    }
    function show(ctl, on) {
      var el = ctl.input ? ctl.input.parentNode : ctl;
      el.style.display = on ? "" : "none";
    }
    function syncSourceCtls() {
      show(tempCtl, src.type === "blackbody");
      show(peakLCtl, src.type === "gaussian");
      show(widthCtl, src.type === "gaussian");
      show(peakHCtl, hasPeakHeight());
      show(drawHint, src.type === "piecewise");
    }
    var customSeq = 0;
    function isCustom(id) { return /^c\d+$/.test(id); }
    function syncCustomCtls() {
      var f = isCustom(selected) ? filterById(selected) : null;
      var bell = !!f && f.type === "gaussian";
      show(cTypeEl, !!f); show(cPeak, bell); show(cWidth, bell); show(cMax, bell);
      show(cDrawHint, !!f && !bell);
      if (f) {
        cTypeEl.querySelector("select").value = f.type;
        cPeak.input.value = f.peak; cWidth.input.value = f.width; cMax.input.value = f.max;
        S.refreshers.forEach(function (fn) { if (fn !== upd) fn(); });
      }
    }
    function addCustom() {
      var id = "c" + (++customSeq);
      var f = { id: id, name: I18N.t("fl.custom") + " " + customSeq, color: "#ffd166", type: "gaussian",
                peak: custom.peak, width: custom.width, max: custom.max, piece: null };
      f.f = customCurve(f);
      filters.push(f);
      rebuildSelect(id); selected = id; syncCustomCtls(); upd();
    }
    function setCustomType(type) {
      if (!isCustom(selected)) return;
      var f = filterById(selected);
      // The first switch to piecewise starts the drawing from the bell curve, so
      // the filter keeps its shape until you draw over it. A filter remembers
      // both its sliders and its drawing when you switch back and forth.
      if (type === "piecewise" && !f.piece) {
        var bell = gaussFilter(f.peak, f.width, f.max);
        f.piece = new Array(NB);
        for (var i = 0; i < NB; i++) f.piece[i] = bell(LO + (HI - LO) * i / (NB - 1));
      }
      f.type = type; f.f = customCurve(f);
      syncCustomCtls(); upd();
    }
    function removeCustom() {
      if (!isCustom(selected)) return;
      filters = filters.filter(function (f) { return f.id !== selected; });
      for (var i = 0; i < RACK; i++) if (rack[i] === selected) rack[i] = null;
      selected = filters.length ? filters[0].id : null;
      rebuildSelect(selected); syncCustomCtls(); upd();
    }
    function editCustom(key, v) {
      if (!isCustom(selected)) return;
      var f = filterById(selected);
      f[key] = v; f.f = customCurve(f);
      upd();
    }
    function rebuildSelect(value) {
      selSelEl.innerHTML = "";
      filters.forEach(function (f) {
        var o = document.createElement("option"); o.value = f.id; o.textContent = f.name; selSelEl.appendChild(o);
      });
      selSelEl.value = value;
    }
    function addToRack(id) {
      if (!id) return;
      for (var i = 0; i < RACK; i++) if (!rack[i]) { rack[i] = id; upd(); return; }
    }

    function upd() {
      // the source's peak wavelength, read off the curve's shape so it stays
      // meaningful when the peak height is 0%
      var best = LO, bv = 0;
      for (var l = LO; l <= HI; l += 1) { var v = shape(l); if (v > bv) { bv = v; best = l; } }
      outPeak(bv > 0 ? Math.round(best) + " nm" : "—");
      var e = integrate(emitted), d = integrate(detected);
      outThru(e > 0 ? (100 * d / e).toFixed(1) + "%" : "—");
      var names = rack.filter(Boolean).map(function (r) { var f = filterById(r); return f ? f.id : "?"; });
      outRack(names.length ? names.join(" · ") : "—");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ============================ canvas geometry ============================ */
    var BENCH = { x: 8, y: 8, w: 884, h: 214 };
    var MINI = 74;                                            // mini-plot height
    var EMC = { x: 96, y: 98, rx: 54, ry: 40 };               // emitted colour swatch
    var EMD = { x: 176, y: 58, w: 118, h: MINI };
    var CMB = { x: 340, y: 58, w: 140, h: MINI };
    var DTD = { x: 526, y: 58, w: 118, h: MINI };
    var DTC = { x: 762, y: 98, rx: 54, ry: 40 };
    var SLOT = { y: 172, w: 30, h: 34, gap: 10, x0: 352 };     // rack slots
    var SRC = { x: 172, y: 160, w: 92, h: 46 };
    var DET = { x: 556, y: 160, w: 92, h: 46 };

    // Every distribution plot shares one fixed axis: intensity or transmittance
    // 1 sits just under the top edge (the headroom keeps a curve at 1 visible),
    // so a lower peak height really does draw a flatter curve.
    var YMAX = 1.06;
    var SP = { x: 66, y: 292, w: 358, h: 236 };                // source plot
    // The filter plot's rotated axis label and its 100% / 0% ticks reach about
    // 33 px left of the plot, so the list stops short enough to leave them a gap.
    var FP = { x: 650, y: 292, w: 232, h: 236 };               // filter plot
    var LIST = { x: 462, y: 286, w: 146, rowH: 34 };           // filter list

    function slotRect(i) { return { x: SLOT.x0 + i * (SLOT.w + SLOT.gap), y: SLOT.y, w: SLOT.w, h: SLOT.h }; }
    function listRect(i) { return { x: LIST.x, y: LIST.y + i * LIST.rowH, w: LIST.w, h: LIST.rowH - 6 }; }

    /* =============================== interaction =============================== */
    function localXY(ev) {
      var r = S.canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * S.W / r.width, y: (ev.clientY - r.top) * S.H / r.height };
    }
    function inRect(p, r) { return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h; }
    var dragging = null;
    var drawing = null;          // while drawing a curve: { bins, box } — its samples and the plot it's drawn on

    S.canvas.addEventListener("pointerdown", function (ev) {
      var p = localXY(ev), i;
      // pick a filter up out of the list
      for (i = 0; i < filters.length; i++) {
        if (inRect(p, listRect(i))) {
          selected = filters[i].id; rebuildSelect(selected); syncCustomCtls();
          dragging = { id: filters[i].id, x: p.x, y: p.y };
          S.canvas.setPointerCapture(ev.pointerId); upd(); return;
        }
      }
      // click a filled slot to empty it, or an empty one to drop the selection in
      for (i = 0; i < RACK; i++) {
        if (inRect(p, slotRect(i))) {
          rack[i] = rack[i] ? null : selected;
          upd(); return;
        }
      }
      // draw the piecewise source curve, or the selected custom filter's piecewise curve
      var sel = filterById(selected);
      if (src.type === "piecewise" && inRect(p, SP)) drawing = { bins: piece, box: SP };
      else if (sel && sel.type === "piecewise" && inRect(p, FP)) drawing = { bins: sel.piece, box: FP };
      if (drawing) { lastPaint = null; S.canvas.setPointerCapture(ev.pointerId); paintCurve(p); }
    });
    S.canvas.addEventListener("pointermove", function (ev) {
      var p = localXY(ev);
      if (dragging) { dragging.x = p.x; dragging.y = p.y; S.requestDraw(); }
      else if (drawing) paintCurve(p);
    });
    S.canvas.addEventListener("pointerup", function (ev) {
      if (dragging) {
        var p = localXY(ev);
        for (var i = 0; i < RACK; i++) if (inRect(p, slotRect(i))) { rack[i] = dragging.id; break; }
        dragging = null; upd();
      }
      drawing = null; lastPaint = null;
    });
    // Paint the curve being drawn, joining up to the previous sample so a fast
    // drag leaves a continuous stroke rather than isolated spikes.
    var lastPaint = null;
    function paintCurve(p) {
      var bins = drawing.bins, box = drawing.box;
      var i = Math.round(Math.max(0, Math.min(NB - 1, (p.x - box.x) / box.w * (NB - 1))));
      var v = Math.max(0, Math.min(1, (1 - (p.y - box.y) / box.h) * YMAX));
      if (lastPaint && lastPaint.i !== i) {
        var step = i > lastPaint.i ? 1 : -1, n = Math.abs(i - lastPaint.i);
        for (var k = 1; k < n; k++) {
          var j = lastPaint.i + step * k;
          bins[j] = lastPaint.v + (v - lastPaint.v) * (k / n);
        }
      }
      bins[i] = v;
      lastPaint = { i: i, v: v };
      upd();
    }

    /* ================================= drawing ================================= */
    S.onDraw(function () {
      var ctx = S.ctx, t = I18N.t.bind(I18N);
      S.clear();
      drawBench(ctx, t);
      drawSourcePanel(ctx, t);
      drawFilterPanel(ctx, t);
      if (dragging) drawGhost(ctx, dragging);
    });

    function panel(ctx, x, y, w, h, title) {
      ctx.fillStyle = C.panel; ctx.strokeStyle = C.border; ctx.lineWidth = 1;
      roundRect(ctx, x, y, w, h, 10); ctx.fill(); ctx.stroke();
      if (title) {
        ctx.fillStyle = C.dim; ctx.font = "12px system-ui"; ctx.textAlign = "left";
        ctx.fillText(title, x + 14, y + 20);
      }
    }
    // a rainbow strip showing what each wavelength looks like
    function rainbow(ctx, x, y, w, h) {
      var grad = ctx.createLinearGradient(x, 0, x + w, 0);
      for (var i = 0; i <= 40; i++) {
        var l = LO + (HI - LO) * i / 40;
        grad.addColorStop(i / 40, (l < 380 || l > 720) ? "#0b0f1e" : monoColor(l));
      }
      ctx.fillStyle = grad; ctx.fillRect(x, y, w, h);
    }
    // plot fn over the wavelength window into the given box; ymax scales the y axis
    function plot(ctx, box, fn, ymax, col, fill) {
      ctx.save();
      // the clip reaches just below the box so a curve lying flat at zero shows its full stroke
      ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h + 1.5); ctx.clip();
      // one vertex per nanometre, so every 5 nm sample of the solar spectrum lands exactly
      var n = HI - LO;
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var l = LO + (HI - LO) * i / n;
        var v = Math.max(0, fn(l)) / ymax;
        var px = box.x + box.w * i / n, py = box.y + box.h * (1 - Math.min(1.2, v));
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      if (fill) {
        ctx.lineTo(box.x + box.w, box.y + box.h); ctx.lineTo(box.x, box.y + box.h); ctx.closePath();
        ctx.fillStyle = fill; ctx.fill();
      }
      ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.restore();
    }
    function miniPlot(ctx, box, fn, ymax, col, label, t) {
      ctx.fillStyle = C.plotBg; ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.strokeRect(box.x, box.y, box.w, box.h);
      plot(ctx, box, fn, ymax, col, null);
      ctx.fillStyle = C.dim; ctx.font = "10.5px system-ui"; ctx.textAlign = "center";
      ctx.fillText(label, box.x + box.w / 2, box.y - 8);
    }

    function drawBench(ctx, t) {
      panel(ctx, BENCH.x, BENCH.y, BENCH.w, BENCH.h, null);

      // the two colour swatches, on the absolute brightness scale
      var emittedColor = swatchColor(emitted);
      swatch(ctx, EMC, emittedColor, t("fl.emittedC"));
      swatch(ctx, DTC, swatchColor(detected), t("fl.detectedC"));

      miniPlot(ctx, EMD, emitted, YMAX, C.curve, t("fl.emittedD"), t);
      miniPlot(ctx, CMB, combined, YMAX, "#7ee0a0", t("fl.combined"), t);
      miniPlot(ctx, DTD, detected, YMAX, C.curve, t("fl.detectedD"), t);

      ctx.fillStyle = C.text; ctx.font = "20px system-ui"; ctx.textAlign = "center";
      ctx.fillText("×", (EMD.x + EMD.w + CMB.x) / 2, EMD.y + MINI / 2 + 7);
      ctx.fillText("=", (CMB.x + CMB.w + DTD.x) / 2, EMD.y + MINI / 2 + 7);

      // Source and detector boxes, with the beam running between them. The beam
      // carries the light's own colour, taking each filter's effect at its slot,
      // and is added onto the bench so a dark source sends no visible beam.
      var beamY = SRC.y + SRC.h / 2, x0 = SRC.x + SRC.w, beamColor = emittedColor;
      ctx.save();
      ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.45; ctx.lineWidth = 10; ctx.lineCap = "butt";
      for (var k = 0; k <= RACK; k++) {
        var x1 = k < RACK ? slotRect(k).x + SLOT.w / 2 : DET.x;
        ctx.strokeStyle = beamColor;
        ctx.beginPath(); ctx.moveTo(x0, beamY); ctx.lineTo(x1, beamY); ctx.stroke();
        if (k < RACK && rack[k]) beamColor = swatchColor(passedSlots(k + 1));
        x0 = x1;
      }
      ctx.restore();
      box3d(ctx, SRC, "ACME", "source");
      box3d(ctx, DET, "ACME", "detector");

      // the filter rack
      ctx.fillStyle = C.dim; ctx.font = "10.5px system-ui"; ctx.textAlign = "center";
      ctx.fillText(t("fl.rack"), SLOT.x0 + (RACK * (SLOT.w + SLOT.gap) - SLOT.gap) / 2, SLOT.y - 8);
      for (var i = 0; i < RACK; i++) {
        var r = slotRect(i);
        ctx.fillStyle = "rgba(160,180,235,.06)"; ctx.strokeStyle = C.border;
        ctx.lineWidth = 1; roundRect(ctx, r.x, r.y, r.w, r.h, 4); ctx.fill(); ctx.stroke();
        if (rack[i]) {
          var f = filterById(rack[i]);
          if (f) {
            ctx.fillStyle = f.color; ctx.globalAlpha = 0.55;
            roundRect(ctx, r.x + 2, r.y + 2, r.w - 4, r.h - 4, 3); ctx.fill(); ctx.globalAlpha = 1;
            ctx.fillStyle = "#08101f"; ctx.font = "600 11px system-ui"; ctx.textAlign = "center";
            ctx.fillText(f.id, r.x + r.w / 2, r.y + r.h / 2 + 4);
          }
        }
      }
    }
    function swatch(ctx, s, fill, label) {
      ctx.beginPath(); ctx.ellipse(s.x, s.y, s.rx, s.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = fill; ctx.fill();
      ctx.strokeStyle = "rgba(200,215,255,.35)"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.fillStyle = C.dim; ctx.font = "10.5px system-ui"; ctx.textAlign = "center";
      ctx.fillText(label, s.x, s.y - s.ry - 12);
    }
    function box3d(ctx, b, l1, l2) {
      ctx.fillStyle = "rgba(180,196,235,.16)"; ctx.strokeStyle = "rgba(210,222,255,.6)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + 10, b.y - 9); ctx.lineTo(b.x + b.w + 10, b.y - 9);
      ctx.lineTo(b.x + b.w, b.y); ctx.closePath();
      ctx.fillStyle = "rgba(180,196,235,.26)"; ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.x + b.w, b.y); ctx.lineTo(b.x + b.w + 10, b.y - 9);
      ctx.lineTo(b.x + b.w + 10, b.y + b.h - 9); ctx.lineTo(b.x + b.w, b.y + b.h); ctx.closePath();
      ctx.fillStyle = "rgba(150,168,210,.20)"; ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.text; ctx.font = "9.5px system-ui"; ctx.textAlign = "center";
      ctx.fillText(l1, b.x + b.w / 2, b.y + b.h / 2 - 2);
      ctx.fillText(l2, b.x + b.w / 2, b.y + b.h / 2 + 11);
    }

    function drawSourcePanel(ctx, t) {
      panel(ctx, 8, 232, 434, 406, t("fl.srcPanel"));
      ctx.fillStyle = C.plotBg; ctx.fillRect(SP.x, SP.y, SP.w, SP.h);
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.strokeRect(SP.x, SP.y, SP.w, SP.h);
      grid(ctx, SP);
      plot(ctx, SP, emitted, YMAX, C.curve, "rgba(223,231,255,.10)");
      axes(ctx, SP, t("fl.intensity"), t);
      if (src.type === "sun") {
        ctx.fillStyle = C.dim; ctx.font = "italic 10.5px system-ui"; ctx.textAlign = "center";
        wrap(ctx, t("fl.sunNote"), 8 + 217, 604, 400, 14);
      }
    }

    function drawFilterPanel(ctx, t) {
      panel(ctx, 450, 232, 442, 406, t("fl.filPanel"));

      // the filter list — a colour dot, the name, and a thumbnail of its curve
      ctx.fillStyle = C.dim; ctx.font = "11px system-ui"; ctx.textAlign = "left";
      ctx.fillText(t("fl.list"), LIST.x, LIST.y - 10);
      filters.forEach(function (f, i) {
        var r = listRect(i);
        var on = f.id === selected;
        ctx.fillStyle = on ? "rgba(110,168,254,.16)" : "rgba(160,180,235,.05)";
        ctx.strokeStyle = on ? C.accent : C.border; ctx.lineWidth = 1;
        roundRect(ctx, r.x, r.y, r.w, r.h, 6); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(r.x + 14, r.y + r.h / 2, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = f.color; ctx.fill();
        ctx.fillStyle = C.text; ctx.font = "11px system-ui"; ctx.textAlign = "left";
        ctx.fillText(f.name, r.x + 26, r.y + r.h / 2 + 4);
        // thumbnail
        var tb = { x: r.x + r.w - 40, y: r.y + 4, w: 34, h: r.h - 8 };
        ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(tb.x, tb.y, tb.w, tb.h);
        plot(ctx, tb, f.f, 1, f.color, null);
      });

      var sel = filterById(selected);
      ctx.fillStyle = C.plotBg; ctx.fillRect(FP.x, FP.y, FP.w, FP.h);
      ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.strokeRect(FP.x, FP.y, FP.w, FP.h);
      grid(ctx, FP);
      if (sel) plot(ctx, FP, sel.f, YMAX, sel.color, "rgba(255,255,255,.06)");
      // the rack's combined transmittance, dashed so it reads apart from the
      // selected filter's own curve even when the two coincide
      if (!rackEmpty()) {
        ctx.setLineDash([5, 4]);
        plot(ctx, FP, combined, YMAX, "#7ee0a0", null);
        ctx.setLineDash([]);
      }
      axes(ctx, FP, t("fl.trans"), t, true);

      ctx.fillStyle = C.dim; ctx.font = "italic 10.5px system-ui"; ctx.textAlign = "center";
      wrap(ctx, t("fl.note"), 450 + 221, 604, 400, 14);
    }

    function grid(ctx, box) {
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
      for (var i = 1; i < 6; i++) {
        var x = box.x + box.w * i / 6;
        ctx.beginPath(); ctx.moveTo(x, box.y); ctx.lineTo(x, box.y + box.h); ctx.stroke();
      }
      for (var j = 1; j < 4; j++) {
        var y = box.y + box.h * j / 4;
        ctx.beginPath(); ctx.moveTo(box.x, y); ctx.lineTo(box.x + box.w, y); ctx.stroke();
      }
    }
    function axes(ctx, box, yLabel, t, pct) {
      rainbow(ctx, box.x, box.y + box.h + 4, box.w, 9);
      ctx.fillStyle = C.dim; ctx.font = "9.5px system-ui"; ctx.textAlign = "center";
      for (var l = 300; l <= 900; l += 100) {
        var x = box.x + box.w * (l - LO) / (HI - LO);
        ctx.fillText(l, x, box.y + box.h + 26);
      }
      ctx.fillText(t("fl.wl") + " (nm)", box.x + box.w / 2, box.y + box.h + 42);
      ctx.save();
      ctx.translate(box.x - 26, box.y + box.h / 2); ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center"; ctx.fillText(yLabel, 0, 0); ctx.restore();
      if (pct) {
        ctx.textAlign = "right"; ctx.fillText("100%", box.x - 4, box.y + 8);
        ctx.fillText("0%", box.x - 4, box.y + box.h);
      }
    }
    function drawGhost(ctx, d) {
      var f = filterById(d.id); if (!f) return;
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = f.color; roundRect(ctx, d.x - 15, d.y - 17, 30, 34, 4); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#08101f"; ctx.font = "600 11px system-ui"; ctx.textAlign = "center";
      ctx.fillText(f.id, d.x, d.y + 4);
    }
    function wrap(ctx, text, cx, y, maxw, lh) {
      var words = text.split(" "), line = "", n = 0;
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(test).width > maxw && line) { ctx.fillText(line, cx, y + (n++) * lh); line = words[i]; }
        else line = test;
      }
      ctx.fillText(line, cx, y + n * lh);
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    syncSourceCtls(); syncCustomCtls(); upd();
  }
});
