/* EM Spectrum Module ---------------------------------------------------------
   Faithful rebuild of the ClassAction "EM Spectrum Module" (emspectrum.swf):
     • a logarithmic spectrum bar from gamma rays to radio waves, with a wavelength
       (m) scale above and a frequency (Hz) scale below, and a draggable cursor,
     • the visible band drawn as a true rainbow; a "blackbody colour" swatch for the
       star whose thermal peak sits at the cursor (Wien's law),
     • a Spectrum Screen with λ, f = c/λ and E = h·f, the band name, and a panel of
       band facts (scale of the wavelength, the instruments used, what we observe).
   c = 2.998×10⁸ m/s, h = 6.626×10⁻³⁴ J·s, λ_peak = 2.898×10⁻³/T.                  */
Sim.create({
  id: "em-spectrum",
  width: 760, height: 470,
  strings: {
    en: {
      "em.band": "Jump to band", "em.tune": "Tuning", "em.wl": "wavelength (log₁₀ m)",
      "em.screen": "Spectrum Screen", "em.bb": "Blackbody Colour",
      "em.size": "Scale of this wavelength", "em.inst": "Detected with", "em.src": "We observe",
      "em.gamma": "Gamma rays", "em.xray": "X-rays", "em.uv": "Ultraviolet", "em.vis": "Visible",
      "em.ir": "Infrared", "em.micro": "Microwaves", "em.radio": "Radio waves",
      "em.peakT": "blackbody peaks here at"
    },
    id: {
      "em.band": "Lompat ke pita", "em.tune": "Penyetelan", "em.wl": "panjang gelombang (log₁₀ m)",
      "em.screen": "Layar Spektrum", "em.bb": "Warna Benda Hitam",
      "em.size": "Skala panjang gelombang ini", "em.inst": "Dideteksi dengan", "em.src": "Kita amati",
      "em.gamma": "Sinar gamma", "em.xray": "Sinar-X", "em.uv": "Ultraviolet", "em.vis": "Cahaya tampak",
      "em.ir": "Inframerah", "em.micro": "Gelombang mikro", "em.radio": "Gelombang radio",
      "em.peakT": "benda hitam memuncak di sini pada"
    }
  },
  about: {
    en: "<p>Visible light is a tiny slice of the <strong>electromagnetic spectrum</strong> — the same kind of wave stretches from gamma rays a thousandth the width of an atom out to radio waves longer than a mountain. They differ only in <strong>wavelength</strong> (and so frequency and energy).</p>" +
        "<p>Drag the cursor across the bar. Frequency is <em>f = c / λ</em> and the photon energy is <em>E = h·f</em>, so short waves on the left are high-energy and long waves on the right are low-energy. Only the narrow rainbow in the middle is light your eyes can see.</p>" +
        "<p>The <strong>blackbody swatch</strong> shows the colour of a hot object whose thermal glow peaks at the cursor — by Wien's law, hotter means bluer and shorter. Every band needs its own kind of telescope, which is why astronomers observe the whole spectrum.</p>",
    id: "<p>Cahaya tampak hanyalah irisan kecil <strong>spektrum elektromagnetik</strong> — gelombang serupa terbentang dari sinar gamma seperseribu lebar atom hingga gelombang radio lebih panjang dari gunung. Mereka hanya berbeda <strong>panjang gelombang</strong> (dan karenanya frekuensi serta energi).</p>" +
        "<p>Seret kursor melintasi pita. Frekuensi adalah <em>f = c / λ</em> dan energi foton <em>E = h·f</em>, jadi gelombang pendek di kiri berenergi tinggi dan gelombang panjang di kanan berenergi rendah. Hanya pelangi sempit di tengah yang dapat dilihat mata.</p>" +
        "<p><strong>Petak benda hitam</strong> menampilkan warna benda panas yang puncak pancarannya di kursor — menurut hukum Wien, makin panas makin biru dan pendek. Setiap pita butuh teleskopnya sendiri, itulah mengapa astronom mengamati seluruh spektrum.</p>"
  },
  build: function (S) {
    var C = 2.998e8, H = 6.626e-34, WIEN = 2.898e-3;
    var LOGMIN = -16, LOGMAX = 4;                          // log10(λ/m) range of the bar
    var logL = 0;                                          // current log10(wavelength); 0 → 1 m (radio)

    // band boundaries by wavelength (m), ordered short→long
    var BANDS = [
      { key: "em.gamma", max: 1e-11, col: [150, 90, 220], size: "smaller than an atomic nucleus", inst: "space γ-ray telescopes (Fermi, INTEGRAL)", src: "supernovae, pulsars, black-hole jets" },
      { key: "em.xray", max: 1e-8, col: [90, 130, 235], size: "atoms (~0.1–10 nm)", inst: "X-ray observatories (Chandra, XMM)", src: "million-degree gas, neutron stars, AGN" },
      { key: "em.uv", max: 4e-7, col: [165, 90, 230], size: "molecules / viruses (~10–400 nm)", inst: "UV space telescopes (Hubble, GALEX)", src: "hot young stars, the solar corona" },
      { key: "em.vis", max: 7e-7, col: null, size: "bacteria & cells (0.4–0.7 µm)", inst: "optical telescopes — and your eye", src: "stars, nebulae, reflected sunlight" },
      { key: "em.ir", max: 1e-3, col: [220, 110, 70], size: "a pinhead to dust grains (0.7 µm–1 mm)", inst: "infrared telescopes (JWST, Spitzer)", src: "warm dust, forming stars, exoplanets" },
      { key: "em.micro", max: 1e-1, col: [170, 80, 60], size: "insects to a hand (1 mm–10 cm)", inst: "microwave dishes (Planck, WMAP)", src: "the cosmic microwave background" },
      { key: "em.radio", max: 1e9, col: [150, 60, 60], size: "buildings to mountains (> 10 cm)", inst: "radio telescopes (VLA, ALMA)", src: "pulsars, galaxies, neutral hydrogen" }
    ];
    function bandFor(lam) { for (var i = 0; i < BANDS.length; i++) if (lam < BANDS[i].max) return BANDS[i]; return BANDS[BANDS.length - 1]; }
    function lambda() { return Math.pow(10, logL); }
    function freq() { return C / lambda(); }
    function energy() { return H * freq(); }
    function peakT() { return WIEN / lambda(); }

    // colour of the spectrum bar at a given wavelength (blue gradient, rainbow in the visible — like the SWF)
    function barColor(lam) {
      if (lam >= 4e-7 && lam <= 7e-7) return visibleRGB(lam * 1e9);        // true rainbow in the visible window
      var f = (Math.log10(lam) - LOGMIN) / (LOGMAX - LOGMIN);
      return "rgb(" + Math.round(34 + 30 * f) + "," + Math.round(74 + 70 * f) + "," + Math.round(150 + 48 * f) + ")";
    }
    // atmospheric opacity 0..1 (white "mountains" = blocked; low = a window onto the sky)
    function atmOpacity(lg) {
      if (lg < -6.5) return 0;                              // short λ drawn as the plain blue bar (as in the SWF)
      if (lg >= -6.5 && lg < -6.0) return 0.05;             // optical window
      if (lg >= -2.0 && lg <= 1.0) return 0.05;             // radio window
      if (lg > 1.0) return Math.min(0.92, 0.05 + (lg - 1.0) * 0.55);   // long-wave ionospheric cutoff
      var j = 0.30 * Math.sin(lg * 7.0) + 0.20 * Math.sin(lg * 17.0 + 1.0) + 0.15 * Math.sin(lg * 31.0);
      return Math.max(0.18, Math.min(0.97, 0.62 + j));      // jagged molecular absorption through the IR
    }

    /* ---- controls ---- */
    S.group("em.band");
    [["em.gamma", -12], ["em.xray", -9.3], ["em.uv", -7], ["em.vis", Math.log10(5.5e-7)], ["em.ir", -4.5], ["em.micro", -1.7], ["em.radio", 1]].forEach(function (b) {
      S.button({ labelKey: b[0], on: function () { logL = b[1]; wlC.set(logL); } });
    });
    S.group("em.tune");
    var wlC = S.slider({ labelKey: "em.wl", min: LOGMIN, max: LOGMAX, step: 0.01, value: logL,
      format: function (v) { return sci(Math.pow(10, v)) + " m"; }, on: function (v) { logL = v; upd(); } });

    function upd() { S.requestDraw(); }
    S.refreshers.push(function () { S.requestDraw(); });

    /* ===================================================================== */
    var BAR = { x: 12, y: 28, w: 736, h: 176 };
    var SCR = { x: 12, y: 216, w: 470, h: 132 };
    var BB = { x: 494, y: 216, w: 254, h: 132 };
    var INFO = { x: 12, y: 360, w: 736, h: 98 };

    var barL = BAR.x + 54, barR = BAR.x + BAR.w - 18, barT = BAR.y + 64, barB = BAR.y + 116;
    function xToLog(x) { return LOGMIN + (x - barL) / (barR - barL) * (LOGMAX - LOGMIN); }
    function logToX(lg) { return barL + (lg - LOGMIN) / (LOGMAX - LOGMIN) * (barR - barL); }

    /* drag the cursor along the bar */
    var dragging = false;
    function localXY(ev) { var r = S.canvas.getBoundingClientRect(); return { x: (ev.clientX - r.left) * (S.W / r.width), y: (ev.clientY - r.top) * (S.H / r.height) }; }
    S.canvas.addEventListener("pointerdown", function (ev) { var m = localXY(ev); if (m.x >= barL - 16 && m.x <= barR + 16 && m.y >= barT - 24 && m.y <= barB + 24) { dragging = true; setFromX(m.x); S.canvas.setPointerCapture(ev.pointerId); } });
    S.canvas.addEventListener("pointermove", function (ev) { if (!dragging) return; setFromX(localXY(ev).x); });
    S.canvas.addEventListener("pointerup", function () { dragging = false; });
    function setFromX(x) { logL = Math.max(LOGMIN, Math.min(LOGMAX, xToLog(x))); wlC.set(logL); }

    S.onDraw(function () { var ctx = S.ctx; S.clear(); drawBar(ctx); drawScreen(ctx); drawBB(ctx); drawInfo(ctx); });
    upd();

    function drawBar(ctx) {
      panel(ctx, BAR, "");
      // spectrum strip — blue gradient with a rainbow in the visible window (per-pixel column)
      for (var x = barL; x <= barR; x++) { var lam = Math.pow(10, xToLog(x)); ctx.strokeStyle = barColor(lam); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, barT); ctx.lineTo(x, barB); ctx.stroke(); }
      // atmospheric-opacity overlay — white "mountains" where the atmosphere blocks light; gaps = windows
      for (var xo = barL; xo <= barR; xo++) { var op = atmOpacity(xToLog(xo)); if (op <= 0.03) continue; ctx.strokeStyle = "rgba(244,247,255,0.82)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xo, barB - 1); ctx.lineTo(xo, barB - 1 - op * (barB - barT - 2)); ctx.stroke(); }
      ctx.fillStyle = "rgba(15,22,40,0.7)"; ctx.font = "italic 8px system-ui"; ctx.textAlign = "right"; ctx.fillText("atmospheric opacity", barR - 4, barB - 4);
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.strokeRect(barL, barT, barR - barL, barB - barT);

      // wavelength scale (top)
      ctx.fillStyle = "#9fabce"; ctx.font = "9px system-ui"; ctx.textAlign = "center";
      ctx.fillText("WAVELENGTH (m)", (barL + barR) / 2, BAR.y + 16);
      for (var e = LOGMIN; e <= LOGMAX; e += 2) { var X = logToX(e); ctx.strokeStyle = "#2c3a66"; ctx.beginPath(); ctx.moveTo(X, barT - 6); ctx.lineTo(X, barT); ctx.stroke(); ctx.fillStyle = "#8595bd"; ctx.fillText("10" + sup(e), X, barT - 9); }
      // frequency scale (bottom): f = c/λ — labelled in red, like the SWF
      ctx.fillStyle = "#e8645a"; ctx.fillText("FREQUENCY (Hz)", (barL + barR) / 2, BAR.y + BAR.h - 6);
      for (var e2 = LOGMIN; e2 <= LOGMAX; e2 += 2) { var X2 = logToX(e2), fe = Math.round(Math.log10(C) - e2); ctx.strokeStyle = "#7a3631"; ctx.beginPath(); ctx.moveTo(X2, barB); ctx.lineTo(X2, barB + 6); ctx.stroke(); ctx.fillStyle = "#e8645a"; ctx.fillText("10" + sup(fe), X2, barB + 18); }

      // cursor — blue arrowheads top & bottom (as in the SWF) + thin guide line
      var cxp = logToX(logL);
      ctx.strokeStyle = "rgba(10,16,30,0.55)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cxp, barT); ctx.lineTo(cxp, barB); ctx.stroke();
      ctx.fillStyle = "#4a86ff";
      ctx.beginPath(); ctx.moveTo(cxp, barT + 2); ctx.lineTo(cxp - 6, barT - 10); ctx.lineTo(cxp + 6, barT - 10); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cxp, barB - 2); ctx.lineTo(cxp - 6, barB + 10); ctx.lineTo(cxp + 6, barB + 10); ctx.closePath(); ctx.fill();
    }

    function drawScreen(ctx) {
      panel(ctx, SCR, I18N.t("em.screen"));
      var b = bandFor(lambda());
      ctx.textAlign = "left"; ctx.font = "13px ui-monospace, monospace";
      ctx.fillStyle = "#69db7c";
      ctx.fillText("λ  = " + sci(lambda()) + " m", SCR.x + 18, SCR.y + 46);
      ctx.fillText("f  = " + sci(freq()) + " Hz", SCR.x + 18, SCR.y + 72);
      ctx.fillText("E = h·f = " + sci(energy()) + " J", SCR.x + 18, SCR.y + 98);
      ctx.font = "700 15px system-ui"; ctx.fillStyle = "#cbd6f0"; ctx.textAlign = "right";
      ctx.fillText(I18N.t(b.key), SCR.x + SCR.w - 18, SCR.y + 30);
      ctx.font = "11px system-ui"; ctx.fillStyle = "#9fabce";
      ctx.fillText("E = " + (energy() / 1.602e-19 > 0.01 ? (energy() / 1.602e-19).toPrecision(3) + " eV" : sci(energy() / 1.602e-19) + " eV"), SCR.x + SCR.w - 18, SCR.y + SCR.h - 14);
    }

    function drawBB(ctx) {
      panel(ctx, BB, I18N.t("em.bb"));
      var T = peakT(), rgb = tempToRGB(Math.max(1, T));
      var cx = BB.x + 54, cy = BB.y + 78, r = 30;
      var g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
      g.addColorStop(0, "rgb(" + rgb.map(function (v) { return Math.min(255, v + 30); }).map(Math.round).join(",") + ")");
      g.addColorStop(1, "rgb(" + rgb.map(Math.round).join(",") + ")");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#9fabce"; ctx.font = "11px system-ui"; ctx.textAlign = "left";
      ctx.fillText(I18N.t("em.peakT"), BB.x + 100, BB.y + 64);
      ctx.fillStyle = "#cbd6f0"; ctx.font = "700 16px system-ui";
      ctx.fillText(T >= 1e6 ? sci(T) + " K" : T >= 100 ? Math.round(T) + " K" : T.toFixed(2) + " K", BB.x + 100, BB.y + 86);
    }

    function drawInfo(ctx) {
      panel(ctx, INFO, "");
      var b = bandFor(lambda()), cw = (INFO.w - 28) / 3;
      [["em.size", b.size], ["em.inst", b.inst], ["em.src", b.src]].forEach(function (row, i) {
        var x = INFO.x + 14 + i * cw;
        ctx.fillStyle = "#6ea8fe"; ctx.font = "700 10px system-ui"; ctx.textAlign = "left"; ctx.fillText(I18N.t(row[0]).toUpperCase(), x, INFO.y + 26);
        ctx.fillStyle = "#cbd6f0"; ctx.font = "12px system-ui"; wrap(ctx, row[1], x, INFO.y + 46, cw - 12, 15);
        if (i < 2) { ctx.strokeStyle = "#1c2747"; ctx.beginPath(); ctx.moveTo(x + cw - 6, INFO.y + 14); ctx.lineTo(x + cw - 6, INFO.y + INFO.h - 12); ctx.stroke(); }
      });
    }

    /* ---- helpers ---- */
    function sci(v) { if (v === 0) return "0"; var e = Math.floor(Math.log10(Math.abs(v))), m = v / Math.pow(10, e); return m.toFixed(3) + "×10" + sup(e); }
    function sup(e) { var m = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" }; return String(e).split("").map(function (c) { return m[c] || c; }).join(""); }
    function wrap(ctx, text, x, y, maxw, lh) { var words = text.split(" "), line = "", yy = y; for (var i = 0; i < words.length; i++) { var test = line + words[i] + " "; if (ctx.measureText(test).width > maxw && line) { ctx.fillText(line, x, yy); line = words[i] + " "; yy += lh; } else line = test; } ctx.fillText(line, x, yy); }
    function panel(ctx, r, title) {
      roundRect(ctx, r.x, r.y, r.w, r.h, 12); ctx.fillStyle = "#0e1530"; ctx.fill();
      ctx.strokeStyle = "#2c3a66"; ctx.lineWidth = 1; ctx.stroke();
      if (title) { ctx.fillStyle = "#6ea8fe"; ctx.font = "700 12px system-ui"; ctx.textAlign = "left"; ctx.fillText(title.toUpperCase(), r.x + 14, r.y + 18); }
    }
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }
});

/* approximate visible-light colour for a wavelength in nm (380–750) */
function visibleRGB(nm) {
  var r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else if (nm <= 750) { r = 1; }
  var f = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (750 - nm) / 50 : 1;
  return "rgb(" + Math.round(255 * r * f) + "," + Math.round(255 * g * f) + "," + Math.round(255 * b * f) + ")";
}

/* blackbody colour (Tanner Helland approximation), T in K */
function tempToRGB(T) {
  var t = T / 100, r, g, b;
  if (t <= 66) r = 255; else r = clamp(329.7 * Math.pow(t - 60, -0.1332));
  if (t <= 66) g = clamp(99.47 * Math.log(t) - 161.12); else g = clamp(288.12 * Math.pow(t - 60, -0.0755));
  if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = clamp(138.52 * Math.log(t - 10) - 305.04);
  return [r, g, b];
  function clamp(x) { return Math.max(0, Math.min(255, x)); }
}
