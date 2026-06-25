/* Stellar Luminosity Calculator ----------------------------------------------
   Faithful rebuild of the ClassAction "Stellar Luminosity Calculator"
   (stellarlum.swf). A star's luminosity follows the Stefan–Boltzmann law

        L = 4 π R² σ T⁴

   shown two ways: in SI units (R in metres, T in kelvin → J/s) and in solar
   units (R in R☉, T in T☉ → L☉). A "Spectral Type" slider (O B A F G K M, with
   subtypes 0–9) sets the temperature; a logarithmic "Stellar Radius" slider sets
   R from 0.01 to 100 R☉. A preview shows the star with its true colour (from T)
   and a size that grows with R. Default G2 / 1 R☉ → 4.0×10²⁶ J/s = 1.00 L☉.    */
Sim.create({
  id: "stellarlum",
  width: 760, height: 400,
  strings: {
    en: {
      "sl.spec": "Spectral type", "sl.rad": "Stellar radius  R",
      "sl.rT": "temperature  T", "sl.rL": "luminosity  L", "sl.rLs": "luminosity  L", "sl.rClass": "spectral class"
    },
    id: {
      "sl.spec": "Tipe spektral", "sl.rad": "Jari-jari bintang  R",
      "sl.rT": "temperatur  T", "sl.rL": "luminositas  L", "sl.rLs": "luminositas  L", "sl.rClass": "kelas spektral"
    }
  },
  about: {
    en: "<p>A star shines because its surface is hot. The <strong>Stefan–Boltzmann law</strong> says each square metre radiates σT⁴ watts, so a star's total power — its <strong>luminosity</strong> — is</p>" +
        "<p style='text-align:center'><strong>L = 4πR²σT⁴</strong>.</p>" +
        "<p>Two things set it: surface area (∝ R²) and temperature (∝ T⁴). Because of that fourth power, temperature wins — a small hot star can out-shine a big cool one. Pick a <strong>spectral type</strong> (O stars are hottest and blue, M stars coolest and red) and a <strong>radius</strong>, and read the luminosity in joules per second and in units of the Sun's luminosity (L☉).</p>",
    id: "<p>Bintang bersinar karena permukaannya panas. <strong>Hukum Stefan–Boltzmann</strong> menyatakan tiap meter persegi memancarkan σT⁴ watt, sehingga daya total bintang — <strong>luminositasnya</strong> — adalah</p>" +
        "<p style='text-align:center'><strong>L = 4πR²σT⁴</strong>.</p>" +
        "<p>Dua hal menentukannya: luas permukaan (∝ R²) dan temperatur (∝ T⁴). Karena pangkat empat itu, temperatur lebih dominan — bintang kecil yang panas bisa mengalahkan bintang besar yang dingin. Pilih <strong>tipe spektral</strong> (bintang O paling panas dan biru, M paling dingin dan merah) dan <strong>jari-jari</strong>, lalu baca luminositas dalam joule per detik dan dalam satuan luminositas Matahari (L☉).</p>"
  },
  build: function (S) {
    var SIGMA = 5.670e-8, RSUN_M = 6.957e8, FOURPI = 4 * Math.PI;
    var COL = { R: "#5a9cff", T: "#ffa64d", L: "#eef2fb", hdr: "#ff6b6b", sun: "#ffd23f" };
    var CLASSES = "OBAFGKM";
    // temperature anchors at subtype-0 of each class (index 0,10,…60) plus the M9 end (70)
    var ANCH_I = [0, 10, 20, 30, 40, 50, 60, 70];
    var ANCH_T = [42000, 30000, 9900, 7400, 5990, 5240, 3850, 2500];
    function tempAt(i) {
      i = Math.max(0, Math.min(69, i));
      var k = 0; while (k < ANCH_I.length - 2 && i >= ANCH_I[k + 1]) k++;
      var f = (i - ANCH_I[k]) / (ANCH_I[k + 1] - ANCH_I[k]);
      var lt = Math.log10(ANCH_T[k]) + f * (Math.log10(ANCH_T[k + 1]) - Math.log10(ANCH_T[k]));
      return Math.pow(10, lt);
    }
    var TSUN = tempAt(42);                      // the Sun's reference temperature (G2)
    var P = { spec: 42, R: 1.0 };               // G2, 1 R☉

    function specLabel(i) { return CLASSES.charAt(Math.floor(i / 10)) + (i % 10); }
    function Lsi() { var Rm = P.R * RSUN_M, T = tempAt(P.spec); return FOURPI * Rm * Rm * SIGMA * Math.pow(T, 4); }
    function Lsun() { var T = tempAt(P.spec); return P.R * P.R * Math.pow(T / TSUN, 4); }

    /* ---------- controls ---------- */
    var specC = S.slider({ labelKey: "sl.spec", min: 0, max: 69, step: 1, value: P.spec,
      format: function (v) { return specLabel(v); },
      on: function (v) { P.spec = v; upd(); } });
    var radC = S.slider({ labelKey: "sl.rad", min: Math.log10(0.01), max: Math.log10(100), step: 0.001, value: Math.log10(P.R),
      format: function (v) { return fmtR(Math.pow(10, v)); },
      on: function (v) { P.R = Math.pow(10, v); upd(); } });

    var oClass = S.readout({ labelKey: "sl.rClass" });
    var oT = S.readout({ labelKey: "sl.rT" });
    var oLsi = S.readout({ labelKey: "sl.rL" });
    var oLsun = S.readout({ labelKey: "sl.rLs" });

    function fmtR(r) { return (r < 0.1 ? r.toFixed(3) : r < 10 ? r.toFixed(2) : r.toFixed(1)) + " R☉"; }
    function upd() {
      oClass(specLabel(P.spec));
      oT(Math.round(tempAt(P.spec) / 10) * 10 + " K");
      oLsi(sciStr(Lsi(), 1) + " J/s");
      oLsun(fmtLsun(Lsun()) + " L☉");
      S.requestDraw();
    }
    function fmtLsun(L) {
      if (L >= 1e4 || (L < 1e-2 && L > 0)) return sciStr(L);
      return L < 10 ? L.toFixed(2) : L < 1000 ? L.toFixed(1) : Math.round(L).toLocaleString();
    }
    S.refreshers.push(upd);

    /* ---------- number formatting / rendering (from gravcalc) ---------- */
    function sciParts(x, dec) {
      dec = dec == null ? 2 : dec;
      if (x === 0) return { m: "0", e: 0, plain: true };
      var e = Math.floor(Math.log10(Math.abs(x)));
      var m = x / Math.pow(10, e);
      if (Math.abs(m) >= (10 - 0.5 * Math.pow(10, -dec))) { m /= 10; e += 1; }
      return { m: m.toFixed(dec), e: e, plain: e === 0 };
    }
    function sciStr(x, dec) { var p = sciParts(x, dec); return p.plain ? (+x).toFixed(2) : p.m + "×10" + sup(p.e); }
    function sup(e) { var m = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" }; return ("" + e).split("").map(function (c) { return m[c]; }).join(""); }
    function drawSci(ctx, x, y, value, color, sz, dec) {
      sz = sz || 16; ctx.fillStyle = color || "#e8ecf5"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var p = sciParts(value, dec);
      ctx.font = sz + "px ui-monospace, Menlo, monospace";
      if (p.plain) { var t = (+value).toFixed(2); ctx.fillText(t, x, y); return x + ctx.measureText(t).width; }
      ctx.fillText(p.m + "×10", x, y); x += ctx.measureText(p.m + "×10").width + 1;
      ctx.font = Math.round(sz * 0.66) + "px ui-monospace, Menlo, monospace";
      ctx.fillText("" + p.e, x, y - sz * 0.5); x += ctx.measureText("" + p.e).width + 2;
      ctx.font = sz + "px ui-monospace, Menlo, monospace";
      return x;
    }
    function txt(ctx, x, y, s, color, sz, bold) {
      ctx.fillStyle = color || "#e8ecf5"; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.font = (bold ? "700 " : "") + (sz || 16) + "px system-ui"; ctx.fillText(s, x, y);
      return x + ctx.measureText(s).width;
    }
    function powTxt(ctx, x, y, base, exp, color, sz) {            // base with a superscript exponent
      x = txt(ctx, x, y, base, color, sz);
      txt(ctx, x + 1, y - sz * 0.42, exp, color, Math.round(sz * 0.7));
      ctx.font = sz + "px system-ui"; return x + ctx.measureText(exp).width * 0.7 + 3;
    }

    /* ---------- drawing ---------- */
    var BOX = { x: 20, y: 28, w: 300, h: 300 };
    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      panel(ctx, { x: 8, y: 8, w: 744, h: 384 });
      starPreview(ctx);
      equation(ctx);
    });

    function starPreview(ctx) {
      // black framed box
      ctx.fillStyle = "#04060d"; roundRect(ctx, BOX.x, BOX.y, BOX.w, BOX.h, 6); ctx.fill();
      ctx.strokeStyle = "#c4453a"; ctx.lineWidth = 2; ctx.stroke();
      // star disk: colour from T, radius grows with R (display-scaled + clamped)
      var T = tempAt(P.spec), rgb = tempToRGB(T);
      var cx = BOX.x + BOX.w / 2, cy = BOX.y + BOX.h / 2;
      var dr = Math.max(6, Math.min(132, 52 * Math.pow(P.R, 0.30)));
      var g = ctx.createRadialGradient(cx - dr * 0.25, cy - dr * 0.25, dr * 0.1, cx, cy, dr);
      g.addColorStop(0, "rgba(255,255,255,.95)");
      g.addColorStop(0.35, "rgb(" + rgb.map(Math.round).join(",") + ")");
      g.addColorStop(1, "rgb(" + rgb.map(function (c) { return Math.round(c * 0.55); }).join(",") + ")");
      // soft glow
      ctx.save(); ctx.shadowColor = "rgb(" + rgb.map(Math.round).join(",") + ")"; ctx.shadowBlur = 24;
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, dr, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
      // spectral-class colour strip + marker along the bottom of the box
      var sy = BOX.y + BOX.h + 4, sx = BOX.x, sw = BOX.w;
      for (var i = 0; i <= sw; i += 4) {
        var rr = tempToRGB(tempAt(i / sw * 69));
        ctx.fillStyle = "rgb(" + rr.map(Math.round).join(",") + ")"; ctx.fillRect(sx + i, sy, 4, 8);
      }
      var mx = sx + P.spec / 69 * sw;
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(mx, sy - 2); ctx.lineTo(mx - 4, sy - 8); ctx.lineTo(mx + 4, sy - 8); ctx.closePath(); ctx.fill();
      // O B A F G K M letters
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      for (var c = 0; c < 7; c++) {
        var lx = sx + (c * 10 + 5) / 69 * sw, rgbc = tempToRGB(tempAt(c * 10 + 5));
        ctx.fillStyle = "rgb(" + rgbc.map(function (v) { return Math.round(Math.min(255, v + 40)); }).join(",") + ")";
        ctx.font = "700 12px system-ui"; ctx.fillText(CLASSES.charAt(c), lx, sy + 12);
      }
    }

    function equation(ctx) {
      var X = 350, T = tempAt(P.spec);
      // headline  L = 4πR²σT⁴
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var x = txt(ctx, X, 56, "L = 4π", COL.L, 22);
      x = powTxt(ctx, x + 2, 56, "R", "2", COL.R, 22);
      x = txt(ctx, x + 4, 56, "σ", COL.L, 22);
      x = powTxt(ctx, x + 2, 56, "T", "4", COL.T, 22);

      // SI Units
      txt(ctx, X, 96, "SI units", COL.hdr, 15, true);
      var y = 130; x = X;
      x = txt(ctx, x, y, "L = 4π(", COL.L, 16);
      x = drawSci(ctx, x + 2, y, P.R * RSUN_M, COL.R, 16);
      x = txt(ctx, x + 3, y, "m)", COL.R, 16);
      ctx.font = "11px system-ui"; ctx.fillStyle = COL.R; ctx.fillText("2", x + 1, y - 11); x += 8;
      x = txt(ctx, x + 2, y, "σ(", COL.L, 16);
      x = txt(ctx, x + 2, y, Math.round(T / 10) * 10 + " K)", COL.T, 16);
      ctx.font = "11px system-ui"; ctx.fillStyle = COL.T; ctx.fillText("4", x + 1, y - 11);
      // = result
      x = txt(ctx, X + 26, 166, "= ", COL.L, 18);
      x = drawSci(ctx, x, 166, Lsi(), "#fff", 18, 1);
      txt(ctx, x + 6, 166, "J/s", "#9fb0d0", 16);

      // Solar Units
      txt(ctx, X, 214, "Solar units", COL.hdr, 15, true);
      y = 250; x = X;
      x = txt(ctx, x, y, "L = (", COL.L, 16);
      x = txt(ctx, x + 2, y, fmtRsun(P.R), COL.R, 16);
      x = txt(ctx, x + 2, y, " R☉)", COL.R, 16);
      ctx.font = "11px system-ui"; ctx.fillStyle = COL.R; ctx.fillText("2", x + 1, y - 11); x += 8;
      x = txt(ctx, x + 4, y, "(", COL.L, 16);
      x = txt(ctx, x + 2, y, (T / TSUN).toFixed(2), COL.T, 16);
      x = txt(ctx, x + 2, y, " T☉)", COL.T, 16);
      ctx.font = "11px system-ui"; ctx.fillStyle = COL.T; ctx.fillText("4", x + 1, y - 11);
      // = result
      x = txt(ctx, X + 26, 286, "= ", COL.L, 18);
      x = txt(ctx, x, 286, fmtLsun(Lsun()), "#fff", 20, true);
      txt(ctx, x + 6, 286, "L☉", COL.sun, 18, true);

      // spectral readout
      txt(ctx, X, 330, "spectral type  " + specLabel(P.spec) + "      T = " + (Math.round(T / 10) * 10) + " K", "#9fb0d0", 13);
    }
    function fmtRsun(r) { return r < 0.1 ? r.toFixed(3) : r < 10 ? r.toFixed(2) : r.toFixed(1); }

    function panel(ctx, r) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    function tempToRGB(T) {
      var t = T / 100, r, g, b;
      if (t <= 66) r = 255; else r = cl(329.7 * Math.pow(t - 60, -0.1332));
      if (t <= 66) g = cl(99.47 * Math.log(t) - 161.12); else g = cl(288.12 * Math.pow(t - 60, -0.0755));
      if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = cl(138.52 * Math.log(t - 10) - 305.04);
      return [r, g, b];
      function cl(x) { return Math.max(0, Math.min(255, x)); }
    }

    upd();
  }
});
