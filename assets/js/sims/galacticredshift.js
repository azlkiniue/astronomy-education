/* Galactic Redshift Simulator -------------------------------------------------
   Faithful rebuild of the ClassAction "Galactic Redshift Simulator"
   (galacticredshift.swf). The spectrum of a galaxy (an old stellar population:
   a 4000 Å break plus absorption features) is plotted as flux vs wavelength.
   As the redshift z grows, every wavelength is stretched by (1+z) so the whole
   spectrum slides toward the red / infrared:  λ_obs = λ_emit · (1 + z), i.e.

        z = (λ_obs − λ_emit) / λ_emit .

   A fixed visible-spectrum bar marks the observer's optical window. "Show filter
   details" overlays the U B V R bands (filled) and a little bar chart of the
   relative brightness captured by each — the wide R band collects the most light
   at z = 0, and the balance shifts as the spectrum redshifts out of the visible. */
Sim.create({
  id: "galacticredshift",
  width: 760, height: 470,
  strings: {
    en: {
      "gr.z": "redshift  z", "gr.filters": "show filter details", "gr.reset": "reset",
      "gr.rz": "redshift  z", "gr.rvel": "recession  v ≈ cz", "gr.rbreak": "4000 Å break at", "gr.rbright": "brightest band"
    },
    id: {
      "gr.z": "pergeseran merah  z", "gr.filters": "tampilkan detail filter", "gr.reset": "atur ulang",
      "gr.rz": "pergeseran merah  z", "gr.rvel": "resesi  v ≈ cz", "gr.rbreak": "patahan 4000 Å di", "gr.rbright": "pita tercerah"
    }
  },
  about: {
    en: "<p>The universe is expanding, so distant galaxies recede from us and their light is <strong>redshifted</strong> — every wavelength stretched by a factor (1 + z), where z is the redshift. A feature emitted at λ<sub>emitted</sub> is observed at λ<sub>observed</sub> = λ<sub>emitted</sub>·(1 + z).</p>" +
        "<p>Slide the redshift up and watch the galaxy's spectrum — its 4000 Å break and absorption lines — march toward longer wavelengths, sliding out of the <strong>visible window</strong> into the infrared. Turn on the filters to see how the brightness measured through each band (U, B, V, R) rises and falls as the spectrum shifts. More distant galaxies have larger z.</p>",
    id: "<p>Alam semesta mengembang, sehingga galaksi jauh menjauh dari kita dan cahayanya mengalami <strong>pergeseran merah</strong> — tiap panjang gelombang teregang faktor (1 + z), dengan z pergeseran merah. Fitur yang dipancarkan pada λ<sub>emitted</sub> teramati pada λ<sub>observed</sub> = λ<sub>emitted</sub>·(1 + z).</p>" +
        "<p>Geser pergeseran merah dan amati spektrum galaksi — patahan 4000 Å dan garis serapannya — bergerak ke panjang gelombang lebih besar, keluar dari <strong>jendela tampak</strong> menuju inframerah. Nyalakan filter untuk melihat bagaimana kecerlangan terukur tiap pita (U, B, V, R) naik-turun saat spektrum bergeser. Galaksi lebih jauh memiliki z lebih besar.</p>"
  },
  build: function (S) {
    var LAM0 = 250, LAM1 = 950;           // wavelength axis (nm)
    var PLOT = { x: 64, y: 150, w: 672, h: 268 };
    var P = { z: 0.0, filters: false };

    /* ---------- galaxy spectrum template (rest frame) ---------- */
    var LINES = [   // absorption features {center nm, depth, width nm}
      { c: 393.4, d: 0.05, w: 3 }, { c: 396.8, d: 0.05, w: 3 },   // Ca II H & K
      { c: 410.2, d: 0.09, w: 2 }, { c: 430.8, d: 0.17, w: 5 },   // Hδ, G band
      { c: 486.1, d: 0.11, w: 3 }, { c: 518.4, d: 0.18, w: 6 },   // Hβ, Mg b
      { c: 589.3, d: 0.13, w: 4 }, { c: 656.3, d: 0.11, w: 3 },   // Na D, Hα
      { c: 705, d: 0.07, w: 8 }, { c: 760, d: 0.06, w: 6 }, { c: 850, d: 0.10, w: 16 }
    ];
    function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
    function hash(x) { var s = Math.sin(x * 12.9898) * 43758.5453; return s - Math.floor(s); }
    function fluxRest(l) {
      if (l < 120) return 0.02;
      var uv = 0.02 + 0.38 * smooth(250, 400, l);          // near-zero far-UV, rises to ~0.40 at break
      var peak = 0.93 * Math.exp(-Math.pow((l - 505) / 600, 2));  // broad optical peak ≈ 505 nm
      var brk = smooth(395, 440, l);                       // the 4000 Å break
      var cont = uv + (peak - uv) * brk;
      // var cont = uv;
      var abs = 0;
      for (var i = 0; i < LINES.length; i++) { var L = LINES[i], dx = (l - L.c) / L.w; abs += L.d * Math.exp(-dx * dx); }
      var noise = 0.022 * (Math.sin(l * 1.7) * 0.5 + Math.sin(l * 0.43 + 1.1) * 0.5) + 0.018 * (hash(Math.round(l)) - 0.5);
      return Math.max(0.02, Math.min(1, cont - abs + noise));
    }
    function fluxObs(lObs) { return fluxRest(lObs / (1 + P.z)); }

    // Johnson U B V R filters (no I) — R is much the widest, so it gathers the most light
    var FILT = [
      { k: "U", c: 365, fwhm: 70, col: "#c3a8e6" }, { k: "B", c: 445, fwhm: 100, col: "#8b7bc0" },
      { k: "V", c: 551, fwhm: 96, col: "#8fcb8c" }, { k: "R", c: 658, fwhm: 165, col: "#e7b78a" }
    ];
    function bandInt(f, z) {   // ∫ spectrum × transmission  (∝ flux through the band — width matters)
      var sig = f.fwhm / 2.355, s = 0;
      for (var l = f.c - 2.8 * sig; l <= f.c + 2.8 * sig; l += 2) s += fluxRest(l / (1 + z)) * Math.exp(-Math.pow((l - f.c) / sig, 2) / 2);
      return s;
    }
    var REF = bandInt(FILT[3], 0);   // R band at z = 0 → reference for the brightness bars

    /* ---------- controls ---------- */
    var zC = S.slider({ labelKey: "gr.z", min: 0, max: 2.5, step: 0.01, value: P.z,
      format: function (v) { return v.toFixed(2); }, on: function (v) { P.z = v; upd(); } });
    var filtT = S.toggle({ labelKey: "gr.filters", value: false, on: function (b) { P.filters = b; S.requestDraw(); } });
    S.button({ labelKey: "gr.reset", on: function () { zC.set(0); } });

    var oZ = S.readout({ labelKey: "gr.rz" });
    var oVel = S.readout({ labelKey: "gr.rvel" });
    var oBreak = S.readout({ labelKey: "gr.rbreak" });
    var oBright = S.readout({ labelKey: "gr.rbright" });

    function brightest() {
      var best = FILT[0], bi = -1;
      FILT.forEach(function (f) { var v = bandInt(f, P.z); if (v > bi) { bi = v; best = f; } });
      return best.k;
    }
    function upd() {
      oZ(P.z.toFixed(2));
      oVel(Math.round(2.998e5 * P.z).toLocaleString() + " km/s");
      var brk = 400 * (1 + P.z);
      oBreak(brk.toFixed(0) + " nm" + (brk > 700 ? "  (IR)" : ""));
      oBright(brightest() + " band");
      S.requestDraw();
    }
    S.refreshers.push(upd);

    /* ---------- drawing ---------- */
    function xFor(l) { return PLOT.x + (l - LAM0) / (LAM1 - LAM0) * PLOT.w; }
    function yFor(f) { return PLOT.y + PLOT.h - f * PLOT.h; }

    S.onDraw(function () {
      var ctx = S.ctx; S.clear();
      panel(ctx, { x: 8, y: 8, w: 744, h: 454 });
      header(ctx);
      visibleBar(ctx);
      if (P.filters) barChart(ctx);
      plotFrame(ctx);
      if (P.filters) filterBands(ctx);
      spectrum(ctx);
    });

    function lsub(ctx, x, y, sub) {
      ctx.font = "14px system-ui"; ctx.fillText("λ", x, y); var lw = ctx.measureText("λ").width;
      ctx.font = "10px system-ui"; ctx.fillText(sub, x + lw, y + 4); return lw + ctx.measureText(sub).width;
    }
    function lsubW(ctx, sub) {
      ctx.font = "14px system-ui"; var lw = ctx.measureText("λ").width;
      ctx.font = "10px system-ui"; return lw + ctx.measureText(sub).width;
    }
    function header(ctx) {
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var x = 28, y = 42;
      ctx.fillStyle = "#eef2fb"; ctx.font = "700 17px system-ui"; ctx.fillText("z =", x, y); x += 34;
      ctx.fillStyle = "#cfd8ee";
      ctx.font = "14px system-ui"; var mw = ctx.measureText(" − ").width;
      var numW = lsubW(ctx, "observed") + mw + lsubW(ctx, "emitted");
      var denW = lsubW(ctx, "emitted");
      var w = Math.max(numW, denW);
      var nx = x + (w - numW) / 2, ny = y - 6;
      nx += lsub(ctx, nx, ny, "observed"); ctx.font = "14px system-ui"; ctx.fillText(" − ", nx, ny); nx += mw;
      lsub(ctx, nx, ny, "emitted");
      var dx = x + (w - denW) / 2; lsub(ctx, dx, y + 14, "emitted");
      ctx.strokeStyle = "#cfd8ee"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y + 1); ctx.lineTo(x + w, y + 1); ctx.stroke();
      x += w + 12; ctx.textAlign = "left";
      ctx.fillStyle = "#eef2fb"; ctx.font = "700 17px system-ui"; ctx.fillText("=  " + P.z.toFixed(2), x, y);
      ctx.fillStyle = "#7d8cb0"; ctx.font = "12px system-ui";
      ctx.fillText("recession  v ≈ cz = " + Math.round(2.998e5 * P.z).toLocaleString() + " km/s", 28, 75);
    }

    function visibleBar(ctx) {
      var y = 84, h = 20, x0 = xFor(380), x1 = xFor(700);
      for (var x = x0; x <= x1; x++) {
        var l = 380 + (x - x0) / (x1 - x0) * (700 - 380), rgb = visRGB(l);
        var bf = Math.min(1, fluxObs(l) * 1.3);
        ctx.fillStyle = "rgb(" + Math.round(rgb[0] * bf) + "," + Math.round(rgb[1] * bf) + "," + Math.round(rgb[2] * bf) + ")";
        ctx.fillRect(x, y, 1, h);
      }
      ctx.strokeStyle = "#3a4a72"; ctx.lineWidth = 1; ctx.strokeRect(x0, y, x1 - x0, h);
      ctx.fillStyle = "#cfd8ee"; ctx.font = "700 12px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText("Visible Spectrum", (x0 + x1) / 2, y - 6);
    }

    // brightness-through-filter bar chart, upper-right (only with filter details)
    function barChart(ctx) {
      var x0 = 590, base = 100, hMax = 60, bw = 22, gap = 12;
      ctx.strokeStyle = "#3a4a72"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0 - 8, base + 0.5); ctx.lineTo(x0 + 4 * (bw + gap) - gap + 6, base + 0.5); ctx.stroke();
      FILT.forEach(function (f, i) {
        var bx = x0 + i * (bw + gap), bh = Math.max(2, Math.min(1.05, bandInt(f, P.z) / REF) * hMax);
        ctx.fillStyle = f.col; ctx.fillRect(bx, base - bh, bw, bh);
        ctx.fillStyle = "#cfd8ee"; ctx.font = "700 13px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText(f.k, bx + bw / 2, base + 16);
      });
      ctx.fillStyle = "#7d8cb0"; ctx.font = "11px system-ui"; ctx.textAlign = "center";
      ctx.fillText("brightness", x0 + 2 * (bw + gap) - gap / 2, base - hMax - 6);
    }

    function plotFrame(ctx) {
      ctx.fillStyle = "#0a1124"; ctx.fillRect(PLOT.x, PLOT.y, PLOT.w, PLOT.h);
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.strokeRect(PLOT.x, PLOT.y, PLOT.w, PLOT.h);
      ctx.font = "11px system-ui"; ctx.textBaseline = "top";
      for (var l = 300; l <= 900; l += 100) {
        var x = xFor(l); ctx.strokeStyle = "#1b2748"; ctx.beginPath(); ctx.moveTo(x, PLOT.y); ctx.lineTo(x, PLOT.y + PLOT.h); ctx.stroke();
        ctx.fillStyle = "#7d8cb0"; ctx.textAlign = "center"; ctx.fillText(l + " nm", x, PLOT.y + PLOT.h + 6);
      }
      ctx.fillStyle = "#9fb0d0"; ctx.font = "12px system-ui"; ctx.textAlign = "center";
      ctx.fillText("Wavelength  →", PLOT.x + PLOT.w / 2, PLOT.y + PLOT.h + 24);
      ctx.save(); ctx.translate(PLOT.x - 22, PLOT.y + PLOT.h / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText("Flux  →", 0, 0); ctx.restore();
    }

    function filterBands(ctx) {
      ctx.save();
      ctx.beginPath(); ctx.rect(PLOT.x, PLOT.y, PLOT.w, PLOT.h); ctx.clip();
      FILT.forEach(function (f) {
        var sig = f.fwhm / 2.355;
        ctx.beginPath(); ctx.moveTo(xFor(f.c - 3 * sig), PLOT.y + PLOT.h);
        for (var l = f.c - 3 * sig; l <= f.c + 3 * sig; l += 1) {
          var t = Math.exp(-Math.pow((l - f.c) / sig, 2) / 2);
          ctx.lineTo(xFor(l), PLOT.y + PLOT.h - t * fluxObs(l) * PLOT.h);
        }
        ctx.lineTo(xFor(f.c + 3 * sig), PLOT.y + PLOT.h); ctx.closePath();
        ctx.fillStyle = hexA(f.col, 0.5); ctx.fill();
      });
      ctx.restore();
    }

    function spectrum(ctx) {
      ctx.save();
      ctx.beginPath(); ctx.rect(PLOT.x, PLOT.y, PLOT.w, PLOT.h); ctx.clip();
      ctx.strokeStyle = "#f2f6ff"; ctx.lineWidth = 1.4; ctx.beginPath();
      for (var x = PLOT.x; x <= PLOT.x + PLOT.w; x++) {
        var l = LAM0 + (x - PLOT.x) / PLOT.w * (LAM1 - LAM0), y = yFor(fluxObs(l));
        if (x === PLOT.x) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke(); ctx.restore();
    }

    function panel(ctx, r) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
    function hexA(hex, a) {
      var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
    }
    function visRGB(l) {
      var r = 0, g = 0, b = 0;
      if (l < 440) { r = -(l - 440) / 60; b = 1; }
      else if (l < 490) { g = (l - 440) / 50; b = 1; }
      else if (l < 510) { g = 1; b = -(l - 510) / 20; }
      else if (l < 580) { r = (l - 510) / 70; g = 1; }
      else if (l < 645) { r = 1; g = -(l - 645) / 65; }
      else { r = 1; }
      var f = l < 420 ? 0.3 + 0.7 * (l - 380) / 40 : l > 700 ? 0.3 + 0.7 * (750 - l) / 50 : 1;
      f = Math.max(0.2, Math.min(1, f));
      return [Math.round(255 * Math.pow(r * f, 0.8)), Math.round(255 * Math.pow(g * f, 0.8)), Math.round(255 * Math.pow(b * f, 0.8))];
    }

    upd();
  }
});
