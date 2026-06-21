/* Blackbody Curves and Filters Explorer ---------------------------------------
   Faithful rebuild of the NAAP "Blackbody Curves and Filters Explorer"
   (blackbody.swf): a Flux-vs-wavelength plot with a visible-spectrum strip, a
   list of blackbody curves you can add/remove (each shown with its temperature,
   peak wavelength and area under the curve), a temperature slider for the
   selected curve, options to highlight the area / indicate the peak, vertical
   scale modes (lock / autoscale all / autoscale selected), and a U·B·V filter
   overlay with the resulting B–V colour index.
   Peak λ = Wien (2.8977e6/T nm); area = σT⁴ — matching the SWF's readouts.       */
Sim.create({
  id: "blackbody",
  width: 760, height: 512,
  strings: {
    en: {
      "bb.curve": "Selected curve", "bb.temp": "temperature",
      "bb.highlight": "highlight area under curve", "bb.indicate": "indicate peak wavelength",
      "bb.add": "add curve", "bb.remove": "remove curve",
      "bb.scaleGrp": "Vertical scale", "bb.scale": "scale",
      "bb.scaleAll": "autoscale to all curves", "bb.scaleSel": "autoscale to selected", "bb.scaleLock": "lock scale",
      "bb.filters": "show U·B·V filters",
      "bb.peak": "peak wavelength", "bb.area": "area under curve", "bb.bv": "B–V colour index",
      "bb.list": "Curves", "bb.colT": "temp", "bb.colP": "peak λ", "bb.colA": "area",
      "bb.xaxis": "wavelength (nm)", "bb.yaxis": "Flux"
    },
    id: {
      "bb.curve": "Kurva terpilih", "bb.temp": "suhu",
      "bb.highlight": "arsir luas di bawah kurva", "bb.indicate": "tandai panjang gelombang puncak",
      "bb.add": "tambah kurva", "bb.remove": "hapus kurva",
      "bb.scaleGrp": "Skala vertikal", "bb.scale": "skala",
      "bb.scaleAll": "autoskala ke semua kurva", "bb.scaleSel": "autoskala ke terpilih", "bb.scaleLock": "kunci skala",
      "bb.filters": "tampilkan filter U·B·V",
      "bb.peak": "panjang gelombang puncak", "bb.area": "luas di bawah kurva", "bb.bv": "indeks warna B–V",
      "bb.list": "Kurva", "bb.colT": "suhu", "bb.colP": "puncak λ", "bb.colA": "luas",
      "bb.xaxis": "panjang gelombang (nm)", "bb.yaxis": "Fluks"
    }
  },
  about: {
    en: "<p>Every warm object glows with a <strong>blackbody spectrum</strong> whose shape depends only on temperature. Add several curves to compare them.</p>" +
        "<h3>Wien's law</h3><p>The peak slides to shorter (bluer) wavelengths as the star gets hotter: λ<sub>peak</sub> = 2.9 × 10<sup>6</sup> K·nm ÷ T.</p>" +
        "<h3>Stefan–Boltzmann law</h3><p>The area under the curve — energy radiated per unit area — grows as T<sup>4</sup>, so the hottest curve towers over the rest (use <em>autoscale to selected</em> to inspect a cool one).</p>" +
        "<h3>Filters &amp; colour</h3><p>Turn on the U·B·V filters: the ratio of light passing the B and V bands sets the <strong>B–V colour index</strong>, which astronomers read straight back as a temperature (hot stars are blue, B–V &lt; 0; cool stars are red, B–V &gt; 0).</p>",
    id: "<p>Setiap benda hangat berpijar dengan <strong>spektrum benda hitam</strong> yang bentuknya hanya bergantung pada suhu. Tambahkan beberapa kurva untuk membandingkan.</p>" +
        "<h3>Hukum Wien</h3><p>Puncak bergeser ke panjang gelombang lebih pendek (lebih biru) saat lebih panas: λ<sub>puncak</sub> = 2,9 × 10<sup>6</sup> K·nm ÷ T.</p>" +
        "<h3>Hukum Stefan–Boltzmann</h3><p>Luas di bawah kurva — energi per satuan luas — tumbuh sebagai T<sup>4</sup>, jadi kurva terpanas menjulang (pakai <em>autoskala ke terpilih</em> untuk melihat yang dingin).</p>" +
        "<h3>Filter &amp; warna</h3><p>Aktifkan filter U·B·V: rasio cahaya yang lolos pita B dan V menentukan <strong>indeks warna B–V</strong>, yang dibaca astronom sebagai suhu (bintang panas biru, B–V &lt; 0; dingin merah, B–V &gt; 0).</p>"
  },
  build: function (S) {
    var MAXWL = 2000;                         // nm on the x-axis
    var ADD_DEFAULTS = [6000, 4000, 9000, 3000, 15000];
    var curves = [{ T: 6000 }], sel = 0, scaleMode = "all", lockedMax = null;
    var pad = { l: 62, r: 16, t: 22, b: 40 };
    var plotBottom = 366;

    function planck(nm, t) {
      var h = 6.626e-34, c = 2.998e8, k = 1.381e-23, lam = nm * 1e-9;
      var b = h * c / (lam * k * t);
      if (b > 700) return 0;
      return (2 * h * c * c / Math.pow(lam, 5)) / (Math.exp(b) - 1);
    }
    function peakNm(T) { return 2.8977e6 / T; }
    function peakVal(T) { return planck(peakNm(T), T) || 1; }
    function area(T) { return 5.670e-8 * T * T * T * T; }     // σT⁴, W/m²
    function allMax() { return Math.max.apply(null, curves.map(function (c) { return peakVal(c.T); })); }

    // U·B·V filter response (Johnson, Gaussian) and B–V colour index
    var FILT = { U: [365, 66], B: [445, 94], V: [551, 88] };
    function bandFlux(T, f) {
      var l0 = f[0], sig = f[1] / 2.355, sum = 0;
      for (var nm = l0 - 2.5 * sig; nm <= l0 + 2.5 * sig; nm += 4)
        sum += planck(nm, T) * Math.exp(-0.5 * Math.pow((nm - l0) / sig, 2));
      return sum;
    }
    var BV0 = 2.5 * Math.log(bandFlux(9700, FILT.B) / bandFlux(9700, FILT.V)) / Math.LN10;  // ⇒ B–V≈0 at A0
    function colourBV(T) { return -2.5 * Math.log(bandFlux(T, FILT.B) / bandFlux(T, FILT.V)) / Math.LN10 + BV0; }

    /* ---- controls ---- */
    S.group("bb.curve");
    var tempCtl = S.slider({ labelKey: "bb.temp", min: 2000, max: 30000, step: 100, value: curves[sel].T, unit: " K",
      on: function (v) { curves[sel].T = v; upd(); } });
    var optHi = S.toggle({ labelKey: "bb.highlight", value: false });
    var optPk = S.toggle({ labelKey: "bb.indicate", value: true });
    S.button({ labelKey: "bb.add", on: function () {
      if (curves.length >= 5) return;
      curves.push({ T: ADD_DEFAULTS[curves.length] || 5000 }); sel = curves.length - 1;
      tempCtl.set(curves[sel].T);
    } });
    S.button({ labelKey: "bb.remove", on: function () {
      if (curves.length <= 1) return;
      curves.splice(sel, 1); sel = Math.min(sel, curves.length - 1); tempCtl.set(curves[sel].T);
    } });

    S.group("bb.scaleGrp");
    S.select({ labelKey: "bb.scale", value: scaleMode,
      options: [{ v: "all", labelKey: "bb.scaleAll" }, { v: "selected", labelKey: "bb.scaleSel" }, { v: "lock", labelKey: "bb.scaleLock" }],
      on: function (v) { if (v === "lock") lockedMax = computeMax(); scaleMode = v; S.requestDraw(); } });
    var optFilt = S.toggle({ labelKey: "bb.filters", value: false });

    var outPeak = S.readout({ labelKey: "bb.peak" });
    var outArea = S.readout({ labelKey: "bb.area" });
    var outBV = S.readout({ labelKey: "bb.bv" });

    function computeMax() { return scaleMode === "selected" ? peakVal(curves[sel].T) : scaleMode === "lock" ? (lockedMax || allMax()) : allMax(); }
    function upd() {
      var T = curves[sel].T;
      outPeak(Math.round(peakNm(T)) + " nm");
      outArea(sci(area(T)) + " W/m²");
      outBV((colourBV(T) >= 0 ? "+" : "") + colourBV(T).toFixed(2));
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---- click the curve list to select ---- */
    function evtPos(e) { var r = S.canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * (S.W / r.width), y: (e.clientY - r.top) * (S.H / r.height) }; }
    var rowH = 22, listTop = plotBottom + 30;
    S.canvas.addEventListener("pointerdown", function (e) {
      var p = evtPos(e);
      if (p.y < listTop || p.x < 14 || p.x > S.W - 14) return;
      var i = Math.floor((p.y - listTop) / rowH);
      if (i >= 0 && i < curves.length) { sel = i; tempCtl.set(curves[sel].T); }
    });

    /* ===================================================================== */
    S.onDraw(function () {
      var ctx = S.ctx, W = S.W;
      S.clear();
      var x0 = pad.l, x1 = W - pad.r, y0 = plotBottom, y1 = pad.t;
      var plotW = x1 - x0, plotH = y0 - y1;
      var xOf = function (nm) { return x0 + (nm / MAXWL) * plotW; };
      var ymax = computeMax();
      var yOf = function (v) { return y0 - Math.min(v / ymax, 1.06) * plotH * 0.92; };

      // U·B·V filter bands
      if (optFilt.value()) {
        drawBand(FILT.U, "rgba(150,110,230,0.16)", "U");
        drawBand(FILT.B, "rgba(90,150,250,0.16)", "B");
        drawBand(FILT.V, "rgba(120,210,140,0.16)", "V");
        function drawBand(f, col, lbl) {
          var a = xOf(f[0] - f[1]), b = xOf(f[0] + f[1]);
          ctx.fillStyle = col; ctx.fillRect(a, y1, b - a, plotH);
          ctx.fillStyle = "#cfd8f0"; ctx.font = "bold 11px system-ui"; ctx.textAlign = "center";
          ctx.fillText(lbl, xOf(f[0]), y1 + 12);
        }
      }

      // axes + grid
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
      for (var t = 0; t <= MAXWL; t += 250) {
        var gx = xOf(t);
        ctx.strokeStyle = "#16213f"; ctx.beginPath(); ctx.moveTo(gx, y1); ctx.lineTo(gx, y0); ctx.stroke();
        ctx.fillStyle = "#9fabce"; ctx.fillText(t === 1000 ? "1 µm" : t, gx, y0 + 15);
      }
      ctx.fillText(I18N.t("bb.xaxis"), (x0 + x1) / 2, y0 + 30);
      ctx.save(); ctx.translate(15, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(I18N.t("bb.yaxis"), 0, 0); ctx.restore();

      // visible-spectrum strip on the axis
      for (var nm = 380; nm <= 750; nm += 3) {
        var c = visibleRGB(nm);
        ctx.fillStyle = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
        ctx.fillRect(xOf(nm), y0 + 1, Math.max(1, xOf(nm + 3) - xOf(nm)), 5);
      }

      // curves
      curves.forEach(function (cv, i) {
        var rgb = tempToRGB(cv.T), col = "rgb(" + rgb.map(Math.round).join(",") + ")";
        var isSel = i === sel;
        if (isSel && optHi.value()) {        // highlight area under selected curve
          ctx.beginPath(); ctx.moveTo(xOf(1), y0);
          for (var nm2 = 1; nm2 <= MAXWL; nm2 += 6) ctx.lineTo(xOf(nm2), yOf(planck(nm2, cv.T)));
          ctx.lineTo(xOf(MAXWL), y0); ctx.closePath();
          ctx.fillStyle = "rgba(" + rgb.map(Math.round).join(",") + ",0.18)"; ctx.fill();
        }
        ctx.beginPath();
        for (var nm3 = 1; nm3 <= MAXWL; nm3 += 4) { var yy = yOf(planck(nm3, cv.T)); nm3 === 1 ? ctx.moveTo(xOf(nm3), yy) : ctx.lineTo(xOf(nm3), yy); }
        ctx.strokeStyle = col; ctx.lineWidth = isSel ? 2.8 : 1.4; ctx.globalAlpha = isSel ? 1 : 0.75; ctx.stroke(); ctx.globalAlpha = 1;

        if (optPk.value()) {                 // peak-wavelength marker
          var px = xOf(peakNm(cv.T)), py = yOf(peakVal(cv.T));
          if (px <= x1) {
            ctx.strokeStyle = col; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(px, y0); ctx.lineTo(px, py); ctx.stroke(); ctx.setLineDash([]);
            if (isSel) { ctx.fillStyle = "#fff"; ctx.font = "11px system-ui"; ctx.textAlign = "center"; ctx.fillText(Math.round(peakNm(cv.T)) + " nm", px, py - 7); }
          }
        }
      });

      // ---- curve list ----
      ctx.textAlign = "left"; ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui";
      ctx.fillText(I18N.t("bb.list").toUpperCase(), 14, plotBottom + 22);
      var cols = [44, 150, 300, 470];
      ctx.fillStyle = "#9fabce"; ctx.font = "10px system-ui";
      ctx.fillText(I18N.t("bb.colT"), cols[1], listTop - 4);
      ctx.fillText(I18N.t("bb.colP"), cols[2], listTop - 4);
      ctx.fillText(I18N.t("bb.colA"), cols[3], listTop - 4);
      curves.forEach(function (cv, i) {
        var ry = listTop + i * rowH, rgb = tempToRGB(cv.T);
        if (i === sel) { ctx.fillStyle = "rgba(110,168,254,0.14)"; roundRect(ctx, 14, ry, S.W - 28, rowH - 2, 5); ctx.fill(); }
        ctx.fillStyle = "rgb(" + rgb.map(Math.round).join(",") + ")";
        ctx.beginPath(); ctx.arc(28, ry + rowH / 2, 5, 0, 2 * Math.PI); ctx.fill();
        ctx.fillStyle = "#e8ecf8"; ctx.font = (i === sel ? "bold " : "") + "12px system-ui"; ctx.textAlign = "left";
        ctx.fillText(cv.T + " K", cols[1], ry + 15);
        ctx.fillText(Math.round(peakNm(cv.T)) + " nm", cols[2], ry + 15);
        ctx.fillText(sci(area(cv.T)) + " W/m²", cols[3], ry + 15);
      });
    });

    upd();

    function sci(n) {
      var e = Math.floor(Math.log(n) / Math.LN10), m = n / Math.pow(10, e);
      var sup = String(e).replace(/[-0-9]/g, function (d) { return "⁻⁰¹²³⁴⁵⁶⁷⁸⁹"["-0123456789".indexOf(d)]; });
      return m.toFixed(2) + "×10" + sup;
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});

/* ---- color helpers (module-local) ---- */
/* Approximate blackbody color (Tanner Helland approximation), T in K. */
function tempToRGB(T) {
  var t = T / 100, r, g, b;
  if (t <= 66) r = 255; else r = clamp(329.7 * Math.pow(t - 60, -0.1332));
  if (t <= 66) g = clamp(99.47 * Math.log(t) - 161.12); else g = clamp(288.12 * Math.pow(t - 60, -0.0755));
  if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = clamp(138.52 * Math.log(t - 10) - 305.04);
  return [r, g, b];
  function clamp(x) { return Math.max(0, Math.min(255, x)); }
}
/* Approximate visible-wavelength (380–750 nm) to RGB. */
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
