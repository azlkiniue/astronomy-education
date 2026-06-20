/* Blackbody Curves & Wien's Law ------------------------------------------- */
Sim.create({
  id: "blackbody",
  width: 760, height: 470,
  strings: {
    en: {
      "bb.controls": "Star",
      "bb.temp": "Temperature",
      "bb.compareSun": "Mark the Sun (5772 K)",
      "bb.visible": "Shade the visible band",
      "bb.peak": "Peak wavelength",
      "bb.color": "Apparent color",
      "bb.power": "Energy / area vs Sun",
      "bb.class": "Spectral type",
      "bb.preset": "Jump to a star"
    },
    id: {
      "bb.controls": "Bintang",
      "bb.temp": "Suhu",
      "bb.compareSun": "Tandai Matahari (5772 K)",
      "bb.visible": "Arsir pita kasatmata",
      "bb.peak": "Panjang gelombang puncak",
      "bb.color": "Warna tampak",
      "bb.power": "Energi / luas vs Matahari",
      "bb.class": "Tipe spektral",
      "bb.preset": "Lompat ke bintang"
    }
  },
  about: {
    en: "<p>Every warm object glows with a <strong>blackbody spectrum</strong> whose shape depends only on temperature. " +
        "Drag the temperature slider and watch two things change:</p>" +
        "<h3>Wien's law</h3><p>The peak slides to <em>shorter</em> (bluer) wavelengths as the star gets hotter: " +
        "λ<sub>peak</sub> = 2.9 × 10<sup>6</sup> K·nm ÷ T. A cool red giant peaks in the infrared; a hot blue star peaks in the ultraviolet.</p>" +
        "<h3>Stefan–Boltzmann law</h3><p>The total area under the curve — the energy radiated per unit surface — grows as T<sup>4</sup>. " +
        "Doubling the temperature makes a patch of star 16× brighter.</p>",
    id: "<p>Setiap benda hangat berpijar dengan <strong>spektrum benda hitam</strong> yang bentuknya hanya bergantung pada suhu. " +
        "Geser penggeser suhu dan amati dua hal yang berubah:</p>" +
        "<h3>Hukum Wien</h3><p>Puncak bergeser ke panjang gelombang <em>lebih pendek</em> (lebih biru) saat bintang makin panas: " +
        "λ<sub>puncak</sub> = 2,9 × 10<sup>6</sup> K·nm ÷ T. Raksasa merah dingin memuncak di inframerah; bintang biru panas memuncak di ultraviolet.</p>" +
        "<h3>Hukum Stefan–Boltzmann</h3><p>Luas total di bawah kurva — energi yang dipancarkan per satuan luas — tumbuh sebanding T<sup>4</sup>. " +
        "Menggandakan suhu membuat sepetak bintang 16× lebih terang.</p>"
  },
  build: function (S) {
    var T = 5800;               // step-aligned start near the Sun (5772 K)
    var MAXWL = 2000;            // nm shown on x-axis
    var pad = { l: 56, r: 18, t: 22, b: 46 };

    S.group("bb.controls");
    var tempCtl = S.slider({
      labelKey: "bb.temp", min: 2000, max: 30000, value: T, step: 100, unit: " K",
      on: function (v) { T = v; updateReadouts(); }
    });
    S.select({
      labelKey: "bb.preset", value: "",
      options: [
        { v: "3200", label: "Betelgeuse · M (3200 K)" },
        { v: "5772", label: "Sun · G (5772 K)" },
        { v: "6600", label: "Procyon · F (6600 K)" },
        { v: "9940", label: "Sirius · A (9940 K)" },
        { v: "12000", label: "Rigel · B (12000 K)" },
        { v: "30000", label: "Hot O star (30000 K)" }
      ],
      on: function (v) { tempCtl.set(parseFloat(v)); }
    });
    var showSun = S.toggle({ labelKey: "bb.compareSun", value: true });
    var showVis = S.toggle({ labelKey: "bb.visible", value: true });

    var outPeak = S.readout({ labelKey: "bb.peak" });
    var outColor = S.readout({ labelKey: "bb.color" });
    var outPower = S.readout({ labelKey: "bb.power" });
    var outClass = S.readout({ labelKey: "bb.class" });

    function updateReadouts() {
      var peak = 2.8977e6 / T;                       // nm
      outPeak(Math.round(peak) + " nm");
      var rgb = tempToRGB(T);
      outColor("rgb(" + rgb.map(Math.round).join(",") + ")");
      outPower("×" + format(Math.pow(T / 5772, 4)));
      outClass(spectralType(T));
      S.requestDraw();
    }

    // ---- Planck spectral radiance (relative units) ----
    function planck(nm, t) {
      var h = 6.626e-34, c = 2.998e8, k = 1.381e-23, lam = nm * 1e-9;
      var b = h * c / (lam * k * t);
      if (b > 700) return 0;                         // avoid overflow for cold/short-λ
      return (2 * h * c * c / Math.pow(lam, 5)) / (Math.exp(b) - 1);
    }

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();
      var x0 = pad.l, x1 = W - pad.r, y0 = H - pad.b, y1 = pad.t;
      var plotW = x1 - x0, plotH = y0 - y1;
      var xOf = function (nm) { return x0 + (nm / MAXWL) * plotW; };

      // y-scale to the peak of the current curve
      var peakWL = 2.8977e6 / T;
      var peakVal = planck(peakWL, T) || 1;
      var yOf = function (val) { return y0 - (val / peakVal) * plotH * 0.92; };

      // visible-light band
      if (showVis.value()) {
        for (var nm = 380; nm <= 750; nm += 2) {
          var c = visibleRGB(nm);
          ctx.fillStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0.22)";
          ctx.fillRect(xOf(nm), y1, Math.max(1, xOf(nm + 2) - xOf(nm)), plotH);
        }
      }

      // axes
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.fillStyle = "#9fabce";
      ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
      for (var t = 0; t <= MAXWL; t += 250) {
        var gx = xOf(t);
        ctx.strokeStyle = "#1b2747"; ctx.beginPath(); ctx.moveTo(gx, y1); ctx.lineTo(gx, y0); ctx.stroke();
        ctx.fillText(t, gx, y0 + 16);
      }
      ctx.fillText("wavelength (nm)  ·  λ", (x0 + x1) / 2, H - 8);
      ctx.save(); ctx.translate(14, (y0 + y1) / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText("intensity", 0, 0); ctx.restore();

      // reference Sun curve (faint), scaled to ITS OWN peak for shape comparison
      if (showSun.value() && Math.abs(T - 5772) > 1) {
        drawCurve(5772, "rgba(255,209,102,0.45)", 1.5);
      }
      // main curve, filled in the star's apparent color
      var rgb = tempToRGB(T);
      drawCurve(T, "rgb(" + rgb.map(Math.round).join(",") + ")", 2.6, true);

      // Wien peak marker
      var px = xOf(peakWL);
      if (px <= x1) {
        ctx.strokeStyle = "#ffffff"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, y0); ctx.lineTo(px, yOf(peakVal)); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#fff"; ctx.fillText(Math.round(peakWL) + " nm", px, yOf(peakVal) - 8);
      }

      function drawCurve(temp, stroke, lw, fill) {
        var localPeak = planck(2.8977e6 / temp, temp) || 1;
        ctx.beginPath();
        for (var nm2 = 1; nm2 <= MAXWL; nm2 += 4) {
          var v = planck(nm2, temp);
          var yy = y0 - (v / (temp === T ? peakVal : localPeak)) * plotH * 0.92;
          if (nm2 === 1) ctx.moveTo(xOf(nm2), yy); else ctx.lineTo(xOf(nm2), yy);
        }
        if (fill) {
          ctx.lineTo(xOf(MAXWL), y0); ctx.lineTo(x0, y0); ctx.closePath();
          ctx.fillStyle = "rgba(" + rgb.map(Math.round).join(",") + ",0.16)"; ctx.fill();
          ctx.beginPath();
          for (var nm3 = 1; nm3 <= MAXWL; nm3 += 4) {
            var vv = planck(nm3, temp);
            var y3 = y0 - (vv / peakVal) * plotH * 0.92;
            if (nm3 === 1) ctx.moveTo(xOf(nm3), y3); else ctx.lineTo(xOf(nm3), y3);
          }
        }
        ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
      }
    });

    updateReadouts();
  }
});

/* ---- color helpers (module-local) ---- */
function spectralType(T) {
  if (T >= 30000) return "O"; if (T >= 10000) return "B"; if (T >= 7500) return "A";
  if (T >= 6000) return "F"; if (T >= 5200) return "G"; if (T >= 3700) return "K"; return "M";
}
function format(n) {
  if (n >= 100) return Math.round(n).toLocaleString();
  if (n >= 10) return n.toFixed(0);
  if (n >= 1) return n.toFixed(1);
  return n.toFixed(2);
}
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
