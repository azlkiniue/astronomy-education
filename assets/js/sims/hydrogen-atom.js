/* Hydrogen Atom — Energy Levels & Spectral Lines --------------------------- */
Sim.create({
  id: "hydrogen-atom",
  width: 760, height: 470,
  strings: {
    en: {
      "ha.trans": "Transition", "ha.from": "From level n", "ha.to": "To level n",
      "ha.mode": "Process", "ha.emit": "Emission (n falls)", "ha.absorb": "Absorption (n rises)",
      "ha.fire": "Fire photon",
      "ha.dE": "Photon energy", "ha.wl": "Wavelength", "ha.series": "Series", "ha.band": "Band"
    },
    id: {
      "ha.trans": "Transisi", "ha.from": "Dari tingkat n", "ha.to": "Ke tingkat n",
      "ha.mode": "Proses", "ha.emit": "Emisi (n turun)", "ha.absorb": "Absorpsi (n naik)",
      "ha.fire": "Tembak foton",
      "ha.dE": "Energi foton", "ha.wl": "Panjang gelombang", "ha.series": "Deret", "ha.band": "Pita"
    }
  },
  about: {
    en: "<p>An electron in a hydrogen atom can only sit on certain energy <strong>levels</strong>, " +
        "E<sub>n</sub> = −13.6 eV / n². It jumps between them by absorbing or emitting a single photon whose energy " +
        "exactly equals the gap, ΔE = 13.6 eV ·(1/n<sub>low</sub>² − 1/n<sub>high</sub>²).</p>" +
        "<p>The photon's wavelength is λ = 1240 eV·nm / ΔE. Jumps that land on n = 1 (the <strong>Lyman</strong> series) are ultraviolet; " +
        "jumps to n = 2 (the <strong>Balmer</strong> series) are the visible lines we see in stars; jumps to n = 3 (<strong>Paschen</strong>) are infrared.</p>",
    id: "<p>Elektron dalam atom hidrogen hanya bisa menempati <strong>tingkat</strong> energi tertentu, " +
        "E<sub>n</sub> = −13,6 eV / n². Ia meloncat di antaranya dengan menyerap atau memancarkan satu foton yang energinya " +
        "tepat sama dengan selisihnya, ΔE = 13,6 eV ·(1/n<sub>bawah</sub>² − 1/n<sub>atas</sub>²).</p>" +
        "<p>Panjang gelombang foton λ = 1240 eV·nm / ΔE. Loncatan ke n = 1 (deret <strong>Lyman</strong>) bersifat ultraviolet; " +
        "ke n = 2 (deret <strong>Balmer</strong>) adalah garis kasatmata pada bintang; ke n = 3 (<strong>Paschen</strong>) inframerah.</p>"
  },
  build: function (S) {
    var nHi = 3, nLo = 2, mode = "emit";
    var photon = null;   // {t, color, wl}
    var loop = S.loop(function (dt) {
      if (photon) { photon.t += dt * 1.4; if (photon.t > 1) photon = null; }
    });

    S.group("ha.trans");
    var hiCtl = S.slider({ labelKey: "ha.from", min: 2, max: 6, value: nHi, step: 1, on: function (v) { nHi = v; if (nLo >= nHi) loCtl.set(nHi - 1); upd(); } });
    var loCtl = S.slider({ labelKey: "ha.to", min: 1, max: 5, value: nLo, step: 1, on: function (v) { nLo = v; if (nHi <= nLo) hiCtl.set(nLo + 1); upd(); } });
    S.select({ labelKey: "ha.mode", value: mode, options: [{ v: "emit", labelKey: "ha.emit" }, { v: "absorb", labelKey: "ha.absorb" }], on: function (v) { mode = v; upd(); } });
    S.button({ labelKey: "ha.fire", primary: true, on: function () {
      var w = wavelength(); photon = { t: 0, color: wlColor(w), wl: w }; if (!loop.playing) loop.play();
    } });

    var outE = S.readout({ labelKey: "ha.dE" });
    var outW = S.readout({ labelKey: "ha.wl" });
    var outS = S.readout({ labelKey: "ha.series" });
    var outB = S.readout({ labelKey: "ha.band" });

    function dE() { return 13.6 * (1 / (nLo * nLo) - 1 / (nHi * nHi)); }   // eV (positive)
    function wavelength() { return 1240 / dE(); }                          // nm
    function seriesName(n) { return ["Lyman", "Balmer", "Paschen", "Brackett", "Pfund"][n - 1] || ("n=" + n); }
    function band(w) {
      if (w < 380) return "UV"; if (w > 750) return "IR";
      return I18N.getLang() === "id" ? "Kasatmata" : "Visible";
    }
    function upd() {
      var w = wavelength();
      outE(dE().toFixed(2) + " eV");
      outW(w.toFixed(0) + " nm");
      outS(seriesName(nLo));
      outB(band(w));
      S.requestDraw();
    }
    window.addEventListener("langchange", upd);

    S.onDraw(function () {
      var ctx = S.ctx, W = S.W, H = S.H;
      S.clear();

      // ---- left: Bohr orbits ----
      var ax = 175, ay = 215, R0 = 16;
      ctx.fillStyle = "#ff6b6b"; ctx.beginPath(); ctx.arc(ax, ay, 7, 0, 2 * Math.PI); ctx.fill();   // nucleus
      for (var n = 1; n <= 6; n++) {
        ctx.strokeStyle = (n === nHi || n === nLo) ? "#6ea8fe" : "#243056";
        ctx.lineWidth = (n === nHi || n === nLo) ? 1.6 : 1;
        ctx.beginPath(); ctx.arc(ax, ay, R0 + n * 24, 0, 2 * Math.PI); ctx.stroke();
      }
      // electron on current upper (emit) / lower (absorb) level start
      var nStart = mode === "emit" ? nHi : nLo;
      var er = R0 + nStart * 24;
      ctx.fillStyle = "#cfe0ff"; ctx.beginPath(); ctx.arc(ax + er, ay, 6, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#9fabce"; ctx.font = "12px system-ui"; ctx.textAlign = "center";
      ctx.fillText(I18N.getLang() === "id" ? "Model Bohr" : "Bohr model", ax, H - 16);

      // ---- right: energy-level ladder ----
      var lx0 = 380, lx1 = 600;
      var ytop = 40, ybot = 360;
      // sqrt scale spreads the high-n levels that would otherwise pile up near 0 eV
      function yOf(E) { return ytop + Math.sqrt(-E / 13.6) * (ybot - ytop); }
      ctx.textAlign = "right"; ctx.font = "11px system-ui";
      for (var m = 1; m <= 6; m++) {
        var Em = -13.6 / (m * m), yy = yOf(Em);
        ctx.strokeStyle = (m === nHi || m === nLo) ? "#6ea8fe" : "#2c3a66";
        ctx.beginPath(); ctx.moveTo(lx0, yy); ctx.lineTo(lx1, yy); ctx.stroke();
        ctx.fillStyle = "#9fabce"; ctx.fillText("n=" + m, lx0 - 6, yy + 4);
        if (m <= 4) { ctx.textAlign = "left"; ctx.fillText(Em.toFixed(1) + " eV", lx1 + 6, yy + 4); ctx.textAlign = "right"; }
      }
      // transition arrow
      var yH = yOf(-13.6 / (nHi * nHi)), yL = yOf(-13.6 / (nLo * nLo)), ax2 = (lx0 + lx1) / 2;
      var col = wlColor(wavelength());
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.5;
      var y1 = mode === "emit" ? yH : yL, y2 = mode === "emit" ? yL : yH;
      ctx.beginPath(); ctx.moveTo(ax2, y1); ctx.lineTo(ax2, y2); ctx.stroke();
      var dir = y2 > y1 ? 1 : -1;
      ctx.beginPath(); ctx.moveTo(ax2, y2); ctx.lineTo(ax2 - 5, y2 - 9 * dir); ctx.lineTo(ax2 + 5, y2 - 9 * dir); ctx.fill();

      // ---- spectrum bar with the line marked ----
      var sx0 = 70, sx1 = W - 30, sy = 410, sh = 30;
      for (var px = sx0; px <= sx1; px++) {
        var w = 380 + (px - sx0) / (sx1 - sx0) * (750 - 380);
        var c = visRGB(w); ctx.fillStyle = "rgb(" + c.join(",") + ")"; ctx.fillRect(px, sy, 1, sh);
      }
      ctx.strokeStyle = "#2c3a66"; ctx.strokeRect(sx0, sy, sx1 - sx0, sh);
      var wl = wavelength();
      if (wl >= 380 && wl <= 750) {
        var mxp = sx0 + (wl - 380) / (750 - 380) * (sx1 - sx0);
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mxp, sy - 6); ctx.lineTo(mxp, sy + sh + 6); ctx.stroke();
      } else {
        ctx.fillStyle = "#9fabce"; ctx.textAlign = "center"; ctx.font = "12px system-ui";
        ctx.fillText(wl < 380 ? "← UV (" + wl.toFixed(0) + " nm)" : "IR (" + wl.toFixed(0) + " nm) →", (sx0 + sx1) / 2, sy - 10);
      }

      // ---- photon animation (emit travels right, absorb travels in) ----
      if (photon) {
        var travel = mode === "emit" ? (ax + photon.t * 300) : (W - photon.t * 300);
        ctx.strokeStyle = photon.color; ctx.lineWidth = 2;
        ctx.beginPath();
        for (var i = 0; i < 40; i++) {
          var xx = travel + i * 1.2, yy2 = 150 + Math.sin(i * 0.6 + photon.t * 10) * 7;
          i === 0 ? ctx.moveTo(xx, yy2) : ctx.lineTo(xx, yy2);
        }
        ctx.stroke();
      }
    });

    upd();

    function wlColor(w) { if (w < 380) return "#b06bff"; if (w > 750) return "#ff5a5a"; var c = visRGB(w); return "rgb(" + c.join(",") + ")"; }
    function visRGB(nm) {
      var r = 0, g = 0, b = 0;
      if (nm < 440) { r = -(nm - 440) / 60; b = 1; }
      else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
      else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
      else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
      else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
      else { r = 1; }
      return [Math.round(255 * r), Math.round(255 * g), Math.round(255 * b)];
    }
  }
});
